import { populateSelect } from './select'
import { DISPLAY_ICONS } from './display-icons.js'
import { DISPLAY_LABELS, DISPLAY_TYPES, DISPLAY_COMPOSITE } from '../display/display-types.js'
import { getCompositeDisplayTypes, getDefaultCompositeDisplays } from '../display/display-manager.js'

const displayTitle = type => DISPLAY_LABELS[DISPLAY_TYPES[type] ?? type]

export const getDisplayFallbackMessage = (requested, fallback) =>
	`${displayTitle(requested) ?? 'The requested display'} is not available. Switching to ${displayTitle(fallback) ?? 'the default display'}.`

/**
 * Create the display options for the Display select element
 * this only creates the UI and not the wiring
 * @param {Array<String>} displays 
 */
export const createDisplayOptions = ( displays, selectedDisplay, compositeDisplays, compositeLayout = 'layers' )=>{

	const items = displays.map( display => ({
		value: display,
		label: DISPLAY_LABELS[display] ?? display,
		icon: DISPLAY_ICONS[display],
		selected: display === selectedDisplay
	}))

	const select = populateSelect('select-display', items)
	if (!select)
	{
		return null
	}
	if (selectedDisplay)
	{
		select.value = selectedDisplay
	}

	for (const option of select.options) option.classList.add('tertiary', 'type-visual', 'group-overlay')

	// now unhide it
	const displayMenu = document.querySelector('label[for="select-display"]')
	if (displayMenu)
	{
		displayMenu.hidden = false
	}
	const children = document.getElementById('select-composite-displays')
	if (children) {
		const selected = compositeDisplays ?? getDefaultCompositeDisplays()
		populateSelect(children, getCompositeDisplayTypes().map(type => ({
			value: type, label: DISPLAY_LABELS[type] ?? type, icon: DISPLAY_ICONS[type], selected: selected.includes(type)
		})))
		for (const option of children.options) option.classList.add('tertiary', 'type-visual', 'group-overlay')
		children.closest('label').hidden = selectedDisplay !== DISPLAY_COMPOSITE
	}
	const layout = document.getElementById('select-composite-layout')
	if (layout) {
		layout.value = compositeLayout
		layout.closest('label').hidden = selectedDisplay !== DISPLAY_COMPOSITE
	}
	return select
}
