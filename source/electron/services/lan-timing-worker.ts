import { Bonjour } from 'bonjour-service'
import { WebSocketServer, type WebSocket } from 'ws'
import os from 'node:os'

export const LAN_SERVICE_TYPE = 'photosynth-timing'

export interface LanPeerInfo {
	id: string
	name: string
	host: string
	port: number
	roomId: string
	url: string
}

export interface LanTimingServiceDeps {
	createBonjour?: () => any
	createWebSocketServer?: (options: { port: number; host?: string }) => any
}

const getPrimaryLanAddress = (): string => {
	const interfaces = os.networkInterfaces()
	for (const entries of Object.values(interfaces)) {
		for (const entry of entries ?? []) {
			if (entry.family === 'IPv4' && !entry.internal) return entry.address
		}
	}
	return '127.0.0.1'
}

export const createLanTimingService = (deps: LanTimingServiceDeps = {}) => {
	const createBonjour = deps.createBonjour ?? (() => new Bonjour())
	const createWSS = deps.createWebSocketServer ?? (options => new WebSocketServer(options))

	let bonjour: any = null
	let published: any = null
	let browser: any = null
	let wss: any = null
	let hostingInfo: { roomId: string; port: number; url: string } | null = null
	const discovered = new Map<string, LanPeerInfo>()
	const clients = new Set<WebSocket>()
	const listeners = new Set<(event: any) => void>()

	const emit = (event: any) => {
		for (const listener of listeners) {
			try { listener(event) } catch {}
		}
	}

	const ensureBonjour = () => {
		if (!bonjour) bonjour = createBonjour()
		return bonjour
	}

	const stopHosting = async () => {
		if (published) {
			try { published.stop?.() } catch {}
			published = null
		}
		for (const client of clients) {
			try { client.close() } catch {}
		}
		clients.clear()
		if (wss) {
			const server = wss
			wss = null
			await new Promise<void>(resolve => {
				try { server.close(() => resolve()) } catch { resolve() }
			})
		}
		hostingInfo = null
		emit({ type: 'lan:hosting', hosting: null })
	}

	const stopDiscovery = () => {
		if (browser) {
			try { browser.stop?.() } catch {}
			browser = null
		}
		discovered.clear()
	}

	const host = async (roomId: string, requestedPort = 0) => {
		if (!roomId || typeof roomId !== 'string') throw new Error('A valid roomId is required')
		await stopHosting()

		const server = createWSS({ port: Number(requestedPort) || 0, host: '0.0.0.0' })
		wss = server

		const port = await new Promise<number>((resolve, reject) => {
			const onError = (error: Error) => reject(error)
			server.once('error', onError)
			server.once('listening', () => {
				server.off('error', onError)
				const address = server.address()
				resolve(typeof address === 'object' && address ? address.port : Number(requestedPort) || 0)
			})
		})

		server.on('connection', (socket: WebSocket) => {
			clients.add(socket)
			emit({ type: 'lan:clients', count: clients.size })

			socket.on('message', raw => {
				const text = typeof raw === 'string' ? raw : raw.toString('utf8')
				for (const peer of clients) {
					if (peer !== socket && peer.readyState === 1) {
						peer.send(text)
					}
				}
				emit({ type: 'lan:message', data: text })
			})

			socket.on('close', () => {
				clients.delete(socket)
				emit({ type: 'lan:clients', count: clients.size })
			})
		})

		const address = getPrimaryLanAddress()
		const url = `ws://${address}:${port}`
		hostingInfo = { roomId, port, url }

		try {
			const mdns = ensureBonjour()
			published = mdns.publish({
				name: `PhotoSYNTH-${roomId.slice(0, 16)}`,
				type: LAN_SERVICE_TYPE,
				port,
				txt: { roomId, version: '1' },
			})
		} catch {}

		emit({ type: 'lan:hosting', hosting: hostingInfo })
		return hostingInfo
	}

	const startDiscovery = () => {
		stopDiscovery()
		const mdns = ensureBonjour()
		browser = mdns.find({ type: LAN_SERVICE_TYPE })
		browser.on('up', (service: any) => {
			const hostAddr = service.referer?.address || service.addresses?.[0] || service.host
			if (!hostAddr || !service.port) return
			const id = `${hostAddr}:${service.port}`
			const roomId = String(service.txt?.roomId ?? service.name ?? '')
			discovered.set(id, {
				id,
				name: String(service.name || 'PhotoSYNTH Room'),
				host: String(hostAddr),
				port: Number(service.port),
				roomId,
				url: `ws://${hostAddr}:${service.port}`,
			})
			emit({ type: 'lan:peers', peers: [...discovered.values()] })
		})
		browser.on('down', (service: any) => {
			const hostAddr = service.referer?.address || service.addresses?.[0] || service.host
			const id = `${hostAddr}:${service.port}`
			if (discovered.delete(id)) {
				emit({ type: 'lan:peers', peers: [...discovered.values()] })
			}
		})
		return [...discovered.values()]
	}

	const broadcast = (data: string | Record<string, unknown>) => {
		const serialized = typeof data === 'string' ? data : JSON.stringify(data)
		let sent = 0
		for (const client of clients) {
			if (client.readyState === 1) {
				client.send(serialized)
				sent++
			}
		}
		return { sent }
	}

	const destroy = async () => {
		stopDiscovery()
		await stopHosting()
		if (bonjour) {
			try { bonjour.destroy?.() } catch {}
			bonjour = null
		}
		listeners.clear()
	}

	return {
		host,
		stopHosting,
		startDiscovery,
		stopDiscovery,
		broadcast,
		getState: () => ({
			hosting: hostingInfo,
			clientCount: clients.size,
			peers: [...discovered.values()],
		}),
		subscribe(listener: (event: any) => void) {
			listeners.add(listener)
			return () => listeners.delete(listener)
		},
		destroy,
	}
}

const attachPort = (port: Electron.MessagePortMain, service: ReturnType<typeof createLanTimingService>) => {
	const unsubscribe = service.subscribe(event => {
		try { port.postMessage(event) } catch {}
	})

	port.on('message', async event => {
		const { id, type, payload } = event.data ?? {}
		try {
			let result: any
			switch (type) {
				case 'lan:host':
					result = await service.host(payload?.roomId, payload?.port)
					break
				case 'lan:stop-host':
					await service.stopHosting()
					result = { stopped: true }
					break
				case 'lan:discover':
					result = service.startDiscovery()
					break
				case 'lan:stop-discover':
					service.stopDiscovery()
					result = { stopped: true }
					break
				case 'lan:broadcast':
					result = service.broadcast(payload?.data)
					break
				case 'lan:state':
					result = service.getState()
					break
				default:
					throw new Error(`Unknown LAN timing command: ${String(type)}`)
			}
			if (id != null) port.postMessage({ id, ok: true, result })
		} catch (error: any) {
			if (id != null) port.postMessage({ id, ok: false, error: error?.message ?? String(error) })
		}
	})

	port.on('close', () => unsubscribe())
	port.start()
}

if (process.parentPort) {
	const service = createLanTimingService()
	process.parentPort.on('message', async event => {
		const { type } = event.data ?? {}
		if (type === 'port' && event.ports?.[0]) {
			attachPort(event.ports[0], service)
		} else if (type === 'shutdown') {
			await service.destroy()
			process.exit(0)
		}
	})
}
