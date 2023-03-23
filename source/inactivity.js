// Project FUGU has a Chrome native version of this API...
// https://developer.chrome.com/articles/idle-detection/

const TIME_OUT = 4000


const main = async ( onActive, onInactive, timeOut = TIME_OUT) => {
	// Feature detection.
	if (!('IdleDetector' in window)) {
		return console.log('IdleDetector is not available.');
	}
	// Request permission to use the feature.
	if (await IdleDetector.requestPermission() !== 'granted') {
		return console.log('Idle detection permission not granted.');
	}
	try {
		const controller = new AbortController();
		const signal = controller.signal;

		const idleDetector = new IdleDetector();
		idleDetector.addEventListener('change', () => {
			console.log(`Idle change: ${idleDetector.userState}, ${idleDetector.screenState}.`);

// const main = async ( onActive, onInactive, timeOut = TIME_OUT) => {
	
		});
		await idleDetector.start({
			threshold: timeOut,
			signal,
		});
		console.log('IdleDetector is active.');

		window.setTimeout(() => {
			controller.abort();
			console.log('IdleDetector is stopped.');
		}, 120000);
	} catch (err) {
		// Deal with initialization errors like permission denied,
		// running outside of top-level frame, etc.
		console.error(err.name, err.message);
	}
}







const interact = (activityElement, onActive, onInactive, timeOut = TIME_OUT) => {

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

	onActive && onActive()
}




export default interact