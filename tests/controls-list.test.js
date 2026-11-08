import { setupControlsList } from '../source/dom/controls-list.js'

describe('Expanded controls view', () => {
	let controls
	beforeEach(() => {
		document.documentElement.className = 'loaded'
		document.body.innerHTML = `
			<main><menu id="control-panel">
				<header class="controls-list-header" hidden><h1 id="controls-list-title">All controls</h1></header>
				<section class="controls-list-section" id="controls-list-music" hidden></section>
				<div id="shared-controls" class="controls">
					<button id="button-controls-list" aria-expanded="false" aria-label="View controls as a list" hidden><span class="controls-view-caption">View: List</span></button>
					<label id="beats-label" style="--controls-list-order:10;--controls-list-section:beats">Beats<input id="beats" type="checkbox"></label>
					<label id="key-label" style="--controls-list-order:3;--controls-list-section:music">Key<select id="key"><option>C</option><option>D</option></select></label>
					<div class="folder-menu"><a class="folder-link" href="#folder-tempo">Tempo</a><menu id="folder-tempo"><input id="bpm" value="120"></menu></div>
					<button id="button-share">Share</button><label>Fullscreen<input id="button-fullscreen" type="checkbox"></label>
				</div>
			</menu><button id="outside">Outside</button><div id="already-inert" inert></div></main>`
		jest.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([{ width: 100, height: 50 }])
		window.matchMedia = jest.fn(() => ({ matches: false }))
		window.scrollTo = jest.fn()
		Object.defineProperty(window, 'CSS', { configurable: true, value: { supports: jest.fn(() => true) } })
		controls = setupControlsList(document)
	})
	afterEach(() => {
		controls.close()
		delete document.startViewTransition
		jest.restoreAllMocks()
	})

	test('preserves existing nodes, parents, state and listeners across opening and closing', () => {
		const key = document.getElementById('key')
		const parent = key.parentElement
		const listener = jest.fn()
		key.addEventListener('change', listener)
		key.value = 'D'
		const markup = document.getElementById('shared-controls').innerHTML
		controls.open()
		expect(document.getElementById('control-panel').getAttribute('aria-modal')).toBe('true')
		key.dispatchEvent(new Event('change', { bubbles: true }))
		controls.close()
		expect(document.getElementById('key')).toBe(key)
		expect(key.parentElement).toBe(parent)
		expect(key.value).toBe('D')
		expect(listener).toHaveBeenCalledTimes(1)
		expect(document.getElementById('shared-controls').innerHTML).toBe(markup)
		expect(document.getElementById('control-panel').hasAttribute('role')).toBe(false)
	})

	test('restores focus and pre-existing inert state on Escape', () => {
		const launcher = document.getElementById('button-controls-list')
		launcher.focus()
		controls.open()
		expect(document.activeElement.id).toBe('button-controls-list')
		expect(document.getElementById('outside').hasAttribute('inert')).toBe(true)
		document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
		expect(document.activeElement).toBe(launcher)
		expect(document.getElementById('outside').hasAttribute('inert')).toBe(false)
		expect(document.getElementById('already-inert').hasAttribute('inert')).toBe(true)
	})

	test('tabs in section order and wraps between Close and Fullscreen', () => {
		controls.open()
		const tab = shiftKey => document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true }))
		tab(false)
		expect(document.activeElement.id).toBe('key')
		document.getElementById('button-controls-list').focus()
		tab(true)
		expect(document.activeElement.id).toBe('button-fullscreen')
		tab(false)
		expect(document.activeElement.id).toBe('button-controls-list')
	})

	test('expands folders without changing the URL and restores their original attributes', () => {
		const link = document.querySelector('.folder-link')
		const hash = window.location.hash
		controls.open()
		link.click()
		expect(link.parentElement.classList.contains('controls-list-folder-open')).toBe(true)
		expect(link.getAttribute('aria-expanded')).toBe('true')
		expect(window.location.hash).toBe(hash)
		controls.close()
		expect(link.hasAttribute('aria-expanded')).toBe(false)
		expect(link.parentElement.classList.contains('controls-list-folder-open')).toBe(false)
	})

	test.each(['system', 'app'])('skips transitions for %s reduced motion', preference => {
		document.startViewTransition = jest.fn()
		if (preference === 'system') window.matchMedia.mockReturnValue({ matches: true })
		else document.documentElement.classList.add('a11y-reduce-motion')
		controls.open()
		expect(document.startViewTransition).not.toHaveBeenCalled()
		expect(document.getElementById('control-panel').classList.contains('controls-list-open')).toBe(true)
	})

	test('setup is idempotent', () => {
		expect(setupControlsList(document)).toBe(controls)
		document.getElementById('button-controls-list').click()
		expect(document.getElementById('control-panel').classList.contains('controls-list-open')).toBe(true)
	})

	test('restores the page when returning to player selection', async () => {
		controls.open()
		document.documentElement.classList.add('player-selection')
		await Promise.resolve()
		expect(document.getElementById('control-panel').classList.contains('controls-list-open')).toBe(false)
		expect(document.getElementById('outside').hasAttribute('inert')).toBe(false)
	})

	test('shows current select values only while expanded', () => {
		controls.open()
		const key = document.getElementById('key')
		expect(key.parentElement.dataset.controlsListValue).toBe('C')
		expect(key.parentElement.querySelector('.controls-list-value').getAttribute('aria-hidden')).toBe('true')
		key.value = 'D'
		key.dispatchEvent(new Event('change', { bubbles: true }))
		expect(key.parentElement.dataset.controlsListValue).toBe('D')
		expect(key.parentElement.querySelector('.controls-list-value').textContent).toBe('D')
		controls.close()
		expect(key.parentElement.hasAttribute('data-controls-list-value')).toBe(false)
		expect(key.parentElement.querySelector('.controls-list-value')).toBeNull()
	})

	test('honours closing during an active view transition', async () => {
		const skipTransition = jest.fn()
		document.startViewTransition = jest.fn(update => {
			update()
			return { skipTransition, finished: Promise.resolve() }
		})
		controls.open()
		controls.close()
		await new Promise(resolve => setTimeout(resolve, 0))
		expect(skipTransition).toHaveBeenCalled()
		expect(document.getElementById('control-panel').classList.contains('controls-list-open')).toBe(false)
		expect(document.documentElement.classList.contains('controls-list-transition')).toBe(false)
	})

	test('restores the compact scroll position captured before transition snapshots', async () => {
		const panel = document.getElementById('control-panel')
		panel.scrollTop = 12
		document.startViewTransition = jest.fn(update => {
			panel.scrollTop = 40
			update()
			return { skipTransition: jest.fn(), finished: Promise.resolve() }
		})
		controls.open()
		controls.close()
		await new Promise(resolve => setTimeout(resolve, 0))
		expect(panel.scrollTop).toBe(12)
	})
})
