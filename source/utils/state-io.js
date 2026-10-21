import State from './state.js'
import {
	ENCODED_QUERY_PARAM,
	compressQueryString,
	fromURLSafeBase64,
	toURLSafeBase64,
	uncompressQueryString
} from './state-encoding.js'

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

		// Keep editing cheap and readable. Only compress when leaving the page;
		// pagehide also works with the back/forward cache, unlike unload.
		window.addEventListener('pagehide', () => {
			if (!this.saveHistory || !this.url) return
			try {
				this.updateLocation(true, true)
			} catch (error) {
				// A browser may already have made this document inactive.
				console.warn('Could not compress the URL before leaving', error)
			}
		})
		window.addEventListener('pageshow', () => {
			if (this.saveHistory && this.url) this.updateLocation(false, true)
		})
	}

	loadFromLocation(defaultState=null, dispatchEvent=false){
		const state = super.loadFromLocation(defaultState, dispatchEvent)
		if (this.saveHistory) this.updateLocation(false, true)
		return state
	}

	toURLSafeBase64(base64String){
		return toURLSafeBase64(base64String)
	}

	fromURLSafeBase64(base64String){
		return fromURLSafeBase64(base64String)
	}

	/**
	 * Convert to String any zip compressed data
	 * @param {String|Array|Uint8Array} compressed 
	 * @returns {String}
	 */
	uncompressString(compressed){
		return uncompressQueryString(compressed)
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

	getEncodedSearchParams(compressed){
		return new URLSearchParams(this.uncompressString(compressed))
	}

	/**
	 * Zip a string and return it as a Uint8Array
	 * @param {String} string 
	 * @param {Object} zipOptions 
	 * @returns {String|Uint8Array} zip data
	 */
	compressString(string, zipOptions=DEFAULT_ZIP_OPTIONS){
		if (zipOptions.base64 === false)
		{
			throw new Error('StateWithIO only supports base64 encoded compressed query strings')
		}
		return compressQueryString(string, { ...DEFAULT_ZIP_OPTIONS, ...zipOptions })
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

	createEncodedURL(baseURL=window.location, zipOptions=DEFAULT_ZIP_OPTIONS){
		const url = new URL(baseURL)
		url.search = ''
		url.searchParams.set(ENCODED_QUERY_PARAM, this.createEncodedString(zipOptions))
		url.hash = this.getPreservedHash()
		return url.toString()
	}
}
