import {canFullscreen, exitFullscreen,goFullscreen,setFullScreenButtonState,toggleFullScreen} from './full-screen'
import {getShareLink} from '../utils/location-handler'
import {formattedDate} from '../models/info'
import {setToggle} from './toggle'
import { connectSelect } from './select'

const doc = document

export let buttonQuantise
export let buttonVideo
export let controlPanel

const main = doc.querySelector("main")

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

export const video = doc.querySelector("video")
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

	// test to see if sharing is possible (on Electron it doesnt work as expected)
	const buttonShare = doc.getElementById("button-share")
	const shareElement = doc.querySelector("share-menu")
	shareElement.url = getShareLink( options )
	buttonShare.addEventListener('click', e => {
		shareElement.setAttribute( "url", getShareLink( options ) )
		//console.error("SHARING", {shareElement, url:shareElement.url  } )
	}, false)


	// const title = doc.getElementById("title")
	controlPanel = doc.getElementById("control-panel")

	// buttonInstrument = doc.getElementById("button-instrument")
	buttonVideo = doc.getElementById("button-video")
	// t.lkgCanvas.addEventListener("dblclick", event =>{

	// buttonRecord = doc.getElementById("button-record-audio")
	buttonQuantise = doc.getElementById("button-quantise")
	//buttonPhotograph = doc.getElementById("button-photograph")
	
	if ( canFullscreen() )
	{
		const toggleBetweenScreen = () => {
			const isFullscreen = toggleFullScreen()
			options.fullscreen = isFullscreen
			//console.log("fullscreen", options.fullscreen)
			//setToast("Metronome " + (ui.metronome ? 'enabled' : 'disabled')  )
		}

		//also pass this inott a flip flopper
		const buttonFullscreen = setToggle( "button-fullscreen", toggleBetweenScreen, false )
		buttonVideo.addEventListener("dblclick", toggleBetweenScreen)
	
		document.addEventListener("fullscreenchange", async (event) => {		
			const isFullscreen = await setFullScreenButtonState(buttonFullscreen)
			options.fullscreen = isFullscreen
			console.info("full screen change!", isFullscreen)	
		})
	
	}else{
		// no full screen mode available so hide the full screen button
		doc.getElementById( "button-fullscreen").setAttribute("hidden", true)
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