import {debounce} from '../utils/utils'
const supportsPopover = HTMLElement.prototype.hasOwnProperty("popover")

/**
 * updates the text on screen and hides it after a time out 
 * here we take an element and return a method to set it
 * @param {HTMLElement} element DOM element to bind to
 * @param {Number} rate typing rate in characters per second
 * @param {Number} clearAfter clear word after x ms
 * @returns {Boolean} split if the user hit duet
 */
export const bindTextElement = (element, rate=350, clearAfter=0, split=false, popOver=true) => {
	
	let cachedMessage = null
	let interval = -1
	let clearInterval = -1
	let currentMessage = null
	let previousStyle = 'empty'
	
	/**
	 * Debounces the writing of the text to prevent multiple uneccesssary writes
	 */
	const db = debounce((message)=>{
		element.innerHTML = message
		console.error("Writing debounced text", {element, message})
	}, rate)

	
	/**
	 * Clear the textfield and hide empty outlines
	 */
	const clearText = () => {
		element.textContent = ''
		if (popOver && supportsPopover)
		{
			element.hidePopover()	
		}
		// console.error("Clearing text", { clearAfter}) 
	}

	/**
	 * Reset the auto clear timer
	 */
	const resetTimer = () => {
		clearTimeout(clearInterval)
		clearInterval = -1
		// console.error("RESET TEXT TIMER" ) 
	}

	/**
	 * Hides the text after a period of time
	 * @param {Number} characterQuantity 
	 * @returns {Number} Timeout in milliseconds
	 */
	const clearTextAfterTime = (characterQuantity) => {
		const after = clearAfter * characterQuantity
		clearInterval = setTimeout(()=>{
			
			// console.error("NOW Clearing text", { after, clearAfter}) 
			clearText()
			// allow further writing
			resetTimer()
			
		}, after)
		return after
	}

	/**
	 * 
	 * @param {String} message 
	 * @param {Number} responseRate 
	 * @param {String} style 
	 * @param {Boolean} showFlasher 
	 * @returns 
	 */
	const updateText = (message, responseRate=rate, style="none", showFlasher=true ) => {

		// If busy, return
		if (clearAfter > 0 && (!message || message.length < 1))
		{
			const isBusy = clearInterval > -1
			// console.error( isBusy ? "WRITE WAITING..." : "WRITE ALLOWED", {message} )
			return isBusy
		}

		if (split)
		{
			message = message.split(/!|\./i).join("<br>")
		}

		if (!showFlasher){
			// FIXME: Hide the cursor indicator
		}

		if (previousStyle !== style)
		{
			element.classList.remove(previousStyle)
			switch (style)
			{
				case "flash":
					element.classList.add(style)
					break

				case "none":
				default:
					element.classList.add(style)
					break
			}			
			previousStyle = style
		}

		// save the message to write out in the future?
		currentMessage = message
		
		// debounce and only change if var has
		if (cachedMessage != message || element.textContent === '')
		{
			// prevent it blanking from previous request
			resetTimer()

			// if 0 then we want to instantly wipe the text
			// if (responseRate === 0)
			// {
			// 	// instant overwrite instead of debounce?
			// 	clearTimeout(interval)
			// 	interval = -1
			// 	// immediately write the message to the screen
			// 	element.innerHTML = message
			// 	console.error("IMMEDIATE WRITE" )
			// }else{
			// 	// change it after debounce timeout to prevent flooding
			// 	console.error("WRITE DEBOUNCING..." )	
			// 	interval = db(message)			
			// }
					
			// immediately write the message to the screen
			// clearTimeout(interval)
			// interval = -1
			element.innerHTML = message
			cachedMessage = message
			// console.error("UPDATING MESSAGE", {message} )

			if (popOver && supportsPopover)
			{
				element.showPopover()		
			}
					
			// clear after wards unless intercepted...
			if (clearAfter > 0)
			{
				const after = clearTextAfterTime(message.length)
				// console.error("CLEARING AFTER", {after, clearAfter, clearInterval})
			}else{
				// console.error("NOT CLEARING", {clearAfter, clearInterval})
			}
			
		}else{
			// console.error("NOTHING TO UPDATE - IGNORING", {clearAfter, clearInterval})
		}
		return true
	}
	
	return element ? updateText : null
}

let singleton

/**
 * Create a method that controls the feedback element remotely
 * @param {HTMLElement} controls DOM element to search within
 * @param {String} query query selector for finding the elements to bind to
 */
export const setupFeedbackControls = (feedbackElement, rate=35, clearAfter=0, split=false, popOver=true) => {

	if (singleton)
	{
		return singleton
	}

	// clearAfter=0, split=false, popOver=true
	const setFeedbackText = bindTextElement( feedbackElement, rate, clearAfter, split, popOver )
	if (!supportsPopover)
	{
		feedbackElement.removeAttribute("popover")
	}
	singleton = setFeedbackText
	return setFeedbackText
}

export const setFeedback = (text, rate=2, style="none")=>{
	return singleton && singleton(text, rate, style)
}