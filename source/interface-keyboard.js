import { toggleVisibility } from "./dom/ui"

export const KEYBOARD_MODE_COMMANDS = 'commands'
export const KEYBOARD_MODE_NOTES = 'notes'
export const KEYBOARD_MODE_NOTES_HIGH = 'notes-high'

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
])

// QWERTY piano layout rooted around middle C. The octave-based modes reuse this
// exact layout and only transpose the played note numbers.
const KEYBOARD_NOTE_LAYOUT = Object.freeze({
	z: 48,
	s: 49,
	x: 50,
	d: 51,
	c: 52,
	v: 53,
	g: 54,
	b: 55,
	h: 56,
	n: 57,
	j: 58,
	m: 59,
	q: 60,
	'2': 61,
	w: 62,
	'3': 63,
	e: 64,
	r: 65,
	'5': 66,
	t: 67,
	'6': 68,
	y: 69,
	'7': 70,
	u: 71,
	i: 72,
	'9': 73,
	o: 74,
	'0': 75,
	p: 76,
	'[': 77,
	'=': 78,
	']': 79,
})

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

const formatHeldKeyboardKeys = heldKeyboardNotes => {
	const heldKeys = Array.from(heldKeyboardNotes.keys()).map(key => key.toUpperCase())
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
		? `${mode.label}${heldKeys ? ` / ${heldKeys} held` : ''}`
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
	heldKeyboardNotes.forEach(({ instrument, noteNumber }) => {
		instrument?.noteOff?.(noteNumber, 0)
	})
	heldKeyboardNotes.clear()
}

const setKeyboardMode = (application, state, nextIndex) => {
	const nextModeIndex = ((nextIndex % KEYBOARD_MODES.length) + KEYBOARD_MODES.length) % KEYBOARD_MODES.length
	const previousMode = KEYBOARD_MODES[state.keyboardModeIndex]
	const nextMode = KEYBOARD_MODES[nextModeIndex]

	if (previousMode?.type === 'notes' && previousMode.key !== nextMode.key) {
		clearHeldKeyboardNotes(state.heldKeyboardNotes)
	}

	state.keyboardModeIndex = nextModeIndex
	application.setFeedback?.(getKeyboardModeFeedback(nextMode), 0, KEYBOARD_MODE_FEEDBACK_TYPE)
	updateKeyboardStatus(application, state)
	return nextMode
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

	const key = event.key?.toLowerCase?.()
	const rootNoteNumber = KEYBOARD_NOTE_LAYOUT[key]
	if (!Number.isFinite(rootNoteNumber)) {
		return false
	}

	const noteNumber = rootNoteNumber + (mode.octaveOffset ?? 0)
	const person = getKeyboardTargetPerson(application)
	const instrument = person?.activeInstrument

	if (!instrument || state.heldKeyboardNotes.has(key)) {
		return true
	}

	state.heldKeyboardNotes.set(key, { instrument, noteNumber })
	instrument.noteOn?.(noteNumber, 1)
	return true
}

const handleKeyboardNoteUp = (event, state) => {
	const key = event.key?.toLowerCase?.()
	const heldNote = state.heldKeyboardNotes.get(key)
	if (!heldNote) {
		return false
	}

	heldNote.instrument?.noteOff?.(heldNote.noteNumber, 0)
	state.heldKeyboardNotes.delete(key)
	return true
}

const handleKeyboardCommandMode = async (event, application, state) => {
	const isNumber = !isNaN(parseInt(event.key))
	const clock = application.clock

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

/**
 * Add keyboard listeners and tie in commands
 */
export const addKeyboardEvents = application => {
	const state = {
		numberSequence: '',
		keyboardModeIndex: 0,
		heldKeyboardNotes: new Map(),
	}

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

	window.addEventListener('keydown', async event => {
	
		// ignore tabbing
		if (event.key !== 'Tab') {
			event.preventDefault()
		}

		if (handleModeSwitch(event)) {
			return
		}

		// get the curent mode
		const mode = KEYBOARD_MODES[state.keyboardModeIndex]

		if (mode.type === 'notes') {
			state.numberSequence = ''
			handleKeyboardNoteDown(event, application, state, mode)
			updateKeyboardStatus(application, state, event.key, state.heldKeyboardNotes.size > 0)
			return
		}

		await handleKeyboardCommandMode(event, application, state)
		updateKeyboardStatus(application, state, event.key, true)
	})

	window.addEventListener('keyup', event => {
		const mode = KEYBOARD_MODES[state.keyboardModeIndex]
		if (mode.type !== 'notes') {
			updateKeyboardStatus(application, state)
			return
		}

		handleKeyboardNoteUp(event, state)
		updateKeyboardStatus(application, state, event.key, state.heldKeyboardNotes.size > 0)
	})

	window.addEventListener('blur', () => {
		clearHeldKeyboardNotes(state.heldKeyboardNotes)
		updateKeyboardStatus(application, state)
	})
}
