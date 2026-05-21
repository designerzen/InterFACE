import OPFSWorker from 'worker:./opfs-worker.js'

const now = () => performance.now()

/**
 * StorageOPFS
 *
 * Adapter for storing data in the user's Origin Private File System (OPFS).
 * All disk I/O happens inside a Worker that uses synchronous access handles
 * for low-latency append-only writes - well suited to recording streams of
 * MIDI noteOn / noteOff commands without blocking the main thread.
 *
 * Each open file is identified by name. The worker keeps the underlying
 * sync access handle alive between calls, so always call `open()` before
 * writing/reading and `close()` when finished.
 *
 * Example:
 *   const storage = new StorageOPFS()
 *   await storage.open('session.bin')
 *   storage.startRecording()
 *   storage.noteOn(60, 100)
 *   storage.noteOff(60)
 *   const events = await storage.readNoteEvents()
 *   await storage.close()
 */
export default class StorageOPFS {

	constructor( options = {} ) {
		this.defaultFile = options.fileName ?? 'notes.bin'
		this.worker = new Worker(OPFSWorker, { type: 'module' })
		this.pending = new Map()
		this.messageId = 0
		this.startTime = now()
		this.isRecording = false
		this.openFile = null

		this.worker.addEventListener('message', (event) => {
			const { id, ok, result, error } = event.data || {}
			const handler = this.pending.get(id)
			if (!handler) return
			this.pending.delete(id)
			if (ok) handler.resolve(result)
			else handler.reject(new Error(error))
		})

		this.worker.addEventListener('error', (event) => {
			console.error('OPFS worker error:', event.message)
		})
	}

	/**
	 * Send a request to the worker and await its reply.
	 * @param {string} type
	 * @param {object} [payload]
	 */
	send(type, payload = {}) {
		const id = ++this.messageId
		return new Promise((resolve, reject) => {
			this.pending.set(id, { resolve, reject })
			this.worker.postMessage({ id, type, payload })
		})
	}

	// --- file lifecycle -----------------------------------------------------

	/**
	 * Open (or create) a file in OPFS. Required before any read/write call.
	 * @param {string} [name]
	 * @param {object} [opts]
	 * @param {boolean} [opts.append=false] keep existing data and append to it
	 */
	async open(name = this.defaultFile, { append = false } = {}) {
		this.openFile = name
		return this.send('open', { name, append })
	}

	/**
	 * Close the named (or current) file, flushing any buffered writes.
	 */
	async close(name = this.openFile) {
		const result = await this.send('close', { name })
		if (name === this.openFile) {
			this.openFile = null
			this.isRecording = false
		}
		return result
	}

	/** Close every open file. */
	closeAll() {
		this.openFile = null
		this.isRecording = false
		return this.send('closeAll')
	}

	/** Permanently delete a file from OPFS. */
	delete(name = this.openFile) {
		return this.send('delete', { name })
	}

	/** List every entry in the OPFS root. */
	list() {
		return this.send('list')
	}

	// --- note recording -----------------------------------------------------

	/** Mark "now" as t=0 for subsequent note events. */
	startRecording() {
		this.startTime = now()
		this.isRecording = true
	}

	stopRecording() {
		this.isRecording = false
	}

	/**
	 * Record a noteOn command.
	 * @param {number} note     MIDI note 0-127
	 * @param {number} [velocity=127]
	 * @param {number} [channel=0]
	 * @param {number} [time]   optional explicit timestamp in ms (relative to start)
	 */
	noteOn(note, velocity = 127, channel = 0, time) {
		const t = time ?? (now() - this.startTime)
		return this.send('noteOn', {
			name: this.openFile,
			time: t, note, velocity, channel
		})
	}

	/**
	 * Record a noteOff command.
	 */
	noteOff(note, velocity = 0, channel = 0, time) {
		const t = time ?? (now() - this.startTime)
		return this.send('noteOff', {
			name: this.openFile,
			time: t, note, velocity, channel
		})
	}

	/**
	 * Append a batch of pre-built note events.
	 * @param {Array<{time:number,status:('noteOn'|'noteOff'),note:number,velocity?:number,channel?:number}>} events
	 */
	writeNoteEvents(events) {
		return this.send('writeNoteEvents', { name: this.openFile, events })
	}

	/**
	 * Read back every recorded note event from the open file.
	 * @returns {Promise<Array<{time:number,status:string,note:number,velocity:number,channel:number}>>}
	 */
	readNoteEvents() {
		return this.send('readNoteEvents', { name: this.openFile })
	}

	// --- generic save / load ------------------------------------------------

	/**
	 * Save arbitrary data (string or JSON-serialisable value) to a file.
	 * @param {*} data
	 * @param {string} [name]
	 */
	async save(data, name = this.openFile ?? this.defaultFile) {
		const wasOpen = this.openFile === name
		if (!wasOpen) await this.open(name)
		const text = typeof data === 'string' ? data : JSON.stringify(data)
		await this.send('writeText', { name, text, append: false })
		if (!wasOpen) await this.close(name)
	}

	/**
	 * Load text (or parsed JSON) from a file.
	 * @param {string} [name]
	 * @param {object} [opts]
	 * @param {boolean} [opts.json=false] parse the file contents as JSON
	 */
	async load(name = this.openFile ?? this.defaultFile, { json = false } = {}) {
		const wasOpen = this.openFile === name
		if (!wasOpen) await this.open(name, { append: true })
		const text = await this.send('readText', { name })
		if (!wasOpen) await this.close(name)
		return json ? JSON.parse(text) : text
	}

	// --- maintenance --------------------------------------------------------

	/** Force a flush of buffered writes to disk. */
	flush(name = this.openFile) {
		return this.send('flush', { name })
	}

	/** Truncate the open file back to zero bytes and reset the recording clock. */
	clear(name = this.openFile) {
		this.startTime = now()
		return this.send('clear', { name })
	}

	/** Get the current size of the open file, in bytes. */
	size(name = this.openFile) {
		return this.send('size', { name })
	}

	/** Tear down the worker. */
	destroy() {
		this.worker.terminate()
		this.pending.clear()
		this.openFile = null
		this.isRecording = false
	}
}
