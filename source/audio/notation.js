
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