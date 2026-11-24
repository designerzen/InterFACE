import {
	decodeUMPMessage,
	encodeUMPClock,
	encodeUMPControlChange,
	encodeUMPNoteOff,
	encodeUMPNoteOn,
	encodeUMPPitchBend,
	scaleUp,
} from '../source/audio/midi/midi-ump.js'
import MIDIBridgeConnection from '../source/audio/midi/midi-connection-electron-bridge.js'
import MIDIConnectionManager from '../source/audio/midi/midi-connection-manager.js'
import { getMIDIInputs, getMIDIOutputs, isMIDIEnabled, registerActiveMIDIManager } from '../source/audio/midi/midi-ports.js'

describe('MIDI 2.0 UMP codec', () => {
	test('scales 7-bit values to 32-bit per MIDI 2.0 spec', () => {
		expect(scaleUp(0, 7, 32)).toBe(0x00000000)
		expect(scaleUp(64, 7, 32)).toBe(0x80000000)
		expect(scaleUp(127, 7, 32)).toBe(0xffffffff)
	})

	test('encodes and decodes MIDI 2.0 Note On / Note Off UMP packets', () => {
		const onWords = encodeUMPNoteOn(60, { channel: 2, velocity: 1 })
		expect(onWords).toEqual([0x40913c00, 0xffff0000])
		const decodedOn = decodeUMPMessage({ endpointId: 'ep-1', timestamp: 42, words: onWords })
		expect(decodedOn).toEqual(expect.objectContaining({
			type: 'noteon',
			velocity: 1,
			rawVelocity: 127,
			note: expect.objectContaining({ number: 60, name: 'C', octave: 4 }),
			message: expect.objectContaining({ type: 'noteon', channel: 2 }),
		}))

		const offWords = encodeUMPNoteOff('C4', { channel: 2, velocity: 0 })
		expect(offWords).toEqual([0x40813c00, 0x00000000])
		const decodedOff = decodeUMPMessage({ endpointId: 'ep-1', timestamp: 99, words: offWords })
		expect(decodedOff.type).toBe('noteoff')
		expect(decodedOff.note.number).toBe(60)
	})

	test('encodes and decodes MIDI 2.0 CC, pitch bend, and system clock', () => {
		const ccWords = encodeUMPControlChange(74, 64, { channel: 16 })
		expect(ccWords).toEqual([0x40bf4a00, 0x80000000])
		const decodedCC = decodeUMPMessage({ endpointId: 'ep-1', words: ccWords })
		expect(decodedCC).toEqual(expect.objectContaining({
			type: 'controlchange',
			controller: { number: 74 },
			rawValue: 64,
			message: expect.objectContaining({ channel: 16 }),
		}))

		const bendWords = encodeUMPPitchBend(0, { channel: 1 })
		expect(bendWords).toEqual([0x40e00000, 0x80000000])
		expect(decodeUMPMessage({ endpointId: 'ep-1', words: bendWords }).value).toBeCloseTo(0, 5)

		const clockWords = encodeUMPClock()
		expect(clockWords).toEqual([0x10f80000])
		expect(decodeUMPMessage({ endpointId: 'ep-1', words: clockWords }).type).toBe('clock')
	})

	test('decodes MIDI 1.0 Channel Voice UMP packets (MT 0x2)', () => {
		const decoded = decodeUMPMessage({ endpointId: 'ep-1', words: [0x20903c7f] })
		expect(decoded).toEqual(expect.objectContaining({
			type: 'noteon',
			rawVelocity: 127,
			note: expect.objectContaining({ number: 60 }),
			message: expect.objectContaining({ channel: 1 }),
		}))
	})
})

describe('MIDIBridgeConnection native MIDI 2.0 adapter', () => {
	const originalElectron = globalThis.electron

	afterEach(() => {
		registerActiveMIDIManager(null)
		globalThis.electron = originalElectron
	})

	test('wraps native ports with WebMidi-compatible output/input methods and registers in midi-ports', async () => {
		let onMessageCallback
		let onPortsChangedCallback
		const sendUMP = jest.fn().mockResolvedValue(true)

		globalThis.electron = {
			midi: {
				available: true,
				getPorts: jest.fn().mockResolvedValue({
					inputs: [{ id: 'ep-1', name: 'MIDI 2 Synth', manufacturer: 'Test', version: '2.0', type: 'input' }],
					outputs: [{ id: 'ep-1', name: 'MIDI 2 Synth', manufacturer: 'Test', version: '2.0', type: 'output' }],
				}),
				sendUMP,
				onMessage: cb => { onMessageCallback = cb; return jest.fn() },
				onPortsChanged: cb => { onPortsChangedCallback = cb; return jest.fn() },
			},
		}

		const manager = new MIDIConnectionManager()
		await manager.enable([MIDIBridgeConnection])

		expect(isMIDIEnabled()).toBe(true)
		expect(getMIDIInputs()).toHaveLength(1)
		expect(getMIDIOutputs()).toHaveLength(1)

		const [output] = getMIDIOutputs()
		output.playNote(60, { channels: 3, attack: 1 })
		expect(sendUMP).toHaveBeenCalledWith('ep-1', [0x40923c00, 0xffff0000], 0)

		output.sendControlChange(74, 127, { channels: [16] })
		expect(sendUMP).toHaveBeenCalledWith('ep-1', [0x40bf4a00, 0xffffffff], 0)

		output.sendClock()
		expect(sendUMP).toHaveBeenCalledWith('ep-1', [0x10f80000], 0)

		const [input] = getMIDIInputs()
		const noteOnListener = jest.fn()
		const midiMessageListener = jest.fn()
		const umpListener = jest.fn()
		input.addListener('noteon', noteOnListener)
		input.addListener('midimessage', midiMessageListener)
		input.onumpmessage = umpListener

		onMessageCallback({ endpointId: 'ep-1', timestamp: 100, words: [0x40903c00, 0xffff0000] })
		expect(umpListener).toHaveBeenCalledTimes(1)
		expect(noteOnListener).toHaveBeenCalledWith(expect.objectContaining({
			type: 'noteon',
			note: expect.objectContaining({ number: 60 }),
		}))
		expect(midiMessageListener).toHaveBeenCalledTimes(1)

		// Preserves input wrapper instance and listeners across hot-plug updates
		onPortsChangedCallback({
			inputs: [{ id: 'ep-1', name: 'MIDI 2 Synth', manufacturer: 'Test', version: '2.0', type: 'input' }],
			outputs: [{ id: 'ep-1', name: 'MIDI 2 Synth', manufacturer: 'Test', version: '2.0', type: 'output' }],
		})
		expect(getMIDIInputs()[0]).toBe(input)

		await manager.disable()
	})
})
