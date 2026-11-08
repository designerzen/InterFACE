import assert from 'node:assert/strict'
import { readFile, mkdir, copyFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { createRequire } from 'node:module'
import parcel from '@parcel/core'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const root = resolve('test-results/direct-room-build')
await new parcel.Parcel({
	entries: 'source/test.network-timing.pug', config: './tests/direct-room.parcelrc',
	targets: { default: { distDir: root, context: 'browser', publicUrl: './', isLibrary: false, sourceMap: false, scopeHoist: false } },
	mode: 'production', shouldDisableCache: true, shouldAutoInstall: false,
}).run()
await mkdir(resolve(root, 'zxing'), { recursive: true })
await copyFile('node_modules/zxing-wasm/dist/reader/zxing_reader.wasm', resolve(root, 'zxing/zxing_reader.wasm'))
const origin = 'https://photosynth.test'
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' })
const errors = [], requests = []
const contexts = []
const createPage = async path => {
	const context = await browser.newContext()
	contexts.push(context)
	await context.route('**/*', async route => {
		const url = new URL(route.request().url())
		requests.push(url.href)
		if (url.origin !== origin) { await route.abort(); return }
		const file = resolve(root, '.' + decodeURIComponent(url.pathname))
		if (!file.startsWith(root + sep)) { await route.abort(); return }
		try {
			const body = await readFile(file)
			await route.fulfill({ status: 200, body, contentType: ({ '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.wasm':'application/wasm', '.svg':'image/svg+xml' })[extname(file)] || 'application/octet-stream' })
		} catch { await route.fulfill({ status: 404, body: '' }) }
	})
	const page = await context.newPage()
	page.on('pageerror', error => errors.push(error.message))
	await page.goto(origin + path)
	await page.waitForFunction(() => window.timingTest)
	await page.locator('#audible').uncheck()
	await page.locator('#enable-audio').click()
	await page.locator('#tempo-sync-tab').click()
	return page
}
const waitLocked = async page => page.waitForFunction(() => {
	const room = window.timingTest.timing.room
	return room.session?.getState().peers.some(peer => peer.locked)
}, undefined, { timeout: 15000 })
try {
	const host = await createPage('/test.network-timing.html')
	await host.locator('#timing-room-id').fill('browser-room')
	await host.locator('#timing-room-host').click()
	await host.locator('#timing-room-share:not([hidden]) svg').waitFor()
	const invitation = await host.locator('#timing-room-link').getAttribute('href')
	const guest = await createPage(invitation.slice(origin.length))
	await guest.locator('#timing-room-share:not([hidden]) svg').waitFor()
	const answer = await guest.locator('#timing-room-link').getAttribute('href')
	await host.locator('#timing-room-pairing').fill(answer)
	await host.locator('#timing-room-join').click()
	await Promise.all([waitLocked(host), waitLocked(guest)])
	assert.equal(await guest.evaluate(() => document.querySelector('.form-tempo').disabled), true)
	assert.deepEqual(await host.evaluate(() => window.timingTest.timing.room.rtcConfig.iceServers), [])
	console.log('PASS: invitation URL and answer import establish real WebRTC timing across browser contexts')

	await host.locator('#timing-room-invite').click()
	await host.locator('#timing-room-share:not([hidden]) svg').waitFor()
	const invitationImage = await host.locator('#timing-room-qr').screenshot()
	const second = await createPage('/test.network-timing.html')
	await second.locator('#timing-room-image').setInputFiles({ name: 'invitation.png', mimeType: 'image/png', buffer: invitationImage })
	await second.locator('#timing-room-share:not([hidden]) svg').waitFor({ timeout: 15000 })
	const responseImage = await second.locator('#timing-room-qr').screenshot()
	await host.locator('#timing-room-image').setInputFiles({ name: 'response.png', mimeType: 'image/png', buffer: responseImage })
	await host.waitForFunction(() => window.timingTest.timing.room.session.getState().peers.filter(p => p.locked).length === 2, undefined, { timeout: 15000 })
	await waitLocked(second)
	console.log('PASS: invitation and response QR images decode with the locally bundled WASM reader; two guests synchronize')

	await host.evaluate(() => window.timingTest.timing.room.setTransport({ bpm: 123, swing: .3 }))
	for (const page of [host, guest, second]) {
		await page.waitForFunction(() => Math.abs(window.timingTest.clock.BPM - 123) < .001 && Math.abs(window.timingTest.clock.swing - .3) < .001, undefined, { timeout: 10000 })
	}
	for (const page of [host, guest, second]) {
		await page.waitForFunction(() => window.timingTest.samples.filter(sample => Math.abs(sample.bpm - 123) < .001).length >= 4, undefined, { timeout: 15000 })
	}
	const samples = await Promise.all([host, guest, second].map(page => page.evaluate(() => window.timingTest.samples.filter(sample => Math.abs(sample.bpm - 123) < .001))))
	const spreads = samples[0].flatMap(sample => {
		const matching = samples.slice(1).map(peer => peer.find(candidate => candidate.position === sample.position))
		if (matching.some(value => !value)) return []
		const timestamps = [sample, ...matching].map(value => value.timestamp)
		return [Math.max(...timestamps) - Math.min(...timestamps)]
	})
	assert.ok(spreads.length >= 3, 'Not enough matching scheduled beats to assess synchronization')
	const worstSpread = Math.max(...spreads)
	assert.ok(worstSpread < 30, `Scheduled beats differ by ${worstSpread.toFixed(2)} ms across devices`)
	console.log(`PASS: ${spreads.length} matching beats at 123 BPM; maximum scheduled-time spread ${worstSpread.toFixed(2)} ms across host and two guests`)
	await host.locator('#timing-room-pause').click()
	for (const page of [host, guest, second]) await page.waitForFunction(() => window.timingTest.timing.room.session.getState().playing === false, undefined, { timeout: 10000 })
	await host.locator('#timing-room-start').click()
	for (const page of [host, guest, second]) await page.waitForFunction(() => window.timingTest.timing.room.session.getState().playing === true, undefined, { timeout: 10000 })
	console.log('PASS: BPM, swing, pause, and start propagate through the real Netronome audio scheduler')

	await second.locator('#timing-room-leave').click()
	await host.waitForFunction(() => window.timingTest.timing.room.peers.size === 1)
	await host.locator('#timing-room-leave').click()
	await guest.waitForFunction(() => window.timingTest.timing.room.peers.size === 0)
	assert.equal(await host.evaluate(() => window.timingTest.clock.networkTimingActive), false)
	assert.equal(await guest.evaluate(() => document.querySelector('.form-tempo').disabled), true)
	await guest.locator('#timing-room-leave').click()
	assert.equal(await guest.evaluate(() => document.querySelector('.form-tempo').disabled), false)
	assert.equal(errors.length, 0, errors.join('\n'))
	assert.equal(requests.every(url => url.startsWith(origin)), true, 'Unexpected external network request')
	assert.equal(requests.some(url => url.includes('.wasm')), true)
	console.log('PASS: disconnect and leave clean up connections; local controls restore; no external HTTP requests or browser errors')
} catch (error) {
	for (const context of contexts) for (const page of context.pages()) {
		console.error(await page.evaluate(() => ({ url: location.href.split('#')[0], status: document.getElementById('timing-room-status')?.textContent,
			bpm: window.timingTest?.clock.BPM, swing: window.timingTest?.clock.swing, state: window.timingTest?.timing.room.session?.getState() })))
	}
	console.error('Browser errors:', errors)
	console.error('Recent requests:', requests.slice(-12))
	throw error
} finally {
	for (const context of contexts) await context.close()
	await browser.close()
}
