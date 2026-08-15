import { ERROR_INTERFACE, ERROR_MESSAGES } from '../locales/errors.en-GB.js'

export const getErrorMessage = code => ERROR_MESSAGES[code] ?? null

export const getCameraErrorCode = error => {
	switch (error?.name) {
		case 'NotAllowedError':
		case 'SecurityError': return 'camera-permission-denied'
		case 'NotFoundError':
		case 'DevicesNotFoundError': return 'camera-not-found'
		case 'NotReadableError':
		case 'TrackStartError':
		case 'AbortError': return 'camera-in-use'
		default: return 'camera-unavailable'
	}
}

const setText = (id, text) => {
	const element = document.getElementById(id)
	if (element) element.textContent = text
}

export const showErrorCode = (code, { fatal=true, details='' }={}) => {
	const message = getErrorMessage(code) ?? ERROR_MESSAGES['camera-unavailable']
	showError(message.problem, message.solution, fatal, details, {
		title:message.title,
		primaryAction:message.primaryAction,
		secondaryAction:message.secondaryAction,
	})
}

export const showError = (error, solution, fatal=false, details="", options={} ) => {
 
	const body = document.documentElement

	body.classList.add("failure")
	body.classList.remove("loading")

	// TODO: show the error messages on screen in a dialog
	const dialog = document.getElementById("errors")
	if (!dialog.open) {
		if (typeof dialog.showModal === 'function') dialog.showModal()
		else dialog.open = true
	}

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

	setText('error-title', options.title ?? 'Something went wrong')
	setText('error-message', error)
	setText('error-solution', solution ?? 'Try again. If the problem continues, check your device settings.')
	setText('error-primary-label', options.primaryAction ?? 'Try again')
	setText('error-secondary-label', options.secondaryAction ?? ERROR_INTERFACE.cameraHelpLabel)
	setText('error-help-label', ERROR_INTERFACE.cameraHelpLabel)
	setText('error-help-text', ERROR_INTERFACE.cameraHelp)
	setText('error-details-label', ERROR_INTERFACE.detailsLabel)

	dialog.querySelector('.reload-app').onclick = () => window.location.reload()
	const help = document.getElementById('error-help')
	dialog.querySelector('.camera-help').onclick = () => {
		help.open = true
		help.querySelector('summary')?.focus()
	}
	
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
