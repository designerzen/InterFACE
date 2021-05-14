// AKA "Sequences"

// Just a simple factory for creating random repetitive beats
const subdivisions = 4

export const createPattern = (preset, bars=16) => {

	// keep adding the preset until we get to the required size...
	const gaps = bars * subdivisions
	const pattern = new Array()

}

// 
export const factory = (bars=16) => {

	// each bar has 4 sub divisions
	const gaps = bars * subdivisions
	const sequence = new Array(gaps).fill(0)
	// const sequence = []
	// for (let i=0; i<gaps; ++i)
	// {
	// 	const playNote = false
	// 	sequence.push(playNote)
	// }
	return sequence
}

export const pattern = ( sequence, offset=0 )=>{

	let index = offset
	
	const length = sequence.length - 1

	// accessors
	return {
		reset:()=> {
			index = 0
			return sequence[index]
		},
		previous:()=>{
			const newIndex = index - 1
			index = newIndex < 0 ? length : newIndex
			return sequence[index]
		},
		next:()=>{
			const newIndex = index + 1
			index = newIndex > length ? 0 : newIndex
			return sequence[index]
		},
		position: i => sequence[i],
		length:sequence.length,
		current:()=> sequence[index],
		set:s => sequence = s
	}
}

const kickSequences = [
	[
		255,0,0,0,
		255,0,0,0,
		255,0,0,0,
		255,0,0,0
	]
]

const snareSequences = [
	[
		0,0,255,0,
		0,0,255,0,
		0,0,255,0,
		0,0,255,0
	]
]

const drumRollSequence = new Array(16).map( i => i * 255 / 16 )

const hatSequences = [
	[
		255,0,255,0,
		255,0,255,0,
		255,0,255,0,
		255,0,255,0
	]
]

export const kickSequence = pattern( kickSequences[0] )
export const snareSequence = pattern(snareSequences[0])
export const hatSequence = pattern(hatSequences[0])

// should we add ways to randomise this???
export const kitSequence = () => {
	return {
		kick:pattern( kickSequences[0] ),
		hat:pattern( hatSequences[0] ),
		snare:pattern( snareSequences[0] ),
		roll:pattern( drumRollSequence )
	}
}

export const combinePatternWithInstrument = (pattern, instrument )=> {

}

export const playNextPart = (pattern, instrument, ...options )=> {
	const velocity = pattern.next()
	if (velocity > 0)
	{
		instrument(velocity, ...options)	// velocity
		return true
	}else{
		// no note but noteOff?
		return false
	}
}

// const kickVelocity = patterns.kick.next()
// if (kickVelocity > 0)
// {
// 	kit.kick()	// kickVelocity
// }
// const snareVelocity = patterns.snare.next()
// if (snareVelocity > 0)
// {
// 	kit.snare() // snareVelocity
// }

// const hatVelocity = patterns.hats.next()
// if (hatVelocity > 0)
// {
// 	kit.hat() // snareVelocity
// }

