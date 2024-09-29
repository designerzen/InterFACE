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
export const bindTextElement = (element, rate=700, clearAfter=0, split=false, popOver=true) => {
	
	let cachedMessage = null
	let interval = -1
	let clearInterval = -1
	let currentMessage = null
	
	const db = debounce((message)=>{
		element.innerHTML = message
	}, rate)

	//
	const clear = (rate) => {
		const after = clearAfter * rate
		clearInterval = setTimeout(()=>{
			element.innerHTML = ''
			if (popOver && supportsPopover)
			{
				element.hidePopover()	
			}
		}, after)
		return after
	}
	
	return element ? (message, responseRate=rate, showFlasher=true ) => {

		if (split)
		{
			message = message.split(/!|\./i).join("<br>")
		}

		if (!showFlasher){
			// FIXME: Hide the cursor indicator
		}

		currentMessage = message
		
		// debounce and only change if var has
		if (element.innerHTML === '' || cachedMessage != message)
		{
			
			// prevent it blanking from previous request
			clearTimeout(clearInterval)

			cachedMessage = message
			if (responseRate === 0)
			{
				// instant overwrite
				clearTimeout(interval)
				element.innerHTML = message
			}else{
				// change it after debounce timeout to prevent flooding
				interval = db(message)				
			}
			if (popOver && supportsPopover)
				{
					element.showPopover()	
				}
					
			// clear after wards unless intercepted...
			if (clearAfter > 0)
			{
				clearInterval = clear(message.length)
			}
		}
	} : null
}


/**
 * Create a method that controls the feedback element remotely
 * @param {HTMLElement} controls DOM element to search within
 * @param {String} query query selector for finding the elements to bind to
 */
const feedbackElement = document.getElementById("feedback")
const setFeedbackText = bindTextElement( feedbackElement, 20 )
if (!supportsPopover)
{
	feedbackElement.removeAttribute("popover")
}

export const setFeedback = (text)=>{

	// ensure it is visible and "popped"
	setFeedbackText(text)
} 

/**
 * 
 * @param {HTMLElement} textElement 
 * @returns 
 */
export const createFeedbackNode = textElement => bindTextElement( textElement, 20 )