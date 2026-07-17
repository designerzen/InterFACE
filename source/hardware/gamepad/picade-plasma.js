import {
	PICADE_DEFAULT_FILTERS,
	PICADE_MAX_BUTTON_FRAME_LEDS,
	PICADE_MAX_BUTTON_LED_GROUP_SIZE,
	PicadeLeds,
} from './picade-leds.js'

// The Picade Max panel exposes fourteen illuminated controls per player.
export const PICADE_PLASMA_BUTTON_COUNT = 14
export const PICADE_SHORT_PRESS_COLOR = '#ffffff'
export const PICADE_LONG_PRESS_COLOR = '#ff0000'

/**
 * Controls all fourteen Picade Plasma button lights independently of the Picade input.
 */
export class PicadePlasma {
	#leds
	#buttonCount

	constructor({ brightness = 31, refreshRate = 20, buttonCount = PICADE_PLASMA_BUTTON_COUNT } = {}) {
		if (!Number.isInteger(buttonCount) || buttonCount < 1) {
			throw new RangeError('buttonCount must be a positive integer')
		}
		this.#buttonCount = buttonCount
		this.#leds = new PicadeLeds({
			brightness,
			refreshRate,
			buttonCount,
		})
	}

	get connected() {
		return this.#leds.connected
	}

	get transportLedCount() {
		return PICADE_MAX_BUTTON_FRAME_LEDS
	}

	on(event, callback) {
		this.#leds.on(event, callback)
		return this
	}

	off(event, callback) {
		this.#leds.off(event, callback)
		return this
	}

	async connect(filters = PICADE_DEFAULT_FILTERS) {
		const pairedPorts = await this.getPairedPorts()
		if (pairedPorts.length) {
			await this.#leds.connectPort(pairedPorts[0])
			return this
		}
		await this.#leds.connect(filters)
		return this
	}

	async getPairedPorts() {
		if (!navigator.serial?.getPorts) return []
		const ports = await navigator.serial.getPorts()
		return ports.filter(port => {
			const info = port.getInfo()
			return PICADE_DEFAULT_FILTERS.some(filter =>
				info.usbVendorId === filter.usbVendorId && info.usbProductId === filter.usbProductId,
			)
		})
	}

	async disconnect() {
		await this.#leds.disconnect()
		return this
	}

	light(button, color) {
		this.#assertButton(button)
		this.#leds.setButton(button, color)
		return this
	}

	setLight(button, light, color, options = {}) {
		this.#assertButton(button)
		this.#leds.setLed(button, light, color, options)
		return this
	}

	animateLight(button, light, mode, color, options = {}) {
		this.#assertButton(button)
		if (mode === 'flash') this.#leds.flashLed(button, light, color, options)
		else if (mode === 'pulse') this.#leds.pulseLed(button, light, color, options)
		else if (mode === 'fade') this.#leds.fadeLed(button, light, color, options.toColor ?? null, options)
		else this.#leds.setLed(button, light, color, options)
		return this
	}

	/** Render a colour for one Plasma transport frame, then resume its animation. */
	overrideButtonFrame(button, color, options = {}) {
		this.#assertButton(button)
		this.#leds.overrideButtonFrame(button, color, options)
		return this
	}

	blendLight(button, light, fromColor, toColor, options = {}) {
		this.#assertButton(button)
		this.#leds.fadeLed(button, light, fromColor, toColor, options)
		return this
	}

	fade(button, color, { fadeTime = 0.45, brightness } = {}) {
		this.#assertButton(button)
		for (let led = 0; led < PICADE_MAX_BUTTON_LED_GROUP_SIZE; led++) {
			this.#leds.fadeLed(button, led, color, null, { duration: fadeTime, ...(brightness == null ? {} : { brightness }) })
		}
		return this
	}

	async clear() {
		this.#leds.clear()
		await this.#leds.write()
		return this
	}

	#assertButton(button) {
		if (!Number.isInteger(button) || button < 0 || button >= this.#buttonCount) {
			throw new RangeError(`button must be between 0 and ${this.#buttonCount - 1}`)
		}
	}
}
