import Instrument from './instrument'
// A generic interface for instruments
import {
	getRandomInstrument, instrumentFolders, instrumentNames, getInstrumentFamily
} from '../instruments'
import { playTrack,loadInstrumentPack } from '../audio'
import { convertMIDINoteNumberToName, convertNoteNameToMIDINoteNumber} from '../notes'
import { createInstruments, instrumentNames, instrumentFolders} from '../instruments'

// Maximum simultaneous tracks to play (will wait for slot)
const MAX_TRACKS = 16 // AKA one bar

export default class SampleInstrument extends Instrument{

	type = "sample"
	name = "SamplePlayerInstrument"

	instrument
	
	instrumentName = "Unloaded"
	instrumentTitle = "Unloaded"
	instrumentFamily = "Unknown"
	instrumentPack  = ''
	instrumentNumber

	// do not edit
	instrumentPointer = 0
	instrumentLoading = true

	get isLoading(){
		return this.instrumentLoading
	}
	
	get volume(){
		return this.gainNode.gain.value
	}

	set volume( value ){
		this.gainNode.gain.value = value
		this.currentVolume = value
	}

	
	// allow this itself to load instruments from the system
	// based on whatever programNumber we set below...
	constructor( audioContext, destinationNode, options={} ){
		super(audioContext, destinationNode, options)
		// we add a few extra sample places for the instruments
		this.polyphony = 5
		
		this.gainNode = audioContext.createGain()
		this.gainNode.connect(destinationNode)
		this.volume = 1
		this.available = true
	}

	play(audioBuffer, velocity){

		// too many simultaneous samples
		if ( ++this.polyphony > MAX_TRACKS)
		{
			// return
		}
		
		// TODO: Send out pitch bend?
		if (this.active)
		{
			//console.log("Sample overwriting playback.", noteName )
		}

		this.active = true
		this.volume = velocity
		
		//console.error( "PLAYING NOW!" , {audioBuffer}, this.polyphony, this.gainNode )

		// FIXME: Add to active so we can remove it later
		const track = playTrack( audioBuffer, 0, this.gainNode ).then( ()=>{
			this.polyphony--
			if (this.polyphony < 1) {
				this.active = false
			}
		
			//console.log("Sample completed playback.", track )
			return true
		})
	}

	// Like note on but using names!
	async noteOnByName(noteName, velocity=1 ){
		// const audioBuffer = this.instrument[noteName]
		// audioBuffer && this.play(audioBuffer, velocity)
		return this.noteOn( convertNoteNameToMIDINoteNumber(noteName), velocity)
	}

	async noteOn(noteNumber, velocity=1){
		const audioBuffer = this.instrument[convertMIDINoteNumberToName(noteNumber)]
		audioBuffer && this.play(audioBuffer, velocity)
		return super.noteOn(noteNumber, velocity)
	}

	// FIXME: Fade out the gate
	async noteOff(noteNumber, velocity=0){
		this.volume = velocity
		return super.noteOff(noteNumber)
	}

	aftertouch( noteNumber, pressure ){
		super.aftertouch( noteNumber, pressure )
	}
	
	pitchBend(pitch){
		super.pitchBend(pitch)
	}

	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){

		super.programChange( programNumber )
		return await this.loadInstrument( instrumentFolders[programNumber] )
	}

	/**
	 * 
	 * @returns {Array<String>} of Instrument Names
	 */
	getInstruments(){
		return createInstruments()
	}

	// INTERNAL -------------------------------------------
	
	/**
	 * Provide this Person with a random instrument
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	 async loadRandomInstrument(progressCallback){
		return await this.loadInstrument( getRandomInstrument(), this.instrumentPack, progressCallback )
	}

	/**
	 * Load the previous instrument in the list
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadPreviousInstrument(progressCallback){
		const index = this.instrumentPointer-1
		const newIndex = index < 0 ? instrumentFolders.length + index : index
		return await this.loadInstrument( instrumentFolders[newIndex], this.instrumentPack, progressCallback )
	}

	/**
	 * Load the subsequent instrument in the list
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadNextInstrument(progressCallback){
		const index = this.instrumentPointer+1 
		const newIndex = index >= instrumentFolders.length ? 0 : index
		return await this.loadInstrument( instrumentFolders[newIndex], this.instrumentPack, progressCallback )
	}

	/**
	 * Reload ALL instruments for this user
	 * NB. If we have swapped the instrument pack we can use this method
	 * to reload the same instrument but with the new samples
	 * @param {Function} callback Method to call once the instrument has loaded
	 */
	async reloadInstrument(progressCallback){
		return await this.loadInstrument( instrumentFolders[this.instrumentPointer], this.instrumentPack, progressCallback )
	}

	/**
	 * Changes all instuments to new pack
	 * @param {*} instrumentPack 
	 * @param {*} progressCallback 
	 */
	async loadPack(instrumentPack, progressCallback){
		this.instrumentPack = instrumentPack
		return await this.reloadInstrument(progressCallback)
	}

	/**
	 * Load a specific instrument for this Person
	 * TODO: Add loading events
	 * @param {String} instrumentName Name of the standard instrument to load
	 * @param {String} instrumentPack Name of the standard instrument to load
	 * @param {Function} callback Method to call once the instrument has loaded
	 */
	 async loadInstrument(instrumentName, instrumentPack, progressCallback ){
		
		const index = instrumentFolders.indexOf(instrumentName)
		
		this.instrumentLoading = true

		// FIXME: Send the -mp3 version...
		this.instrument = await loadInstrumentPack( instrumentName, instrumentPack, progressCallback )
		
		this.instrumentNumber = index
		this.instrumentName = instrumentName
		this.instrumentPack = instrumentPack

		// Fetch the GM name
		this.title = instrumentNames[index]
		this.name = "SampleInstrument"
		this.instrumentFamily = this.instrument.family

		this.instrumentMap = {}
		// TODO: inside out object
		// convert the instrument map into a number map
		// for (let i=0; i < 200; ++i){
		// 	this.instrumentMap[i] = this.instrument
		// }
		
		this.instrumentLoading = false


		// this.instrumentOrder = this.instrument
		return this.instrument
	}
}
