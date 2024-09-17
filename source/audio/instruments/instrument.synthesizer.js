import Instrument from './instrument'
import {noteNumberToFrequency} from '../tuning/frequencies.js'
import { GENERAL_MIDI_INSTRUMENTS } from '../midi/general-midi.constants.js'

export const OSCILLATOR_TYPES = ["sine","square","triangle","sawtooth" ] //,"custom"]

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
	
	fadeDuration:0.01,
}

export const INSTRUMENT_TYPE_SYNTHESIZER = "SynthesizerInstrument"

const createNoiseBuffer = (audioContext, length=4096) => {
	const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate)
	const bufferData = buffer.getChannelData(0)
	for (let i = 0; i < 4096; ++i) 
	{
		// top heavy noise?
		bufferData[i] = Math.random() / 2
	}
	return buffer
}

export default class SynthesizerInstrument extends Instrument{

	static get name(){
		return INSTRUMENT_TYPE_SYNTHESIZER
	}

	name = INSTRUMENT_TYPE_SYNTHESIZER

	type = "synthesizer"
	title = "Dual Wave Oscillator"
	
	envelope

	// noise making nodes
	oscillatorA 
	oscillatorB 
	noise

	// filters
	bandpass
	highpass
	lowpass

	noiseGainNode
	delayNode
	stereoNode

	get volume() {
		return this.gainNode.gain.value
	}

	set volume(value) {
		this.gainNode.gain.value = value
		super.volume = value
	}
	
	get audioNode(){
		return this.gainNode
	}


	set oscillatorAType(value){
		this.oscillatorA.type = value
	}
	set oscillatorBType(value){
		this.oscillatorB.type = value
	}
	set noiseGain(value){
		this.noiseGainNode.gain.value = value
	}
	set delayTime(value){
		this.delayNode.delayTime.value = value
	}

	constructor( audioContext, options={} ){

		super(audioContext, { ...OPTIONS, ...options })

		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 1 // this.currentVolume
		
		this.envelope = audioContext.createGain()
		this.envelope.gain.value = 0  // silence immediately

		this.mixer = audioContext.createGain()
		this.mixer.gain.value = 1 

		this.noiseGainNode = audioContext.createGain()
		this.noiseGainNode.gain.value = 1 

		// we only apply this to one side of the mix
		this.delayNode = audioContext.createDelay()
		this.delayNode.delayTime.value = 0.5
		
		this.stereoNode = audioContext.createChannelSplitter()
		
		this.oscillatorA = new OscillatorNode( audioContext, { ...this.options, type:OSCILLATOR_TYPES[0] }) 
		this.oscillatorA
			.connect(this.envelope)
			.connect(this.mixer)

		this.oscillatorB = new OscillatorNode( audioContext, { ...this.options, type:OSCILLATOR_TYPES[1] }) 
		this.oscillatorB
			.connect(this.envelope)
			.connect(this.mixer)

		// notch filter
		this.bandpass = audioContext.createBiquadFilter()
		this.bandpass.type = "bandpass"
		this.bandpass.frequency.value = 0.5
		this.bandpass.connect(this.mixer)

		// just allow the treble through
		this.highpass = audioContext.createBiquadFilter()
		this.highpass.type = "highpass"
		this.highpass.frequency.value = 0.5
		this.highpass.connect(this.mixer)

		// just allow the bass through
		this.lowpass = audioContext.createBiquadFilter()
		this.lowpass.type = "lowpass"
		this.lowpass.frequency.value = 0.5
		this.lowpass.connect(this.mixer)

		// create our white noise and attach to the low pass filter
		this.noise = audioContext.createBufferSource()
		this.noise.buffer = createNoiseBuffer(audioContext)
		this.noise.loop = true
		this.noise.connect(this.mixer)
		// this.noise.connect(this.noiseGainNode)
		// this.noiseGainNode.connect(this.lowpass)
	
		this.mixer
			// .connect(bitCrusher)
			.connect(this.gainNode)
			
		// this.delayNode.connect(this.stereoNode)
		// this.stereoNode.connect(this.mixer)

		// immediately start as always playing in silent
		this.oscillatorA.start()
		this.oscillatorB.start()

		this.available = true
	}

	/**
	 * Start playing a note
	 * @param {Number} noteNumber 
	 * @param {Number} velocity 
	 * @returns 
	 */
	async noteOn( noteNumber, velocity=1 ){
	
		const frequency = noteNumberToFrequency(noteNumber)
		const isNewNote = super.noteOn(noteNumber, velocity)
		
		console.error("Oscillator", noteNumber, frequency, this.oscillatorA.frequency.value) 
		// console.error("Oscillator", this, this.options, this.oscillatorA.frequency.value, {frequency, noteNumber, velocity})
	
		this.envelope.gain.setValueAtTime(1, 0)
	
		if (isNewNote)
		{
			// instantly or with slide?
			this.oscillatorA.frequency.value = frequency
			this.oscillatorB.frequency.value = frequency
		
		}else{

			// slide to pitch at time
			const startAtTime = this.context.currentTime + this.options.slideDuration
			this.oscillatorA.frequency.exponentialRampToValueAtTime( frequency, startAtTime )
			this.oscillatorB.frequency.exponentialRampToValueAtTime( frequency, startAtTime )
		}
		
		// this.oscillator.linearRampToValueAtTime(0.1, 4)
		// this.oscillator.exponentialRampToValueAtTime(0.01, 8)
		return isNewNote
	}
	
	/**
	 * 
	 * @param {Number} noteNumber 
	 * @param {Number} velocity 
	 * @returns 
	 */
	async noteOff(noteNumber, velocity=1){
		// if you want a nice tail
		this.envelope.gain.setValueAtTime( 0, this.context.currentTime + this.options.fadeDuration*velocity )
		// this.envelope.gain.value =  0
		
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
		const frequency = noteNumberToFrequency(noteNumber)
		// this.oscillatorA.frequency.value = noteNumberToFrequencyFast(pitch)
		// this.oscillatorB.frequency.value = noteNumberToFrequencyFast(pitch)
		this.oscillatorA.exponentialRampToValueAtTime( frequency, this.options.slideDuration )
		this.oscillatorB.exponentialRampToValueAtTime( frequency, this.options.slideDuration )
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

		switch( programNumber.toLowerCase() ){

			case 0:
			case "acoustic grand piano":
				this.oscillatorAType = OSCILLATOR_TYPES[0]
				this.oscillatorBType = OSCILLATOR_TYPES[0]
				break

			case 80:
			case "lead 1 (square)":
				this.oscillatorAType = OSCILLATOR_TYPES[0]
				this.oscillatorBType = OSCILLATOR_TYPES[0]
				break

			case 81:
			case "lead 2 (sawtooth)":
				this.oscillatorAType = OSCILLATOR_TYPES[3]
				this.oscillatorBType = OSCILLATOR_TYPES[4]
				break

			// tube instrument like a baby church organ or magix roundabout
			case 82:
			case "lead 3 (calliope)":
				this.oscillatorAType = OSCILLATOR_TYPES[0]
				this.oscillatorBType = OSCILLATOR_TYPES[1]
				break

			case 83:
			case "lead 4 (chiff)":
				this.oscillatorAType = OSCILLATOR_TYPES[0]
				this.oscillatorBType = OSCILLATOR_TYPES[1]
				break
			case 84:
			case "lead 5 (charang)":
				this.oscillatorAType = OSCILLATOR_TYPES[0]
				this.oscillatorBType = OSCILLATOR_TYPES[1]
				break
			case 85:
			case "lead 6 (voice)":
				this.oscillatorAType = OSCILLATOR_TYPES[0]
				this.oscillatorBType = OSCILLATOR_TYPES[1]
				break
			case 86:
			case "lead 7 (fifths)":
				this.oscillatorAType = OSCILLATOR_TYPES[0]
				this.oscillatorBType = OSCILLATOR_TYPES[1]
				break
			case 87:
			case "lead 8 (bass + lead)":
				this.oscillatorAType = OSCILLATOR_TYPES[0]
				this.oscillatorBType = OSCILLATOR_TYPES[1]
				break

			// Pads!
			case 88:
			case "pad 1 (new age)":
				this.oscillatorAType = OSCILLATOR_TYPES[0]
				this.oscillatorBType = OSCILLATOR_TYPES[1]
				break
		}
			
	}

	/**
	 * Get a list of all the instrument names available for this
	 * instrument preferably 
	 * @returns {Array<String>} of Instrument Names
	 */
	getPresets(){
		return [ ...GENERAL_MIDI_INSTRUMENTS ] 
	}

	// CUSTOM Methods 
	// I was hoping to use this to add some DC offset for the oscillators
	// so that they can phase in stereo
	setCustomWaveform(){
		this.oscillatorA.setCustomWaveform( periodicWave )
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
		this.oscillatorA.setPeriodicWave( periodicWave )
		this.oscillatorB.setPeriodicWave( periodicWave )
	}
}
