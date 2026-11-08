const isMissingCamera = error =>
	error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError'

// Keep startup pending until a camera can be opened. Poll as a fallback for
// browsers that do not emit devicechange before camera permission is granted.
export const waitForCamera = async (connect, onWaiting) => {
	let waiting = false
	try {
		while (true) {
			try {
				return await connect()
			} catch (error) {
				if (!isMissingCamera(error)) throw error
				if (!waiting) {
					waiting = true
					onWaiting(true)
				}
				await new Promise(resolve => {
					const resume = () => {
						clearTimeout(timer)
						navigator.mediaDevices.removeEventListener?.('devicechange', resume)
						resolve()
					}
					const timer = setTimeout(resume, 1500)
					navigator.mediaDevices.addEventListener?.('devicechange', resume)
				})
			}
		}
	} finally {
		if (waiting) onWaiting(false)
	}
}
