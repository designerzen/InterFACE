// we always have the same exposed methods
// based on the MIDI implementations
// https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message
export default class Instrument{

	constructor( audioContext, destinationNode, options={} ) 
	{
		this.outputNode = destinationNode
		this.context = audioContext

		console.log("Instrument:CREATED:", { audioContext, destinationNode } )
		
		// monophonic by default
		this.polyphony = 1
		this.activeNotes = new Map()
	}

	/**
	 * This message is sent when a note is depressed (start).
	 * @param {Number} noteNumber 
	 * @param {Number} veolcity 
	 */
	noteOn( noteNumber, velocity=1 ){
		this.active = true
		// set it not to true but to the velocity?
		this.activeNotes.set( noteNumber, {} )
	}
	
	/**
	 * This message is sent when a note is released (ended). 
	 * @param {Number} noteNumber 
	 * @param {Number} veolcity 
	 */
	noteOff( noteNumber, veolcity=0 ){
		this.active = false
		this.activeNotes.set( noteNumber, null )
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
	programChange( programNumber ){

	}
}