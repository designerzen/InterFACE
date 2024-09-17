import Instrument from './instrument'
import {noteNumberToFrequency} from '../tuning/frequencies.js'

const OSCILLATOR_TYPES = ["sine","square","triangle","sawtooth","custom"]

const OPTIONS = {
	
	// The shape of the wave produced by the node. Valid values are 'sine', 'square', 'sawtooth', 'triangle' and 'custom'. The default is 'sine'.
	shape:OSCILLATOR_TYPES[3],
	
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

	slideDuration:8,
	fadeDuration:18,
}

export const INSTRUMENT_TYPE_OSCILLATOR = "OscillatorInstrument"

export default class OscillatorInstrument extends Instrument{

	static get name(){
		return INSTRUMENT_TYPE_OSCILLATOR
	}

	name = INSTRUMENT_TYPE_OSCILLATOR

	type = "oscillator"
	title = "Oscillator Instrument"

	envelope
	oscillator 

	get volume() {
		return this.gainNode.gain.value
	}

	set volume(value) {
		this.gainNode.gain.value = value
	}
	
	get audioNode(){
		return this.gainNode
	}

	constructor( audioContext, options={} ){

		super(audioContext, { ...OPTIONS, ...options })

		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 1 // this.currentVolume
		
		this.envelope = audioContext.createGain()
		this.envelope.gain.value = 1 
		
		this.oscillator = new OscillatorNode( audioContext, { ...this.options, type:this.options.shape }) 
		
		// const bitCrusher = new AudioWorkletNode(audioContext, 'bit-crusher-processor')
		// bitCrusher.onprocessorerror = () => {
		// 	console.error('An error from AudioWorkletProcessor.process() was detected.')
		// }
		
		// this.paramBitDepth = bitCrusher.parameters.get('bitDepth')
		// this.paramReduction = bitCrusher.parameters.get('frequencyReduction')
	
		// this.paramBitDepth.setValueAtTime(8, 0)
		// this.paramReduction.setValueAtTime(0.3, 0)

		// `frequencyReduction` parameters will be automated and changing over time.
		// Thus its parameter array will have 128 values.
		// paramReduction.setValueAtTime(0.01, 0)
		// paramReduction.linearRampToValueAtTime(0.1, 4)
		// paramReduction.exponentialRampToValueAtTime(0.01, 8)

		this.oscillator
			// .connect(bitCrusher)
			.connect(this.envelope)
			.connect(this.gainNode)

		// immediately start as always playing in silent
		this.oscillator.start()

		const shapeName = string => string[0].toUpperCase() + string.slice(1)

		this.title = `${shapeName(this.options.shape)} Wave Oscillator`
		this.available = true
	}

	async noteOn( noteNumber, velocity=1 ){
	
		console.error("oscillator",this,  this.options, this.oscillator.frequency.value, {noteNumber, velocity})
	
		this.envelope.gain.setValueAtTime(1, 0)
		// this.oscillator.linearRampToValueAtTime(0.1, 4)
		// this.oscillator.exponentialRampToValueAtTime(0.01, 8)

		// instantly or with slide?
		// this.oscillator.frequency.value = noteNumberToFrequency(noteNumber)
		
		// slide
		this.oscillator.frequency.exponentialRampToValueAtTime( noteNumberToFrequency(noteNumber), this.options.slideDuration )

		return super.noteOn(noteNumber, velocity)
	}
	
	async noteOff(noteNumber, velocity=0){
		this.envelope.gain.setValueAtTime( 0, this.options.fadeDuration )
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
		// this.oscillator.frequency.value = noteNumberToFrequencyFast(pitch)
		this.oscillator.exponentialRampToValueAtTime( noteNumberToFrequency(noteNumber), this.options.slideDuration )
		super.pitchBend(pitch)
	}
	
	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		const index = programNumber%(OSCILLATOR_TYPES.length-1)
		this.oscillator.type = OSCILLATOR_TYPES[index]
		return super.programChange( programNumber )
	}
	
	/**
	 * 
	 * @returns {Array<String>} of Instrument Names
	 */
	getPresets(){
		return OSCILLATOR_TYPES
	}

	// CUSTOM Methods
	setCustomWaveform(){
		this.oscillator.setCustomWaveform( periodicWave )
	}

	/**
	 * Here, we create a PeriodicWave with two values. 
	 * 
	 * The first value is the DC offset, which is the value at which the oscillator starts. 
	 * 0 is good here, because we want to start the curve at the middle of the [-1.0; 1.0] range.
	 * 
	 * The second and subsequent values are sine and cosine components. 
	 * You can think of it as the result of a Fourier transform, where you get frequency 
	 * domain values from time domain value. Here, with createPeriodicWave(), you specify the 
	 * frequencies, and the browser performs an inverse Fourier transform to get a time domain 
	 * buffer for the frequency of the oscillator. 
	 * 
	 * Here, we only set one component at full volume (1.0) on the fundamental tone, so we get a sine wave.
	 */
	setPeriodicWave(){
		const real = new Float32Array(2)
		const imag = new Float32Array(2)
		
		real[0] = 0
		imag[0] = 0
		real[1] = 1
		imag[1] = 0

		const periodicWave = this.context.createPeriodicWave(real, imag)
		this.oscillator.setPeriodicWave( periodicWave )
	}
}
