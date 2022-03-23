// TODO : Convert to a web worker

// Thanks to
// https://github.com/vivien000/trompeloeil/blob/master/src/World/components/geometry/geometry.js

// FaceLandmarksDetector, FaceLandmarksPrediction, FaceLandmarksDetection
import { load, SupportedPackages } from '@tensorflow-models/face-landmarks-detection'
// import * as FACEDETECT from '@tensorflow-models/face-landmarks-detection'

// CPU Only
//import '@tensorflow/tfjs-backend-cpu'

// If you are using the WASM backend:
//import '@tensorflow/tfjs-backend-wasm'

import {ready, setBackend} from '@tensorflow/tfjs'

// If you are using the WebGL backend:
import '@tensorflow/tfjs-backend-webgl'

import { enhancePrediction} from './face-model'

// This flips to using a seperate thread for the 
// prediction calculations - dunno if it makes it quicker
// but it certainly uses more CPU which then shonks audio
const useWorker = true

const flipHorizontally = true
const now = ()=> performance.now || Date.now

let faceWorker 

// const createWorker = () => {

// 	const worker = new Worker("data-url:./face-worker.js") 
// 	let callback = (e)=>{ console.log(e.data) }
// 	faceWorker.onmessage = (e) => callback
	
// 	// Send prediction data to our worker
// 	return {
// 		worker,
// 		send: async (value) =>{ 

// 			// wait for message...?
// 			callback = (e) => {
// 				return e.data
// 			}
// 			// send
// 			faceWorker.postMessage(prediction)
// 		}
// 	}
// }

// Load in our transformer
const makePrediction = (prediction) => new Promise((resolve,reject)=>{

	// load worker if neccessary
	if (!faceWorker)
	{
		faceWorker = new Worker( new URL('data-url:./face-worker.js', import.meta.url), {type:'module'} )
	}

	faceWorker.onmessage = (e) => resolve( e.data )
	
	// Send prediction data to our worker
	faceWorker.postMessage(prediction)
})

// const makePrediction = (prediction) => new Promise((resolve,reject)=>{

// 	// load worker if neccessary
// 	if (!faceWorker)
// 	{
// 		faceWorker = new Worker("data-url:./face-worker.js") 
// 	}

// 	faceWorker.onmessage = (e) => resolve( e.data )
	
// 	// Send prediction data to our worker
// 	faceWorker.postMessage(prediction)
// })


const predict = async (inputElement,model) => {

	// some effects are timing related
	const time = now()

	// Pass in a video stream (or an image, canvas, or 3D tensor) to obtain an
	// array of detected faces from the MediaPipe graph. If passing in a video
	// stream, a single prediction per frame will be returned.
	const predictions = await model.estimateFaces({
		// webcam element with video
	  	// input: video / img etc
		input: inputElement,
		// no need for these yet...
		// TODO: Implement emotion tests
		returnTensors :false,
		// Whether to flip/mirror the facial keypoints horizontally. Should be true for videos that are flipped by default (e.g. webcams)
		flipHorizontal:flipHorizontally,
		// (defaults to true) Whether to return keypoints for the irises. Disabling may improve performance.
		predictIrises:true
	})

	// Fetch the UV coords for use with 3D renderers
	// const uvs = FaceLandmarksDetection.getUVCoords()

	// determine head rotation?
	// take the UV of the eyes and use them to determine angle

	// firstly check to see if there any predictions
	if (predictions.length > 0) 
	{
		// now loop through all predictions?
		for (let p = 0, l = predictions.length; p < l; p++) 
		{
			// no enhancement...
			let prediction // = predictions[p]
			
			if (!useWorker)
			{
				// direct (no worker)
				prediction = enhancePrediction( predictions[p], time )
			}else{
				// using async worker (any faster?)
				prediction = await makePrediction( predictions[p] )
			}

			// overwrite
			predictions[p] = prediction
			//console.log(prediction, {lmx,rmx,yaw},{lookingRight, eyeLeft,eyeRight}, {leftEyeIris,rightEyeIris})
		} 
		
	}else{
		//console.log("No face in shot")
	}


	return predictions
}

export const loadFaceModel = async (inputElement, options) => {

	// Set the backend to WASM and wait for the module to be ready.
	//await setBackend('wasm')
	await ready()
	
	const detectPeople = options.maxFaces

	// Load the MediaPipe Facemesh package.
	const model = await load( SupportedPackages.mediapipeFacemesh, options)

 	// Load Emotion Detection
	// const emotionModel = await tf.loadLayersModel( 'web/model/facemo.json' )
	// console.log("Loaded TF model", model, "for", detectPeople, "people" )

	// now subscribe to events and monitor
	const update = async (repeat, callback, isPaused=null) => { 

		const shouldUpdate = isPaused ? isPaused() : true
	
		// console.log("shouldUpdate", shouldUpdate, {isPaused})
		// console.log("Combining TF model", model, "with element", inputElement, "..." )
		if (shouldUpdate)
		{
			// single player right now but this could be an array in future
			const predictions = await predict(inputElement, model) 
			//console.warn("carpet", {predictions, inputElement, model})

			// //console.log("Predictions narrowed down to", predictions)
			// if (predictions.length > 0)
			// {
			// 	// find the smaller value and use as the face quantity
			const quantity = Math.min(detectPeople, predictions.length)
			// 	// const people = []

			// 	// for (let i=0; i < quantity; ++i)
			// 	// {
			// 	// 	const prediction = predictions[i]
			// 	// 	people.push( prediction )
			// 	// }
			// 	const people = predictions.slice(0,quantity)
			
			// 	if (callback) 
			// 	{
			// 		callback(people)
			// 	}

			// }else{

			// 	// nofaces
			// 	if (callback) 
			// 	{
			// 		callback(null)
			// 	}
			// }
			// const people = predictions.slice(0,quantity)
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