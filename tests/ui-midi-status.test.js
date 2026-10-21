import { createMIDIStatusEntries, enableMIDI, renderMIDIDeviceMonitor, setupMIDIMenu, setMIDIControls } from '../source/dom/ui.midi.js'
import { isDigitCMPSRPort } from '../source/hardware/digit/cmpsr.js'

jest.mock('../source/dom/tooltips.js', () => ({ setToast: jest.fn() }))

describe('MIDI HUD status entries', () => {
	test('lists every person sharing a single MIDI output', () => {
		const people = [
			{ name: 'Ada', playerNumber: 0, midiChannel: 'all' },
			{ name: 'Grace', playerNumber: 1, midiChannel: 'all' },
			{ name: 'Max', playerNumber: 2, midiChannel: 'all' },
		]
		const output = {
			id: 'synth-out',
			name: 'Stage Synth',
			manufacturer: 'Acme',
			state: 'connected',
			connection: 'open',
		}

		const [entry] = createMIDIStatusEntries(people, [output], [], 'all')
		const personConnections = entry.tooltipDetails.slice(-3)

		expect(entry.id).toBe('midi-output-synth-out')
		expect(entry.detail).toBe('Output · Channel 1, Channel 2, Channel 3 · 3 people')
		expect(personConnections).toEqual([
			{ label: 'Ada', value: 'Ada → Stage Synth · Channel 1' },
			{ label: 'Grace', value: 'Grace → Stage Synth · Channel 2' },
			{ label: 'Max', value: 'Max → Stage Synth · Channel 3' },
		])
	})

	test('shows dedicated outputs, fallback routing, inputs, and every channel', () => {
		const people = [
			{ name: 'One', playerNumber: 0, midiChannel: 0 },
			{ name: 'Two', playerNumber: 1, midiChannel: 1 },
			{ name: 'Three', playerNumber: 2, midiChannel: 2 },
		]
		const outputs = [
			{ id: 'out-a', name: 'Synth A' },
			{ id: 'out-b', name: 'Synth B' },
		]
		const inputs = [{ id: 'in-a', name: 'Keys', manufacturer: 'Acme' }]

		const entries = createMIDIStatusEntries(people, outputs, inputs, 'all')
		const [input, outputA, outputB] = entries

		expect(input.id).toBe('midi-input-in-a')
		expect(input.tooltipDetails).toEqual(expect.arrayContaining([
			{ label: 'Channels', value: 'All channels (1–16)' },
			{ label: 'One', value: 'Receives input when active · All channels (1–16)' },
			{ label: 'Two', value: 'Receives input when active · All channels (1–16)' },
			{ label: 'Three', value: 'Receives input when active · All channels (1–16)' },
		]))
		expect(outputA.tooltipDetails).toEqual(expect.arrayContaining([
			{ label: 'One', value: 'One → Synth A · Channel 1' },
			{ label: 'Three', value: 'Three → Synth A · Channel 3' },
		]))
		expect(outputB.tooltipDetails).toEqual(expect.arrayContaining([
			{ label: 'Two', value: 'Two → Synth B · Channel 2' },
		]))
	})

	test('detects DIGIT CMPSR MIDI identifiers and announces availability', () => {
		const cmpsrInput = {
			id: 'digit-cmpsr-midi-in',
			name: 'CMPSR MIDI 1',
			manufacturer: 'Digit Music',
		}
		const [entry] = createMIDIStatusEntries([], [], [cmpsrInput])

		expect(isDigitCMPSRPort(cmpsrInput)).toBe(true)
		expect(isDigitCMPSRPort({ id: 'bluetooth-midi', name: 'Digit Composer' })).toBe(true)
		expect(isDigitCMPSRPort({ id: 'other', name: 'Stage Synth', manufacturer: 'Digitone' })).toBe(false)
		expect(entry.label).toBe('DIGIT CMPSR')
		expect(entry.detail).toContain('Available · Input')
		expect(entry.tooltipDetails).toContainEqual({ label: 'Device', value: 'DIGIT CMPSR' })
	})
})

describe('MIDI device monitor', () => {
	test('panel opens explicitly, closes with Escape and can be reopened', () => {
		document.body.innerHTML = `<div id="control-panel-midi" class="folder-menu"><a href="#folder-midi">MIDI</a><menu id="folder-midi"><header><button data-midi-close type="button">Close</button></header><div class="midi-panel-scroll"><div id="midi-monitor-devices"></div></div><footer><span id="midi-scroll-status"></span><button data-midi-scroll="-1"></button><button data-midi-scroll="1"></button></footer></menu></div>`
		setupMIDIMenu()
		const wrapper = document.getElementById('control-panel-midi')
		const launcher = document.querySelector('[href="#folder-midi"]')
		launcher.click()
		expect(wrapper.classList.contains('midi-open')).toBe(true)
		document.getElementById('folder-midi').dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true}))
		expect(wrapper.classList.contains('midi-open')).toBe(false)
		expect(document.activeElement).toBe(launcher)
		launcher.click()
		expect(wrapper.classList.contains('midi-open')).toBe(true)
		document.querySelector('[data-midi-close]').click()
		expect(wrapper.classList.contains('midi-open')).toBe(false)
	})

	test('presets update real options, diagram and custom status', () => {
		document.body.innerHTML = '<div id="midi-monitor-devices"></div>'
		const people = ['Ada', 'Grace'].map((name, playerNumber) => ({name, playerNumber, options:{}, stopAllNotes:jest.fn()}))
		const outputs = [{id:'a', name:'Synth A'}, {id:'b', name:'Synth B'}]
		renderMIDIDeviceMonitor(people, outputs, [{id:'in', name:'Keyboard'}])
		setupMIDIMenu()
		expect(document.querySelector('.midi-map-input').textContent).toContain('Keyboard')
		expect(document.querySelector('[data-midi-preset="auto"]').getAttribute('aria-pressed')).toBe('true')
		document.querySelector('[data-midi-preset="shared"]').click()
		expect(people.map(person => person.options)).toEqual([{midiDevice:'a', midiPort:'1'}, {midiDevice:'a', midiPort:'2'}])
		const shared = document.querySelector('[data-midi-shared-device]')
		shared.value = 'b'
		shared.dispatchEvent(new Event('change', {bubbles:true}))
		expect(people.every(person => person.options.midiDevice === 'b')).toBe(true)
		expect(document.querySelector('[data-midi-map-person="1"]').textContent).toContain('Channel 2')
		expect(document.querySelector('[data-midi-map-person="1"]').textContent).toContain('Synth B')
		document.querySelector('[data-midi-preset="dedicated"]').click()
		expect(people.map(person => person.options)).toEqual([{midiDevice:'a', midiPort:'all'}, {midiDevice:'b', midiPort:'all'}])
		document.querySelector('[data-midi-preset="broadcast"]').click()
		expect(people.map(person => person.options)).toEqual([{midiDevice:'all', midiPort:'1'}, {midiDevice:'all', midiPort:'2'}])
		expect(document.querySelectorAll('[data-midi-map-person="0"] .midi-map-targets .midi-map-node')).toHaveLength(2)
		const details = document.querySelector('[data-midi-details]')
		details.open = true
		const channel = document.querySelector('[data-midi-person="0"] [data-midi-option="midiPort"]')
		channel.value = '7'
		channel.dispatchEvent(new Event('change', {bubbles:true}))
		expect(document.querySelector('[data-midi-details]').open).toBe(true)
		expect(document.querySelector('.midi-preset-status').textContent).toContain('Custom routing')
		document.querySelector('[data-midi-preset="auto"]').click()
		expect(people.every(person => person.options.midiDevice === 'auto' && person.options.midiPort === 'auto')).toBe(true)
	})

	test('unavailable presets are disabled and the map explains missing outputs', () => {
		document.body.innerHTML = '<div id="midi-monitor-devices"></div>'
		const people = [{name:'Ada', options:{midiDevice:'missing'}}, {name:'Grace', options:{midiDevice:'none'}}]
		renderMIDIDeviceMonitor(people, [{id:'a', name:'Synth A'}], [])
		expect(document.querySelector('[data-midi-preset="dedicated"]').disabled).toBe(true)
		expect(document.querySelector('[data-midi-map-person="0"]').textContent).toContain('Selected device disconnected')
		expect(document.querySelector('[data-midi-map-person="1"]').textContent).toContain('MIDI output off')
		renderMIDIDeviceMonitor(people, [], [])
		expect(document.querySelectorAll('[data-midi-preset]')).toHaveLength(0)
		expect(document.querySelector('.midi-connection-map')).toBeNull()
	})

	test('automatic routes are visible and manual channels survive device changes', () => {
		document.body.innerHTML = '<p id="midi-monitor-empty">Connect MIDI devices - zero devices found</p><p id="midi-routing-summary"></p><div id="midi-monitor-devices"></div>'
		const people = [{name:'Ada', playerNumber:0, options:{}}, {name:'Grace', playerNumber:1, options:{midiPort:'7'}}]
		const outputs = [{id:'a', name:'Synth A'}, {id:'b', name:'Synth B'}]
		renderMIDIDeviceMonitor(people, outputs.slice(0, 1), [])
		expect(document.querySelector('[data-midi-port-id="a"]').textContent).toContain('Ada → Synth A · Channel 1')
		expect(document.querySelector('[data-midi-port-id="a"]').textContent).toContain('Grace → Synth A · Channel 7')
		renderMIDIDeviceMonitor(people, outputs, [])
		expect(document.querySelector('[data-midi-port-id="a"]').textContent).toContain('Ada → Synth A · All channels (1–16)')
		expect(document.querySelector('[data-midi-port-id="b"]').textContent).toContain('Grace → Synth B · Channel 7')
		renderMIDIDeviceMonitor(people, [], [])
		expect(document.getElementById('midi-monitor-empty').hidden).toBe(false)
		expect(document.querySelectorAll('.midi-device-card')).toHaveLength(0)
	})

	test('enable toggle uses the device monitor and clears routes on disable', async () => {
		document.body.innerHTML = '<main></main><input id="toggle-midi" type="checkbox"><p id="midi-monitor-empty"></p><div id="midi-monitor-devices"></div>'
		const output = {id:'a', name:'Synth'}
		const person = {playerNumber:0, options:{}, setMIDI:jest.fn(), stopAllNotes:jest.fn()}
		const manager = {inputs:[], outputs:[output], enable:jest.fn().mockResolvedValue([{}]), disable:jest.fn()}
		await setMIDIControls(manager, [], [person], jest.fn())
		const toggle = document.getElementById('toggle-midi')
		toggle.checked = true
		await toggle.onchange()
		expect(manager.enable).toHaveBeenCalledTimes(1)
		expect(person.setMIDI).toHaveBeenCalledWith(output, 1)
		toggle.checked = false
		await toggle.onchange()
		expect(manager.disable).toHaveBeenCalledTimes(1)
		expect(document.querySelectorAll('.midi-device-card')).toHaveLength(0)
	})

	test('handles a raw MIDI anchor when no devices are connected', async () => {
		document.body.innerHTML = `
			<main></main>
			<a id="midi-button" class="connected"></a>
			<fieldset id="midi-panel" hidden></fieldset>
			<fieldset id="no-midi-devices" hidden></fieldset>
			<label for="waiting-for-midi-devices"></label>
			<div><select id="midi-inputs"></select></div>
			<p id="no-midi-inputs"></p>
			<div><select id="midi-outputs"></select></div>
			<p id="no-midi-outputs"></p>
		`
		const midiButton = document.getElementById('midi-button')
		const midiManager = {
			inputs: [],
			outputs: [],
			enable: jest.fn().mockResolvedValue([]),
		}

		await expect(enableMIDI(midiButton, midiManager, [], [], jest.fn())).resolves.toEqual([])
		expect(midiButton.classList.contains('connected')).toBe(false)
	})

	test('shows connected ports as cards and routes multiple people from an output card', () => {
		document.body.innerHTML = `
			<p id="midi-monitor-empty">No MIDI devices connected.</p>
			<div id="midi-monitor-devices"></div>
		`
		const controls = document.createElement('div')
		controls.innerHTML = '<select data-person-option="midiDevice"><option value="auto">Auto</option><option value="out-b">Synth B</option></select><select data-person-option="midiPort"><option value="auto">Auto</option><option value="4">Channel 4</option></select>'
		const people = ['Ada', 'Grace'].map((name, playerNumber) => {
			const person = { name, playerNumber, options:{ midiDevice:'auto', midiPort:'auto' }, controls }
			person.setPanelOption = jest.fn((option, value) => { person.options[option] = value })
			return person
		})
		const inputs = [{ id:'in-a', name:'Keyboard In' }]
		const outputs = [{ id:'out-a', name:'Synth A' }, { id:'out-b', name:'Synth B' }]

		renderMIDIDeviceMonitor(people, outputs, inputs)
		setupMIDIMenu(people)

		expect(document.querySelectorAll('.midi-device-card')).toHaveLength(3)
		expect(document.getElementById('midi-monitor-empty').hidden).toBe(true)

		people.forEach((person, personIndex) => {
			const device = document.querySelector(`[data-midi-person="${personIndex}"] [data-midi-option="midiDevice"]`)
			device.value = 'out-b'
			device.dispatchEvent(new Event('change', { bubbles:true }))
		})
		expect(people.map(person => person.options.midiDevice)).toEqual(['out-b', 'out-b'])
		expect(document.querySelector('[data-midi-port-id="out-b"]').textContent).toContain('Ada')
		expect(document.querySelector('[data-midi-port-id="out-b"]').textContent).toContain('Grace')
		people.forEach((person, personIndex) => {
			const channel = document.querySelector(`[data-midi-person="${personIndex}"] [data-midi-option="midiPort"]`)
			channel.value = '4'
			channel.dispatchEvent(new Event('change', { bubbles:true }))
		})

		expect(people.map(person => person.options.midiPort)).toEqual(['4', '4'])
		expect(controls.querySelector('[data-person-option="midiDevice"]').value).toBe('out-b')
		expect(controls.querySelector('[data-person-option="midiPort"]').value).toBe('4')
	})
})
