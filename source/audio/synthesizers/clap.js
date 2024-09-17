import { ZERO, getPercussionNode} from '../audio'
import {createQueue} from '../synthesizers'


export const DEFAULT_CLAP_OPTIONS = {
	velocity:1, 
	length:0.7,
	highpass:6,
	frequencyStart:50,
	frequencyEnd:3000,
	
	attack:0.05,
	decay:0.2,
	sustain:0.9
}

/**
 * Create an instance of the snare instrument
 * @returns {Function} trigger start method
 */
export const createClap = ( audioContext, output ) => {
	
	let isRunning = false
    const triangleOscillator = audioContext.createOscillator()
    const gainTriangle = audioContext.createGain()
    const filterGain = audioContext.createGain()
	const noise = audioContext.createBufferSource()
	const buffer = audioContext.createBuffer(1, 4096, audioContext.sampleRate)

	// just allow the highs through
	const filter = audioContext.createBiquadFilter()
	filter.type = "highpass"
	filter.gain.value = DEFAULT_CLAP_OPTIONS.highpass

	triangleOscillator.type = "triangle"
	triangleOscillator.frequency.value = DEFAULT_CLAP_OPTIONS.frequencyStart

	// TODO Cache the noise
	const data = buffer.getChannelData(0)
	for (var i = 0; i < 4096; i++) 
	{
		data[i] = Math.random()
	}

	noise.buffer = buffer
	noise.loop = true
	
	triangleOscillator.connect(gainTriangle)
	gainTriangle.connect( filter )	

	noise.connect(filter)
	filter.connect(filterGain)
	filterGain.connect( output )

	const clap = ( options=DEFAULT_CLAP_OPTIONS) => {
	
		options = Object.assign({},DEFAULT_CLAP_OPTIONS,options)
	
		const time = audioContext.currentTime
		const endAt = time + options.length
		if (!isRunning)	
		{
			//gainNode.gain.value = 1			
			try{
				triangleOscillator.start(time)
				//osc3.stop(audioContext.currentTime + 0.2)
				noise.start(time)
				//node.stop(audioContext.currentTime + 0.2)	
			}catch(error){
			}
			isRunning = true
		}
		
		filterGain.gain.cancelScheduledValues(time)
		filterGain.gain.setValueAtTime(options.velocity, time)
		filterGain.gain.exponentialRampToValueAtTime(ZERO, endAt)
	
		gainTriangle.gain.cancelScheduledValues(time)
		gainTriangle.gain.setValueAtTime(ZERO, time)
		gainTriangle.gain.exponentialRampToValueAtTime(options.velocity, time + options.attack)
		gainTriangle.gain.exponentialRampToValueAtTime(options.sustain, time + options.attack + options.decay)
		gainTriangle.gain.linearRampToValueAtTime(ZERO, endAt )	
	
		// modulate and filter freqs
		filter.frequency.cancelScheduledValues(time)
		filter.frequency.setValueAtTime( options.frequencyStart, time)
		filter.frequency.linearRampToValueAtTime( options.frequencyEnd, endAt)
	}
	return clap
}

export const createClaps = (audioContext, output , quantity=3) => createQueue(audioContext, output , createClap, quantity)