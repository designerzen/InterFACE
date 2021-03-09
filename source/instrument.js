// A generic interface for instruments
import {
	instrumentCache,
	fetchInstrument,
	storeInstrument,
	INSTRUMENT_FOLDERS,
	MUSICAL_NOTES} from './instruments'

import { 
	playTrack,
	loadInstrument, randomInstrument, 
	NOTE_NAMES,	getNoteName } from './audio'

// we always have the same exposed methods
export default class Instrument{

	constructor( audioContext, destinationNode, options={} ) 
	{
		this.sendMIDI = true
		this.active = false
		this.polyphony = 5
	}

	setMIDI(value){
		this.sendMIDI = value
	}

	noteOn(){

		// playTrack = (audioBuffer, offset=0, destination=delayNode, options={ loop:false } )
		const track = playTrack( note, 0, this.stereoNode ).then( ()=>{
			this.active = false
			this.polyphony--
			//console.log("Sample completed playback... request tock", this.tracks )
		})
	}
	
	noteOff(){

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

/*
Stolen from MIDI




const createInstrument = async () => {

	let instrumentLoading = true
	const instrument = await loadInstrument( instrumentName )
	instrumentLoading = false
		
	// to play one note
	const noteName = getNoteName(roll, this.octave, isMinor)
	const note = this.instrument[ noteName ]

	return {
		instrument,
		loading:instrumentLoading
	}
}

*/