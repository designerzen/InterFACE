/**
 * This is a set of noise that gets sent into 
 * a delay where the delay length represents 
 * the pitch and is fed back into the delay as
 * a feedback until it resonates in key.
 */
import Instrument from './instrument.js'
import Noise from '../noise.js'
import {convertMIDINoteNumberToName} from '../notes.js'

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
		this.delay.delayTime.value = value * 0.01
		console.log("waveguide::pitch", value, this.delay.delayTime.value)
	}
	
	get audioNode(){
		return this.gainNode
	}

	constructor( audioContext, options={} ){
		
		super(audioContext, options)
		
		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 1

		// 1. we need a basis noise for our additive blending
		const whiteNoiseAudioBuffer = Noise.white( 2,44100 )
		const noiseBufferSource = audioContext.createBufferSource()
        noiseBufferSource.buffer = whiteNoiseAudioBuffer
       
		// 2. then pass the noise through a gain to lower the volume slightly
		const feedbackNode = audioContext.createGain(0.2)
		
		// 3. then through a delay node with the delay length
		// related to the pitch requested
		// param is max size in seconds
		const delayNode = audioContext.createDelay( 1 )

		// 4. pass it through a low pass filter so we dont hurt our precious ears
		// const filter = audioContext.createBiQuadFilter()

		// would be cool to stereo seperate here...
		noiseBufferSource
			.connect( feedbackNode )
			.connect( delayNode )
			.connect( this.gainNode )
        
		// feedback loop back into system
		delayNode.connect(feedbackNode)
		
		// start the noise
		noiseBufferSource.start()

		this.delay = delayNode
		
		// to control pitch
		this.pitch = 69
		this.available = true
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
}
