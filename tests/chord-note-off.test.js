import ChordInstrument from '../source/audio/instruments/chord.instrument.js'

const node = () => ({connect:jest.fn(),disconnect:jest.fn(),gain:{value:1}})
const setup = async () => {
	const chord = new ChordInstrument({createGain:node})
	await chord.loaded
	const voices = Array.from({length:3},() => {
		const activeNotes = new Map()
		return {activeNotes,output:node(),allNotesOff:jest.fn(),destroy:jest.fn(),
			noteOn:jest.fn(async note => activeNotes.set(note,1)),
			noteOff:jest.fn(async note => activeNotes.delete(note))}
	})
	await chord.setInstruments(voices)
	return {chord,voices}
}

test.each([[60],[60,64],[60,64,67]])('releases every chord voice by note number for %j',async (...notes) => {
	const {chord,voices} = await setup()
	const details = notes.map(noteNumber => ({noteNumber}))
	await chord.chordOn(details,0.8)
	await chord.chordOff([...details].reverse())
	expect(voices.map(voice=>voice.activeNotes.size)).toEqual([0,0,0])
	expect(chord.activeNotes.size).toBe(0)
})

test('a note-off without a voice index finds matching notes in all chord voices',async () => {
	const {chord,voices} = await setup()
	await chord.chordOn([60,64,67].map(noteNumber=>({noteNumber})),0.8)
	await chord.noteOff(64)
	expect(voices.map(voice=>[...voice.activeNotes.keys()])).toEqual([[60],[],[67]])
	expect(chord.activeNotes.has(60)).toBe(true)
	expect(chord.activeNotes.has(64)).toBe(false)
})

test('a targeted release preserves the same note held by another voice',async () => {
	const {chord,voices} = await setup()
	await chord.chordOn([{noteNumber:60}],0.8)
	await chord.noteOff(60,0,1)
	expect(voices.map(voice=>voice.activeNotes.size)).toEqual([1,0,1])
	expect(chord.activeNotes.has(60)).toBe(true)
	await chord.allNotesOff()
	expect(voices.map(voice=>voice.activeNotes.size)).toEqual([0,0,0])
})
