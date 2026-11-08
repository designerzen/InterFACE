import { readFileSync } from 'fs'

const source = readFileSync('source/interface.js', 'utf8')

beforeEach(() => {
	document.documentElement.className = 'loading'
	document.body.innerHTML = '<main aria-busy="true"></main><div><progress></progress><label for="progress-bar"></label></div>'
})

test('reveals the app while player instruments are still loading', () => {
	const ready = new Promise(() => {})
	const createPerson = jest.fn(() => ({ ready }))
	const loadProgressMediator = jest.fn()
	const setupEnsemblePresetPanel = jest.fn()
	const dependencies = {
		stateMachine: { get: () => 2, preventAutoScrolling: jest.fn() },
		createPerson,
		EYE_COLOURS: ['blue', 'green'],
		body: document.documentElement,
		main: document.querySelector('main'),
		loadProgressMediator,
		setupEnsemblePresetPanel
	}
	// Run the actual startup handler with unresolved instrument promises.
	const handler = source.match(/const onLoaded = (async \(\) => \{[\s\S]*?\n\t\})/)[1]
	const onLoaded = new Function(...Object.keys(dependencies), `return (${handler})`)(...Object.values(dependencies))
	void onLoaded()
	expect(createPerson).toHaveBeenCalledTimes(2)
	expect(document.documentElement.classList.contains('loading')).toBe(false)
	expect(document.documentElement.classList.contains('loaded')).toBe(true)
	expect(document.querySelector('main').getAttribute('aria-busy')).toBe('false')
	expect(loadProgressMediator).toHaveBeenCalledWith(1, 'Ready!', true)
	expect(setupEnsemblePresetPanel).not.toHaveBeenCalled()
})

test('completion cancels pending progress updates and preserves completion details', () => {
	const frames = new Map()
	let frameId = 0
	const onLoadProgress = jest.fn()
	const handler = source.match(/let loadProgressMediator = (\([\s\S]*?\n\t\})/)[1]
	const mediator = new Function('onLoadProgress', 'dispatchEvent', 'EVENT_STATE_LOADING', 'requestAnimationFrame', 'cancelAnimationFrame',
		`let loadPercent = 0; let loadProgressFrame; const loadProgressMediator = (${handler}); return loadProgressMediator`)(
		onLoadProgress, jest.fn(), 'loading',
		callback => { frames.set(++frameId, callback); return frameId },
		id => frames.delete(id)
	)
	mediator(0.01, 'Preparing', false)
	const [id, callback] = frames.entries().next().value
	frames.delete(id)
	callback()
	expect(onLoadProgress).toHaveBeenLastCalledWith(0.01, 'Preparing', false)
	mediator(0.99, 'Starting playback', false)
	expect(frames.size).toBe(1)
	mediator(1, 'Ready!', true)
	expect(onLoadProgress).toHaveBeenLastCalledWith(1, 'Ready!', true)
	expect(frames.size).toBe(0)
})

test('the global loader finishes immediately when the app is ready', () => {
	jest.resetModules()
	const { setLoadProgress, getLoadProgress } = require('../source/dom/load-progress.js')
	setLoadProgress(0.8, 'Preparing')
	setLoadProgress(1, 'Ready!', true)
	expect(getLoadProgress()).toBe(100)
	expect(document.querySelector('progress').getAttribute('value')).toBe('1')
	expect(document.querySelector('progress').parentNode.dataset.loaded).toBe('true')
})

test('camera connection instructions persist across loading updates', () => {
	jest.resetModules()
	const { setLoadProgress, setLoadWaitingMessage } = require('../source/dom/load-progress.js')
	const message = 'Connect a camera to continue.'
	setLoadWaitingMessage(message)
	setLoadProgress(0.5, 'Loading...')
	expect(document.querySelector('label').textContent).toBe(message)
	setLoadWaitingMessage()
	setLoadProgress(1, 'Ready!', true)
	expect(document.querySelector('label').textContent).not.toContain(message)
})
