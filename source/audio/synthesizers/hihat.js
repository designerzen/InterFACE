import { ZERO } from '../audio'
import {createQueue} from '../synthesizers'

// Hihat presets live in their own file - re-export everything for
// backwards compatibility with existing imports.
export {
	DEFAULT_OPEN_HIHAT,
	DEFAULT_CLOSED_HIHAT,
	CLOSED_HIHAT_TINY,
	CLOSED_HIHAT_808,
	CLOSED_HIHAT_909,
	CLOSED_HIHAT_TIGHT,
	CLOSED_HIHAT_METALLIC,
	CLOSED_HIHAT_LOFI,
	CLOSED_HIHAT_TRAP,
	CLOSED_HIHAT_HOUSE,
	CLOSED_HIHAT_TECHNO,
	CLOSED_HIHAT_GLASS,
	CLOSED_HIHAT_DARK,
	CLOSED_HIHAT_CHATTERY,
	OPEN_HIHAT_TINY,
	OPEN_HIHAT_SHORT,
	OPEN_HIHAT_808,
	OPEN_HIHAT_909,
	OPEN_HIHAT_LONG,
	OPEN_HIHAT_SIZZLE,
	OPEN_HIHAT_HOUSE,
	OPEN_HIHAT_TECHNO,
	OPEN_HIHAT_TRAP,
	OPEN_HIHAT_DISTORTED,
	OPEN_HIHAT_SHIMMER,
	OPEN_HIHAT_LOFI,
	OPEN_HIHAT_DARK,
	OPEN_HIHAT_CRASH,
	OPEN_HIHAT_RIDE,
	PRESET_HIHATS,
	PRESET_HIHATS_CLOSED,
	PRESET_HIHATS_OPEN,
	getRandomHihatPreset,
	getRandomClosedHihatPreset,
	getRandomOpenHihatPreset,
	getHihatPresets,
} from './hihat-presets.js'

import { DEFAULT_CLOSED_HIHAT } from './hihat-presets.js'

/**
 * 
 * Create an instance of the hi-hat instrument
 * @returns {Function} trigger start method
 */
export const createHihat = (audioContext, output ) => {

	let isRunning = false
    const gainNode = audioContext.createGain()
    const {ratios, fundamental, bandpass, highpass, type} = DEFAULT_CLOSED_HIHAT

    const bandpassFilter = audioContext.createBiquadFilter()
    bandpassFilter.type = "bandpass"
    bandpassFilter.frequency.value = bandpass

    const highpassFilter = audioContext.createBiquadFilter()
    highpassFilter.type = "highpass"
    highpassFilter.frequency.value = highpass

	const SATURATE = 5

    const oscillators = ratios.map((ratio) => {
        const oscillator = audioContext.createOscillator()
        oscillator.type = type
		oscillator.frequency.value = fundamental * ratio
		oscillator.connect(bandpassFilter)
		// oscillator.start(audioContext.currentTime)
		// console.info("Oscillator",oscillator.frequency.value,{oscillator, bandpassFilter})
		return oscillator
    })

	bandpassFilter.connect(highpassFilter)
    highpassFilter.connect(gainNode)
	gainNode.connect(output)
	
	const hihat = ( options=DEFAULT_CLOSED_HIHAT )=>{

		options = Object.assign({},DEFAULT_CLOSED_HIHAT,options)

		const time = options.triggerAt ?? audioContext.currentTime + ZERO

		if (!isRunning)
		{
			try{
				oscillators.forEach( oscillator => oscillator.start(time) )			
			}catch(error){}
			isRunning = true
		}
		
		bandpassFilter.frequency.cancelScheduledValues(time)
		bandpassFilter.frequency.value = options.bandpass

		// high pass filter
		highpassFilter.frequency.cancelScheduledValues(time)
		highpassFilter.frequency.value = options.highpass
	
		// clear anything from previous plays
		// oscillators.forEach( (oscillator,i) =>{
		// 	const ratio = options.ratios[i]
		// 	// oscillator.frequency.cancelScheduledValues(time) 
		// 	//oscillator.frequency.setValueAtTime( options.fundamental * ratio, time)
		// })
			// console.info("hat", {isRunning, options, time, oscillators})
	
		// set new ADSR envelopes
		gainNode.gain.cancelScheduledValues(time)
		gainNode.gain.setValueAtTime( ZERO, time)
		gainNode.gain.exponentialRampToValueAtTime( SATURATE * options.velocity, time + options.attack )
		gainNode.gain.linearRampToValueAtTime( SATURATE * options.sustain, time + options.attack + options.decay)
		gainNode.gain.linearRampToValueAtTime( SATURATE * options.sustain, time + options.length - options.release)
		gainNode.gain.linearRampToValueAtTime( ZERO, time + options.length)

		return options
	}
	hihat.cancel = () => {
		const now = audioContext.currentTime
		gainNode.gain.cancelScheduledValues(now)
		gainNode.gain.setValueAtTime(ZERO, now)
	}
	return hihat
}

export const createHihats = (audioContext, output , quantity=3) => createQueue(audioContext, output , createHihat, quantity)
