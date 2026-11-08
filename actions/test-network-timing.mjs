import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'
const browser = await chromium.launch({ channel: 'chrome', headless: true,
	args: ['--autoplay-policy=no-user-gesture-required'] })
const errors = []
const pages = []
const page = async url => {
	const client = await browser.newPage()
	pages.push(client)
	client.on('pageerror', error => errors.push(error.message))
	await client.goto(url)
	await client.locator('#enable-audio').click()
	assert.equal(await client.locator('#tempo-tab').getAttribute('aria-selected'), 'true')
	await client.locator('#tempo-sync-tab').click()
	return client
}
const waitState = (client, condition) => client.waitForFunction(condition, null, { timeout: 20000 })
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
try {
	const host = await page(process.env.TIMING_TEST_URL ?? 'http://localhost:9191/test.network-timing.html')
	await host.locator('#timing-room-host').click()
	await waitState(host, () => window.timingTest.timing.room.session?.getState().playing)
	const url = await host.locator('#timing-room-link').getAttribute('href')
	assert(new URL(url).searchParams.get('room'))
	for (let i = 0; i < 2; i++) {
		const follower = await page(url)
		await waitState(follower, () => window.timingTest.timing.room.session?.getState().status === 'locked')
		assert(await follower.locator('#tempo-input-text').isDisabled())
	}
	console.log('Three clients joined the shared URL and locked their clocks.')
	await delay(3000)
	const samples = await Promise.all(pages.map(client => client.evaluate(() => window.timingTest.samples)))
	const shared = samples[0].filter(sample => samples.slice(1).every(list => list.some(other => other.position === sample.position)))
	assert(shared.length > 0, 'All machines must emit the same absolute musical positions')
	const spreads = shared.map(sample => {
		const times = samples.map(list => list.find(other => other.position === sample.position).timestamp)
		return Math.max(...times) - Math.min(...times)
	})
	const maxSpread = Math.max(...spreads)
	assert(maxSpread < 30, `Scheduled output timestamps spread by ${maxSpread.toFixed(2)} ms`)
	console.log(`Maximum shared-beat timestamp spread: ${maxSpread.toFixed(2)} ms (same-computer browser test).`)
	await host.evaluate(() => window.timingTest.timing.room.setTransport({ bpm: 123, swing: 0.6 }))
	for (const client of pages) await waitState(client, () => Math.abs(window.timingTest.clock.BPM - 123) < 0.001 && window.timingTest.clock.swing === 0.6)
	console.log('All clients applied the future BPM and swing change.')
	for (const client of pages) await waitState(client, () => [...window.timingTest.timing.room.peers.values()].some(peer => peer.channel?.readyState === 'open'))
	console.log('Direct WebRTC channels established through the PartyKit handshake.')
	// Force direct connections off: signaling must also be a functioning timing transport.
	for (const client of pages) await client.evaluate(() => {
		const room = window.timingTest.timing.room
		for (const peer of room.peers.values()) room.closeRTC(peer)
	})
	await delay(1500)
	for (const client of pages) await waitState(client, () => window.timingTest.timing.room.session.getState().status === 'locked')
	console.log('WebSocket fallback retained synchronization after direct links closed.')
	await host.locator('#timing-room-pause').click()
	for (const client of pages) await waitState(client, () => !window.timingTest.timing.room.session.getState().playing)
	await delay(500)
	const counts = await Promise.all(pages.map(client => client.evaluate(() => window.timingTest.samples.length)))
	await delay(500)
	assert.deepEqual(await Promise.all(pages.map(client => client.evaluate(() => window.timingTest.samples.length))), counts)
	await host.locator('#timing-room-start').click()
	for (const client of pages) await waitState(client, () => window.timingTest.timing.room.session.getState().playing)
	await pages[1].locator('#timing-room-leave').click()
	assert(await pages[1].locator('#tempo-input-text').isEnabled())
	assert.equal(await pages[1].evaluate(() => window.timingTest.clock.isUsingExternalTrigger), false)
	await host.screenshot({ path: 'test-results/network-timing-host.png', fullPage: true })
	assert.deepEqual(errors, [])
	console.log('Pause, restart, leaving, and local-clock restoration passed; no browser errors.')
} catch (error) {
	console.error('Client states:', await Promise.all(pages.map(client => client.evaluate(() => window.timingTest?.timing.room.session?.getState()).catch(() => null))))
	throw error
} finally {
	await browser.close()
}
