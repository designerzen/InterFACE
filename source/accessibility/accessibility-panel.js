import { STORAGE_KEY, PRESETS_KEY, defaults, typography, outlines, colours, validPreference, sanitisePreferences, sanitisePresets, quickPresets, contrastRatio } from './preferences.js'
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
	let presets = []
	try {
		preferences = sanitisePreferences(JSON.parse(localStorage.getItem(STORAGE_KEY)))
	} catch { /* Storage may be unavailable or contain an older format. */ }
	try { presets = sanitisePresets(JSON.parse(localStorage.getItem(PRESETS_KEY))) } catch { /* No saved presets yet. */ }
	const presetSelect = panel.querySelector('#a11y-preset')
	const presetName = panel.querySelector('#a11y-preset-name')
	const deletePreset = panel.querySelector('[data-delete-preset]')
	const buildSelects = (mount, definitions) => {
		for (const [key, label, , values] of definitions) {
			const row = document.createElement('div')
			row.className = 'a11y-field'
			const caption = document.createElement('label')
			caption.htmlFor = `a11y-${key}`
			caption.textContent = label
			const select = document.createElement('select')
			select.id = caption.htmlFor
			select.dataset.preference = key
			for (const value of values) select.add(new Option(value === 'original' ? 'Follow app / reading options' : value, value))
			row.append(caption, select)
			panel.querySelector(mount).append(row)
		}
	}
	buildSelects('#a11y-typography', typography)
	buildSelects('#a11y-outlines', outlines)
	for (const group of new Set(colours.map(([, , group]) => group))) {
		const fieldset = document.createElement('fieldset')
		const legend = document.createElement('legend')
		legend.textContent = group
		fieldset.append(legend)
		for (const [key, label] of colours.filter(([, , name]) => name === group)) {
			const row = document.createElement('label')
			row.className = 'a11y-colour'
			const caption = document.createElement('span')
			caption.textContent = label
			const input = document.createElement('input')
			input.type = 'color'
			input.dataset.preference = key
			input.setAttribute('aria-describedby', 'a11y-colour-hint')
			const value = document.createElement('output')
			input.id = `a11y-${key}`
			value.htmlFor = input.id
			value.dataset.colourValue = key
			row.append(caption, input, value)
			fieldset.append(row)
		}
		panel.querySelector('#a11y-colours').append(fieldset)
	}
	const refreshPresets = (selection = '') => {
		presetSelect.replaceChildren(new Option('Current preferences', ''))
		quickPresets.forEach((preset, index) => presetSelect.add(new Option(preset.name, `quick-${index}`)))
		presets.forEach((preset, index) => presetSelect.add(new Option(`Saved: ${preset.name}`, `saved-${index}`)))
		presetSelect.value = selection
		deletePreset.disabled = !selection.startsWith('saved-')
	}
	const updateContrast = () => {
		const output = panel.querySelector('#a11y-contrast')
		if (preferences.theme !== 'custom') { output.textContent = 'Choose Custom colours to check your colour combinations.'; return }
		const pairs = [
			['Page text', 'pageText', 'pageBackground', 4.5], ['Panel text', 'pageText', 'surfaceBackground', 4.5],
			['Links', 'linkColour', 'pageBackground', 4.5], ['Button text', 'buttonText', 'buttonBackground', 4.5],
			['Menu text', 'menuText', 'menuBackground', 4.5], ['Label text', 'labelText', 'labelBackground', 4.5],
			['Dialog text', 'popupText', 'popupBackground', 4.5], ['Page focus', 'focusColour', 'pageBackground', 3],
			['Dialog focus', 'focusColour', 'popupBackground', 3], ['Slider', 'sliderThumb', 'sliderTrack', 3],
		]
		output.textContent = pairs.map(([label, foreground, background, minimum]) => {
			const ratio = contrastRatio(preferences[foreground], preferences[background])
			return `${label}: ${ratio.toFixed(2)}:1 (${ratio >= minimum ? 'meets' : 'below'} ${minimum}:1).`
		}).join(' ') + ' These checks cover the selected colour pairs; they do not assess the whole app.'
	}
	const apply = () => {
		for (const [key, , , variable] of colours) {
			if (preferences.theme === 'custom') root.style.setProperty(variable, preferences[key])
			else root.style.removeProperty(variable)
		}
		root.dataset.a11yTheme = preferences.theme === 'system' ? (colourScheme?.matches ? 'dark' : 'light') : preferences.theme
		root.dataset.a11yTextSize = preferences.textSize
		for (const [key, , variable] of [...typography, ...outlines]) {
			root.toggleAttribute(`data-a11y-${key.toLowerCase()}`, preferences[key] !== defaults[key])
			if (preferences[key] === 'original') root.style.removeProperty(variable)
			else root.style.setProperty(variable, preferences[key])
		}
		root.classList.toggle('a11y-reduce-motion', preferences.motion === 'reduce' || !!motion?.matches)
		for (const key of Object.keys(defaults).filter(key => typeof defaults[key] === 'boolean')) root.classList.toggle(`a11y-${key}`, preferences[key])
		const computed = getComputedStyle(root)
		for (const input of panel.querySelectorAll('[data-preference]')) {
			const key = input.dataset.preference
			let value = preferences[key]
			if (input.type === 'color' && preferences.theme !== 'custom') {
				const definition = colours.find(([name]) => name === key)
				const colour = computed.getPropertyValue(definition[3]).trim()
				if (/^#[\da-f]{6}$/i.test(colour)) value = colour
			}
			if (input.type === 'checkbox') input.checked = value
			else input.value = value
			if (input.type === 'color') panel.querySelector(`[data-colour-value="${key}"]`).textContent = value.toUpperCase()
		}
		updateContrast()
	}
	const save = message => {
		apply()
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
			status.textContent = message
		} catch { status.textContent = 'Applied for this visit. Your browser could not save these preferences.' }
	}
	const updatePreference = event => {
		const key = event.target.dataset.preference
		const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
		if (!validPreference(key, value)) return
		if (event.target.type === 'color') {
			if (preferences.theme !== 'custom') {
				for (const [name] of colours) preferences[name] = panel.querySelector(`[data-preference="${name}"]`).value
			}
			preferences.theme = 'custom'
		}
		preferences[key] = value
		refreshPresets()
		save('Preferences saved on this device.')
	}
	panel.addEventListener('change', updatePreference)
	presetSelect.addEventListener('change', () => {
		const [type, index] = presetSelect.value.split('-')
		const preset = (type === 'quick' ? quickPresets : presets)[Number(index)]
		if (!preset) { deletePreset.disabled = true; return }
		preferences = { ...preset.preferences }
		presetName.value = type === 'saved' ? preset.name : ''
		deletePreset.disabled = type !== 'saved'
		save(`Applied ${preset.name}. Preferences saved on this device.`)
	})
	const savePresets = message => {
		try { localStorage.setItem(PRESETS_KEY, JSON.stringify(presets)); status.textContent = message }
		catch { status.textContent = 'Presets are available for this visit. Your browser could not save them. Export to keep a copy.' }
	}
	panel.querySelector('[data-save-preset]').addEventListener('click', () => {
		const name = presetName.value.trim()
		if (!name) { status.textContent = 'Enter a name for your preset.'; presetName.focus(); return }
		let index = presets.findIndex(preset => preset.name === name)
		if (index < 0 && presets.length >= 20) { status.textContent = 'You can save up to 20 presets. Delete a preset before adding another.'; return }
		if (index < 0) index = presets.length
		presets[index] = { name, preferences: { ...preferences } }
		refreshPresets(`saved-${index}`)
		savePresets(`Saved preset ${name}.`)
	})
	deletePreset.addEventListener('click', () => {
		if (!presetSelect.value.startsWith('saved-')) return
		presets.splice(Number(presetSelect.value.slice(6)), 1)
		refreshPresets()
		savePresets('Preset deleted. Current preferences still apply.')
	})
	panel.querySelector('[data-export-accessibility]').addEventListener('click', () => {
		const blob = new Blob([JSON.stringify({ format: 'photosynth-accessibility', version: 1, preferences, presets }, null, 2)], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = 'photosynth-accessibility.json'
		document.body.append(link)
		link.click()
		link.remove()
		setTimeout(() => URL.revokeObjectURL(url), 1000)
		status.textContent = 'Accessibility preferences exported.'
	})
	const importFile = panel.querySelector('#a11y-import')
	panel.querySelector('[data-import-accessibility]').addEventListener('click', () => importFile.click())
	importFile.addEventListener('change', async () => {
		const file = importFile.files[0]
		if (!file) return
		try {
			if (file.size > 128 * 1024) throw new Error('Choose a preferences file smaller than 128 KB.')
			const data = JSON.parse(await file.text())
			if (data?.format !== 'photosynth-accessibility' || data.version !== 1) throw new Error('Choose a PhotoSYNTH accessibility export.')
			const next = sanitisePreferences(data.preferences, true)
			const incoming = sanitisePresets(data.presets)
			const merged = new Map(presets.map(preset => [preset.name, preset]))
			incoming.forEach(preset => merged.set(preset.name, preset))
			if (merged.size > 20) throw new Error('The combined library would exceed 20 presets.')
			preferences = next
			presets = [...merged.values()]
			refreshPresets()
			save('Imported preferences applied and saved on this device.')
			// Preserve a storage error from either write.
			const preferenceMessage = status.textContent
			savePresets(preferenceMessage)
		} catch (error) { status.textContent = `Could not import preferences. ${error instanceof SyntaxError ? 'The file is not valid JSON.' : error.message}` }
		finally { importFile.value = '' }
	})
	panel.querySelector('[data-reset-accessibility]').addEventListener('click', () => {
		preferences = { ...defaults }
		refreshPresets()
		save('Accessibility preferences reset. System motion preferences are still respected.')
	})
	const hide = () => {
		const restoreFocus = panel.contains(document.activeElement)
		panel.close()
		if (restoreFocus) opener?.focus()
		triggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'))
		return true
	}
	const show = (trigger = tab?.hidden ? settings : tab) => {
		opener = trigger
		panel.removeAttribute('inert')
		if (!panel.open) panel.showModal()
		triggers.forEach(button => button.setAttribute('aria-expanded', 'true'))
		title.focus()
		return true
	}
	triggers.forEach(trigger => trigger.addEventListener('click', () => panel.open ? hide() : show(trigger)))
	panel.querySelectorAll('[data-close-accessibility]').forEach(button => button.addEventListener('click', hide))
	panel.addEventListener('submit', event => event.preventDefault())
	panel.addEventListener('cancel', event => { event.preventDefault(); hide() })
	panel.addEventListener('close', () => {
		if (panel.open) return
		triggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'))
	})
	// Only dismiss clicks outside the dialog bounds, never gaps between controls.
	panel.addEventListener('click', event => {
		if (event.target !== panel) return
		const box = panel.getBoundingClientRect()
		if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) hide()
	})
	panel.addEventListener('keydown', event => {
		// Keep app performance shortcuts out of the settings controls.
		event.stopPropagation()
		if (event.key === 'Tab') {
			const focusable = [...panel.querySelectorAll('button, input, select, textarea, summary, a[href], [tabindex]')]
				.filter(element => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden')
			const first = focusable[0], last = focusable.at(-1)
			if (event.shiftKey && (document.activeElement === first || document.activeElement === title)) { event.preventDefault(); last?.focus() }
			else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
		}
		if (event.key === 'Escape' && panel.open) { event.preventDefault(); hide() }
	})
	panel.addEventListener('keyup', event => event.stopPropagation())
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
	window.addEventListener('storage', event => {
		if (event.storageArea !== localStorage) return
		if (event.key === STORAGE_KEY || event.key === null) {
			try { preferences = sanitisePreferences(JSON.parse(event.newValue)); refreshPresets(); apply() } catch { /* Ignore corrupt updates. */ }
		}
		if (event.key === PRESETS_KEY || event.key === null) {
			try { presets = event.newValue === null ? [] : sanitisePresets(JSON.parse(event.newValue)); refreshPresets() } catch { /* Keep the usable library. */ }
		}
	})
	refreshPresets()
	apply()
	const controls = { show, hide }
	panel[instanceKey] = controls
	return controls
}
