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
// import FACE_LANDMARK_TASK from "url:./face_landmarker.task"

const FACE_LANDMARK_WASM = "./@mediapipe/tasks-vision/wasm"
// import FACE_LANDMARK_WASM from "./@mediapipe/tasks-vision/wasm"
// import FACE_LANDMARK_WASM from "url:@mediapipe/tasks-vision/wasm/"
// import * as WASM from "@mediapipe/tasks-vision/wasm/vision_wasm_internal"


import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"
import { enhanceFaceLandmarksModelPrediction } from './face-landmarks-calculations'
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

const setOptions = async (options) => {
	if (useWorker)
	{
		faceLandmarksWorker.postMessage(
			{command:"setOptions", options }, 
		)
	}else{
		await faceLandmarker.setOptions( options )
	}
}

let previousPrediction = []

/**
 * Send an input element and determine how the faces look within
 * @param {HTMLElement} inputElement 
 * @param {*} detector 
 * @param {Boolean} flipHorizontally 
 * @returns 
 */
const predict = async (inputElement,detector, flipHorizontally=true ) => {

	// const radio = inputElement.videoHeight / inputElement.videoWidth
	// TODO: Resize video if too large
	// video.style.width = videoWidth + "px"
	// video.style.height = videoWidth * radio + "px"
	// canvasElement.style.width = videoWidth + "px"
	// canvasElement.style.height = videoWidth * radio + "px"
	// canvasElement.width = video.videoWidth
	// canvasElement.height = video.videoHeight

	if (lastVideoTime !== inputElement.currentTime) 
	{
		lastVideoTime = inputElement.currentTime
		const results = detector.detectForVideo(inputElement, Date.now() )
		// results = detector.detectForVideo(inputElement, lastVideoTime)
		const people = []

		// array
		if (results.faceLandmarks) 
		{
			const faceQuantity = results.faceLandmarks.length
		
			for (let i=0; i < faceQuantity; ++i )
			{
				const faceLandmarks = results.faceLandmarks[i]
				const faceBlendshapes = results.faceBlendshapes[i]
				const faceMatrix = results.facialTransformationMatrixes[i]
				
				// 	 drawingUtils.drawConnectors(
				//     landmarks,
				//     FaceLandmarker.FACE_LANDMARKS_TESSELATION,
				//     { color: "#C0C0C070", lineWidth: 1 }
				//   );
				
				if (!useWorker)	
				{
					// direct (no worker)
					people[i] = enhanceFaceLandmarksModelPrediction( faceLandmarks, faceBlendshapes, faceMatrix, lastVideoTime, flipHorizontally )
				}else{
					// using async worker (any faster?)
					// results.faceLandmarks[i] = await makePrediction( { keypoints:faceLandmarks }, lastVideoTime, flipHorizontally )
				}
			}

			
			// console.error("Person", results)

			previousPrediction = people
			return people
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
	let detector

	const faceLandmarkerOptions ={
		baseOptions: {
			modelAssetPath: '/face_landmarker.task',
			delegate: "GPU"
		},
		// override defaults
		...options
	}

	progressCallback && progressCallback( startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loading Brains")

	if (useWorker)
	{
		const connectToWorker = async () => {
			// request it to load all the required data...
			function handleMessageFromWorker(msg) {
				faceLandmarksWorker.removeEventListener("error", handleMessageFromWorker)
				faceLandmarksWorker.removeEventListener("message", handleMessageFromWorker)
				console.warn("Worker connected to App")
				return true
			}
			
			faceLandmarksWorker.addEventListener("error", handleMessageFromWorker)
			faceLandmarksWorker.addEventListener("message", handleMessageFromWorker)
			faceLandmarksWorker.postMessage(
				{command:"load", faceLandmarkerOptions}
			)	
		}
			
		// FIXME: Loading this as a module prevents the vision task working
		// faceWorker = new Worker( faceLandmarkerWorker )

		// faceLandmarksWorker = new Worker( new URL('./face-landmarks-worker.js', import.meta.url) )
		// faceLandmarksWorker = new Worker( new URL('data-url:./face-landmarks-worker.js', import.meta.url), {type:'module'} )
		// faceLandmarksWorker = new Worker(
		// 	new URL('./face-landmarks-worker.js', import.meta.url), 
		// 	{type:'module'} 
		// )
		
		faceLandmarksWorker = new Worker( new URL('./face-landmarks-worker.js'))
		
		progressCallback && progressCallback( startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loading Brains")
		
		await connectToWorker()

		progressCallback && progressCallback( startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loading Brains")
	
		const update = async (repeat, callback, isPaused=null) => {
		
			faceLandmarksWorker.addEventListener("message", (e)=>{
				callback(e.data)	
				// loop or use worker???
				if (repeat)
				{
					requestAnimationFrame( () => update(repeat, callback, isPaused) )
				}
			}, {once:true})
			
			faceLandmarksWorker.postMessage(
				{command:"predict", callback},
				flipHorizontally,
				[inputElement]
			)
		}

		return update
	
	}else{

		const filesetResolver = await FilesetResolver.forVisionTasks( FACE_LANDMARK_WASM )
		progressCallback && progressCallback( startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loading Eyes")
		
		const detector = await FaceLandmarker.createFromOptions( filesetResolver, faceLandmarkerOptions )
	
		progressCallback && progressCallback( startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loading Brains")
			
		// now subscribe to events and monitor
		const update = async (repeat, callback, isPaused=null) => { 

			const shouldUpdate = isPaused ? isPaused() : true

			// console.log("shouldUpdate", shouldUpdate, {isPaused})
			// console.log("Combining TF model", model, "with element", inputElement, "..." )
			if (shouldUpdate)
			{
				const prediction = await predict(inputElement, detector, flipHorizontally) 
				
				// enhance prediction to create our model...
				// console.error("results.prediction", {prediction} )
		
				callback( prediction )
			}
			
			// loop or use worker???
			if (repeat)
			{
				requestAnimationFrame( () => update(repeat, callback, isPaused) )
			}
		}

		return update
	}
}
