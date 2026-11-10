import State from './state.js'
import {
	STATE_QUERY_PARAM,
	compressQueryString,
	compressStateDelta,
	createStateDelta,
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

	// the last delta and its compressed form, so that sharing, QR codes
	// and unchanged history writes never compress the same state twice
	encodedDelta = null
	encodedString = null
	
	constructor(main){
		super(main)

		// pagehide also works with the back/forward cache, unlike unload
		window.addEventListener('pagehide', () => {
			try {
				this.flushLocation()
			} catch (error) {
				// A browser may already have made this document inactive.
				console.warn('Could not update the URL before leaving', error)
			}
		})
	}

	loadFromLocation(defaultState=null, dispatchEvent=false){
		const state = super.loadFromLocation(defaultState, dispatchEvent)
		// rewrite readable and legacy links in the compact form
		if (this.saveHistory) this.updateLocation(true)
		return state
	}

	toURLSafeBase64(base64String){
		return toURLSafeBase64(base64String)
	}

	fromURLSafeBase64(base64String){
		return fromURLSafeBase64(base64String)
	}

	/**
	 * Convert to String any legacy zip compressed data
	 * @param {String|Array|Uint8Array} compressed 
	 * @returns {String}
	 */
	uncompressString(compressed){
		return uncompressQueryString(compressed)
	}

	/**
	 * Zip a string as a legacy url safe base64 string
	 * @param {String} string 
	 * @param {Object} zipOptions 
	 * @returns {String} zip data
	 */
	compressString(string, zipOptions=DEFAULT_ZIP_OPTIONS){
		if (zipOptions.base64 === false)
		{
			throw new Error('StateWithIO only supports base64 encoded compressed query strings')
		}
		return compressQueryString(string, { ...DEFAULT_ZIP_OPTIONS, ...zipOptions })
	}

	/**
	 * Export the current state as a versioned link value
	 * @returns {String}
	 */
	createEncodedString(){
		const delta = createStateDelta(this.state)
		if (delta !== this.encodedDelta)
		{
			this.encodedString = compressStateDelta(delta)
			this.encodedDelta = delta
		}
		return this.encodedString
	}

	createEncodedURL(baseURL=this.url ?? window.location.href){
		const url = new URL(baseURL)
		url.search = ''
		url.searchParams.set(STATE_QUERY_PARAM, this.createEncodedString())
		url.hash = this.getPreservedHash()
		return url.toString()
	}

	createLocationURL(){
		return this.createEncodedURL()
	}
}
