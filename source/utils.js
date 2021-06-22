export const convertOptionToObject = items => items.reduce( (accumulator, current) => {
	const c = current.split(":")
	accumulator[c[0]] = parseFloat(c[1])
	return accumulator
}, {})

export const debounce = (callback, wait) => {
	let timerId
	
	return (...args) => {
		//console.error(args, "debounce", arguments)
	  clearTimeout(timerId)
	  timerId = setTimeout(() => callback(...args), wait)
	  return timerId
	}
}
const now = () => performance.now() || Date.now()

export const MOUSE_HELD = "mouse_held"
export const MOUSE_HOLDING = "mouse_holding"
export const MOUSE_TAP = "mouse_tap"

// hook in to see how the user treats an element...
// how long did they click for or if after x seconds
// has the user held itt down still?
export const addMouseTapAndHoldEvents = ( button, holdTime=800 ) => {

	let mouseDownAt = -1
	// FIXME: Immediately test to see if this actually *is* false
	let isMouseOver = false
	let isMouseDown = false
	
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
			console.log("mouseDownFor",percentageRemaining, {elapsed,remaining} )
				
				dispatch( MOUSE_HOLDING, {elapsed, isMouseOver, remaining, percentageRemaining } )
				
				requestAnimationFrame( waitPatiently )

			}else{

				// HELD long enough
				
				// FIXME
				mouseDownAt = -1
			}
		} 
	}

	// BUTTON has been pressed!
	button.addEventListener( 'mousedown', event => {

		mouseDownAt = now()
		isMouseDown = true
		waitPatiently()
		
		// TODO: add in document listener in case mouse out and back up?
		
		event.preventDefault()
	})

	button.addEventListener( 'mouseup', event => {

		// should this trigger something else depending on time?
		const elapsed = now() - mouseDownAt	
	
		if ( elapsed < holdTime )
		{
			dispatch( MOUSE_TAP, {elapsed, isMouseOver} )
		}else{
			dispatch( MOUSE_HELD, {elapsed, isMouseOver} )
		}

		//console.log("mouseDownFor", elapsed )

		// CALLBACKS
		// dispatch( MOUSE_HELD, {elapsed, isMouseOver} )
	
		// and reset
		mouseDownAt = -1
		isMouseDown = false
		event.preventDefault()
	})

	button.addEventListener( 'mouseover', event => {
		isMouseOver = true
	})
	
	button.addEventListener( 'mouseout', event => {
		isMouseOver = false
	})

	// return some controls or destroy?
	return {

	}
}






// https://github.com/audiojs/audio-loader/blob/master/lib/base64.js

// DECODE UTILITIES
function b64ToUint6 (nChr) {
	return nChr > 64 && nChr < 91 ? nChr - 65
	  : nChr > 96 && nChr < 123 ? nChr - 71
	  : nChr > 47 && nChr < 58 ? nChr + 4
	  : nChr === 43 ? 62
	  : nChr === 47 ? 63
	  : 0
  }
  
// Decode Base64 to Uint8Array
export const decodeBase64 = (sBase64, nBlocksSize) => {
	const sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, '')
	const nInLen = sB64Enc.length
	const nOutLen = nBlocksSize
	  ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize
	  : nInLen * 3 + 1 >> 2
	const taBytes = new Uint8Array(nOutLen)
  
	for (let nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) 
	{
	  nMod4 = nInIdx & 3
	  nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4
	  if (nMod4 === 3 || nInLen - nInIdx === 1) 
	  {
		for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) 
		{
		  taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255
		}
		nUint24 = 0
	  }
	}
	return taBytes
}
  