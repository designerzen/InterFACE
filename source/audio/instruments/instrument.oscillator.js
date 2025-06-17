import Instrument from './instrument'
import {noteNumberToFrequency} from '../tuning/frequencies.js'

export const OSCILLATOR_TYPES = [
	"sine",
	"square",
	"triangle",
	"sawtooth"
]

const OPTIONS = {
	
	// The shape of the wave produced by the node. Valid values are 'sine', 'square', 'sawtooth', 'triangle' and 'custom'. The default is 'sine'.
	shape:OSCILLATOR_TYPES[0],
	
	// A detuning value (in cents) which will offset the frequency by the given amount. Its default is 0.
	detune:0,

	// The frequency (in hertz) of the periodic waveform. Its default is 440.
	frequency:440,

	// volume of actual note
	amplitude:0.7,

	// An arbitrary period waveform described by a PeriodicWave object.
	// periodicWave:,

	// Represents an integer used to determine how many channels are used when up-mixing and down-mixing connections to any inputs to the node. (See AudioNode.channelCount for more information.) Its usage and precise definition depend on the value of channelCountMode.
	// channelCount

	// Represents an enumerated value describing the way channels must be matched between the node's inputs and outputs. (See AudioNode.channelCountMode for more information including default values.)
	// channelCountMode

	// Represents an enumerated value describing the meaning of the channels. This interpretation will define how audio up-mixing and down-mixing will happen. The possible values are "speakers" or "discrete". (See AudioNode.channelCountMode for more information including default values.)
	// channelInterpretation

	slideDuration:0.3,
	fadeDuration:18,
}

export const shapeName = string => string[0].toUpperCase() + string.slice(1)

export const INSTRUMENT_TYPE_OSCILLATOR = "OscillatorInstrument"

export default class OscillatorInstrument extends Instrument{

	static get name(){
		return INSTRUMENT_TYPE_OSCILLATOR
	}

	static get presetNames(){
		return OscillatorInstrument.presetsMap.keys()
	}

	static presets = []
	static presetsMap = new Map()

	/**
	 * If you pass in either a manifest JSON 
	 * or a manifest URI, it will load the waveforms
	 * or if you provide a zip, even better.
	 * This will create all the extra presets and allows
	 * the instrument to play entirely new sounds
	 * @param {String|URI|Object|Array|Map} waveforms 
	 */
	static setPresets(waveforms){
		// Add to static so can be loaded by any oscillator	
		waveforms.forEach( wave => {
			OscillatorInstrument.presetsMap.set( wave.name, wave ) 
			OscillatorInstrument.presets.push( wave ) 
		})
		return OscillatorInstrument.presets
	}

	name = INSTRUMENT_TYPE_OSCILLATOR

	type = "oscillator"
	title = "Oscillator Instrument"

	timbre = OSCILLATOR_TYPES[0]
	customWave = null

	// when overriding this, uncommenting this
	// will overide any instance with undefined!
	// envelope
	// oscillator 

	currentVolume = 0.5

	attack = 0.001
	decay = 0.1
	sustain = 0.8
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
        // there are 3 different sources of shapes :
        switch (typeof value ){

            case 'string':
				const isNumber = !isNaN(value)
				if (isNumber)
				{
					this.setWaveTable( OscillatorInstrument.presets[programNumber] )
				
				}else if (OSCILLATOR_TYPES.includes(value)){

                    // 1. the oscillator type
                    // console.info("SynthOscillator::STANDARD"+ this.options, value)
                    if ( this.oscillator )
                    {
                        this.oscillator.type = value
						this.name = value
                    }
                    this.customWave = null

                }else {

                    // 2. attempt to load in customWave JSON data from a URI
					const waves = OscillatorInstrument.presetsMap.get( value )
                    this.setWaveTable( waves )
					this.name = value
                } 
                break
        
            case 'object':
                // 3. customWave data with real and imag arrays
                this.setWaveTable( value )
				this.name = "Custom WaveShape"
                // console.info("SynthOscillator::CUSTOM DATA"+this.options, value )
                break

            default: 
			 	if (Array.isArray(programNumber)){

				}
                console.warn("SynthOscillator::UNKNOWN Shape TYPE", value)
        }
    
        this.options.shape = value
	}

	get shape(){
		return this.options.shape
	}

	set detune(value){
        this.oscillator.detune.value = value
    }

    get detune(){
        return this.oscillator.detune.value
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

		this.timbre = this.options.shape
		// immediately start as always playing in silent
		this.oscillator.start()
		
		//console.info("OscillatorInstrument.create() called", this )
		return true
	}

	async destroy(){
		return await super.destroy()
	}

	constructor( audioContext, options={} ){
		super(audioContext, { ...OPTIONS, ...options })
		this.title = `${options.name ?? shapeName(this.options.shape)} Wave Oscillator`
	}

	/**
	 * 
	 * @param {Number} noteNumber 
	 * @param {Number} velocity 
	 * @returns 
	 */
	async noteOn( noteNumber, velocity=1 ){
		const now = this.currentTime
		const noteAlreadyPlaying = super.noteOn(noteNumber, velocity)
		// console.error("oscillator",this,  this.options, this.oscillator.frequency.value, {noteNumber, velocity})
	
		// this.envelope.gain.setValueAtTime(1, 0)
		
	
		// this.oscillator.frequency.linearRampToValueAtTime(0.1, 4)
		
		// instantly or with slide?
		this.oscillator.frequency.cancelScheduledValues(now)
		if (noteAlreadyPlaying)
		{
			this.oscillator.frequency.exponentialRampToValueAtTime( noteNumberToFrequency(noteNumber), now + this.options.slideDuration )
		}else{
				// shape envelope
			this.envelope.gain.cancelScheduledValues(now)
			this.envelope.gain.linearRampToValueAtTime( this.options.amplitude, now+this.attack )
			this.envelope.gain.linearRampToValueAtTime( this.sustain, now+this.attack+this.decay )
			
			this.oscillator.frequency.setValueAtTime( noteNumberToFrequency(noteNumber), now )
		}
		this.oscillator.detune.value = this.options.detune ?? 0
	
		return noteAlreadyPlaying
	}
	
	/**
	 * Note OFF
	 * @param {Number} noteNumber s
	 * @param {Number} velocity 
	 * @returns 
	 */
	async noteOff(noteNumber, velocity=0){
		const now = this.currentTime
		// this.envelope.gain.setValueAtTime( 0, this.context.currentTime+(velocity ?? this.decay ) )
		this.envelope.gain.cancelScheduledValues(now)
		this.envelope.gain.linearRampToValueAtTime( 0, now+(velocity ?? this.decay ) )
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
		const frequency = pitch// - (this.options.detune ?? 0)
		// this.oscillator.frequency.value = noteNumberToFrequencyFast(pitch)
		// console.error(frequency, "pitchBend", typeof frequency, isFinite(frequency) )
		// this.oscillator.frequency.exponentialRampToValueAtTime( frequency, this.options.slideDuration )
		this.oscillator.frequency.linearRampToValueAtTime( frequency, this.options.slideDuration )
		return super.pitchBend(pitch)
	}
	
	// to load a new sample we can use the traditional midi methods...
	async programChange( programNumberOrName ){
		this.shape = programNumberOrName
		return super.programChange( programNumberOrName )
	}
	
	/**
	 * 
	 * @returns {Array<String>} of Instrument Names
	 */
	async getPresets(){
		return [ ...OSCILLATOR_TYPES, ...OscillatorInstrument.presetNames ]
	}

	
	clone(){
		return new OscillatorInstrument(this.audioContext, this.options)
	}

	// CUSTOM Methods
	setCustomWaveform( customWaveFunction=this.createPeriodicWave ){

		// eg.
		// sineTerms = new Float32Array([0, 0, 1, 0, 1])
		// cosineTerms = new Float32Array(sineTerms.length)
		// customWaveform = this.context.createPeriodicWave(cosineTerms, sineTerms)

		this.oscillator.setCustomWaveform( customWaveFunction() )
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

		const periodicWave = this.context.createPeriodicWave(real, imag)
		return periodicWave
	}

	setPeriodicWave(){
		this.oscillator.setPeriodicWave( this.createPeriodicWave() )
	}

	setWaveTable(waveTable){
        const {real, imag} = waveTable
        const waveData = this.audioContext.createPeriodicWave(real, imag, { disableNormalization: true })
        // reshape any playing oscillators
        if ( this.oscillator)
        {
            this.oscillator.setPeriodicWave(waveData)
        }
        this.customWave = waveData
        return waveData
    }

	toString(){
		return `SynthOscillator ${this.oscillator.type} ${this.name}`
	}
}