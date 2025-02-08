import { ZERO } from '../audio'
import {createQueue} from '../synthesizers'

export const DEFAULT_KICK_OPTIONS = {
	name:"Default Kick",
	velocity:1, 
	length:0.15, 
	attack:0.0001, 
	decay:0.01, 
	// sustain is a volume not a time
	sustain:0.9, 
	release:0.001,

	// frequencies
	triStart:110,
	triEnd:50,

	sineStart:120,
	sineApex:150,
	sineSustain:100,
	sineEnd:50,
}

export const PRESET_TECH_HOUSE_KICK = Object.assign({},DEFAULT_KICK_OPTIONS,{
	name:"Tech House Kick",
	velocity:1, 
	length:0.07, 
	attack:0.0001, 
	decay:0.005, 
	// sustain is a volume not a time
	sustain:0.8, 
	release:0.01,

	// frequencies
	triStart:90,
	triEnd:50,

	sineStart:80,
	sineApex:130,
	sineSustain:90,
	sineEnd:20,
})

export const PRESET_BEEFY_KICK = Object.assign({},DEFAULT_KICK_OPTIONS,{
	name:"Beefy Kick",
	velocity:1.2, 
	length:0.05, 
	attack:0.001, 
	decay:0.005, 
	// sustain is a volume not a time
	sustain:0.94, 
	release:0.01,

	// frequencies
	triStart:90,
	triEnd:50,

	sineStart:80,
	sineApex:100,
	sineSustain:90,
	sineEnd:20,
})

export const PRESET_LOW_KICK = Object.assign({},DEFAULT_KICK_OPTIONS,{
	name:"Low Kick",
	velocity:1.0, 
	length:1.08, 
	attack:0.01, 
	decay:0.03, 
	// sustain is a volume not a time
	sustain:0.61, 
	release:0.832,

	// frequencies
	triStart:53,
	triEnd:37,

	sineStart:63,
	sineApex:18,
	sineSustain:60,
	sineEnd:200,
})

export const PRESET_THUD_KICK = Object.assign({},DEFAULT_KICK_OPTIONS,{
	name:"Thud Kick",
	velocity:2.3, 
	length:2.1, 
	attack:0.01, 
	decay:0.25, 
	// sustain is a volume not a time
	sustain:0.77, 
	release:0.789,

	// frequencies
	triStart:63,
	triEnd:37,

	sineStart:209,
	sineApex:317,
	sineSustain:14,
	sineEnd:76,
})

export const PRESETS_KICKS = [
	DEFAULT_KICK_OPTIONS,
	PRESET_TECH_HOUSE_KICK,
	PRESET_BEEFY_KICK,
	PRESET_LOW_KICK,
	PRESET_THUD_KICK
]

export const getRandomKickPreset = () => {
	const kickIndex = Math.floor(Math.random() * PRESETS_KICKS.length)
	return PRESETS_KICKS[kickIndex]
}

/**
 * Kick me!
 * @returns {Function} trigger start method
 */
export const createKick = (audioContext, output ) => {

    const mainOscillator = audioContext.createOscillator()
    const subOscillator = audioContext.createOscillator()
    const gainTriangle = audioContext.createGain()
    const gainSine = audioContext.createGain()
	let isRunning = false

    mainOscillator.type = "triangle"
    subOscillator.type = "sine"
	
	// sustain measured in volume rather than time
	const kick = ( options=DEFAULT_KICK_OPTIONS ) => {

		options = Object.assign({}, DEFAULT_KICK_OPTIONS, options )
		const time = audioContext.currentTime + ZERO
		const endAt = time + options.length
		
		// console.log("KICK", options )

		if (!isRunning)
		{
			try{
				mainOscillator.start(time)
				subOscillator.start(time)

				//osc4.stop(time + 0.05)  			
			}catch(error){
	
			}
			isRunning = true
		}
 
		// clear anything from previous plays
		gainTriangle.gain.cancelScheduledValues(time)
		gainSine.gain.cancelScheduledValues(time)
		
		mainOscillator.frequency.cancelScheduledValues(time)
		subOscillator.frequency.cancelScheduledValues(time)

		// set new envelopes

		// TRIANGLE
		gainTriangle.gain.setValueAtTime(ZERO, time)
		gainTriangle.gain.exponentialRampToValueAtTime( options.velocity, time + options.attack)
		gainTriangle.gain.exponentialRampToValueAtTime( options.sustain, time + options.attack + options.decay)
		gainTriangle.gain.exponentialRampToValueAtTime(ZERO, endAt)

		mainOscillator.frequency.setValueAtTime(options.triStart, time)
		mainOscillator.frequency.exponentialRampToValueAtTime(options.triEnd, endAt)
	
		// SINE
		gainSine.gain.setValueAtTime(ZERO, time)
		gainSine.gain.exponentialRampToValueAtTime( options.velocity, time + options.attack)
		gainSine.gain.exponentialRampToValueAtTime( options.sustain, time + options.attack + options.decay)
		gainSine.gain.exponentialRampToValueAtTime(ZERO, endAt)

		subOscillator.frequency.setValueAtTime(options.sineStart, time)
		subOscillator.frequency.exponentialRampToValueAtTime(options.sineApex, time + options.attack)
		subOscillator.frequency.exponentialRampToValueAtTime(options.sineSustain || options.sineApex, time + options.attack + options.decay)
		subOscillator.frequency.exponentialRampToValueAtTime(options.sineEnd, endAt)

		return options
	}
 
    mainOscillator.connect(gainTriangle)
    gainTriangle.connect(output)
	
	subOscillator.connect(gainSine)
	gainSine.connect(output)

	return kick
}

// export const createKicks = (quantity=5) => {

// 	const kicks = []
// 	for (let i=0; i < quantity; ++i)
// 	{
// 		const kick = createKick()
// 		kicks.push( kick )
// 	}

// 	// interface to play
// 	let index = 0
// 	const fetchNextKick = (attack=0.01,duration=0.5) => {
// 		index = index + 1 < quantity ? index + 1 : 0
// 		const kick = kicks[index]
// 		kick(attack, duration)
// 	}
// 	return fetchNextKick
// }

// this is just an array of kicks
export const createKicks = (audioContext, output, quantity=2) => createQueue( audioContext, output , createKick, quantity)