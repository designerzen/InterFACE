import ChordInstrument from '../source/audio/instruments/chord.instrument.js'
import EngineInstrument from '../source/audio/instruments/instrument.engine.js'
import VoiceEngineHost from '../source/audio/voice-engine-host.js'
import { getVoicesPerPerson, VOICE_ENGINE_PARTS } from '../source/audio/voice-engine-options.js'

const createNode = () => ({gain:{value:1}, connect:jest.fn(), disconnect:jest.fn()})
const createContext = (state='running') => ({currentTime:0, state, createGain:createNode, resume:jest.fn(async () => {})})
const CHORD = [{noteNumber:57},{noteNumber:60},{noteNumber:64}]

const createRig = async (context=createContext()) => {
	const sounding = new Map()
	const backend = {
		attach:async () => {}, detach:async () => {}, destroy:async () => {}, program:async () => {},
		panic:() => {}, resume:jest.fn(),
		noteOn:(handle, note) => { sounding.set(handle, new Set(sounding.get(handle)).add(note)) },
		noteOff:async (handle, note) => { sounding.get(handle)?.delete(note) }
	}
	const host = new VoiceEngineHost(context, {createBackend:async () => backend})
	const voices = Array.from({length:5}, () => new EngineInstrument(context, {voiceEngineHost:host}))
	await Promise.all(voices.map(voice => voice.loaded))
	const chord = new ChordInstrument(context)
	await chord.loaded
	await chord.setInstruments(voices)
	return {chord, voices, backend, soundingNotes:() => [...sounding.values()].flatMap(notes => [...notes]).sort()}
}

test('replaying a held chord without waiting keeps every note sounding', async () => {
	const {chord, soundingNotes} = await createRig()
	await chord.chordOn(CHORD, 1)
	// The person mediator calls these back to back when refreshing a held chord.
	const released = chord.allNotesOff()
	const started = chord.chordOn(CHORD, 1)
	await Promise.all([released, started])
	await new Promise(resolve => setTimeout(resolve))
	expect(new Set(soundingNotes())).toEqual(new Set([57,60,64]))
	expect([...chord.activeNotes.keys()].sort()).toEqual([57,60,64])
})

test('a new chord sharing notes with the held chord keeps the shared notes', async () => {
	const {chord, soundingNotes} = await createRig()
	await chord.chordOn(CHORD, 1)
	const released = chord.allNotesOff()
	const started = chord.chordOn([{noteNumber:57},{noteNumber:61},{noteNumber:64}], 1)
	await Promise.all([released, started])
	await new Promise(resolve => setTimeout(resolve))
	expect(new Set(soundingNotes())).toEqual(new Set([57,61,64]))
})

test('voices wake a suspended context and any context the backend owns', async () => {
	const context = createContext('suspended')
	const {chord, backend} = await createRig(context)
	await chord.chordOn(CHORD, 1)
	expect(context.resume).toHaveBeenCalled()
	expect(backend.resume).toHaveBeenCalled()
})

test('reloadPreset reaches every chord voice and keeps the chord active', async () => {
	const {chord, voices} = await createRig()
	const spies = voices.map(voice => jest.spyOn(voice, 'reloadPreset'))
	await expect(chord.reloadPreset()).resolves.toBe(chord)
	spies.forEach(spy => expect(spy).toHaveBeenCalledTimes(1))
})

test('next-preset results can name the chord instrument for the Person', async () => {
	const {chord} = await createRig()
	await chord.loadNextPreset()
	expect(chord.instrumentName).toBe(chord.instruments[0].activePreset)
	expect(chord.instrumentName).toBeTruthy()
})

test('every Person fits in the smallest shared renderer', () => {
	for (let players = 1; players <= 8; players++)
	{
		const voices = getVoicesPerPerson(players, 5)
		expect(voices).toBeGreaterThanOrEqual(1)
		expect(voices).toBeLessThanOrEqual(5)
		expect(voices*players).toBeLessThanOrEqual(VOICE_ENGINE_PARTS-1)
	}
	expect(getVoicesPerPerson(1, 5)).toBe(5)
	expect(getVoicesPerPerson(3, 5)).toBe(5)
	expect(getVoicesPerPerson(4, 5)).toBe(3)
})
