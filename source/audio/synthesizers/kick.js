import {audioContext, ZERO} from '../audio'
import {inputDryNode} from '../rack'
import {createQueue} from '../synthesizers'

/**
 * Kick me!
 * @returns {Function} trigger start method
 */
export const createKick = () => {

    const osc = audioContext.createOscillator()
    const osc2 = audioContext.createOscillator()
    const gainOsc = audioContext.createGain()
    const gainOsc2 = audioContext.createGain()
	const FREQUENCY_LO = 90
	const FREQUENCY_HI = 50

    osc.type = "triangle"
    osc2.type = "sine"
	
	const kick = (velocity=1, length=0.05, attack=0.01, duration=0.5) => {

		const time = audioContext.currentTime
		
		// clear anything from previous plays
		gainOsc.gain.cancelScheduledValues(time)
		gainOsc2.gain.cancelScheduledValues(time)
		osc.frequency.cancelScheduledValues(time)
		osc2.frequency.cancelScheduledValues(time)

		gainOsc.gain.setValueAtTime(1, time)
		gainOsc.gain.exponentialRampToValueAtTime(ZERO, time + length)
	
		gainOsc2.gain.setValueAtTime(1, audioContext.currentTime)
		gainOsc2.gain.exponentialRampToValueAtTime(ZERO, time + length)
	
		osc.frequency.setValueAtTime(FREQUENCY_LO, audioContext.currentTime)
		osc.frequency.exponentialRampToValueAtTime(attack, time + length)
	
		osc2.frequency.setValueAtTime(FREQUENCY_HI, audioContext.currentTime)
		osc2.frequency.exponentialRampToValueAtTime(attack, time + length)
		 
		 try{

			osc.start(time)
			osc2.start(time)

		 }catch(error)
		 {

		 }
	 
		//  osc.stop(audioContext.currentTime + duration)
		//  osc2.stop(audioContext.currentTime + duration)
	}
 
    osc.connect(gainOsc)
    osc2.connect(gainOsc2)
    gainOsc.connect(inputDryNode())
    gainOsc2.connect(inputDryNode())

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
export const createKicks = (quantity=2) => createQueue(createKick, quantity)