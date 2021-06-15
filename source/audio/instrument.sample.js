export default class SampleInstrument extends Instrument{

	constructor( channel="all" ){
		super()
		// we add a few extra sample places for the instruments
		this.polyphony = 5
	}

	noteOn(note){
		// playTrack = (audioBuffer, offset=0, destination=delayNode, options={ loop:false } )
		const track = playTrack( note, 0, this.outputNode ).then( ()=>{
			this.active = false
			this.polyphony--
			//console.log("Sample completed playback... request tock", this.tracks )
		})
		super.noteOn(note)
	}

}
