import test from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://example.test' })
for (const key of ['window', 'document', 'HTMLElement', 'customElements', 'EventTarget', 'Event', 'CustomEvent', 'AbortController', 'DOMException']) {
	globalThis[key] = dom.window[key]
}
dom.window.HTMLMediaElement.prototype.play = async function () {}
dom.window.HTMLMediaElement.prototype.pause = function () {}
dom.window.HTMLCanvasElement.prototype.getContext = () => ({ clearRect() {}, beginPath() {}, arc() {}, fill() {} })
const { Photosynth } = await import('../src/index.js')
const { definePhotosynthElement } = await import('../src/element.js')
definePhotosynthElement()

test('multiple GUI instances scope controls and configuration to their own runtime', () => {
	const first = document.createElement('photosynth-input'), second = document.createElement('photosynth-input')
	document.body.append(first, second)
	const input = first.shadowRoot.querySelector('[data-key="channel"]')
	input.value = '7'; input.dispatchEvent(new Event('change'))
	assert.equal(first.runtime.performers[0].options.channel, 7)
	assert.equal(second.runtime.performers[0].options.channel, 1)
	assert.equal(first.runtime.state, 'idle')
	first.remove(); second.remove()
	first.runtime.dispose(); second.runtime.dispose()
})

test('remounting GUI does not duplicate listeners or stop a borrowed runtime', () => {
	const runtime = new Photosynth({ maxPerformers: 1 })
	const element = document.createElement('photosynth-input')
	element.runtime = runtime
	let events = 0
	element.addEventListener('photosynth-music', () => events++)
	document.body.append(element)
	element.remove()
	document.body.append(element)
	runtime.process([{ box: { xMin: 0.1, xMax: 0.3, yMin: 0.1, yMax: 0.4 }, mouthRatio: 0.8, happiness: 0.7 }], 1000)
	assert(events > 0)
	const count = events
	element.remove()
	runtime.release(1100)
	assert.equal(events, count)
	assert.notEqual(runtime.state, 'disposed')
	runtime.dispose()
})

test('destroying an input GUI keeps its separate camera runtime running', async () => {
	const { createPhotosynthInputClass } = await import('../src/adapters/input.js')
	class Base extends EventTarget {
		constructor(options) { super(); this.options = options; this.uuid = 'test' }
		get now() { return 1 }
		setAsConnected() {}
		setAsDisconnected() {}
		dispatch() {}
	}
	const Input = createPhotosynthInputClass({ AbstractInput: Base, musicalCommand: fields => fields })
	const runtime = new Photosynth({ maxPerformers: 1 })
	const input = new Input({ runtime })
	const pending = input.createGui()
	assert.equal(input.createGui(), pending)
	const element = await pending
	document.body.append(element)
	let stops = 0
	const stop = runtime.stop.bind(runtime)
	runtime.stop = () => { stops++; stop() }
	await input.destroyGui()
	assert.equal(stops, 0)
	input.destroy()
	runtime.dispose()
})

test('closing a GUI while it loads prevents late creation', async () => {
	const { createPhotosynthInputClass } = await import('../src/adapters/input.js')
	class Base extends EventTarget {
		constructor(options) { super(); this.options = options; this.uuid = 'test' }
		get now() { return 1 }
		setAsConnected() {}
		setAsDisconnected() {}
		dispatch() {}
	}
	const Input = createPhotosynthInputClass({ AbstractInput: Base, musicalCommand: fields => fields })
	const input = new Input()
	const pending = input.createGui()
	await input.destroyGui()
	await assert.rejects(pending, { name: 'AbortError' })
	assert.equal(input.gui, undefined)
	input.destroy()
})
