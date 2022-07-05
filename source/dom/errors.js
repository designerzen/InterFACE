
import { showReloadButton } from '../dom/button'

export const showError = (error, solution, fatal=false) => {
 
	const body = document.documentElement
	body.classList.add("failure")
	body.classList.remove("loading")

	document.getElementById("feedback").appendChild( showReloadButton(true) )
			
	console.error("Could not load", error )
	console.warn( "Consider:", solution )
 
	// play lemmings sound effect...
	let audio = new Audio()
	audio.src = "/assets/audio/lemmings.wav"
	audio.play()
	// if fatal then we can't continue so show reload button?
}