/**
 * This is a simple way to pass state from between pages without storing locally
 * bypassing the need for cookies or local storage.
 */

import { addToHistory, getLocationSettings } from './location-handler'

let state = null
let main

/**
 * Adds classnames to the main element to indicate the current state
 */
 const setUIState = (key, value) => {
	 // FIXME: filter these?
	main.classList.toggle(`flag-${key}`, value )
}

/**
 * Instantiates the state object
 * @param {String} key Optional key to specify return
 * @returns {Object} current state
 */
export const getState = ( key ) => {
	return key ? state[key] : state
}

/**
 * Instantiates the state object
 * @param {Object} defaultOptions initial state to overwrite
 * @param {HTMLElement} domElement HTML Element to add classes to
 * @returns {Object} current state
 */
export const createState = ( initialState, domElement ) => {
	state = Object.assign( {}, initialState )
	main = domElement || document.documentElement
	return state
}


/**
 * Instantiates the state object
 * @param {Object} defaultOptions initial state to overwrite
 * @param {HTMLElement} domElement HTML Element to add classes to
 * @returns {Object} current state
 */
export const loadState = ( defaultOptions, domElement ) => {
	return createState( getLocationSettings(defaultOptions) , domElement )
}


/**
 * refreshState : Refreshes the ui with any updated options
 * Adds classes to the domElement with all of the correct
 * classnames listed as option selection from the state
 * @returns {Object} current state
 */
export const refreshState = ()=>{
	Object.entries(state).forEach(([key,value])=>{
		setUIState( key, value )
	})
	return state
}

/**
 * setState : set / store the state of the ui & update DOM
 * Allows you to set the state of the ui by passing in 
 * individual options in key value pairs.
 * This is used in realtime button actions for example
 * @param {String} key state unique key ID
 * @param {String} value value to set the key to
 * @param {Array<HTMLElement>} elements buttons with toggleable attributes
 * @param {Boolean} saveHistory add to localStorage cache
 * @returns {Object} current state
 */
export const setState = ( key, value, elements=null, saveHistory=true )=>{
	
	state[key] = value
	
	if (saveHistory)
	{
		addToHistory(state,key)
	}

	// set flag on main 
	setUIState( key, value )

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
		//console.log( "Setting state", elements[key].checked , elements[key], {elements, ui, key} )
	}

	return state
}
