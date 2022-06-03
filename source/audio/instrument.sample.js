import Instrument from './instrument'
// A generic interface for instruments
import {
	instrumentCache,
	fetchInstrument,
	storeInstrument,
	instrumentFolders,
	MUSICAL_NOTES} from './instruments'

import { 
	playTrack,
	loadInstrument, randomInstrument, 
	NOTE_NAMES,	getNoteName } from './audio'

export default class SampleInstrument extends Instrument{

	constructor(  audioContext, destinationNode, options={} ){
		super(audioContext, destinationNode, options)
		// we add a few extra sample places for the instruments
		this.polyphony = 5
	}

	noteOn(noteNumber, velocity=1){
		// playTrack(audioBuffer, offset=0, destination=delayNode, options={ loop:false } )
		this.polyphony++
		// FIXME: Add to active so we can remove it later
		const track = playTrack( noteNumber, 0, this.outputNode ).then( ()=>{
			this.active = false
			this.polyphony--
			//console.log("Sample completed playback... request tock", this.tracks )
		})
		super.noteOn(noteNumber)
		this.activeNotes.set( noteNumber, track )
	}

	noteOff(noteNumber, velocity=0){
		super.noteOff(noteNumber)
	}

	aftertouch( noteNumber, pressure ){
		super.aftertouch( noteNumber, pressure )
	}
	
	pitchBend(pitch){
		super.pitchBend(pitch)
	}

	// to load a new sample we can also use the midi methods...
	programChange( programNumber ){
		super.programChange( programNumber )
	}
}
