import Instrument from './instrument.js'

export const INSTRUMENT_TYPE_PERCUSSION = "KitInstrument"

export default class KitInstrument extends Instrument{

	static get name(){
		return INSTRUMENT_TYPE_PERCUSSION
	}

	name = INSTRUMENT_TYPE_PERCUSSION

	type = "KitInstrument"
	get title(){
		return "Custom Kit Instrument"
	}

	constructor( audioContext, options={} ){
		super( audioContext, options )
	}

	
	clone(){
		return new KitInstrument(this.audioContext, this.options)
	}
}