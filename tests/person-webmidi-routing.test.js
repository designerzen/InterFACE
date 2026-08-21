jest.mock('webmidi', () => {
	const mockWebMidi = { outputs:[] }
	mockWebMidi.getOutputById = jest.fn(id => mockWebMidi.outputs.find(output => output.id === id))
	mockWebMidi.getOutputByName = jest.fn(name => mockWebMidi.outputs.find(output => output.name === name))
	return { WebMidi:mockWebMidi }
})

jest.mock('../source/audio/midi/midi-echo-guard.js', () => ({
	isMIDIDebugEnabled: jest.fn(() => false),
	sendGuardedMIDIOutput: jest.fn(() => true),
	stopActiveMIDIOutputNotes: jest.fn(),
}))

import { WebMidi } from 'webmidi'
import { sendGuardedMIDIOutput } from '../source/audio/midi/midi-echo-guard.js'
import { updateWebMIDIWithPerson } from '../source/audio/instrumentMediators/mediator.person-webmidi.js'
import { STATE_INSTRUMENT_ATTACK } from '../source/people/person-states.js'

const createOutput = index => ({
	id:`output-${index}`,
	name:`Output ${index}`,
	manufacturer:'Test',
})

const createPerson = (playerNumber, options = {}) => ({
	playerNumber,
	state:STATE_INSTRUMENT_ATTACK,
	noteVelocity:0.8,
	options:{
		midiDevice:'auto',
		midiPort:'auto',
		...options,
	},
})

beforeEach(() => {
	WebMidi.outputs.length = 0
	WebMidi.outputs.push(...Array.from({length:4}, (_, index) => createOutput(index)))
})

test('one player in Auto mode sends notes to every MIDI output', () => {
	const person = createPerson(0)

	updateWebMIDIWithPerson(person, [person], [{noteNumber:60}])

	expect(sendGuardedMIDIOutput).toHaveBeenCalledTimes(4)
	WebMidi.outputs.forEach(output => {
		expect(sendGuardedMIDIOutput).toHaveBeenCalledWith(
			output,
			'playNote',
			60,
			{attack:0.8},
			'updateWebMIDIWithPerson-all'
		)
	})
})

test('multiple players in Auto mode use one dedicated output per player', () => {
	const people = Array.from({length:4}, (_, playerNumber) => createPerson(playerNumber))
	const person = people[1]

	updateWebMIDIWithPerson(person, people, [{noteNumber:62}])

	expect(sendGuardedMIDIOutput).toHaveBeenCalledTimes(1)
	expect(sendGuardedMIDIOutput).toHaveBeenCalledWith(
		WebMidi.outputs[1],
		'playNote',
		62,
		{attack:0.8},
		'updateWebMIDIWithPerson-dedicated'
	)
})

test('an explicitly selected device and channel override Auto routing', () => {
	const person = createPerson(2, {
		midiDevice:'output-3',
		midiPort:'7',
	})

	updateWebMIDIWithPerson(person, [person], [{noteNumber:64}])

	expect(sendGuardedMIDIOutput).toHaveBeenCalledTimes(1)
	expect(sendGuardedMIDIOutput).toHaveBeenCalledWith(
		WebMidi.outputs[3],
		'playNote',
		64,
		{attack:0.8, channels:7},
		'updateWebMIDIWithPerson-dedicated'
	)
})

test('numeric instrument output is accepted as a MIDI note', () => {
	const people = Array.from({length:4}, (_, playerNumber) => createPerson(playerNumber))
	const person = people[3]

	updateWebMIDIWithPerson(person, people, [67])

	expect(sendGuardedMIDIOutput).toHaveBeenCalledTimes(1)
	expect(sendGuardedMIDIOutput).toHaveBeenCalledWith(
		WebMidi.outputs[3],
		'playNote',
		67,
		{attack:0.8},
		'updateWebMIDIWithPerson-dedicated'
	)
})
