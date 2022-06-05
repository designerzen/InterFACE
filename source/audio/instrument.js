// we always have the same exposed methods
// based on the MIDI implementations
// https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message
export default class Instrument{

	active = false
	// monophonic by default
	polyphony = 1
	
	constructor( audioContext, destinationNode, options={} ) 
	{
		this.outputNode = destinationNode
		this.context = audioContext
		this.activeNotes = new Map()
		//console.log("Instrument:CREATED:", { audioContext, destinationNode } )
	}

	getVolume(){
		return 1
	}

	setVolume( volume ){
		// FIXME:
	}

	/**
	 * This message is sent when a note is depressed (start).
	 * @param {Number} noteNumber 
	 * @param {Number} velocity 
	 * @returns {Boolean} has the sample started or is it already playing?
	 */
	 async noteOn( noteNumber, velocity=1 ){
		
		const activeNote = this.activeNotes.get(noteNumber)
		if (activeNote)
		{
			//console.log(activeNote, "retrigger noteOn", noteNumber, this.activeNotes )
			return false
		}else{

			// set it not to true but to the velocity?
			this.activeNotes.set( noteNumber, velocity )
			//console.log("noteOn", noteNumber, this.activeNotes )
			this.active = true
			return true
		}
	}
	
	/**
	 * This message is sent when a note is released (ended). 
	 * @param {Number} noteNumber 
	 * @param {Number} veolcity 
	 */
	 async noteOff( noteNumber, veolcity=0 ){
		this.active = false
		this.activeNotes.delete( noteNumber )
		//console.log("noteOff", noteNumber, this.activeNotes )
		return true
	}
	
	/**
	 * Polyphonic Key Pressure
	 * This message is most often sent by pressing down on the key 
	 * after it "bottoms out". noteNumber is the key (note) number. 
	 * pressure is the pressure value.
	 * @param {Number} noteNumber - is the key (note) number
	 * @param {Number} pressure 
	 */
	aftertouch( noteNumber, pressure ){

	}
	
	/**
	 * Pitch Bend Change. 
	 * This message is sent to indicate a change
	 * in the pitch bender (wheel or lever, typically). 
	 * The pitch bender is measured by a fourteen bit value. 
	 * Center (no pitch change) is 2000H. 
	 * Sensitivity is a function of the receiver, 
	 * but may be set using RPN 0. 
	 * (lllllll) are the least significant 7 bits. 
	 * (mmmmmmm) are the most significant 7 bits.
	 * @param {*} pitch 
	 */
	pitchBend(pitch){

	}

	allSoundOff(){

	}

	allNotesOff(){
		// loop through this.activeNotes
	}

	/**
	 * Program Change. 
	 * This message sent when the patch number changes. 
	 * @param {Number} programNumber - new program number.
	 */
	 async programChange( programNumber ){

	}
}