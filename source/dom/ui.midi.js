import { setToast } from './tooltips.js'
import { getMIDIPortDisplayName, isDigitCMPSRPort } from '../hardware/digit/cmpsr.js'
import { dispatchMIDIActivity, MIDI_ACTIVITY_EVENT } from '../audio/midi/midi-echo-guard.js'
import { getPersonMIDIOutputs, getPersonMIDIChannel, getMIDIPortTransport } from '../audio/midi/midi-routing.js'
import { stopMIDIEyebrowsForPerson } from '../audio/midi/person-eyebrow-expression.js'

const state = { people: [], outputs: [], inputs: [], statusAPI: null }
const monitoredInputs = new Map()
const activityTimers = new Map()
let connectedStatusIds = new Set()
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character])
const personLabel = (person, index) => person?.displayName || person?.name || `Person ${(person?.playerNumber ?? index) + 1}`
const channelLabel = channel => channel === 'all' ? 'All channels (1–16)' : `Channel ${channel}`
const portLabel = (port, direction, index) => getMIDIPortDisplayName(port, `MIDI ${direction} ${index + 1}`)
const connectionLabel = port => `${port.state ?? 'Connected'} · ${getMIDIPortTransport(port)}${port.connection ? ` · ${port.connection}` : ''}`
const routeOutputs = (person, outputs, index) => getPersonMIDIOutputs(person, outputs, person.playerNumber ?? index)
const routeChannel = (person, outputs, people, index) => getPersonMIDIChannel(person, outputs, people, person.playerNumber ?? index)
const optionsHTML = (choices, selected) => choices.map(([value, label]) => `<option value="${escapeHTML(value)}"${String(value) === String(selected) ? ' selected' : ''}>${escapeHTML(label)}</option>`).join('')

const presetOptions = (preset, person, index, outputs, sharedDevice) => {
	const channel = String(((person.playerNumber ?? index) % 16) + 1)
	if (preset === 'shared') return { midiDevice:sharedDevice ?? String(outputs[0]?.id ?? outputs[0]?.name), midiPort:channel }
	if (preset === 'dedicated') return { midiDevice:String(outputs[index]?.id ?? outputs[index]?.name), midiPort:'all' }
	if (preset === 'broadcast') return { midiDevice:'all', midiPort:channel }
	return { midiDevice:'auto', midiPort:'auto' }
}

const createRoutingPresets = (people, outputs) => {
	const firstSelection = people[0]?.options?.midiDevice
	const sharedDevice = outputs.find(port => String(port.id ?? port.name) === String(firstSelection)) ?? outputs[0]
	const sharedId = String(sharedDevice?.id ?? sharedDevice?.name ?? '')
	const presets = [
		['auto', 'Automatic', 'Match people to connected outputs automatically.'],
		['shared', 'Share one device', 'One output. A separate channel per person.'],
		['dedicated', 'A device each', 'One output per person. All 16 channels.'],
		['broadcast', 'Send to every device', 'Every output. A separate channel per person.'],
	]
	let active = 'Custom routing'
	const buttons = presets.map(([id, title, description]) => {
		const disabled = !people.length || !outputs.length || (id === 'dedicated' && outputs.length < people.length)
		const selected = !disabled && people.every((person, index) => Object.entries(presetOptions(id, person, index, outputs, sharedId)).every(([key, value]) => String(person.options?.[key] ?? 'auto') === value))
		if (selected) active = title
		return `<button type="button" class="midi-preset" data-midi-preset="${id}" aria-pressed="${selected}"${disabled ? ' disabled' : ''}><strong>${title}</strong><span>${description}</span>${id === 'dedicated' && disabled ? '<small>Connect at least one output per person.</small>' : ''}</button>`
	}).join('')
	return `<section class="midi-presets" aria-labelledby="midi-presets-title"><h4 id="midi-presets-title">Quick setup</h4><p>Apply a setup to everyone, then fine-tune if needed.</p><div class="midi-preset-grid">${buttons}</div>${outputs.length && active === 'Share one device' ? `<label class="midi-device-channel midi-shared-target">Shared output<select data-midi-shared-device>${optionsHTML(outputs.map((port, i) => [port.id ?? port.name, portLabel(port, 'Output', i)]), sharedId)}</select></label>` : ''}<p class="midi-preset-status" role="status">Current setup: ${people.length && outputs.length ? active : 'Waiting for people and MIDI outputs'}</p></section>`
}

const createConnectionDiagram = (people, outputs, inputs) => {
	const transportLabel = port => {
		const transport = getMIDIPortTransport(port)
		return String(transport).includes('not reported') ? 'System MIDI' : transport
	}
	const node = (title, detail, kind = '') => `<div class="midi-map-node ${kind}"><strong>${escapeHTML(title)}</strong>${detail ? `<small>${escapeHTML(detail)}</small>` : ''}</div>`
	const wire = label => `<div class="midi-map-wire"><span>${escapeHTML(label)}</span><i aria-hidden="true"></i></div>`
	const incoming = inputs.length ? `<div class="midi-map-row midi-map-input"><div class="midi-map-targets">${inputs.map((port, i) => node(portLabel(port, 'Input', i), transportLabel(port))).join('')}</div>${wire('All channels')}${node('PhotoSYNTH', 'Input goes to the active person')}</div>` : ''
	const outgoing = people.map((person, index) => {
		const targets = routeOutputs(person, outputs, index)
		const selection = person.options?.midiDevice ?? 'auto'
		const inactive = !targets.length
		return `<div class="midi-map-row${inactive ? ' is-unrouted' : ''}" data-midi-map-person="${index}" style="--route-colour:${['#90caff', '#e3b0ff', '#ffce86', '#85e0bb'][index % 4]}">${node(personLabel(person, index), '', 'midi-map-person')}${wire(inactive ? 'No MIDI sent' : channelLabel(routeChannel(person, outputs, people, index)))}<div class="midi-map-targets">${targets.length ? targets.map(port => node(portLabel(port, 'Output', outputs.indexOf(port)), transportLabel(port))).join('') : node(selection === 'none' ? 'MIDI output off' : selection === 'auto' || selection === 'all' ? 'No output connected' : 'Selected device disconnected', 'Choose an output below')}</div></div>`
	}).join('')
	const unused = outputs.filter(port => !people.some((person, index) => routeOutputs(person, outputs, index).includes(port)))
	return `<figure class="midi-connection-map" aria-labelledby="midi-map-title"><figcaption id="midi-map-title">Your connections</figcaption><p>People → MIDI channels → output devices</p>${incoming}${outgoing || '<p>No people active yet.</p>'}${unused.length ? `<div class="midi-map-unused"><span>Connected, not assigned</span>${unused.map(port => node(portLabel(port, 'Output', outputs.indexOf(port)), transportLabel(port))).join('')}</div>` : ''}</figure>`
}

export const createMIDIStatusEntries = (people = [], outputs = [], inputs = []) => {
	const entries = inputs.map((port, index) => ({
		id: `midi-input-${port.id ?? port.name ?? index}`,
		label: portLabel(port, 'Input', index),
		detail: `${isDigitCMPSRPort(port) ? 'Available · ' : ''}Input · All channels (1–16)`,
		tooltipDetails: [
			{ label: 'Port', value: 'MIDI input' },
			{ label: 'Device', value: isDigitCMPSRPort(port) ? 'DIGIT CMPSR' : null },
			{ label: 'Manufacturer', value: port.manufacturer },
			{ label: 'Connection', value: `${portLabel(port, 'Input', index)} → PhotoSYNTH · ${connectionLabel(port)}` },
			{ label: 'Channels', value: 'All channels (1–16)' },
			...people.map((person, i) => ({ label: personLabel(person, i), value: 'Receives input when active · All channels (1–16)' })),
		],
	}))
	outputs.forEach((port, index) => {
		const label = portLabel(port, 'Output', index)
		const assigned = people.map((person, i) => ({ person, i })).filter(({person, i}) => routeOutputs(person, outputs, i).includes(port))
		const channels = [...new Set(assigned.map(({person, i}) => channelLabel(routeChannel(person, outputs, people, i))))]
		entries.push({
			id: `midi-output-${port.id ?? port.name ?? index}`, label,
			detail: `Output · ${channels.join(', ') || 'Unassigned'} · ${assigned.length} ${assigned.length === 1 ? 'person' : 'people'}`,
			tooltipDetails: [
				{ label: 'Port', value: 'MIDI output' },
				{ label: 'Manufacturer', value: port.manufacturer },
				{ label: 'Connection', value: `PhotoSYNTH → ${label} · ${connectionLabel(port)}` },
				{ label: 'Channels', value: channels.length ? channels : 'Unassigned' },
				...assigned.map(({person, i}) => ({ label: personLabel(person, i), value: `${personLabel(person, i)} → ${label} · ${channelLabel(routeChannel(person, outputs, people, i))}` })),
			],
		})
	})
	return entries
}

const syncStatus = () => {
	const api = state.statusAPI
	if (!api?.setDeviceStatus || !api?.clearDeviceStatus) return
	const ids = new Set()
	createMIDIStatusEntries(state.people, state.outputs, state.inputs).forEach(entry => {
		ids.add(entry.id)
		api.setDeviceStatus(entry.id, { ...entry, type:'midi', connected:true, active:false })
	})
	connectedStatusIds.forEach(id => { if (!ids.has(id)) api.clearDeviceStatus(id) })
	connectedStatusIds = ids
}

const applyRouting = () => {
	state.people.forEach((person, index) => {
		const port = routeOutputs(person, state.outputs, index)[0] ?? null
		const channel = routeChannel(person, state.outputs, state.people, index)
		if (person.midi === port && person.midiChannel === channel) return
		person.stopAllNotes?.()
		if (port) person.setMIDI?.(port, channel)
		else {
			person.midi = null
			person.midiPlayer?.connectMIDI(null)
		}
	})
}

const createDeviceCard = (port, direction, index, people, outputs) => {
	const label = portLabel(port, direction, index)
	const routes = direction === 'input' ? '<p>Device → PhotoSYNTH · Active person · All channels (1–16)</p>' :
		people.map((person, i) => routeOutputs(person, outputs, i).includes(port) ? `<p>${escapeHTML(personLabel(person, i))} <span aria-hidden="true">→</span> ${escapeHTML(label)} · ${channelLabel(routeChannel(person, outputs, people, i))}</p>` : '').join('') || '<p>No people assigned</p>'
	return `<article class="midi-device-card" data-midi-device-key="${escapeHTML(`${direction}-${port.id ?? port.name ?? index}`)}" data-midi-port-id="${escapeHTML(port.id)}" data-midi-port-name="${escapeHTML(port.name)}" data-midi-direction="${direction}">
		<header><div class="midi-device-name"><h4>${escapeHTML(label)}</h4><p class="midi-device-manufacturer">${escapeHTML(port.manufacturer)}</p></div><div class="midi-device-status"><span class="midi-device-kind">${direction}</span><div class="midi-device-activity" aria-live="off"><span>Idle</span></div></div></header>
		<p class="midi-device-connection">${escapeHTML(connectionLabel(port))}</p><div class="midi-device-routes">${routes}</div>
	</article>`
}

export const renderMIDIDeviceMonitor = (people = [], outputs = [], inputs = []) => {
	Object.assign(state, { people, outputs, inputs })
	const container = document.getElementById('midi-monitor-devices')
	if (!container) return
	const empty = document.getElementById('midi-monitor-empty')
	if (empty) empty.hidden = outputs.length + inputs.length > 0
	const summary = document.getElementById('midi-routing-summary')
	if (summary) summary.textContent = !outputs.length ? 'Connect a MIDI output to send music.' : outputs.length === 1 ? 'Automatic routing with one output: each person gets their own channel.' : outputs.length < people.length ? 'Automatic routing with fewer outputs than people: devices are shared using separate channels.' : 'Automatic routing with dedicated outputs: each person gets their own device, sending on all channels.'
	const cards = [...inputs.map((port, i) => createDeviceCard(port, 'input', i, people, outputs)), ...outputs.map((port, i) => createDeviceCard(port, 'output', i, people, outputs))]
	const routing = people.map((person, index) => {
		const device = person.options?.midiDevice ?? 'auto'
		const devices = [['auto', 'Automatic'], ['none', 'Off'], ['all', 'All output devices'], ...outputs.map((port, i) => [port.id ?? port.name, portLabel(port, 'Output', i)])]
		if (!devices.some(([value]) => String(value) === String(device))) devices.push([device, `${device} (disconnected)`])
		const channels = [['auto', `Automatic · ${channelLabel(routeChannel(person, outputs, people, index))}`], ['all', 'All channels (1–16)'], ...Array.from({length:16}, (_, i) => [i + 1, `Channel ${i + 1}`])]
		const name = escapeHTML(personLabel(person, index))
		return `<div class="midi-person-route" data-midi-person="${index}"><strong>${name}</strong><span aria-hidden="true">→</span><label class="midi-device-channel">Output device<select data-midi-option="midiDevice" aria-label="Output device for ${name}">${optionsHTML(devices, device)}</select></label><span aria-hidden="true">→</span><label class="midi-device-channel">Channel<select data-midi-option="midiPort" aria-label="Channel for ${name}">${optionsHTML(channels, person.options?.midiPort ?? 'auto')}</select></label></div>`
	}).join('')
	const detailsOpen = container.querySelector('[data-midi-details]')?.open ?? false
	const devicesOpen = container.querySelector('[data-midi-device-details]')?.open ?? false
	container.innerHTML = (outputs.length ? createRoutingPresets(people, outputs) : '') + (outputs.length || inputs.length ? createConnectionDiagram(people, outputs, inputs) : '') + (outputs.length ? `<details class="midi-person-routing" data-midi-details${detailsOpen ? ' open' : ''}><summary>Fine-tune devices and channels</summary>${routing || '<p>No people active</p>'}<button type="button" data-midi-reset>Restore automatic routing</button></details>` : '') + (cards.length ? `<details class="midi-port-details" data-midi-device-details${devicesOpen ? ' open' : ''}><summary>Device details · ${inputs.length} ${inputs.length === 1 ? 'input' : 'inputs'} · ${outputs.length} ${outputs.length === 1 ? 'output' : 'outputs'}</summary><div class="midi-port-cards">${cards.join('')}</div></details>` : '')
}

const refreshRouting = () => {
	applyRouting()
	renderMIDIDeviceMonitor(state.people, state.outputs, state.inputs)
	syncStatus()
}

const setPersonOption = (person, option, value) => {
	person.setPanelOption?.(option, value)
	if (!person.setPanelOption) { person.options ??= {}; person.options[option] = value }
	person.controls?.querySelectorAll(`[data-person-option="${option}"]`).forEach(control => { control.value = value })
}

const applyPreset = (preset, sharedDevice) => {
	if (!['auto', 'shared', 'dedicated', 'broadcast'].includes(preset)) return
	if (!state.outputs.length || (preset === 'dedicated' && state.outputs.length < state.people.length)) return
	state.people.forEach((person, index) => {
		person.stopAllNotes?.()
		Object.entries(presetOptions(preset, person, index, state.outputs, sharedDevice)).forEach(([key, value]) => setPersonOption(person, key, value))
	})
	refreshRouting()
}

export const setupMIDIMenu = () => {
	setupMIDIPanelFrame()
	const monitor = document.getElementById('midi-monitor-devices')
	if (!monitor || monitor.dataset.ready) return
	monitor.dataset.ready = 'true'
	monitor.addEventListener('change', event => {
		if (event.target.matches('[data-midi-shared-device]')) {
			applyPreset('shared', event.target.value)
			monitor.querySelector('[data-midi-shared-device]')?.focus()
			return
		}
		const row = event.target.closest('[data-midi-person]')
		const option = event.target.dataset.midiOption
		if (!row || !['midiDevice', 'midiPort'].includes(option)) return
		const person = state.people[Number(row.dataset.midiPerson)]
		person.stopAllNotes?.()
		setPersonOption(person, option, event.target.value)
		refreshRouting()
		monitor.querySelector(`[data-midi-person="${row.dataset.midiPerson}"] [data-midi-option="${option}"]`)?.focus()
	})
	monitor.addEventListener('click', event => {
		const preset = event.target.closest('[data-midi-preset]')
		if (preset && !preset.disabled) {
			applyPreset(preset.dataset.midiPreset, monitor.querySelector('[data-midi-shared-device]')?.value)
			monitor.querySelector(`[data-midi-preset="${preset.dataset.midiPreset}"]`)?.focus()
			return
		}
		if (!event.target.closest('[data-midi-reset]')) return
		state.people.forEach(person => {
			person.stopAllNotes?.()
			setPersonOption(person, 'midiDevice', 'auto')
			setPersonOption(person, 'midiPort', 'auto')
		})
		refreshRouting()
	})
	globalThis.addEventListener(MIDI_ACTIVITY_EVENT, event => {
		const detail = event.detail ?? {}
		if (!detail.port || !monitor.isConnected) return
		const direction = detail.direction === 'input' ? 'input' : 'output'
		const card = [...monitor.querySelectorAll('.midi-device-card')].find(item => item.dataset.midiDirection === direction && [item.dataset.midiPortId, item.dataset.midiPortName].includes(String(detail.port)))
		if (!card) return
		const parts = [detail.type]
		if (detail.note !== undefined) parts.push(`note ${detail.note?.number ?? detail.note}`)
		if (detail.channel !== undefined) parts.push(`ch ${detail.channel}`)
		card.dataset.activity = direction
		card.querySelector('.midi-device-activity span').textContent = parts.filter(Boolean).join(' · ')
		card.classList.add('is-active')
		clearTimeout(activityTimers.get(card.dataset.midiDeviceKey))
		activityTimers.set(card.dataset.midiDeviceKey, setTimeout(() => card.classList.remove('is-active'), 650))
	})
	document.addEventListener('change', event => {
		if (monitor.isConnected && event.target.matches('[data-person-option="midiDevice"], [data-person-option="midiPort"], [data-person-action="displayName"]')) setTimeout(refreshRouting)
	})
}

const setupMIDIPanelFrame = () => {
	const panel = document.getElementById('folder-midi')
	const scroll = panel?.querySelector('.midi-panel-scroll')
	if (!scroll || panel.dataset.frameReady) return
	panel.dataset.frameReady = 'true'
	if (location.hash === '#folder-midi') panel.closest('.folder-menu')?.classList.add('midi-open')
	const updateScroll = () => {
		const overflowing = scroll.scrollHeight > scroll.clientHeight + 2
		const atTop = scroll.scrollTop <= 2
		const atBottom = scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight - 2
		panel.querySelector('#midi-scroll-status').textContent = !overflowing ? 'All settings shown' : atBottom ? 'End of settings · scroll up for connections' : atTop ? 'More below · scroll for connections and settings' : 'More above and below'
		panel.querySelector('[data-midi-scroll="-1"]').disabled = !overflowing || atTop
		panel.querySelector('[data-midi-scroll="1"]').disabled = !overflowing || atBottom
	}
	const close = () => {
		panel.closest('.folder-menu')?.classList.add('midi-dismissed')
		panel.closest('.folder-menu')?.classList.remove('open', 'midi-open')
		if (location.hash === '#folder-midi') {
			const url = new URL(location.href)
			url.hash = 'control-panel'
			history.replaceState(null, '', url)
		}
		document.querySelector('[href="#folder-midi"]')?.focus({preventScroll:true})
	}
	panel.querySelector('[data-midi-close]')?.addEventListener('click', close)
	panel.addEventListener('keydown', event => {
		if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close() }
	})
	panel.querySelectorAll('[data-midi-scroll]').forEach(button => button.addEventListener('click', () => {
		scroll.scrollBy({top:Number(button.dataset.midiScroll) * scroll.clientHeight * .7, behavior:'auto'})
	}))
	document.querySelector('[href="#folder-midi"]')?.addEventListener('click', () => {
		panel.closest('.folder-menu')?.classList.remove('midi-dismissed')
		panel.closest('.folder-menu')?.classList.add('midi-open')
		requestAnimationFrame(() => { updateScroll(); panel.querySelector('[data-midi-close]')?.focus({preventScroll:true}) })
	})
	scroll.addEventListener('scroll', updateScroll, {passive:true})
	scroll.addEventListener('toggle', updateScroll, true)
	if (typeof ResizeObserver !== 'undefined') {
		const observer = new ResizeObserver(updateScroll)
		observer.observe(scroll)
		const content = document.getElementById('midi-monitor-devices')
		if (content) observer.observe(content)
	}
	updateScroll()
}

const monitorInputs = inputs => {
	monitoredInputs.forEach((listener, input) => {
		if (!inputs.includes(input)) { input.removeListener?.('midimessage', listener); monitoredInputs.delete(input) }
	})
	inputs.forEach(input => {
		if (monitoredInputs.has(input) || !input.addListener) return
		const listener = event => dispatchMIDIActivity({ direction:'input', type:event.message?.type ?? event.type ?? 'message', note:event.note?.number ?? event.message?.dataBytes?.[0], value:event.value ?? event.rawValue ?? event.message?.dataBytes?.[1], channel:event.message?.channel, port:input.name ?? input.id })
		input.addListener('midimessage', listener)
		monitoredInputs.set(input, listener)
	})
}

const updateDevices = (button, people, outputs, inputs, setFeedback, statusAPI) => {
	outputs = outputs.filter(port => port.state !== 'disconnected')
	inputs = inputs.filter(port => port.state !== 'disconnected')
	Object.assign(state, { people, outputs, inputs, statusAPI })
	refreshRouting()
	monitorInputs(inputs)
	const connected = outputs.length + inputs.length > 0
	const main = document.querySelector('main')
	main?.classList.toggle('midi-no-devices', !connected)
	main?.classList.toggle('midi-connected', connected)
	main?.classList.toggle('midi-available', true)
	main?.classList.toggle('midi-unavailable', false)
	const panel = document.getElementById('midi-panel')
	if (panel) panel.hidden = false
	// The monitor owns the single empty state. Legacy controls remain hidden.
	const legacy = document.getElementById('no-midi-devices')
	if (legacy) legacy.hidden = true
	;(button?.element ?? button)?.classList.toggle('connected', connected)
	const message = connected ? `${inputs.length} MIDI inputs · ${outputs.length} MIDI outputs connected` : 'Connect MIDI devices - zero devices found'
	setFeedback?.(message, 0)
	setToast(message)
}

export const enableMIDI = async (button, manager, classes, people, setFeedback, statusAPI = null) => {
	const update = (outputs, inputs) => updateDevices(button, people, outputs, inputs, setFeedback, statusAPI)
	const connections = await manager.enable(classes, update)
	update(manager.outputs ?? [], manager.inputs ?? [])
	return connections
}

export const disableMIDI = async (button, manager) => {
	state.people.forEach(person => person.stopAllNotes?.())
	await manager.disable()
	updateDevices(button, state.people, [], [], null, state.statusAPI)
}

export const setupMIDIButton = (button, callback) => {
	let enabled = false
	button?.addEventListener('click', () => { enabled = true; callback?.(button, true) }, { once:true })
	return {
		element:button, getEnabled:() => enabled,
		setEnabled:value => { enabled = value; button?.classList.toggle('connected', value) },
		setText:text => { if (button) button.textContent = text },
		setLabel:text => button?.setAttribute('aria-label', text),
	}
}

export const createMIDIButton = async (manager, classes, people, setFeedback) => setupMIDIButton(document.getElementById('button-midi'), async button => {
	try { await enableMIDI(button, manager, classes, people, setFeedback) }
	catch (error) { setFeedback?.(`Could not enable MIDI: ${error.message}`) }
})

export const observeMIDIPortClock = port => port?.addListener('clock', event => console.info('External MIDI clock', event))
export const setupMIDIDialog = () => renderMIDIDeviceMonitor(state.people, state.outputs, state.inputs)

export const setMIDIControls = async (manager, classes, people, optionsOrFeedback, feedbackOrStatus, maybeStatus = null) => {
	const feedback = typeof optionsOrFeedback === 'function' ? optionsOrFeedback : feedbackOrStatus
	const statusAPI = typeof optionsOrFeedback === 'function' ? feedbackOrStatus : maybeStatus
	setupMIDIMenu()
	Object.assign(state, { people, outputs:manager.outputs ?? [], inputs:manager.inputs ?? [], statusAPI })
	refreshRouting()
	const toggle = document.getElementById('toggle-midi')
	let enabled = false
	let pending = false
	const update = (outputs, inputs) => updateDevices(toggle, people, outputs, inputs, feedback, statusAPI)
	const connect = async () => {
		if (pending || enabled) return
		pending = true
		if (toggle) toggle.disabled = true
		try {
			const connections = await manager.enable(classes, update)
			enabled = connections.length > 0
			update(manager.outputs ?? [], manager.inputs ?? [])
			if (!enabled) feedback?.('Could not enable MIDI. Check MIDI access and try again.')
		} catch (error) { feedback?.(`Could not enable MIDI: ${error.message}`) }
		finally { pending = false; if (toggle) { toggle.disabled = false; toggle.checked = enabled } }
	}
	if (toggle) toggle.onchange = async () => {
		if (toggle.checked) await connect()
		else {
			enabled = false
			people.forEach(stopMIDIEyebrowsForPerson)
			people.forEach(person => person.stopAllNotes?.())
			await manager.disable()
			update([], [])
		}
	}
	document.querySelector('[href="#folder-midi"]')?.addEventListener('click', connect)
}
