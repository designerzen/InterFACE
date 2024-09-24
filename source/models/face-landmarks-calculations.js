import { easeInQuint, easeOutQuint, easeOutSine } from '../maths/easing'
import {
	clamp, 
	hypoteneuse2D,hypoteneuse3D,
	distanceBetween2Points,distanceBetween3Points,
	determineAngle, twist, 
	TAU,HALF_PI
} from '../maths/maths'


import {
	FACE_CONTOURS,
	FACE_CONTOURS_LIPS,
	FACE_CONTOURS_OUTER_TOP_LIP,
	LIP_PATH_OUTER,
	LIP_PATH_INNER,
	MOUTH_SHAPE_CLOSED,
	MOUTH_SHAPE_O,
	MOUTH_SHAPE_E,
	MOUTH_SHAPE_I,
	MOUTH_SHAPE_U,
	RATIO_OF_MOUTH_TO_FACE,
	EYE_CLOSED_AT,
	PITCH_SCALE
} from './face-model-constants'

/*
const drawingUtils = new DrawingUtils(canvasCtx);

// TODO: Check out 
FaceLandmarker.FACE_LANDMARKS_TESSELATION
drawingUtils.drawConnectors(
	landmarks,
	FaceLandmarker.FACE_LANDMARKS_TESSELATION,
	{ color: "#C0C0C070", lineWidth: 1 }
  );
*/


// FACE_LANDMARKS_LIPS: Connection[];
// /** Landmark connections to draw the connection between a face's left eye. */
//  FACE_LANDMARKS_LEFT_EYE: Connection[];
// /**
//  * Landmark connections to draw the connection between a face's left eyebrow.
//  */
// FACE_LANDMARKS_LEFT_EYEBROW: Connection[];
// /** Landmark connections to draw the connection between a face's left iris. */
// FACE_LANDMARKS_LEFT_IRIS: Connection[];
// /** Landmark connections to draw the connection between a face's right eye. */
// FACE_LANDMARKS_RIGHT_EYE: Connection[];
// /**
//  * Landmark connections to draw the connection between a face's right
//  * eyebrow.
//  */
// FACE_LANDMARKS_RIGHT_EYEBROW: Connection[];
// /**
//  * Landmark connections to draw the connection between a face's right iris.
//  */
// FACE_LANDMARKS_RIGHT_IRIS: Connection[];
// /** Landmark connections to draw the face's oval. */
// FACE_LANDMARKS_FACE_OVAL: Connection[];
// /** Landmark connections to draw the face's contour. */
// FACE_LANDMARKS_CONTOURS: Connection[];
// /** Landmark connections to draw the face's tesselation. */
// FACE_LANDMARKS_TESSELATION: Connection[];


// ** === ^ == Math.pow in ECMA22
const {PI, abs, sqrt, atan2, tan} = Math

const MIN_MOUTH_VALUE = 0.01

/**
 * TODO: Implement a cache of eyes so that we can learn on the go
 * @param {Object} prediction - ML vision-kit model
 * @param {Number} time - time elapsed
 * @param {Boolean} flipHorizontally - are we flipping the data?
 * @returns {Object} enhanced prediction with extra info and data
 */
export const enhanceFaceLandmarksModelPrediction = ( faceLandmarks, faceBlendshapes, facialTransformationMatrixes, time, flipHorizontally = true) => {

	// Blendshapes infor courtesy of 
	// https://developer.apple.com/documentation/arkit/arfaceanchor/blendshapelocation/
	const keypoints = faceLandmarks
	const landmarks = faceBlendshapes.categories

	if(	flipHorizontally )
	{
		faceLandmarks.forEach( faceLandmark => {
			faceLandmark.x = 1 - faceLandmark.x	
		})
		
	}else{

	}
	
	const prediction = {
		flipped:flipHorizontally,
		keypoints,
		faceBlendshapes,
		faceLandmarks,
		facialTransformationMatrixes
	}

	// first create an output that contains everything then overwrite it
	// you can remove this for speed reasons if you are providing a full options config
	// options = { ...DEFAULT_OPTIONS, ...options }
	
	// This is a virtual line from the top of the head to the bottom...
	// we can use this and the eyes to determine face roll, pitch, yaw
	// we can use the bounding box or actual face mesh coords
	let topOfHead = 0
	let bottomOfHead = Number.POSITIVE_INFINITY

	let referenceTopOfHead
	let referenceBottomOfHead 

	let pointApexOfHead = keypoints[152]
	let pointBottomOfChin  = keypoints[10]

	// FIXME:
	let pointLeftOfFace  = keypoints[234]
	// let pointRightOfFace  = keypoints[454]
	// let pointRightOfFace  = keypoints[356]
	let pointRightOfFace  = keypoints[447]

	const annotations = {}
	
	// Head ------------------------------------------------------
	
	// 1, 4, 5, 195, 197 are all nose based
	const pointNoseTip = keypoints[4]
	const pointForehead = keypoints[9]
	const pointFeltrum = keypoints[0]

	// const pointTopOfHead = keypoints[109]
	// const pointBottomOfHead = keypoints[400]
	// const centerOfHead = keypoints[168]
	// const forehead = keypoints[10]
	
	// Calculate some sizes : size of head from chin to top
	// const headHeight = bottomOfHead[1] - topOfHead[1]
	const headHeight = hypoteneuse2D( pointApexOfHead, pointBottomOfChin )
	prediction.headHeight = headHeight
	//console.error("head", {topOfHead: pointTopOfHead, bottomOfHead: pointBottomOfHead}, headHeight )
	
	// This is a virtual line from the top of the head to the bottom...
	// we can use this and the eyes to determine face roll, pitch, yaw
	// we can use the bounding box or actual face mesh coords
	annotations.headVertical = [
		pointApexOfHead, pointNoseTip, pointBottomOfChin
	]

	// Eyes ------------------------------------------------------
	
	// Which way are we facing?
	// const eyeDirection = widthLeftEye / widthRightEye

	// eye blink!
	const leftBlink = landmarks[9].score
	const rightBlink = landmarks[10].score

	// eye blink!
	const leftSquint = landmarks[19].score
	const rightSquint = landmarks[20].score

	// eye directions!
	const leftEyeLookDown = landmarks[11].score
	const rightEyeLookDown = landmarks[12].score

	const leftEyeLookIn = landmarks[13].score
	const leftEyeLookInReversed = 1 - leftEyeLookIn
	const rightEyeLookIn = landmarks[14].score

	const leftEyeLookOut = landmarks[15].score
	const rightEyeLookOut = landmarks[16].score

	const pointLeftEyeSocketOuter = keypoints[362]
	const pointLeftEyeCaruncle = keypoints[263]

	const pointRightEyeSocketOuter = keypoints[133]
	const pointRightEyeCaruncle = keypoints[33]
	
	// Eye socket extents - size of each individual eye sockets heights (eye lid openings)
	// const leftEyeSocketHeight =	hypoteneuse2D( annotations.leftEye[0], annotations.leftEye[4] )
	// const rightEyeSocketHeight = hypoteneuse2D( annotations.rightEye[0], annotations.rightEye[4] )
	// const leftEyeSocketHeight = hypoteneuse2D( keypoints[257], keypoints[253] )
	// const rightEyeSocketHeight = hypoteneuse2D( keypoints[27], keypoints[23] ) 
	const leftEyeSocketWidth = hypoteneuse2D( pointLeftEyeSocketOuter, pointLeftEyeCaruncle)
	const rightEyeSocketWidth = hypoteneuse2D( pointRightEyeSocketOuter, pointRightEyeCaruncle )
	
	

	// which ways are the eyes pointing to? we want from -1 -> 1
	// left is -ve right is +ve
	// 16 is right eye 0 -> 1 and 14 is 1 -> 0
	// -1 -> +1
	prediction.rightEyeDirection = rightEyeLookOut + rightEyeLookIn - 1 
	prediction.leftEyeDirection = leftEyeLookOut + leftEyeLookOut - 1
	
	// Up down, 
	prediction.leftEyeVertical =  2 * leftEyeLookDown - 1
	prediction.rightEyeVertical = 2 * rightEyeLookDown - 1

	// prediction.rightEyeDirection = (landmarks[16].score + landmarks[14].score) - 1 
	// prediction.leftEyeDirection = (landmarks[13].score + landmarks[15].score)  - 1

	// console.log( "right eye",landmarks[16].score, landmarks[14].score, prediction.rightEyeDirection )

	// -1 -> +1
	prediction.eyesHorizontal = 0.5 * ( prediction.rightEyeDirection + prediction.leftEyeDirection ) 
	
	// 0 -> 1  
	prediction.gazeHorizontal = ( 0.5 * prediction.eyeDirection ) + 0.5
	
	// -1 -> 1:
	prediction.eyesVertical =  0.5 * ( prediction.leftEyeVertical + prediction.rightEyeVertical ) 
	
	// 0 -> 1  
	prediction.gazeVertical =  ( 0.5 * prediction.eyesVertical ) + 0.5
	
	prediction.isLookingRight = prediction.eyeDirection > 0
	
	// before an eye blink is the squint!
	prediction.eyeSquintLeft = leftSquint
	prediction.eyeSquintRight = rightSquint

	//	
	prediction.leftEyeClosedBy = leftBlink
	prediction.rightEyeClosedBy = rightBlink 

	// how much is considered open????
	prediction.leftEyeClosed = leftBlink > 0.6
	prediction.rightEyeClosed = rightBlink > 0.6

	// both together
	prediction.eyesClosed = prediction.leftEyeClosed && prediction.rightEyeClosed

	// console.error("eyes", {pointBetweenTheEyes,distanceBetweenIrises,leftEyeSocketHeight,rightEyeSocketHeight, l:annotations.leftEye, r:annotations.rightEye, leftEyeSocketWidth, rightEyeSocketWidth }, eyes )

	
	// - EYEBROWS ---------------------------------------------------
	
	const browInnerUp = landmarks[3].score

	const browDownRight = landmarks[2].score
	const browOuterUpRight = landmarks[5].score

	const browDownLeft = landmarks[1].score
	const browOuterUpLeft = landmarks[4].score
	
	// -1 -> +1
	prediction.leftEyebrowRaisedBy = browOuterUpLeft - browDownLeft
	prediction.rightEyebrowRaisedBy = browOuterUpRight - browDownRight
	prediction.eyebrowsRaisedBy = browInnerUp



	// - MOUTH ------------------------------------------------------
	

	// mouth roll (can be used instead of jaw!)
	// this is when you suck in your lips
	const mouthRollUpper = landmarks[41].score
	const mouthRollLower = landmarks[40].score

	// smirking
	const mouthSmileLeft = landmarks[44].score
	const mouthSmileRight = landmarks[45].score

	// gurning
	const mouthStretchLeft = landmarks[46].score
	const mouthStretchRight = landmarks[47].score

	const jawOpeness = landmarks[25].score
	const jawCloseness = 1 - jawOpeness
	const mouthCloseness = landmarks[27].score
	const mouthOpeness = 1 - mouthCloseness

	// get smallest value
	const mouthRatio = Math.min(jawOpeness, mouthOpeness)

	// mouth may be closed whilst jaw is open

	// ooooooo
	const mouthFunnel = landmarks[32].score
	// kissing
	const mouthPucker = landmarks[38].score

	
	// Calculate some mouth info :
	// how seperated are the lips from one another (or how much is the bottom lip furled)
	// const mouthOpeness = Math.max( jawOpeness, mouthRollLower)
	const isMouthOpen = mouthRatio > MIN_MOUTH_VALUE
	// is wider than tall?
	const isMouthWide = mouthFunnel > jawOpeness
	// smooth data
	const openCoefficient = easeOutQuint(1 - mouthRatio )
	
	// TODO: JawLeft and jawRight for FALSETTO
	prediction.mouthRatio = easeOutSine( Math.max( 0, mouthRatio - MIN_MOUTH_VALUE) ) 
	prediction.mouthPucker = mouthPucker
	prediction.mouthFunnel = mouthFunnel
	prediction.mouthStretchLeft = mouthStretchLeft
	prediction.mouthStretchRight = mouthStretchRight

	prediction.isMouthOpen = isMouthOpen
	prediction.leftSmirk = mouthSmileLeft
	prediction.rightSmirk = mouthSmileRight
	
	// as mouth opens... happiness falls at the point where the 
	prediction.happiness = ( ( prediction.rightSmirk + prediction.leftSmirk ) / 2 ) * openCoefficient // mouthSmileLeft



	// TODO: FIXME: mouth shape fixing
	// if it is wider than tall - E
	// if it is about the same width as height - O
	prediction.mouthShape = isMouthOpen ? 
								(isMouthWide ? 
									MOUTH_SHAPE_O : 
									mouthRollUpper > 0.1 ?  
										MOUTH_SHAPE_U :
										mouthFunnel > 0.1 ? MOUTH_SHAPE_I : 
											MOUTH_SHAPE_E )
												: MOUTH_SHAPE_CLOSED
							
	// - NOSE! -------------------------------------------------------
	
	prediction.noseSneerLeft = landmarks[50].score
	prediction.noseSneerRight = landmarks[51].score

	// - BOUNDING BOX ------------------------------------------------
	
	prediction.box = {
		xMin:flipHorizontally ? 1 - pointLeftOfFace.x : pointLeftOfFace.x,
		xMax:flipHorizontally ? 1 - pointRightOfFace.x : pointRightOfFace.x,
		yMin:pointBottomOfChin.y,
		yMax:pointApexOfHead.y,
	}

	// - ORIENTATION ------------------------------------------------
	
	// To determine the orientation and angle of the head we do
	// some triangulation to draw right angles where we can infer
	// using trigonometry the angles against themn
	
	// FIXME: as this is -1 -> 1 we need to wrap it better
	const rawYaw = flipHorizontally ?  
						leftEyeSocketWidth / rightEyeSocketWidth :
						rightEyeSocketWidth / leftEyeSocketWidth  

	const regulatedYaw = (rawYaw - 1) * 2
	
	// this maps from 2 -> 0
	const yaw = clamp( regulatedYaw < 0 ? regulatedYaw * 2 : regulatedYaw, -1, 1 )
	
	// if either eye is lower than the other : 
	// triangle between eye extents and vertical
	const rollX = flipHorizontally ? 
		pointRightEyeSocketOuter.x - pointLeftEyeSocketOuter.x :
		pointLeftEyeSocketOuter.x - pointRightEyeSocketOuter.x 
				
	const rollY = pointLeftEyeSocketOuter.y - pointRightEyeSocketOuter.y
	const rollRegular = atan2(rollX, rollY) 
	const rawRoll = flipHorizontally ? -rollRegular : rollRegular
	const regulatedRoll = ( rawRoll + Math.PI * 0.5) * 1.3
	const roll = clamp( regulatedRoll, -1, 1 )
	
	// we use two lengths to determine the angles
	// to determine how much the head is rocking forwards and backwards
	// a triangle can be created  
	// const distanceFromFeltrumToForeHead = hypoteneuse3D( feltrum, forehead )	

	// UP & DOWN in RADIANS
	const pitchDepth = ( pointApexOfHead.z - pointBottomOfChin.z )
	const pitchHeight = ( pointApexOfHead.y - pointBottomOfChin.y )
	const pitchInRadians = ( atan2( pitchDepth, pitchHeight) ) * 1.5
	const pitch = clamp( pitchInRadians, -1, 1)




	prediction.isFacingRight = yaw > 0


	// leaning head as if to look at own chest / sky
	prediction.pitch = pitch
	// tilting head towards shoulders
	prediction.roll = roll
	// regular left right neck rotational movement
	prediction.yaw = yaw

	// useful sometimes (different time to audio context?)
	prediction.time = time	

	return prediction
}
