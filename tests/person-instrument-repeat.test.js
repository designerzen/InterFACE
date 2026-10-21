import { updateInstrumentWithPerson } from '../source/audio/instrumentMediators/mediator.person-instrument.js'
import ChordInstrument from '../source/audio/instruments/chord.instrument.js'
import { STATE_INSTRUMENT_ATTACK, STATE_INSTRUMENT_PITCH_BEND, STATE_INSTRUMENT_SUSTAIN } from '../source/people/person-states.js'
import { INSTRUMENT_TYPE_CHORD } from '../source/audio/instrument-list.js'
import { EMOJI_FLUSHED, EMOJI_SMILING_SLIGHTLY, EMOJI_WAIL } from '../source/models/emoji.js'
import { getPersonNoteRepeatTicks, isPersonNoteRepeatDue } from '../source/timing/person-note-repeat.js'

const createSustainingPerson = (state = STATE_INSTRUMENT_SUSTAIN) => ({
	state,
	singing:true,
	noteVelocity:0.8,
	noteNumber:60,
	activeNotes:new Map([[60, [{noteNumber:60}, {noteNumber:64}, {noteNumber:67}]]])
})

test.each([
	['sample', 'Piano', 12],
	['sample', 'Strings', 6],
	['sample', 'Ensemble', 6],
	['oscillator', undefined, 0],
	['speech', undefined, 48]
])('uses a 24 PPQ mouth-repeat policy for %s/%s voices', (type, instrumentFamily, expectedTicks) => {
	const person = {
		activeInstrument:{
			type:INSTRUMENT_TYPE_CHORD,
			instruments:[{ type, instrumentFamily }]
		},
		options:{}
	}

	expect(getPersonNoteRepeatTicks(person)).toBe(expectedTicks)
})

test('repeats an open mouth on its quantised pulse', () => {
	const person = {
		activeInstrument:{ type:'sample', instrumentFamily:'Piano' },
		options:{ autoRepeat:true },
		singing:true,
		noteVelocity:0.8,
		lastNoteRepeatedTick:12
	}

	expect(isPersonNoteRepeatDue(person, 23)).toBe(false)
	expect(isPersonNoteRepeatDue(person, 24)).toBe(true)
	person.lastNoteRepeatedTick = 24
	expect(isPersonNoteRepeatDue(person, 24)).toBe(false)
})

test('honours an explicit pulse-count override', () => {
	const person = {
		activeInstrument:{ type:'sample' },
		options:{ autoRepeat:true, noteRepeatTicks:3 },
		singing:true,
		noteVelocity:0.8
	}

	expect(getPersonNoteRepeatTicks(person)).toBe(3)
	expect(isPersonNoteRepeatDue(person, 2)).toBe(false)
	expect(isPersonNoteRepeatDue(person, 3)).toBe(true)
})

test('never repeats an oscillator while its note remains held', () => {
	const person = {
		activeInstrument:{ type:'oscillator' },
		options:{ autoRepeat:true },
		singing:true,
		noteVelocity:0.8
	}

	expect(isPersonNoteRepeatDue(person, 24)).toBe(false)
})

test('does not retrigger sustained notes without a repeat tick', () => {
	const person = createSustainingPerson()
	const instrument = {
		type:INSTRUMENT_TYPE_CHORD,
		chordOn:jest.fn(),
		chordRetrigger:jest.fn()
	}

	const output = updateInstrumentWithPerson(instrument, person, true, false)

	expect(output).toEqual([{noteNumber:60}, {noteNumber:64}, {noteNumber:67}])
	expect(instrument.chordOn).not.toHaveBeenCalled()
	expect(instrument.chordRetrigger).not.toHaveBeenCalled()
})

test('retrigger sustained chord notes when a repeat tick is supplied', () => {
	const person = createSustainingPerson(STATE_INSTRUMENT_PITCH_BEND)
	const instrument = {
		type:INSTRUMENT_TYPE_CHORD,
		chordOn:jest.fn(),
		chordRetrigger:jest.fn()
	}

	const output = updateInstrumentWithPerson(instrument, person, true, true)

	expect(output).toEqual([{noteNumber:60}, {noteNumber:64}, {noteNumber:67}])
	expect(instrument.chordRetrigger).toHaveBeenCalledWith(output, 0.8)
	expect(instrument.chordOn).not.toHaveBeenCalled()
})

test('retrigger sustained monophonic notes when a repeat tick is supplied', () => {
	const person = {
		state:STATE_INSTRUMENT_SUSTAIN,
		singing:true,
		noteVelocity:0.5,
		noteNumber:62,
		activeNotes:new Map([[62, [62]]])
	}
	const instrument = {
		type:'sample',
		noteOn:jest.fn(),
		retrigger:jest.fn()
	}

	const output = updateInstrumentWithPerson(instrument, person, true, true)

	expect(output).toEqual([62])
	expect(instrument.retrigger).toHaveBeenCalledWith(62, 0.5)
	expect(instrument.noteOn).not.toHaveBeenCalled()
})

test('chord retrigger delegates to the playable voice without releasing the held chord', async () => {
	const context = {
		createGain:jest.fn(() => ({ disconnect:jest.fn() }))
	}
	const instrument = new ChordInstrument(context)
	const voice = {
		retrigger:jest.fn(() => true),
		noteOn:jest.fn(),
		noteOff:jest.fn()
	}
	instrument.instruments = [voice]
	instrument.activeNotes.set(60, 0.8)

	await instrument.chordRetrigger([{ noteNumber:60 }], 0.8)

	expect(voice.retrigger).toHaveBeenCalledWith(60, 0.8)
	expect(voice.noteOff).not.toHaveBeenCalled()
	expect(instrument.activeNotes.has(60)).toBe(true)
})

test.each([
	[EMOJI_FLUSHED, [60, 65, 67, 70]],
	[EMOJI_WAIL, [60, 63, 67, 71, 74]]
])('turns the detected facial expression %s into its emotional chord voicing', (playingEmoticon, expectedNotes) => {
	const person = {
		state:STATE_INSTRUMENT_ATTACK,
		playingEmoticon,
		options:{},
		noteVelocity:0.8,
		noteNumber:60,
		activeNotes:new Map()
	}
	const instrument = {
		type:INSTRUMENT_TYPE_CHORD,
		allNotesOff:jest.fn(),
		chordOn:jest.fn()
	}

	const output = updateInstrumentWithPerson(instrument, person)

	expect(output.map(note => note.noteNumber)).toEqual(expectedNotes)
	expect(instrument.chordOn).toHaveBeenCalledWith(output, 0.8)
})

test('uses the previous played chord to choose a smoother emotional alternative', () => {
	const previousChord = [{noteNumber:60}, {noteNumber:64}, {noteNumber:67}, {noteNumber:71}]
	const person = {
		state:STATE_INSTRUMENT_ATTACK,
		playingEmoticon:EMOJI_SMILING_SLIGHTLY,
		options:{},
		noteVelocity:0.8,
		noteNumber:60,
		lastNoteNumber:59,
		activeNotes:new Map([[59, previousChord]])
	}
	const instrument = {
		type:INSTRUMENT_TYPE_CHORD,
		allNotesOff:jest.fn(),
		chordOn:jest.fn()
	}

	const output = updateInstrumentWithPerson(instrument, person)

	expect(output.map(note => note.noteNumber)).toEqual([60, 64, 67])
})

test('arpeggio gate releases the sounding chord note before the next trigger', async () => {
	jest.useFakeTimers()
	const context = {
		createGain:jest.fn(() => ({
			disconnect:jest.fn()
		}))
	}
	const instrument = new ChordInstrument(context)
	const voice = {
		noteOn:jest.fn(),
		noteOff:jest.fn()
	}
	instrument.instruments = [voice]
	instrument.arpeggiate = true
	instrument.setArpeggioGate(120)

	await instrument.chordOn([{noteNumber:60}, {noteNumber:64}], 0.7)

	expect(voice.noteOn).toHaveBeenCalledWith(60, 0.7)
	expect(voice.noteOff).not.toHaveBeenCalled()

	jest.advanceTimersByTime(119)
	expect(voice.noteOff).not.toHaveBeenCalled()

	jest.advanceTimersByTime(1)
	expect(voice.noteOff).toHaveBeenCalledWith(60, 0.7)

	jest.useRealTimers()
})

test('configured arpeggio variation climbs through the chord over multiple octaves', async () => {
	const context = {
		createGain:jest.fn(() => ({
			disconnect:jest.fn()
		}))
	}
	const instrument = new ChordInstrument(context)
	const voice = {
		noteOn:jest.fn(),
		noteOff:jest.fn()
	}
	instrument.instruments = [voice]
	instrument.configureArpeggio({ octaveSpan:4, clockStep:3 })
	const chord = [{noteNumber:60}, {noteNumber:64}, {noteNumber:67}]

	await instrument.chordOn(chord, 0.8)
	await instrument.chordOn(chord, 0.8)
	await instrument.chordOn(chord, 0.8)
	await instrument.chordOn(chord, 0.8)

	expect(voice.noteOn.mock.calls.map(([noteNumber]) => noteNumber)).toEqual([60, 64, 67, 72])
	expect(instrument.getArpeggioSequence(chord)).toHaveLength(12)
})

test('single-note play mode uses the chord instrument as a monophonic voice', () => {
	const person = {
		state:STATE_INSTRUMENT_ATTACK,
		playingEmoticon:EMOJI_SMILING_SLIGHTLY,
		options:{},
		noteVelocity:0.8,
		noteNumber:60,
		lastNoteNumber:-1,
		activeNotes:new Map()
	}
	const instrument = {
		type:INSTRUMENT_TYPE_CHORD,
		playsChords:false,
		allNotesOff:jest.fn(),
		chordOn:jest.fn(),
		noteOn:jest.fn(),
		noteOff:jest.fn()
	}

	const output = updateInstrumentWithPerson(instrument, person)

	expect(output).toEqual([60])
	expect(instrument.noteOn).toHaveBeenCalledWith(60, 0.8)
	expect(instrument.chordOn).not.toHaveBeenCalled()
})
