import { ZERO } from '../audio'
import {createQueue, chokeGains} from '../synthesizers'

// Cowbell presets live in their own file - re-export for backwards compat
export {
	DEFAULT_COWBELL_OPTIONS,
	PRESET_808_COWBELL,
	PRESET_909_COWBELL,
	PRESET_CR78_COWBELL,
	PRESET_LOW_COWBELL,
	PRESET_HIGH_COWBELL,
	PRESET_TUNED_LOW_COWBELL,
	PRESET_TUNED_HIGH_COWBELL,
	PRESET_DRY_COWBELL,
	PRESET_RINGING_COWBELL,
	PRESET_DAMPENED_COWBELL,
	PRESET_DISTORTED_COWBELL,
	PRESET_LOFI_COWBELL,
	PRESET_BRIGHT_COWBELL,
	PRESET_DARK_COWBELL,
	PRESET_TIGHT_COWBELL,
	PRESET_LONG_COWBELL,
	PRESET_CASCABEL_COWBELL,
	PRESET_AGOGO_COWBELL,
	PRESET_TRIANGLE_BELL,
	PRESET_TUBULAR_BELL,
	PRESET_WOODBLOCK_COWBELL,
	PRESET_SALSA_LOW_COWBELL,
	PRESET_SALSA_HIGH_COWBELL,
	PRESET_DEEP_RING_COWBELL,
	PRESET_MUTED_HAND_COWBELL,
	PRESET_BENT_COWBELL,
	PRESET_SOFT_STUDIO_COWBELL,
	PRESET_BRUSHED_COWBELL,
	PRESET_WARM_ANALOG_COWBELL,
	PRESET_GLASS_COWBELL,
	PRESET_TAPE_COWBELL,
	PRESET_FUNK_COWBELL,
	PRESET_DUB_COWBELL,
	PRESET_MINIMAL_CLICK_COWBELL,
	PRESET_AFRO_COWBELL,
	PRESET_ORBITAL_BELL,
	PRESET_INDUSTRIAL_PLATE,
	PRESET_ACOUSTIC_SMALL_COWBELL,
	PRESET_COWBELLS,
	getCowbellEnvelopeLevels,
	getCowbellPresetForStyle,
	getRandomCowbellPreset,
	getCowbellPresets,
} from './cowbell-presets.js'

import { DEFAULT_COWBELL_OPTIONS, getCowbellEnvelopeLevels, resolveCowbellHitOptions } from './cowbell-presets.js'

const centsRatio = cents => 2 ** (cents / 1200)

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

	const partialGains = []
	const oscillators = ratios.map((ratio, index) => {
        const oscillator = audioContext.createOscillator()
		const partialGain = audioContext.createGain()
		partialGain.gain.value = DEFAULT_COWBELL_OPTIONS.partialLevels[index] ?? 1
		partialGains.push(partialGain)
		oscillator.type = DEFAULT_COWBELL_OPTIONS.waveforms[index] ?? "square"
		oscillator.frequency.value = fundamental * ratio
		oscillator.connect(partialGain)
		partialGain.connect(bandpass)
		return oscillator
    })

	bandpass.connect(cowbellGainNode)
	cowbellGainNode.connect(output)
	
	const cowbell = ( options=DEFAULT_COWBELL_OPTIONS)=>{
		
		options = resolveCowbellHitOptions(options)
	
		const time = options.triggerAt ?? audioContext.currentTime + ZERO
		
		if (!isRunning)
		{			
			try{
				oscillators.forEach( oscillator => oscillator.start(time) )
				isRunning = true
				//osc4.stop(time + 0.05)  			
			}catch(error){

			}
		}

		bandpass.frequency.cancelScheduledValues(time)
		bandpass.frequency.setValueAtTime(options.bandpass, time)
		bandpass.frequency.exponentialRampToValueAtTime(Math.max(40, options.bandpass * options.filterSweep), time + Math.min(options.length, options.filterSweepTime))
		bandpass.Q.setValueAtTime(options.q, time)
		
		// clear anything from previous plays
		oscillators.forEach( (oscillator, i) => {
			const ratio = options.ratios[i] !== undefined ? options.ratios[i] : DEFAULT_COWBELL_OPTIONS.ratios[i]
			const endFrequency = options.fundamental * ratio
			oscillator.type = options.waveforms[i] ?? DEFAULT_COWBELL_OPTIONS.waveforms[i] ?? "square"
			partialGains[i].gain.setValueAtTime(options.partialLevels[i] ?? 1, time)
			oscillator.frequency.cancelScheduledValues(time) 
			oscillator.frequency.setValueAtTime(endFrequency * centsRatio(options.pitchSweep), time)
			oscillator.frequency.exponentialRampToValueAtTime(endFrequency, time + Math.min(options.pitchSweepTime, options.length * 0.35))
		})
		
		// set new envelopes
		cowbellGainNode.gain.cancelScheduledValues(time)
		cowbellGainNode.gain.setValueAtTime( ZERO, time)
		const levels = getCowbellEnvelopeLevels(options)
		cowbellGainNode.gain.exponentialRampToValueAtTime(levels.peak, time + options.attack)
		cowbellGainNode.gain.exponentialRampToValueAtTime(levels.sustain, time + options.attack + options.decay)
		cowbellGainNode.gain.linearRampToValueAtTime(ZERO, time + options.length )	
		return options
	}
	cowbell.cancel = () => {
		const now = audioContext.currentTime
		cowbellGainNode.gain.cancelScheduledValues(now)
		cowbellGainNode.gain.setValueAtTime(ZERO, now)
	}
	cowbell.choke = (duration, chokeAt) => {
		chokeGains(audioContext, [cowbellGainNode.gain], duration, chokeAt)
	}
	return cowbell
}

export const createCowbells = (audioContext, output , quantity=2) => createQueue(audioContext, output , createCowbell, quantity)
