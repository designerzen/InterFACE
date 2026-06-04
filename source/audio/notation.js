
export const CLEFF_TREBLE = "𝄞"
export const CLEFF_MAIN = "𝄡"
export const CLEFF_BASS = "𝄢"
export const STAVE = "𝄚"

export const NOTATION = [
	"𝅗",
	"𝅘𝅥",
	"𝅘𝅥𝅯",
	"𝅘𝅥𝅱"
]

export const STAFF_LINE_COUNT = 5
export const STAFF_NOTE_SLOTS = 9

const positiveModulo = (value, modulo) => ((value % modulo) + modulo) % modulo
const finiteOrZero = value => Number.isFinite(value) ? value : 0

export const getStave = (noteCount=1) => {
	const staveLength = Math.max(STAFF_LINE_COUNT, Math.ceil(finiteOrZero(noteCount)) + 1)
	return STAVE.repeat(staveLength)
}

export const getNotationForNoteNumber = (noteNumber=0) => {
	return NOTATION[positiveModulo(finiteOrZero(noteNumber), NOTATION.length)]
}

export const getStaffSlotForNoteNumber = (noteNumber=0) => {
	const pitchClass = positiveModulo(finiteOrZero(noteNumber), 12)
	return Math.round((pitchClass / 11) * (STAFF_NOTE_SLOTS - 1))
}


export const midiToNotation = () => {
	
}



export const STAVE_SIZES = [
	STAVE,
	STAVE + STAVE,
	STAVE + STAVE + STAVE,
	STAVE + STAVE + STAVE + STAVE,
	STAVE + STAVE + STAVE + STAVE + STAVE,
]

export const getCleff = (octave) => {
	switch(octave) {	
		case 0:
		case 1:
		case 2:
		// case 3:
			return CLEFF_BASS
		
		case 6:
		case 7:
		case 8:
			return CLEFF_TREBLE
		
		default:
			return CLEFF_MAIN
	}
}

// so to draw a bar
// we have a cleff

export const createNotation = (cleff=CLEFF_TREBLE) => {
	return `${cleff}`
}
