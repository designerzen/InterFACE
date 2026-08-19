const STREAM_DECK_STATUS_ID = 'streamdeck'

export const STREAM_DECK_PRIMARY_MODIFIERS = Object.freeze({
	ctrlKey: true,
	altKey: true,
	shiftKey: true,
})

export const STREAM_DECK_PLAYER_MODIFIERS = Object.freeze({
	ctrlKey: true,
	altKey: true,
	shiftKey: false,
})

const STREAM_DECK_DIRECT_MODIFIERS = Object.freeze({
	ctrlKey: false,
	altKey: false,
	shiftKey: false,
})

export const STREAM_DECK_DIRECT_COMMANDS = Object.freeze({
	F13: 'Digit1',
	F14: 'Digit2',
	F15: 'Digit3',
	F16: 'Digit4',
	F17: 'Digit5',
	F18: 'ModeSamples',
	F19: 'KeyA',
	F20: 'KeyC',
	F21: 'KeyB',
	F22: 'KeyF',
	F23: 'KeyG',
	F24: 'Digit0',
})

const hasExactModifiers = (event, modifiers) => (
	event.ctrlKey === modifiers.ctrlKey
	&& event.altKey === modifiers.altKey
	&& event.shiftKey === modifiers.shiftKey
	&& event.metaKey === false
)

const getDirectCommandCode = event => (
	hasExactModifiers(event, STREAM_DECK_DIRECT_MODIFIERS)
		? STREAM_DECK_DIRECT_COMMANDS[event.code]
		: null
)

const activateControl = (controlId, fallback) => {
	const control = document.getElementById(controlId)
	if (control && !control.disabled) {
		control.click()
		return true
	}
	fallback?.()
	return false
}

const activatePressureControl = (controlId, fallback) => {
	const control = document.getElementById(controlId)
	if (control && !control.disabled) {
		control.checked = !control.checked
		control.dispatchEvent(new CustomEvent('mouse_tap', { bubbles: true }))
		return true
	}
	fallback?.()
	return false
}

const selectPlayer = (application, playerIndex) => {
	application.selectPerson?.(playerIndex)
	return `Select Player ${playerIndex + 1}`
}

const cyclePlayerType = (application, playerIndex) => {
	const person = application.getPerson?.(playerIndex)
	if (person) application.configurePerson?.(person, person.type + 1)
	return `Player ${playerIndex + 1} Type`
}

const randomisePlayer = (application, playerIndex) => {
	application.getPerson?.(playerIndex)?.loadRandomPreset?.()
	return `Player ${playerIndex + 1} Preset`
}

const tapTempo = application => {
	const tappedTempo = application.tapTempo?.()
	if (tappedTempo > 1) application.setBPM?.(tappedTempo)
	return 'Tap Tempo'
}

const changeTempo = (application, direction) => {
	const bpm = (application.clock?.BPM ?? 120) + direction
	application.setBPM?.(bpm)
	return `Tempo ${direction < 0 ? 'Down' : 'Up'}`
}

const handlePrimaryCommand = (
	code,
	application,
	selectKeyboardMode,
	shiftNumericOctave,
) => {
	switch (code) {
		case 'Digit1': return selectKeyboardMode(0).label
		case 'Digit2': return selectKeyboardMode(1).label
		case 'Digit3': return selectKeyboardMode(2).label
		case 'Digit4': return selectKeyboardMode(3).label
		case 'Digit5': return selectKeyboardMode(4).label
		case 'ModeSamples': return selectKeyboardMode(5).label
		case 'Digit8': return changeTempo(application, -1)
		case 'Digit9': return changeTempo(application, 1)
		case 'Digit0': return tapTempo(application)

		case 'KeyA':
			application.previousInstrument?.(() => {}, true)
			return 'Previous Instrument'
		case 'KeyB':
			application.nextInstrument?.(() => {}, true)
			return 'Next Instrument'
		case 'KeyC':
			activateControl('button-video', () => application.loadRandomInstrument?.(() => {}, true))
			return 'Random Instrument'
		case 'KeyD':
			application.setRandomDrumPattern?.()
			return 'Random Drum Pattern'
		case 'KeyE':
			application.setRandomDrumTimbres?.()
			return 'Random Drum Sounds'
		case 'KeyF':
			activateControl('button-percussion', () => application.toggleBackgroundPercussion?.())
			return 'Backing Beat'
		case 'KeyG':
			activateControl('button-quantise', () => application.stateMachine?.toggle?.('quantise'))
			return 'Quantise'
		case 'KeyH':
			activateControl('button-metronome', () => application.stateMachine?.toggle?.('metronome'))
			return 'Metronome'
		case 'KeyI':
			activateControl('button-fullscreen', () => application.toggleFullScreen?.())
			return 'Fullscreen'
		case 'KeyJ':
			activateControl('button-disco', () => application.setDiscoMode?.())
			return 'MTV Mode'
		case 'KeyK':
			activateControl('button-spectrogram', () => application.stateMachine?.toggle?.('spectrogram'))
			return 'V.U. Display'
		case 'KeyL':
			application.stateMachine?.toggle?.('photoSensitive')
			return 'Photosensitive Mode'
		case 'KeyM':
			activateControl('button-clear', () => application.stateMachine?.toggle?.('clear'))
			return 'Clear Video'
		case 'KeyN':
			activateControl('button-overlay', () => application.stateMachine?.toggle?.('overlays'))
			return 'AR Overlay'
		case 'KeyO':
			activateControl('button-meshes', () => application.stateMachine?.toggle?.('masks'))
			return 'Face Overlays'
		case 'KeyP':
			activateControl('button-eyes', () => application.stateMachine?.toggle?.('eyes'))
			return 'Eye Overlays'
		case 'KeyQ':
			activateControl('button-eyebrows', () => application.stateMachine?.toggle?.('eyebrows'))
			return 'Eyebrow Overlays'
		case 'KeyR':
			activateControl('button-lips', () => application.stateMachine?.toggle?.('lips'))
			return 'Lip Overlays'
		case 'KeyS':
			activateControl('button-subtitles', () => application.stateMachine?.toggle?.('text'))
			return 'Subtitles'
		case 'KeyT':
			activateControl('button-speak', () => application.stateMachine?.toggle?.('speak'))
			return 'Speech'
		case 'KeyU':
			activateControl('button-hud', () => application.stateMachine?.toggle?.('hud'))
			return 'Input HUD'
		case 'KeyV':
			activateControl('button-automate', () => application.stateMachine?.toggle?.('automationMode'))
			return 'Automation'
		case 'KeyW':
			activateControl('button-toggle-advanced', () => application.stateMachine?.toggle?.('advancedMode'))
			return 'Advanced Controls'
		case 'KeyX':
			shiftNumericOctave(-1)
			return 'Number Octave Down'
		case 'KeyY':
			shiftNumericOctave(1)
			return 'Number Octave Up'
		case 'KeyZ':
			Promise.resolve(application.setReverb?.()).then(reverb => {
				if (reverb) application.setFeedback?.(`Reverb : '${reverb}' loaded`, 0, 'tempo')
			}).catch(error => console.error('Could not load Stream Deck reverb', error))
			return 'Random Reverb'
		default: return null
	}
}

const handlePlayerCommand = (code, application) => {
	switch (code) {
		case 'Digit1': return selectPlayer(application, 0)
		case 'Digit2': return selectPlayer(application, 1)
		case 'Digit3': return selectPlayer(application, 2)
		case 'Digit4': return selectPlayer(application, 3)
		case 'Digit5': return cyclePlayerType(application, 0)
		case 'Digit6': return cyclePlayerType(application, 1)
		case 'Digit7': return cyclePlayerType(application, 2)
		case 'Digit8': return cyclePlayerType(application, 3)
		case 'KeyQ': return randomisePlayer(application, 0)
		case 'KeyW': return randomisePlayer(application, 1)
		case 'KeyE': return randomisePlayer(application, 2)
		case 'KeyR': return randomisePlayer(application, 3)
		case 'KeyA':
			application.toggleVideoFrameCopy?.()
			return 'Video Frame Copy'
		case 'KeyB':
			application.toggleVideoOutput?.()
			return 'Video Output'
		case 'KeyC':
			activatePressureControl('button-record-audio', () => application.toggleRecording?.())
			return 'Record Audio'
		case 'KeyD':
			application.setNodeCount?.(-1)
			return 'Fewer Visual Nodes'
		case 'KeyF':
			application.setNodeCount?.(1)
			return 'More Visual Nodes'
		default: return null
	}
}

export const createStreamDeckKeyboardHandler = (application, {
	selectKeyboardMode,
	shiftNumericOctave,
}) => {
	let lastAction = null

	const updateStatus = (label, active = true) => {
		if (label) lastAction = label
		application.setInputStatus?.(STREAM_DECK_STATUS_ID, {
			type: 'streamdeck',
			label: 'Stream Deck',
			detail: lastAction ?? 'Ready',
			connected: true,
			active,
			ttl: active ? 1200 : undefined,
		})
	}

	const handleKeyDown = event => {
		let label = null
		const directCommandCode = getDirectCommandCode(event)
		if (directCommandCode) {
			label = handlePrimaryCommand(
				directCommandCode,
				application,
				selectKeyboardMode,
				shiftNumericOctave,
			)
		}else if (hasExactModifiers(event, STREAM_DECK_PRIMARY_MODIFIERS)) {
			label = handlePrimaryCommand(
				event.code,
				application,
				selectKeyboardMode,
				shiftNumericOctave,
			)
		}else if (hasExactModifiers(event, STREAM_DECK_PLAYER_MODIFIERS)) {
			label = handlePlayerCommand(event.code, application)
		}

		if (!label) return false
		if (!event.repeat) updateStatus(label, true)
		return true
	}

	const handleKeyUp = event => {
		if (
			!getDirectCommandCode(event)
			&& !hasExactModifiers(event, STREAM_DECK_PRIMARY_MODIFIERS)
			&& !hasExactModifiers(event, STREAM_DECK_PLAYER_MODIFIERS)
		) return false

		updateStatus(null, false)
		return true
	}

	updateStatus(null, false)
	return { handleKeyDown, handleKeyUp, reset: () => updateStatus(null, false) }
}
