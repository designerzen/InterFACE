import {
	BUTTON_A,
	BUTTON_B,
	BUTTON_LEFT_S,
	BUTTON_LEFT_SHOULDER_BUTTON,
	BUTTON_LEFT_SHOULDER_TWO,
	BUTTON_RIGHT_S,
	BUTTON_RIGHT_SHOULDER_BUTTON,
	BUTTON_RIGHT_SHOULDER_TWO,
	BUTTON_SELECT,
	BUTTON_START,
	BUTTON_X,
	BUTTON_Y,
	DIRECTION_DOWN,
	DIRECTION_LEFT,
	DIRECTION_RIGHT,
	DIRECTION_UP,
} from './gamepad-commands.js'
import { getPicadeMaxGamepadInfo, PICADE_MAX_USB_IDS } from './picade-max-interface.js'

export const PICADE_HID_FILTERS = Object.freeze(
	PICADE_MAX_USB_IDS.map(({ vendorId, productId }) => ({ vendorId, productId })),
)

// Matches the report defined by Pimoroni's Picade Max Input firmware:
// signed X/Y bytes followed by a 15-bit button mask.
export const PICADE_HID_BUTTON_ACTIONS = Object.freeze([
	BUTTON_A,
	BUTTON_B,
	BUTTON_X,
	BUTTON_Y,
	BUTTON_START,
	BUTTON_SELECT,
	BUTTON_LEFT_SHOULDER_BUTTON,
	BUTTON_RIGHT_SHOULDER_BUTTON,
	BUTTON_LEFT_SHOULDER_TWO,
	BUTTON_RIGHT_SHOULDER_TWO,
	BUTTON_LEFT_S,
	BUTTON_RIGHT_S,
	DIRECTION_UP,
	DIRECTION_DOWN,
	DIRECTION_LEFT,
	DIRECTION_RIGHT,
])

const isPicadeHidDevice = device => PICADE_HID_FILTERS.some(filter =>
	device?.vendorId === filter.vendorId && device.productId === filter.productId,
)

const getPlayerFromName = name => {
	const match = String(name ?? '').match(/gamepad\s*([12])/i)
	return match ? Number(match[1]) - 1 : null
}

const restorePlayerOrder = devices => [...devices]
	.sort((left, right) => {
		const leftPlayer = getPlayerFromName(left.productName)
		const rightPlayer = getPlayerFromName(right.productName)
		return (leftPlayer ?? Number.MAX_SAFE_INTEGER) - (rightPlayer ?? Number.MAX_SAFE_INTEGER)
	})

export const getPairedPicadeHidDevices = async (hid = navigator.hid) => {
	if (!hid?.getDevices) return []
	const devices = await hid.getDevices()
	return restorePlayerOrder(devices.filter(isPicadeHidDevice))
}

export const needsPicadeHidFallback = (gamepads = navigator.getGamepads?.() ?? []) =>
	Array.from(gamepads).filter(gamepad =>
		gamepad?.connected && getPicadeMaxGamepadInfo(gamepad),
	).length === 1

export const requestPicadeHidDevicesFromUserGesture = async (hid = navigator.hid) => {
	if (!hid?.requestDevice) return { status: 'unavailable', devices: [] }
	const devices = await hid.requestDevice({ filters: PICADE_HID_FILTERS })
	return { status: devices.length ? 'selected' : 'cancelled', devices: restorePlayerOrder(devices.filter(isPicadeHidDevice)) }
}

export class PicadeHidInput {
	#devices = new Map()
	#state = new Map()
	#pressedAt = new Map()
	#listeners = new Set()

	onInput(listener) {
		this.#listeners.add(listener)
		return () => this.#listeners.delete(listener)
	}

	get players() {
		return [...this.#devices.keys()].sort((left, right) => left - right)
	}

	async connectPaired(hid = navigator.hid) {
		const devices = await getPairedPicadeHidDevices(hid)
		await this.connectDevices(devices)
		return this.players
	}

	async connectDevices(devices) {
		const sorted = restorePlayerOrder(devices)
		for (const [index, device] of sorted.entries()) {
			const player = getPlayerFromName(device.productName) ?? index
			if (player > 1 || this.#devices.has(player)) continue
			if (!device.opened) await device.open()
			const onReport = event => this.#handleReport(player, device, event)
			device.addEventListener('inputreport', onReport)
			this.#devices.set(player, { device, onReport })
		}
		return this.players
	}

	async disconnect() {
		for (const { device, onReport } of this.#devices.values()) {
			device.removeEventListener('inputreport', onReport)
			if (device.opened) await device.close()
		}
		this.#devices.clear()
		this.#state.clear()
		this.#pressedAt.clear()
	}

	#handleReport(player, device, event) {
		const data = event.data
		if (!data || data.byteLength < 4) return
		const x = data.getInt8(0)
		const y = data.getInt8(1)
		const buttons = data.getUint16(2, true)
		const now = performance.now?.() ?? Date.now()

		for (const [button, action] of PICADE_HID_BUTTON_ACTIONS.entries()) {
			const pressed = Boolean(buttons & (1 << button))
			const key = `${player}:${action}`
			const previous = this.#state.get(key) ?? false
			if (pressed === previous) continue
			let heldFor = -1
			if (pressed) {
				this.#pressedAt.set(key, now)
			} else {
				heldFor = now - (this.#pressedAt.get(key) ?? now)
				this.#pressedAt.delete(key)
			}
			this.#state.set(key, pressed)
			this.#emit({ player, action, pressed, heldFor, gamepad: device, source: 'hid' })
		}

		this.#emit({ player, action: 'leftstickX', value: x / 127, gamepad: device, source: 'hid-axis' })
		this.#emit({ player, action: 'leftstickY', value: y / 127, gamepad: device, source: 'hid-axis' })
	}

	#emit(event) {
		for (const listener of this.#listeners) listener(event)
	}
}
