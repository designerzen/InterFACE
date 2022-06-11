import { addTooltip } from './text'
import { VERSION } from '../version'
import {formattedDate} from '../models/info'

export const setButton = (buttonName, callback ) => {
	const element = document.getElementById(buttonName)
	// check to see that the button hasn't got the display:none!
	if (element)
	{
		// element.addEventListener("click", (event) => {
		// click was too unresponsive so lets use touch / mousedown
		element.addEventListener("mousedown", (event) => {
			callback && callback({element})
		})
		return element
	}
	
	return false
}

/**
 * Create a clickable button with label and tooltip
 * @param {String} label 
 * @param {String} tip 
 * @param {String} classes 
 */
const createButton = (label, tip, classes='' ) => {
	const button = document.createElement('button')
	button.classList.add(classes)
	button.setAttribute("type", "button" )
	button.setAttribute("aria-label", tip )
	button.innerHTML = label
	addTooltip(button)
	return button
}

/**
 * For when an update has taken or a failure has occurred
 * this simply adds a CTA with a reload button
 */
export const showReloadButton = (reset) => {
	const button = createButton("Try again! Reload and reset", "Reload this application!", "reload-app" )
	button.addEventListener( "click", event => {
		// remove any potential options that could cause issue?
		if (reset){
			history.replaceState( null, null, "?" )
		}
		window.location.reload() 
	})
	button.id = "button-reload"
	return button
}

export const createInstallButton = (manifestData) => {
	// show install button or update button???
	const tip = `Click to install ${manifestData.short_name} V-${VERSION.replaceAll(".","-")}<br>Date:${formattedDate}`
	const button = createButton("Install", tip, "install-app" )
	button.id = "button-install"
	button.style.setProperty("--logo",`url(${ manifestData.icons[0].src })`)
	return button
}

////////////////////////////////////////////////////////////////////
// TODO: This is rubbish, what was I thinking?
////////////////////////////////////////////////////////////////////
export const showUpdateButton = (domElement, action) => {
	const button = createButton("Update", `Update to new version`, "update-available" )
	button.id = "button-update"
	button.addEventListener('click', ()=>action() )
	// reveal update button?
	//domElement.appendChild(button)
}

////////////////////////////////////////////////////////////////////
// a simple midi buttnon with states
// just set the state with the return
////////////////////////////////////////////////////////////////////
export const setupMIDIButton = (buttonMIDI, callback) => {
	
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