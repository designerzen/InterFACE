jest.mock('webmidi', () => {
	const mockWebMidi = { outputs:[] }
	mockWebMidi.getOutputById = jest.fn(id => mockWebMidi.outputs.find(output => output.id === id))
	mockWebMidi.getOutputByName = jest.fn(name => mockWebMidi.outputs.find(output => output.name === name))
	return { WebMidi:mockWebMidi }
})

jest.mock('../source/audio/midi/midi-echo-guard.js', () => ({
	isMIDIDebugEnabled: jest.fn(() => false),
	dispatchMIDIActivity: jest.fn(),
	sendGuardedMIDIOutput: jest.fn(() => true),
	stopActiveMIDIOutputNotes: jest.fn(),
}))

import { WebMidi } from 'webmidi'
import { sendGuardedMIDIOutput } from '../source/audio/midi/midi-echo-guard.js'
import { stopWebMIDIForPerson, updateWebMIDIWithPerson } from '../source/audio/instrumentMediators/mediator.person-webmidi.js'
import { STATE_INSTRUMENT_ATTACK } from '../source/people/person-states.js'

const createOutput = index => ({
	id:`output-${index}`,
	name:`Output ${index}`,
	manufacturer:'Test',
	sendControlChange:jest.fn(),
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

test('one player in Auto mode uses one dedicated MIDI output', () => {
	const person = createPerson(0)
	updateWebMIDIWithPerson(person, [person], [{noteNumber:60}])
	expect(sendGuardedMIDIOutput).toHaveBeenCalledTimes(1)
	expect(sendGuardedMIDIOutput).toHaveBeenCalledWith(WebMidi.outputs[0], 'playNote', 60, {attack:0.8}, 'updateWebMIDIWithPerson-dedicated')
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


test('one output gives each person a separate channel', () => {
	WebMidi.outputs.splice(1)
	const people = [createPerson(0), createPerson(1)]
	updateWebMIDIWithPerson(people[1], people, [{noteNumber:73}])
	expect(sendGuardedMIDIOutput).toHaveBeenCalledWith(WebMidi.outputs[0], 'playNote', 73, {attack:0.8, channels:2}, expect.any(String))
})

test('an explicitly disconnected device does not send to a different device', () => {
	const person = createPerson(2, {midiDevice:'missing'})
	updateWebMIDIWithPerson(person, [person], [{noteNumber:75}])
	expect(sendGuardedMIDIOutput).not.toHaveBeenCalled()
})

test('eyebrow CC follows each person on a shared output, even without notes', () => {
	WebMidi.outputs.splice(1)
	const people = [createPerson(0, {pitchBend:true}), createPerson(1, {pitchBend:true})]
	people[0].data = {eyebrowExtents:0}
	people[1].data = {eyebrowExtents:2}
	people.forEach(person => updateWebMIDIWithPerson(person, people, null))
	expect(WebMidi.outputs[0].sendControlChange.mock.calls).toEqual([
		[74, 0, {channels:1}], [74, 127, {channels:2}]
	])
	people.forEach(person => updateWebMIDIWithPerson(person, people, null))
	expect(WebMidi.outputs[0].sendControlChange).toHaveBeenCalledTimes(2)
})

test('eyebrow CC honours explicit routing, controller, bounds and per-person enable', () => {
	const person = createPerson(1, {pitchBend:true, midiDevice:'output-2', midiPort:'8'})
	person.data = {eyebrowExtents:1}
	const update = () => updateWebMIDIWithPerson(person, [person], null, undefined, {mode:'cc', cc:1})
	update()
	expect(WebMidi.outputs[2].sendControlChange).toHaveBeenLastCalledWith(1, 64, {channels:8})
	person.data.eyebrowExtents = 10
	update()
	expect(WebMidi.outputs[2].sendControlChange).toHaveBeenLastCalledWith(1, 127, {channels:8})
	person.options.pitchBend = false
	person.data.eyebrowExtents = 0
	update()
	expect(WebMidi.outputs[2].sendControlChange).toHaveBeenCalledTimes(2)
	expect(WebMidi.outputs[0].sendControlChange).not.toHaveBeenCalled()
})

test('pitch bend resets when switching to CC, disabling expression or changing route', () => {
	const person = createPerson(0, {pitchBend:true, midiPort:'3'})
	person.data = {eyebrowExtents:2}
	const update = mode => updateWebMIDIWithPerson(person, [person], null, undefined, {mode})
	update('pitchbend')
	expect(sendGuardedMIDIOutput).toHaveBeenLastCalledWith(WebMidi.outputs[0], 'sendPitchBend', 1, {channels:3}, 'eyebrows')
	update('cc')
	expect(sendGuardedMIDIOutput).toHaveBeenLastCalledWith(WebMidi.outputs[0], 'sendPitchBend', 0, {channels:3}, 'eyebrows-reset')
	update('pitchbend')
	person.options.pitchBend = false
	update('pitchbend')
	expect(sendGuardedMIDIOutput).toHaveBeenLastCalledWith(WebMidi.outputs[0], 'sendPitchBend', 0, {channels:3}, 'eyebrows-reset')
	person.options.pitchBend = true
	update('pitchbend')
	person.options.midiDevice = 'output-1'
	update('pitchbend')
	expect(sendGuardedMIDIOutput.mock.calls.filter(([, method]) => method === 'sendPitchBend').slice(-2)).toEqual([
		[WebMidi.outputs[0], 'sendPitchBend', 0, {channels:3}, 'eyebrows-reset'],
		[WebMidi.outputs[1], 'sendPitchBend', 1, {channels:3}, 'eyebrows']
	])
	stopWebMIDIForPerson(person)
	expect(sendGuardedMIDIOutput).toHaveBeenLastCalledWith(WebMidi.outputs[1], 'sendPitchBend', 0, {channels:3}, 'eyebrows-reset')
})

test('eyebrow output ignores missing and invalid tracking data', () => {
	const person = createPerson(0, {pitchBend:true})
	for (const extent of [undefined, NaN, Infinity]) {
		person.data = {eyebrowExtents:extent}
		updateWebMIDIWithPerson(person, [person], null)
	}
	expect(WebMidi.outputs[0].sendControlChange).not.toHaveBeenCalled()
})
