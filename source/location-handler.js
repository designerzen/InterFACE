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
		if (value.toLowerCase() === "true") {
			return true
		} else if (value === "false") {
			return false
		}else if (value.indexOf(',') >= 0){
			// this is a comma seperated list array...
			
			return convertIntegerArrayToBooleans( value.split(",") )

		} else if (!isNaN(parseFloat(value))) {
			// Number / Int
			return parseFloat(value)
		} else{
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

export const refresh = options => {
	// save to url?
	window.location.reload()
}