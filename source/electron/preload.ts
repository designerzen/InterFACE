import { contextBridge, ipcRenderer } from 'electron'

type Disposer = () => void

const subscribe = (channel: string, callback: (...args: any[]) => void): Disposer => {
	const listener = (_event: Electron.IpcRendererEvent, ...args: any[]) => callback(...args)
	ipcRenderer.on(channel, listener)
	return () => ipcRenderer.removeListener(channel, listener)
}

// Forward MessagePort instances transferred from main / utilityProcess into the
// renderer main world because contextBridge cannot directly clone MessagePorts.
ipcRenderer.on('electron:port', (event, meta) => {
	const port = event.ports?.[0]
	if (!port || !meta?.token) return
	window.postMessage({
		__photosynthElectronPort: true,
		service: meta.service,
		channel: meta.channel,
		token: meta.token,
	}, '*', [port])
})

const isServiceAvailable = (service: string): boolean =>
	ipcRenderer.sendSync('service:is-available', service) === true

const requestServicePort = (service: string, channel: string, token: string): void => {
	ipcRenderer.send('service:open-port', { service, channel, token })
}

const midiAvailable = ipcRenderer.sendSync('midi:is-available') === true
const hardwareAvailable = isServiceAvailable('hardware')
const storageAvailable = isServiceAvailable('storage')
const aiAvailable = isServiceAvailable('ai')
const networkAvailable = isServiceAvailable('network')

const electronAPI = Object.freeze({
	apiVersion: 2,
	runtime: Object.freeze({
		debug: process.argv.some(argument => argument === '--debug=true'),
		platform: process.platform,
	}),
	accessibility: Object.freeze({
		getPreferences: () => ipcRenderer.invoke('accessibility:get-preferences'),
		toggleDarkMode: () => ipcRenderer.invoke('dark-mode:toggle'),
		useSystemTheme: () => ipcRenderer.invoke('dark-mode:system'),
	}),
	midi: Object.freeze({
		available: midiAvailable,
		getPorts: () => ipcRenderer.invoke('midi:get-ports'),
		sendUMP: (portId: string, words: number[], timestamp = 0) => ipcRenderer.invoke('midi:send', { portId, words, timestamp }),
		openPortChannel: (token: string) => ipcRenderer.send('midi:open-port', { token }),
		onMessage: (callback: (message: { endpointId: string; timestamp: number; words: number[] }) => void) => subscribe('midi:message', callback),
		onPortsChanged: (callback: (ports: unknown) => void) => subscribe('midi:ports-changed', callback),
	}),
	hardware: Object.freeze({
		serial: Object.freeze({
			available: hardwareAvailable,
			openPortChannel: (token: string) => requestServicePort('hardware', 'serial', token),
		}),
	}),
	storage: Object.freeze({
		available: storageAvailable,
		openPortChannel: (token: string) => requestServicePort('storage', 'sessions', token),
		saveFile: (fileName: string, data: ArrayBuffer, mimeType?: string) =>
			ipcRenderer.invoke('storage:save-file', { fileName, data, mimeType }),
	}),
	ai: Object.freeze({
		backingMelody: Object.freeze({
			available: aiAvailable,
			openPortChannel: (token: string) => requestServicePort('ai', 'backing-melody', token),
		}),
	}),
	network: Object.freeze({
		lan: Object.freeze({
			available: networkAvailable,
			openPortChannel: (token: string) => requestServicePort('network', 'lan-timing', token),
		}),
	}),
	assets: Object.freeze({
		protocol: 'photosynth',
		baseUrl: 'photosynth://assets/',
	}),
})

contextBridge.exposeInMainWorld('electron', electronAPI)

declare global {
	interface Window {
		electron: typeof electronAPI
	}
}
