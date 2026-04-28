import { ZERO } from '../audio'
import {createQueue} from '../synthesizers'

// Tom presets live in their own file - re-export for backwards
// compatibility with existing imports.
export {
	DEFAULT_TOM_OPTIONS,
	PRESET_FLOOR_TOM,
	PRESET_LOW_TOM,
	PRESET_MID_TOM,
	PRESET_HIGH_TOM,
	PRESET_RACK_TOM,
	PRESET_DEEP_LOW_TOM,
	PRESET_808_LOW_TOM,
	PRESET_808_MID_TOM,
	PRESET_808_HIGH_TOM,
	PRESET_909_LOW_TOM,
	PRESET_909_HIGH_TOM,
	PRESET_LINN_TOM,
	PRESET_TECH_HOUSE_TOM,
	PRESET_BEEFY_TOM,
	PRESET_TRIBAL_TOM,
	PRESET_TIMBALE_TOM,
	PRESET_CONGA_TOM,
	PRESET_BONGO_TOM,
	PRESET_JUNGLE_TOM,
	PRESET_DNB_TOM,
	PRESET_TRAP_TOM,
	PRESET_LOFI_TOM,
	PRESET_AMBIENT_TOM,
	PRESET_CINEMATIC_TOM,
	PRESET_DISTORTED_TOM,
	PRESET_TIGHT_TOM,
	PRESET_THUD_TOM,
	PRESET_RAVE_TOM,
	PRESETS_TOMS,
	getRandomKTomPreset,
	getRandomTomPreset,
	getTomPresets,
} from './tom-presets.js'

import { DEFAULT_TOM_OPTIONS } from './tom-presets.js'

/**
 * Kick me!
 * @returns {Function} trigger start method
 */
export const createTom = (audioContext, output ) => {

	const triangleOscillator = audioContext.createOscillator()
	const sineOscillator = audioContext.createOscillator()
	const gainTriangle = audioContext.createGain()
	const gainSine = audioContext.createGain()
	let isRunning = false

	triangleOscillator.type = "triangle"
	sineOscillator.type = "sine"
	
	// sustain measured in volume rather than time
	const tom = ( options=DEFAULT_TOM_OPTIONS ) => {

		options = Object.assign({}, DEFAULT_TOM_OPTIONS, options )
		const time = options.triggerAt || audioContext.currentTime + ZERO
		const endAt = time + options.length
		
		// console.log("KICK", options )

		if (!isRunning)
		{
			try{
				triangleOscillator.start(time)
				sineOscillator.start(time)

				//osc4.stop(time + 0.05)  			
			}catch(error){
	
			}
			isRunning = true
		}
 
		// clear anything from previous plays
		gainTriangle.gain.cancelScheduledValues(time)
		gainSine.gain.cancelScheduledValues(time)
		
		triangleOscillator.frequency.cancelScheduledValues(time)
		sineOscillator.frequency.cancelScheduledValues(time)

		// set new envelopes

		// TRIANGLE
		gainTriangle.gain.setValueAtTime(ZERO, time)
		gainTriangle.gain.exponentialRampToValueAtTime( options.velocity, time + options.attack)
		gainTriangle.gain.exponentialRampToValueAtTime( options.sustain, time + options.attack + options.decay)
		gainTriangle.gain.exponentialRampToValueAtTime(ZERO, endAt)

		triangleOscillator.frequency.setValueAtTime(options.triStart, time)
		triangleOscillator.frequency.exponentialRampToValueAtTime(options.triEnd, endAt)
	
		// SINE
		gainSine.gain.setValueAtTime(ZERO, time)
		gainSine.gain.exponentialRampToValueAtTime( options.velocity, time + options.attack)
		gainSine.gain.exponentialRampToValueAtTime( options.sustain, time + options.attack + options.decay)
		gainSine.gain.exponentialRampToValueAtTime(ZERO, endAt)

		sineOscillator.frequency.setValueAtTime(options.sineStart, time)
		sineOscillator.frequency.exponentialRampToValueAtTime(options.sineApex, time + options.attack)
		sineOscillator.frequency.exponentialRampToValueAtTime(options.sineSustain || options.sineApex, time + options.attack + options.decay)
		sineOscillator.frequency.exponentialRampToValueAtTime(options.sineEnd, endAt)

		//  osc.stop(audioContext.currentTime + duration)
		//  osc2.stop(audioContext.currentTime + duration)
		return options
	}
 
	triangleOscillator.connect(gainTriangle)
	gainTriangle.connect(output)
	
	sineOscillator.connect(gainSine)
	gainSine.connect(output)

	return tom
}

// this is just an array of toms
export const createToms = (audioContext, output, quantity=2) => createQueue( audioContext, output , createTom, quantity)
