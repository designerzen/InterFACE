import Instrument from './instrument'
export default class OscillatorInstrument extends Instrument{

	constructor( channel="all" ){
		super()

		this.sine
		this.square
		this.sawtooth

		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 1
	}

	async noteOn( note, velocity=1 ){
		super.noteOn(note)
	}
	
	async noteOff(){
		super.noteOff()
	}
	
	async aftertouch(){

	}
	
	pitchBend(){

	}
	
	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		super.programChange( programNumber )
		return await this.loadInstrument( instrumentFolders[programNumber] )
	}


	allSoundOff(){

	}

	allNotesOff(){

	}
}
