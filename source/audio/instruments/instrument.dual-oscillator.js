import { noteNumberToFrequency } from "../tuning/frequencies"
import OscillatorInstrument, { OSCILLATOR_TYPES, shapeName } from "./instrument.oscillator"
import { PRESETS } from "./presets/presets-oscillator"

export const INSTRUMENT_TYPE_DUAL_OSCILLATOR = "DualOscillatorInstrument"

// Default options that the user can override
const OPTIONS = {
    
    // The shape of the wave produced by the node. Valid values are 'sine', 'square', 'sawtooth', 'triangle' and 'custom'. The default is 'sine'.
    shape:OSCILLATOR_TYPES[0],
    
    // A detuning value (in cents) which will offset the frequency by the given amount. Its default is 0.
    detune:0,

    // The frequency (in hertz) of the periodic waveform. Its default is 440.
    frequency:440,

	amplitude:0.3,
    // An arbitrary period waveform described by a PeriodicWave object.
    // periodicWave:,

    // Represents an integer used to determine how many channels are used when up-mixing and down-mixing connections to any inputs to the node. (See AudioNode.channelCount for more information.) Its usage and precise definition depend on the value of channelCountMode.
    // channelCount

    // Represents an enumerated value describing the way channels must be matched between the node's inputs and outputs. (See AudioNode.channelCountMode for more information including default values.)
    // channelCountMode

    // Represents an enumerated value describing the meaning of the channels. This interpretation will define how audio up-mixing and down-mixing will happen. The possible values are "speakers" or "discrete". (See AudioNode.channelCountMode for more information including default values.)
    // channelInterpretation

    slideDuration:0.05,
    fadeDuration:10,

	// filter options - change using presets
	filterGain :0.5,
	filterOverdrive:0.5,
	filterCutOff :800,
	filterResonance :0.3,
	filterAttack :0.7,
	filterDecay :0.8,
	filterSustain :0.6,
	filterRelease :2,
}

export default class DualOscillatorInstrument extends OscillatorInstrument{

    static get name(){
        return INSTRUMENT_TYPE_DUAL_OSCILLATOR
    }
    
    name = INSTRUMENT_TYPE_DUAL_OSCILLATOR
    title = "Dual Oscillator Instrument"
	type = "oscillator"
   

	// this seems to break the oscillators(!)
    // oscillator2
	// filter

	set shape2(value){
		this.oscillator2.type = value
	}

	get shape2(){
		return this.oscillator2.type
	}

    // set both oscillators to the same shape
	set shapes(value){
		this.oscillator.type = value
		this.oscillator2.type = value
	}

    async create(){        
        this.gainNode = this.context.createGain()
		this.gainNode.gain.value = 0.16 // this.currentVolume
		
		this.envelope = this.context.createGain()
		this.envelope.gain.value = 0
     
		this.filter = new BiquadFilterNode( this.context, {
			type : 'lowpass',
			Q:this.options.filterResonance,
			frequency:this.options.filterCutOff,
			detune:0,
			gain:this.options.filterGain
		})

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

		this.shapes = this.options.shape

		this.oscillator.start()
		this.oscillator2.start()

		return true
    }

	/**
	 * TODO:
	 */
    async destroy(){
		console.error("DESTROYING", this)
		[this.oscillator, this.oscillator2].forEach( oscillator =>{
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
		this.title = `${options.name ?? shapeName(this.options.shape)} Dual Wave Oscillator`
    }

    async noteOn( noteNumber, velocity=1 ){
		const now = this.currentTime
		const slideTo = super.noteOn(noteNumber, velocity)
		const filterPeak = this.options.filterCutOff * this.options.filterOverdrive
        const filterSustain =  this.options.filterCutOff + (filterPeak - this.options.filterCutOff) * this.options.filterSustain
       
		this.filter.frequency.cancelScheduledValues(now)
		this.filter.frequency.setValueAtTime(this.options.filterCutOff, now)
        this.filter.frequency.linearRampToValueAtTime(filterPeak, now + this.options.filterAttack)
        this.filter.frequency.linearRampToValueAtTime(filterSustain, now + this.options.filterAttack + this.options.filterDecay )
	
		// second oscillator is tuned up whilst first is tuned down
		this.oscillator2.frequency.cancelScheduledValues(now)
		if (slideTo)
		{
  			this.oscillator2.frequency.exponentialRampToValueAtTime( noteNumberToFrequency(noteNumber), now + this.options.slideDuration )
		}else{
			this.oscillator2.frequency.value = noteNumberToFrequency(noteNumber)
		}
		 
		this.oscillator2.detune.value = this.options.detune ?? 0
		
		return slideTo
    }
	
	async noteOff(noteNumber, velocity=0){
		const now = this.currentTime
		this.filter.frequency.cancelScheduledValues(now)
		this.filter.frequency.linearRampToValueAtTime(this.options.filterCutOff, now + this.options.filterRelease)
		return super.noteOff(noteNumber, velocity)
	}

    pitchBend(pitch){
		const now = this.currentTime
		const frequency = pitch // - (this.options.detune ?? 0)
        super.pitchBend(pitch)
		this.oscillator2.frequency.cancelScheduledValues(now)
		this.oscillator2.frequency.exponentialRampToValueAtTime( frequency, now + this.options.slideDuration )
    }

	/**
	 * 
	 * @returns {Array<String>} of Instrument Names
	 */
	getPresets(){
		return PRESETS.PRESETS_NAMES
	}


	clone(){
		return new DualOscillatorInstrument(this.audioContext, this.options)
	}
    
	setPeriodicWave(){
		const periodicWave = this.createPeriodicWave()
		this.oscillator.setPeriodicWave( periodicWave )
        this.oscillator2.setPeriodicWave( periodicWave )
	}
}