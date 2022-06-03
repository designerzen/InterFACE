import Instrument from './instrument'
export default class OscillatorInstrument extends Instrument{

	constructor( channel="all" ){
		super()

		this.sine
		this.square
		this.sawtooth
	}

	noteOn( note, velocity=1 ){
		super.noteOn(note)
	}
	
	noteOff(){
		super.noteOff()
	}
	
	aftertouch(){

	}
	
	pitchBend(){

	}

	allSoundOff(){

	}

	allNotesOff(){

	}
}
