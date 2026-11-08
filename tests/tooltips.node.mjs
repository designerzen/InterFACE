import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'

const source = readFileSync(new URL('../source/dom/tooltips.js', import.meta.url), 'utf8')

function setup(popover = true) {
	const coordinates = {}
	const toast = {
		id: 'toast', hidden: true, contains: () => false,
		style: {
			setProperty: (key, value) => { coordinates[key] = value },
			getPropertyValue: key => String(coordinates[key] ?? ''),
		},
		showPopover() { this.coordinatesAtReveal = { ...coordinates } },
		hidePopover() {},
	}
	const element = {
		nodeName: 'BUTTON', id: 'button', isConnected: true,
		rect: { x: 0, y: 0 }, reads: 0, handlers: {},
		getBoundingClientRect() { this.reads++; return this.rect },
		getAttribute() { return 'Button label' },
		setAttribute() {},
		contains(target) { return target === this || target === this.child },
		addEventListener(name, callback) { this.handlers[name] = callback },
		removeEventListener(name) { delete this.handlers[name] },
	}
	const listeners = {}
	const window = { scrollX: 0, scrollY: 0,
		addEventListener: (type, fn) => { listeners[type] = fn },
		removeEventListener: type => { delete listeners[type] },
	}
	const frames = new Map()
	let frameId = 0
	let mutations
	let resizes
	const flush = () => {
		const callbacks = [...frames.values()]
		frames.clear()
		callbacks.forEach(fn => fn())
	}
	const context = vm.createContext({
		HTMLElement: { prototype: popover ? { popover: '' } : {} },
		document: { getElementById: () => toast, body: {},
			addEventListener: window.addEventListener, removeEventListener: window.removeEventListener }, window,
		requestAnimationFrame: fn => { frames.set(++frameId, fn); return frameId },
		cancelAnimationFrame: id => frames.delete(id),
		MutationObserver: class {
			constructor(callback) { this.callback = callback; this.records = []; mutations = this }
			observe() {}
			disconnect() { this.disconnected = true }
			takeRecords() { return this.records.splice(0) }
		},
		ResizeObserver: class {
			constructor(callback) { this.callback = callback; resizes = this }
			observe() {}
			unobserve() {}
			disconnect() { this.disconnected = true }
		},
	})
	const api = vm.runInContext(source.replace(/export const /g, 'const ') +
		'\n({ addTooltip, removeTooltip, updateTooltipPositions, toggleTooltips })', context)
	const hover = (target = element, relatedTarget = null, pointerType = 'mouse') =>
		element.handlers.pointerover({ target, relatedTarget, pointerType })
	return { api, element, toast, coordinates, window, hover, flush, frames, listeners,
		get mutations() { return mutations }, get resizes() { return resizes } }
}

for (const popover of [true, false]) {
	test(`first activation uses current geometry, including after layout changes (popover=${popover})`, () => {
		const { api, element, toast, coordinates, hover, window, flush } = setup(popover)
		api.addTooltip(element)
		assert.equal(element.reads, 0)
		element.isConnected = true
		element.rect = { x: 420, y: 260 }
		hover()
		flush()
		assert.deepEqual(coordinates, { '--left': 420, '--top': 260 })
		assert.equal(element.reads, 1)
		assert.equal(toast.hidden, false)
		if (popover) assert.deepEqual(toast.coordinatesAtReveal, coordinates)
		element.handlers.pointerout({ relatedTarget: null })
		assert.equal(toast.hidden, true)
		element.rect = { x: 600, y: 350 }
		window.scrollY = 100
		api.updateTooltipPositions()
		hover()
		flush()
		assert.deepEqual(coordinates, { '--left': 600, '--top': 450 })
		assert.equal(element.reads, 2)
	})
}

test('nested content uses the registered element and internal movement does no extra work', () => {
	const { api, element, toast, coordinates, hover, flush } = setup()
	element.child = {}
	element.rect = { x: 80, y: 100 }
	api.addTooltip(element)
	hover(element.child)
	flush()
	assert.equal(toast.textContent, 'Button label')
	assert.deepEqual(coordinates, { '--left': 80, '--top': 100 })
	element.handlers.pointerout({ relatedTarget: element.child })
	hover(element.child, element)
	assert.equal(toast.hidden, false)
	assert.equal(element.reads, 1)
})

test('inputs retain their parent anchor', () => {
	const { api, element, coordinates, hover, flush } = setup()
	element.nodeName = 'INPUT'
	element.parentElement = { getBoundingClientRect: () => ({ x: 70, y: 90 }) }
	api.addTooltip(element)
	hover()
	flush()
	assert.deepEqual(coordinates, { '--left': 70, '--top': 90 })
})

test('explicit updates are batched and removal cleans up', () => {
	const { api, element, toast, coordinates, hover, flush } = setup()
	api.addTooltip(element)
	api.addTooltip(element)
	api.updateTooltipPositions()
	assert.equal(element.reads, 0)
	element.isConnected = true
	hover()
	flush()
	element.rect = { x: 250, y: 300 }
	api.updateTooltipPositions()
	flush()
	assert.deepEqual(coordinates, { '--left': 250, '--top': 300 })
	assert.equal(element.reads, 2)
	api.removeTooltip(element)
	assert.equal(toast.hidden, true)
	assert.deepEqual(element.handlers, {})
	api.updateTooltipPositions()
	assert.equal(element.reads, 2)
})

test('disabled tooltips and touch events do not measure or reveal', () => {
	const { api, element, toast, hover } = setup()
	api.addTooltip(element)
	hover(element, null, 'touch')
	api.toggleTooltips(false)
	hover()
	assert.equal(element.reads, 0)
	assert.equal(toast.hidden, true)
})

test('repeated clean hovers reuse prewarmed coordinates without geometry reads', () => {
	const { api, element, hover, flush, frames } = setup()
	api.addTooltip(element)
	flush()
	assert.equal(element.reads, 1)
	for (let i = 0; i < 10; i++) {
		hover()
		element.handlers.pointerout({ relatedTarget: null })
	}
	assert.equal(element.reads, 1)
	assert.equal(frames.size, 0)
})

test('mutation bursts invalidate lazily and refresh before the first reveal', () => {
	const env = setup()
	const { api, element, hover, flush, frames, toast, coordinates } = env
	api.addTooltip(element)
	flush()
	element.rect = { x: 320, y: 180 }
	for (let i = 0; i < 20; i++) env.mutations.callback([{ target: element }])
	assert.equal(frames.size, 0)
	assert.equal(element.reads, 1)
	hover()
	assert.equal(toast.hidden, true)
	assert.equal(element.reads, 1)
	flush()
	assert.equal(element.reads, 2)
	assert.deepEqual(coordinates, { '--left': 320, '--top': 180 })
	assert.deepEqual(toast.coordinatesAtReveal, coordinates)
})

test('queued mutations are drained before cache lookup and own mutations are ignored', () => {
	const env = setup()
	const { api, element, hover, flush, toast, frames } = env
	api.addTooltip(element)
	flush()
	env.mutations.records.push({ target: element })
	hover()
	assert.equal(toast.hidden, true)
	flush()
	assert.equal(element.reads, 2)
	env.mutations.callback([{ target: toast }])
	assert.equal(frames.size, 0)
	hover()
	assert.equal(element.reads, 2)
})

test('resize, nested scrolling and transition completion coalesce into one active refresh', () => {
	const env = setup()
	const { api, element, hover, flush, frames, listeners, coordinates } = env
	api.addTooltip(element)
	flush()
	hover()
	element.rect = { x: 70, y: 200 }
	env.resizes.callback()
	listeners.resize()
	listeners.scroll({ target: element })
	listeners.transitionend({ target: element })
	assert.equal(frames.size, 1)
	assert.equal(element.reads, 1)
	flush()
	assert.equal(element.reads, 2)
	assert.deepEqual(coordinates, { '--left': 70, '--top': 200 })
})

test('leaving before a pending refresh prevents a delayed reveal; final removal disconnects', () => {
	const env = setup()
	const { api, element, hover, flush, frames, toast, listeners } = env
	api.addTooltip(element)
	hover()
	element.handlers.pointerout({ relatedTarget: null })
	flush()
	assert.equal(toast.hidden, true)
	api.removeTooltip(element)
	assert.equal(env.mutations.disconnected, true)
	assert.equal(env.resizes.disconnected, true)
	assert.equal(frames.size, 0)
	assert.deepEqual(listeners, {})
})
