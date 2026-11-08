import Instrument from '../source/audio/instruments/instrument.js'
import ChordInstrument from '../source/audio/instruments/chord.instrument.js'
import { getMusicalDetailsFromEmoji } from '../source/models/emoji-to-music.js'
import { updateInstrumentWithPerson } from '../source/audio/instrumentMediators/mediator.person-instrument.js'
import { STATE_INSTRUMENT_ATTACK, STATE_INSTRUMENT_SUSTAIN, STATE_INSTRUMENT_PITCH_BEND } from '../source/people/person-states.js'

const smiles = [
	['🙂', [60, 64, 67]],
	['😊', [60, 64, 69]],
	['😀', [60, 64, 71]],
	['😄', [60, 64, 69, 74]],
	['😃', [60, 64, 71, 74]],
	['😆', [60, 64, 74, 78]],
	['😁', [60, 64, 74, 78, 81]]
]

const node = () => ({connect:jest.fn(), disconnect:jest.fn(), gain:{value:1}})
const context = {createGain:node}
class Voice extends Instrument {
	get output(){ return this.mixer }
	async create(){ this.mixer = node(); return super.create() }
	clone(){ return new Voice(context) }
	noteOn = jest.fn(async (note, velocity) => {this.activeNotes.set(note, velocity)})
	noteOff = jest.fn(async note => {this.activeNotes.delete(note)})
}

test('every smile reaches the default audio voices with its own progressively wider harmony', async () => {
	const instrument = new ChordInstrument(context)
	await instrument.loaded
	await instrument.setInstrument(new Voice(context))
	expect(instrument.instruments).toHaveLength(5)
	let previousChord = []
	const soundingChords = []
	for (const [emoji, expected] of smiles) {
		await instrument.allNotesOff()
		const chord = getMusicalDetailsFromEmoji(60, emoji, true, {previousChord})
		expect(chord.map(note => note.noteNumber)).toEqual(expected)
		await instrument.chordOn(chord, 0.8)
		const sounding = [...new Set(instrument.instruments.flatMap(voice => [...voice.activeNotes.keys()]))].sort((a,b) => a-b)
		expect(sounding).toEqual(expected)
		soundingChords.push(sounding.join(','))
		previousChord = chord
	}
	expect(new Set(soundingChords).size).toBe(smiles.length)
	await instrument.allNotesOff()
	expect(instrument.instruments.every(voice => voice.activeNotes.size === 0)).toBe(true)
})

test.each([STATE_INSTRUMENT_SUSTAIN, STATE_INSTRUMENT_PITCH_BEND])('refreshes a held chord on an expression change in state %s', state => {
	const instrument = {type:'ChordInstrument', allNotesOff:jest.fn(), chordOn:jest.fn(), chordRetrigger:jest.fn()}
	const person = {state:STATE_INSTRUMENT_ATTACK, playingEmoticon:'🙂', noteNumber:60, noteVelocity:0.8, singing:true, options:{}, activeNotes:new Map()}
	updateInstrumentWithPerson(instrument, person)
	person.state = state
	person.playingEmoticon = '😁'
	const chord = updateInstrumentWithPerson(instrument, person)
	expect(chord.map(note => note.noteNumber)).toEqual(smiles.at(-1)[1])
	expect(instrument.chordOn).toHaveBeenCalledTimes(2)
	expect(person.activeNotes.get(60)).toBe(chord)
	updateInstrumentWithPerson(instrument, person)
	expect(instrument.chordOn).toHaveBeenCalledTimes(2)
	updateInstrumentWithPerson(instrument, person, true, true)
	expect(instrument.chordRetrigger).toHaveBeenCalledWith(chord, 0.8)
})

test('key-constrained smiles remain distinct while every sounding note stays in C major', () => {
	const allowed = new Set([0,2,4,5,7,9,11])
	const chords = smiles.map(([emoji]) => getMusicalDetailsFromEmoji(60, emoji, true, {harmonyMode:'global-key', tonic:'C', keyScale:'MAJOR_SCALE'}))
	expect(new Set(chords.map(chord => chord.map(note => note.noteNumber).join(','))).size).toBe(smiles.length)
	expect(chords.flat().every(note => allowed.has(note.noteNumber % 12))).toBe(true)
})
