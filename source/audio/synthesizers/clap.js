import { ZERO, getPercussionNode} from '../audio'
import {createQueue} from '../synthesizers'

// Clap presets live in their own file - re-export for backwards compat
export {
	DEFAULT_CLAP_OPTIONS,
	PRESET_808_CLAP,
	PRESET_909_CLAP,
	PRESET_LINN_CLAP,
	PRESET_CR78_CLAP,
	PRESET_TIGHT_CLAP,
	PRESET_FAT_CLAP,
	PRESET_STADIUM_CLAP,
	PRESET_FINGER_SNAP,
	PRESET_HAND_CLAP,
	PRESET_HOUSE_CLAP,
	PRESET_TECHNO_CLAP,
	PRESET_TRAP_CLAP,
	PRESET_HIPHOP_CLAP,
	PRESET_LOFI_CLAP,
	PRESET_DISTORTED_CLAP,
	PRESET_GATED_CLAP,
	PRESET_WIDE_CLAP,
	PRESET_HUMAN_CLAP,
	PRESET_AGGRESSIVE_CLAP,
	PRESET_AMBIENT_CLAP,
	PRESET_DRY_CLAP,
	PRESET_CLAPS,
	getRandomClapPreset,
	getClapPresets,
} from './clap-presets.js'

import { DEFAULT_CLAP_OPTIONS } from './clap-presets.js'

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
	
		const time = options.triggerAt || audioContext.currentTime + ZERO
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

		return options
	}
	clap.cancel = () => {
		const now = audioContext.currentTime
		filterGain.gain.cancelScheduledValues(now)
		filterGain.gain.setValueAtTime(ZERO, now)
		gainTriangle.gain.cancelScheduledValues(now)
		gainTriangle.gain.setValueAtTime(ZERO, now)
	}
	return clap
}

export const createClaps = (audioContext, output , quantity=3) => createQueue(audioContext, output , createClap, quantity)
