import Instrument from './instrument'

const DEFAUT_OPTIONS = {
	id: "sampler-processor",
	location:undefined,
	worklet:AudioWorkletNode
}

export default class ProcessorInstrument extends Instrument {

	type = "worklet"

	instrument
	worklet

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

		await this.context.resume()
	
		const processor = await this.registerProcessor( this.options )
		
		if (processor)
		{
			processor.connect(this.gainNode)
			// console.log("Worklet", {processor })
			this.worklet = processor
			this.instrument = processor

			// send message
			// this.post('Ready!')

		}else{
			console.error("Worklet could not be loaded")
			throw Error("Worklet could not be loaded")
			return false
		}

		await super.create()
		return true
	}
	
	async destroy(){
		return await super.destroy()
	}


	/**
	 * If a worklet is specified as a string we create a new AudioWorkletNode otherwise
	 * we use 
	 * 
	 * @param {Object} processorData 
	 * @returns 
	 */
	async registerProcessor( processorData ){
		
		const {id, location, worklet} = processorData 
		
		let processorNode
		
		let createProcessorNode = () => (typeof worklet === "string") ? 
			new AudioWorkletNode( this.context, id ) :
			new worklet( this.context, this.options )

		try {
			// if processor script is already registered
			processorNode = createProcessorNode()
		} catch (e) {
			try {
				// lets re-attempt but this time by registering the processor script
				await this.context.audioWorklet.addModule( location ?? worklet )
				processorNode = createProcessorNode()
				// console.error("createProcessorNode addModule worklet!", {e,worklets: this.context.audioWorklet} )
				
			} catch (e) {
				console.error(`Error: Unable to register ${id} processor node: ${e}`, {processorData}, this.context.audioWorklet )
				return null
			}
		}
		// Run this in instrument.worklet
		// receive message
		// processorNode.port.onmessage = (event) => {
		// 	// Handling data from the processor.
		// 	console.log("From processor", event.data)
		// }

		// bind errors to handler
		processorNode.onprocessorerror = this.onProcessorError.bind(this)
		
		return processorNode
	}

	post( data ){
		if (this.instrument?.port)
		{
			this.instrument.port.postMessage(data)
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

	onProcessorError(error) {
		console.log('An error from AudioWorkletProcessor.constructor() was detected.')
	}
}
