jest.mock('../source/storage/opfs.js', () => ({ __esModule: true, default: jest.fn() }))

import MIDIBridgeConnection from '../source/audio/midi/midi-connection-electron-bridge.js'
import ElectronStorageClient from '../source/storage/electron-storage.js'
import { createSessionStorage } from '../source/storage/session-recorder.js'
import { downloadBlob } from '../source/dom/download.js'
import { createElectronBackingMelodyModel } from '../source/audio/backing-melody-electron.js'
import { createElectronLanTimingClient } from '../source/network/lan-timing-client.js'

const createMockPortPair = () => {
	const makeEnd = () => {
		const listeners = new Set()
		return {
			peer: null,
			closed: false,
			started: false,
			start() { this.started = true },
			close() { this.closed = true },
			addEventListener(type, fn) { if (type === 'message') listeners.add(fn) },
			removeEventListener(type, fn) { if (type === 'message') listeners.delete(fn) },
			postMessage(data) {
				const target = this.peer
				if (!target || target.closed) return
				queueMicrotask(() => {
					for (const fn of target._listeners) fn({ data })
				})
			},
			_listeners: listeners,
		}
	}
	const port1 = makeEnd()
	const port2 = makeEnd()
	port1.peer = port2
	port2.peer = port1
	return { port1, port2 }
}

const dispatchElectronPort = (service, channel, token, port) => {
	queueMicrotask(() => {
		const event = new MessageEvent('message', {
			source: window,
			data: { __photosynthElectronPort: true, service, channel, token },
			ports: [port],
		})
		window.dispatchEvent(event)
	})
}

describe('Electron renderer MessagePort & desktop adapters', () => {
	afterEach(() => {
		delete globalThis.electron
	})

	test('MIDIBridgeConnection uses MessagePort fast path for UMP send and receive', async () => {
		const { port1, port2 } = createMockPortPair()
		const sentOverPort = []
		port1.addEventListener('message', ({ data }) => sentOverPort.push(data))

		const sendUMPFallback = jest.fn()
		globalThis.electron = {
			midi: {
				available: true,
				getPorts: jest.fn().mockResolvedValue({
					inputs: [{ id: 'in-1', name: 'Synth In', manufacturer: 'Test', version: '2.0', type: 'input' }],
					outputs: [{ id: 'out-1', name: 'Synth Out', manufacturer: 'Test', version: '2.0', type: 'output' }],
				}),
				sendUMP: sendUMPFallback,
				openPortChannel: token => dispatchElectronPort('midi', 'ump', token, port2),
				onMessage: jest.fn(() => () => {}),
				onPortsChanged: jest.fn(() => () => {}),
			},
		}

		const connection = new MIDIBridgeConnection()
		await connection.connect()

		const received = []
		connection.inputs[0].onumpmessage = msg => received.push(msg)

		connection.outputs[0].playNote(60, { channel: 1, velocity: 0.8 })
		await new Promise(resolve => setTimeout(resolve, 10))

		expect(sendUMPFallback).not.toHaveBeenCalled()
		expect(sentOverPort).toHaveLength(1)
		expect(sentOverPort[0]).toMatchObject({ type: 'send', portId: 'out-1' })

		port1.postMessage({
			type: 'message',
			message: { endpointId: 'in-1', timestamp: 123, words: [0x20903c64] },
		})
		await new Promise(resolve => setTimeout(resolve, 10))

		expect(received).toHaveLength(1)
		expect(received[0].endpointId).toBe('in-1')

		await connection.disconnect()
		expect(port2.closed).toBe(true)
	})

	test('ElectronStorageClient exchanges commands and reconstructs Blobs over MessagePort', async () => {
		const { port1, port2 } = createMockPortPair()
		port1.addEventListener('message', ({ data }) => {
			if (data.type === 'session:list') {
				port1.postMessage({ id: data.id, ok: true, result: [{ sessionId: 's1' }] })
			} else if (data.type === 'session:midi') {
				const bytes = new Uint8Array([0x4d, 0x54, 0x68, 0x64]).buffer
				port1.postMessage({
					id: data.id,
					ok: true,
					result: { __photosynthBlob: true, type: 'audio/midi', buffer: bytes },
				})
			}
		})

		const client = new ElectronStorageClient({
			openPortChannel: token => dispatchElectronPort('storage', 'sessions', token, port2),
		})

		const list = await client.send('session:list')
		expect(list).toEqual([{ sessionId: 's1' }])

		const midiBlob = await client.send('session:midi', { id: 's1' })
		expect(midiBlob).toBeInstanceOf(Blob)
		expect(midiBlob.type).toBe('audio/midi')
		expect(midiBlob.size).toBe(4)

		client.destroy()
		expect(port2.closed).toBe(true)
	})

	test('createSessionStorage selects ElectronStorageClient when Electron storage is available', () => {
		globalThis.electron = { storage: { available: true, openPortChannel: jest.fn() } }
		const storage = createSessionStorage()
		expect(storage).toBeInstanceOf(ElectronStorageClient)
		storage.destroy()
	})

	test('downloadBlob routes through Electron saveFile when available', async () => {
		const saveFile = jest.fn().mockResolvedValue({ saved: true, filePath: 'C:/tmp/test.mid' })
		globalThis.electron = { storage: { saveFile } }

		const blob = {
			type: 'audio/midi',
			arrayBuffer: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer),
		}
		const result = await downloadBlob(blob, 'test.mid')
		expect(saveFile).toHaveBeenCalledTimes(1)
		expect(saveFile.mock.calls[0][0]).toBe('test.mid')
		expect(saveFile.mock.calls[0][2]).toBe('audio/midi')
		expect(result).toEqual({ saved: true, filePath: 'C:/tmp/test.mid' })
	})

	test('createBackingMelodyModel uses Electron AI utility port when available', async () => {
		const { port1, port2 } = createMockPortPair()
		port1.addEventListener('message', ({ data }) => {
			if (data.type === 'initialize') {
				port1.postMessage({ id: data.id, ok: true, result: { ready: true } })
			} else if (data.type === 'generate') {
				port1.postMessage({ id: data.id, ok: true, result: { sequence: { notes: [{ pitch: 64 }] } } })
			}
		})

		const model = createElectronBackingMelodyModel(
			'./custom-checkpoint',
			token => dispatchElectronPort('ai', 'backing-melody', token, port2),
		)
		await model.initialize()
		const sequence = await model.generate({ notes: [] }, 'Cmaj')
		expect(sequence).toEqual({ notes: [{ pitch: 64 }] })
		model.destroy()
		expect(port2.closed).toBe(true)
	})

	test('createElectronLanTimingClient sends commands and receives events', async () => {
		const { port1, port2 } = createMockPortPair()
		port1.addEventListener('message', ({ data }) => {
			if (data.type === 'lan:host') {
				port1.postMessage({ id: data.id, ok: true, result: { roomId: data.payload.roomId, port: 41234, url: 'ws://192.168.1.5:41234' } })
				port1.postMessage({ type: 'lan:clients', count: 1 })
			}
		})

		const events = []
		const client = createElectronLanTimingClient({
			openPortChannel: token => dispatchElectronPort('network', 'lan-timing', token, port2),
		})
		client.onEvent(event => events.push(event))

		const hosted = await client.host('jam-room')
		expect(hosted.roomId).toBe('jam-room')
		await new Promise(resolve => setTimeout(resolve, 10))
		expect(events).toContainEqual({ type: 'lan:clients', count: 1 })
		client.destroy()
	})
})
