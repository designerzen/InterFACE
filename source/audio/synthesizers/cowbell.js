import { ZERO } from '../audio'
import {createQueue} from '../synthesizers'


export const DEFAULT_COWBELL_OPTIONS = {
	velocity:1, 
	length:0.5,
	bandpass:2640,
	fundamental:1,
	ratios:[587,845],
	q:3.5,
	
	attack:0.02,
	decay:0.02,
	sustain:0.9
}

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
	
		const time = audioContext.currentTime
		
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
			const ratio = options.ratios[i]
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
	return cowbell
}

export const createCowbells = (audioContext, output , quantity=2) => createQueue(audioContext, output , createCowbell, quantity)