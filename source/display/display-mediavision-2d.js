import { 
	LEFT_EYE_CONNECTIONS, 
	LEFT_EYE_PATH, 
	LEFT_IRIS_PATH, 
	RIGHT_EYE_PATH,
	RIGHT_IRIS_PATH,

} from "../models/face-landmark-constants"
import { drawEye } from "../visual/2d.eyes"

import { AbstractDisplay } from "./display-abstract"
import { FaceLandmarker, DrawingUtils } from "@mediapipe/tasks-vision"


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

/**
 * Canvas based front end engine
 * new Display2D( document.getElementById('interface') ) // document.querySelector("canvas")
 */
export class DisplayMediaVision2D extends AbstractDisplay{

	canvasContext

	constructor( canvas, initialWidth, initialHeight ){
		super(canvas, initialWidth, initialHeight)
		this.canvasContext = canvas.getContext('2d')
		this.drawingUtils = new DrawingUtils(this.canvasContext)
		this.available = true
	}

	/**
	 * Empty the canvas and paint it transparent
	 */
	clear() {
		// this.canvasContext.fillStyle = 'rgba(255,0,0,0)'
		this.canvasContext.clearRect(0, 0, this.width, this.height)
		// this.canvasContext.fillRect(0, 0, width, height)
		// this.canvasContext.restore()
	}

	/**
	 * Paints an existing element onto our display
	 * Used to paint a video frame to the canvas
	 * @param {HTMLElement} element - video / image
	 * @param {Number} x - default to 0
	 * @param {Number} y - default to 0
	 * @param {Boolean} flip - default to true
	 */
	drawElement( element, x=0, y=0, flip=true){	
		this.canvasContext.save()
		// invert horizontally (mirror image)
		if (flip)
		{
			this.canvasContext.translate(this.width, 0)
			this.canvasContext.scale(-1, 1)
		}
		this.canvasContext.drawImage(element , x, y)
		this.canvasContext.restore()
	}

	/**
	 * 
	 * @param {Person} person 
	 */
	drawPerson( person, beatJustPlayed, colours ){

		const prediction = person.data
		const landmarks = prediction.faceLandmarks
		const options = person.options
		const flipped = options.flipped

		// const hue = person.hue
		// const saturation = person.saturation
		// const luminosity = person.luminosity

		// generic face colour
		const col = person.hsla

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
						this.drawingUtils.drawConnectors(
							landmarks,
							FaceLandmarker.FACE_LANDMARKS_TESSELATION,
							{ color: person.hsl, lineWidth: 1 }
						)
						
					} else if(person.isMouthOpen) {

						this.drawingUtils.drawConnectors(
							landmarks,
							FaceLandmarker.FACE_LANDMARKS_TESSELATION,
							{ color: person.hsl, lineWidth: 2 }
						)
					}

				}else{
					faceOvalStyle.fillColor = person.hsl
					this.drawingUtils.drawConnectors(
						landmarks,
						FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
						faceOvalStyle
					)
				}

			} else if (options.drawNodes) {

				// just blobs
				blobStyle.color = col
				blobStyle.fillColor = col

				// drawPoints( prediction, colours, 3, person.instrumentLoading, this.debug )
				this.drawingUtils.drawLandmarks(
					landmarks,
					blobStyle
				)
			
			} else if (options.drawMesh) {

			// just mesh
				this.drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_TESSELATION,
					{ color: col, lineWidth: 1 }
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
			const mouthColours = {
				h:col,
				s:options.saturation, 
				l:options.luminosity,
				a:1
			}

			const mouthColoursClosed = {
				h:col,
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

			// This overlays the mouth and the eyes
			if (person.isMouthOpen && person.singing)
			{
				// Inner
				// drawLip( annotations.innerLip, lipColours, mouthColours )
				this.drawingUtils.drawConnectors(
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
				this.drawingUtils.drawConnectors(
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

				scaleX:this.width,
				scaleY:this.height,
			}

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
		
			this.drawEye( leftEyeData, leftPupilData, person.isLeftEyeOpen, eyeDirection, eyeOptions)	
		
			eyeOptions.iris = options.rightEyeIris
		
			this.drawEye( rightEyeData, rightPupilData, person.isRightEyeOpen, eyeDirection, eyeOptions)
		}
		
		if (options.drawEyebrows){

			eyeBrowStyle.color = col
			eyeBrowStyle.fillColor = options.leftEyebrow

			// FIXME: draw some funky eyebrows!
			this.drawingUtils.drawConnectors(
				landmarks,
				FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
				eyeBrowStyle
			)

			eyeBrowStyle.fillColor = options.rightEyebrow

			this.drawingUtils.drawConnectors(
				landmarks,
				FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
				eyeBrowStyle
			)

		}else{
			// default fails
		}

		// Person drawn to screen
	}


	// TODO:
	drawEye(eyeData, pupilData, isEyeOpen, eyeDirection, eyeOptions){
		// FIXME: size of eyes!
		pupilData.diameter = 20
		drawEye( this.canvasContext, eyeData, pupilData, isEyeOpen, eyeDirection, eyeOptions)	
		//drawEye( annotations, true, person.isLeftEyeOpen, eyeDirection, eyeOptions)	
		// this.drawingUtils.drawConnectors(
		// 	landmarks,
		// 	FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
		// 	{ color: "#55555570", lineWidth: 3 }
		// )
		// this.drawingUtils.drawConnectors(
		// 	landmarks,
		// 	FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
		// 	{ color: "#FF000070", lineWidth: 3 }
		// )
	}
	
	/**
	 * Overwrite the existing canvas with the same one but
	 * positioned at a specific offset to make it look cool
	 * @param {Number} offsetX 
	 * @param {Number} offsetY 
	 */
	overdraw( offsetX=0, offsetY=-1) {
		
		// this.canvasContext.save()
		
		//this.canvasContext.translate(0, -1)
		this.canvasContext.drawImage( this.canvas,offsetX,offsetY )
		// for (var i = 0; i < numImages; i++) {
		// 	this.canvasContext.drawImage(img, i * img.width, 0);
		// }

		// this.canvasContext.restore()
	}

	/**
	 * converts the canvas into a PNG / JPEG and adds returns as a blob?
	 * @param {String} type 
	 * @returns Blob
	 */
	takePhotograph(type="image/png"){
		// TODO: reassemble canvas with logo and stuff?
		return this.canvas.toDataURL(type)
	}
}
