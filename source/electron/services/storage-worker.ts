import path from 'node:path'
import { createNodeDirectoryHandle } from './storage-fs.ts'
import { createSessionStore } from '../../storage/session-store.js'

const STORAGE_ROOT = process.env.PHOTOSYNTH_STORAGE_DIR
	|| path.join(process.cwd(), 'sessions')

let rootPromise: ReturnType<typeof createNodeDirectoryHandle> | null = null
const getRoot = () => {
	rootPromise ??= createNodeDirectoryHandle(STORAGE_ROOT)
	return rootPromise
}

const sessionStore = createSessionStore(getRoot)

const toSerializableResult = async (result: any): Promise<{ result: any; transfer?: ArrayBuffer[] }> => {
	if (result && typeof result.arrayBuffer === 'function') {
		const buffer = await result.arrayBuffer()
		return {
			result: {
				__photosynthBlob: true,
				type: result.type || 'application/octet-stream',
				buffer,
			},
			transfer: [buffer],
		}
	}
	return { result }
}

const normalizePayload = (type: string, payload: any) => {
	if (type === 'session:chunk' && payload?.bytes) {
		const bytes = payload.bytes instanceof ArrayBuffer
			? new Uint8Array(payload.bytes)
			: new Uint8Array(payload.bytes.buffer ?? payload.bytes)
		return {
			...payload,
			blob: new Blob([bytes], { type: payload.entry?.mimeType || 'application/octet-stream' }),
		}
	}
	return payload
}

const handleSessionCommand = async (type: string, payload: any) => {
	if (!type.startsWith('session:')) {
		throw new Error(`Unsupported storage command: ${type}`)
	}
	const action = type.slice(8)
	if (typeof (sessionStore as any)[action] !== 'function') {
		throw new Error(`Unknown session storage action: ${action}`)
	}
	return (sessionStore as any)[action](normalizePayload(type, payload))
}

let queue: Promise<void> = Promise.resolve()

const attachPort = (port: Electron.MessagePortMain) => {
	port.on('message', event => {
		const { id, type, payload } = event.data ?? {}
		queue = queue.then(async () => {
			try {
				const raw = await handleSessionCommand(type, payload)
				const { result, transfer } = await toSerializableResult(raw)
				if (transfer?.length) {
					port.postMessage({ id, ok: true, result }, transfer as any)
				} else {
					port.postMessage({ id, ok: true, result })
				}
			} catch (error: any) {
				port.postMessage({ id, ok: false, error: error?.message ?? String(error) })
			}
		})
	})

	port.on('close', () => {
		try { sessionStore.close() } catch {}
	})

	port.start()
}

if (process.parentPort) {
	process.parentPort.on('message', event => {
		const { type } = event.data ?? {}
		if (type === 'port' && event.ports?.[0]) {
			attachPort(event.ports[0])
		} else if (type === 'shutdown') {
			try { sessionStore.close() } catch {}
			process.exit(0)
		}
	})
}
