// OPFS worker.
//
// Stores noteOn / noteOff commands (and arbitrary blobs) in the
// Origin Private File System using a synchronous access handle for
// fast, append-only writes.
//
// Note events are written as fixed 12-byte records:
//   offset 0  : float64  time     (ms since recording start)
//   offset 8  : uint8    status   (0 = noteOff, 1 = noteOn)
//   offset 9  : uint8    note     (MIDI note number 0-127)
//   offset 10 : uint8    velocity (0-127)
//   offset 11 : uint8    channel  (0-15)

const RECORD_SIZE = 12

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

let opfsRoot = null

// Map<fileName, { handle, accessHandle, offset }>
const openFiles = new Map()

const ensureRoot = async () => {
	if (!opfsRoot) {
		opfsRoot = await navigator.storage.getDirectory()
	}
	return opfsRoot
}

const openFile = async (name, { append = false } = {}) => {
	if (openFiles.has(name)) {
		await closeFile(name)
	}
	const root = await ensureRoot()
	const handle = await root.getFileHandle(name, { create: true })
	const accessHandle = await handle.createSyncAccessHandle()
	let offset = 0
	if (append) {
		offset = accessHandle.getSize()
	} else {
		accessHandle.truncate(0)
	}
	openFiles.set(name, { handle, accessHandle, offset })
	return { name, size: offset }
}

const closeFile = async (name) => {
	const entry = openFiles.get(name)
	if (!entry) return
	try { entry.accessHandle.flush() } catch (e) {}
	try { entry.accessHandle.close() } catch (e) {}
	openFiles.delete(name)
}

const closeAll = async () => {
	for (const name of [...openFiles.keys()]) {
		await closeFile(name)
	}
}

const requireFile = (name) => {
	const entry = openFiles.get(name)
	if (!entry) {
		throw new Error(`OPFS file "${name}" is not open - call open() first`)
	}
	return entry
}

const writeNoteEvent = (name, status, time, note, velocity, channel) => {
	const entry = requireFile(name)
	const buffer = new ArrayBuffer(RECORD_SIZE)
	const view = new DataView(buffer)
	view.setFloat64(0, time, true)
	view.setUint8(8, status & 0xff)
	view.setUint8(9, note & 0x7f)
	view.setUint8(10, velocity & 0x7f)
	view.setUint8(11, channel & 0x0f)
	entry.accessHandle.write(buffer, { at: entry.offset })
	entry.offset += RECORD_SIZE
}

const writeNoteEvents = (name, events) => {
	const entry = requireFile(name)
	const buffer = new ArrayBuffer(events.length * RECORD_SIZE)
	const view = new DataView(buffer)
	for (let i = 0; i < events.length; i++) {
		const e = events[i]
		const o = i * RECORD_SIZE
		view.setFloat64(o, e.time, true)
		view.setUint8(o + 8, (e.status === 'noteOn' || e.status === 1) ? 1 : 0)
		view.setUint8(o + 9, e.note & 0x7f)
		view.setUint8(o + 10, (e.velocity ?? 0) & 0x7f)
		view.setUint8(o + 11, (e.channel ?? 0) & 0x0f)
	}
	entry.accessHandle.write(buffer, { at: entry.offset })
	entry.offset += buffer.byteLength
}

const readNoteEvents = (name) => {
	const entry = requireFile(name)
	const size = entry.accessHandle.getSize()
	const count = Math.floor(size / RECORD_SIZE)
	const buffer = new ArrayBuffer(size)
	entry.accessHandle.read(buffer, { at: 0 })
	const view = new DataView(buffer)
	const events = new Array(count)
	for (let i = 0; i < count; i++) {
		const o = i * RECORD_SIZE
		events[i] = {
			time: view.getFloat64(o, true),
			status: view.getUint8(o + 8) === 1 ? 'noteOn' : 'noteOff',
			note: view.getUint8(o + 9),
			velocity: view.getUint8(o + 10),
			channel: view.getUint8(o + 11)
		}
	}
	return events
}

const writeText = (name, text, { append = false } = {}) => {
	const entry = requireFile(name)
	const bytes = textEncoder.encode(text)
	const at = append ? entry.accessHandle.getSize() : 0
	if (!append) entry.accessHandle.truncate(0)
	entry.accessHandle.write(bytes, { at })
	entry.offset = at + bytes.byteLength
	entry.accessHandle.flush()
}

const readText = (name) => {
	const entry = requireFile(name)
	const size = entry.accessHandle.getSize()
	const buffer = new ArrayBuffer(size)
	entry.accessHandle.read(buffer, { at: 0 })
	return textDecoder.decode(buffer)
}

const flushFile = (name) => {
	const entry = requireFile(name)
	entry.accessHandle.flush()
}

const clearFile = (name) => {
	const entry = requireFile(name)
	entry.accessHandle.truncate(0)
	entry.accessHandle.flush()
	entry.offset = 0
}

const sizeFile = (name) => requireFile(name).accessHandle.getSize()

const deleteFile = async (name) => {
	if (openFiles.has(name)) await closeFile(name)
	const root = await ensureRoot()
	await root.removeEntry(name).catch(() => {})
}

const listFiles = async () => {
	const root = await ensureRoot()
	const names = []
	for await (const [name] of root.entries()) {
		names.push(name)
	}
	return names
}

self.addEventListener('message', async (event) => {
	const { id, type, payload = {} } = event.data || {}
	try {
		let result
		switch (type) {
			case 'open':
				result = await openFile(payload.name, { append: payload.append })
				break
			case 'close':
				await closeFile(payload.name)
				break
			case 'closeAll':
				await closeAll()
				break
			case 'noteOn':
				writeNoteEvent(payload.name, 1, payload.time, payload.note, payload.velocity ?? 127, payload.channel ?? 0)
				break
			case 'noteOff':
				writeNoteEvent(payload.name, 0, payload.time, payload.note, payload.velocity ?? 0, payload.channel ?? 0)
				break
			case 'writeNoteEvents':
				writeNoteEvents(payload.name, payload.events)
				break
			case 'readNoteEvents':
				result = readNoteEvents(payload.name)
				break
			case 'writeText':
				writeText(payload.name, payload.text, { append: payload.append })
				break
			case 'readText':
				result = readText(payload.name)
				break
			case 'flush':
				flushFile(payload.name)
				break
			case 'clear':
				clearFile(payload.name)
				break
			case 'size':
				result = sizeFile(payload.name)
				break
			case 'delete':
				await deleteFile(payload.name)
				break
			case 'list':
				result = await listFiles()
				break
			default:
				throw new Error(`Unknown OPFS worker message type: ${type}`)
		}
		self.postMessage({ id, ok: true, result })
	} catch (error) {
		self.postMessage({ id, ok: false, error: error.message })
	}
})
