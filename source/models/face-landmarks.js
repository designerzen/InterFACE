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
// import BLAZE_FACE_SHORT_RANGE_MODEL_PATH from "url:./tasks/blaze_face_short_range.tflite"
// import FACE_LANDMARK_WORKER from "worker:./face-landmarks-worker.js"

const FACE_LANDMARK_WASM = "./@mediapipe/tasks-vision/wasm"
// import FACE_LANDMARK_WASM from "./@mediapipe/tasks-vision/wasm"
// import FACE_LANDMARK_WASM from "url:@mediapipe/tasks-vision/wasm/"
// import * as WASM from "@mediapipe/tasks-vision/wasm/vision_wasm_internal"

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"
import { enhanceFaceLandmarksModelPrediction } from './face-landmarks-calculations'

// This flips to using a seperate thread for the 
// prediction calculations - dunno if it makes it quicker
// but it certainly uses more CPU which then shonks audio
const useWorker = false

// inline 
let faceLandmarker 
let faceLandmarkerPromise
// via worker... preferred but requires re-render
let faceLandmarksWorker 
let lastVideoTime = 0 
let lastDetectionTime = -Infinity

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

// Downscale high-resolution video streams (e.g. 1080p/4K) before MediaPipe
// inference. FaceLandmarker internally resizes to <=256px and outputs normalized
// [0..1] coordinates, so uploading 1920x1080 pixels via texImage2D / glReadPixels
// wastes GPU bandwidth and main-thread time with no accuracy gain.
const MAX_INFERENCE_WIDTH = 640

let inferenceCanvas = null
let inferenceContext = null

const getInferenceSource = inputElement => {
	const width = inputElement?.videoWidth || inputElement?.naturalWidth || inputElement?.width || 0
	const height = inputElement?.videoHeight || inputElement?.naturalHeight || inputElement?.height || 0
	if (!width || !height || width <= MAX_INFERENCE_WIDTH || typeof document === 'undefined') {
		return { source: inputElement, width, height }
	}
	const scale = MAX_INFERENCE_WIDTH / width
	const targetWidth = MAX_INFERENCE_WIDTH
	const targetHeight = Math.max(2, Math.round(height * scale) & ~1)
	if (!inferenceCanvas) {
		inferenceCanvas = document.createElement('canvas')
		inferenceContext = inferenceCanvas.getContext('2d', { alpha: false, desynchronized: true })
	}
	if (!inferenceContext) {
		return { source: inputElement, width, height }
	}
	if (inferenceCanvas.width !== targetWidth || inferenceCanvas.height !== targetHeight) {
		inferenceCanvas.width = targetWidth
		inferenceCanvas.height = targetHeight
	}
	inferenceContext.drawImage(inputElement, 0, 0, targetWidth, targetHeight)
	return { source: inferenceCanvas, width: targetWidth, height: targetHeight }
}

const isInputElementReady = inputElement => {
	if (!inputElement) return false
	if (typeof inputElement.readyState === 'number' && inputElement.readyState < 2) return false
	if (typeof inputElement.videoWidth === 'number' && typeof inputElement.videoHeight === 'number') {
		return inputElement.videoWidth > 0 && inputElement.videoHeight > 0
	}
	if (typeof inputElement.naturalWidth === 'number' && typeof inputElement.naturalHeight === 'number') {
		return inputElement.naturalWidth > 0 && inputElement.naturalHeight > 0
	}
	return true
}

/**
 * Send an input element and determine how the faces look within
 * @param {HTMLElement} inputElement 
 * @param {*} detector 
 * @param {Boolean} flipHorizontally 
 * @returns 
 */
const predict = async (time, inputElement, detector, flipHorizontally=true, metrics=null ) => {
	if (metrics) {
		metrics.didRun = false
		metrics.inferenceMs = 0
		metrics.faceCalcMs = 0
	}

	if (!isInputElementReady(inputElement))
	{
		return previousPrediction
	}

	// video has been updated!
	if (lastVideoTime !== inputElement.currentTime) 
	{
		lastVideoTime = inputElement.currentTime

		const prepared = getInferenceSource(inputElement)
		if (!prepared) return previousPrediction

		// The public API takes milliseconds and converts to microseconds itself.
		// Clocks may have reduced precision, so explicitly handle equal readings.
		const timestampMs = Math.max(performance.now(), lastDetectionTime + 0.001)
		lastDetectionTime = timestampMs
		const detectStartedAt = performance.now()
		const results = detector.detectForVideo( prepared.source, timestampMs )
		const detectEndedAt = performance.now()
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

			if (metrics) {
				metrics.didRun = true
				metrics.inferenceMs = detectEndedAt - detectStartedAt
				metrics.faceCalcMs = performance.now() - detectEndedAt
				metrics.inferenceWidth = prepared.width
				metrics.inferenceHeight = prepared.height
			}

			previousPrediction = people
			return people

		}	else{
			// duplicate frame
			if (metrics) {
				metrics.didRun = true
				metrics.inferenceMs = detectEndedAt - detectStartedAt
				metrics.inferenceWidth = prepared.width
				metrics.inferenceHeight = prepared.height
			}
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
		// override defaults
		...options,
		baseOptions: {
			// this needs to be absolute yet relative :/
			// modelAssetPath: BLAZE_FACE_SHORT_RANGE_MODEL_PATH,
			modelAssetPath: FACE_LANDMARK_TASK,
			delegate: "GPU"
		}
	}

	progressCallback && progressCallback( startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loading Brains")
	
	// MediaPipe owns a sizeable WASM heap and copies the task model into its
	// virtual filesystem. Keep initialization single-flight so repeated or
	// concurrent application startup cannot allocate a second runtime/model.
	if (!faceLandmarkerPromise)
	{
		faceLandmarkerPromise = (async () => {
			const filesetResolver = await FilesetResolver.forVisionTasks(FACE_LANDMARK_WASM)
			progressCallback && progressCallback(startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loading Eyes")
			return FaceLandmarker.createFromOptions(filesetResolver, faceLandmarkerOptions)
		})().catch(error => {
			// Permit a later retry after a genuine initialization failure.
			faceLandmarkerPromise = undefined
			throw error
		})
	}

	const detector = await faceLandmarkerPromise
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
	const lastMetrics = {
		didRun: false,
		inferenceMs: 0,
		faceCalcMs: 0,
		inferenceWidth: 0,
		inferenceHeight: 0,
	}
	const fetchModelData = async (time) => { 
		const prediction = await predict(time, inputElement, detector, flipHorizontally, lastMetrics) 
		return prediction
	}
	fetchModelData.lastMetrics = lastMetrics

	return fetchModelData
}
