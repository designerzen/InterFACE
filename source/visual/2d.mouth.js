import PALETTE, { DEFAULT_COLOURS } from "../palette"
import { canvasContext } from './canvas'
import {drawNode} from './2d'

//////////////////////////////////////////////////////////////////////
// Draw a Mouth onto the canvas
//////////////////////////////////////////////////////////////////////
export const drawMouth = ( prediction, palette={h:90,s:50,l:50,a:0.6}, debug=true ) => {
	
	const { annotations, mouthRange,mouthWidth, mouthOpen } = prediction
	const { lipsUpperInner,lipsLowerInner} = annotations 
	const lips = [lipsUpperInner, lipsLowerInner]
	
	const colour = `hsla(${palette.h},${palette.s}%,${palette.l}%, ${palette.a})`
	const colourDark = `hsla(${palette.h},${palette.s}%,10%, ${palette.a})`
	
// console.log("drawing mouth", {colour, colourDark})

	// central piece of the mouth
	const lipUpperMiddle = lipsUpperInner[5]
	const lipLowerMiddle = lipsLowerInner[5]

	// kermit style mouth with gradient!
	// const topGradient = ctx.createLinearGradient(0, 0, 0, lipVerticalOpening)
	// topGradient.addColorStop(0, "black")
	// topGradient.addColorStop(1, "white")

	// how can we work out height of the mouth???
	const mouthGradient = canvasContext.createLinearGradient(0, 0, mouthWidth, mouthRange )
	mouthGradient.addColorStop(0, colour)
	mouthGradient.addColorStop(0.5, colourDark )
	mouthGradient.addColorStop(1, colour)

	// canvasContext.beginPath()
	// canvasContext.moveTo(lipsUpper[0][0], lipsUpper[0][1])
	// for (let i = 0, q=lip.length; i < q; i++) 
	// {
	// 	const x = lip[i][0]
	// 	const y = lip[i][1]

	// 	canvasContext.lineTo(x, y)
	// }	
	// canvasContext.fill()
	canvasContext.lineWidth = 2
	canvasContext.strokeStyle = colourDark
	canvasContext.beginPath()
	canvasContext.moveTo(lipsUpperInner[0][0], lipsUpperInner[0][1])
	canvasContext.fillStyle  = mouthGradient

	// dual lips mode
	for (let l = 0, t=lips.length; l < t; l++) {

		const lip = lips[l]
		
		for (let i = 0, q=lip.length; i < q; i++) 
		{
			const x = lip[i][0]
			const y = lip[i][1]
	
			canvasContext.lineTo(x, y)
		}	
	}

	canvasContext.closePath()
	canvasContext.fill()
	canvasContext.stroke( )



	if (debug)
	{
		drawNode(lipLowerMiddle, lipUpperMiddle, 5)
	
		// add text
		
		canvasContext.fillStyle = PALETTE.blue
		canvasContext.font = "12px Oxanium"
		canvasContext.textAlign = "center"
		canvasContext.fillText(`${Math.floor(mouthRange)}px`, lipLowerMiddle[0], lipLowerMiddle[1] - 20 )
	}
	canvasContext.stroke( )
	canvasContext.lineWidth = 1
	
	return {lipUpperMiddle, lipLowerMiddle }
}
