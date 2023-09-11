/**
 * Having written this numerous times here are some
 * notes for next time around.
 * 
 * There are MORE MIDI notes than SAMPLES
 * so we have to restrict the octaves from 1-9 to 1-7
 * 
 */

import {clamp} from "../../maths/maths"
import { memoize } from "../../utils" 		// Memoize as much as possible

const NOTES_ALPHABETICAL = ["A","Ab","B","Bb","C","D", "Db","E", "Eb", "F", "G","Gb"]
const NOTES_ALPHABETICAL_FRIENDLY = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]

const NOTES_BLACK = ["Ab", "Bb", "Db", "Eb", "Gb"]
const NOTES_WHITE = ["A", "B", "C", "D", "E", "F", "G" ]
const NOTES_BLACK_INDEXES = NOTES_BLACK.length - 1
const NOTES_WHITE_INDEXES = NOTES_WHITE.length - 1
const NOTE_RANGE = NOTES_ALPHABETICAL.length

// renamed white notes
export const SOLFEGE_SCALE = ['Doe', 'Ray', 'Me', 'Far', 'Sew', 'La', 'Tea' ]

// '𝄞',
export const MUSICAL_NOTES = ['𝅗𝅥','𝅘𝅥','♫','𝅘𝅥𝅮','𝅘𝅥𝅯','𝅘𝅥𝅰','𝅘𝅥𝅱','𝅘𝅥𝅲']


// this is an object with the keys being the NOTE_NAMES
// MIDI conversion stuff
const NOTE_NAME_MAP = {}
const NOTE_FRIENDLY_NAME_MAP = {}

const MIDI_NOTE_NUMBER_MAP = []
const MIDI_NOTE_NUMBERS = []
const MIDI_NOTE_NAMES = []
const MIDI_NOTE_FRIENDLY_NAMES = []
const MIDI_NOTE_LETTERS = []

const MIDI_NOTE_FREQUENCIES = []
const GENERAL_MIDI_INSTRUMENTS = []


/**
 * Convert a MIDI Note Number into a frequency in hertz
 * @param {Number} note 
 * @returns {Number}
 */
export const noteNumberToFrequency = memoize((note) => {
	const c = (note - 69) / 12
	return 440 * c * c
})

/**
 * Convert a frequency in hertz into a noteNumber
 * @param {Number} frequency 
 * @returns {Number} NoteNumber
 */
const L = Math.log(2)
export const frequencyToNoteNumber = memoize((frequency) => {
	const log = Math.log(frequency / 440) / L
	return Math.round(12 * log + 69)
})




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

const friendly = note => {
	const {key, octave} = extractKeyAndOctave(note)
	// if (key === 0){
		note = note.replace( octave, `—${octave}` )
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
 * @param {Boolean} isMinor 
 * @returns A1 Ab1 etc
 */
export const getNoteName = (percent, octave=3, isMinor=false) => {

	// restrict to 1-7 even though 0 is available for many
	// octave = clamp(octave, 1, 7)
	let noteNumber
	let noteName
	
	if (isMinor)
	{
		noteNumber = Math.floor( percent * NOTES_BLACK_INDEXES )
		noteName = NOTES_BLACK[noteNumber]
	}else{
		noteNumber = Math.floor( percent * NOTES_WHITE_INDEXES )
		noteName = NOTES_WHITE[noteNumber]
	}

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
 * @param {*} isMinor 
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
 *
 * @name midi.note
 * @function
 * @param {Integer} midi - the midi number
 * @return {String} the pitch
 */
export const convertNoteNameToMIDINoteNumber = name => NOTE_NAME_MAP[name]

/**
 * 
 * @param {Number} noteNumber 
 * @returns 
 */
export const convertMIDINoteNumberToName = noteNumber => GENERAL_MIDI_INSTRUMENTS[noteNumber]


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

	const midiNoteName = `${key}${octave}`
	const friendlyName = friendly(midiNoteName)
	const frequency = noteNumberToFrequency(noteNumber)
	const notation = key.replace("b", "#")
	//console.log( noteNumber, "note", { midiNoteName, friendlyName, octave, key })

	MIDI_NOTE_LETTERS[noteNumber] = notation
	NOTE_FRIENDLY_NAME_MAP[midiNoteName] = friendlyName
	NOTE_NAME_MAP[midiNoteName] = noteNumber

	// MIDI_NOTE_NUMBERS[noteNumber] = midiNoteName
	MIDI_NOTE_NAMES[noteNumber] = midiNoteName
	MIDI_NOTE_FRIENDLY_NAMES[noteNumber] = friendlyName
	MIDI_NOTE_FREQUENCIES[noteNumber] = frequency

	// Here we create an array that holds all information in an object for each note number
	MIDI_NOTE_NUMBER_MAP[noteNumber] = {
		octave,
		key,
		frequency,
		notation,
		noteNumber:noteNumber,
		noteName:noteNumber,
		name:midiNoteName,
		title:friendlyName
	}
	// console.log(noteNumber, "Converting", {noteName, octave, key, midiNoteName, friendlyName })

	// // ensure that it exists in our super array...
	const hasSample = NOTE_NAMES.indexOf(midiNoteName) > -1
	GENERAL_MIDI_INSTRUMENTS[noteNumber] = hasSample ? 
		midiNoteName : 
		`UNKNOWN`
}



console.error({NOTE_NAMES, NOTE_NAMES_FRIENDLY, MIDI_NOTE_FREQUENCIES, MIDI_NOTE_NAMES, MIDI_NOTE_NUMBER_MAP, GENERAL_MIDI_INSTRUMENTS})

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
