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
export const observeInteractivityThroughIdelDetector = async ( onActive, onInactive, timeOut = TIME_OUT) => {

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
		})

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

	let isUserActive = true
	let isUserBusy = true
	let interval

	// after a period of inactivity...
	activityElement.addEventListener("mousemove", (event) => {

		clearInterval(interval)

		if (!isUserBusy) {
			isUserBusy = true
			onActive && onActive()
			return
		}

		interval = setTimeout(() => {
			isUserBusy = false
			onInactive && onInactive()
		}, timeOut)

	}, false)

	activityElement.addEventListener("mouseout", (event) => {
		clearInterval(interval)
	}, false)

	document.addEventListener("mouseenter", (event) => {

		clearInterval(interval)
		if (isUserActive) {
			return
		}
		isUserActive = true
		//console.error("user active again")
		onActive && onActive()
	}, false)

	document.addEventListener("mouseleave", (event) => {
		clearInterval(interval)
		if (isUserActive && (event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight))) {
			// outside
			isUserActive = false
			//console.error("user inactive")
			onInactive && onInactive()
		}
	}, false)


	// NB. can trigger multiple times
	document.addEventListener("visibilitychange", e => {
		clearInterval(interval)
		document.documentElement.classList.toggle("tab-hidden", document.hidden)
		if (document.hidden) {
			isUserActive = false
			onInactive && onInactive()
		} else {
			onActive && onActive()
		}
	}, false)

	// Tab hide / reveal
	window.addEventListener("pageshow", (event) => {
		// tab revealed
		console.log("pageshow", event)
		onActive && onActive()
	})

	window.addEventListener("pagehide", (event) => {
		// tab hidden
		console.log("pagehide", event)
		onInactive && onInactive()			
	})

	onActive && onActive()

	// Clean up!
	return ()=>{
		// activityElement.removeEventListener("mousemove" )
		// activityElement.removeEventListener("mouseout", (event) => {
		// document.removeEventListener("mouseenter", (event) => {
		// document.removeEventListener("mouseleave", (event) => {
		// document.removeEventListener("visibilitychange"
		// window.removeEventListener("pageshow"
		// window.removeEventListener("pagehide"
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
	return observeInteractivityThroughUserEvents(activityElement, onActive, onInactive, timeOut)
}
