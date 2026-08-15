import MIDIConnection from './midi-connection.js'

const normalisePort = port => ({
	...port,
	connection: 'open',
	state: 'connected',
})

export default class MIDIBridgeConnection extends MIDIConnection {
	connected = false
	inputPorts = []
	outputPorts = []
	disposeMessageListener = null
	disposePortsListener = null

	get inputs() {
		return this.connected ? this.inputPorts : []
	}

	get outputs() {
		return this.connected ? this.outputPorts : []
	}

	async connect(_port = 0, onUpdate = null) {
		const bridge = globalThis.electron?.midi
		if (!bridge?.available) throw new Error('Native Electron MIDI is unavailable')

		const updatePorts = ports => {
			this.inputPorts = (ports.inputs ?? []).map(normalisePort)
			this.outputPorts = (ports.outputs ?? []).map(normalisePort)
			this.connected = true
			onUpdate?.({ type: 'statechange' }, this.inputs, this.outputs)
		}

		updatePorts(await bridge.getPorts())
		this.disposePortsListener = bridge.onPortsChanged(updatePorts)
		this.disposeMessageListener = bridge.onMessage(message => {
			for (const input of this.inputPorts) {
				if (input.id === message.endpointId) input.onumpmessage?.(message)
			}
		})

		return this
	}

	async disconnect() {
		this.disposeMessageListener?.()
		this.disposePortsListener?.()
		this.connected = false
	}

	async sendUMP(portId, words, timestamp = 0) {
		return globalThis.electron.midi.sendUMP(portId, Array.from(words), timestamp)
	}
}
