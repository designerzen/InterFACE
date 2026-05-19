import { createKick, createKicks } from './synthesizers/kick' 
import { createClack, createClacks } from './synthesizers/clack' 
import { createHihat, createHihats } from './synthesizers/hihat' 
import { createCowbell, createCowbells } from './synthesizers/cowbell' 
import { createSnare, createSnares } from './synthesizers/snare' 
import { createClap, createClaps } from './synthesizers/clap' 

/**
 * Just a drum kit you can play that has one of each of the
 * drum sounds set up in cascades. simply createDrumkit().kick() etc
 * @returns {Object<Function>} all individual instruments
 */
export const createDrumkit = ( audioContext, output ) => {
	
	const drumkit = {
		kick : createKick(audioContext, output),
		snare : createSnare(audioContext, output),
		hat : createHihat(audioContext, output),
		cowbell : createCowbell(audioContext, output),
		clack : createClack(audioContext, output),
		clap : createClap(audioContext, output),
	}

	// you can set the options on the individual instruments

	// drumkit.setOptions = (options) => {
	// 	for (let key in options)
	// 	{
	// 		drumkit.kick[key] = options[key]
	// 		drumkit.snare[key] = options[key]
	// 		drumkit.hat[key] = options[key]
	// 		drumkit.cowbell[key] = options[key]
	// 		drumkit.clack[key] = options[key]
	// 		drumkit.clap[key] = options[key]
	// 	}
	// }

	drumkit.cancel = () => {
		drumkit.kick.cancel?.()
		drumkit.snare.cancel?.()
		drumkit.hat.cancel?.()
		drumkit.cowbell.cancel?.()
		drumkit.clack.cancel?.()
		drumkit.clap.cancel?.()
	}

	drumkit.choke = (duration, chokeAt) => {
		drumkit.kick.choke?.(duration, chokeAt)
		drumkit.snare.choke?.(duration, chokeAt)
		drumkit.hat.choke?.(duration, chokeAt)
		drumkit.cowbell.choke?.(duration, chokeAt)
		drumkit.clack.choke?.(duration, chokeAt)
		drumkit.clap.choke?.(duration, chokeAt)
	}

	return drumkit
}
