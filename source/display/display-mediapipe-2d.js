import { drawFaceMesh, drawPart, drawPoints } from "../visual/2d.js"
import { drawEye } from "../visual/2d.eyes.js"
import { drawLip } from "../visual/2d.mouth.js"
import { drawBars } from "../visual/spectrograms.js"
import Display2D from "./display-canvas-2d.js"
import { subdivideKeypoints } from "../models/avatar.js"

import { DISPLAY_MEDIA_PIPE_2D } from "./display-types.js"
import { UPDATE_FACE_BUTTON_AFTER_FRAMES } from "../settings/options.displays.js"

export const LOOKING_GLASS_PORTRAIT_WIDTH = 480
export const LOOKING_GLASS_PORTRAIT_HEIGHT = 720

const DEFAULT_OPTIONS = {
	updateFaceButtonAfter:UPDATE_FACE_BUTTON_AFTER_FRAMES,
	geometrySubdivisions: 0
}

/**
 * Canvas based front end engine for Tensor flow @media pipe
 * new Display2D( document.getElementById('interface') ) // document.querySelector("canvas")
 */
export default class DisplayMediaPipe2D extends Display2D{
	
	name = DISPLAY_MEDIA_PIPE_2D

	get type() {
		return DISPLAY_MEDIA_PIPE_2D
	}

	constructor( canvas, initialWidth, initialHeight, options=DEFAULT_OPTIONS ){
		options = Object.assign({}, DEFAULT_OPTIONS, options)
		super(canvas, initialWidth, initialHeight, options)
	}

	/**
	 * 
	 * @param {Person} person 
	 */
	drawPerson( person, beatJustPlayed, colours, options={} ){

		let prediction = person.data
		const forceRefresh = options.forceRefresh ?? false

		// const personOptions = person.options
		const hue = person.hue
		const canvasContext = this.canvasContext
			
		if (!forceRefresh && !prediction && !person.isPlayingBack)
		{
			// nothing to (re)draw so exit here
			return
		}	

		if (!prediction)
		{
			return
		}

		const annotations = prediction.annotations ?? {}
		const keypoints = {
			leftEye: annotations.leftEye ?? annotations.leftEyeSocket ?? [],
			leftPupil: annotations.leftPupil ?? annotations.leftIris?.[0] ?? null,
			rightEye: annotations.rightEye ?? annotations.rightEyeSocket ?? [],
			rightPupil: annotations.rightPupil ?? annotations.rightIris?.[0] ?? null
		}
		const leftEyebrow = annotations.leftEyebrow ?? annotations.leftEyebrowLower ?? []
		const rightEyebrow = annotations.rightEyebrow ?? annotations.rightEyebrowLower ?? []

		// Keep mesh drawing on canonical indices, use denser points only for dot rendering.
		const subdivisions = this.options.geometrySubdivisions ?? 0
		const pointsPrediction = subdivisions > 0 && Array.isArray(prediction.keypoints) ? {
				...prediction,
				keypoints: subdivideKeypoints(prediction.keypoints, subdivisions),
				allKeypoints: Array.isArray(prediction.allKeypoints) ? subdivideKeypoints(prediction.allKeypoints, subdivisions) : prediction.allKeypoints
			} : prediction

		// console.log("drawPerson", person, {hue, options, colours} )

		


		// FIXME:
		// if (person.isMouseDown)
		// {
		// 	drawMousePressure( person.mouseHoldProgress, options.mouseHoldDuration )
		// }

		
		// let's position our face button
		if (this.count%this.options.updateFaceButtonAfter===0)
		{
			this.movePersonButton(person, prediction)
		}
	
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
					drawFaceMesh( canvasContext, prediction, colours, 0.5, person.instrumentLoading, person.isMouthOpen, this.debug )
				}else{
					// default mode is always blobs
					drawPoints(  canvasContext, pointsPrediction, colours, 3, person.instrumentLoading, this.debug )
				}

			} else if (options.drawNodes) {

				// just blobs
				drawPoints( canvasContext, pointsPrediction, colours, 3, person.instrumentLoading, this.debug )
			
			} else if (options.drawMesh) {

				// just mesh
				drawFaceMesh( canvasContext, prediction, colours, 0.5, person.instrumentLoading, person.isMouthOpen, this.debug )
			}
		}

	
		// drawBoundingBox( boundingBox )

		//console.error("Bounding box", {boundingBox} )

		//const { height,width,xMax,xMin,yMax,yMin} = boundingBox

		// if this is mirrored using the option in the TF model...
		

		// now overlay the mouth
		if (options.drawMouth)
		{	
			// Extract alpha from colour object if present, otherwise use defaults
			const colourAlpha = colours?.a ?? 1
			
			const mouthColours = {
				h:hue,
				s:options.saturation, 
				l:options.luminosity,
				a:colourAlpha * 0.3  // Scale default by colour alpha
			}

			const mouthColoursClosed = {
				h:hue,
				s:options.saturation, 
				l:20,
				a:colourAlpha * 0.6  // Scale default by colour alpha
			}

			const lipColours = {
				h:90,
				s:50, 
				l:50,
				a:colourAlpha * 0.5  // Scale default by colour alpha
			}

			//drawLip( prediction.annotations.lips, {...colour, h:0}, lipPathOuter )
			// drawMouthFromSequence( prediction.annotations.lips, {...colour }, {...colour, a:0.5}, LIP_PATH_OUTER )

			// drawMouthFromSequence( prediction.annotations.lips, {...colour, h:0}, {...colour, h:0}, LIP_PATH_INNER )

			// // Top inner
			// drawLip(prediction.annotations.lips, {...colour, h:270}, 30, 40)

			// fake it till you make it
			// bottom outer lip first
			//drawLip(prediction.annotations.lips, {...colour, h:0}, 1, 9)
		
			//drawLip(prediction.annotations.lips, {...colour, h:0}, 10, 11)
			
			// top outer lip
			//drawLip(prediction.annotations.lips, {...colour, h:90}, 10, 19)

			//drawLip(prediction.annotations.lips, {...colour, h:0}, 10, 11)
			
			// drawMouth(prediction.annotations.lips, {...colour, h:90 }, 0, 9)
			// drawMouth(prediction.annotations.lips, {...colour, h:180 }, 0, 9)
			// drawMouth(prediction.annotations.lips, {...colour, h:270 }, 0, 9)

			// DEBUG
			// drawNodes( annotations.leftEyeSocket[0], annotations.leftEyeSocket[1] )
			// drawNodes( annotations.rightEyeSocket[0], annotations.rightEyeSocket[1] )
			// drawNodes( annotations.headVertical[0], annotations.headVertical[1] )

			// This overlays the mouth and the eyes
			const mouthLandmarks = person.isMouthOpen && person.singing ?
				annotations.innerLip :
				annotations.outerLip
			if (Array.isArray(mouthLandmarks) && mouthLandmarks.length > 0 && person.isMouthOpen && person.singing)
			{
				// Inner
				drawLip( canvasContext, mouthLandmarks, lipColours, mouthColours )
			
				//drawLip(prediction.annotations.lips, {...mouthColours, h:0}, 1, 9)

				// drawMouth(prediction.annotations.lips, {...mouthColours, h:90 }, 0, 9)
				// drawMouth(prediction.annotations.lips, {...mouthColours, h:180 }, 0, 9)
				// drawMouth(prediction.annotations.lips, {...mouthColours, h:270 }, 0, 9)
				
			}else if (Array.isArray(mouthLandmarks) && mouthLandmarks.length > 0){

				// Outer
				drawLip( canvasContext, mouthLandmarks, lipColours, mouthColoursClosed )
		
				// mouth closed or not singing
				// drawLip(prediction.annotations.lips, mouthColoursClosed, 1, 9)
			}
		}

		// draw silhoette if the user is 
		// if you want it to flicker...
		// interacting&& this.counter%2 === 0)
	
		// EYES ===================================================================
		
		// eyes have been closed for X -period of time
		if (person.areEyesClosed)
		{
	

		}else if (options.drawEyes && keypoints.leftEye.length > 0 && keypoints.leftPupil && keypoints.rightEye.length > 0 && keypoints.rightPupil){

			const eyeOptions = {
				// colourful part of the eye
				iris:options.leftEyeIris, 
				// size of the colourful part
				irisRadius:options.irisRadius,
				// holes in the eyes
				pupil:'rgba(0,0,0,0.8)', 
				// size of the hole
				pupilRadius:options.pupilRadius,
				// big white bit of the eyed
				sclera:'white',
				// size of the white bit
				scleraRadius:options.scleraRadius,
				ratio:options.eyeRatio
			}

			// Draw the eyes over the face
			const eyeDirection = prediction.eyeDirection
		
			// FIXME:
			// const irisData = isLeft ? keypoints.leftIris : keypoints.rightIris
			const leftEyeData =  keypoints.leftEye
			const leftPupilData = keypoints.leftPupil
	
			// FIXME:
			// const irisData = isLeft ? keypoints.leftIris : keypoints.rightIris
			const rightEyeData = keypoints.rightEye
			const rightPupilData = keypoints.rightPupil


			drawEye( this.canvasContext, leftEyeData, leftPupilData,  person.isLeftEyeOpen, eyeDirection, eyeOptions)	
			eyeOptions.iris = options.rightEyeIris
			
			drawEye( this.canvasContext, rightEyeData, rightPupilData,  person.isRightEyeOpen, eyeDirection, eyeOptions)

		}else if (options.drawEyebrows && leftEyebrow.length > 0 && rightEyebrow.length > 0){
		
			// FIXME: draw some funky eyebrows!
			drawPart( this.canvasContext , leftEyebrow, 5)
			drawPart( this.canvasContext , rightEyebrow, 5)

			// console.log("EYES", {annotations} )

			// drawShapeByIndexes( annotations.rightEyeLower0, [0,2,8], 0.5, 'red', true, false, true )
			
			
			// drawPart( annotations.rightEyeLower0, 1, 'black', false, false, true )

		//	drawPart( annotations.leftEyeUpper1, 1, 'pink', true, false, false )

			// drawPart( annotations.leftEyeLower1, 1, 'yellow', true )
		//	drawPart( annotations.leftEyeLower2, 1, 'green', true, false, false )
			// drawPart( annotations.leftEyeLower3, 1, 'blue', true )
			// drawPart( annotations.leftEyeLower4, 1, 'orange', true )

			// drawPart( annotations.rightEyeLower1 )
			// drawPart( annotations.rightEyeLower2 )
			// drawPart( annotations.rightEyeLower3 )
			// drawPart( annotations.rightEyeLower4 )

			// console.log("EYES", {rightEyeClosedFor, leftEyeClosedFor, eyesClosedFor, time:prediction.time, rca:this.rightEyeClosedAt, lca:this.leftEyeClosedAt} )
			// if (this.isLeftEyeOpen)
			// {
			// 	drawEye( annotations.leftEyeIris, true, true, eyeOptions)	
			// }else{
			// 	// const leftEyeHeldShut = prediction.time - this.leftEyeClosedAt > options.eyeShutHolddDuration
			// 	drawEye(annotations.leftEyeIris, true, false, { irisRadius:options.eyeRadius} )	
			// }

			// if (this.isRightEyeOpen)
			// {
			// 	drawEye( annotations.rightEyeIris, false, true, {pupil:options.rightEyeIris, irisRadius:options.eyeRadius})
			// }else{
			// 	// const rightEyeHeldShut = prediction.time - this.rightEyeClosedAt > options.eyeShutHolddDuration
			// 	drawEye(annotations.rightEyeIris, false, false ? 'red' : 'green', { irisRadius:options.eyeRadius})
			// }

			// console.log("EYE OPEN", {
			// 	rightEyeClosedFor, 
			// 	leftEyeClosedFor, 
			// 	eyesClosedFor, 
			// 	ro:this.isRightEyeOpen,
			// 	lo:this.isLeftEyeOpen,
			// 	time:prediction.time, 
			// 	rca:this.rightEyeClosedAt, 
			// 	lca:this.leftEyeClosedAt
			// } )
			
		}else{
			// default fails
		}

		// Person drawn to screen
	}
}
