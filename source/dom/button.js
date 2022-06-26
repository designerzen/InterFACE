import { addTooltip } from './tooltips'
import { VERSION } from '../version'
import {formattedDate} from '../models/info'
import {addMouseTapAndHoldEvents, MOUSE_HELD, MOUSE_HOLDING, MOUSE_TAP} from '../hardware/mouse'

export const setButton = (buttonNameOrElement, callback, eventType="mousedown", preventDefault=false ) => {
	const element = typeof buttonNameOrElement === "string" ? document.getElementById(buttonNameOrElement) : buttonNameOrElement
	// check to see that the button hasn't got the display:none!
	if (element)
	{
		// element.addEventListener("click", (event) => {
		// click was too unresponsive so lets use touch / mousedown
		element.addEventListener(eventType, (event) => {
			if (preventDefault){
				event.preventDefault()
			}
			callback && callback({element, event})
		})
		return element
	}
	
	return null
}

export const setPressureButton = (buttonNameOrElement, tapCallback, holdCallback, holdingCallback ) => {
	const element = typeof buttonNameOrElement === "string" ? document.getElementById(buttonNameOrElement) : buttonNameOrElement
	if (element)
	{
		addMouseTapAndHoldEvents( element )
		element.addEventListener( MOUSE_TAP, event => {
			tapCallback && tapCallback(event)
		} )

		element.addEventListener( MOUSE_HOLDING, event => {
			holdingCallback && holdingCallback(event)
		} )

		element.addEventListener( MOUSE_HELD, event => {
			holdCallback && holdCallback(event)
		} )
		return element
	}
	return null
}



/**
 * Create a clickable button with label and tooltip
 * @param {String} label 
 * @param {String} tip 
 * @param {String} classes 
 */
export const createButton = (label, tip, classes='' ) => {
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