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

const setElementCheckState = (element, value) => {
	if ( element )
	{
		//elements[key].checked = value
		element.setAttribute("checked", value)
		if (element.parentNode.nodeName === "LABEL")
		{
			element.parentNode.classList.toggle("checked", value )
		}
		//console.log( "Setting state", elements[key].checked , elements[key], {elements, ui, key} )
	}

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

export const encodeLocation = location => encodeURIComponent(location)
// export const encodeLocation = location => btoa(encodeURIComponent(location))
export const decodeLocation = base64Data => decodeURIComponent(window.atob( base64Data))		

// TODO: Make a wrapper createStateStack
// stack.setState( "advancedMode", advancedMode )
export const EVENT_STATE_CHANGE = "global-state-change"


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

	set elementForClasses( element ){
		this.element = element
		this.originalClassList = element.className
	}

	get elementForClasses(){
		return this.element ?? document.documentElement
	}

	/**
	 * Set the URL search params
	 */
	set searchParams( params ){
		//
		this.url.searchParams = params
	}

	get encoded(){
		return encodeLocation(this.serialised)
	}
	
	get serialised(){
		return JSON.stringify(this.asObject )
	}

	get asObject(){
		return Object.fromEntries( this.state )
	}

	get entries(){
		return this.state.entries()
	}

	get asURI(){
		return this.url.href
	}

	get asEncodedURI(){
		const url = new URL(window.location)
		this.state.forEach( (value,key) => {
			url.searchParams.set(key, value)
		})
		return url.pathname + "?b=" + encodeLocation(url.search)
	}

	get searchParams(){
		return this.url.searchParams
	}

	constructor( main ){	

		this.state = new Map()
		this.callbacks = new Set()
		if (main)
		{
			this.elementForClasses = main
		}
		
		window.addEventListener("popstate", (event) => {
			console.log("Previous State received: ", event, event.state)
			this.setState(event.state, true)
		})		  
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
	set( key, value, dispatchEvent=true ){
		this.state.set(key,value)
		if (this.controlUI)
		{
			// set flag on main
			( this.element ?? document.documentElement).classList.toggle(`flag-${key}`, value )
		}

		if (this.saveHistory)
		{
			const title = ""
			this.searchParams.set(key, value)
			window.history.pushState( this.asObject, title, this.url )
		}
		
		if (dispatchEvent)
		{
			this.dispatchEvent(key, value)
		}
	}

	/**
	 * Update the entire UI to match the current state
	 */
	updateFrontEnd(){
		let classNames = ""
			
		this.state.forEach( (value,key) => {
			classNames += `flag-${key} `
			// TODO: try and find an associative input for selection
			// const input = document.querySelector(`input[name="${key}"]`)

		})
		
		console.log("GARH", classNames )
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
		this.url = new URL( location.origin )
		
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
		
		console.log("History", { options, url} , url.toString() )
	}


	/**
	 * Reset to the default options provided in
	 * the constructor
	 */
	reset( dispatchEvent=false ){
		this.setState( this.defaultState, dispatchEvent )
	}

	/**
	 * Reload the state and dispatch an optional update
	 */
	refresh( dispatchEvent=false ){
		this.loadFromLocation( null,  dispatchEvent )
	}

	/**
	 * Provide a base64 encoded string and this will decode it
	 * @param {String} base64Data 
	 */
	decode( base64Data ){
		const url = new URL(base64Data)
		decodeLocation( url.search.b )		
	}

	// -- EVENTS ---------------------------
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


export const createStateFromHost = (elementToAddClassTo) => {
	
	const hostName = getRefererHostname()
	const globalOptions = Object.assign({}, globalThis._synth)
	const domainOptions = getDomainDefaults( hostName )
	const defaultOptions = { ...domainOptions, ...globalOptions }

	const state = State.getInstance(elementToAddClassTo)

	//state.setDefaults(defaultOptions)
	state.loadFromLocation(defaultOptions)

	// updates the URL with the current state (true - encoded)
	state.updateLocation()
	
	// Update UI - this will check all the inputs according to our state	
	state.updateFrontEnd()

	return state
}