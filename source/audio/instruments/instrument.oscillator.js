import Instrument from './instrument'
import {noteNumberToFrequency, noteNumberToFrequencyFast} from '../notes'

import { registerAudioWorklets } from '../audio'

const OSCILLATOR_TYPES = ["sine","square","triangle","sawtooth","custom"]

const OPTIONS = {
	
	// The shape of the wave produced by the node. Valid values are 'sine', 'square', 'sawtooth', 'triangle' and 'custom'. The default is 'sine'.
	type:OSCILLATOR_TYPES[3],
	
	// A detuning value (in cents) which will offset the frequency by the given amount. Its default is 0.
	detune:0,

	// The frequency (in hertz) of the periodic waveform. Its default is 440.
	frequency:440,

	// An arbitrary period waveform described by a PeriodicWave object.
	// periodicWave:,

	// Represents an integer used to determine how many channels are used when up-mixing and down-mixing connections to any inputs to the node. (See AudioNode.channelCount for more information.) Its usage and precise definition depend on the value of channelCountMode.
	// channelCount

	// Represents an enumerated value describing the way channels must be matched between the node's inputs and outputs. (See AudioNode.channelCountMode for more information including default values.)
	// channelCountMode

	// Represents an enumerated value describing the meaning of the channels. This interpretation will define how audio up-mixing and down-mixing will happen. The possible values are "speakers" or "discrete". (See AudioNode.channelCountMode for more information including default values.)
	// channelInterpretation
}

export default class OscillatorInstrument extends Instrument{

	type = "oscillator"

	constructor( audioContext, destinationNode, shape=OSCILLATOR_TYPES[1] ){
		super()

		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 0.6 // this.currentVolume
		
		this.oscillator = new OscillatorNode(audioContext, { ...OPTIONS, type:shape }) 
		
		const bitCrusher = new AudioWorkletNode(audioContext, 'bit-crusher-processor')
		bitCrusher.onprocessorerror = () => {
			console.error('An error from AudioWorkletProcessor.process() was detected.')
		}
		
		this.paramBitDepth = bitCrusher.parameters.get('bitDepth')
		this.paramReduction = bitCrusher.parameters.get('frequencyReduction')
	
		this.paramBitDepth.setValueAtTime(8, 0)
		this.paramReduction.setValueAtTime(0.3, 0)

		// `frequencyReduction` parameters will be automated and changing over time.
		// Thus its parameter array will have 128 values.
		// paramReduction.setValueAtTime(0.01, 0)
		// paramReduction.linearRampToValueAtTime(0.1, 4)
		// paramReduction.exponentialRampToValueAtTime(0.01, 8)

		this.gainNode.connect(destinationNode)
		this.oscillator.connect(bitCrusher).connect(this.gainNode)
		this.oscillator.start()

		this.title = shape
		this.name = "OscillatorInstrument"
	}

	async noteOn( noteNumber, velocity=1 ){
		//this.oscillator.frequency.value = noteNumberToFrequency(noteNumber)
		this.oscillator.frequency.value = noteNumberToFrequencyFast(noteNumber)
		console.error("oscillator", this.oscillator.frequency.value, {noteNumber, velocity})
	
		this.paramReduction.setValueAtTime(0, 0)
		// this.paramReduction.linearRampToValueAtTime(0.1, 4)
		this.paramReduction.exponentialRampToValueAtTime(0.01, 8)

		return super.noteOn(noteNumber, velocity)
	}
	
	async noteOff(noteNumber, velocity=0){
		// TODO GATE
		return super.noteOff(noteNumber)
	}

	/**
	 * Polyphonic Key Pressure
	 * This message is most often sent by pressing down on the key 
	 * after it "bottoms out". noteNumber is the key (note) number. 
	 * pressure is the pressure value.
	 * @param {Number} noteNumber - is the key (note) number
	 * @param {Number} pressure 
	 */
	aftertouch( noteNumber, pressure ){
		// restart ADSR?
		super.aftertouch( noteNumber, pressure )
	}
	
	/**
	 * Pitch Bend Change. 
	 * This message is sent to indicate a change
	 * in the pitch bender (wheel or lever, typically). 
	 * The pitch bender is measured by a fourteen bit value. 
	 * Center (no pitch change) is 2000H. 
	 * Sensitivity is a function of the receiver, 
	 * but may be set using RPN 0. 
	 * (lllllll) are the least significant 7 bits. 
	 * (mmmmmmm) are the most significant 7 bits.
	 * @param {number} pitch 
	 */
	pitchBend(pitch){
		this.oscillator.frequency.value = noteNumberToFrequencyFast(pitch)
		super.pitchBend(pitch)
	}
	
	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		const index = programNumber%(OSCILLATOR_TYPES.length-1)
		this.oscillator.type = OSCILLATOR_TYPES[index]
		return super.programChange( programNumber )
	}
}
