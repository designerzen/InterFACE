import Instrument from './instrument'
export default class OscillatorRecorder extends Instrument{

	constructor(audioContext, destinationNode, options={}){
		super()
		this.parameterRecorder = new ParamaterRecorder( audioContext )
	}

	async noteOn( note, velocity=1 ){
		
	}
	
	async noteOff(){
		
	}
	
	async aftertouch(){

	}
	
	pitchBend(){

	}
	
	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		
	}


	allSoundOff(){

	}

	allNotesOff(){

	}
}
