/**
 * How each MIDI input device augments PhotoSYNTH, remembered per port name.
 *
 * Incoming MIDI is observed by default but plays nothing until a device is
 * given a mode, because routing unconfigured input into the instruments
 * (and from there back out to MIDI outputs) caused perpetual feedback loops.
 * Augmented notes only reach the onboard instruments, never MIDI outputs.
 */
const STORAGE_KEY = 'photosynth-midi-device-integrations'

// Observe and show activity only
export const INTEGRATION_MONITOR = 'monitor'
// Play the device's notes exactly as sent
export const INTEGRATION_NOTES = 'notes'
// Held notes set the root note that the face then plays around
export const INTEGRATION_ROOT = 'root'
// Each note becomes a chord shaped by the person's expression
export const INTEGRATION_HARMONISE = 'harmonise'

export const INTEGRATION_MODES = [
	[INTEGRATION_NOTES, 'Play its notes', 'The device chooses the notes; people\'s instruments give them a voice.'],
	[INTEGRATION_ROOT, 'Set the key', 'Held notes become the root note; the face plays around it.'],
	[INTEGRATION_HARMONISE, 'Harmonise with emotion', 'Each note becomes a chord shaped by the person\'s expression.'],
	[INTEGRATION_MONITOR, 'Monitor only', 'Show its activity without playing anything.'],
]

const MODES = new Set(INTEGRATION_MODES.map(([mode]) => mode))
const listeners = new Set()
let integrations = null

const normalise = value => String(value ?? '').trim().toLowerCase()
// Chrome derives port IDs per session and USB socket, so remember devices by
// name. Windows numbers identical devices ("2- MPK mini 3"); that prefix is
// kept so two of the same device can augment different people.
const integrationKey = port => `${normalise(port?.manufacturer)}:${normalise(port?.name)}`

export const isSameMIDIDevice = (a, b) => integrationKey(a) === integrationKey(b)

const readIntegrations = () => {
	if (integrations) return integrations
	try { integrations = JSON.parse(globalThis.localStorage?.getItem(STORAGE_KEY)) ?? {} }
	catch { integrations = {} }
	return integrations
}

/**
 * @param {{name?:String, manufacturer?:String}} port
 * @returns {{mode:String, people:Array<Number>, echoes:Boolean, configured:Boolean}}
 * 	people lists player numbers; an empty list follows the active person.
 * 	echoes is whether the device sends back what it receives (MIDI thru or
 * 	local echo), a setting on most devices, so assumed until switched off.
 */
export const getMIDIDeviceIntegration = port => {
	const saved = readIntegrations()[integrationKey(port)]
	return {
		mode: MODES.has(saved?.mode) ? saved.mode : INTEGRATION_MONITOR,
		people: Array.isArray(saved?.people) ? saved.people.filter(Number.isInteger) : [],
		echoes: saved?.echoes !== false,
		configured: Boolean(saved),
	}
}

export const isMIDIDeviceConfigured = port => getMIDIDeviceIntegration(port).configured

export const setMIDIDeviceIntegration = (port, { mode = INTEGRATION_MONITOR, people = [], echoes = getMIDIDeviceIntegration(port).echoes } = {}) => {
	readIntegrations()[integrationKey(port)] = {
		mode: MODES.has(mode) ? mode : INTEGRATION_MONITOR,
		people: [...new Set(people.map(Number).filter(Number.isInteger))].sort((a, b) => a - b),
		echoes: Boolean(echoes),
	}
	try { globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(integrations)) }
	catch (error) { console.warn('[MIDI] Could not save device integration', error) }
	const integration = getMIDIDeviceIntegration(port)
	listeners.forEach(listener => listener(port, integration))
	return integration
}

export const onMIDIDeviceIntegrationChanged = listener => {
	listeners.add(listener)
	return () => listeners.delete(listener)
}

/**
 * People a device's notes should reach
 * @param {{people:Array<Number>}} integration
 * @param {{people?:Array, getSelectedPerson?:Function, getActivePerson?:Function}} personManager
 * @returns {Array<Object>}
 */
export const getMIDIDeviceIntegrationPeople = (integration, personManager) => {
	// Chosen people who have left are not replaced by someone else
	if (integration.people.length) return (personManager?.people ?? []).filter(person => integration.people.includes(person.playerNumber))
	const person = personManager?.getSelectedPerson?.() || personManager?.getActivePerson?.()
	return person ? [person] : []
}

const personName = (person, index) => person?.displayName || person?.name || `Person ${(person?.playerNumber ?? index) + 1}`

/**
 * Short description such as "Play its notes · Person 1, Person 2"
 */
export const describeMIDIDeviceIntegration = (integration, people = []) => {
	const [, title] = INTEGRATION_MODES.find(([mode]) => mode === integration.mode) ?? INTEGRATION_MODES.at(-1)
	if (integration.mode === INTEGRATION_MONITOR) return title
	const names = people.filter(person => integration.people.includes(person.playerNumber)).map(personName)
	return `${title} · ${names.length ? names.join(', ') : 'Active person'}`
}
