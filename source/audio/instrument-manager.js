import InstrumentFactory from "./instrument-factory"

/**
 * This handles one instrument per Manager is loaded
 * and is responsible for loading the instrument classes
 * and destroying any existing ones.
 */
export default class InstrumentManager{
	
	audioContext
	activeInstrument
	instruments = []
	instrumentPointer = 0
	instrumentLoadedAt = -1

	factory

	static get instruments(){
		return []
	}

	/**
	 * Fetch the instrument name eg. french-horn
	 * @returns {String} Instrument name
	 */
	get instrumentName(){
		return this.activeInstrument ? this.activeInstrument.name : 'loading'
	}	
	
	/**
	 * Fetch the instrument title eg. French Horn
	 * @returns {String} Instrument title
	 */
	get instrumentTitle(){
		return this.activeInstrument ? this.activeInstrument.title : 'loading'
	}

	/**
	 * Fetch the index in the instrument array of the current instrument
	 * @returns {Number} Instrument index
	 */
	get activePresetIndex(){
		return this.instrumentPointer // getGeneralMIDIInstrumentFolders().indexOf(this.instrumentName)
	}

	/**
	 * Is the instrument currently loading
	 * @returns {Boolean} are samples loading
	 */
	get instrumentLoading(){
		return this.activeInstrument.isLoading
	}

	constructor(audioContext, factory=null){

		this.audioContext = audioContext
		this.factory = factory
		// this.samplePlayer = this.setMainInstrument( this.addInstrument( new SoundFontInstrument(audioContext, samplePlayerOptions) ) )
		// this.addInstrument( new OscillatorInstrument(audioContext, this.gainNode) )
		// this.addInstrument( new WaveGuideInstrument(audioContext, this.gainNode) )
		// this.addInstrument( new YoshimiInstrument(audioContext, this.gainNode) )
		
		// const instrumentFactory = new InstrumentFactory(audioContext)
		// await instrumentFactory.loadList( INSTRUMENT_LIST )

		// const soundFontInstrument = await instrumentFactory.loadInstrumentByType( INSTRUMENT_TYPE_SOUNDFONT, samplePlayerOptions )
	}
	
	/**
	 * Provide this Person with a random instrument
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadRandomInstrument(progressCallback){
		return this.loadPreset("loadRandomPreset", progressCallback)
	}

	/**
	 * Provide this Person with a the previous instrument in the list
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadPreviousInstrument(progressCallback){
		return this.loadPreset("loadPreviousPreset", progressCallback)
	}

	/**
	 * Provide this Person with a the subsequent instrument in the list
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadNextInstrument(progressCallback){
		return this.loadPreset("loadNextPreset", progressCallback)
	}

	/**
	 * Reload ALL instruments for this user
	 * NB. If we have swapped the instrument pack we can use this method
	 * to reload the same instrument but with the new samples
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async reloadInstrument(progressCallback){
		return this.loadPreset("reloadInstrument", progressCallback)
	}

	/**
	 * Replace currently active instrument with the new one
	 * specified - this destroys the old one 
	 * @param {Instrument} newInstrument 
	 */
	async swapInstrument(newInstrument){

		// ensure that the instrument has actually loaded
		await newInstrument.loaded

		// Ensure that the instrument has actually changed
		if (this.activeInstrument === newInstrument)
		{
			// nothing to swap to!
			return false
		}

		// disconnect the output from the instument,
		// kill old instrument and ensure garbage collection
		// deals with the old instrument as soon as possible
		if (this.activeInstrument)
		{
			this.activeInstrument.output.disconnect()
			this.activeInstrument.destroy()
		}

		this.activeInstrument = newInstrument
		
		// Connect to the mixer
		if (newInstrument.output)
		{
			newInstrument.output.connect( mixer )
		}else{
			// no AUDIO output to connect to (could be MIDI output for example)
		}
		return true
	}
	
	/**
	 * Load a specific instrument into memory and 
	 * TODO: Add loading events
	 * @param {String} instrumentName Name of the standard instrument to load
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadInstrument(instrumentName, progressCallback){
	
		// load an instrument and populate the panels
		const DefaultInstrumentClass = await lazilyLoadInstrument( instrumentName )
		const defaultInstrument = new DefaultInstrumentClass(this.audioContext)
		const defaultPresets = await this.swapToInstrument( defaultInstrument )
	
		// now populate the PANEL?


		const presets = this.samplePlayer.instrumentNames

		// always remove the suffixes?
		const instrumentNameRefined = instrumentName //.replace("-mp3", "")

		// console.log("Loading instrument",instrumentName, presets)

		// ensure that the instrument is accissilbe
		//const generalMIDIInstrumentId = presets.indexOf(instrumentNameRefined)
		// if ( generalMIDIInstrumentId  < 0 )
		// {
		// 	throw Error("Person.loadInstrument("+instrumentName+") failed")
		// }

		const instrumentPack = this.options.instrumentPack
		//console.log(generalMIDIInstrumentId, "Person loading instrument "+instrumentName + '>' + instrumentPack + +" via sampleplayer")
		
		this.instrument = await this.samplePlayer.loadPreset(instrumentNameRefined, instrumentPack, progress => {
			progressCallback && progressCallback( progress )
			this.dispatchEvent(EVENT_INSTRUMENT_LOADING, { progress, instrumentNameRefined })
		} )

		// just an index as to which out of all instrument data is this one
		this.instrumentPointer = this.samplePlayer.activePresetIndex

		return instrumentName
	}

	/**
	 * Create a replica of this InstrumentManager and share the factory
	 * @returns {InstrumentManager}
	 */
	clone(){
		return new InstrumentManager(this.audioContext, this.factory)
	}
}