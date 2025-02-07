import Instrument from './instrument.js'

export const INSTRUMENT_TYPE_SPEECH = "SpeechInstrument"

export default class SpeechInstrument extends Instrument{

	static get name(){
		return INSTRUMENT_TYPE_SPEECH
	}

	name = INSTRUMENT_TYPE_SPEECH
	type = "speech"
	title = "Speech Synthesis"

	constructor( audioContext, options={} ){
		super( audioContext, options )
	}

	async noteOn(noteNumber, velocity=1){
		return super.noteOn(noteNumber, this.currentVolume * velocity )
	}

	async noteOff(noteNumber){
		return super.noteOff( noteNumber )
	}

	// Set polyphonic aftertouch : Send polyphonic aftertouch message to channel 8
	async aftertouch(noteNumber, pressure){
		return super.aftertouch(noteNumber, pressure)
	}
	
	// Set pitch bend value : The value is between -1 and 1 (a value of 0 means no bend).
	async pitchBend(pitch){
		return super.pitchBend(pitch)
	}
}