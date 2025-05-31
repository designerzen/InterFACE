// watch for global mouse moves...
// watch for mouse holding
const now = () => performance.now() || Date.now()

export const MOUSE_HELD = "mouse_held"
export const MOUSE_HOLDING = "mouse_holding"
export const MOUSE_TAP = "mouse_tap"
export const MOUSE_REPEATING = "mouse_repeating"

/**
 * allows a user to repeat pressing a button simply
 * by holding the event for longer than 
 * 
 * @param {HTMLElement} button 
 * @param {Number} repeatAfter 
 * @param {Number} rate 
 */
export const addMouseRepeaterEvents = (button, repeatAfter=800, rate=200 ) => {

	let mouseDownAt = -1
	let interval = -1
	let isMouseDown = false
	let mouseEvents = 0
	
	const dispatch = (name, detail={}) => {
		button.dispatchEvent( 
			new CustomEvent( name, { detail } )
		)
	}
	const onMouseUp = event => {
		event.preventDefault()
		clearInterval(interval)

		// and reset
		mouseDownAt = -1
		isMouseDown = false
		document.removeEventListener("mouseup", onMouseUp )
	}

	button.addEventListener( 'mousedown', event => {

		mouseDownAt = now()
		isMouseDown = true
		mouseEvents = 0
		dispatch(MOUSE_REPEATING, {mouseEvents})
		interval = setTimeout( ()=>{
			dispatch(MOUSE_REPEATING, {repetitions:++mouseEvents})
			interval = setInterval( ()=>{
				dispatch(MOUSE_REPEATING, {repetitions:++mouseEvents})
			}, rate )
		}, repeatAfter)

		document.addEventListener("mouseup", onMouseUp , false)
	})
}

/**
 * hook in to see how the user treats an element...
 * how long did they click for or if after x seconds 
 * has the user held itt down still?
 * @param {HTMLElement} button - button to watch for changes
 * @param {Boolean} onlySendHoldOnMouseUp - dispatch the hold event only when moused up
 * @param {Number} holdTime - milliseconds before it is considered a hold
 * @returns 
 */
export const addMouseTapAndHoldEvents = ( button, onlySendHoldOnMouseUp=false, holdTime=800 ) => {

	let mouseDownAt = -1
	// FIXME: Immediately test to see if this actually *is* false???
	let isMouseOver = false
	let isMouseDown = false
	let isMouseHeld = false
	
	// fetch dom element
	const dispatch = (name, detail={}) => {
		button.dispatchEvent( 
			new CustomEvent( name, { detail } )
		)
	}

	// test to see how long we are help down for?
	const waitPatiently = () => {

		// we have lost focus
		if ( isMouseOver && isMouseDown )
		{
			const elapsed = now() - mouseDownAt	
		
			if ( elapsed < holdTime )
			{
				// BEFORE HOLDING TIME... ignore?
				const remaining = 1 - elapsed / holdTime
				const percentageRemaining = 100 - Math.ceil(remaining*100)
				
				dispatch( MOUSE_HOLDING, {elapsed, isMouseOver, remaining, percentageRemaining } )
				
				requestAnimationFrame( waitPatiently )

			}else{
				isMouseHeld = true

				// HELD long enough
				if (!onlySendHoldOnMouseUp)
				{
					dispatch( MOUSE_HELD, {elapsed, isMouseOver} )
				}
				
				// FIXME
				// mouseDownAt = -1
			}
		} 
	}

	const onMouseUp = event => {

		event.preventDefault()
		if (!isMouseDown )
		{
			return
		}

		// should this trigger something else depending on time?
		const elapsed = now() - mouseDownAt	
	
		if ( elapsed < holdTime )
		{
			dispatch( MOUSE_TAP, {elapsed, isMouseOver} )
		}else if (isMouseHeld && onlySendHoldOnMouseUp){
			
			dispatch( MOUSE_HELD, {elapsed, isMouseOver} )
		}

		//console.log("mouseDownFor", elapsed )

		// CALLBACKS
		// dispatch( MOUSE_HELD, {elapsed, isMouseOver} )
	
		// and reset
		mouseDownAt = -1
		isMouseDown = false
		document.removeEventListener("mouseup", onMouseUp )
	}

	// BUTTON has been pressed!
	button.addEventListener( 'mousedown', event => {

		mouseDownAt = now()
		isMouseDown = true
		isMouseHeld = false
		waitPatiently()
		
		// TODO: add in document listener in case mouse out and back up?
		event.preventDefault()

		// watch for any mouse up
		document.addEventListener("mouseup", onMouseUp , false)
	})

	// FIXME: Is mouse out useful here?
	//button.addEventListener( 'mouseup', onMouseUp, false)
	
	button.addEventListener( 'mouseover', event => {
		isMouseOver = true
	})
	
	button.addEventListener( 'mouseout', event => {
		isMouseOver = false
	})

	// return some controls or destroy?
	return button
}

const coords = { x:0, y:0 }

export const getMouseCoords = () => coords

export const watchMouseCoords = (element, callback ) => {
	element.addEventListener('mousemove', event => {
		coords.x = event.pageX || event.clientX
		coords.y = event.pageY || event.clientY
		callback && callback( coords )
	}, false )
}

// window.addEventListener('wheel' , event => {
	
// 	return

// 	let d = event.detail
// 	const w =  event.deltaY || event.wheelDelta
// 	let n = 225v	`// 	let n1 = n-1
// 	let f

// 	// Normalize delta
// 	d = d ? w && (f = w/d) ? d/f : -d/1.35 : w/120
// 	// Quadratic scale if |d| > 1
// 	d = d < 1 ? d < -1 ? (-Math.pow(d, 2) - n1) / n : d : (Math.pow(d, 2) + n1) / n
// 	// Delta *should* not be greater than 2...
// 	const wheel = Math.min(Math.max(d / 2, -1), 1) * 0.1
// 	const volume = getVolume()
// 	//const result = setMasterVolume(volume + wheel)

// 	console.log("mouse wheel",{ wheel, volume, result}, event)	
// })
