import { contextBridge, ipcRenderer } from 'electron'

type Disposer = () => void

const subscribe = (channel:string, callback:(...args:any[]) => void):Disposer => {
	const listener = (_event:Electron.IpcRendererEvent, ...args:any[]) => callback(...args)
	ipcRenderer.on(channel, listener)
	return () => ipcRenderer.removeListener(channel, listener)
}

const electronAPI = Object.freeze({
	runtime: Object.freeze({
		debug: process.argv.some(argument => argument === '--debug=true'),
		platform: process.platform,
	}),
	midi: Object.freeze({
		available: ipcRenderer.sendSync('midi:is-available') === true,
		getPorts: () => ipcRenderer.invoke('midi:get-ports'),
		sendUMP: (portId:string, words:number[], timestamp = 0) => ipcRenderer.invoke('midi:send', { portId, words, timestamp }),
		onMessage: (callback:(message:{endpointId:string;timestamp:number;words:number[]}) => void) => subscribe('midi:message', callback),
		onPortsChanged: (callback:(ports:unknown) => void) => subscribe('midi:ports-changed', callback),
	}),
})

contextBridge.exposeInMainWorld('electron', electronAPI)

declare global {
	interface Window {
		electron: typeof electronAPI
	}
}
