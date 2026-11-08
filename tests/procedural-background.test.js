jest.mock('../source/display/procedural-wallpaper.js', () => ({ createProceduralWallpaper: jest.fn() }))
import { createProceduralWallpaper } from '../source/display/procedural-wallpaper.js'
import { createProceduralBackground } from '../source/dom/procedural-background.js'
import { EVENT_VIDEO_STARTED } from '../source/interface-event.js'

let renderer, motion, pending, next
beforeEach(() => {
	document.documentElement.className = 'loading'
	document.body.innerHTML = '<main id="app"><video></video></main>'
	renderer = { draw: jest.fn(), dispose: jest.fn(), nextEffect: jest.fn() }
	createProceduralWallpaper.mockReset().mockReturnValue(renderer)
	motion = { matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() }
	window.matchMedia = () => motion
	pending = new Map()
	next = 0
	window.requestAnimationFrame = jest.fn(callback => { pending.set(++next, callback); return next })
	window.cancelAnimationFrame = jest.fn(id => pending.delete(id))
	Object.defineProperty(document, 'hidden', { configurable: true, value: false })
})

test('first video frame cancels rendering and frees GPU resources permanently', async () => {
	const background = createProceduralBackground()
	expect(pending.size).toBe(1)
	document.querySelector('video').dispatchEvent(new Event(EVENT_VIDEO_STARTED, { bubbles: true }))
	expect(pending.size).toBe(0)
	expect(renderer.dispose).toHaveBeenCalledTimes(1)
	expect(document.querySelector('canvas')).toBeNull()
	expect(document.documentElement.classList.contains('procedural-background')).toBe(true)
	document.dispatchEvent(new Event('visibilitychange'))
	expect(pending.size).toBe(0)
	document.documentElement.classList.replace('loading', 'loaded')
	await Promise.resolve()
	expect(document.documentElement.classList.contains('procedural-background')).toBe(false)
	background.dispose()
	expect(renderer.dispose).toHaveBeenCalledTimes(1)
})

test('hidden tabs pause and visible tabs resume without duplicate loops', () => {
	const background = createProceduralBackground()
	Object.defineProperty(document, 'hidden', { configurable: true, value: true })
	document.dispatchEvent(new Event('visibilitychange'))
	expect(pending.size).toBe(0)
	Object.defineProperty(document, 'hidden', { configurable: true, value: false })
	document.dispatchEvent(new Event('visibilitychange'))
	document.dispatchEvent(new Event('visibilitychange'))
	expect(pending.size).toBe(1)
	background.dispose()
	expect(pending.size).toBe(0)
})

test.each(['motion', 'photosensitive', 'unavailable'])('%s uses static fallback with no animation loop', mode => {
	if (mode === 'motion') motion.matches = true
	if (mode === 'photosensitive') document.getElementById('app').classList.add('flag-photoSensitive')
	if (mode === 'unavailable') createProceduralWallpaper.mockImplementation(() => { throw new Error('No GPU') })
	const background = createProceduralBackground()
	expect(pending.size).toBe(0)
	expect(document.querySelector('canvas')).toBeNull()
	background.dispose()
})

test('context loss releases the renderer and keeps a static fallback', () => {
	const background = createProceduralBackground()
	const onFailure = createProceduralWallpaper.mock.calls[0][1]
	onFailure()
	expect(renderer.dispose).toHaveBeenCalledTimes(1)
	expect(pending.size).toBe(0)
	expect(document.querySelector('canvas')).toBeNull()
	background.dispose()
})

test('enabling reduced motion during setup stops rendering', () => {
	const background = createProceduralBackground()
	motion.matches = true
	motion.addEventListener.mock.calls[0][1]()
	expect(pending.size).toBe(0)
	expect(renderer.dispose).toHaveBeenCalledTimes(1)
	background.dispose()
})

test('loaded without camera input also disposes the background', async () => {
	const background = createProceduralBackground()
	document.documentElement.classList.replace('loading', 'loaded')
	await Promise.resolve()
	expect(pending.size).toBe(0)
	expect(renderer.dispose).toHaveBeenCalledTimes(1)
	expect(document.querySelector('canvas')).toBeNull()
	background.dispose()
})

test('selection uses the GPU renderer and preserves state without CSS offset writes', async () => {
	const background = createProceduralBackground()
	document.documentElement.classList.add('player-selection', 'quartet', 'automated')
	await Promise.resolve()
	expect(createProceduralWallpaper).toHaveBeenCalledTimes(1)
	expect(document.body.lastElementChild.id).toBe('procedural-background')
	expect(pending.size).toBe(1)
	const setProperty = jest.spyOn(document.documentElement.style, 'setProperty')
	document.documentElement.dispatchEvent(new MouseEvent('pointermove', { clientX: 0, clientY: 0 }))
	const [id, callback] = pending.entries().next().value
	pending.delete(id)
	callback(100)
	expect(renderer.draw.mock.calls.at(-1)[2]).toEqual(expect.objectContaining({ selection: true, size: 100, automated: true, beginner: false }))
	expect(renderer.draw.mock.calls.at(-1)[2].colors).toBeDefined()
	expect(setProperty).not.toHaveBeenCalled()
	setProperty.mockRestore()
	background.dispose()
})

test('starting on selection creates a GPU wallpaper', () => {
	document.documentElement.className = 'player-selection solo beginner'
	const background = createProceduralBackground()
	expect(createProceduralWallpaper).toHaveBeenCalledTimes(1)
	expect(document.querySelector('canvas')).not.toBeNull()
	background.dispose()
})

test('loading advances without pointer input and resumes a stalled frame without jumping', () => {
	const background = createProceduralBackground()
	const advance = now => {
		const [id, callback] = pending.entries().next().value
		pending.delete(id)
		callback(now)
	}
	advance(0)
	advance(40)
	const first = renderer.draw.mock.calls.at(-1)
	advance(80)
	const second = renderer.draw.mock.calls.at(-1)
	expect(second[0]).toBeGreaterThan(first[0])
	expect(second[1].x).toBeGreaterThan(first[1].x)
	expect(second[2].selection).toBe(false)
	advance(20000)
	expect(renderer.draw.mock.calls.at(-1)[0] - second[0]).toBeLessThanOrEqual(100)
	background.dispose()
})

test('canvas is appended after the UI and pointer input steers the renderer', () => {
	const background = createProceduralBackground()
	expect(document.body.lastElementChild.id).toBe('procedural-background')
	window.dispatchEvent(new MouseEvent('pointermove', { clientX: window.innerWidth, clientY: 0 }))
	for (let now = 0; now <= 2000; now += 40) {
		const [id, callback] = pending.entries().next().value
		pending.delete(id)
		callback(now)
	}
	const offset = renderer.draw.mock.calls.at(-1)[1]
	expect(offset.x).toBeGreaterThan(60)
	expect(offset.y).toBeLessThan(-60)
		document.querySelector('#procedural-background').dispatchEvent(new MouseEvent('click'))
		expect(renderer.nextEffect).toHaveBeenCalledTimes(1)
		background.stop()
		expect(pending.size).toBe(0)
	background.dispose()
})
