import { getMouseCoords } from '../hardware/mouse'


/**
 * On devices with mice, we simulate pressure of push
 * with mouse down duration
 * Here as a sprite
 */
// export const drawMousePressure = ( progress ) => {
	
// 	const coords = getMouseCoords()

// 	// hide for the first few frames...

// 	// draw 2 circles...
// 	console.log("Mouse Pressure", progress * 100, coords )

// 	drawCircle( coords.x, coords.y, 100 * progress, 4, '#ff0000','#00ff00' )
// }


const pointer = document.createElement("div")
pointer.className = "cursor"
document.documentElement.appendChild( pointer )

let showingCustomCursor = false

// here as a pseudo element on body
export const drawMousePressure = ( progress, duration ) => {
	
	// pointer.setAttribute("style", `--mx:${coords.x};--my:${coords.y};--p:${percentage};--duration:${duration};` )
	const percentage = Math.ceil( progress * 100) / 100
		
	if (!showingCustomCursor)
	{
		const coords = getMouseCoords()
	
		pointer.className = "cursor pressure"
		pointer.setAttribute("style", `--mx:${coords.x};--my:${coords.y};--p:${1};--duration:${duration};` )
	
		showingCustomCursor = true
		
	}else if (percentage >= 1)	{

		showingCustomCursor = false
		pointer.className = "cursor hiding"

	}else{

		// progress
		//pointer.className = "cursor"
	}

	//console.log("Mouse Pressure", progress * 100, coords )
}