import {
	PICADE_DEFAULT_FILTERS,
	PICADE_MAX_BUTTON_FRAME_LEDS,
	PICADE_MAX_BUTTON_LED_GROUP_SIZE,
	PicadeLeds,
} from './picade-leds.js'
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

// The Picade Max panel can expose sixteen illuminated controls per player.
export const PICADE_PLASMA_BUTTON_COUNT = 16
export const PICADE_PLASMA_PLAYER_COUNT = 2
export const PICADE_SHORT_PRESS_COLOR = '#ffffff'
export const PICADE_LONG_PRESS_COLOR = '#ff0000'
export const PICADE_PLASMA_BUTTON_EVENTS = Object.freeze(
	[
		BUTTON_A,
		BUTTON_B,
		BUTTON_X,
		BUTTON_Y,
		BUTTON_LEFT_SHOULDER_BUTTON,
		BUTTON_RIGHT_SHOULDER_BUTTON,
		BUTTON_START,
		BUTTON_SELECT,
		BUTTON_LEFT_SHOULDER_TWO,
		BUTTON_RIGHT_SHOULDER_TWO,
		BUTTON_LEFT_S,
		BUTTON_RIGHT_S,
		DIRECTION_UP,
		DIRECTION_DOWN,
		DIRECTION_LEFT,
		DIRECTION_RIGHT,
	],
)
// System lights have no gamepad input. Their positive index keeps every physical slot addressable.
export const PICADE_PLASMA_SYSTEM_LIGHT_PREFIX = 's'
export const PICADE_PLASMA_LIGHT_PRESETS = Object.freeze({
	default: Object.freeze({
		playerButtonEvents: Object.freeze([
			Object.freeze(PICADE_PLASMA_BUTTON_EVENTS.slice(0, 8)),
			Object.freeze(PICADE_PLASMA_BUTTON_EVENTS.slice(0, 8)),
		]),
	}),
	table: Object.freeze({
		buttonMappings: Object.freeze([
			Object.freeze({ player: 1, eventType: BUTTON_B, index: 0 }),
			Object.freeze({ player: 1, eventType: BUTTON_A, index: 1 }),
			Object.freeze({ player: 1, eventType: BUTTON_Y, index: 2 }),
			Object.freeze({ player: 1, eventType: BUTTON_X, index: 3 }),
			Object.freeze({ player: 1, eventType: BUTTON_LEFT_SHOULDER_TWO, index: 4 }),
			Object.freeze({ player: 1, eventType: BUTTON_RIGHT_SHOULDER_TWO, index: 5 }),
			Object.freeze({ player: 1, eventType: BUTTON_LEFT_S, index: 6 }),
			Object.freeze({ player: 0, eventType: BUTTON_LEFT_SHOULDER_BUTTON, index: 7 }),
			Object.freeze({ player: 0, eventType: BUTTON_LEFT_SHOULDER_TWO, index: 8 }),
			Object.freeze({ player: 0, eventType: BUTTON_RIGHT_SHOULDER_TWO, index: 9 }),
			Object.freeze({ player: 0, eventType: BUTTON_LEFT_S, index: 10 }),
			Object.freeze({ player: 0, eventType: BUTTON_X, index: 11 }),
			Object.freeze({ player: 0, eventType: BUTTON_A, index: 12 }),
			Object.freeze({ player: 0, eventType: BUTTON_Y, index: 13 }),
			Object.freeze({ player: 0, eventType: BUTTON_B, index: 14 }),
		]),
	}),
	picade: Object.freeze({
		buttonMappings: Object.freeze([
			Object.freeze({ player: 0, eventType: BUTTON_A, index: 0 }),
			Object.freeze({ player: 0, eventType: BUTTON_B, index: 1 }),
			Object.freeze({ player: 0, eventType: BUTTON_LEFT_SHOULDER_BUTTON, index: 2 }),
			Object.freeze({ player: 0, eventType: BUTTON_RIGHT_SHOULDER_BUTTON, index: 3 }),
			Object.freeze({ player: 0, eventType: BUTTON_Y, index: 4 }),
			Object.freeze({ player: 0, eventType: BUTTON_X, index: 5 }),
		]),
	}),
})

const PICADE_PLASMA_LIGHT_ALIASES = Object.freeze({
	l1: BUTTON_LEFT_SHOULDER_BUTTON,
	r1: BUTTON_RIGHT_SHOULDER_BUTTON,
	l2: BUTTON_LEFT_SHOULDER_TWO,
	r2: BUTTON_RIGHT_SHOULDER_TWO,
	up: DIRECTION_UP,
	down: DIRECTION_DOWN,
})

const getPicadeLightEvent = value => {
	const eventType = String(value ?? '').trim().toLowerCase()
	if (PICADE_PLASMA_BUTTON_EVENTS.includes(eventType)) return eventType
	return PICADE_PLASMA_LIGHT_ALIASES[eventType] ?? null
}

const getPicadeSystemLightId = value => {
	const id = String(value ?? '').trim().toLowerCase()
	return new RegExp(`^${PICADE_PLASMA_SYSTEM_LIGHT_PREFIX}[1-9]\\d*$`).test(id) ? id : null
}

/**
 * Parses a custom lights query value, for example `1x,1y,2rb,2lb`.
 * Each comma-separated entry is one physical light. Numbered player prefixes are one-based.
 */
export function parsePicadePlasmaLightLayout(value, playerCount = PICADE_PLASMA_PLAYER_COUNT) {
	if (typeof value !== 'string' || (!value.includes(',') && !getPicadeSystemLightId(value))) return null
	const buttonMappings = []
	const mappedLights = new Set()
	const lightSlots = value.split(',')
	for (const [lightIndex, entry] of lightSlots.entries()) {
		const trimmed = entry.trim()
		if (!trimmed || trimmed === '-') continue
		// URLSearchParams decodes raw `+` query separators as spaces.
		for (const identifier of trimmed.split(/[+\s]+/).map(part => part.trim())) {
			const systemLightId = getPicadeSystemLightId(identifier)
			if (systemLightId) {
				if (mappedLights.has(systemLightId)) continue
				mappedLights.add(systemLightId)
				buttonMappings.push({ player: null, eventType: systemLightId, index: lightIndex })
				continue
			}
			const prefix = identifier.match(/^(\d+)\s*(.+)$/)
			const player = prefix ? Number(prefix[1]) - 1 : 0
			const eventType = getPicadeLightEvent(prefix ? prefix[2] : identifier)
			const key = `${player}:${eventType}`
			if (!eventType || player < 0 || player >= playerCount || mappedLights.has(key)) continue
			mappedLights.add(key)
			buttonMappings.push({ player, eventType, index: lightIndex })
		}
	}
	return buttonMappings.length
		? { buttonMappings, buttonCount: lightSlots.length }
		: null
}

export function getPicadePlasmaLightPreset(name = 'default') {
	const customLayout = parsePicadePlasmaLightLayout(name)
	if (customLayout) return customLayout
	return PICADE_PLASMA_LIGHT_PRESETS[name] ?? PICADE_PLASMA_LIGHT_PRESETS.default
}

const validateButtonEvents = (buttonEvents, label, allowEmpty = false) => {
	if (!Array.isArray(buttonEvents) || (!allowEmpty && !buttonEvents.length) || buttonEvents.some(event => typeof event !== 'string' || !event)) {
		throw new TypeError(`${label} must be a non-empty array of button event strings`)
	}
	if (new Set(buttonEvents).size !== buttonEvents.length) {
		throw new RangeError(`${label} must not contain duplicate event strings`)
	}
}

/**
 * Controls all fourteen Picade Plasma button lights independently of the Picade input.
 */
export class PicadePlasma {
	#leds
	#buttonCount
	#buttonEvents
	#playerButtonEvents
	#buttonIndexes
	#systemLightIndexes
	#lightMappings
	#playerCount
	#unloadCleanupRegistered = false
	#unloadClearSent = false
	#unloadHandler = () => {
		if (!this.#leds.connected || this.#unloadClearSent) return
		this.#unloadClearSent = true
		void this.clear().catch(() => {})
	}

	constructor({
		brightness = 31,
		refreshRate = 20,
		buttonEvents = null,
		playerButtonEvents = null,
		buttonMappings = null,
		playerCount = PICADE_PLASMA_PLAYER_COUNT,
		buttonCount,
	} = {}) {
		if (!Number.isInteger(playerCount) || playerCount < 1) {
			throw new RangeError('playerCount must be a positive integer')
		}
		if (buttonMappings != null && !Array.isArray(buttonMappings)) {
			throw new TypeError('buttonMappings must be an array of player button or system light mappings')
		}
		if (buttonMappings != null && (buttonEvents != null || playerButtonEvents != null)) {
			throw new TypeError('buttonMappings cannot be combined with buttonEvents or playerButtonEvents')
		}
		if (playerButtonEvents != null && !Array.isArray(playerButtonEvents)) {
			throw new TypeError('playerButtonEvents must be an array of event arrays')
		}
		if (playerButtonEvents != null && playerButtonEvents.length !== playerCount) {
			throw new RangeError(`playerButtonEvents must have one event array for each player (${playerCount})`)
		}
		let layouts = playerButtonEvents != null
			? playerButtonEvents
			: buttonEvents != null
				? Array.from({ length: playerCount }, () => buttonEvents)
				: Array.from({ length: playerCount }, (_, player) =>
					PICADE_PLASMA_LIGHT_PRESETS.default.playerButtonEvents[player % PICADE_PLASMA_PLAYER_COUNT],
				)
		let mappings = buttonMappings == null
			? layouts.flatMap((events, player) => events.map(eventType => ({ player, eventType })))
			: buttonMappings.map(({ player, eventType, index }) => ({ player, eventType, index }))
		if (buttonMappings != null) {
			layouts = Array.from({ length: playerCount }, () => [])
			const mappedLights = new Set()
			for (const { player, eventType, index } of mappings) {
				if (index != null && (!Number.isInteger(index) || index < 0)) {
					throw new RangeError('buttonMappings indexes must be non-negative integers')
				}
				const systemLightId = player == null ? getPicadeSystemLightId(eventType) : null
				if (systemLightId) {
					if (mappedLights.has(systemLightId)) throw new RangeError(`buttonMappings must not duplicate ${systemLightId}`)
					mappedLights.add(systemLightId)
					continue
				}
				this.#assertPlayerValue(player, playerCount)
				validateButtonEvents([eventType], 'buttonMappings event')
				const key = `${player}:${eventType}`
				if (mappedLights.has(key)) throw new RangeError(`buttonMappings must not duplicate ${key}`)
				mappedLights.add(key)
				layouts[player].push(eventType)
			}
		}
		for (const [player, events] of layouts.entries()) validateButtonEvents(events, `playerButtonEvents[${player}]`, playerButtonEvents != null || buttonMappings != null)
		mappings = mappings.map(({ player, eventType, index }, position) => ({ player, eventType, index: index ?? position }))
		const requiredButtonCount = Math.max(...mappings.map(({ index }) => index + 1))
		if (!requiredButtonCount) throw new RangeError('at least one player must have a configured button event')
		const resolvedButtonCount = buttonCount ?? requiredButtonCount
		if (!Number.isInteger(resolvedButtonCount) || resolvedButtonCount < requiredButtonCount) {
			throw new RangeError(`buttonCount must be at least the highest configured light index (${requiredButtonCount})`)
		}
		this.#buttonCount = resolvedButtonCount
		this.#playerButtonEvents = Object.freeze(layouts.map(events => Object.freeze([...events])))
		this.#buttonEvents = this.#playerButtonEvents[0]
		this.#lightMappings = Object.freeze(mappings.map(({ player, eventType, index }) => Object.freeze({ player, eventType, index })))
		this.#buttonIndexes = new Map(this.#lightMappings.flatMap(({ player, eventType, index }) => player == null ? [] : [[`${player}:${eventType}`, index]]))
		this.#systemLightIndexes = new Map(this.#lightMappings.flatMap(({ player, eventType, index }) => player == null ? [[eventType, index]] : []))
		this.#playerCount = playerCount
		this.#leds = new PicadeLeds({
			brightness,
			refreshRate,
			buttonCount: resolvedButtonCount,
		})
	}

	get connected() {
		return this.#leds.connected
	}

	get transportLedCount() {
		return PICADE_MAX_BUTTON_FRAME_LEDS
	}

	get buttonEvents() {
		return [...this.#buttonEvents]
	}

	get playerButtonEvents() {
		return this.#playerButtonEvents.map(events => [...events])
	}

	get buttonMappings() {
		return this.#lightMappings.map(({ player, eventType, index }) => ({ player, eventType, index }))
	}

	get playerCount() {
		return this.#playerCount
	}

	get buttonCount() {
		return this.#buttonCount
	}

	hasButtonEvent(player, eventType) {
		if (eventType === undefined) return this.#playerButtonEvents.some(events => events.includes(player))
		this.#assertPlayer(player)
		return this.#playerButtonEvents[player].includes(eventType)
	}

	getButtonIndex(player, eventType) {
		this.#assertPlayer(player)
		return this.#buttonIndexes.get(`${player}:${eventType}`) ?? null
	}

	hasSystemLight(id) {
		return this.getSystemLightIndex(id) != null
	}

	getSystemLightIndex(id) {
		const systemLightId = getPicadeSystemLightId(id)
		return systemLightId == null ? null : this.#systemLightIndexes.get(systemLightId) ?? null
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
			this.#registerUnloadCleanup()
			return this
		}
		await this.#leds.connect(filters)
		this.#registerUnloadCleanup()
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
		this.#removeUnloadCleanup()
		if (this.#leds.connected) await this.clear()
		await this.#leds.disconnect()
		return this
	}

	light(button, color) {
		this.#assertButton(button)
		this.#leds.setButton(button, color)
		return this
	}

	setButtonLight(player, eventType, color, options = {}) {
		this.#leds.setButton(this.#requireButton(player, eventType), color, options)
		return this
	}

	resetButtonLight(player, eventType) {
		this.#leds.setButton(this.#requireButton(player, eventType), null)
		return this
	}

	setSystemLight(id, color, options = {}) {
		this.#leds.setButton(this.#requireSystemLight(id), color, options)
		return this
	}

	resetSystemLight(id) {
		this.#leds.setButton(this.#requireSystemLight(id), null)
		return this
	}

	setAllButtonLights(color, options = {}) {
		for (let button = 0; button < this.#buttonCount; button++) this.#leds.setButton(button, color, options)
		return this
	}

	resetAllButtonLights() {
		this.#leds.clear()
		return this
	}

	getPacket(now) {
		return this.#leds.getPacket(now)
	}

	getPreviewBuffer(now) {
		return this.#leds.getPreviewBuffer(now)
	}

	triggerButtonLight(player, eventType, color, { fadeTime = 0.45, holdTime = 0, brightness } = {}) {
		const button = this.#requireButton(player, eventType)
		this.#leds.setButton(button, color, brightness == null ? {} : { brightness })
		for (let light = 0; light < PICADE_MAX_BUTTON_LED_GROUP_SIZE; light++) {
			this.#leds.flashLed(button, light, color, {
				holdTime,
				fadeTime,
				...(brightness == null ? {} : { brightness }),
			})
		}
		return this
	}

	pulseButtonFrame(player, eventType, color, options = {}) {
		this.#leds.overrideButtonFrame(this.#requireButton(player, eventType), color, options)
		return this
	}

	pulseSystemFrame(id, color, options = {}) {
		this.#leds.overrideButtonFrame(this.#requireSystemLight(id), color, options)
		return this
	}

	fadeButtonLight(player, eventType, fromColor, toColor = null, options = {}) {
		this.#leds.fadeButton(this.#requireButton(player, eventType), fromColor, toColor, options)
		return this
	}

	animateButtonLight(player, eventType, mode, color, options = {}) {
		const button = this.#requireButton(player, eventType)
		for (let light = 0; light < PICADE_MAX_BUTTON_LED_GROUP_SIZE; light++) {
			if (mode === 'flash') this.#leds.flashLed(button, light, color, options)
			else if (mode === 'pulse') this.#leds.pulseLed(button, light, color, options)
			else if (mode === 'fade') this.#leds.fadeLed(button, light, color, options.toColor ?? null, options)
			else this.#leds.setLed(button, light, color, options)
		}
		return this
	}

	blendButtonLight(player, eventType, fromColor, toColor, options = {}) {
		return this.fadeButtonLight(player, eventType, fromColor, toColor, options)
	}

	animateSystemLight(id, mode, color, options = {}) {
		const button = this.#requireSystemLight(id)
		for (let light = 0; light < PICADE_MAX_BUTTON_LED_GROUP_SIZE; light++) {
			this.animateLight(button, light, mode, color, options)
		}
		return this
	}

	fadeSystemLight(id, fromColor, toColor = null, options = {}) {
		this.#leds.fadeButton(this.#requireSystemLight(id), fromColor, toColor, options)
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
		this.resetAllButtonLights()
		await this.#leds.write()
		return this
	}

	#registerUnloadCleanup() {
		if (this.#unloadCleanupRegistered || typeof window === 'undefined') return
		this.#unloadClearSent = false
		window.addEventListener('pagehide', this.#unloadHandler)
		window.addEventListener('beforeunload', this.#unloadHandler)
		this.#unloadCleanupRegistered = true
	}

	#removeUnloadCleanup() {
		if (!this.#unloadCleanupRegistered || typeof window === 'undefined') return
		window.removeEventListener('pagehide', this.#unloadHandler)
		window.removeEventListener('beforeunload', this.#unloadHandler)
		this.#unloadCleanupRegistered = false
		this.#unloadClearSent = false
	}

	#requireButton(player, eventType) {
		const button = this.getButtonIndex(player, eventType)
		if (button == null) throw new RangeError(`Unknown Picade button event "${eventType}"`)
		return button
	}

	#requireSystemLight(id) {
		const button = this.getSystemLightIndex(id)
		if (button == null) throw new RangeError(`Unknown Picade system light "${id}"`)
		return button
	}

	#assertPlayer(player) {
		this.#assertPlayerValue(player, this.#playerCount)
	}

	#assertPlayerValue(player, playerCount) {
		if (!Number.isInteger(player) || player < 0 || player >= playerCount) {
			throw new RangeError(`player must be between 0 and ${playerCount - 1}`)
		}
	}

	#assertButton(button) {
		if (!Number.isInteger(button) || button < 0 || button >= this.#buttonCount) {
			throw new RangeError(`button must be between 0 and ${this.#buttonCount - 1}`)
		}
	}
}
