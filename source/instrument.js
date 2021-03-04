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

	constructor( audioContext, destinationNode, options={} ) {
		this.sendMIDI = true
	}

	setMIDI(value){
		this.sendMIDI = value
	}

	noteOn(){

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


// playTrack = (audioBuffer, offset=0, destination=delayNode, options={ loop:false } )
Play
	const track = playTrack( note, 0, this.stereoNode ).then( ()=>{
				this.active = false
				this.tracks--
				//console.log("Sample completed playback... request tock", this.tracks )
			})
			


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