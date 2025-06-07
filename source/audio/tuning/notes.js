/**
 * Having written this numerous times here are some
 * notes for next time around.
 * 
 * There are MORE MIDI notes than SAMPLES
 * so we have to restrict the octaves from 1-9 to 1-7
 * 
 */

import {clamp} from "../../maths/maths"
import { noteNumberToFrequency } from "./frequencies"
import { C_MAJOR, MAJOR_SCALE, SOLFEGE_SCALE, makeScaleMode, createScaleModeIntervalsFormula, SCALE_NAMES } from "./scales"

export const NOTES_ALPHABETICAL = ["Ab","A","Bb","B","C","Db", "D","Eb", "E", "F", "Gb","G"]
// export const NOTES_ALPHABETICAL = ["A","Ab","B","Bb","C","D", "Db","E", "Eb", "F", "G","Gb"]
export const NOTES_ALPHABETICAL_FRIENDLY = [ "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G"]

export const NOTES_BLACK = ["Ab", "Bb", "Db", "Eb", "Gb"]
export const NOTES_WHITE = ["A", "B", "C", "D", "E", "F", "G" ]

// Do re me fah sol...
const SOLFEGE_SOUNDS = SCALE_NAMES["solfege"]

const NOTES_BLACK_INDEXES = NOTES_BLACK.length - 1
const NOTES_WHITE_INDEXES = NOTES_WHITE.length - 1
const NOTE_RANGE = NOTES_ALPHABETICAL.length

const NOTATION_SHARP = "♯" // "#"
const NOTATION_FLAT = "♭"

// '𝄞',
export const MUSICAL_NOTES = ['𝅗𝅥','𝅘𝅥','♫','𝅘𝅥𝅮','𝅘𝅥𝅯','𝅘𝅥𝅰','𝅘𝅥𝅱','𝅘𝅥𝅲']

// this is an object with the keys being the NOTE_NAMES
// MIDI conversion stuff
const NOTE_NAME_MAP = {}
const NOTE_FRIENDLY_NAME_MAP = {}

export const MIDI_NOTE_NUMBER_MAP = []
export const MIDI_NOTE_NUMBERS = []
export const MIDI_NOTE_NAMES = []
export const MIDI_NOTE_FRIENDLY_NAMES = []
export const MIDI_NOTE_LETTERS = []

export const MIDI_NOTE_FREQUENCIES = []
export const GENERAL_MIDI_INSTRUMENTS = []

export const GENERAL_MIDI_BY_NAME = new Map()
export const GENERAL_MIDI_NUMBERS_BY_NAME = new Map()
export const FREQUENCY_BY_NAME = new Map()

export const FREQUENCY_LIST = new Map()




/**
 * returns a note name from an index and offset
 * @param {Number} index 
 * @param {Number} offset 
 * @returns {Number} noteNumber
 */
const getNoteFromBank = (index=0, offset=0) => {
	const rotation = index + offset
	return NOTES_ALPHABETICAL[ rotation < 0 ? NOTE_RANGE + rotation : rotation % NOTE_RANGE ]
}

/**
 * The instruments are all named the same way and this method
 * creates the data model
 * 
 * @param {String} fileType - audio file type (wav, ogg or mp3)
 * @param {String} dot - delimiter before file type
 * @returns {String} Array containing the following strings...
 * A0-7 / Ab1-7 / B0-7 / Bb1-Bb7 / C1-C8 / D1-7 / Db1-7 / E1-7 / Eb1-7 / F1-7 / G1-7 / Gb1-7
 */
export const createInstrumentBanks = (fileType="mp3", dot=".")=>{
	const bank = []
	for (let b=0; b<NOTES_ALPHABETICAL.length;++b)
	{
		const key = NOTES_ALPHABETICAL[b]
		
		if (key==="A")
		{
			bank.push( `A0${dot}${fileType}` )

		}else if (key==="B"){

			bank.push( `B0${dot}${fileType}` )
		}

		for (let i=1; i<8; ++i)
		{
			bank.push( `${key}${i}${dot}${fileType}` )
		}

		// add an extra one for C
		if (key==="C")
		{
			bank.push( `C8${dot}${fileType}` )
		}
	}
	return bank
}

const extractKeyAndOctave = note => {
	const key = note.charAt(0)
	const octave = parseInt( note.charAt( note.length - 1 ) ) // + 1
	return {
		key, octave
	}
}

const friendly = (note, seperator="—") => {
	const {key, octave} = extractKeyAndOctave(note)
	// if (key === 0){
		note = note.replace( octave, `${seperator}${octave}` )
	// }else{
		// note = note.replace( octave, `— -${octave}` )
	// }
	
	note = note.replace("b","#")
	return note
}

// FIXME: Need to expand into negative bands
// This is a A0-7 / Ab1-7 / B0-7 / Bb1-Bb7 / C1-C8 / D1-7 / Db1-7 / E1-7 / Eb1-7 / F1-7 / G1-7 / Gb1-7
export const NOTE_NAMES = createInstrumentBanks('','')

export const NOTE_NAMES_POPULAR_FIRST = [...NOTE_NAMES]



// export const getNoteText = noteName => {
// 	const note = noteName.charAt(0)
// 	let octave
// 	// if we have 3 figures we swap out the 2nd one for a 
// 	if (noteName.length === 3)
// 	{
// 		octave = parseInt( noteName.charAt(2) ) + 1
// 		return `${note}#${octave}`
// 	}
// 	octave = parseInt( noteName.charAt(1) ) + 1
// 	return `${note}${octave}`
// }


/**
 * what percentage of an octave results in
 * which musical notes
 * @param {Number} percent 
 * @param {Number} octave - octaves 1-7
 * @param {Boolean} facingLeft 
 * @returns A1 Ab1 etc
 */
export const getNoteName = (percent, octave=3, facingLeft=false, notesLeft=NOTES_BLACK, notesRight=NOTES_WHITE ) => {

	let noteNumber
	let noteName

	if (facingLeft)
	{
		noteNumber = Math.floor( percent * notesLeft.length )
		noteName = notesLeft[noteNumber]
	}else{
		noteNumber = Math.floor( percent * notesRight.length )
		noteName = notesRight[noteNumber]
	}

	console.info( "getNoteName", {percent, octave, facingLeft, noteNumber, noteName, notesLeft, notesRight} )

	// here is where we need to do our majic
	// const BANKS = ["A","Ab","B","Bb","C","D", "Db","E", "Eb", "F", "G","Gb"]
	// play a note from bank (this is the same for every octave?)
	// const noteNumber = Math.floor( percent * (BANKS.length-1) )
	
	// console.log("Creating note", {percent, octave, isMinor, noteNumber, noteName} )
	// const noteNumber = Math.floor( percent * (NOTE_NAMES.length-1) )
	// const noteNumber = Math.floor( percent * (NOTE_NAMES.length-1) )
	// const noteNumber = Math.floor( lipPercentage * (INSTRUMENT_NAMES.length-1) )
	// const noteName = NOTE_NAMES[noteNumber]

	// just in case the note name is not found?
	return `${noteName}${clamp(octave, 1, 7)}`
	// return noteName ? `${noteName}${clamp(octave, 1, 7)}` : `A0`
}


/**
 * return the relevent do re me fah so lat ti
 * @param {Number} percent 
 * @param {Boolean} isMinor 
 * @returns 
 */
export const getNoteSound = (percent, isMinor=false) => SOLFEGE_SCALE[ Math.floor( percent * (SOLFEGE_SCALE.length-1) ) ]

 
// Pass in A0 get out the equivalent friendly name
export const getFriendlyNoteName = noteName => NOTE_FRIENDLY_NAME_MAP[noteName] || noteName


/**
 * Get the note name (in scientific notation) of the given midi number
 *
 * It uses MIDI's [Tuning Standard](https://en.wikipedia.org/wiki/MIDI_Tuning_Standard)
 * where A4 is 69
 *
 * This method doesn't take into account diatonic spelling. Always the same
 * pitch class is given for the same midi number.

 * @param {Integer} midi - the midi number
 * @return {String} the pitch
 */
export const convertNoteNameToMIDINoteNumber = name => GENERAL_MIDI_NUMBERS_BY_NAME.get(name) ?? NOTE_NAME_MAP[name] ?? NOTE_FRIENDLY_NAME_MAP[name]

/**
 * 
 * @param {Number} noteNumber 
 * @returns 
 */
export const convertMIDINoteNumberToName = noteNumber => GENERAL_MIDI_INSTRUMENTS[noteNumber]


export const convertMIDINoteNumberToFrequency = midiNoteNumber => noteNumberToFrequency( midiNoteNumber )

// for each name we do a clever thing innit...
const NOTE_NAMES_FRIENDLY = NOTE_NAMES.map( note => friendly(note) )

// NB. We only have instruments for the GM Range so 
//		all MIDI numbers below 21 should be ignored really!
for(let noteNumber = 0; noteNumber < 127; noteNumber++) 
{
	// const noteName = NOTE_NAMES[noteNumber]
	const noteIndex = noteNumber % NOTE_RANGE
	// MIDI scale starts at octave = -1
	const octave = ((noteNumber / NOTE_RANGE) | 0) - 1

	// Determine which key it is from the number?
	const key = getNoteFromBank( noteIndex , 4)	

	const isFlat = key.indexOf("b") > -1
	const keyRoot = isFlat ? key.replace("b","") : key
	const note =  isFlat ? `${keyRoot}${NOTATION_FLAT}` : keyRoot
		
	// we use flats here
	const midiNoteName = `${key}${octave}`
	const midiNoteNameGap = `${key} ${octave}`
	const midiNoteNameFriendly = `${note}${octave}`
	const midiNoteNameFriendlyGap = `${note} ${octave}`
	// should these start at A or C?
	const sound = SOLFEGE_SOUNDS[(noteNumber)%SOLFEGE_SOUNDS.length]
	
	let alt = ""

	// Aflat, A, Bflat, B, C, Dflat, D, E, Fflat, F, Gflat, G	
	// C# s D flat
	// if we are flat, also create the sharp version
	if (isFlat)
	{	
		// Convert B flat to A sharp
		const sharpIndex = NOTES_WHITE.indexOf(keyRoot) - 1
		const sharp = NOTES_WHITE[ sharpIndex < 0 ? NOTES_WHITE.length - 1 : sharpIndex ]
		
		const sharpNotationPretty = `${sharp}${NOTATION_SHARP}${octave}`
		const sharpNotation = `${sharp}#${octave}`
		const sharpNotationGap = `${sharp} #${octave}`

		GENERAL_MIDI_NUMBERS_BY_NAME.set(sharpNotationPretty, noteNumber)	// C 1 42
		GENERAL_MIDI_NUMBERS_BY_NAME.set(sharpNotation, noteNumber)			// C 1 42
		GENERAL_MIDI_NUMBERS_BY_NAME.set(sharpNotationGap, noteNumber)			// C 1 42
		
		GENERAL_MIDI_NUMBERS_BY_NAME.set(sharpNotationPretty.toLowerCase(), noteNumber)	// C 1 42
		GENERAL_MIDI_NUMBERS_BY_NAME.set(sharpNotation.toLowerCase(), noteNumber)		// C 1 42
		GENERAL_MIDI_NUMBERS_BY_NAME.set(sharpNotationGap.toLowerCase(), noteNumber)		// C 1 42

		alt = sharpNotation
	}
	
	const friendlyName = friendly(midiNoteName, "")
	const seperatedFriendlyName = friendly(midiNoteName)
	const frequency = noteNumberToFrequency(noteNumber)
	// is sharp or flat
	const isAccidental = midiNoteName.includes("b")

	const midiObject =  {
		noteIndex,
		octave,
		key,
		frequency,
		notation: note,
		noteNumber:noteNumber,
		noteName:midiNoteName,
		name:midiNoteName,
		title:midiNoteName,
		alt,
		sound,
		accidental:isAccidental
	}
	
	GENERAL_MIDI_NUMBERS_BY_NAME.set(midiNoteName, noteNumber)		// C#1 42
	GENERAL_MIDI_NUMBERS_BY_NAME.set(midiNoteName.toLowerCase(), noteNumber)		// C#1 42
	
	GENERAL_MIDI_NUMBERS_BY_NAME.set(midiNoteNameGap, noteNumber)		// C#1 42
	GENERAL_MIDI_NUMBERS_BY_NAME.set(midiNoteNameGap.toLowerCase(), noteNumber)		// C#1 42
	
	GENERAL_MIDI_NUMBERS_BY_NAME.set(midiNoteNameFriendly, noteNumber)		// C#1 42
	GENERAL_MIDI_NUMBERS_BY_NAME.set(midiNoteNameFriendly.toLowerCase(), noteNumber)		// C#1 42

	// and for fun, in case somebody provides the wrong format
	GENERAL_MIDI_NUMBERS_BY_NAME.set(noteNumber, noteNumber)	// 42, 42
	GENERAL_MIDI_NUMBERS_BY_NAME.set(frequency, noteNumber)		// 232322.3, 42
	
	
	// save the object here
	GENERAL_MIDI_BY_NAME.set(noteNumber, midiObject )
	

	// SIMPLE frequencies list
	FREQUENCY_LIST.set(midiNoteName, frequency)

	//console.log( noteNumber, "note", { midiNoteName, friendlyName, octave, key })

	MIDI_NOTE_LETTERS[noteNumber] = note
	NOTE_FRIENDLY_NAME_MAP[midiNoteName] = friendlyName
	NOTE_NAME_MAP[midiNoteName] = noteNumber


	MIDI_NOTE_NUMBERS[noteNumber] = noteNumber
	MIDI_NOTE_NAMES[noteNumber] = midiNoteName
	MIDI_NOTE_FRIENDLY_NAMES[noteNumber] = friendlyName
	MIDI_NOTE_FREQUENCIES[noteNumber] = frequency

	// Here we create an array that holds all information in an object for each note number
	MIDI_NOTE_NUMBER_MAP[noteNumber] = midiObject

	// add to our super map - each points to same number
	// GENERAL_MIDI_NUMBERS_BY_NAME.set(friendlyName, noteNumber)		// D flat 42	
	// GENERAL_MIDI_NUMBERS_BY_NAME.set(midiNoteName, noteNumber)		// C#1 42
	
	
	
	
	//GENERAL_MIDI_NUMBERS_BY_NAME.set(notation, noteNumber)			// Cb1 42	
	// GENERAL_MIDI_NUMBERS_BY_NAME.set(friendlyName.toLowerCase(), noteNumber)	// c#1 42
	// GENERAL_MIDI_NUMBERS_BY_NAME.set(seperatedFriendlyName, noteNumber)	// c#-1 42
	
	// if (isFlat)
	// {	
	// 	// Convert B flat to A sharp
	// 	const sharpIndex = NOTES_WHITE.indexOf(key) -1
	// 	const sharp = NOTES_WHITE[ sharpIndex < 0 ?NOTES_WHITE.length - sharpIndex : sharpIndex ]
	// 	const notationPretty = `${sharp}${NOTATION_SHARP}${octave}`

	// 	// GENERAL_MIDI_NUMBERS_BY_NAME.set(notation, noteNumber)			// Cb1 42	
	// 	GENERAL_MIDI_NUMBERS_BY_NAME.set(notationPretty, noteNumber)	// C 1 42
	// 	// GENERAL_MIDI_NUMBERS_BY_NAME.set(notationPretty.toLowerCase(), noteNumber)	// c# 1 42
	// }

	// console.log(noteNumber, "Converting", {noteName, octave, key, midiNoteName, friendlyName })

	// // ensure that it exists in our super array...
	const hasSample = NOTE_NAMES.indexOf(midiNoteName) > -1
	GENERAL_MIDI_INSTRUMENTS[noteNumber] = hasSample ? 
		midiNoteName : 
		`UNKNOWN`
}

GENERAL_MIDI_NUMBERS_BY_NAME.forEach( (note, key) => {
	//
	const midiObject = GENERAL_MIDI_BY_NAME.get(note)
	const {frequency} = midiObject

	GENERAL_MIDI_BY_NAME.set( key, midiObject)

	FREQUENCY_BY_NAME.set(key, frequency)
	// detach
	FREQUENCY_BY_NAME.delete(frequency)
})

console.log("FREQUENCY_BY_NAME", {FREQUENCY_BY_NAME})
console.log("FREQUENCY_LIST", {FREQUENCY_LIST})
console.log("GENERAL_MIDI_BY_NAME", {GENERAL_MIDI_BY_NAME})

const musicalMode = makeScaleMode(C_MAJOR, 4)
const musicalModeFormula = createScaleModeIntervalsFormula(MAJOR_SCALE, 4)

console.info("PhotoSYNTH:NoteMap", {GENERAL_MIDI_MAP: GENERAL_MIDI_BY_NAME, GENERAL_MIDI_NUMBERS_BY_NAME})
console.info("PhotoSYNTH:Tuning", { 
	musicalMode, 
	musicalModeFormula}, 
	{
		NOTE_NAMES, 
		NOTE_NAMES_FRIENDLY, 
		MIDI_NOTE_FREQUENCIES, 
		MIDI_NOTE_NAMES, 
		MIDI_NOTE_NUMBER_MAP, 
		GENERAL_MIDI_INSTRUMENTS
	}
)

// MIDI_NOTE_NAMES.forEach( note => 
// 	console.error("convertNoteNameToMIDINoteNumber", note, convertNoteNameToMIDINoteNumber(note) , {NOTE_NAMES, NOTE_NAME_MAP, MIDI_NOTE_NAMES} ) 
// )

// console.error("NOTE_NAMES", NOTE_NAMES )
// console.error("NOTE_NAMES_FRIENDLY", NOTE_NAMES_FRIENDLY )

// console.error("MIDI_NOTE_NAMES", MIDI_NOTE_NAMES )

// // console.error("MIDI_NOTE_FREQUENCIES", MIDI_NOTE_FREQUENCIES )

// console.error("MIDI_NOTE_NUMBERS", MIDI_NOTE_NUMBERS )
// console.error("NOTE_FRIENDLY_NAME_MAP", NOTE_FRIENDLY_NAME_MAP )
// console.error("MIDI_NOTE_FRIENDLY_NAMES", MIDI_NOTE_FRIENDLY_NAMES )
// console.error("MIDI_NOTE_NUMBER_MAP", MIDI_NOTE_NUMBER_MAP )
// console.error("NOTE_NAME_MAP", NOTE_NAME_MAP  )
// console.error("MIDI", { NOTES_ALPHABETICAL, CHROMATIC, CONVERSION_NOTES, MIDI_NOTE_NUMBERS, MIDI_CONVERTOR })
// console.error({GENERAL_MIDI_INSTRUMENTS, NOTES_ALPHABETICAL, MIDI_NOTE_NUMBERS, MIDI_NOTE_NUMBER_MAP, NOTE_NAME_MAP, NOTE_NAMES,NOTE_FRIENDLY_NAME_MAP, NOTE_NAMES_FRIENDLY})
