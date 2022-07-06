import {audioContext, ZERO, getPercussionNode} from '../audio'
import {createQueue} from '../synthesizers'

/**
 * Create an instance of the clack instrument
 * @returns {Function} trigger start method
 */
export const createClack = () => {

	const output = getPercussionNode()
	
	const cowbellGainNode = audioContext.createGain()
 
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
    highpass.connect(cowbellGainNode)
	cowbellGainNode.connect(output)
	
	const clack = (velocity=1, length=0.05, ocatave=fundamental )=>{
		const time = audioContext.currentTime
		
		// clear anything from previous plays
		cowbellGainNode.gain.cancelScheduledValues(time)
		oscillators.forEach( (oscillator,i) =>{ 
			oscillator.frequency.cancelScheduledValues(time) 
			oscillator.frequency.value = ocatave * ratios[i]
		})
		
		// set neew envelopes
		cowbellGainNode.gain.setValueAtTime(1, time)
		cowbellGainNode.gain.exponentialRampToValueAtTime(ZERO, time + length)
		
		try{
			oscillators.forEach( oscillator => oscillator.start(time) )
		
			//osc4.stop(time + 0.05)  			
		}catch(error){

		}
	}
	return clack
}

export const createClacks = (quantity=2) => createQueue(createClack, quantity)