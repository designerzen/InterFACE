import { requestElectronPort } from '../electron/electron-port-client.js'

/**
 * Renderer client for Electron's `network` utilityProcess (Bonjour discovery +
 * local WebSocket timing relay).
 */
export const createElectronLanTimingClient = (options = {}) => {
	const openPortChannel = options.openPortChannel ?? globalThis.electron?.network?.lan?.openPortChannel
	let port = null
	let portPromise = null
	let nextId = 0
	const pending = new Map()
	const listeners = new Set()

	const ensurePort = async () => {
		if (port) return port
		if (!portPromise) {
			portPromise = requestElectronPort(openPortChannel, {
				service: 'network',
				channel: 'lan-timing',
			}).then(nextPort => {
				port = nextPort
				port.addEventListener('message', event => {
					const data = event.data ?? {}
					if (data.id != null) {
						const handler = pending.get(data.id)
						if (!handler) return
						pending.delete(data.id)
						if (data.ok) handler.resolve(data.result)
						else handler.reject(new Error(data.error || 'LAN timing error'))
						return
					}
					for (const listener of listeners) {
						try { listener(data) } catch {}
					}
				})
				return port
			}).catch(error => {
				portPromise = null
				throw error
			})
		}
		return portPromise
	}

	const send = async (type, payload = {}) => {
		const channel = await ensurePort()
		const id = ++nextId
		return new Promise((resolve, reject) => {
			pending.set(id, { resolve, reject })
			channel.postMessage({ id, type, payload })
		})
	}

	return {
		host: (roomId, portNumber = 0) => send('lan:host', { roomId, port: portNumber }),
		stopHosting: () => send('lan:stop-host'),
		discover: () => send('lan:discover'),
		stopDiscovery: () => send('lan:stop-discover'),
		broadcast: data => send('lan:broadcast', { data }),
		getState: () => send('lan:state'),
		onEvent(listener) {
			listeners.add(listener)
			return () => listeners.delete(listener)
		},
		destroy() {
			for (const handler of pending.values()) {
				handler.reject(new Error('LAN timing client destroyed'))
			}
			pending.clear()
			listeners.clear()
			if (port) {
				try { port.close() } catch {}
				port = null
			}
			portPromise = null
		},
	}
}
