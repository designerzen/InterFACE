import { ZERO } from '../audio'
import {createQueue} from '../synthesizers'

export const DEFAULT_OPEN_HIHAT = {
	name:"Default Open Hihat",
	velocity:1, 
	length:0.09, 	
	fundamental:40,
	ratios:[2, 3, 4.16, 5.43, 6.79, 8.21],
	attack:0.0001, 
	decay:0.05, 
	// sustain is a volume not a time
	sustain:0.96, 
	release:0.01,
	highpass:7000,
	bandpass:10000,
	type:"triangle"
} 

// Closed high hat is a shorter version
export const DEFAULT_CLOSED_HIHAT = {
	name:"Default Closed Hihat",
	velocity:1, 
	length:0.05, 	
	fundamental:40,
	ratios:[2, 3, 4.16, 5.43, 6.79, 8.21],
	attack:0.0001, 
	decay:0.005, 
	// sustain is a volume not a time
	sustain:0.7, 
	release:0.01,
	highpass:7000,
	bandpass:10000,
	type:"triangle"
} 

export const OPEN_HIHAT_TINY = {
	name:"Tiny Open Hihat",
	velocity:1, 
	length:0.06, 	
	fundamental:40,
	ratios:[2, 3, 4.16, 5.43, 6.79, 8.21],
	attack:0.0001, 
	decay:0.05, 
	// sustain is a volume not a time
	sustain:0.9, 
	release:0.01,
	highpass:7000,
	bandpass:10000,
	type:"triangle"
} 

// Closed high hat is a shorter version
export const CLOSED_HIHAT_TINY = {
	name:"Tiny Closed Hihat",
	velocity:1, 
	length:0.03, 	
	fundamental:40,
	ratios:[2, 3, 4.16, 5.43, 6.79, 8.21],
	attack:0.0002, 
	decay:0.007, 
	// sustain is a volume not a time
	sustain:0.7, 
	release:0.03,
	highpass:7000,
	bandpass:20000,
	type:"triangle"
} 

export const PRESET_HIHATS = [
	DEFAULT_CLOSED_HIHAT,
	CLOSED_HIHAT_TINY,
	DEFAULT_OPEN_HIHAT
]

export const getRandomHihatPreset = () => {
	const hatIndex = Math.floor(Math.random() * PRESET_HIHATS.length)
	return PRESET_HIHATS[hatIndex]
}

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

		const time = audioContext.currentTime

		if (!isRunning)
		{
			try{
				oscillators.forEach( oscillator => oscillator.start(time) )			
			}catch(error){}
			isRunning = true
		}

		options = Object.assign({},DEFAULT_CLOSED_HIHAT,options)
		
		bandpassFilter.frequency.value = options.bandpass
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
	return hihat
}

export const createHihats = (audioContext, output , quantity=3) => createQueue(audioContext, output , createHihat, quantity)