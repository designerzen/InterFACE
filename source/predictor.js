import {clamp} from './maths'

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

const flipHorizontally = true

const now = ()=> Date.now() || Performance.now

const {PI, sqrt, atan2, cos, tan, sin} = Math
const TAU = PI * 2
const HALF_PI = PI * 0.5

// a mouth covers about 1/3 of the face?
const RATIO_OF_MOUTH_TO_FACE = 0.25
const EYE_CLOSED_AT = 20.2 //.5
const PITCH_SCALE = 8

// What the face is observing in a cone shape...
const fieldOfView = (dfov, w, h) => {
    const hypothenuse = sqrt( w ** 2 + h ** 2 )
    const tan_dfov = tan(dfov / 2)
    return [2 * atan(w * tan_dfov / hypothenuse), 2 * atan(h * tan_dfov / hypothenuse)]
}

// cheaper than TAN
const twist = (value, amount=0) => {

	// if it is negative, invert
	if (value < 0)
	{
		value = (value + 1) * -1
	}else{
		value = 1 - value
	}
	//return value + amount
	return clamp(value + amount,-1,1)
}

// Feed it a right angle triangle and get the angle between the edges
const determineAngle = ( pointA, pointO ) => {

	// determine missing point?
	// const hypoteneuseX = pointO[0]
	// const hypoteneuseY = pointA[1]

	// work out the lengths of the known edges
	const oppositeLength = pointA[1] - pointO[1] 
	const adjacentLength = pointO[0] - pointA[0]

	const angleInRadians = atan2(oppositeLength, adjacentLength)
	// process?
	return angleInRadians
}

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
			const prediction = predictions[p]
			
			// more than likely there is a face on the screen :P
			const {boundingBox, mesh, scaledMesh, annotations} = prediction
			const {bottomRight, topLeft} = boundingBox
			
			// Nose
			const {noseTip, noseBottom, noseRightCorner} = annotations
			//const {rightCheek,leftCheek, silhouette} = annotations

			// Useful landmarks on the face
			const centerOfHead = scaledMesh[168]
            const forehead = scaledMesh[10]

			// Triangulate view cone
			// const depth = 0.06 * FOCAL_LENGTH * canvas.width / MAX_WIDTH / sqrt((centerX - forehead[0]) ** 2 + (centerY - forehead[1]) ** 2 )
			// const depth = IRIS_SIZE * FOCAL_LENGTH * canvas.width / MAX_WIDTH / diameter;

			// we can use the bounding box or actual face mesh coords
			const topOfHead = scaledMesh[109] //topLeft[1]
			const bottomOfHead = scaledMesh[400]

			// size of head from chin to top
			// const headHeight = bottomOfHead[1] - topOfHead[1]
			const headHeight = sqrt(
				(bottomOfHead[0] - topOfHead[0]) ** 2 + 
				(bottomOfHead[1] - topOfHead[1]) ** 2
			)

			// Eyes ---------------------
			// There are three points on the face that we can compare against
			const { leftEyeIris,leftEyeLower0,leftEyeLower1,leftEyeUpper1, 
					rightEyeIris,rightEyeLower0,rightEyeLower1, rightEyeUpper0,rightEyeUpper1,
					midwayBetweenEyes } = annotations

			// eyes pointing in directions?
			const irisLeftX = leftEyeIris[0]
			const irisRightX = rightEyeIris[0]

			const midPoint = midwayBetweenEyes[0]
			const midwayBetweenEyesX = midPoint[0] 
			const midwayBetweenEyesY = midPoint[1] 
			
			// const distanceBetweenEyes = abs(irisLeft[0] - irisRight[0])
			const distanceBetweenEyes =	sqrt(
				(irisLeftX[0] - irisRightX[0]) ** 2 + 
				(irisLeftX[1] - irisRightX[1]) ** 2
			)
			
			// Are we looking right or left?
			const lookingRight = irisLeftX[2] < irisRightX[2]

			// -1 -> +1
			const eyeDirection = (2 * ( midPoint[0] - irisLeftX[0] ) / distanceBetweenEyes) - 1

			// Now eyes open calcs
			const eyeSocketHeight = sqrt(
				( leftEyeUpper1[ 3 ][ 0 ] - rightEyeUpper1[ 3 ][ 0 ] ) ** 2 +
				( leftEyeUpper1[ 3 ][ 1 ] - rightEyeUpper1[ 3 ][ 1 ] ) ** 2 +
				( leftEyeUpper1[ 3 ][ 2 ] - rightEyeUpper1[ 3 ][ 2 ] ) ** 2
			)
			const eyeScale = eyeSocketHeight / 80

			// Check for eyes closed
			const leftEyesDist = sqrt(
				( leftEyeLower1[ 4 ][ 0 ] - leftEyeUpper1[ 4 ][ 0 ] ) ** 2 +
				( leftEyeLower1[ 4 ][ 1 ] - leftEyeUpper1[ 4 ][ 1 ] ) ** 2 +
				( leftEyeLower1[ 4 ][ 2 ] - leftEyeUpper1[ 4 ][ 2 ] ) ** 2
			)
			const rightEyesDist = sqrt(
				( rightEyeLower1[ 4 ][ 0 ] - rightEyeUpper1[ 4 ][ 0 ] ) ** 2 +
				( rightEyeLower1[ 4 ][ 1 ] - rightEyeUpper1[ 4 ][ 1 ] ) ** 2 +
				( rightEyeLower1[ 4 ][ 2 ] - rightEyeUpper1[ 4 ][ 2 ] ) ** 2
			)

			// add in some extras to make things easier 
			// the midpoint can be used to triangulate the yaw
			const lx = leftEyeLower0[0][0] 
			const rx = rightEyeLower0[0][0] 

			const ly = leftEyeLower0[0][1] 
			const ry = rightEyeLower0[0][1] 


			// lengths of the triangle
			const lmx = (midwayBetweenEyesX - lx) * -1
			const rmx = midwayBetweenEyesX - rx

			prediction.lookingRight = flipHorizontally ? !lookingRight : lookingRight

			// Looking left / Right -1 -> 1
			prediction.eyeDirection = eyeDirection * -1 // flipit
			prediction.eyeDistance = distanceBetweenEyes
			
			// FIXME: Ideally these give a percentage of open-ness
			prediction.leftEye = leftEyesDist / eyeScale
			prediction.leftEyeClosed = prediction.leftEye < EYE_CLOSED_AT
			
			prediction.rightEye = rightEyesDist / eyeScale 
			prediction.rightEyeClosed = prediction.rightEye < EYE_CLOSED_AT
			
			// both together
			//prediction.eyesClosed = prediction.leftEyeClosed && prediction.rightEyeClosed

	
			prediction.headHeight = headHeight
	
			// FIXME : flipHorizontal

			// and now we want the angle formed
			const yaw = flipHorizontally ? 
				-1 * (atan2(lmx, rmx) - 2)
				: -1 * (atan2(lmx, rmx) - 0.75)
 			//const yaw = 0.5 - Math.atan( midPoint[2], -1 * midPoint[0] ) / ( 2.0 * Math.PI )
		  
			 // as nthis is -1 -> 1 we need to wrap it better
			
			// this is from forehead to chin...?
			// or nose to top lip?
			// if the chin is in front (z) of forehead, head tilting back
			// const pitch = 0.5 - Math.asin( my ) / PI
			// currently ranges between -0.35 -> -0.4 -> -0.35 
			const pitchAngle = atan2(topOfHead[2], noseTip[0][2] )
			const pitch = PITCH_SCALE * twist( pitchAngle / PI, -0.15 )
				
			// const pitch = flipHorizontally ? 
			// 	((Math.atan2(topOfHead[2], bottomOfHead[2] ) ) - 1.9 - 0.2 ) / HALF_PI
			// 	: (Math.atan2(midwayBetweenEyes[0][2], rmx) - 0.75)
				

			// if either eye is lower than the other
			const rollX = (lx - rx)
			const rollY = (ly - ry)

			// As this is for 350 range, we double to make it just 180
			const roll = flipHorizontally ?  
				-1 * (atan2(rollX, rollY) + HALF_PI)//Math.atan2(rollY, rollX):
				: atan2(rollX, rollY) - HALF_PI
			
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
			
			const lipVerticalOpening = sqrt( lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY )
			const lipHorizontalOpening = sqrt( lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY )
			
			// create triangles from the shape of the mouth
			// const upperLipLeft = [ lipUpperLeft, lipUpperMiddle ]
			
			// // this is the top left lip to fultrum (snot run)
			// // const upperLipLeftAngle = 
			
			
			// const upperLipRight = [ lipUpperMiddle, lipUpperRight ]
			
			// const lowerLip = [ lipLowerLeft, lipLowerMiddle, lipLowerRight ]

			// const upperLip = sqrt( lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY )
			
			 //const lipVerticalOpening = lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY
			prediction.mouthRange = lipVerticalOpening
			prediction.mouthRatio = lipVerticalOpening / headHeight
			prediction.mouthWidth = lipHorizontalOpening

			// TODO: this is the size of the mouth as a factor of the head size
			prediction.mouthOpen = lipVerticalOpening / (headHeight * RATIO_OF_MOUTH_TO_FACE)

			// These are the angles caused by smiling
			// We add them together and deduct them from 180 to find
			// the kinked angle of the top lip between left - feltrum - right
			const leftSmirk = Math.abs( determineAngle(lipUpperLeft, lipUpperMiddle) ) / PI
			const rightSmirk = Math.abs( determineAngle(lipUpperMiddle, lipUpperRight) ) / PI

			// 0 -> 1 ()
			// the range is pretty much empty between 0->0.9
			prediction.happiness = 10 * (((leftSmirk + rightSmirk) * 0.5)  - 0.9)
			// 0 -> 1
			prediction.leftSmirk = (leftSmirk - 1) * 100000
			prediction.rightSmirk = (rightSmirk - 1) * 100000

			// useful sometimes (different time to audio context?)
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

		// loop or use worker???
		if (repeat)
		{
			requestAnimationFrame( () => update(repeat, callback, isPaused) )
		}
	}
	return update
}

