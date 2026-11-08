/**
 * Let's you load in soundfonts in the sf2 format from around the world
 * and if not available we can fall back to other packs located in other
 * origins
 */
import SampleInstrument from "./instrument.sample.js"

import {
	INSTRUMENT_DATA_PACKS, 
	INSTRUMENT_PACKS, 
	getGeneralMIDIInstrumentNames,
	getGeneralMIDIInstrumentFolders,
	createInstruments,
	getRandomInstrument,
	getInstrumentTitle,
	getInstrumentData
} from '../sound-font-instruments'

import SoundFont from "../sound-font.js"
import { convertMIDINoteNumberToName } from "../tuning/notes"
import { generateRoomImpulse } from "../effects/reverb-spaces.js"

// these are the file names and locations of each instrument
const GM_INSTRUMENT_NAMES = getGeneralMIDIInstrumentNames()
const GM_INSTRUMENT_FOLDERS = getGeneralMIDIInstrumentFolders()

const getProgressValue = (progress) => {
	const value = typeof progress === "object" ? progress?.progress : progress
	return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0
}

// If not specified in the constructor, the following options
// will be used. To load a preset from a specified pack you
// must provide both
const DEFAULT_OPTIONS = {
	// specify the location as part of the pack...
	instrumentPack:INSTRUMENT_PACKS[0],
	// preset to load on construction
	preset:GM_INSTRUMENT_NAMES[0],
	offlineAudioContext:null,
	// use a background thread to load / decode the data where possible
	useWorkers:true,
	// load the initial as a string
	asString:true
}

export const INSTRUMENT_TYPE_SOUNDFONT = "SoundFontInstrument"

export default class SoundFontInstrument extends SampleInstrument{

	static get name(){
		return INSTRUMENT_TYPE_SOUNDFONT
	}

	// create a super object containing paths and families ands such!
	static dictionary = createInstruments() 

	#title = "SoundFont Sample Player"
	
	type = "sample"
			
	soundfont
	activeSoundFontCacheKey = null
	fallbackAudioBuffers = null
	presetLoadToken = 0
	
	// these are the file names and locations of each instrument
	instrumentTitles = GM_INSTRUMENT_NAMES
	instrumentFolders = GM_INSTRUMENT_FOLDERS

	get name() {
		return INSTRUMENT_TYPE_SOUNDFONT
	}

	get audioNode(){
		return this.effectOutput ?? this.gainNode
	}

	get repetitionRate(){
		return this.activePresetData?.repetitionRate ?? super.repetitionRate
	}

	get playbackMode(){
		return this.activePresetData?.playbackMode ?? super.playbackMode
	}

	get reverbSettings(){
		if (this.engineReverb !== undefined) return this.engineReverb
		return this.activePresetData?.reverb ?? false
	}
	setEngineReverb(settings, impulse=null){
		this.engineReverb = settings.reverbMode === 'preset' ? undefined : settings.reverbMode === 'off' ? false :
			{mix:settings.reverbMix,duration:settings.reverbLength ?? settings.reverbDuration,tone:settings.reverbTone,preDelay:settings.reverbPreDelay}
		this.engineReverbImpulse = settings.reverbMode === 'custom' ? impulse : null
		this.configurePresetEffects()
	}

	get lpfSettings(){
		return this.activePresetData?.lpf ?? false
	}

	get compressorSettings(){
		return this.activePresetData?.compressor ?? false
	}
	
	/**
	 * This loads in a preset immediately if one is specified
	 * 
	 * @param {AudioContext} audioContext 
	 * @param {Object} options - see DEFAULT_OPTIONS
	 */
	constructor( audioContext, options={} ){

		super(audioContext, {...DEFAULT_OPTIONS, ...options})
		this.activePresetData = getInstrumentData(options.preset ?? options.defaultPreset ?? 0)
		this.setupEffectChain()
		this.configurePresetEffects()

		// console.error( "zen look here", DEFAULT_OPTIONS, options)

		this.available = false

		// if we have a preset number, set it
		if (!isNaN(options.defaultPreset))
		{
			this.presetIndex = options.defaultPreset
		}else if (typeof options.defaultPreset === "string"){
			this.presetIndex = this.getIndexFromName( options.defaultPreset)
		}

		// use the provided soundfont class or else create a new instance
		// and set it with the offlineAudioCoontext if set as an option,
		// otherwise load the 
		this.soundfont = options.packData ?? new SoundFont( audioContext, options.offlineAudioContext )

		
		// attempt to load "pack" provided - this can come in various forms
		// see below in loadFont for the various options
		if (this.options.instrumentPack)
		{
			// you can use an offline context too...	
			// as this is an immediate load, we can use the JS rather than MP3s...
			this.loadFont( this.options.instrumentPack, this.options ).then((font)=>{

				if (this.options.preload)
				{
					// now load our first preset or a specified one...
					this.loadPreset( this.options.preset ?? 0, this.options.instrumentPack ).then( preset => {
						// console.error("preset", preset )
					})	
				}

				// console.error("soundfont", this, font )
			
			}).catch( error => {

				console.error("loadFont", error)
			})

		}else{

			console.error("no pack or preset provided")
		}
	}

	setupEffectChain(){
		if (!this.gainNode?.connect || !this.context?.createGain)
		{
			return false
		}

		this.lpfNode = this.context.createBiquadFilter?.()
		this.compressorNode = this.context.createDynamicsCompressor?.()
		this.reverbNode = this.context.createConvolver?.()
		this.dryGainNode = this.context.createGain()
		this.reverbGainNode = this.context.createGain()
		this.effectOutput = this.context.createGain()

		let source = this.gainNode
		if (this.lpfNode)
		{
			source.connect(this.lpfNode)
			source = this.lpfNode
		}
		if (this.compressorNode)
		{
			source.connect(this.compressorNode)
			source = this.compressorNode
		}

		source.connect(this.dryGainNode)
		this.dryGainNode.connect(this.effectOutput)
		if (this.reverbNode)
		{
			source.connect(this.reverbNode)
			this.reverbInput = source
			this.reverbConnected = true
			this.reverbNode.connect(this.reverbGainNode)
			this.reverbGainNode.connect(this.effectOutput)
		}
		return true
	}

	setAudioParam(parameter, value){
		if (!parameter || !Number.isFinite(value)) return
		if (typeof parameter.setValueAtTime === "function")
		{
			parameter.setValueAtTime(value, this.context.currentTime)
		}else{
			parameter.value = value
		}
	}

	createReverbImpulse({ duration=1.5, tone=0, preDelay=0.012 }={}){
		if (!this.context?.createBuffer) return null
		return generateRoomImpulse(this.context, { length:duration, tone, preDelay })
	}

	configurePresetEffects(){
		const lpf = this.lpfSettings
		if (this.lpfNode)
		{
			this.lpfNode.type = lpf ? "lowpass" : "allpass"
			this.setAudioParam(this.lpfNode.frequency, lpf ? lpf.frequency : Math.min(20000, (this.context.sampleRate || 44100) / 2))
			this.setAudioParam(this.lpfNode.Q, lpf ? (lpf.Q ?? 0.0001) : 0.0001)
		}

		const compressor = this.compressorSettings
		if (this.compressorNode)
		{
			this.setAudioParam(this.compressorNode.threshold, compressor ? compressor.threshold : 0)
			this.setAudioParam(this.compressorNode.knee, compressor ? compressor.knee : 0)
			this.setAudioParam(this.compressorNode.ratio, compressor ? compressor.ratio : 1)
			this.setAudioParam(this.compressorNode.attack, compressor ? compressor.attack : 0)
			this.setAudioParam(this.compressorNode.release, compressor ? compressor.release : 0.25)
		}

		const reverb = this.reverbSettings
		const mix = reverb ? Math.max(0, Math.min(1, reverb.mix ?? 0.15)) : 0
		this.setAudioParam(this.dryGainNode?.gain, 1 - mix)
		this.setAudioParam(this.reverbGainNode?.gain, mix)
		// An idle convolver with a buffer still convolves silence for every voice
		if (this.reverbInput && this.reverbConnected !== mix > 0)
		{
			if (mix > 0) this.reverbInput.connect(this.reverbNode)
			else this.reverbInput.disconnect(this.reverbNode)
			this.reverbConnected = mix > 0
		}
		if (this.reverbNode && reverb)
		{
			if (this.engineReverbImpulse) {
				this.reverbNode.buffer = this.engineReverbImpulse
				this.reverbImpulseKey = null
				return
			}
			const impulseKey = `${reverb.duration ?? 1.5}:${reverb.tone ?? 0}:${reverb.preDelay ?? 0.012}`
			if (this.reverbImpulseKey !== impulseKey)
			{
				this.reverbNode.buffer = this.createReverbImpulse(reverb)
				this.reverbImpulseKey = impulseKey
			}
		}
	}

	/**
	 * Try and determine the index of the preset within the range
	 * @param {String} presetName 
	 * @returns 
	 */
	getIndexFromName(presetName){

		// already a number
		if (!isNaN(presetName))
		{
			return presetName
		}

		let index = this.instrumentFolders.indexOf(presetName)
		if (index > -1)
		{
			return index
		}
		
		index = this.instrumentTitles.indexOf(presetName)
		if (index > -1)
		{
			return index
		}
		const data = this.soundfont.getInstrumentData(presetName)
		if (data)
		{
			index = this.instrumentFolders.indexOf( data.folder)
			
			return index
		}
		
		return -1
	}
	
	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		this.presetIndex = this.getIndexFromName(programNumber)
		return await super.programChange( programNumber )	
	}

	/**
	 * SoundFont patches are exposed by their loadable folder names. This keeps
	 * the common Instrument/ChordInstrument preset API usable when a Person
	 * switches directly to the SoundFont engine.
	 */
	async getPresets(){
		return [...this.instrumentFolders]
	}

	/**
	 * 
	 * @param {Number} noteNumber 
	 * @param {Number} velocity 
	 * @returns 
	 */
	async noteOn(noteNumber, velocity=1){
		return super.noteOn(noteNumber, velocity)
	}

	getAudioBufferForNoteNumber(noteNumber){
		const index = convertMIDINoteNumberToName(noteNumber)
		const audioBuffer = this.audioBuffers[index] ?? this.fallbackAudioBuffers?.[index]
		if (audioBuffer)
		{
			SoundFont.noteUsed(this.activeSoundFontCacheKey, index)
		}
		return audioBuffer
	}

	// FIXME: Fade out the gate
	// async noteOff(noteNumber, velocity=0){
	// 	this.volume = velocity
	// 	return super.noteOff(noteNumber)
	// }

	/**
	 * Load in a file that describes this sound font and set the instrument
	 * to lazily load instruments from this pack and location as they are requested
	 * in the future
	 * 
	 * @param {String} pack 
	 * @param {Function} onProgress 
	 * @returns 
	 */
	async loadFont( pack, options={}, onProgress=null ){

		let descriptorURI = ""
	
		onProgress && onProgress(0)

		// FIXME: integrate the soundfont
		// if ( pack.indexOf(".js") === pack.length - 3 )
		// {
			
		// 	options.asString = true
		// 	descriptorURI = pack
		// 	console.error("found JS pack.. loading as string")


		// }else
		
		if (pack.indexOf(".json") === -1)
		{
			// pack is either by name?
			const index = INSTRUMENT_PACKS.indexOf(pack)
			if (index > -1)
			{
				this.instrumentPack = INSTRUMENT_PACKS[index]
				descriptorURI = INSTRUMENT_DATA_PACKS[index]
			}else{

				throw Error("loadFont failed. Expected a data source but couldn't find one", pack )
			}
			
		}else{

			const indexOfPack = INSTRUMENT_DATA_PACKS.indexOf(pack)

			if (indexOfPack > -1)
			{
				// pack is a JSON file that can be loaded in to provide the instrument names
				// from a dedicated location

				// determine the pack name from the JSON file
				this.instrumentPack = INSTRUMENT_PACKS[ indexOfPack ]
				
				// and assune that the pack is a full URi
				descriptorURI = pack
			}else{
				// pack provided with pack name and URL?
				this.instrumentPack = pack
			}
		}

		// console.log("loading font",this.instrumentPack, this, arguments )
		// soundfont automatically reloads so we do not need to re-request it		
		// const font = await loadInstrumentDataPack( descriptorURI )
		
		// load selected instrument

		// const reload = await this.loadPack( this.instrumentPack, onProgress  )
		
		// This should really come in from the options
		const fontDescriptor = {
			descriptor: this.instrumentPack, 
			descriptorPath:'./assets/audio/',
			preset:this.presetIndex 
		}

		// load in a sound font - this can be either a fully qualified url
		// a relative uri or the name of the pack
		// const fontData = await this.soundfont.loadFont( this.instrumentPack, './audio/', p => onProgress && onProgress( p / 2 ) )
		// console.time("loadSoundFontFont", options)	
		const fontData = await this.soundfont.load( fontDescriptor, p => onProgress && onProgress( p / 2 ) )
		// console.endTime("loadFont")	

		// fetch the available presets from the instrument...
		const availablePresets = this.soundfont.presets
		// const availablePresets = await this.soundfont.presetTitles

	
		// FIXME:
		// find associated instrument - for GM these should be the same
		// but there may be descrepencies for
		const currentPreset = availablePresets[ this.presetIndex ]
		
		// console.error("Found font", { availablePresets })
		// console.info("Found font", { fontDescriptor, fontData, availablePresets })		
		// console.info("Found availablePreset", {availablePresets, currentPreset} )

		//await this.soundfont.loadPreset( availablePresets[0], packName, p => console.log(p) )
		// await this.loadPreset( currentPreset, pack, options, p => onProgress && onProgress( 0.5 + p / 2 ) )

		onProgress && onProgress(1)

		return fontData
	}


	

	/**
	 * Load a specific instrument "patch" for this AudioNode
	 * TODO: Add loading events
	 * @param {String|Object} presetNameOrObject Name of the standard instrument to load
	 * @param {String} instrumentPack Name of the standard instrument to load
	 * @param {Function} options Settings & config
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadPreset(presetNameOrObject, instrumentPack, options={}, progressCallback=()=>{} ){
		if (typeof options === "function")
		{
			progressCallback = options
			options = {}
		}
	
		// convert the object into a preset folder string name
		if (typeof presetNameOrObject === "object")
		{
			presetNameOrObject = presetNameOrObject.folder
		}

		if (!instrumentPack)
		{
			throw Error("No instrumentPack name was provided")
		}	

		// this might be a number...
		if (typeof presetNameOrObject === "string" && isNaN(presetNameOrObject))
  		{
			// if it is a string then we need to find the index
			const presetIndex = this.instrumentFolders.indexOf(presetNameOrObject)
			if (presetIndex > -1)
			{
				this.presetIndex = presetIndex
			}
		}

		const presetData = this.soundfont.getInstrumentData(presetNameOrObject)
		const instrumentData = getInstrumentData(presetNameOrObject) ??
			getInstrumentData(presetData?.folder) ??
			getInstrumentData(presetData?.name)
		const presetCacheKey = presetData?.name ?? presetNameOrObject
		const nextPresetName = presetData?.folder ?? presetNameOrObject
		const previousCacheKey = this.activeSoundFontCacheKey
		const previousAudioBuffers = this.audioBuffers
		const loadToken = ++this.presetLoadToken
		const finalInstrumentTitle = getInstrumentTitle( nextPresetName ) ?? presetData?.title ?? nextPresetName

		if (previousCacheKey === presetCacheKey && Object.keys(this.audioBuffers).length > 0)
		{
			return this.audioBuffers
		}

		await this.allNotesOff()
	
		// const index = this.getIndexFromName(presetName)
		
		// if (index  === -1)
		// {
		// 	console.error("Couldn't find matching preset name", {presetName, instrumentPack}, this.instrumentFolders, this.soundfont )
		// 	throw Error( `No Preset found with name "${presetName}" in pack "${instrumentPack}" (${this.soundfont.quantity})` )
		// }
	
		// check to see if the pack name is valid...
		this.instrumentLoading = true
		this.title = `${finalInstrumentTitle} 0%`
		
		try{

			options = {				// URI of the sound font
				soundfont : instrumentPack,
				// try and use a seperate thread for loading and decoding the data
				usingWorker : this.options.useWorkers,
				// load as a single string and convert to individual files
				loadAsOne : false,
				...options
			}
			
			// cancel loading any that are already loading...
			this.soundfont.cancelLoading()

			const nextAudioBuffers = {}
			this.fallbackAudioBuffers = previousAudioBuffers
			this.audioBuffers = nextAudioBuffers

			const loadedAudioBuffers = await this.soundfont.loadPresetGradually( nextAudioBuffers, nextPresetName, options, progress => {
				const progressValue = getProgressValue(progress)
				this.title = `${finalInstrumentTitle} ${Math.ceil(progressValue * 100)}%`
				progressCallback(progress)
			} )
			const audioBuffers = Object.keys(nextAudioBuffers).length > 0 ? nextAudioBuffers : loadedAudioBuffers

			if (loadToken !== this.presetLoadToken)
			{
				return this.audioBuffers
			}

			if (!audioBuffers)
			{
				throw Error("No audio buffers were loaded")
			}

			this.audioBuffers = audioBuffers
			this.fallbackAudioBuffers = null
			this.activeSoundFontCacheKey = presetCacheKey
			SoundFont.retainPreset(presetCacheKey)

			if (previousCacheKey && previousCacheKey !== presetCacheKey)
			{
				SoundFont.releasePreset(previousCacheKey)
			}
			
			// this.audioBuffers = await this.soundfont.loadPreset( presetNameOrObject, { ...options }, progressCallback )

			// FIXME: Send the -mp3 version...
			//this.instrument = await loadInstrumentFromSoundFont( this.context, instrumentName, instrumentPack, progressCallback )
		
		}catch(error){
			if (loadToken === this.presetLoadToken)
			{
				this.instrumentLoading = false
				this.audioBuffers = previousAudioBuffers
				this.fallbackAudioBuffers = null
			}

			if (!instrumentPack)
			{
				throw Error("No instrumentPack name was provided")
			}	

			if (instrumentPack.indexOf(".json") > -1)
			{
				throw Error("You tried to load a soundfont with a descriptor uri! "+instrumentPack)
			}	
			throw Error("Soundfont could not load "+error)
		}
		
		// FIXME: set the default instrument index if saved
		this.instrumentName = nextPresetName
		this.instrumentPack = instrumentPack
		this.activePresetData = instrumentData
		this.instrumentFamily = instrumentData?.family ?? presetData?.family ?? this.audioBuffers.family
		this.configurePresetEffects()

		// Fetch the GM name
		this.title = finalInstrumentTitle
		// this.name = "SampleInstrument:"+presetNameOrObject

		// console.error("Soundfont", this, this.instrumentName, this.instrumentPack, this.instrumentFamily, {presetNameOrObject, instrumentPack, options} )

		
		// console.info("Soundfont preset", SoundFontInstrument.dictionary)

		// this.instrumentMap = {}
		// TODO: inside out object
		// convert the instrument map into a number map
		// for (let i=0; i < 200; ++i){
		// 	this.instrumentMap[i] = this.instrument
		// }
		
		this.instrumentLoading = false
		this.available = true
		return this.audioBuffers
	}

	/**
	 * Provide this Person with a random instrument
	 * @param {Function} progressCallback Method to call during load and once the instrument has loaded
	 */
	async loadRandomPreset(progressCallback){
		return await this.loadPreset( getRandomInstrument(), this.instrumentPack, {}, progressCallback )
	}

	async destroy(){
		if (this.activeSoundFontCacheKey)
		{
			SoundFont.releasePreset(this.activeSoundFontCacheKey)
			this.activeSoundFontCacheKey = null
		}
		this.fallbackAudioBuffers = null
		this.soundfont?.cancelLoading()
		;[this.lpfNode, this.compressorNode, this.reverbNode, this.dryGainNode, this.reverbGainNode, this.effectOutput]
			.forEach(node => node?.disconnect?.())
		return await super.destroy()
	}
	
	clone(){
		return new SoundFontInstrument(this.audioContext, this.options)
	}
}
