import { requestElectronPort } from '../electron/electron-port-client.js'

export const createElectronBackingMelodyModel = (checkpoint, openPortChannel) => {
	let nextId = 0, disposed = false
	let port = null, portPromise = null
	const pending = new Map()

	const fail = error => {
		for (const request of pending.values()) { clearTimeout(request.timer); request.reject(error) }
		pending.clear()
	}

	const ensurePort = async () => {
		if (disposed) throw new Error('Backing melody stopped')
		if (port) return port
		if (!portPromise) {
			portPromise = requestElectronPort(openPortChannel, {
				service: 'ai',
				channel: 'backing-melody',
				timeoutMs: 10000,
			}).then(nextPort => {
				if (disposed) {
					try { nextPort.close() } catch {}
					throw new Error('Backing melody stopped')
				}
				port = nextPort
				port.addEventListener('message', ({ data }) => {
					const request = pending.get(data?.id)
					if (!request) return
					clearTimeout(request.timer); pending.delete(data.id)
					if (!data.ok) request.reject(new Error(data.error || 'The backing melody model failed.'))
					else request.resolve(data.result?.sequence)
				})
				return port
			}).catch(error => {
				portPromise = null
				throw error
			})
		}
		return portPromise
	}

	const request = async (type, payload = {}) => {
		const channel = await ensurePort()
		return new Promise((resolve, reject) => {
			if (disposed) { reject(new Error('Backing melody stopped')); return }
			const id = ++nextId
			const timer = setTimeout(() => {
				pending.delete(id)
				reject(new Error('Backing melody timed out. Check your connection and try again.'))
			}, 60000)
			pending.set(id, { resolve, reject, timer })
			channel.postMessage({ id, type, checkpoint, ...payload })
		})
	}

	return {
		initialize: () => request('initialize'),
		generate: (seed, chord) => request('generate', { seed, chord }),
		destroy: () => {
			disposed = true
			if (port) {
				try { port.postMessage({ type: 'destroy' }) } catch {}
				try { port.close() } catch {}
				port = null
			}
			fail(new Error('Backing melody stopped'))
		},
	}
}
