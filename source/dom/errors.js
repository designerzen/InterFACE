
import { createReloadButton } from '../dom/button'

export const showError = (error, solution, fatal=false) => {
 
	const body = document.documentElement

	body.classList.add("failure")
	body.classList.remove("loading")

	// TODO: show the error messages on screen in a dialog
	const dialog = document.getElementById("errors")
	dialog.open = true
	
	if (fatal)
	{
		// if fatal then we can't continue so show reload button?	
		// add a reload button to the feedback node
		// const form = dialog.querySelector("form")
		// form.appendChild( showReloadButton(true) )

		// remove existing button
		
		// play audio files located...
		// lemmings sound effect sounds best
		const audioElement = dialog.querySelector("audio")
		audioElement.setAttribute("autoplay", true)
		audioElement.setAttribute("start", true)

	}

	dialog.classList.toggle("fatal", fatal)
	// no point closing the error
	dialog.querySelector("button.close").hidden = fatal

	document.getElementById("error-details").innerText = error
		
	console.error("Could not load", {fatal}, error )
	console.warn( "Consider:", solution )
}