/**
 * Pixel Multiverse - WebSerial LED Controller
 * JavaScript port of https://github.com/elaurijssens/pixel-multiverse
 * Controls LED buttons and LED matrices via WebSerial API
 * 
 * Protocol: 115200 baud, prefix "multiverse:data" + raw pixel bytes
 * Buttons: 4 bytes per LED (B, G, R, brightness) - brightness max 31
 * Matrix: 4 bytes per pixel (R, G, B, brightness) - reordered by color_order
 */

const PREFIX = new TextEncoder().encode('multiverse:data')
const COMPRESSED_PREFIX = new TextEncoder().encode('multiverse:zdat')

const BAUD_RATE = 115200
const COLOR_MASK = 0xFF
const BRIGHTNESS_MASK = 0x1F
export const PICADE_MAX_BUTTON_FRAME_LEDS = 128
export const PICADE_MAX_BUTTON_LED_GROUP_SIZE = 4
export const PICADE_MAX_BUTTONS = 6
export const PICADE_MAX_LOGICAL_LEDS = PICADE_MAX_BUTTONS * PICADE_MAX_BUTTON_LED_GROUP_SIZE

// Display types
export const DISPLAY_GALACTIC_UNICORN = 0
export const DISPLAY_INTERSTATE75_128x32 = 1

const DISPLAY_SIZES = {
	[DISPLAY_GALACTIC_UNICORN]: [53, 11],
	[DISPLAY_INTERSTATE75_128x32]: [128, 32]
}

// Color order permutations
export const COLOR_ORDER_RGB = [0, 1, 2]
export const COLOR_ORDER_RBG = [0, 2, 1]
export const COLOR_ORDER_GBR = [1, 2, 0]
export const COLOR_ORDER_GRB = [1, 0, 2]
export const COLOR_ORDER_BGR = [2, 1, 0]
export const COLOR_ORDER_BRG = [2, 0, 1]

/**
 * @typedef {Object} RGBl
 * @property {number} red
 * @property {number} green
 * @property {number} blue
 * @property {number} brightness
 */

/**
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number} brightness
 * @returns {RGBl}
 */
export function RGBl(red, green, blue, brightness) {
	return { red, green, blue, brightness }
}

const OFF = RGBl(0, 0, 0, 0)

/**
 * Base class for WebSerial connection management
 */
class SerialDevice {

	#port = null
	#writer = null
	#reader = null
	#readAbort = null
	#connected = false
	#decoder = new TextDecoder()
	#listeners = { data: [], error: [], connect: [], disconnect: [], tx: [] }
	#writeCount = 0
	#readCount = 0
	#lastError = null

	constructor() {
	}

	get connected() {
		return this.#connected
	}

	get stats() {
		return {
			connected: this.#connected,
			bytesWritten: this.#writeCount,
			bytesRead: this.#readCount,
			lastError: this.#lastError
		}
	}

	get portInfo() {
		if (!this.#port) return null
		const info = this.#port.getInfo()
		return {
			vendorId: info.usbVendorId,
			productId: info.usbProductId
		}
	}

	on(event, callback) {
		if (this.#listeners[event]) this.#listeners[event].push(callback)
		return this
	}

	off(event, callback) {
		if (this.#listeners[event]) {
			this.#listeners[event] = this.#listeners[event].filter(cb => cb !== callback)
		}
		return this
	}

	#emit(event, data) {
		if (this.#listeners[event]) {
			for (const cb of this.#listeners[event]) cb(data)
		}
	}

	async connect(filters) {
		this.#port = await navigator.serial.requestPort({ filters })
		await this.#port.open({ baudRate: BAUD_RATE })
		this.#writer = this.#port.writable.getWriter()
		this.#connected = true
		this.#writeCount = 0
		this.#readCount = 0
		this.#lastError = null

		const info = this.#port.getInfo()
		this.#emit('connect', {
			vendorId: info.usbVendorId,
			productId: info.usbProductId
		})

		this.#startReading()
	}

	async disconnect() {
		this.#connected = false
		if (this.#readAbort) {
			this.#readAbort.abort()
			this.#readAbort = null
		}
		if (this.#reader) {
			try { this.#reader.releaseLock() } catch {}
			this.#reader = null
		}
		if (this.#writer) {
			this.#writer.releaseLock()
			this.#writer = null
		}
		if (this.#port) {
			await this.#port.close()
			this.#port = null
		}
		this.#emit('disconnect', null)
	}

	async #startReading() {
		if (!this.#port?.readable) return
		this.#readAbort = new AbortController()

		try {
			this.#reader = this.#port.readable.getReader()
			while (this.#connected) {
				const { value, done } = await this.#reader.read()
				if (done) break
				if (value) {
					this.#readCount += value.length
					const text = this.#decoder.decode(value, { stream: true })
					this.#emit('data', { raw: value, text, length: value.length })
				}
			}
		} catch (e) {
			if (e.name !== 'AbortError') {
				this.#lastError = e.message
				this.#emit('error', { message: e.message, error: e })
			}
		} finally {
			if (this.#reader) {
				try { this.#reader.releaseLock() } catch {}
				this.#reader = null
			}
		}
	}

	async _write(data) {
		if (!this.#writer) return
		try {
			await this.#writer.write(data)
			this.#writeCount += data.length
			this.#emit('tx', { raw: data, length: data.length })
		} catch (e) {
			this.#lastError = e.message
			this.#emit('error', { message: e.message, error: e })
		}
	}

	async _sendWithPrefix(buffer) {
		const packet = new Uint8Array(PREFIX.length + buffer.length)
		packet.set(PREFIX, 0)
		packet.set(buffer, PREFIX.length)
		await this._write(packet)
	}

	async sendRaw(data) {
		if (data instanceof String || typeof data === 'string') {
			data = new TextEncoder().encode(data)
		}
		await this._write(data instanceof Uint8Array ? data : new Uint8Array(data))
	}
}

// ─── PlasmaButtons ─────────────────────────────────────────────────────────────

class LEDStatus {
	constructor() {
		this.mode = 'normal'
		this.colorFrom = OFF
		this.colorTo = OFF
		this.transitionTime = 0
		this.ticksSinceLastTransition = 0
	}
}

export class PlasmaButtons extends SerialDevice {

	#ledBuffer
	#ledStatuses
	#rafId = null
	#attractAbort = null
	#buttonLedGroupSize
	#flashTimers = new Map()

	/**
	 * @param {number} numLeds
	 * @param {Object} [options]
	 * @param {number} [options.refreshRate=20]
	 * @param {number} [options.packetLedCount=numLeds]
	 * @param {number} [options.buttonLedGroupSize=4]
	 * @param {Object} [options.buttonMap]
	 * @param {Object} [options.coordMap]
	 */
	constructor(numLeds, { refreshRate = 20, packetLedCount = numLeds, buttonLedGroupSize = PICADE_MAX_BUTTON_LED_GROUP_SIZE, buttonMap = {}, coordMap = {} } = {}) {
		super()
		this.numLeds = numLeds
		this.refreshRate = refreshRate
		this.packetLedCount = Math.max(numLeds, packetLedCount)
		this.packetByteLength = this.packetLedCount * 4
		this.maxFrameRate = Math.floor(BAUD_RATE / ((PREFIX.length + this.packetByteLength) * 10))
		this.buttonMap = buttonMap
		this.coordMap = coordMap
		this.#buttonLedGroupSize = buttonLedGroupSize
		this.#ledBuffer = new Uint8Array(this.packetByteLength)
		this.#ledStatuses = Array.from({ length: numLeds }, () => new LEDStatus())
	}

	async connect(filters) {
		await super.connect(filters)
		this.#startRefreshLoop()
	}

	async disconnect() {
		this.stopRefresh()
		this.stopAttractMode()
		this.clearFlashEffects()
		await super.disconnect()
	}

	// ── LED mode setters ──────────────────────────────────────────────────────

	setLedMode(ledNumber, mode, { colorTo, colorFrom, transitionTime } = {}) {
		const status = this.#ledStatuses[ledNumber]
		if (!status) return
		status.mode = mode
		status.ticksSinceLastTransition = 0

		if (mode === 'normal') {
			status.colorTo = colorTo || OFF
		} else {
			if (colorTo) status.colorTo = colorTo
			if (colorFrom) status.colorFrom = colorFrom
			if (transitionTime != null) status.transitionTime = transitionTime
		}
	}

	setAllLeds(mode = 'normal', options = {}) {
		for (let i = 0; i < this.numLeds; i++) {
			this.setLedMode(i, mode, options)
		}
	}

	setLedModeByCoord(coord, mode, options = {}) {
		const key = `${coord[0]},${coord[1]}`
		const ledNumber = this.coordMap[key]
		if (ledNumber != null) this.setLedMode(ledNumber, mode, options)
	}

	setButtonMode(buttonNumber, mode, options = {}) {
		const start = buttonNumber * this.#buttonLedGroupSize
		const end = start + this.#buttonLedGroupSize
		for (let i = start; i < end && i < this.numLeds; i++) {
			this.setLedMode(i, mode, options)
		}
	}

	setButtonModeByLabel(label, mode, options = {}) {
		const buttonNumber = this.buttonMap[label]
		if (buttonNumber != null) this.setButtonMode(buttonNumber, mode, options)
	}

	triggerLedFade(ledNumber, color, { holdTime = 0, fadeTime = 0.35, colorFrom = OFF } = {}) {
		if (ledNumber < 0 || ledNumber >= this.numLeds) return
		this.#clearFlashTimer(`led:${ledNumber}`)
		this.setLedMode(ledNumber, 'normal', { colorTo: color })
		this.#flashTimers.set(`led:${ledNumber}`, setTimeout(() => {
			this.setLedMode(ledNumber, 'fade', {
				colorFrom: color,
				colorTo: colorFrom,
				transitionTime: fadeTime
			})
			this.#flashTimers.delete(`led:${ledNumber}`)
		}, Math.max(0, holdTime) * 1000))
	}

	triggerButtonFade(buttonNumber, color, options = {}) {
		const start = buttonNumber * this.#buttonLedGroupSize
		const end = start + this.#buttonLedGroupSize
		for (let i = start; i < end && i < this.numLeds; i++) {
			this.triggerLedFade(i, color, options)
		}
	}

	triggerButtonFadeByLabel(label, color, options = {}) {
		const buttonNumber = this.buttonMap[label]
		if (buttonNumber != null) this.triggerButtonFade(buttonNumber, color, options)
	}

	clearFlashEffects() {
		for (const key of this.#flashTimers.keys()) {
			this.#clearFlashTimer(key)
		}
	}

	// ── Color calculation ─────────────────────────────────────────────────────

	#calculateColor(ledNumber) {
		const s = this.#ledStatuses[ledNumber]
		const ticks = s.ticksSinceLastTransition

		if (s.mode === 'normal') return s.colorTo

		const cycleLength = this.refreshRate * s.transitionTime

		if (s.mode === 'blink') {
			return (ticks % cycleLength) < (cycleLength / 2) ? s.colorTo : s.colorFrom
		}

		if (s.mode === 'fade') {
			if (ticks >= cycleLength) {
				this.setLedMode(ledNumber, 'normal', { colorTo: s.colorTo })
				return s.colorTo
			}
			return this.#lerpColor(s.colorFrom, s.colorTo, ticks / cycleLength)
		}

		if (s.mode === 'fade sweep') {
			if (ticks >= cycleLength) {
				s.ticksSinceLastTransition = 0
				return s.colorFrom
			}
			const half = cycleLength / 2
			const ratio = ticks < half ? ticks / half : (cycleLength - ticks) / half
			return this.#lerpColor(s.colorFrom, s.colorTo, ratio)
		}

		return s.colorTo
	}

	#lerpColor(from, to, ratio) {
		return RGBl(
			Math.trunc(from.red + (to.red - from.red) * ratio),
			Math.trunc(from.green + (to.green - from.green) * ratio),
			Math.trunc(from.blue + (to.blue - from.blue) * ratio),
			Math.trunc(from.brightness + (to.brightness - from.brightness) * ratio)
		)
	}

	// ── Refresh loop ──────────────────────────────────────────────────────────

	#updateLedColors() {
		for (let i = 0; i < this.numLeds; i++) {
			this.#ledStatuses[i].ticksSinceLastTransition++
			const color = this.#calculateColor(i)
			const idx = i * 4
			this.#ledBuffer[idx] = color.blue & COLOR_MASK
			this.#ledBuffer[idx + 1] = color.green & COLOR_MASK
			this.#ledBuffer[idx + 2] = color.red & COLOR_MASK
			this.#ledBuffer[idx + 3] = color.brightness & BRIGHTNESS_MASK
		}
	}

	async writeToDisplay() {
		await this._sendWithPrefix(this.getPreviewBuffer())
	}

	getPreviewBuffer() {
		this.#updateLedColors()
		return this.#ledBuffer
	}

	getPacket() {
		const buffer = this.getPreviewBuffer()
		const packet = new Uint8Array(PREFIX.length + buffer.length)
		packet.set(PREFIX, 0)
		packet.set(buffer, PREFIX.length)
		return packet
	}

	#startRefreshLoop() {
		const interval = 1000 / this.refreshRate
		let last = 0

		const loop = async (now) => {
			this.#rafId = requestAnimationFrame(loop)
			if (now - last < interval) return
			last = now
			await this.writeToDisplay()
		}

		this.#rafId = requestAnimationFrame(loop)
	}

	stopRefresh() {
		if (this.#rafId) {
			cancelAnimationFrame(this.#rafId)
			this.#rafId = null
		}
	}

	#clearFlashTimer(key) {
		const timer = this.#flashTimers.get(key)
		if (timer) {
			clearTimeout(timer)
			this.#flashTimers.delete(key)
		}
	}

	// ── Attract mode ──────────────────────────────────────────────────────────

	async startAttractMode(patternQueue) {
		this.stopAttractMode()
		const controller = new AbortController()
		this.#attractAbort = controller

		const patterns = {
			linear: (p) => this.#patternLinear(p, controller.signal),
			radial: (p) => this.#patternRadial(p, controller.signal),
			circular: (p) => this.#patternCircular(p, controller.signal),
		}

		let index = 0
		while (!controller.signal.aborted) {
			const [name, params] = patternQueue[index]
			const fn = patterns[name]
			if (fn) await fn(params)
			index = (index + 1) % patternQueue.length
		}
	}

	stopAttractMode() {
		if (this.#attractAbort) {
			this.#attractAbort.abort()
			this.#attractAbort = null
		}
	}

	get attractModeActive() {
		return this.#attractAbort && !this.#attractAbort.signal.aborted
	}

	// ── Attract patterns ──────────────────────────────────────────────────────

	async #delay(ms, signal) {
		return new Promise((resolve, reject) => {
			if (signal.aborted) return reject(new DOMException('Aborted', 'AbortError'))
			const id = setTimeout(resolve, ms)
			signal.addEventListener('abort', () => { clearTimeout(id); reject(new DOMException('Aborted', 'AbortError')) }, { once: true })
		}).catch(e => { if (e.name !== 'AbortError') throw e })
	}

	async #patternLinear({ direction, colorOn = RGBl(31, 31, 31, 5), colorOff, delay = 50 }, signal) {
		const coords = Object.keys(this.coordMap).map(k => k.split(',').map(Number))
		const xs = [...new Set(coords.map(c => c[0]))].sort((a, b) => a - b)
		const ys = [...new Set(coords.map(c => c[1]))].sort((a, b) => a - b)

		let outerRange, innerRange, outerIdx, innerIdx
		if (direction === 'left_to_right' || direction === 'right_to_left') {
			outerRange = direction === 'right_to_left' ? [...xs].reverse() : xs
			innerRange = ys
			outerIdx = 0; innerIdx = 1
		} else {
			outerRange = direction === 'bottom_to_top' ? [...ys].reverse() : ys
			innerRange = xs
			outerIdx = 1; innerIdx = 0
		}

		if (colorOff) this.setAllLeds('normal', { colorTo: colorOff })

		for (const outer of outerRange) {
			if (signal.aborted) return
			for (const inner of innerRange) {
				const coord = [0, 0]
				coord[outerIdx] = outer
				coord[innerIdx] = inner
				this.setLedModeByCoord(coord, 'normal', { colorTo: colorOn })
			}
			await this.#delay(delay, signal)
		}
		await this.#delay(200, signal)
	}

	async #patternCircular({ direction, colorOn = RGBl(31, 31, 31, 5), colorOff = OFF, delay = 50 }, signal) {
		const coords = Object.keys(this.coordMap).map(k => k.split(',').map(Number))
		const xs = coords.map(c => c[0])
		const ys = coords.map(c => c[1])
		const cx = (Math.min(...xs) + Math.max(...xs)) / 2
		const cy = (Math.min(...ys) + Math.max(...ys)) / 2

		const withDist = coords.map(c => ({ coord: c, dist: Math.hypot(c[0] - cx, c[1] - cy) }))
		const maxDist = Math.max(...withDist.map(d => d.dist))
		const steps = Math.floor(maxDist) + 1
		const range = direction === 'inward'
			? Array.from({ length: steps }, (_, i) => steps - 1 - i)
			: Array.from({ length: steps }, (_, i) => i)

		if (colorOff) this.setAllLeds('normal', { colorTo: colorOff })

		for (const step of range) {
			if (signal.aborted) return
			for (const { coord, dist } of withDist) {
				if (Math.floor(dist) === step) {
					this.setLedModeByCoord(coord, 'normal', { colorTo: colorOn })
				}
			}
			await this.#delay(delay, signal)
		}
	}

	async #patternRadial({ direction, colorOn = RGBl(31, 31, 0, 5), colorOff = OFF, delay = 50 }, signal) {
		const coords = Object.keys(this.coordMap).map(k => k.split(',').map(Number))
		const xs = coords.map(c => c[0])
		const ys = coords.map(c => c[1])
		const cx = (Math.min(...xs) + Math.max(...xs)) / 2
		const cy = (Math.min(...ys) + Math.max(...ys)) / 2

		const withAngle = coords.map(c => ({
			coord: c,
			angle: (Math.atan2(c[1] - cy, c[0] - cx) + 2 * Math.PI) % (2 * Math.PI)
		}))

		withAngle.sort((a, b) => direction === 'anticlockwise' ? b.angle - a.angle : a.angle - b.angle)

		if (colorOff) this.setAllLeds('normal', { colorTo: colorOff })

		for (const { coord } of withAngle) {
			if (signal.aborted) return
			this.setLedModeByCoord(coord, 'normal', { colorTo: colorOn })
			await this.#delay(delay, signal)
		}
	}
}

// ─── LedMatrix ──────────────────────────────────────────────────────────────────

export class LedMatrix extends SerialDevice {

	/**
	 * @param {Object} [options]
	 * @param {number} [options.display=DISPLAY_GALACTIC_UNICORN]
	 * @param {number[]} [options.colorOrder=COLOR_ORDER_RGB]
	 */
	constructor({ display = DISPLAY_GALACTIC_UNICORN, colorOrder = COLOR_ORDER_RGB } = {}) {
		super()
		const [w, h] = DISPLAY_SIZES[display]
		this.width = w
		this.height = h
		this.colorOrder = colorOrder
		this.displayBuffer = new Uint8Array(w * h * 4)
	}

	setPixel(x, y, color) {
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) return
		const idx = (x + y * this.width) * 4
		this.displayBuffer[idx] = color.red
		this.displayBuffer[idx + 1] = color.green
		this.displayBuffer[idx + 2] = color.blue
		this.displayBuffer[idx + 3] = color.brightness
	}

	getPixel(x, y) {
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) return OFF
		const idx = (x + y * this.width) * 4
		return RGBl(
			this.displayBuffer[idx],
			this.displayBuffer[idx + 1],
			this.displayBuffer[idx + 2],
			this.displayBuffer[idx + 3]
		)
	}

	fill(color) {
		for (let i = 0; i < this.displayBuffer.length; i += 4) {
			this.displayBuffer[i] = color.red
			this.displayBuffer[i + 1] = color.green
			this.displayBuffer[i + 2] = color.blue
			this.displayBuffer[i + 3] = color.brightness
		}
	}

	clear() {
		this.displayBuffer.fill(0)
	}

	#translateBuffer() {
		const out = new Uint8Array(this.displayBuffer.length)
		const [r, g, b] = this.colorOrder
		for (let i = 0; i < this.displayBuffer.length; i += 4) {
			out[i] = this.displayBuffer[i + r]
			out[i + 1] = this.displayBuffer[i + g]
			out[i + 2] = this.displayBuffer[i + b]
			out[i + 3] = this.displayBuffer[i + 3]
		}
		return out
	}

	getPreviewBuffer() {
		return this.#translateBuffer()
	}

	getPacket() {
		const buffer = this.getPreviewBuffer()
		const packet = new Uint8Array(PREFIX.length + buffer.length)
		packet.set(PREFIX, 0)
		packet.set(buffer, PREFIX.length)
		return packet
	}

	async writeToDisplay() {
		await this._sendWithPrefix(this.getPreviewBuffer())
	}

	/**
	 * Draw an ImageData (from canvas) onto the matrix
	 * @param {ImageData} imageData
	 * @param {number} [brightness=127]
	 */
	drawImageData(imageData, brightness = 127) {
		for (let y = 0; y < this.height && y < imageData.height; y++) {
			for (let x = 0; x < this.width && x < imageData.width; x++) {
				const srcIdx = (x + y * imageData.width) * 4
				const r = imageData.data[srcIdx]
				const g = imageData.data[srcIdx + 1]
				const b = imageData.data[srcIdx + 2]
				const a = imageData.data[srcIdx + 3]

				if (a > 0) {
					const blend = a / 255
					const current = this.getPixel(x, y)
					this.setPixel(x, y, RGBl(
						Math.round(r * blend + current.red * (1 - blend)),
						Math.round(g * blend + current.green * (1 - blend)),
						Math.round(b * blend + current.blue * (1 - blend)),
						brightness
					))
				}
			}
		}
	}

	/**
	 * Draw a canvas element onto the matrix, scaling to fit
	 * @param {HTMLCanvasElement} canvas
	 * @param {number} [brightness=127]
	 */
	drawCanvas(canvas, brightness = 127) {
		const offscreen = document.createElement('canvas')
		offscreen.width = this.width
		offscreen.height = this.height
		const ctx = offscreen.getContext('2d')
		ctx.drawImage(canvas, 0, 0, this.width, this.height)
		this.drawImageData(ctx.getImageData(0, 0, this.width, this.height), brightness)
	}
}
