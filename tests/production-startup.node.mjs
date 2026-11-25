import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { chromium } from 'playwright'

// Exercise the deployed files, including Parcel's shared and lazy bundles.
const root = resolve(process.env.PHOTOSYNTH_BUILD_DIR || 'releases/web')
await readFile(resolve(root, 'app.html'))
const origin = 'https://photosynth.test'
const speechWorker = (await readdir(root)).find(file => /^kokoro\.worker\..*\.js$/.test(file))
assert(speechWorker, 'Speech worker was not built')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' }
const browser = await chromium.launch({
	channel: process.env.PLAYWRIGHT_CHANNEL || (process.platform === 'win32' ? 'msedge' : 'chrome'),
	headless: true,
	args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required', '--enable-unsafe-swiftshader'],
})
try {
	for (const entry of ['app.html', 'index.html']) {
		const context = await browser.newContext({ permissions: ['camera'], serviceWorkers: 'block', viewport: { width: 1280, height: 900 } })
		const errors = [], messages = [], missing = [], assets = []
		await context.route('**/*', async route => {
			const url = new URL(route.request().url())
			if (url.origin !== origin) { await route.abort(); return }
			const file = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname))
			if (!file.startsWith(root + sep)) { await route.fulfill({ status: 400, body: 'Invalid path' }); return }
			try {
				let body = await readFile(file)
				// Observe completion of the actual worker entrypoint without downloading a voice model.
				if (url.pathname === '/' + speechWorker) body = Buffer.concat([body, Buffer.from('\nself.postMessage({ photosynthWorkerReady: true });')])
				assets.push(url.pathname)
				await route.fulfill({ status: 200, body, contentType: types[extname(file)] || 'application/octet-stream' })
			} catch {
				missing.push(url.pathname)
				await route.fulfill({ status: 404, body: 'Not found' })
			}
		})
		const page = await context.newPage()
		page.on('pageerror', error => errors.push(error.message))
		page.on('console', message => { if (message.type() === 'error') messages.push(message.text()) })
		try {
			await page.goto(`${origin}/${entry}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
			await page.evaluate(url => new Promise((resolve, reject) => {
				const worker = new Worker(url)
				const finish = error => {
					clearTimeout(timeout)
					worker.terminate()
					error ? reject(error) : resolve()
				}
				const timeout = setTimeout(() => finish(new Error('Speech worker startup timed out')), 30000)
				worker.onmessage = event => { if (event.data?.photosynthWorkerReady) finish() }
				worker.onerror = event => finish(new Error(`Speech worker: ${event.message}`))
			}), `${origin}/${speechWorker}`)
			await page.waitForFunction(() => document.documentElement.classList.contains('player-selection'), null, { timeout: 120000 })
			await page.locator('label[for=toggle-music-factory]').click()
			assert.equal(await page.locator('#toggle-music-factory').isChecked(), true)
			assert.match(await page.locator('#music-factory-feedback').textContent(), /all players/)
			await page.locator('label[for=button-start]').click()
			await page.waitForFunction(() => document.documentElement.classList.contains('loaded') || document.documentElement.classList.contains('failed'), null, { timeout: 120000 })
			assert.equal(await page.evaluate(() => document.documentElement.classList.contains('failed')), false)
			await page.waitForFunction(() => [...document.querySelectorAll('video')].some(video => video.videoWidth > 0 && video.srcObject?.getVideoTracks().some(track => track.readyState === 'live')), null, { timeout: 30000 })
			assert.equal(await page.locator('#button-music-factory').isChecked(), true)
			assert(assets.some(path => path.endsWith('.task')), 'Motion capture model was not loaded')
			assert(assets.some(path => path.endsWith('.wasm')), 'Motion capture WASM was not loaded')
			assert.deepEqual(errors, [], `${entry}: browser errors`)
			assert.deepEqual(missing, [], `${entry}: missing production assets`)
			console.log(`PASS: ${entry} loads its production bundles, onboarding, music factory, speech worker, motion capture model and live camera`)
		} catch (error) {
			console.error(JSON.stringify({ entry, errors, messages, missing, classes: await page.evaluate(() => document.documentElement.className) }, null, 2))
			throw error
		} finally {
			await context.close()
		}
	}
} finally {
	await browser.close()
}
