import { clamp, TAU, HALF_PI , TWO_PI } from "../maths/maths"
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

/**
 * Create a 2D path object
 * @param {Array<Object>} points - 2D array {x,y}
 * @param {Boolean} closePath 
 * @returns 
 */
export const drawPath = ( points, closePath=false ) => {
	const region = new Path2D()
	region.moveTo(points[0].x, points[0].y)
	
	for (let i = 1; i < points.length; ++i) 
	{
	  const point = points[i]
	  region.lineTo(point.x, point.y)
	}
  
	if (closePath) 
	{
	  region.closePath()
	}

	canvasContext.stroke(region)
	return region
}

/**
 * Draws a specific part by looping through the part array and 
 * connecting the nodes together with paths
 * @param {Array} keypoints 
 * @param {Number} nodeRadius 
 * @param {String} strokeStyle 
 * @param {Boolean} lines 
 * @param {Boolean} fill 
 * @param {Boolean} showNumbers 
 * @param {Color} fillStyle 
 * @param {Number} strokeWidth 
 */
export const drawPart = (keypoints, nodeRadius=0, strokeStyle="red", lines=true, fill=true, showNumbers=false, fillStyle="rgba(255,0,0,0.5)", strokeWidth=1 ) => {
	
	// console.error("Keypoints", keypoints)
	const length = keypoints.length
	let piece = keypoints[0]

	canvasContext.moveTo(piece.x, piece.y)

	canvasContext.fillStyle  = fillStyle || strokeStyle
	canvasContext.strokeStyle = strokeStyle
	canvasContext.strokeWidth = strokeWidth

	canvasContext.beginPath()

	for (let i = 0; i < length; ++i) 
	{
		piece = keypoints[i]

		const x = piece.x
		const y = piece.y
	
		// draw blob
		if (nodeRadius > 0)
		{
			canvasContext.arc(x, y, nodeRadius, 0, TAU)
		}
		
		// onnecting lines
		if (lines)
		{
			canvasContext.lineTo(x, y)
		}
	}	

	// if we want a filled shape
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
		// every second number
		for (let i = 0; i < length; i += 2 ) 
		{
			piece = keypoints[i]
			canvasContext.stroke( )
			canvasContext.font = "18px Oxanium"
			canvasContext.textAlign = "center"
			canvasContext.fillStyle = PALETTE.dark
			canvasContext.fillText(`#${i}`, piece.x, piece.y  )
		}
	}
}

/**
 * Draw a canvas circle
 * @param {Number} cx 
 * @param {Number} cy 
 * @param {Number} radius 
 * @param {Number} strokeWidth 
 * @param {Number} fillColour 
 * @param {Number} strokeColour 
 */
export const drawCircle = (cx,cy, radius=5, strokeWidth=3, fillColour='#FF6A6A', strokeColour="#FF0000") => {
	
	canvasContext.beginPath()
    canvasContext.arc(cx, cy, radius, 0, TWO_PI, true)
    canvasContext.fillStyle = fillColour
    canvasContext.fill()
     
	if (strokeWidth)
	{
		// draw the stroke
		canvasContext.lineWidth = strokeWidth
		canvasContext.strokeStyle = strokeColour
		canvasContext.stroke()
	}
	canvasContext.closePath()
}

/**
 * draws a three pointed shape 
 * @param {Number} x1 
 * @param {Number} y1 
 * @param {Number} x2 
 * @param {Number} y2 
 * @param {Number} x3 
 * @param {Number} y3 
 * @param {Number} fill 
 * @param {Number} strokeWidth 
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

/**
 * Highlight a specific node
 * @param {*} pointA 
 * @param {*} radius 
 * @param {*} fill 
 */
export const drawNode = (point, radius=5, fill="blue", text='', fontSize="12px", strokeWidth=2 ) => {
	
	drawCircle( point.x, point.y, radius, strokeWidth, fill)

	if (text.length > 0)
	{
		drawText( point.x, point.y, text, fontSize )
	}
}

/**
 * draw a line with a ball on either end
 * @param {Object} pointA 
 * @param {Object} pointB 
 * @param {Number} radius 
 * @param {Number} fill 
 */
export const drawNodes = (pointA, pointB, radius=5, fill="blue", strokeWidth=2 ) => {
	
	// first circle
	drawCircle( pointA.x, pointA.y, radius, strokeWidth, fill)

	// 2nd circle
	drawCircle( pointB.x, pointB.y, radius, strokeWidth, fill)
	
	// connecting line
	canvasContext.beginPath()	
	canvasContext.strokeStyle = PALETTE.orange
	canvasContext.moveTo(pointA.x, pointA.y)
	canvasContext.lineTo(pointB.x, pointB.y)
	canvasContext.stroke()
	canvasContext.closePath()
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

/**
 * Write out the intstrument text
 * @param {*} boundingBox 
 * @param {*} instrumentName 
 * @param {*} extra 
 */
export const drawInstrument = (boundingBox, instrumentName, extra='') => {

	// use prediction.boundingBox to position text
	const text = `${instrumentName.toUpperCase()} - ${extra}`
	// canvasContext.beginPath()
	// these aren't scaled :(
	// canvasContext.fillStyle  = colour
	// canvasContext.rect( boundingBox.xMin boundingBox.yMin, boundingBox.xMax, boundingBox.yMax )
	// canvasContext.strokeRect( boundingBox.xMin, boundingBox.yMin, boundingBox.xMax, boundingBox.yMax )
	// canvasContext.fill()
	drawText( boundingBox.xMin, boundingBox.yMin, text, "24px" )
}

/**
 * Draw a rectangle at the set position and dimension
 * @param {*} boundingBox 
 * @param {*} colour 
 */
export const drawBoundingBox = (boundingBox, colour='red') => {
	canvasContext.beginPath()
	canvasContext.fillStyle  = colour
	canvasContext.strokeRect( boundingBox.xMin, boundingBox.yMin, boundingBox.xMax, boundingBox.yMax )
	canvasContext.fill()
}


let nodeCount = 0
export const setNodeCount = value => nodeCount += value

let cycleCounter = 0

// shape the bump sizes
const modifier = easeInQuad

/**
 * Just draws lots of dots on an image on the canvas
 * @param {*} prediction 
 * @param {*} colour 
 * @param {*} size 
 * @param {*} colourCycle 
 * @param {*} showText 
 */
export const drawPoints = (prediction, colour={h:0,s:100,l:100}, size=3, colourCycle=false, showText=true) => {

	const scaledMesh = prediction.keypoints
	const quantity = scaledMesh.length
	
	// draw face points at correct position on canvas
	for (let i = 0; i < quantity; i++) 
	{
		const x = scaledMesh[i].x
		const y = scaledMesh[i].y
		const z = scaledMesh[i].z || 1
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

/**
 * Draws a triangulated face using the matrix model
 */
import {TRIANGLE_MATRIX} from '../models/face-mesh-model'
export const drawFaceMesh = (prediction, palette={h:0,s:100,l:100}, strokeWidth=0.5, colourCycle=false, alpha=0.2 ) => {
	const scaledMesh = prediction.keypoints
	const hue = palette.h
	for( let i = 0, q=TRIANGLE_MATRIX.length - 2; i < q; i+=3 ) 
	{
		const pointA = scaledMesh[ TRIANGLE_MATRIX[ i ] ]
		const pointB = scaledMesh[ TRIANGLE_MATRIX[ i + 1 ] ]
		const pointC = scaledMesh[ TRIANGLE_MATRIX[ i + 2 ] ]
		const alpha = palette.a || 1
		
		const phase = colourCycle ? (hue + ( 360 * i/q )) % 360 : hue
		const colour = `hsla(${phase},${palette.s}%,${palette.l}%,${alpha})`

		drawTriangle( pointA.x, pointA.y, pointB.x, pointB.y, pointC.x, pointC.y, colour, strokeWidth )
	}
}


/**
 * every frame this gets called with an array of points in a mesh face
 * we use certain deviations to determine direction and mouth size
 * @param {*} prediction 
 * @param {*} options 
 * @param {*} singing 
 * @param {*} mouthOpen 
 * @param {*} debug 
 */
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
	// canvasContext.arc( midwayBetweenEyes.x, midwayBetweenEyes.y, 10, 0, TAU )
	// canvasContext.fill()
}