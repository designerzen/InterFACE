export let bufferLength
export let dataArray

/**
 * For bars graphs
 * update the frequency analyser and fetch EQ data in the Frequency Domain
 * fftSize *must* be a power of 2 number
 */
export const updateByteFrequencyData = (analyser, fftSize=256)=> {
	analyser.fftSize = fftSize
	analyser.getByteFrequencyData(dataArray)
	// for waves?
	//bufferLength = analyser.fftSize
	bufferLength = analyser.frequencyBinCount
	return dataArray
}

/**
 * For string based waveforms
 * update the frequency analyser and fetch EQ data in the Time Domian
 */
export const updateByteTimeDomainData = (analyser, fftSize=2048)=> {
	analyser.fftSize = fftSize
	analyser.getByteTimeDomainData(dataArray)
	bufferLength = analyser.frequencyBinCount
	return dataArray
}



/**
 * Automatically Loop and update the frequency analyser and 
 * fetch EQ data in the Frequency Domain
 */
export const monitor = (analyser) => {

	const result = requestAnimationFrame(monitor)

	// waves
	//analyser.getByteTimeDomainData(dataArray)
	
	// bars
	analyser.getByteFrequencyData(dataArray)

	return result
}

/**
 * 
 * @param {AudioContext} audioContext 
 * @param {Object} options 
 */
export const setupAnalyser = (audioContext, options={}) => {
	// UI spectrum analyser
	const analyser = audioContext.createAnalyser()
	analyser.minDecibels = -90
	analyser.maxDecibels = -10
	analyser.smoothingTimeConstant = options.smoothingTimeConstant

	bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)
	return analyser
}