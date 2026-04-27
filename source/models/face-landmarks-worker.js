/**
 * Needs to be compiled into ES5 :(
 * 
 * Follows interface
 * 
 * Uses 
 * MediaPipe Vision by Google
 * https://developers.google.com/mediapipe/solutions/vision/face_landmarker/web_js
 */

// import { enhancePrediction } from './face-model'
// import { now } from '../timing/timing'

let detector

let lastVideoTime = 0 

// 	if (runningMode === "IMAGE") {
// 	runningMode = "VIDEO";
// 	await faceLandmarker.setOptions({ runningMode: runningMode });
//   }

const predict = async (inputElement, time) => {

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
		// `time` is sub-ms ms passed in from the main thread (AudioTimer.now),
		// kept in the same time domain as face-landmarks.js. Workers can't use
		// performance.now() reliably (origin differs from the main thread).
		// Scale to microseconds, MediaPipe's internal time unit, so successive
		// frames are always strictly-increasing.
		const timestampUs = time * 1000
		lastVideoTime = inputElement.currentTime
		results = detector.detectForVideo(inputElement, timestampUs)
	}

	// if (results.faceLandmarks) {
	// 	console.error("results.faceLandmarks", results.faceLandmarks )
	// }

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
			await predict( data.inputElement, data.time )
			postMessage( "predict" )
			break

        case "load":
			detector = data.detector
			console.warn("FaceLandmarkerWorker", { data, transferables, detector})
			postMessage( "loaded" )
			break


		// create prediction and freak out!
		default:
			// magic tricks...
			const prediction = await predict(transferables, data?.time)
			postMessage( prediction )
    }
}
