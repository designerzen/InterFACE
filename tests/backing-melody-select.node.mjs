import assert from 'node:assert/strict'
import { test, mock } from 'node:test'
import { JSDOM } from 'jsdom'
import pug from 'pug'
import { faderToGain, gainToFader } from '../source/audio/volume-curve.js'

let controller
mock.module('../source/audio/backing-melody.js', {
	namedExports:{ createBackingMelody:() => controller }
})
mock.module('../source/audio/backing-melody-player.js', {
	namedExports:{ createBackingMelodyPlayer:() => ({}) }
})
const { setupBackingMelody } = await import('../source/dom/ui.backing-melody.js')

const fixture = (saved={}) => {
	const dom = new JSDOM(pug.renderFile('source/partials/control-panel.pug'))
	const document = dom.window.document
	const state = { backingMelody:false, backingMelodyPlayer:0, backingMelodyVolume:0.25, ...saved }
	controller = { configure:mock.fn(), stop:mock.fn(), destroy:mock.fn(), tick:mock.fn() }
	const context = { state:'suspended', resume:mock.fn(async () => {}) }
	setupBackingMelody({ context, destination:{}, document, personManager:{}, stateMachine:{ get:key => state[key], set:(key,value) => { state[key]=value } } })
	const select = document.getElementById('backing-melody-player')
	const change = value => { select.value=value; select.dispatchEvent(new dom.window.Event('change', { bubbles:true })) }
	return { dom, document, select, state, context, change }
}

test('Melody is an inline selector with None selected and four players', () => {
	const { dom, document, select, state } = fixture()
	assert.equal(select.value, 'disabled')
	assert.equal(state.backingMelody, false)
	assert.deepEqual([...select.options].map(option => option.value), ['disabled','0','1','2','3'])
	assert.equal(select.closest('.folder-menu'), null)
	assert.equal(document.getElementById('folder-melody'), null)
	assert.ok(document.getElementById(select.getAttribute('aria-describedby')))
	assert.ok(document.getElementById('backing-melody-volume').closest('.mixer-channel'))
	dom.window.close()
})

test('choosing a player enables melody; switching players updates the source; None stops it', () => {
	const { dom, state, context, change } = fixture()
	change('2')
	assert.equal(state.backingMelody, true)
	assert.equal(state.backingMelodyPlayer, 2)
	assert.equal(context.resume.mock.callCount(), 1)
	assert.equal(controller.configure.mock.calls.at(-1).arguments[0].backingMelodyPlayer, 2)
	change('0')
	assert.equal(state.backingMelodyPlayer, 0)
	change('disabled')
	assert.equal(state.backingMelody, false)
	assert.equal(controller.configure.mock.calls.at(-1).arguments[0].backingMelody, false)
	assert.equal(state.backingMelodyPlayer, 0)
	dom.window.close()
})

test('restores the saved followed player only when melody is enabled', () => {
	const active = fixture({ backingMelody:true, backingMelodyPlayer:3 })
	assert.equal(active.select.value, '3')
	active.dom.window.close()
	const disabled = fixture({ backingMelody:false, backingMelodyPlayer:3 })
	assert.equal(disabled.select.value, 'disabled')
	disabled.dom.window.close()
})

test('melody fader restores saved gain and maps its logarithmic travel to true silence', () => {
	const { dom, document, state } = fixture()
	const volume = document.getElementById('backing-melody-volume')
	assert.ok(Math.abs(Number(volume.value) - gainToFader(0.25)) < 1e-12)
	assert.equal(document.getElementById('backing-melody-volume-output').value, '25%')
	for (const position of [0.5, 0, 1]) {
		volume.value = position
		volume.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
		assert.equal(state.backingMelodyVolume, faderToGain(position))
	}
	dom.window.close()
})
