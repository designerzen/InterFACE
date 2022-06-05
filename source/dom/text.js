import {debounce} from '../utils'

/**
 * Create a tooltip and bind it to the element
 * @param {HTMLElement} element DOM element to bind to
 * @param {Number} revealRate typing rate in characters per second
 * @param {Number} clearRate clear word after x ms
 * @returns {Function} method with 2 arguments to set the tip message
 */
const createTip =  (element, revealRate=6, clearRate=550) => {
	
	let previousMessage = ''
	let interval = null

	let isAnimating = false
	let hasCompleted = false

	return element ? (message, letterRate=revealRate ) => {
		
		// check to see if it has changed...
		if (message === previousMessage)
		{
			// or do we just show it all???
			return
		}

		clearInterval( interval )
		
		previousMessage = message
		
		// write the message letter by letter
		const write = ( index=0, speed=1) => {

			const revealingMessage = message.slice(0, index)
			isAnimating = true

			// ok, so we have a new message and immediately we overwrite the previous message
			element.innerHTML = revealingMessage

			if (index < message.length){
				requestAnimationFrame(()=>write( index + speed, speed ))
			}else{			
				isAnimating = false
				// clear the previous interval after x chars read
				const after = clearRate * message.length
				// and then hide this after x seconds...
				interval = setTimeout(()=>{			
					element.innerHTML = ''
					hasCompleted = true
				}, after)
			}
		}
		
		
		// if the letterRate is 0, then we just show the message
		if (letterRate < 1 )
		{
			write( message.length, 10 )
		}else{

			if (isAnimating){
				write( previousMessage.length, letterRate)
			   //write( 0, letterRate)
		   }else{
			   write( 0, letterRate)
		   }
		}

		
	} : null
}

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
	
	return element ? (message, responseRate=rate ) => {

		if (split)
		{
			message = message.split(/!|\./i).join("<br>")
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

/**
 * Create a method that controls the toast element remotely
 * @param {HTMLElement} controls DOM element to search within
 * @param {String} query query selector for finding the elements to bind to
 */
const toastElement = document.getElementById("toast")
// export const setToast = bindTextElement( toastElement, 20, 900, true )
export const setToast = createTip( toastElement )
const setToolTipPosition = (target) => {
	toastElement.setAttribute(
		"style", 
		`--left: ${target.offsetLeft}; 
		 --top: ${target.offsetTop};`
	)
}

/**
 * adds a single tooltip to an element where hovering will reveal new info
 * @param {HTMLElement} controls DOM element to search within
 * @param {String} query query selector for finding the elements to bind to
 */
export const addTooltip = element =>  element.addEventListener("mouseover", event => {

	const toolTip = event.target.getAttribute("aria-label") || event.target.innerHTML
	if (event.target.nodeName === "BUTTON"){

		setToolTipPosition(event.target)
	}else{
		setToolTipPosition(event.target.parentElement)
	}

	setToast(toolTip)
})

/**
 * adds tooltips to all elements that match the query
 * @param {HTMLElement} controls DOM element to search within
 * @param {String} query query selector for finding the elements to bind to
 */
export const addToolTips = (controls, query="button, select, input") => {
	
	// do a query here to catch all buttons?
	const buttons = controls.querySelectorAll(query)
	
	// const fragment = doc.createDocumentFragment() 
	// fragment.appendChild(doc.createElement('fieldset'))
	// const fragment = doc.createElement('fieldset')
	// fragment.innerHTML = setupInstrumentForm()
	// add to dom
	// controls.appendChild( fragment )

	// intercept any hover events...
	buttons.forEach( button => addTooltip(button) )
}