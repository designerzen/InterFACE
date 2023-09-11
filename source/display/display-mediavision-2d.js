import { 
	LEFT_EYE_CONNECTIONS, 
	LEFT_EYE_PATH, 
	LEFT_IRIS_PATH, 
	RIGHT_EYE_PATH,
	RIGHT_IRIS_PATH,

} from "../models/face-landmark-constants"
import { clearCanvas, drawElement } from "../visual/2d"
import { drawInstrument, drawParagraph } from '../visual/2d.text.js'

import { drawEye } from "../visual/2d.eyes"

import { FaceLandmarker, DrawingUtils } from "@mediapipe/tasks-vision"

import { drawBars } from "../visual/spectrograms"
import {hasOffscreenCanvasCapability} from '../capabilities'

import Display2D from "./display-canvas-2d"
import { drawFace } from "../visual/2d.face"

/**
 * Canvas based front end engine
 * new Display2D( document.getElementById('interface') ) // document.querySelector("canvas")
 */
export default class DisplayMediaVision2D extends Display2D{

	worker

	constructor( canvas, initialWidth, initialHeight ){
		super( canvas, initialWidth, initialHeight)
		
		// console.error( "DisplayMediaVision2D", this.canvas, canvas instanceof OffscreenCanvas)
		
		if (this.canvas instanceof OffscreenCanvas)
		{
			const worker = new Worker(new URL('./display-mediavision-2d.worker.js', import.meta.url),
			{type: 'module'})

			worker.postMessage( {command:"initialise", canvas:this.canvas, canvasContext:this.canvasContext }, [this.canvas] )
			this.worker = worker

		}else{

			this.drawingUtils = new DrawingUtils(this.canvasContext)
		}
	}

	/**
	 * 
	 * @param {Person} person 
	 */
	drawPerson( person, beatJustPlayed, colours ) {
		drawFace( this.canvasContext, person, beatJustPlayed, colours, this.drawingUtils, FaceLandmarker )
		// draw eyes!
	}

	/**
	 * TODO:
	 * @param {Array} eyeData 
	 * @param {Object} pupilData 
	 * @param {Boolean} isEyeOpen 
	 * @param {Number} eyeDirection 
	 * @param {Object} eyeOptions 
	 */
	drawEye(eyeData, pupilData, isEyeOpen, eyeDirection, eyeOptions){
		
		if (this.worker)
		{
			// this.worker.onmessage( message=>{
				// FaceLandmarker
			// })
			this.worker.postMessage({ 
				command:"drawEye",
				pupilData, isEyeOpen, eyeDirection, eyeOptions
			})

		}else{

			// FIXME: size of eyes!
			pupilData.diameter = 20
			drawEye( this.canvasContext, eyeData, pupilData, isEyeOpen, eyeDirection, eyeOptions)	
			//drawEye( annotations, true, person.isLeftEyeOpen, eyeDirection, eyeOptions)	
		}
	

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
}