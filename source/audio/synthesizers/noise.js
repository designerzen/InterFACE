// Thank you very much!
// https://noisehack.com/generate-noise-web-audio-api/
// TODO : Cache the streams...
export default class Noise {

	constructor() {
		throw Error("Noise must be accessed statically eg. via Noise.pink()")
	}

	/**
	 * Generate an AudioBuffer full of noise
	 * @param {number} length 
	 * @param {Fuction} shape 
	 * @param {number} sampleRate 
	 * @param {Boolean} offline 
	 * @returns {AudioBuffer}
	 */
	static generate(length = 1, shape = Noise.white, sampleRate = 44100) {
		
		// const sampleRate = audioContext.sampleRate;
		// const bufferSize = 2 * audioContext.sampleRate;
		// const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
		// return noiseBuffer.getChannelData(0);

		// seconds of samples...
		const samples = length * sampleRate

		// In contrast with a standard AudioContext, an OfflineAudioContext 
		// doesn't render the audio to the device hardware; instead, it 
		// generates it, as fast as it can, and outputs the result to an AudioBuffer.
		const context = new OfflineAudioContext(1, samples, sampleRate)

		// AudioBuffer
		const noiseBuffer = context.createBuffer(1, samples, sampleRate) // THIS IS RETURNED!

		// Float32Array
		const noiseData = noiseBuffer.getChannelData(0)

		// noiseData.length
		// modify output...
		shape(noiseData, samples)

		return noiseBuffer
	}

	/**
	 * Pure all channel white noise!
	 * @param {number} length - defaults to 2 seconds
	 * @param {number} sampleRate - 44100 Hz
	 * @returns {AudioBuffer}
	 */
	static white(length = 2, sampleRate = 44100) {
		return Noise.generate(length, Noise.generateWhite)
	}

	/**
	 * Pink is nice too
	 * @param {number} length - defaults to 2 seconds
	 * @param {number} sampleRate - 44100 Hz
	 * @returns {AudioBuffer}
	 */
	static pink(length = 2, sampleRate = 44100) {
		return Noise.generate(length, Noise.generatePink)
	}

	/**
	 * Brownian noise decreases in power by 12dB/octave, and sounds like a waterfall
	 * @param {number} length - defaults to 2 seconds
	 * @param {number} sampleRate - 44100 Hz
	 * @returns {AudioBuffer}
	 */
	static brown(length = 2, sampleRate = 44100) {
		return Noise.generate(length, Noise.generateBrown)
	}





	/**
	 * Generate Pink Noise Array
	 * 
	 * Whereas white noise has equal power across the 
	 * frequency spectrum, pink noise sounds like it has 
	 * equal power across the frequency spectrum. 
	 * Our ears process frequencies logarithmically, and 
	 * pink noise takes this into account. In terms of 
	 * ambient noise, I find that pink noise sounds much 
	 * nicer than white noise, which is too harsh in the 
	 * upper frequencies. 
	 * To generate pink noise, we’ll approximate the effects 
	 * of a -3dB/octave filter using Paul Kellet’s refined method
	 * 
	 * @param {Float32Array} output 
	 * @param {number} size 
	 * @returns {Float32Array}
	 */
	static generatePink(output, size){

		// if we want this noise to rolll... mmake instance of ...
		let b0 = 0.0
		let b1 = 0.0
		let b2 = 0.0
		let b3 = 0.0
		let b4 = 0.0
		let b5 = 0.0
		let b6 = 0.0

		for (let i = 0; i < size; i++) 
		{
			const white = Math.random() * 2 - 1

			// make it pink with a filter
			b0 = 0.99886 * b0 + white * 0.0555179
			b1 = 0.99332 * b1 + white * 0.0750759
			b2 = 0.96900 * b2 + white * 0.1538520
			b3 = 0.86650 * b3 + white * 0.3104856
			b4 = 0.55000 * b4 + white * 0.5329522
			b5 = -0.7616 * b5 - white * 0.0168980

			output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
			 // (roughly) compensate for gain
			output[i] *= 0.11
			b6 = white * 0.115926
		}
		return output
	}

	/**
	 * Generate WHITE Noise Array -1 -> +1
	 * @param {Float32Array} output 
	 * @param {number} size 
	 * @returns {Float32Array}
	 */
	static generateWhite(output, size) {
		for (let i = 0; i < size; i++) 
		{
			output[i] = Math.random() * 2 - 1
		}
		return output
	}

	/**
	 * Generate Brown Noise Array
	 * @param {Float32Array} output 
	 * @param {number} size 
	 * @returns {Float32Array}
	 */
	static generateBrown(output, size) {
		let lastOut = 0
		for (let i = 0; i < size; i++) 
		{
			const white = Math.random() * 2 - 1
			output[i] = (lastOut + (0.02 * white)) / 1.02
			lastOut = output[i]
			// (roughly) compensate for gain
			output[i] *= 3.5
		}
		return output
	}

}
