import {FOLDERS} from './audio'

export const setupInterface = () => {
	// populate form elements
		
	// populate ui
	const uiOptions = FOLDERS.map( folder => `<option value="${folder}">${folder}</option>` ) 
	const uiSelect = `<select>${uiOptions.join('')}</select>`

	// metronome
	const metronome = ''

	// add to dom
	document.documentElement.appendChild( document.createDocumentFragment(uiSelect) )
}
