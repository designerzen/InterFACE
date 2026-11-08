import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import pug from 'pug'
import { build } from 'esbuild'
import { faderToGain, gainToFader } from '../source/audio/volume-curve.js'

const script = await build({
	stdin: { contents: `
		import {setupControlsList} from './source/dom/controls-list.js';
		import {setupVolumeInterface} from './source/dom/ui.volume.js';
		window.list = setupControlsList();
		window.changes = [];
		window.volume = setupVolumeInterface(.8, false, {
			currentPercussionVolume:.4, currentSampleVolume:.3, currentTrimVolume:.2,
			onVolumeChanged:value=>window.changes.push(['master',value]),
			onPercussionVolumeChanged:value=>window.changes.push(['percussion',value]),
			onSampleVolumeChanged:value=>window.changes.push(['sample',value]),
			onTrimVolumeChanged:value=>window.changes.push(['trim',value])
		});
	`, resolveDir: process.cwd() }, bundle: true, write: false, format: 'iife'
})

for (const view of ['list', 'compact']) {
	test(`mixer preserves its open state while adjusting channels in ${view} view`, () => {
		const dom = new JSDOM(`<html class="loaded solo"><body>${pug.renderFile('source/partials/control-panel.pug')}</body></html>`, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true })
		const { window } = dom, { document } = window
		window.scrollTo = () => {}
		window.requestAnimationFrame = callback => { callback(); return 0 }
		window.HTMLElement.prototype.getClientRects = () => [{ width: 100, height: 44 }]
		window.eval(script.outputFiles[0].text)
		const folder = document.getElementById('control-panel-volume')
		const link = folder.querySelector('.folder-link')
		const openClass = view === 'list' ? 'controls-list-folder-open' : 'open'
		if (view === 'list') { window.list.open(); link.click() }
		else folder.classList.add('open')
		const assertOpen = () => assert.equal(folder.classList.contains(openClass), true, `mixer lost ${openClass}`)
		assertOpen()
		// Icon updates must preserve every class owned by the drawer, including
		// classes added after the volume interface was initialised.
		folder.classList.add('mixer-state-marker')
		for (const [volume, expectedIcon] of [[0, 'mute'], [0.4, 'low'], [0.8, 'hi']]) {
			window.volume.setVolumeIcon(volume)
			assertOpen()
			assert.equal(folder.classList.contains('mixer-state-marker'), true)
			assert.deepEqual(['hi', 'low', 'mute'].filter(name => folder.classList.contains(name)), [expectedIcon])
		}
		for (const mode of ['master', 'percussion', 'sample', 'trim']) {
			const input = document.getElementById(`mixer-${mode}-volume`)
			input.dispatchEvent(new window.Event('pointerdown', { bubbles: true }))
			input.focus()
			input.click()
			assertOpen()
			input.value = '0.6'
			input.dispatchEvent(new window.Event('input', { bubbles: true }))
			assertOpen()
			assert.equal(window.changes.at(-1)[0], mode)
			assert.ok(Math.abs(window.changes.at(-1)[1] - faderToGain(0.6)) < 1e-12)
			input.dispatchEvent(new window.KeyboardEvent('keyup', { key: 'ArrowUp', bubbles: true }))
			assertOpen()
			document.querySelector(`[data-volume-target="${input.id}"][data-volume-direction="increase"]`).click()
			assert.ok(Math.abs(Number(input.value) - 0.61) < 1e-12)
			assertOpen()
		}
		const assertIcon = expected => assert.deepEqual(['hi', 'low', 'mute'].filter(name => folder.classList.contains(name)), [expected])
		window.volume.setVisualVolumeLevel(0.8)
		document.documentElement.classList.add('beginner')
		const master = document.getElementById('mixer-master-volume')
		master.focus()
		for (const key of ['Shift', 'Control', 'Alt']) {
			master.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true }))
			assertIcon('hi')
			master.value = '0.1'
			master.dispatchEvent(Object.assign(new window.Event('input', { bubbles: true }), {
				shiftKey: key === 'Shift', ctrlKey: key === 'Control', altKey: key === 'Alt'
			}))
			assertIcon('hi')
			master.dispatchEvent(new window.KeyboardEvent('keyup', { key, bubbles: true }))
			assert.ok(Math.abs(Number(master.value) - gainToFader(0.8)) < 1e-12)
			assertIcon('hi')
		}
		window.volume.setVisualVolumeLevel(0.1)
		assertIcon('low')
		window.volume.setVisualVolumeLevel(0)
		assertIcon('mute')
		window.volume.toggleMute(true)
		window.volume.setVisualVolumeLevel(0.8)
		window.volume.setVolumeIcon(0.8)
		window.dispatchEvent(new window.KeyboardEvent('keyup', { key: 'a' }))
		assertIcon('mute')
		window.volume.toggleMute(false)
		assertIcon('hi')
		assertOpen()
		document.documentElement.classList.remove('beginner')
		const melody = document.getElementById('backing-melody-volume')
		melody.focus()
		melody.dispatchEvent(new window.KeyboardEvent('keyup', { key: 'ArrowUp', bubbles: true }))
		assertOpen()
		document.getElementById('button-mute').click()
		assertOpen()
		document.getElementById('button-mute').click()
		assertOpen()
		if (view === 'list') {
			folder.querySelector('.folder-return').click()
			assert.equal(folder.classList.contains(openClass), false)
			assert.equal(document.activeElement, link)
		}
		window.volume.destroy()
		dom.window.close()
	})
}
