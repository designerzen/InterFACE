import {
	gzip, zlib, AsyncGzip, zip, unzip, strFromU8,
	Zip, AsyncZipDeflate, Unzip, AsyncUnzipInflate,
	decompressSync,
	compressSync,
	strToU8
} from 'fflate'

import State from './state.js'
import { isBase64 } from './base64.js'

const DEFAULT_ZIP_OPTIONS = {
	// amount to squish
	level: 6, 
	// The mem ranges from 0 to 12, where 4 is the default	
	mem: 4,
	// save as base 64 encoded string
	base64: true
}

export default class StateWithIO extends State{

	static instance
	static getInstance( element ) {
		if (!StateWithIO.instance)
		{
			StateWithIO.instance = new StateWithIO( element )
		}
		return StateWithIO.instance
	}

	// get asEncodedURI(){
	// 	const url = new URL(window.location)
	// 	this.state.forEach( (value,key) => {
	// 		url.searchParams.set(key, value)
	// 	})
	// 	return url.pathname + "?b=" + encodeLocation(url.search)
	// }

	// get encoded(){
	// 	return encodeLocation(this.serialised)
	// }
	
	constructor(main){
		super(main)
	}

	/**
	 * Convert to String any zip compressed data
	 * @param {String|Array|Uint8Array} compressed 
	 * @returns {String}
	 */
	uncompressString(compressed){
		const isString = typeof compressed === "string"
		
		// check to see if the item is base 64!
		compressed = !isString ? 
			compressed : 
			isBase64(compressed) ?
				new Uint8Array(Buffer.from(compressed,'base64')) :
				strToU8(zipped)
			
		const decompressed = decompressSync(compressed)
		return strFromU8(decompressed)
	}

	/**
	 * Pass in a parameter string
	 * @param {String|Uint8Array} compressed 
	 * @returns {Object}
	 */
	loadFromEncodedString(compressed){
		const state = this.uncompressString(compressed)
		this.searchParams = new URLSearchParams(state)
		return state
	}

	/**
	 * Zip a string and return it as a Uint8Array
	 * @param {String} string 
	 * @param {Object} zipOptions 
	 * @returns {String|Uint8Array} zip data
	 */
	compressString(string, zipOptions=DEFAULT_ZIP_OPTIONS){
		// convert the string to a Uint8Array
		const bufferArray = strToU8(string)

		// The default compression method is gzip
		// Increasing mem may increase performance at the cost of memory
		const compressed = compressSync(bufferArray, {...DEFAULT_ZIP_OPTIONS, ...zipOptions} )
		
		return zipOptions.base64 ? 
			Buffer.from(compressed).toString('base64') : 
			// TODO: Convert to a simple string?
			compressed
	}

	/**
	 * Export the current state as an encoded string
	 * @param {Object} zipOptions 
	 * @returns {String|Uint8Array}
	 */
	createEncodedString( zipOptions=DEFAULT_ZIP_OPTIONS ){
		return this.compressString( this.searchParamsAsString, zipOptions)
	}

	/**
	 * 
	 * @param {Object} zipOptions 
	 * @returns {String} 
	 */
	createURLAsEncodedString( zipOptions=DEFAULT_ZIP_OPTIONS ){
		return this.compressString( this.searchParamsAsString, zipOptions)
	}
}