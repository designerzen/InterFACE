import { NOTES_ALPHABETICAL } from "./notes"
import { 
	MAJOR_SCALE, 
	NATURAL_MINOR_SCALE, 
	HARMONIC_MINOR_SCALE, 
	MELODIC_MINOR_SCALE,
	FIFTHS
} from "./scales"

export const createKey = (notes, scale=MAJOR_SCALE, offset=0, mode=0, cutOff=true, accumulate=false) => {
	const quantityOfNotes = notes.length
	const quantityInScale = scale.length
	let accumulator = accumulate ? offset : 0
	let output = []
	for (let index=0; index<quantityOfNotes; ++index)
	{
		const noteIndex = scale[(index+mode)%quantityInScale]
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

export const createKeyFromNote = ( mode, scale, offset=0, accumulate=false) => createKey( NOTES_ALPHABETICAL, scale, offset, mode, false, accumulate )

// choose the pattern for playing if not using black / white keys
// each of these use a root node to specify the starting note
const mode = 1 // [ "Ab","A","Bb","B","C","Db", "D","Eb", "E", "F", "Gb","G"]
export const MAJOR_SCALE_KEYS = createKeyFromNote( mode, MAJOR_SCALE )
export const MINOR_SCALE_KEYS = createKeyFromNote( mode, NATURAL_MINOR_SCALE )
// export const FIFTHS_SCALE_KEYS = createKeyFromNote( mode, FIFTHS, 0, true )

// FIXME:

const keyNames = [ "Ab","A","Bb","B","C","Db", "D","Eb", "E", "F", "Gb","G"]
export const HARM_MINOR_SCALE_KEYS = createKey( keyNames, HARMONIC_MINOR_SCALE )
export const JAZZ_MINOR_SCALE_KEYS = createKey( keyNames, MELODIC_MINOR_SCALE )
// C G D A E B C Gb D Ab Eb Bb F
export const FIFTHS_SCALE_KEYS = createKey( keyNames, FIFTHS, 4, 0, false, true )

// export const MAJOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, MAJOR_SCALE, 0, mode, false )
// export const MINOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, MINOR_SCALE, 0, mode, false )
// export const HARM_MINOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, HARM_MINOR_SCALE, 0, mode, false )
// export const JAZZ_MINOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, JAZZ_MEL_MINOR, 0, mode, false )



console.info("Keys in scale", {MINOR_SCALE_KEYS,MAJOR_SCALE_KEYS,HARM_MINOR_SCALE_KEYS, JAZZ_MINOR_SCALE_KEYS, FIFTHS_SCALE_KEYS } )
console.info("FIFTHS_SCALE_KEYS", {FIFTHS_SCALE_KEYS } )