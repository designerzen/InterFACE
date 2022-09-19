import PALETTE, { DEFAULT_COLOURS } from "../palette"
import { canvasContext } from './canvas'
import {drawNode} from './2d'

/**
 * Draw a Mouth onto the canvas directly from the prediction
 * The style is first we outline the entire mouth
 * then on sing we fade in the fill within
 * 
 * @param {*} prediction 
 * @param {Object} palette 
 * @param {Boolean} debug 
 * @returns 
 */
export const drawMouth = ( prediction, palette={h:90,s:50,l:50,a:0.6}, debug=true ) => {
	
	const { annotations, mouthRange, mouthWidth, mouthOpen } = prediction
	const {lips} = annotations
	const lipsLength = lips.length
	const colour = `hsla(${palette.h},${palette.s}%,${palette.l}%, ${palette.a})`
	const colourDark = `hsla(${palette.h},${palette.s}%,10%, ${palette.a})`
	
// console.log("drawing mouth", {colour, colourDark})

	// central piece of the mouth
	const lipLength = Math.round(lipsLength/4)
	const midLipLength = Math.round(lipLength/2)

	const lipUpperLeft = lips[0]
	const lipLowerLeft = lips[lipLength * 2]

	const lipUpperMiddle = lips[lipLength + midLipLength]
	const lipLowerMiddle = lips[midLipLength] // lips[27]
	
	const lipInnerUpperMiddle = lips[lipsLength - midLipLength - 1]
	const lipInnerLowerMiddle = lips[lipLength * 2 + midLipLength]
	
	const lipUpperRight = lips[lipLength * 2]
	const lipLowerRight = lips[lipsLength-1]

	// kermit style mouth with gradient!
	// const topGradient = ctx.createLinearGradient(0, 0, 0, lipVerticalOpening)
	// topGradient.addColorStop(0, "black")
	// topGradient.addColorStop(1, "white")

	// how can we work out height of the mouth???
	// const mouthGradient = canvasContext.createLinearGradient(0, 0, mouthWidth, mouthRange )
	// mouthGradient.addColorStop(0, colour)
	// mouthGradient.addColorStop(0.5, colourDark )
	// mouthGradient.addColorStop(1, colour)

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
	canvasContext.moveTo( lips[0].x, lips[0].y )
	// //canvasContext.fillStyle = mouthGradient
	// //canvasContext.fillStyle = mouthGradient

	// dual lips mode
	for (let l = 1, t=lips.length; l < t; l++) 
	{
		const lip = lips[l]
		canvasContext.lineTo( lip.x, lip.y )
	}

	//canvasContext.closePath()
	// canvasContext.fill()
	canvasContext.stroke( )


	if (debug)
	{
		// left and right!!!
		//drawNode(lipUpperLeft, lipLowerLeft, 5, 0xff0000 )
		
		//drawNode(lipLowerMiddle, lipUpperMiddle, 5, 0x0000ff )
		
		// top bttom?
		// drawNode(lipUpperRight, lipLowerRight, 5, 0x00ff00 )
		// drawNode( lips[0], lips[lipLength], 5, 0xffff00 )
		// drawNode( lips[lipLength+1], lips[lipLength*2], 5, 0x00ffff )
		// drawNode( lips[lipLength*2], lips[lipsLength-1], 5, 0x0000ff )
		
		
		// top to bottom
		// drawNode( 
		// 	lips[lipLength + midLipLength], 
		// 	lips[midLipLength], 
		// 	5, 
		// 	0xff00ff 
		// )

		// // left edge to right edge
		// drawNode( lips[0], lips[lipsLength-1], 5, 0x0000ff )
		// drawNode( lipInnerUpperMiddle, lipInnerLowerMiddle, 5, 0x0000ff )
		// drawNode( lipLowerRight, lipLowerRight, 5, 0x0000ff )
		// drawNode( lipUpperRight, lipUpperLeft, 5, 0xff00ff )
		
		// // top to bottom
		// drawNode( 
		// 	lips[midLipLength], 
		// 	lips[lipLength + midLipLength], 
		// 	5, 
		// 	0x0000ff 
		// )
	
		// add text
		canvasContext.fillStyle = PALETTE.blue
		canvasContext.font = "12px Oxanium"
		canvasContext.textAlign = "center"
		canvasContext.fillText(`${Math.floor(mouthRange)}px`, lipLowerMiddle.x, lipLowerMiddle.y - 20 )
	}

	return {lipUpperMiddle, lipLowerMiddle }
}
