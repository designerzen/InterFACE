import { drawCircle, drawNode } from './2d'

/**
 * Draw a mouth based on a series of points and close the path
 * with a gradient or fill as required
 * @param {Array<>} lips 
 * @param {Object} stroke 
 * @param {Array<Number>} sequence 
 * @returns 
 */
export const drawMouthFromSequence = ( 
	canvasContext,
	lips, 
	stroke={h:90,s:50,l:50,a:0.6}, 
	fill={h:90,s:50,l:50,a:0.6}, 
	sequence=[] 
) => {
	
	const strokeColour = `hsl( ${stroke.h}%, 80%, 50% )`
	const fillColour = `hsl( ${fill.h}%, 80%, 50% )`

	const startNode = lips[ sequence[0] ]

	// console.log(colour)
	//const end = sequence[sequence.length - 1]
	// const endNode = lips[end]

	canvasContext.beginPath()
	canvasContext.moveTo( startNode.x, startNode.y)
	canvasContext.strokeStyle = strokeColour || 'pink'
				
	sequence.forEach( index => {
		const position = lips[index]
		canvasContext.lineTo( position.x, position.y )
	})

	// canvasContext.closePath()
	canvasContext.stroke( )

	// fill
	canvasContext.fillStyle = fillColour || 'orange'
	canvasContext.fill( )

	return {}
}


/**
 * Draw some lips onto the canvas context
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {*} lips 
 * @param {*} stroke 
 * @param {*} fill 
 * @param {*} startIndex 
 * @param {*} endIndex 
 * @returns 
 */
export const drawLip = ( canvasContext, lips, stroke={h:90,s:50,l:50,a:0.6}, fill={h:90,s:50,l:50,a:0.6}, startIndex = 0, endIndex=-1 ) => {
	
	const strokeColour = `hsla( ${stroke.h}%, ${stroke.s}%, ${stroke.l}%, ${stroke.a} )`
	const fillColour = `hsla( ${fill.h}%, ${fill.s}%, ${fill.l}%, ${fill.a} )`
	
	// This is fixed at 41
	const lipsLength = lips.length

	const start = startIndex
	const end = endIndex > -1 ? endIndex : lipsLength - 1

	const startNode = lips[start]
	//const endNode = lips[end]

	// console.log("START", {start,startIndex,startNode, lipsLength, lips})
	// console.log("END", {end,endIndex,endNode, lipsLength, lips})

	// drawNode( startNode, 4, "red", "start "+start)
	// drawNode( endNode, 4, "yellow", "end "+end )

	canvasContext.beginPath()
	canvasContext.moveTo( startNode.x, startNode.y)

	for (let i=start+1; i <= end; ++i)
	{
		const position = lips[i]
		canvasContext.lineTo( position.x, position.y )
	}

	// end going back to start...
	canvasContext.strokeStyle = strokeColour
	canvasContext.stroke( )

	// fill
	canvasContext.fillStyle = fillColour || 'orange'
	canvasContext.fill( )

	return {}
}



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

export const drawMouth = ( canvasContext, prediction, palette={h:90,s:50,l:50,a:0.6}, startIndex = 0, endIndex=-1 ) => {
	
	const { annotations, mouthRangeVertical, mouthWidth, isMouthOpen } = prediction
	const {lips} = annotations

	// This is fixed at 41
	const lipsLength = lips.length

	const start = startIndex
	const end = endIndex > -1 ? endIndex : lipsLength - 1

	const startNode = lips[start]
	const endNode = lips[end]

	console.log("START", {start,startIndex,startNode, lipsLength, lips})
	console.log("END", {end,endIndex,endNode, lipsLength, lips})

	//drawCircle( canvasContext, startNode.x, startNode.y, 5, 2, 'red', 'yellow')
	//drawCircle( canvasContext, endNode.x, endNode.y, 5, 2, 'red', 'yellow')
	drawNode( canvasContext, startNode, 4, "red", "start "+start)
	drawNode( canvasContext, endNode, 4, "yellow", "end "+end )

	canvasContext.beginPath()
	canvasContext.moveTo( startNode.x, startNode.y)

	for (let i=start; i <= end; ++i)
	{
		const percent = i / end
		const position = lips[i]
		// find which quadrant 0 -> 3
		// const part = i / lipLength
		// const quadrant = Math.round(part)
		// change colour depending on quadrant
		const colour = `hsl( ${percent * 360}%, 80%, 50% )`
		// colours[quadrant]

		// each piece can be a different colour :)
		canvasContext.strokeStyle = colour
		canvasContext.lineTo( position.x, position.y )
		canvasContext.stroke( )
	}
	// end going back to start...

	return {}
	
	
	const colourInner = `hsla(${palette.h},${palette.s}%,${palette.l}%, ${palette.a})`
	const colourOuter = `hsla(${palette.h},${palette.s}%,20%, ${palette.a})`
	const colourDark = `hsla(${palette.h},${palette.s}%,10%, ${palette.a})`
	// const colours = [
	// 	colourOuter,colourOuter,
	// 	colourInner,colourInner
	// ]

	// The Mouth has 4 parts
	// 

	const colours = [
		'blue','pink','orange','purple'
	]
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
	const mouthGradient = canvasContext.createLinearGradient(0, 0, mouthWidth, mouthRangeVertical )
	mouthGradient.addColorStop(0, colourInner)
	mouthGradient.addColorStop(0.5, colourDark )
	mouthGradient.addColorStop(1, colourInner)

	// canvasContext.beginPath()
	// canvasContext.moveTo(lipsUpper[0][0], lipsUpper[0][1])
	// for (let i = 0, q=lip.length; i < q; i++) 
	// {
	// 	const x = lip[i][0]
	// 	const y = lip[i][1]

	// 	canvasContext.lineTo(x, y)
	// }	
	// canvasContext.fill()

	const START_OFFSET = [1,0,0,0]
	const LENGTH_OFFSETS = [-1,0,0,1]

	// canvasContext.lineWidth = 3
	// canvasContext.fillStyle = colourDark
	// canvasContext.fillStyle = mouthGradient
	// canvasContext.beginPath()
	// canvasContext.moveTo( lips[startIndex].x, lips[startIndex].y )

	// there are four parts to the mouth.

/*
	*/

	/*
	// r = 0, to, 2= bo, 3= bi, 4= ti
	for (let r=2; r < 4; r++)
	{
		//const offset = ( r * lipLengthTest) + currentOffset + counter
		let l = ( r * lipLength) + START_OFFSET[r]
		const t = l + lipLength + LENGTH_OFFSETS[r]
		
		// bottom outer lip
		canvasContext.beginPath()
		canvasContext.moveTo( lips[l].x, lips[l].y )
		
		for (; l < t; ++l) 
		{
			const lip = lips[l]
			canvasContext.strokeStyle = colours[r]
			canvasContext.lineTo( lip.x, lip.y )
		}	
		if (r > 2){
			// Inner lips
			//canvasContext.closePath()
		
		}else{
			// Outer lips
		}
		canvasContext.stroke( )
		canvasContext.fill( )
	}
*/

	// r = 0, to, 2= bo, 3= bi, 4= ti
	// const r = 2
	// let l = ( r * lipLength) + START_OFFSET[r] + 1
	
	// // bottom outer lip
	// canvasContext.beginPath()
	// canvasContext.moveTo( lips[l].x, lips[l].y )
	// canvasContext.strokeStyle = 'pink'
	// canvasContext.fillStyle = 'orange'

	// for (; l < lipsLength - 5; ++l) 
	// {
	// 	// flip from end half way through
	// 	const lip = lips[l] 
	// 	// const lip =  l <= lipsLength - lipLength ? 
	// 	//  				lips[ l ] : 
	// 	//  				lips[lipsLength - l]

	// 	canvasContext.lineTo( lip.x, lip.y )
	// 	//console.log("drawMouth", lip, {r,l,lipsLength, lipLength})
	// }	
	// canvasContext.stroke( )

	//canvasContext.closePath()
	// canvasContext.strokeStyle = 'pink'
	// canvasContext.fillStyle = 'orange'
	
	// canvasContext.fill( )

	let counter = 0
	// 1. OUTER bottom lip
	// for (let r=0; r < 1; r++)
	// {
	// 	const currentOffset = START_OFFSET[r] + counter
	// 	const offset = ( r * lipLength) + currentOffset

	// 	canvasContext.beginPath()
	// 	canvasContext.moveTo( lips[offset].x, lips[offset].y )
	// 	canvasContext.strokeStyle = colours[r]
		
	// 	for (let l = 1, t=lipLengthTest; l < t; l++) 
	// 	{
	// 		counter = l + offset
	// 		const lip = lips[counter]
	// 		canvasContext.lineTo( lip.x, lip.y )
	// 	}	
	// 	//canvasContext.closePath()
	// 	//canvasContext.fill()
	// 	canvasContext.stroke( )
	// 	counter++
	// } 
/*
	// 2. OUTER top lip
	let currentOffset = LENGTH_OFFSETS[0]
	let lipLengthTest = Math.round(lipsLength/4) - currentOffset

	for (let r=1; r < 2; r++)
	{
		const offset =( r * lipLengthTest) + currentOffset
		canvasContext.beginPath()
		canvasContext.moveTo( lips[offset].x, lips[offset].y )
		canvasContext.strokeStyle = colours[r]
		
		for (let l = 1, t=lipLengthTest; l < t; l++) 
		{
			const lip = lips[l + offset]
			canvasContext.lineTo( lip.x, lip.y )
		}	
		//canvasContext.closePath()
		//canvasContext.fill()
		canvasContext.stroke( )
	} 


	// loop back to start
	// canvasContext.lineTo( lips[0].x, lips[0].y )

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
		canvasContext.fillText(`${Math.floor(mouthRangeVertical)}px`, lipLowerMiddle.x, lipLowerMiddle.y - 20 )
	}
*/
	return {lipUpperMiddle, lipLowerMiddle }
}
