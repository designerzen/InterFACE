export const withLookingGlassXRCompatibility = async callback => {
	const target = globalThis
	const descriptor = Object.getOwnPropertyDescriptor(target, "XRWebGLBinding")

	if (!descriptor)
	{
		return await callback()
	}

	try{
		Object.defineProperty(target, "XRWebGLBinding", {
			configurable: true,
			writable: true,
			value: undefined
		})
	}catch(error){
		console.warn("Looking Glass XR compatibility could not hide XRWebGLBinding", error)
	}

	try{
		return await callback()
	}finally{
		try{
			Object.defineProperty(target, "XRWebGLBinding", descriptor)
		}catch(error){
			console.warn("Looking Glass XR compatibility could not restore XRWebGLBinding", error)
		}
	}
}

const XR_READY_TEXT = "ENTER XR"
const XR_EXIT_TEXT = "EXIT XR"
const XR_CTA_ID = "button-looking-glass-xr"

const rendererSupportsWebGLXR = renderer => {
	const context = renderer?.getContext?.()
	return Boolean(renderer?.xr?.setSession && context?.getContextAttributes)
}

export const endLookingGlassXRSession = async (button, renderer) => {
	if (button?._lookingGlassXREndSession)
	{
		await button._lookingGlassXREndSession()
		return
	}

	const session = button?._lookingGlassXRSession
		?? button?._lookingGlassXRCTA?._lookingGlassXRSession
		?? renderer?.xr?.getSession?.()

	if (!session)
	{
		return
	}

	try{
		await session.end()
	}catch(error){
		if (error?.name !== "InvalidStateError")
		{
			console.warn("Looking Glass XR session could not be ended", error)
		}
	}
}

export const destroyLookingGlassXRButtons = async (button, renderer) => {
	await endLookingGlassXRSession(button, renderer)
	button?._lookingGlassXRCTA?.remove()
	button?.remove()
	document.getElementById(XR_CTA_ID)?.remove()
}

export const createLookingGlassXRToggleButton = (renderer, destination) => {
	const button = document.createElement("button")
	const ctaButton = document.createElement("button")
	const controlDestination = destination ?? document.body
	const ctaDestination = document.getElementById("app-frame") ?? document.body
	let currentSession = null
	const buttons = [button, ctaButton]

	const setButtonReady = text => {
		buttons.forEach(buttonElement => {
			buttonElement.hidden = false
			buttonElement.disabled = false
			buttonElement.classList.toggle("unavailable", false)
			buttonElement.classList.toggle("active", text === XR_EXIT_TEXT)
			buttonElement.textContent = text
		})
	}

	const setButtonUnavailable = text => {
		buttons.forEach(buttonElement => {
			buttonElement.hidden = false
			buttonElement.disabled = true
			buttonElement.classList.toggle("unavailable", true)
			buttonElement.classList.toggle("active", false)
			buttonElement.textContent = text
		})
	}

	button.id = "XRButton"
	button.type = "button"
	button.className = "looking-glass-xr-button"
	button.setAttribute("aria-label", "Enter Looking Glass XR mode")

	ctaButton.id = XR_CTA_ID
	ctaButton.type = "button"
	ctaButton.className = "button-push looking-glass-xr-cta"
	ctaButton.setAttribute("aria-label", "Enter Looking Glass XR mode")
	button._lookingGlassXRCTA = ctaButton

	const onSessionEnded = () => {
		currentSession?.removeEventListener("end", onSessionEnded)
		currentSession = null
		button._lookingGlassXRSession = null
		ctaButton._lookingGlassXRSession = null
		setButtonReady(XR_READY_TEXT)
	}

	button._lookingGlassXREndSession = async () => {
		const session = currentSession ?? button._lookingGlassXRSession ?? ctaButton._lookingGlassXRSession
		if (!session)
		{
			return
		}

		try{
			await session.end()
		}catch(error){
			if (error?.name !== "InvalidStateError")
			{
				console.warn("Looking Glass XR session could not be ended", error)
			}
		}finally{
			onSessionEnded()
		}
	}

	const onToggleXR = async () => {
		if (currentSession)
		{
			await currentSession.end()
			return
		}

		try{
			const session = await navigator.xr.requestSession("immersive-vr", {
				optionalFeatures: ["local-floor"]
			})
			session.addEventListener("end", onSessionEnded)
			await renderer.xr.setSession(session)
			currentSession = session
			button._lookingGlassXRSession = session
			ctaButton._lookingGlassXRSession = session
			setButtonReady(XR_EXIT_TEXT)
		}catch(error){
			console.error("Looking Glass XR session could not start", error)
			setButtonReady(XR_READY_TEXT)
		}
	}

	button.addEventListener("click", onToggleXR)
	ctaButton.addEventListener("click", onToggleXR)

	if (!rendererSupportsWebGLXR(renderer))
	{
		setButtonUnavailable("XR WEBGL ONLY")
		controlDestination.append(button)
		ctaDestination.append(ctaButton)
		return button
	}

	if (!("xr" in navigator))
	{
		setButtonUnavailable(window.isSecureContext === false ? "XR NEEDS HTTPS" : "XR NOT AVAILABLE")
		controlDestination.append(button)
		ctaDestination.append(ctaButton)
		return button
	}

	button.hidden = true
	ctaButton.hidden = true
	navigator.xr.isSessionSupported("immersive-vr")
		.then(supported => {
			if (supported)
			{
				setButtonReady(XR_READY_TEXT)
			}
			else
			{
				setButtonUnavailable("XR NOT SUPPORTED")
			}
		})
		.catch(error => {
			console.warn("Looking Glass XR support check failed", error)
			setButtonUnavailable("XR NOT ALLOWED")
		})

	controlDestination.append(button)
	ctaDestination.append(ctaButton)
	return button
}
