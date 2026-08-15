import type { BrowserWindow, IpcMain } from 'electron'
import { createNativeMIDIBackend, loadNativeMIDIBinding, validateUMPWords } from './windows-midi-services-backend'

type MIDIPort = {
	id:string
	manufacturer:string
	name:string
	type:'input'|'output'
	version:string
}

type MIDIBackend = {
	inputs:MIDIPort[]
	outputs:MIDIPort[]
	send?:(portId:string, words:number[], timestamp?:number) => void|Promise<void>
	destroy?:() => void
}

let backend:MIDIBackend|null = null

const emptyPorts = () => ({ inputs:[], outputs:[] })

/**
 * Native MIDI is optional. Platform bindings register a backend here after
 * they have loaded successfully; otherwise the renderer falls back to Web MIDI.
 */
export const setMIDIBackend = (nextBackend:MIDIBackend|null) => {
	backend?.destroy?.()
	backend = nextBackend
}

export const destroyMIDI = () => setMIDIBackend(null)

export const registerMIDI = (mainWindow:BrowserWindow, ipcMain:IpcMain) => {
	const binding = loadNativeMIDIBinding()
	if (binding) {
		try {
			setMIDIBackend(createNativeMIDIBackend(binding, {
				onMessage:message => mainWindow.webContents.send('midi:message', message),
				onPortsChanged:ports => mainWindow.webContents.send('midi:ports-changed', ports),
			}))
		} catch (error) {
			console.error('Native MIDI 2.0 failed to initialize; using Web MIDI', error)
			setMIDIBackend(null)
		}
	}

	ipcMain.on('midi:is-available', event => {
		event.returnValue = backend !== null
	})

	ipcMain.handle('midi:get-ports', () => backend ?? emptyPorts())
	ipcMain.handle('midi:send', async (_event, payload:{portId:string,words:number[],timestamp?:number}) => {
		if (!backend?.send) throw new Error('Native MIDI output is unavailable')
		const words = validateUMPWords(payload?.words)
		await backend.send(String(payload.portId), words, Number(payload.timestamp) || 0)
		return true
	})

	mainWindow.webContents.once('destroyed', destroyMIDI)
}
