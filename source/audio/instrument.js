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
		this.outputNode = destinationNode
		this.context = audioContext
		
		// monophonic by default
		this.polyphony = 1
	}

	noteOn( note ){
		this.active = true
	}
	
	noteOff(){
		this.active = false
	}
	
	aftertouch(){

	}
	
	pitchBend(pitch){

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