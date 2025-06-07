
/*

Load in the instrument list 

const factory = new InstrumentFactory()
await factory.loadList( "./instrument-list.json" )
factory.list
factory.loadInstrument(0)

*/

import { fetchJSON } from "../utils/fetch.js"
import { INSTRUMENT_TYPE_CHORD, INSTRUMENT_TYPE_DRUMKIT, INSTRUMENT_TYPE_DUAL_OSCILLATOR, INSTRUMENT_TYPE_KIT, INSTRUMENT_TYPE_MIDI, INSTRUMENT_TYPE_MONOTRON, INSTRUMENT_TYPE_MOOG, INSTRUMENT_TYPE_OSCILLATOR, INSTRUMENT_TYPE_SOUNDFONT, INSTRUMENT_TYPE_SPEECH, INSTRUMENT_TYPE_SYTHESIZER, INSTRUMENT_TYPE_TRIPLE_OSCILLATOR, INSTRUMENT_TYPE_WAM, INSTRUMENT_TYPE_WAM2, INSTRUMENT_TYPE_WAVEGUIDE, INSTRUMENTS } from "./instrument-list.js"
import ChordInstrument from "./instruments/chord.instrument.js"
import MIDIInstrument from "./instruments/instrument.midi.js"
import SoundFontInstrument from "./instruments/instrument.soundfont.js"
// import TripleOscillatorInstrument from "./instruments/instrument.triple-oscillator.js"
// import WAMInstrument from "./instruments/instrument.wam.js"
// import WAM2Instrument from "./instruments/instrument.wam2.js"
// import OscillatorInstrument from "./instruments/instrument.oscillator.js"
// import WaveGuideInstrument from "./instruments/instrument.waveguide.js"
// import YoshimiInstrument from "./instruments/instrument.yoshimi.js"

const instrumentsImported = new Map()

// PRELOAD these types of instrument :
// set all types that point to these endpoints
instrumentsImported.set(INSTRUMENT_TYPE_CHORD, ChordInstrument )
instrumentsImported.set(INSTRUMENT_TYPE_SOUNDFONT, SoundFontInstrument)
// instrumentsImported.set(INSTRUMENT_TYPE_TRIPLE_OSCILLATOR, TripleOscillatorInstrument)

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
		case INSTRUMENT_TYPE_CHORD:
			const ChordInstrument = (await import("./instruments/chord.instrument.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_CHORD, ChordInstrument)
			return ChordInstrument
			
		case "osc":
		case INSTRUMENT_TYPE_OSCILLATOR:
			const OscillatorInstrument = (await import("./instruments/instrument.oscillator.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_OSCILLATOR, OscillatorInstrument)
			return OscillatorInstrument
			
		case "osc2":
		case INSTRUMENT_TYPE_DUAL_OSCILLATOR:
			const DualOscillatorInstrument = (await import("./instruments/instrument.dual-oscillator.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_DUAL_OSCILLATOR, DualOscillatorInstrument)
			return DualOscillatorInstrument
			
		case "osc3":
		case INSTRUMENT_TYPE_TRIPLE_OSCILLATOR:
			const TripleOscillatorInstrument = (await import("./instruments/instrument.triple-oscillator.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_TRIPLE_OSCILLATOR, TripleOscillatorInstrument)
			return TripleOscillatorInstrument
			
		case "synth":
		case INSTRUMENT_TYPE_SYTHESIZER:
			const SynthesizerInstrument = (await import("./instruments/instrument.synthesizer.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_SYTHESIZER, SynthesizerInstrument)
			return SynthesizerInstrument
			
		case INSTRUMENT_TYPE_MOOG:
			const MoogInstrument = (await import("./instruments/instrument.moog.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_MOOG, MoogInstrument)
			return MoogInstrument
			
		case INSTRUMENT_TYPE_MONOTRON:
			const MonotronInstrument = (await import("./instruments/instrument.monotron.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_MONOTRON, MonotronInstrument)
			return MonotronInstrument
			
		case "waveguide":
		case INSTRUMENT_TYPE_WAVEGUIDE:
			const WaveGuideInstrument = (await import("./instruments/instrument.waveguide.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_WAVEGUIDE, WaveGuideInstrument)
			return WaveGuideInstrument
			
		case "sf":
		case INSTRUMENT_TYPE_SOUNDFONT:
			const SoundFontInstrument = (await import( "./instruments/instrument.soundfont.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_SOUNDFONT, SoundFontInstrument)
			return SoundFontInstrument
			
		case INSTRUMENT_TYPE_WAM:
			const WAMInstrument = (await import( "./instruments/instrument.wam.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_WAM, WAMInstrument)
			return WAMInstrument

		case INSTRUMENT_TYPE_WAM2:
			const WAM2Instrument = (await import( "./instruments/instrument.wam2.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_WAM2, WAM2Instrument)
			return WAM2Instrument

		case INSTRUMENT_TYPE_SPEECH:
			const SpeechInstrument = (await import( "./instruments/instrument.speech.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_SPEECH, SpeechInstrument)
			return SpeechInstrument

		case INSTRUMENT_TYPE_DRUMKIT:
			const DrumkitInstrument = (await import( "./instruments/instrument.drumkit.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_DRUMKIT, DrumkitInstrument)
			return DrumkitInstrument
		
		case INSTRUMENT_TYPE_KIT:
			const KitInstrument = (await import( "./instruments/instrument.kit.js")).default
			instrumentsImported.set(INSTRUMENT_TYPE_KIT, KitInstrument)
			return KitInstrument

		case INSTRUMENT_TYPE_MIDI:
			// const MIDIInstrument = (await import( "./instruments/instrument.midi.js")).default
			// instrumentsImported.set(type, MIDIInstrument)
			return MIDIInstrument

		default: 
			console.error("LazilyLoad Instrument", {type} )
			return MIDIInstrument
	}
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

	const InstrumentClass = await lazilyLoadInstrument( options.type )
			
	if (!InstrumentClass)
	{
		throw Error("Instrument Class "+options.type+" could not be found")
	}

	// lazily load in c;ass data if available
	switch( options.type )
	{	
		case "wam":
		case INSTRUMENT_TYPE_WAM:
			// await injectJavascript(pluginURL)
			const wamInstrument = new InstrumentClass(audioContext, options.pluginURL, options)
			await wamInstrument.loaded
			return wamInstrument

		// case "wam2":
		// case INSTRUMENT_TYPE_WAM2:
		// 	const wam2Instrument = new InstrumentClass(audioContext, options)
		// 	await wam2Instrument.loaded
		// 	return wam2Instrument

		default:
			const instrumentInstance = new InstrumentClass(audioContext, options)
			await instrumentInstance.loaded
			return instrumentInstance
	}
}

/**
 * Load in a list of instruments and create them
 * as needed from either an ID or a type
 */
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

				// always ensure that the type has Instrument at the end...
				const type = instrument.type.includes("Instrument") ? instrument.type : instrument.type+"Instrument"

				// cache by name too?
				const data = [...(this.instrumentData.get(type) ?? []), instrument] 
				this.instrumentData.set( type, data)
				this.instrumentData.set( type.toLowerCase(), data)
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
	 * Create an instrument instance of 'type'
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

	/**
	 * 
	 * @param {Number} index 
	 * @param {Object} options 
	 * @returns 
	 */
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