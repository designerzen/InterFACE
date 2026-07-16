import GamePad, { getGamePads } from './gamepad.js'
import {
	BUTTON_A,
	BUTTON_B,
	BUTTON_LEFT_SHOULDER_BUTTON,
	BUTTON_LEFT_SHOULDER_TWO,
	BUTTON_RIGHT_SHOULDER_BUTTON,
	BUTTON_RIGHT_SHOULDER_TWO,
	BUTTON_X,
	BUTTON_Y,
} from './gamepad-commands.js'

export const PICADE_MAX_BUTTON_COUNT = 8
export const PICADE_MAX_USB_VENDOR_ID = 0x2e8a
export const PICADE_MAX_USB_PRODUCT_ID = 0x1098
export const PICADE_MAX_ALTERNATE_USB_VENDOR_ID = 0xcafe
export const PICADE_MAX_ALTERNATE_USB_PRODUCT_ID = 0x400d
export const PICADE_MAX_USB_IDS = Object.freeze([
	{
		vendorId: PICADE_MAX_USB_VENDOR_ID,
		productId: PICADE_MAX_USB_PRODUCT_ID,
	},
	{
		vendorId: PICADE_MAX_ALTERNATE_USB_VENDOR_ID,
		productId: PICADE_MAX_ALTERNATE_USB_PRODUCT_ID,
	},
])
export const PICADE_MAX_USB_VENDOR_NAME = 'Raspberry Pi (Trading) Ltd'
export const PICADE_MAX_MANUFACTURER = 'Pimoroni Ltd'
export const PICADE_MAX_PRODUCT_NAME = 'Picade Max Input'

function parseUsbIdPart(value) {
	if (!value) return null
	return parseInt(String(value).replace(/^0x/i, ''), 16)
}

function parseUsbId(id = '') {
	const vendor = id.match(/(?:vendor|vid)(?:\s*id)?\s*:?\s*(0x)?([\da-f]+)/i)
		?? id.match(/\bvid[_\s-]*(0x)?([\da-f]+)/i)
	const product = id.match(/(?:product|pid)(?:\s*id)?\s*:?\s*(0x)?([\da-f]+)/i)
		?? id.match(/\bpid[_\s-]*(0x)?([\da-f]+)/i)
	if (!vendor || !product) return null
	return {
		vendorId: parseUsbIdPart(`${vendor[1] ?? ''}${vendor[2]}`),
		productId: parseUsbIdPart(`${product[1] ?? ''}${product[2]}`),
	}
}

export function getPicadeMaxGamepadInfo(gamepad) {
	const browserGamepad = gamepad?.gamepad ?? gamepad
	const usb = parseUsbId(browserGamepad?.id)
	const supported = PICADE_MAX_USB_IDS.some(id =>
		usb?.vendorId === id.vendorId && usb.productId === id.productId
	)
	if (!supported) {
		return null
	}
	return {
		...usb,
		usbVendorName: PICADE_MAX_USB_VENDOR_NAME,
		manufacturer: PICADE_MAX_MANUFACTURER,
		productName: PICADE_MAX_PRODUCT_NAME,
	}
}

// The Picade Max's first eight gamepad actions in the project's canonical order.
export const PICADE_MAX_ACTION_TO_BUTTON = Object.freeze({
	[BUTTON_B]: 0,
	[BUTTON_A]: 1,
	[BUTTON_Y]: 2,
	[BUTTON_X]: 3,
	[BUTTON_LEFT_SHOULDER_BUTTON]: 4,
	[BUTTON_RIGHT_SHOULDER_BUTTON]: 5,
	[BUTTON_LEFT_SHOULDER_TWO]: 6,
	[BUTTON_RIGHT_SHOULDER_TWO]: 7,
})

/**
 * Picade Max input adapter. It delegates reading to the app's GamePad class so
 * this test page receives the same action events as the rest of PhotoSYNTH.
 */
export class PicadeMaxInterface {
	#listeners = new Set()
	#connectionListeners = new Set()
	#frame = null
	#reader = null
	#gamepadIndex = null
	#gamepadName = null
	#connectionKey = null
	#selectedIndex = null

	get connected() {
		return this.#reader?.connected ?? false
	}

	get name() {
		return this.#gamepadName
	}

	get selectedIndex() {
		return this.#selectedIndex
	}

	selectGamepad(index) {
		this.#selectedIndex = index
		this.#reader = null
		this.#gamepadIndex = null
		this.#connectionKey = null
		return this
	}

	onButton(callback) {
		this.#listeners.add(callback)
		return () => this.#listeners.delete(callback)
	}

	onConnection(callback) {
		this.#connectionListeners.add(callback)
		callback({ connected: this.connected, name: this.name, source: 'gamepad' })
		return () => this.#connectionListeners.delete(callback)
	}

	start() {
		if (this.#frame != null) return this
		const poll = () => {
			this.#poll()
			this.#frame = requestAnimationFrame(poll)
		}
		this.#frame = requestAnimationFrame(poll)
		return this
	}

	stop() {
		if (this.#frame != null) cancelAnimationFrame(this.#frame)
		this.#frame = null
		this.#reader = null
		this.#gamepadIndex = null
		this.#setConnection(null)
		return this
	}

	#poll() {
		const connectedGamepads = Array.from(getGamePads()).filter(gamepad => gamepad?.connected)
		const picade = connectedGamepads.find(getPicadeMaxGamepadInfo)
		const namedPicade = connectedGamepads.find(gamepad => /picade|pimoroni|pico/i.test(gamepad.id))
		const selected = connectedGamepads.find(gamepad => gamepad.index === this.#selectedIndex)
		const gamepad = selected ?? picade ?? namedPicade ?? connectedGamepads[0] ?? null
		if (!gamepad) {
			this.#reader = null
			this.#gamepadIndex = null
			this.#setConnection(null)
			return
		}
		if (gamepad.index !== this.#gamepadIndex) this.#connectReader(gamepad)
		this.#reader.update()
	}

	#connectReader(gamepad) {
		this.#reader = new GamePad(gamepad.index)
		this.#reader.connect({ gamepad })
		this.#reader.available = true
		this.#reader.on((action, pressed) => {
			const button = PICADE_MAX_ACTION_TO_BUTTON[action]
			if (button == null) return
			this.#emit({ button, pressed, gamepadIndex: gamepad.index })
		})
		this.#gamepadIndex = gamepad.index
		this.#setConnection(gamepad)
	}

	#setConnection(gamepad) {
		const key = gamepad ? `${gamepad.index}:${gamepad.id}` : null
		if (key === this.#connectionKey) return
		this.#connectionKey = key
		this.#gamepadName = gamepad ? (getPicadeMaxGamepadInfo(gamepad) ? PICADE_MAX_PRODUCT_NAME : gamepad.id) : null
		for (const listener of this.#connectionListeners) {
			listener({
				connected: Boolean(gamepad),
				name: this.#gamepadName,
				index: gamepad?.index ?? null,
				device: getPicadeMaxGamepadInfo(gamepad),
				source: 'gamepad',
			})
		}
	}

	#emit(event) {
		for (const listener of this.#listeners) listener(event)
	}
}
