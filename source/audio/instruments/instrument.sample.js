import Instrument from './instrument'
// A generic interface for instruments

import { getRandomInstrument } from '../sound-font-instruments'

import { playTrack, loadInstrumentFromSoundFont } from '../audio'
import { convertMIDINoteNumberToName, convertNoteNameToMIDINoteNumber} from '../tuning/notes'

// Maximum simultaneous tracks to play (will wait for slot)
const MAX_TRACKS = 64 * 4 // AKA 4 bars

export const INSTRUMENT_TYPE_SAMPLE = "SamplePlayerInstrument"

export default class SampleInstrument extends Instrument{

	static get name(){
		return INSTRUMENT_TYPE_SAMPLE
	}

	name = INSTRUMENT_TYPE_SAMPLE
	#title = "Sample Player"
	type = "sample"
	
	// Instrument is an Object where A0:"sampleAudioBuffer" 
	audioBuffers = { }
	
	instrumentName = "Unloaded"
	instrumentTitle = "Unloaded"
	instrumentFamily = "Unknown"
	instrumentPack  = 'Not Loaded'

	// do not edit:

	// flag to determine whether this instrument is currently loading
	instrumentLoading = true

	// these are the file names and locations of each instrument
	instrumentTitles = []
	instrumentNames = []
	instrumentFolders = []

	// position within the above of the current instrument
	instrumentIndex = 0

	pitchBendValue = 1
	
	// which samples are currently ongoing
	activeSamples = new Map() // WeakMap?

	get pitchOffset(){
		return this.pitchBendValue
	}

	get isLoading(){
		return this.instrumentLoading
	}
	
	set volume( value ){
		this.gainNode.gain.value = value
		this.currentVolume = value
	}

	// always specify the output node
	get audioNode(){
		return this.gainNode
	}

	get activePreset(){
		return this.instrumentName
	}

    async create(){    

		this.gainNode = this.context.createGain()
		this.gainNode.gain.value = this.currentVolume
		
		this.envelope = this.context.createGain()
		this.envelope.gain.value = 0
		
		// we add a few extra sample places for the instruments
		this.polyphony = this.options.polyphony ?? 5
			
        return super.create()
    }

	/**
	 * TODO:
	 */
    async destroy(){
	
		this.envelope.disconnect()
		this.gainNode.disconnect()
								
        super.destroy()
    }

	// allow this itself to load instruments from the system
	// based on whatever programNumber we set below...
	constructor( audioContext, options={} )
	{
		super(audioContext, options)
	}

	// Actually make a sound with this sample
	async play(audioBuffer, velocity){

		// too many simultaneous samples
		if (this.polyphony + 1 >= MAX_TRACKS)
		{
			// console.log("Sample skipped due to max tracks reached", this.polyphony )
			return
		}
		
		++this.polyphony
		// TODO: Send out pitch bend?
		// if (this.active)
		// {
		// 	//console.log("Sample overwriting playback.", noteName )
		// }

		this.active = true
		this.volume = velocity
		
		//console.error( "PLAYING NOW!" , {audioBuffer}, this.polyphony, this.gainNode )

		// FIXME: Add to active so we can remove it later
		const track = playTrack( this.context, audioBuffer, 0, this.gainNode, { playbackRate: this.pitchBendValue }, ()=>{
			this.activeSamples.delete( this.polyphony )
			// console.info(this.polyphony, this.activeSamples.size, "this.activeSamples REMOVE", this.activeSamples)
			--this.polyphony
			
			if (this.polyphony < 1) {
				this.active = false
			}
		
			// console.log("Sample completed playback.", this.polyphony )
			return true
		} )
		// .then( ()=>{})
		// console.info(this.polyphony, this.activeSamples.size, "this.activeSamples ADD", this.activeSamples)
		
		this.activeSamples.set( this.polyphony, track )
			
		return track
	}

	/**
	 * Like note on but using names!
	 * 
	 * @param {String} noteName 
	 * @param {Number} velocity 
	 * @returns 
	 */
	async noteOnByName(noteName, velocity=1 ){
		// const audioBuffer = this.instrument[noteName]
		// audioBuffer && this.play(audioBuffer, velocity)
		return this.noteOn( convertNoteNameToMIDINoteNumber(noteName), velocity)
	}

	async noteOn(noteNumber, velocity=1){
		const key = convertMIDINoteNumberToName(noteNumber)
		const audioBuffer = this.audioBuffers[key]
		if(audioBuffer)
		{
			const track = this.play(audioBuffer, velocity )
		}else{
			// STILL LOADING THIS BUFFER... What to do?
			console.log("No buffer for", {noteNumber, velocity, key} , this.audioBuffers )
		}
		// console.log("Buffer playing", {audioBuffer,noteNumber, velocity} )
		return super.noteOn(noteNumber, velocity)
	}

	// FIXME: Fade out the gate
	async noteOff(noteNumber, velocity=0){
		this.volume = velocity
		return super.noteOff(noteNumber)
	}


	// async aftertouch( noteNumber, pressure ){
	// 	await super.aftertouch( noteNumber, pressure )
	// }
	
	async pitchBend(pitch){
		this.pitchBendValue = pitch
		this.activeSamples.forEach( (sample, key) => {
			sample.playbackRate.value = pitch
			// if (pitch !==1) console.log(key, "Pitch bending sample",pitch, sample.playbackRate.value )
		})
		return await super.pitchBend(pitch)
	}

	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		const instrument = await this.loadPreset( programNumber, this.instrumentPack )
		this.instrumentIndex = programNumber
		return await super.programChange( instrument )	
	}
	
	/**
	 * 
	 * @returns {Array<String>} of Instrument Names
	 */
	async getPresets(){
		return this.instrumentTitles
	}

	
	/**
	 * Pass in an AudioCommand to perform a function...

	async doCommand( command ){
		
	}
	 */
	// INTERNAL -------------------------------------------
	
	/**
	 * Provide this Person with a random instrument
	 * @param {Function} progressCallback Method to call once the instrument has loadedNAMES
	 */
	 async loadRandomPreset(progressCallback){
		// grab an instrument randomly from the full collection
		const newIndex = Math.round( Math.random() * this.instrumentFolders.length )
		this.instrumentIndex = newIndex
		return await this.loadPreset( this.instrumentFolders[newIndex], this.instrumentPack, progressCallback )
	}

	/**
	 * Load the previous instrument in the list
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadPreviousPreset(progressCallback){
		const index = this.instrumentIndex-1
		const newIndex = index < 0 ? this.instrumentFolders.length + index : index
		this.instrumentIndex = newIndex
		return await this.loadPreset( this.instrumentFolders[newIndex], this.instrumentPack, progressCallback )
	}

	/**
	 * Load the subsequent instrument in the list
	 * NB. Does NOT wrap around
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadNextPreset(progressCallback){
		const index = this.instrumentIndex+1 
		const newIndex = index >= this.instrumentFolders.length ? 0 : index
		this.instrumentIndex = newIndex
		return await this.loadPreset( this.instrumentFolders[newIndex], this.instrumentPack, progressCallback )
	}

	/**
	 * Reload ALL instruments for this user
	 * NB. If we have swapped the instrument pack we can use this method
	 * to reload the same instrument but with the new samples
	 * @param {Function} callback Method to call once the instrument has loaded
	 */
	async reload(progressCallback){
		return await this.loadPreset( this.instrumentFolders[this.instrumentIndex], this.instrumentPack, progressCallback )
	}

	/**
	 * Changes all instuments to new pack
	 * @param {String} instrumentPack 
	 * @param {Function} onProgress 
	 */
	async loadPack(instrumentPack, onProgress){
		this.instrumentPack = instrumentPack
		return await this.reload(onProgress)
	}

	/**
	 * Load a specific instrument "patch" for this AudioNode
	 * TODO: Add loading events
	 * @param {String} instrumentName Name of the standard instrument to load
	 * @param {String} instrumentPack Name of the standard instrument to load
	 * @param {Function} callback Method to call once the instrument has loaded
	 */
	 async loadPreset(instrumentName, instrumentPack, progressCallback ){
		
		const index = this.instrumentFolders.indexOf(instrumentName)
		
		if (index  === -1)
		{
			throw Error( `No Preset found with name "${instrumentName}" in pack "${instrumentPack}" with ${ this.instrumentFolders.length} presets available` )
		}

		// check to see if the pack name is valid...
		this.instrumentLoading = true

		try{
			// FIXME: Send the -mp3 version...
			this.activeInstrument = await loadInstrumentFromSoundFont( this.context, instrumentName, "./assets/audio/" + instrumentPack, progressCallback )
		
		}catch(error){

			if (instrumentPack.indexOf(".json") > -1)
			{
				this.instrumentLoading = false
				throw Error("You tried to load a soundfont with a descriptor uri! "+instrumentPack)
			}	
		}
		// Fetch the GM name
		this.title = this.instrumentTitles[index]
		
		this.instrumentIndex = index ?? 0
		this.instrumentName = instrumentName
		this.instrumentPack = instrumentPack
		this.instrumentTitle = this.title
		
		//this.name = "SampleInstrument"
		this.instrumentFamily = this.activeInstrument.family

		

		// this.instrumentMap = {}
		// TODO: inside out object
		// convert the instrument map into a number map
		// for (let i=0; i < 200; ++i){
		// 	this.instrumentMap[i] = this.instrument
		// }
		
		this.instrumentLoading = false

		// this.instrumentOrder = this.instrument
		return this.activeInstrument
	}

	clone(){
		return new SampleInstrument(this.audioContext, this.options)
	}
}