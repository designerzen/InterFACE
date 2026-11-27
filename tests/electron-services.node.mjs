import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import fsp from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import WebSocket from 'ws'

import { createNodeDirectoryHandle } from '../source/electron/services/storage-fs.ts'
import { createSessionStore } from '../source/storage/session-store.js'
import { encodeSessionEvents } from '../source/storage/session-format.js'
import { getMimeTypeForPath, resolveSafeChildPath } from '../source/electron/services/protocol-utils.ts'
import { matchesSerialFilters, NativeSerialManager } from '../source/electron/services/serial-backend.ts'
import { createBackingMelodyService } from '../source/electron/services/ai-worker.ts'
import { createLanTimingService } from '../source/electron/services/lan-timing-worker.ts'

test('protocol-utils resolves safe child paths and rejects traversal', () => {
	const root = path.resolve('/tmp/photosynth-root')
	assert.equal(resolveSafeChildPath(root, '/app.html'), path.join(root, 'app.html'))
	assert.equal(resolveSafeChildPath(root, '/assets/test.wasm'), path.join(root, 'assets', 'test.wasm'))
	assert.equal(resolveSafeChildPath(root, '/../../etc/passwd'), null)
	assert.equal(getMimeTypeForPath('vision.wasm'), 'application/wasm')
	assert.equal(getMimeTypeForPath('face_landmarker.task'), 'application/octet-stream')
})

test('storage-fs + createSessionStore persists, reads, exports MIDI, and removes a session', async () => {
	const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'photosynth-storage-'))
	try {
		const root = await createNodeDirectoryHandle(tempDir)
		const store = createSessionStore(async () => root)

		const manifest = {
			version: 2,
			sessionId: 'electron-session-1',
			eventFile: 'electron-session-1.events',
			mediaIndexFile: 'electron-session-1.media-index.jsonl',
			status: 'recording',
			tracks: { 0: { name: 'Lead', source: 'lead', channel: 0 } },
			takes: [],
			tempoMap: [{ time: 0, bpm: 120 }],
		}

		await store.begin({ manifest })
		const encoded = encodeSessionEvents([
			{ type: 'noteOn', note: 60, velocity: 0.9, channel: 0, time: 100, sequence: 0, track: 0 },
			{ type: 'noteOff', note: 60, velocity: 0, channel: 0, time: 500, sequence: 1, track: 0 },
		])
		const nextOffset = await store.appendEvents({ buffer: encoded, offset: 16 })
		assert.ok(nextOffset > 16)

		await store.finish({ ...manifest, status: 'stopped', durationMs: 600 })

		const listed = await store.list()
		assert.equal(listed.length, 1)
		assert.equal(listed[0].sessionId, 'electron-session-1')
		assert.ok(listed[0].storageBytes > 0)

		const windowResult = await store.noteWindow({ id: 'electron-session-1', from: 0, to: 1000 })
		assert.equal(windowResult.events.length, 2)
		assert.equal(windowResult.noteCount, 1)

		const midiBlob = await store.midi({ id: 'electron-session-1' })
		const midiBytes = new Uint8Array(await midiBlob.arrayBuffer())
		// Standard MIDI file header magic: MThd
		assert.deepEqual(Array.from(midiBytes.slice(0, 4)), [0x4d, 0x54, 0x68, 0x64])

		await store.remove({ id: 'electron-session-1' })
		assert.equal((await store.list()).length, 0)
	} finally {
		await fsp.rm(tempDir, { recursive: true, force: true })
	}
})

test('serial-backend filters Picade USB devices and handles open/write/data/close', async () => {
	assert.equal(matchesSerialFilters({ path: 'COM3', vendorId: 0x2e8a, productId: 0x1098 }), true)
	assert.equal(matchesSerialFilters({ path: 'COM4', vendorId: 0x1234, productId: 0x5678 }), false)

	const written = []
	class MockSerialPort extends EventEmitter {
		constructor(options) {
			super()
			this.options = options
			this.isOpen = false
		}
		static async list() {
			return [
				{ path: 'COM3', vendorId: '2e8a', productId: '1098', manufacturer: 'Pimoroni' },
				{ path: 'COM9', vendorId: '0001', productId: '0002', manufacturer: 'Other' },
			]
		}
		open(cb) {
			this.isOpen = true
			cb(null)
		}
		write(buf, cb) {
			written.push(Buffer.from(buf))
			cb(null)
		}
		close(cb) {
			this.isOpen = false
			this.emit('close')
			cb(null)
		}
	}

	const manager = new NativeSerialManager({ SerialPort: MockSerialPort })
	assert.equal(manager.available, true)

	const ports = await manager.listPorts()
	assert.equal(ports.length, 1)
	assert.equal(ports[0].path, 'COM3')

	const received = []
	await manager.open('COM3', 115200, chunk => received.push(Array.from(chunk)))
	await manager.write('COM3', new Uint8Array([1, 2, 3]))
	assert.deepEqual(Array.from(written[0]), [1, 2, 3])
	await manager.closeAll()
})

test('ai-worker backing melody service initializes, generates, and cleans up', async () => {
	let initCalls = 0
	const service = createBackingMelodyService({
		loadRuntime: async () => {
			initCalls++
			return {
				async continueSequence(seed, steps, temp, chords) {
					return { notes: [{ pitch: 67, chord: chords[0], steps }] }
				},
			}
		},
	})

	const initResult = await service.handle({ type: 'initialize', checkpoint: './test-ckpt' })
	assert.deepEqual(initResult, { ready: true })

	const genResult = await service.handle({ type: 'generate', checkpoint: './test-ckpt', seed: { notes: [] }, chord: 'G7' })
	assert.equal(initCalls, 1)
	assert.equal(genResult.sequence.notes[0].pitch, 67)
	assert.equal(genResult.sequence.notes[0].chord, 'G7')

	await service.handle({ type: 'destroy' })
})

test('lan-timing-worker hosts a WebSocket relay and broadcasts messages to peers', async () => {
	const mockBonjour = () => ({
		publish: () => ({ stop() {} }),
		find: () => new EventEmitter(),
		destroy() {},
	})

	const service = createLanTimingService({ createBonjour: mockBonjour })
	try {
		const info = await service.host('test-jam-room', 0)
		assert.equal(info.roomId, 'test-jam-room')
		assert.ok(info.port > 0)

		const client = new WebSocket(`ws://127.0.0.1:${info.port}`)
		await new Promise((resolve, reject) => {
			client.once('open', resolve)
			client.once('error', reject)
		})

		const messagePromise = new Promise(resolve => client.once('message', raw => resolve(raw.toString('utf8'))))
		const { sent } = service.broadcast({ type: 'tempo', bpm: 128 })
		assert.equal(sent, 1)
		assert.equal(await messagePromise, JSON.stringify({ type: 'tempo', bpm: 128 }))

		client.close()
	} finally {
		await service.destroy()
	}
})
