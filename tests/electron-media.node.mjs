import assert from 'node:assert/strict'
import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { _electron } from 'playwright'

const executablePath = resolve(process.env.PHOTOSYNTH_ELECTRON_EXECUTABLE || 'releases/PhotoSYNTH-win32-x64/PhotoSYNTH.exe')
const profile = await mkdtemp(join(tmpdir(), 'photosynth-media-'))
const app = await _electron.launch({
	executablePath,
	args: [`--user-data-dir=${profile}`, '--use-fake-device-for-media-stream', '--enable-unsafe-swiftshader'],
	env: Object.fromEntries(Object.entries(process.env).filter(([key]) => key !== 'ELECTRON_RUN_AS_NODE')),
	timeout: 60000,
})
try {
	const page = await app.firstWindow()
	await app.evaluate(({ BrowserWindow }) => {
		for (const window of BrowserWindow.getAllWindows()) {
			window.webContents.setBackgroundThrottling(false)
			window.show()
			window.focus()
		}
	})
	await app.context().route('https://interface.place/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Media permissions</title>' }))
	await page.goto('https://interface.place/app.html')
	assert.equal(await app.evaluate(({ app }) => app.isPackaged), true)
	const expectedIcon = createHash('sha256').update(await readFile('static/icons/png/512x512.png')).digest('hex')
	const resourcesPath = await app.evaluate(() => process.resourcesPath)
	const packagedIcon = createHash('sha256').update(await readFile(join(resourcesPath, '512x512.png'))).digest('hex')
	assert.equal(packagedIcon, expectedIcon, 'Packaged app must contain the PhotoSYNTH logo')

	assert.equal(await page.evaluate(() => typeof window.electron?.midi?.getPorts), 'function')
	assert.equal(typeof (await page.evaluate(() => window.electron.accessibility.getPreferences())).shouldUseDarkColors, 'boolean')
	const tracks = await page.evaluate(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
		try {
			return stream.getTracks().map(track => ({ kind: track.kind, state: track.readyState }))
		} finally {
			stream.getTracks().forEach(track => track.stop())
		}
	})
	assert.deepEqual(tracks.map(track => track.kind).sort(), ['audio', 'video'])
	assert(tracks.every(track => track.state === 'live'))
	await app.context().route('https://untrusted.invalid/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Untrusted origin</title>' }))
	const denied = await app.evaluate(async ({ BrowserWindow }) => {
		const window = new BrowserWindow({ show: false, webPreferences: { sandbox: true, contextIsolation: true } })
		try {
			await window.loadURL('https://untrusted.invalid/')
			return await window.webContents.executeJavaScript(`(async () => {
				try {
					const stream = await navigator.mediaDevices.getUserMedia({ video: true });
					stream.getTracks().forEach(track => track.stop());
					return 'allowed';
				} catch (error) { return error.name; }
			})()`)
		} finally { window.destroy() }
	})
	assert.equal(denied, 'NotAllowedError')
	console.log('PASS: packaged PhotoSYNTH logo, Electron preload, IPC, live camera and microphone; untrusted origin denied')
} finally {
	await app.close()
}
