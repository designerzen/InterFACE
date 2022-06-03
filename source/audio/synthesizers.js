import { createKick, createKicks } from './synthesizers/kick' 
import { createClack, createClacks } from './synthesizers/clack' 
import { createHihat, createHihats } from './synthesizers/hihat' 
import { createCowbell, createCowbells } from './synthesizers/cowbell' 
import { createSnare, createSnares } from './synthesizers/snare' 

/**
 * create a fixed amount of instrument instances
 * @param {Function} factorymethod constructor method to create instance
 * @param {Number} quantity amount of items to create
 * @returns {Function} method to retrieve next item in the queue
 */
 export const createQueue = (factorymethod, quantity=5) => {

	const instruments = []
	for (let i=0; i < quantity; ++i)
	{
		const instrument = factorymethod()
		instruments.push( instrument )
	}

	// interface to play
	let index = 0
	const fetchNextInstrument = (...args) => {
		index = index + 1 < quantity ? index + 1 : 0
		const instrument = instruments[index]
		instrument(...args)
		//instrument.apply(null, arguments)
	}
	return fetchNextInstrument
}

/**
 * Just a drum kit you can play that has one of each of the
 * drum sounds set up in cascades. simply createDrumkit().kick() etc
 * @returns {Object<Function>} all individual instruments
 */
export const createDrumkit = () => {
	return {
		kick : createKicks(),
		snare : createSnares(),
		hat : createHihats(),
		cowbell : createCowbell(),
		clack : createClack()
	}
}