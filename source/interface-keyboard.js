import { toggleVisibility } from "./dom/ui"
import { createSampleBankPlayer } from './audio/sample-bank-player.js'
import { createCosmosKeyboardHandler } from './interface-cosmos.js'
import { createStreamDeckKeyboardHandler } from './hardware/streamdeck/streamdeck.js'
import {
	getKeyboardChordAssignment,
	getKeyboardNoteAssignment,
	getKeyboardPerformanceKey,
	KEYBOARD_PERCUSSION_ASSIGNMENTS,
	KEYBOARD_SAMPLE_ASSIGNMENTS,
} from './hardware/keyboard/keyboard-performance.js'

export const KEYBOARD_MODE_COMMANDS = 'commands'
export const KEYBOARD_MODE_NOTES = 'notes'
export const KEYBOARD_MODE_NOTES_HIGH = 'notes-high'
export const KEYBOARD_MODE_CHORDS = 'chords'
export const KEYBOARD_MODE_PERCUSSION = 'percussion'
export const KEYBOARD_MODE_SAMPLES = 'samples'

const KEYBOARD_MODE_FEEDBACK_TYPE = 'keyboard'

const KEYBOARD_MODES = Object.freeze([
	{
		key: KEYBOARD_MODE_COMMANDS,
		label: 'Commands',
		type: 'commands',
	},
	{
		key: KEYBOARD_MODE_NOTES,
		label: 'Notes',
		type: 'notes',
		octaveOffset: 0,
	},
	{
		key: KEYBOARD_MODE_NOTES_HIGH,
		label: 'Notes +1 Octave',
		type: 'notes',
		octaveOffset: 12,
	},
	{
		key: KEYBOARD_MODE_CHORDS,
		label: 'Chords',
		type: 'chords',
	},
	{
		key: KEYBOARD_MODE_PERCUSSION,
		label: 'Percussion',
		type: 'percussion',
	},
	{
		key: KEYBOARD_MODE_SAMPLES,
		label: 'Samples',
		type: 'samples',
	},
])
const KEYBOARD_NUMBER_MINIMUM_OFFSET = -60
const KEYBOARD_NUMBER_MAXIMUM_OFFSET = 48

const SHIFTED_NUMBER_FALLBACKS = Object.freeze({
	')': 0,
	'!': 1,
	'@': 2,
	'"': 2,
	'#': 3,
	'£': 3,
	'$': 4,
	'%': 5,
	'^': 6,
	'&': 7,
	'*': 8,
	'(': 9,
})

// Command-mode number keys retain the original compact percussion pad.
const KEYBOARD_COMMAND_PERCUSSION_PARTS = Object.freeze([
	'kick', 'snare', 'hat', 'clap', 'cowbell',
	'clack', 'sub-kick', 'rim', 'low-tom', 'high-tom',
])

const getKeyboardNumber = event => {
	const codeMatch = /^(?:Digit|Numpad)([0-9])$/.exec(event.code ?? '')
	if (codeMatch) return Number.parseInt(codeMatch[1], 10)
	if (/^[0-9]$/.test(event.key ?? '')) return Number.parseInt(event.key, 10)
	if (event.shiftKey && event.key in SHIFTED_NUMBER_FALLBACKS) {
		return SHIFTED_NUMBER_FALLBACKS[event.key]
	}
	return null
}

const getKeyboardNote = event => {
	const performanceKey = getKeyboardPerformanceKey(event)
	if (!performanceKey) return null
	return {
		...performanceKey,
		heldKey: performanceKey.code,
	}
}

const getFeedbackElement = () => document.getElementById('feedback')

const getKeyboardTargetPerson = application =>
	application.personManager?.getSelectedPerson?.()
	?? application.personManager?.getActivePerson?.()
	?? application.getActivePerson?.()
	?? application.getPerson?.(0)
	?? null

const getKeyboardModeFeedback = mode =>
	`Keyboard mode: ${mode.label}`

const KEYBOARD_STATUS_ID = 'keyboard'

const isEditableKeyboardEvent = event => {
	const path = event.composedPath?.() ?? [event.target]
	return path.some(element => (
		element?.isContentEditable === true
		|| (
			typeof element?.matches === 'function'
			&& element.matches('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]')
		)
	))
}

const formatHeldKeyboardKeys = heldKeyboardNotes => {
	const heldKeys = Array.from(heldKeyboardNotes.values())
		.map(note => note.label.toUpperCase())
	if (heldKeys.length < 1) {
		return ''
	}

	return heldKeys.length > 5
		? `${heldKeys.slice(0, 5).join(' ')} +${heldKeys.length - 5}`
		: heldKeys.join(' ')
}

const updateKeyboardStatus = (application, state, lastKey = '', active = false) => {
	const mode = KEYBOARD_MODES[state.keyboardModeIndex]
	const heldKeys = formatHeldKeyboardKeys(state.heldKeyboardNotes)
	const detail = mode.type === 'notes'
		? `${mode.label} / C${3 + ((mode.octaveOffset ?? 0) + state.numericOctaveOffset) / 12}${heldKeys ? ` / ${heldKeys} held` : ''}`
		: mode.type === 'chords'
			? `${mode.label} / ${lastKey || 'Numbers: major / Q row: minor / A row: dominant / Z row: sus2'}${heldKeys ? ` / ${heldKeys} held` : ''}`
			: mode.type === 'samples'
				? `${mode.label}${lastKey ? ` / ${lastKey}` : ' / 36 sample triggers'}`
		: `${mode.label}${lastKey ? ` / ${String(lastKey).toUpperCase()}` : ''}`

	application.setInputStatus?.(KEYBOARD_STATUS_ID, {
		type: 'keyboard',
		label: 'QWERTY Keyboard',
		detail,
		connected: true,
		active,
		ttl: active ? 1200 : undefined,
	})
}

const clearHeldKeyboardNotes = heldKeyboardNotes => {
	const notesByInstrument = new Map()
	heldKeyboardNotes.forEach(({ instrument, noteNumber, noteNumbers }) => {
		if (!instrument) return
		if (!notesByInstrument.has(instrument)) notesByInstrument.set(instrument, new Set())
		const notes = noteNumbers ?? [noteNumber]
		notes.filter(Number.isFinite).forEach(note => {
			notesByInstrument.get(instrument).add(note)
		})
	})
	notesByInstrument.forEach((notes, instrument) => {
		notes.forEach(noteNumber => {
			instrument.noteOff?.(noteNumber, 0)
		})
	})
	heldKeyboardNotes.clear()
}

const setKeyboardMode = (application, state, nextIndex) => {
	const nextModeIndex = ((nextIndex % KEYBOARD_MODES.length) + KEYBOARD_MODES.length) % KEYBOARD_MODES.length
	const previousMode = KEYBOARD_MODES[state.keyboardModeIndex]
	const nextMode = KEYBOARD_MODES[nextModeIndex]

	if (
		(previousMode?.type === 'notes' || previousMode?.type === 'chords')
		&& previousMode.key !== nextMode.key
	) {
		clearHeldKeyboardNotes(state.heldKeyboardNotes)
	}
	if (previousMode?.type === 'percussion' && nextMode.type !== 'percussion') {
		application.releasePercussionInputs?.('keyboard:')
	}
	if (previousMode?.type === 'samples' && nextMode.type !== 'samples') {
		state.heldKeyboardSamples.clear()
		state.keyboardSamplePlayer?.stopAll()
	}

	state.keyboardModeIndex = nextModeIndex
	application.setFeedback?.(getKeyboardModeFeedback(nextMode), 0, KEYBOARD_MODE_FEEDBACK_TYPE)
	updateKeyboardStatus(application, state)
	return nextMode
}

const shiftNumericKeyboardOctave = (application, state, mode, direction) => {
	clearHeldKeyboardNotes(state.heldKeyboardNotes)
	const modeOffset = mode.octaveOffset ?? 0
	const combinedOffset = Math.max(
		KEYBOARD_NUMBER_MINIMUM_OFFSET,
		Math.min(
			KEYBOARD_NUMBER_MAXIMUM_OFFSET,
			modeOffset + state.numericOctaveOffset + direction * 12,
		),
	)
	state.numericOctaveOffset = combinedOffset - modeOffset
	const octave = 3 + combinedOffset / 12
	application.setFeedback?.(`Keyboard octave: C${octave}`, 0, KEYBOARD_MODE_FEEDBACK_TYPE)
	updateKeyboardStatus(application, state)
	return octave
}

const getContextualHotkeyResult = (event, application) => {
	const isNumber = !isNaN(parseInt(event.key))
	const focussedElement = document.activeElement

	if (!focussedElement || focussedElement === document.documentElement || focussedElement === document.body) {
		return false
	}

	switch (focussedElement.nodeName) {
		case 'BUTTON':
			if (focussedElement.classList.contains('button-play-pause')) {
				const audio = focussedElement.parentElement?.querySelector('audio')
				if (!audio) {
					return true
				}

				const rate = isNumber
					? parseInt(event.key)
					: event.key === 'ArrowRight'
						? audio.playbackRate + 0.1
						: event.key === 'ArrowLeft'
							? audio.playbackRate - 0.1
							: 0.2 + Math.random() * 3

				const pitch = isNumber
					? parseInt(event.key)
					: event.key === 'ArrowUp'
						? audio.detune.value + 10
						: event.key === 'ArrowDown'
							? audio.detune.value - 10
							: 0.2 + Math.random() * 3

				audio.playbackRate = rate
				audio.detune.value = pitch
				return true
			}
			break

		case 'DIALOG':
			break
	}

	return false
}

const updateNumberSequence = (application, state, event, isNumber) => {
	if (isNumber) {
		state.numberSequence += event.key
		if (state.numberSequence.length === 3) {
			application.setBPM(parseFloat(state.numberSequence))
			state.numberSequence = ''
		}
	}else{
		state.numberSequence = ''
	}
}

const handleKeyboardNoteDown = (event, application, state, mode) => {
	if (event.repeat) {
		return true
	}

	const note = getKeyboardNote(event)
	if (!note) {
		return false
	}

	const assignment = getKeyboardNoteAssignment(
		note,
		(mode.octaveOffset ?? 0) + state.numericOctaveOffset,
	)
	const noteNumber = assignment.noteNumber
	const person = getKeyboardTargetPerson(application)
	const instrument = person?.activeInstrument

	if (!instrument || state.heldKeyboardNotes.has(note.heldKey)) {
		return true
	}

	state.heldKeyboardNotes.set(note.heldKey, {
		instrument,
		noteNumber,
		label: assignment.noteName,
	})
	instrument.noteOn?.(noteNumber, 1)
	return true
}

const handleKeyboardNoteUp = (event, state) => {
	const note = getKeyboardNote(event)
	if (!note) return false
	const heldNote = state.heldKeyboardNotes.get(note.heldKey)
	if (!heldNote) {
		return false
	}

	heldNote.instrument?.noteOff?.(heldNote.noteNumber, 0)
	state.heldKeyboardNotes.delete(note.heldKey)
	return true
}

const hasHeldInstrumentNote = (heldKeyboardNotes, instrument, noteNumber) =>
	Array.from(heldKeyboardNotes.values()).some(held =>
		held.instrument === instrument
		&& (held.noteNumbers ?? [held.noteNumber]).includes(noteNumber)
	)

const handleKeyboardChordDown = (event, application, state) => {
	const performanceKey = getKeyboardPerformanceKey(event)
	if (!performanceKey) return false
	const chord = getKeyboardChordAssignment(performanceKey)
	if (event.repeat) return chord

	const heldKey = performanceKey.code
	const person = getKeyboardTargetPerson(application)
	const instrument = person?.activeInstrument
	if (!instrument || state.heldKeyboardNotes.has(heldKey)) return chord

	const noteNumbers = chord.noteNumbers.slice()
	const newNotes = noteNumbers.filter(noteNumber =>
		!hasHeldInstrumentNote(state.heldKeyboardNotes, instrument, noteNumber)
	)
	state.heldKeyboardNotes.set(heldKey, {
		instrument,
		noteNumbers,
		label: chord.label,
	})
	newNotes.forEach(noteNumber => {
		instrument.noteOn?.(noteNumber, 1)
	})
	return chord
}

const handleKeyboardChordUp = (event, state) => {
	const performanceKey = getKeyboardPerformanceKey(event)
	if (!performanceKey) return false
	const heldKey = performanceKey.code
	const heldChord = state.heldKeyboardNotes.get(heldKey)
	if (!heldChord?.noteNumbers) return false

	state.heldKeyboardNotes.delete(heldKey)
	heldChord.noteNumbers.forEach(noteNumber => {
		if (!hasHeldInstrumentNote(state.heldKeyboardNotes, heldChord.instrument, noteNumber)) {
			heldChord.instrument?.noteOff?.(noteNumber, 0)
		}
	})
	return true
}

const handleKeyboardCommandMode = async (event, application, state) => {
	const isNumber = !isNaN(parseInt(event.key))
	const clock = application.clock
	const padNumber = getKeyboardNumber(event)
	if (padNumber != null) {
		const inputId = `keyboard:${event.code ?? padNumber}`
		if (typeof application.setPercussionInput === 'function') {
			application.setPercussionInput(
				inputId,
				KEYBOARD_COMMAND_PERCUSSION_PARTS[padNumber],
				true,
				{ source: 'keyboard' },
			)
		}else if (!event.repeat) {
			application.playPercussionPart?.(KEYBOARD_COMMAND_PERCUSSION_PARTS[padNumber])
		}
		return
	}

	if (getContextualHotkeyResult(event, application)) {
		updateNumberSequence(application, state, event, isNumber)
		return
	}

	switch (event.key) {
		case 'CapsLock':
			const isDebug = application.stateMachine.toggle('debug')
			application.people.forEach(person => person.debug = isDebug)
			application.setFeedback(isDebug ? 'Debug Mode enabled' : 'Debug Mode disabled', 0, 'debug')
			break

		case 'Del':
		case 'Delete':
			application.setRandomDrumTimbres()
			break

		case 'Enter':
			if (event.ctrlKey) {
				application.setFeedback('Press ESC to exit Full Screen', 0, 'fullscreen')
				application.toggleFullScreen()
			}else{
				application.loadRandomInstrument(() => {}, true)
			}
			break

		case 'Space':
			if (event.ctrlKey) {
				application.setFeedback('Press ESC to exit Full Screen', 0, 'fullscreen')
				application.toggleFullScreen()
			}else{
				application.setRandomDrumTimbres()
				application.loadRandomInstrument(() => {}, true)
			}
			break

		case 'QuestionMark':
		case '?':
			application.speak(getFeedbackElement()?.textContent ?? '', true)
			break

		case 'ArrowLeft':
			if (event.ctrlKey || event.shiftKey) {
				clock.swing -= 0.1
				application.setFeedback(`Swing ${Math.round(clock.swing * 100)}% at ${clock.BPM} BPM`, 0, 'tempo')
			}else{
				application.setBPM(clock.BPM - (event.shiftKey ? 10 : event.ctrlKey ? 25 : 1))
			}
			break

		case 'ArrowRight':
			if (event.ctrlKey || event.shiftKey) {
				clock.swing += 0.1
				application.setFeedback(`Swing ${Math.round(clock.swing * 100)}% at ${clock.BPM} BPM`, 0, 'tempo')
			}else{
				application.setBPM(clock.BPM + (event.shiftKey ? 10 : event.ctrlKey ? 25 : 1))
			}
			break

		case 'ArrowUp':
			if (event.ctrlKey) {
				application.clock.totalBars++
				application.setFeedback(`Bars : ${clock.totalBars} / BPM : ${clock.BPM}`, 0, 'tempo')
			}else if (event.shiftKey) {
				const person = application.getActivePerson()
				const pitchBend = person.activeInstrument.pitchOffset
				person.activeInstrument.pitchBend(pitchBend + 0.5)
			}
			break

		case 'ArrowDown':
			if (event.ctrlKey) {
				application.clock.totalBars--
				application.setFeedback(`Bars : ${clock.totalBars} / BPM : ${clock.BPM}`, 0, 'tempo')
			}else if (event.shiftKey) {
				const person = application.getActivePerson()
				const pitchBend = person.activeInstrument.pitchOffset
				person.activeInstrument.pitchBend(pitchBend - 0.5)
			}
			break

		case ',':
			application.setNodeCount(-1)
			break

		case '.':
			application.setNodeCount(1)
			break

		case 'a':
			application.kit.kick()
			break

		case 'b':
			application.toggleBackgroundPercussion()
			break

		case 'c':
			application.stateMachine.toggle('clear', application.buttonClearToggle)
			break

		case 'd':
			application.setDiscoMode()
			break

		case 'e':
			application.kit.clack()
			break

		case 'f':
			application.toggleFullScreen()
			break

		case 'g':
			application.setRandomDrumTimbres()
			break

		case 'h':
			const isVisible = toggleVisibility(document.getElementById('feedback'))
			toggleVisibility(document.getElementById('toast'))
			application.counter = 0
			application.stateMachine.set('text', isVisible)
			break

		case 'i':
			const reverb = await application.setReverb()
			application.setFeedback(`Reverb : '${reverb}' loaded`, 0, 'tempo')
			break

		case 'j':
			application.previousInstrument(() => {}, true)
			break

		case 'k':
			application.nextInstrument(() => {}, true)
			break

		case 'l':
			application.stateMachine.toggle('speak', application.buttonSpeakToggle)
			application.setFeedback(application.stateMachine.get('speak') ? 'Reading out instructions' : 'Staying quiet', 0, 'voice')
			break

		case 'm':
			const isMetronomeEnabled = application.stateMachine.toggle('metronome', application.buttonMetronomeToggle)
			application.setFeedback(isMetronomeEnabled ? 'Quantised enabled' : 'Quantise disabled')
			break

		case 'n':
			application.toggleVideoFrameCopy()
			break

		case 'o':
			application.kit.hat()
			break

		case 'p':
			if (application.midiPerformance) {
				const commands = application.midiPerformance.getNextCommands()
				commands.forEach(command => {
					command.type === COMMAND_NOTE_ON
						? samplePlayer.noteOn()
						: samplePlayer.noteOff()
				})
			}
			break

		case 'q':
			application.stateMachine.toggle('photoSensitive')
			break

		case 'r':
			application.toggleRecording()
			break

		case 's':
			application.kit.snare()
			break

		case 't':
			application.stateMachine.toggle('text')
			break

		case 'u':
			application.setRandomDrumPattern()
			if (event.ctrlKey || event.shiftKey) {
				application.setRandomDrumTimbres()
			}else{
				application.loadRandomInstrument()
			}
			break

		case 'v':
			application.toggleVideoOutput()
			break

		case 'w':
			application.kit.cowbell()
			break

		case 'x':
			const tappedTempo = application.tapTempo()
			if (tappedTempo > 1) {
				application.setBPM(tappedTempo)
			}
			break

		case 'y':
			application.stateMachine.toggle('spectrogram')
			break

		case 'z':
			application.setRandomDrumTimbres()
			break

		case 'F1':
			const player1 = application.getPerson(0)
			application.configurePerson(player1, player1.type + 1)
			break

		case 'F2':
			const player2 = application.getPerson(1)
			application.configurePerson(player2, player2.type + 1)
			break

		case 'F3':
			const player3 = application.getPerson(2)
			application.configurePerson(player3, player3.type + 1)
			break

		case 'F4':
			const player4 = application.getPerson(3)
			application.configurePerson(player4, player4.type + 1)
			break

		case 'F5':
			application.selectPerson(0)
			break

		case 'F6':
			application.selectPerson(1)
			break

		case 'F7':
			application.selectPerson(2)
			break

		case 'F8':
			application.selectPerson(3)
			break

		case 'LaunchMediaPlayer':
			application.nextInstrument()
			break

		case 'MediaTrackPrevious':
			application.previousInstrument()
			break

		case 'MediaPlayPause':
			application.toggleBackgroundPercussion()
			break

		case 'MediaTrackNext':
			application.nextInstrument()
			break

		case 'F9':
			application.getPerson(0).loadRandomPreset()
			break

		case 'F10':
			application.getPerson(1).loadRandomPreset()
			break

		case 'F11':
			application.getPerson(2).loadRandomPreset()
			break

		case 'F12':
			application.getPerson(3).loadRandomPreset()
			break

		case 'F13':
		case 'F14':
		case 'F15':
		case 'F16':
		case 'F17':
		case 'F18':
		case 'F19':
		case 'Tab':
			break

		default:
			console.log('Key pressed', { event, isNumber })
	}

	updateNumberSequence(application, state, event, isNumber)
}

const handleKeyboardPercussionDown = (event, application) => {
	const performanceKey = getKeyboardPerformanceKey(event)
	if (!performanceKey) return null
	const drum = KEYBOARD_PERCUSSION_ASSIGNMENTS[performanceKey.index]

	const inputId = `keyboard:${performanceKey.code}`
	if (typeof application.setPercussionInput === 'function') {
		application.setPercussionInput(
			inputId,
			drum.part,
			true,
			{ ...drum.soundOptions, source: 'keyboard' },
		)
	}else if (!event.repeat) {
		application.playPercussionPart?.(drum.part, drum.soundOptions)
	}
	return drum
}

const createKeyboardSamplePlayer = application => createSampleBankPlayer({
	banks: [{
		id: 'keyboard-samples',
		label: 'Keyboard Samples',
		samples: KEYBOARD_SAMPLE_ASSIGNMENTS,
	}],
	getContext: () => application.getAudioContext?.(),
	getDestination: () => application.getMasterMixdown?.(),
	beforePlay: () => application.resumeAudio?.(),
	load: application.loadAudioSample,
	play: application.playAudioSample,
})

const handleKeyboardSampleDown = (event, application, state) => {
	const performanceKey = getKeyboardPerformanceKey(event)
	if (!performanceKey) return null
	const sample = KEYBOARD_SAMPLE_ASSIGNMENTS[performanceKey.index]
	if (event.repeat || state.heldKeyboardSamples.has(performanceKey.code)) return sample

	state.heldKeyboardSamples.add(performanceKey.code)
	state.keyboardSamplePlayer.trigger(performanceKey.index).catch(error => {
		console.error(`Could not play keyboard sample ${sample.label}`, error)
		application.setFeedback?.(`Sample unavailable: ${sample.label}`, 0, KEYBOARD_MODE_FEEDBACK_TYPE)
	})
	return sample
}

const handleKeyboardSampleUp = (event, state) => {
	const performanceKey = getKeyboardPerformanceKey(event)
	if (!performanceKey || !state.heldKeyboardSamples.has(performanceKey.code)) return false
	state.heldKeyboardSamples.delete(performanceKey.code)
	state.keyboardSamplePlayer.release(performanceKey.index)
	return true
}

/**
 * Add keyboard listeners and tie in commands
 */
export const addKeyboardEvents = application => {
	const state = {
		numberSequence: '',
		keyboardModeIndex: 0,
		heldKeyboardNotes: new Map(),
		heldKeyboardSamples: new Set(),
		numericOctaveOffset: 0,
	}
	state.keyboardSamplePlayer = createKeyboardSamplePlayer(application)
	const handleCosmosKeyboardEvent = createCosmosKeyboardHandler(application)
	const streamDeckKeyboard = createStreamDeckKeyboardHandler(application, {
		selectKeyboardMode: modeIndex => setKeyboardMode(application, state, modeIndex),
		shiftNumericOctave: direction => {
			const mode = KEYBOARD_MODES[state.keyboardModeIndex]
			if (mode.type === 'notes') {
				shiftNumericKeyboardOctave(application, state, mode, direction)
			}
		},
		handleCosmosKeyboardEvent,
	})

	updateKeyboardStatus(application, state)

	const handleModeSwitch = event => {
		switch (event.key) {
			case 'PageUp':
				if (event.repeat) {
					return true
				}
				setKeyboardMode(application, state, state.keyboardModeIndex - 1)
				return true

			case 'PageDown':
				if (event.repeat) {
					return true
				}
				setKeyboardMode(application, state, state.keyboardModeIndex + 1)
				return true

			default:
				return false
		}
	}

	const handleNumericOctaveSwitch = (event, mode) => {
		if (
			mode.type !== 'notes'
			|| !event.shiftKey
			|| event.ctrlKey
			|| (event.key !== 'PageUp' && event.key !== 'PageDown')
		) {
			return false
		}
		if (event.repeat) return true
		shiftNumericKeyboardOctave(
			application,
			state,
			mode,
			event.key === 'PageUp' ? 1 : -1,
		)
		return true
	}

	window.addEventListener('keydown', async event => {
		if (streamDeckKeyboard.handleKeyDown(event)) {
			event.preventDefault()
			return
		}

		if (isEditableKeyboardEvent(event)) {
			state.numberSequence = ''
			return
		}

		let mode = KEYBOARD_MODES[state.keyboardModeIndex]

		if (mode.type === 'commands' && handleCosmosKeyboardEvent(event)) {
			event.preventDefault()
			return
		}

		if (handleNumericOctaveSwitch(event, mode)) {
			event.preventDefault()
			return
		}

		// ignore tabbing
		if (event.key !== 'Tab') {
			event.preventDefault()
		}

		if (handleModeSwitch(event)) {
			return
		}

		// get the curent mode
		mode = KEYBOARD_MODES[state.keyboardModeIndex]

		if (mode.type === 'notes') {
			state.numberSequence = ''
			handleKeyboardNoteDown(event, application, state, mode)
			updateKeyboardStatus(application, state, event.key, state.heldKeyboardNotes.size > 0)
			return
		}

		if (mode.type === 'chords') {
			state.numberSequence = ''
			const chord = handleKeyboardChordDown(event, application, state)
			updateKeyboardStatus(
				application,
				state,
				chord?.label ?? event.key,
				state.heldKeyboardNotes.size > 0,
			)
			return
		}

		if (mode.type === 'percussion') {
			state.numberSequence = ''
			const drum = handleKeyboardPercussionDown(event, application)
			updateKeyboardStatus(application, state, drum?.label ?? event.key, Boolean(drum))
			return
		}

		if (mode.type === 'samples') {
			state.numberSequence = ''
			const sample = handleKeyboardSampleDown(event, application, state)
			updateKeyboardStatus(application, state, sample?.label ?? event.key, Boolean(sample))
			return
		}

		await handleKeyboardCommandMode(event, application, state)
		updateKeyboardStatus(application, state, event.key, true)
	})

	window.addEventListener('keyup', event => {
		if (streamDeckKeyboard.handleKeyUp(event)) {
			event.preventDefault()
			return
		}

		if (handleCosmosKeyboardEvent(event)) {
			event.preventDefault()
			return
		}

		const mode = KEYBOARD_MODES[state.keyboardModeIndex]
		const performanceKey = mode.type === 'percussion'
			? getKeyboardPerformanceKey(event)
			: null
		const commandPadNumber = mode.type === 'commands' ? getKeyboardNumber(event) : null
		if (performanceKey || commandPadNumber != null) {
			const inputId = performanceKey?.code ?? (event.code ?? commandPadNumber)
			application.setPercussionInput?.(
				`keyboard:${inputId}`,
				performanceKey
					? KEYBOARD_PERCUSSION_ASSIGNMENTS[performanceKey.index].part
					: KEYBOARD_COMMAND_PERCUSSION_PARTS[commandPadNumber],
				false,
			)
			updateKeyboardStatus(application, state)
			return
		}

		if (mode.type === 'chords' && handleKeyboardChordUp(event, state)) {
			updateKeyboardStatus(application, state, '', state.heldKeyboardNotes.size > 0)
			return
		}

		if (mode.type === 'samples' && handleKeyboardSampleUp(event, state)) {
			updateKeyboardStatus(application, state, '', state.heldKeyboardSamples.size > 0)
			return
		}

		if (mode.type === 'notes' && handleKeyboardNoteUp(event, state)) {
			updateKeyboardStatus(application, state, event.key, state.heldKeyboardNotes.size > 0)
			return
		}

		if (isEditableKeyboardEvent(event)) {
			return
		}

		if (mode.type === 'chords') {
			handleKeyboardChordUp(event, state)
			updateKeyboardStatus(application, state, '', state.heldKeyboardNotes.size > 0)
			return
		}

		if (mode.type === 'samples') {
			handleKeyboardSampleUp(event, state)
			updateKeyboardStatus(application, state, '', state.heldKeyboardSamples.size > 0)
			return
		}

		if (mode.type !== 'notes') {
			updateKeyboardStatus(application, state)
			return
		}

		handleKeyboardNoteUp(event, state)
		updateKeyboardStatus(application, state, event.key, state.heldKeyboardNotes.size > 0)
	})

	window.addEventListener('blur', () => {
		streamDeckKeyboard.reset()
		handleCosmosKeyboardEvent({ type: 'blur' })
		clearHeldKeyboardNotes(state.heldKeyboardNotes)
		state.heldKeyboardSamples.clear()
		state.keyboardSamplePlayer.stopAll()
		application.releasePercussionInputs?.('keyboard:')
		updateKeyboardStatus(application, state)
	})
}
