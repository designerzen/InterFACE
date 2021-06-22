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


// convert string to rudimentary types
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

// this takes a snapshot of the url and takes and queries
// then it will take apart and create an object
// and return a merged subset
export const getLocationSettings = (defaultOptions) => {{
	const locationOptions = Object.assign( {}, defaultOptions )
	const urlParams = new URLSearchParams(window.location.search)
	for (const [key, value] of urlParams) 
	{
	//	console.log(`${key}:${value}`)
		// ensure we data type these
		locationOptions[key] = guessType(value)
	}

	//console.log(`query:${locationOptions}`)
	return locationOptions
}}

export const forceSecure = (debug=false) => {
	
	// ESCAPE: before doing anything, let us check the bare minimum...
	// is https()
	if (!debug && location.hostname !== "localhost" && location.protocol !== 'https:')
	{
		location.protocol = 'https:'
		
		// isLoading = false
		// ultimateFailure = true
		// setToast("Redirecting to a secure site, please stand by!")
		// // show link or just try and force a redirect?
		
		// setTimeout(()=> location.replace(`https:${location.href.substring(location.protocol.length)}`), 50 )
		// // EXIT HERE
		// return
	}
}

// reload the exact same URL but wih duet=true enabled
export const loadDuetMode = ()=> {
	// grab existing...
	const urlParams = new URLSearchParams(window.location.search)
	urlParams.duet = true
	//window.location = url
}

export const loadSoloMode = ()=> {
	const urlParams = new URLSearchParams(window.location.search)
	urlParams.duet = false
	//window.location = url
}

// This attempts to determine where the user came from
// and to create class names that can create custom versions
// so long as they maintin their urls (ie. not use shortlinks)

export const getReferer = () => {
	// save to url?
	const ref = document.referrer
	// check against our list
	return ref || document.location || 'interface.place'
}
export const getRefererHostname = () => {
	// save to url?
	const referrer = new URL( getReferer() )
	// now strip out everything but the location
	// check against our list
	return referrer.hostname
}


export const refresh = options => {
	// save to url?
	window.location.reload()
}

export const toQuery = options =>  (new URLSearchParams(options).toString())

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
export const getShareLink = (options) => {
	
	return window.location + toQuery(options)
}