import { ZERO } from '../audio'
import {createQueue, chokeGains} from '../synthesizers'

// Snare presets live in their own file - re-export for backwards
// compatibility with existing import sites.
export {
	DEFAULT_SNARE_OPTIONS,
	PRESET_808_SNARE,
	PRESET_909_SNARE,
	PRESET_707_SNARE,
	PRESET_LINN_SNARE,
	PRESET_CR78_SNARE,
	PRESET_ACOUSTIC_SNARE,
	PRESET_PICCOLO_SNARE,
	PRESET_BRUSH_SNARE,
	PRESET_BIG_ROOM_SNARE,
	PRESET_GATED_SNARE,
	PRESET_RIM_SHOT_SNARE,
	PRESET_HEAVY_SNARE,
	PRESET_LONG_SNARE,
	PRESET_SQUARE_SNARE,
	PRESET_STRONG_SNARE,
	PRESET_SATURATED_SNARE,
	PRESET_DISTORTED_SNARE,
	PRESET_TRAP_SNARE,
	PRESET_DRILL_SNARE,
	PRESET_HIPHOP_SNARE,
	PRESET_BOOM_BAP_SNARE,
	PRESET_LOFI_SNARE,
	PRESET_HOUSE_SNARE,
	PRESET_TECH_SNARE,
	PRESET_CLAP_SNARE,
	PRESET_JUNGLE_SNARE,
	PRESET_DNB_SNARE,
	PRESET_BREAKBEAT_SNARE,
	PRESET_TIGHT_SNARE,
	PRESET_FAT_SNARE,
	PRESET_GHOST_SNARE,
	PRESET_NOISY_SNARE,
	PRESET_CINEMATIC_SNARE,
	PRESET_ELECTRO_SNARE,
	PRESET_INDUSTRIAL_SNARE,
	PRESET_AMBIENT_SNARE,
	// legacy aliases
	PRESET_LONG_SNARE_OPTIONS,
	PRESET_HEAVY_SNARE_OPTIONS,
	PRESET_SQUARE_SNARE_OPTIONS,
	PRESET_STRONG_SNARE_OPTIONS,
	PRESET_SATURATED_SNARE_OPTIONS,
	PRESET_SNARES,
	getRandomSnarePreset,
	getSnarePresets,
} from './snare-presets.js'

import { DEFAULT_SNARE_OPTIONS } from './snare-presets.js'

/**
 * Create an instance of the snare instrument
 * @returns {Function} trigger start method
 */
export const createSnare = ( audioContext, output ) => {

	let isRunning = false
    const oscillator = audioContext.createOscillator()
    const gainTriangle = audioContext.createGain()
    const filterGain = audioContext.createGain()
	const noise = audioContext.createBufferSource()
	const buffer = audioContext.createBuffer(1, 4096, audioContext.sampleRate)

	const bandpass = audioContext.createBiquadFilter()
    bandpass.type = "bandpass"
    bandpass.frequency.value = DEFAULT_SNARE_OPTIONS.bandpassStart


	// just allow these through
	const highpass = audioContext.createBiquadFilter()
	highpass.type = "highpass"
	highpass.frequency.value = DEFAULT_SNARE_OPTIONS.highpassStart

	oscillator.frequency.value = DEFAULT_SNARE_OPTIONS.triStart

	// TODO Cache the noise
	const data = buffer.getChannelData(0)
	for (var i = 0; i < 4096; i++) 
	{
		// top heavy noise
		data[i] = Math.random() / 2
	}

	noise.buffer = buffer
	noise.loop = true
	
	oscillator.connect(gainTriangle)
	gainTriangle.connect(output )	

	noise.connect(highpass)
	bandpass.connect(highpass)
	highpass.connect(filterGain)
	filterGain.connect( output )

	const snare = ( options = DEFAULT_SNARE_OPTIONS ) => {

		options = Object.assign({}, DEFAULT_SNARE_OPTIONS, options)
	
		const time = options.triggerAt ?? audioContext.currentTime + ZERO
		const endAt = time + options.length
		
		if (!isRunning)
		{
			//gainNode.gain.value = 1			
			try{
				oscillator.start(time)
				//osc3.stop(audioContext.currentTime + 0.2)
				noise.start(time)
				//node.stop(audioContext.currentTime + 0.2)	
			}catch(error){
			}
			isRunning = true
		}	

		// console.log("SNARE",{options})

		filterGain.gain.cancelScheduledValues(time)
		filterGain.gain.setValueAtTime( options.velocity, time)
		filterGain.gain.exponentialRampToValueAtTime(ZERO, endAt)
	
		gainTriangle.gain.cancelScheduledValues(time)
		gainTriangle.gain.setValueAtTime(options.velocity, time)
		gainTriangle.gain.exponentialRampToValueAtTime(ZERO, time + (options.length - options.decay ) )	

		// bandpassing
		const geometricMean = Math.sqrt( options.bandpassStart * options.bandpassEnd )
		bandpass.Q.value = geometricMean / (options.bandpassEnd - options.bandpassStart)
		bandpass.frequency.value = geometricMean
		bandpass.frequency.setValueAtTime(options.bandpassStart , time )	
		bandpass.frequency.exponentialRampToValueAtTime(geometricMean, time + options.attack )	
		bandpass.frequency.linearRampToValueAtTime( options.bandpassEnd, endAt )	

		// modulate and filter freqs
		oscillator.type = options.type
		oscillator.frequency.cancelScheduledValues(time)
		oscillator.frequency.setValueAtTime( options.triStart, time)
		oscillator.frequency.linearRampToValueAtTime( options.triEnd, endAt)	

		highpass.frequency.cancelScheduledValues(time)
		highpass.frequency.setValueAtTime( options.highpassStart, time)
		highpass.frequency.linearRampToValueAtTime( options.highpassEnd, endAt)
		return options
	}
	snare.cancel = () => {
		const now = audioContext.currentTime
		filterGain.gain.cancelScheduledValues(now)
		filterGain.gain.setValueAtTime(ZERO, now)
		gainTriangle.gain.cancelScheduledValues(now)
		gainTriangle.gain.setValueAtTime(ZERO, now)
	}
	snare.choke = (duration, chokeAt) => {
		chokeGains(audioContext, [filterGain.gain, gainTriangle.gain], duration, chokeAt)
	}
	return snare
}
export const createSnares = (audioContext, output , quantity=3) => createQueue(audioContext, output , createSnare, quantity)
