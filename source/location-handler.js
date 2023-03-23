/**
 * Convert a URL query value into a JS data type by inferring the type
 * @param {Any} JavaScript data type (eg. String, Number, Boolean, Array, Object)
 */
const guessType = value => {

	if (typeof value === "string")
	{
		const lower = value.toLowerCase()
		// check for bool and such
		if (lower === "true" || lower === "1") {
			return true
		} else if (lower === "false"|| lower === "0") {
			return false
		}

		return value

	}else if (Array.isArray(value)){
		// Array convert the array to a string?
		// convert booleans from 1 / 0 ?
		return value.toString()

    } else {

		return data
	}
}

/**
 *  Convert a string into a JS data type by inferring the type
 * @param {Any} JavaScript data type (eg. String, Number, Boolean, Array, Object)
 */
export const parseType = value => {

	// check to see if the string is also an array...
	if (typeof value === "string")
	{
		if (!isNaN(parseFloat(value))) {
			return parseFloat(value)
		} else if (value.toLowerCase() === "true") {
			return true
		} else if (value === "false") {
			return false
		}else if (value.indexOf(',') >= 0){
			// this is a comma seperated list array...
			return convertIntegerArrayToBooleans( value.split(",") )
		} else {
			return value
		}

	}else if (Array.isArray(value)){
		// Array convert the array to a string?
		// convert booleans from 1 / 0 ?
		return value.toString()
    } else {
		// God only knows
        return value
    }
}

/**
 *  Fetch the current URL query as an object
 * @returns {URLSearchParams} URL States
 */
 const fetchStateFromURL = () => {
	return new URLSearchParams(window.location.search)
}

/**
 * This takes a snapshot of the url and takes and queries
 * then it will take apart and create an object
 * and return a merged subset
 * @returns {Object} URL State Object 
 */
export const getLocationSettings = (defaultOptions) => {{
	const urlParams = fetchStateFromURL()
	const locationOptions = Object.assign( {}, defaultOptions )
	for (const [key, value] of urlParams) 
	{
		// NB. ensure we data type these
		locationOptions[key] = guessType(value)	
		// console.log(`${key}:${value}`)
	}
	//console.log(`query:${locationOptions}`)
	return locationOptions
}}

/**
 * This takes a state and creates a URL query string
 * @returns {String} Query String with current state
 */
export const createQueryString = options => {
	return new URLSearchParams(options).toString()
}

/**
 * This takes a snapshot of the url and queries
 * then it will take apart and create an object
 * and return a merged subset
 * @returns {String} URL with current state
 */
 export const getShareLink = (options) => {
	return window.location + createQueryString(options)
}

/**
 * This attempts to determine where the user came from
 * and to create class names that can create custom versions
 * so long as they maintin their urls (ie. not use shortlinks)
 * @returns {String} Refering URL
 */
export const getReferer = () => {
	const ref = document.referrer
	// check against our list
	return ref || document.location || 'interface.place'
}

/**
 * This attempts to determine which domain the user came from
 * @returns {String} Refering hostname
 */
export const getRefererHostname = () => {
	const referrer = new URL( getReferer() )
	// now strip out everything but the location
	// check against our list
	return referrer.hostname
}

/**
 * 
 * @returns {Array<String>} location path
 */
export const getEditionFromURL = () => {
	const domain = new URL( document.location )
	return domain.pathname.replace("/","").split("/")
}

/**
 * Reload the current page with the current state or
 * optionally a new state to be merged
 * @param {Object} options New state to set on reload
 */
export const refresh = options => {
	if (options){
		addToHistory(options)
	}
	window.location.reload()
}

/**
 * Reloads current page in secure mode (as cameras need a certificate)
 */
 export const forceSecure = (debug=false) => {
	if (!debug && location.hostname !== "localhost" && location.protocol !== 'https:')
	{
		location.protocol = 'https:'
	}
	return false
}

/**
 * Changes options in the URL so that state survives refreshes
 * @param {Object} options New state to set on location
 * @param {String} title Optional history title
 */
export const addToHistory = (options, title="") => {
	const url = new URL(window.location)
	for (let i in options){
		const option = options[i]
		url.searchParams.set(i, option)
		//console.log("History", {out, options, title, url} )
	}
	//
	const out = window.history.pushState(options, title, url)
	//console.log("History", {out, options, title, url} )
}