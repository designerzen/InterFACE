import { clamp, TAU, HALF_PI } from "../maths/maths"
import { easeInQuad} from "../maths/easing"
import PALETTE, { DEFAULT_COLOURS } from "../settings/palette"
import {TRIANGULATION} from '../models/face-mesh-constants'

let cycleCounter = 0

// shape the bump sizes
const modifier = easeInQuad

let nodeCount = 0
export const setNodeCount = value => nodeCount += value

/**
 * converts the canvas into a PNG / JPEG and adds returns as a blob?
 * @param {String} type 
 * @returns Blob
 */
export const takePhotograph = (canvas, type="image/png") => {
	// TODO: reassemble canvas with logo and stuff?
	return canvas.toDataURL(type)
}

/**
 * Empty the canvas and paint it transparent
 */
export const clearCanvas = (canvasContext,width, height) => {

	// context.fillStyle = 'rgba(255,0,0,0)'
	canvasContext.clearRect(0, 0, width, height)
	// context.fillRect(0, 0, width, height)
	// context.restore()
}

/**
 * Draw a canvas circle
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {Number} cx 
 * @param {Number} cy 
 * @param {Number} radius 
 * @param {Number} strokeWidth 
 * @param {Number} fillColour 
 * @param {Number} strokeColour 
 */
export const drawCircle = (canvasContext, cx,cy, radius=5, strokeWidth=3, fillColour='#FF6A6A', strokeColour="#FF0000") => {
	
	canvasContext.beginPath()
    canvasContext.arc(cx, cy, radius, 0, TAU, true)
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

export const drawCircles = (canvasContext, points, radius=5, strokeWidth=3, fillColour="#FF0000", strokeColour="#FF0000") => {
	
	canvasContext.beginPath()
	points.forEach( point => {
		canvasContext.arc(point.x, point.y, radius, 0, TAU, true)
	})
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
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {Number} x1 
 * @param {Number} y1 
 * @param {Number} x2 
 * @param {Number} y2 
 * @param {Number} x3 
 * @param {Number} y3 
 * @param {Number} fill 
 * @param {Number} strokeWidth 
 */
export const drawTriangle = ( canvasContext, x1, y1, x2, y2, x3, y3, fill, strokeWidth=1 ) => {
	
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
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} canvasContext
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
export const drawRoundedRect = (
	canvasContext,
	x,
	y,
	width,
	height,
	radius = 5,
	fill = false,
	stroke = true
  ) => {
	if (typeof radius === 'number') {
	  radius = {tl: radius, tr: radius, br: radius, bl: radius}
	} else {
	  radius = {...{tl: 0, tr: 0, br: 0, bl: 0}, ...radius}
	}
	canvasContext.beginPath()
	canvasContext.moveTo(x + radius.tl, y)
	canvasContext.lineTo(x + width - radius.tr, y)
	canvasContext.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
	canvasContext.lineTo(x + width, y + height - radius.br)
	canvasContext.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
	canvasContext.lineTo(x + radius.bl, y + height)
	canvasContext.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
	canvasContext.lineTo(x, y + radius.tl)
	canvasContext.quadraticCurveTo(x, y, x + radius.tl, y)
	canvasContext.closePath()

	if (fill) 
	{
	  canvasContext.fill()
	}
	if (stroke) 
	{
	  canvasContext.stroke()
	}
}

// --------------------------------------------------------------------------

/**
 * Highlight a specific node
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {Object} pointA 
 * @param {Number} radius 
 * @param {*} fill 
 * @param {String} text 
 * @param {Number} fontSize 
 * @param {Number} strokeWidth 
 */
export const drawNode = (canvasContext, point, radius=5, fill="blue", text='', fontSize="12px", strokeWidth=2 ) => {
	
	drawCircle( canvasContext, point.x, point.y, radius, strokeWidth, fill)

	if (text.length > 0)
	{
		drawText( canvasContext, point.x, point.y, text, fontSize )
	}
}

/**
 * draw a line with a ball on either end
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {Object} pointA 
 * @param {Object} pointB 
 * @param {Number} radius 
 * @param {Number} fill 
 */
export const drawNodes = (canvasContext, pointA, pointB, radius=5, fill="blue", strokeWidth=2 ) => {
	
	// first circle
	drawCircle( canvasContext, pointA.x, pointA.y, radius, strokeWidth, fill)

	// 2nd circle
	drawCircle( canvasContext, pointB.x, pointB.y, radius, strokeWidth, fill)
	
	// connecting line
	canvasContext.beginPath()	
	canvasContext.strokeStyle = PALETTE.orange
	canvasContext.moveTo(pointA.x, pointA.y)
	canvasContext.lineTo(pointB.x, pointB.y)
	canvasContext.stroke()
	canvasContext.closePath()
}

/**
 * Paints an existing element onto our display
 * Used to paint a video frame to the canvas 
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {HTMLElement} element - video / image
 * @param {Number} x - default to 0
 * @param {Number} y - default to 0
 * @param {Boolean} flip - default to true
 * @param {Number} width - default to 100
 */
export const drawElement = ( canvasContext, element, x=0, y=0, flip=true, width=100 ) => {	
	canvasContext.save()
	// invert horizontally (mirror image)
	if (flip)
	{
		canvasContext.translate( width, 0)
		canvasContext.scale(-1, 1)
	}
	canvasContext.drawImage(element , x, y)
	canvasContext.restore()
}

/**
 * Create a 2D path object
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {Array<Object>} points - 2D array {x,y}
 * @param {Boolean} closePath 
 * @returns 
 */
export const drawPath = ( canvasContext, points, closePath=false ) => {
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
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {Array} keypoints 
 * @param {Number} nodeRadius 
 * @param {String} strokeStyle 
 * @param {Boolean} lines 
 * @param {Boolean} fill 
 * @param {Boolean} showNumbers 
 * @param {Color} fillStyle 
 * @param {Number} strokeWidth 
 */
export const drawPart = ( canvasContext, keypoints, nodeRadius=0, strokeStyle="red", lines=true, fill=true, showNumbers=false, fillStyle="rgba(255,0,0,0.5)", strokeWidth=1 ) => {
	
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
 * Draw a rectangle at the set position and dimension
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {*} boundingBox 
 * @param {String} colour 
 */
export const drawBoundingBox = (canvasContext, boundingBox, colour='red') => {
	canvasContext.beginPath()
	canvasContext.fillStyle  = colour
	canvasContext.strokeRect( boundingBox.xMin, boundingBox.yMin, boundingBox.xMax, boundingBox.yMax )
	canvasContext.fill()
}

/**
 * Just draws lots of dots on an image on the canvas
 * @param {CanvasRenderingContext2D} canvasContext 
 * @param {*} prediction 
 * @param {*} colour 
 * @param {Number} size 
 * @param {Boolean} colourCycle 
 * @param {Boolean} showText 
 */
export const drawPoints = (canvasContext, prediction, colour={h:0,s:100,l:100}, size=3, colourCycle=false, showText=true) => {

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
export const drawFaceMesh = (canvasContext, prediction, palette={h:0,s:100,l:100}, strokeWidth=0.5, colourCycle=false, alpha=0.2 ) => {
	const scaledMesh = prediction.keypoints
	const hue = palette.h
	for( let i = 0, q=TRIANGULATION.length - 2; i < q; i+=3 ) 
	{
		const pointA = scaledMesh[ TRIANGULATION[ i ] ]
		const pointB = scaledMesh[ TRIANGULATION[ i + 1 ] ]
		const pointC = scaledMesh[ TRIANGULATION[ i + 2 ] ]
		const alpha = palette.a || 1
		
		const phase = colourCycle ? (hue + ( 360 * i/q )) % 360 : hue
		const colour = `hsla(${phase},${palette.s}%,${palette.l}%,${alpha})`

		drawTriangle( canvasContext, pointA.x, pointA.y, pointB.x, pointB.y, pointC.x, pointC.y, colour, strokeWidth )
	}
}