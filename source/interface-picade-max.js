import {
	BUTTON_SELECT,
	DIRECTION_DOWN,
	DIRECTION_LEFT,
	DIRECTION_RIGHT,
	DIRECTION_UP,
} from './hardware/gamepad/gamepad-commands.js'
import {
	createPicadeMaxController,
	findPicadeMaxInputGamepads,
	getPicadeMaxInputInventory,
	logPicadeMaxInputInventory,
	PICADE_MAX_JOYSTICK_DOWN,
	PICADE_MAX_JOYSTICK_LEFT,
	PICADE_MAX_JOYSTICK_RIGHT,
	PICADE_MAX_JOYSTICK_UP,
} from './hardware/gamepad/picade-max-input-controller.js'
import { configurePersonByOperatingMode } from './people/person.presets.js'

const PICADE_STATUS_ID = 'picade-max'
const PICADE_PERSON_MODE_ACTIONS = new Set([BUTTON_SELECT])
export const PICADE_HAT_HOLD_MS = 220

export const PICADE_DRUM_PARTS = Object.freeze([
	{ part: 'kick', label: 'kick', noteNumber: 36, color: '#ff1744', velocity: 1 },
	{ part: 'snare', label: 'snare', noteNumber: 38, color: '#ffb000', velocity: 0.95 },
	{
		part: 'hat',
		label: 'hat',
		noteNumber: 42,
		color: '#b6ff00',
		open: false,
		holdPart: 'hat',
		holdLabel: 'open hat',
		holdNoteNumber: 46,
		holdColor: '#ffe600',
		holdOpen: true,
		velocity: 0.72,
	},
	{ part: 'clap', label: 'clap', noteNumber: 39, color: '#fff4a3', velocity: 0.9 },
	{ part: 'cowbell', label: 'cowbell', noteNumber: 56, color: '#00e5ff', velocity: 0.78 },
	{ part: 'clack', label: 'clack', noteNumber: 37, color: '#7bdff2', velocity: 0.72 },
	{
		part: 'kick',
		label: 'sub kick',
		noteNumber: 35,
		color: '#ff5a00',
		velocity: 0.72,
		soundOptions: { length: 0.62, triStart: 92, triEnd: 34, sineStart: 110, sineApex: 70, sineEnd: 30 },
	},
	{
		part: 'snare',
		label: 'rim snare',
		noteNumber: 40,
		color: '#ff80d5',
		velocity: 0.7,
		soundOptions: { length: 0.16, attack: 0.001, decay: 0.04, bandpassStart: 2400, bandpassEnd: 5200, highpassStart: 3200 },
	},
])

const PICADE_JOYSTICK_PARTS = Object.freeze({
	[PICADE_MAX_JOYSTICK_UP]: PICADE_DRUM_PARTS[1],
	[PICADE_MAX_JOYSTICK_DOWN]: PICADE_DRUM_PARTS[0],
	[PICADE_MAX_JOYSTICK_LEFT]: PICADE_DRUM_PARTS[2],
	[PICADE_MAX_JOYSTICK_RIGHT]: PICADE_DRUM_PARTS[5],
	[DIRECTION_UP]: PICADE_DRUM_PARTS[1],
	[DIRECTION_DOWN]: PICADE_DRUM_PARTS[0],
	[DIRECTION_LEFT]: PICADE_DRUM_PARTS[2],
	[DIRECTION_RIGHT]: PICADE_DRUM_PARTS[5],
})

const PICADE_CONTROL_LIGHTS = Object.freeze([
	{ label: 'select', color: '#f15bb5' },
	{ label: 'start', color: '#9b5de5' },
	{ label: 'left stick', color: '#00bbf9' },
	{ label: 'right stick', color: '#00f5d4' },
	{ label: 'up', color: '#b6ff00' },
	{ label: 'down', color: '#ffe600' },
])

const PICADE_LIGHTS = Object.freeze([
	...PICADE_DRUM_PARTS,
	...PICADE_CONTROL_LIGHTS,
])

const PICADE_TEMPO_PULSES = Object.freeze([
	{ button: 0, division: 'bar' },
	{ button: 1, division: 'half' },
	{ button: 2, division: 'quarter' },
	{ button: 3, division: 'quarter' },
	{ button: 4, division: 'half' },
	{ button: 5, division: 'quarter' },
	{ button: 6, division: 'bar' },
	{ button: 7, division: 'bar' },
	{ button: 8, division: 'bar' },
	{ button: 9, division: 'half' },
	{ button: 10, division: 'quarter' },
	{ button: 11, division: 'bar' },
	{ button: 12, division: 'quarter' },
	{ button: 13, division: 'half' },
])

export const getPicadeBasePersonIndex = player =>
	Math.max(0, Math.min(1, Number.isInteger(player) ? player : 0))

const getExistingPicadePeople = application =>
	application.personManager?.people
	?? application.people
	?? []

export const isActivePicadePerson = person =>
	Boolean(person && (
		person.isActive === true
		|| person.active === true
		|| person.alive === true
		|| person.createdAt > -1
	))

export const getPicadePersonIndex = (application, player) => {
	const start = getPicadeBasePersonIndex(player)
	const people = getExistingPicadePeople(application)
	if (!people.length) return start
	for (let offset = 0; offset < people.length; offset++) {
		const index = (start + offset) % people.length
		if (isActivePicadePerson(people[index])) return index
	}
	return start
}

const getPicadePlayer = (application, player) =>
	application.personManager?.people?.[getPicadePersonIndex(application, player)]
	?? application.people?.[getPicadePersonIndex(application, player)]
	?? application.getPerson?.(getPicadePersonIndex(application, player))
	?? application.personManager?.getPerson?.(getPicadePersonIndex(application, player))
	?? null

const getPicadeDrumPart = event =>
	Number.isInteger(event.button)
		? PICADE_DRUM_PARTS[event.button] ?? null
		: PICADE_JOYSTICK_PARTS[event.action] ?? null

export const resolvePicadeDrumPart = (drum, event) => {
	if (!drum?.holdPart || event?.pressed) return drum
	const heldFor = Math.max(0, event?.heldFor ?? 0)
	if (heldFor < PICADE_HAT_HOLD_MS) return drum
	return {
		...drum,
		part: drum.holdPart,
		label: drum.holdLabel ?? drum.label,
		noteNumber: drum.holdNoteNumber ?? drum.noteNumber,
		color: drum.holdColor ?? drum.color,
		open: drum.holdOpen ?? true,
	}
}

export const getPicadeButtonsForPart = (part, detail={}) =>
	PICADE_DRUM_PARTS
		.map((drum, button) => ({ ...drum, button }))
		.filter(drum => {
			if (drum.part !== part) return false
			if (part !== 'hat' || detail.open == null) return true
			const supportsOpen = drum.open === true || drum.holdOpen === true || drum.noteNumber === 46
			const supportsClosed = drum.open === false || drum.noteNumber === 42
			return detail.open ? supportsOpen : supportsClosed
		})

const playPicadeDrumPart = (application, event) => {
	const drum = resolvePicadeDrumPart(getPicadeDrumPart(event), event)
	if (!drum) return false

	const person = getPicadePlayer(application, event.player)
	const data = { ...drum, player: event.player, person, event }
	if (drum.holdPart && event.pressed) return drum

	if (!event.pressed) {
		if (!drum.holdPart) {
			person?.activeInstrument?.noteOff?.(drum.noteNumber, 0)
			return drum
		}
	}

	if (typeof application.playPicadePercussionPart === 'function') {
		const result = application.playPicadePercussionPart(data)
		if (result !== false) return drum
	}

	if (typeof person?.activeInstrument?.playPart === 'function') {
		application.resumeAudio?.()
		person.activeInstrument.playPart(drum.part, {
			...drum.soundOptions,
			velocity: drum.velocity ?? 1,
			open: drum.open,
		})
		return drum
	}

	if (person?.activeInstrument?.noteOn) {
		application.resumeAudio?.()
		person.activeInstrument.noteOn(drum.noteNumber, 1)
		return drum
	}

	if (typeof application.playPercussionPart === 'function') {
		application.playPercussionPart(drum.part, {
			...drum.soundOptions,
			velocity: drum.velocity ?? 1,
			open: drum.open,
		})
		return drum
	}
	application.resumeAudio?.()
	application.kit?.[drum.part]?.()
	return drum
}

export const cyclePicadePersonMode = (application, event) => {
	if (!event.pressed) return true
	const player = getPicadePersonIndex(application, event.player)
	const person = getPicadePlayer(application, event.player)
	if (!person) {
		application.setFeedback?.(`Player ${player + 1} mode unavailable`, 0, 'gamepad')
		updatePicadeStatus(application, `Player ${player + 1}: mode unavailable`, true)
		return false
	}
	configurePersonByOperatingMode(person, person.userMode + 1)
	const mode = person.userModeData?.description ?? `Mode ${person.userMode + 1}`
	application.setFeedback?.(`Player ${player + 1} mode: ${mode}`, 0, 'gamepad')
	updatePicadeStatus(application, `Player ${player + 1}: ${mode}`, true)
	return true
}

const updatePicadeStatus = (application, detail, active = false) => {
	application.setInputStatus?.(PICADE_STATUS_ID, {
		type: 'picade',
		label: 'Picade Max PCB',
		detail,
		connected: true,
		active,
		ttl: active ? 1200 : undefined,
	})
}

/** Starts the specialised two-player Picade Max input flow. */
export const addPicadeMaxEvents = application => {
	if (application.picadeMaxInterfaceLoaded) return
	application.picadeMaxInterfaceLoaded = true
	console.info('[Picade Max] interface-picade-max loaded; starting test-page style gamepad polling', {
		browserGamepadApi: Boolean(navigator.getGamepads),
		initialSlots: Array.from(navigator.getGamepads?.() ?? []).map(gamepad => gamepad && ({
			index: gamepad.index,
			id: gamepad.id,
			connected: gamepad.connected,
			buttons: gamepad.buttons?.length ?? 0,
			axes: gamepad.axes?.length ?? 0,
		})),
	})

	let controller = null
	let controllerKey = ''
	let connectingPlasma = false
	let lastTempoDivision = null
	let lastInventoryKey = ''
	let unsubscribeDrumPart = null

	const pulseDrumPartLights = (part, detail={}) => {
		if (!controller?.plasma.connected) return
		const velocity = Math.max(0.25, Math.min(1, detail.velocity ?? 1))
		const brightness = Math.max(8, Math.round(31 * velocity))
		for (const drum of getPicadeButtonsForPart(part, detail)) {
			controller.triggerButtonLight(0, drum.button, {
				color: drum.color,
				brightness,
				fadeTime: part === 'kick' ? 0.42 : 0.24,
			})
			controller.triggerButtonLight(1, drum.button, {
				color: drum.color,
				brightness,
				fadeTime: part === 'kick' ? 0.42 : 0.24,
			})
		}
	}

	const ensureDrumPartSubscription = () => {
		if (unsubscribeDrumPart || typeof application.addDrumPartListener !== 'function') return
		unsubscribeDrumPart = application.addDrumPartListener(pulseDrumPartLights)
	}

	const pulseTempoFrame = () => {
		if (!controller?.plasma.connected) return
		const clock = application.clock
		const division = clock?.divisionsElapsed
		if (!Number.isFinite(division) || division === lastTempoDivision) return
		lastTempoDivision = division

		const totalDivisions = Math.max(4, clock?.totalDivisions ?? 96)
		const divisions = {
			bar: totalDivisions,
			half: Math.max(1, Math.round(totalDivisions / 2)),
			quarter: Math.max(1, Math.round(totalDivisions / 4)),
		}
		for (const { button, division: noteLength } of PICADE_TEMPO_PULSES) {
			if (division % divisions[noteLength] !== 0) continue
			const light = PICADE_LIGHTS[button]
			controller.pulseButtonFrame(0, button, light.color, { brightness: 31 })
		}
	}

	const connectPairedPlasma = async () => {
		if (!controller || controller.plasma.connected || connectingPlasma) return
		connectingPlasma = true
		try {
			console.info('[Picade Max] checking paired Plasma serial ports')
			const pairedPorts = await controller.plasma.getPairedPorts()
			console.info('[Picade Max] paired Plasma serial ports', pairedPorts.map(port => port.getInfo?.()))
			if (pairedPorts.length) {
				console.info('[Picade Max] connecting already-paired Plasma lights')
				await controller.connectPlasma()
				updatePicadeStatus(application, 'Two player drum kits / Plasma lights ready')
			}else{
				console.warn('[Picade Max] no paired Plasma serial ports found; quantityOfPeople click should request pairing')
				updatePicadeStatus(application, 'Two player drum kits / Plasma lights need pairing')
			}
		} catch (error) {
			console.warn('Unable to connect paired Picade Plasma lights', error)
			updatePicadeStatus(application, 'Two player drum kits / Plasma lights unavailable')
		} finally {
			connectingPlasma = false
		}
	}

	const refreshPicade = () => {
		const inventory = getPicadeMaxInputInventory()
		const inventoryKey = JSON.stringify(inventory.slots.map(slot => ({
			slot: slot.slot,
			index: slot.index,
			connected: slot.connected,
			id: slot.id,
			mapping: slot.mapping,
			buttons: slot.buttons,
			axes: slot.axes,
			recognised: slot.recognised,
			usbId: slot.usbId,
		})))
		if (inventoryKey !== lastInventoryKey) {
			lastInventoryKey = inventoryKey
			logPicadeMaxInputInventory('interface refresh')
		}

		const gamepads = findPicadeMaxInputGamepads()
		const key = gamepads.map(gamepad => [
			gamepad.index,
			gamepad.player,
			gamepad.source,
			gamepad.buttonOffset,
			gamepad.axisOffset,
		].join(':')).join('|')
		if (gamepads.length !== 2) {
			if (gamepads.length === 0 && inventory.connectedCount) {
				console.warn('[Picade Max] connected gamepads are visible but none match Picade Max USB IDs', inventory.slots)
			}
			if (controller) controller.stop()
			controller = null
			controllerKey = ''
			application.picadeMaxInputActive = gamepads.length > 0
			if (gamepads.length) {
				updatePicadeStatus(
					application,
					`Picade Max input detected (${gamepads.length}/2 player gamepads found)`,
					true
				)
			}else{
				application.clearInputStatus?.(PICADE_STATUS_ID)
			}
			return
		}
		if (key === controllerKey) return

		controller?.stop()
		controller = createPicadeMaxController(gamepads, {
			getButtonLightOptions: ({ button }) => PICADE_LIGHTS[button] ?? {},
		})
		controllerKey = key
		console.info('[Picade Max] PicadeMaxController active with logical player inputs', gamepads.map(gamepad => ({
			index: gamepad.index,
			player: gamepad.player,
			source: gamepad.source,
			buttonOffset: gamepad.buttonOffset,
			axisOffset: gamepad.axisOffset,
			id: gamepad.id,
			buttons: gamepad.buttons?.length,
			axes: gamepad.axes?.length,
			mapping: gamepad.mapping,
		})))
		application.picadeMaxInputActive = true
		for (const gamepad of gamepads) application.clearInputStatus?.(`gamepad-${gamepad.index}`)
		controller.onButton(event => {
			console.info('[Picade Max] input event', {
				player: event.player,
				action: event.action,
				button: event.button,
				pressed: event.pressed,
				heldFor: event.heldFor,
				gamepad: event.gamepad?.id,
			})
			try {
				if (PICADE_PERSON_MODE_ACTIONS.has(event.action)) {
					cyclePicadePersonMode(application, event)
					return
				}
				const drum = getPicadeDrumPart(event)
				if (!drum) return
				const playedDrum = playPicadeDrumPart(application, event)
				if (playedDrum && (event.pressed || drum.holdPart)) {
					pulseDrumPartLights(playedDrum.part, {
						velocity: playedDrum.velocity ?? 1,
						open: playedDrum.open,
						player: event.player,
						source: 'picade',
					})
				}
				updatePicadeStatus(application, `Player ${event.player + 1}: ${playedDrum?.label ?? drum.label ?? drum.part}`, event.pressed)
			} catch (error) {
				console.error('[Picade Max] input event failed; continuing to poll controller', { event, error })
				updatePicadeStatus(application, `Player ${event.player + 1}: input error`, true)
			}
		})
		controller.start()
		updatePicadeStatus(application, 'Picade Max player input ready')
		ensureDrumPartSubscription()
		connectPairedPlasma()
	}

	window.addEventListener('gamepadconnected', refreshPicade)
	window.addEventListener('gamepaddisconnected', refreshPicade)
	refreshPicade()
	setInterval(refreshPicade, 500)
	setInterval(pulseTempoFrame, 50)
}
