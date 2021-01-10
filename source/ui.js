import {INSTRUMENT_NAMES, INSTRUMENT_FOLDERS} from './instruments'
import {VERSION} from './version'

let buttonInstrument
let buttonRecord
export let buttonVideo
export let controls

import PALETTE from "./palette"

export const setControls = fragment => {
	
	const personControl = document.getElementById('person-a-controls')

	// add to dom or replace existing????
	personControl.appendChild( fragment )

	// bind mouse events here???
}

export const setupCameraForm = (cameras, callback) => {
	
	const cameraForm = document.getElementById("camera")

	// loop through cameras and add to list
	const optionElements = cameras.map( (camera, index) => {
		// now add this to the fragment
		return `<option value="${camera.deviceId}">${camera.label}</option>`
	})

	const dom = `<label id="select-camera-label" for="select-camera">Select a different camera</label>
				<select id="select-camera">${optionElements.join('')}</select>`
	cameraForm.innerHTML = dom

	// now add the interaction
	// const ele = cameraForm.querySelectorAll('option')
	// ele.forEach( input => input.addEventListener('change', event => {
	// 	console.error( "cameraForm input", input )
	// }))
		
	const select = cameraForm.querySelector('select')

	select.addEventListener( 'change', event=>{
		
		const selection = select.options.selectedIndex
		// send out the device change to the callback...
		callback & callback( cameras[selection] )
		
		console.error( "cameraForm input", {event, select, selection} ) 

	})
	console.log("Created camera buttons", {dom, select, opt:select.options })
}

// Setup the instrument list - connect to callback?
export const setupInstrumentForm = callback => {
	
	// populate ui	
	const uiOptions = INSTRUMENT_FOLDERS.map( (folder, index) => `<label for="${folder}">${INSTRUMENT_NAMES[index]}<input id="${folder}" name="instrument-selector" type="radio" value="${folder}"></input></label>` ) 
	
	// bind mouse events too???

	// const uiOptions = INSTRUMENT_FOLDERS.map( folder => `<option value="${folder}">${folder}</option>` ) 
	return `${uiOptions.join('')}`
}

// DOM elements
export const setupInterface = ( options ) => {
	
	// populate form elements
	const versionNode = document.getElementById('version')
	versionNode.innerHTML = `Version ${VERSION}`

	controls = document.getElementById("controls")

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
	// const fragment = document.createElement('fieldset')
	// fragment.innerHTML = setupInstrumentForm()
	// // add to dom
	// controls.appendChild( fragment )

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
