import {INSTRUMENT_NAMES, INSTRUMENT_FOLDERS} from './instruments'

let buttonInstrument
export let buttonVideo
let buttonRecord

import PALETTE from "./palette"

export const setupInterface = ( options ) => {
	// populate form elements
		
	// populate ui
	const uiOptions = INSTRUMENT_FOLDERS.map( (folder, index) => `<label for="${folder}">${INSTRUMENT_NAMES[index]}</label><input id="${folder}" name="instrument-selector" type="radio" value="${folder}"></input>` ) 
	
	// const uiOptions = INSTRUMENT_FOLDERS.map( folder => `<option value="${folder}">${folder}</option>` ) 
	const uiSelect = `${uiOptions.join('')}`

	const controls = document.getElementById("controls")

	buttonInstrument = document.getElementById("button-instrument")
	buttonVideo = document.getElementById("button-video")
	buttonRecord = document.getElementById("button-record")

	// append duet
	const h1 = document.querySelector("h1")
	h1.innerHTML += `${options.duet ? ' duet' : ''}`

	// metronome
	const metronome = ''

	// const fragment = document.createDocumentFragment() 
	// fragment.appendChild(document.createElement('fieldset'))
	const fragment = document.createElement('fieldset')
	fragment.innerHTML = uiSelect
	// add to dom
	controls.appendChild( fragment )

	// prevent the form from changing the url
	controls.addEventListener("submit", (event) => {
		event.preventDefault()
		// removes the ?
        //window.history.back()
	}, true)
	

	// console.error("Creating UI", {controls, fragment, uiOptions, uiSelect })
}

// updates the text on screen
// here we take an element and return a method to set it
export const bindTextElement = (element, rate=200, clearAfter=-1) => {
	
	let cachedMessage = null
	let interval = -1
	let clearInterval = -1

	const db = debounce((message)=>{
		element.innerHTML = message
	}, rate)

	const clear = debounce(()=>{
		element.innerHTML = ''
	}, clearAfter > -1 ? clearAfter : 0 )
	
	return element ? (message, responseRate=rate ) => {
		// debounce and only change if var has
		if (cachedMessage != message)
		{
			// prevent it blanking from previous request
			clearTimeout(clearInterval)

			cachedMessage = message
			if (responseRate === 0)
			{
				// instant overwrite
				clearTimeout(interval)
				element.innerHTML = message
			}else{
				// change it after debounce timeout to prevent flooding
				interval = db(message)				
			}
			// clear after wards unless intercepted...
			if (clearAfter > 0)
			{
				clearInterval = clear()
			}
		}
	} : null
}



// utils ----

function debounce(callback, wait) {
	let timerId
	return (...args) => {
		//console.error(args, "debounce", arguments)
	  clearTimeout(timerId)
	  timerId = setTimeout(() => callback(...args), wait)
	  return timerId
	}
}



// Feedback ui
export const setFeedback = bindTextElement( document.getElementById("feedback"), 20 )
export const setToast = bindTextElement( document.getElementById("toast"), 20, 2000 )
