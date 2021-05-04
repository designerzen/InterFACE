import {INSTRUMENT_NAMES, INSTRUMENT_FOLDERS} from './audio/instruments'
import {VERSION, DATE} from './version'
import {debounce} from './utils'
import {canFullscreen, exitFullscreen,goFullscreen,toggleFullScreen} from './full-screen'
import {getShareLink,loadSoloMode,loadDuetMode} from './location-handler'


const releaseDate = new Date(DATE)
const dateOptions = {
	hour12 : true,
	hour:  "numeric",
	minute:  "numeric",
 }
export const formattedDate = `${releaseDate.getDate()}/${releaseDate.getMonth()+1}/${releaseDate.getFullYear()} ${ releaseDate.toLocaleTimeString("en-GB",dateOptions) }`

const doc = document

let loadMeter = 0
const progressMessage = doc.getElementById("progress-bar")
const progressBar = doc.querySelector('progress')
export const setLoadProgress = (progress, message) => {
	loadMeter = progress
	progressBar.setAttribute("value", parseInt(progress) )
	if (message && message.length)
	{
		progressMessage.innerHTML = message
	}
}
export const getLoadProgress = () => loadMeter

let buttonInstrument
let buttonRecord

export let buttonQuantise
export let buttonMIDI
export let buttonVideo
export let controls

import PALETTE from "./palette"

const main = doc.querySelector("main")
	
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
		const after = clearAfter * rate
		clearInterval = setTimeout(()=>{
			element.innerHTML = ''
		}, after)
		return after
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

export const toggleVisibility = element => {
	const isVisisble = element.style.visibility !== "hidden"
	element.style.visibility = !isVisisble ? "visible" : "hidden"
	return !isVisisble
}
export const video = doc.querySelector("video")
export const isVideoVisible = () => video.style.visibility === "hidden" 
export const toggleVideoVisiblity = value => {
	const currentlyVisible = isVideoVisible()
	console.error("toggling video vis", {value, currentlyVisible})
	video.style.visibility = currentlyVisible ? "visible" : "hidden", !currentlyVisible 
}

// Feedback ui
export const setFeedback = bindTextElement( doc.getElementById("feedback"), 20 )
export const setToast = bindTextElement( doc.getElementById("toast"), 20, 900, true )

export const setControls = fragment => {
	
	const personControl = doc.getElementById('person-a-controls')

	// add to dom or replace existing????
	personControl.appendChild( fragment )

	// bind mouse events here???
}

export const setupCameraForm = (cameras, callback) => {
	
	const cameraForm = doc.getElementById("camera")
	const select = cameraForm.querySelector('select')

	// loop through cameras and add to list
	const optionElements = cameras.map( (camera, index) => {
		// now add this to the fragment
		return `<option value="${camera.deviceId}">${camera.label}</option>`
	})
			
	// we only inject into the select field
	select.innerHTML = `<optgroup label="Detected Cameras">${optionElements.join('')}</optgroup>`

	// now add the interaction
	select.addEventListener( 'change', event=>{
		
		const selection = select.options.selectedIndex
		// send out the device change to the callback...
		callback & callback( cameras[selection] )
		//console.error( "cameraForm input", {event, select, selection} ) 
	})
}

// Setup the instrument list - connect to callback?
export const setupInstrumentForm = callback => {
	
	// populate ui	
	const uiOptions = INSTRUMENT_FOLDERS.map( (folder, index) => `<label for="${folder}">${INSTRUMENT_NAMES[index]}<input id="${folder}" name="instrument-selector" type="radio" value="${folder}"></input></label>` ) 
	
	uiOptions.unshift("<legend>Select an instrument</legend>")

	// bind mouse events too???

	// const uiOptions = INSTRUMENT_FOLDERS.map( folder => `<option value="${folder}">${folder}</option>` ) 
	return `${uiOptions.join('')}`
}

////////////////////////////////////////////////////////////////////
// a simple midi buttnon with states
// just set the state with the return
////////////////////////////////////////////////////////////////////
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
		setText:text=>buttonMIDI.innerHTML = text,
		setLabel:text=>buttonMIDI.setAttribute("aria-label",text)
	}
}

export const addTooltip = element =>  element.addEventListener("mouseover", event => {
	const toolTip = event.target.getAttribute("aria-label") || event.target.innerHTML
	setToast(toolTip)
})

export const setButton = (buttonName, callback ) => {
	const element = doc.getElementById(buttonName)
	element.addEventListener("click", (event) => {
		callback && callback({element})
	})

	return element
}

////////////////////////////////////////////////////////////////////
// this allows checkbox use where the variable is changed
////////////////////////////////////////////////////////////////////
export const setToggle = (toggleName, callback, value ) => {
	
	const element = setButton( toggleName, ()=>{
		value = !value
		// add classes to any associated wrapped label
		if (element.parentNode.nodeName === "LABEL")
		{
			element.parentNode.classList.toggle("checked", value )
		}
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

export const updateTempo = tempo =>{
	const b = doc.getElementById('input-tempo')
	if (b)
	{
		b.setAttribute("value", tempo)
	}
	console.log("Setting tempo", tempo)
}

// console.error(tempo)
export const connectTempoControls = (callback) => {
	const select = doc.getElementById('select-tempo')
	select.addEventListener( 'change', event=>{
		const selection = select.options.selectedIndex
		const option = select.childNodes[selection]
		const tempo = parseInt( option.innerHTML )
		updateTempo(tempo)
		callback && callback (tempo)
	})
}

export const showUpdateButton = (domElement, action) => {
	// reveal update button?
	const button = doc.createElement('button')
	button.id = "button-update"
	button.setAttribute("aria-label", `Update to new version` )
	button.classList.add("update-available")
	button.innerHTML = "Update"

	// on button press...
	button.addEventListener('click', ()=>action() )
	domElement.appendChild(button)
}

////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////
export const addToolTips = (query="button, select, input") => {
	
	// do a query here to catch all buttons?
	const buttons = controls.querySelectorAll(query)
	
	// const fragment = doc.createDocumentFragment() 
	// fragment.appendChild(doc.createElement('fieldset'))
	// const fragment = doc.createElement('fieldset')
	// fragment.innerHTML = setupInstrumentForm()
	// add to dom
	// controls.appendChild( fragment )

	// intercept any hover events...
	buttons.forEach( button => addTooltip(button) )
}

////////////////////////////////////////////////////////////////////
// This is the 2nd screen, just after loading
// returns a true or false for if the user hit duet
////////////////////////////////////////////////////////////////////
export const showPlayerSelector = (options) => new Promise( (resolve,reject)=>{

	const CSS_CLASS = "player-selection"
	const form = doc.getElementById("onboard")
	const panel = doc.getElementById("player-selector")
	const solo = panel.querySelector("#button-solo")
	const duet = panel.querySelector("#button-duet")
	const trio = panel.querySelector("#button-trio")
	const start =  doc.getElementById("button-start")
	const advanced = panel.querySelector("#toggle-advanced-mode")
	let advancedMode = false
	let players = options.duet ? 2 : 1

	// set the query to this stae
	advanced.setAttribute( "checked", !advancedMode )
	
	doc.documentElement.classList.toggle(CSS_CLASS, true)

	const complete = result => {
		
		// if we are in solo mode
		if (result < 2)
		{
			solo.classList.toggle( "hide", true)
			duet.classList.toggle( "hide", false)
			
			main.classList.add("solo")
		
		}else{
			
			duet.classList.toggle( "hide", true)
			solo.classList.toggle( "hide", false)
			
			main.classList.add("duet")
		}

		// start the animation out.
		// NB. This is not superflous as the camera
		// takes a broze age to load into memory
		panel.classList.add("completed")
		doc.documentElement.classList.toggle(CSS_CLASS, true)
			
		// wait for animation to complete
		setTimeout( ()=> {
			//console.log({advancedMode})
			doc.documentElement.classList.toggle('advanced', advancedMode)
			doc.documentElement.classList.toggle(CSS_CLASS, false)
			panel.classList.remove("completed")
		}, 45 )
		
		resolve(result > 1)
	}

	solo.addEventListener("click", event => players = (1) )
	duet.addEventListener("click", event => players = (2) )
	trio.addEventListener("click", event => players = (3) )

	advanced.addEventListener("change", event =>{ 
		advancedMode = !advancedMode 
		main.classList.toggle("beginner", !advancedMode)
	})
	
	// start.addEventListener("click", event => {
	// 	event.preventDefault()
	// 	complete(players)
	// 	return false
	// } , true )
	
	form.addEventListener("submit", (event) => {
		event.preventDefault()
		complete(players)
		return false
	}, true)

	main.classList.toggle("beginner", !advancedMode)
	panel.focus()
})


// DOM elements
export const setupInterface = ( options ) => {
	const h1 = doc.querySelector("h1")
	
	const buttonShare = doc.getElementById("share")
	const buttonSolo = doc.getElementById("button-solo")
	const buttonDuet = doc.getElementById("button-duet")
	const title = doc.getElementById("title")
	
	const shareElement = doc.querySelector("share-menu")
	shareElement.url = getShareLink( options )
	buttonShare.addEventListener('mousedown', e => {
		
		shareElement.setAttribute( "url", getShareLink( options ) )
		console.error("SHARING", {shareElement, url:shareElement.url  } )
	}, false)
	
	controls = doc.getElementById("controls")

	buttonInstrument = doc.getElementById("button-instrument")
	buttonVideo = doc.getElementById("button-video")
	buttonRecord = doc.getElementById("button-record")
	buttonMIDI = doc.getElementById("button-midi")
	buttonQuantise = doc.getElementById("button-quantise")
	//buttonPhotograph = doc.getElementById("button-photograph")
	
	if ( canFullscreen() )
	{
		//also pass this inott a flip flopper
		const buttonFullscreen = setToggle( "button-fullscreen", status =>{
			options.fullscreen = toggleFullScreen()
			buttonFullscreen.classList.toggle("fs", options.fullscreen)
			//console.log("fullscreen", options.fullscreen)
			//setToast("Metronome " + (ui.metronome ? 'enabled' : 'disabled')  )
		}, false )
	
	}else{
		// no full screen mode available so hide the full screen button
		doc.getElementById( "button-fullscreen").classList.toggle("hide", true)
	}

	// if (options.duet){
	// 	h1.innerHTML += ":DUET"
	// }
	
	// title.innerHTML = "The InterFACE is ready, open your mouth to begin"
	// Show the release date on the UI somewhere...
	

	const versionElement = doc.getElementById("version")
	const currentVersion = versionElement.innerHTML
	versionElement.innerHTML = `${currentVersion} <span id="release">${formattedDate}</span>`
	
	// console.log(`InterFACE ${currentVersion} build date : ${formattedDate} `, {DATE, releaseDate})
	// buttonSolo.addEventListener( "click", event => loadDuetMode, false)
	// buttonDuet.addEventListener( "click", event => loadSoloMode, false)

	// prevent the form from changing the url	
	controls.addEventListener("submit", (event) => {
		event.preventDefault()
		// removes the ?
        //window.history.back()
	}, true)

	connectTempoControls()
}

////////////////////////////////////////////////////////////////////
// For accessibility, once the app has loaded we try and put the
// user in the right place so that they can begin
////////////////////////////////////////////////////////////////////
export const focusApp = ()=>{ 
	
}