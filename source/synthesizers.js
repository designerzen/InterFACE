
import {audioContext, inputDryNode} from './audio'

const ZERO = 0.0000001

// this is just an array of kicks
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

// Kick me
export const createKick = () => {

    const osc = audioContext.createOscillator()
    const osc2 = audioContext.createOscillator()
    const gainOsc = audioContext.createGain()
    const gainOsc2 = audioContext.createGain()

    osc.type = "triangle"
    osc2.type = "sine"

	const kick = (length=0.05, velocity=255, attack=0.01, duration=0.5) => {

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
	
		osc.frequency.setValueAtTime(120, audioContext.currentTime)
		osc.frequency.exponentialRampToValueAtTime(attack, time + length)
	
		osc2.frequency.setValueAtTime(50, audioContext.currentTime)
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

export const createSnare = () => {

    const osc3 = audioContext.createOscillator()
    const gainOsc3 = audioContext.createGain()
    const filterGain = audioContext.createGain()
	const noise = audioContext.createBufferSource()
	const buffer = audioContext.createBuffer(1, 4096, audioContext.sampleRate)

	const filter = audioContext.createBiquadFilter()
	filter.type = "highpass"

	osc3.type = "triangle"
	osc3.frequency.value = 100

	// TODO Cache the noise
	const data = buffer.getChannelData(0)
	for (var i = 0; i < 4096; i++) 
	{
		data[i] = Math.random()
	}

	noise.buffer = buffer
	noise.loop = true
	
	osc3.connect(gainOsc3)
	gainOsc3.connect(inputDryNode() )	

	noise.connect(filter)
	filter.connect(filterGain)
	filterGain.connect(inputDryNode() )

	const snare = (length = 0.2) => {

		const time = audioContext.currentTime
		
		filterGain.gain.cancelScheduledValues(time)
		filterGain.gain.setValueAtTime(1, time)
		filterGain.gain.exponentialRampToValueAtTime(ZERO, time + length)
	
		gainOsc3.gain.cancelScheduledValues(time)
		gainOsc3.gain.setValueAtTime(ZERO, time)
		gainOsc3.gain.exponentialRampToValueAtTime(ZERO, time + (length / 2 ) )	
		//gainOsc3.gain.value = 0

		// modulate and filter freqs
		filter.frequency.cancelScheduledValues(time)
		filter.frequency.setValueAtTime(100, time)
		filter.frequency.linearRampToValueAtTime(1000,time + length)		
	
		//gainNode.gain.value = 1			
		try{
			osc3.start(time)
			//osc3.stop(audioContext.currentTime + 0.2)
		
			noise.start(time)

			//node.stop(audioContext.currentTime + 0.2)	
		}catch(error){

		}
	}

	return snare
}

export const createHihat = () => {

    const gainOsc4 = audioContext.createGain()
    const fundamental = 40
    const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21]

    const bandpass = audioContext.createBiquadFilter()
    bandpass.type = "bandpass"
    bandpass.frequency.value = 10000

    const highpass = audioContext.createBiquadFilter()
    highpass.type = "highpass"
    highpass.frequency.value = 7000

    const oscillators = ratios.map((ratio) => {

        const osc4 = audioContext.createOscillator()
        osc4.type = "square"
		osc4.frequency.value = fundamental * ratio
		osc4.connect(bandpass)
		return osc4
    })

	bandpass.connect(highpass)
    highpass.connect(gainOsc4)
	gainOsc4.connect(inputDryNode())
	
	const hihat = (length=0.05 )=>{
		const time = audioContext.currentTime
		
		// clear anything from previous plays
		gainOsc4.gain.cancelScheduledValues(time)
		oscillators.forEach( oscillator => oscillator.frequency.cancelScheduledValues(time) )
		
		// set neew envelopes
		gainOsc4.gain.setValueAtTime(1, time)
		gainOsc4.gain.exponentialRampToValueAtTime(ZERO, time + length)
		
		try{
			oscillators.forEach( oscillator => oscillator.start(time) )
		
			//osc4.stop(time + 0.05)  			
		}catch(error){

		}
	}
	return hihat
}

export const createClack = () => {
	
	const cowbellGainNode = audioContext.createGain()
 
    const bandpass = audioContext.createBiquadFilter()
    bandpass.type = "bandpass"
    bandpass.frequency.value = 2640
    bandpass.Q.value = 3.5

    const highpass = audioContext.createBiquadFilter()
    highpass.type = "highpass"
    highpass.frequency.value = 7000

	const fundamental = 1
    const ratios = [587,845]

    const oscillators = ratios.map((ratio) => {

        const oscillator = audioContext.createOscillator()
        oscillator.type = "triangle"
		oscillator.frequency.value = fundamental * ratio
		oscillator.connect(bandpass)
		return oscillator
    })

	bandpass.connect(highpass)
    highpass.connect(cowbellGainNode)
	cowbellGainNode.connect(inputDryNode())
	
	const clack = (length=0.05 )=>{
		const time = audioContext.currentTime
		
		// clear anything from previous plays
		cowbellGainNode.gain.cancelScheduledValues(time)
		oscillators.forEach( oscillator => oscillator.frequency.cancelScheduledValues(time) )
		
		// set neew envelopes
		cowbellGainNode.gain.setValueAtTime(1, time)
		cowbellGainNode.gain.exponentialRampToValueAtTime(ZERO, time + length)
		
		try{
			oscillators.forEach( oscillator => oscillator.start(time) )
		
			//osc4.stop(time + 0.05)  			
		}catch(error){

		}
	}
	return clack
}

export const createCowbell = () => {
	
	const cowbellGainNode = audioContext.createGain()
 
    const bandpass = audioContext.createBiquadFilter()
    bandpass.type = "bandpass"
    bandpass.frequency.value = 2640
    bandpass.Q.value = 3.5

	const fundamental = 1
    const ratios = [587,845]

    const oscillators = ratios.map((ratio) => {

        const oscillator = audioContext.createOscillator()
        oscillator.type = "triangle"
		oscillator.frequency.value = fundamental * ratio
		oscillator.connect(bandpass)
		return oscillator
    })

	bandpass.connect(cowbellGainNode)
	cowbellGainNode.connect(inputDryNode())
	
	const cowbell = (length=0.05 )=>{
		const time = audioContext.currentTime
		
		// clear anything from previous plays
		cowbellGainNode.gain.cancelScheduledValues(time)
		oscillators.forEach( oscillator => oscillator.frequency.cancelScheduledValues(time) )
		
		// set neew envelopes
		cowbellGainNode.gain.setValueAtTime(1, time)
		cowbellGainNode.gain.exponentialRampToValueAtTime(ZERO, time + length)
		
		try{
			oscillators.forEach( oscillator => oscillator.start(time) )
		
			//osc4.stop(time + 0.05)  			
		}catch(error){

		}
	}
	return cowbell
}

// this is just an array of kicks
export const createKicks = (quantity=2) => createQueue(createKick, quantity)
export const createSnares = (quantity=3) => createQueue(createSnare, quantity)
export const createHihats = (quantity=3) => createQueue(createHihat, quantity)
export const createCowbells = (quantity=2) => createQueue(createCowbell, quantity)
export const createClacks = (quantity=2) => createQueue(createClack, quantity)

// Just a drum kit you can play that has one of each of the
// drum sounds set up in cascades. simply createDrumkit().kick() etc
export const createDrumkit = () => {

	const kick = createKicks()
	const hat = createHihats()
	const snare = createSnares()
	const cowbell = createCowbell()
	const clack = createClack()

	return {
		kick,
		snare,
		hat,
		cowbell,
		clack
	}
}

// tODO : Bind pattern to kit?