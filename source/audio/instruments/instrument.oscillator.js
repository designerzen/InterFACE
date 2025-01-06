import Instrument from './instrument'
import {noteNumberToFrequency} from '../tuning/frequencies.js'

export const OSCILLATOR_TYPES = ["sine","square","triangle","sawtooth","custom"]

const OPTIONS = {
	
	// The shape of the wave produced by the node. Valid values are 'sine', 'square', 'sawtooth', 'triangle' and 'custom'. The default is 'sine'.
	shape:OSCILLATOR_TYPES[0],
	
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

	slideDuration:6,
	fadeDuration:18,
}


export const shapeName = string => string[0].toUpperCase() + string.slice(1)

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

	attack = 0.001
	decay = 0.1
	sustain = 0.5
	release = 0.1

	get volume() {
		return this.gainNode.gain.value
	}

	set volume(value) {
		if (this.gainNode)
		{
			this.gainNode.gain.value = value
		}
		super.volume = value
	}
	
	get audioNode(){
		return this.gainNode
	}

	set shape(value){
		this.oscillator.type = value
	}

	get shape(){
		return this.oscillator.type
	}

	async create(){
		await super.create()
		this.gainNode = this.context.createGain()
		this.gainNode.gain.value = this.currentVolume
		
		this.envelope = this.context.createGain()
		this.envelope.gain.value = 0
		
		this.oscillator = new OscillatorNode( this.context, { ...this.options, type:this.options.shape }) 
		this.oscillator
			.connect(this.envelope)
			.connect(this.gainNode)

		// immediately start as always playing in silent
		this.oscillator.start()
		return true
	}

	async destroy(){
		return await super.destroy()
	}

	constructor( audioContext, options={} ){

		super(audioContext, { ...OPTIONS, ...options })
		this.create()

		this.title = `${options.name ?? shapeName(this.options.shape)} Wave Oscillator`
		this.available = true
	}

	async noteOn( noteNumber, velocity=1 ){
	
		// console.error("oscillator",this,  this.options, this.oscillator.frequency.value, {noteNumber, velocity})
	
		// FIXME
		
		// this.envelope.gain.setValueAtTime(1, 0)
		this.envelope.gain.linearRampToValueAtTime(1, this.context.currentTime+this.attack )
		// this.oscillator.linearRampToValueAtTime(0.1, 4)
		// this.oscillator.exponentialRampToValueAtTime(0.01, 8)

		// instantly or with slide?
		// this.oscillator.frequency.value = noteNumberToFrequency(noteNumber)
		
		// slide
		this.oscillator.frequency.exponentialRampToValueAtTime( noteNumberToFrequency(noteNumber)+ (this.options.detune ?? 0), this.options.slideDuration )

		return super.noteOn(noteNumber, velocity)
	}
	
	async noteOff(noteNumber, velocity=0){
		this.envelope.gain.setValueAtTime( 0, this.context.currentTime+(velocity ?? this.decay ) )
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
		return super.aftertouch( noteNumber, pressure )
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
		this.oscillator.exponentialRampToValueAtTime( pitch, this.options.slideDuration )
		return super.pitchBend(pitch)
	}
	
	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		const index = programNumber%(OSCILLATOR_TYPES.length-1)
		this.shape = OSCILLATOR_TYPES[index]
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
		this.oscillator.setCustomWaveform( this.createPeriodicWave() )
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
	createPeriodicWave(){
		const real = new Float32Array(2)
		const imag = new Float32Array(2)
		
		real[0] = 0
		imag[0] = 0
		real[1] = 1
		imag[1] = 0

		
		/* Sine 
		imaginary[1] = 1; */

		/* Sawtooth 
		for(x=1;x<n;x++)
			imaginary[x] = 2.0 / (Math.pow(-1, x) * Math.PI * x); */

		/* Square 
		for(x=1;x<n;x+=2)
			imaginary[x] = 4.0 / (Math.PI * x);


		/* Triangle
		for(x=1;x<n;x+=2) 
			imag[x] = 8.0 / Math.pow(Math.PI, 2) * Math.pow(-1, (x-1)/2) / Math.pow(x, 2) * Math.sin(Math.PI * x);
		*/

		const periodicWave = this.context.createPeriodicWave(real, imag)
		return periodicWave
	}

	setPeriodicWave(){
		this.oscillator.setPeriodicWave( this.createPeriodicWave() )
	}
}
