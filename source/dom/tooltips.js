/**
 * Very simple tooltip moving, presenting and updating
 * Attempts to use the PopOver API but falls back to a
 * fixed position with mouse coordinates
 * 
 * Provided as a singleton - not much point creating a class versions
 */

const supportsPopover = HTMLElement.prototype.hasOwnProperty("popover")

/**
 * Create a tooltip and bind it to the element
 * @param {HTMLElement} element DOM element to bind to
 * @param {Number} revealRate typing rate in characters per second
 * @param {Number} clearRate clear word after x ms
 * @returns {Function} method with 2 arguments to set the tip message
 */
 const createTip = (element, revealRate=6, clearRate=880) => {
	
	let previousMessage = ''
	let interval = null
	let frame = null

	let isAnimating = false
	let hasCompleted = false

	return element ? (message, letterRate=revealRate ) => {
	
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
const tooltipPositions = new Map()
let tooltipsEnabled = false
let bodyMutationObserver

/**
 * set the style of the tooltip to the x/y coords
 * of the provided element
 * @param {HTMLElement} target 
 */
const setToolTipPosition = (target, anchor="") => {
	
	requestAnimationFrame( e => {
		toastElement.setAttribute(
			"style", 
			`--left: ${target.x ?? target.offsetLeft};--top: ${target.y ??target.offsetTop};` 
		)
	})

	// Object.assign(toastElement.style, {
    //     "--left": target.offsetLeft,
    //     "--top": target.offsetLeft
    // })
}


export const updateTooltipPositions = () => {
	tooltips.forEach( (data, tipElement) => setTipSourcePosition( tipElement ))
}
const onWindowResize = event => {
	// console.log("onWindowResize", event)
	// TODO: Wait one frame before updating
	updateTooltipPositions()
}
// position-anchor
const getPositionForTooltip = target => {
	const e = target.getBoundingClientRect().toJSON() 
	console.log("getPositionForTooltip", e)
	return { ...e, 
		x:e.x + Math.min( 14, e.width * 0.2 ) + window.scrollX,  
		y:e.y + window.scrollY
		//y:e.y + e.height/2
	}
	return {
		x:target.offsetLeft,
		y:target.offsetTop
	}
}

const setTipSourcePosition = target => {
	const targetElement = 
		target.nodeName === "BUTTON" ? 
			target : target.parentElement 

	tooltipPositions.set( target, getPositionForTooltip(targetElement) )
}

/**
 * 
 * adds a single tooltip to an element where hovering will reveal new info
 * @param {HTMLElement} controls DOM element to search within
 */
export const addTooltip = element => { 
	// lazy create our observer
	if (tooltips.size === 0)
	{
		window.addEventListener("resize", onWindowResize )
	
		/*
		// Options for the observer (which mutations to observe)
		const config = { attributes: true, childList: true, subtree: true };

		// Callback function to execute when mutations are observed
		const callback = (mutationList, observer) => {
			for (const mutation of mutationList) {
				if (mutation.type === "childList") {
					console.log("MutationObserver A child node has been added or removed.", mutation)
				} else if (mutation.type === "attributes") {
					console.log(`MutationObserver The ${mutation.attributeName} attribute was modified.`, mutation )
				}else{
					console.log(`MutationObserver was modified.`, mutation )
					updateTooltipPositions()
				}
				
			}
		}

		// Create an observer instance linked to the callback function
		bodyMutationObserver = new MutationObserver(callback)

		// Start observing the target node for configured mutations
		bodyMutationObserver.observe(document.documentElement, config)

		*/
		tooltipsEnabled = true
	}

	// set the initial position
	// tooltipPositions.set( element, getPositionForTooltip(element) )
	setTipSourcePosition( element )

	const showTooltipCallback = (event, popOver=false) => {
		
		if (!tooltipsEnabled)
		{
			return
		}
		
		const toolTip = event.target.getAttribute("aria-label") || event.target.innerText
		const position = tooltipPositions.get( element )
		if (position)
		{
			console.info("Setting tooltip", {position, toolTip} ) 
			setToolTipPosition(position)
		}else{
			console.info("Setting tooltip???", {event} ) 	
		}
		
		// Eventually this will work!
		
		toastElement.anchor = event.target.id
		// toastElement.innerHTML = toolTip
	 	toastElement.textContent = toolTip
		// setToast(toolTip)
		// console.error( {toolTip, position} )
		if (supportsPopover)
		{	
			toastElement.showPopover()	
		}
	}

	let cleanUp
	if (!supportsPopover)
	{	
		element.addEventListener("mouseover", showTooltipCallback)
		
		cleanUp = e => {
			element.removeEventListener("mouseover", showTooltipCallback)
		}

	}else{
	
		// check for dom removal 
		// tooltips.set( element, callback )
		// toastElement.popover = "auto"
		element.popoverTargetElement = toastElement
		// element.popoverTargetAction = "toggle"
		element.setAttribute("popovertarget", toastElement.id)
		element.addEventListener("mouseover", showTooltipCallback)
		//element.addEventListener("mouseout", toastElement.hidePopover )
	
		cleanUp = e => {
			element.removeEventListener("mouseover", showTooltipCallback)
			//element.removeEventListener("mouseout", toastElement.hidePopover )	
		}
	}	
	
	tooltips.set( element, cleanUp )
}


export const togglePopover = popover => {
	const isPopoverOpen = popover.matches(":popover-open")
    if (isPopoverOpen) 
	{
		popover.hidePopover()
	}else{
		popover.showPopover()
    }
}

/**
 * Undoes the above
 * @param {HTMLElement} element 
 */
export const removeTooltip = element => { 
	const callback = tooltips.get( element )
	if (callback)
	{
		callback()
		tooltips.delete(element)
	}

	if (tooltips.size === 0)
	{
		// remove the resize listener and stop monitoring for size changes
		window.removeEventListener("resize", onWindowResize )
		// stop observing body changes
		// bodyMutationObserver.disconnect()
	}
}

/**
 * adds tooltips to all elements that match the query
 * @param {HTMLElement} controls DOM element to search within
 * @param {String} query query selector for finding the elements to bind to
 */
export const addToolTips = (controls, query="[aria-label]") => {
	
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

export const toggleTooltips = state => {
	// document.querySelectorAll("[aria-label]").forEach( button => button.removeAttribute("aria-label") )

	// const buttons = controls.querySelectorAll(query)
	// tooltips.forEach( (data, tipElement) => setTipSourcePosition( tipElement ))
	tooltipsEnabled = state ?? !tooltipsEnabled
}