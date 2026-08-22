import { ZERO } from '../audio-constants.js'
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
	PRESET_606_SNARE,
	PRESET_505_SNARE,
	PRESET_CASIO_RZ1_SNARE,
	PRESET_KORG_DDD1_SNARE,
	PRESET_KORG_KR55_SNARE,
	PRESET_BOSS_DR55_SNARE,
	PRESET_OBERHEIM_DMX_SNARE,
	PRESET_DRUMTRAKS_SNARE,
	PRESET_SP1200_SNARE,
	PRESET_YAMAHA_RX5_SNARE,
	PRESET_ALESIS_HR16_SNARE,
	PRESET_SIMMONS_SDSV_SNARE,
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
	getSnareVoiceLevels,
} from './snare-presets.js'

import { DEFAULT_SNARE_OPTIONS, getSnareVoiceLevels } from './snare-presets.js'

const SATURATION_CURVE_SIZE = 4096

export const createSnareSaturationCurve = (size=SATURATION_CURVE_SIZE) => {
	const curve = new Float32Array(size)
	const normalizer = Math.tanh(2.2)
	for (let index=0; index<size; index++) {
		const input = index * 2 / (size - 1) - 1
		curve[index] = Math.tanh(input * 2.2) / normalizer
	}
	return curve
}

/**
 * Create an instance of the snare instrument
 * @returns {Function} trigger start method
 */
export const createSnare = ( audioContext, output ) => {

	let isRunning = false
    const oscillator = audioContext.createOscillator()
    const gainTriangle = audioContext.createGain()
	const shellOscillator = audioContext.createOscillator()
	const shellGain = audioContext.createGain()
    const filterGain = audioContext.createGain()
	const crackGain = audioContext.createGain()
	const snareBus = audioContext.createGain()
	const dryGain = audioContext.createGain()
	const crunchDrive = audioContext.createGain()
	const crunchShaper = audioContext.createWaveShaper()
	const crunchTone = audioContext.createBiquadFilter()
	const crunchGain = audioContext.createGain()
	const outputGain = audioContext.createGain()
	const noise = audioContext.createBufferSource()
	const buffer = audioContext.createBuffer(1, 4096, audioContext.sampleRate)

	const bandpass = audioContext.createBiquadFilter()
    bandpass.type = "bandpass"
    bandpass.frequency.value = DEFAULT_SNARE_OPTIONS.bandpassStart


	// just allow these through
	const highpass = audioContext.createBiquadFilter()
	highpass.type = "highpass"
	highpass.frequency.value = DEFAULT_SNARE_OPTIONS.highpassStart

	const crackFilter = audioContext.createBiquadFilter()
	crackFilter.type = "bandpass"
	crackFilter.frequency.value = DEFAULT_SNARE_OPTIONS.crackFrequency
	crackFilter.Q.value = DEFAULT_SNARE_OPTIONS.crackQ
	crunchShaper.curve = createSnareSaturationCurve()
	crunchShaper.oversample = '2x'
	crunchTone.type = 'lowpass'

	oscillator.frequency.value = DEFAULT_SNARE_OPTIONS.triStart
	shellOscillator.frequency.value = DEFAULT_SNARE_OPTIONS.triStart * DEFAULT_SNARE_OPTIONS.shellRatio

	// TODO Cache the noise
	const data = buffer.getChannelData(0)
	for (var i = 0; i < 4096; i++) 
	{
		// top heavy noise
		data[i] = Math.random() * 2 - 1
	}

	noise.buffer = buffer
	noise.loop = true
	
	oscillator.connect(gainTriangle)
	gainTriangle.connect(snareBus)
	shellOscillator.connect(shellGain)
	shellGain.connect(snareBus)

	noise.connect(bandpass)
	noise.connect(crackFilter)
	crackFilter.connect(crackGain)
	crackGain.connect(snareBus)
	bandpass.connect(highpass)
	highpass.connect(filterGain)
	filterGain.connect(snareBus)

	// Preserve the unprocessed transient while blending in harmonics from a
	// driven soft clipper. Output trim keeps high-drive presets level-matched.
	snareBus.connect(dryGain)
	dryGain.connect(outputGain)
	snareBus.connect(crunchDrive)
	crunchDrive.connect(crunchShaper)
	crunchShaper.connect(crunchTone)
	crunchTone.connect(crunchGain)
	crunchGain.connect(outputGain)
	outputGain.connect(output)

	const snare = ( options = DEFAULT_SNARE_OPTIONS ) => {

		options = Object.assign({}, DEFAULT_SNARE_OPTIONS, options)
	
		const requestedTime = Number(options.triggerAt)
		const time = Number.isFinite(requestedTime) && requestedTime > 0
			? Math.max(audioContext.currentTime, requestedTime)
			: audioContext.currentTime + ZERO
		const endAt = time + options.length
		
		if (!isRunning)
		{
			//gainNode.gain.value = 1			
			try{
				oscillator.start(time)
				shellOscillator.start(time)
				//osc3.stop(audioContext.currentTime + 0.2)
				noise.start(time)
				//node.stop(audioContext.currentTime + 0.2)	
			}catch(error){
			}
			isRunning = true
		}	

		// console.log("SNARE",{options})

		const levels = getSnareVoiceLevels(options)
		const mix = Math.min(1, Math.max(0, Number(options.crunchMix) || 0))
		const drive = Math.max(1, Number(options.drive) || 1)
		const tone = Math.min(audioContext.sampleRate * 0.45, Math.max(300, Number(options.crunchTone) || 7200))
		const level = Number.isFinite(Number(options.outputGain))
			? Math.max(0, Number(options.outputGain))
			: 1
		for (const [parameter, value] of [
			[dryGain.gain, 1 - mix],
			[crunchDrive.gain, drive],
			[crunchGain.gain, mix],
			[outputGain.gain, level],
		]) {
			parameter.cancelScheduledValues(time)
			parameter.setValueAtTime(value, time)
		}
		crunchTone.frequency.cancelScheduledValues(time)
		crunchTone.frequency.setValueAtTime(tone, time)

		filterGain.gain.cancelScheduledValues(time)
		filterGain.gain.setValueAtTime(levels.noise, time)
		filterGain.gain.exponentialRampToValueAtTime(ZERO, endAt)
	
		gainTriangle.gain.cancelScheduledValues(time)
		gainTriangle.gain.setValueAtTime(levels.body, time)
		gainTriangle.gain.exponentialRampToValueAtTime(ZERO, Math.min(endAt, time + options.bodyLength))

		shellGain.gain.cancelScheduledValues(time)
		shellGain.gain.setValueAtTime(levels.shell, time)
		shellGain.gain.exponentialRampToValueAtTime(ZERO, Math.min(endAt, time + options.shellLength))

		crackGain.gain.cancelScheduledValues(time)
		crackGain.gain.setValueAtTime(levels.crack, time)
		crackGain.gain.exponentialRampToValueAtTime(ZERO, Math.min(endAt, time + options.crackLength))
		crackFilter.Q.setValueAtTime(options.crackQ, time)
		crackFilter.frequency.cancelScheduledValues(time)
		crackFilter.frequency.setValueAtTime(options.crackFrequency, time)
		crackFilter.frequency.exponentialRampToValueAtTime(options.crackEnd, Math.min(endAt, time + options.crackLength))

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
		// Harder strikes tighten the head slightly, as on an acoustic drum.
		const pitchResponse = 0.94 + Math.min(1.25, options.velocity) * 0.1
		oscillator.frequency.setValueAtTime(options.triStart * pitchResponse, time)
		oscillator.frequency.exponentialRampToValueAtTime(
			Math.max(20, options.triEnd * pitchResponse),
			Math.min(endAt, time + 0.09)
		)
		shellOscillator.type = options.shellType
		shellOscillator.frequency.cancelScheduledValues(time)
		shellOscillator.frequency.setValueAtTime(options.triStart * options.shellRatio * pitchResponse, time)
		shellOscillator.frequency.exponentialRampToValueAtTime(
			Math.max(20, options.triEnd * options.shellRatio * pitchResponse),
			Math.min(endAt, time + options.shellLength)
		)

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
		shellGain.gain.cancelScheduledValues(now)
		shellGain.gain.setValueAtTime(ZERO, now)
		crackGain.gain.cancelScheduledValues(now)
		crackGain.gain.setValueAtTime(ZERO, now)
	}
	snare.choke = (duration, chokeAt) => {
		chokeGains(audioContext, [filterGain.gain, gainTriangle.gain, shellGain.gain, crackGain.gain], duration, chokeAt)
	}
	return snare
}
export const createSnares = (audioContext, output , quantity=3) => createQueue(audioContext, output , createSnare, quantity)
