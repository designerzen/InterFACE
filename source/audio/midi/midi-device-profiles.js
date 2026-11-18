/**
 * Recognise connected MIDI ports using the midi-devices hardware catalogue
 * (https://github.com/designerzen/midi-devices), built into
 * static/midi-devices/ by actions/midi-devices.mjs.
 *
 * Web MIDI exposes ports, not physical USB identities, so a port is matched
 * by its ID, then its port name. People can pick a different profile for a
 * port and that choice is remembered per port name.
 */
const CATALOGUE_URL = 'midi-devices/catalogue.json'
const STORAGE_KEY = 'photosynth-midi-device-profiles'
const RETRY_AFTER = 30000

export const PROFILE_AUTOMATIC = 'auto'
export const PROFILE_NONE = 'none'

let catalogue = null
let pending = null
let failedAt = -Infinity
const listeners = new Set()

const normalise = value => String(value ?? '').trim().toLowerCase()
const slug = value => normalise(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const midiDeviceAssetURL = file => file ? new URL(`midi-devices/${file}`, document.baseURI).href : null

export const getMIDIDeviceCatalogue = () => catalogue

export const onMIDIDeviceCatalogueLoaded = listener => {
	listeners.add(listener)
	return () => listeners.delete(listener)
}

export const loadMIDIDeviceCatalogue = () => {
	if (catalogue) return Promise.resolve(catalogue)
	if (pending) return pending
	if (performance.now() - failedAt < RETRY_AFTER) return Promise.resolve(null)
	pending = fetch(new URL(CATALOGUE_URL, document.baseURI).href)
		.then(response => response.ok ? response.json() : Promise.reject(new Error(`${response.status} ${response.url}`)))
		.then(data => {
			catalogue = { ...data, byId: new Map(data.devices.map(device => [device.id, device])) }
			listeners.forEach(listener => listener(catalogue))
			return catalogue
		})
		.catch(error => {
			failedAt = performance.now()
			console.warn('[MIDI] Device catalogue unavailable', error)
			return null
		})
		.finally(() => { pending = null })
	return pending
}

let choices = null
const readChoices = () => {
	if (choices) return choices
	try { choices = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {} }
	catch { choices = {} }
	return choices
}

// Chrome derives port IDs per session and USB socket, so remember choices by name.
const choiceKey = (port, direction) => `${direction}:${normalise(port.manufacturer)}:${normalise(port.name)}`

export const getMIDIDeviceProfileChoice = (port, direction) => readChoices()[choiceKey(port, direction)] ?? PROFILE_AUTOMATIC

export const setMIDIDeviceProfileChoice = (port, direction, profileId) => {
	readChoices()
	if (profileId === PROFILE_AUTOMATIC) delete choices[choiceKey(port, direction)]
	else choices[choiceKey(port, direction)] = profileId
	try { localStorage.setItem(STORAGE_KEY, JSON.stringify(choices)) }
	catch (error) { console.warn('[MIDI] Could not save device profile choice', error) }
}

/**
 * Find the hardware profile for a port
 * @param {{id?:String, name?:String, manufacturer?:String}} port
 * @param {String} direction input or output
 * @returns {{profile:Object|null, matchedBy:String}} matchedBy is one of
 * 	choice, id, name, slug, none (chosen as "not listed") or unmatched
 */
export const findMIDIDeviceProfile = (port, direction) => {
	const choice = getMIDIDeviceProfileChoice(port, direction)
	if (choice === PROFILE_NONE) return { profile:null, matchedBy:'none' }
	const devices = catalogue?.devices ?? []
	const chosen = catalogue?.byId.get(choice)
	if (chosen) return { profile:chosen, matchedBy:'choice' }
	const id = normalise(port.id)
	// Windows numbers repeat devices: "2- MPK mini 3"
	const name = normalise(port.name).replace(/^\d+-\s*/, '')
	const byId = id && devices.find(device => device.ids.some(alias => normalise(alias) === id))
	if (byId) return { profile:byId, matchedBy:'id' }
	const byName = name && devices.find(device => device.portNames.some(alias => normalise(alias) === name))
	if (byName) return { profile:byName, matchedBy:'name' }
	// Same fallback audiobus uses: a port named after the profile ID.
	const candidates = [port.id, port.name, [port.manufacturer, port.name].filter(Boolean).join(' ')].map(slug).filter(Boolean)
	const bySlug = devices.find(device => [device.id, ...device.ids, ...device.portNames].some(alias => candidates.includes(slug(alias))))
	return bySlug ? { profile:bySlug, matchedBy:'slug' } : { profile:null, matchedBy:'unmatched' }
}

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
const noteName = number => `${NOTE_NAMES[number % 12]}${Math.floor(number / 12) - 1} (${number})`

/**
 * Describe the MIDI message a hardware control sends
 * @param {{type?:String, number?:Number, channel?:Number}|null} message
 * @returns {String}
 */
export const describeMIDIControlMessage = message => {
	if (!message?.type) return 'Assignable'
	const channel = message.channel ? ` · ch ${message.channel}` : ''
	switch (message.type) {
		case 'cc': return `CC ${message.number ?? '?'}${channel}`
		case 'note': return `${message.number === undefined ? 'Notes' : `Note ${noteName(message.number)}`}${channel}`
		case 'pitchBend': return `Pitch bend${channel}`
		case 'channelPressure': return `Channel pressure${channel}`
		case 'programChange': return `Program change${channel}`
		default: return `${message.type}${channel}`
	}
}

/**
 * Pair inputs and outputs that belong to the same piece of hardware:
 * the same profile (or, when unmatched, the same name) and manufacturer.
 * Duplicate same-direction ports stay separate.
 * @returns {Array<{profile:Object|null, input:Object|null, output:Object|null}>}
 */
export const groupMIDIPortsByDevice = (inputs = [], outputs = []) => {
	const groups = []
	for (const [direction, ports] of [['input', inputs], ['output', outputs]]) {
		for (const port of ports) {
			const { profile } = findMIDIDeviceProfile(port, direction)
			const signature = JSON.stringify([profile?.id ?? null, normalise(port.manufacturer), profile ? null : normalise(port.name).replace(/\b(in|out|input|output)\b/g, '').trim()])
			let group = groups.find(item => item.signature === signature && !item[direction])
			if (!group) groups.push(group = { signature, profile, input:null, output:null })
			group[direction] = port
		}
	}
	return groups
}
