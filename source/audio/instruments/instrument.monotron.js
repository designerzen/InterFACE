import Instrument from './instrument.js'
import {noteNumberToFrequency} from '../tuning/frequencies.js'
import { GENERAL_MIDI_INSTRUMENTS } from '../midi/general-midi.constants.js'

export const OSCILLATOR_TYPES = ["sine","square","triangle","sawtooth" ] //,"custom"]

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

	slideDuration:8.00005,
	
	fadeDuration:0.01,
}

export const INSTRUMENT_TYPE_MONOTRON = "VirtualMonotronInstrument"
	
export default class MonotronInstrument extends Instrument{

	static get name(){
		return INSTRUMENT_TYPE_MONOTRON
	}

	name = INSTRUMENT_TYPE_MONOTRON

	type = "synthesizer"
	title = "Monotron"

	/* 
	envelope

	// noise making nodes
	vcf
	vco 
	lfo 
	lfoGain

	gainNode
	*/

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

	set VCOType(value){
		this.vco.type = value
	}
	set LFOType(value){
		this.lfo.type = value
	}

	constructor( audioContext, options={} ){
		super(audioContext, { ...OPTIONS, ...options })
	}

	async create(){
		this.gainNode = this.context.createGain()
		this.gainNode.gain.value = 1 // this.currentVolume
		
		this.lfoGain =  this.context.createGain()

		this.envelope =  this.context.createGain()
		this.envelope.gain.value = 0  // silence immediately

		this.vco = new OscillatorNode(  this.context, { ...this.options, type:OSCILLATOR_TYPES[0] }) 
		this.vco.type = this.options.shape ?? OSCILLATOR_TYPES[2]
		
		this.lfo = new OscillatorNode(  this.context, { ...this.options, type:OSCILLATOR_TYPES[1] }) 
		this.lfo.type = this.options.shape ?? OSCILLATOR_TYPES[2]

		this.vcf =  this.context.createBiquadFilter()

		this.vco.connect(this.vcf)
		this.lfo.connect(this.lfoGain)
		this.lfoGain.connect(this.vcf.frequency)
		this.vcf.connect(this.envelope)
		this.envelope.connect(this.gainNode)

		// this.delayNode.connect(this.stereoNode)
		// this.stereoNode.connect(this.mixer)

		// immediately start as always playing in silent
		this.vco.start( this.context.currentTime)
		this.lfo.start( this.context.currentTime)
		
		return await super.create()
	}

	async destroy(){
		this.vco.stop()
		this.lfo.stop()
		this.available = false
		return true
	}

	/**
	 * Start playing a note
	 * @param {Number} noteNumber 
	 * @param {Number} velocity 
	 * @returns 
	 */
	async noteOn( noteNumber, velocity=1 ){
		const now = this.currentTime
		
		const frequency = noteNumberToFrequency(noteNumber)
		const isNewNote = await super.noteOn(noteNumber, velocity)
		
		// console.info("Oscillator", noteNumber, frequency, this.vco.frequency.value) 
		// console.error("Oscillator", this, this.options, this.oscillatorA.frequency.value, {frequency, noteNumber, velocity})
		const startAtTime = this.context.currentTime + this.options.slideDuration
			
		this.vco.frequency.cancelScheduledValues(now)
		if (isNewNote)
		{
			// instantly or with slide?
			// this.vco.frequency.value = frequency
			this.vco.frequency.setValueAtTime(frequency, now )
			  
		}else{

			// slide to pitch at time
			this.vco.frequency.exponentialRampToValueAtTime( frequency, startAtTime )
			// this.lfo.frequency.exponentialRampToValueAtTime( frequency, startAtTime )
		}

		// this.envelope.gain.setValueAtTime(1, 0)
			
		this.envelope.gain.cancelScheduledValues(now)
		this.envelope.gain.linearRampToValueAtTime(1, now )
			
		return isNewNote
	}
	
	/**
	 * Stop this playing note
	 * @param {Number} noteNumber 
	 * @param {Number} velocity 
	 * @returns 
	 */
	async noteOff(noteNumber, velocity=1){
		// sharp cut / if you want a nice tail
		// this.envelope.gain.setValueAtTime( 0, this.context.currentTime + this.options.fadeDuration*velocity )
		this.envelope.gain.cancelScheduledValues(this.currentTime)
		this.envelope.gain.linearRampToValueAtTime( 0, this.currentTime + this.options.fadeDuration*velocity )
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
	 * @param {Number} pitch 
	 */
	pitchBend(pitch){
		// this.oscillatorA.frequency.value = noteNumberToFrequencyFast(pitch)
		// this.oscillatorB.frequency.value = noteNumberToFrequencyFast(pitch)
		this.vco.frequency.cancelScheduledValues(this.currentTime)
		this.vco.frequency.cancelScheduledValues(this.currentTime)
		
		this.vco.frequency.exponentialRampToValueAtTime( pitch, this.options.slideDuration )
		this.lfo.frequency.exponentialRampToValueAtTime( pitch, this.options.slideDuration )
		super.pitchBend(pitch)
	}
	
	/**
	 * Program Change. 
	 * This message sent when the patch number changes. 
	 * Here we wire up each instrument as a series of nodes
	 * and filters in order to create a believable sound
	 * @param {Number|String} programNumber - new program number.
	 */
	async programChange( programNumber ){

		// check if it is a number or a string
		if (!Number.isNaN(programNumber))
		{
			// find preset number and return as instrument name string
			programNumber = this.getPresets()[programNumber]
		}

		switch( programNumber ){

			case 'Monotron Sine': 
				this.vco.type = OSCILLATOR_TYPES[0]
				this.lfo.type = OSCILLATOR_TYPES[0]
				break
			
			case 'Monotron Square': 
				this.vco.type = OSCILLATOR_TYPES[1]
				this.lfo.type = OSCILLATOR_TYPES[1]
				break

			case 'Monotron Triangle' :
				this.vco.type = OSCILLATOR_TYPES[2]
				this.lfo.type = OSCILLATOR_TYPES[2]
				break	
				
			case 'Monotron Custom' :
				this.setPeriodicWave()
				break	

			case 'Monotron Original': 
			default:	
				this.vco.type = OSCILLATOR_TYPES[3]
				this.lfo.type = OSCILLATOR_TYPES[3]
		}
	}

	/**
	 * Get a list of all the instrument names available for this
	 * instrument preferably 
	 * @returns {Array<String>} of Instrument Names
	 */
	getPresets(){
		return [ 
			'Monotron Original', 
			'Monotron Sine',
			'Monotron Square', 
			'Monotron Triangle',
			'Monotron Custom'
		] 
	}

	clone(){
		return new MonotronInstrument(this.audioContext, this.options)
	}

	// CUSTOM Methods 
	// I was hoping to use this to add some DC offset for the oscillators
	// so that they can phase in stereo
	setCustomWaveform(){
		this.vco.setCustomWaveform( periodicWave )
		this.lfo.setCustomWaveform( periodicWave )
		// this.oscillatorB.setCustomWaveform( periodicWave )
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
		const imaginary = new Float32Array(2)
		
		real[0] = 0
		imaginary[0] = 0
		real[1] = 1
		imaginary[1] = 0

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

		const periodicWave = this.context.createPeriodicWave(real, imaginary)
		this.vco.setPeriodicWave( periodicWave )
		this.lfo.setPeriodicWave( periodicWave )
	}
}
	