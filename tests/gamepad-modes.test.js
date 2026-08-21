import { TextDecoder, TextEncoder } from 'util'
import {
	BUTTON_A,
	BUTTON_B,
	DIRECTION_LEFT_STICK_X,
	DIRECTION_UP,
} from '../source/hardware/gamepad/gamepad-commands.js'

let GAMEPAD_DIRECTION_CHORDS
let GAMEPAD_DIRECTION_UP_RIGHT
let GAMEPAD_TONIC_BUTTON_OFFSETS
let GAMEPAD_MODE_CHORDS
let GAMEPAD_MODE_CONTROLS
let GAMEPAD_MODE_INSTRUMENT
let GAMEPAD_MODE_METHODS
let GAMEPAD_MODE_PERCUSSION
let GAMEPAD_MODE_VFX
let GAMEPAD_MODES
let getExistingGamePadPerson
let getExistingGamePadPersonIndex
let getGamePadModeMethod
let shouldUsePicadeMaxInterface

beforeAll(async () => {
	global.TextEncoder = TextEncoder
	global.TextDecoder = TextDecoder

	;({
		GAMEPAD_DIRECTION_CHORDS,
		GAMEPAD_DIRECTION_UP_RIGHT,
		GAMEPAD_TONIC_BUTTON_OFFSETS,
		GAMEPAD_MODE_CHORDS,
		GAMEPAD_MODE_CONTROLS,
		GAMEPAD_MODE_INSTRUMENT,
		GAMEPAD_MODE_METHODS,
		GAMEPAD_MODE_PERCUSSION,
		GAMEPAD_MODE_VFX,
		GAMEPAD_MODES,
		getExistingGamePadPerson,
		getExistingGamePadPersonIndex,
		getGamePadModeMethod,
		shouldUsePicadeMaxInterface,
	} = await import('../source/interface-gamepad.js'))
})

describe('gamepad mode handlers', () => {
	test('beats is the default mode and has a distinct handler', () => {
		expect(GAMEPAD_MODES[0]).toBe(GAMEPAD_MODE_PERCUSSION)
		expect(getGamePadModeMethod(GAMEPAD_MODES[0])).toBe(GAMEPAD_MODE_METHODS[GAMEPAD_MODE_PERCUSSION])
		expect(GAMEPAD_MODE_METHODS[GAMEPAD_MODE_PERCUSSION]).not.toBe(GAMEPAD_MODE_METHODS[GAMEPAD_MODE_INSTRUMENT])
	})

	test('every selectable gamepad mode has a handler', () => {
		expect(GAMEPAD_MODES).toEqual([
			GAMEPAD_MODE_PERCUSSION,
			GAMEPAD_MODE_INSTRUMENT,
			GAMEPAD_MODE_CHORDS,
			GAMEPAD_MODE_VFX,
			GAMEPAD_MODE_CONTROLS,
		])

		for (const mode of GAMEPAD_MODES) {
			expect(typeof getGamePadModeMethod(mode)).toBe('function')
		}
	})

	test('chord mode sustains a voice-led chord until its direction is released', () => {
		const instrument = {
			chordOn: jest.fn(),
			chordOff: jest.fn(),
		}
		const person = { noteNumber: 60, activeInstrument: instrument }
		const application = {
			personManager: {
				people: [person],
				getSelectedPerson: jest.fn(() => person),
			},
			resumeAudio: jest.fn(),
			setFeedback: jest.fn(),
		}
		const gamePad = { index: 3 }
		const handler = GAMEPAD_MODE_METHODS[GAMEPAD_MODE_CHORDS]

		handler(application, gamePad, DIRECTION_UP, true, 0, 0)
		const expectedChord = GAMEPAD_DIRECTION_CHORDS[DIRECTION_UP].offsets.map(noteOffset => ({
			noteNumber: 60 + noteOffset,
			velocity: 0.8,
		}))
		expect(instrument.chordOn).toHaveBeenCalledWith(expectedChord, 0.8)
		expect(instrument.chordOff).not.toHaveBeenCalled()

		handler(application, gamePad, DIRECTION_UP, false, 250, 0)
		expect(instrument.chordOff).toHaveBeenCalledWith(expectedChord, 0)
	})

	test('a gamepad button sounds a tone and makes it the tonic for later chords', () => {
		const instrument = {
			chordOn: jest.fn(),
			chordOff: jest.fn(),
			noteOn: jest.fn(),
			noteOff: jest.fn(),
		}
		const person = { noteNumber: 60, activeInstrument: instrument }
		const application = {
			personManager: {
				people: [person],
				getSelectedPerson: jest.fn(() => person),
			},
			resumeAudio: jest.fn(),
			setFeedback: jest.fn(),
		}
		const gamePad = { index: 5 }
		const handler = GAMEPAD_MODE_METHODS[GAMEPAD_MODE_CHORDS]
		const tonic = 60 + GAMEPAD_TONIC_BUTTON_OFFSETS[BUTTON_B]

		handler(application, gamePad, BUTTON_B, true, 0, 0)
		expect(instrument.noteOn).toHaveBeenCalledWith(tonic, 0.8)

		handler(application, gamePad, BUTTON_B, false, 150, 0)
		expect(instrument.noteOff).toHaveBeenCalledWith(tonic, 0)

		handler(application, gamePad, DIRECTION_UP, true, 0, 0)
		expect(instrument.chordOn.mock.calls[0][0].map(note => note.noteNumber)).toEqual([
			tonic,
			tonic + 4,
			tonic + 7,
		])
		handler(application, gamePad, DIRECTION_UP, false, 200, 0)
	})

	test('moving the joystick replaces the chord and returning to centre stops it', () => {
		const instrument = {
			chordOn: jest.fn(),
			chordOff: jest.fn(),
		}
		const person = { noteNumber: 60, activeInstrument: instrument }
		const application = {
			personManager: {
				people: [person],
				getSelectedPerson: jest.fn(() => person),
			},
		}
		const gamePad = { index: 4, leftstickX: -0.8, leftstickY: 0 }
		const handler = GAMEPAD_MODE_METHODS[GAMEPAD_MODE_CHORDS]

		handler(application, gamePad, DIRECTION_LEFT_STICK_X, -0.8, undefined, 0)
		const leftChord = instrument.chordOn.mock.calls[0][0]

		gamePad.leftstickX = 0.9
		handler(application, gamePad, DIRECTION_LEFT_STICK_X, 0.9, undefined, 0)
		expect(instrument.chordOff).toHaveBeenNthCalledWith(1, leftChord, 0)
		expect(instrument.chordOn).toHaveBeenCalledTimes(2)
		expect(instrument.chordOn.mock.calls[1][0].map(note => note.noteNumber)).toEqual([59, 62, 67])

		gamePad.leftstickX = 0.1
		handler(application, gamePad, DIRECTION_LEFT_STICK_X, 0.1, undefined, 0)
		expect(instrument.chordOff).toHaveBeenCalledTimes(2)
	})

	test('uses a chord related to both cardinal directions for a joystick diagonal', () => {
		const instrument = { chordOn:jest.fn(), chordOff:jest.fn() }
		const application = {
			personManager:{ people:[{ noteNumber:60, activeInstrument:instrument }] },
		}
		const gamePad = { index:6, leftstickX:0.8, leftstickY:-0.8 }
		const handler = GAMEPAD_MODE_METHODS[GAMEPAD_MODE_CHORDS]

		handler(application, gamePad, DIRECTION_LEFT_STICK_X, 0.8, undefined, 0)

		expect(GAMEPAD_DIRECTION_CHORDS[GAMEPAD_DIRECTION_UP_RIGHT].name).toBe('I + V')
		expect(instrument.chordOn.mock.calls[0][0].map(note => note.noteNumber)).toEqual([59, 60, 62, 64, 67])
	})

	test('percussion mode registers gamepad press and release edges', () => {
		const application = {
			setPercussionInput: jest.fn(),
			kit: { kick: jest.fn() },
		}
		const gamePad = { index: 2 }
		const handler = GAMEPAD_MODE_METHODS[GAMEPAD_MODE_PERCUSSION]

		handler(application, gamePad, BUTTON_A, true, 0, 0)
		handler(application, gamePad, BUTTON_A, false, 400, 0)

		expect(application.setPercussionInput).toHaveBeenNthCalledWith(
			1,
			'gamepad-2:a',
			'kick',
			true,
			{ source: 'gamepad' },
		)
		expect(application.setPercussionInput).toHaveBeenNthCalledWith(
			2,
			'gamepad-2:a',
			'kick',
			false,
			{ source: 'gamepad' },
		)
	})

	test('Picade person lookup wraps to existing Persons without creating them', () => {
		const personOne = { userMode: 0 }
		const personThree = { userMode: 2 }
		const personManager = {
			people: [personOne, null, personThree],
			getPerson: jest.fn(),
		}

		expect(getExistingGamePadPersonIndex(personManager, 0)).toBe(0)
		expect(getExistingGamePadPersonIndex(personManager, 1)).toBe(2)
		expect(getExistingGamePadPersonIndex(personManager, 4)).toBe(2)
		expect(getExistingGamePadPersonIndex(personManager, -1)).toBe(2)
		expect(getExistingGamePadPerson(personManager, 0)).toBe(personOne)
		expect(getExistingGamePadPerson(personManager, 1)).toBe(personThree)
		expect(getExistingGamePadPerson(personManager, 4)).toBe(personThree)
		expect(getExistingGamePadPerson({ people: [] }, 0)).toBeNull()
		expect(personManager.getPerson).not.toHaveBeenCalled()
	})

	test('generic gamepad handler stands down for wrapped cafe:400d Picade Max inputs', () => {
		const application = {
			clearInputStatus: jest.fn(),
		}
		const gamePad = {
			index: 1,
			gamepad: {
				index: 1,
				id: 'GamePad 1 (Vendor: cafe Product: 400d)',
			},
		}

		expect(shouldUsePicadeMaxInterface(application, gamePad)).toBe(true)
		expect(application.picadeMaxInputActive).toBe(true)
		expect(application.clearInputStatus).toHaveBeenCalledWith('gamepad-1')
	})
})
