import { MessageChannelMain, type BrowserWindow, type IpcMain, type MessagePortMain } from 'electron'
import { createNativeMIDIBackend, getSerializablePorts, loadNativeMIDIBinding, validateUMPWords } from './windows-midi-services-backend'

type MIDIPort = {
	id: string
	manufacturer: string
	name: string
	type: 'input' | 'output'
	version: string
}

type MIDIBackend = {
	inputs: MIDIPort[]
	outputs: MIDIPort[]
	send?: (portId: string, words: number[], timestamp?: number) => void | Promise<void>
	destroy?: () => void
}

let backend: MIDIBackend | null = null
const activePorts = new Set<MessagePortMain>()

const closeActivePorts = () => {
	for (const port of activePorts) {
		try { port.close() } catch {}
	}
	activePorts.clear()
}

/**
 * Native MIDI is optional. Platform bindings register a backend here after
 * they have loaded successfully; otherwise the renderer falls back to Web MIDI.
 */
export const setMIDIBackend = (nextBackend: MIDIBackend | null) => {
	backend?.destroy?.()
	backend = nextBackend
}

export const destroyMIDI = () => {
	closeActivePorts()
	setMIDIBackend(null)
}

export const attachMIDIMessagePort = (port: MessagePortMain) => {
	activePorts.add(port)
	port.on('message', event => {
		const message = event.data
		if (!message || message.type !== 'send' || !backend?.send) return
		try {
			const words = validateUMPWords(message.words)
			void Promise.resolve(backend.send(String(message.portId), words, Number(message.timestamp) || 0))
				.catch(error => {
					try { port.postMessage({ type: 'error', error: error?.message ?? String(error) }) } catch {}
				})
		} catch (error: any) {
			try { port.postMessage({ type: 'error', error: error?.message ?? String(error) }) } catch {}
		}
	})
	port.on('close', () => {
		activePorts.delete(port)
	})
	port.start()
}

export const registerMIDI = (mainWindow: BrowserWindow, ipcMain: IpcMain) => {
	const binding = loadNativeMIDIBinding()
	if (binding) {
		try {
			setMIDIBackend(createNativeMIDIBackend(binding, {
				onMessage: message => {
					if (activePorts.size > 0) {
						for (const port of activePorts) {
							try { port.postMessage({ type: 'message', message }) } catch {}
						}
						return
					}
					if (!mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
						mainWindow.webContents.send('midi:message', message)
					}
				},
				onPortsChanged: ports => {
					for (const port of activePorts) {
						try { port.postMessage({ type: 'ports-changed', ports }) } catch {}
					}
					if (!mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
						mainWindow.webContents.send('midi:ports-changed', ports)
					}
				},
			}))
		} catch (error) {
			console.error('Native MIDI 2.0 failed to initialize; using Web MIDI', error)
			setMIDIBackend(null)
		}
	}

	ipcMain.removeAllListeners('midi:is-available')
	ipcMain.removeAllListeners('midi:open-port')
	ipcMain.removeHandler('midi:get-ports')
	ipcMain.removeHandler('midi:send')

	ipcMain.on('midi:is-available', event => {
		event.returnValue = backend !== null
	})

	ipcMain.on('midi:open-port', (event, payload: { token?: string }) => {
		if (!backend || !payload?.token || event.sender.isDestroyed()) return
		const { port1, port2 } = new MessageChannelMain()
		attachMIDIMessagePort(port1)
		event.sender.postMessage('electron:port', { service: 'midi', channel: 'ump', token: String(payload.token) }, [port2])
	})

	ipcMain.handle('midi:get-ports', () => getSerializablePorts(backend))
	ipcMain.handle('midi:send', async (_event, payload: { portId: string; words: number[]; timestamp?: number }) => {
		if (!backend?.send) throw new Error('Native MIDI output is unavailable')
		const words = validateUMPWords(payload?.words)
		await backend.send(String(payload.portId), words, Number(payload.timestamp) || 0)
		return true
	})

	mainWindow.webContents.once('destroyed', destroyMIDI)
}
