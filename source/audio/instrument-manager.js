/**
 * This handles one instrument per Manager is loaded
 * and is responsible for loading the instrument classes
 * and destroying any existing ones.
 */
export default class InstrumentManager{
	
	activeInstrument
	instruments = []
	instrumentPointer = 0
	instrumentLoadedAt = -1

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
	get instrumentIndex(){
		return this.instrumentPointer // getGeneralMIDIInstrumentFolders().indexOf(this.instrumentName)
	}

	/**
	 * Is the instrument currently loading
	 * @returns {Boolean} are samples loading
	 */
	get instrumentLoading(){
		return this.activeInstrument.isLoading
	}

	constructor(audioContext){
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
	 * Load a specific instrument for this Person
	 * TODO: Add loading events
	 * @param {String} instrumentName Name of the standard instrument to load
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadInstrument(instrumentName, progressCallback){

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
		this.instrumentPointer = this.samplePlayer.instrumentIndex

		return instrumentName
	}
}