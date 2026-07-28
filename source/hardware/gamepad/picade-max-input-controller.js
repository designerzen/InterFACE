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
import { getPicadePlasmaLightPreset, PicadePlasma } from './picade-plasma.js'

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
export const PICADE_RAPID_TAP_COLORS = Object.freeze([
	'#ffffff', '#9f1239', '#c2410c', '#a16207', '#15803d', '#0f766e', '#1d4ed8', '#5b21b6', '#9d174d',
])
export const PICADE_RAPID_TAP_WINDOW_MS = 500
const getBrowserGamepad = input => input?.gamepad ?? input
const getPlayerIndex = (input, fallback = 0) => Number.isInteger(input?.player) ? input.player : fallback
const getButtonOffset = input => Number.isInteger(input?.buttonOffset) ? input.buttonOffset : 0
const getAxisOffset = input => Number.isInteger(input?.axisOffset) ? input.axisOffset : 0
const getNamedPicadePlayer = input => {
	const match = String(getBrowserGamepad(input)?.id ?? '').match(/gamepad\s*([12])\b/i)
	return match ? Number(match[1]) - 1 : null
}
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
		const assignedPlayers = new Set()
		return picadeGamepads.slice(0, PICADE_MAX_PLAYER_COUNT)
			.map((gamepad, fallbackPlayer) => {
				const namedPlayer = getNamedPicadePlayer(gamepad)
				const player = namedPlayer != null && !assignedPlayers.has(namedPlayer)
					? namedPlayer
					: [0, 1].find(index => !assignedPlayers.has(index)) ?? fallbackPlayer
				assignedPlayers.add(player)
				return {
					...createPlayerInput(gamepad, player),
					buttonOffset: 0,
					axisOffset: 0,
					source: 'slot',
				}
			})
			.sort((left, right) => left.player - right.player)
	}

	const combined = picadeGamepads[0]
	if (!combined) return []
	const buttonCount = combined.buttons?.length ?? 0
	const axisCount = combined.axes?.length ?? 0
	const buttonsPerPlayer = Math.floor(buttonCount / PICADE_MAX_PLAYER_COUNT)
	const axesPerPlayer = Math.floor(axisCount / PICADE_MAX_PLAYER_COUNT)
	const hasCombinedControls = buttonsPerPlayer >= PICADE_MAX_BUTTON_COUNT || axesPerPlayer >= PICADE_MAX_PLAYER_AXES
	if (!hasCombinedControls) {
		const namedPlayer = getNamedPicadePlayer(combined) ?? 0
		return Array.from({ length: PICADE_MAX_PLAYER_COUNT }, (_, player) => ({
			...createPlayerInput(combined, player),
			buttonOffset: 0,
			axisOffset: 0,
			source: player === namedPlayer ? 'single' : 'placeholder',
		}))
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
	#tapStates = new Map()
	#frame = null
	#plasma
	#joystickDirections = new Map()

	constructor(gamepads, {
		plasma = null,
		buttonEvents = null,
		lightPreset = 'default',
		pressColor = '#ffffff',
		pressBrightness = 31,
		fadeTime = 0.45,
		getButtonLightOptions = null,
		lightInputFeedback = true,
	} = {}) {
		if (!Array.isArray(gamepads) || gamepads.length !== PICADE_MAX_PLAYER_COUNT) {
			throw new TypeError('PicadeMaxController requires the two Picade Max player gamepads')
		}
		if (!gamepads.every(input => isPicadeMaxInputController(input))) {
			throw new TypeError('Both gamepads must be Picade Max Input interfaces')
		}
		this.#gamepads = [...gamepads].sort((left, right) =>
			getPlayerIndex(left) - getPlayerIndex(right) ||
			getBrowserGamepad(left).index - getBrowserGamepad(right).index
		)
		const lightLayout = buttonEvents == null
			? getPicadePlasmaLightPreset(lightPreset)
			: { buttonEvents }
		this.#plasma = plasma ?? new PicadePlasma({ ...lightLayout, playerCount: PICADE_MAX_PLAYER_COUNT })
		this.pressColor = pressColor
		this.pressBrightness = pressBrightness
		this.fadeTime = fadeTime
		this.getButtonLightOptions = getButtonLightOptions
		this.lightInputFeedback = lightInputFeedback
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

	handleInput(player, action, pressed, heldFor = 0, gamepad = null) {
		const browserGamepad = getBrowserGamepad(gamepad)
		console.info('[Picade Max input]', {
			player,
			action,
			pressed,
			heldFor,
			gamepadIndex: browserGamepad?.index ?? null,
			gamepadId: browserGamepad?.id ?? null,
		})
		const mappedButton = PICADE_MAX_ACTION_TO_BUTTON[action]
		if (this.lightInputFeedback && this.#plasma.hasButtonEvent(player, action)) this.#setLight(player, action, pressed)
		if (mappedButton == null) {
			this.#handleJoystick(player, action, pressed, gamepad)
			this.#emitButton({ player, button: null, action, pressed, heldFor, gamepad })
			return
		}
		this.#emitButton({ player, button: mappedButton, action, pressed, heldFor, gamepad })
	}

	handleAxis(player, action, value, gamepad = null) {
		const browserGamepad = getBrowserGamepad(gamepad)
		console.info('[Picade Max axis]', {
			player,
			action,
			value,
			gamepadIndex: browserGamepad?.index ?? null,
			gamepadId: browserGamepad?.id ?? null,
		})
		this.#handleJoystick(player, action, value, gamepad)
	}

	onButton(callback) {
		this.#listeners.add(callback)
		return () => this.#listeners.delete(callback)
	}

	/** Triggers a named Picade button light for one player. */
	triggerButtonLight(player, eventType, { color = this.pressColor, brightness = this.pressBrightness, fadeTime = this.fadeTime } = {}) {
		if (!this.#plasma.connected || !this.#plasma.hasButtonEvent(player, eventType)) return false
		this.#plasma.triggerButtonLight(player, eventType, color, { brightness, fadeTime })
		return true
	}

	/** Overlay one tempo frame without replacing the button's active animation. */
	pulseButtonFrame(player, eventType, color, { brightness = this.pressBrightness } = {}) {
		if (!this.#plasma.connected || !this.#plasma.hasButtonEvent(player, eventType)) return false
		this.#plasma.pulseButtonFrame(player, eventType, color, { brightness })
		return true
	}

	pulseSystemFrame(id, color, { brightness = this.pressBrightness } = {}) {
		if (!this.#plasma.connected || !this.#plasma.hasSystemLight(id)) return false
		this.#plasma.pulseSystemFrame(id, color, { brightness })
		return true
	}

	setButtonLight(player, eventType, color, { brightness = this.pressBrightness } = {}) {
		if (!this.#plasma.connected || !this.#plasma.hasButtonEvent(player, eventType)) return false
		this.#plasma.setButtonLight(player, eventType, color, { brightness })
		return true
	}

	repeatHeldButtonLight(player, eventType) {
		if (!this.#plasma.connected || !this.#plasma.hasButtonEvent(player, eventType)) return false
		const light = this.#holdTimers.get(`${player}:${eventType}`)
		if (!light) return false
		this.#plasma.triggerButtonLight(player, eventType, light.color, {
			brightness: light.brightness,
			fadeTime: light.fadeTime,
		})
		return true
	}

	resetButtonLight(player, eventType) {
		if (!this.#plasma.connected || !this.#plasma.hasButtonEvent(player, eventType)) return false
		this.#plasma.resetButtonLight(player, eventType)
		return true
	}

	setSystemLight(id, color, { brightness = this.pressBrightness } = {}) {
		if (!this.#plasma.connected || !this.#plasma.hasSystemLight(id)) return false
		this.#plasma.setSystemLight(id, color, { brightness })
		return true
	}

	resetSystemLight(id) {
		if (!this.#plasma.connected || !this.#plasma.hasSystemLight(id)) return false
		this.#plasma.resetSystemLight(id)
		return true
	}

	setAllButtonLights(color, options = {}) {
		if (!this.#plasma.connected) return false
		this.#plasma.setAllButtonLights(color, { brightness: this.pressBrightness, ...options })
		return true
	}

	resetAllButtonLights() {
		if (!this.#plasma.connected) return false
		this.#plasma.resetAllButtonLights()
		return true
	}

	animateButtonLight(player, eventType, mode, color, options = {}) {
		if (!this.#plasma.connected || !this.#plasma.hasButtonEvent(player, eventType)) return false
		this.#plasma.animateButtonLight(player, eventType, mode, color, { brightness: this.pressBrightness, ...options })
		return true
	}

	blendButtonLight(player, eventType, fromColor, toColor, options = {}) {
		if (!this.#plasma.connected || !this.#plasma.hasButtonEvent(player, eventType)) return false
		this.#plasma.blendButtonLight(player, eventType, fromColor, toColor, { brightness: this.pressBrightness, ...options })
		return true
	}

	fadeButtonLight(player, eventType, fromColor, toColor = null, options = {}) {
		if (!this.#plasma.connected || !this.#plasma.hasButtonEvent(player, eventType)) return false
		this.#plasma.fadeButtonLight(player, eventType, fromColor, toColor, { brightness: this.pressBrightness, ...options })
		return true
	}

	animateSystemLight(id, mode, color, options = {}) {
		if (!this.#plasma.connected || !this.#plasma.hasSystemLight(id)) return false
		this.#plasma.animateSystemLight(id, mode, color, { brightness: this.pressBrightness, ...options })
		return true
	}

	fadeSystemLight(id, fromColor, toColor, options = {}) {
		if (!this.#plasma.connected || !this.#plasma.hasSystemLight(id)) return false
		this.#plasma.fadeSystemLight(id, fromColor, toColor, { brightness: this.pressBrightness, ...options })
		return true
	}

	start() {
		if (this.#frame != null) return this
		this.#readers = this.#gamepads.map(gamepad => this.#createReader(gamepad, getPlayerIndex(gamepad)))
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
		this.#tapStates.clear()
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
		// Poll the live browser slot for every Picade side. This is required for
		// Player 2: the generic GamePad wrapper can retain a stale snapshot when
		// the OS exposes the two Picade interfaces independently.
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
					console.info('[Picade Max raw button]', {
						player,
						localButton,
						rawButton: buttonOffset + localButton,
						action,
						pressed,
						value: button.value,
						gamepadIndex: gamepad.index,
						gamepadId: gamepad.id,
					})
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
					console.info('[Picade Max raw axis]', {
						player,
						action,
						value,
						gamepadIndex: gamepad.index,
						gamepadId: gamepad.id,
					})
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

	#setLight(player, eventType, pressed) {
		if (!this.#plasma.connected || !this.#plasma.hasButtonEvent(player, eventType)) return
		const key = `${player}:${eventType}`
		const lightOptions = this.getButtonLightOptions?.({ player, eventType }) ?? {}
		const pressColor = lightOptions.color ?? this.pressColor
		const brightness = lightOptions.brightness ?? this.pressBrightness
		const fadeTime = lightOptions.fadeTime ?? this.fadeTime
		if (pressed) {
			const previousHold = this.#holdTimers.get(key)
			clearTimeout(previousHold?.timer)
			clearTimeout(previousHold?.releaseTimer)
			const now = performance.now?.() ?? Date.now()
			const previousTap = this.#tapStates.get(key)
			const tapIndex = previousTap && now - previousTap.at <= PICADE_RAPID_TAP_WINDOW_MS
				? (previousTap.index + 1) % PICADE_RAPID_TAP_COLORS.length
				: 0
			const tapColor = tapIndex === 0 ? pressColor : PICADE_RAPID_TAP_COLORS[tapIndex]
			this.#tapStates.set(key, { at: now, index: tapIndex })
			this.#plasma.triggerButtonLight(player, eventType, tapColor, { brightness, fadeTime })
			const hold = {
				color: tapColor,
				brightness,
				fadeTime,
				tapIndex,
				startedAt: now,
				timer: null,
				releaseTimer: null,
			}
			this.#holdTimers.set(key, hold)
			return
		}
		const hold = this.#holdTimers.get(key)
		clearTimeout(hold?.timer)
		clearTimeout(hold?.releaseTimer)
		this.#plasma.resetButtonLight(player, eventType)
		this.#holdTimers.delete(key)
	}
}

/** Constructs a two-player Picade Max controller without merging either game's mappings. */
export function createPicadeMaxController(gamepads, options) {
	return new PicadeMaxController(gamepads, options)
}
