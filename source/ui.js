import {INSTRUMENT_NAMES, INSTRUMENT_FOLDERS} from './instruments'
import {VERSION} from './version'
import {debounce} from './utils'
import {canFullscreen, exitFullscreen,goFullscreen,toggleFullScreen} from './full-screen'
import {loadSoloMode,loadDuetMode} from './location-handler'

export const progressBar = document.querySelector('progress')

let buttonInstrument
let buttonRecord

export let buttonQuantise
export let buttonMIDI
export let buttonVideo
export let controls

import PALETTE from "./palette"

// updates the text on screen
// here we take an element and return a method to set it
export const bindTextElement = (element, rate=700, clearAfter=0, split=false) => {
	
	let cachedMessage = null
	let interval = -1
	let clearInterval = -1
	let currentMessage = null
	
	const db = debounce((message)=>{
		element.innerHTML = message
	}, rate)

	const clear = (rate) => {
		clearInterval = setTimeout(()=>{
			element.innerHTML = ''
		}, clearAfter * rate)
	}
	
	return element ? (message, responseRate=rate ) => {

		if (split)
		{
			message = message.split(/!|\./i).join("<br>")
		}

		currentMessage = message
		// debounce and only change if var has
		if (element.innerHTML === '' || cachedMessage != message)
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
				clearInterval = clear(message.length)
			}
		}
	} : null
}

// Feedback ui
export const setFeedback = bindTextElement( document.getElementById("feedback"), 20 )
export const setToast = bindTextElement( document.getElementById("toast"), 20, 900, true )

export const setControls = fragment => {
	
	const personControl = document.getElementById('person-a-controls')

	// add to dom or replace existing????
	personControl.appendChild( fragment )

	// bind mouse events here???
}

export const setupCameraForm = (cameras, callback) => {
	
	const cameraForm = document.getElementById("camera")
	const select = cameraForm.querySelector('select')

	// loop through cameras and add to list
	const optionElements = cameras.map( (camera, index) => {
		// now add this to the fragment
		return `<option value="${camera.deviceId}">${camera.label}</option>`
	})
			
	// we only inject into the select field
	select.innerHTML = optionElements.join('')

	// now add the interaction
	select.addEventListener( 'change', event=>{
		
		const selection = select.options.selectedIndex
		// send out the device change to the callback...
		callback & callback( cameras[selection] )
		console.error( "cameraForm input", {event, select, selection} ) 
	})
}

// Setup the instrument list - connect to callback?
export const setupInstrumentForm = callback => {
	
	// populate ui	
	const uiOptions = INSTRUMENT_FOLDERS.map( (folder, index) => `<label for="${folder}">${INSTRUMENT_NAMES[index]}<input id="${folder}" name="instrument-selector" type="radio" value="${folder}"></input></label>` ) 
	
	// bind mouse events too???

	// const uiOptions = INSTRUMENT_FOLDERS.map( folder => `<option value="${folder}">${folder}</option>` ) 
	return `${uiOptions.join('')}`
}

// a simple midi buttnon with states
// just set the state with the return
export const setupMIDIButton = (callback) => {
	let midiEnabled = false
	const onStartRequested = async (event) => {
		event.preventDefault()
		callback && callback()
		midiEnabled = true
		//buttonMIDI.removeEventListener('mousedown', onStartRequested)
		return false
	}
	buttonMIDI.addEventListener('mousedown', onStartRequested, { once: true })
	return {
		setText:text=>buttonMIDI.innerHTML = test
	}
}

export const addTooltip = button =>  button.addEventListener("mouseover", event => {
	const toolTip = event.target.getAttribute("aria-label") || event.target.innerHTML
	setToast(toolTip)
	console.log("event", event.target.innerHTML )
})

export const setButton = (buttonName, callback ) => {
	const element = document.getElementById(buttonName)
	element.addEventListener("click", (event) => {
		callback && callback({element})
	})

	return element
}

// this allows checkbox use where the variable is changed
export const setToggle = (toggleName, callback, value ) => {
	
	const element = setButton( toggleName, ()=>{
		value = !value
		// add classes to any associated wrapped label
		if (element.parentNode.nodeName === "LABEL")
		{
			element.parentNode.classList.toggle("checked", value )
		}
		console.log(toggleName,element, element.parentNode.nodeName)
		callback(value)
	})
	// preset the button
	if (value)
	{
		// goto parent and add checked classes?
		element.setAttribute('checked', value)
		element.parentNode.classList.toggle("checked", value )
	}
	return element
}

export const showReloadButton = () => {

}


// DOM elements
export const setupInterface = ( options ) => {

	const main = document.querySelector("main")
	const h1 = document.querySelector("h1")
	
	const buttonSolo = document.getElementById("button-solo")
	const buttonDuet = document.getElementById("button-duet")
	
	controls = document.getElementById("controls")

	buttonInstrument = document.getElementById("button-instrument")
	buttonVideo = document.getElementById("button-video")
	buttonRecord = document.getElementById("button-record")
	buttonMIDI = document.getElementById("button-midi")
	buttonQuantise = document.getElementById("button-quantise")
	
	if ( canFullscreen() )
	{
		//also pass this inott a flip flopper
		const buttonFullscreen = setToggle( "button-fullscreen", status =>{
			options.fullscreen = toggleFullScreen()
			buttonFullscreen.classList.toggle("fs", options.fullscreen)
			console.log("fullscreen", options.fullscreen)
			//setToast("Metronome " + (ui.metronome ? 'enabled' : 'disabled')  )
		}, false )
	
	}else{
		// no full screen mode available so hide the full screen button
		document.getElementById( "button-fullscreen").classList.toggle("hide", true)
	}
	
	// if we are in solo mode
	if (!options.duet)
	{
		buttonSolo.classList.toggle( "hide", true)
		buttonDuet.classList.toggle( "hide", false)
		main.classList.add("solo")
		buttonSolo.addEventListener( "click", event => loadDuetMode, false)

	}else{
		
		// append duet mode styles
		h1.innerHTML += ' duet' 
		buttonDuet.classList.toggle( "hide", true)
		buttonSolo.classList.toggle( "hide", false)
		main.classList.add("duet")
		buttonDuet.addEventListener( "click", event => loadSoloMode, false)
	}
	
	// do a query here to catch all buttons?
	const buttons = controls.querySelectorAll("button, label")
	
	// const fragment = document.createDocumentFragment() 
	// fragment.appendChild(document.createElement('fieldset'))
	// const fragment = document.createElement('fieldset')
	// fragment.innerHTML = setupInstrumentForm()
	// // add to dom
	// controls.appendChild( fragment )

	// intercept any hover events...
	buttons.forEach( button => addTooltip(button) )

	// prevent the form from changing the url	
	controls.addEventListener("submit", (event) => {
		event.preventDefault()
		// removes the ?
        //window.history.back()
	}, true)
}