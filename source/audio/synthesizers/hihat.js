import { ZERO } from '../audio-constants.js'
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
	OPEN_HIHAT_CRASH_WARM,
	OPEN_HIHAT_CRASH_THIN,
	OPEN_HIHAT_CRASH_DARK,
	OPEN_HIHAT_CRASH_SUSPENDED,
	OPEN_HIHAT_RIDE,
	OPEN_HIHAT_SPLASH,
	OPEN_HIHAT_CHINA,
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
	let activeNoiseGain = null
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
	let noiseBuffer = null
	const getNoiseBuffer = () => {
		if (noiseBuffer) return noiseBuffer
		noiseBuffer = audioContext.createBuffer(1, Math.ceil(audioContext.sampleRate * 4), audioContext.sampleRate)
		const noiseData = noiseBuffer.getChannelData(0)
		for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1
		return noiseBuffer
	}

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

		const requestedTime = Number(options.triggerAt)
		const time = Number.isFinite(requestedTime) && requestedTime > 0
			? Math.max(audioContext.currentTime, requestedTime)
			: audioContext.currentTime + ZERO

		if (!isRunning)
		{
			try{
				oscillators.forEach( oscillator => oscillator.start(time) )			
			}catch(error){}
			isRunning = true
		}
		
		bandpassFilter.frequency.cancelScheduledValues(time)
		bandpassFilter.frequency.setValueAtTime(options.bandpass, time)
		bandpassFilter.Q.cancelScheduledValues(time)
		bandpassFilter.Q.setValueAtTime(options.bandpassQ, time)

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
		const levels = getVelocityEnvelopeLevels(options, SATURATE * options.metallicGain)
		gainNode.gain.cancelScheduledValues(time)
		gainNode.gain.setValueAtTime( ZERO, time)
		gainNode.gain.exponentialRampToValueAtTime(levels.peak, time + options.attack )
		gainNode.gain.linearRampToValueAtTime(levels.sustain, time + options.attack + options.decay)
		gainNode.gain.linearRampToValueAtTime(levels.sustain, time + options.length - options.release)
		gainNode.gain.linearRampToValueAtTime( ZERO, time + options.length)

		if (options.noiseGain > 0) {
			const noise = audioContext.createBufferSource()
			const noiseHighpass = audioContext.createBiquadFilter()
			const noiseLowpass = audioContext.createBiquadFilter()
			const noiseGain = audioContext.createGain()
			const noisePeak = options.velocity * options.noiseGain
			const noiseSustain = noisePeak * options.sustain
			const noiseAttackEnd = time + options.noiseAttack
			const noiseDecayEnd = Math.min(time + options.length - options.release, noiseAttackEnd + options.noiseDecay)

			noise.buffer = getNoiseBuffer()
			noiseHighpass.type = "highpass"
			noiseHighpass.frequency.setValueAtTime(options.noiseHighpass, time)
			noiseLowpass.type = "lowpass"
			noiseLowpass.frequency.setValueAtTime(
				Math.min(options.noiseLowpass, audioContext.sampleRate * 0.45), time
			)
			noiseLowpass.Q.value = 0.35
			noiseGain.gain.setValueAtTime(ZERO, time)
			noiseGain.gain.linearRampToValueAtTime(noisePeak, noiseAttackEnd)
			noiseGain.gain.linearRampToValueAtTime(noiseSustain, noiseDecayEnd)
			noiseGain.gain.linearRampToValueAtTime(ZERO, time + options.length)

			noise.connect(noiseHighpass)
			noiseHighpass.connect(noiseLowpass)
			noiseLowpass.connect(noiseGain)
			noiseGain.connect(output)
			noise.start(time)
			noise.stop?.(time + options.length)
			activeNoiseGain = noiseGain.gain
		}

		return options
	}
	hihat.cancel = () => {
		const now = audioContext.currentTime
		gainNode.gain.cancelScheduledValues(now)
		gainNode.gain.setValueAtTime(ZERO, now)
		activeNoiseGain?.cancelScheduledValues(now)
		activeNoiseGain?.setValueAtTime(ZERO, now)
	}
	hihat.choke = (duration, chokeAt) => {
		chokeGains(audioContext, [gainNode.gain, activeNoiseGain].filter(Boolean), duration, chokeAt)
	}
	return hihat
}

export const createHihats = (audioContext, output , quantity=3) => createQueue(audioContext, output , createHihat, quantity)
