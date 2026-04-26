import { populateSelect } from './select'

/**
 * Create the display options for the Display select element
 * this only creates the UI and not the wiring
 * @param {Array<String>} displays 
 */
export const createDisplayOptions = ( displays )=>{

	const items = displays.map( display => ({
		value: display,
		label: display
	}))

	populateSelect('select-display', items)

	// now unhide it
	const displayMenu = document.querySelector('label[for="select-display"]')
	displayMenu.hidden = false
}
