/**
 * LiteRT.js face landmark detection using WebGPU acceleration
 * Mirrors face-landmarks.js functionality but uses LiteRT instead of MediaPipe
 * https://ai.google.dev/edge/litert/web
 */

import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgpu'

import { loadLiteRt, loadAndCompile, setWebGpuDevice } from '@litertjs/core'
import { runWithTfjsTensors } from '@litertjs/tfjs-interop'
import { enhanceFaceLandmarksModelPrediction } from './face-landmarks-calculations'

const FACE_LANDMARK_WASM = window.location.origin + "/@litertjs/"
const FACE_LANDMARK_MODEL_PATH = "url:./tasks/face_landmark.tflite"
// const FACE_LANDMARK_MODEL_PATH = "url:./tasks/face_landmark_with_attention.tflite"

let model
let lastVideoTime = 0
let previousPrediction = []

/**
 * Run inference on video frame and extract face landmarks
 * @param {HTMLVideoElement} inputElement 
 * @param {Object} liteRtModel - Compiled LiteRT model
 * @param {Boolean} flipHorizontally 
 * @returns {Array} Array of people with enhanced face landmark data
 */
const predict = async (inputElement, liteRtModel, flipHorizontally=true) => {
	
	if (lastVideoTime !== inputElement.currentTime) {
		// const time = now()
		lastVideoTime = inputElement.currentTime
		
		// Convert video frame to tensor and run inference
		const inputTensor = tf.browser.fromPixels(inputElement)
		const outputs = await runWithTfjsTensors(liteRtModel, [inputTensor])
		inputTensor.dispose()
		
		// Parse outputs (faceLandmarks, faceBlendshapes, facialTransformationMatrixes)
		// Note: Output format depends on the specific .tflite model
		const faceLandmarksArray = await outputs[0].array()
		const faceBlendshapesArray = outputs.length > 1 ? await outputs[1].array() : []
		const faceMatrixArray = outputs.length > 2 ? await outputs[2].array() : []
		
		// Clean up output tensors
		outputs.forEach(output => output.dispose())
		
		const people = []
		const faceQuantity = Array.isArray(faceLandmarksArray[0]) ? faceLandmarksArray.length : 1
		
		for (let i = 0; i < faceQuantity; ++i) {
			const faceLandmarks = faceQuantity > 1 ? faceLandmarksArray[i] : faceLandmarksArray
			const faceBlendshapes = faceQuantity > 1 ? faceBlendshapesArray[i] : faceBlendshapesArray
			const faceMatrix = faceQuantity > 1 ? faceMatrixArray[i] : faceMatrixArray
			
			people[i] = enhanceFaceLandmarksModelPrediction(faceLandmarks, faceBlendshapes, faceMatrix, inputElement.currentTime, flipHorizontally)
		}
		
		previousPrediction = people
		return people
	}
	
	return previousPrediction
}

/**
 * Load and initialize the LiteRT face landmark model
 * Before we can use the model we must wait for it to finish loading.
 * Machine Learning models can be large and take a moment to get everything needed to run.
 * 
 * @param {HTMLVideoElement} inputElement 
 * @param {Object} options - Configuration options for the model
 * @param {Function} progressCallback - Callback to report loading progress
 * @param {Boolean} flipHorizontally - Should we flip the x direction of the model? 
 * @returns {Function} Async function to fetch model predictions
 */
export const loadFaceLandmarksModel = async (inputElement, options, progressCallback, flipHorizontally=true) => {
	
	const startLoadProgress = 0.5
	const loadRange = 0.3
	const loadTotal = 4
	let loadIndex = 0

	progressCallback && progressCallback(startLoadProgress + loadRange * (loadIndex++/loadTotal), "Checking Brains")

	// try {
		// Initialize WebGPU adapter BEFORE loading LiteRT
		let backend = null
		let device = null
		
		try {
			const adapter = await navigator.gpu.requestAdapter()
			if (!adapter) {
				throw new Error('WebGPU adapter not found')
			}
			console.log('WebGPU adapter found', {adapter} )
			
			device = await adapter.requestDevice()
			console.log('WebGPU device created', {device})
			
			// Set LiteRT WebGPU device BEFORE loadLiteRt()
			setWebGpuDevice(device)
			console.log('WebGPU device set for LiteRT', {device})
			
		} catch (e) {
			console.warn('WebGPU not available:', e)
			device = null
		}
		
		progressCallback && progressCallback(startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loading Brains")

		debugger
		// Load LiteRT's Wasm files from your server
		// Host the wasm/ folder (from node_modules/@litertjs/core/wasm/) on your server
		console.log('Loading LiteRT from:', FACE_LANDMARK_WASM)
		await loadLiteRt(FACE_LANDMARK_WASM)
		
		// Set TensorFlow.js backend
		try {
			await tf.setBackend('webgpu')
			backend = tf.backend()
			console.log('TensorFlow.js WebGPU backend set')
		} catch (e) {
			console.warn('TensorFlow.js WebGPU backend failed, falling back to CPU:', e)
			await tf.setBackend('cpu')
		}

		progressCallback && progressCallback(startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loading Face tracking")

		// Load the LiteRT model (.tflite file) from your server
		// This makes an HTTP(S) request to fetch the model
		// The model can also be loaded from a Uint8Array if you want to fetch it yourself
		model = await loadAndCompile(FACE_LANDMARK_MODEL_PATH, {
			accelerator: 'webgpu' // or 'wasm' for XNNPack CPU inference
		})

		progressCallback && progressCallback(startLoadProgress + loadRange * (loadIndex++/loadTotal), "Loaded Brains")

		// Log model input/output details for debugging
		console.log('LiteRT Model Input Details:', model.getInputDetails())
		console.log('LiteRT Model Output Details:', model.getOutputDetails())

	// } catch (error) {
	// 	console.error('Failed to load LiteRT face landmark model:', error)
	// 	throw error
	// }

	// Return a function that runs predictions on the video stream
	const fetchModelData = async (time) => { 
		const prediction = await predict(time, inputElement, model, flipHorizontally)
		return prediction
	}

	return fetchModelData
}