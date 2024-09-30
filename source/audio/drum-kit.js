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
	return {
		kick : createKick(audioContext, output),
		snare : createSnare(audioContext, output),
		hat : createHihat(audioContext, output),
		cowbell : createCowbell(audioContext, output),
		clack : createClack(audioContext, output),
		clap : createClap(audioContext, output)
	}
}