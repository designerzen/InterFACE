import {
	PlasmaButtons,
	PICADE_MAX_BUTTONS,
	PICADE_MAX_LOGICAL_LEDS,
	PICADE_MAX_BUTTON_FRAME_LEDS,
	PICADE_MAX_BUTTON_LED_GROUP_SIZE,
	RGBl,
} from './picade-max-input.js'
import {
	PICADE_MAX_USB_IDS,
} from './picade-max-interface.js'

export const PICADE_DEFAULT_FILTERS = Object.freeze(
	PICADE_MAX_USB_IDS.map(({ vendorId, productId }) => ({
		usbVendorId: vendorId,
		usbProductId: productId,
	})),
)
export { PICADE_MAX_BUTTONS, PICADE_MAX_BUTTON_FRAME_LEDS, PICADE_MAX_BUTTON_LED_GROUP_SIZE }

const OFF = RGBl(0, 0, 0, 0)

function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value))
}

function normalizeColor(color, brightness = 31) {
	if (color == null) return OFF

	if (typeof color === 'string') {
		const hex = color.trim().replace(/^#/, '')
		if (!/^[\da-fA-F]{6}$/.test(hex)) {
			throw new Error(`Invalid color string "${color}"`)
		}
		const value = parseInt(hex, 16)
		return RGBl(
			(value >> 16) & 0xff,
			(value >> 8) & 0xff,
			value & 0xff,
			clamp(brightness, 0, 31),
		)
	}

	if (Array.isArray(color)) {
		const [red = 0, green = 0, blue = 0, level = brightness] = color
		return RGBl(
			clamp(red, 0, 255),
			clamp(green, 0, 255),
			clamp(blue, 0, 255),
			clamp(level, 0, 31),
		)
	}

	if (typeof color === 'object') {
		const red = color.red ?? color.r ?? 0
		const green = color.green ?? color.g ?? 0
		const blue = color.blue ?? color.b ?? 0
		const level = color.brightness ?? brightness
		return RGBl(
			clamp(red, 0, 255),
			clamp(green, 0, 255),
			clamp(blue, 0, 255),
			clamp(level, 0, 31),
		)
	}

	throw new Error('Unsupported color value')
}

function toLedIndex(buttonIndex, ledIndex, buttonCount) {
	if (!Number.isInteger(buttonIndex) || buttonIndex < 0 || buttonIndex >= buttonCount) {
		throw new RangeError(`buttonIndex must be between 0 and ${buttonCount - 1}`)
	}
	if (!Number.isInteger(ledIndex) || ledIndex < 0 || ledIndex >= PICADE_MAX_BUTTON_LED_GROUP_SIZE) {
		throw new RangeError(`ledIndex must be between 0 and ${PICADE_MAX_BUTTON_LED_GROUP_SIZE - 1}`)
	}
	return (buttonIndex * PICADE_MAX_BUTTON_LED_GROUP_SIZE) + ledIndex
}

export function isPicadeSerialPort(port, filters = PICADE_DEFAULT_FILTERS) {
	const info = port?.getInfo?.()
	if (!info) return false
	return filters.some(filter =>
		info.usbVendorId === filter.usbVendorId &&
		info.usbProductId === filter.usbProductId
	)
}

export class PicadeLeds {
	#buttons
	#defaultBrightness
	#buttonCount

	constructor({ refreshRate = 20, brightness = 31, buttonCount = PICADE_MAX_BUTTONS } = {}) {
		if (!Number.isInteger(buttonCount) || buttonCount < 1) {
			throw new RangeError('buttonCount must be a positive integer')
		}
		this.#buttonCount = buttonCount
		this.#buttons = new PlasmaButtons(buttonCount * PICADE_MAX_BUTTON_LED_GROUP_SIZE, {
			refreshRate,
			packetLedCount: PICADE_MAX_BUTTON_FRAME_LEDS,
		})
		this.#defaultBrightness = clamp(brightness, 0, 31)
	}

	get connected() {
		return this.#buttons.connected
	}

	get refreshRate() {
		return this.#buttons.refreshRate
	}

	get defaultBrightness() {
		return this.#defaultBrightness
	}

	get transportLedCount() {
		return this.#buttons.packetLedCount
	}

	on(event, callback) {
		this.#buttons.on(event, callback)
		return this
	}

	off(event, callback) {
		this.#buttons.off(event, callback)
		return this
	}

	async connect(filters = PICADE_DEFAULT_FILTERS) {
		await this.#buttons.connect(filters)
		return this
	}

	async connectPaired(filters = PICADE_DEFAULT_FILTERS) {
		const ports = await navigator.serial?.getPorts?.() ?? []
		const port = ports.find(candidate => isPicadeSerialPort(candidate, filters))
		if (!port) return false
		await this.connectPort(port)
		return true
	}

	async connectPort(port) {
		await this.#buttons.connectPort(port)
		return this
	}

	async disconnect() {
		await this.#buttons.disconnect()
		return this
	}

	setLed(buttonIndex, ledIndex, color, { brightness = this.#defaultBrightness } = {}) {
		const ledNumber = toLedIndex(buttonIndex, ledIndex, this.#buttonCount)
		this.#buttons.setLedMode(ledNumber, 'normal', {
			colorTo: normalizeColor(color, brightness),
		})
		return this
	}

	setButton(buttonIndex, color, { brightness = this.#defaultBrightness } = {}) {
		const normalized = normalizeColor(color, brightness)
		for (let ledIndex = 0; ledIndex < PICADE_MAX_BUTTON_LED_GROUP_SIZE; ledIndex++) {
			this.setLed(buttonIndex, ledIndex, normalized)
		}
		return this
	}

	fadeLed(buttonIndex, ledIndex, fromColor, toColor = null, { duration = 0.35, brightness = this.#defaultBrightness } = {}) {
		const ledNumber = toLedIndex(buttonIndex, ledIndex)
		this.#buttons.setLedMode(ledNumber, 'fade', {
			colorFrom: normalizeColor(fromColor, brightness),
			colorTo: normalizeColor(toColor, brightness),
			transitionTime: duration,
		})
		return this
	}

	flashLed(buttonIndex, ledIndex, color, { holdTime = 0, fadeTime = 0.35, brightness = this.#defaultBrightness } = {}) {
		const ledNumber = toLedIndex(buttonIndex, ledIndex, this.#buttonCount)
		this.#buttons.triggerLedFade(ledNumber, normalizeColor(color, brightness), { holdTime, fadeTime })
		return this
	}

	pulseLed(buttonIndex, ledIndex, color, { fromColor = null, duration = 0.7, brightness = this.#defaultBrightness } = {}) {
		const ledNumber = toLedIndex(buttonIndex, ledIndex, this.#buttonCount)
		this.#buttons.setLedMode(ledNumber, 'fade sweep', {
			colorFrom: normalizeColor(fromColor, brightness),
			colorTo: normalizeColor(color, brightness),
			transitionTime: duration,
		})
		return this
	}

	/** Render one button in this frame only, preserving any active LED mode. */
	overrideButtonFrame(buttonIndex, color, { brightness = this.#defaultBrightness } = {}) {
		this.#buttons.overrideButtonFrame(buttonIndex, normalizeColor(color, brightness))
		return this
	}

	fadeButton(buttonIndex, fromColor, toColor = null, options = {}) {
		for (let ledIndex = 0; ledIndex < PICADE_MAX_BUTTON_LED_GROUP_SIZE; ledIndex++) {
			this.fadeLed(buttonIndex, ledIndex, fromColor, toColor, options)
		}
		return this
	}

	clear() {
		this.#buttons.setAllLeds('normal', { colorTo: OFF })
		return this
	}

	getPacket() {
		return this.#buttons.getPacket()
	}

	getPreviewBuffer() {
		return this.#buttons.getPreviewBuffer()
	}

	async write() {
		await this.#buttons.writeToDisplay()
		return this
	}
}

export function picadeColor(color, brightness = 31) {
	return normalizeColor(color, brightness)
}
