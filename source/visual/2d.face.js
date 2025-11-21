import { LEFT_EYE_PATH, LEFT_IRIS_PATH, RIGHT_EYE_PATH, RIGHT_IRIS_PATH } from "../models/face-landmark-constants"
import { drawEye } from "./2d.eyes"

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

const eyeBrowStyle = { 
	color: "#FF000070", 
	/**
	 * The color that is used to fill the shape. Defaults to `.color` (or black
	 * if color is not set).
	 * string | CanvasGradient | CanvasPattern | Callback<LandmarkData, string | CanvasGradient | CanvasPattern>;
	 */
	fillColor: "hsls(90,50%,50%, 0.5)",

	lineWidth: 1 
}


export const drawFace = ( canvasContext, person, beatJustPlayed, colours, drawingUtils, FaceLandmarker ) => {

	// const isSelected = person.isSelected
	const prediction = person.data
	const landmarks = prediction.faceLandmarks
	const options = person.options
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
						{ color, lineWidth: 1 }
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
				landmarks,
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


	// drawBoundingBox( boundingBox )

	//console.error("Bounding box", {boundingBox} )

	//const { height,width,xMax,xMin,yMax,yMin} = boundingBox

	// if this is mirrored using the option in the TF model...

	// now overlay the mouth
	if (options.drawMouth)
	{	
		/*
		const mouthColours = {
			h:color,
			s:options.saturation, 
			l:options.luminosity,
			a:1
		}

		const mouthColoursClosed = {
			h:color,
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
			*/

		// console.info( "Person drawMouth",person, {options}, person.isMouthOpen, person.singing )
		// This overlays the mouth and the eyes
		if (person.isMouthOpen && person.singing)
		{
			// Inner
			// drawLip( annotations.innerLip, lipColours, mouthColours )
			drawingUtils.drawConnectors(
				landmarks,
				FaceLandmarker.FACE_LANDMARKS_LIPS,
				{ 
					color:options.mouth,
					lineWidth: 3
				}
			)
			
		}else{

			// Outer
			// drawLip( annotations.outerLip, lipColours, mouthColoursClosed )
			drawingUtils.drawConnectors(
				landmarks,
				FaceLandmarker.FACE_LANDMARKS_LIPS,
				{ 
					color:options.mouthClosed,
					lineWidth: 1 
				}
			)
			// mouth closed or not singing
			// drawLip(prediction.annotations.lips, mouthColoursClosed, 1, 9)
		}
	}else{
		console.info( "Person SKIP drawMouth",person, {options}, person.isMouthOpen, person.singing )
		
	}

	// draw silhoette if the user is 
	// if you want it to flicker...
	// interacting&& this.counter%2 === 0)

	// EYES ===================================================================
	
	// eyes have been closed for X -period of time
	if (person.areEyesClosed)
	{
		// Draw eyes closed?
		
	}else if (options.drawEyes){

		const eyeOptions = {
			// colourful part of the eye
			iris:options.leftEyeIris, 
			// size of the colourful part
			irisRadius:options.irisRadius,
			// holes in the eyes
			pupil:options.pupil, 
			// size of the hole
			pupilRadius:options.pupilRadius,
			// big white bit of the eyed
			sclera:'white',
			// size of the white bit
			scleraRadius:options.scleraRadius,
			ratio:options.eyeRatio,
			outline:false,

			scaleX:canvasContext.canvas.width,
			scaleY:canvasContext.canvas.height,
		}

		// EYES

		const leftEyeData = LEFT_EYE_PATH.map( (connection,i) => landmarks[connection] )
		// fetch group of keyframes that represent eyes...
		// const leftEyeData =  landmarks.slice( FaceLandmarker.FACE_LANDMARKS_LEFT_EYE.start, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE.end )
		// const leftPupilData = LEFT_IRIS_PATH.map( (connection,i) => landmarks[connection] )
		const leftPupilData = landmarks[LEFT_IRIS_PATH[0]]
		
		// FIXME:
		// const irisData = isLeft ? keypoints.leftIris : keypoints.rightIris
		const rightEyeData = RIGHT_EYE_PATH.map( (connection,i) => landmarks[connection] )
		
		//const rightEyeData = landmarks.slice( FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE.start, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE.end )
		// const rightPupilData = RIGHT_IRIS_PATH.map( (connection,i) => landmarks[connection] )
		const rightPupilData = landmarks[RIGHT_IRIS_PATH[0]]
		
		// console.error( "FaceLandmarker", FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, {leftEyeData,leftPupilData})

		// Draw the eyes over the face
		const eyeDirection = prediction.eyeDirection
	
		drawEye( canvasContext, leftEyeData, leftPupilData, person.isLeftEyeOpen, eyeDirection, eyeOptions)	
	
		eyeOptions.iris = options.rightEyeIris
	
		drawEye( canvasContext, rightEyeData, rightPupilData, person.isRightEyeOpen, eyeDirection, eyeOptions)
	}
	
	if (options.drawEyebrows){

		eyeBrowStyle.color = color
		eyeBrowStyle.fillColor = options.leftEyebrow

		// FIXME: draw some funky eyebrows!
		drawingUtils.drawConnectors(
			landmarks,
			FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
			eyeBrowStyle
		)

		eyeBrowStyle.fillColor = options.rightEyebrow

		drawingUtils.drawConnectors(
			landmarks,
			FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
			eyeBrowStyle
		)

	}else{
		// default fails
	}

	// Person drawn to screen
}