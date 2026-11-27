// Modules to control application life and create native browser window
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

import windowStateKeeper from 'electron-window-state'
import electron from 'electron'
import { app, BrowserWindow, nativeTheme, desktopCapturer, dialog, protocol, shell, ipcMain } from 'electron'

import log from 'electron-log'
import { initializeUpdates } from './updates.ts'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { isElectronDevMode } from './electron-utils.ts'
import './menu.ts'

import { destroyMIDI, registerMIDI } from './midi.ts'
import { APP_PROTOCOL_ORIGIN, getAppProtocolSchemes, registerAppProtocol } from './services/protocol.ts'
import { UtilitySupervisor, type UtilityServiceName } from './services/utility-supervisor.ts'

if (require('electron-squirrel-startup')) app.quit()

// Must run before app.whenReady()
protocol.registerSchemesAsPrivileged(getAppProtocolSchemes())

const IS_DEVELOPMENT_MODE = is.dev || isElectronDevMode(electron)

export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = (!app.isPackaged && (process.argv[2] === '--enable-logging' || process.argv[2] === '--debug')) || IS_DEVELOPMENT_MODE

const isKiosk = process.argv[2] === '--kiosk' ?? false

const APP_ROOT = isDevelopment
	? path.resolve('dist-electron')
	: path.join(app.getAppPath(), 'dist-electron')

const PRELOADER_PATH = path.join(APP_ROOT, 'electron/preload.js')
const SERVICES_DIR = path.join(APP_ROOT, 'electron/services')
const LOCAL_RENDERER_DIR = path.join(APP_ROOT, 'main')
const LOCAL_RENDERER_ENTRY = path.join(LOCAL_RENDERER_DIR, 'app.html')
const STATIC_DIR = app.isPackaged
	? path.join(process.resourcesPath, 'static')
	: path.resolve('static')
const APP_ICON = app.isPackaged
	? path.join(process.resourcesPath, '512x512.png')
	: path.resolve('static/icons/png/512x512.png')

const WEB_APP_URL = 'https://interface.place/app.html'
const LOCAL_APP_URL = `${APP_PROTOCOL_ORIGIN}/app.html`
const TRUSTED_RENDERER_ORIGINS = new Set([
	new URL(WEB_APP_URL).origin,
	APP_PROTOCOL_ORIGIN,
	'http://localhost:303',
])

const isTrustedRendererUrl = (value: string) => {
	try {
		return TRUSTED_RENDERER_ORIGINS.has(new URL(value).origin)
	} catch {
		return false
	}
}

const PICADE_MAX_USB_IDS = [
	{ vendorId: 0x2e8a, productId: 0x1098 },
	{ vendorId: 0xcafe, productId: 0x400d },
]
const isPicadeMaxUsbDevice = (device: any) =>
	PICADE_MAX_USB_IDS.some(id =>
		device?.vendorId === id.vendorId && device?.productId === id.productId
	)

const VALID_UTILITY_SERVICES = new Set<UtilityServiceName>(['hardware', 'storage', 'ai', 'network'])
const supervisor = new UtilitySupervisor(log)

let mainWindow: BrowserWindow | null = null
let servicesRegistered = false

const quit = () => {
	app.quit()
}

if (!app.requestSingleInstanceLock()) {
	quit()
}

const registerUtilityServices = () => {
	if (servicesRegistered) return
	servicesRegistered = true

	const storageDir = path.join(app.getPath('userData'), 'sessions')
	const cacheDir = path.join(app.getPath('userData'), 'asset-cache')

	supervisor.register({
		name: 'hardware',
		modulePath: path.join(SERVICES_DIR, 'hardware-worker.js'),
	})
	supervisor.register({
		name: 'storage',
		modulePath: path.join(SERVICES_DIR, 'storage-worker.js'),
		env: { PHOTOSYNTH_STORAGE_DIR: storageDir },
	})
	supervisor.register({
		name: 'ai',
		modulePath: path.join(SERVICES_DIR, 'ai-worker.js'),
		env: { PHOTOSYNTH_STATIC_DIR: STATIC_DIR },
	})
	supervisor.register({
		name: 'network',
		modulePath: path.join(SERVICES_DIR, 'lan-timing-worker.js'),
	})

	registerAppProtocol({
		rendererRoot: LOCAL_RENDERER_DIR,
		staticRoot: STATIC_DIR,
		cacheRoot: cacheDir,
	})

	ipcMain.on('service:is-available', (event, serviceName: string) => {
		event.returnValue = VALID_UTILITY_SERVICES.has(serviceName as UtilityServiceName)
			&& supervisor.isAvailable(serviceName as UtilityServiceName)
	})

	ipcMain.on('service:open-port', (event, payload: { service?: string; channel?: string; token?: string }) => {
		const url = event.sender.getURL()
		if (!isTrustedRendererUrl(url)) return
		const service = payload?.service as UtilityServiceName
		if (!VALID_UTILITY_SERVICES.has(service) || !payload?.channel || !payload?.token) return
		supervisor.openChannel(service, event.sender, String(payload.channel), String(payload.token))
	})

	ipcMain.handle('storage:save-file', async (event, payload: { fileName?: string; data?: ArrayBuffer | Uint8Array; mimeType?: string }) => {
		if (!isTrustedRendererUrl(event.sender.getURL())) {
			throw new Error('Untrusted renderer origin')
		}
		const safeName = path.basename(String(payload?.fileName || 'photosynth-export.bin'))
		const parent = BrowserWindow.fromWebContents(event.sender) ?? mainWindow ?? undefined
		const ext = path.extname(safeName).replace(/^\./, '')
		const saveOptions: Electron.SaveDialogOptions = {
			title: 'Save PhotoSYNTH export',
			defaultPath: path.join(app.getPath('downloads'), safeName),
			filters: ext ? [{ name: ext.toUpperCase(), extensions: [ext] }, { name: 'All Files', extensions: ['*'] }] : undefined,
		}
		const result = parent
			? await dialog.showSaveDialog(parent, saveOptions)
			: await dialog.showSaveDialog(saveOptions)
		if (result.canceled || !result.filePath) {
			return { saved: false, canceled: true }
		}
		const raw = payload?.data
		const bytes = raw instanceof ArrayBuffer
			? Buffer.from(raw)
			: ArrayBuffer.isView(raw)
				? Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength)
				: Buffer.alloc(0)
		await fsp.writeFile(result.filePath, bytes)
		return { saved: true, canceled: false, filePath: result.filePath }
	})
}

const showVirtualMIDIPortUnavailableError = (_message: string, _title = 'Oh no!') => {}

function recordWindow() {
	desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
		for (const source of sources) {
			if (mainWindow && source.name === 'Electron') {
				mainWindow.webContents.send('SET_SOURCE', source.id)
				return
			}
		}
	})
}

function createWindow() {
	let interval: any

	const mainWindowState = windowStateKeeper({
		defaultWidth: 1024,
		defaultHeight: 920,
	})

	mainWindow = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		show: false,
		minWidth: 320,
		accessibleTitle: 'PhotoSYNTH face controlled musical instrument',
		minHeight: 300,
		backgroundColor: '#e4dede',
		kiosk: isKiosk,
		icon: APP_ICON,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			nodeIntegrationInWorker: false,
			sandbox: true,
			preload: PRELOADER_PATH,
			autoplayPolicy: 'no-user-gesture-required',
		},
	})

	mainWindowState.manage(mainWindow)

	mainWindow.webContents.setWindowOpenHandler(details => {
		let targetOrigin = ''
		try {
			targetOrigin = new URL(details.url).origin
		} catch {}

		if (details.url !== 'about:blank' && !TRUSTED_RENDERER_ORIGINS.has(targetOrigin)) {
			void shell.openExternal(details.url)
			return { action: 'deny' }
		}

		switch (details.url) {
			case 'about:blank':
				return {
					action: 'allow',
					overrideBrowserWindowOptions: {
						frame: true,
						fullscreenable: false,
						backgroundColor: 'black',
						webPreferences: {},
					},
				}
			default:
				return {
					action: 'allow',
					overrideBrowserWindowOptions: {
						frame: false,
						fullscreenable: true,
						backgroundColor: 'black',
						webPreferences: {},
					},
				}
		}
	})

	mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
		let targetOrigin = ''
		try {
			targetOrigin = new URL(navigationUrl).origin
		} catch {}
		if (TRUSTED_RENDERER_ORIGINS.has(targetOrigin)) return
		event.preventDefault()
		void shell.openExternal(navigationUrl)
	})

	mainWindow.webContents.session.setPermissionRequestHandler((_webContents, permission, callback, details) => {
		if (isTrustedRendererUrl(details.requestingUrl) && (permission === 'media' || permission === 'midi' || permission === 'midiSysex' || permission === 'serial')) {
			callback(true)
		} else {
			callback(false)
		}
	})

	mainWindow.webContents.session.setPermissionCheckHandler((_webContents, permission, requestingOrigin) => {
		if (isTrustedRendererUrl(requestingOrigin) && (permission === 'media' || permission === 'midi' || permission === 'midiSysex' || permission === 'serial')) {
			return true
		}
		return false
	})

	mainWindow.webContents.session.setDevicePermissionHandler(details => {
		if (!isTrustedRendererUrl(details.origin) || details.deviceType !== 'serial') {
			return false
		}
		const device = details.device
		if (!device) return false
		return isPicadeMaxUsbDevice(device)
	})

	mainWindow.webContents.session.on('select-serial-port', (event, portList, webContents, callback) => {
		event.preventDefault()
		if (!isTrustedRendererUrl(webContents.getURL())) {
			callback('')
			return
		}
		const picadePort = portList.find((port: any) => isPicadeMaxUsbDevice(port))
		if (picadePort) {
			log.info(`Auto-selecting Picade Max serial device ${picadePort.portId}`)
			callback(picadePort.portId)
			return
		}
		if (portList.length === 1) {
			log.info(`Auto-selecting sole serial device ${portList[0].portId}`)
			callback(portList[0].portId)
			return
		}
		log.warn(`No matching Picade Max serial device found. ${portList.length} serial ports available.`)
		callback('')
	})

	ipcMain.removeAllListeners('feedback')
	ipcMain.removeAllListeners('show-dialog')
	ipcMain.removeHandler('dark-mode:toggle')
	ipcMain.removeHandler('accessibility:get-preferences')
	ipcMain.removeHandler('dark-mode:system')

	ipcMain.on('feedback', (_event, state) => {
		console.log('FEEDBACK>', state)
		clearInterval(interval)
		showVirtualMIDIPortUnavailableError('Virtual MIDI Port cannot be created.', 'Virtual MIDI Port cannot be created')
	})

	ipcMain.on('show-dialog', (_event, message) => {
		showVirtualMIDIPortUnavailableError(message)
	})

	ipcMain.handle('dark-mode:toggle', () => {
		nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark'
		return nativeTheme.shouldUseDarkColors
	})

	ipcMain.handle('accessibility:get-preferences', () => ({
		shouldUseDarkColors: nativeTheme.shouldUseDarkColors,
		shouldUseHighContrastColors: nativeTheme.shouldUseHighContrastColors,
		shouldUseInvertedColorScheme: nativeTheme.shouldUseInvertedColorScheme,
		accessibilitySupportEnabled: app.isAccessibilitySupportEnabled(),
	}))

	ipcMain.handle('dark-mode:system', () => {
		nativeTheme.themeSource = 'system'
	})

	mainWindow.once('ready-to-show', () => {
		mainWindow?.show()
		mainWindow?.moveTop()
		mainWindow?.focus()
	})

	mainWindow.on('closed', () => {
		clearInterval(interval)
		mainWindow = null
		destroyMIDI()
	})

	if (isDevelopment) {
		const devUrl = 'http://localhost:303/app.html'
		let retryTimer: ReturnType<typeof setTimeout> | null = null
		const loadDevUrl = () => {
			if (!mainWindow || mainWindow.isDestroyed()) return
			void mainWindow.loadURL(devUrl).catch(() => {
				if (!mainWindow || mainWindow.isDestroyed()) return
				retryTimer = setTimeout(loadDevUrl, 500)
			})
		}
		mainWindow.once('closed', () => {
			if (retryTimer) clearTimeout(retryTimer)
		})
		mainWindow.webContents.once('dom-ready', () => {
			mainWindow?.webContents.openDevTools()
		})
		loadDevUrl()
	} else if (fs.existsSync(LOCAL_RENDERER_ENTRY)) {
		mainWindow.loadURL(LOCAL_APP_URL)
	} else {
		mainWindow.loadURL(WEB_APP_URL)
	}

	registerMIDI(mainWindow, ipcMain)
}

function focusOrCreateMainWindow() {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
		return
	}

	if (mainWindow && !mainWindow.isDestroyed()) {
		if (process.platform === 'linux' && !mainWindow.isFocused()) {
			const win = mainWindow
			mainWindow = null
			win.once('closed', () => focusOrCreateMainWindow())
			win.destroy()
			return
		}
		mainWindow.show()
		if (mainWindow.isMinimized()) {
			mainWindow.restore()
		}
		mainWindow.moveTop()
		mainWindow.focus()
	}
}

app.whenReady().then(() => {
	electronApp.setAppUserModelId('place.interface.photosynth')
	registerUtilityServices()

	if (mainWindow === null) {
		focusOrCreateMainWindow()
	}
	initializeUpdates(() => mainWindow)

	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	app.on('activate', () => {
		focusOrCreateMainWindow()
	})

	app.on('second-instance', () => {
		focusOrCreateMainWindow()
	})
})

app.on('before-quit', () => {
	destroyMIDI()
	supervisor.stopAll()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') quit()
})

if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', data => {
			if (data === 'graceful-exit') quit()
		})
	} else {
		process.on('SIGTERM', () => quit())
	}
}
