/**
 * This is a set of noise that gets sent into 
 * a delay where the delay length represents 
 * the pitch and is fed back into the delay as
 * a feedback until it resonates in key.
 */
import { 
	generateWhiteNoise,
	generatePinkNoise,
	generateBrownNoise,
	generateWhiteNoiseBuffer,
} from '../../maths/noise.js'
import Instrument from './instrument.js'


const OPTIONS = {

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

	// from one note to another, how fast do we "glide"
	slideDuration:0.2,

	// Amplitude envelope
	fadeDuration:18,

	// filter options - change using presets
	filterCutOff :2200,
	filterOverdrive:2.5,
	filterResonance :1.8,
	filterAttack :0.002,
	filterDecay :0.08,
	filterSustain :0.0,
	filterRelease :0.1,
}


export default class WaveGuideInstrument extends Instrument{

	static get name(){
		return "WaveGuideInstrument"
	}

	name = WaveGuideInstrument.name

	type = "waveguide"
	name = "WaveGuideInstrument"

	instrument

	get volume(){
		return this.gainNode.gain.value
	}

	set volume( value ){
		this.gainNode.gain.value = value
	}

	set pitch(value){
		this.delayNode.delayTime.value = value * 0.01
		//console.log("waveguide::pitch", value, this.delay.delayTime.value)
	}
	
	get audioNode(){
		return this.gainNode
	}

    async create(){    

		this.gainNode = this.context.createGain()
		this.gainNode.gain.value = 0

		this.envelope = this.context.createGain()
		this.envelope.gain.value = 0

		// 1. we need a basis noise for our additive blending
		const channels = 1
		// const frameCount = audioContext.sampleRate * 1.0	// 1 second of pure white noise
		// const whiteNoiseAudioBuffer = generateWhiteNoise( frameCount )
		
		const noiseBufferSource = this.context.createBufferSource()
        noiseBufferSource.buffer =  generateWhiteNoiseBuffer( this.context, channels )
       
		// 2. then pass the noise through a gain to lower the volume slightly
		const feedbackNode = this.context.createGain(0.2)
		
		// 3. then through a delay node with the delay length
		// related to the pitch requested
		// param is max size in seconds
		const delayNode = this.context.createDelay( 1 )

		// 4. pass it through a low pass filter so we dont hurt our precious ears
		const filter = new BiquadFilterNode( this.context, {
			type : 'lowpass',
			Q:this.options.filterResonance,
			frequency:this.options.filterCutOff,
			detune:0,
			gain:1
		})

		// would be cool to stereo seperate here...
		noiseBufferSource
			.connect( feedbackNode )
			.connect( delayNode )
			.connect( this.envelope)
			.connect( this.gainNode )
        
		// feedback loop back into system
		delayNode.connect(feedbackNode)
		
		// immediately start the noise!
		noiseBufferSource.start()

		this.filterNode = filter
		this.delayNode = delayNode
		this.noiseBufferSource = noiseBufferSource
		this.feedbackNode = feedbackNode
		
		// to control pitch...
		this.pitch = 69

        return true
    }

	/**
	 * TODO:
	 */
    async destroy(){
	
		this.delayNode.disconnect()
		this.filterNode.disconnect()

		this.envelope.disconnect()
		this.gainNode.disconnect()
								
        super.destroy()
    }

	constructor( audioContext, options={} ){
		super(audioContext, {...OPTIONS,...options})
	}

	async noteOn(noteNumber, velocity=1){
		
		// TODO: Send out pitch bend?
		if (this.active)
		{
			//console.log("Sample overwriting playback.", noteName )
		}
		this.active = true
		this.pitch = noteNumber
		this.volume = velocity
		return super.noteOn( noteNumber, velocity )
	}

	async noteOff(noteNumber, velocity=0){
		this.volume = velocity
		this.active = false
		return super.noteOff( noteNumber )
	}

	async aftertouch( noteNumber, pressure ){
		super.aftertouch( noteNumber, pressure )
	}
	
	async pitchBend(pitch){
		super.pitchBend(pitch)
	}

	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		return super.programChange( programNumber )
	}

	
	clone(){
		return new WaveGuideInstrument(this.audioContext, this.options)
	}
}

