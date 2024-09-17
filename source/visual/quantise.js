/**
 * This is a tempo and beat visualier that basically
 * shows which bar is currently being played and which
 * bars have already been playyed with a fancy visual
 */
import { clamp, TAU, easeInQuad } from "../maths/maths"
import PALETTE, { DEFAULT_COLOURS } from "../settings/palette"


// TODO:
// Rather than just show one at a time - with no concept of when the next is coming
// instead we move all of them almost like a giant progress bar but dropping from
// top to bottom where the centre is "now" and below the line is the past
// or the so called "history" that could also change colour to the note played
// if in single player mode
export class Quanitiser{

	width
	height
	history = []
	canvasContext

	constructor(canvasContext){
		this.canvasContext = canvasContext
		this.width = canvasContext.canvas.width
		this.height = canvasContext.canvas.height
	}

	/**
	 * 
	 * @param {Number} hasPlayed - is this note playing?
	 * @param {Number} bar 
	 * @param {Number} totalBars 
	 * @param {Number} noteColour 
	 * @param {Number} stroke - color of the ring
	 * @param {Number} radius - of the circle
	 * @param {Number} positionX - x position of the gadget
	 * @param {Number} positionY - y position of the gadget
	 */
	draw(hasPlayed, bar=-1, totalBars=1,noteColour=0xff0000, stroke = 30, radius = 4, positionX=0, positionY=0){
		// canvasContext.strokeWidth = stroke//+"px"
		// canvasContext.font = "24px Oxanium"
		// canvasContext.textAlign = "left"
		// canvasContext.fillStyle = PALETTE.grey
		// canvasContext.strokeStyle = PALETTE.dark
		// canvasContext.fillText( (bar === -1 ? `-` : `${bar+1}`) + extras, stroke, stroke)
		// const gap = width /( bars + 1 )
		const gap = this.height / ( totalBars + 1 )

		// blobs up to down
		// for (let i=0, l= bar+1; i<l; ++i)
		// grows up
		for (let i=totalBars - 1; i>=0; --i)
		{
			// + gap fence post
			const colour = hasPlayed ? noteColour : i === bar ? PALETTE.cream : PALETTE.orange
			const x = positionX // i * gap + gap
			const y = i * gap + gap + positionY
			const finished = i < bar
			const active = i === bar
			const scaleFactor = active ? 2 : 1
			const scale = finished || active ? 6 : 1
			const size = scaleFactor * scale

			//PALETTE.cream PALETTE.brown
			this.canvasContext.fillStyle = active ?  colour : noteColour
			this.canvasContext.strokeStyle = active ? noteColour : finished ? this.history[i] || PALETTE.cream : PALETTE.orange //  : noteColour
			this.canvasContext.strokeWidth = stroke
			this.canvasContext.lineWidth = size
			this.canvasContext.beginPath()
			this.canvasContext.arc( x, y, radius, 0, TAU )
			this.canvasContext.fill()
			this.canvasContext.stroke()
			this.canvasContext.closePath()

			if (active)
			{
				this.history[i] = noteColour
			}
		}

		this.canvasContext.lineWidth = 1
	}
}