import { addToHistory } from './location-handler'

let state = null
let main

export const createState = ( initialState, domElement ) => {
	state = Object.assign({},initialState )
	main = domElement || document.documentElement
	return state
}

///////////////////////////////////////////////////////////
// simply refreshes the ui with any updated options
export const refreshState = ()=>{

	Object.entries(state).forEach(([key,value])=>{
		main.classList.toggle(`flag-${key}`, value )
	})
}

///////////////////////////////////////////////////////////
// This simply allows you to set the state of the ui
export const setState = ( key, value, elements=null, saveHistory=true )=>{
	
	// update object
	state[key] = value
	
	if (saveHistory)
	{
		addToHistory(state,key)
	}

	// set flag on main 
	main.classList.toggle(`flag-${key}`, value )

	// NB. only send elements where the element itself wasnt
	// responsible for the origin of the event
	
	// also update select for checked and things? bit more complex?
	// see if there is a matching dom element???
	if ( elements && elements[key] )
	{
		//elements[key].checked = value
		elements[key].setAttribute("checked", value)
		if (elements[key].parentNode.nodeName === "LABEL")
		{
			elements[key].parentNode.classList.toggle("checked", value )
		}
		console.log( "Setting state", elements[key].checked , elements[key], {elements, ui, key} )
		
	}

	return state
}
