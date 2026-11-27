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

export const showErrorCode = (code, { fatal, details='' }={}) => {
	const message = getErrorMessage(code) ?? ERROR_MESSAGES['camera-unavailable']
	const isFatal = code === 'camera-not-found' ? false : (fatal ?? true)
	showError(message.problem, message.solution, isFatal, details, {
		title:message.title,
		primaryAction:message.primaryAction,
		secondaryAction:message.secondaryAction,
		cameraHelp:code.startsWith('camera-') || !getErrorMessage(code),
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

	const audioElement = dialog.querySelector("audio")
	if (audioElement && !dialog.dataset.errorAudioBound) {
		dialog.dataset.errorAudioBound = 'true'
		dialog.addEventListener('close', () => {
			if (typeof audioElement.pause === 'function') {
				audioElement.pause()
			}
			try { audioElement.currentTime = 0 } catch {}
		})
	}

	if (fatal)
	{
		// Keep the error alert audio available with user controls, playing gently
		// only when not muted and reduced motion is not requested.
		if (audioElement) {
			const isMuted = Boolean(audioElement.muted || document.getElementById('button-mute')?.checked)
			const reduceMotion = Boolean(
				body.classList.contains('a11y-reduce-motion') ||
				window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
			)
			audioElement.controls = true
			audioElement.removeAttribute("autoplay")
			audioElement.removeAttribute("start")
			if (!isMuted && !reduceMotion && typeof audioElement.play === 'function') {
				try {
					audioElement.volume = Math.min(Number.isFinite(audioElement.volume) ? audioElement.volume : 1, 0.5)
					audioElement.currentTime = 0
					const playPromise = audioElement.play()
					playPromise?.catch?.(() => {})
				} catch {}
			}
		}

		// add root class
		body.classList.add("fatal")
	}else{
		body.classList.remove("fatal")
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
	const helpButton = dialog.querySelector('.camera-help')
	// camera advice is only relevant when the camera caused the problem
	const showCameraHelp = options.cameraHelp === true
	help.hidden = !showCameraHelp
	helpButton.hidden = !showCameraHelp
	if (!showCameraHelp) help.open = false
	helpButton.onclick = () => {
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
