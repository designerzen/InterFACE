import { NOTES_ALPHABETICAL } from "./notes"
import { 
	MAJOR_SCALE, 
	NATURAL_MINOR_SCALE, 
	HARMONIC_MINOR_SCALE, 
	MELODIC_MINOR_SCALE 
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
const mode = 4	// C, "Ab","A","Bb","B","C","Db", "D","Eb", "E", "F", "Gb","G"]
export const MAJOR_SCALE_KEYS = createKeyFromNote( mode, MAJOR_SCALE )
export const MINOR_SCALE_KEYS = createKeyFromNote( mode, NATURAL_MINOR_SCALE )

// FIXME:
export const HARM_MINOR_SCALE_KEYS = createKey(  mode, HARMONIC_MINOR_SCALE )
export const JAZZ_MINOR_SCALE_KEYS = createKey(  mode, MELODIC_MINOR_SCALE )

// export const MAJOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, MAJOR_SCALE, 0, mode, false )
// export const MINOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, MINOR_SCALE, 0, mode, false )
// export const HARM_MINOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, HARM_MINOR_SCALE, 0, mode, false )
// export const JAZZ_MINOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, JAZZ_MEL_MINOR, 0, mode, false )



console.info("Keys in scale", {MINOR_SCALE_KEYS,MAJOR_SCALE_KEYS,HARM_MINOR_SCALE_KEYS, JAZZ_MINOR_SCALE_KEYS } )