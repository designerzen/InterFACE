import { ZERO } from '../audio'
import {createQueue} from '../synthesizers'

// Cowbell presets live in their own file - re-export for backwards compat
export {
	DEFAULT_COWBELL_OPTIONS,
	PRESET_808_COWBELL,
	PRESET_909_COWBELL,
	PRESET_CR78_COWBELL,
	PRESET_LOW_COWBELL,
	PRESET_HIGH_COWBELL,
	PRESET_TUNED_LOW_COWBELL,
	PRESET_TUNED_HIGH_COWBELL,
	PRESET_DRY_COWBELL,
	PRESET_RINGING_COWBELL,
	PRESET_DAMPENED_COWBELL,
	PRESET_DISTORTED_COWBELL,
	PRESET_LOFI_COWBELL,
	PRESET_BRIGHT_COWBELL,
	PRESET_DARK_COWBELL,
	PRESET_TIGHT_COWBELL,
	PRESET_LONG_COWBELL,
	PRESET_CASCABEL_COWBELL,
	PRESET_AGOGO_COWBELL,
	PRESET_TRIANGLE_BELL,
	PRESET_TUBULAR_BELL,
	PRESET_COWBELLS,
	getRandomCowbellPreset,
	getCowbellPresets,
} from './cowbell-presets.js'

import { DEFAULT_COWBELL_OPTIONS } from './cowbell-presets.js'

/**
 * Create an instance of the cowbell instrument
 * @returns {Function} trigger start method
 */
export const createCowbell = (audioContext, output ) => {
	
	let isRunning = false
	const cowbellGainNode = audioContext.createGain()
 
    const bandpass = audioContext.createBiquadFilter()
    bandpass.type = "bandpass"
    bandpass.frequency.value = DEFAULT_COWBELL_OPTIONS.bandpass
    bandpass.Q.value = DEFAULT_COWBELL_OPTIONS.q

	const fundamental = DEFAULT_COWBELL_OPTIONS.fundamental
    const ratios = DEFAULT_COWBELL_OPTIONS.ratios

    const oscillators = ratios.map((ratio) => {
        const oscillator = audioContext.createOscillator()
        oscillator.type = "triangle"
		oscillator.frequency.value = fundamental * ratio
		oscillator.connect(bandpass)
		return oscillator
    })

	bandpass.connect(cowbellGainNode)
	cowbellGainNode.connect(output)
	
	const cowbell = ( options=DEFAULT_COWBELL_OPTIONS)=>{
		
		options = Object.assign({}, DEFAULT_COWBELL_OPTIONS, options)
	
		const time = options.triggerAt || audioContext.currentTime + ZERO
		
		if (!isRunning)
		{			
			try{
				oscillators.forEach( oscillator => oscillator.start(time) )
				isRunning = true
				//osc4.stop(time + 0.05)  			
			}catch(error){

			}
		}

		bandpass.frequency.value = options.bandpass
		bandpass.Q.value = options.q	
		
		// clear anything from previous plays
		oscillators.forEach( (oscillator, i) => {
			const ratio = options.ratios[i] !== undefined ? options.ratios[i] : DEFAULT_COWBELL_OPTIONS.ratios[i]
			oscillator.frequency.cancelScheduledValues(time) 
			oscillator.frequency.setValueAtTime( options.fundamental * ratio, time)
		})
		
		// set new envelopes
		cowbellGainNode.gain.cancelScheduledValues(time)
		cowbellGainNode.gain.setValueAtTime( ZERO, time)
		cowbellGainNode.gain.exponentialRampToValueAtTime(options.velocity, time + options.attack)
		cowbellGainNode.gain.exponentialRampToValueAtTime(options.sustain, time + options.attack + options.decay)
		cowbellGainNode.gain.linearRampToValueAtTime(ZERO, time + options.length )	
		return options
	}
	cowbell.cancel = () => {
		const now = audioContext.currentTime
		cowbellGainNode.gain.cancelScheduledValues(now)
		cowbellGainNode.gain.setValueAtTime(ZERO, now)
	}
	return cowbell
}

export const createCowbells = (audioContext, output , quantity=2) => createQueue(audioContext, output , createCowbell, quantity)
