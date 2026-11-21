/**
 * Guide people through a newly connected MIDI device: what it is (from the
 * midi-devices catalogue), how to get it working, and which people it
 * should augment. Each device is offered once per session; devices that
 * have already been set up only announce themselves.
 */
import { setToast } from './tooltips.js'
import { getMIDIPortDisplayName } from '../hardware/digit/cmpsr.js'
import { groupMIDIPortsByDevice, loadMIDIDeviceCatalogue, midiDeviceAssetURL } from '../audio/midi/midi-device-profiles.js'
import { describeMIDIDeviceIntegration, getMIDIDeviceIntegration, INTEGRATION_MODES, INTEGRATION_MONITOR, INTEGRATION_NOTES, setMIDIDeviceIntegration } from '../audio/midi/midi-device-integration.js'

// Extra help for devices whose profiles cannot say enough on their own
const DEVICE_GUIDES = {
	'arcana-strum': {
		mode: INTEGRATION_NOTES,
		steps: [
			'Turn the Strum on with its Power button. USB also charges it.',
			'Choose who it plays for below, then press Start playing.',
			'Hold keys under your left hand and move the strum stick across the strings.',
			'Melodic mode plays single notes; the Power button returns to Harmony mode. ♭ and ♯ transpose (hold for an octave), SeptaChords adds 7ths and the Dynamics switch makes volume follow your playing.',
		],
	},
}

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character])
const personLabel = (person, index) => person?.displayName || person?.name || `Person ${(person?.playerNumber ?? index) + 1}`
const linkHTML = (url, title) => /^https?:/.test(url ?? '') ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener">${escapeHTML(title)}</a>` : ''

const offered = new Set()
let connected = new Set()
let queue = []
let dialog = null

const getDialog = () => {
	if (dialog?.isConnected) return dialog
	dialog = document.createElement('dialog')
	dialog.className = 'midi-device-guide'
	dialog.setAttribute('aria-labelledby', 'midi-device-guide-title')
	dialog.addEventListener('close', () => setTimeout(showNextGuide))
	document.body.append(dialog)
	return dialog
}

const createStepsHTML = (profile, guide, group) => {
	const connections = profile?.connections.filter(connection => /usb|midi|bluetooth/i.test(`${connection.label} ${connection.connector}`))
	const steps = guide?.steps ?? [
		connections?.length ? `Keep it connected by ${connections.map(connection => connection.label).join(' or ')}.` : 'Keep it connected and switched on.',
		group.input ? 'Choose how it plays and who it plays for below, then press Start playing.' : 'Open MIDI settings to send people\'s notes to it.',
		group.input ? 'Play the device. Its activity shows on screen, and you can change these choices in MIDI settings at any time.' : 'Use Send test note on its card to check that it receives notes.',
	]
	return `<ol class="midi-device-guide-steps">${steps.map(step => `<li>${escapeHTML(step)}</li>`).join('')}</ol>`
}

const createModesHTML = selected => `<fieldset class="midi-device-guide-modes"><legend>How should it play?</legend>${INTEGRATION_MODES.map(([mode, title, description]) => `<label><input type="radio" name="midi-guide-mode" value="${mode}"${mode === selected ? ' checked' : ''}><span><strong>${escapeHTML(title)}</strong><small>${escapeHTML(description)}</small></span></label>`).join('')}</fieldset>`

const createPeopleHTML = (people, selected) => `<fieldset class="midi-device-guide-people"><legend>Who does it augment?</legend>${people.length ? people.map((person, index) => `<label><input type="checkbox" name="midi-guide-person" value="${person.playerNumber ?? index}"${selected.includes(person.playerNumber ?? index) ? ' checked' : ''}> ${escapeHTML(personLabel(person, index))}</label>`).join('') : ''}<small>Leave everyone unticked to follow whoever is active.</small></fieldset>`

const createEchoHTML = echoes => `<label class="midi-device-guide-echo"><input type="checkbox" name="midi-guide-echo"${echoes ? ' checked' : ''}> It sends back what it receives</label><small>Most devices have a MIDI thru or echo setting. Leave this ticked unless it is switched off; while ticked, notes the device is holding are never sent back to it.</small>`

const createGuideHTML = (group, people) => {
	const { profile, input, output } = group
	const port = input ?? output
	const name = profile?.name ?? getMIDIPortDisplayName(port, 'MIDI device')
	const guide = DEVICE_GUIDES[profile?.id]
	const integration = getMIDIDeviceIntegration(port)
	const mode = integration.configured ? integration.mode : guide?.mode ?? INTEGRATION_NOTES
	const direction = input && output ? 'Sends and receives MIDI' : input ? 'Sends MIDI to PhotoSYNTH' : 'Receives MIDI from PhotoSYNTH'
	const diagram = profile?.assets.connections ?? profile?.assets.diagram
	const links = profile ? [linkHTML(profile.productUrl, 'Product page'), ...profile.documentation.map(({ url, title }) => linkHTML(url, title))].filter(Boolean) : []
	return `<form method="dialog">
		<header class="midi-device-guide-header">
			${profile?.assets.icon ? `<img src="${escapeHTML(midiDeviceAssetURL(profile.assets.icon))}" alt="" width="48" height="48">` : ''}
			<div><h2 id="midi-device-guide-title">${escapeHTML(name)} connected</h2><p>${escapeHTML([profile?.manufacturer ?? port.manufacturer, direction].filter(Boolean).join(' · '))}</p></div>
			<button class="button-close" type="submit" value="close" aria-label="Close device guide"></button>
		</header>
		<p>${escapeHTML(profile?.description ?? 'PhotoSYNTH found a new MIDI device. It is not in the device list yet, but its notes still work.')}</p>
		${profile?.abilities.length ? `<ul class="midi-device-tags" aria-label="What it can do">${profile.abilities.map(ability => `<li>${escapeHTML(ability)}</li>`).join('')}</ul>` : ''}
		<h3>Get it working</h3>
		${createStepsHTML(profile, guide, group)}
		${input ? createModesHTML(mode) + createPeopleHTML(people, integration.people) : ''}
		${input && output ? createEchoHTML(integration.echoes) : ''}
		${diagram ? `<figure class="midi-device-diagrams"><img src="${escapeHTML(midiDeviceAssetURL(diagram))}" alt="${escapeHTML(`${name} connections diagram`)}" loading="lazy" decoding="async"></figure>` : ''}
		${profile?.notice ? `<details><summary>Setup notes</summary><p>${escapeHTML(profile.notice)}</p></details>` : ''}
		${links.length ? `<ul class="midi-device-list">${links.map(link => `<li>${link}</li>`).join('')}</ul>` : ''}
		<menu class="midi-device-guide-actions">
			${input ? '<button type="submit" value="save" autofocus>Start playing</button><button type="submit" value="monitor">Monitor only</button>' : '<button type="submit" value="seen" autofocus>Done</button>'}
			<button type="button" data-midi-guide-settings>MIDI settings</button>
		</menu>
	</form>`
}

/**
 * Show the guide for one device
 * @param {{profile:Object|null, input:Object|null, output:Object|null}} group
 * @param {Array} people
 */
export const showMIDIDeviceGuide = (group, people = []) => {
	const element = getDialog()
	if (element.open) element.close()
	element.innerHTML = createGuideHTML(group, people)
	const port = group.input ?? group.output
	element.querySelector('[data-midi-guide-settings]')?.addEventListener('click', () => {
		element.close('settings')
		document.querySelector('[href="#folder-midi"]')?.click()
	})
	element.querySelector('form').addEventListener('submit', event => {
		const choice = event.submitter?.value
		const form = event.target
		const echoes = form.querySelector('[name="midi-guide-echo"]')?.checked
		if (choice === 'save') {
			const mode = form.querySelector('[name="midi-guide-mode"]:checked')?.value ?? INTEGRATION_NOTES
			const chosen = [...form.querySelectorAll('[name="midi-guide-person"]:checked')].map(box => Number(box.value))
			const integration = setMIDIDeviceIntegration(port, { mode, people:chosen, echoes })
			setToast(escapeHTML(`${element.querySelector('h2').textContent} · ${describeMIDIDeviceIntegration(integration, people)}`))
		} else if (choice === 'monitor' || choice === 'seen') {
			setMIDIDeviceIntegration(port, { mode:INTEGRATION_MONITOR, echoes })
		}
	})
	if (typeof element.showModal === 'function') element.showModal()
	else element.setAttribute('open', '')
}

function showNextGuide(){
	// Skip devices unplugged while they waited
	queue = queue.filter(({ group }) => connected.has(group.signature))
	if ((dialog?.isConnected && dialog.open) || !queue.length) return
	const { group, people } = queue.shift()
	showMIDIDeviceGuide(group, people)
}

/**
 * Offer guides for devices connected at launch or plugged in later.
 * Devices already set up are announced rather than interrupting play.
 */
export const offerMIDIDeviceGuides = async (inputs = [], outputs = [], people = []) => {
	forgetMIDIDeviceGuides(inputs, outputs)
	if (!inputs.length && !outputs.length) return
	await loadMIDIDeviceCatalogue()
	groupMIDIPortsByDevice(inputs, outputs).forEach(group => {
		const port = group.input ?? group.output
		const key = group.signature
		// Devices can be unplugged while the catalogue loads
		if (offered.has(key) || !connected.has(key)) return
		offered.add(key)
		const integration = getMIDIDeviceIntegration(port)
		if (!integration.configured) {
			queue.push({ group, people })
			return
		}
		const name = group.profile?.name ?? getMIDIPortDisplayName(port, 'MIDI device')
		setToast(escapeHTML(`${name} connected${group.input ? ` · ${describeMIDIDeviceIntegration(integration, people)}` : ''}`))
	})
	showNextGuide()
}

// Let an unplugged device be offered again when it returns
const forgetMIDIDeviceGuides = (inputs = [], outputs = []) => {
	connected = new Set(groupMIDIPortsByDevice(inputs, outputs).map(group => group.signature))
	offered.forEach(key => { if (!connected.has(key)) offered.delete(key) })
	queue = queue.filter(({ group }) => connected.has(group.signature))
}
