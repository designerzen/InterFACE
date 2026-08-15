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
} from './hardware/gamepad/gamepad-commands.js'
import { PICADE_PLASMA_BUTTON_EVENTS } from './hardware/gamepad/picade-plasma.js'
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
import {
	GAMEPAD_DIRECTION_DOWN_LEFT,
	GAMEPAD_DIRECTION_DOWN_RIGHT,
	GAMEPAD_DIRECTION_CHORDS,
	GAMEPAD_DIRECTION_UP_LEFT,
	GAMEPAD_DIRECTION_UP_RIGHT,
	GAMEPAD_MODE_CHORDS,
	GAMEPAD_MODE_METHODS,
	releaseGamePadChords,
} from './interface-gamepad.js'

const PICADE_STATUS_ID = 'picade-max'
export const PICADE_GAMEPAD_MODE_PERCUSSION = 'percussion'
export const PICADE_GAMEPAD_MODE_NOTES = 'notes'
export const PICADE_GAMEPAD_MODE_CHORDS = 'progressive-chords'
export const PICADE_GAMEPAD_MODES = Object.freeze([
	PICADE_GAMEPAD_MODE_PERCUSSION,
	PICADE_GAMEPAD_MODE_NOTES,
	PICADE_GAMEPAD_MODE_CHORDS,
])
export const PICADE_GAMEPAD_MODE_LABELS = Object.freeze({
	[PICADE_GAMEPAD_MODE_PERCUSSION]:'Percussion',
	[PICADE_GAMEPAD_MODE_NOTES]:'One-shot Notes',
	[PICADE_GAMEPAD_MODE_CHORDS]:'Progressive Chords',
})
const PICADE_GAMEPAD_MODE_STYLES = Object.freeze({
	[PICADE_GAMEPAD_MODE_PERCUSSION]:'gamepad-percussion',
	[PICADE_GAMEPAD_MODE_NOTES]:'gamepad-notes',
	[PICADE_GAMEPAD_MODE_CHORDS]:'gamepad-chords',
})
export const PICADE_HAT_HOLD_MS = 220

const isPicadeBackingTrackEnabled = application =>
	Boolean(application.getState?.('backingTrack') ?? application.stateMachine?.get?.('backingTrack'))

/** Netronome resets its 24 MIDI clock divisions after every metronome beat. */
export const shouldPulsePicadeMetronome = (previousDivision, division) =>
	Number.isFinite(division)
	&& (previousDivision == null ? division === 0 : division < previousDivision)

const drum = (part, label, noteNumber, color, options={}) => Object.freeze({
	part, label, noteNumber, color, velocity:0.78, ...options,
})

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
		part: 'sub-kick',
		label: 'sub kick',
		noteNumber: 35,
		color: '#ff5a00',
		velocity: 0.72,
	},
	{
		part: 'rim',
		label: 'rim snare',
		noteNumber: 40,
		color: '#ff80d5',
		velocity: 0.7,
	},
	{ part: 'low-tom', label: 'low tom', noteNumber: 45, color: '#7c3aed', velocity: 0.82 },
	{ part: 'mid-tom', label: 'mid tom', noteNumber: 47, color: '#2563eb', velocity: 0.8 },
	{ part: 'high-tom', label: 'high tom', noteNumber: 50, color: '#0891b2', velocity: 0.78 },
	{ part: 'shaker', label: 'shaker', noteNumber: 70, color: '#0f766e', velocity: 0.66 },
	{ part: 'fingerSnap', label: 'finger snap', noteNumber: 39, color: '#ec407a', velocity: 0.72 },
])

export const PICADE_DRUM_BANKS = Object.freeze([
	Object.freeze({ id:'kit', label:'Kit', drums:PICADE_DRUM_PARTS }),
	Object.freeze({ id:'hand', label:'Hand Percussion', drums:Object.freeze([
		drum('low-bongo', 'low bongo', 61, '#ff7043'),
		drum('high-bongo', 'high bongo', 60, '#ff9f43'),
		drum('low-conga', 'low conga', 64, '#ef5350'),
		drum('high-conga', 'open high conga', 63, '#ffca28'),
		drum('mute-conga', 'muted high conga', 62, '#d4e157'),
		drum('cabasa', 'cabasa', 69, '#66bb6a'),
		drum('maracas', 'maracas', 70, '#26a69a'),
		drum('mute-triangle', 'muted triangle', 80, '#26c6da'),
		drum('open-triangle', 'open triangle', 81, '#29b6f6'),
		drum('tambourine', 'tambourine', 54, '#42a5f5'),
		drum('chekere', 'chekere', 82, '#5c6bc0'),
		drum('agogoHigh', 'high agogo', 67, '#7e57c2'),
		drum('agogoLow', 'low agogo', 68, '#ab47bc'),
	]) }),
	Object.freeze({ id:'metal', label:'Sticks, Metals & Scrapes', drums:Object.freeze([
		drum('crossStick', 'cross stick', 37, '#f06292'),
		drum('claves', 'claves', 75, '#ba68c8'),
		drum('woodblockHigh', 'high woodblock', 76, '#9575cd'),
		drum('woodblockLow', 'low woodblock', 77, '#7986cb'),
		drum('castanets', 'castanets', 85, '#64b5f6'),
		drum('crash', 'crash', 49, '#4fc3f7', { velocity:0.88 }),
		drum('ride', 'ride', 51, '#4dd0e1'),
		drum('splash', 'splash', 55, '#4db6ac'),
		drum('china', 'china cymbal', 52, '#81c784'),
		drum('timbaleHigh', 'high timbale', 65, '#aed581'),
		drum('timbaleLow', 'low timbale', 66, '#dce775'),
		drum('guiroShort', 'short guiro', 73, '#ffd54f'),
		drum('guiroLong', 'long guiro', 74, '#ffb74d'),
	]) }),
	Object.freeze({ id:'effects', label:'Percussion Effects', drums:Object.freeze([
		drum('rimshot', 'rimshot', 37, '#ff4081'),
		drum('cuicaMute', 'muted cuica', 78, '#ff5252'),
		drum('cuicaOpen', 'open cuica', 79, '#ff6e40'),
		drum('whistleShort', 'short whistle', 71, '#ffd740'),
		drum('whistleLong', 'long whistle', 72, '#c6ff00'),
		drum('surdoMute', 'muted surdo', 86, '#69f0ae'),
		drum('surdoOpen', 'open surdo', 87, '#64ffda'),
		drum('quijada', 'quijada', 74, '#18ffff'),
		drum('starChime', 'star chime', 84, '#40c4ff'),
		drum('windChime', 'wind chime', 84, '#448aff'),
		drum('syndrum', 'syndrum', 47, '#7c4dff'),
		drum('laserTom', 'laser tom', 48, '#e040fb'),
		drum('metalHit', 'metallic hit', 53, '#ff4081'),
	]) }),
])

export const getPicadeDrumBank = index => PICADE_DRUM_BANKS[
	((Number.isInteger(index) ? index : 0) % PICADE_DRUM_BANKS.length + PICADE_DRUM_BANKS.length) % PICADE_DRUM_BANKS.length
]

export const getNextPicadeDrumBankIndex = (index, direction=1) => {
	const current = Number.isInteger(index) ? index : 0
	return (current + Math.sign(direction || 1) + PICADE_DRUM_BANKS.length) % PICADE_DRUM_BANKS.length
}

export const getNextPicadeGamepadModeIndex = index => {
	const current = Number.isInteger(index) ? index : 0
	return (current + 1) % PICADE_GAMEPAD_MODES.length
}

export const shouldChangePicadeDrumBank = (event, selectHeld=false) => Boolean(
	selectHeld
	&& event?.pressed
	&& (event.action === PICADE_MAX_JOYSTICK_LEFT || event.action === PICADE_MAX_JOYSTICK_RIGHT)
)
export const shouldAdvancePicadeGamepadMode = (event, selectUsed=false) => Boolean(
	event?.action === BUTTON_SELECT && event.pressed === false && !selectUsed
)

const PICADE_MUSICAL_ACTIONS = Object.freeze([
	BUTTON_B, BUTTON_A, BUTTON_Y, BUTTON_X,
	BUTTON_LEFT_SHOULDER_BUTTON, BUTTON_RIGHT_SHOULDER_BUTTON,
	BUTTON_LEFT_SHOULDER_TWO, BUTTON_RIGHT_SHOULDER_TWO,
	BUTTON_START, BUTTON_LEFT_S, BUTTON_RIGHT_S,
	DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT,
	GAMEPAD_DIRECTION_UP_RIGHT, GAMEPAD_DIRECTION_DOWN_RIGHT,
	GAMEPAD_DIRECTION_DOWN_LEFT, GAMEPAD_DIRECTION_UP_LEFT,
])
const PICADE_NOTE_OFFSETS = new Map(PICADE_MUSICAL_ACTIONS.map((action, index) => [action, index]))
const PICADE_JOYSTICK_MUSICAL_ACTIONS = Object.freeze({
	[PICADE_MAX_JOYSTICK_UP]:DIRECTION_UP,
	[PICADE_MAX_JOYSTICK_DOWN]:DIRECTION_DOWN,
	[PICADE_MAX_JOYSTICK_LEFT]:DIRECTION_LEFT,
	[PICADE_MAX_JOYSTICK_RIGHT]:DIRECTION_RIGHT,
})
export const getPicadeMusicalAction = action => PICADE_JOYSTICK_MUSICAL_ACTIONS[action] ?? action

const PICADE_CARDINAL_DIRECTIONS = new Set([
	DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT,
])
export const getPicadeDiagonalAction = directions => {
	const held = directions instanceof Set ? directions : new Set(directions ?? [])
	if (held.has(DIRECTION_UP) && held.has(DIRECTION_RIGHT)) return GAMEPAD_DIRECTION_UP_RIGHT
	if (held.has(DIRECTION_DOWN) && held.has(DIRECTION_RIGHT)) return GAMEPAD_DIRECTION_DOWN_RIGHT
	if (held.has(DIRECTION_DOWN) && held.has(DIRECTION_LEFT)) return GAMEPAD_DIRECTION_DOWN_LEFT
	if (held.has(DIRECTION_UP) && held.has(DIRECTION_LEFT)) return GAMEPAD_DIRECTION_UP_LEFT
	return [DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT].find(direction => held.has(direction)) ?? null
}

export const getPicadeModePresentation = (application, player, mode) => {
	const person = getPicadePersonIndex(application, player)
	return {
		person,
		label:PICADE_GAMEPAD_MODE_LABELS[mode] ?? mode,
		style:PICADE_GAMEPAD_MODE_STYLES[mode] ?? 'gamepad',
	}
}

export const getPicadeModeFeedback = (application, player, mode, detail='') => {
	const presentation = getPicadeModePresentation(application, player, mode)
	const suffix = detail ? ` · ${detail}` : ''
	return `Player ${player + 1} · Person ${presentation.person + 1} · ${presentation.label}${suffix}`
}

export const updatePicadeModeHud = (application, playerModes, activePlayer=null) => {
	playerModes.forEach((mode, player) => {
		const presentation = getPicadeModePresentation(application, player, mode)
		application.setInputStatus?.(`${PICADE_STATUS_ID}-player-${player + 1}`, {
			type:presentation.style,
			label:`Player ${player + 1} · Person ${presentation.person + 1}`,
			detail:presentation.label,
			connected:true,
			active:activePlayer === player,
		})
	})
}

const getPicadeMusicalNote = (person, action) => {
	const offset = PICADE_NOTE_OFFSETS.get(getPicadeMusicalAction(action))
	if (!Number.isInteger(offset)) return null
	const current = Number.isFinite(person?.noteNumber) && person.noteNumber >= 0 ? person.noteNumber : 60
	return 60 + ((Math.round(current) % 12) + 12) % 12 + offset
}

export const playPicadeOneShotNote = (application, event, activeNotes=new Map()) => {
	const person = getPicadePlayer(application, event.player)
	const instrument = person?.activeInstrument
	const noteNumber = getPicadeMusicalNote(person, event.action)
	if (!instrument || !Number.isFinite(noteNumber)) return false
	const key = `${event.player}:${event.action}`
	const active = activeNotes.get(key)
	if (!event.pressed) {
		if (active) active.instrument.noteOff?.(active.noteNumber, 0)
		activeNotes.delete(key)
		return true
	}
	if (active) active.instrument.noteOff?.(active.noteNumber, 0)
	application.resumeAudio?.()
	instrument.noteOn?.(noteNumber, 0.8)
	activeNotes.set(key, { instrument, noteNumber })
	application.setFeedback?.(
		getPicadeModeFeedback(application, event.player, PICADE_GAMEPAD_MODE_NOTES, `Note ${noteNumber}`),
		0,
		PICADE_GAMEPAD_MODE_STYLES[PICADE_GAMEPAD_MODE_NOTES],
	)
	return true
}

export const playPicadeProgressiveChord = (application, event) => {
	const musicalAction = getPicadeMusicalAction(event.action)
	const action = musicalAction === BUTTON_START ? BUTTON_LEFT_S : musicalAction
	const gamepad = event.gamepad ?? { index:event.player }
	GAMEPAD_MODE_METHODS[GAMEPAD_MODE_CHORDS](
		application,
		gamepad,
		action,
		event.pressed,
		event.heldFor,
		event.player,
	)
	if (event.pressed) {
		const detail = GAMEPAD_DIRECTION_CHORDS[action]
			? `Chord ${GAMEPAD_DIRECTION_CHORDS[action].name}`
			: 'Tonic note'
		application.setFeedback?.(
			getPicadeModeFeedback(application, event.player, PICADE_GAMEPAD_MODE_CHORDS, detail),
			0,
			PICADE_GAMEPAD_MODE_STYLES[PICADE_GAMEPAD_MODE_CHORDS],
		)
	}
	return PICADE_MUSICAL_ACTIONS.includes(action)
}

const PICADE_CONTROL_LIGHTS = Object.freeze([
	{ label: 'select', color: '#f15bb5' },
	{ label: 'start', color: '#9b5de5' },
	{ label: 'left stick', color: '#00bbf9' },
	{ label: 'right stick', color: '#00f5d4' },
	{ label: 'up', color: '#b6ff00' },
	{ label: 'down', color: '#ffe600' },
	{ label: 'left', color: '#82aaff' },
	{ label: 'right', color: '#ff9f1c' },
])

const PICADE_LIGHT_EVENT_TYPES = PICADE_PLASMA_BUTTON_EVENTS
const PICADE_DRUM_EVENT_TYPES = Object.freeze([
	BUTTON_B,
	BUTTON_A,
	BUTTON_Y,
	BUTTON_X,
	BUTTON_LEFT_SHOULDER_BUTTON,
	BUTTON_RIGHT_SHOULDER_BUTTON,
	BUTTON_LEFT_SHOULDER_TWO,
	BUTTON_RIGHT_SHOULDER_TWO,
	BUTTON_START,
	BUTTON_LEFT_S,
	BUTTON_RIGHT_S,
	DIRECTION_UP,
	DIRECTION_DOWN,
])
const PICADE_LIGHTS = Object.freeze(Object.fromEntries(
	PICADE_DRUM_EVENT_TYPES.map((eventType, index) => [eventType, PICADE_DRUM_PARTS[index]]),
))

const PICADE_TEMPO_PULSES = Object.freeze([
	{ eventType: PICADE_LIGHT_EVENT_TYPES[0], division: 'bar' },
	{ eventType: PICADE_LIGHT_EVENT_TYPES[1], division: 'half' },
	{ eventType: PICADE_LIGHT_EVENT_TYPES[2], division: 'quarter' },
	{ eventType: PICADE_LIGHT_EVENT_TYPES[3], division: 'quarter' },
	{ eventType: PICADE_LIGHT_EVENT_TYPES[4], division: 'half' },
	{ eventType: PICADE_LIGHT_EVENT_TYPES[5], division: 'quarter' },
	{ eventType: PICADE_LIGHT_EVENT_TYPES[6], division: 'bar' },
	{ eventType: PICADE_LIGHT_EVENT_TYPES[7], division: 'bar' },
	{ eventType: PICADE_LIGHT_EVENT_TYPES[8], division: 'bar' },
	{ eventType: PICADE_LIGHT_EVENT_TYPES[9], division: 'half' },
	{ eventType: PICADE_LIGHT_EVENT_TYPES[10], division: 'quarter' },
	{ eventType: PICADE_LIGHT_EVENT_TYPES[11], division: 'bar' },
	{ eventType: PICADE_LIGHT_EVENT_TYPES[12], division: 'quarter' },
	{ eventType: PICADE_LIGHT_EVENT_TYPES[13], division: 'half' },
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

export const getPicadeDrumPart = (event, bankIndex=0) => {
	const bank = getPicadeDrumBank(bankIndex).drums
	const eventIndex = PICADE_DRUM_EVENT_TYPES.indexOf(event.action)
	return eventIndex >= 0
		? bank[eventIndex] ?? null
		: event.action === PICADE_MAX_JOYSTICK_UP || event.action === DIRECTION_UP
			? bank[1] ?? null
			: event.action === PICADE_MAX_JOYSTICK_DOWN || event.action === DIRECTION_DOWN
				? bank[0] ?? null
				: event.action === PICADE_MAX_JOYSTICK_LEFT || event.action === DIRECTION_LEFT
					? bank[2] ?? null
					: event.action === PICADE_MAX_JOYSTICK_RIGHT || event.action === DIRECTION_RIGHT
						? bank[5] ?? null
						: null
}

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

const PICADE_ARRANGER_PART_ALIASES = Object.freeze({
	bongoHigh:'high-bongo', bongoLow:'low-bongo',
	congaMute:'mute-conga', congaHigh:'high-conga', congaLow:'low-conga',
	triangleMute:'mute-triangle', triangleOpen:'open-triangle',
})

export const getPicadeButtonsForPart = (part, detail={}, bankIndex=0) =>
	getPicadeDrumBank(bankIndex).drums
		.map((drum, button) => ({ ...drum, button, eventType: PICADE_DRUM_EVENT_TYPES[button] }))
		.filter(drum => {
			if (drum.part !== (PICADE_ARRANGER_PART_ALIASES[part] ?? part)) return false
			if (part !== 'hat' || detail.open == null) return true
			const supportsOpen = drum.open === true || drum.holdOpen === true || drum.noteNumber === 46
			const supportsClosed = drum.open === false || drum.noteNumber === 42
			return detail.open ? supportsOpen : supportsClosed
		})

export const playPicadeDrumPart = (application, event, onPercussionRepeat, bankIndex=event?.drumBank ?? 0) => {
	const pressedDrum = getPicadeDrumPart(event, bankIndex)
	const drum = resolvePicadeDrumPart(pressedDrum, event)
	if (!drum) return false

	const person = getPicadePlayer(application, event.player)
	const data = { ...drum, player: event.player, person, event }
	if (typeof application.setPercussionInput === 'function') {
		application.setPercussionInput(
			`picade:${event.player}:${event.action}`,
			pressedDrum.part,
			event.pressed,
			{
				...pressedDrum.soundOptions,
				velocity: pressedDrum.velocity ?? 1,
				open: pressedDrum.open,
				source: 'picade',
				onPercussionRepeat,
			},
		)
		return pressedDrum
	}
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

	// Picade buttons are always live drum pads.  The backing track only adds
	// automatic hits; it must not be required for a player to hear the kit.
	if (typeof application.playPercussionPart === 'function') {
		const result = application.playPercussionPart(drum.part, {
			...drum.soundOptions,
			velocity: drum.velocity ?? 1,
			open: drum.open,
		})
		if (result != null) return drum
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
	let lightPreset = 'default'
	let connectingPlasma = false
	let lastTempoDivision = null
	let lastInventoryKey = ''
	let unsubscribeDrumPart = null
	const playerDrumBanks = [0, 0]
	const playerSelectHeld = [false, false]
	const playerSelectUsed = [false, false]
	const playerGamepadModes = [0, 0]
	const playerJoystickDirections = [new Set(), new Set()]
	const playerJoystickActions = [null, null]
	const activePicadeNotes = new Map()
	const stopPicadeNotes = player => {
		for (const [key, active] of activePicadeNotes) {
			if (!key.startsWith(`${player}:`)) continue
			active.instrument.noteOff?.(active.noteNumber, 0)
			activePicadeNotes.delete(key)
		}
	}
	const selectGamepadMode = (player, gamepad) => {
		const previous = PICADE_GAMEPAD_MODES[playerGamepadModes[player]]
		playerGamepadModes[player] = getNextPicadeGamepadModeIndex(playerGamepadModes[player])
		const mode = PICADE_GAMEPAD_MODES[playerGamepadModes[player]]
		if (previous === PICADE_GAMEPAD_MODE_PERCUSSION) application.releasePercussionInputs?.(`picade:${player}:`)
		if (previous === PICADE_GAMEPAD_MODE_NOTES) stopPicadeNotes(player)
		if (previous === PICADE_GAMEPAD_MODE_CHORDS) releaseGamePadChords(gamepad)
		playerJoystickDirections[player].clear()
		playerJoystickActions[player] = null
		const presentation = getPicadeModePresentation(application, player, mode)
		application.setFeedback?.(
			getPicadeModeFeedback(application, player, mode),
			0,
			presentation.style,
		)
		updatePicadeModeHud(application, playerGamepadModes.map(index => PICADE_GAMEPAD_MODES[index]), player)
		return mode
	}
	const routePicadeMusicalEvent = (event, play) => {
		const direction = getPicadeMusicalAction(event.action)
		if (!PICADE_CARDINAL_DIRECTIONS.has(direction)) return play(event)

		const heldDirections = playerJoystickDirections[event.player]
		if (event.pressed) heldDirections.add(direction)
		else heldDirections.delete(direction)
		const previous = playerJoystickActions[event.player]
		const next = getPicadeDiagonalAction(heldDirections)
		if (previous === next) return true
		if (previous) play({ ...event, action:previous, pressed:false })
		if (next) play({ ...event, action:next, pressed:true, heldFor:0 })
		playerJoystickActions[event.player] = next
		return true
	}
	const getPlayerDrum = (player, eventType) => {
		const index = PICADE_DRUM_EVENT_TYPES.indexOf(eventType)
		return index >= 0 ? getPicadeDrumBank(playerDrumBanks[player]).drums[index] : null
	}
	const paintDrumBank = player => {
		if (!controller?.plasma.connected) return
		for (const [index, eventType] of PICADE_DRUM_EVENT_TYPES.entries()) {
			const selected = getPicadeDrumBank(playerDrumBanks[player]).drums[index]
			if (selected) controller.setButtonLight(player, eventType, selected.color, { brightness:7 })
			else controller.setButtonLight(player, eventType, '#000000', { brightness:0 })
		}
	}
	const selectDrumBank = (player, direction) => {
		playerDrumBanks[player] = getNextPicadeDrumBankIndex(playerDrumBanks[player], direction)
		const bank = getPicadeDrumBank(playerDrumBanks[player])
		paintDrumBank(player)
		application.setFeedback?.(`Player ${player + 1} drums: ${bank.label}`, 0, 'gamepad')
		updatePicadeStatus(application, `Player ${player + 1}: ${bank.label} drum bank`, true)
		return bank
	}

	const pulseDrumPartLights = (part, detail={}) => {
		// With no backing track, physical button feedback is owned by the controller.
		if (!isPicadeBackingTrackEnabled(application)) return
		if (!controller?.plasma.connected) return
		const velocity = Math.max(0.25, Math.min(1, detail.velocity ?? 1))
		const brightness = Math.max(8, Math.round(31 * velocity))
		for (const player of [0, 1]) {
			for (const drum of getPicadeButtonsForPart(part, detail, playerDrumBanks[player])) {
				controller.triggerButtonLight(player, drum.eventType, {
					color: drum.color,
					brightness,
					fadeTime: part === 'kick' ? 0.42 : 0.24,
				})
			}
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
		const previousDivision = lastTempoDivision
		lastTempoDivision = division

		const totalDivisions = Math.max(4, clock?.totalDivisions ?? 96)
		const divisions = {
			bar: totalDivisions,
			half: Math.max(1, Math.round(totalDivisions / 2)),
			quarter: Math.max(1, Math.round(totalDivisions / 4)),
		}
		if (shouldPulsePicadeMetronome(previousDivision, division)) {
			// Polling can skip the literal zero division, so detect the clock wrap instead.
			const pulseOptions = {
				brightness: 31,
				holdTime: 0.055,
				fadeTime: 0.18,
			}
			if (lightPreset === 'table') {
				controller.animateButtonLight(0, BUTTON_LEFT_SHOULDER_BUTTON, 'flash', '#ffffff', pulseOptions)
			} else {
				controller.animateSystemLight('s1', 'flash', '#ffffff', pulseOptions)
			}
		}
		// A stopped backing track leaves every mapped button light under the player's hands.
		if (!isPicadeBackingTrackEnabled(application)) return
		for (const { eventType, division: noteLength } of PICADE_TEMPO_PULSES) {
			if (division % divisions[noteLength] !== 0) continue
			const light = PICADE_LIGHTS[eventType]
			if (!light) continue
			controller.pulseButtonFrame(0, eventType, light.color, { brightness: 31 })
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
				paintDrumBank(0)
				paintDrumBank(1)
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

	const refreshPicade = async () => {
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
		lightPreset = new URLSearchParams(window.location.search).get('lights') ?? application.options?.lights ?? 'default'
		const key = [lightPreset, gamepads.map(gamepad => [
			gamepad.index,
			gamepad.player,
			gamepad.source,
			gamepad.buttonOffset,
			gamepad.axisOffset,
		].join(':')).join('|')].join('|')
		if (gamepads.length !== 2) {
			if (gamepads.length === 0 && inventory.connectedCount) {
				console.warn('[Picade Max] connected gamepads are visible but none match Picade Max USB IDs', inventory.slots)
			}
			application.releasePercussionInputs?.('picade:')
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
				application.clearInputStatus?.(`${PICADE_STATUS_ID}-player-1`)
				application.clearInputStatus?.(`${PICADE_STATUS_ID}-player-2`)
			}
			return
		}
		if (key === controllerKey) return

		application.releasePercussionInputs?.('picade:')
		await controller?.disconnect()
		controller = createPicadeMaxController(gamepads, {
			lightPreset,
			getButtonLightOptions: ({ player, eventType }) => getPlayerDrum(player, eventType) ?? PICADE_LIGHTS[eventType] ?? {},
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
				if (event.action === BUTTON_SELECT) {
					if (event.pressed) {
						playerSelectHeld[event.player] = true
						playerSelectUsed[event.player] = false
					}else{
						playerSelectHeld[event.player] = false
						if (shouldAdvancePicadeGamepadMode(event, playerSelectUsed[event.player])) selectGamepadMode(event.player, event.gamepad)
						playerSelectUsed[event.player] = false
					}
					return
				}
				if (shouldChangePicadeDrumBank(event, playerSelectHeld[event.player])) {
					playerSelectUsed[event.player] = true
					selectDrumBank(event.player, event.action === PICADE_MAX_JOYSTICK_RIGHT ? 1 : -1)
				}
				const gamepadMode = PICADE_GAMEPAD_MODES[playerGamepadModes[event.player]]
				if (gamepadMode === PICADE_GAMEPAD_MODE_NOTES) {
					routePicadeMusicalEvent(event, musicalEvent => playPicadeOneShotNote(application, musicalEvent, activePicadeNotes))
					updatePicadeModeHud(application, playerGamepadModes.map(index => PICADE_GAMEPAD_MODES[index]), event.pressed ? event.player : null)
					return
				}
				if (gamepadMode === PICADE_GAMEPAD_MODE_CHORDS) {
					routePicadeMusicalEvent(event, musicalEvent => playPicadeProgressiveChord(application, musicalEvent))
					updatePicadeModeHud(application, playerGamepadModes.map(index => PICADE_GAMEPAD_MODES[index]), event.pressed ? event.player : null)
					return
				}
				const bankIndex = playerDrumBanks[event.player] ?? 0
				const drum = getPicadeDrumPart(event, bankIndex)
				if (!drum) return
				const playedDrum = playPicadeDrumPart(
					application,
					{ ...event, drumBank:bankIndex },
					() => controller?.repeatHeldButtonLight(event.player, event.action),
					bankIndex,
				)
				if (isPicadeBackingTrackEnabled(application) && playedDrum && (event.pressed || drum.holdPart)) {
					pulseDrumPartLights(playedDrum.part, {
						velocity: playedDrum.velocity ?? 1,
						open: playedDrum.open,
						player: event.player,
						source: 'picade',
					})
				}
				if (event.pressed && playedDrum) application.setFeedback?.(
					getPicadeModeFeedback(application, event.player, gamepadMode, playedDrum.label ?? drum.label ?? drum.part),
					0,
					PICADE_GAMEPAD_MODE_STYLES[gamepadMode],
				)
				updatePicadeModeHud(application, playerGamepadModes.map(index => PICADE_GAMEPAD_MODES[index]), event.pressed ? event.player : null)
				updatePicadeStatus(application, `Player ${event.player + 1}: ${playedDrum?.label ?? drum.label ?? drum.part}`, event.pressed)
			} catch (error) {
				console.error('[Picade Max] input event failed; continuing to poll controller', { event, error })
				updatePicadeStatus(application, `Player ${event.player + 1}: input error`, true)
			}
		})
		controller.start()
		updatePicadeModeHud(application, playerGamepadModes.map(index => PICADE_GAMEPAD_MODES[index]))
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
