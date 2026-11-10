import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import pug from 'pug'
import { build } from 'esbuild'

const script = await build({
	stdin: { contents: `import { setupTempoInterface } from './source/dom/ui.tempo.js'; setupTempoInterface({BPM:97,swing:0,totalBars:4},{},{},()=>{},()=>{});`, resolveDir: process.cwd() },
	bundle: true, write: false, format: 'iife',
	plugins: [{ name: 'tempo-dependencies', setup(builder) {
		builder.onResolve({ filter: /^(netronome|.*hardware\/mouse.js)$/ }, args => ({ path: args.path, namespace: 'stub' }))
		builder.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: `export const tapTempo=()=>()=>({available:false}); export const TIMER_TYPE_ROLLING=0,TIMER_TYPE_SET_INTERVAL=1,TIMER_TYPE_SET_TIMEOUT=2,MOUSE_REPEATING='repeat'; export const addMouseRepeaterEvents=()=>{};` }))
	} }]
})

for (const tab of ['tempo-tab', 'tempo-sync-tab']) {
	test(`${tab} closes, restores focus, reopens and closes with Escape`, () => {
		const dom = new JSDOM(`<menu id="control-panel"><div class="folder-menu"><a class="folder-link" href="#folder-tempo">Tempo</a><menu id="folder-tempo">${pug.renderFile('source/partials/tempo-panel.pug')}<a class="folder-return" href="#control-panel">Return to the control menu</a></menu></div></menu><input id="timing-step">`, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true })
		const { window } = dom, { document } = window
		const timerToggle = document.createElement('input')
		timerToggle.id = 'timer-toggle'
		document.body.append(timerToggle)
		window.eval(script.outputFiles[0].text)
		const launcher = document.querySelector('.folder-link'), folder = document.querySelector('.folder-menu')
		launcher.click()
		document.getElementById(tab).focus()
		window.history.replaceState(null, '', '#folder-tempo')
		document.querySelector('.folder-return').click()
		assert.equal(folder.classList.contains('open'), false)
		assert.equal(folder.classList.contains('tempo-dismissed'), true)
		assert.equal(launcher.getAttribute('aria-expanded'), 'false')
		assert.equal(document.activeElement, launcher)
		assert.notEqual(window.location.hash, '#folder-tempo')
		launcher.click()
		assert.equal(folder.classList.contains('open'), true)
		assert.equal(folder.classList.contains('tempo-dismissed'), false)
		document.getElementById(tab).dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
		assert.equal(folder.classList.contains('open'), false)
		assert.equal(document.activeElement, launcher)
		dom.window.close()
	})
}

test('advertised tempo hotkeys work in the panel and preserve input editing', () => {
	const dom = new JSDOM(`<menu id="control-panel"><div class="folder-menu"><a class="folder-link" href="#folder-tempo">Tempo</a><menu id="folder-tempo">${pug.renderFile('source/partials/tempo-panel.pug')}<a class="folder-return" href="#control-panel">Return</a></menu></div></menu><input id="timing-step"><input id="timer-toggle">`, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true })
	const { window } = dom, { document } = window
	window.eval(script.outputFiles[0].text)
	document.querySelector('.folder-link').click()
	const field = document.getElementById('tempo-input-text')
	const tap = document.getElementById('tempo-tap-button')
	const press = (target, key, options = {}) => {
		const event = new window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options })
		target.dispatchEvent(event)
		return event
	}
	assert.equal(press(tap, 'ArrowRight').defaultPrevented, true)
	assert.equal(field.value, '98')
	press(tap, 'ArrowLeft')
	assert.equal(field.value, '97')
	assert.equal(press(field, 'ArrowRight').defaultPrevented, false)
	assert.equal(field.value, '97')
	let taps = 0
	tap.addEventListener('click', () => taps++)
	press(tap, 'x')
	press(tap, 'x', { repeat: true })
	assert.equal(taps, 1)
	dom.window.close()
})
