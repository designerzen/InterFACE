/** @jest-environment node */

const {
	createWindowsMIDIServicesBackend,
	getNativeMIDIAddon,
	normalisePorts,
	validateUMPWords,
} = require('../source/electron/windows-midi-services-backend.ts')

describe('Windows MIDI Services backend', () => {
	test('validates each UMP packet size from its message type', () => {
		expect(validateUMPWords([0x20903c7f])).toEqual([0x20903c7f])
		expect(validateUMPWords([0x40903c00, 0xffff0000])).toEqual([0x40903c00, 0xffff0000])
		expect(() => validateUMPWords([0x40903c00])).toThrow(/requires 2/)
		expect(() => validateUMPWords([0x20903c7f, 0])).toThrow(/requires 1/)
		expect(() => validateUMPWords([-1])).toThrow(/unsigned 32-bit/)
	})

	test('presents bidirectional endpoints as input and output ports', () => {
		const ports = normalisePorts([{ id:'endpoint-1', name:'MIDI 2 Device', type:'bidirectional' }])
		expect(ports.inputs).toEqual([expect.objectContaining({ id:'endpoint-1', type:'input', nativeDataFormat:'ump' })])
		expect(ports.outputs).toEqual([expect.objectContaining({ id:'endpoint-1', type:'output', nativeDataFormat:'ump' })])
	})

	test('selects native UMP addons only for Windows and macOS', () => {
		expect(getNativeMIDIAddon('win32')).toEqual(expect.objectContaining({ binary:'photosynth_windows_midi.node' }))
		expect(getNativeMIDIAddon('darwin')).toEqual(expect.objectContaining({ binary:'photosynth_macos_coremidi.node' }))
		expect(getNativeMIDIAddon('linux')).toBeNull()
	})

	test('forwards messages, hot-plug changes, sends, and cleanup', () => {
		let callbacks
		const binding = {
			start: jest.fn(nextCallbacks => {
				callbacks = nextCallbacks
				return { ports:[{ id:'one', name:'One', type:'bidirectional' }] }
			}),
			send: jest.fn(),
			stop: jest.fn(),
		}
		const events = { onMessage:jest.fn(), onPortsChanged:jest.fn() }
		const backend = createWindowsMIDIServicesBackend(binding, events)

		expect(backend.inputs).toHaveLength(1)
		callbacks.onMessage({ endpointId:'one', timestamp:123, words:[0x20903c7f] })
		expect(events.onMessage).toHaveBeenCalledWith({ endpointId:'one', timestamp:123, words:[0x20903c7f] })

		callbacks.onPortsChanged([{ id:'two', name:'Two', type:'input' }])
		expect(backend.inputs[0].id).toBe('two')
		expect(backend.outputs).toHaveLength(0)
		expect(events.onPortsChanged).toHaveBeenCalled()

		backend.send('two', [0x20903c7f], 456)
		expect(binding.send).toHaveBeenCalledWith('two', [0x20903c7f], 456)
		backend.destroy()
		expect(binding.stop).toHaveBeenCalledTimes(1)
	})

	test('does not expose a backend if native startup fails', () => {
		const binding = { start:jest.fn(() => { throw new Error('runtime missing') }), send:jest.fn(), stop:jest.fn() }
		expect(() => createWindowsMIDIServicesBackend(binding, { onMessage:jest.fn(), onPortsChanged:jest.fn() })).toThrow('runtime missing')
	})
})
