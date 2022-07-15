/**
 * This is a set of noise that gets sent into 
 * a delay where the delay length represents 
 * the pitch and is fed back into the delay as
 * a feedback until it resonates in key.
 */
import Instrument from './instrument'

import {convertMIDINoteNumberToName} from '../notes'

import Noise from '../noise'

export default class WaveGuideInstrument extends Instrument{

	type = "waveguide"

	instrument

	get volume(){
		return this.gainNode.gain.value
	}

	set volume( value ){
		this.gainNode.gain.value = value
	}


	set pitch(value){
		this.delay.delayTime.value = value
	}

	constructor( audioContext, destinationNode, options={} ){
		
		super(audioContext, destinationNode, options)
		
		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 1

		// 1. we need a basis noise for our additive blending
		const whiteNoiseAudioBuffer = Noise.white( 2,44100 )
		const noiseBufferSource = audioContext.createBufferSource()
        noiseBufferSource.buffer = whiteNoiseAudioBuffer
       
		// 2. then pass the noise through a gain to lower the volume slightly
		const feedbackNode = audioContext.createGain(feedback)
		feedbackNode.gain.value = 0.4
		
		// 3. then through a delay node with the delay length
		// related to the pitch requested
		const delayTime = 7
		const delayNode = audioContext.createDelay(delayTime)
		
		// would be cool to stereo seperate here...
		noiseBufferSource
			.connect( feedbackNode )
			.connect( delayNode )
			.connect( this.gainNode )
			.connect( destinationNode )
        
		// feedback loop back into system
		delayNode.connect(feedbackNode)
		
		// start the noise
		noiseBufferSource.start()

		this.delay = delayNode
		
		// to control pitch
		this.pitch = 10
	}

	async noteOn(noteNumber, velocity=1){
		
		// TODO: Send out pitch bend?
		if (this.active)
		{
			//console.log("Sample overwriting playback.", noteName )
		}
		this.active = true
		this.pitch = noteNumber * 44
		this.volume = velocity
		return super.noteOn( noteNumber, velocity )
	}

	async noteOff(noteNumber, velocity=0){
		this.volume = velocity
		this.active = false
		return super.noteOff( noteNumber )
	}

	aftertouch( noteNumber, pressure ){
		super.aftertouch( noteNumber, pressure )
	}
	
	pitchBend(pitch){
		super.pitchBend(pitch)
	}

	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		return super.programChange( programNumber )
	}

}
