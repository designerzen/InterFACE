/**
 * Composite Instrument allows you to use a single instrument
 * to control many other instruments. You can set them up in 
 * various ways :
 * 
 * - Play all notes
 * - Each channel can be a different instrument
 * - Note numbers can trigger different instruments
 * - Different presets trigger differetn instruments
 * 
 */
import Instrument from "./instrument.js"

export const INSTRUMENT_TYPE_COMPOSITE = "CompositeInstrument"

// https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message
export default class CompositeInstrument extends Instrument{
	static get name(){
		return INSTRUMENT_TYPE_COMPOSITE
	}

	name = INSTRUMENT_TYPE_COMPOSITE
	get title(){
		return "Composite Instrument"
	}
	type = "composite"

	unique = -1

	available = false
	active = false

	// monophonic by default
	polyphony = 1

	currentVolume = 1
	channels = 1

	/**
	 * All instruments 
	 * @param {AudioContext} audioContext 
	 * @param {Object} options 
	 */
	constructor( audioContext, options={} ) 
	{
		super(audioContext, options)
	}

	addInstrument( instrument ){

	}

	// Life cycle methods ----------------------------------

	create(){

	}

	destroy(){

	}
	
	/**
	 * This message is sent when a note is depressed (start).
	 * @param {Number} noteNumber 
	 * @param {Number} velocity 
	 * @returns {Boolean} has the sample started or is it already playing?
	 */
	 async noteOn( noteNumber, velocity=1 ){
		
		const activeNote = this.activeNotes.get(noteNumber)
		this.active = true
		
		if (activeNote)
		{
			// already playing
			//console.log(activeNote, "retrigger noteOn", noteNumber, this.activeNotes )
			return false
		}else{

			// set it not to true but to the velocity?
			this.activeNotes.set( noteNumber, velocity )
			//console.log("noteOn", noteNumber, this.activeNotes )
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
	async aftertouch( noteNumber, pressure ){

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
	 * @param {number} pitch 
	 */
	async pitchBend(pitch){

	}

	/**
	 * Program Change. 
	 * This message sent when the patch number changes. 
	 * @param {Number} programNumber - new program number.
	 */
	async programChange( programNumber ){

	}

	// TODO: 
	async allSoundOff(){

	}

	async allNotesOff(){

	}

	/**
	 * Get a list of all the instrument names available for this
	 * instrument preferably at the no
	 * @returns {Array<String>} of Instrument Names
	 */
	async getInstruments(){
		return []
		
	}


	/**
	 * Provide this Person with a random instrument
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadRandomPreset(progressCallback){
		// return await this.loadInstrument(  )
	}

	/**
	 * Load the previous instrument in the list
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadPreviousPreset(progressCallback){
		// const index = this.instrumentPointer-1
		// const newIndex = index < 0 ? instrumentFolders.length + index : index
		// return await this.loadInstrument( instrumentFolders[newIndex], this.instrumentPack, progressCallback )
	}

	/**
	 * Load the subsequent instrument in the list
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadNextPreset(progressCallback){
		// const index = this.instrumentPointer+1 
		// const newIndex = index >= instrumentFolders.length ? 0 : index
		// return await this.loadInstrument( instrumentFolders[newIndex], this.instrumentPack, progressCallback )
	}

	/**
	 * Reload ALL instruments for this user
	 * NB. If we have swapped the instrument pack we can use this method
	 * to reload the same instrument but with the new samples
	 * @param {Function} callback Method to call once the instrument has loaded
	 */
	async reload(progressCallback){
		// return await this.loadInstrument( instrumentFolders[this.instrumentPointer], this.instrumentPack, progressCallback )
	}

	async load(instrumentName, instrumentPack, progressCallback ){

	}

	clone(){
		return new CompositeInstrument(this.audioContext, this.options)
	}
}