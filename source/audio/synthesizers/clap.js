import { ZERO } from '../audio-constants.js'
import {createQueue, chokeGains} from '../synthesizers'

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
 * Create an instance of the clap instrument
 * @returns {Function} trigger start method
 */
export const createClap = ( audioContext, output ) => {
	
	let isRunning = false
	const noiseGain = audioContext.createGain()
	const noise = audioContext.createBufferSource()
	const buffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate)

	// Classic analogue claps are a cluster of short, band-limited noise bursts.
	const bandpassFilter = audioContext.createBiquadFilter()
	bandpassFilter.type = "bandpass"
	bandpassFilter.frequency.value = DEFAULT_CLAP_OPTIONS.bandpass
	bandpassFilter.Q.value = DEFAULT_CLAP_OPTIONS.bandpassQ

	const highpassFilter = audioContext.createBiquadFilter()
	highpassFilter.type = "highpass"
	highpassFilter.frequency.value = DEFAULT_CLAP_OPTIONS.highpass

	const data = buffer.getChannelData(0)
	for (let i = 0; i < data.length; i++)
	{
		// Bipolar noise avoids the large DC offset produced by Math.random().
		data[i] = Math.random() * 2 - 1
	}

	noise.buffer = buffer
	noise.loop = true
	
	noise.connect(bandpassFilter)
	bandpassFilter.connect(highpassFilter)
	highpassFilter.connect(noiseGain)
	noiseGain.connect(output)

	const clap = ( options=DEFAULT_CLAP_OPTIONS) => {
	
		options = Object.assign({},DEFAULT_CLAP_OPTIONS,options)
	
		const requestedTime = options.triggerAt > 0 ? options.triggerAt : audioContext.currentTime + ZERO
		const time = Math.max(audioContext.currentTime, requestedTime)
		const endAt = time + options.length
		if (!isRunning)	
		{
			try{
				noise.start(time)
			}catch(error){
			}
			isRunning = true
		}

		// Older presets used `6` as if BiquadFilter.gain controlled a high-pass.
		// Preserve those presets with a musically useful cutoff instead.
		const highpass = options.highpass > 20 ? options.highpass : DEFAULT_CLAP_OPTIONS.highpass
		highpassFilter.frequency.cancelScheduledValues(time)
		highpassFilter.frequency.setValueAtTime(highpass, time)
		bandpassFilter.frequency.cancelScheduledValues(time)
		bandpassFilter.frequency.setValueAtTime(options.bandpass, time)
		bandpassFilter.Q.cancelScheduledValues(time)
		bandpassFilter.Q.setValueAtTime(options.bandpassQ, time)

		const peak = Math.max(ZERO, options.velocity * options.noiseLevel)
		const burstFloor = Math.max(ZERO, peak * options.burstFloor)
		const burstOffsets = options.burstOffsets.length ? options.burstOffsets : [0]
		const lastBurstAt = time + burstOffsets[burstOffsets.length - 1]
		const tailAt = Math.min(endAt, lastBurstAt + options.burstDecay)

		noiseGain.gain.cancelScheduledValues(time)
		noiseGain.gain.setValueAtTime(ZERO, time)
		burstOffsets.forEach(offset => {
			const burstAt = Math.min(endAt, time + offset)
			const burstEndAt = Math.min(endAt, burstAt + options.burstDecay)
			noiseGain.gain.setValueAtTime(peak, burstAt)
			noiseGain.gain.exponentialRampToValueAtTime(burstFloor, burstEndAt)
		})
		noiseGain.gain.setValueAtTime(Math.max(ZERO, peak * options.tailLevel), tailAt)
		noiseGain.gain.exponentialRampToValueAtTime(ZERO, endAt)

		return options
	}
	clap.cancel = () => {
		const now = audioContext.currentTime
		noiseGain.gain.cancelScheduledValues(now)
		noiseGain.gain.setValueAtTime(ZERO, now)
	}
	clap.choke = (duration, chokeAt) => {
		chokeGains(audioContext, [noiseGain.gain], duration, chokeAt)
	}
	return clap
}

export const createClaps = (audioContext, output , quantity=3) => createQueue(audioContext, output , createClap, quantity)
