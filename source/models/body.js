//import * as tf from '@tensorflow/tfjs-core'
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl'
// import '@tensorflow/tfjs-backend-wasm'
import * as poseDetection from '@tensorflow-models/pose-detection'

import {clamp, TAU, HALF_PI} from '../maths/maths'

import {ready, setBackend} from '@tensorflow/tfjs'

// console.log(poses[0].keypoints);
// Outputs:
// [
//    {x: 230, y: 220, score: 0.9, name: "nose"},
//    {x: 212, y: 190, score: 0.8, name: "left_eye"},
//    ...
// ]

export const loadBodyModel = async (inputElement, options) => {

	
	console.error("loadModel", {inputElement})
	await ready()

	console.error("loadModel", {inputElement})
	
	const detectPeople = options.maxFaces

	// Create a detector.
	const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet)
// = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
// or for accurate version
// const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER})

	// now subscribe to events and monitor
	const update = async (repeat, callback, isPaused=null) => { 

		const shouldUpdate = isPaused ? isPaused() : true
	
		// console.log("shouldUpdate", shouldUpdate, {isPaused})
		// console.log("Combining TF model", model, "with element", inputElement, "..." )
		if (shouldUpdate)
		{
			// pose predictions
			const predictions = await detector.estimatePoses(inputElement)

			//console.warn("carpet", {predictions, inputElement, model})
	
			// find the smaller value and use as the face quantity
			const quantity = Math.min(detectPeople, predictions.length)
			callback( predictions.length ? predictions.slice(0,quantity) : [] )

		}else{
			// console.log("Paused")
		}

		// loop or use worker???
		if (repeat)
		{
			requestAnimationFrame( () => update(repeat, callback, isPaused) )
		}
	}
	return update
}