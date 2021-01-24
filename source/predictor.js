// FaceLandmarksDetector, FaceLandmarksPrediction, FaceLandmarksDetection
import { load, SupportedPackages } from '@tensorflow-models/face-landmarks-detection'

// CPU Only
//import '@tensorflow/tfjs-backend-cpu'

// If you are using the WASM backend:
//import '@tensorflow/tfjs-backend-wasm'

import {ready, setBackend} from '@tensorflow/tfjs'

// If you are using the WebGL backend:
import '@tensorflow/tfjs-backend-webgl'

const flipHorizontally = true

const now = ()=> Performance.now

const TAU = Math.PI * 2
const HALF_PI = Math.PI * 0.5

// a mouth covers about 1/3 of the face?
const RATIO_OF_MOUTH_TO_FACE = 0.25

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
		// no need for these
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

	//console.log("Predicting", inputElement, predictions)
	// firstly check to see if there any predictions
	if (predictions.length > 0) 
	{
		// now loop through all predictions?
		for (let p = 0, l = predictions.length; p < l; p++) 
		{
			const prediction = predictions[p]
			
			// more than likely there is a face on the screen :P
			const {boundingBox, mesh, scaledMesh, annotations} = prediction
			const {bottomRight, topLeft} = boundingBox

			// now there are some points already isolated :)
			// so we can work out how much area the mouth is using up

			// See keypoints.js
			// const {rightCheek, leftCheek} = annotations

			// Nose
			const {noseTip, noseBottom, noseRightCorner} = annotations
			
			// we can use the bounding box or actual face mesh coords
			const topOfHead = scaledMesh[109] //topLeft[1]
			const bottomOfHead = scaledMesh[400]

			const headHeight = bottomOfHead[1] - topOfHead[1]

			// Eyes ---------------------
			// There are three points on the face that we can compare against
			const {leftEyeIris,rightEyeIris,leftEyeLower0, rightEyeLower0, midwayBetweenEyes} = annotations

			// eyes pointing in directions?
			const irisLeft = leftEyeIris[0]
			const irisRight = rightEyeIris[0]
			const midPoint = midwayBetweenEyes[0]
			const distanceBetweenEyes = Math.abs(irisLeft[0] - irisRight[0])
				
			const lookingRight = irisLeft[2] < irisRight[2]

			// -1 -> +1
			const eyeDirection = (2 * ( midPoint[0] - irisLeft[0] ) / distanceBetweenEyes) - 1

			// add in some extras to make things easier 
			// the midpoint can be used to triangulate the yaw
			const lx = leftEyeLower0[0][0] 
			const rx = rightEyeLower0[0][0] 

			const ly = leftEyeLower0[0][1] 
			const ry = rightEyeLower0[0][1] 

			const mx = midwayBetweenEyes[0][0] 
			const my = midwayBetweenEyes[0][1] 

			// lengths of the triangle
			const lmx = (mx - lx) * -1
			const rmx = mx - rx

			const {rightCheek,leftCheek, silhouette} = annotations

			prediction.lookingRight = flipHorizontally ? !lookingRight : lookingRight

			// worked out by ????
			// prediction.leftEyeShut = false
			// prediction.rightEyeShut = false

			// Looking left / Right -1 -> 1
			prediction.eyeDirection = eyeDirection * -1 // flipit
			prediction.eyeDistance = distanceBetweenEyes

			prediction.headHeight = headHeight
			// FIXME : flipHorizontal

			// and now we want the angle formed
			const yaw = flipHorizontally ? 
				-1 * (Math.atan2(lmx, rmx) - 2)
				: -1 * (Math.atan2(lmx, rmx) - 0.75)
 			//const yaw = 0.5 - Math.atan( midPoint[2], -1 * midPoint[0] ) / ( 2.0 * Math.PI )
		  
		
			// this is from forehead to chin...
			// if the chin is in front (z) of forehead, head tilting back
			// const pitch = 0.5 - Math.asin( my ) / Math.PI
			// currently ranges between -0.35 -> -0.4 -> -0.35 
			const pitch = flipHorizontally ? 
				((Math.atan2(topOfHead[2], bottomOfHead[2] ) ) - 1.9 - 0.2 ) / HALF_PI
				: (Math.atan2(midwayBetweenEyes[0][2], rmx) - 0.75)

			// if either eye is lower than the other
			const rollX = (lx - rx)
			const rollY = (ly - ry)

			// As this is for 350 range, we double to make it just 180
			const roll = flipHorizontally ?  
				-1 * (Math.atan2(rollX, rollY) + HALF_PI)//Math.atan2(rollY, rollX):
				: Math.atan2(rollX, rollY) - HALF_PI
			
			// leaning head as if to look at own chest / sky
			prediction.pitch = pitch
			// tilting head towards shoulders
			prediction.roll = roll
			// regular left right movement
			prediction.yaw = yaw

			
			// Lip work --------------------------------

			const {lipsUpperInner,lipsLowerInner } = annotations
			const quantity = lipsUpperInner.length
	
			// central piece of the mouth
			const lipUpperLeft = lipsUpperInner[0]
			const lipLowerLeft = lipsLowerInner[0]

			const lipUpperMiddle = lipsUpperInner[5]
			const lipLowerMiddle = lipsLowerInner[5]
			
			const lipUpperRight = lipsUpperInner[quantity-1]
			const lipLowerRight = lipsLowerInner[quantity-1]

			// use hypotheneuse
			const lipVerticalOpeningX = lipLowerMiddle[0] - lipUpperMiddle[0]
			const lipVerticalOpeningY = lipLowerMiddle[1] - lipUpperMiddle[1]
			
			const lipHorizontalOpeningX = lipLowerRight[0] - lipLowerLeft[0]
			const lipHorizontalOpeningY = lipUpperRight[1] - lipUpperLeft[1]
			
			const lipVerticalOpening = Math.sqrt( lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY )
			const lipHorizontalOpening = Math.sqrt( lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY )
			
			 //const lipVerticalOpening = lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY
			prediction.mouthRange = lipVerticalOpening
			prediction.mouthRatio = lipVerticalOpening / headHeight
			prediction.mouthWidth = lipHorizontalOpening

			// TODO: this is the size of the mouth as a factor of the head size
			prediction.mouthOpen = lipVerticalOpening / (headHeight * RATIO_OF_MOUTH_TO_FACE)

			// -1 -> 1
			prediction.happiness = 0

			// useful
			prediction.time = time

			//console.log(prediction, {lmx,rmx,yaw},{lookingRight, eyeLeft,eyeRight}, {leftEyeIris,rightEyeIris})
		} 
		
	}else{
		//console.log("No face in shot")
	}
	
	return predictions
}

export const loadModel = async (inputElement, options) => {

	// Set the backend to WASM and wait for the module to be ready.
	//await setBackend('wasm')
	await ready()
	
	const detectPeople = options.maxFaces

	// Load the MediaPipe Facemesh package.
	const model = await load( SupportedPackages.mediapipeFacemesh, options)

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

			//console.log("Predictions narrowed down to", predictions)
			if (predictions.length > 0)
			{
				// find the smaller value and use as the face quantity
				const quantity = Math.min(detectPeople, predictions.length)
				const people = []
				for (let i=0; i < quantity; ++i)
				{
					const prediction = predictions[i]
					people.push( prediction )
				}
			
				if (callback) 
				{
					callback(people)
				}

			}else{

				// nofaces
				if (callback) 
				{
					callback(null)
				}
			}
		}else{
			// console.log("Paused")
		}

		// loop
		if (repeat)
		{
			requestAnimationFrame( () => update(repeat, callback, isPaused) )
		}
	}
	return update
}
