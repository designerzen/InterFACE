/**
 * 
 * 		
 * // Load any saved settings for this specific user name
 * const personMeta = stateMachine.get( storageKey )
 * const storageKey = 'p'+(index+1)
 * const savedOptions = store.has(storageKey) ? store.getItem(storageKey) : {}
 * const options = Object.assign ( {}, savedOptions, personOptions ) 
 * const personManager = new PersonManager()
 * const person = personManager.createPerson()
 * await person.setupAudio(audioContext, audioChain, instrumentManager.clone(), offlineAudioContext, preset)
 * 
 * personManager.configurePerson( person, personOptions, importedData )
 * 
 * // Events dispatched by Person :
 * const markInstrumentProgress = (progress,instrumentName) =>{ 
 * 	const percent = Math.ceil(progress*100)
		//setFeedback( `${instrumentName} ${Math.ceil(progress*100)} Loading` )
		if (percent < 99){
			setToast( `${instrumentName} ${percent}% Loading...` )
		}else{
			setToast( `${person.instrumentTitle} Loaded!` )
		}
	} 
 */

import Person, { EVENT_PERSON_BORN, EVENT_PERSON_DEAD } from "./person.js"
import { configurePersonByIndex, configurePersonByOperatingMode } from "./person.presets.js"
import { DEFAULT_PEOPLE_OPTIONS } from "../settings/options.people.js"

/**
 * This creates all people, selects one at a time
 * and 
 */
export class PersonManager extends EventTarget{

	people = []

	// nobody is selected by default
	highlightedPersonIndex = -1
	selectedPersonIndex = -1

	get players(){
		return this.people
	}
	get quantityOfPlayers(){
		return this.people.length
	}

	constructor(){
		super()
	}

	createPerson( options={} ){
		const index = this.quantityOfPlayers
		const defaultOptions = DEFAULT_PEOPLE_OPTIONS[index]
	
		// TODO: Change these per person...
		const personOptions = { 
			...defaultOptions,
			...options
		}

		// Create our person with the specified options
		const person = new Person( index, options ) 

		/*
		// Proxy events through to parents
		person.addListener( EVENT_PERSON_BORN,  (event) => {
			const {detail} = event
			detail.person = person
			// console.info("Person has been born!", detail)
			// dispatchEvent(event)
			this.dispatchCustomEvent(event.type, detail)
		})

		person.addListener( EVENT_PERSON_DEAD,  (event) => {
			const {detail} = event
			detail.person = person
			// console.info("Person has died!", detail)
			// dispatchEvent(event)
			this.dispatchCustomEvent(event.type, detail)
		})
		
		// A person's instrument has loaded into memory, so we
		// update the state options to show the user also
		person.addListener( EVENT_INSTRUMENT_LOADING, (event) => {
			const {detail} = event
			detail.person = person
			// const { progress, instrumentName, instrumentPack } = detail
			// markInstrumentProgress( progress, instrumentName )
			// console.info("Person preset ["+instrumentName+"] loading!", Math.floor(progress*100))
			this.dispatchCustomEvent(event.type, detail)
		})

		person.addListener( EVENT_INSTRUMENT_CHANGED,  (event) => {
			const {detail} = event
			// const { presetIndex, presetName, presetTitle, instrumentPack } = detail
			detail.person = person

			//console.log("External event for ",{ person, detail , cache})
			// setFeedback( `${person.instrumentTitle} Ready!`.toUpperCase(), 0, 'instrument' ) 
			// dispatchEvent(event)
			// const personData = person.exportData()
			
			// save it for next time
			// const cache = store.setItem( presetName, {instrument:presetName })
			
			// // save this for reloading next time in the URL
			// stateMachine.set( storageKey, personData )
			
			// const test = stateMachine.get( storageKey )
			// console.error(person.personIndex, "Setting statemachine with person",personData, {person,detail, stateMachine, storageKey, test} )

			dispatchCustomEvent(event.type, detail)
		})
		*/

		/*
		// we need this to also update any playing midi notes
		person.addListener(EVENT_EMOTION_CHANGED, event => {	
			const {detail} = event
			const { emoticon, person } = detail
			console.log("Emotion changed", detail)
			// setToast( `${detail.emoticon} Emotion Changed` ) 
		})
		*/
	
		this.people[index] = person
		return person
	}

	/**
	 * set up the user in a certain mode
	 * @param {Person} person 
	 * @param {Object} personOptions
	 * @param {Object} importedOptions
	 */
	configurePerson(person, personOptions, importedOptions){
		const personData = person.exportData()
		if (importedOptions && importedOptions.userMode && Number.isInteger(importedOptions.userMode) && importedOptions.userMode > -1 )
		{
			console.info("@@@ Configuring person with URL data", {person, personData, personOptions, importedOptions} )
			configurePersonByOperatingMode( person, importedOptions.userMode )
		}else{
			console.info("@@@ Configuring person by index", {person, personData, personOptions, importedOptions} )
			configurePersonByIndex( person, this.people )		
		}
	}

	/**
	 * Create / Fetch a user (we cache every new user)
	 * @param {Number} index Person's at index
	 * @returns {Function} Player Class 
	 */
	getPerson(index=0) {
		if (this.people[index] == undefined)
		{
			return this.createPerson()
		} else{
			return this.people[index]
		}
	}

	/**
	 * get every registered person
	 * @returns 
	 */
	getPeople(){
		return this.people.slice()
	}
	
	/**
	 * Finds the first person that is considered "active"
	 * NB. As we drift around 
	 * @returns Person
	 */
	getActivePerson(){
		for (let index=0, l=this.people.length; index<l; ++index)
		{
			const person = this.people[index]
			if (person && person.isActive)
			{
				return person
			}
		}
		return this.getPerson(0)
	}

	/**
	 * Loop through all people and find the
	 * one that is closest to the x,y coords
	 * provided
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 * @returns person index
	 */
	getNearestPerson(x,y){
		let nearestPersonIndex = 0
		let distance = Number.MAX_VALUE
		for (let index=0, l=this.people.length; index<l; ++index)
		{
			const person = this.people[index]
			const box = person.boundingBox

			if ( !box || person.x === -1 )
			{
				//console.error("getNearestPerson skipping as unsure where user is", person)
				continue
			}

			const dx = x - person.x
			const dy = y - person.y
			const distanceSquared = dx*dx + dy*dy
					
			//console.error( index, "getNearestPerson", distanceSquared, person.id, peopleArray.length, {peopleArray,dx,dy} )

			if (distanceSquared < distance)
			{
				distance = distanceSquared
				nearestPersonIndex = index
			}
		}
			
		// console.info( "getNearestPerson",nearestPersonIndex, distanceSquared, peopleArray.length, {peopleArray,dx,dy} )

		return nearestPersonIndex
	}


	/**
	 * merges all named player options into an array eg. [{ values } , { values }]
	 * @param {Array<string>} values Selective player configuration object keys
	 * @returns {Array<Boolean>} Player configuration object
	 */
	getPlayerOptions(values){
		return people.map( 
			player => values.reduce((accumulator, currentValue, index, array) => {	
				accumulator[currentValue] = player.options[currentValue]
				return accumulator
			}, {} )
		)
	}

	/**
	 * Set all existing player's options to the selected values 
	 * (change the default for any new players created)
	 * @param {Number} option Variable to set
	 * @param {Number} value Value to set the variable to
	 */
	setPlayerOption(option, value) {
		this.people.forEach( player => player.options[option] = value)
	}

	/**
	 * Player options batch Update
	 * @param {Array<string>|Object} values - Selective player configuration object keys
	 */
	setPlayerOptions(values) {
		const unique = Array.isArray(values) 
		// change the default for any new players created
		this.people.forEach( (player, index) => {
			// if unique is set, it means different per person
			const p = unique ? values[index] : values
			player.options = { ...player.options, ...p }
			//console.log("settings player.options", {p,unique}, {result:player.options} 
		})
	}

	/**
	 * For certain actions we need to select a person
	 * so that the commands can be passed to the correct person
	 * such as game pad events
	 * @param {Number} index 
	 */
	getSelectedPerson(){
		return this.people[this.selectedPersonIndex] || null
	}

	selectPerson = (index=-1) => {
		if (index < 0)
		{
			// deselect everyone
			this.selectedPersonIndex = index
			this.people.forEach( (person, i) => person.isSelected = false)
		}else{
			this.selectedPersonIndex = index % people.length
			this.people.forEach( (person, i) => person.isSelected = i === this.selectedPersonIndex )
		}
		return this.getSelectedPerson()
	}
	
	deselectPeople(){
		this.selectPerson()
	}

	/**
	 * This is just a way to visually highlight a person
	 * in order to signify to the User that there is some
	 * action specific to this user. Mainly used when using gamepad
	 * to "select" the highlighted person.
	 * @param {Number} index 
	 */
	getHighlightPerson(){
		return this.people[this.highlightedPersonIndex] || null
	}

	/**
	 * 
	 * @param {*} index 
	 * @returns 
	 */
	highlightPerson(index=-1){
		if (this.highlightedPersonIndex >= 0)
		{
			this.people[this.highlightedPersonIndex].isHighlighted = false
		}
		this.highlightedPersonIndex = index
		this.people[this.highlightedPersonIndex].isHighlighted = true
		return this.people[this.highlightedPersonIndex]
	}
	
	unhighlightPeople(){
		this.highlightPerson()
	}


	/**
	 * 
	 * @param {string} type 
	 * @param {*} detail 
	 * @param {*} cancelable 
	 * @param {*} bubbles 
	 */
	dispatchCustomEvent(  type, detail, cancelable=true, bubbles=false ){
		this.dispatchEvent(
			new CustomEvent(type, {
				bubbles,
				cancelable, // without that flag preventDefault doesn't work
				detail
			})
		)
	}
}