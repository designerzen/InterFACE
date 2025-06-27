/**
 * Abstract Instrument
 * MIDI Codes for control
 * 1 = Modulation wheel, often assigned to a vibrato or tremolo effect.
 * 7 = Volume level of the instrument
 * 10 = Panoramic (0 = left; 64 = center; 127 = right)
 * 11 = Expression (sometimes used also for volume control or similar, depending on the synthesizer)
 * 32 = Sound bank selection (LSB)
 * 64 = Sustain pedal (0 = no pedal; >= 64 => pedal ON)
 * 121 = All controllers off (this message clears all the controller values for this channel, back to their default values)
 * 123 = All notes off (this message stops all the notes that are currently playing)
 */

import * as MIDICommands from "../midi/midi-commands.js"

// we always have the same exposed methods
// based on the MIDI implementations
// https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message
export default class Instrument{

	static uniqueCounter = 0

	name = "AbstractInstrument"
	get title(){
		return "Instrument"
	}
	type = "abstract"

	// unique ID set from superclass
	unique = -1

	// state flags
	available = false
	active = false

	// AudioContext
	context

	// monophonic by default
	polyphony = 1

	modulation = 0
	currentVolume = 1
	channels = 1

	options = {}

	// linked list
	nextInstrument = null

	// observe this promise to see when the instance is ready
	loaded = new Promise((resolve,reject)=>this.onAvailable(resolve,reject))
	
	/**
	 * @returns {String} of unique Instrument id for this instance
	 */
	get id(){
		return `${this.name}-${this.unique}`.toLowerCase().replace(" ","_")
	}

	/**
	 * @returns {AudioContext} 
	 */
	get audioContext(){
		return this.context
	}

	/**
	 * Get the current active preset
	 * @returns {String|Object} of unique Instrument id for this instance
	 */
	get activePreset(){
		return null
	}

	/**
	 * @returns {Boolean} is a stereo pair
	 */
	get isStereo(){
		return this.channels > 1
	}
	
	get isLoading(){
		return this.available
	}

	get isMonophonic(){
		return this.polyphony === 1
	}

	get isPolyphonic(){
		return this.polyphony > 1
	}
	
	get volume(){
		return this.currentVolume
	}

	set volume( value ){
		this.currentVolume  = value
	}

	// FIXME: Legacy API to work with WAMs
	get audioNode(){
		throw Error("Must overwrite audioNode get")
		return null
	}

	get output(){
		return this.audioNode
	}
	
	get input(){
		return this.audioNode
	}

	set modulation(value){
		this.modulation = value
	}	

	get modulation(){
		return this.modulation
	}

	get currentTime(){
		return this.context.currentTime
	}

	// 
	get playsChords(){
		return false
	}

	get notes(){
		return this.activeNotes
	}
	/**
	 * All instruments 
	 * @param {AudioContext} onlineAudioContext (not offlineAudioContext)
	 * @param {Object} options 
	 */
	constructor( onlineAudioContext, options={} ) 
	{
		this.context = onlineAudioContext
		this.options = options
		this.activeNotes = new Map()
		// each instrument gets a 9 length unique ID
		this.unique = this.generateUniqueName()

		// observe this promise to see when the instance is ready
		this.create().then(()=>{
			this.available = true
			Promise.resolve(this.loaded)
		})
	}
	
	/**
	 * Create a unique code to represent this instrument
	 * @returns {String} of unique Instrument id for this instance
	 */
	generateUniqueName(){
		return this.type.toUpperCase()+"-"+String(++Instrument.uniqueCounter).padStart(9, '0')
	}

	// Life cycle methods ----------------------------------

	async create(){
		return true
	}
	
	async destroy(){
		this.available = false
		return true
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

	
	// TODO: 
	async allSoundOff(){}
	async allNotesOff(){
		let i = 0
		this.activeNotes.forEach( (velocity, noteNumber) => {	
			this.noteOff( noteNumber, velocity, i++ )
		})
	}

	/**
	 * Polyphonic Key Pressure
	 * This message is most often sent by pressing down on the key 
	 * after it "bottoms out". noteNumber is the key (note) number. 
	 * pressure is the pressure value.
	 * @param {Number} noteNumber - is the key (note) number
	 * @param {Number} pressure 
	 */
	async aftertouch( noteNumber, pressure ){}
	
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
	async pitchBend(pitch){}

	/**
	 * A proxy for programChange that is a bit more explicit
	 * and sensical considering getPresets()
	 * @param {Number|String} programNumber 
	 */
	async loadPreset( programNumber ){
		// find number in list?
		this.programChange(programNumber)
	}

	/**
	 * Program Change. 
	 * This message sent when the patch number changes. 
	 * @param {Number} programNumber - new program number.
	 */
	async programChange( programNumber ){}

	// another way to access it
	async setPatch( programNumber ){
		this. programChange( programNumber )
	}
	
	/**
	 * Get a list of all the instrument names available for this
	 * instrument preferably at the no
	 * @returns {Array<String>} of Instrument Names
	 */
	async getPresets(){
		return []
	}

	/**
	 * Provide this Person with a random instrument
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadRandomPreset(progressCallback){
		// return await 
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

	/**
	 * Convert an audio command of type Channel into some kind of action
	 * @returns 
	 */
	async doChannelCommand(command){
		
		switch( command.subtype )
		{
			case MIDICommands.COMMAND_NOTE_ON:
				return this.noteOn( command.noteNumber, command.velocity )
			
			case MIDICommands.COMMAND_NOTE_OFF:
				return this.noteOff( command.noteNumber, command.velocity  )
		
			case MIDICommands.COMMAND_NOTE_AFTER_TOUCH:
				return this.aftertouch( command.noteNumber, command.amount  )
		
			case MIDICommands.COMMAND_PITCH_BEND:
				return this.pitchBend( command.amount )
				
			case MIDICommands.COMMAND_PROGRAM_CHANGE:
				return this.programChange( command.programNumber )
			
			default:
				console.log("Instrument Ignores channel command", command )
		}
	}

	/**
	 * Pass in an AudioCommand to perform a function...
	 * this is best demonstrated by sending a MIDICommand
	 * to it that can be generated either from a MIDI device
	 * or a MIDI file
	 */
	async doCommand(command){

		switch(command.type){
			case MIDICommands.TYPE_CHANNEL:
				return this.doChannelCommand(command)
		}
	}

	clone(){
		return new Instrument(this.audioContext, this.options)
	}

	/**
	 * Helps classes to observe the load state of the 
	 * required resources
	 * @param {Function} resolve 
	 * @param {Function} reject 
	 * @param {Number} iteration 
	 */
	onAvailable(resolve, reject, iteration=0){
		if (!this.available)
		{
			requestAnimationFrame(()=>this.onAvailable(resolve, reject, iteration+1))
		}else{
			resolve && resolve(this)
		}
	}

	/**
	 * Failure - not available fur use
	 * @param {Function} reject 
	 */
	onUnavailable(reject){
		console.error("Instrument:UNAVAILABLE:", reject, this)
		// console.log("CREATED:Instrument.onAvailable", this )
	}

	/**
	 * Debug instance and return a string
	 */
	toString(){
		return "AbstractInstrument"
	}
}