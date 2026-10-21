/**
 * Very simple tooltip moving, presenting and updating
 * Attempts to use the PopOver API but falls back to a
 * fixed position with mouse coordinates
 * 
 * Provided as a singleton - not much point creating a class versions
 */

const supportsPopover = HTMLElement.prototype.hasOwnProperty("popover")

const tooltips = new Map()
let tooltipsEnabled = false
let tooltipElement = null
const tooltipPositions = new Map()
const pendingPositions = new Set()
let layoutVersion = 0
let positionFrame = null
let mutationObserver = null
let resizeObserver = null
const observedContainers = new Map()
const layoutEvents = ["transitionrun", "transitionend", "transitioncancel", "animationstart", "animationend", "animationcancel", "load"]

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
// const toastElement = document.querySelector(".tooltip")
// export const setToast = bindTextElement( toastElement, 20, 900, true )
export const setToast = createTip( toastElement )


/*
 * set the style of the tooltip to the x/y coords
 * of the provided element
 * @param {HTMLElement} target 
 */
export const setToolTipCoordinates = (x, y) => {
	if (toastElement.style.getPropertyValue("--left") !== String(x))
		toastElement.style.setProperty("--left", x)
	if (toastElement.style.getPropertyValue("--top") !== String(y))
		toastElement.style.setProperty("--top", y)
}

export const setToolTipPosition = target => {
	setToolTipCoordinates(target.x ?? target.offsetLeft, target.y ?? target.offsetTop)
}

const isToastMutation = target => target === toastElement || toastElement.contains(target)

const revealTooltip = element => {
	const position = tooltipPositions.get(element)
	setToolTipPosition(position)
	toastElement.anchor = element.id
	showTooltip(element.getAttribute("aria-label") || element.textContent)
	if (supportsPopover) toastElement.showPopover()
}

const schedulePositions = () => {
	if (positionFrame !== null) return
	positionFrame = requestAnimationFrame(() => {
		positionFrame = null
		// Warm new entries once. Invalidated entries refresh lazily when requested,
		// so a changing UI never forces a scan of every control's geometry.
		if (tooltipElement) pendingPositions.add(tooltipElement)
		for (const element of pendingPositions)
		{
			pendingPositions.delete(element)
			const position = tooltipPositions.get(element)
			if (!element.isConnected) continue
			if (position?.version === layoutVersion) continue
			const target = element.nodeName === "INPUT" ? element.parentElement || element : element
			const rect = target.getBoundingClientRect()
			tooltipPositions.set(element, {
				x: rect.x + window.scrollX,
				y: rect.y + window.scrollY,
				version: layoutVersion
			})
		}
		// All geometry reads finish before changing tooltip content or styles.
		if (tooltipElement?.isConnected && tooltipPositions.get(tooltipElement))
		{
			revealTooltip(tooltipElement)
		}
	})
}

export const updateTooltipPositions = () => {
	layoutVersion++
	if (tooltipElement) schedulePositions()
}

const onLayoutEvent = event => {
	if (!isToastMutation(event.target)) updateTooltipPositions()
}

const onMutations = records => {
	if (records.some(record => !isToastMutation(record.target))) updateTooltipPositions()
}

const startPositionObservers = () => {
	mutationObserver = new MutationObserver(onMutations)
	mutationObserver.observe(document.documentElement || document.body, {
		subtree: true, childList: true, characterData: true, attributes: true,
		attributeFilter: ["class", "style", "hidden", "open", "width", "height"]
	})
	if (typeof ResizeObserver !== "undefined")
	{
		resizeObserver = new ResizeObserver(updateTooltipPositions)
	}
	window.addEventListener("resize", updateTooltipPositions)
	document.addEventListener("scroll", onLayoutEvent, true)
	layoutEvents.forEach(type => document.addEventListener(type, onLayoutEvent, true))
}

const observeContainers = element => {
	const containers = []
	for (let container = element; container; container = container.parentElement)
	{
		containers.push(container)
		const count = observedContainers.get(container) || 0
		if (!count) resizeObserver?.observe(container)
		observedContainers.set(container, count + 1)
	}
	return containers
}

const stopPositionObservers = () => {
	mutationObserver?.disconnect()
	mutationObserver = null
	resizeObserver?.disconnect()
	resizeObserver = null
	observedContainers.clear()
	window.removeEventListener("resize", updateTooltipPositions)
	document.removeEventListener("scroll", onLayoutEvent, true)
	layoutEvents.forEach(type => document.removeEventListener(type, onLayoutEvent, true))
	if (positionFrame !== null) cancelAnimationFrame(positionFrame)
	positionFrame = null
}

export const showTooltip = text => {
	if (toastElement.textContent !== text) toastElement.textContent = text
	toastElement.hidden = false
}

let tooltipIndex = 0

/** Bind a tooltip without measuring elements that may not be visible yet. */
export const addTooltip = element => {
	if (!toastElement)
	{
		throw Error("Be sure that the DOM has the required element featured")
	}
	if (tooltips.has(element)) return

	const showTooltipCallback = event => {
		if (!tooltipsEnabled || event.pointerType !== "mouse" ||
			(event.relatedTarget && element.contains(event.relatedTarget))) return

		// Drain mutations queued earlier in this task before trusting the cache.
		onMutations(mutationObserver.takeRecords())
		tooltipElement = element
		if (tooltipPositions.get(element)?.version === layoutVersion)
		{
			revealTooltip(element)
		}else{
			// A dirty first activation waits one frame instead of showing stale coords.
			toastElement.hidden = true
			schedulePositions()
		}
	}

	const hideTooltipCallback = event => {
		if (event?.relatedTarget && element.contains(event.relatedTarget)) return
		if (tooltipElement !== element) return
		tooltipElement = null
		toastElement.hidden = true
		if (supportsPopover) toastElement.hidePopover()
	}

	if (supportsPopover)
	{
		element.popoverTargetElement = toastElement
		if (!toastElement.id) toastElement.id = "tooltip-" + tooltipIndex++
		element.setAttribute("popovertarget", toastElement.id)
	}

	element.addEventListener("pointerover", showTooltipCallback)
	element.addEventListener("pointerout", hideTooltipCallback)
	if (tooltips.size === 0)
	{
		tooltipsEnabled = true
		startPositionObservers()
	}
	const containers = observeContainers(element)
	tooltipPositions.set(element, null)
	pendingPositions.add(element)
	schedulePositions()
	tooltips.set(element, () => {
		element.removeEventListener("pointerover", showTooltipCallback)
		element.removeEventListener("pointerout", hideTooltipCallback)
		hideTooltipCallback()
		tooltipPositions.delete(element)
		pendingPositions.delete(element)
		for (const container of containers)
		{
			const count = observedContainers.get(container) - 1
			if (count) observedContainers.set(container, count)
			else {
				observedContainers.delete(container)
				resizeObserver?.unobserve(container)
			}
		}
	})
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
		if (tooltips.size === 0) stopPositionObservers()
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
	tooltipsEnabled = state ?? !tooltipsEnabled
	if (!tooltipsEnabled && tooltipElement)
	{
		tooltipElement = null
		toastElement.hidden = true
		if (supportsPopover) toastElement.hidePopover()
	}
}
