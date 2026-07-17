import { GAMEPAD_BUTTON_ORDER, getGamePads } from './gamepad.js'
import {
	BUTTON_SELECT,
	BUTTON_START,
	DIRECTION_DOWN,
	DIRECTION_LEFT,
	DIRECTION_RIGHT,
	DIRECTION_UP,
} from './gamepad-commands.js'
import {
	getPicadeMaxGamepadInfo,
	PICADE_MAX_ACTION_TO_BUTTON,
	PICADE_MAX_BUTTON_COUNT,
} from './picade-max-interface.js'
import { PicadePlasma, PICADE_PLASMA_BUTTON_COUNT } from './picade-plasma.js'

export const PICADE_MAX_PLAYER_COUNT = 2
export const PICADE_MAX_PLAYER_AXES = 2
export const PICADE_MAX_JOYSTICK_UP = 'picade-joystick-up'
export const PICADE_MAX_JOYSTICK_DOWN = 'picade-joystick-down'
export const PICADE_MAX_JOYSTICK_LEFT = 'picade-joystick-left'
export const PICADE_MAX_JOYSTICK_RIGHT = 'picade-joystick-right'
export const PICADE_MAX_DIGITAL_JOYSTICK_ACTIONS = Object.freeze({
	[DIRECTION_UP]: PICADE_MAX_JOYSTICK_UP,
	[DIRECTION_DOWN]: PICADE_MAX_JOYSTICK_DOWN,
	[DIRECTION_LEFT]: PICADE_MAX_JOYSTICK_LEFT,
	[DIRECTION_RIGHT]: PICADE_MAX_JOYSTICK_RIGHT,
})
export const PICADE_MAX_CONTROL_ACTIONS = Object.freeze([
	BUTTON_SELECT,
	BUTTON_START,
])
const DEFAULT_BUTTON_LIGHT_MAP = Object.freeze(
	Array.from({ length: PICADE_PLASMA_BUTTON_COUNT }, (_, button) => button),
)

// The Picade's physical Gamepad order is also its Plasma button order. The
// first eight controls play drums; the remaining controls keep their own light.
export const PICADE_MAX_ACTION_TO_LIGHT = Object.freeze(
	Object.fromEntries(
		GAMEPAD_BUTTON_ORDER
			.slice(0, PICADE_PLASMA_BUTTON_COUNT)
			.map((action, light) => [action, light]),
	),
)

const getBrowserGamepad = input => input?.gamepad ?? input
const getPlayerIndex = (input, fallback = 0) => Number.isInteger(input?.player) ? input.player : fallback
const getButtonOffset = input => Number.isInteger(input?.buttonOffset) ? input.buttonOffset : 0
const getAxisOffset = input => Number.isInteger(input?.axisOffset) ? input.axisOffset : 0
const createPlayerInput = (gamepad, player, options = {}) => ({
	...options,
	gamepad,
	player,
	index: gamepad.index,
	connected: gamepad.connected,
	id: gamepad.id,
	mapping: gamepad.mapping,
	buttons: gamepad.buttons,
	axes: gamepad.axes,
})

/** Returns true only for the supported Picade Max Input gamepad interfaces. */
export function isPicadeMaxInputController(gamepad) {
	return Boolean(getPicadeMaxGamepadInfo(gamepad))
}

export function getPicadeMaxInputInventory(gamepads = getGamePads()) {
	const list = Array.from(gamepads ?? [])
	const slotCount = Math.max(4, list.length)
	const slots = []
	for (let slot = 0; slot < slotCount; slot++) {
		const gamepad = list[slot] ?? null
		const device = getPicadeMaxGamepadInfo(gamepad)
		slots.push({
			slot,
			index: gamepad?.index ?? null,
			connected: Boolean(gamepad?.connected),
			id: gamepad?.id ?? null,
			mapping: gamepad?.mapping ?? null,
			buttons: gamepad?.buttons?.length ?? 0,
			axes: gamepad?.axes?.length ?? 0,
			recognised: Boolean(device),
			usbId: device ? `${device.vendorId.toString(16).padStart(4, '0')}:${device.productId.toString(16).padStart(4, '0')}` : null,
			manufacturer: device?.manufacturer ?? null,
			productName: device?.productName ?? null,
			gamepad,
		})
	}
	return {
		slotCount,
		connectedCount: slots.filter(slot => slot.connected).length,
		picadeCount: slots.filter(slot => slot.recognised).length,
		slots,
	}
}

export function logPicadeMaxInputInventory(label = 'Picade Max input inventory', gamepads = getGamePads()) {
	const inventory = getPicadeMaxInputInventory(gamepads)
	const rows = inventory.slots.map(({ gamepad, ...slot }) => slot)
	console.groupCollapsed?.(`[Picade Max] ${label}: ${inventory.picadeCount}/2 recognised, ${inventory.connectedCount} connected`)
	console.info('[Picade Max] raw inventory', inventory)
	console.table?.(rows)
	console.groupEnd?.()
	return inventory
}

/** Finds the two independent player gamepads exposed by one Picade Max USB board. */
export function findPicadeMaxInputGamepads(gamepads = getGamePads()) {
	const picadeGamepads = Array.from(gamepads)
		.filter(gamepad => gamepad?.connected && isPicadeMaxInputController(gamepad))
		.sort((left, right) => left.index - right.index)

	if (picadeGamepads.length >= PICADE_MAX_PLAYER_COUNT) {
		return picadeGamepads.slice(0, PICADE_MAX_PLAYER_COUNT).map((gamepad, player) => ({
			...createPlayerInput(gamepad, player),
			buttonOffset: 0,
			axisOffset: 0,
			source: 'slot',
		}))
	}

	const combined = picadeGamepads[0]
	if (!combined) return []
	const buttonCount = combined.buttons?.length ?? 0
	const axisCount = combined.axes?.length ?? 0
	const buttonsPerPlayer = Math.floor(buttonCount / PICADE_MAX_PLAYER_COUNT)
	const axesPerPlayer = Math.floor(axisCount / PICADE_MAX_PLAYER_COUNT)
	const hasCombinedControls = buttonsPerPlayer >= PICADE_MAX_BUTTON_COUNT || axesPerPlayer >= PICADE_MAX_PLAYER_AXES
	if (!hasCombinedControls) {
		return [
			{
				...createPlayerInput(combined, 0),
				buttonOffset: 0,
				axisOffset: 0,
				source: 'single',
			},
			{
				...createPlayerInput(combined, 1),
				buttonOffset: 0,
				axisOffset: 0,
				source: 'placeholder',
			},
		]
	}

	return Array.from({ length: PICADE_MAX_PLAYER_COUNT }, (_, player) => ({
		...createPlayerInput(combined, player),
		buttonOffset: player * buttonsPerPlayer,
		axisOffset: player * axesPerPlayer,
		source: 'combined',
		buttonsPerPlayer,
		axesPerPlayer,
	}))
}

/**
 * Coordinates the Picade Max's two separate player gamepads and its Plasma lights.
 * Plasma mappings are explicitly supplied per player; player inputs are never merged.
 */
export class PicadeMaxController {
	#gamepads
	#readers = []
	#listeners = new Set()
	#holdTimers = new Map()
	#frame = null
	#plasma
	#plasmaButtonMaps
	#joystickDirections = new Map()
	#hidPlayers = new Set()

	constructor(gamepads, {
		plasma = new PicadePlasma(),
		plasmaButtonMaps = [DEFAULT_BUTTON_LIGHT_MAP, DEFAULT_BUTTON_LIGHT_MAP],
		pressColor = '#ffffff',
		pressBrightness = 31,
		longPressColor = '#ff0000',
		fadeTime = 0.45,
		longPressMs = 500,
		getButtonLightOptions = null,
	} = {}) {
		if (!Array.isArray(gamepads) || gamepads.length !== PICADE_MAX_PLAYER_COUNT) {
			throw new TypeError('PicadeMaxController requires the two Picade Max player gamepads')
		}
		if (!gamepads.every(input => isPicadeMaxInputController(input))) {
			throw new TypeError('Both gamepads must be Picade Max Input interfaces')
		}
		if (!Array.isArray(plasmaButtonMaps) || plasmaButtonMaps.length !== PICADE_MAX_PLAYER_COUNT) {
			throw new TypeError('plasmaButtonMaps must contain one mapping for each player')
		}
		this.#gamepads = [...gamepads].sort((left, right) =>
			getBrowserGamepad(left).index - getBrowserGamepad(right).index ||
			getPlayerIndex(left) - getPlayerIndex(right)
		)
		this.#plasma = plasma
		this.#plasmaButtonMaps = plasmaButtonMaps.map(mapping => mapping == null ? null : [...mapping])
		this.pressColor = pressColor
		this.pressBrightness = pressBrightness
		this.longPressColor = longPressColor
		this.fadeTime = fadeTime
		this.longPressMs = longPressMs
		this.getButtonLightOptions = getButtonLightOptions
	}

	static fromConnectedGamepads(options = {}) {
		return new PicadeMaxController(findPicadeMaxInputGamepads(), options)
	}

	get gamepads() {
		return [...this.#gamepads]
	}

	get plasma() {
		return this.#plasma
	}

	get plasmaButtonMaps() {
		return this.#plasmaButtonMaps.map(mapping => mapping == null ? null : [...mapping])
	}

	setHidPlayers(players = []) {
		this.#hidPlayers = new Set(players.filter(player => player === 0 || player === 1))
		return this
	}

	handleInput(player, action, pressed, heldFor = 0, gamepad = null) {
		const mappedButton = PICADE_MAX_ACTION_TO_BUTTON[action]
		const mappedLight = PICADE_MAX_ACTION_TO_LIGHT[action]
		const plasmaButton = this.#plasmaButtonMaps[player]?.[mappedLight]
		if (Number.isInteger(mappedLight) && Number.isInteger(plasmaButton)) {
			this.#setLight(player, mappedLight, plasmaButton, pressed)
		}
		if (mappedButton == null) {
			this.#handleJoystick(player, action, pressed, gamepad)
			if (PICADE_MAX_CONTROL_ACTIONS.includes(action)) {
				this.#emitButton({ player, button: null, action, pressed, heldFor, gamepad })
			}
			return
		}
		this.#emitButton({ player, button: mappedButton, action, pressed, heldFor, gamepad })
	}

	handleAxis(player, action, value, gamepad = null) {
		this.#handleJoystick(player, action, value, gamepad)
	}

	onButton(callback) {
		this.#listeners.add(callback)
		return () => this.#listeners.delete(callback)
	}

	/** Triggers the mapped Plasma button for one player with optional colour and intensity. */
	triggerButtonLight(player, button, { color = this.pressColor, brightness = this.pressBrightness, fadeTime = this.fadeTime } = {}) {
		const plasmaButton = this.#plasmaButtonMaps[player]?.[button]
		if (!Number.isInteger(plasmaButton) || !this.#plasma.connected) return false
		this.#plasma.light(plasmaButton, color, { brightness })
		if (fadeTime != null) this.#plasma.fade(plasmaButton, color, { brightness, fadeTime })
		return true
	}

	/** Overlay one tempo frame without replacing the button's active animation. */
	pulseButtonFrame(player, button, color, { brightness = this.pressBrightness } = {}) {
		const plasmaButton = this.#plasmaButtonMaps[player]?.[button]
		if (!Number.isInteger(plasmaButton) || !this.#plasma.connected) return false
		this.#plasma.overrideButtonFrame(plasmaButton, color, { brightness })
		return true
	}

	setButtonLight(player, button, light, color, { brightness = this.pressBrightness } = {}) {
		const plasmaButton = this.#plasmaButtonMaps[player]?.[button]
		if (!Number.isInteger(plasmaButton) || !this.#plasma.connected) return false
		this.#plasma.setLight(plasmaButton, light, color, { brightness })
		return true
	}

	animateButtonLight(player, button, light, mode, color, options = {}) {
		const plasmaButton = this.#plasmaButtonMaps[player]?.[button]
		if (!Number.isInteger(plasmaButton) || !this.#plasma.connected) return false
		this.#plasma.animateLight(plasmaButton, light, mode, color, { brightness: this.pressBrightness, ...options })
		return true
	}

	blendButtonLight(player, button, light, fromColor, toColor, options = {}) {
		const plasmaButton = this.#plasmaButtonMaps[player]?.[button]
		if (!Number.isInteger(plasmaButton) || !this.#plasma.connected) return false
		this.#plasma.blendLight(plasmaButton, light, fromColor, toColor, { brightness: this.pressBrightness, ...options })
		return true
	}

	start() {
		if (this.#frame != null) return this
		this.#readers = this.#gamepads.map((gamepad, player) => this.#createReader(gamepad, player))
		const poll = () => {
			for (const reader of this.#readers) reader.update()
			this.#frame = requestAnimationFrame(poll)
		}
		this.#frame = requestAnimationFrame(poll)
		return this
	}

	stop() {
		if (this.#frame != null) cancelAnimationFrame(this.#frame)
		this.#frame = null
		this.#readers = []
		this.#joystickDirections.clear()
		for (const hold of this.#holdTimers.values()) clearTimeout(hold.timer)
		this.#holdTimers.clear()
		return this
	}

	async connectPlasma(filters) {
		await this.#plasma.connect(filters)
		return this
	}

	async disconnect() {
		this.stop()
		if (this.#plasma.connected) await this.#plasma.disconnect()
		return this
	}

	#createReader(gamepad, player) {
		if (gamepad?.source === 'placeholder') return { update: () => null }
		// Read the browser's current Gamepad snapshot directly. The legacy wrapper
		// keeps its original axis snapshot and misplaces heldFor in its callback,
		// which breaks Picade's single-slot macOS representation.
		return this.#createOffsetReader(gamepad, player)
	}

	#createOffsetReader(input, player) {
		const state = new Map()
		const pressedAt = new Map()
		const axisState = new Map()
		const buttonOffset = getButtonOffset(input)
		const axisOffset = getAxisOffset(input)
		const browserIndex = getBrowserGamepad(input).index
		return {
			update: () => {
				if (this.#hidPlayers.has(player)) return
				const gamepad = getGamePads()[browserIndex]
				if (!gamepad?.connected) return
				for (let localButton = 0; localButton < GAMEPAD_BUTTON_ORDER.length; localButton++) {
					const action = GAMEPAD_BUTTON_ORDER[localButton]
					const button = gamepad.buttons?.[buttonOffset + localButton]
					if (!button || !action) continue
					const pressed = Boolean(button.pressed || button.value > 0.5)
					const previous = state.get(action) ?? false
					if (pressed === previous) continue
					const now = performance.now?.() ?? Date.now()
					let heldFor = -1
					if (pressed) {
						pressedAt.set(action, now)
					}else{
						heldFor = now - (pressedAt.get(action) ?? now)
						pressedAt.delete(action)
					}
					state.set(action, pressed)
					this.handleInput(player, action, pressed, heldFor, gamepad)
				}

				const axes = [
					['leftstickX', gamepad.axes?.[axisOffset] ?? 0],
					['leftstickY', gamepad.axes?.[axisOffset + 1] ?? 0],
				]
				for (const [action, value] of axes) {
					const previous = axisState.get(action)
					if (previous === value) continue
					axisState.set(action, value)
					this.handleAxis(player, action, value, gamepad)
				}
			},
		}
	}

	#handleJoystick(player, action, value, gamepad) {
		const digitalDirection = PICADE_MAX_DIGITAL_JOYSTICK_ACTIONS[action]
		if (digitalDirection) {
			this.#emitJoystick(player, digitalDirection, Boolean(value), gamepad)
			return
		}

		const direction = action === 'leftstickY'
			? value <= -0.5 ? PICADE_MAX_JOYSTICK_UP : value >= 0.5 ? PICADE_MAX_JOYSTICK_DOWN : null
			: action === 'leftstickX'
				? value <= -0.5 ? PICADE_MAX_JOYSTICK_LEFT : value >= 0.5 ? PICADE_MAX_JOYSTICK_RIGHT : null
				: null
		if (direction == null && action !== 'leftstickX' && action !== 'leftstickY') return

		const key = `${player}:${action}`
		const previous = this.#joystickDirections.get(key) ?? null
		if (previous === direction) return
		if (previous) this.#emitJoystick(player, previous, false, gamepad)
		if (direction) this.#emitJoystick(player, direction, true, gamepad)
		this.#joystickDirections.set(key, direction)
	}

	#emitJoystick(player, action, pressed, gamepad) {
		this.#emitButton({ player, button: null, action, pressed, heldFor: 0, gamepad })
	}

	#emitButton(event) {
		for (const listener of this.#listeners) listener(event)
	}

	#setLight(player, button, plasmaButton, pressed) {
		if (!this.#plasma.connected) return
		const key = `${player}:${button}`
		const lightOptions = this.getButtonLightOptions?.({ player, button }) ?? {}
		const pressColor = lightOptions.color ?? this.pressColor
		const longPressColor = lightOptions.longPressColor ?? this.longPressColor
		const brightness = lightOptions.brightness ?? this.pressBrightness
		const fadeTime = lightOptions.fadeTime ?? this.fadeTime
		if (pressed) {
			this.#plasma.light(plasmaButton, pressColor, { brightness })
			const hold = { color: pressColor, timer: null }
			hold.timer = setTimeout(() => {
				hold.color = longPressColor
				this.#plasma.light(plasmaButton, hold.color, { brightness })
			}, this.longPressMs)
			this.#holdTimers.set(key, hold)
			return
		}
		const hold = this.#holdTimers.get(key)
		clearTimeout(hold?.timer)
		this.#holdTimers.delete(key)
		this.#plasma.fade(plasmaButton, hold?.color ?? this.pressColor, {
			brightness,
			fadeTime,
		})
	}
}

/** Constructs a two-player Picade Max controller without merging either game's mappings. */
export function createPicadeMaxController(gamepads, options) {
	return new PicadeMaxController(gamepads, options)
}
