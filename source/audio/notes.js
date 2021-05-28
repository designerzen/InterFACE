
import {clamp} from "../maths/maths"

export const BANKS = ["A","Ab","B","Bb","C","D", "Db","E", "Eb", "F", "G","Gb"]

export const NOTES_BLACK = ["Ab", "Bb", "Db", "Eb", "Gb"]
export const NOTES_WHITE = ["A","B","C","D","E","F", "G" ]
export const NOTES_BLACK_INDEXES = NOTES_BLACK.length - 1
export const NOTES_WHITE_INDEXES = NOTES_WHITE.length - 1

// renamed white notes
export const SOLFEGE_SCALE = ['Doe', 'Ray', 'Me', 'Far', 'Sew', 'La', 'Tea' ]

export const createInstrumentBanks = (fileTye="mp3", dot=".")=>{

	const bank = []
	for (let b=0; b<BANKS.length;++b)
	{
		const key = BANKS[b]
		// insert a 0 for A
		if (key==="A")
		{
			bank.push( `A0${dot}${fileTye}` )
		}
		for (let i=1; i<8; ++i)
		{
			bank.push( `${key}${i}${dot}${fileTye}` )
		}
		// add an extra one for C
		if (key==="C")
		{
			bank.push( `C8${dot}${fileTye}` )
		}
	}
	return bank
	
	// A0-7
	// Ab1-7
	// B0-7
	// Bb1-Bb7
	// C1-C8
	// D1-7
	// Db1-7
	// E1-7
	// Eb1-7
	// F1-7
	// G1-7
	// Gb1-7
}

export const NOTE_NAMES = createInstrumentBanks('','')

// this is an object with the keys being the NOTE_NAMES
export const NOTE_NAMES_FRIENDLY = {}

NOTE_NAMES.forEach( note => {
	// for each name we do a clever thing innit...
	NOTE_NAMES_FRIENDLY[note] = note
} )

// console.error({BANKS, NOTE_NAMES, NOTE_NAMES_FRIENDLY})

// return the relevent do re me fah so lat ti
 export const getNoteSound = (percent, isMinor=false) => {
	return SOLFEGE_SCALE[ Math.floor( percent * (SOLFEGE_SCALE.length-1) ) ]
 }

 export const getNoteText = noteName => {
	 const note = noteName.charAt(0)
	 let octave
	 // if we have 3 figures we swap out the 2nd one for a 
	 if (noteName.length === 3)
	 {
		octave = parseInt( noteName.charAt(2) ) + 1
		return `${note}#${octave}`
	 }
	 octave = parseInt( noteName.charAt(1) ) + 1
	 return `${note}${octave}`
 }

// octaves 1-7
// returns A1 Ab1 etc
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
