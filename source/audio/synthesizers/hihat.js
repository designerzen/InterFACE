import {audioContext, ZERO} from '../audio'
import {inputDryNode} from '../rack'
import {createQueue} from '../synthesizers'

/**
 * Create an instance of the hi-hat instrument
 * @returns {Function} trigger start method
 */
export const createHihat = () => {

    const gainOsc4 = audioContext.createGain()
    const fundamental = 40
    const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21]

    const bandpass = audioContext.createBiquadFilter()
    bandpass.type = "bandpass"
    bandpass.frequency.value = 10000

    const highpass = audioContext.createBiquadFilter()
    highpass.type = "highpass"
    highpass.frequency.value = 7000

    const oscillators = ratios.map((ratio) => {

        const osc4 = audioContext.createOscillator()
        osc4.type = "square"
		osc4.frequency.value = fundamental * ratio
		osc4.connect(bandpass)
		return osc4
    })

	bandpass.connect(highpass)
    highpass.connect(gainOsc4)
	gainOsc4.connect(inputDryNode())
	
	const hihat = (velocity=1, length=0.05 )=>{
		const time = audioContext.currentTime
		
		// clear anything from previous plays
		gainOsc4.gain.cancelScheduledValues(time)
		oscillators.forEach( oscillator => oscillator.frequency.cancelScheduledValues(time) )
		
		// set neew envelopes
		gainOsc4.gain.setValueAtTime(1, time)
		gainOsc4.gain.exponentialRampToValueAtTime(ZERO, time + length)
		
		try{
			oscillators.forEach( oscillator => oscillator.start(time) )
		
			//osc4.stop(time + 0.05)  			
		}catch(error){

		}
	}
	return hihat
}

export const createHihats = (quantity=3) => createQueue(createHihat, quantity)