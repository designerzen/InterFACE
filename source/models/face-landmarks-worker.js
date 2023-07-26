/**
 * Needs to be compiled into ES5 :(
 * 
 * Follows interface
 * 
 * Uses 
 * MediaPipe Vision by Google
 * https://developers.google.com/mediapipe/solutions/vision/face_landmarker/web_js
 */

const FACE_LANDMARK_WASM =  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
//const FACE_LANDMARK_TASK = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"

// import { FaceLandmarker, FilesetResolver } from "/node_modules/@mediapipe/tasks-vision/vision_bundle.cjs"
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

// import { enhancePrediction } from './face-model'
// import { now } from '../timing/timing'

let detector

let lastVideoTime = 0 

// 	if (runningMode === "IMAGE") {
// 	runningMode = "VIDEO";
// 	await faceLandmarker.setOptions({ runningMode: runningMode });
//   }

const predict = async (inputElement ) => {

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
		const nowInMs = Date.now()
		lastVideoTime = inputElement.currentTime
		results = detector.detectForVideo(inputElement, lastVideoTime)
	}

	if (results.faceLandmarks) {
		console.error("results.faceLandmarks", results.faceLandmarks )
	}

	return results
}


// input prediction
// output prediction & ...object updates

// Pass prediction into the worker
// TODO: pass PREDICTIONS
self.onmessage = async (e, transferables) => {

    const data = e.data
		
    switch (data.command)
    {
		case "predict":
			console.warn("FaceLandmarkerWorker:predict", {e,data, transferables, detector})
			
			await predict( data.inputElement )
			postMessage( "predict" )
			break

        case "load":
			const { faceLandmarkerOptions } = data
			const filesetResolver = await FilesetResolver.forVisionTasks( FACE_LANDMARK_WASM )
			detector = await FaceLandmarker.createFromOptions( filesetResolver, faceLandmarkerOptions	)
	
			console.warn("FaceLandmarkerWorker", {e,data, transferables, detector})
	
			postMessage( "loaded" )
			break


		// create prediction and freak out!
		default:
			// magic tricks...
			const prediction = await predict(transferables) 
			postMessage( prediction )
    }
}
