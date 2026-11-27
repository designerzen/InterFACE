/**
 * Renderer-side helper to obtain a MessagePort transferred from Electron's
 * main process or a managed utilityProcess via preload.ts.
 */
export const requestElectronPort = (
	openPortChannel,
	{ service, channel, timeoutMs = 4000 } = {},
) => {
	if (typeof openPortChannel !== 'function' || typeof window === 'undefined') {
		return Promise.reject(new Error('Electron MessagePort channel is unavailable'))
	}

	const token = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(36).slice(2)}`

	return new Promise((resolve, reject) => {
		const cleanup = () => {
			clearTimeout(timer)
			window.removeEventListener('message', onMessage)
		}

		const onMessage = event => {
			if (event.source !== window) return
			const data = event.data
			if (!data?.__photosynthElectronPort || data.token !== token) return
			if (service && data.service !== service) return
			if (channel && data.channel !== channel) return
			const port = event.ports?.[0]
			if (!port) return
			cleanup()
			port.start()
			resolve(port)
		}

		const timer = setTimeout(() => {
			cleanup()
			reject(new Error(`Timed out waiting for Electron port (${service ?? 'unknown'}:${channel ?? 'default'})`))
		}, timeoutMs)

		window.addEventListener('message', onMessage)
		try {
			openPortChannel(token)
		} catch (error) {
			cleanup()
			reject(error)
		}
	})
}
