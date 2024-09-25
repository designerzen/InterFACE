
/*

Load in the instrument list 

const factory = new InstrumentFactory()
await factory.loadList( "./instrument-list.json" )
factory.list
factory.loadInstrument(0)

*/

import { fetchJSON } from "../utils/fetch.js"
import MIDIInstrument from "./instruments/instrument.midi.js"
import SoundFontInstrument from "./instruments/instrument.soundfont"
// import WAMInstrument from "./instruments/instrument.wam"
// import WAM2Instrument from "./instruments/instrument.wam2"
// import OscillatorInstrument from "./instruments/instrument.oscillator.js"
// import WaveGuideInstrument from "./instruments/instrument.waveguide"
// import YoshimiInstrument from "./instruments/instrument.yoshimi"

export const INSTRUMENT_TYPE_MIDI = "midi"
export const INSTRUMENT_TYPE_OSCILLATOR = "oscillator"
export const INSTRUMENT_TYPE_SOUNDFONT = "soundfont"
export const INSTRUMENT_TYPE_WAM = "wam"
export const INSTRUMENT_TYPE_WAM2 = "wam2"

export const INSTRUMENTS = [
	INSTRUMENT_TYPE_SOUNDFONT,
	INSTRUMENT_TYPE_OSCILLATOR,
	INSTRUMENT_TYPE_WAM,
	INSTRUMENT_TYPE_WAM2,
	INSTRUMENT_TYPE_MIDI
]

const instrumentsImported = new Map()

// PRELOAD
// set all types that point to these endpoints
instrumentsImported.set("soundfont", SoundFontInstrument)

/**
 * Lazily Load the class required for creating an instrument
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
			const OscillatorInstrument = (await import("./instruments/instrument.oscillator.js")).default
			instrumentsImported.set("oscillator", OscillatorInstrument)
			return OscillatorInstrument
			
		case "sf":
		case INSTRUMENT_TYPE_SOUNDFONT:
			const SoundFontInstrument = (await import( "./instruments/instrument.soundfont.js")).default
			instrumentsImported.set("soundfont", SoundFontInstrument)
			return SoundFontInstrument
			
		case INSTRUMENT_TYPE_WAM:
			const WAMInstrument = (await import( "./instruments/instrument.wam.js")).default
			instrumentsImported.set(type, WAMInstrument)
			return WAMInstrument

		case INSTRUMENT_TYPE_WAM2:
			const WAM2Instrument = (await import( "./instruments/instrument.wam2.js")).default
			instrumentsImported.set(type, WAM2Instrument)
			return WAM2Instrument

		case INSTRUMENT_TYPE_MIDI:
			// const MIDIInstrument = (await import( "./instruments/instrument.midi.js")).default
			// instrumentsImported.set(type, MIDIInstrument)
			return MIDIInstrument
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
		case INSTRUMENT_TYPE_MIDI:
			const MIDIInstrument = await lazilyLoadInstrument(type)
			const midiInstrument = new MIDIInstrument(audioContext, options)
			return midiInstrument

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


export default class InstrumentFactory{

	instruments = new Map()
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

	/**
	 * load list of instruments from a string if not already loaded.
	 * @param {String} listURIorJSON 
	 * @returns Array
	 */
	async loadList( listURIorJSON )
	{
		
		if (typeof listURIorJSON === "string")
		{
			// check if it is JSON data...
			if (listURIorJSON.charAt(0) === "[" )
			{
				// a JSON encoded string of array
				this.instrumentList = JSON.parse(listURIorJSON)

			}else{
				
				// if it is a URi... load in from JSON data
				try{
					//console.error("Loading instrument list from JSON data", listURIorJSON)
					this.instrumentList = await fetchJSON(listURIorJSON)
					console.error("Loaded instrument list from JSON data",{listURIorJSON, list:this.instrumentList}, this) 
					
				}catch(error){
					console.error("Error loading instrument list!", error)
					throw Error("Could not find that list")
				}
			}
		
		}else if (typeof listURIorJSON === "object" && Array.isArray(listURIorJSON) ){

			// else assume the data is an array ready to go!
			this.instrumentList = listURIorJSON

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
				// cache by name?
				this.instrumentData.set( instrument.type, [...(this.instrumentData.get(instrument.type) ?? []), instrument] )
				this.instruments.set( instrument.name, instrument )
			})
		}else{
			console.error("No instrument list could be decoded", this.instrumentList)
			throw Error("Could not decode that list")
		}

		// NB. may return undefined if no instrument List was available
		// 		or an old one if this new one couldn't load
		return this.instrumentList
	}

	/**
	 * Create an instrument of type
	 * @param {String} type 
	 * @returns 
	 */
	async fetchClassByType(type){
		return await lazilyLoadInstrument( type.toLowerCase() )
	}

	// TODO Add arguments
	async loadInstruments( options={}, progressCallback=null ){
		const t = this.instrumentList.map( async (data, index) =>{
			progressCallback && progressCallback( index / (this.quantity -1) )
			return await createInstrumentFromData( this.audioContext, { ...data,  ...options } ) 
		})
		return Promise.all( t )
	}

	async loadInstrumentFromList( index=0, options={} ){
		return await createInstrumentFromData( this.audioContext, { ...this.list[ index % (this.quantity - 1)],  ...options } )
	}

	/**
	 * 
	 * @param {String} type 
	 * @param {Object} options 
	 * @param {Number} presetIndex 
	 * @returns 
	 */
	async loadInstrumentByType( type, options={}, presetIndex=0 ){
		if (!this.instrumentData)
		{
			throw Error("No instruments loaded, call factory.loadList() to load in a data set before calling factory.loadInstrumentByType()")
		}

		// loop through list and find that type
		const all = this.instrumentData.get( type.toLowerCase() )
		if (!all)
		{
			throw Error("There is no instrument in the list with type "+type )
		}
		
		// see if that preset exists!
		const data = all[presetIndex]
		if (!data)
		{
			throw Error("There is no instrument in the list at index "+presetIndex )
		}
		return await createInstrumentFromData( this.audioContext, {...data, ...options } )
	}

	/**
	 * Load / Create a single instance of the named instrument
	 * or else return null and throw errors
	 * @param {String} name 
	 * @param {Object} options 
	 * @returns 
	 */
	async loadInstrumentByName( name, options={} ){
		if (!this.instruments)
		{
			throw Error("No instruments loaded, call factory.loadList() to load in a data set before calling factory.loadInstrumentByName()")
		}

		// loop through list and find that type
		const data = this.instruments.get( name )
		if (!data)
		{
			throw Error("There is no instrument in the list named "+name )
		}
		return await createInstrumentFromData( this.audioContext, {...data, ...options } )
	}
}