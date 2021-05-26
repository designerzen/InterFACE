import { clamp, TAU } from "../maths/maths"
import PALETTE, { DEFAULT_COLOURS } from "../palette"
import { canvas, canvasContext, drawElement } from './canvas'
import {easeInQuad} from "../maths/easing"

export const setupImage = async (image) => {
	return new Promise( async (resolve,reject) => {
		const setSize = ()=> {
			image.width = image.naturalWidth
			image.height = image.naturalHeight
		}
		// check to see if has already loaded...
		if (image.naturalWidth > 0)
		{
			setSize()
			resolve(image) 
		}else{
			image.onloaded = ()=>{ 
				setSize()
				resolve(image)
			}
			image.onerror = error => reject(error)
		}
	})
}

//////////////////////////////////////////////////////////////////////
// converts the canvas into a PNG / JPEG and adds returns as a blob?
//////////////////////////////////////////////////////////////////////
export const takePhotograph = (type="image/png") => {
	// reassemble canvas with logo and stuff?
	return canvas.toDataURL(type)
}

export const drawPart = (part, radius=4, colour="red", lines=true) => {
	
	canvasContext.fillStyle  = colour
	canvasContext.strokeStyle = colour
	
	canvasContext.moveTo(part[0][0], part[0][1])
	
	canvasContext.beginPath()
	for (let i = 0,  l= part.length; i < l; i++) 
	{
		const x = part[i][0]
		const y = part[i][1]

		canvasContext.arc(x, y, radius, 0, TAU)
		
		if (lines){
			canvasContext.lineTo(x, y)
		}
	}	
	canvasContext.fill()

	if (lines){
		canvasContext.stroke()
	}
}

//////////////////////////////////////////////////////////////////////
// Draw an Eye from the EYE Model object
//////////////////////////////////////////////////////////////////////
export const drawEye = (eye, colour="blue") => {
	
	const iris = eye[0]
	const inner = eye[1]
	const up = eye[2]
	const outer = eye[3]
	const down = eye[4]
	
	canvasContext.strokeWidth = 0
	
	// draw eye path
	const arcLength = 6
	canvasContext.beginPath()
	canvasContext.fillStyle  = colour
	canvasContext.arcTo(up[0], up[1], inner[0], inner[1], arcLength)
	canvasContext.arcTo(inner[0], inner[1], down[0], down[1], arcLength)
	canvasContext.arcTo(down[0], down[1], outer[0], outer[1], arcLength)
	canvasContext.arcTo(outer[0], outer[1], up[0], up[1], arcLength)
	canvasContext.fill()

	let radius = 2// 1 + clamp( (10+iris[2]) * 0.8, 5, 10 )
	canvasContext.beginPath()
	canvasContext.fillStyle  = 'black'
	canvasContext.arc(iris[0], iris[1], radius, 0, TAU)
	canvasContext.fill()

	/*
	radius = 4
	canvasContext.beginPath()
	canvasContext.fillStyle  = 'blue'
	canvasContext.arc(up[0], up[1], radius, 0, TAU)
	canvasContext.fill()
	canvasContext.closePath()

	canvasContext.beginPath()
	canvasContext.fillStyle  = 'purple'
	canvasContext.arc(outer[0], outer[1], radius, 0, TAU)
	canvasContext.fill()
		
	canvasContext.beginPath()
	canvasContext.fillStyle  = 'green'
	canvasContext.arc(down[0], down[1], radius, 0, TAU)
	canvasContext.fill()

	
	canvasContext.beginPath()
	canvasContext.fillStyle  = 'yellow'
	canvasContext.arc(inner[0], inner[1], radius, 0, TAU)
	canvasContext.fill()
	*/

	/*
	// there are four outer balls
	for (let i = 0  ; i < eye.length -1; i++ ) 
	{
		const x = eye[i][0]
		const y = eye[i][1]
		const z = eye[i][2]

		// const radius = 1 + clamp( (10+z) * 0.8, 5, 10 )
		// canvasContext.arc(x, y, radius, 0, TAU)
		// canvasContext.fill()

		if (i > 0)
		{
			const arcLength = 7 ;//Math.abs( i%2 ? iris - x : iris - y )
			const previous = eye[i-1]
			canvasContext.arcTo(previous[0],previous[1], x,y,arcLength)
		}
	}*/
	// canvasContext.stroke()
}

//////////////////////////////////////////////////////////////////////
// draws a three pointed shape 
//////////////////////////////////////////////////////////////////////
export const drawTriangle = ( x1, y1, x2, y2, x3, y3, fill, strokeWidth=1 ) => {
	
	canvasContext.beginPath()
	canvasContext.moveTo( x1, y1 )
	canvasContext.lineTo( x2, y2 )
	canvasContext.lineTo( x3, y3 )
	canvasContext.closePath()

	canvasContext.lineWidth = strokeWidth
	canvasContext.strokeStyle = fill

	// canvasContext.lineTo( x1, y1 )
	canvasContext.stroke()
}

export const drawNode = (pointA, pointB, radius=5, fill="blue", showText=false) => {
	
	canvasContext.fillStyle  = fill

	canvasContext.beginPath()
	canvasContext.arc(pointB[0], pointB[1], radius, 0, TAU)
	canvasContext.fill()

	canvasContext.beginPath()
	canvasContext.arc(pointA[0], pointA[1], radius, 0, TAU)
	canvasContext.fill()

	canvasContext.beginPath()
	canvasContext.moveTo(pointA[0], pointA[1])

	canvasContext.strokeStyle = "orange"
	canvasContext.fillStyle = "orange"
	canvasContext.lineTo(pointB[0], pointB[1])

	// add text
	if (showText)
	{
		canvasContext.stroke( )
		canvasContext.fillStyle = PALETTE.blue
		canvasContext.font = "12px Oxanium"
		canvasContext.textAlign = "center"
		canvasContext.fillText(`${Math.floor(mouthRange)}px`, pointA[0], pointA[1] - 20 )
	}
}

//////////////////////////////////////////////////////////////////////
// Draw a Mouth onto the canvas
//////////////////////////////////////////////////////////////////////
export const drawMouth = ( prediction, colour="yellow", debug=true ) => {
	
	const { annotations, mouthRange,mouthWidth, mouthOpen } = prediction
	const {lipsUpperInner,lipsLowerInner} = annotations 
	const lips = [lipsUpperInner, lipsLowerInner]
	
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
	mouthGradient.addColorStop(0.5, PALETTE.dark )
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
	canvasContext.fill()

	if (debug)
	{
		drawNode(lipLowerMiddle, lipUpperMiddle, 5)
	}
	
	return {lipUpperMiddle, lipLowerMiddle }
}

//////////////////////////////////////////////////////////////////////
// Add a string of text to the canvas
//////////////////////////////////////////////////////////////////////
export const drawText = (x, y, text='', size='10px', align="center") => {
	const f = false
	canvasContext.font = `900 ${size} Oxanium`
	canvasContext.textAlign = align
	canvasContext.fillStyle = f ? PALETTE.dark :  PALETTE.white
	canvasContext.strokeStyle  = f ? PALETTE.white : PALETTE.dark
	canvasContext.strokeText(`${text}`, x,y )
	canvasContext.fillText(`${text}`, x, y )
}

// multi line
export const drawParagraph = (x, y, paragraph=[], size='8px', lineHeight=20) => {
	let textY = y
	for (const p of paragraph)
	{
		drawText( x, textY, p, size, "left" )
		textY += lineHeight
	}
}

export const drawInstrument = (boundingBox, instrumentName, extra='') => {

	// use prediction.boundingBox
	const {bottomRight, topLeft} = boundingBox
	const text = `${instrumentName.toUpperCase()} - ${extra}`
	// canvasContext.beginPath()
	// // these aren't scaled :(
	// canvasContext.fillStyle  = colour
	// // canvasContext.rect( topLeft[0], topLeft[1], bottomRight[0], bottomRight[1] )
	// canvasContext.strokeRect( topLeft[0], topLeft[1], bottomRight[0], bottomRight[1] )
	// canvasContext.fill()
	drawText( topLeft[0], topLeft[1], text, "24px" )
}

export const drawBoundingBox = (boundingBox, colour='red') => {
	const {bottomRight, topLeft} = boundingBox
	canvasContext.beginPath()
	// these aren't scaled :(
	canvasContext.fillStyle  = colour
	// canvasContext.rect( topLeft[0], topLeft[1], bottomRight[0], bottomRight[1] )
	canvasContext.strokeRect( topLeft[0], topLeft[1], bottomRight[0], bottomRight[1] )
	canvasContext.fill()
}


let nodeCount = 0

export const setNodeCount = value => nodeCount += value

let cycleCounter = 0

// shape the bump sizes
const modifier = easeInQuad

// Just draws lots of dots on an image on the canvas
export const drawPoints = (prediction, hue=60, size=3, colourCycle=false, showText=true) => {

	const { scaledMesh } = prediction
	const quantity = scaledMesh.length
	
	// draw face points at correct position on canvas
	for (let i = 0; i < quantity; i++) 
	{
		const x = scaledMesh[i][0]
		const y = scaledMesh[i][1]
		const z = scaledMesh[i][2]
		// z index should not be considered as depth as we
		// start from the front and head back
		
		// const depth = size * ( z + 2) * 0.1
		const depth =  (1 - ( ((z+45) / 45)) )//* 0.1
		
		const radius = clamp(size * modifier(depth), 1, size)
		const alpha = clamp( depth, 0.5, 1)
		// console.log({depth,radius,alpha})
		// const radius = size * Math.abs(10 - z) * 0.1
		canvasContext.beginPath()
		
		// This just draws the number of the node
		if (showText && ( i === (nodeCount % quantity) ))
		{
			canvasContext.stroke( )
			canvasContext.font = "22px Oxanium"
			canvasContext.textAlign = "center"
			canvasContext.fillStyle = PALETTE.dark
			canvasContext.fillText(`#${i}`, x + radius + 1, y  )
			
			canvasContext.fillStyle = `hsla(0,90%,70%,1)`
			canvasContext.arc(x, y, radius * 3, 0, TAU)
		}else{

			const modifiedHue = colourCycle ? ((cycleCounter++)+hue+360*i/quantity)%360 : hue
			canvasContext.fillStyle = `hsla(${modifiedHue},70%,50%,${alpha})`
			canvasContext.arc(x, y, radius, 0, TAU)
		}

		canvasContext.fill()
	}
}


//////////////////////////////////////////////////////////////////////
// Draws a triangulated face
//////////////////////////////////////////////////////////////////////
import {TRIANGLE_MATRIX} from './face'
export const drawFaceMesh = (prediction, hue=60, strokeWidth=1, colourCycle=true, showText=true) => {
	const { scaledMesh } = prediction

	const alpha = 0.4
	
	for( let i = 0, q=TRIANGLE_MATRIX.length - 2; i < q; i+=3 ) 
	{
		const pointA = scaledMesh[ TRIANGLE_MATRIX[ i ] ]
		const pointB = scaledMesh[ TRIANGLE_MATRIX[ i + 1 ] ]
		const pointC = scaledMesh[ TRIANGLE_MATRIX[ i + 2 ] ]
		
		const phase = colourCycle ? (hue + ( 360 * i/q )) % 360 : hue
		const colour = `hsla(${phase},70%,50%,${alpha})`

		drawTriangle( pointA[ 0 ], pointA[ 1 ], pointB[ 0 ], pointB[ 1 ], pointC[ 0 ], pointC[ 1 ], colour, strokeWidth )
	}
}

//////////////////////////////////////////////////////////////////////
// every frame this gets called with an array of points in a mesh face
// we use certain deviations to determine direction and mouth size
//////////////////////////////////////////////////////////////////////
export const drawFace = (prediction, options=DEFAULT_COLOURS, singing=false, mouthOpen=false, debug=false) => {

	// singing - the user has their mouth open beyond the threshold
	// mouthOpen - the user has their mouth closed

	// extract our data
	// const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height)
	// const data = imageData.data
	// now change the colour of certain pixels in line with the points
	// for (var i = 0; i < data.length; i += 4) 
	// {
    //     data[i]     = 255 - data[i];     // red
    //     data[i + 1] = 255 - data[i + 1]; // green
    //     data[i + 2] = 255 - data[i + 2]; // blue
    // }
	// canvasContext.putImageData(imageData, 0, 0)
	const { annotations} = prediction
	
	// MOUTH ==============================================
	// const {lipsUpperInner,lipsLowerInner } = annotations
	
	// top lips
	if (mouthOpen && singing)
	{
		drawMouth(prediction, options.mouth, debug)
		
	}else{
		// mouth closedc or not singing
		drawMouth(prediction, options.mouthClosed, debug)
	}

	// drawPart(lipsUpperInner, options.lipsUpperInner)
	// drawPart(lipsLowerInner, options.lipsLowerInner)
	
	// EYES ===========================================


	// const {leftEyeLower0,rightEyeLower0, midwayBetweenEyes} = annotations
	
	// drawPart(midwayBetweenEyes, options.midwayBetweenEyes )
	
	// eye lids
	// drawPart(leftEyeLower0, options.leftEyeLower0 )
	// drawPart(rightEyeLower0, options.rightEyeLower0 )

	// these aren't scaled :(
	// canvasContext.fillStyle  = 'orange'
	// canvasContext.beginPath()
	// canvasContext.arc( midwayBetweenEyes[0], midwayBetweenEyes[1], 10, 0, TAU )
	// canvasContext.fill()
}
