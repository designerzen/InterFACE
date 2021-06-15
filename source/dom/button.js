import { addTooltip } from './text'
import { VERSION } from '../version'
import {formattedDate} from '../models/info'

export const setButton = (buttonName, callback ) => {
	const element = document.getElementById(buttonName)
	// check to see that the button hasn't got the display:none!
	if (element)
	{
		element.addEventListener("click", (event) => {
			callback && callback({element})
		})
		return element
	}
	
	return false
}

export const showReloadButton = () => {

}

export const createInstallButton = (manifestData) => {
	// show install button or update button???
	// reveal update button?
	const tip = `Click to install ${manifestData.short_name} V-${VERSION.replaceAll(".","-")}<br>Date:${formattedDate}`
	const button = document.createElement('button')
	button.id = "button-install"
	button.classList.add("install-app")
	button.setAttribute("aria-label", tip )
	button.style.setProperty("--logo",`url(${ manifestData.icons[0].src })`)
	button.innerHTML = "Install"
	
	addTooltip(button)
	return button
}

////////////////////////////////////////////////////////////////////
// TODO: This is rubbish, what was I thinking?
////////////////////////////////////////////////////////////////////
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