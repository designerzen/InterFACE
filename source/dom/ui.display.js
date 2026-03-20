/**
 * Create the display options for the Display select element
 * this only creates the UI and not the wiring
 * @param {Array<String>} displays 
 */
export const createDisplayOptions = ( displays )=>{

	const displaySelectElement = document.getElementById('select-display')
	const fragment = document.createDocumentFragment()
	
	// update UI for available
	// create the options for the select element
	displays.map( display => {
		const option = document.createElement('option')
		option.value = display
		option.text = display
		fragment.appendChild(option)
	})

	displaySelectElement.appendChild(fragment)

	// now unhide it
	const displayMenu = document.querySelector('label[for="select-display"]')
	displayMenu.hidden = false
}
