import { requestElectronPort } from '../../electron/electron-port-client.js'

let sharedPortPromise = null
let messageId = 0
const pending = new Map()
const pathListeners = new Map()

const ensureSerialPortChannel = async () => {
	const bridge = globalThis.electron?.hardware?.serial
	if (!bridge?.available || typeof bridge.openPortChannel !== 'function') {
		return null
	}
	if (!sharedPortPromise) {
		sharedPortPromise = requestElectronPort(bridge.openPortChannel, {
			service: 'hardware',
			channel: 'serial',
		}).then(port => {
			port.addEventListener('message', event => {
				const data = event.data ?? {}
				if (data.id != null) {
					const handler = pending.get(data.id)
					if (!handler) return
					pending.delete(data.id)
					if (data.ok) handler.resolve(data.result)
					else handler.reject(new Error(data.error || 'Serial worker error'))
					return
				}

				if (data.path && pathListeners.has(data.path)) {
					for (const listener of pathListeners.get(data.path)) {
						try { listener(data) } catch {}
					}
				}
			})
			return port
		}).catch(() => {
			sharedPortPromise = null
			return null
		})
	}
	return sharedPortPromise
}

const sendRequest = async (type, payload = {}, transfer = []) => {
	const port = await ensureSerialPortChannel()
	if (!port) throw new Error('Electron native serial channel unavailable')
	const id = ++messageId
	return new Promise((resolve, reject) => {
		pending.set(id, { resolve, reject })
		port.postMessage({ id, type, payload }, transfer)
	})
}

const createWebSerialCompatiblePort = info => {
	let isOpen = false
	let readerController = null
	let listener = null

	const port = {
		getInfo() {
			return {
				usbVendorId: info.vendorId,
				usbProductId: info.productId,
				path: info.path,
			}
		},

		readable: null,
		writable: null,

		async open({ baudRate = 115200 } = {}) {
			await sendRequest('serial:open', { path: info.path, baudRate })
			isOpen = true

			const stream = new ReadableStream({
				start(controller) {
					readerController = controller
					listener = event => {
						if (event.type === 'serial:data' && event.data) {
							controller.enqueue(new Uint8Array(event.data))
						} else if (event.type === 'serial:disconnect') {
							try { controller.close() } catch {}
						} else if (event.type === 'serial:error') {
							try { controller.error(new Error(event.error || 'Serial error')) } catch {}
						}
					}
					if (!pathListeners.has(info.path)) pathListeners.set(info.path, new Set())
					pathListeners.get(info.path).add(listener)
				},
				cancel() {
					if (listener) pathListeners.get(info.path)?.delete(listener)
					readerController = null
				},
			})

			this.readable = stream
			this.writable = {
				getWriter() {
					return {
						async write(chunk) {
							if (!isOpen) return
							const bytes = chunk instanceof Uint8Array ? chunk.slice() : new Uint8Array(chunk)
							const channel = await ensureSerialPortChannel()
							channel?.postMessage(
								{ type: 'serial:write', payload: { path: info.path, data: bytes.buffer } },
								[bytes.buffer],
							)
						},
						releaseLock() {},
					}
				},
			}
		},

		async close() {
			isOpen = false
			if (listener) {
				pathListeners.get(info.path)?.delete(listener)
				listener = null
			}
			if (readerController) {
				try { readerController.close() } catch {}
				readerController = null
			}
			await sendRequest('serial:close', { path: info.path }).catch(() => {})
		},
	}

	return port
}

export const getElectronPicadeSerialPorts = async (filters = []) => {
	if (!globalThis.electron?.hardware?.serial?.available) return []
	try {
		const isAvailable = await sendRequest('serial:available')
		if (!isAvailable) return []
		const ports = await sendRequest('serial:list', { filters })
		return (ports ?? []).map(createWebSerialCompatiblePort)
	} catch {
		return []
	}
}
