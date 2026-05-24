import { populateSelect } from './select'

/**
 * Create the display options for the Display select element
 * this only creates the UI and not the wiring
 * @param {Array<String>} displays 
 */
export const createDisplayOptions = ( displays, selectedDisplay )=>{

	const items = displays.map( display => ({
		value: display,
		label: display,
		selected: display === selectedDisplay
	}))

	const select = populateSelect('select-display', items)
	if (selectedDisplay)
	{
		select.value = selectedDisplay
	}

	// now unhide it
	const displayMenu = document.querySelector('label[for="select-display"]')
	displayMenu.hidden = false
	return select
}
