// AKA "Sequences"
import {
	kickSequences,
	snareSequences,
	hatSequences,
	drumRollSequence
} from './drum-patterns.js'

// Just a simple factory for creating random repetitive beats
const subdivisions = 4
const beatTriggerLookaheadState = new WeakMap()

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

/**
 * Create a pattern or sequence of velocities
 * that can be used as triggers for percussion
 * @param {*} sequence 
 * @param {Number} offset 
 * @returns 
 */
export const pattern = ( sequence, offset=0 )=>{

	let index = offset
	
	let length = sequence.length

	// accessors
	return {
		reset:()=> {
			index = 0
			return sequence[index]
		},
		current:()=> sequence[index],
		previous:()=>{
			const newIndex = index - 1
			index = newIndex < 0 ? length - 1: newIndex
			return sequence[index]
		},
		next:()=>{
			const newIndex = index + 1
			index = newIndex >= length ? 0 : newIndex
			return sequence[index]
		},
		setStep: step => index = step,
		getStep: () => index,
		getLength: () => length,
		setLength: l => length = Math.min(l,sequence.length),
		setSequence:s => sequence = s
	}
}

export const kickSequence = pattern( kickSequences[0] )
export const snareSequence = pattern(snareSequences[0])
export const hatSequence = pattern(hatSequences[0])

// should we add ways to randomise this???
export const getKitSequence = (kitIndex=0) => {
	return {
		kick:pattern( kickSequences[kitIndex%(kickSequences.length-1)] ),
		hat:pattern( hatSequences[kitIndex%(hatSequences.length-1)] ),
		snare:pattern( snareSequences[kitIndex%(snareSequences.length-1)] ),
		clap:pattern( snareSequences[kitIndex%(snareSequences.length-1)] ),
		roll:pattern( drumRollSequence )
	}
}

export const combinePatternWithInstrument = (pattern, instrument )=> {

}

export const playNextPart = (pattern, instrument, options, triggerAt )=> {
	const velocity = pattern.next()
	if (velocity > 0)
	{
		instrument( {...options, velocity: velocity / 255, triggerAt } )	// velocity
		return true
	}else{
		// no note but noteOff?
		return false
	}
}

/**
 * Compute the AudioContext time at which a beat should fire.
 *
 * `expected` comes from netronome's timer thread and stays transport-
 * continuous across live tempo changes, so it is the best representation
 * of the clock grid for audio scheduling.
 *
 * The whole sequence is shifted into the future by `lookahead` seconds so
 * the audio engine has enough headroom to render the next note without
 * being affected by main-thread stalls.
 *
 * @param {AudioContext} audioContext
 * @param {Object} clock - netronome AudioTimer instance (uses clock.startTime ms)
 * @param {Number} expected - ideal elapsed seconds since clock start (from tick)
 * @param {Number} [lookahead] - scheduling headroom in seconds. When omitted,
 *   it defaults to one quarter-note of headroom from the current clock and
 *   remains stable for the current clock start.
 * @returns {Number} audio-clock time in seconds, suitable for triggerAt
 */
export const getBeatTriggerTime = ( audioContext, clock, expected, lookahead ) => {
	const now = audioContext.currentTime
	const cached = clock ? beatTriggerLookaheadState.get(clock) : null
	if ( lookahead === undefined )
	{
		if (cached && cached.startTime === clock?.startTime && Number.isFinite(cached.lookahead))
		{
			lookahead = cached.lookahead
		}else{
			lookahead = clock && clock.timePerBar > 0 ? clock.timePerBar / 1000 : 0.1
		}
	}
	// Clock not yet started - fall back to "now + lookahead".
	if ( !clock || clock.startTime <= 0 )
	{
		return now + lookahead
	}
	beatTriggerLookaheadState.set(clock, {
		lookahead,
		startTime: clock.startTime,
	})
	const tickAudioTime = clock.startTime / 1000 + ( expected ?? 0 )
	const scheduled = tickAudioTime + lookahead
	// Last-resort safety: never schedule meaningfully in the past
	// (Web Audio silently drops past-time events). A 5 ms guard is
	// sufficient and almost never kicks in once the clock is running.
	return scheduled > now ? scheduled : now + 0.005
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
