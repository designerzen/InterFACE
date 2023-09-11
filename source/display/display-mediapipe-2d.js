import AbstractDisplay from "./display-abstract"
import { drawFaceMesh, drawPart, drawPoints } from "../visual/2d"
import { drawEye } from "../visual/2d.eyes"
import { drawLip } from "../visual/2d.mouth"
import { drawBars } from "../visual/spectrograms"

/**
 * Canvas based front end engine for Tensor flow @media pipe
 * new Display2D( document.getElementById('interface') ) // document.querySelector("canvas")
 */
export default class DisplayMediaPipe2D extends Display2D{

	constructor( canvas, initialWidth, initialHeight ){
		super(canvas, initialWidth, initialHeight)
	}

	/**
	 * 
	 * @param {Person} person 
	 */
	drawPerson( person, beatJustPlayed, colours ){

		const prediction = person.data
		const options = person.options
		const hue = person.hue
		const canvasContext = this.canvasContext

		console.log("drawPerson", person, {hue, options, colours} )

		if (!forceRefresh && !prediction && !person.isPlayingBack)
		{
			// nothing to (re)draw so exit here
			return
		}

		// FIXME:
		// if (person.isMouseDown)
		// {
		// 	drawMousePressure( person.mouseHoldProgress, options.mouseHoldDuration )
		// }

		
		// let's draw our face


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
					drawPoints(  canvasContext, prediction, colours, 3, person.instrumentLoading, this.debug )
				}

			} else if (options.drawNodes) {

				// just blobs
				drawPoints( canvasContext, prediction, colours, 3, person.instrumentLoading, this.debug )
			
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
			const mouthColours = {
				h:hue,
				s:options.saturation, 
				l:options.luminosity,
				a:1
			}

			const mouthColoursClosed = {
				h:hue,
				s:options.saturation, 
				l:20,
				a:1
			}

			const lipColours = {
				h:90,
				s:50, 
				l:50,
				a:1
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
			if (person.isMouthOpen && person.singing)
			{
				// Inner
				drawLip( canvasContext, annotations.innerLip, lipColours, mouthColours )
			
				//drawLip(prediction.annotations.lips, {...mouthColours, h:0}, 1, 9)

				// drawMouth(prediction.annotations.lips, {...mouthColours, h:90 }, 0, 9)
				// drawMouth(prediction.annotations.lips, {...mouthColours, h:180 }, 0, 9)
				// drawMouth(prediction.annotations.lips, {...mouthColours, h:270 }, 0, 9)
				
			}else{

				// Outer
				drawLip( canvasContext, annotations.outerLip, lipColours, mouthColoursClosed )
		
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
	

		}else if (options.drawEyes){

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

		}else if (options.drawEyebrows){
		
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
