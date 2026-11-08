jest.mock('webmidi', () => ({ WebMidi: { inputs: [], outputs: [], addListener: jest.fn(), removeListener: jest.fn() } }))
jest.mock('../source/audio/midi/midi-echo-guard.js', () => ({ dispatchMIDIActivity: jest.fn() }))

import { WebMidi } from 'webmidi'
import { decodeMIDIControl, encodeMIDIControl, MIDI_CC_CONTROLS, setupMIDICC } from '../source/interface-midi-cc.js'

const input = () => {
	const listeners = new Map()
	return {
		addListener: jest.fn((type, listener) => listeners.set(type, listener)),
		removeListener: jest.fn((type) => listeners.delete(type)),
		emit: (cc, value, channel = 16) => listeners.get('controlchange')?.({ controller: { number: cc }, rawValue: value, message: { channel, dataBytes: [cc, value] } }),
	}
}

describe('bidirectional app MIDI CC', () => {
	let state, port, output, callbacks, dispose
	beforeEach(() => {
		document.body.innerHTML = `
			<input id="mixer-master-volume" type="range" min="0" max="1" step="0.01" value="1">
			<input id="button-mute" type="checkbox">
			<select id="select-key"><option value="0">C</option><option value="1" disabled>C#</option><option value="2">D</option><option value="3">D#</option></select>
			<input id="head-note-range" type="range" min="20" max="120" step="1" value="90">
			<select id="midi-eyebrow-mode"><option value="cc">MIDI CC</option><option value="pitchbend">Pitch bend</option></select><input id="midi-eyebrow-cc" type="number">
			<input id="midi-cc-enabled" type="checkbox"><input id="midi-cc-channel" type="number"><button id="midi-cc-sync">Sync</button><button id="midi-cc-open">CC codes</button><dialog id="midi-cc-dialog"><strong id="midi-cc-reference-channel"></strong><table><tbody id="midi-cc-reference"></tbody></table></dialog>`
		callbacks = new Set()
		const values = new Map([['midi', true], ['midiCC', true], ['midiCCChannel', 16], ['muted', false], ['key', 0]])
		state = {
			get: key => values.get(key),
			set: jest.fn((key, value) => { values.set(key, value); callbacks.forEach(callback => callback(key, value)) }),
			addEventListener: callback => callbacks.add(callback),
			removeEventListener: callback => callbacks.delete(callback),
		}
		port = input()
		output = { name: 'Test output', sendControlChange: jest.fn() }
		WebMidi.inputs = [port]
		WebMidi.outputs = [output]
		document.getElementById('button-mute').onclick = event => state.set('muted', event.target.checked)
		document.getElementById('select-key').onchange = event => state.set('key', event.target.value)
		document.getElementById('mixer-master-volume').oninput = event => state.set('volume', Number(event.target.value))
		dispose = setupMIDICC({ stateMachine: state })
	})
	afterEach(() => dispose())

	it('saves eyebrow output settings and rejects channel-mode controller numbers', () => {
		const mode = document.getElementById('midi-eyebrow-mode')
		const cc = document.getElementById('midi-eyebrow-cc')
		expect(mode.value).toBe('cc')
		expect(cc.value).toBe('74')
		cc.value = '1'
		cc.dispatchEvent(new Event('change'))
		expect(state.get('midiEyebrowCC')).toBe(1)
		cc.value = '123'
		cc.dispatchEvent(new Event('change'))
		expect(cc.value).toBe('1')
		mode.value = 'pitchbend'
		mode.dispatchEvent(new Event('change'))
		expect(state.get('midiEyebrowMode')).toBe('pitchbend')
		expect(cc.disabled).toBe(true)
		state.set('midiEyebrowMode', 'cc')
		expect(cc.disabled).toBe(false)
	})

	it('scales faders to bounds and steps, with round trips for every value', () => {
		const element = document.getElementById('head-note-range')
		expect(decodeMIDIControl(element, 0)).toBe(20)
		expect(decodeMIDIControl(element, 127)).toBe(120)
		for (let value = 20; value <= 120; value++) expect(decodeMIDIControl(element, encodeMIDIControl(element, value))).toBe(value)
	})

	it('maps switches and selectable options including disabled options', () => {
		const checkbox = document.getElementById('button-mute')
		expect(decodeMIDIControl(checkbox, 63)).toBe(false)
		expect(decodeMIDIControl(checkbox, 64)).toBe(true)
		const select = document.getElementById('select-key')
		expect(decodeMIDIControl(select, 64)).toBe('2')
		expect(decodeMIDIControl(select, 127)).toBe('3')
		expect(encodeMIDIControl(select, '2')).toBe(64)
	})

	it('applies inbound controls through app handlers without retransmitting', () => {
		port.emit(7, 64)
		expect(state.get('volume')).toBe(0.5)
		port.emit(64, 127)
		expect(state.get('muted')).toBe(true)
		port.emit(64, 127)
		expect(state.set.mock.calls.filter(([key]) => key === 'muted')).toHaveLength(1)
		port.emit(20, 127)
		expect(state.get('key')).toBe('3')
		expect(output.sendControlChange).not.toHaveBeenCalled()
	})

	it('sends state changes to every output on the configured channel once', () => {
		const second = { sendControlChange: jest.fn() }
		WebMidi.outputs.push(second)
		state.set('muted', true)
		state.set('muted', true)
		expect(output.sendControlChange).toHaveBeenCalledTimes(1)
		expect(output.sendControlChange).toHaveBeenCalledWith(64, 127, { channels: [16] })
		expect(second.sendControlChange).toHaveBeenCalledTimes(1)
		expect(second.sendControlChange).toHaveBeenCalledWith(64, 127, { channels: [16] })
	})

	it('suppresses immediate loopback while accepting a different controller value', () => {
		output.sendControlChange.mockImplementation((cc, value) => port.emit(cc, value))
		state.set('volume', 0.25)
		expect(state.get('volume')).toBe(0.25)
		port.emit(7, 127)
		expect(state.get('volume')).toBe(1)
		expect(output.sendControlChange).toHaveBeenCalledTimes(1)
	})

	it('ignores wrong channels, invalid values, disabled CC and disabled MIDI', () => {
		port.emit(64, 127, 1)
		port.emit(64, 128)
		port.emit(64, NaN)
		state.set('midiCC', false)
		port.emit(64, 127)
		state.set('midiCC', true)
		state.set('midi', false)
		port.emit(64, 127)
		expect(state.get('muted')).toBe(false)
		expect(output.sendControlChange).not.toHaveBeenCalled()
	})

	it('captures mixer UI changes and delayed state updates without duplicates', () => {
		const element = document.getElementById('mixer-master-volume')
		element.value = 0.5
		element.dispatchEvent(new Event('input', { bubbles: true }))
		element.dispatchEvent(new Event('change', { bubbles: true }))
		state.set('volume', 0.5)
		expect(output.sendControlChange).toHaveBeenCalledTimes(1)
		expect(output.sendControlChange).toHaveBeenCalledWith(7, 64, { channels: [16] })
	})

	it('updates CC settings and renders assignments', () => {
		const element = document.getElementById('midi-cc-channel')
		element.value = 4
		element.dispatchEvent(new Event('change', { bubbles: true }))
		port.emit(64, 127, 4)
		expect(state.get('muted')).toBe(true)
		state.set('muted', false)
		expect(output.sendControlChange).toHaveBeenLastCalledWith(64, 0, { channels: [4] })
		expect(document.querySelectorAll('#midi-cc-reference tr')).toHaveLength(MIDI_CC_CONTROLS.length)
	})

	it('opens a current reference with fader, switch and selector mappings', () => {
		const dialog = document.getElementById('midi-cc-dialog')
		dialog.showModal = jest.fn(() => { dialog.open = true })
		state.set('midiCCChannel', 4)
		document.getElementById('midi-cc-open').click()
		expect(dialog.showModal).toHaveBeenCalledTimes(1)
		expect(document.getElementById('midi-cc-reference-channel').textContent).toBe('4')
		const rows = Array.from(document.querySelectorAll('#midi-cc-reference tr'))
		expect(rows.find(row => row.firstChild.textContent === '7').textContent).toContain('0–127 → 0–1')
		expect(rows.find(row => row.firstChild.textContent === '64').textContent).toContain('0–63: Off · 64–127: On')
		expect(rows.find(row => row.firstChild.textContent === '20').textContent).toContain('0: C · 64: D · 127: D#')
		document.getElementById('midi-cc-open').click()
		expect(dialog.showModal).toHaveBeenCalledTimes(1)
	})

	it('handles device replacement and disposes listeners', () => {
		const replacement = input()
		WebMidi.inputs = [replacement]
		WebMidi.addListener.mock.calls.find(([type]) => type === 'connected')[1]()
		expect(port.removeListener).toHaveBeenCalledWith('controlchange', expect.any(Function))
		replacement.emit(64, 127)
		expect(state.get('muted')).toBe(true)
		dispose()
		expect(replacement.removeListener).toHaveBeenCalledWith('controlchange', expect.any(Function))
		expect(callbacks.size).toBe(0)
	})

	it('uses unique CCs below channel-mode commands', () => {
		expect(new Set(MIDI_CC_CONTROLS.map(control => control.cc)).size).toBe(MIDI_CC_CONTROLS.length)
		expect(MIDI_CC_CONTROLS.every(control => control.cc < 120)).toBe(true)
	})

	it('sends a snapshot on request, including to newly connected outputs', () => {
		const second = { sendControlChange: jest.fn() }
		WebMidi.outputs.push(second)
		document.getElementById('midi-cc-sync').click()
		expect(second.sendControlChange).toHaveBeenCalledWith(64, 0, { channels: [16] })
		expect(second.sendControlChange).toHaveBeenCalledWith(7, 127, { channels: [16] })
	})

	it('reflects Free Range and numeric keys as one selector without intermediate CCs', async () => {
		const element = document.getElementById('select-key')
		element.innerHTML = '<option value="free-range">Free Range</option><option value="C">C</option><option value="D">D</option>'
		state.set('harmonyMode', 'free-range')
		await Promise.resolve()
		expect(output.sendControlChange).toHaveBeenLastCalledWith(20, 0, { channels: [16] })
		output.sendControlChange.mockClear()
		state.set('harmonyMode', 'global-key')
		state.set('key', 2)
		await Promise.resolve()
		expect(output.sendControlChange).toHaveBeenCalledTimes(1)
		expect(output.sendControlChange).toHaveBeenLastCalledWith(20, 127, { channels: [16] })
	})

	it('sends selector values when app state stores only an enabled flag', () => {
		const select = document.createElement('select')
		select.id = 'select-eyes'
		select.innerHTML = '<option value="disabled">Disabled</option><option value="regular">Regular</option>'
		select.value = 'regular'
		document.body.appendChild(select)
		state.set('eyes', true)
		expect(output.sendControlChange).toHaveBeenLastCalledWith(29, 127, { channels: [16] })
	})
})
