const { TextDecoder, TextEncoder } = require('util')

global.TextDecoder ??= TextDecoder
global.TextEncoder ??= TextEncoder

let PICADE_DRUM_PARTS
let PICADE_HAT_HOLD_MS
let PICADE_DRUM_BANKS
let getNextPicadeDrumBankIndex
let getPicadeDrumPart
let shouldChangePicadeDrumBank
let shouldAdvancePicadeGamepadMode
let PICADE_GAMEPAD_MODES
let PICADE_GAMEPAD_MODE_PERCUSSION
let PICADE_GAMEPAD_MODE_NOTES
let PICADE_GAMEPAD_MODE_CHORDS
let getNextPicadeGamepadModeIndex
let playPicadeOneShotNote
let playPicadeProgressiveChord
let getPicadeDiagonalAction
let getPicadeModeFeedback
let updatePicadeModeHud
let getPicadeBasePersonIndex
let cyclePicadePersonMode
let getPicadePersonIndex
let getPicadeButtonsForPart
let isActivePicadePerson
let playPicadeDrumPart
let resolvePicadeDrumPart
let shouldPulsePicadeMetronome

beforeAll(async () => {
	;({
		PICADE_DRUM_PARTS,
		PICADE_HAT_HOLD_MS,
		PICADE_DRUM_BANKS,
		getNextPicadeDrumBankIndex,
		getPicadeDrumPart,
		shouldChangePicadeDrumBank,
		shouldAdvancePicadeGamepadMode,
		PICADE_GAMEPAD_MODES,
		PICADE_GAMEPAD_MODE_PERCUSSION,
		PICADE_GAMEPAD_MODE_NOTES,
		PICADE_GAMEPAD_MODE_CHORDS,
		getNextPicadeGamepadModeIndex,
		playPicadeOneShotNote,
		playPicadeProgressiveChord,
		getPicadeDiagonalAction,
		getPicadeModeFeedback,
		updatePicadeModeHud,
		getPicadeBasePersonIndex,
		cyclePicadePersonMode,
		getPicadePersonIndex,
		getPicadeButtonsForPart,
		isActivePicadePerson,
		playPicadeDrumPart,
		resolvePicadeDrumPart,
		shouldPulsePicadeMetronome,
	} = await import('../source/interface-picade-max.js'))
})

describe('Picade Max percussion mapping', () => {
	test('ticks S1 once when the metronome division wraps back to zero', () => {
		expect(shouldPulsePicadeMetronome(null, 7)).toBe(false)
		expect(shouldPulsePicadeMetronome(null, 0)).toBe(true)
		expect(shouldPulsePicadeMetronome(6, 7)).toBe(false)
		expect(shouldPulsePicadeMetronome(23, 0)).toBe(true)
		expect(shouldPulsePicadeMetronome(23, 1)).toBe(true)
	})

	test('banks every expanded drum voice into a coloured Picade button', () => {
		const expanded = [
			'rimshot', 'crossStick', 'claves', 'woodblockHigh', 'woodblockLow', 'castanets',
			'crash', 'ride', 'splash', 'china', 'tambourine', 'chekere', 'agogoHigh', 'agogoLow',
			'timbaleHigh', 'timbaleLow', 'guiroShort', 'guiroLong', 'cuicaMute', 'cuicaOpen',
			'whistleShort', 'whistleLong', 'surdoMute', 'surdoOpen', 'quijada', 'starChime',
			'windChime', 'fingerSnap', 'syndrum', 'laserTom', 'metalHit',
		]
		const banked = PICADE_DRUM_BANKS.flatMap(bank => bank.drums)
		expect(banked.map(drum => drum.part)).toEqual(expect.arrayContaining(expanded))
		expect(banked.every(drum => /^#[0-9a-f]{6}$/i.test(drum.color))).toBe(true)
		expect(PICADE_DRUM_BANKS.every(bank => bank.drums.length <= 13)).toBe(true)
		expect(getNextPicadeDrumBankIndex(0, -1)).toBe(PICADE_DRUM_BANKS.length - 1)
		expect(getNextPicadeDrumBankIndex(PICADE_DRUM_BANKS.length - 1, 1)).toBe(0)
	})

	test('requires Select for bank changes while every joystick direction remains musical', () => {
		expect(shouldChangePicadeDrumBank({ action:'picade-joystick-left', pressed:true }, false)).toBe(false)
		expect(shouldChangePicadeDrumBank({ action:'picade-joystick-left', pressed:true }, true)).toBe(true)
		expect(shouldChangePicadeDrumBank({ action:'picade-joystick-right', pressed:true }, true)).toBe(true)
		expect(shouldChangePicadeDrumBank({ action:'picade-joystick-right', pressed:false }, true)).toBe(false)
		expect([
			'picade-joystick-up',
			'picade-joystick-down',
			'picade-joystick-left',
			'picade-joystick-right',
		].map(action => getPicadeDrumPart({ action }, 0)?.part)).toEqual([
			'snare', 'kick', 'hat', 'clack',
		])
	})

	test('makes a Select tap advance through percussion, notes and progressive chords', () => {
		expect(PICADE_GAMEPAD_MODES).toEqual([
			PICADE_GAMEPAD_MODE_PERCUSSION,
			PICADE_GAMEPAD_MODE_NOTES,
			PICADE_GAMEPAD_MODE_CHORDS,
		])
		expect(getNextPicadeGamepadModeIndex(0)).toBe(1)
		expect(getNextPicadeGamepadModeIndex(1)).toBe(2)
		expect(getNextPicadeGamepadModeIndex(2)).toBe(0)
		expect(shouldAdvancePicadeGamepadMode({ action:'select', pressed:false }, false)).toBe(true)
		expect(shouldAdvancePicadeGamepadMode({ action:'select', pressed:false }, true)).toBe(false)
		expect(shouldAdvancePicadeGamepadMode({ action:'select', pressed:true }, false)).toBe(false)
	})

	test('plays chromatic one-shot notes on press and releases the same note', () => {
		const instrument = { noteOn:jest.fn(), noteOff:jest.fn() }
		const application = {
			people:[{ noteNumber:60, activeInstrument:instrument }],
			resumeAudio:jest.fn(),
			setFeedback:jest.fn(),
		}
		const activeNotes = new Map()
		playPicadeOneShotNote(application, { player:0, action:'a', pressed:true }, activeNotes)
		playPicadeOneShotNote(application, { player:0, action:'a', pressed:false }, activeNotes)

		expect(instrument.noteOn).toHaveBeenCalledWith(61, 0.8)
		expect(instrument.noteOff).toHaveBeenCalledWith(61, 0)
		expect(activeNotes.size).toBe(0)
	})

	test('gives every joystick diagonal its own one-shot note', () => {
		const instrument = { noteOn:jest.fn(), noteOff:jest.fn() }
		const application = {
			people:[{ noteNumber:60, activeInstrument:instrument }],
			setFeedback:jest.fn(),
		}
		const activeNotes = new Map()
		const diagonals = [
			getPicadeDiagonalAction(new Set(['dup', 'dright'])),
			getPicadeDiagonalAction(new Set(['ddown', 'dright'])),
			getPicadeDiagonalAction(new Set(['ddown', 'dleft'])),
			getPicadeDiagonalAction(new Set(['dup', 'dleft'])),
		]

		diagonals.forEach(action => playPicadeOneShotNote(application, { player:0, action, pressed:true }, activeNotes))

		expect(new Set(diagonals).size).toBe(4)
		expect(instrument.noteOn.mock.calls.map(([note]) => note)).toEqual([75, 76, 77, 78])
	})

	test('plays the progressive I chord from joystick up and releases it', () => {
		const instrument = { chordOn:jest.fn(), chordOff:jest.fn() }
		const application = {
			personManager:{ people:[{ noteNumber:60, activeInstrument:instrument }] },
			resumeAudio:jest.fn(),
			setFeedback:jest.fn(),
		}
		const gamepad = { index:20 }
		playPicadeProgressiveChord(application, { player:0, action:'picade-joystick-up', pressed:true, gamepad })
		const chord = instrument.chordOn.mock.calls[0][0]
		expect(chord.map(note => note.noteNumber)).toEqual([60, 64, 67])
		playPicadeProgressiveChord(application, { player:0, action:'picade-joystick-up', pressed:false, gamepad })
		expect(instrument.chordOff).toHaveBeenCalledWith(chord, 0)
	})

	test('builds a diagonal chord from both neighboring direction chords', () => {
		const instrument = { chordOn:jest.fn(), chordOff:jest.fn() }
		const application = {
			personManager:{ people:[{ noteNumber:60, activeInstrument:instrument }] },
			setFeedback:jest.fn(),
		}
		const action = getPicadeDiagonalAction(new Set(['dup', 'dright']))
		playPicadeProgressiveChord(application, { player:0, action, pressed:true, gamepad:{ index:21 } })

		expect(instrument.chordOn.mock.calls[0][0].map(note => note.noteNumber)).toEqual([59, 60, 62, 64, 67])
		expect(application.setFeedback).toHaveBeenLastCalledWith(
			'Player 1 · Person 1 · Progressive Chords · Chord I + V',
			0,
			'gamepad-chords',
		)
	})

	test('keeps each player and resolved Person mode visible on the HUD', () => {
		const application = {
			people:[{ isActive:true }, { isActive:true }],
			setInputStatus:jest.fn(),
		}
		updatePicadeModeHud(application, [PICADE_GAMEPAD_MODE_NOTES, PICADE_GAMEPAD_MODE_CHORDS], 1)

		expect(getPicadeModeFeedback(application, 1, PICADE_GAMEPAD_MODE_CHORDS)).toBe(
			'Player 2 · Person 2 · Progressive Chords'
		)
		expect(application.setInputStatus).toHaveBeenNthCalledWith(1, 'picade-max-player-1', expect.objectContaining({
			label:'Player 1 · Person 1',
			detail:'One-shot Notes',
			type:'gamepad-notes',
			active:false,
		}))
		expect(application.setInputStatus).toHaveBeenNthCalledWith(2, 'picade-max-player-2', expect.objectContaining({
			label:'Player 2 · Person 2',
			detail:'Progressive Chords',
			type:'gamepad-chords',
			active:true,
		}))
	})

	test('resolves a short hat press as a closed hat', () => {
		const drum = resolvePicadeDrumPart(PICADE_DRUM_PARTS[2], {
			pressed: false,
			heldFor: PICADE_HAT_HOLD_MS - 1,
		})

		expect(drum).toMatchObject({
			part: 'hat',
			noteNumber: 42,
			open: false,
		})
	})

	test('resolves a held hat press as an open hat', () => {
		const drum = resolvePicadeDrumPart(PICADE_DRUM_PARTS[2], {
			pressed: false,
			heldFor: PICADE_HAT_HOLD_MS,
		})

		expect(drum).toMatchObject({
			part: 'hat',
			label: 'open hat',
			noteNumber: 46,
			open: true,
		})
	})

	test('keeps the Picade sound buttons on distinct percussion routes', () => {
		const labels = PICADE_DRUM_PARTS.map(drum => drum.label)

		expect(labels).toEqual([
			'kick',
			'snare',
			'hat',
			'clap',
			'cowbell',
			'clack',
			'sub kick',
			'rim snare',
			'low tom',
			'mid tom',
			'high tom',
			'shaker',
			'finger snap',
		])
	})

	test('maps closed and open hat light events to the held hat button', () => {
		expect(getPicadeButtonsForPart('hat', { open: false }).map(drum => drum.button)).toEqual([2])
		expect(getPicadeButtonsForPart('hat', { open: true }).map(drum => drum.button)).toEqual([2])
	})

	test('maps arranger lane names to the matching hand-percussion bank lights', () => {
		expect(getPicadeButtonsForPart('bongoLow', {}, 1).map(drum => drum.part)).toEqual(['low-bongo'])
		expect(getPicadeButtonsForPart('congaMute', {}, 1).map(drum => drum.part)).toEqual(['mute-conga'])
		expect(getPicadeButtonsForPart('triangleOpen', {}, 1).map(drum => drum.part)).toEqual(['open-triangle'])
	})

	test('registers Picade drum presses and releases with the percussion hold repeater', () => {
		const onPercussionRepeat = jest.fn()
		const application = {
			setPercussionInput: jest.fn(),
			playPercussionPart: jest.fn(),
		}

		playPicadeDrumPart(application, {
			player: 0,
			action: 'a',
			pressed: true,
		}, onPercussionRepeat)
		playPicadeDrumPart(application, {
			player: 0,
			action: 'a',
			pressed: false,
		}, onPercussionRepeat)

		expect(application.setPercussionInput).toHaveBeenNthCalledWith(
			1,
			'picade:0:a',
			'snare',
			true,
			expect.objectContaining({
				source: 'picade',
				onPercussionRepeat,
			}),
		)
		expect(application.setPercussionInput).toHaveBeenNthCalledWith(
			2,
			'picade:0:a',
			'snare',
			false,
			expect.any(Object),
		)
		expect(application.playPercussionPart).not.toHaveBeenCalled()
	})

	test('cycles the matching Person mode when Picade Select is pressed', () => {
		const createPerson = active => ({
			userMode: 0,
			options: {},
			isActive: active,
			activeInstrument: {},
			get userModeData() {
				return [
					{ description: 'Sympathetic Circle of Fifths' },
					{ description: 'Classical Chromatic' },
					{ description: 'Arpeggio' },
					{ description: 'Arpeggio Circle of Fifths' },
					{ description: 'Player' },
				][this.userMode]
			},
			dispatchPersonEvent: jest.fn(),
		})
		const people = [createPerson(true), createPerson(true)]
		const application = {
			personManager: {
				people,
				getPerson: jest.fn(index => people[index]),
			},
			setFeedback: jest.fn(),
			setInputStatus: jest.fn(),
		}

		expect(cyclePicadePersonMode(application, {
			player: 0,
			pressed: true,
		})).toBe(true)
		expect(cyclePicadePersonMode(application, {
			player: 1,
			pressed: true,
		})).toBe(true)

		expect(people[0].userMode).toBe(1)
		expect(people[1].userMode).toBe(1)
		expect(application.personManager.getPerson).not.toHaveBeenCalled()
		expect(application.setFeedback).toHaveBeenNthCalledWith(
			1,
			'Player 1 mode: Classical Chromatic',
			0,
			'gamepad',
		)
		expect(application.setFeedback).toHaveBeenNthCalledWith(
			2,
			'Player 2 mode: Classical Chromatic',
			0,
			'gamepad',
		)
		expect(application.setInputStatus).toHaveBeenCalledWith('picade-max', expect.objectContaining({
			detail: 'Player 2: Classical Chromatic',
			connected: true,
			active: true,
		}))
	})

	test('starts Picade Max player searches from the first two Person slots', () => {
		expect(getPicadeBasePersonIndex(0)).toBe(0)
		expect(getPicadeBasePersonIndex(1)).toBe(1)
		expect(getPicadeBasePersonIndex(-1)).toBe(0)
		expect(getPicadeBasePersonIndex(7)).toBe(1)
	})

	test('rotates through Persons until it finds an active user', () => {
		const people = [
			{ isActive: false, alive: false, userMode: 0 },
			null,
			{ isActive: true, userMode: 0 },
			{ createdAt: 100, userMode: 0 },
		]
		const application = {
			personManager: {
				people,
				getPerson: jest.fn(index => people[index]),
			},
		}

		expect(isActivePicadePerson(people[0])).toBe(false)
		expect(isActivePicadePerson(people[2])).toBe(true)
		expect(getPicadePersonIndex(application, 0)).toBe(2)
		expect(getPicadePersonIndex(application, 1)).toBe(2)
		expect(application.personManager.getPerson).not.toHaveBeenCalled()
	})

	test('cycles the resolved active Person when earlier slots are inactive', () => {
		const activePerson = {
			isActive: true,
			userMode: 0,
			options: {},
			activeInstrument: {},
			get userModeData() {
				return [
					{ description: 'Sympathetic Circle of Fifths' },
					{ description: 'Classical Chromatic' },
				][this.userMode]
			},
			dispatchPersonEvent: jest.fn(),
		}
		const people = [
			{ isActive: false, alive: false, userMode: 0 },
			null,
			activePerson,
		]
		const application = {
			personManager: {
				people,
				getPerson: jest.fn(index => people[index]),
			},
			setFeedback: jest.fn(),
			setInputStatus: jest.fn(),
		}

		expect(cyclePicadePersonMode(application, {
			player: 0,
			pressed: true,
		})).toBe(true)

		expect(activePerson.userMode).toBe(1)
		expect(application.personManager.getPerson).not.toHaveBeenCalled()
		expect(application.setFeedback).toHaveBeenCalledWith(
			'Player 3 mode: Classical Chromatic',
			0,
			'gamepad',
		)
	})
})
