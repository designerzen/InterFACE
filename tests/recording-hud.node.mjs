import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import pug from 'pug'
import { build } from 'esbuild'

const script = await build({
	stdin: { contents: `import { setupSessionRecordingUI } from './source/dom/ui.session-recording.js';
		import { createInputStatusOverlay } from './source/dom/ui.input-status.js';
		window.setupSessionRecordingUI = setupSessionRecordingUI; window.createInputStatusOverlay = createInputStatusOverlay`, resolveDir: process.cwd() },
	bundle: true, write: false, format: 'iife',
	plugins: [{ name: 'recording-storage', setup(builder) {
		builder.onResolve({ filter: /storage\/session-recorder.js$/ }, () => ({ path: 'storage', namespace: 'stub' }))
		builder.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: `export const recoverSessionManifests = async () => [];
			export const readSessionMedia = async () => new Blob(); export const readSessionOrphan = async () => new Blob();` }))
	} }],
})

test('HUD reflects media recording, elapsed time, MIDI capture and stopping while respecting visibility', async () => {
	const dom = new JSDOM(`<aside hidden><ul id="input-status-list"></ul></aside>${pug.renderFile('source/partials/transport-panel.pug')}`, {
		url: 'https://interface.place/', runScripts: 'outside-only',
	})
	const { window } = dom
	window.document.getElementById('transport').hidden = false
	window.document.querySelector('.transport-session-controls').hidden = true
	window.eval(script.outputFiles[0].text)
	const list = window.document.getElementById('input-status-list')
	const overlay = window.createInputStatusOverlay(list)
	const state = { recording: false, midi: false, durationMs: 0 }
	const controller = { state: () => state, setAuto: async () => {}, flush: async () => {}, pauseReplay() {} }
	const errors = []
	const ui = window.setupSessionRecordingUI(controller, error => errors.push(error), window.document, overlay)
	try {
		await new Promise(resolve => setTimeout(resolve, 0))
		assert.deepEqual(errors, [])
		assert.equal(list.children.length, 0)
		state.recording = state.midi = true
		state.durationMs = 12000
		ui.update()
		assert.equal(list.parentElement.hidden, false)
		assert.equal(list.firstElementChild.dataset.type, 'recording')
		assert.equal(list.querySelector('.input-status-detail').textContent, 'Recording · 00:12')
		state.durationMs = 65000
		ui.update()
		const menu = window.document.querySelector('.transport-session-controls')
		const time = window.document.getElementById('session-recording-duration')
		assert.equal(menu.hidden, true)
		assert.equal(time.textContent, '00:00')
		assert.equal(time.getAttribute('datetime'), 'PT0S')
		menu.hidden = false
		ui.update()
		assert.equal(time.textContent, '01:05')
		assert.equal(time.getAttribute('datetime'), 'PT65S')
		menu.hidden = true
		assert.equal(list.querySelector('.input-status-detail').textContent, 'Recording · 01:05')
		assert.equal(list.children.length, 1)
		overlay.setEnabled(false)
		state.durationMs = 66000
		ui.update()
		assert.equal(time.textContent, '01:05')
		assert.equal(list.parentElement.hidden, true)
		overlay.setEnabled(true)
		assert.equal(list.querySelector('.input-status-detail').textContent, 'Recording · 01:06')
		state.recording = false
		ui.update()
		assert.equal(list.querySelector('.input-status-detail').textContent, 'MIDI recording · 01:06')
		state.midi = false
		ui.update()
		assert.equal(list.children.length, 0)
		assert.equal(list.parentElement.hidden, true)
		state.recording = true
		ui.update()
		ui.destroy()
		assert.equal(list.children.length, 0)
	} finally {
		ui.destroy()
		dom.window.close()
	}
})
