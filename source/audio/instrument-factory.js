import SoundFontInstrument from "./instruments/instrument.soundfont"
// import WAMInstrument from "./instruments/instrument.wam"
// import WAM2Instrument from "./instruments/instrument.wam2"
// import OscillatorInstrument from "./instruments/instrument.oscillator.js"

const instrumentsImported = new Map()

// PRELOAD
// set all types that point to these endpoints
instrumentsImported.set("soundfont", SoundFontInstrument)

export const INSTRUMENT_TYPE_OSCILLATOR = "oscillator"
export const INSTRUMENT_TYPE_SOUNDFONT = "soundfont"
export const INSTRUMENT_TYPE_WAM = "wam"
export const INSTRUMENT_TYPE_WAM2 = "wam2"

/**
 * 
 * @param {String} type 
 * @returns Class that extends Instrument
 */
export const lazilyLoadInstrument = async (type) => {
	
	// already loaded
	if (instrumentsImported.has(type))
	{
		return instrumentsImported.get(type)
	}

	// lazily load this instrument into memory?
	switch( type )
	{
		case "osc":
		case INSTRUMENT_TYPE_OSCILLATOR:
			const OscillatorInstrument = await import("./instruments/instrument.oscillator.js")
			instrumentsImported.set("oscillator", OscillatorInstrument)
			return OscillatorInstrument
			
		case "sf":
		case INSTRUMENT_TYPE_SOUNDFONT:
			const SoundFontInstrument = await import( "./instruments/instrument.soundfont.js")
			instrumentsImported.set("soundfont", SoundFontInstrument)
			return SoundFontInstrument
			
		case INSTRUMENT_TYPE_WAM:
			const WAMInstrument = await import( "./instruments/instrument.wam.js")
			instrumentsImported.set(type, WAMInstrument)
			return WAMInstrument

		case INSTRUMENT_TYPE_WAM2:
			const WAM2Instrument = await import( "./instruments/instrument.wam2.js")
			instrumentsImported.set(type, WAM2Instrument)
			return WAM2Instrument
	}

	return null
}

/**
 * Load an instrument from a data model.
 * This is responsible for :
 * 1. Loading the JS file
 * 2. Loading the descriptor file
 * 3. Populating the instrument with the options specified
 * 4. Load in any external data and populate audio
 * @param {Object} options 
 * @returns Instrument
 */
export const createInstrumentFromData = async (audioContext, options) => {

	const type = options.type.toLowerCase() 
			
	// lazily load in data
	switch( type )
	{
		case "osc":
		case INSTRUMENT_TYPE_OSCILLATOR:
			const OscillatorInstrument = await lazilyLoadInstrument(type)
			const oscillatorInstrument = new OscillatorInstrument(audioContext, options)
			return oscillatorInstrument
			
		case "sf":
		case INSTRUMENT_TYPE_SOUNDFONT:
			const SoundFontInstrument =  await lazilyLoadInstrument(type)
			const soundfontInstrument = new SoundFontInstrument(audioContext, options)
			return soundfontInstrument
			
		case INSTRUMENT_TYPE_WAM:
			// await injectJavascript(pluginURL)
			const WAMInstrument =  await lazilyLoadInstrument(type)
			const wamInstrument = new WAMInstrument(audioContext, options.pluginURL, options)
			return wamInstrument

		case INSTRUMENT_TYPE_WAM2:
			const WAM2Instrument =  await lazilyLoadInstrument(type)
			const wam2Instrument = new WAM2Instrument(audioContext, options.pluginURL, options)
			return wam2Instrument
	}
	return null
}


export class InstrumentFactory{

	instrumentData
	instrumentList
	audioContext

	get list()
	{
		return this.instrumentList
	}

	get quantity()
	{
		return this.instrumentList.length
	}

	constructor(audioContext){
		this.audioContext = audioContext
	}

	// load list if not already loaded...
	async loadList( listURI )
	{
		if (typeof listURI === "string")
		{
			// check if it is JSON data...
			if (listURI.charAt(0) === "[" )
			{
				// a JSON encoded string of array
				this.instrumentList = JSON.parse(listURI)

			}else{

				// if it is a URi... load in from JSON data
				const listRequest = await fetch(listURI)
				const listData = await listRequest.json()
				this.instrumentList = listData
			}
		
		}else if (typeof listURI === "object" && Array.isArray(listURI) ){

			// else assume the data is an array ready to go!
			this.instrumentList = listURI

		}else{
			// No list found???
			throw Error("Could not find that list")
		}

		// 
		if (Array.isArray(this.instrumentList) && this.instrumentList.length)
		{
			// parse the list
			this.instrumentData = new Map()
			this.instrumentList.forEach( instrument => {
				this.instrumentData.set( instrument.type, instrument )
			})
		}

		// NB. may return undefined if no instrument List was available
		// 		or an old one if this new one couldn't load
		return this.instrumentList
	}

	async fetchClassByType(type){
		return await lazilyLoadInstrument( type.toLowerCase() )
	}

	async loadInstrumentFromList( index=0, options={} ){
		return await createInstrumentFromData( this.audioContext, { ...this.list[ index % (this.quantity - 1)],  ...options } )
	}

	async loadInstrumentByType( type, options={} ){
		// loop through list and find that type
		const data = this.instrumentData.get( type.toLowerCase() )
		if (!data)
		{
			throw Error("There is no instrument in the list with type "+type )
		}
		return await createInstrumentFromData( this.audioContext, {...data, ...options } )
	}
}

/*

Load in the instrument list 

const factory = new InstrumentFactory()
await factory.loadList( "./instrument-list.json" )
factory.list
factory.loadInstrument(0)

*/