import {debounce} from '../utils'

///////////////////////////////////////////////////////////////////
// updates the text on screen and hides it after a time out
// here we take an element and return a method to set it
///////////////////////////////////////////////////////////////////
export const bindTextElement = (element, rate=700, clearAfter=0, split=false) => {
	
	let cachedMessage = null
	let interval = -1
	let clearInterval = -1
	let currentMessage = null
	
	const db = debounce((message)=>{
		element.innerHTML = message
	}, rate)

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

// Feedback ui
export const setFeedback = bindTextElement( document.getElementById("feedback"), 20 )
export const setToast = bindTextElement( document.getElementById("toast"), 20, 900, true )

export const addTooltip = element =>  element.addEventListener("mouseover", event => {
	const toolTip = event.target.getAttribute("aria-label") || event.target.innerHTML
	setToast(toolTip)
})

////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////
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