/**
 * Most scales, except the blues scale, have seven steps, 
 * while pentatonic scales have five steps.
 */
import { createKey } from "./keys"
import { FREQUENCY_LIST, GENERAL_MIDI_INSTRUMENTS, MIDI_NOTE_NAMES, MIDI_NOTE_NUMBER_MAP } from "./notes"
import { MELODIC_MINOR_SCALE, MAJOR_SCALE, NATURAL_MINOR_SCALE, SCALES, SCALES_NAMES, TUNING_MODE_NAMES } from "./scales"

// Shifted intervals...
// To go from any specific note to any other specific note
const INTERVAL_SHIFTS = {
	downOctave: -12,
	minorSecond: 1,
	majorSecond: 2,
	minorThird: 3,
	majorThird: 4,
	perfectFourth: 5,
	diminishedFifth: 6,
	perfectFifth: 7,
	minorSixth: 8,
	majorSixth: 9,
	minorSeventh: 10,
	majorSeventh: 11,
	perfectOctave: 12,
	upOctave: 12
}

// let majorText = ["C", "G", "D", "A", "E", "Cb/B", "Gb/F#", "Db/C#", "Ab", "Eb", "Bb", "F"]
// let minorText = ["Am", "Em", "Bm", "F#m", "C#m", "Abm/G#m", "Ebm/D#m", "Bbm/A#m", "Fm", "Cm", "Gm", "Dm"]
// export const pentatonicNotesNumber = 5

/*
  
  export const scalePatterns: Record<Scale, ScalePattern> = {
	major: [2, 2, 1, 2, 2, 2, 1],
	minor: [2, 1, 2, 2, 1, 2, 2],
	blues: [3, 2, 1, 1, 3, 2],
	dorian: [2, 1, 2, 2, 2, 1, 2],
	mixolydian: [2, 2, 1, 2, 2, 1, 2],
	phrygian: [1, 2, 2, 2, 1, 2, 2],
	["harmonic-minor"]: [2, 1, 2, 2, 1, 3, 1],
	["melodic-minor"]: [2, 1, 2, 2, 2, 2, 1],
  }
  
  export const pentatonicPatterns: Record<Scale, ScalePattern> = {
	major: [2, 2, 3, 2, 3],
	minor: [3, 2, 2, 3, 2],
	blues: [3, 2, 1, 3, 2],
	dorian: [2, 3, 2, 2, 3],
	mixolydian: [2, 2, 3, 2, 3],
	phrygian: [1, 3, 2, 3, 2],
	["harmonic-minor"]: [2, 1, 3, 2, 3],
	["melodic-minor"]: [2, 3, 2, 2, 3],
  }
  
  
   aeolian: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
  blues: ['P1', 'm3', 'P4', 'd5', 'P5', 'm7'],
  chromatic: ['P1', 'm2', 'M2', 'm3', 'M3', 'P4',
    'A4', 'P5', 'm6', 'M6', 'm7', 'M7'],
  dorian: ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'],
  doubleharmonic: ['P1', 'm2', 'M3', 'P4', 'P5', 'm6', 'M7'],
  harmonicminor: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'M7'],
  ionian: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
  locrian: ['P1', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7'],
  lydian: ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'],
  majorpentatonic: ['P1', 'M2', 'M3', 'P5', 'M6'],
  melodicminor: ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'M7'],
  minorpentatonic: ['P1', 'm3', 'P4', 'P5', 'm7'],
  mixolydian: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'],
  phrygian: ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'],
  wholetone: ['P1', 'M2', 'M3', 'A4', 'A5', 'A6']
*/

// minorpentatonic: ['P1', 'm3', 'P4', 'P5', 'm7'],

// export const Major: ReadonlyArray<int> = [0, 2, 4, 5, 7, 9, 11]
// export const Minor: ReadonlyArray<int> = [0, 2, 3, 5, 7, 8, 10]

/**
 * Intervals: 1, 2, 3, 4, 5, 6, 7
 * Semitones: 2 - 2 - 1 - 2 - 2 - 2 - 1
 * Formula: Whole, Whole, Half, Whole, Whole, Whole, Half
 * [0,2,4,5,7,9,11]
 * 
 * The Major Chord is the most common chord. 
 * Start with any note. This is the first note in the chord.
 * For the second note, count up four notes.
 * For the third note, count up three more notes.
 * The chord is named after the first note.
 */
export const MAJOR_CHORD_INTERVALS = [0,4,3]

/**
 * Intervals: 1, 2, b3, 4, 5, b6, b7
 * Semitones: 2 - 1 - 2 - 2 - 1 - 2 - 2
 * Formula: Whole, Half, Whole, Whole, Half, Whole, Whole
 * 
 * 
 * The Minor Chord is similar to the Major Chord except that the second note is one lower:
 * Start with any note. This is the first note in the chord.
 * For the second note, count up three notes.
 * For the third note, count up four more notes.
 * The chord is named after the first note.
 */
export const MINOR_CHORD_INTERVALS = [0,3,4]

/**
 * FIXME: 
 * Intervals: 1, 2, b3, 4, 5, 6, b7
 * Semitones: 2 - 1 - 2 - 2 - 2 - 1 - 2
 * Formula: Whole, Half, Whole, Whole, Whole, Half, Whole
 * 
 */
export const DORIAN_CHORD_INTERVALS = [0,2,3,5]

export const FIFTHS_CHORD_INTERVALS = [0,5,5,5,5,5]

export const CHORD_INTERVALS = [
	MAJOR_CHORD_INTERVALS,
	MINOR_CHORD_INTERVALS,
	DORIAN_CHORD_INTERVALS,
	FIFTHS_CHORD_INTERVALS
]

export const CHORD_INTERVALS_NAMES = [
	"major",
	"minor",
	"dorian",
	"fifths"
]

// TUNING_MODE_NAMES.slice(0,CHORD_INTERVALS.length)


//  -> Chromatic
export const rrrola = n => {
	n * 12 / 7
}

export const CHORDS_LIST = {
	// A: [notes.A4, notes.Db5, notes.E5],
	// AB: [notes.Ab4, notes.C5, notes.Eb5],
	// AM: [notes.A4, notes.C5, notes.E5],

	// B: [notes.B4, notes.Eb5, notes.Gb5],
	// BM: [notes.B4, notes.D5, notes.Gb5],

	// BB: [notes.Bb4, notes.D5, notes.F5],
	// BBM: [notes.Bb4, notes.Db5, notes.F5],

	// C: [notes.C4, notes.E4, notes.G4],
	// CM: [notes.C4, notes.Eb4, notes.G4],
	// CSM: [notes.Db4, notes.E4, notes.Ab4],

	// D: [notes.D4, notes.Gb4, notes.A4],
	// DB: [notes.Db4, notes.F4, notes.Ab4],
	// DM: [notes.D4, notes.F4, notes.A4],
	// DSM: [notes.Eb4, notes.Gb4, notes.Bb4],

	// E: [notes.E4, notes.Ab4, notes.B4],
	// EB: [notes.Eb4, notes.G4, notes.Bb4],
	// EM: [notes.E4, notes.G4, notes.B4],

	// F: [notes.F4, notes.A4, notes.C5],
	// FM: [notes.F4, notes.Ab4, notes.C5],
	// FSM: [notes.Gb4, notes.A4, notes.Db5],

	// G: [notes.G4, notes.B4, notes.D5],
	// GB: [notes.Gb4, notes.Bb4, notes.Db5],
	// GM: [notes.G4, notes.Bb4, notes.D5],
	// GSM: [notes.Ab4, notes.B4, notes.Eb5]
}



/**
  * Creates an inversion of the chord dictated by the number of steps. One
  * step will only invert the lowest note (first inversion). Two steps will
  * invert the bottom two notes etc. It's also possible to supply a negative
  * number, this will start the inversion from the top (highest) note.
  *
  * @param steps which inversion, 1 = first, 2 = second, etc
  */
export const inversion = (steps) => {
	const length = this.notes.length - 1
	for (let counter = 0; counter < Math.abs(steps) && counter < length; ++counter) 
	{
		const index = steps > 0 ? counter : length - counter
		this.notes[index] = this.notes[index].interval(Math.sign(steps) * 12)
	}
}


/**
 * Export a chord from a root note and a scale
 * 
 * @param {Array} notes 
 * @param {Array} scaleFormula 
 * @param {Number} offset 
 * @param {Number} mode 
 * @param {Boolean} cutOff 
 * @param {Boolean} accumulate 
 * @returns {Array<Number>}
 */
export const createChord = (notes, scaleFormula=MAJOR_SCALE, offset=0, mode=0, cutOff=true, accumulate=false) => {
	const quantityOfNotes = notes.length
	const quantityInScale = scaleFormula.length
	let accumulator = accumulate ? offset : 0
	let output = []

	for (let index=0; index<quantityInScale; ++index)
	{
		const noteIndex = scaleFormula[(index+mode)%quantityInScale]
		if (accumulate)
		{
			accumulator += noteIndex
		}else{
			accumulator = noteIndex
		}
		
		if (cutOff && accumulator > quantityOfNotes)
		{
			// ignore
		}else{
			output[index] = notes[accumulator%quantityOfNotes]
		}
	}
	return output
}


export const createMajorChord =( notes, offset=0, mode=0 )=> createChord( notes, MAJOR_CHORD_INTERVALS, offset, mode, true, true )
export const createMinorChord =( notes, offset=0, mode=0 )=> createChord( notes, MINOR_CHORD_INTERVALS, offset, mode, true, true )
export const createJazzChord =( notes, offset=0, mode=0 )=> createChord( notes, MELODIC_MINOR_SCALE, offset, mode, true, false )

// console.info("GENERAL_MIDI_INSTRUMENTS", GENERAL_MIDI_INSTRUMENTS)
// console.info("CHORDS_LIST", CHORDS_LIST)
// console.log("FREQUENCY_LIST", { FREQUENCY_LIST })



// console.log("GENERAL_MIDI_INSTRUMENTS", createKey( GENERAL_MIDI_INSTRUMENTS, MAJOR_SCALE, 0 ) )
// console.log("MIDI_NOTE_NAMES", createKey( MIDI_NOTE_NAMES, MAJOR_SCALE ) )
// console.log("MIDI_NOTE_NAMES", createKey( MIDI_NOTE_NAMES, MELODIC_MINOR_SCALE ) )

// const test = inversion()

MIDI_NOTE_NAMES.forEach( note => {
	// console.log("convertNoteNameToMIDINoteNumber", note, convertNoteNameToMIDINoteNumber(note) ) 
})


// Create all the chords for each note number...
MIDI_NOTE_NUMBER_MAP.forEach( (note, index) => {

	const chord = ''
	// console.log( index, "MIDI_NOTE_NUMBER_MAP", {note, chord} ) 
})


let allChords = []

/**
 * Memo-ize all chords for a given note
 * @param {Number} tonic 
 * @param {Number} scale 
 * @param {Number} mode 
 */
export const createChordsForNoteNumber = (tonic, scale, mode) => {
	//ensure that the mode is an index
	if (isNaN(mode))
	{
		mode = TUNING_MODE_NAMES.indexOf(mode)
	}

	if ( mode === undefined || mode === -1)
	{
		throw Error("Could not find a mode with the name "+mode)
	}
	// Loop through each scale type and mode
	return createChord( MIDI_NOTE_NUMBER_MAP, scale, tonic, mode, false, true )
}

/**
 * 
 * @param {Number} noteNumber 
 * @returns {Map} of scales and modes
 */
export const createAllChordsForNoteNumber = (noteNumber=0) => {
	const noteData = MIDI_NOTE_NUMBER_MAP[noteNumber]
	const noteMap = new Map()
	CHORD_INTERVALS.forEach((scaleFormula, scaleIndex) => {
		const scaleName = CHORD_INTERVALS_NAMES[scaleIndex]
		const modeMap = new Map() 
		TUNING_MODE_NAMES.forEach((modeName, modeIndex) => {
			const chords = createChordsForNoteNumber(noteNumber, scaleFormula, modeIndex )
			modeMap.set(modeName, chords)
			modeMap.set(modeIndex, chords)
			// console.info(modeIndex, "Creating chords for note", noteNumber, {noteData}, "in scale", scaleName, "mode", modeName, chords)
		})
		noteMap.set(scaleName, modeMap)
		noteMap.set(scaleIndex, modeMap)
	})
	
	return noteMap
}



export const getAllChordsForNoteNumber = (noteNumber=0) => {
	return allChords[noteNumber]
}

// getChordsForNoteNumberInMode(64, "MAJOR")



/**
 * So now we can specify a note number, scale and mode
 * to immediately get the precalculated chord for that note
 * 
 * @param {Number} noteNumber 
 * @param {Number|String} scaleName 
 * @returns {Array<Object>}
 */
export const getChordsForNoteNumberInScale = (noteNumber=0, scaleName=TUNING_MODE_NAMES[0]) => {
	const notesWithChords = allChords[noteNumber]
	return notesWithChords ? notesWithChords.get(scaleName) : null
}

/**
 * So now we can specify a note number, scale and mode
 * to immediately get the precalculated chord for that note

 * @param {Number} noteNumber 
 * @param {String|Number} scaleName 
 * @param {String|Number} modeName 
 * @returns {Array<Object>}
 */
export const getChordsForNoteNumberInMode = (noteNumber=0, scaleName=TUNING_MODE_NAMES[0], modeName=TUNING_MODE_NAMES[0]) => {
	const notesInScale = getChordsForNoteNumberInScale(noteNumber, scaleName)
	return notesInScale ? notesInScale.get(modeName) : null
}

/**
 * 
 * @returns {Array<Number>}
 */
export const createAllChordsInScalesWithModes = () => {
	const output = []
	for (let noteNumber = 0, l=MIDI_NOTE_NUMBER_MAP.length; noteNumber < l; noteNumber++) 
	{
		const chordVariations = createAllChordsForNoteNumber(noteNumber)
		output[noteNumber] = chordVariations
		console.info(noteNumber, "Creating chordVariations for note", chordVariations )
	}
	return output
}

// Must be run before requesting any data...
allChords = createAllChordsInScalesWithModes()

// console.error("createAllChordsInScalesWithModes", allChords)
// const test = getChordsForNoteNumberInMode(64, "major")
// console.error("getChordsForNoteNumberInMode", test )