import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import pug from 'pug'
import * as sass from 'sass'
import { build } from 'esbuild'

// Native input and CSS hit testing catch failures that synthetic DOM events miss.
const profile = await mkdtemp(path.join(tmpdir(), 'photosynth-mixer-'))
const browser = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
	'--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0',
	`--user-data-dir=${profile}`, 'about:blank'
], { windowsHide: true, stdio: 'ignore' })
let socket
try {
	let port
	for (let attempt = 0; attempt < 100; attempt++) {
		try { port = (await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break }
		catch { await delay(100) }
	}
	assert.ok(port, 'Chrome did not start')
	const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
	socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl)
	await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))
	let id = 0
	const pending = new Map()
	socket.addEventListener('message', event => {
		const message = JSON.parse(event.data)
		if (pending.has(message.id)) {
			const { resolve, reject } = pending.get(message.id)
			pending.delete(message.id)
			message.error ? reject(new Error(message.error.message)) : resolve(message.result)
		}
	})
	const send = (method, params = {}) => new Promise((resolve, reject) => {
		pending.set(++id, { resolve, reject })
		socket.send(JSON.stringify({ id, method, params }))
	})
	const evaluate = async expression => {
		const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
		assert.equal(result.exceptionDetails, undefined, JSON.stringify(result.exceptionDetails))
		return result.result.value
	}
	const css = sass.compile('source/index.scss', { logger: sass.Logger.silent }).css
	const script = await build({ stdin: { contents: `
		import {setupControlsList} from './source/dom/controls-list.js';
		import {setupVolumeInterface} from './source/dom/ui.volume.js';
		window.list = setupControlsList();
		window.changes = [];
		setupVolumeInterface(.8, false, {
			currentPercussionVolume:.4, currentSampleVolume:.3, currentTrimVolume:.2,
			onVolumeChanged:value=>changes.push(['master',value]),
			onPercussionVolumeChanged:value=>changes.push(['percussion',value]),
			onSampleVolumeChanged:value=>changes.push(['sample',value]),
			onTrimVolumeChanged:value=>changes.push(['trim',value])
		});
		document.querySelectorAll('.controls').forEach(control=>control.style.opacity='1');
	`, resolveDir: process.cwd() }, bundle: true, write: false, format: 'iife' })
	const markup = pug.renderFile('source/partials/control-panel.pug')
	await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false })
	for (const view of ['compact', 'list']) {
		for (const beginner of [false, true]) {
			for (const pointer of ['mouse', 'touch']) {
				const html = `<!doctype html><html class="loaded user-active solo flag-showSettings theme-default ${beginner ? 'beginner' : ''}"><head><style>${css}</style></head><body>${markup}<script>${script.outputFiles[0].text}</script></body></html>`
				await send('Page.navigate', { url: 'about:blank' })
				const { frameTree } = await send('Page.getFrameTree')
				await send('Page.setDocumentContent', { frameId: frameTree.frame.id, html })
				for (let attempt = 0; attempt < 100 && !await evaluate('!!window.list'); attempt++) await delay(20)
				await evaluate(`document.documentElement.classList.add('a11y-reduce-motion'); ${view === 'list' ? 'list.open();' : ''} document.querySelector('[href="#folder-volume"]').${view === 'compact' ? 'focus' : 'click'}()`)
				await delay(150)
				if (view === 'compact') {
					const gap = await evaluate(`(() => { const r=document.getElementById('mixer-master-output').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2} })()`)
					if (pointer === 'mouse') {
						await send('Input.dispatchMouseEvent', {type:'mousePressed', ...gap, button:'left', clickCount:1})
						await send('Input.dispatchMouseEvent', {type:'mouseReleased', ...gap, button:'left', clickCount:1})
					} else {
						await send('Input.dispatchTouchEvent', {type:'touchStart', touchPoints:[gap]})
						await send('Input.dispatchTouchEvent', {type:'touchEnd', touchPoints:[]})
					}
					await delay(550)
				}
				for (const mode of beginner ? ['master'] : ['master', 'percussion', 'sample', 'trim']) {
					const point = await evaluate(`(() => {
						const input = document.getElementById('mixer-${mode}-volume');
						const rect = input.getBoundingClientRect();
						const x = rect.x + rect.width/2, y = rect.y + rect.height*.65;
						return {x, y, hit:document.elementFromPoint(x,y)?.id, hitMarkup:document.elementFromPoint(x,y)?.outerHTML.slice(0,200), rect:rect.toJSON(), panel:document.getElementById("folder-volume").getBoundingClientRect().toJSON(), value:input.value};
					})()`)
					const context = `${view}, beginner=${beginner}, ${pointer}, ${mode}`
					assert.equal(point.hit, `mixer-${mode}-volume`, `${context}: fader is covered: ${JSON.stringify(point)}`)
					if (pointer === 'mouse') {
						await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: point.x, y: point.y, button: 'left', clickCount: 1 })
						await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: point.x, y: point.y - 35, button: 'left', buttons: 1 })
						await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: point.x, y: point.y - 35, button: 'left', clickCount: 1 })
					} else {
						await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: point.x, y: point.y }] })
						await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: point.x, y: point.y - 35 }] })
						await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
					}
					await delay(50)
					const state = await evaluate(`({changes:window.changes, value:document.getElementById('mixer-${mode}-volume').value, visible:getComputedStyle(document.getElementById('folder-volume')).visibility})`)
					assert.equal(state.visible, 'visible', `${context}: panel closed`)
					assert.notEqual(state.value, point.value, `${context}: fader did not move`)
					assert.equal(state.changes.at(-1)?.[0], mode, `${context}: volume callback missing`)
				}
				await send('Input.dispatchKeyEvent', {type:'keyDown', key:'Escape', code:'Escape'})
				await send('Input.dispatchKeyEvent', {type:'keyUp', key:'Escape', code:'Escape'})
				await delay(550)
				const isClosed = () => evaluate(`!document.getElementById('control-panel-volume').classList.contains('open') && ${view === 'list' ? "!document.getElementById('control-panel-volume').classList.contains('controls-list-folder-open')" : "getComputedStyle(document.getElementById('folder-volume')).visibility === 'hidden'"}`)
				assert.ok(await isClosed(), 'Escape must close the mixer')
				await evaluate(`document.querySelector('[href="#folder-volume"]').click()`)
				await delay(150)
				await evaluate(`document.querySelector('#folder-volume > .folder-return').click()`)
				await delay(550)
				assert.ok(await isClosed(), 'Return must close the mixer')
				console.log(`PASS ${view}, beginner=${beginner}, ${pointer}`)
			}
		}
	}
} finally {
	socket?.close()
	browser.kill()
	await new Promise(resolve => browser.exitCode !== null ? resolve() : browser.once('exit', resolve))
	await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
}
