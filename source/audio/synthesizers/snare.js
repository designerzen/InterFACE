import {audioContext, ZERO, getPercussionNode} from '../audio'
import {createQueue} from '../synthesizers'

/**
 * Create an instance of the snare instrument
 * @returns {Function} trigger start method
 */
export const createSnare = () => {

	const output = getPercussionNode()

    const osc3 = audioContext.createOscillator()
    const gainOsc3 = audioContext.createGain()
    const filterGain = audioContext.createGain()
	const noise = audioContext.createBufferSource()
	const buffer = audioContext.createBuffer(1, 4096, audioContext.sampleRate)

	// just allow the hihgs through
	const filter = audioContext.createBiquadFilter()
	filter.type = "highpass"
	filter.gain.value = 2

	osc3.type = "triangle"
	osc3.frequency.value = 100

	// TODO Cache the noise
	const data = buffer.getChannelData(0)
	for (var i = 0; i < 4096; i++) 
	{
		data[i] = Math.random()
	}

	noise.buffer = buffer
	noise.loop = true
	
	osc3.connect(gainOsc3)
	gainOsc3.connect(output )	

	noise.connect(filter)
	filter.connect(filterGain)
	filterGain.connect( output )

	const snare = (velocity=1, length = 0.3) => {

		const time = audioContext.currentTime
		
		filterGain.gain.cancelScheduledValues(time)
		filterGain.gain.setValueAtTime(1, time)
		filterGain.gain.exponentialRampToValueAtTime(ZERO, time + length)
	
		gainOsc3.gain.cancelScheduledValues(time)
		gainOsc3.gain.setValueAtTime(ZERO, time)
		gainOsc3.gain.exponentialRampToValueAtTime(ZERO, time + (length / 2 ) )	
		//gainOsc3.gain.value = 0

		// modulate and filter freqs
		filter.frequency.cancelScheduledValues(time)
		filter.frequency.setValueAtTime(10, time)
		filter.frequency.linearRampToValueAtTime(2000,time + length)		
	
		//gainNode.gain.value = 1			
		try{
			osc3.start(time)
			//osc3.stop(audioContext.currentTime + 0.2)
			noise.start(time)
			//node.stop(audioContext.currentTime + 0.2)	
		}catch(error){
		}
	}
	return snare
}
export const createSnares = (quantity=3) => createQueue(createSnare, quantity)