import test from 'node:test'
import assert from 'node:assert/strict'
import { createButterchurnVisualiser, loadButterchurn } from '../source/visual/butterchurn-visualiser.js'
import { getVisualiserMode, VISUALISER_MODES } from '../source/visual/visualiser-modes.js'

test('real installed packages expose a visualizer and populated presets through the loader', async () => {
	const previousWindow = globalThis.window
	globalThis.window = {}
	try {
		const { engine, presets } = await loadButterchurn()
		assert.equal(typeof engine.createVisualizer, 'function')
		const collection = presets.getPresets()
		const modes = VISUALISER_MODES.filter(mode => mode.renderer === 'butterchurn')
		assert.equal(new Set(modes.map(mode => mode.preset)).size, modes.length)
		for (const mode of modes) assert.ok(collection[mode.preset], `${mode.label} preset is installed`)
	} finally {
		if (previousWindow === undefined) delete globalThis.window
		else globalThis.window = previousWindow
	}
})

const fixture = (collection = { test:{} }) => {
	const calls = []
	const canvas = { getContext:() => ({ getExtension:() => ({ loseContext:() => calls.push(['destroy']) }) }) }
	const renderer = Object.fromEntries(['connectAudio', 'disconnectAudio', 'loadPreset', 'setRendererSize', 'render'].map(name => [name, (...args) => calls.push([name, ...args])]))
	let resolve
	const pending = new Promise(done => { resolve = done })
	const controller = createButterchurnVisualiser({ createCanvas:() => canvas, load:() => pending, onError:error => calls.push(['error', error]) })
	const loaded = async () => {
		resolve({ engine:{ createVisualizer:(...args) => { calls.push(['create', ...args]); return renderer } }, presets:{ getPresets:() => collection } })
		await pending
		await Promise.resolve()
	}
	return { calls, canvas, controller, loaded }
}

test('Butterchurn uses the selected canvas and mixed audio node, resizes and disconnects only its own input', async () => {
	assert.equal(getVisualiserMode('butterchurn').id, 'butterchurn')
	const { calls, canvas, controller, loaded } = fixture()
	const context = {}, node = {}, replacement = {}
	assert.equal(controller.render(context, node, 800, 400), null)
	await loaded()
	assert.equal(controller.render(context, node, 800, 400), canvas)
	assert.deepEqual(calls.find(call => call[0] === 'create'), ['create', context, canvas, { width:800, height:400 }])
	controller.render(context, node, 1600, 800)
	assert.deepEqual([canvas.width, canvas.height], [1600, 800])
	assert.equal(calls.filter(call => call[0] === 'connectAudio').length, 1)
	assert.deepEqual(calls.find(call => call[0] === 'setRendererSize'), ['setRendererSize', 1600, 800])
	controller.render(context, replacement, 1600, 800)
	assert.deepEqual(calls.filter(call => call[0] === 'disconnectAudio'), [['disconnectAudio', node]])
	controller.stop()
	controller.stop()
	assert.deepEqual(calls.filter(call => call[0] === 'disconnectAudio'), [['disconnectAudio', node], ['disconnectAudio', replacement]])
	controller.destroy()
	assert.equal(controller.render(context, node, 800, 400), null)
})

test('switching off while loading does not connect audio or render until selected again', async () => {
	const { calls, controller, loaded } = fixture()
	controller.render({}, {}, 800, 400)
	controller.stop()
	await loaded()
	assert.equal(calls.some(call => call[0] === 'connectAudio' || call[0] === 'render'), false)
	controller.render({}, {}, 800, 400)
	assert.equal(calls.filter(call => call[0] === 'connectAudio').length, 1)
})

test('switching named effects loads distinct presets once, reusing the renderer and audio connection', async () => {
	const modes = VISUALISER_MODES.filter(mode => mode.renderer === 'butterchurn')
	const collection = Object.fromEntries(modes.map(mode => [mode.preset, { name:mode.preset }]))
	const { calls, controller, loaded } = fixture(collection)
	const context = {}, node = {}
	controller.render(context, node, 800, 400, modes[0].preset)
	await loaded()
	for (const mode of modes) {
		controller.render(context, node, 800, 400, mode.preset)
		controller.render(context, node, 800, 400, mode.preset)
	}
	assert.deepEqual(calls.filter(call => call[0] === 'loadPreset'),
		modes.map((mode, index) => ['loadPreset', collection[mode.preset], index === 0 ? 0 : 1]))
	assert.equal(calls.filter(call => call[0] === 'create').length, 1)
	assert.equal(calls.filter(call => call[0] === 'connectAudio').length, 1)
	controller.render(context, node, 800, 400, modes[0].preset)
	assert.deepEqual(calls.filter(call => call[0] === 'loadPreset').at(-1), ['loadPreset', collection[modes[0].preset], 1])
})

test('selection changes during loading use the latest requested effect on the first active frame', async () => {
	const collection = { first:{}, second:{} }
	const { calls, controller, loaded } = fixture(collection)
	const context = {}, node = {}
	controller.render(context, node, 800, 400, 'first')
	controller.render(context, node, 800, 400, 'second')
	await loaded()
	assert.equal(calls.some(call => call[0] === 'loadPreset'), false)
	controller.render(context, node, 800, 400, 'second')
	assert.deepEqual(calls.filter(call => call[0] === 'loadPreset'), [['loadPreset', collection.second, 0]])
})

test('destroy during loading prevents late renderer creation', async () => {
	const { calls, controller, loaded } = fixture()
	controller.render({}, {}, 800, 400)
	controller.destroy()
	await loaded()
	assert.equal(calls.length, 0)
})

test('load failure is reported once without breaking the display loop', async () => {
	let errors = 0, loads = 0
	const controller = createButterchurnVisualiser({ load:async () => { loads++; throw new Error('unavailable') }, onError:() => errors++ })
	controller.render({}, {}, 800, 400)
	await new Promise(resolve => setImmediate(resolve))
	assert.equal(controller.render({}, {}, 800, 400), null)
	assert.equal(errors, 1)
	assert.equal(loads, 1)
})
