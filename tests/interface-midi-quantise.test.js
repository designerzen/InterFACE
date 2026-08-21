jest.mock('webmidi', () => ({
	WebMidi: {
		inputs: [],
		outputs: [],
	},
}))

jest.mock('../source/audio/instrumentMediators/mediator.person-webmidi.js', () => ({
	getActiveMIDINotesForPerson: jest.fn(() => new Map()),
	isMIDINoteActive: jest.fn(() => false),
}))

jest.mock('../source/audio/midi/midi-echo-guard.js', () => ({
	isMIDIDebugEnabled: jest.fn(() => false),
	isRecentMIDIOutputEcho: jest.fn(() => null),
	logMIDIDebug: jest.fn(),
	sendGuardedMIDIOutput: jest.fn(() => true),
}))

jest.mock('../source/models/emoji-to-music.js', () => ({
	getMusicalDetailsFromEmoji: jest.fn(noteNumber => [{
		noteNumber: noteNumber + 4,
		velocity: 1,
	}]),
}))

import { WebMidi } from 'webmidi'
import { observeMIDIInputs } from '../source/interface-midi.js'

const createInput = id => {
	const listeners = new Map()
	return {
		id,
		name: id,
		manufacturer: 'Test',
		addListener: jest.fn((type, listener) => listeners.set(type, listener)),
		removeListener: jest.fn(),
		emit(type, event) {
			listeners.get(type)?.(event)
		},
	}
}

const createNoteEvent = (number, value=0.8, timestamp=1234.5) => ({
	type: 'noteon',
	timestamp,
	note: {
		number,
		identifier: `note-${number}`,
	},
	value,
	velocity: value,
	message: {
		type: 'noteon',
		data: [0x90, number, Math.round(value * 127)],
		dataBytes: [number, Math.round(value * 127)],
	},
})

const createHarness = id => {
	const input = createInput(id)
	const person = {
		playerNumber: 0,
		emoticon: '🙂',
		noteVelocity: 0.7,
		addEventListener: jest.fn(),
		setMIDIRootNoteOverride: jest.fn(),
		clearMIDIRootNoteOverride: jest.fn(),
	}
	const globalChordPlayer = {
		chordOn: jest.fn(),
		chordOff: jest.fn(),
	}
	const pendingCallbacks = []
	const pendingCancels = []
	const scheduleMIDIInput = jest.fn(callback => {
		const cancel = jest.fn()
		pendingCallbacks.push(callback)
		pendingCancels.push(cancel)
		return cancel
	})
	const enabledState = new Set(['midiInput', 'midiOnboard'])
	const stateMachine = {
		get: jest.fn(key => enabledState.has(key)),
	}

	WebMidi.inputs.length = 0
	WebMidi.outputs.length = 0
	WebMidi.inputs.push(input)

	observeMIDIInputs({
		stateMachine,
		personManager: {
			getSelectedPerson: jest.fn(() => person),
			getActivePerson: jest.fn(() => person),
		},
		globalChordPlayer,
		clock: {},
		startBackgroundPercussion: jest.fn(),
		stopBackgroundPercussion: jest.fn(),
		toggleBackgroundPercussion: jest.fn(),
		scheduleMIDIInput,
	})

	return {
		globalChordPlayer,
		input,
		pendingCallbacks,
		pendingCancels,
		person,
		scheduleMIDIInput,
	}
}

describe('quantised MIDI input', () => {
	test('reserves an accepted note while its start is pending', () => {
		const harness = createHarness('quantised-reservation')
		const event = createNoteEvent(60)

		harness.input.emit('noteon', event)
		harness.input.emit('noteon', event)

		expect(harness.scheduleMIDIInput).toHaveBeenCalledTimes(1)
		expect(harness.scheduleMIDIInput).toHaveBeenCalledWith(
			expect.any(Function),
			event.timestamp
		)
		expect(harness.globalChordPlayer.chordOn).not.toHaveBeenCalled()

		harness.pendingCallbacks[0]()
		expect(harness.globalChordPlayer.chordOn).toHaveBeenCalledTimes(1)
	})

	test('cancels a pending note when note-off arrives before the grid boundary', () => {
		const harness = createHarness('quantised-cancellation')
		const noteOn = createNoteEvent(61)

		harness.input.emit('noteon', noteOn)
		harness.input.emit('noteoff', {
			...createNoteEvent(61, 0),
			type: 'noteoff',
			message: {
				...noteOn.message,
				type: 'noteoff',
				data: [0x80, 61, 0],
			},
		})

		expect(harness.pendingCancels[0]).toHaveBeenCalledTimes(1)

		harness.pendingCallbacks[0]()
		expect(harness.globalChordPlayer.chordOn).not.toHaveBeenCalled()
		expect(harness.globalChordPlayer.chordOff).not.toHaveBeenCalled()
	})

	test('starts on the scheduled boundary and releases immediately afterwards', () => {
		const harness = createHarness('quantised-release')
		const noteOn = createNoteEvent(62)

		harness.input.emit('noteon', noteOn)
		harness.pendingCallbacks[0]()
		harness.input.emit('noteoff', {
			...createNoteEvent(62, 0),
			type: 'noteoff',
			message: {
				...noteOn.message,
				type: 'noteoff',
				data: [0x80, 62, 0],
			},
		})

		expect(harness.globalChordPlayer.chordOn).toHaveBeenCalledTimes(1)
		expect(harness.globalChordPlayer.chordOff).toHaveBeenCalledTimes(1)
	})
})
