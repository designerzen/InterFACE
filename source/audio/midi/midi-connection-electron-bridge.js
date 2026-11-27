import MIDIConnection from './midi-connection.js'
import { requestElectronPort } from '../../electron/electron-port-client.js'
import {
	decodeUMPMessage,
	encodeUMPClock,
	encodeUMPControlChange,
	encodeUMPKeyAftertouch,
	encodeUMPNoteOff,
	encodeUMPNoteOn,
	encodeUMPPitchBend,
	encodeUMPProgramChange,
} from './midi-ump.js'

const ALL_CHANNELS = Array.from({ length: 16 }, (_, index) => index + 1)

const resolveChannels = options => {
	const raw = options?.channels ?? options?.channel
	if (raw === undefined || raw === null || raw === 'all') return [1]
	if (Array.isArray(raw)) {
		const valid = raw.map(Number).filter(ch => Number.isInteger(ch) && ch >= 1 && ch <= 16)
		return valid.length ? valid : [1]
	}
	const single = Number(raw)
	if (Number.isInteger(single) && single >= 1 && single <= 16) return [single]
	return [1]
}

const resolveVelocity = (options, keys, fallback) => {
	for (const key of keys) {
		if (options?.[key] !== undefined && options[key] !== null) return options[key]
	}
	return fallback
}

const createNativeInputPort = port => {
	const listeners = new Map()
	const input = {
		...port,
		type: 'input',
		connection: 'open',
		state: 'connected',
		onumpmessage: null,
		addListener(type, listener) {
			if (typeof listener !== 'function') return this
			if (!listeners.has(type)) listeners.set(type, new Set())
			listeners.get(type).add(listener)
			return this
		},
		removeListener(type, listener) {
			if (!type) {
				listeners.clear()
				return this
			}
			if (!listener) {
				listeners.delete(type)
				return this
			}
			listeners.get(type)?.delete(listener)
			return this
		},
		_dispatchUMP(message) {
			this.onumpmessage?.(message)
			const decoded = decodeUMPMessage(message)
			if (!decoded) return
			const event = { ...decoded, target: this }
			for (const listener of Array.from(listeners.get('midimessage') ?? [])) {
				listener(event)
			}
			if (decoded.type) {
				for (const listener of Array.from(listeners.get(decoded.type) ?? [])) {
					listener(event)
				}
			}
		},
		_update(nextPort) {
			this.name = nextPort.name
			this.manufacturer = nextPort.manufacturer
			this.version = nextPort.version
			this.nativeDataFormat = nextPort.nativeDataFormat ?? this.nativeDataFormat
			this.state = 'connected'
			this.connection = 'open'
			return this
		},
	}
	return input
}

const createNativeOutputPort = (port, sendUMP) => {
	const dispatch = (words, timestamp = 0) => {
		try {
			const pending = sendUMP(port.id, words, timestamp)
			pending?.catch?.(error => console.warn('Native MIDI 2.0 send failed', port.name, error))
		} catch (error) {
			console.warn('Native MIDI 2.0 send failed', port.name, error)
		}
	}

	const output = {
		...port,
		type: 'output',
		connection: 'open',
		state: 'connected',
		sendUMP(words, timestamp = 0) {
			return sendUMP(this.id, Array.from(words), timestamp)
		},
		playNote(note, options = {}) {
			const notes = Array.isArray(note) ? note : [note]
			const channels = options?.channels === 'all' ? ALL_CHANNELS : resolveChannels(options)
			const velocity = resolveVelocity(options, ['attack', 'velocity'], 1)
			const rawVelocity = options?.rawAttack ?? options?.rawVelocity ?? (options?.rawValue ? velocity : null)
			for (const channel of channels) {
				for (const entry of notes) {
					dispatch(encodeUMPNoteOn(entry, { channel, velocity, rawVelocity }))
				}
			}
			return this
		},
		stopNote(note, options = {}) {
			const notes = Array.isArray(note) ? note : [note]
			const channels = options?.channels === 'all' ? ALL_CHANNELS : resolveChannels(options)
			const velocity = resolveVelocity(options, ['release', 'velocity'], 0)
			const rawVelocity = options?.rawRelease ?? options?.rawVelocity ?? (options?.rawValue ? velocity : null)
			for (const channel of channels) {
				for (const entry of notes) {
					dispatch(encodeUMPNoteOff(entry, { channel, velocity, rawVelocity }))
				}
			}
			return this
		},
		sendControlChange(controller, value, options = {}) {
			const channels = options?.channels === 'all' ? ALL_CHANNELS : resolveChannels(options)
			const rawValue = options?.rawValue !== false
			for (const channel of channels) {
				dispatch(encodeUMPControlChange(controller, value, { channel, rawValue }))
			}
			return this
		},
		sendPitchBend(value, options = {}) {
			const channels = options?.channels === 'all' ? ALL_CHANNELS : resolveChannels(options)
			for (const channel of channels) {
				dispatch(encodeUMPPitchBend(value, { channel }))
			}
			return this
		},
		setPitchBend(value, options = {}) {
			return this.sendPitchBend(value, options)
		},
		sendKeyAftertouch(note, pressure, options = {}) {
			const channels = options?.channels === 'all' ? ALL_CHANNELS : resolveChannels(options)
			for (const channel of channels) {
				dispatch(encodeUMPKeyAftertouch(note, pressure, { channel }))
			}
			return this
		},
		setKeyAftertouch(note, pressure, options = {}) {
			return this.sendKeyAftertouch(note, pressure, options)
		},
		sendProgramChange(program, options = {}) {
			const channels = options?.channels === 'all' ? ALL_CHANNELS : resolveChannels(options)
			for (const channel of channels) {
				dispatch(encodeUMPProgramChange(program, { channel }))
			}
			return this
		},
		sendClock() {
			dispatch(encodeUMPClock())
			return this
		},
		sendAllNotesOff(options = {}) {
			return this.sendControlChange(123, 0, { channels: 'all', ...options })
		},
		sendAllSoundOff(options = {}) {
			return this.sendControlChange(120, 0, { channels: 'all', ...options })
		},
		turnNotesOff(options = {}) {
			return this.sendAllNotesOff(options)
		},
		turnSoundOff(options = {}) {
			return this.sendAllSoundOff(options)
		},
		_update(nextPort) {
			this.name = nextPort.name
			this.manufacturer = nextPort.manufacturer
			this.version = nextPort.version
			this.nativeDataFormat = nextPort.nativeDataFormat ?? this.nativeDataFormat
			this.state = 'connected'
			this.connection = 'open'
			return this
		},
	}

	return output
}

export default class MIDIBridgeConnection extends MIDIConnection {
	connected = false
	inputPorts = []
	outputPorts = []
	inputPortMap = new Map()
	outputPortMap = new Map()
	disposeMessageListener = null
	disposePortsListener = null
	messagePort = null

	get inputs() {
		return this.connected ? this.inputPorts : []
	}

	get outputs() {
		return this.connected ? this.outputPorts : []
	}

	async connect(_port = 0, onUpdate = null) {
		const bridge = globalThis.electron?.midi
		if (!bridge?.available) throw new Error('Native Electron MIDI is unavailable')

		// Prefer direct MessagePort fast path for low-jitter UMP I/O when supported.
		let fastPort = null
		if (typeof bridge.openPortChannel === 'function') {
			try {
				fastPort = await requestElectronPort(bridge.openPortChannel, {
					service: 'midi',
					channel: 'ump',
					timeoutMs: 1500,
				})
				this.messagePort = fastPort
			} catch {
				fastPort = null
			}
		}

		const sendUMP = (portId, words, timestamp = 0) => {
			const arrayWords = Array.from(words)
			if (this.messagePort) {
				this.messagePort.postMessage({ type: 'send', portId, words: arrayWords, timestamp })
				return Promise.resolve(true)
			}
			return bridge.sendUMP(portId, arrayWords, timestamp)
		}

		const updatePorts = ports => {
			const nextInputIds = new Set()
			this.inputPorts = (ports?.inputs ?? []).map(raw => {
				nextInputIds.add(raw.id)
				const existing = this.inputPortMap.get(raw.id)
				if (existing) return existing._update(raw)
				const created = createNativeInputPort(raw)
				this.inputPortMap.set(raw.id, created)
				return created
			})
			for (const [id, port] of this.inputPortMap) {
				if (!nextInputIds.has(id)) {
					port.state = 'disconnected'
					this.inputPortMap.delete(id)
				}
			}

			const nextOutputIds = new Set()
			this.outputPorts = (ports?.outputs ?? []).map(raw => {
				nextOutputIds.add(raw.id)
				const existing = this.outputPortMap.get(raw.id)
				if (existing) return existing._update(raw)
				const created = createNativeOutputPort(raw, sendUMP)
				this.outputPortMap.set(raw.id, created)
				return created
			})
			for (const [id, port] of this.outputPortMap) {
				if (!nextOutputIds.has(id)) {
					port.state = 'disconnected'
					this.outputPortMap.delete(id)
				}
			}

			this.connected = true
			onUpdate?.({ type: 'statechange' }, this.inputs, this.outputs)
		}

		updatePorts(await bridge.getPorts())
		if (fastPort) {
			fastPort.addEventListener('message', event => {
				const data = event.data
				if (data?.type === 'message' && data.message) {
					const input = this.inputPortMap.get(data.message.endpointId)
					if (input) input._dispatchUMP(data.message)
				} else if (data?.type === 'ports-changed' && data.ports) {
					updatePorts(data.ports)
				}
			})
		} else {
			this.disposePortsListener = bridge.onPortsChanged(updatePorts)
			this.disposeMessageListener = bridge.onMessage(message => {
				const input = this.inputPortMap.get(message.endpointId)
				if (input) input._dispatchUMP(message)
			})
		}

		return this
	}

	async disconnect() {
		this.disposeMessageListener?.()
		this.disposePortsListener?.()
		this.disposeMessageListener = null
		this.disposePortsListener = null
		if (this.messagePort) {
			try { this.messagePort.close() } catch {}
			this.messagePort = null
		}
		for (const port of this.inputPortMap.values()) port.state = 'disconnected'
		for (const port of this.outputPortMap.values()) port.state = 'disconnected'
		this.inputPortMap.clear()
		this.outputPortMap.clear()
		this.inputPorts = []
		this.outputPorts = []
		this.connected = false
	}

	async sendUMP(portId, words, timestamp = 0) {
		const arrayWords = Array.from(words)
		if (this.messagePort) {
			this.messagePort.postMessage({ type: 'send', portId, words: arrayWords, timestamp })
			return true
		}
		return globalThis.electron.midi.sendUMP(portId, arrayWords, timestamp)
	}
}
