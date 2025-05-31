import { hasSpeech, say } from '../speech.js'
import Instrument from './instrument.js'

export const INSTRUMENT_TYPE_SPEECH = "SpeechInstrument"

const DEFAULT_SINGING_OPTIONS = {
	on:"on",
	off:"off",
	aftertouch:"aftertouch",
	pitchBend:"pitchbend"
}

export default class SpeechInstrument extends Instrument{

	static get name(){
		return INSTRUMENT_TYPE_SPEECH
	}

	name = INSTRUMENT_TYPE_SPEECH
	type = "speech"
	title = "Speech Synthesis"

	constructor( audioContext, options={} ){
		super( audioContext, {...DEFAULT_SINGING_OPTIONS, ...options} )
		this.available = hasSpeech()
	}

	async noteOn(noteNumber, velocity=1){
		try{
			say( this.options.on+ " " + noteNumber + ".", true, 1,  (noteNumber-20) * 0.25 )
		}catch(error){
			console.error("SpeechSynthesis Error", error)	
		}
		
		return super.noteOn(noteNumber, this.currentVolume * velocity )
	}

	async noteOff(noteNumber){
		try{
			say( this.options.off+ " " + noteNumber + ".", true, 1,  (noteNumber-20) * 0.25 )
		}catch(error){
			console.error("SpeechSynthesis Error", error)	
		}
		return super.noteOff( noteNumber )
	}

	// Set polyphonic aftertouch : Send polyphonic aftertouch message to channel 8
	async aftertouch(noteNumber, pressure){
		try{
			say( this.options.aftertouch+ " " + noteNumber + ".", true )
		}catch(error){
			console.error("SpeechSynthesis Error", error)	
		}
		return super.aftertouch(noteNumber, pressure)
	}
	
	// Set pitch bend value : The value is between -1 and 1 (a value of 0 means no bend).
	async pitchBend(pitch){
		try{
			say( this.options.pitchBend + " " +pitch + ".", true )
		}catch(error){
			console.error("SpeechSynthesis Error", error)	
		}
		return super.pitchBend(pitch)
	}

	
	clone(){
		return new SpeechInstrument(this.audioContext, this.options)
	}
}