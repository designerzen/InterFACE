import { load, SupportedPackages } from '@tensorflow-models/face-landmarks-detection'
import {ready, setBackend} from '@tensorflow/tfjs'

const predict = async (inputElement,model) => {

	// Pass in a video stream (or an image, canvas, or 3D tensor) to obtain an
	// array of detected faces from the MediaPipe graph. If passing in a video
	// stream, a single prediction per frame will be returned.
	const predictions = await model.estimateFaces({
		// webcam element with video
	  	// input: video
	  	input: inputElement
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
			
			// now there are some points already isolated :)
			// so we can work out how much area the mouth is using up

			// See keypoints.js

			const topOfHead = 0
			const bottomOfHead = 0

			// There are three points on the face that we can compare against
			const {leftEyeIris,rightEyeIris} = annotations
			const {leftEyeLower0, rightEyeLower0, midwayBetweenEyes} = annotations

			// eyes pointing in directions?
			const eyeLeft = leftEyeIris[0]
			const eyeRight = rightEyeIris[0]
			const midPoint = midwayBetweenEyes[0]

			const lookingRight = eyeLeft[2] < eyeRight[2]

			// add in some extras to make things easier 
			// the midpoint can be used to triangulate the yaw
			const lx = leftEyeLower0[0][0] 
			const rx = rightEyeLower0[0][0] 
			const ly = leftEyeLower0[0][1] 
			const ry = rightEyeLower0[0][1] 
			const mx = midwayBetweenEyes[0][0] 

			// lengths of the triangle
			const lmx = (mx - lx) * -1
			const rmx = mx - rx

			const {rightCheek,leftCheek, silhouette} = annotations

			prediction.lookingRight = lookingRight


			// and now we want the angle formed
			const yaw = -1 * (Math.atan2(lmx, rmx) - 0.75)
 			//const yaw = 0.5 - Math.atan( midPoint[2], -1 * midPoint[0] ) / ( 2.0 * Math.PI )
		  
			// this is from forehead to chin...
			// if the chin is in front (z) of forehead, head tilting back
			const pitch = 0.5 - Math.asin( midPoint[1] ) / Math.PI

			// if either eye is lower than the other
			const rollX = (lx - rx)
			const rollY = (ly - ry)

			const roll = Math.atan2(rollX, rollY) - Math.PI * 0.5
			//console.log("roll",roll, {rollX,rollY} )
			
			// leaning head as if to look at own chest / sky
			prediction.pitch = pitch
			// tilting head towards shoulders
			prediction.roll = roll
			// regular left right movement
			prediction.yaw = yaw

			
			// Lip work --------------------------------

			const {lipsUpperInner,lipsLowerInner } = annotations
	
			// central piece of the mouth
			const lipUpperMiddle = lipsUpperInner[5]
			const lipLowerMiddle = lipsLowerInner[5]

			// use hypotheneuse
			const lipVerticalOpeningX = lipLowerMiddle[0] - lipUpperMiddle[0]
			const lipVerticalOpeningY = lipLowerMiddle[1] - lipUpperMiddle[1]
			
			 const lipVerticalOpening = Math.sqrt( lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY )
			//const lipVerticalOpening = lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY
			prediction.mouthRange = lipVerticalOpening

			// this is the size of the mouth as a factor of the head size
			prediction.mouthOpen = 1

			// -1 -> 1
			prediction.happiness = 0

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

	console.log("Loaded TF model", model, "for", detectPeople, "people" )

	// now subscribe to events and monitor
	const update = async (repeat, callback) => { 

		console.log("Combining TF model", model, "with element", inputElement, "..." )

		// single player right now but this could be an array in future
		const predictions = await predict(inputElement, model) 
		//console.warn("carpet", {predictions, inputElement, model})
/*
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
*/
		// loop
		if (repeat)
		{
			requestAnimationFrame( () => update(repeat, callback) )
		}
	}
	return update
}
