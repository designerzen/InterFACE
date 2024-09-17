import { ZERO } from '../audio'
import {createQueue} from '../synthesizers'

export const DEFAULT_CLACK_OPTIONS = { 
	velocity:1, 
	length:0.05,
	ocatave:1
} 

/**
 * Create an instance of the clack instrument
 * @returns {Function} trigger start method
 */
export const createClack = (audioContext, output ) => {

	let isRunning = false
	const gainNode = audioContext.createGain()
 
    const bandpass = audioContext.createBiquadFilter()
    bandpass.type = "bandpass"
    bandpass.frequency.value = 2640
    bandpass.Q.value = 3.5

    const highpass = audioContext.createBiquadFilter()
    highpass.type = "highpass"
    highpass.frequency.value = 7000

	const fundamental = 1
    const ratios = [587,845]

    const oscillators = ratios.map((ratio) => {
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
	
		const time = audioContext.currentTime
			
		if (!isRunning)
		{
			try{
				oscillators.forEach( oscillator => oscillator.start(time) )
			}catch(error){}	
			isRunning = true
		}
		
		// clear anything from previous plays
		gainNode.gain.cancelScheduledValues(time)
		oscillators.forEach( (oscillator,i) =>{ 
			oscillator.frequency.cancelScheduledValues(time) 
			oscillator.frequency.value = (options.octave || 1) * ratios[i]
		})
		
		// set new envelopes
		gainNode.gain.setValueAtTime( options.velocity, time)
		gainNode.gain.exponentialRampToValueAtTime(ZERO, time + options.length)
	}
	return clack
}

export const createClacks = (audioContext, output , quantity=2) => createQueue(audioContext, output, createClack, quantity)