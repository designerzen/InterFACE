import { NOTES_ALPHABETICAL } from "./notes"
import { 
	CHROMATIC_SCALE,
	MAJOR_SCALE, 
	NATURAL_MINOR_SCALE, 
	HARMONIC_MINOR_SCALE, 
	MELODIC_MINOR_SCALE,
	DORIAN_SCALE,
	PHRYGIAN_SCALE,
	LYDIAN_SCALE,
	MIXOLYDIAN_SCALE,
	LOCRIAN_SCALE,
	PENTATONIC_MAJOR_SCALE,
	PENTATONIC_MINOR_SCALE,
	BLUES_SCALE,
	WHOLE_TONE_SCALE,
	DIMINISHED_SCALE,
	AUGMENTED_SCALE,
	FIFTHS_SCALE,
	INTERVAL_LIBRARY
} from "./scales"

const PITCH_CLASS_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

const PITCH_CLASS_BY_NAME = new Map([
	["C", 0],
	["B#", 0],
	["C#", 1],
	["Db", 1],
	["D", 2],
	["D#", 3],
	["Eb", 3],
	["E", 4],
	["Fb", 4],
	["E#", 5],
	["F", 5],
	["F#", 6],
	["Gb", 6],
	["G", 7],
	["G#", 8],
	["Ab", 8],
	["A", 9],
	["A#", 10],
	["Bb", 10],
	["B", 11],
	["Cb", 11]
])

export const normaliseKeyName = (key=0) => {
	if (!isNaN(key))
	{
		return PITCH_CLASS_NAMES[((parseInt(key) % 12) + 12) % 12]
	}
	const match = String(key).match(/^([A-Ga-g](?:#|b)?)/)
	return match ? `${match[1].charAt(0).toUpperCase()}${match[1].slice(1)}` : "C"
}

export const getPitchClassForKey = (key=0) => {
	if (!isNaN(key))
	{
		return ((parseInt(key) % 12) + 12) % 12
	}
	return PITCH_CLASS_BY_NAME.get(normaliseKeyName(key)) ?? 0
}

export const getScaleFormula = (scale=MAJOR_SCALE) => {
	if (Array.isArray(scale))
	{
		return scale
	}
	const scaleName = String(scale || "MAJOR_SCALE").toUpperCase()
	return INTERVAL_LIBRARY[scaleName] ?? INTERVAL_LIBRARY[`${scaleName}_SCALE`] ?? MAJOR_SCALE
}

export const getKeyScaleNotes = (key=0, scale=MAJOR_SCALE) => {
	const root = getPitchClassForKey(key)
	const formula = getScaleFormula(scale)
	return formula.map(interval => PITCH_CLASS_NAMES[(root + interval) % PITCH_CLASS_NAMES.length])
}

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

// [ "Ab","A","Bb","B","C","Db", "D","Eb", "E", "F", "Gb","G"] 

export const SCALE_LIBRARY = new Map() 
Object.keys(INTERVAL_LIBRARY).forEach( value => {
	const scale = INTERVAL_LIBRARY[value]
	NOTES_ALPHABETICAL.forEach((note, i)=>{
		SCALE_LIBRARY.set( `${note} ${value.replace("_SCALE","")}`, createKeyFromNote( i, scale ) )
	})
})

// choose the pattern for playing if not using black / white keys
// each of these use a root node to specify the starting note
const root = 1 // [ "Ab","A","Bb","B","C","Db", "D","Eb", "E", "F", "Gb","G"]
export const MAJOR_SCALE_KEYS = createKeyFromNote( root, MAJOR_SCALE )
export const MINOR_SCALE_KEYS = createKeyFromNote( root, NATURAL_MINOR_SCALE )
export const CHROMATIC_SCALE_KEYS = createKeyFromNote( root, CHROMATIC_SCALE )
// export const FIFTHS_SCALE_KEYS = createKeyFromNote( mode, FIFTHS, 0, true )

export const HARM_MINOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, HARMONIC_MINOR_SCALE )
export const JAZZ_MINOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, MELODIC_MINOR_SCALE )

export const DORIAN_SCALE_KEYS = createKeyFromNote( root, DORIAN_SCALE )
export const PHRYGIAN_SCALE_KEYS = createKeyFromNote( root, PHRYGIAN_SCALE )
export const LYDIAN_SCALE_KEYS = createKeyFromNote( root, LYDIAN_SCALE )
export const MIXOLYDIAN_SCALE_KEYS = createKeyFromNote( root, MIXOLYDIAN_SCALE )
export const LOCRIAN_SCALE_KEYS = createKeyFromNote( root, LOCRIAN_SCALE )

export const PENTATONIC_MAJOR_SCALE_KEYS = createKeyFromNote( root, PENTATONIC_MAJOR_SCALE )
export const PENTATONIC_MINOR_SCALE_KEYS = createKeyFromNote( root, PENTATONIC_MINOR_SCALE )
export const BLUES_SCALE_KEYS = createKeyFromNote( root, BLUES_SCALE )
export const WHOLE_TONE_SCALE_KEYS = createKeyFromNote( root, WHOLE_TONE_SCALE )
export const DIMINISHED_SCALE_KEYS = createKeyFromNote( root, DIMINISHED_SCALE )
export const AUGMENTED_SCALE_KEYS = createKeyFromNote( root, AUGMENTED_SCALE )

// FIXME: the following should output [ "F", "C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#"] if it doesn't alter the arguments until it does
export const FIFTHS_SCALE_KEYS = createKeyFromNote( 0, FIFTHS_SCALE )

// export const MAJOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, MAJOR_SCALE, 0, mode, false )
// export const MINOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, MINOR_SCALE, 0, mode, false )
// export const HARM_MINOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, HARM_MINOR_SCALE, 0, mode, false )
// export const JAZZ_MINOR_SCALE_KEYS = createKey( NOTES_ALPHABETICAL, JAZZ_MEL_MINOR, 0, mode, false )

// console.info("Keys in scale", {MINOR_SCALE_KEYS,MAJOR_SCALE_KEYS,HARM_MINOR_SCALE_KEYS, JAZZ_MINOR_SCALE_KEYS, FIFTHS_SCALE_KEYS } )
// console.info("FIFTHS_SCALE_KEYS", {FIFTHS_SCALE_KEYS } )
