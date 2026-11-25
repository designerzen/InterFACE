import { app, autoUpdater, BrowserWindow, dialog, net, shell } from 'electron'
import log from 'electron-log'
import { createUpdateController } from './update-controller.js'

const REPOSITORY = 'designerzen/InterFACE'
const RELEASES_URL = `https://github.com/${REPOSITORY}/releases/latest`
const FEED_ROOT = 'https://interface.place/updates'
let checkForUpdates = async (_manual = false) => {}

export const requestUpdateCheck = () => checkForUpdates(true)

export const initializeUpdates = (getMainWindow:() => BrowserWindow|null) => {
	if (!app.isPackaged) {
		checkForUpdates = async () => {
			await dialog.showMessageBox({ type: 'info', message: 'Updates are available in installed builds of PhotoSYNTH.' })
		}
		return
	}

	const canInstall = ['win32', 'darwin'].includes(process.platform)
	if (canInstall) {
		autoUpdater.setFeedURL({
			url: `${FEED_ROOT}/${process.platform}/${process.arch}${process.platform === 'darwin' ? '/RELEASES.json' : ''}`,
			serverType: process.platform === 'darwin' ? 'json' : 'default',
			headers: { 'User-Agent': `PhotoSYNTH/${app.getVersion()}` },
		})
	}
	let progressWindow:BrowserWindow|null = null
	const closeProgress = () => {
		const parent = getMainWindow()
		if (parent && !parent.isDestroyed()) parent.setProgressBar(-1)
		progressWindow?.destroy()
		progressWindow = null
	}
	const showMessage = async (options:Electron.MessageBoxOptions) => {
		const parent = getMainWindow()
		return parent && !parent.isDestroyed() ? dialog.showMessageBox(parent, options) : dialog.showMessageBox(options)
	}
	const controller = createUpdateController({
		updater: autoUpdater,
		currentVersion: app.getVersion(),
		canInstall,
		logger: log,
		getRelease: async () => {
			const response = await net.fetch(`https://api.github.com/repos/${REPOSITORY}/releases/latest`, {
				headers: { Accept: 'application/vnd.github+json', 'User-Agent': `PhotoSYNTH/${app.getVersion()}` },
				signal: AbortSignal.timeout(15000),
				cache: 'no-store',
			})
			if (!response.ok) throw new Error(`GitHub update check: HTTP ${response.status}`)
			const release = await response.json()
			if (typeof release?.tag_name !== 'string') throw new Error('Invalid GitHub release response')
			return release
		},
		ui: {
			closeProgress,
			confirm: async (title:string, detail:string, action:string, cancel:string) => {
				const { response } = await showMessage({ type: 'info', title, message: title, detail, buttons: [action, cancel], defaultId: 0, cancelId: 1, noLink: true })
				return response === 0
			},
			message: async (title:string, detail:string) => { await showMessage({ type: 'info', title, message: title, detail }) },
			openDownloads: () => shell.openExternal(RELEASES_URL),
			showProgress: (title:string, detail:string) => {
				closeProgress()
				const parent = getMainWindow()
				progressWindow = new BrowserWindow({
					width: 460, height: 270, resizable: false, minimizable: false, maximizable: false,
					parent: parent && !parent.isDestroyed() ? parent : undefined,
					modal: true, title: 'PhotoSYNTH Update', show: false, backgroundColor: '#171828',
					webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false, javascript: false },
				})
				const window = progressWindow
				// Closing the window hides it; it must not unlock a transfer that is still running.
				window.on('close', event => { event.preventDefault(); window.hide() })
				window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
				window.webContents.on('will-navigate', event => event.preventDefault())
				window.once('ready-to-show', () => { if (!window.isDestroyed()) window.show() })
				if (parent && !parent.isDestroyed()) parent.setProgressBar(2)
				const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'"><title>PhotoSYNTH Update</title>
				<style>body{margin:0;padding:32px;font:16px system-ui,sans-serif;color:#f6f4ff;background:#171828}h1{font-size:22px;margin:0 0 12px}p{line-height:1.5;color:#cbc8df}.track{height:7px;background:#35334b;border-radius:10px;overflow:hidden;margin-top:24px}.bar{height:100%;width:38%;background:#b7a1ff;border-radius:10px;animation:slide 1.4s ease-in-out infinite}@keyframes slide{from{transform:translateX(-110%)}to{transform:translateX(370%)}}@media(prefers-reduced-motion:reduce){.bar{animation:none;width:100%}}</style>
				<h1>${title}</h1><p role="status">${detail}</p><div class="track" role="progressbar" aria-label="Update in progress"><div class="bar"></div></div></html>`
				void window.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`).catch(error => log.warn('Update progress window failed', error))
			},
		},
	})
	checkForUpdates = controller.check
	// Squirrel holds an installation lock briefly on the first Windows launch.
	const startupTimer = setTimeout(() => { void controller.check() }, process.argv.includes('--squirrel-firstrun') ? 30000 : 3000)
	const interval = setInterval(() => { void controller.check() }, 60 * 60 * 1000)
	const stop = () => {
		clearTimeout(startupTimer)
		clearInterval(interval)
		controller.stop()
	}
	app.once('before-quit', stop)
	autoUpdater.once('before-quit-for-update', stop)
}
