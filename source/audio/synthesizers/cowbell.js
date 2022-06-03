import {audioContext, ZERO} from '../audio'
import {inputDryNode} from '../rack'
import {createQueue} from '../synthesizers'


/**
 * Create an instance of the cowbell instrument
 * @returns {Function} trigger start method
 */
export const createCowbell = () => {
	
	const cowbellGainNode = audioContext.createGain()
 
    const bandpass = audioContext.createBiquadFilter()
    bandpass.type = "bandpass"
    bandpass.frequency.value = 2640
    bandpass.Q.value = 3.5

	const fundamental = 1
    const ratios = [587,845]

    const oscillators = ratios.map((ratio) => {

        const oscillator = audioContext.createOscillator()
        oscillator.type = "triangle"
		oscillator.frequency.value = fundamental * ratio
		oscillator.connect(bandpass)
		return oscillator
    })

	bandpass.connect(cowbellGainNode)
	cowbellGainNode.connect(inputDryNode())
	
	const cowbell = (velocity=1, length=0.05 )=>{
		const time = audioContext.currentTime
		
		// clear anything from previous plays
		cowbellGainNode.gain.cancelScheduledValues(time)
		oscillators.forEach( oscillator => oscillator.frequency.cancelScheduledValues(time) )
		
		// set neew envelopes
		cowbellGainNode.gain.setValueAtTime(1, time)
		cowbellGainNode.gain.exponentialRampToValueAtTime(ZERO, time + length)
		
		try{
			oscillators.forEach( oscillator => oscillator.start(time) )
		
			//osc4.stop(time + 0.05)  			
		}catch(error){

		}
	}
	return cowbell
}

export const createCowbells = (quantity=2) => createQueue(createCowbell, quantity)