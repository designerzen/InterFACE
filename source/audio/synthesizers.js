import { ZERO } from "./audio"

/**
 * create a fixed amount of instrument instances
 * @param {AudioContext} audioContext 
 * @param {AudioNode} output where you want the destination audio to be routed to
 * @param {Function} Factorymethod constructor method to create instance
 * @param {Number} quantity amount of items to create
 * @returns {Function} method to retrieve next item in the queue
 */
 export const createQueue = (audioContext, output , Factorymethod, quantity=5) => {

	const instruments = []
	for (let i=0; i < quantity; ++i)
	{
		const instrument = Factorymethod(audioContext, output)
		instruments.push( instrument )
	}

	// interface to play
	let index = 0
	const fetchNextInstrument = (options) => {
		index = index + 1 < quantity ? index + 1 : 0
		const instrument = instruments[index]
		console.log(index, "Calling instrument", options )
		instrument(options)
		//instrument.apply(null, arguments)
	}
	fetchNextInstrument.cancel = () => {
		instruments.forEach(instrument => instrument.cancel?.())
	}
	fetchNextInstrument.choke = (duration, chokeAt) => {
		instruments.forEach(instrument => instrument.choke?.(duration, chokeAt))
	}
	return fetchNextInstrument
}

export const chokeGains = (audioContext, gains, duration = 0.005, chokeAt = audioContext.currentTime) => {
	const time = Math.max(audioContext.currentTime, chokeAt)
	const release = Math.max(duration, 0.001)

	gains.forEach(gain => {
		if (!gain) return
		gain.cancelScheduledValues(time)
		gain.setValueAtTime(Math.max(gain.value, ZERO), time)
		gain.exponentialRampToValueAtTime(ZERO, time + release)
	})
}
