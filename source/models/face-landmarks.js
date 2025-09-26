/**
 * 
 * Follows interface
 * 
 * Uses 
 * MediaPipe Vision by Google
 * https://developers.google.com/mediapipe/solutions/vision/face_landmarker/web_js
 * 
 */

// const FACE_LANDMARK_WASM =  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
//const FACE_LANDMARK_TASK = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
import FACE_LANDMARK_TASK from "url:./tasks/face_landmarker.task"
import BLAZE_FACE_SHORT_RANGE_MODEL_PATH from "url:./tasks/blaze_face_short_range.tflite"
// import FACE_LANDMARK_WORKER from "worker:./face-landmarks-worker.js"

const FACE_LANDMARK_WASM = "./@mediapipe/tasks-vision/wasm"
// import FACE_LANDMARK_WASM from "./@mediapipe/tasks-vision/wasm"
// import FACE_LANDMARK_WASM from "url:@mediapipe/tasks-vision/wasm/"
// import * as WASM from "@mediapipe/tasks-vision/wasm/vision_wasm_internal"

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"
import { enhanceFaceLandmarksModelPrediction } from './face-landmarks-calculations'
import { now } from "../timing/timing"
// import { now } from '../timing/timing'

// This flips to using a seperate thread for the 
// prediction calculations - dunno if it makes it quicker
// but it certainly uses more CPU which then shonks audio
const useWorker = false

// inline 
let faceLandmarker 
// via worker... preferred but requires re-render
let faceLandmarksWorker 
let lastVideoTime = 0 

let previousPrediction = []

/**
 * Defer the options to the ML
 * @param {Object} options 
 */
export const setFaceLandmarkerOptions = async (options) => {
	if (faceLandmarker)
	{
		await faceLandmarker.setOptions( options )
	}else{
		throw Error("No Face Landmarker located")
	}
}


const getWorkerEnhancedPrediction = (prediction) => new Promise( (resolve,reject) => {
	faceLandmarksWorker.onmessage = (e) => {
		resolve( e.data )
	}
	faceLandmarksWorker.postMessage(prediction)
})

/**
 * Send an input element and determine how the faces look within
 * @param {HTMLElement} inputElement 
 * @param {*} detector 
 * @param {Boolean} flipHorizontally 
 * @returns 
 */
const predict = async (inputElement, detector, flipHorizontally=true ) => {

	// const radio = inputElement.videoHeight / inputElement.videoWidth
	// TODO: Resize video if too large
	// video.style.width = videoWidth + "px"
	// video.style.height = videoWidth * radio + "px"
	// canvasElement.style.width = videoWidth + "px"
	// canvasElement.style.height = videoWidth * radio + "px"
	// canvasElement.width = video.videoWidth
	// canvasElement.height = video.videoHeight

	// video has been updated!
	if (lastVideoTime !== inputElement.currentTime) 
	{
		const time = now()
		lastVideoTime = inputElement.currentTime
		const elapsed = time - lastVideoTime
		const results = detector.detectForVideo( inputElement, time )

		// results = detector.detectForVideo(inputElement, lastVideoTime)
		const people = []

		// console.warn("Prediction:RESULTS", results )

		// array
		if (results.faceLandmarks) 
		{
			const faceQuantity = results.faceLandmarks.length
		
			for (let i=0; i < faceQuantity; ++i )
			{
				const faceLandmarks = results.faceLandmarks[i]
				const faceBlendshapes = results.faceBlendshapes[i]
				const faceMatrix = results.facialTransformationMatrixes[i]
				
				if (!useWorker)	
				{	
					// direct (no worker)
					people[i] = enhanceFaceLandmarksModelPrediction( faceLandmarks, faceBlendshapes, faceMatrix, lastVideoTime, flipHorizontally )
				}else{
					// using async worker (is it any faster?)
					const personData = await getWorkerEnhancedPrediction( {faceLandmarks, faceBlendshapes, facialTransformationMatrixes:faceMatrix, time:lastVideoTime, flipHorizontally} )
					people[i] = personData
				}
			}

			// console.error("Person", people)
			// console.info("Prediction Person", elapsed,{ results, people  } )

			previousPrediction = people
			return people

		}	else{
			// duplicate frame
		}
		
	}else{
		// no people
		// console.error("GHOST", results)
	}

	return previousPrediction
}


/**
 * Before we can use Landmarker class we must wait for it to finish
 * loading. Machine Learning models can be large and take a moment to
 * get everything needed to run.
 * NB. This is the second steps that are loaded and take about 1/3 of the time
 * @param {HTMLElement} inputElement 
 * @param {Object} options 
 * @param {Function} progressCallback 
 * @param {Boolean} flipHorizontally - should we flip the x direction of the model? 
 * @returns Function to cause update
 */
export const loadFaceLandmarksModel = async (inputElement, options, progressCallback, flipHorizontally=true) => {
	
	const startLoadProgress = 0.5
	const loadRange = 0.3
	const loadTotal = useWorker ? 3 : 2
	let loadIndex = 0
	
	const faceLandmarkerOptions ={
		baseOptions: {
			// this needs to be absolute yet relative :/
			// modelAssetPath: BLAZE_FACE_SHORT_RANGE_MODEL_PATH,
			modelAssetPath: FACE_LANDMARK_TASK,
			delegate: "GPU"
		},
		// override defaults
		...options
	}

	progressCallback && progressCallback( startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loading Brains")
	
	const filesetResolver = await FilesetResolver.forVisionTasks( FACE_LANDMARK_WASM )
	progressCallback && progressCallback( startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loading Eyes")
	
	const detector = await FaceLandmarker.createFromOptions( filesetResolver, faceLandmarkerOptions )
	// direct blazeface
	// const detector = await FaceDetector.createFromModelPath(vision, BLAZE_FACE_SHORT_RANGE_MODEL_PATH)

	faceLandmarker = detector
	
	if (useWorker)
	{
		faceLandmarksWorker = new Worker(
			new URL('./face-landmarks-calculations-worker.js', import.meta.url), 
			{type:'module'} 
		)
		
		progressCallback && progressCallback( startLoadProgress + loadRange * (loadIndex++/loadTotal), "Installing Brains")
	
	}else{

		progressCallback && progressCallback( startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loading Brains")		
	}

	// now subscribe to events and monitor
	const fetchModelData = async () => { 
		// enhance prediction to create our model...
		const prediction = await predict(inputElement, detector, flipHorizontally) 
		// console.error("results.prediction", {prediction} )
		return prediction
	}

	return fetchModelData
}
