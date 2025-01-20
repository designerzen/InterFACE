import { ZERO } from '../audio'
import {createQueue} from '../synthesizers'

export const DEFAULT_SNARE_OPTIONS = {
	name:"Default Snare",
	velocity:1, 
	length : 0.4,
	// default bandpawss filter Q
	bandpassStart:90,
	bandpassEnd:1000,
	// frequency sweep
	triStart:90,
	triEnd:50,
	// filter sweep
	highpassStart:2000,
	highpassEnd:600,

	attack:0.05,
	decay:0.2,

	// type: "square"
	type: "triangle"
}

export const PRESET_LONG_SNARE_OPTIONS = {
	name:"Long Snare",
	velocity:1, 
	length : 1.2,
	// default bandpawss filter Q
	bandpassStart:90,
	bandpassEnd:1000,
	// frequency sweep
	triStart:90,
	triEnd:50,
	// filter sweep
	highpassStart:2000,
	highpassEnd:600,

	attack:0.07,
	decay:0.02,

	type: "triangle"
}

export const PRESET_HEAVY_SNARE_OPTIONS = {
	name:"Heavy Snare",
	velocity:1, 
	length : 0.9,
	// default bandpawss filter Q
	bandpassStart:30,
	bandpassEnd:1400,
	// frequency sweep
	triStart:90,
	triEnd:50,
	// filter sweep
	highpassStart:2000,
	highpassEnd:600,

	attack:0.07,
	decay:0.05,

	// type: "square"
	type: "triangle"
}

export const PRESET_SQUARE_SNARE_OPTIONS = {
	name:"Square Snare",
	velocity:1, 
	length : 0.3,
	// default bandpawss filter Q
	bandpassStart:90,
	bandpassEnd:1000,
	// frequency sweep
	triStart:90,
	triEnd:50,
	// filter sweep
	highpassStart:2000,
	highpassEnd:600,

	attack:0.07,
	decay:0.05,

	type: "square"
}

export const PRESET_STRONG_SNARE_OPTIONS = {
	name:"Strong Snare",
	velocity:1, 
	length : 1.1,
	// default bandpawss filter Q
	bandpassStart:90,
	bandpassEnd:1000,
	// frequency sweep
	triStart:90,
	triEnd:50,
	// filter sweep
	highpassStart:2000,
	highpassEnd:600,

	attack:0.009,
	decay:0.05,

	type: "square"
}

export const PRESET_SNARES = [
	DEFAULT_SNARE_OPTIONS,
	PRESET_HEAVY_SNARE_OPTIONS,
	PRESET_SQUARE_SNARE_OPTIONS,
	PRESET_LONG_SNARE_OPTIONS,
	PRESET_STRONG_SNARE_OPTIONS
]

export const getRandomSnarePreset = () => {
	const snareIndex = Math.floor(Math.random() * PRESET_SNARES.length)
	return PRESET_SNARES[snareIndex]
}

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
	
		const time = audioContext.currentTime
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
	return snare
}
export const createSnares = (audioContext, output , quantity=3) => createQueue(audioContext, output , createSnare, quantity)