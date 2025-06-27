import Instrument from './instrument'
import ProcessorInstrument from './instrument.processor'

const DEFAUT_OPTIONS = {
	id: "sampler-processor",
	location:'../audio/instruments/worklets/sampler.worklet.js'
}

export default class WorkletInstrument extends ProcessorInstrument {

	type = "worklet"
	get title(){
		return "Worklet"
	}
	instrument

	get volume() {
		return this.gainNode.gain.value
	}

	set volume(value) {
		this.gainNode.gain.value = value
	}
	
	get audioNode(){
		return this.gainNode
	}



	constructor(audioContext, options = {}) {
		super(audioContext, {...DEFAUT_OPTIONS, ...options})
		// this.title = `${options.name ?? shapeName(this.options.shape)} Wave Oscillator`
	}

	async create(){
		
		this.gainNode = this.context.createGain()
		this.gainNode.gain.value = 1

		// TODO Create AudioWorkletNode from Class

		await this.context.resume()
	
		await super.create()
		return true
	}
	
	async destroy(){
		return await super.destroy()
	}

	// Overwritten to accept custom Worklet types
	async registerProcessor( moduleId="hiss-generator", moduleLocation="./audio/worklets/hiss-generator.js" ){
		let processorNode
		try {
			// if processor script is already registered
			processorNode = new AudioWorkletNode( this.context, moduleId )
		} catch (e) {
			try {
				// lets re-attempt but this time by registering the processor script
				await this.context.audioWorklet.addModule(moduleLocation)
				processorNode = new AudioWorkletNode(this.context, moduleId )
			} catch (e) {
				console.error(`Error: Unable to create worklet node: ${e}`)
				return null
			}
		}

		// Run this in instrument.worklet
		// receive message
		// processorNode.port.onmessage = (event) => {
		// 	// Handling data from the processor.
		// 	console.log("From processor", event.data)
		// }

		processorNode.onprocessorerror = (event) => {
			console.log('An error from AudioWorkletProcessor.constructor() was detected.')
		}
		return processorNode
	}

	post( data ){
		if (this.instrument)
		{
			this.instrument.post(data)
			console.log('AudioWorkletProcessor post', data ) 
		}else{
			console.error('AudioWorkletProcessor post IGNORED - no port available yet', data ) 
		}
	}

	async noteOn(noteNumber, velocity = 1) {

		// TODO: Send out pitch bend?
		if (this.active) {
			//console.log("Sample overwriting playback.", noteName )
		}

		this.post( { type:"noteOn", noteNumber, velocity} )
		this.active = true
		this.volume = velocity
		return super.noteOn(noteNumber, velocity)
	}

	async noteOff(noteNumber, velocity = 0) {
		this.volume = velocity
		this.active = false
		this.post({ type:'noteOff', noteNumber, velocity})
		return super.noteOff(noteNumber)
	}

	aftertouch(noteNumber, pressure) {
		this.post({ type:'aftertouch', noteNumber, pressure})
		super.aftertouch(noteNumber, pressure)
	}

	pitchBend(pitch) {
		this.post({ type:'pitchBend', pitch})
		return super.pitchBend(pitch)
	}

	// to load a new sample we can also use the midi methods...
	async programChange(programNumber) {
		this.post({ type:'programChange', programNumber})
		return super.programChange(programNumber)
	}

	clone(){
		return new WorkletInstrument(this.audioContext, this.options)
	}
}
