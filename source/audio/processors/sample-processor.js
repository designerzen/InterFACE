import { convertMIDINoteNumberToName } from "../tuning/notes"

// import { WORKLET_ID_SAMPLER } from "../instruments/worklets/sampler.worklet.js"
const WORKLET_ID_SAMPLER = "sampler-processor"

/**
 * Audio Fragment
 */
export class AudioSample{

	position = 0

	length = 0

	leftChannel = []
	rightChannel = []

	channels = []

	loop = true

	// startPosition = 0
	meta

	get details(){
		return this.meta
	}

	get hasData(){
		return this.length > 0
	}

	get progress(){
		return this.position / this.length
	}

	constructor(data, options={}){
		this.add(data)
	}

	add(data){

		// CHECK DATA!
		if (!data || data.length < 3 || !data[1] || !data[2] )
		{
			throw Error("Audio Sample data is not valid")
		}

		const meta = data[0]
		const leftChannel = data[1]
		const rightChannel = data[2]

		this.leftChannel = leftChannel
		this.rightChannel = rightChannel
		this.channels = [leftChannel, rightChannel]
		this.meta = meta
		this.length = leftChannel.length
	}

	advancePosition(incrementBy){
		const updatedPosition = this.position + incrementBy
		this.loop ? 
			this.position = updatedPosition % this.length :
			this.position = updatedPosition > this.length ? this.length : updatedPosition
	}
}

/* global currentTime */
export default class SampleAudioWorkletProcessor extends AudioWorkletProcessor {

	// Static getter to define AudioParam objects in this custom processor.
	static get parameterDescriptors() {
		return [
			{
				name: "gain",
				defaultValue: 0.5,
				minValue: 0,
				maxValue: 1
			},
			{
				name: "pan",
				defaultValue: 0,
				minValue: -1,
				maxValue: 1
			},
			{
				name: "frequency",
				defaultValue: 440.0,
				minValue: 27.5,
				maxValue: 4186.009
			}
		]
	}

	sample
	isAvailable = false
	isPlaying = false

	startTime = -1
	smoothingPeak = 1

	decayTime = 1000000

	get elapsed(){
		return currentTime - this.startTime
	}
	get progress(){
		return this.sample ? this.sample.progress : 0
	}

	/**
	 * From 1 -> 0
	 */
	get decay(){
		return this.isPlaying ? 
			1 :
			1 - this.elapsed / this.decayTime
	}

	// const gainParam = SampleAudioWorkletNode.parameters.get("gain")
	// gainParam.setValueAtTime(newValue, audioContext.currentTime)
	// gainParam.value
	constructor() {
		super()
		this.port.onmessage = this.onmessage.bind(this)
		this.port.postMessage({ type: 'available' })
	}

	setSample(data) {
		this.sample = data // new AudioSample(data)
		// const meta = data[0]
		// const leftChannel = data[1]
		// const rightChannel = data[2]
		// this.leftChannel = leftChannel
		// this.rightChannel = rightChannel
		// this.channels = [leftChannel, rightChannel]
		// this.sample = this.channels
		console.info("Processor set buffer", {currentTime,data}, this, {currentTime} )
	}

	play(){
		this.startTime = currentTime 
		this.isPlaying = true
	}

	pause(reset=false){
		this.isPlaying = false
		this.startTime = currentTime 
		if (reset && this.sample)
		{
			this.sample.position = 0
		}
	}

	/**
	 * Pass in the WAV data or URL to load via worklet 
	 * @param {Event} event 
	 */
	onmessage(event) {
		// Handling data from the node.
		// console.log("SampleAudioWorkletProcessor:MESSAGE:", {event}, this)
		switch (event.data.type) {
			
			case 'available':
				this.isAvailable = true
				break

			case 'load':
				// this.sample = new AudioSample(event.data.data)
				this.setSample( new AudioSample(event.data.data))
				break

			case 'play':
				this.play()
				break

			case 'pause':
				this.pause()
				break

			case 'stop':
				this.pause(true)
			
				break

			// TODO: Send out after touch?
			case 'aftertouch':
				break

			// TODO: Send out pitch bend?
			case 'pitchBend':
				break

			default:
				console.log('[Processor:Received] ' + event.data.message +
					' (' + event.data.contextTimestamp + ')');
				console.error("SampleAudioWorkletProcessor: Unknown message type", event)
		}
	}

	/**
	 * We never want the volume to just drop out so we glide between the values
	 * 
	 * @param {Float32Array(128)} inputs 
	 * @param {Float32Array(128)} outputs 
	 * @param {AudioParam} parameters 
	 * @returns {Boolean} keep alive
	 */
	process(inputs, outputs, parameters) {

		const { gain, pan } = parameters
		
		// The processor may have multiple inputs and outputs. Get the first input and output.
		// Each input or output may have multiple channels. Get the first channel.
		const hasSampleData = this.sample && this.sample.hasData 
		const inputChannelLeft = inputs[0]
		const sampleLength = hasSampleData ? this.sample.length : inputChannelLeft.length
		const quantityOfChannels = inputs.length

		// Outputs
		const outputLeftChannel = outputs[0][0]
		const outputRightChannel = outputs[0].length > 1 ? outputs[0][1] : outputs[0][0]
		const outputChannels = [outputLeftChannel, outputRightChannel]
		const outputLength = outputLeftChannel.length

		const position = this.sample ? this.sample.position : 0
			
		// Apply gain and pan
		for (let channelNum = 0; channelNum < quantityOfChannels; ++channelNum) 
		{
			const inputChannel = hasSampleData ? this.sample.channels[channelNum] : inputs[channelNum]
			// const inputChannel = this.isPlaying && hasSampleData ? this.sample.channels[channelNum] : inputs[channelNum]
			const outputChannel = outputChannels[channelNum]

			// const outputChannel = outputs[0][channelNum]
			// If gain.length is 1, it's a k-rate parameter, so apply
			// the first entry to every frame. Otherwise, apply each
			// entry to the corresponding frame.
			if (gain.length === 1) {

				// sample
				for (let i = 0; i < outputLength; i++) {
					const p = (position + i) % sampleLength
					outputChannel[i] = inputChannel[p] * gain[0] * this.decay * this.smoothingPeak
				}

			} else {

				for (let i = 0; i < outputLength; i++) {
					const p = (position + i) % sampleLength
					outputChannel[i] = inputChannel[p] * gain[i] * this.decay * this.smoothingPeak
				}
			}
		}

		// update sample position
		if ( this.isPlaying )
		{
			console.info( "playing", Math.round( 100 * this.sample.position / sampleLength ) + "%", {decay:this.decay, decayTime:this.decayTime, elapsed:this.elapsed, sampleLength} )
			this.sample.advancePosition(outputLength)	
		}else{
			console.info( "skip", "POSITION", this.position, {sampleLength, decay:this.decay, decayTime:this.decayTime, elapsed:this.elapsed, sampleLength} )
	
		}
		

		/*
		// Get the parameter value array.
		// |myParamValues| is a Float32Array of either 1 or 128 audio samples
		// calculated by WebAudio engine from regular AudioParam operations.
		// (automation methods, setter) Without any AudioParam change, this array
		// would be a single value of 0.707.
		const myParamValues = parameters.myParam || []

		// if |myParam| has been a constant value during this render quantum, the
		// length of the array would be 1.
		if (myParamValues.length === 1) {

			// |myParam| has been a constant value for the current render quantum,
			// which can be accessed by |myParamValues[0]|.

			// Simple gain (multiplication) processing over a render quantum
			// (128 samples). This processor only supports the mono channel.
			for (let i = 0; i < inputChannelLeft.length; ++i) {
				outputChannel0[i] = inputChannelLeft[i] * myParamValues[0]
			}

		} else {

			// |myParam| has been changed and |myParamValues| has 128 values.
			for (let i = 0; i < inputChannelLeft.length; ++i) {
				outputChannel0[i] = inputChannelLeft[i] * myParamValues[i]
			}
		}
		*/

		// To keep this processor alive.
		return true
	}
}

registerProcessor(WORKLET_ID_SAMPLER, SampleAudioWorkletProcessor)