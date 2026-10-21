const STORAGE_KEY = 'photosynth.accessibility.v1'
const defaults = { theme: 'original', textSize: '100', motion: 'system', readableFont: false, textSpacing: false, largeTargets: false, underlineLinks: false, strongFocus: false }
const choices = { theme: ['original', 'system', 'light', 'dark', 'contrast-dark', 'contrast-light', 'sepia', 'ocean', 'monochrome'], textSize: ['100', '125', '150', '200'], motion: ['system', 'reduce'] }
const instanceKey = Symbol.for('photosynth.accessibility.controls')

export const setupAccessibilityControls = () => {
	const panel = document.getElementById('accessibility-panel')
	if (!panel) return null
	if (panel[instanceKey]) return panel[instanceKey]
	const root = document.documentElement
	const tab = document.getElementById('accessibility-tab')
	const settings = document.getElementById('button-accessibility')
	const triggers = [tab, settings].filter(Boolean)
	const title = panel.querySelector('#a11y-title')
	let opener = tab
	const status = panel.querySelector('[role="status"]')
	const colourScheme = window.matchMedia?.('(prefers-color-scheme: dark)')
	const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)')
	let preferences = { ...defaults }
	try {
		const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
		for (const key of Object.keys(defaults)) {
			if (choices[key] ? choices[key].includes(saved?.[key]) : typeof saved?.[key] === 'boolean') preferences[key] = saved[key]
		}
	} catch { /* Storage may be unavailable or contain an older format. */ }
	const apply = () => {
		root.dataset.a11yTheme = preferences.theme === 'system' ? (colourScheme?.matches ? 'dark' : 'light') : preferences.theme
		root.dataset.a11yTextSize = preferences.textSize
		root.classList.toggle('a11y-reduce-motion', preferences.motion === 'reduce' || !!motion?.matches)
		for (const key of Object.keys(defaults).filter(key => typeof defaults[key] === 'boolean')) root.classList.toggle(`a11y-${key}`, preferences[key])
		for (const input of panel.querySelectorAll('[data-preference]')) {
			const value = preferences[input.dataset.preference]
			if (input.type === 'checkbox') input.checked = value
			else input.value = value
		}
	}
	const save = message => {
		apply()
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
			status.textContent = message
		} catch { status.textContent = 'Applied for this visit. Your browser could not save these preferences.' }
	}
	panel.addEventListener('change', event => {
		const key = event.target.dataset.preference
		if (!Object.hasOwn(defaults, key)) return
		const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
		if (choices[key] && !choices[key].includes(value)) return
		preferences[key] = value
		save('Preferences saved on this device.')
	})
	panel.querySelector('[data-reset-accessibility]').addEventListener('click', () => {
		preferences = { ...defaults }
		save('Accessibility preferences reset. System motion preferences are still respected.')
	})
	const hide = () => {
		if (panel.contains(document.activeElement)) opener?.focus()
		panel.close()
		triggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'))
		return true
	}
	const show = (trigger = tab?.hidden ? settings : tab) => {
		opener = trigger
		panel.removeAttribute('inert')
		if (!panel.open) panel.show()
		triggers.forEach(button => button.setAttribute('aria-expanded', 'true'))
		title.focus()
		return true
	}
	triggers.forEach(trigger => trigger.addEventListener('click', () => panel.open ? hide() : show(trigger)))
	panel.querySelector('[data-close-accessibility]').addEventListener('click', hide)
	panel.addEventListener('close', () => {
		if (panel.open) return
		triggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'))
	})
	// The shared dialog close icon is drawn on the dialog's padding area.
	panel.addEventListener('click', event => { if (event.target === panel) hide() })
	panel.addEventListener('keydown', event => {
		// Keep app performance shortcuts out of the settings controls.
		event.stopPropagation()
		if (event.key === 'Escape' && panel.open) { event.preventDefault(); hide() }
	})
	let started
	const updateEntryPoint = () => {
		const next = root.classList.contains('loaded') && !root.classList.contains('player-selection')
		if (started === next) return
		const restoreFocus = panel.contains(document.activeElement) || triggers.includes(document.activeElement)
		started = next
		if (tab) tab.hidden = started
		if (settings) settings.hidden = !started
		opener = started ? settings : tab
		hide()
		if (restoreFocus) opener?.focus()
	}
	const stageObserver = new MutationObserver(updateEntryPoint)
	stageObserver.observe(root, { attributes: true, attributeFilter: ['class'] })
	updateEntryPoint()
	colourScheme?.addEventListener('change', apply)
	motion?.addEventListener('change', apply)
	apply()
	const controls = { show, hide }
	panel[instanceKey] = controls
	return controls
}
