// import { WORKLET_SAMPLER } from "../../processors/sample-processor"

// const DEFAULT_OPTIONS = {
// 	numberOfInputs?: number;
//     numberOfOutputs?: number;
//     outputChannelCount?: number[];
//     parameterData?: Record<string, number>;
//     processorOptions?: any;
// }

import WORKLET_LOCATION from 'worklet:../../processors/sample-processor.js'

export const WORKLET_ID_SAMPLER = "sampler-processor"

const DEFAULT_OPTIONS = {
	// numberOfInputs: 1,
	// numberOfOutputs: 1,
	// outputChannelCount: [2],
	// parameterData: {
	// 	gain: 0.5,
	// 	pan: 0,
	// 	frequency: 440.0,
	// }
}

export default class SampleAudioWorkletNode extends AudioWorkletNode {

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

	/**
     * @constructor
     * @param {BaseAudioContext} context The associated BaseAudioContext.
	 * @param {AudioWorkletNodeOptions} options User-supplied options for AudioWorkletNode.
     */
	constructor(context, workletId=WORKLET_ID_SAMPLER, options=DEFAULT_OPTIONS) {
		// try{
		// 	console.error("registering sampler worklet!", {WORKLET_LOCATION, worklets:context.audioWorklet} ) 
		// 	context.audioWorklet.addModule( WORKLET_LOCATION ).then( r => {
		// 		console.error("registered sampler worklet!", {WORKLET_LOCATION, worklets:context.audioWorklet} ) 
		// 	})
			
		// }catch(e){
		// 	//
		// 	console.error("Already registered sampler worklet!", e)
		// }
		super(context, workletId, options)
		this.port.onmessage = this.onmessage.bind(this)
	}

	post( data){
		return this.port.postMessage(data)
	}

	/**
	 * Pass in the WAV data AudioBuffers 
	 * @param {Event} event 
	 */
	onmessage(event) {
		// Handling data from the node.
		// console.log("SampleAudioWorkletNode:", event.data)
		// loadSample(event.data)
		switch (event.data.type) {
			case 'available':
				console.log('[SampleAudioWorkletNode:Available]')
				break

			case 'load':
				console.error("SampleAudioWorkletNode: Loading", event)
				
				break

			case 'play':
				break

			default:
				console.error("SampleAudioWorkletNode: Unknown message type", event)
		}
	}

	createTransferableBufferData(audioBuffer) {
		return [
		  {
			sampleRate: audioBuffer.sampleRate,
			duration: audioBuffer.duration,
			bufferLength: audioBuffer.length,
			numberOfChannels: audioBuffer.numberOfChannels,
		  },
		  audioBuffer.getChannelData(0),
		  this.numberOfChannels > 1
			? audioBuffer.getChannelData(1)
			: audioBuffer.getChannelData(0)
		];
	  }

	/**
	 * 
	 * @param {String} path 
	 */
	async loadAudioFromURL(path) {
		const audioBuffer = await this.loadBufferFromURL(path)
		// const arrayBuffer = await this.loadArrayBufferFromURL(path)
		// const arrayBuffer8 = new Uint8Array(this.mem);
		
		const data = this.createTransferableBufferData(audioBuffer)
		
		this.post({
			type:"load", 
			data
		})
		console.log("SampleAudioWorkletNode: Loaded", { audioBuffer, data} )
	}
	
	/**
	 * 
	 * @param {String} path 
	 * @returns 
	 */
	async loadBufferFromURL(path) {
		const arrayBuffer = await this.loadArrayBufferFromURL(path)
		const audioBuffer = await this.createAudioBufferFromArrayBuffer(arrayBuffer)
		return audioBuffer
	}
	
	/**
	 * 
	 * @param {String} path 
	 * @returns {TrackSource}
	 */
	async loadTrackSourceFromURL(path) {
		const audioBuffer = await this.loadBufferFromURL(path)
		const trackSource = this.createBufferSource(audioBuffer)
		return trackSource
	}

	/**
	 * 
	 * @param {String} path 
	 * @returns {ArrayBuffer}
	 */
	async loadArrayBufferFromURL(path) {
		const response = await fetch(path)
		const arrayBuffer = await response.arrayBuffer()
		return arrayBuffer
	}

	/**
	 * 
	 * @param {ArrayBuffer} audioBuffer 
	 * @returns {AudioBuffer}
	 */
	async createAudioBufferFromArrayBuffer(arrayBuffer) {
		const audioBuffer = await this.context.decodeAudioData(arrayBuffer)
		return audioBuffer
	}

	/**
	 * 
	 * @param {AudioBuffer} audioBuffer 
	 * @returns {BufferSource} BufferSource 
	 */
	async createBufferSource(audioBuffer) {
		const trackSource = this.context.createBufferSource()
		trackSource.buffer = audioBuffer
		return trackSource
	}

	async play(audioBuffer, offset = 0, velocity = 128, options = { loop: false }) {

		let trackSource = this.createBufferSource(audioBuffer)

		trackSource.loop = options.loop || false

		if (this.context.state === 'suspended') {
			await this.context.resume()
		}

		if (offset == 0) {
			trackSource.start(0)
			//offset = context.currentTime
		} else {
			trackSource.start(0, this.context.currentTime - offset)
		}
	}
}