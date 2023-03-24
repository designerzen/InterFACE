
import { showReloadButton } from '../dom/button'

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
		document.getElementById("feedback").appendChild( showReloadButton(true) )
		
		// play lemmings sound effect...
		const audio = new Audio()
		audio.src = "/assets/audio/lemmings.wav"
		audio.play()
	}

	document.getElementById("error-details").innerText = error
		
	console.error("Could not load", {fatal}, error )
	console.warn( "Consider:", solution )
}