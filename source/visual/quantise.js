
import { clamp, TAU, easeInQuad } from "../maths/maths"
import PALETTE, { DEFAULT_COLOURS } from "../palette"
import { canvasContext, getCanvasDimensions } from './canvas'

const { width, height} = getCanvasDimensions()

// TODO:
// Rather than just show one at a time - with no concept of when the next is coming
// instead we move all of them almost like a giant progress bar but dropping from
// top to bottom where the centre is "now" and below the line is the past
// or the so called "history" that could also change colour to the note played
// if in single player mode
export const drawQuantise = (active, bar=-1, bars=1, stroke = 30, radius = 4) => {

	// text
	// canvasContext.strokeWidth = stroke//+"px"
	// canvasContext.font = "24px Oxanium"
	// canvasContext.textAlign = "left"
	// canvasContext.fillStyle = PALETTE.grey
	// canvasContext.strokeStyle = PALETTE.dark
	// canvasContext.fillText( (bar === -1 ? `-` : `${bar+1}`) + extras, stroke, stroke)
	// const gap = width /( bars + 1 )
	const gap = height / ( bars + 1 )
	// blobs
	for (let i=0, l= bar+1; i<l; ++i)
	{
		// + gap fence post
		let x = 0// i * gap + gap
		let y = i * gap + gap
		canvasContext.fillStyle = i === bar ? PALETTE.cream : PALETTE.orange
		canvasContext.strokeStyle = i ===  bar ? PALETTE.orange : PALETTE.brown
		canvasContext.strokeWidth = stroke
		canvasContext.lineWidth = active && i === bar ? 8 : 4
		canvasContext.beginPath()
		canvasContext.arc( x, y, radius, 0, TAU )
		canvasContext.fill()
		canvasContext.stroke()
	}
	
	// draw a frame around the whole qindow
	// canvasContext.fillStyle = "hsla(90, 80%, "+(active ? 90 : 10 )+"%, 0.9)"
	// canvasContext.strokeRect(0,0,width,height)
	// console.log("quantise enabled!")
}

