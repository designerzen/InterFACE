import { setupGadgetDescriptions } from './gadget-descriptions.js'
import { hasViewTransitionCapability } from '../capabilities.js'
import { optionLabel } from './option-label.js'

const focusableSelector = 'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]'

export const setupControlsList = (document = globalThis.document) => {
	const panel = document?.getElementById('control-panel')
	const launcher = document?.getElementById('button-controls-list')
	const closeButton = launcher
	if (!panel || !launcher || !closeButton) return null
	if (panel.controlsList) return panel.controlsList
	const gadgetDescriptions = setupGadgetDescriptions(panel)
	const window = document.defaultView
	const root = document.documentElement
	const chrome = [...panel.querySelectorAll('.controls-list-header, .controls-list-section, .controls-list-footer')]
	const groups = [...panel.querySelectorAll('#shared-controls > *, #settings > *, #percussion-settings > *, .transport-session-controls, #session-replay-progress')]
	const originalAttributes = new Map(['role', 'aria-modal', 'aria-labelledby'].map(name => [name, panel.getAttribute(name)]))
	const inertElements = new Map()
	const folderAttributes = new Map()
	const generatedIds = new Set()
	const folderInertElements = new Map()
	const title = document.getElementById('controls-list-title')
	const originalTitle = title?.textContent
	let activeFolder
	let folderScroll = 0
	const closeFolder = (restoreFocus = true) => {
		if (!activeFolder) return
		const folder = activeFolder
		activeFolder = null
		folder.classList.remove('controls-list-folder-open', 'open', 'midi-open')
		folder.querySelector('.folder-link')?.setAttribute('aria-expanded', 'false')
		folderInertElements.forEach((wasInert, element) => { if (!wasInert) element.removeAttribute('inert') })
		folderInertElements.clear()
		panel.classList.remove('controls-list-panel-open', 'controls-list-panel-has-return')
		closeButton.hidden = false
		if (title) title.textContent = originalTitle
		panel.scrollTop = folderScroll
		if (restoreFocus) folder.querySelector('.folder-link')?.focus({ preventScroll: true })
	}
	const openFolder = link => {
		closeFolder(false)
		activeFolder = link.closest('.folder-menu')
		folderScroll = panel.scrollTop
		activeFolder.classList.add('controls-list-folder-open')
		activeFolder.classList.remove('midi-dismissed')
		link.setAttribute('aria-expanded', 'true')
		panel.classList.add('controls-list-panel-open')
		const content = activeFolder.querySelector('.folder-content')
		const returnControl = content?.querySelector(':scope > .folder-return')
		panel.classList.toggle('controls-list-panel-has-return', !!returnControl)
		closeButton.hidden = !!returnControl
		if (content?.id === 'folder-midi') activeFolder.classList.add('midi-open')
		if (title) title.textContent = ({ 'folder-tempo': 'Tempo', 'folder-volume': 'Volume', 'folder-midi': 'MIDI', 'folder-engine':'Engine', 'folder-mouth':'Mouth dynamics', 'folder-head':'Head movement' })[content?.id] || link.textContent.trim()
		// Keep the existing header available while isolating the open panel.
		for (let branch = content; branch && branch !== panel; branch = branch.parentElement) {
			for (const sibling of branch.parentElement.children) {
				if (sibling === branch || sibling === launcher || sibling.classList.contains('controls-list-header')) continue
				folderInertElements.set(sibling, sibling.hasAttribute('inert'))
				sibling.setAttribute('inert', '')
			}
		}
		if (content) content.scrollTop = 0
		const initialFocus = returnControl || closeButton
		initialFocus.focus({ preventScroll: true })
	}
	let open = false
	let transition
	let requestedOpen = false
	let lastFocus
	let savedScroll = 0
	let savedPageScroll = { x: 0, y: 0 }
	const updateValues = () => {
		for (const select of panel.querySelectorAll('.controls > label > select')) {
			select.parentElement.dataset.controlsListValue = Array.from(select.selectedOptions, optionLabel).join(', ')
			let value = select.parentElement.querySelector('.controls-list-value')
			if (!value) {
				value = document.createElement('span')
				value.className = 'controls-list-value'
				value.setAttribute('aria-hidden', 'true')
				select.parentElement.append(value)
			}
			value.textContent = select.parentElement.dataset.controlsListValue
		}
	}

	const visible = element => !element.closest('[hidden], [inert]') && element.getClientRects().length > 0 && window.getComputedStyle(element).visibility !== 'hidden'
	const order = element => {
		const group = groups.find(group => group === element || group.contains(element))
		if (element === closeButton) return 0
		if (element.id === 'button-share') return 10000
		if (element.id === 'button-fullscreen') return 10001
		return Number(group && window.getComputedStyle(group).getPropertyValue('--controls-list-order')) || 9999
	}
	const focusables = () => activeFolder
		? [closeButton, ...activeFolder.querySelector('.folder-content').querySelectorAll(focusableSelector)].filter(visible)
		: [...panel.querySelectorAll(focusableSelector)].filter(visible).sort((a, b) => order(a) - order(b))
	const setAttribute = (element, name, value) => value === null ? element.removeAttribute(name) : element.setAttribute(name, value)
	const setOpen = next => {
		if (!next) closeFolder(false)
		open = next
		panel.classList.toggle('controls-list-open', next)
		root.classList.toggle('controls-list-open', next)
		launcher.setAttribute('aria-expanded', String(next))
		launcher.setAttribute('aria-label', next ? 'View controls as a grid' : 'View controls as a list')
		const caption = launcher.querySelector('.controls-view-caption')
		if (caption) caption.textContent = next ? 'View: Grid' : 'View: List'
		chrome.forEach(element => { element.hidden = !next })
		if (next) {
			panel.setAttribute('role', 'dialog')
			panel.setAttribute('aria-modal', 'true')
			panel.setAttribute('aria-labelledby', 'controls-list-title')
			// Inert siblings at each ancestor without moving any existing controls.
			for (let branch = panel; branch.parentElement; branch = branch.parentElement) {
				for (const sibling of branch.parentElement.children) {
					if (sibling === branch || /^(SCRIPT|STYLE|LINK)$/.test(sibling.tagName)) continue
					inertElements.set(sibling, sibling.hasAttribute('inert'))
					sibling.setAttribute('inert', '')
				}
			}
			// aria-owns gives the visual sections the same accessible reading order.
			for (const section of panel.querySelectorAll('.controls-list-section')) {
				const name = section.id.replace('controls-list-', '')
				const owned = groups.filter(group => window.getComputedStyle(group).getPropertyValue('--controls-list-section').trim() === name).sort((a, b) => order(a) - order(b))
				owned.forEach((group, index) => {
					if (!group.id) { group.id = `controls-list-${name}-${index}`; generatedIds.add(group) }
				})
				section.setAttribute('aria-owns', owned.map(group => group.id).join(' '))
			}
			for (const folder of panel.querySelectorAll('.folder-menu')) {
				const link = folder.querySelector('.folder-link')
				if (!link) continue
				folderAttributes.set(link, link.getAttribute('aria-expanded'))
				link.setAttribute('aria-expanded', 'false')
			}
			panel.scrollTop = 0
			updateValues()
			closeButton.focus({ preventScroll: true })
		} else {
			originalAttributes.forEach((value, name) => setAttribute(panel, name, value))
			inertElements.forEach((wasInert, element) => { if (!wasInert) element.removeAttribute('inert') })
			inertElements.clear()
			folderAttributes.forEach((value, link) => setAttribute(link, 'aria-expanded', value))
			folderAttributes.clear()
			panel.querySelectorAll('.controls-list-folder-open').forEach(folder => folder.classList.remove('controls-list-folder-open'))
			panel.querySelectorAll('.controls-list-section').forEach(section => section.removeAttribute('aria-owns'))
			generatedIds.forEach(group => group.removeAttribute('id'))
			generatedIds.clear()
			panel.querySelectorAll('[data-controls-list-value]').forEach(label => label.removeAttribute('data-controls-list-value'))
			panel.querySelectorAll('.controls-list-value').forEach(value => value.remove())
			panel.scrollTop = savedScroll
			const target = lastFocus?.isConnected && visible(lastFocus) ? lastFocus : launcher
			target.focus({ preventScroll: true })
			const scrollBehavior = root.style.scrollBehavior
			root.style.scrollBehavior = 'auto'
			window.scrollTo(savedPageScroll.x, savedPageScroll.y)
			root.style.scrollBehavior = scrollBehavior
			panel.scrollTop = savedScroll
		}
		gadgetDescriptions.refresh()
	}

	const change = next => {
		requestedOpen = next
		if (transition) { transition.skipTransition(); return }
		if (open === next) return
		if (next) {
			// Capture the compact position before snapshot styles can affect anchoring.
			lastFocus = document.activeElement
			savedScroll = panel.scrollTop
			savedPageScroll = { x: window.scrollX, y: window.scrollY }
		}
		const reduceMotion = root.classList.contains('a11y-reduce-motion') || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
		if (!hasViewTransitionCapability(document) || reduceMotion) { setOpen(next); return }
		root.classList.add('controls-list-transition')
		try {
			transition = document.startViewTransition(() => setOpen(next))
		} catch (error) {
			root.classList.remove('controls-list-transition')
			setOpen(next)
			window.console.warn('Controls view transition could not start', error)
			return
		}
		const current = transition
		current.ready?.catch(error => {
			if (error.name !== 'AbortError') window.console.warn('Controls view transition was skipped', error)
		})
		current.finished.catch(() => {}).finally(() => {
			if (transition === current) {
				transition = null
				root.classList.remove('controls-list-transition')
				if (!open) panel.scrollTop = savedScroll
				if (open !== requestedOpen) change(requestedOpen)
			}
		})
	}
	launcher.hidden = false
	panel.addEventListener('change', () => { if (open) updateValues() })
	launcher.addEventListener('click', () => activeFolder ? closeFolder() : change(!requestedOpen))
	panel.addEventListener('click', event => {
		if (!open) return
		// Existing app dialogs retain their own focus handling and stacking.
		if (event.target.closest('#button-help, #button-accessibility, #button-command-palette, #button-share')) {
			requestedOpen = false
			transition?.skipTransition()
			setOpen(false)
			return
		}
		const link = event.target.closest('.folder-link')
		if (link) {
			event.preventDefault()
			openFolder(link)
		}
		if (activeFolder && event.target.closest('[data-midi-close], .folder-content > a[href="#control-panel"]')) {
			event.preventDefault()
			closeFolder()
		}
	}, true)
	// Close the expanded panel before its compact-view Escape handler runs.
	panel.addEventListener('keydown', event => {
		if (!activeFolder || event.key !== 'Escape' || event.target.closest('dialog[open]')) return
		event.preventDefault()
		event.stopPropagation()
		closeFolder()
	}, true)
	panel.addEventListener('keydown', event => {
		if (!open || event.target.closest('dialog[open]')) return
		event.stopPropagation()
		if (event.key === 'Escape') { event.preventDefault(); activeFolder ? closeFolder() : change(false) }
		if (event.key === 'Tab') {
			const items = focusables()
			if (!items.length) return
			event.preventDefault()
			const index = items.indexOf(document.activeElement)
			items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length].focus()
		}
	})
	const stageObserver = new window.MutationObserver(() => {
		if ((open || requestedOpen) && (!root.classList.contains('loaded') || root.classList.contains('player-selection'))) {
			requestedOpen = false
			transition?.skipTransition()
			if (open) setOpen(false)
		}
	})
	stageObserver.observe(root, { attributes: true, attributeFilter: ['class'] })
	panel.controlsList = { open: () => change(true), close: () => change(false) }
	return panel.controlsList
}
