
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
	let frame = null

	let isAnimating = false
	let hasCompleted = false

	return element ? (message, letterRate=revealRate ) => {
	
		letterRate = 1

		// prevent hiding 
		clearInterval( interval )
		
		// check to see if it has changed...
		if (message === previousMessage)
		{
			// or do we just show it all???
			return
		}
		
		// write the message letter by letter
		function write ( index=0, speed=1, returnVisit=false){

			// if (!returnVisit){
			// 	console.log( index, "isAnimating", {interval}, letterRate, "tip", {message, previousMessage} )
			// }
			cancelAnimationFrame( frame )

			const revealingMessage = message.slice(0, index)
				
			const isWriting = index < message.length 

			//console.log( "draw",isWriting, message, index, message.length )

			if (isWriting)
			{
				//console.log( index,  message.length, "wrting", {interval}, {message, previousMessage} )
				// ok, so we have a new message and immediately we overwrite the previous message
				element.innerHTML = revealingMessage
				//write( index + speed, speed, true )
				isAnimating = true
				frame = requestAnimationFrame(()=>write( index + speed, speed, true ))
			
			}else{			

				// ended!
				isAnimating = false
				element.innerHTML = message
				// console.log( index,  message.length, "wrte end", {interval}, {message, previousMessage} )

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
				// just animate the new characters
				write( previousMessage.length, letterRate)
			   	//write( 0, letterRate)
		   }else{

				// ended!?
			   write( 0, letterRate)
		   }
		}

		
		previousMessage = message

	} : null
}


/**
 * Create a method that controls the toast element remotely
 * @param {HTMLElement} controls DOM element to search within
 * @param {String} query query selector for finding the elements to bind to
 */
const toastElement = document.getElementById("toast")
// export const setToast = bindTextElement( toastElement, 20, 900, true )
export const setToast = createTip( toastElement )

const tooltips = new Map()

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
export const addTooltip = element => { 
	const callback = event => {
		const toolTip = event.target.getAttribute("aria-label") || event.target.innerHTML
		if (event.target.nodeName === "BUTTON"){

			setToolTipPosition(event.target)
		}else{
			setToolTipPosition(event.target.parentElement)
		}
		setToast(toolTip)
	}
	element.addEventListener("mouseover", callback)
	tooltips.set( element, callback )
}

/**
 * Undoes the above
 * @param {*} element 
 */
export const removeTooltip = element => { 
	const callback = tooltips.get( element )
	if (callback)
	{
		element.removeEventListener("mouseover", callback)
		tooltips.delete(element)
	}
}

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