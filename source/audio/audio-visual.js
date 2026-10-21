export let bufferLength
export let dataArray
export let timeDataArray

const analyserBuffers = new WeakMap()
const getBuffer = (analyser, domain, size) => {
	let buffers = analyserBuffers.get(analyser)
	if (!buffers) {
		buffers = { frequency:new Map(), time:new Map(), frame:{ frequency:null, time:null, length:0 } }
		analyserBuffers.set(analyser, buffers)
	}
	let buffer = buffers[domain].get(size)
	if (!buffer) {
		buffer = new Uint8Array(size)
		buffers[domain].set(size, buffer)
	}
	return buffer
}

// The returned frame and its buffers are borrowed until the next sample.
export const sampleVisualiserAudio = (analyser, mode, recording = false) => {
	const frequency = mode.frequency || recording
	if (frequency) updateByteFrequencyData(analyser, mode.fftSize)
	const time = mode.time ? updateByteTimeDomainData(analyser, mode.fftSize) : null
	// Note-only views do not touch the analyser at all.
	if (!analyserBuffers.has(analyser)) analyserBuffers.set(analyser, {
		frequency:new Map(), time:new Map(), frame:{ frequency:null, time:null, length:0 }
	})
	const frame = analyserBuffers.get(analyser).frame
	frame.frequency = frequency ? dataArray : null
	frame.length = frequency ? dataArray.length : 0
	frame.time = time
	return frame
}

/**
 * For bars graphs
 * update the frequency analyser and fetch EQ data in the Frequency Domain
 * fftSize *must* be a power of 2 number
 */
export const updateByteFrequencyData = (analyser, fftSize=256)=> {
	if (analyser.fftSize !== fftSize) analyser.fftSize = fftSize
	dataArray = getBuffer(analyser, "frequency", analyser.frequencyBinCount)
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
	if (analyser.fftSize !== fftSize) analyser.fftSize = fftSize
	timeDataArray = getBuffer(analyser, "time", analyser.fftSize)
	analyser.getByteTimeDomainData(timeDataArray)
	return timeDataArray
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
	analyser.smoothingTimeConstant = options.smoothingTimeConstant ?? 0.8

	bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)
	return analyser
}