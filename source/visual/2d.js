import { clamp, TAU, HALF_PI } from "../maths/maths"
import { canvas, canvasContext, drawElement } from './canvas'
import { easeInQuad} from "../maths/easing"
import PALETTE, { DEFAULT_COLOURS } from "../palette"

/**
 * converts the canvas into a PNG / JPEG and adds returns as a blob?
 * @param {String} type 
 * @returns Blob
 */
export const takePhotograph = (type="image/png") => {
	// TODO: reassemble canvas with logo and stuff?
	return canvas.toDataURL(type)
}

//////////////////////////////////////////////////////////////////////
// takes indexes from an array and finds the associated links to draw
//////////////////////////////////////////////////////////////////////
export const drawShapeByIndexes = (points, indexes, radius=2, colour="red", lines=true, fill=true) => {
	canvasContext.fillStyle  = colour
	canvasContext.strokeStyle = colour
	canvasContext.moveTo(points[ indexes[0] ][0], points[ indexes[0]][1] )
	canvasContext.beginPath()
	
	for (let i = 1,  l= indexes.length; i < l; i++) 
	{
		canvasContext.lineTo(points[ indexes[i] ][0], points[ indexes[i]][1] )
	}
	canvasContext.closePath()

	// if we want a filled thing
	if (fill)
	{
		canvasContext.fill()
	}
	
	if (lines)
	{
		canvasContext.stroke()
	}
}

//////////////////////////////////////////////////////////////////////
// draws a specific part by looping through the part array and 
// connecting the nodes together with paths
//////////////////////////////////////////////////////////////////////
export const drawPart = (part, radius=2, colour="red", lines=true, fill=true, showNumbers=false) => {
	
	canvasContext.fillStyle  = colour
	canvasContext.strokeStyle = colour
	canvasContext.moveTo(part[0][0], part[0][1])
	canvasContext.beginPath()

	for (let i = 0,  l= part.length; i < l; i++) 
	{
		const x = part[i][0]
		const y = part[i][1]
	
		// draw blob
		canvasContext.arc(x, y, radius, 0, TAU)
		
		// onnecting lines
		if (lines)
		{
			canvasContext.lineTo(x, y)
		}
	
	}	

	// if we want a filled thing
	if (fill)
	{
		canvasContext.fill()
	}
	
	if (lines)
	{
		canvasContext.stroke()
	}
	
	
	if (showNumbers)
	{
		for (let i = 0, l=part.length; i < l; i += 2 ) 
		{
			const x = part[i][0]
			const y = part[i][1]

			canvasContext.stroke( )
			canvasContext.font = "18px Oxanium"
			canvasContext.textAlign = "center"
			canvasContext.fillStyle = PALETTE.dark
			canvasContext.fillText(`#${i}`, x, y  )
		}
	}
}

/**
 * 
 * @param {*} cx 
 * @param {*} cy 
 * @param {*} radius 
 * @param {*} strokeWidth 
 * @param {*} fillColour 
 * @param {*} strokeColour 
 */
export const drawCircle = (cx,cy, radius, strokeWidth=3, fillColour='#FF6A6A', strokeColour="#FF0000") => {
	
	canvasContext.beginPath()
    canvasContext.arc(cx, cy, radius, 0, Math.PI * 2, true)
    canvasContext.fillStyle = fillColour
    canvasContext.fill()
     
    // draw the stroke
    canvasContext.lineWidth = strokeWidth
    canvasContext.strokeStyle = strokeColour
    canvasContext.stroke()
}

/**
 * draws a three pointed shape 
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @param {*} x3 
 * @param {*} y3 
 * @param {*} fill 
 * @param {*} strokeWidth 
 */
export const drawTriangle = ( x1, y1, x2, y2, x3, y3, fill, strokeWidth=1 ) => {
	
	canvasContext.beginPath()

	canvasContext.lineWidth = strokeWidth
	canvasContext.strokeStyle = fill

	canvasContext.moveTo( x1, y1 )
	canvasContext.lineTo( x2, y2 )
	canvasContext.lineTo( x3, y3 )

	canvasContext.closePath()

	// canvasContext.fillStyle

	// canvasContext.lineTo( x1, y1 )
	canvasContext.stroke()
}

//////////////////////////////////////////////////////////////////////
// draw a line with a ball on either end wih optional text
//////////////////////////////////////////////////////////////////////
export const drawNode = (pointA, pointB, radius=5, fill="blue") => {
	
	canvasContext.fillStyle  = fill

	canvasContext.beginPath()
	canvasContext.arc(pointB[0], pointB[1], radius, 0, TAU)
	canvasContext.fill()

	canvasContext.beginPath()
	canvasContext.arc(pointA[0], pointA[1], radius, 0, TAU)
	canvasContext.fill()

	canvasContext.beginPath()
	canvasContext.moveTo(pointA[0], pointA[1])

	canvasContext.strokeStyle = PALETTE.orange
	canvasContext.fillStyle = PALETTE.orange
	canvasContext.lineTo(pointB[0], pointB[1])
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

	// use prediction.boundingBox to position text
	const text = `${instrumentName.toUpperCase()} - ${extra}`
	// canvasContext.beginPath()
	// // these aren't scaled :(
	// canvasContext.fillStyle  = colour
	// // canvasContext.rect( topLeft[0], topLeft[1], bottomRight[0], bottomRight[1] )
	// canvasContext.strokeRect( topLeft[0], topLeft[1], bottomRight[0], bottomRight[1] )
	// canvasContext.fill()
	drawText( boundingBox.topLeft[0], boundingBox.topLeft[1], text, "24px" )
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
export const drawPoints = (prediction, colour={h:0,s:100,l:100}, size=3, colourCycle=false, showText=true) => {

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
			const hue = colour.h
			const modifiedHue = colourCycle ? ((cycleCounter++)+hue+360*i/quantity)%360 : hue
			canvasContext.fillStyle = `hsla(${modifiedHue},${colour.s}%,${colour.l}%,${alpha})`
			canvasContext.arc(x, y, radius, 0, TAU)
		}

		canvasContext.fill()
	}
}


//////////////////////////////////////////////////////////////////////
// Draws a triangulated face
//////////////////////////////////////////////////////////////////////
import {TRIANGLE_MATRIX} from '../models/face-mesh-model'
export const drawFaceMesh = (prediction, palette={h:0,s:100,l:100}, strokeWidth=0.5, colourCycle=false, alpha=0.2 ) => {
	const { scaledMesh } = prediction
	const hue = palette.h
	for( let i = 0, q=TRIANGLE_MATRIX.length - 2; i < q; i+=3 ) 
	{
		const pointA = scaledMesh[ TRIANGLE_MATRIX[ i ] ]
		const pointB = scaledMesh[ TRIANGLE_MATRIX[ i + 1 ] ]
		const pointC = scaledMesh[ TRIANGLE_MATRIX[ i + 2 ] ]
		const alpha = palette.a || 1
		
		const phase = colourCycle ? (hue + ( 360 * i/q )) % 360 : hue
		const colour = `hsla(${phase},${palette.s}%,${palette.l}%,${alpha})`

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
