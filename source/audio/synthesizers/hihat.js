import { ZERO } from '../audio'
import {createQueue, chokeGains} from '../synthesizers'

// Hihat presets live in their own file - re-export everything for
// backwards compatibility with existing imports.
export {
	DEFAULT_OPEN_HIHAT,
	DEFAULT_CLOSED_HIHAT,
	CLOSED_HIHAT_TINY,
	CLOSED_HIHAT_808,
	CLOSED_HIHAT_909,
	CLOSED_HIHAT_606,
	CLOSED_HIHAT_505,
	CLOSED_HIHAT_CASIO_RZ1,
	CLOSED_HIHAT_KORG_DDD1,
	CLOSED_HIHAT_KORG_KR55,
	CLOSED_HIHAT_CR78,
	CLOSED_HIHAT_707,
	CLOSED_HIHAT_LINNDRUM,
	CLOSED_HIHAT_BOSS_DR55,
	CLOSED_HIHAT_OBERHEIM_DMX,
	CLOSED_HIHAT_DRUMTRAKS,
	CLOSED_HIHAT_SP1200,
	CLOSED_HIHAT_YAMAHA_RX5,
	CLOSED_HIHAT_ALESIS_HR16,
	CLOSED_HIHAT_SIMMONS_SDSV,
	CLOSED_HIHAT_TIGHT,
	CLOSED_HIHAT_METALLIC,
	CLOSED_HIHAT_LOFI,
	CLOSED_HIHAT_TRAP,
	CLOSED_HIHAT_HOUSE,
	CLOSED_HIHAT_TECHNO,
	CLOSED_HIHAT_GLASS,
	CLOSED_HIHAT_DARK,
	CLOSED_HIHAT_CHATTERY,
	OPEN_HIHAT_TINY,
	OPEN_HIHAT_SHORT,
	OPEN_HIHAT_808,
	OPEN_HIHAT_909,
	OPEN_HIHAT_606,
	OPEN_HIHAT_505,
	OPEN_HIHAT_CASIO_RZ1,
	OPEN_HIHAT_KORG_DDD1,
	OPEN_HIHAT_KORG_KR55,
	OPEN_HIHAT_CR78,
	OPEN_HIHAT_707,
	OPEN_HIHAT_LINNDRUM,
	OPEN_HIHAT_BOSS_DR55,
	OPEN_HIHAT_OBERHEIM_DMX,
	OPEN_HIHAT_DRUMTRAKS,
	OPEN_HIHAT_SP1200,
	OPEN_HIHAT_YAMAHA_RX5,
	OPEN_HIHAT_ALESIS_HR16,
	OPEN_HIHAT_SIMMONS_SDSV,
	OPEN_HIHAT_LONG,
	OPEN_HIHAT_SIZZLE,
	OPEN_HIHAT_HOUSE,
	OPEN_HIHAT_TECHNO,
	OPEN_HIHAT_TRAP,
	OPEN_HIHAT_DISTORTED,
	OPEN_HIHAT_SHIMMER,
	OPEN_HIHAT_LOFI,
	OPEN_HIHAT_DARK,
	OPEN_HIHAT_CRASH,
	OPEN_HIHAT_RIDE,
	PRESET_HIHATS,
	PRESET_HIHATS_CLOSED,
	PRESET_HIHATS_OPEN,
	getRandomHihatPreset,
	getRandomClosedHihatPreset,
	getRandomOpenHihatPreset,
	getHihatPair,
	getHihatPresets,
} from './hihat-presets.js'

import { DEFAULT_CLOSED_HIHAT } from './hihat-presets.js'
import { getVelocityEnvelopeLevels } from './percussion-envelope.js'

/**
 * 
 * Create an instance of the hi-hat instrument
 * @returns {Function} trigger start method
 */
export const createHihat = (audioContext, output ) => {

	let isRunning = false
    const gainNode = audioContext.createGain()
    const {ratios, fundamental, bandpass, highpass, type} = DEFAULT_CLOSED_HIHAT

    const bandpassFilter = audioContext.createBiquadFilter()
    bandpassFilter.type = "bandpass"
    bandpassFilter.frequency.value = bandpass

    const highpassFilter = audioContext.createBiquadFilter()
    highpassFilter.type = "highpass"
    highpassFilter.frequency.value = highpass

	const lowpassFilter = audioContext.createBiquadFilter()
	lowpassFilter.type = "lowpass"
	lowpassFilter.frequency.value = DEFAULT_CLOSED_HIHAT.lowpass
	lowpassFilter.Q.value = 0.45

	// Metallic oscillators sum strongly; retain presence without allowing dense
	// rolls to multiply into a clipped burst at the percussion bus.
	const SATURATE = 1.35

    const oscillators = ratios.map((ratio) => {
        const oscillator = audioContext.createOscillator()
        oscillator.type = type
		oscillator.frequency.value = fundamental * ratio
		oscillator.connect(bandpassFilter)
		// oscillator.start(audioContext.currentTime)
		// console.info("Oscillator",oscillator.frequency.value,{oscillator, bandpassFilter})
		return oscillator
    })

	bandpassFilter.connect(highpassFilter)
	highpassFilter.connect(lowpassFilter)
	lowpassFilter.connect(gainNode)
	gainNode.connect(output)
	
	const hihat = ( options=DEFAULT_CLOSED_HIHAT )=>{

		options = Object.assign({},DEFAULT_CLOSED_HIHAT,options)

		const time = options.triggerAt ?? audioContext.currentTime + ZERO

		if (!isRunning)
		{
			try{
				oscillators.forEach( oscillator => oscillator.start(time) )			
			}catch(error){}
			isRunning = true
		}
		
		bandpassFilter.frequency.cancelScheduledValues(time)
		bandpassFilter.frequency.setValueAtTime(options.bandpass, time)

		// high pass filter
		highpassFilter.frequency.cancelScheduledValues(time)
		highpassFilter.frequency.setValueAtTime(options.highpass, time)

		// Remove the brittle top octave while retaining the metallic band.
		const safeLowpass = Math.min(options.lowpass, audioContext.sampleRate * 0.45)
		lowpassFilter.frequency.cancelScheduledValues(time)
		lowpassFilter.frequency.setValueAtTime(safeLowpass, time)
	
		// clear anything from previous plays
		oscillators.forEach((oscillator, i) => {
			const ratio = options.ratios[i] ?? DEFAULT_CLOSED_HIHAT.ratios[i]
			oscillator.type = options.type
			oscillator.frequency.cancelScheduledValues(time)
			oscillator.frequency.setValueAtTime(options.fundamental * ratio, time)
		})
			// console.info("hat", {isRunning, options, time, oscillators})
	
		// set new ADSR envelopes
		const levels = getVelocityEnvelopeLevels(options, SATURATE)
		gainNode.gain.cancelScheduledValues(time)
		gainNode.gain.setValueAtTime( ZERO, time)
		gainNode.gain.exponentialRampToValueAtTime(levels.peak, time + options.attack )
		gainNode.gain.linearRampToValueAtTime(levels.sustain, time + options.attack + options.decay)
		gainNode.gain.linearRampToValueAtTime(levels.sustain, time + options.length - options.release)
		gainNode.gain.linearRampToValueAtTime( ZERO, time + options.length)

		return options
	}
	hihat.cancel = () => {
		const now = audioContext.currentTime
		gainNode.gain.cancelScheduledValues(now)
		gainNode.gain.setValueAtTime(ZERO, now)
	}
	hihat.choke = (duration, chokeAt) => {
		chokeGains(audioContext, [gainNode.gain], duration, chokeAt)
	}
	return hihat
}

export const createHihats = (audioContext, output , quantity=3) => createQueue(audioContext, output , createHihat, quantity)
