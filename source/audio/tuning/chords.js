/**
 * Most scales, except the blues scale, have seven steps, 
 * while pentatonic scales have five steps.
 */
import { createKey } from "./keys"
import { FREQUENCY_LIST, GENERAL_MIDI_INSTRUMENTS, MIDI_NOTE_NAMES, MIDI_NOTE_NUMBER_MAP } from "./notes"
import {
	MELODIC_MINOR_SCALE,
	MAJOR_SCALE,
	NATURAL_MINOR_SCALE,
	SCALES,
	SCALES_NAMES,
	TUNING_MODE_NAMES
} from "./scales"
import {
	AUGMENTED_CHORD_INTERVALS,
	CHORD_VOICING_INTERVAL_LIBRARY,
	DIMINISHED_CHORD_INTERVALS,
	DORIAN_CHORD_INTERVALS,
	FIFTHS_CHORD_INTERVALS,
	INTERVAL_SHIFTS,
	MAJOR_CHORD_INTERVALS,
	MINOR_CHORD_INTERVALS,
	SUSPENDED_CHORD_INTERVALS
} from "./intervals"

export {
	AUGMENTED_CHORD_INTERVALS,
	AUGMENTED_VOICING_INTERVALS,
	DIMINISHED_CHORD_INTERVALS,
	DIMINISHED_7_VOICING_INTERVALS,
	DIMINISHED_VOICING_INTERVALS,
	DORIAN_CHORD_INTERVALS,
	DOMINANT_7_VOICING_INTERVALS,
	DOMINANT_9_VOICING_INTERVALS,
	FIFTHS_CHORD_INTERVALS,
	HALF_DIMINISHED_VOICING_INTERVALS,
	MAJOR_CHORD_INTERVALS,
	MAJOR_6_VOICING_INTERVALS,
	MAJOR_7_VOICING_INTERVALS,
	MAJOR_9_VOICING_INTERVALS,
	MAJOR_VOICING_INTERVALS,
	MINOR_6TH_9_VOICING_INTERVALS,
	MINOR_6_VOICING_INTERVALS,
	MINOR_7_VOICING_INTERVALS,
	MINOR_9_VOICING_INTERVALS,
	MINOR_MAJOR_7_VOICING_INTERVALS,
	MINOR_CHORD_INTERVALS,
	MINOR_VOICING_INTERVALS,
	SIXTH_9_VOICING_INTERVALS,
	SUSPENDED_2_VOICING_INTERVALS,
	SUSPENDED_7_VOICING_INTERVALS,
	SUSPENDED_CHORD_INTERVALS,
	SUSPENDED_VOICING_INTERVALS
} from "./intervals"

export const CHORD_VOICINGS = CHORD_VOICING_INTERVAL_LIBRARY
export const CHORD_INTERVALS = [
	MAJOR_CHORD_INTERVALS,
	MINOR_CHORD_INTERVALS,
	SUSPENDED_CHORD_INTERVALS,
	DIMINISHED_CHORD_INTERVALS,
	AUGMENTED_CHORD_INTERVALS,
	DORIAN_CHORD_INTERVALS,
	FIFTHS_CHORD_INTERVALS
]

export const CHORD_INTERVALS_NAMES = [
	"major",
	"minor",
	"suspended",
	"diminished",
	"augmented",
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
 * @param {Number} rotation 
 * @param {Boolean} cutOff 
 * @param {Boolean} accumulate 
 * @returns {Array<Number>}
 */
export const createChord = (notes, scaleFormula=MAJOR_SCALE, offset=0, rotation=0, cutOff=true, accumulate=false) => {
	const quantityOfNotes = notes.length
	const quantityInScale = scaleFormula.length
	let accumulator = accumulate ? offset : 0
	let output = []

	for (let index=0; index<quantityInScale; ++index)
	{
		const noteIndex = scaleFormula[(index+rotation)%quantityInScale]
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

export const getChordVoicingForNoteNumber = (tonic, chordType="major") => {
	const intervals = CHORD_VOICINGS[chordType]
	if (!intervals)
	{
		throw Error(`Unknown chord voicing: ${chordType}`)
	}

	return intervals
		.map(interval => MIDI_NOTE_NUMBER_MAP[tonic + interval])
		.filter(Boolean)
}

// console.info("GENERAL_MIDI_INSTRUMENTS", GENERAL_MIDI_INSTRUMENTS)
// console.info("CHORDS_LIST", CHORDS_LIST)
// console.log("FREQUENCY_LIST", { FREQUENCY_LIST })



// console.log("GENERAL_MIDI_INSTRUMENTS", createKey( GENERAL_MIDI_INSTRUMENTS, MAJOR_SCALE, 0 ) )
// console.log("MIDI_NOTE_NAMES", createKey( MIDI_NOTE_NAMES, MAJOR_SCALE ) )
// console.log("MIDI_NOTE_NAMES", createKey( MIDI_NOTE_NAMES, MELODIC_MINOR_SCALE ) )

// const test = inversion()


let allChords = []

/**
 * Memo-ize all chords for a given note
 * Creates mode-specific scales and extracts chord notes from them
 * @param {Number} tonic 
 * @param {Number} scale - chord interval formula (e.g., [0,4,3] for major)
 * @param {Number} mode 
 */
export const createChordsForNoteNumber = (tonic, scale, mode) => {
	const exactChordType = scale === SUSPENDED_CHORD_INTERVALS ? "suspended" :
		(scale === DIMINISHED_CHORD_INTERVALS ? "diminished" :
			(scale === AUGMENTED_CHORD_INTERVALS ? "augmented" : null))
	if (exactChordType)
	{
		return getChordVoicingForNoteNumber(tonic, exactChordType)
	}

	//ensure that the mode is an index
	if (isNaN(mode))
	{
		const modeName = String(mode).toLowerCase()
		mode = modeName === "major" ? 0 : TUNING_MODE_NAMES.indexOf(modeName)
	}

	if ( mode === undefined || mode === -1)
	{
		throw Error("Could not find a mode with the name "+mode)
	}

	// Create mode-shifted scale by rotating the parent scale
	// Each mode is a rotation of the parent scale with octave adjustment
	const modeScale = []
	for (let i = 0; i < MAJOR_SCALE.length; i++)
	{
		const scaleIndex = (i + mode) % MAJOR_SCALE.length
		let interval = MAJOR_SCALE[scaleIndex]
		
		// If we wrapped around (index < mode), add an octave
		if (scaleIndex < mode)
		{
			interval += 12
		}
		
		modeScale.push(interval)
	}
	
	// Normalize: subtract the first interval so scale starts at 0
	const firstInterval = modeScale[0]
	const normalizedModeScale = modeScale.map(i => i - firstInterval)
	
	// Build the chord using the same accumulation logic but on the mode scale
	// The chord formula works by accumulating semitone intervals
	const output = []
	let accumulator = 0
	
	for (let index = 0; index < scale.length; index++)
	{
		// Accumulate the chord formula value
		accumulator += scale[index]
		
		// Find which note in the mode scale this corresponds to
		// We need to find the scale degree at or just below the accumulated value
		let selectedInterval = normalizedModeScale[0]
		for (let i = 0; i < normalizedModeScale.length; i++)
		{
			if (normalizedModeScale[i] <= accumulator)
			{
				selectedInterval = normalizedModeScale[i]
			}
		}
		
		const finalNote = tonic + selectedInterval
		output[index] = MIDI_NOTE_NUMBER_MAP[finalNote]
	}
	
	return output
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
export const createAllChordsInModes = () => {
	const output = []
	for (let noteNumber = 0, l=MIDI_NOTE_NUMBER_MAP.length; noteNumber < l; noteNumber++) 
	{
		const chordVariations = createAllChordsForNoteNumber(noteNumber)
		output[noteNumber] = chordVariations
		console.info(noteNumber, "Creating chordVariations for note", chordVariations )
	}
	return output
}

export const createAllChordsInScalesWithModes = createAllChordsInModes

// Must be run before requesting any data...
allChords = createAllChordsInModes()

// console.error("createAllChordsInScalesWithModes", allChords)
// const test = getChordsForNoteNumberInMode(64, "major")
// console.error("getChordsForNoteNumberInMode", test )
