// Thanks to
// https://github.com/vivien000/trompeloeil/blob/master/src/World/components/geometry/geometry.js

// Import @tensorflow/tfjs or @tensorflow/tfjs-core
import * as tf from '@tensorflow/tfjs'

import '@tensorflow/tfjs-core'

// Register backends

// CPU Only
//import '@tensorflow/tfjs-backend-cpu'

// If you are using the WebGL backend:
import * as tfWebGL from '@tensorflow/tfjs-backend-webgl'

// Adds the WASM backend to the global backend registry.
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm'
//import '@tensorflow/tfjs-backend-wasm'

import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm/dist/index.js'
import wasmURL from "url:@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm.wasm"
import wasmSIMDURL from "url:@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-simd.wasm"
import wasmTHREADEDURL from "url:@tensorflow/tfjs-backend-wasm/wasm-out/tfjs-backend-wasm-threaded-simd.wasm"

import * as faceMesh from '@mediapipe/face_mesh'
// import PACKED_ASSETS from "@mediapipe/face_mesh/face_mesh_solution_packed_assets_loader.js"

import { createDetector, SupportedModels } from '@tensorflow-models/face-detection'	
import { enhanceFaceModelPrediction } from './face-model-calculations'
import { now } from '../timing/timing'

// This flips to using a seperate thread for the 
// prediction calculations - dunno if it makes it quicker
// but it certainly uses more CPU which then shonks audio
const useWorker = true
const flipHorizontally = true

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
		// faceWorker = new Worker( new URL('data-url:./face-worker.js', import.meta.url), {type:'module'} )
		faceWorker = new Worker(
			new URL('./face-worker.js', import.meta.url), 
			{type:'module'} 
		)
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


const predictPlayerQuantity = async (inputElement,detector) => {
	const estimationConfig = {flipHorizontal: false}
	const faces = await detector.estimateFaces(inputElement, estimationConfig)
	return faces.length
}



// const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` })
// faceMesh.setOptions({
// 	maxNumFaces: 1,
// 	refineLandmarks: true,
// 	minDetectionConfidence: 0.5,
// 	minTrackingConfidence: 0.5
//   })
//  faceMesh.onResults(onResults)
// await faceMesh.send({image: videoElement}) // inputElement

/**
 * This uses the ML model to solve stuff
 * @param {HTMLElement} inputElement 
 * @param {Function} detector 
 * @returns Array predictions
 */
const predict = async (inputElement,detector) => {

	try {
		// some effects are timing related
		const time = now()
		const options = {
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
		}

		//console.error(time, { options, detector:detector.estimateFaces, inputElement})

		// Pass in a video stream (or an image, canvas, or 3D tensor) to obtain an
		// array of detected faces from the MediaPipe graph. If passing in a video
		// stream, a single prediction per frame will be returned.
		//const predictions = await detector.estimateFaces(options)


		const predictions = await detector.estimateFaces(inputElement, options)

		

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
					prediction = enhanceFaceModelPrediction( predictions[p], time )
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

	} catch (error) {

		console.error("Model failure!", error, {inputElement,detector} )

		return null
	}
}

const determineSolutionPath = (options) => {
	
	// as MediaPipe loads this from a domain without the option
	// of being able to also set the filename, the builder used hashes
	// all file names making the lib 404 when fishing for it's data
	// if we specify local and it fails it will fall back to the CDN anyway
	// as that appears to be hard coded in the system anyway
	return options.solutionPath || `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${faceMesh.VERSION}` // '../../node_modules/@mediapipe/face_mesh' // new URL('../../node_modules/@mediapipe/face_mesh/face_mesh_solution_packed_assets_loader.js', import.meta.url)
	
	// 'base/node_modules/@mediapipe/face_mesh' in npm.
	// solutionPath: The path to where the wasm binary and model files are located.
	//const solutionPath = wasmURL
	 
	// node_modules\@mediapipe\face_mesh\face_mesh_solution_packed_assets_loader.js
				   // solutionPath: new URL('../../node_modules/@mediapipe/face_mesh/face_mesh_solution_packed_assets_loader.js', import.meta.url)
				   // solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${faceMesh.VERSION}`

}

/**
 * This is the second steps that are loaded and take about 1/3 of the time
 * @param {HTMLElement} inputElement 
 * @param {Object} options 
 * @param {Function} progressCallback 
 * @returns Function to cause update
 */
export const loadFaceModel = async (inputElement, options, progressCallback) => {

	const startLoadProgress = 0.5
	const loadRange = 0.3
	const loadTotal = 2
	let loadIndex = 0
	
	progressCallback && progressCallback( startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loading Brains")
	// console.log("Loading Face Model from TF", {options} )

	// Set the WASM paths if possible
	tfjsWasm.setWasmPaths({
		'tfjs-backend-wasm.wasm': wasmURL,
		'tfjs-backend-wasm-simd.wasm':wasmSIMDURL,
		'tfjs-backend-wasm-threaded-simd.wasm': wasmTHREADEDURL
	})

	// or fallback due to CORS
	// `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`
	let success = false

	// try wasm first (we can always fallback to it if GL fails below)
	// Set the backend to WASM and wait for the module to be ready.
	const backEnds = options.backEnds || []
	
	backEnds.forEach( async(backEnd) => {
		success = await tf.setBackend(backEnd)
	})

	// success =await tf.setBackend('cpu')
	// success = await tf.setBackend('wasm')
	// success = await tf.setBackend('webgl')

	// Returns a promise that resolves when the currently selected backend (or the
 	// highest priority one) has initialized. Await this promise when you are using
	// a backend that has async initialization.
	await tf.ready()

	progressCallback && progressCallback( startLoadProgress + loadRange * (loadIndex++/loadTotal) )
	
	// FIXME: Use the method for player inference once the detector is available
	const detectPeople = options.maxFaces

	// one of the models from SupportedModels, including MediaPipeFaceMesh.
	const model = SupportedModels.MediaPipeFaceMesh // SupportedPackages.mediapipeFacemesh

	// console.error({PACKED_ASSETS})

	const solutionPath = determineSolutionPath(options)
	console.error("Loading Face Model", {options, backEnds, solutionPath} )
	// console.log("loadFaceModel",{options, model, solutionPath, detectPeople} )

	const loadDetector = ()=> {
		switch (options.runtime) {
			case 'mediapipe' :
				return createDetector(model, {
					...options, 
					solutionPath
				});
			
			case 'tfjs' :
				return createDetector(model, {
					...options
				})
		}	
	}

	// Load the MediaPipe Facemesh package.
	const detector = await loadDetector(model, options)
	
	progressCallback && progressCallback(startLoadProgress +  loadRange * (loadIndex++/loadTotal), "Loaded Detector")
	// console.log("Loaded Detector", {detector} )

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
			// const playerCount = await predictPlayerQuantity(inputElement, detector)

			const predictions = await predict(inputElement, detector) 
			
			if (!predictions)
			{
				console.warn("face>tfjs", {predictions, inputElement, model})
				return // ?
			}

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