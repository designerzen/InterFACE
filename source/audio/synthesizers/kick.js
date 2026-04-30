import { ZERO } from '../audio.js'
import {createQueue} from '../synthesizers.js'

// Presets live in their own file so they can be tweaked / extended
// without touching the synth engine.  Re-export everything for
// backwards compatibility with existing imports.
export {
	DEFAULT_KICK_OPTIONS,
	PRESET_808_KICK,
	PRESET_808_SUB_KICK,
	PRESET_909_KICK,
	PRESET_909_PUNCHY_KICK,
	PRESET_707_KICK,
	PRESET_LINN_KICK,
	PRESET_CR78_KICK,
	PRESET_TECH_HOUSE_KICK,
	PRESET_DEEP_HOUSE_KICK,
	PRESET_MINIMAL_TECHNO_KICK,
	PRESET_DETROIT_KICK,
	PRESET_BERLIN_KICK,
	PRESET_ACID_KICK,
	PRESET_HARDSTYLE_KICK,
	PRESET_GABBER_KICK,
	PRESET_INDUSTRIAL_KICK,
	PRESET_HARDCORE_KICK,
	PRESET_TRAP_KICK,
	PRESET_DUBSTEP_KICK,
	PRESET_HIPHOP_KICK,
	PRESET_BOOM_BAP_KICK,
	PRESET_DRILL_KICK,
	PRESET_JUNGLE_KICK,
	PRESET_DNB_KICK,
	PRESET_BREAKBEAT_KICK,
	PRESET_ELECTRO_KICK,
	PRESET_SYNTHWAVE_KICK,
	PRESET_VINTAGE_KICK,
	PRESET_BEEFY_KICK,
	PRESET_LOW_KICK,
	PRESET_THUD_KICK,
	PRESET_CLICK_KICK,
	PRESET_LOFI_KICK,
	PRESET_AMBIENT_KICK,
	PRESET_CINEMATIC_KICK,
	PRESET_DUSTY_KICK,
	PRESET_PUNCH_KICK,
	PRESET_PILLOW_KICK,
	PRESET_DISTORTED_KICK,
	PRESET_RAVE_KICK,
	PRESET_SUB_BOOMER_KICK,
	PRESET_TICK_KICK,
	PRESETS_KICKS,
	getKickPresets,
	getRandomKickPreset,
} from './kick-presets.js'

import { DEFAULT_KICK_OPTIONS } from './kick-presets.js'

/**
 * Kick me!
 * @returns {Function} trigger start method
 */
export const createKick = (audioContext, output ) => {

    const mainOscillator = audioContext.createOscillator()
    const subOscillator = audioContext.createOscillator()
    const gainTriangle = audioContext.createGain()
    const gainSine = audioContext.createGain()
	let isRunning = false

    mainOscillator.type = "triangle"
    subOscillator.type = "sine"
	
	// sustain measured in volume rather than time
	const kick = ( options=DEFAULT_KICK_OPTIONS ) => {

		options = Object.assign({}, DEFAULT_KICK_OPTIONS, options )
		const time = options.triggerAt ?? audioContext.currentTime + ZERO
		const endAt = time + options.length
		
		// console.log("KICK", options )

		if (!isRunning)
		{
			try{
				mainOscillator.start(time)
				subOscillator.start(time)

				//osc4.stop(time + 0.05)  			
			}catch(error){
	
			}
			isRunning = true
		}
  
		// clear anything from previous plays
		gainTriangle.gain.cancelScheduledValues(time)
		gainSine.gain.cancelScheduledValues(time)
		
		mainOscillator.frequency.cancelScheduledValues(time)
		subOscillator.frequency.cancelScheduledValues(time)

		// set new envelopes

		// TRIANGLE
		gainTriangle.gain.setValueAtTime(ZERO, time)
		gainTriangle.gain.exponentialRampToValueAtTime( options.velocity, time + options.attack)
		gainTriangle.gain.exponentialRampToValueAtTime( options.sustain, time + options.attack + options.decay)
		gainTriangle.gain.exponentialRampToValueAtTime(ZERO, endAt)

		mainOscillator.frequency.setValueAtTime(options.triStart, time)
		mainOscillator.frequency.exponentialRampToValueAtTime(options.triEnd, endAt)
	
		// SINE
		gainSine.gain.setValueAtTime(ZERO, time)
		gainSine.gain.exponentialRampToValueAtTime( options.velocity, time + options.attack)
		gainSine.gain.exponentialRampToValueAtTime( options.sustain, time + options.attack + options.decay)
		gainSine.gain.exponentialRampToValueAtTime(ZERO, endAt)

		subOscillator.frequency.setValueAtTime(options.sineStart, time)
		subOscillator.frequency.exponentialRampToValueAtTime(options.sineApex, time + options.attack)
		subOscillator.frequency.exponentialRampToValueAtTime(options.sineSustain || options.sineApex, time + options.attack + options.decay)
		subOscillator.frequency.exponentialRampToValueAtTime(options.sineEnd, endAt)

		return options
	}
  
    mainOscillator.connect(gainTriangle)
    gainTriangle.connect(output)
	
	subOscillator.connect(gainSine)
	gainSine.connect(output)

	kick.cancel = () => {
		const now = audioContext.currentTime
		gainTriangle.gain.cancelScheduledValues(now)
		gainTriangle.gain.setValueAtTime(ZERO, now)
		gainSine.gain.cancelScheduledValues(now)
		gainSine.gain.setValueAtTime(ZERO, now)
	}

	return kick
}

// this is just an array of kicks
export const createKicks = (audioContext, output, quantity=2) => createQueue( audioContext, output , createKick, quantity)
