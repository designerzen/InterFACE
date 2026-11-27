import { requestElectronPort } from '../electron/electron-port-client.js'

/**
 * ElectronStorageClient
 *
 * Drop-in replacement for StorageOPFS when running inside Electron.
 * Communicates directly with the `storage` utilityProcess over a MessagePort
 * backed by `node:fs` in `app.getPath('userData')/sessions`.
 */
export default class ElectronStorageClient {
	constructor(options = {}) {
		this.timeout = options.timeout ?? 30000
		this.failure = null
		this.pending = new Map()
		this.messageId = 0
		this.port = null
		this.portPromise = null
		this.destroyed = false
		this.openPortChannel = options.openPortChannel ?? globalThis.electron?.storage?.openPortChannel
	}

	async ensurePort() {
		if (this.destroyed) throw new Error('Electron storage client has been destroyed')
		if (this.failure) throw this.failure
		if (this.port) return this.port

		if (!this.portPromise) {
			this.portPromise = requestElectronPort(this.openPortChannel, {
				service: 'storage',
				channel: 'sessions',
				timeoutMs: Math.min(this.timeout, 10000),
			}).then(port => {
				if (this.destroyed) {
					try { port.close() } catch {}
					throw new Error('Electron storage client has been destroyed')
				}
				this.port = port
				port.addEventListener('message', event => this.handleMessage(event))
				port.addEventListener('messageerror', () => this.fail(new Error('Electron storage port message error')))
				return port
			}).catch(error => {
				this.portPromise = null
				throw error
			})
		}

		return this.portPromise
	}

	handleMessage(event) {
		const { id, ok, result, error } = event.data ?? {}
		const handler = this.pending.get(id)
		if (!handler) return
		this.pending.delete(id)
		clearTimeout(handler.timer)

		if (!ok) {
			handler.reject(new Error(error || 'Electron storage error'))
			return
		}

		if (result?.__photosynthBlob && result.buffer) {
			handler.resolve(new Blob([result.buffer], { type: result.type || 'application/octet-stream' }))
			return
		}

		handler.resolve(result)
	}

	async send(type, payload = {}, transfer = []) {
		if (this.failure) return Promise.reject(this.failure)
		const port = await this.ensurePort()

		let outgoingPayload = payload
		let outgoingTransfer = Array.isArray(transfer) ? [...transfer] : []

		if (type === 'session:chunk' && payload?.blob && typeof payload.blob.arrayBuffer === 'function') {
			const bytes = await payload.blob.arrayBuffer()
			const { blob: _ignored, ...rest } = payload
			outgoingPayload = { ...rest, bytes }
			outgoingTransfer.push(bytes)
		}

		const id = ++this.messageId
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				this.pending.delete(id)
				reject(new Error(`Electron storage timed out: ${type}`))
			}, this.timeout)

			this.pending.set(id, { resolve, reject, timer })
			try {
				port.postMessage({ id, type, payload: outgoingPayload }, outgoingTransfer)
			} catch (error) {
				clearTimeout(timer)
				this.pending.delete(id)
				this.fail(error)
				reject(error)
			}
		})
	}

	fail(error) {
		this.failure = error
		for (const request of this.pending.values()) {
			clearTimeout(request.timer)
			request.reject(error)
		}
		this.pending.clear()
		if (this.port) {
			try { this.port.close() } catch {}
			this.port = null
		}
	}

	destroy() {
		this.destroyed = true
		for (const request of this.pending.values()) {
			clearTimeout(request.timer)
			request.reject(new Error('Electron storage destroyed'))
		}
		this.pending.clear()
		if (this.port) {
			try { this.port.close() } catch {}
			this.port = null
		}
	}
}
