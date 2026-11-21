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
	recordMIDIInputNote: jest.fn(),
	forgetMIDIInputNotes: jest.fn(),
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
import { recordMIDIInputNote, sendGuardedMIDIOutput } from '../source/audio/midi/midi-echo-guard.js'
import { INTEGRATION_HARMONISE, INTEGRATION_NOTES, setMIDIDeviceIntegration } from '../source/audio/midi/midi-device-integration.js'

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

const createPerson = playerNumber => ({
	playerNumber,
	emoticon: '🙂',
	noteVelocity: 0.7,
	addEventListener: jest.fn(),
	setMIDIRootNoteOverride: jest.fn(),
	clearMIDIRootNoteOverride: jest.fn(),
	activeInstrument: {
		noteOn: jest.fn(),
		noteOff: jest.fn(),
	},
})

const createHarness = (id, integration = { mode: INTEGRATION_HARMONISE }) => {
	const input = createInput(id)
	if (integration) setMIDIDeviceIntegration(input, integration)
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

	const people = [person, createPerson(1), createPerson(2)]
	const options = {
		stateMachine,
		personManager: {
			people,
			getSelectedPerson: jest.fn(() => person),
			getActivePerson: jest.fn(() => person),
		},
		globalChordPlayer,
		clock: {},
		startBackgroundPercussion: jest.fn(),
		stopBackgroundPercussion: jest.fn(),
		toggleBackgroundPercussion: jest.fn(),
		scheduleMIDIInput,
	}
	observeMIDIInputs(options)

	return {
		globalChordPlayer,
		input,
		options,
		people,
		pendingCallbacks,
		pendingCancels,
		person,
		scheduleMIDIInput,
	}
}

describe('quantised MIDI input', () => {
	test('a repeated note-on retriggers the pending note', () => {
		const harness = createHarness('quantised-retrigger')
		const event = createNoteEvent(60)

		harness.input.emit('noteon', event)
		harness.input.emit('noteon', event)

		expect(harness.scheduleMIDIInput).toHaveBeenCalledTimes(2)
		expect(harness.scheduleMIDIInput).toHaveBeenCalledWith(
			expect.any(Function),
			event.timestamp
		)
		expect(harness.pendingCancels[0]).toHaveBeenCalledTimes(1)

		harness.pendingCallbacks[0]()
		expect(harness.globalChordPlayer.chordOn).not.toHaveBeenCalled()
		harness.pendingCallbacks[1]()
		expect(harness.globalChordPlayer.chordOn).toHaveBeenCalledTimes(1)
	})

	test('remembers every note a device plays, even when only monitored', () => {
		const harness = createHarness('remembered-notes', null)
		harness.input.emit('noteon', createNoteEvent(64))
		harness.input.emit('noteoff', { ...createNoteEvent(64, 0), type: 'noteoff' })

		expect(recordMIDIInputNote).toHaveBeenCalledWith(harness.input, 64, true)
		expect(recordMIDIInputNote).toHaveBeenCalledWith(harness.input, 64, false)
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

describe('device integrations', () => {
	const immediate = callback => {
		callback()
		return jest.fn()
	}

	test('observes a device without playing until it is given a mode', () => {
		const harness = createHarness('unconfigured-device', null)
		harness.input.emit('noteon', createNoteEvent(60))

		expect(harness.scheduleMIDIInput).not.toHaveBeenCalled()
		expect(harness.globalChordPlayer.chordOn).not.toHaveBeenCalled()
		expect(sendGuardedMIDIOutput).not.toHaveBeenCalled()
	})

	test("plays the device's own notes for each chosen person, onboard only", () => {
		const harness = createHarness('strum-notes', { mode: INTEGRATION_NOTES, people: [1, 2] })
		harness.scheduleMIDIInput.mockImplementation(immediate)

		harness.input.emit('noteon', createNoteEvent(52, 0.5))
		const [, second, third] = harness.people
		expect(second.activeInstrument.noteOn).toHaveBeenCalledWith(52, 0.5)
		expect(third.activeInstrument.noteOn).toHaveBeenCalledWith(52, 0.5)
		expect(harness.person.setMIDIRootNoteOverride).not.toHaveBeenCalled()
		expect(sendGuardedMIDIOutput).not.toHaveBeenCalled()

		harness.input.emit('noteoff', { ...createNoteEvent(52, 0), type: 'noteoff' })
		expect(second.activeInstrument.noteOff).toHaveBeenCalledWith(52, 0.5)
		expect(third.activeInstrument.noteOff).toHaveBeenCalledWith(52, 0.5)
	})

	test('releases held notes when the device is unplugged', () => {
		const harness = createHarness('unplugged-device', { mode: INTEGRATION_NOTES, people: [1] })
		harness.scheduleMIDIInput.mockImplementation(immediate)
		harness.input.emit('noteon', createNoteEvent(55))

		WebMidi.inputs.length = 0
		observeMIDIInputs(harness.options)

		expect(harness.people[1].activeInstrument.noteOff).toHaveBeenCalledWith(55, 0.8)
		expect(harness.input.removeListener).toHaveBeenCalledWith('noteon', expect.any(Function))
	})

	test('changing how a device plays releases its held notes', () => {
		const harness = createHarness('reconfigured-device', { mode: INTEGRATION_NOTES, people: [1] })
		harness.scheduleMIDIInput.mockImplementation(immediate)
		harness.input.emit('noteon', createNoteEvent(57))

		setMIDIDeviceIntegration(harness.input, { mode: INTEGRATION_NOTES, people: [2] })

		expect(harness.people[1].activeInstrument.noteOff).toHaveBeenCalledWith(57, 0.8)
	})

	test("does not hand a departed person's device to someone else", () => {
		const harness = createHarness('departed-person', { mode: INTEGRATION_NOTES, people: [7] })
		harness.scheduleMIDIInput.mockImplementation(immediate)
		harness.input.emit('noteon', createNoteEvent(59))

		expect(harness.scheduleMIDIInput).not.toHaveBeenCalled()
	})
})
