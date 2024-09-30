//- import {URLFromFiles} from './utils/load-js-from-file.js'
//- import {Essentia, EssentiaWASM} from 'essentia.js'
//- import { RingBuffer } from 'ringbuf.js'
// create essentia object with all the methods to run various algorithms
// by loading the wasm back-end.
// here, `EssentiaModule` is an emscripten module object imported to the global namespace
//- let essentia = new Essentia(EssentiaWASM)	
import PITCH_PROCESSOR from "worklet:../audio/processors/pitchyinprob-processor.js"
import { convertMIDINoteNumberToName } from "../audio/tuning/notes.js"

export const BUFFER_SIZE = 8192

/**
 * This returns a list of IDS that you can then feed into the Microphone,
 * for if you want to select a specific camera
 * WARNING : Triggers an error if not from a user interaction!
 * @returns {Array<Object>} All camera device objects on this device
 */
export const detectMicrophones = async () =>{
	const devices = await navigator.mediaDevices.enumerateDevices()
	const microphones = []
	devices.forEach( mic => {
		switch (mic.kind)
		{
			case "audioinput":
			case "videoinput":
				// if it is a video one sometimes the camera
				// returns empty details so we add at least a title
				microphones.push(mic)
				break
		}
	})
	
	return microphones
} 


export default class Microphone{

	bufferSize
	audioCtx
	gumStream
	mic
	gain
	audioReader
	pitchNode
	onpitch

	initialised = false
	recording = false

	// outputs
	note = -1
	noteName = -1
	rms = -1
	logRMS = -1
	pitch = -1
	confidence = 0

	constructor( audioContext=null, bufferSize=BUFFER_SIZE )
	{
		this.audioCtx = audioContext
		this.bufferSize = bufferSize
	}

	// record native microphone input and do further audio processing on each audio buffer using the given callback functions
	async startStream( stream, options={audio: true, video: false, deviceId:-1} ) 
	{
		if (!stream)
		{
			try{
				if (navigator.mediaDevices.getUserMedia) 
				{
					return await this.setInput( options.deviceId, options )
				} else {
					throw "Could not access microphone - getUserMedia not available"
				}

			}catch(error){
				console.error("startMicRecordStream", {error} )
			}

		}else{
			this.startAudioProcessing(stream)
		}	
	}

	/**
	 * If connected, siconnect then reconnect with selected options
	 * @param {String} deviceId 
	 * @param {Object} options 
	 * @returns 
	 */
	async setInput( deviceId=-1, options={audio: true, video: false} ){
		const stream = await navigator.mediaDevices.getUserMedia( {...options, deviceId:deviceId > -1 ? deviceId : undefined } )
		console.log("Initializing deviceId",{deviceId, stream, options})
		return this.startAudioProcessing(stream)
	}

	async enableContext()
	{
		// NB: Offline context does NOT work with getUserMedia
		if (!this.audioCtx || this.audioCtx.state === "closed") {
			this.audioCtx = new AudioContext()
		}else if (this.audioCtx.state === "suspended") {
			//console.log( "context", typeof this.audioCtx, this.audioCtx )
			// only for online contexts
			try{
				await this.audioCtx.resume()
			}catch(error){
				return false
			}
		}
		return true
	}

	
	// we need to connect everything once
	async initialise(){

		if (!this.initialised)
		{
			await this.audioCtx.audioWorklet.addModule( new URL( PITCH_PROCESSOR) )
		
			// Shared Array Buffer
			//- let sab = RingBuffer.getStorageForCapacity(3, Float32Array) // capacity: three float32 values [pitch, confidence, rms]
			// Ring Buffer
			//- let rb = new RingBuffer(sab, Float32Array)
			//audioReader = new AudioReader(rb)

			this.pitchNode = new AudioWorkletNode( this.audioCtx, 'pitchyinprob-processor', {
				processorOptions: {
					bufferSize: this.bufferSize,
					sampleRate: this.audioCtx.sampleRate
				}
			})

			this.pitchNode.port.onmessage = e => {
				const {note, rms,logRMS, pitch,confidence } = e.data
				
				if (!isNaN(pitch)){

					const noteName = convertMIDINoteNumberToName( note >> 0 )
					this.note = note
					this.noteName = noteName
					this.rms = rms
					this.logRMS = logRMS
					this.pitch = pitch
					this.confidence = confidence

					this.onpitch && this.onpitch( {note, noteName, rms, logRMS, pitch,confidence } )
					//console.log("pitchNode", {rms,logRMS,pitch,confidence } )
				}	
			}

			// It seems necessary to connect the stream to a sink for the pipeline to work, contrary to documentataions.
			// As a workaround, here we create a gain node with zero gain, and connect temp to the system audio output.
			this.gain = this.audioCtx.createGain()
			// silence input!
			this.gain.gain.setValueAtTime(0, this.audioCtx.currentTime)

			this.pitchNode.connect( this.gain )
			this.gain.connect( this.audioCtx.destination)

			this.initialised = true
			console.log("Initialized", this)
		}
	}

	/**
	 * 
	 * @param {*} stream 
	 */
	async startAudioProcessing(stream)
	{
		this.gumStream = stream

		if (stream.active) 
		{
			await this.enableContext()
			
			await this.initialise()
			
			if (this.mic)
			{
				this.mic.disconnect()
				this.mic = null
			}
			
			// always overwrite the main mic but ensure we disconnect any first
			this.mic = this.audioCtx.createMediaStreamSource(stream)
			this.mic.connect( this.pitchNode )

			console.log( "startAudioProcessing", {stream}, this.audioCtx.audioWorklet )
			this.recording = true

		} else {
			throw "Mic stream not active"
		}
	}
	
	// stop mic stream	
	async stopStream( close=true ) {

		this.gumStream.getAudioTracks().forEach((track) => {
			track.stop()
			this.gumStream.removeTrack(track)
		})

		if (close)
		{
			await this.audioCtx.close()
		}
		
		// disconnect nodes
		this.mic.disconnect()
		this.pitchNode.disconnect()
		this.gain.disconnect()
		this.mic = undefined 
		this.pitchNode = undefined
		this.gain = undefined
		this.recording = false

		// as stream may be provided externally?
		// this.gumStream = null

		console.log("Stopped mic recording ...")
	}

	/**
	 * 
	 * @returns 
	 */
	toggleStream() {
		return !this.recording ? 
			this.startStream() : 
			this.stopStream()
	}
}