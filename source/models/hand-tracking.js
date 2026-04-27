import { GestureRecognizer, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision"

// Models
import HAND_LANDMARK_TASK from "url:./tasks/hand_landmarker.task"
import GESTURE_RECOGNIZER_TASK from "url:./tasks/gesture_recognizer.task"

// Workers
// import WORKER_URI from "worklet:./test.hands-worker.js"

// Local data
const TASKS_VISION_WASM = "./@mediapipe/tasks-vision/wasm"

let video
let canvasElement
let canvasCtx
let canvasProxy 
let gestureOutput
let gestureDetective 

let lastVideoTime = -1
let previousPrediction = null


// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createGestureRecognizer = async (options = {}) => {

	const vision = await FilesetResolver.forVisionTasks( TASKS_VISION_WASM )
	const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
		...options,
		baseOptions: {
			// modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
			modelAssetPath: GESTURE_RECOGNIZER_TASK,
			delegate: "GPU",
			...(options.baseOptions || {})
		},
		runningMode: "VIDEO",
		numHands: options.numHands ?? 2
	})
	// await gestureRecognizer.setOptions({ runningMode: "video" })
	return gestureRecognizer
}

/**
 * Inference for one frame.
 * `time` MUST be in the same domain as the rest of the prediction pipeline
 * (AudioTimer.now → ms since AudioContext start). It is floored to integer
 * milliseconds before being handed to MediaPipe, which:
 *   - rejects sub-ms precision ("performance.now is too precise")
 *   - requires strictly-monotonic timestamps per detector instance
 *
 * AudioTimer.now keeps climbing across camera switches, unlike
 * inputElement.currentTime, so this avoids the "received N, expected M"
 * regression that fires when a new MediaStream resets the video clock.
 */
const predict = (time, inputElement, detector) => {
	if (lastVideoTime !== inputElement.currentTime) {
		lastVideoTime = inputElement.currentTime
		// MediaPipe needs strictly-monotonic timestamps. AudioTimer.now is too
		// coarse (only ticks per audio render quantum), so use performance.now()
		// which is browser-guaranteed strictly-monotonic with sub-ms resolution.
		// API takes ms; scale ×1000 to expose sub-ms precision in MP's internal µs.
		const timestampUs = performance.now() * 1000
		previousPrediction = detector.recognizeForVideo(inputElement, timestampUs)
	}
	return previousPrediction
}

export const loadHandTrackingModel = async (inputElement, options, progressCallback, flipHorizontally=true) => {

	progressCallback && progressCallback(0.5, "Loading Hands")

	const detector = await createGestureRecognizer(options)
	gestureDetective = detector

	progressCallback && progressCallback(1, "Hands Ready")

	// Mirror the loadFaceLandmarksModel contract: return a function the
	// prediction loop can call with a unified timestamp (clock.now).
	const fetchModelData = async (time) => predict(time, inputElement, detector)
	return fetchModelData
}

// Check if webcam access is supported.
function hasGetUserMedia() {
	return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

// Sub-ms monotonic ms, same domain as AudioTimer-derived timestamps.
const now = () => performance.now()

const processResult = results => {

	const time = now()
	const payload = { type:"data", results, time }
	canvasProxy.post(payload, time)
	
	if (results.gestures.length > 0) {
		//   gestureOutput.style.display = "block";
		//   gestureOutput.style.width = videoWidth;
		const categoryName = results.gestures[0][0].categoryName
		const categoryScore = parseFloat( results.gestures[0][0].score * 100 ).toFixed(2)
		const handedness = results.handednesses[0][0].displayName
		gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`
	} else {
		// gestureOutput.style.display = "none"
	}
		
	
	/*
	// send these to the worker!
	canvasCtx.save()
	canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)

	if (results.landmarks) {
		for (const landmarks of results.landmarks) {
			drawingUtils.drawConnectors(
				landmarks,
				GestureRecognizer.HAND_CONNECTIONS,
				{
					color: "#00FF00",
					lineWidth: 3
				}
			)
			drawingUtils.drawLandmarks(landmarks, {
				color: "#FF0000",
				lineWidth: 2
			})
		}
		console.info(results.gestures)
	}

	canvasCtx.restore()

	if (results.gestures.length > 0) {
		//   gestureOutput.style.display = "block";
		//   gestureOutput.style.width = videoWidth;
		const categoryName = results.gestures[0][0].categoryName
		const categoryScore = parseFloat(
			results.gestures[0][0].score * 100
		).toFixed(2)
		const handedness = results.handednesses[0][0].displayName
		gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`
	} else {
		gestureOutput.style.display = "none"
	}
		*/
}

const renderLoop = () => {
	if (video.currentTime !== lastVideoTime) 
	{
		const gestureRecognitionResult = gestureDetective.recognizeForVideo(video, now())
		processResult(gestureRecognitionResult)
		lastVideoTime = video.currentTime
	}
	requestAnimationFrame( renderLoop )
}

const start = async () => {
	gestureOutput = document.getElementById("gesture-output")
	video = document.getElementById("webcam")
	canvasElement = document.getElementById("canvas-main")
	canvasProxy = new ResizeableCanvasWithWorker( canvasElement, WORKER_URI )
	
	// canvasProxy = new ResizeableCanvasWithWorker( canvasElement, WORKER_URI, {onmessage:(e)=>{
	// 	console.log("Message from worker", e)
	// }} )

	// canvasCtx = canvasElement.getContext("2d")
	
	// drawingUtils = new DrawingUtils(canvasCtx)

	// canvasElement.style.height = videoHeight;
	// webcamElement.style.height = videoHeight;
	// canvasElement.style.width = videoWidth;
	// webcamElement.style.width = videoWidth;

	const cameraDevices = await navigator.mediaDevices.enumerateDevices() 
	cameraDevices.filter(device => device.kind = "videoinput")
	const preferred = videoDevices.find(device => /face|front|facetime/i.test(device.label)) || videoDevices[0] 

	// Activate the webcam stream.
	const constraints = {
		
		// audio?: boolean | MediaTrackConstraints;
		audio: false,
		// video?: boolean | MediaTrackConstraints;
		video: true,
		// peerIdentity?: string;
		// preferCurrentTab?: boolean;
	}
	const stream = await navigator.mediaDevices.getUserMedia(constraints)
	video.srcObject = stream
	video.addEventListener("loadeddata", renderLoop)
}

// Run this demo
const init = async () => {
	gestureDetective = await createGestureRecognizer()
	// If webcam supported, add event listener to button for when user
	// wants to activate it.
	if (hasGetUserMedia()) {
		document.addEventListener("mousedown", start, { once: true })
	} else {
		console.warn("getUserMedia() is not supported by your browser");
	}
}

document.addEventListener("DOMContentLoaded", init)