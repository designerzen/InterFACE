import { toggleVisibility } from "./dom/ui"
import { createSampleBankPlayer } from './audio/sample-bank-player.js'
import { createStreamDeckKeyboardHandler } from './hardware/streamdeck/streamdeck.js'
import {
	getKeyboardChordAssignment,
	getKeyboardNoteAssignment,
	getKeyboardPercussionAssignment,
	getKeyboardPerformanceKey,
	KEYBOARD_SAMPLE_ASSIGNMENTS,
} from './hardware/keyboard/keyboard-performance.js'

export const KEYBOARD_MODE_NOTES = 'notes'
export const KEYBOARD_MODE_NOTES_HIGH = 'notes-high'
export const KEYBOARD_MODE_CHORDS = 'chords'
export const KEYBOARD_MODE_PERCUSSION = 'percussion'
export const KEYBOARD_MODE_SAMPLES = 'samples'
export const KEYBOARD_MODE_OPERATIONAL = 'operational'

export const KEYBOARD_TYPE_NOTES = 'notes'
export const KEYBOARD_TYPE_CHORDS = 'chords'
export const KEYBOARD_TYPE_PERCUSSION = 'percussion'
export const KEYBOARD_TYPE_SAMPLES = 'samples'
export const KEYBOARD_TYPE_OPERATIONAL = 'operational'

const KEYBOARD_MODE_FEEDBACK_TYPE = 'keyboard'

const KEYBOARD_MODES = Object.freeze([
	{
		key: KEYBOARD_MODE_OPERATIONAL,
		label: 'Operational',
		type: KEYBOARD_TYPE_OPERATIONAL,
	},
	{
		key: KEYBOARD_MODE_NOTES,
		label: 'Notes',
		type: KEYBOARD_TYPE_NOTES,
		octaveOffset: 0,
	},
	{
		key: KEYBOARD_MODE_NOTES_HIGH,
		label: 'Notes +1 Octave',
		type: KEYBOARD_TYPE_NOTES,
		octaveOffset: 12,
	},
	{
		key: KEYBOARD_MODE_CHORDS,
		label: 'Chords',
		type: KEYBOARD_TYPE_CHORDS,
	},
	{
		key: KEYBOARD_MODE_PERCUSSION,
		label: 'Percussion',
		type: KEYBOARD_TYPE_PERCUSSION,
	},
	{
		key: KEYBOARD_MODE_SAMPLES,
		label: 'Samples',
		type: KEYBOARD_TYPE_SAMPLES,
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
		index: performanceKey.index - 10,
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
const OPERATIONAL_SHORTCUTS = Object.freeze([
	{ key: 'a', display: 'A', controlId: 'button-automate', label: 'Automate' },
	{ key: 'b', display: 'B', controlId: 'button-percussion', label: 'Beats' },
	{ key: 'c', display: 'C', controlId: 'button-clear', label: 'Clear' },
	{ key: 'd', display: 'D', controlId: 'button-disco', label: 'Disco' },
	{ key: 'e', display: 'E', controlId: 'button-eyes', label: 'Eyes' },
	{ key: 'f', display: 'F', controlId: 'button-fullscreen', label: 'Fullscreen' },
	{ key: 'g', display: 'G', controlId: 'button-performance-drums', label: 'Performance drums' },
	{ key: 'h', display: 'H', controlId: 'button-hud', label: 'HUD' },
	{ key: 'i', display: 'I', controlId: 'button-lips', label: 'Lips' },
	{ key: 'j', display: 'J', controlId: 'button-midi-percussion', label: 'MIDI percussion' },
	{ key: 'k', display: 'K', controlId: 'button-toggle-overlay', label: 'Overlay canvas' },
	{ key: 'l', display: 'L', controlId: 'button-speak', label: 'Speech' },
	{ key: 'm', display: 'M', controlId: 'button-metronome', label: 'Metronome' },
	{ key: 'n', display: 'N', controlId: 'button-sync-video', label: 'Sync video' },
	{ key: 'o', display: 'O', controlId: 'button-overlay', label: 'AR overlay' },
	{ key: 'p', display: 'P', controlId: 'button-points', label: 'Points' },
	{ key: 'q', display: 'Q', controlId: 'button-quantise', label: 'Quantise' },
	{ key: 'r', display: 'R', controlId: 'button-record-audio', label: 'Record audio' },
	{ key: 's', display: 'S', controlId: 'button-settings', label: 'Settings' },
	{ key: 't', display: 'T', controlId: 'button-subtitles', label: 'Subtitles' },
	{ key: 'u', display: 'U', controlId: 'button-rapid-percussion', label: 'Rapid hits' },
	{ key: 'v', display: 'V', controlId: 'button-record-video', label: 'Record video' },
	{ key: 'w', display: 'W', controlId: 'button-eyebrows', label: 'Brows' },
	{ key: 'x', display: 'X', controlId: 'button-meshes', label: 'Faces' },
	{ key: 'y', display: 'Y', controlId: 'button-spectrogram', label: 'Spectrogram' },
	{ key: 'z', display: 'Z', controlId: 'button-flood', label: 'Flood' },
	{ key: 'shift+a', display: 'Shift A', controlId: 'button-toggle-advanced', label: 'Advanced' },
	{ key: 'shift+i', display: 'Shift I', controlId: 'toggle-midi', label: 'MIDI' },
	{ key: 'shift+m', display: 'Shift M', controlId: 'button-mute', label: 'Mute' },
	{ key: 'shift+t', display: 'Shift T', controlId: 'tempo-midi-synch', label: 'MIDI sync' },
])

const getOperationalShortcutKey = event => {
	const key = event.key?.toLowerCase?.()
	if (!key || key.length !== 1 || !/[a-z]/u.test(key)) return ''
	return event.shiftKey ? `shift+${key}` : key
}

const getOperationalShortcut = event => {
	const shortcutKey = getOperationalShortcutKey(event)
	return OPERATIONAL_SHORTCUTS.find(shortcut => shortcut.key === shortcutKey) ?? null
}

const installOperationalShortcutHints = () => {
	OPERATIONAL_SHORTCUTS.forEach(shortcut => {
		const control = document.getElementById(shortcut.controlId)
		if (!control) return
		const label = document.querySelector(`label[for="${shortcut.controlId}"]`) ?? control.closest('label')
		const host = label ?? control
		host.classList.add('keyboard-shortcut-control')
		let hint = Array.from(host.children).find(element => element.matches?.('kbd.keyboard-shortcut'))
		if (!hint) {
			hint = document.createElement('kbd')
			hint.className = 'keyboard-shortcut'
			if (control.parentElement === host) {
				host.insertBefore(hint, control)
			}else{
				host.prepend(hint)
			}
		}
		hint.textContent = shortcut.display
		hint.setAttribute('aria-hidden', 'true')
		control.dataset.keyboardShortcut = shortcut.display
	})
}

const KEYBOARD_GUIDE_ROWS = Object.freeze([
	Object.freeze([
		Object.freeze({ code: 'Escape', key: 'Escape', label: 'Esc' }),
		Object.freeze({ code: 'PageUp', key: 'PageUp', label: 'PgUp' }),
		Object.freeze({ code: 'PageDown', key: 'PageDown', label: 'PgDn' }),
	]),
	Object.freeze([
		Object.freeze({ code: 'F1', key: 'F1', label: 'F1' }),
		Object.freeze({ code: 'F2', key: 'F2', label: 'F2' }),
		Object.freeze({ code: 'F3', key: 'F3', label: 'F3' }),
		Object.freeze({ code: 'F4', key: 'F4', label: 'F4' }),
		Object.freeze({ code: 'F5', key: 'F5', label: 'F5' }),
		Object.freeze({ code: 'F6', key: 'F6', label: 'F6' }),
	]),
	Object.freeze('1234567890'.split('').map(key => Object.freeze({
		code: `Digit${key}`,
		key,
		label: key,
	}))),
	Object.freeze('qwertyuiop'.split('').map(key => Object.freeze({
		code: `Key${key.toUpperCase()}`,
		key,
		label: key.toUpperCase(),
	}))),
	Object.freeze('asdfghjkl'.split('').map(key => Object.freeze({
		code: `Key${key.toUpperCase()}`,
		key,
		label: key.toUpperCase(),
	}))),
	Object.freeze('zxcvbnm'.split('').map(key => Object.freeze({
		code: `Key${key.toUpperCase()}`,
		key,
		label: key.toUpperCase(),
	}))),
	Object.freeze([
		Object.freeze({ code: 'Space', key: ' ', label: 'Space' }),
	]),
])

const isTextInputElement = element => {
	if (!element?.matches?.('input')) return false
	const type = (element.type || 'text').toLowerCase()
	return 'text number search email password url tel'.includes(type)
}

const isEditableKeyboardEvent = event => {
	const path = event.composedPath?.() ?? [event.target]
	return path.some(element => (
		element?.isContentEditable === true
		|| (
			typeof element?.matches === 'function'
			&& element.matches('textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]')
		)
		|| isTextInputElement(element)
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
	const detail = mode.type === KEYBOARD_TYPE_NOTES
		? `${mode.label} / C${3 + ((mode.octaveOffset ?? 0) + state.numericOctaveOffset) / 12}${heldKeys ? ` / ${heldKeys} held` : ''}`
		: mode.type === KEYBOARD_TYPE_CHORDS
			? `${mode.label} / ${lastKey || 'Diatonic progressions in C major'}${heldKeys ? ` / ${heldKeys} held` : ''}`
			: mode.type === KEYBOARD_TYPE_SAMPLES
				? `${mode.label}${lastKey ? ` / ${lastKey}` : ' / 36 sample triggers'}`
			: mode.type === KEYBOARD_TYPE_PERCUSSION
				? `${mode.label}${lastKey ? ` / ${String(lastKey).toUpperCase()}` : ' / hold Shift for expanded kit'}`
		: `${mode.label}${lastKey ? ` / ${String(lastKey).toUpperCase()}` : ''}`

	application.setInputStatus?.(KEYBOARD_STATUS_ID, {
		type: 'keyboard',
		label: 'QWERTY Keyboard',
		detail,
		connected: true,
		active,
		ttl: active ? 1200 : undefined,
	})
	state.keyboardGuide?.render(mode, state)
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
		(previousMode?.type === KEYBOARD_TYPE_NOTES || previousMode?.type === KEYBOARD_TYPE_CHORDS)
		&& previousMode.key !== nextMode.key
	) {
		clearHeldKeyboardNotes(state.heldKeyboardNotes)
	}
	if (previousMode?.type === KEYBOARD_TYPE_PERCUSSION && nextMode.type !== KEYBOARD_TYPE_PERCUSSION) {
		application.releasePercussionInputs?.('keyboard:')
		state.heldKeyboardPercussion.clear()
	}
	if (previousMode?.type === KEYBOARD_TYPE_SAMPLES && nextMode.type !== KEYBOARD_TYPE_SAMPLES) {
		state.heldKeyboardSamples.clear()
		state.keyboardSamplePlayer?.stopAll()
	}

	state.keyboardModeIndex = nextModeIndex
	const modeSelect = document.getElementById('select-keyboard-mode')
	if (modeSelect && modeSelect.value !== nextMode.key) modeSelect.value = nextMode.key
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

// TODO: Tempo number key input disabled pending reimplementation
// Retains original code structure for easy re-enablement.
const updateNumberSequence = (application, state, event, isNumber) => {
	return
	const tempoPanel = document.querySelector('#folder-tempo')?.closest('.folder-menu')
	if (isNumber && (window.location.hash === '#folder-tempo' || tempoPanel?.classList.contains('open'))) {
		state.numberSequence += event.key
		if (state.numberSequence.length === 3) {
			application.setBPM(parseFloat(state.numberSequence))
			state.numberSequence = ''
		}
	}else{
		state.numberSequence = ''
	}
}

const connectKeyboardInstrument = (state, instrument) => {
	if (!state.keyboardOutput || state.keyboardInstrument === instrument) return
	state.keyboardInstrument = instrument
	instrument.audioNode.connect(state.keyboardOutput)
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
	connectKeyboardInstrument(state, instrument)
	application.resumeAudio?.()
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
	connectKeyboardInstrument(state, instrument)
	application.resumeAudio?.()
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

const handleKeyboardPercussionDown = (event, application, state) => {
	const performanceKey = getKeyboardPerformanceKey(event)
	if (!performanceKey) return null
	const drum = getKeyboardPercussionAssignment(
		{ ...performanceKey, index: performanceKey.row === 'numbers' ? performanceKey.index : performanceKey.index - 10 },
		event.shiftKey,
	)
	if (!drum) return null

	const inputId = `keyboard:${event.shiftKey ? 'shift:' : ''}${performanceKey.code}`
	state.heldKeyboardPercussion.set(inputId, drum.part)
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
	const sampleIndex = performanceKey.row === 'numbers' ? performanceKey.index : performanceKey.index - 10
	const sample = KEYBOARD_SAMPLE_ASSIGNMENTS[sampleIndex]
	if (event.repeat || state.heldKeyboardSamples.has(performanceKey.code)) return sample

	state.heldKeyboardSamples.add(performanceKey.code)
	state.keyboardSamplePlayer.trigger(sampleIndex).catch(error => {
		console.error(`Could not play keyboard sample ${sample.label}`, error)
		application.setFeedback?.(`Sample unavailable: ${sample.label}`, 0, KEYBOARD_MODE_FEEDBACK_TYPE)
	})
	return sample
}

const handleKeyboardSampleUp = (event, state) => {
	const performanceKey = getKeyboardPerformanceKey(event)
	if (!performanceKey || !state.heldKeyboardSamples.has(performanceKey.code)) return false
	state.heldKeyboardSamples.delete(performanceKey.code)
	const sampleIndex = performanceKey.row === 'numbers' ? performanceKey.index : performanceKey.index - 10
	state.keyboardSamplePlayer.release(sampleIndex)
	return true
}

const getGuideAction = (definition, mode, state) => {
	if (definition.code === 'Escape') return 'Close'
	if (definition.code === 'PageUp') return 'Previous mode'
	if (definition.code === 'PageDown') return 'Next mode'
	if (definition.code === 'Space') return 'Show keyboard'
	if (definition.code === 'F1') return 'Operational'
	if (definition.code === 'F2') return 'Notes'
	if (definition.code === 'F3') return 'Notes +1 Oct'
	if (definition.code === 'F4') return 'Chords'
	if (definition.code === 'F5') return 'Percussion'
	if (definition.code === 'F6') return 'Samples'

	const performanceKey = getKeyboardPerformanceKey(definition)
	if (!performanceKey) return ''
	if (mode.type === KEYBOARD_TYPE_NOTES) {
		return getKeyboardNoteAssignment(
			{ ...performanceKey, index: performanceKey.index - 10 },
			(mode.octaveOffset ?? 0) + state.numericOctaveOffset,
		)?.noteName ?? ''
	}
	if (mode.type === KEYBOARD_TYPE_CHORDS) return getKeyboardChordAssignment(performanceKey)?.label ?? ''
	if (mode.type === KEYBOARD_TYPE_PERCUSSION) {
		const drumKey = { ...performanceKey, index: performanceKey.row === 'numbers' ? performanceKey.index : performanceKey.index - 10 }
		const drum = getKeyboardPercussionAssignment(drumKey)
		return drum?.label ?? ''
	}
	if (mode.type === KEYBOARD_TYPE_OPERATIONAL) {
		const padNumber = getKeyboardNumber(definition)
		if (padNumber != null) {
			return KEYBOARD_SAMPLE_ASSIGNMENTS[padNumber]?.label?.replace(/[\s_-]+\d{5,}$/u, '') ?? ''
		}
		const regular = OPERATIONAL_SHORTCUTS.find(shortcut => shortcut.key === definition.key)
		const shifted = OPERATIONAL_SHORTCUTS.find(shortcut => shortcut.key === `shift+${definition.key}`)
		return [regular?.label, shifted ? `⇧ ${shifted.label}` : ''].filter(Boolean).join(' / ')
	}
	if (mode.type === KEYBOARD_TYPE_SAMPLES) {
		const sampleIndex = performanceKey.row === 'numbers' ? performanceKey.index : performanceKey.index - 10
		return KEYBOARD_SAMPLE_ASSIGNMENTS[sampleIndex]?.label
			?.replace(/[\s_-]+\d{5,}$/u, '')
			?? ''
	}
	return ''
}

const createKeyboardGuide = (state, selectMode) => {
	const dialog = document.getElementById('keyboard-guide')
	const mount = document.getElementById('keyboard-guide-keys')
	if (!dialog || !mount) {
		return {
			render: () => null,
			show: () => false,
			press: () => null,
			release: () => null,
			close: () => false,
			isOpen: () => false,
		}
	}

	const keyViews = new Map()
	const normaliseCode = event => event.code?.replace(/^Numpad([0-9])$/, 'Digit$1') ?? ''
	KEYBOARD_GUIDE_ROWS.forEach(rowDefinitions => {
		const row = document.createElement('div')
		row.className = 'keyboard-row'
		rowDefinitions.forEach(definition => {
			const button = document.createElement('button')
			button.type = 'button'
			button.className = 'keyboard-key'
			button.dataset.code = definition.code
			const keyLabel = document.createElement('kbd')
			keyLabel.textContent = definition.label
			const action = document.createElement('span')
			action.className = 'keyboard-key-action'
			button.append(keyLabel, action)
			button.addEventListener('click', () => {
				for (const type of ['keydown', 'keyup']) {
					window.dispatchEvent(new KeyboardEvent(type, {
						key: definition.key,
						code: definition.code,
						bubbles: true,
						cancelable: true,
					}))
				}
			})
			keyViews.set(definition.code, { button, action, definition })
			row.appendChild(button)
		})
		mount.appendChild(row)
	})

	dialog.querySelectorAll('[data-keyboard-mode]').forEach(button => {
		button.addEventListener('click', () => selectMode(Number.parseInt(button.dataset.keyboardMode, 10)))
	})

	const render = mode => {
		dialog.querySelector('.keyboard-guide-current').textContent = `${mode.label} mode`
		dialog.querySelectorAll('[data-keyboard-mode]').forEach(button => {
			button.setAttribute('aria-pressed', String(Number.parseInt(button.dataset.keyboardMode, 10) === state.keyboardModeIndex))
		})
		keyViews.forEach(view => {
			const action = getGuideAction(view.definition, mode, state)
			view.action.textContent = action
			view.button.classList.toggle('is-unmapped', !action)
			view.button.setAttribute('aria-label', `${view.definition.label}: ${action || 'No action'}`)
		})
	}
	const show = () => {
		if (dialog.open) return true
		try { dialog.showModal() } catch (_error) { dialog.setAttribute('open', '') }
		return true
	}
	const close = () => {
		if (!dialog.open) return false
		if (typeof dialog.close === 'function') dialog.close()
		else dialog.removeAttribute('open')
		return true
	}

	return {
		render,
		show,
		close,
		isOpen: () => dialog.open,
		press: event => keyViews.get(normaliseCode(event))?.button.classList.add('is-pressed'),
		release: event => keyViews.get(normaliseCode(event))?.button.classList.remove('is-pressed'),
	}
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
		heldKeyboardPercussion: new Map(),
		numericOctaveOffset: 0,
		guideKey: null,
	}
	const heldHintKeys = new Set()
	installOperationalShortcutHints()
	const keyboardModeSelect = document.getElementById('select-keyboard-mode')
	if (keyboardModeSelect) {
		keyboardModeSelect.value = KEYBOARD_MODES[state.keyboardModeIndex].key
		keyboardModeSelect.addEventListener('input', () => {
			const modeIndex = KEYBOARD_MODES.findIndex(mode => mode.key === keyboardModeSelect.value)
			if (modeIndex >= 0) setKeyboardMode(application, state, modeIndex)
		})
	}
	state.keyboardSamplePlayer = createKeyboardSamplePlayer(application)
	const audioContext = application.getAudioContext?.()
	const masterMixdown = application.getMasterMixdown?.()
	if (audioContext?.createGain && masterMixdown) {
		state.keyboardOutput = audioContext.createGain()
		state.keyboardOutput.connect(masterMixdown)
	}
	const streamDeckKeyboard = createStreamDeckKeyboardHandler(application, {
		selectKeyboardMode: modeIndex => setKeyboardMode(application, state, modeIndex),
		shiftNumericOctave: direction => {
			const mode = KEYBOARD_MODES[state.keyboardModeIndex]
			if (mode.type === KEYBOARD_TYPE_NOTES) {
				shiftNumericKeyboardOctave(application, state, mode, direction)
			}
		},
	})
	state.keyboardGuide = createKeyboardGuide(
		state,
		modeIndex => setKeyboardMode(application, state, modeIndex),
	)

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

			case 'F1':
				if (event.repeat) return true
				setKeyboardMode(application, state, KEYBOARD_MODES.findIndex(m => m.key === KEYBOARD_MODE_OPERATIONAL))
				return true

			case 'F2':
				if (event.repeat) return true
				setKeyboardMode(application, state, KEYBOARD_MODES.findIndex(m => m.key === KEYBOARD_MODE_NOTES))
				return true

			case 'F3':
				if (event.repeat) return true
				setKeyboardMode(application, state, KEYBOARD_MODES.findIndex(m => m.key === KEYBOARD_MODE_NOTES_HIGH))
				return true

			case 'F4':
				if (event.repeat) return true
				setKeyboardMode(application, state, KEYBOARD_MODES.findIndex(m => m.key === KEYBOARD_MODE_CHORDS))
				return true

			case 'F5':
				if (event.repeat) return true
				setKeyboardMode(application, state, KEYBOARD_MODES.findIndex(m => m.key === KEYBOARD_MODE_PERCUSSION))
				return true

			case 'F6':
				if (event.repeat) return true
				setKeyboardMode(application, state, KEYBOARD_MODES.findIndex(m => m.key === KEYBOARD_MODE_SAMPLES))
				return true

			default:
				return false
		}
	}

	const handleNumericOctaveSwitch = (event, mode) => {
		if (
			mode.type !== KEYBOARD_TYPE_NOTES
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
		const hintKey = event.code || event.key
		if (hintKey) heldHintKeys.add(hintKey)
		document.documentElement.classList.toggle('keyboard-input-active', heldHintKeys.size > 0)

		state.keyboardGuide.press(event)
		if (streamDeckKeyboard.handleKeyDown(event)) {
			event.preventDefault()
			return
		}

		if (isEditableKeyboardEvent(event)) {
			state.numberSequence = ''
			return
		}
		if (event.key === 'Escape' && state.keyboardGuide.close()) {
			state.guideKey = null
			event.preventDefault()
			return
		}

		let mode = KEYBOARD_MODES[state.keyboardModeIndex]

		if (handleNumericOctaveSwitch(event, mode)) {
			event.preventDefault()
			return
		}

		// Preserve native focus navigation; every other app key is owned here.
		if (event.key === 'Tab') return
		event.preventDefault()

		if (handleModeSwitch(event)) {
			return
		}

	// get the curent mode
		mode = KEYBOARD_MODES[state.keyboardModeIndex]

		const showGuide = () => {
			state.guideKey = event.code
			state.keyboardGuide.show()
		}

		if (mode.type === KEYBOARD_TYPE_NOTES) {
			state.numberSequence = ''
			const handled = handleKeyboardNoteDown(event, application, state, mode)
			if (!handled) showGuide()
			updateKeyboardStatus(application, state, handled ? event.key : '', state.heldKeyboardNotes.size > 0)
			return
		}

		if (mode.type === KEYBOARD_TYPE_CHORDS) {
			state.numberSequence = ''
			const chord = handleKeyboardChordDown(event, application, state)
			if (!chord) showGuide()
			updateKeyboardStatus(
				application,
				state,
				chord?.label ?? '',
				state.heldKeyboardNotes.size > 0,
			)
			return
		}

		if (mode.type === KEYBOARD_TYPE_PERCUSSION) {
			state.numberSequence = ''
			const drum = handleKeyboardPercussionDown(event, application, state)
			if (!drum) showGuide()
			updateKeyboardStatus(application, state, drum?.label ?? '', Boolean(drum))
			return
		}

		if (mode.type === KEYBOARD_TYPE_SAMPLES) {
			state.numberSequence = ''
			const sample = handleKeyboardSampleDown(event, application, state)
			if (!sample) showGuide()
			updateKeyboardStatus(application, state, sample?.label ?? '', Boolean(sample))
			return
		}

		if (mode.type === KEYBOARD_TYPE_OPERATIONAL) {
			state.numberSequence = ''
			const padNumber = getKeyboardNumber(event)
			if (padNumber != null) {
				const sample = KEYBOARD_SAMPLE_ASSIGNMENTS[padNumber]
				if (sample && !event.repeat && !state.heldKeyboardSamples.has(event.code)) {
					state.heldKeyboardSamples.add(event.code)
					state.keyboardSamplePlayer.trigger(padNumber).catch(error => {
						console.error(`Could not play operational sample ${sample.label}`, error)
					})
					updateKeyboardStatus(application, state, sample.label, true)
				}
				return
			}
			const shortcut = getOperationalShortcut(event)
			const control = shortcut ? document.getElementById(shortcut.controlId) : null
			if (shortcut && control && !event.repeat) {
				control.click()
				updateKeyboardStatus(application, state, shortcut.label, true)
			}else if (!shortcut || !control) {
				showGuide()
				updateKeyboardStatus(application, state)
			}
			return
		}

		showGuide()
		updateKeyboardStatus(application, state)
	})

	window.addEventListener('keyup', event => {
		const hintKey = event.code || event.key
		if (hintKey) heldHintKeys.delete(hintKey)
		document.documentElement.classList.toggle('keyboard-input-active', heldHintKeys.size > 0)

		state.keyboardGuide.release(event)
		if (state.guideKey && state.guideKey === (event.code || event.key)) {
			state.keyboardGuide.close()
			state.guideKey = null
		}
		if (streamDeckKeyboard.handleKeyUp(event)) {
			event.preventDefault()
			return
		}

		const mode = KEYBOARD_MODES[state.keyboardModeIndex]
		const performanceKey = mode.type === KEYBOARD_TYPE_PERCUSSION
			? getKeyboardPerformanceKey(event)
			: null
		if (performanceKey) {
			const inputId = performanceKey.code
			const baseInputId = `keyboard:${inputId}`
			const shiftedInputId = `keyboard:shift:${inputId}`
			const heldInputId = state.heldKeyboardPercussion.has(shiftedInputId) ? shiftedInputId : baseInputId
			const heldPart = state.heldKeyboardPercussion.get(heldInputId)
			application.setPercussionInput?.(
				heldInputId,
				heldPart,
				false,
			)
			state.heldKeyboardPercussion.delete(heldInputId)
			updateKeyboardStatus(application, state)
			return
		}

		if (mode.type === KEYBOARD_TYPE_CHORDS && handleKeyboardChordUp(event, state)) {
			updateKeyboardStatus(application, state, '', state.heldKeyboardNotes.size > 0)
			return
		}

		if (mode.type === KEYBOARD_TYPE_SAMPLES && handleKeyboardSampleUp(event, state)) {
			updateKeyboardStatus(application, state, '', state.heldKeyboardSamples.size > 0)
			return
		}

		if (mode.type === KEYBOARD_TYPE_OPERATIONAL && handleKeyboardSampleUp(event, state)) {
			updateKeyboardStatus(application, state, '', state.heldKeyboardSamples.size > 0)
			return
		}

		if (mode.type === KEYBOARD_TYPE_NOTES && handleKeyboardNoteUp(event, state)) {
			updateKeyboardStatus(application, state, event.key, state.heldKeyboardNotes.size > 0)
			return
		}

		if (isEditableKeyboardEvent(event)) {
			return
		}

		if (mode.type === KEYBOARD_TYPE_CHORDS) {
			handleKeyboardChordUp(event, state)
			updateKeyboardStatus(application, state, '', state.heldKeyboardNotes.size > 0)
			return
		}

		if (mode.type === KEYBOARD_TYPE_SAMPLES) {
			handleKeyboardSampleUp(event, state)
			updateKeyboardStatus(application, state, '', state.heldKeyboardSamples.size > 0)
			return
		}

		if (mode.type === KEYBOARD_TYPE_OPERATIONAL) {
			handleKeyboardSampleUp(event, state)
			updateKeyboardStatus(application, state, '', state.heldKeyboardSamples.size > 0)
			return
		}

		if (mode.type !== KEYBOARD_TYPE_NOTES) {
			updateKeyboardStatus(application, state)
			return
		}

		handleKeyboardNoteUp(event, state)
		updateKeyboardStatus(application, state, event.key, state.heldKeyboardNotes.size > 0)
	})

	window.addEventListener('blur', () => {
		heldHintKeys.clear()
		document.documentElement.classList.remove('keyboard-input-active')
		streamDeckKeyboard.reset()
		clearHeldKeyboardNotes(state.heldKeyboardNotes)
		state.heldKeyboardSamples.clear()
		state.heldKeyboardPercussion.clear()
		state.keyboardSamplePlayer.stopAll()
		application.releasePercussionInputs?.('keyboard:')
		updateKeyboardStatus(application, state)
	})
}
