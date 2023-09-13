import {canFullscreen, exitFullscreen,goFullscreen,toggleFullScreen} from './full-screen'
import {getShareLink} from '../location-handler'
import {formattedDate} from '../models/info'
import {setToggle} from './toggle'
import { connectSelect } from './select'


const doc = document
// const { getElementById, querySelector } = document

export let buttonQuantise
export let buttonVideo
export let controlPanel

const main = doc.querySelector("main")

export const video = doc.querySelector("video")

/**
 * is the element currently visible?
 * @param {HTMLElement} element to toggle the visibility of
 * @return {Boolean} visibility state of the element 
 */
export const isVisible = (element) => {
	return element.style.visibility !== "hidden" 
}
/**
 * show or hide an element depending on the provided value
 * @param {HTMLElement} element to toggle the visibility of
 * @param {Boolean} visisble value to set visibility to
 * @return {Boolean} is now visible 
 */
export const setVisibility = (element, visisble) => {
	element.style.visibility = !visisble ? "visible" : "hidden"
	return isVisible(element)
}
/**
 * toggle an element's visibility to the opposite of it's current state
 * @param {HTMLElement} element to toggle the visibility of
 * @return {Boolean} is now visible 
 */
export const toggleVisibility = element => {
	const isVisisble = isVisible(element)
	setVisibility(element, !isVisisble)
	return isVisible(element)
}


/**
 * is the video element currently visible on the screen?
 * @return {Boolean} visibility of video
 */
export const isVideoVisible = () => isVisible(video) 

/**
 * show or hide the video element
 * @param {Boolean} value to set the visibility to
 */
export const toggleVideoVisiblity = value => {
	const currentlyVisible = setVisibility(video, value ? value : !isVideoVisible())
	console.error("toggling video vis", {value, currentlyVisible})
}


/**
 * add a html fragment to a specific person's control panel
 * @param {HTMLElement} fragment as a quantity of beats per measure
 * @param {String} personName as a quantity of beats per measure
 */
export const setControls = (fragment, personName='person-a-controls') => {
	
	const personControl = doc.getElementById(personName)

	// add to dom or replace existing????
	personControl.appendChild( fragment )

	// bind mouse events here???
}

/**
 * Add a select with all available cameras as a dropdown
 * @param {Array} cameras Collection of hardware cameras
 * @param {Function} callback Mehod to trigger when camera selected
 * @returns {Boolean} true if the user hit duet
 */
export const setupCameraForm = (cameras, callback) => {
	
	const cameraForm = doc.getElementById("camera")
	const select = cameraForm.querySelector('#camera select')

	// loop through cameras and add to list
	const optionElements = cameras.map( (camera, index) => `<option value="${camera.deviceId}">${camera.label}</option>` )
			
	// we only inject into the select field
	select.innerHTML = `<optgroup label="Detected Cameras">${optionElements.join('')}</optgroup>`
	connectSelect( select, callback )
}
/**
 * Create the markup required for one instrument
 *  
 * @param {*} folder 
 * @param {*} instrumentName 
 * @returns 
 */
const createInstumentForForm = 
	( folder, instrumentName ) => 
		`<li><label for="${folder}">${instrumentName}<input id="${folder}" name="instrument-selector" type="radio" value="${folder}"></input></label></li>`
const createInstumentFamilyForForm = 
	( family, instruments ) => 
		`<details open>
			<summary>${family}</summary>
			<menu>${uiOptions.join('')}</menu>
		</details>`

/**
 * Setup the instrument list
 * @param {Function} callback Method to trigger when instument selected
 */
export const setupInstrumentForm = (instruments, packName='') => {

	let output = `<legend>${packName} Select an instrument</legend>`
	let family = instruments[0].family
	const uiOptions = []// instruments.map( (instrument, index) => createInstumentForForm( instrument.location, instrument.name ) ) 
	// add a title at the start...
	// uiOptions.unshift("<legend>Select an instrument</legend>")

	output += `<details open id="instrument-family-${family}"><summary>${family}</summary><menu>`

	// now group them into families...
	instruments.forEach( (instrument, index) => {
		
		const form = createInstumentForForm( instrument.location, instrument.name )
		output += form
		if (family !== instrument.family)
		{
		
			family = instrument.family
			output += `</menu></details>`
			output += `<details open id="instrument-family-${family}"><summary>${family}</summary><menu>`
		}
	})
	output += `</menu></details>`
	return output
}

/**
 * Update the BPM on screen
 * @param {Number} tempo as a quantity of beats per measure
 */
export const updateTempo = tempo =>{
	const b = doc.getElementById('input-tempo')
	if (b)
	{
		b.setAttribute("value", tempo)
	}
	console.log("Setting tempo", tempo)
}

/**
 * DOM elements on main app screen
 * @param {Object} options Configuration object
 */
export const setupInterface = ( options ) => {
	const h1 = doc.querySelector("h1")
	
	const buttonShare = doc.getElementById("share")
	// const buttonSolo = doc.getElementById("button-solo")
	// const buttonDuet = doc.getElementById("button-duet")
	// const title = doc.getElementById("title")
	
	const shareElement = doc.querySelector("share-menu")
	shareElement.url = getShareLink( options )
	buttonShare.addEventListener('click', e => {
		shareElement.setAttribute( "url", getShareLink( options ) )
		//console.error("SHARING", {shareElement, url:shareElement.url  } )
	}, false)
	
	controlPanel = doc.getElementById("control-panel")

	// buttonInstrument = doc.getElementById("button-instrument")

	buttonVideo = doc.getElementById("button-video")
	// buttonRecord = doc.getElementById("button-record-audio")
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

	// prevent the form from changing the url	
	controlPanel.addEventListener("submit", (event) => {
		event.preventDefault()
		// removes the ?
        //window.history.back()
	}, true)
}

/**
 * For accessibility, once the app has loaded we try and put the
 * user in the right place so that they can begin
 */
export const focusApp = ()=>{ 
	
}



// showPersonalControlPanel( this.name, this.controls, this.instrumentName ) 
export const showPersonalControlPanel = (playerName, controls, instrumentName) => {
	
	const isCurrentlyOpen = controls.classList.contains("showing",true)
	// find active input field and focus
	const active = document.getElementById(instrumentName)
	if (active)
	{
		active.focus()
	}else{
		// send focus to form?
		controls.focus()
	}

	console.log("SHOW Form", {active, isCurrentlyOpen})
	// FIXME: Add aria-roles
	controls.classList.toggle("showing",true)
	document.documentElement.classList.toggle(`${playerName}-sidebar-showing`,true)

	return true
}

export const hidePersonalControlPanel = (playerName, controls) => {
	console.log("HIDE Form")
	
	//const inputs = this.controls.querySelectorAll('input')
	//inputs.forEach( input => input.removeEventListener('change',  this.onInstrumentInput))
	//this.controls.innerHTML = ''
	controls.classList.toggle("showing",false)
	document.documentElement.classList.toggle(`${playerName}-sidebar-showing`,false)
	// setTimeout( ()=> this.controls.classList.toggle("showing",false), 303 )	

	return false
}