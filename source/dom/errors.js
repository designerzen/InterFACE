import { createReloadButton } from '../dom/button'

export const showError = (error, solution, fatal=false, details="" ) => {
 
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

		// add root class
		body.classList.add("fatal")
	}

	// no point closing the error if fatal
	dialog.classList.toggle("fatal", fatal)
	dialog.querySelector("button.close").hidden = fatal

	document.getElementById("error-message").innerText = error
	document.getElementById("error-solution").innerText = solution ?? "Please refresh the browser or try a different one such as Google's Chrome."
	
	const errorDetailsElement = document.getElementById("error-details")
	if (details.length > 0)
	{
		errorDetailsElement.parentElement.hidden = false
		errorDetailsElement.textContent = details
	}else{
		errorDetailsElement.parentElement.hidden = true
	}
		
	console.error("Could not load", {fatal}, error )
	console.warn( "Consider:", solution )
}