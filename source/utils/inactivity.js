// Project FUGU has a Chrome native version of this API...
// https://developer.chrome.com/articles/idle-detection/

const TIME_OUT = 6000	// 6000 is the minimum value for IdleDetector

const hasIdelDetection = () => 'IdleDetector' in window

/**
 * 
 * @param {Function} onActive 
 * @param {Function} onInactive 
 * @param {Number} timeOut 
 * @returns {Function} cleanup method
 */
export const observeInteractivityThroughIdelDetector = async ( onActive, onInactive, timeOut = TIME_OUT, passive=true) => {

	// Feature detection.
	if (!hasIdelDetection()) 
	{
		console.log('IdleDetector is not available.')
		return false
	}

	// Request permission to use the feature.
	if (await IdleDetector.requestPermission() !== 'granted')
	{
		console.log('Idle detection permission not granted.')
		return false
	}

	const controller = new AbortController()

	try {	
		const signal = controller.signal
		const idleDetector = new IdleDetector()

		idleDetector.addEventListener('change', () => {
			console.log(`Idle change: ${idleDetector.userState}, ${idleDetector.screenState}.`)
		
			// user state
			// whether the users has interacted with either 
			// the screen or the device within the threshold
			// provided to start(), one of "active" or "idle".
			// This attribute returns null before start() is called.
			// onActive && onActive()
			switch(idleDetector.userState)
			{
				case "active":
					break

				case "idle":
					break
			}

			// screen state
			// whether the screen is locked, one of "locked" or "unlocked". 
			// This attribute returns null before start() is called.
			switch(idleDetector.screenState)
			{
				case "locked":
					break
					
				case "unlocked":
					break
			}
		},  {signal: controller.signal, passive })

		await idleDetector.start({
			threshold: timeOut,
			signal,
		})
		console.log('IdleDetector is active.')

	} catch (err) {
		// Deal with initialization errors like permission denied,
		// running outside of top-level frame, etc.
		console.error(err.name, err.message)
		return false
	}

	return () => {
		controller.abort()
	}
}

/**
 * 
 * @param {HTMLElement} activityElement 
 * @param {Function} onActive 
 * @param {Function} onInactive 
 * @param {Number} timeOut 
 * @returns {Function} cleanup method
 */
export const observeInteractivityThroughUserEvents = async (activityElement, onActive, onInactive, timeOut = TIME_OUT)=>{

	let isUserActive = false
	let timeout
	const abortController = new AbortController()

	const markInactive = () => {
		clearTimeout(timeout)
		if (!isUserActive) return
		isUserActive = false
		onInactive && onInactive()
	}

	const markActivity = () => {
		clearTimeout(timeout)
		if (!isUserActive) {
			isUserActive = true
			onActive && onActive()
		}
		timeout = setTimeout(markInactive, timeOut)
	}

	// Cursor visibility applies to the whole page. Capture activity before
	// controls can stop propagation, including pointer-captured drags.
	const activityEvents = ["pointermove", "mousemove", "pointerdown", "pointerup",
		"touchstart", "touchmove", "keydown", "focusin", "wheel"]
	activityEvents.forEach(type => {
		document.addEventListener(type, markActivity, {
			signal: abortController.signal, capture: true, passive: true
		})
	})

	// Leaving the page does not itself mean the user has been inactive.
	document.addEventListener("mouseenter", markActivity, { signal: abortController.signal })
	document.addEventListener("visibilitychange", () => {
		document.documentElement.classList.toggle("tab-hidden", document.hidden)
		if (document.hidden) markInactive()
		else markActivity()
	}, { signal: abortController.signal })
	window.addEventListener("pageshow", markActivity, { signal: abortController.signal })
	window.addEventListener("pagehide", markInactive, { signal: abortController.signal })

	markActivity()

	return () => {
		clearTimeout(timeout)
		abortController.abort()
		onActive && onActive()
	}
}

/**
 * Monitor for user activity and lack thereof
 */
export const observeInactivity = async (activityElement, onActive, onInactive, timeOut = TIME_OUT, ignoreIdleDetector=false) => {

	let observer
	
	if (!ignoreIdleDetector && hasIdelDetection())
	{
		observer = observeInteractivityThroughIdelDetector()
	}

	if (observer)
	{
		return observer
	}

	timeOut = isNaN(timeOut) ? parseFloat(timeOut) : timeOut ?? TIME_OUT 

	return observeInteractivityThroughUserEvents(activityElement, onActive, onInactive, timeOut)
}
