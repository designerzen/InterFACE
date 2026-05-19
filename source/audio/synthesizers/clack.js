import { ZERO } from '../audio'
import {createQueue, chokeGains} from '../synthesizers'

// Clack presets live in their own file - re-export for backwards compat
export {
	DEFAULT_CLACK_OPTIONS,
	PRESET_TICK_CLACK,
	PRESET_HARD_CLACK,
	PRESET_SOFT_CLACK,
	PRESET_TIGHT_CLACK,
	PRESET_WIDE_CLACK,
	PRESET_RIM_CLACK,
	PRESET_STICK_CLACK,
	PRESET_CROSS_STICK,
	PRESET_CLAVE_CLACK,
	PRESET_WOODBLOCK_CLACK,
	PRESET_CASTANET_CLACK,
	PRESET_SIDE_STICK,
	PRESET_LOFI_CLACK,
	PRESET_DISTORTED_CLACK,
	PRESET_LOW_CLACK,
	PRESET_HIGH_CLACK,
	PRESET_PERC_CLACK,
	PRESET_GLITCH_CLACK,
	PRESET_CLACKS,
	getRandomClackPreset,
	getClackPresets,
} from './clack-presets.js'

import { DEFAULT_CLACK_OPTIONS } from './clack-presets.js'

/**
 * Create an instance of the clack instrument
 * @returns {Function} trigger start method
 */
export const createClack = (audioContext, output ) => {

	let isRunning = false
	const gainNode = audioContext.createGain()
 
    const bandpass = audioContext.createBiquadFilter()
    bandpass.type = "bandpass"
    bandpass.frequency.value = DEFAULT_CLACK_OPTIONS.bandpass
    bandpass.Q.value = DEFAULT_CLACK_OPTIONS.bandpassQ

    const highpass = audioContext.createBiquadFilter()
    highpass.type = "highpass"
    highpass.frequency.value = DEFAULT_CLACK_OPTIONS.highpass

	const fundamental = 1
    const baseRatios = DEFAULT_CLACK_OPTIONS.ratios

    const oscillators = baseRatios.map((ratio) => {
        const oscillator = audioContext.createOscillator()
        oscillator.type = "triangle"
		oscillator.frequency.value = fundamental * ratio
		oscillator.connect(bandpass)
		return oscillator
    })

	bandpass.connect(highpass)
    highpass.connect(gainNode)
	gainNode.connect(output)
	
	const clack = ( options=DEFAULT_CLACK_OPTIONS)=>{
		
		options = Object.assign({},DEFAULT_CLACK_OPTIONS,options)
	
		const time = options.triggerAt ?? audioContext.currentTime + ZERO
			
		if (!isRunning)
		{
			try{
				oscillators.forEach( oscillator => oscillator.start(time) )
			}catch(error){}	
			isRunning = true
		}

		// honour bandpass / highpass tweaks if present
		if (options.bandpass !== undefined) bandpass.frequency.value = options.bandpass
		if (options.bandpassQ !== undefined) bandpass.Q.value = options.bandpassQ
		if (options.highpass !== undefined) highpass.frequency.value = options.highpass

		// clear anything from previous plays
		gainNode.gain.cancelScheduledValues(time)
		const ratios = options.ratios || baseRatios
		oscillators.forEach( (oscillator,i) =>{ 
			const ratio = ratios[i] !== undefined ? ratios[i] : baseRatios[i]
			oscillator.frequency.cancelScheduledValues(time) 
			oscillator.frequency.value = (options.octave || 1) * ratio
		})
		
		// set new envelopes
		gainNode.gain.setValueAtTime( options.velocity, time)
		gainNode.gain.exponentialRampToValueAtTime(ZERO, time + options.length)

		return options
	}
	clack.cancel = () => {
		const now = audioContext.currentTime
		gainNode.gain.cancelScheduledValues(now)
		gainNode.gain.setValueAtTime(ZERO, now)
	}
	clack.choke = (duration, chokeAt) => {
		chokeGains(audioContext, [gainNode.gain], duration, chokeAt)
	}
	return clack
}

export const createClacks = (audioContext, output , quantity=2) => createQueue(audioContext, output, createClack, quantity)
