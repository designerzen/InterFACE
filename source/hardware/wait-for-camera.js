export const isMissingCamera = error =>
	error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError'

const createAbortError = signal =>
	signal?.reason ?? new DOMException('Camera wait aborted', 'AbortError')

// Keep startup pending until a camera can be opened (or an alternative media
// source aborts the wait). Poll as a fallback for browsers that do not emit
// devicechange before camera permission is granted.
export const waitForCamera = async (connect, onWaiting, options = {}) => {
	const { signal, onRetryReady } = options
	let waiting = false
	try {
		while (true) {
			if (signal?.aborted) throw createAbortError(signal)
			try {
				const result = await connect()
				if (signal?.aborted) {
					result?.camera?.getTracks?.().forEach(track => track.stop())
					throw createAbortError(signal)
				}
				return result
			} catch (error) {
				if (!isMissingCamera(error)) throw error
				if (signal?.aborted) throw createAbortError(signal)
				if (!waiting) {
					waiting = true
					onWaiting?.(true)
				}
				await new Promise((resolve, reject) => {
					const cleanup = () => {
						clearTimeout(timer)
						navigator.mediaDevices?.removeEventListener?.('devicechange', resume)
						signal?.removeEventListener?.('abort', onAbort)
						onRetryReady?.(null)
					}
					const resume = () => {
						cleanup()
						resolve()
					}
					const onAbort = () => {
						cleanup()
						reject(createAbortError(signal))
					}
					const timer = setTimeout(resume, 1500)
					navigator.mediaDevices?.addEventListener?.('devicechange', resume)
					signal?.addEventListener?.('abort', onAbort, { once: true })
					onRetryReady?.(resume)
				})
			}
		}
	} finally {
		onRetryReady?.(null)
		if (waiting) onWaiting?.(false)
	}
}
