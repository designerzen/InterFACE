import { subdivideKeypoints } from "../models/keypoint-subdivision.js"

import { drawFaceFeatures } from './2d.face-features.js'
import { getPredictionLandmarks } from '../display/display-landmarks.js'

const faceOvalStyle = {
	// The color that is used to draw the shape. Defaults to white.
	// string | CanvasGradient | CanvasPattern | Callback<LandmarkData, string | CanvasGradient | CanvasPattern>;
	color: "hsl(90,50%,50%)",
	// color: "hsl(90,50%,50%)",
	// color: "#C0C0C070",
	/**
	 * The color that is used to fill the shape. Defaults to `.color` (or black
	 * if color is not set).
	 * string | CanvasGradient | CanvasPattern | Callback<LandmarkData, string | CanvasGradient | CanvasPattern>;
	 */
	fillColor: "hsl(90,50%,50%)",
	// The width of the line boundary of the shape. Defaults to 4. 
	lineWidth:3,
	// The radius of location marker. Defaults to 6.
	radius:12
}

// For landmarks
const blobStyle = { 
	//color?: string | CanvasGradient | CanvasPattern | Callback<LandmarkData, string | CanvasGradient | CanvasPattern>;
	color:"hsla(90,50%,50%, 0.2)",
	/** The width of the line boundary of the shape. Defaults to 4. */
	lineWidth: 0.5,
	/**
	 * The color that is used to fill the shape. Defaults to `.color` (or black
	 * if color is not set).
	 */
	fillColor:"hsla(90,50%,50%, 0.5)",
	/** The radius of location marker. Defaults to 6. */
	radius: 0.25
}

const highlightFaceOvalStyle = {
	color: "white",
	lineWidth: 4
}

export const drawFace = ( canvasContext, person, beatJustPlayed, colours, drawingUtils, FaceLandmarker, displayOptions={} ) => {

	// const isSelected = person.isSelected
	const prediction = person.data
	if (!getPredictionLandmarks(prediction).length || !drawingUtils)
	{
		return
	}
	const raw = getPredictionLandmarks(prediction)
 const normalized = raw.every(point => Math.abs(point.x) <= 1.5 && Math.abs(point.y) <= 1.5)
 const landmarks = normalized ? raw : raw.map(point => ({ ...point, x: point.x / canvasContext.canvas.width, y: point.y / canvasContext.canvas.height, z: (point.z ?? 0) / canvasContext.canvas.width }))
	const pointLandmarks = displayOptions.geometrySubdivisions > 0
		? subdivideKeypoints(landmarks, displayOptions.geometrySubdivisions)
		: landmarks
	const options = { ...displayOptions, ...person.options, ...colours }
	// const flipped = options.flipped

	// const hue = person.hue
	// const saturation = person.saturation
	// const luminosity = person.luminosity

	// generic face colour
	const color = person.hsla

	//  `hsla(${mouthColours.h},${mouthColours.s},${mouthColours.l},${mouthColours.a}})`

	// console.log("drawing person", person, "to canvas", this )

	// FIXME:
	// if (person.isMouseDown)
	// {
	// 	drawMousePressure( person.mouseHoldProgress, options.mouseHoldDuration )
	// }

	// NB. assumes screen has been previously cleared	
	// drawBox( prediction )
	//drawFace( prediction, options, this.singing, this.isMouthOpen, this.debug )
	if (options.drawMask)
	{
		// we go from nodes to mesh if mouth active...
		if (!options.drawNodes && !options.drawMesh && options.meshOnSing)
		{
			// this.isMouthOpen = true
			if (person.singing)
			{
				if (person.instrumentLoading)
				{
					drawingUtils.drawConnectors(
						landmarks,
						FaceLandmarker.FACE_LANDMARKS_TESSELATION,
						{ color:options.mouthClosed , lineWidth: 1 }
					)
					
				} else if(person.isMouthOpen) {

					drawingUtils.drawConnectors(
						landmarks,
						FaceLandmarker.FACE_LANDMARKS_TESSELATION,
						{ color, lineWidth: 2 }
					)
				}

			}else{
				faceOvalStyle.fillColor = person.hsl
				drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
					faceOvalStyle
				)
			}

		} else if (options.drawNodes) {
			
			// just blobs
			blobStyle.color = color
			blobStyle.fillColor = color

			// drawPoints( prediction, colours, 3, person.instrumentLoading, this.debug )
			drawingUtils.drawLandmarks(
				pointLandmarks,
				blobStyle
			)
		
		} else if (options.drawMesh) {

			// just mesh
			drawingUtils.drawConnectors(
				landmarks,
				FaceLandmarker.FACE_LANDMARKS_TESSELATION,
				{ color, lineWidth: 1 }
			)
		}
	}

	if (options.drawOutline && (person.isHighlighted || person.isSelected))
	{
		const outlineAlpha = person.isSelected ? 1 : 0.5
		highlightFaceOvalStyle.color = `hsla(${person.hue},${Math.min(100, options.saturation + 20)}%,${Math.max(20, options.luminosity)}%,${outlineAlpha})`
		drawingUtils.drawConnectors(
			landmarks,
			FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
			highlightFaceOvalStyle
		)
	}


	// drawBoundingBox( boundingBox )

	//console.error("Bounding box", {boundingBox} )

	//const { height,width,xMax,xMin,yMax,yMin} = boundingBox

	// if this is mirrored using the option in the TF model...

	drawFaceFeatures(canvasContext, person, colours, displayOptions, beatJustPlayed)
}
