/**
 * This is a set of noise that gets sent into 
 * a delay where the delay length represents 
 * the pitch and is fed back into the delay as
 * a feedback until it resonates in key.
 */
import Instrument from './instrument'

import { registerAudioWorklets } from '../audio'
import { convertMIDINoteNumberToName, convertNoteNameToMIDINoteNumber } from '../notes'

import Noise from '../noise'

export default class WaveGuideInstrument extends Instrument {

	type = "worklet"

	instrument

	get volume() {
		return this.gainNode.gain.value
	}

	set volume(value) {
		this.gainNode.gain.value = value
	}

	constructor(audioContext, destinationNode, options = {}) {

		super(audioContext, destinationNode, options)

		registerAudioWorklets( audioContext )

		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 1
		this.gainNode.connect(destinationNode)

		// Run this in instrument.worklet
		const processor = new AudioWorkletNode(audioContext, "interface-processor")
		// receive message
		processor.port.onmessage = (event) => {
			// Handling data from the processor.
			console.log(event.data)
		}

		processor.connect(destinationNode)
		
		// send message
		this.post('Ready!')
		
		this.instrument = processor

		console.log("Worklet", { audioContext, processor })
	}

	post( message ){
		this.instrument.port.postMessage(message)
	}

	async noteOn(noteNumber, velocity = 1) {

		// TODO: Send out pitch bend?
		if (this.active) {
			//console.log("Sample overwriting playback.", noteName )
		}

		this.post( "noteOn" )
		this.active = true
		this.volume = velocity
		return super.noteOn(noteNumber, velocity)
	}

	async noteOff(noteNumber, velocity = 0) {
		this.volume = velocity
		this.active = false
		this.post('noteOff')
		return super.noteOff(noteNumber)
	}

	aftertouch(noteNumber, pressure) {
		super.aftertouch(noteNumber, pressure)
	}

	pitchBend(pitch) {
		super.pitchBend(pitch)
	}

	// to load a new sample we can also use the midi methods...
	async programChange(programNumber) {
		this.post('programChange')
		return super.programChange(programNumber)
	}

}
