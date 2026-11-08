import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import pug from 'pug'
import { setupGadgetDescriptions } from '../source/dom/gadget-descriptions.js'
import { setupControlsList } from '../source/dom/controls-list.js'
import { setupSessionRecordingUI } from '../source/dom/ui.session-recording.js'

const fixture = markup => {
	const dom = new JSDOM(`<html class="loaded"><body><menu id="control-panel"><div class="controls">${markup}</div></menu></body></html>`, { pretendToBeVisual: true })
	const panel = dom.window.document.getElementById('control-panel')
	const api = setupGadgetDescriptions(panel)
	const description = control => dom.window.document.getElementById(control.getAttribute('aria-describedby').split(' ').at(-1))
	const flush = () => new Promise(resolve => setTimeout(resolve, 0))
	return { dom, panel, api, description, flush }
}

test('preserves existing labels and help references while adding a persistent description', () => {
	const { dom, panel, description } = fixture('<small id="existing-help">Keyboard help</small><label>Beats<input id="button-percussion" type="checkbox" aria-label="Play backing beats" aria-describedby="existing-help"></label>')
	const control = panel.querySelector('input')
	assert.equal(control.getAttribute('aria-label'), 'Play backing beats')
	assert.equal(control.getAttribute('aria-describedby').split(' ')[0], 'existing-help')
	assert.equal(description(control).parentElement, control.parentElement)
	assert.equal(description(control).hasAttribute('hidden'), false)
	assert.equal(description(control).classList.contains('sr-only'), true)
	assert.equal(description(control).getAttribute('aria-hidden'), 'true')
	assert.match(description(control).textContent, /Add background beats/)
	dom.window.close()
})

test('updates checkbox descriptions in compact mode after native interaction', async () => {
	const { dom, panel, description, flush } = fixture('<label>Beats<input id="button-percussion" type="checkbox"></label>')
	const control = panel.querySelector('input')
	control.click()
	await flush()
	assert.match(description(control).textContent, /beats are playing/)
	control.click()
	await flush()
	assert.match(description(control).textContent, /Add background beats/)
	assert.equal(panel.classList.contains('controls-list-open'), false)
	dom.window.close()
})

test('reflects programmatic changes reported by the existing checked class', async () => {
	const { dom, panel, description, flush } = fixture('<label>Mute<input id="button-mute" type="checkbox"></label>')
	const control = panel.querySelector('input')
	control.checked = true
	control.parentElement.classList.add('checked')
	await flush()
	assert.match(description(control).textContent, /sound is muted/)
	dom.window.close()
})

test('includes state for device toggles that use their existing accessible label as help', async () => {
	const { dom, panel, description, flush } = fixture('<label>Output<input id="device-output-toggle" type="checkbox" aria-label="Send notes to my keyboard"></label>')
	const control = panel.querySelector('input')
	assert.equal(description(control).textContent, 'Disabled. Send notes to my keyboard')
	control.click()
	await flush()
	assert.equal(description(control).textContent, 'Enabled. Send notes to my keyboard')
	dom.window.close()
})

test('explains the disabled option of a visualisation selector', async () => {
	const { dom, panel, description, flush } = fixture('<label>Viz<select id="select-viz"><option value="off">Off</option><option value="vu">VU</option></select></label>')
	const control = panel.querySelector('select')
	assert.match(description(control).textContent, /turned off/)
	control.value = 'vu'
	control.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
	await flush()
	assert.match(description(control).textContent, /visuals are shown/)
	dom.window.close()
})

test('reflects pressed and unavailable states of recording controls', async () => {
	const { dom, panel, description, flush } = fixture('<button id="button-record-session" aria-pressed="false">Record</button>')
	const control = panel.querySelector('button')
	control.setAttribute('aria-pressed', 'true')
	await flush()
	assert.match(description(control).textContent, /being recorded/)
	control.disabled = true
	await flush()
	assert.match(description(control).textContent, /currently unavailable/)
	dom.window.close()
})

test('keeps descriptions linked when the recording UI replaces button text', async () => {
	const { dom, panel, description, flush } = fixture('<button id="button-record-session" aria-pressed="false">Record</button>')
	const control = panel.querySelector('button')
	const originalDescription = description(control)
	control.textContent = 'Stop recording'
	control.setAttribute('aria-pressed', 'true')
	await flush()
	assert.equal(description(control), originalDescription)
	assert.equal(originalDescription.parentElement, control)
	assert.match(originalDescription.textContent, /being recorded/)
	dom.window.close()
})

test('recording UI updates preserve description nodes instead of rebuilding them every tick', async () => {
	const dom = new JSDOM(`<html class="loaded"><body><menu id="control-panel">${pug.renderFile('source/partials/transport-panel.pug')}</menu></body></html>`, { pretendToBeVisual: true })
	const previousWindow = globalThis.window
	globalThis.window = dom.window
	let ui
	try {
		const panel = dom.window.document.getElementById('control-panel')
		setupGadgetDescriptions(panel)
		const state = { recording: false, durationMs: 0, replay: {} }
		// Keep storage recovery outside this UI-only test.
		const controller = { state: () => state, setAuto: () => new Promise(() => {}), pauseReplay: () => {} }
		ui = setupSessionRecordingUI(controller, error => { throw error }, dom.window.document)
		const button = dom.window.document.getElementById('button-record-session')
		const description = button.querySelector('.gadget-description')
		ui.update()
		assert.equal(description.parentElement, button)
		state.recording = true
		ui.update()
		assert.equal(description.parentElement, button)
		assert.equal(button.firstChild.textContent, 'Stop recording')
		await new Promise(resolve => setTimeout(resolve, 0))
		assert.match(description.textContent, /being recorded/)
	} finally {
		ui?.destroy()
		dom.window.close()
		globalThis.window = previousWindow
	}
})

test('adds help to dynamic gadgets without duplicating existing descriptions', async () => {
	const { dom, panel, api, flush, description } = fixture('<label>Beats<input id="button-percussion" type="checkbox"></label>')
	api.refresh()
	assert.equal(setupGadgetDescriptions(panel), api)
	assert.equal(panel.querySelectorAll('.gadget-description').length, 1)
	const label = dom.window.document.createElement('label')
	label.innerHTML = 'Mute<input id="button-mute" type="checkbox">'
	panel.querySelector('.controls').append(label)
	await flush()
	assert.match(description(label.querySelector('input')).textContent, /sound is unmuted/)
	assert.equal(panel.querySelectorAll('.gadget-description').length, 2)
	dom.window.close()
})

test('describes toolbar controls except tempo actions and mixer controls and keeps descriptions after closing the list', () => {
	const dom = new JSDOM(`<html class="loaded"><body>${pug.renderFile('source/partials/control-panel.pug')}</body></html>`, { pretendToBeVisual: true })
	dom.window.scrollTo = () => {}
	const document = dom.window.document
	const panel = document.getElementById('control-panel')
	const key = document.getElementById('select-key')
	const originalParent = key.parentElement
	const api = setupControlsList(document)
	for (const control of panel.querySelectorAll('.controls input:not([type="hidden"]), .controls select, .controls button, .controls .folder-link, .transport-session-controls button')) {
		if (control.closest('dialog') || (control.tagName !== 'SELECT' && control.closest('select'))) continue
		if (['tempo-increase-button', 'tempo-decrease-button', 'tempo-tap-button'].includes(control.id) || control.closest('#folder-volume, #mixer-panel')) {
			assert.equal(control.querySelector('.gadget-description'), null)
			assert.equal(control.hasAttribute('aria-describedby'), false)
			continue
		}
		const refs = (control.getAttribute('aria-describedby') || '').split(' ')
		assert.ok(refs.some(id => document.getElementById(id)?.matches('.gadget-description')), `Missing description for ${control.id || control.outerHTML}`)
	}
	const descriptionId = key.getAttribute('aria-describedby')
	api.open()
	assert.equal(document.getElementById(descriptionId).classList.contains('sr-only'), true)
	api.close()
	assert.equal(document.querySelector('#folder-volume .gadget-description'), null)
	assert.equal(key.parentElement, originalParent)
	assert.ok(document.getElementById(descriptionId))
	assert.equal(panel.classList.contains('controls-list-open'), false)
	dom.window.close()
})
