/**
 * Just a model to contain all the samples for a specific font
 * The font has a number of presets that represent the 
 * 
 * - PackName
 * - Descriptor
 * - Instrument Array
 * - Audio Buffers for EACH note for EACH instrument
 * 
 * NB. 	A descriptor does not have to be loaded but if one is
 * 		not loaded then WE USE THE DEAFULT gm FOLDER NAMES
 * 
 */

import { 
	INSTRUMENT_DATA_PACKS, INSTRUMENT_PACKS, 
	createInstruments, 
	getRandomInstrument, 
	loadInstrumentDataPack, loadInstrumentFromSoundFontStringViaWorker 
} from "./sound-font-instruments"

import { 
	SOUNDFONT_DEFAULT_INSTRUMENT_FOLDERS,
	GENERAL_MIDI_LIBRARY, GENERAL_MIDI_FAMILIES, 
	GENERAL_MIDI_FAMILY_DICTIONARY 
} from './midi/general-midi.constants'

import { loadInstrumentFromSoundFont } from "./audio"

const DEFAULT_SOUNDFONT_OPTIONS = {
	location:"./assets/audio/"
}

export default class SoundFont{

	static globalMap = new Map()

	name = INSTRUMENT_PACKS[0]

	// data describing this data of descriptor
	descriptor

	// this is the URI of the data. can be
	// 1. local folder relative to this html root
	// 2. remote ftp with https:// at the start
	location = "./"

	// loaded assets
	audioBuffers = new Map()

	instrumentsByName = new Map()
	instrumentsByPath = new Map()
	instrumentsByIndex = []

	instruments
	
	// can be online or offline audio context
	audioContext
	offlineAudioContext

	// flags
	loading = false
	lazyLoading = false
	
	get presetAudioBuffers(){
		return this.audioBuffers
	}	

	get presetNames(){
		return Array.from( this.instrumentsByName.keys() )
	}
	
	get presetTitles(){
		return Array.from( this.instrumentsByName.keys() )
	}
	
	get presets(){
		return this.instruments
	}

	get quantity(){
		return this.descriptor.length
	}

	// offlineAudioContext
	constructor( audioContext, offlineAudioContext, path="./" ){
		this.audioContext = audioContext
		this.offlineAudioContext = offlineAudioContext
		
		// create defaults to overwrite
		this.createInstrumentData( createInstruments(), path )
	}

	/**
	 * Required before attempting to load in any audio data
	 * @param {String} pack 
	 * @param {String} packURI 
	 * @param {String} dataURI 
	 * @param {String} location 
	 * @param {?Function} onProgress 
	 */
	async load( options={}, onProgress=null ){

		// optionally load description
		// if there is a descriptor we load that first
		if (options.descriptor)
		{
			// first fetch the description file that contains our instrument names
			// const descriptorData = 
			return await this.loadDescriptor( options.descriptor, options.descriptorPath ?? './' )
		}

		// nothing to load!
		return null
	}


	/**
	 * Required to be run at least once per instrument set
	 * @param {Array} instrumentData 
	 * @param {Array} locationData 
	 * @returns 
	 */
	createInstrumentData( instrumentData, locationData ){
	
		this.instrumentsByIndex = []
		// loop through the data and create all of our associators
		const data = instrumentData.map((preset,index)=>{
			
			// create an object containing all the details about this sound font preset
			const data = {
				...preset,
				// check to see if the name is the same and if not change it?
				available:locationData[index] === preset.location,
				location:preset.location
			}

			this.instrumentsByPath.set( preset.location, data )
			this.instrumentsByName.set( data.name, data )
			this.instrumentsByIndex.push( data )
			return data
		})

		this.instruments = data

		return data
	}


	/**
	 * Pack should be provided as 
	 * @param {String} pack 
	 * @param {String} location 
	 * @param {?Function} onProgress 
	 * @returns 
	 */
	async loadFont( pack, location='', onProgress=null ){

		onProgress && onProgress(0)

		// Load in the descriptor
		const font = await this.loadDescriptor( pack, location )
		//const reload = await this.loadPack( this.instrumentPack, onProgress  )
		
		onProgress && onProgress(1)
		return font
	}

	/**
	 * Loads in the folder names for all the instruments
	 * and sets the subsequent instruments array that describes
	 * this data
	 * 
	 * @param {String} pack 
	 * @param {String} packURI 
	 * @param {String} dataURI 
	 * @returns 
	 */
	async loadDescriptor( pack, packURI ){

		// 	const descriptorPath = `${location}${pack}`
		let descriptorURI = ""
		if (pack.indexOf(".json") === -1)
		{
			const index = INSTRUMENT_PACKS.indexOf(pack)
			if (index > -1)
			{
				this.name = INSTRUMENT_PACKS[index]
				const packData = INSTRUMENT_DATA_PACKS[index]
				descriptorURI = packData.filename
			}else{

				throw Error("loadFont failed to load descriptor. Expected a data source but couldn't find one", pack )
			}
			
		}else{

			this.name = INSTRUMENT_PACKS[ INSTRUMENT_DATA_PACKS.indexOf(pack) ]
			descriptorURI = pack
		}
		
		//  load JSON description from the specified location
		const descriptor = await loadInstrumentDataPack( descriptorURI, undefined, packURI )
		
		// JSON descripotion of this data
		this.descriptor = descriptor

		this.createInstrumentData( createInstruments(), descriptor )

		return this.instruments
	}

	/**
	 * Fetch Preset
	 * @param {String} presetName 
	 * @param {Object} options 
	 * @param {Function} onProgressCallback 
	 * @returns 
	 */
	async fetchPreset( presetName, options={}, onProgressCallback=null ){
		return this.getInstrumentData(presetName)
	}

	/**
	 * 
	 */
	findInstrumentDataFromDetails( presetName ){
			
		const check = ["folder", "name", "title", "location"]
		for (let i=0, l=this.instruments.length; i < l; i++)
		{

			// now check to see if there are any matches
			const instrument = this.instruments[i]
			
// console.log("looking for",presetName, instrument)

			check.forEach( key => {
				if (instrument[key] === presetName){
					return instrument
				}
			})
			
		}
		return null
	}
		

	/**
	 * Provide a preset name, or an index
	 * @param {String} presetName 
	 * @returns 
	 */
	getInstrumentData( presetName ){

		// easy enough to resolve, as it is just a number!
		if (Number.isInteger(presetName))
		{
			return this.instrumentsByIndex[presetName]
		}
		
		return 	this.instrumentsByName.get(presetName) ?? 
				this.instrumentsByPath.get(presetName) ??  
				this.instrumentsByName.get(presetName.substring(0, presetName.lastIndexOf('.'))) ?? 
				this.instrumentsByPath.get(presetName.substring(0, presetName.lastIndexOf('.'))) ?? 
				this.instrumentsByPath.get(presetName + "-mp3") ?? 
				this.instrumentsByPath.get(presetName + "-ogg") ?? 
				this.instrumentsByName.get(presetName.substring(0, presetName.lastIndexOf('-'))) ?? 
				this.instrumentsByPath.get(presetName.substring(0, presetName.lastIndexOf('-'))) ?? 
				this.findInstrumentDataFromDetails(presetName)
	}

	
	/**
	 * Load a specific sound for this sound font, but progressively
	 * replace the output whilst it is loading 
	 * 
	 * @param {Number|String|Object} preset 
	 * @param {Object} options 
	 * @param {Function} onProgressCallback 
	 */
	async loadPresetGradually( audioBuffers, preset, options={ }, onProgressCallback=null){
		return this.loadPreset(preset, options, async (event) => {
			const {progress, part, index, audioBuffer } = event
			const percent = (progress * 100).toFixed(2)
			const note = part.split('.')[0]
			const buffer = await audioBuffer
			audioBuffers[ note ] = buffer
			// console.error(percent + "%", ">>> POST Loading loadPresetGradually", {event, note, audioBuffer, buffer, preset, progress, part} )  
			// console.info(percent + "%", note, "audioBuffers", {buffer, audioBuffers})
			onProgressCallback && onProgressCallback( event )
		})
	}
	
	/**
	 * Load a specific instrument for this sound font
	 * @param {Number|String|Object} preset Name of the standard instrument to load
	 * @param {Object} options how to load and where to load the data from
	 * @param {Function} callback Method to call once the instrument has loaded
	 */
	async loadPreset( preset, options={ }, onProgressCallback=null ){
		
		if (!preset)
		{
			throw Error( `No "preset" argument provided to soundfont.loadPreset( required preset ), so not sure what preset you are expecting to load` )
		}

		// establish the actual name of the preset
		let presetNameOrNumber
		
		// check to see what type it is
		if ( typeof preset === 'object' )
		{
			presetNameOrNumber = preset.name ?? preset.title ?? preset.folder
		}else{
			presetNameOrNumber = preset
		}

		// immediately attempt to get the instrument data from the descriptor
		const data = this.getInstrumentData(presetNameOrNumber) 
		

		// console.error("Loading PRESET", { preset, presetName, options, data } )

		const location = DEFAULT_SOUNDFONT_OPTIONS.location + options.soundfont
			
		// console.info("PRESET "+presetNameOrNumber+" LOADING", data, "from", location, this )

		// If a sound font with a name that isn't recognised
		// we complain and throw the error here
		if (!data)
		{
			console.error("PRESET "+presetNameOrNumber+" LOADING", data, "from", location, this )
			// throw Error( `No Preset found with name "${presetNameOrNumber}" in pack "${this.name}" from "${location}" with ${this.instrumentsByName.size} available. Maybe a new preset name should be added or perhaps the pack name has not been loaded yet?` )
		}

		if (SoundFont.audioBuffers.has( data.name ))
		{
			return SoundFont.audioBuffers.get( data.name )
		}
		
		// check to see if the pack name is valid...
		this.loading = true

		// console.error("PRESET "+presetName+" LOADING", data, "from", location, this )

		// let's load in all notes for this preset by requesting all the audio buffer
		// data from either the mp3 or wav or ogg files provided by the pattern
		// try{
			// we have to send "folder" if loading from a string...
			// const audioBufferData = await loadInstrumentFromSoundFontStringViaWorker( this.audioContext, data.location, options, onProgressCallback )
			
			// TODO : As zip!
			// const audioBufferData = await loadInstrumentFromSoundFontStringZipViaWorker( this.audioContext, data.location, options, onProgressCallback )
		
			// As individual mp3 files from a remote server in sequence
			// this is nice as it allows data to be streamed into the app in realtime
			// and we can load the middle most fequently used samples first as a priority
			// this results in far more requests but lower CPU usage and smoother transition
			const audioBufferData = await loadInstrumentFromSoundFont( this.audioContext, data.location, location, options, onProgressCallback )
			
			//this.instrument = await loadInstrumentFromSoundFont( presetName, this.name, this.context, onProgressCallback )
			// const reload = await this.loadPack( this.instrumentPack, onProgressCallback  )
		
			// TODO: Use fetch-worker to load the array
			// loadInstrumentFromSoundFontSamples
			this.audioBuffers.set( data.name, audioBufferData )

			// console.error("Instrument loaded", presetNameOrNumber, data.name, audioBufferData )
		
			this.loading = false
			return audioBufferData

			/*
		}catch(error){

			this.loading = false

			console.error( "*** failed to get audio from", data.location, this.name, {data} )
			console.error( "*** failed to get audio from", error )

			// try to understand what has failed here and communicate it back to the user...

			// 1. ,
			if ( !this.audioContext )
			{
				throw Error("You must provide a valid AudioContext to the SoundFont")
			}

			if ( !data.location || data.location.length < 1 )
			{
				throw Error(`data.location of "${data.location}" could not be loaded, please check availability`)
			}
			
			if (error && String(error).toLowerCase().indexOf("encoding") > -1)
			{
				throw Error("A Preset '"+presetNameOrNumber+"' was loaded but the data does not appear to contain audio. Perhaps a 404 html page was returned instead of your expected audio file?")	
			}
			
			if ( !this.name || this.name.length < 1 )
			{
				throw Error("Not sure what happened but there is name associated with the instrument")	
			}

			// console.error("Instrument failed",presetNameOrNumber, error )

			// if ( !instrumentPack )
			// {
			// 	throw Error("No instrument pack provided")
			// }else if (instrumentPack.indexOf(".json") > -1){
			// 	throw Error("You tried to load a soundfont with a descriptor uri! "+instrumentPack)
			// }else{
				throw Error("Not sure what happened there")
			// }	
		}*/
	}
	
	/**
	 * Load multiple presets into memory
	 * @param {Array<String>} presetNames 
	 * @param {Onject} options 
	 * @param {Function} onProgressCallback 
	 */
	async loadPresets( presetNames, options={}, onProgressCallback=null ){

		const simultaneous = options.simultaneous ?? 12
		
		const output = []
		// presetNames = rearrangeArrayBySnake( presetNames , options.startIndex ?? 0 )
			
		// if a single string was provided, convert to array
		if (typeof presetNames === "string")
		{
			presetNames = [presetNames]
		}

		for (let i=0, l=presetNames.length; i<l; ++i )
		{	
			let promises = []

			for (let s=0; s<simultaneous; ++s )
			{
				const presetName = presetNames[i]
				const percent = i / l
			
				const presetPromise = this.loadPreset( presetName, options, 
					onProgressCallback ? 
						({progress, instrumentName})=>onProgressCallback(percent + (progress/l), progress, instrumentName) : 
						null 
				).then( preset=>{
					output.push( preset )
				})
				promises.push( presetPromise )
				i++
			}

			await Promise.allSettled( promises )
		}
		return output
	}
		
	/**
	 * Load *every* instrument in this soundfont!
	 * NB. Requires either the descriptor to be loaded
	 * or for a full sample pack with no gaps to be available
	 */
	async loadAllPresets( options={}, onProgressCallback=null ){
		return this.loadPresets( this.descriptor, options, onProgressCallback )
	}

	// setAudioBuffer( buffer ){
	// 	audioBuffers.set( key, buffer )
	// }

	random(){
		return getRandomInstrument()
	}

	/**
	 * Clean up and destroy all associations 
	 * so that GC can free up memory
	 */
	async destroy(){
		this.instruments = []
		delete this.audioBuffers
		delete this.instrumentsByPath
		delete this.instrumentsByName
		return true
	}

	/**
	 * Help debug what is available in this class
	 */
	toString(){

		let p = ``

		GENERAL_MIDI_LIBRARY.forEach( (val, key) => {

		})

		return p
	}
}