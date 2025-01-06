import { noteNumberToFrequency } from "../tuning/frequencies"
import OscillatorInstrument, { OSCILLATOR_TYPES, shapeName } from "./instrument.oscillator"

export const INSTRUMENT_TYPE_DUAL_OSCILLATOR = "DualOscillatorInstrument"


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


export default class DualOscillatorInstrument extends OscillatorInstrument{

    static get name(){
        return INSTRUMENT_TYPE_DUAL_OSCILLATOR
    }
    
    name = INSTRUMENT_TYPE_DUAL_OSCILLATOR
    title = "Dual Oscillator Instrument"
   
	currentVolume = 0.5
    oscillator2

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
        await super.create()
        this.oscillator2 = new OscillatorNode( this.context, { ...this.options, type:this.options.shape }) 
		this.oscillator2
			.connect(this.envelope)
			.connect(this.gainNode)

        this.oscillator2.start()
        
        console.error("OscillatorInstrument.create() called", this.oscillator2, this )
        return true
    }

    async destroy(){
        super.destroy()
    }

    constructor( audioContext, options={} ){
        super(audioContext, { ...OPTIONS, ...options })
		this.title = `${options.name ?? shapeName(this.options.shape)} Dual Wave Oscillator`
    }

    async noteOn( noteNumber, velocity=1 ){
        // second oscillator is tuned up whilst first is tuned down
        this.oscillator2.frequency.exponentialRampToValueAtTime( noteNumberToFrequency(noteNumber) - (this.options.detune ?? 0), this.options.slideDuration )
        return super.noteOn( noteNumber, velocity )
    }

    pitchBend(pitch){
        super.pitchBend(pitch)
        this.oscillator2.exponentialRampToValueAtTime( pitch, this.options.slideDuration )
    }

    
	setPeriodicWave(){
		const periodicWave = this.createPeriodicWave()
		this.oscillator.setPeriodicWave( periodicWave )
        this.oscillator2.setPeriodicWave( periodicWave )
	}
}