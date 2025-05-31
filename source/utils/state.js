/**
 * This is a simple way to pass state from between pages without storing locally
 * bypassing the need for cookies or local storage or GDPR cookie messages.
 */

import { getDomainDefaults, getFactoryDefaults } from '../settings/options'
import { addToHistory, getLocationSettings, getRefererHostname } from './location-handler'



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

export const setElementCheckState = (element, value) => {
	// console.info("setElementCheckState " + Date.now(),  typeof value,{element, to:value, from:element.checked} )
	// resolve element if not an element
	if (!element)
	{
		return
	}

	// ensure  that the element is a node otherwise search for it
	if ( 'nodeName' in element )
	{
	//console.log( "Setting state", elements[key].checked , elements[key], {elements, ui, key} )
	}else{
		element = document.querySelector(element)
		if (!element)
		{
			return
		}
	}

	//elements[key].checked = value
	// if ( typeof value === "boolean" && element.parentNode.nodeName === "LABEL")
	if ( element.parentNode.nodeName === "LABEL")
	{
		element.parentNode.classList.toggle("checked", value )
	}
	
	// if (value === element.checked)
	// {
	// 	// nothing to set?
	// 	console.error("Cannot set input check as already set", element, value)
	// 	// return false
	// }

	// Now update the node's selected state or option
	switch(element.nodeName)
	{
		case "INPUT":
			
			// console.error("Toggle checking", element.checked, value, element)
			element.checked = value
			// if (value)
			// {
			// 	element.setAttribute("checked", value)
			// }else{
			// 	element.removeAttribute("checked")
			// }
			// console.error("Toggle checked", element.checked, value, element)
			
			break

		case "SELECT":
			// if number, set the index directly, otherwise determine index from value
			if (!isNaN(value))
			{
				element.selectedIndex = value
			}else{
				// FIXME: Find option with this value
				element.setAttribute("selectedIndex ", value)
			}
			
			break
		case "ANCHOR":
			break

		default:
			console.info("Unknown element type", element.nodeName )
	}

	return true
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
export const setState = ( key, value, elements=null, saveHistory=true, repaint=true )=>{
	
	state[key] = value
	
	if (saveHistory)
	{
		addToHistory(state,key)
	}

	if (repaint)
	{
		// set flag on main 
		setUIState( key, value )
		
	}
	
	// NB. only send elements where the element itself wasnt
	// responsible for the origin of the event
	
	// also update select for checked and things? bit more complex?
	// see if there is a matching dom element???
	if (elements)
	{
		setElementCheckState(elements[key], value)
	}

	return state
}

// FIXME: Optimise this...
// TODO: Batch state setting...
export const setStates = (states, key, value, elements=null, saveHistory=true ) => {

	states.map( ({key,value}) => setUIState( key, value ) )

}

// TODO: Make a wrapper createStateStack
// stack.setState( "advancedMode", advancedMode )
export const EVENT_STATE_CHANGE = "global-state-change"


let hasNavigationOccurred = ('state' in window.history && window.history.state !== null)
		

/**
 * If you need to observe state changes, use this class
 * and pass around using singelton pattern. 
 * This will automatically read existing state from URL
 * and also any mutations
 */
export default class State {

	/**
	 * Use this to get the singleton instance
	 */
	static instance
	static getInstance( element ) {
		if (!State.instance)
		{
			State.instance = new State( element )
		}
		return State.instance
	}

	// set the element to somewhere 
	element

	// Map of states
	state

	// URL containing the current state
	url

	// set of callbacks to responfd to
	callbacks

	// an object with key value pairs that describe the
	// default state to use for when no options are specified
	defaultState

	// use historyState to store the state into
	// the history API so clicking back will unset
	// the setting rather than leave the site.
	saveHistory = true

	// we can have query params or ?d=b64esfhsejkfhk
	encode = false

	// do we want the state to also handle the UI updates?
	controlUI = true

	originalClassList

	// how many times has the state changed?
	stateChangeCount = 0

	set elementForClasses( element ){
		this.element = element
		this.originalClassList = element.className
	}

	get elementForClasses(){
		return this.element ?? document.documentElement
	}

	// get encoded(){
	// 	return encodeLocation(this.serialised)
	// }
	
	// get serialised(){
	// 	return JSON.stringify(this.asObject )
	// }

	get asObject(){
		return Object.fromEntries( this.state )
	}

	get entries(){
		return this.state.entries()
	}

	get asURI(){
		return this.url.href
	}

	/**
	 * Set the URL search params from another URLSearchParams object
	 * @param {URLSearchParams} params
	 */
	set searchParams( params ){
		params.forEach((value, key) => {
			this.url.searchParams.set(key, value)
		})
	}

	/**
	 * Get the URL search params as a URLSearchParams object	
	 * @returns {URLSearchParams}
	 */
	get searchParams(){
		return this.url.searchParams
	}

	/**
	 * Get the URL search params as a String	
	 * @returns {String}
	 */
	get searchParamsAsString(){
		return this.url.searchParams.toString()
	}

	constructor( main ){	

		this.state = new Map()
		this.callbacks = new Set()
		if (main)
		{
			this.elementForClasses = main
		}
		
		
		// URL has been updated internally? 
		// IF the user has only just begun to use the app, this popstate should be empty
		// so rather than go "back" we instead relaod the application to restart 
		// with the same state as before

		window.addEventListener("popstate", (event) => {
			if (event.state)
			{
				this.stateChangeCount++
				// console.info(this.stateChangeCount, "Previous State received: ", event, event.state)
				
				this.setState(event.state, true)
			}else{
				// console.error(this.stateChangeCount, "Previous State - NO STATE: ", event, event.state)
			}
			
			// FIXME: with back
			if (!hasNavigationOccurred || window.location.hash )
			{
				return
			}
			
			// console.log("RELOAD UNLESS IS HASH!", event)
			// console.log("location: " + document.location, hasNavigationOccurred, ", state: " + JSON.stringify(event.state))
			//window.location.reload()
		})		  
	}

	/**
	 * Browsers typically remember scroll position for  history state and
	 * will auto scroll when the location changes... 
	 * NB. Does not work on IE
	 */
	preventAutoScrolling(){
		if ("scrollRestoration" in history)
		{
			history.scrollRestoration = "manual"
		}
	}

	/**
	 * Load the entire state from the URL and replace any
	 * existing state
	 * @param {Object} defaultState 
	 * @param {Boolean} dispatchEvent - send out an event on complete
	 */
	loadFromLocation(defaultState=null, dispatchEvent=false){

		// if default options are provided to override
		if (defaultState)
		{
			this.setDefaults(defaultState)
		}

		// now fetch the state from the URL
		const locationState = getLocationSettings(defaultState)
		
		// this may have come as a single encoded uri so we check
		return this.setState( locationState, dispatchEvent )
	}

	/**
	 * Fetch a state value
	 * 
	 * @param {String} key 
	 * @returns 
	 */
	get( key ){
		return this.state.get(key)
	}

	/**
	 * Save a state value and update any dependent DOM UI
	 * @param {String} key 
	 * @param {String} value 
	 * @param {Boolean} dispatchEvent - send out an event on complete
	 */
	set( key, value, element=null, dispatchEvent=true ){
		
		this.state.set(key,value)
		
		if (this.controlUI)
		{
			// set flag on main
			this.elementForClasses.classList.toggle(`flag-${key}`, value )
		}

		// also update select for checked and things? bit more complex?
		// see if there is a matching dom element???
		if (element)
		{
			// debugger
			setElementCheckState(element, value)
			// element.checked = value
			//console.error("FSM>state", {key,to:value,checked:element.checked, element})
		}
		

		if (this.saveHistory)
		{
			const title = ""
			this.searchParams.set(key, value)
			// window.history.replaceState( this.asObject, title, this.url )
			window.history.pushState( this.asObject, title, this.url )
		}
		
		if (dispatchEvent)
		{
			this.dispatchEvent(key, value)
		}
	}

	/**
	 * Change the state of a key from one to the opposite
	 * @param {String} key 
	 * @param {HTMLElement} element 
	 * @param {Boolean} dispatchEvent 
	 * @returns 
	 */
	toggle( key, element=null, dispatchEvent=true ){
		const newState = !this.state.get(key)
		this.set( key, newState, element, dispatchEvent )
		return newState
	}

	/**
	 * Update the entire UI to match the current state
	 */
	updateFrontEnd(){
		let classNames = ""
			
		this.state.forEach( (value,key) => {
			if (value) {
				classNames += `flag-${key} `
			}
			// TODO: try and find an associative input for selection
			// const input = document.querySelector(`input[name="${key}"]`)

		})
		
		// force selected atates etc
		this.elementForClasses.className = `${this.originalClassList} ${classNames}`
	}

	/**
	 * Replace the current state with a new one
	 * NB. This is very slow so do not do it regularly!
	 * 
	 * @param {Object} newState 
	 * @param {Boolean} dispatchEvent - send out an event on complete
	 */
	setState(newState, dispatchEvent=true){
		
		// no new state provided
		if (!newState)
		{
			return this.state
		}
		
		// reset URL to blank hostname
		this.url = new URL( location.origin + location.pathname )
		
		// this.searchParams = new URLSearchParams()
		
		// const keys = Object.keys(newState)
		// loop through and add these defaults
		// for(let key of keys)
		// {
		// 	this.state.set( key, newState[key] ) 
		// }

		this.state = new Map(Object.entries(newState))
		
		// update the location and history
		if (this.saveHistory)
		{
			//this.searchParams = new URLSearchParams()
			this.state.forEach( (value,key) => {
				this.searchParams.set( key, value )
			})
		}

		// update the front end
		if (this.controlUI)
		{
			// toggle them all at once!!!
			this.updateFrontEnd()
		}
		
		// remind all listeners about this transaction
		if (dispatchEvent)
		{
			this.dispatchEvent()
		}

		return this.state
	}

	/**
	 * 
	 * @param {Object} defaultState 
	 * @param {Boolean} dispatchEvent - send out an event on complete
	 */
	setDefaults(defaultState, dispatchEvent=false ){
		this.defaultState = defaultState
		return this.setState( defaultState, dispatchEvent )
	}

	/**
	 * Updates the URL with an encoded version of the existing state
	 * @param {Boolean} encode 
	 */
	updateLocation( encode=false ){
		const url = new URL(window.location)
		const options = {}
		
		if (encode)
		{
			window.history.pushState( this.asObject, null, url.pathname + "?b=" + encodeLocation(url.search) )
		}else{

			this.state.forEach( (value,key) => {
				options[key] = value
				url.searchParams.set(key, value)
			})
			window.history.pushState(options, null, url)
		}
		// console.log("History", { options, url} , url.toString() )
	}

	/**
	 * Reset to the default options provided in
	 * the constructor
	 * 
	 * @param {Boolean} dispatchEvent 
	 */
	reset( dispatchEvent=false ){
		this.setState( this.defaultState, dispatchEvent )
	}

	/**
	 * Reload the state and dispatch an optional update
	 * @param {Boolean} dispatchEvent 
	 */
	refresh( dispatchEvent=false ){
		this.loadFromLocation( null,  dispatchEvent )
	}

	// -- EVENTS ---------------------------

	/**
	 * 
	 * @param {String} key 
	 * @param {Boolean|String|Object} value 
	 */
	dispatchEvent( key, value ){
		// TODO: Only send changes?
		// const detail = { key, value } 
		// const event = new CustomEvent(EVENT_STATE_CHANGE, { detail })
		if (this.callbacks.size)
		{
			this.callbacks.forEach( callback => callback(key,value) )
			// this.callbacks.forEach( callback => callback(event) )
		}else{
			window.dispatchEvent(event)
		}
	}

	addEventListener( callback ){
		this.callbacks.add(callback)
	}

	removeEventListener( callback ){
		this.callbacks.delete(callback)
	}
}

/**
 * Determine options for this session from three different
 * app sources, the query string, the global this and the domain specific options
 * @returns {Object}
 */
export const createStateOptionsFromHost = (extraOptions={}) => {
	const hostName = getRefererHostname()
	const globalOptions = Object.assign({}, globalThis._synth)
	const domainOptions = getDomainDefaults( hostName )
	const defaultOptions = { ...domainOptions, ...globalOptions, ...extraOptions }

	return defaultOptions
}


/**
 * 
 * @param {HTMLElement} elementToAddClassTo 
 * @param {Object} defaultOptions
 * @param {Class} StateClass 
 * @returns 
 */
export const createStateFromHost = (elementToAddClassTo, defaultOptions=null, StateClass=State) => {
	
	const stateOptions = defaultOptions ?? createStateOptionsFromHost()

	const state = StateClass.getInstance(elementToAddClassTo)

	//state.setDefaults(defaultOptions)
	state.loadFromLocation(stateOptions)

	// updates the URL with the current state (true - encoded)
	state.updateLocation()

	//state.setDefaults(defaultOptions)
	// stateMachine.loadFromLocation(defaultOptions)
	
	// Update UI - this will check all the inputs according to our state	
	state.updateFrontEnd()
	
	// prevent URL changes from scrolling to that hash
	state.preventAutoScrolling()

	return state
}