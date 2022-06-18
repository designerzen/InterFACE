import {debounce} from '../utils'

/**
 * updates the text on screen and hides it after a time out 
 * here we take an element and return a method to set it
 * @param {HTMLElement} element DOM element to bind to
 * @param {Number} rate typing rate in characters per second
 * @param {Number} clearAfter clear word after x ms
 * @returns {Boolean} split if the user hit duet
 */
export const bindTextElement = (element, rate=700, clearAfter=0, split=false) => {
	
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
export const setFeedback = bindTextElement( document.getElementById("feedback"), 20 )
