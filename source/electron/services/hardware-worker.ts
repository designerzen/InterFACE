import { NativeSerialManager } from './serial-backend.ts'

const serialManager = new NativeSerialManager()

const attachSerialPortChannel = (port: Electron.MessagePortMain) => {
	const ownedPaths = new Set<string>()

	port.on('message', async event => {
		const { id, type, payload } = event.data ?? {}
		try {
			switch (type) {
				case 'serial:available':
					port.postMessage({ id, ok: true, result: serialManager.available })
					break

				case 'serial:list': {
					const ports = await serialManager.listPorts(payload?.filters)
					port.postMessage({ id, ok: true, result: ports })
					break
				}

				case 'serial:open': {
					const portPath = String(payload?.path ?? '')
					const baudRate = Number(payload?.baudRate) || 115200
					await serialManager.open(
						portPath,
						baudRate,
						chunk => {
							const copy = chunk.slice()
							port.postMessage({ type: 'serial:data', path: portPath, data: copy.buffer }, [copy.buffer] as any)
						},
						() => {
							ownedPaths.delete(portPath)
							port.postMessage({ type: 'serial:disconnect', path: portPath })
						},
						error => {
							port.postMessage({ type: 'serial:error', path: portPath, error: error.message })
						},
					)
					ownedPaths.add(portPath)
					port.postMessage({ id, ok: true, result: { path: portPath } })
					break
				}

				case 'serial:write': {
					const portPath = String(payload?.path ?? '')
					const data = payload?.data
					if (!data) throw new Error('Missing serial write payload')
					await serialManager.write(portPath, data)
					if (id != null) port.postMessage({ id, ok: true, result: true })
					break
				}

				case 'serial:close': {
					const portPath = String(payload?.path ?? '')
					ownedPaths.delete(portPath)
					await serialManager.close(portPath)
					port.postMessage({ id, ok: true, result: true })
					break
				}

				default:
					if (id != null) {
						port.postMessage({ id, ok: false, error: `Unknown hardware command: ${type}` })
					}
			}
		} catch (error: any) {
			if (id != null) {
				port.postMessage({ id, ok: false, error: error?.message ?? String(error) })
			}
		}
	})

	port.on('close', () => {
		for (const portPath of ownedPaths) {
			void serialManager.close(portPath)
		}
		ownedPaths.clear()
	})

	port.start()
}

if (process.parentPort) {
	process.parentPort.on('message', async event => {
		const { type, channel } = event.data ?? {}
		if (type === 'port' && event.ports?.[0]) {
			if (channel === 'serial') {
				attachSerialPortChannel(event.ports[0])
			}
		} else if (type === 'shutdown') {
			await serialManager.closeAll()
			process.exit(0)
		}
	})
}
