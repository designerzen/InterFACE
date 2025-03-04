import { ZERO } from '../audio'
import {createQueue} from '../synthesizers'

export const DEFAULT_TOM_OPTIONS = {
	name:"Default Tom",
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

export const PRESET_TECH_HOUSE_TOM = Object.assign({},DEFAULT_TOM_OPTIONS,{
	name:"Tech House Tom",
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

export const PRESET_BEEFY_TOM = Object.assign({},DEFAULT_TOM_OPTIONS,{
	name:"Beefy Tom",
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

export const PRESET_LOW_TOM = Object.assign({},DEFAULT_TOM_OPTIONS,{
	name:"Low Tom",
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

export const PRESETS_TOMS = [
	DEFAULT_TOM_OPTIONS,
	PRESET_TECH_HOUSE_TOM,
	PRESET_BEEFY_TOM,
	PRESET_LOW_TOM
]

export const getRandomKTomPreset = () => {
	const tomIndex = Math.floor(Math.random() * PRESETS_TOMS.length)
	return PRESETS_TOMS[tomIndex]
}

/**
 * Kick me!
 * @returns {Function} trigger start method
 */
export const createTom = (audioContext, output ) => {

	const triangleOscillator = audioContext.createOscillator()
	const sineOscillator = audioContext.createOscillator()
	const gainTriangle = audioContext.createGain()
	const gainSine = audioContext.createGain()
	let isRunning = false

	triangleOscillator.type = "triangle"
	sineOscillator.type = "sine"
	
	// sustain measured in volume rather than time
	const tom = ( options=DEFAULT_TOM_OPTIONS ) => {

		options = Object.assign({}, DEFAULT_TOM_OPTIONS, options )
		const time = audioContext.currentTime + ZERO
		const endAt = time + options.length
		
		// console.log("KICK", options )

		if (!isRunning)
		{
			try{
				triangleOscillator.start(time)
				sineOscillator.start(time)

				//osc4.stop(time + 0.05)  			
			}catch(error){
	
			}
			isRunning = true
		}
 
		// clear anything from previous plays
		gainTriangle.gain.cancelScheduledValues(time)
		gainSine.gain.cancelScheduledValues(time)
		
		triangleOscillator.frequency.cancelScheduledValues(time)
		sineOscillator.frequency.cancelScheduledValues(time)

		// set new envelopes

		// TRIANGLE
		gainTriangle.gain.setValueAtTime(ZERO, time)
		gainTriangle.gain.exponentialRampToValueAtTime( options.velocity, time + options.attack)
		gainTriangle.gain.exponentialRampToValueAtTime( options.sustain, time + options.attack + options.decay)
		gainTriangle.gain.exponentialRampToValueAtTime(ZERO, endAt)

		triangleOscillator.frequency.setValueAtTime(options.triStart, time)
		triangleOscillator.frequency.exponentialRampToValueAtTime(options.triEnd, endAt)
	
		// SINE
		gainSine.gain.setValueAtTime(ZERO, time)
		gainSine.gain.exponentialRampToValueAtTime( options.velocity, time + options.attack)
		gainSine.gain.exponentialRampToValueAtTime( options.sustain, time + options.attack + options.decay)
		gainSine.gain.exponentialRampToValueAtTime(ZERO, endAt)

		sineOscillator.frequency.setValueAtTime(options.sineStart, time)
		sineOscillator.frequency.exponentialRampToValueAtTime(options.sineApex, time + options.attack)
		sineOscillator.frequency.exponentialRampToValueAtTime(options.sineSustain || options.sineApex, time + options.attack + options.decay)
		sineOscillator.frequency.exponentialRampToValueAtTime(options.sineEnd, endAt)

		//  osc.stop(audioContext.currentTime + duration)
		//  osc2.stop(audioContext.currentTime + duration)
		return options
	}
 
	triangleOscillator.connect(gainTriangle)
	gainTriangle.connect(output)
	
	sineOscillator.connect(gainSine)
	gainSine.connect(output)

	return tom
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
export const createToms = (audioContext, output, quantity=2) => createQueue( audioContext, output , createTom, quantity)