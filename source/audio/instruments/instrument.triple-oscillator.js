import { noteNumberToFrequency } from "../tuning/frequencies"
import Instrument from "./instrument"
import OscillatorInstrument, { OSCILLATOR_TYPES, shapeName } from "./instrument.oscillator"
import {PRESETS, PRESETS_NAMES} from "./presets/presets-oscillator.js"

export const INSTRUMENT_TYPE_TRIPLE_OSCILLATOR = "TripleOscillatorInstrument"

const OPTIONS = {
    
    // The shape of the wave produced by the node. Valid values are 'sine', 'square', 'sawtooth', 'triangle' and 'custom'. The default is 'sine'.
    shape:OSCILLATOR_TYPES[1],
    
    // A detuning value (in cents) which will offset the frequency by the given amount. Its default is 0.
    detune:0,

    // The frequency (in hertz) of the periodic waveform. Its default is 440.
    frequency:440,

	// volume of actual note
	amplitude:0.4,

    // An arbitrary period waveform described by a PeriodicWave object.
    // periodicWave:,

    // Represents an integer used to determine how many channels are used when up-mixing and down-mixing connections to any inputs to the node. (See AudioNode.channelCount for more information.) Its usage and precise definition depend on the value of channelCountMode.
    // channelCount

    // Represents an enumerated value describing the way channels must be matched between the node's inputs and outputs. (See AudioNode.channelCountMode for more information including default values.)
    // channelCountMode

    // Represents an enumerated value describing the meaning of the channels. This interpretation will define how audio up-mixing and down-mixing will happen. The possible values are "speakers" or "discrete". (See AudioNode.channelCountMode for more information including default values.)
    // channelInterpretation

	// from one note to another, how fast do we "glide"
    slideDuration:0.2,

	// Amplitude envelope
    fadeDuration:16,

	// filter options - change using presets
	filterGain :0.7,
	filterCutOff :2200,
	filterOverdrive:2.5,
	filterResonance :1.8,
	filterAttack :0.002,
	filterDecay :0.08,
	filterSustain :0.0,
	filterRelease :0.1,
}

// const PRESET_SINE = {
// 	filter: { cutoff: 2200, resonance: 1.8 },
// 	filterEnv: { attack: 0.002, decay: 0.08, sustain: 0.0, release: 0.1 }
// }

// export default class TripleOscillatorInstrument extends OscillatorInstrument{
export default class TripleOscillatorInstrument extends OscillatorInstrument{

    static get name(){
        return INSTRUMENT_TYPE_TRIPLE_OSCILLATOR
    }
    
    name = INSTRUMENT_TYPE_TRIPLE_OSCILLATOR
    title = "Triple Oscillator Instrument"
	// type = "oscillator"
   
	// currentVolume = 0.5
    // oscillator2
    // oscillator3

	set shape2(value){
		this.oscillator2.type = value
	}

	get shape2(){
		return this.oscillator2.type
	}

	set shape3(value){
		this.oscillator3.type = value
	}

	get shape3(){
		return this.oscillator3.type
	}

    // set both oscillators to the same shape
	set shapes(value){
		this.oscillator.type = value
		this.oscillator2.type = value
		this.oscillator3.type = value
	}

    async create(){    

		this.gainNode = this.context.createGain()
		this.gainNode.gain.value = 0.1 // this.currentVolume
		
		this.envelope = this.context.createGain()
		this.envelope.gain.value = 0

		// Create a low pass filter with
		this.filter = new BiquadFilterNode( this.context, {
			type : 'lowpass',
			Q:this.options.filterResonance,
			frequency:this.options.filterCutOff,
			detune:0,
			gain:this.options.filterGain
		})
		
		// Create sound sources
        this.oscillator = new OscillatorNode( this.context, { ...this.options, type:this.options.shape }) 
		this.oscillator
			.connect(this.envelope)
			.connect(this.filter)
			.connect(this.gainNode)

        this.oscillator2 = new OscillatorNode( this.context, { ...this.options, type:this.options.shape }) 
		this.oscillator2
			.connect(this.envelope)
			.connect(this.filter)
			.connect(this.gainNode)

        this.oscillator3 = new OscillatorNode( this.context, { ...this.options, type:this.options.shape }) 
		this.oscillator3
			.connect(this.envelope)
			.connect(this.filter)
			.connect(this.gainNode)

		// default shape
		this.shapes = this.options.shape

		// start sources - never stop them!		
		this.oscillator.start()
		this.oscillator2.start()
        this.oscillator3.start()

        return true
    }

	/**
	 * TODO:
	 */
    async destroy(){
	
		[this.oscillator, this.oscillator2, this.oscillator3].forEach( oscillator =>{
			oscillator.stop()
			oscillator.disconnect()
			oscillator = null
	 	} )

		this.filter.disconnect()
		this.envelope.disconnect()
		this.gainNode.disconnect()

		this.filter = null
		this.envelope = null
		this.gainNode = null
								
        super.destroy()
    }

    constructor( audioContext, options={} ){
        super(audioContext, { ...OPTIONS, ...options })
		this.title = `${options.name ?? shapeName(this.options.shape)} Triple Wave Oscillator`
		this.unique = this.type.toUpperCase()+"-"+String(++Instrument.uniqueCounter).padStart(9, '0')
    }

	/**
	 * Play a single note
	 * @param {Number} noteNumber 
	 * @param {Number} velocity 
	 * @returns 
	 */
    async noteOn( noteNumber, velocity=1 ){
		const now = this.currentTime
		const filterPeak = this.options.filterCutOff * this.options.filterOverdrive
        const filterSustain = this.options.filterCutOff + (filterPeak - this.options.filterCutOff) * this.options.filterSustain
       
		// Shape the note
		this.filter.frequency.cancelScheduledValues(now)
		this.filter.frequency.setValueAtTime(this.options.filterCutOff, now)
        this.filter.frequency.linearRampToValueAtTime(filterPeak, now + this.options.filterAttack)
        this.filter.frequency.linearRampToValueAtTime(filterSustain, now + this.options.filterAttack + this.options.filterDecay )

		// Change the pitch
		const frequency = noteNumberToFrequency(noteNumber)// - (this.options.detune ?? 0)
       
		this.oscillator2.frequency.cancelScheduledValues(now)
		this.oscillator3.frequency.cancelScheduledValues(now)
		
        this.oscillator2.frequency.exponentialRampToValueAtTime( frequency , now + this.options.slideDuration )
        this.oscillator3.frequency.exponentialRampToValueAtTime( frequency / 2, now + this.options.slideDuration )
        this.oscillator2.detune.value = this.options.detune ?? 0
		this.oscillator3.detune.value = this.options.detune ?? 0
		
		return super.noteOn( noteNumber, velocity )
    }

	/**
	 * 
	 * @param {Number} noteNumber 
	 * @param {Number} velocity 
	 * @returns 
	 */
	async noteOff(noteNumber, velocity=0){
		const now = this.currentTime
		this.filter.frequency.cancelScheduledValues(now)
		this.filter.frequency.linearRampToValueAtTime(this.options.filterCutOff, now + this.options.filterRelease)
		return super.noteOff(noteNumber, velocity)
	}

	/**
	 * 
	 * @param {Number} pitch 
	 */
    pitchBend(pitch){
		const now = this.currentTime
		const frequency = pitch // - (this.options.detune ?? 0)
        super.pitchBend(pitch)
        this.oscillator2.frequency.exponentialRampToValueAtTime( frequency, now + this.options.slideDuration )
        this.oscillator3.frequency.exponentialRampToValueAtTime( frequency/2, now + this.options.slideDuration )
    }

	/**
	 *  load a new PRESET 
	 * @param {Number|String|Object} programNumber 
	 * @returns 
	 */
	async programChange( programNumber ){
		
		// This can be a program number that represents one of the
		// built in presets or it can be a specific preset
		// 
		let program = null
		if (typeof programNumber === "string")
		{
			const isOscillatorType = OSCILLATOR_TYPES.includes(programNumber)
			if (isOscillatorType)
			{
				this.shapes = programNumber
				return
			}
			
			// determine if it a number or a name
			const isNumber = !isNaN(programNumber)
			// const index = isNumber ? 
			// 	programNumber : 
			// 	PRESETS[ PRESETS_NAMES.indexOf(programNumber) ] 
			
			program = isNumber ? PRESETS[ index ] : programNumber

		}else if (typeof programNumber === "object"){
			
			program = programNumber
		
		}else if (Array.isArray(programNumber)){
			// FIXME: an array of presets, one programNumber per oscilator
			
			this.shape = programNumber[0]
			this.shape2 = programNumber[1]
			this.shape3 = programNumber[2]
			program = {}
		}

		this.options = { ...program ,...this.options }
		this.shapes = this.options.shape ?? OSCILLATOR_TYPES[0]
		console.info("TripleOscillator Loading preset", program, this )

		return super.programChange( programNumber )
	}
	
	/**
	 * 
	 * @returns {Array<String>} of Instrument Names
	 */
	async getPresets(){
		return PRESETS
	}

	/**
	 * Create a copy of this instrument using the same settings
	 * as this current instance
	 * @returns {TripleOscillatorInstrument}
	 */
	clone(){
		return new TripleOscillatorInstrument(this.audioContext, this.options)
	}

	// ------ Instrument specific --------------------------------------

	applyPreset( preset ){

		// check to see if the shape setting is an array
		if (Array.isArray(preset.shape))
		{
			preset.shape.forEach( (shape, index) => 
			{
				this.shapes.push(shape) 
			})	

		}else{
			// 
			this.shapes = preset.shape
		}
		this.options = {...preset, ...this.options}
		return this
	}
	
    /**
	 * Custom oscillation waves
	 */
	setPeriodicWave(){
		const periodicWave = this.createPeriodicWave()
		this.oscillator.setPeriodicWave( periodicWave )
        this.oscillator2.setPeriodicWave( periodicWave )
        this.oscillator3.setPeriodicWave( periodicWave )
	}

	/**
	 * Useful for debugging
	 * @returns {String} of the current instrument settings
	 */
	toString(){
		return `TripleOscillatorInstrument OSC-A: ${this.oscillator.type} OSC-B: ${this.oscillator2.type} OSC-C: ${this.oscillator3.type}`
	}
}