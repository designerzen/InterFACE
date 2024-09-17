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
} from './face-landmark-constants'


// ** === ^ == Math.pow in ECMA22
const {PI, abs, sqrt, atan2, tan} = Math


// What the face is observing in a cone shape...
const fieldOfView = (dfov, width, height) => {
    const hypothenuse = sqrt( width * width + height * height )
    const tanDFOV = tan(dfov / 2)
    return [2 * atan(width * tanDFOV / hypothenuse), 2 * atan(height * tanDFOV / hypothenuse)]
}

// const setOrientation = () => {
	

// }

// // NB. we will use time for smoothing out the eyes
// const setEyeData = (annotations, prediction, time, flipHorizontally = true) => {
	
// }

// 



/**
 * TODO: Implement a cache of eyes so that we can learn on the go
 * @param {Object} prediction - ML TF model
 * @param {Number} time - time elapsed
 * @param {Boolean} flipHorizontally - are we flipping the data?
 * @returns {Object} enhanced prediction with extra info and data
 * 
 * annotations
 * annotations.faceOval
 * annotations.leftEye
 * annotations.leftEyebrow
 * annotations.leftIris
 * annotations.rightEye
 * annotations.rightEyebrow
 * annotations.rightIris
 * annotations.outerLip 
 * annotations.innerLip 
 * 
 * headHeight
 * 
 */
export const enhanceFaceModelPrediction = (prediction, time, flipHorizontally = true) => {

	if (!prediction)
	{
		throw Error("This is *not* a valid prediction")
	}

	// first create an output that contains everything then overwrite it
	// you can remove this for speed reasons if you are providing a full options config
	// options = { ...DEFAULT_OPTIONS, ...options }
	
	const { keypoints, categories } = prediction

	// This is a virtual line from the top of the head to the bottom...
	// we can use this and the eyes to determine face roll, pitch, yaw
	// we can use the bounding box or actual face mesh coords
	let topOfHead = 0
	let bottomOfHead = Number.POSITIVE_INFINITY

	let referenceTopOfHead
	let referenceBottomOfHead 

	let pointApexOfHead = keypoints[152]
	let pointBottomOfChin  = keypoints[10]

	// Try and add all the data points we need here into annotations
	const annotations = {
		
		faceOval:FACE_CONTOURS.faceOval.map( d => {
			
			const point = keypoints[d] 

			// find the point with the highest y
			if (point.y > topOfHead )
			{
				topOfHead = point.y
				referenceTopOfHead = d
			}

			// find the point with the lowest y
			if (point.y < bottomOfHead )
			{
				bottomOfHead = point.y
				referenceBottomOfHead = d
			}
			
			return point
		}),
		
		lips:FACE_CONTOURS.lips.map( d => keypoints[d] ),
		leftEye:FACE_CONTOURS.leftEye.map( d => keypoints[d] ),
		leftEyebrow:FACE_CONTOURS.leftEyebrow.map( d => keypoints[d] ),
		leftIris:FACE_CONTOURS.leftIris.map( d => keypoints[d] ),
		rightEye:FACE_CONTOURS.rightEye.map( d => keypoints[d] ),
		rightEyebrow:FACE_CONTOURS.rightEyebrow.map( d => keypoints[d] ),
		rightIris:FACE_CONTOURS.rightIris.map( d => keypoints[d] )
	}

	// FIXME: There is one point missing here
	annotations.outerLip = LIP_PATH_OUTER.map( d => annotations.lips[d] )
	annotations.innerLip = LIP_PATH_INNER.map( d => annotations.lips[d] )

	// Head ------------------------------------------------------
	
	// 1, 4, 5, 195, 197 are all nose based
	const noseTip = keypoints[4]
	const forehead = keypoints[9]
	const feltrum = keypoints[0]

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
		pointApexOfHead, noseTip, pointBottomOfChin
	]

	// Eyes ------------------------------------------------------

	// IRIS & PUPIL data
	// Extract pupil central location
	const createPupilData = irisData => {

		const inner = irisData[0]
		const up = irisData[1]
		const outer = irisData[2]
		const down = irisData[3]
		
		const irisWidth = Math.abs( inner.x - outer.x )
		const irisHeight = down.y - up.y
		// const irisHeight = Math.abs( up.y - down.y)
	
		const pupil = {
			x: irisWidth * 0.5 + outer.x,
			y: irisHeight * 0.5 + up.y,
			diameter : Math.max(irisWidth , irisHeight)
		}

		return pupil
	}

	const irisDataLeft = createPupilData(annotations.leftIris)
	const irisDataRight = createPupilData(annotations.rightIris)

	//const distanceBetweenIrises = hypoteneuse2D( irisDataLeft, irisDataRight )
	// const pointBetweenTheEyes = keypoints[168]

	// caruncles are the inner eye socket squishy bit near your nose
	const pointLeftEyeSocketOuter = keypoints[362]
	const pointLeftEyeCaruncle = keypoints[263]

	const pointRightEyeSocketOuter = keypoints[133]
	const pointRightEyeCaruncle = keypoints[33]

	// this is the distance between eye parts on the face and can be used
	// for both general gaze direction and scaling, as well as head rotations
	// const widthLeftEye = hypoteneuse2D( pointLeftEyeSocketOuter, pointLeftEyeCaruncle )
	// const widthRightEye = hypoteneuse2D( pointRightEyeCaruncle, pointRightEyeSocketOuter)
	
	// const distanceFromOuterEyeToOuterEye = hypoteneuse2D( pointLeftEyeSocketOuter, pointRightEyeSocketOuter )
	// const distanceBetweenCaruncles = hypoteneuse2D( pointLeftEyeCaruncle, pointRightEyeCaruncle)
	
	const leftEyeSocketWidth = hypoteneuse2D( pointLeftEyeSocketOuter, pointLeftEyeCaruncle)
	const rightEyeSocketWidth = hypoteneuse2D( pointRightEyeSocketOuter, pointRightEyeCaruncle )
	
	annotations.leftEyeSocket = [
		pointLeftEyeSocketOuter, pointLeftEyeCaruncle
	]
	
	annotations.rightEyeSocket = [
		pointRightEyeSocketOuter, pointRightEyeCaruncle
	]
	
	annotations.leftPupil = irisDataLeft
	annotations.rightPupil = irisDataRight

	// which ways are the eyes pointing to? we want from -1 -> 1
	// left is -ve right is +ve
	prediction.rightEyeDirection = (( irisDataRight.x  - pointRightEyeCaruncle.x ) / rightEyeSocketWidth) * -2 + 1
	prediction.leftEyeDirection = (( irisDataLeft.x  - pointLeftEyeSocketOuter.x ) / leftEyeSocketWidth) * 2 - 1
	
	prediction.eyeDirection = 0.5 * ( prediction.rightEyeDirection + prediction.leftEyeDirection ) 
	prediction.isLookingRight = prediction.eyeDirection > 0.5

	// Which way are we facing?
	// const eyeDirection = widthLeftEye / widthRightEye

	// const leftEyeSocketHeight =	hypoteneuse2D( annotations.leftEye[0], annotations.leftEye[4] )
	// const rightEyeSocketHeight = hypoteneuse2D( annotations.rightEye[0], annotations.rightEye[4] )
	
	// Eye socket extents - size of each individual eye sockets heights (eye lid openings)
	// const leftEyeSocketHeight = hypoteneuse2D( keypoints[257], keypoints[253] )
	// const rightEyeSocketHeight = hypoteneuse2D( keypoints[27], keypoints[23] )
	 
	// const leftEyeSocketWidth = hypoteneuse2D( annotations.rightEye[0], annotations.rightEye[4] )
	// const rightEyeSocketWidth = hypoteneuse2D( annotations.rightEye[0], annotations.rightEye[4] )
	
	// console.error("eyes", {pointBetweenTheEyes,distanceBetweenIrises,leftEyeSocketHeight,rightEyeSocketHeight, l:annotations.leftEye, r:annotations.rightEye, leftEyeSocketWidth, rightEyeSocketWidth }, eyes )
	
	// - MOUTH ------------------------------------------------------

	// top 15 indexes are top lip, bottom are all the rest
	
	// annotations.lips[0 - 7]
	// annotations.lips[8]
	// annotations.lips[9 - 14]
	// ------------------------
	// annotations.lips[15 - 26]
	// annotations.lips[27]
	// annotations.lips[28 - 39]

	// Extract mouth dynamics
	const mouthSmileLeft = categories[44].score
	const mouthSmileRight = categories[45].score
	const mouthClose = categories[27].score
	const mouthOpeness = 1 - mouthClose //lipVerticalOpening / mouthSizeInTheory
	const jawOpeness = categories[25].score
	const jawClose = 1 - jawOpeness

	/*
	const lips = annotations.lips
	const lipsLength = lips.length
	const lipLength = 10
	const midLipLength = 5

	// Correct (ish)
	const lipUpperLeft = lips[0]
	const lipLowerLeft = lips[lipLength * 2]

	// Correct
	const lipUpperRight = lips[lipLength * 2]
	const lipLowerRight = lips[lipsLength-1]

	// Correct
	// const lipOuterUpperMiddle = lips[lipLength + midLipLength]
	// const lipOuterLowerMiddle = lips[midLipLength]
	
	// Correct
	const lipInnerUpperMiddle = lips[lipsLength - midLipLength - 1]
	const lipInnerLowerMiddle = lips[lipLength * 2 + midLipLength]
	*/

	const TLC = 14
	const BLC = 15
	const topLipCenter = new THREE.Vector3( points[TLC], points[TLC+1], points[TLC+2] ) 
	const bottomLipCenter = new THREE.Vector3( points[BLC], points[BLC+1], points[BLC+2] ) 
	
	const LMC = 191
	const RMC = 419
	const leftMouthCenter = new THREE.Vector3( points[LMC], points[LMC+1], points[LMC+2] ) 
	const rightMouthCenter = new THREE.Vector3( points[RMC], points[RMC+1], points[RMC+2] ) 

	// mouthCenterPoint.addVectors( topLipCenter, bottomLipCenter ).divideScalar( 2 )
	const lipVerticalOpening = topLipCenter.distanceTo(bottomLipCenter)
	const lipHorizontalOpening = leftMouthCenter.distanceTo(rightMouthCenter)

	
	// const lipHorizontalOpening = (
	// 	hypoteneuse2D( lipLowerLeft, lipLowerRight ) + 
	// 	hypoteneuse2D( lipUpperLeft, lipUpperRight )
	// ) * 0.5
	
	// const mouthSizeInTheory = headHeight * RATIO_OF_MOUTH_TO_FACE
	// const mouthOpeness = lipVerticalOpening / mouthSizeInTheory
	const isMouthOpen = mouthOpeness > 0.25

	// is wider than tall?
	const isMouthWide = lipHorizontalOpening > lipVerticalOpening

	//const lipVerticalOpening = lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY
	prediction.mouthRangeVertical = lipVerticalOpening
	prediction.mouthRangeHorizontal = lipHorizontalOpening
	prediction.mouthHeight = lipVerticalOpening
	prediction.mouthWidth = lipHorizontalOpening
	
	prediction.mouthRatio = mouthOpeness

	// TODO: this is the size of the mouth as a factor of the head size
	prediction.isMouthOpen = isMouthOpen


	// TODO: FIXME: mouth shape fixing
	// if it is wider than tall - E
	// if it is about the same width as height - O
	prediction.mouthShape = isMouthOpen ? 
								(!isMouthWide ? 
									MOUTH_SHAPE_O : 
									MOUTH_SHAPE_E)
								: MOUTH_SHAPE_CLOSED
													
	// These are the angles caused by smiling
	// We add them together and deduct them from 180 to find
	// the kinked angle of the top lip between left - feltrum - right
	// const leftSmirk = abs( determineAngle(lipUpperLeft, lipOuterUpperMiddle) ) / PI
	// const rightSmirk = abs( determineAngle(lipOuterUpperMiddle, lipUpperRight) ) / PI
 	// 0 -> 1
	prediction.leftSmirk = mouthSmileLeft.score
	prediction.rightSmirk = mouthSmileRight.score
	prediction.happiness = (prediction.leftSmirk + prediction.rightSmirk) * 0.5

	// TODO: Mouth normal vector - an arrow coming out of the mouth the size
	// of the amplitude so that we can draw and visualise it on screen

	// - ORIENTATION ------------------------------------------------
	
	// To determine the orientation and angle of the head we do
	// some triangulation to draw right angles where we can infer
	// using trigonometry the angles against themn
	
	// and now we find two edges of the triangle and relate one
	// to each known width - left eye and right eye space
	// const widthBetweenLeftEyeAndCentre = (pointBetweenTheEyes.x - pointLeftEyeSocketOuter.x) * -1
	// const widthBetweenRightEyeAndCentre = pointBetweenTheEyes.x - pointRightEyeSocketOuter.x
	
	// FIXME: as this is -1 -> 1 we need to wrap it better
	const rawYaw = flipHorizontally ?  
						leftEyeSocketWidth / rightEyeSocketWidth :
						rightEyeSocketWidth / leftEyeSocketWidth  

	const regulatedYaw = (rawYaw - 1) * 2
	
	// this maps from 2 -> 0
	const yaw = clamp( regulatedYaw < 0 ? regulatedYaw * 2 : regulatedYaw, -1, 1 )
	


	// if either eye is lower than the other : 
	// triangle between eye extents and vertical
	const rollX = pointLeftEyeSocketOuter.x - pointRightEyeSocketOuter.x
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

	// FIXME: opposite / hypotenuse
	//const pitch = Math.asin(pointBetweenTheEyes.x)
	
	// const distanceFromFeltrumToEyeMidPoint = hypoteneuse3D( feltrum, pointBetweenTheEyes )	
	// if the chin is in front (z) of forehead, head tilting back
	// const pitchAngle = 10 * (atan2( pointBetweenTheEyes.y, feltrum.y ) - 0.7210)
	// const pitchtest = pitchAngle * PI
		 
	// console.log( "Pitch", { pitchAngle, pitchtest, pointBetweenTheEyes} )
	
	/*	

	// Triangulate view cone
	// // const depth = 0.06 * FOCAL_LENGTH * canvas.width / MAX_WIDTH / sqrt((centerX - forehead[0]) ** 2 + (centerY - forehead[1]) ** 2 )
	// // const depth = IRIS_SIZE * FOCAL_LENGTH * canvas.width / MAX_WIDTH / diameter;

	// prediction.lookingRight = flipHorizontally ? !lookingRight : lookingRight

	// Looking left / Right -1 -> 1
	prediction.eyeDirection = eyeDirection 
	prediction.eyeDistance = distanceBetweenIrises
	
	// FIXME: Ideally these give a percentage of open-ness
	// prediction.leftEye = leftEyesDist / eyeScale
	prediction.leftEyeClosed = prediction.leftEye < EYE_CLOSED_AT
	
	// prediction.rightEye = rightEyesDist / eyeScale 
	prediction.rightEyeClosed = prediction.rightEye < EYE_CLOSED_AT
	
	// both together
	prediction.eyesClosed = prediction.leftEyeClosed && prediction.rightEyeClosed



/*
		
	// The rest of the app is expecting a prediction in the following
	// shape with these extra parts and arrays already pre-written
	// save our annotated parts
	prediction.annotations = annotations

	// useful sometimes (different time to audio context?)
	prediction.time = time	

	//console.log("Prediction", prediction,{ widthBetweenLeftEyeAndCentre, widthBetweenRightEyeAndCentre, keypoints, box, annotations })

	console.log( "Prediction", prediction, {annotations})

// return prediction

	// Eyes ---------------------
	// setEyeData( annotations, prediction, time, flipHorizontally )
	
	// eyes pointing in directions
	const { leftEyeIris,leftEyeLower0,leftEyeLower1,leftEyeUpper1, 
			rightEyeIris,rightEyeLower0,rightEyeLower1, rightEyeUpper0, rightEyeUpper1,
			midwayBetweenEyes } = annotations

	const irisLeft = leftEyeIris[0]
	const irisRight = rightEyeIris[0]

	// this is the distance between irises on the face
	const distanceBetweenEyes =	distanceBetween2Points(irisLeftX, irisRightX)
	// Extents of the eye vertically
	const eyeSocketHeight = distanceBetween3Points(leftEyeUpper1[ 3 ], rightEyeUpper1[ 3 ])
	// Extents of the eye horizontally
	const eyeSocketWidth = distanceBetween3Points(leftEyeUpper1[ 0 ],rightEyeUpper1[ 0 ])
	
	const midPointVector = midwayBetweenEyes[0]

	const midwayBetweenEyesX = midPointVector[0] 
	const midwayBetweenEyesY = midPointVector[1] 

	// Are we looking right or left?
	const lookingRight = irisLeftX[2] < irisRightX[2]

	// -1 -> +1
	const eyeDirection = (2 * ( midPointVector[0] - irisLeftX[0] ) / distanceBetweenEyes) - 1

	
	// FIXME: 
	const eyeScale = eyeSocketHeight / 80

	const quantityOfPointsInEye = 5//leftEyeLower1.length 
	let leftEyesDist = 0
	let rightEyesDist = 0

	// Check for eyes closed - we can do this on a loop for better results...
	// originally, p was 4
	for (let p=4; p<quantityOfPointsInEye; ++p)
	{
		leftEyesDist = distanceBetween3Points(leftEyeLower1[ p ], leftEyeUpper1[ p ])
		rightEyesDist = distanceBetween3Points(rightEyeLower1[ p ], rightEyeUpper1[ p ])
	}

	// leftEyesDist /= quantityOfPointsInEye
	// rightEyesDist /= quantityOfPointsInEye

	// const leftIrisHeight = leftEyeIris[4][1] - leftEyeIris[2][1]
	// const rightIrisHeight = rightEyeIris[4][1] - rightEyeIris[2][1]
	
	//console.log("Eyes : ",{leftIrisHeight, leftEyesDist, rightIrisHeight, rightEyesDist, eyeSocketHeight, eyeScale } )

	// add in some extras to make things easier 
	// the midpoint can be used to triangulate the yaw
	const leftEyeLowerX = leftEyeLower0[0][0] 
	const leftEyeLowerY = leftEyeLower0[0][1] 
	
	const rightEyeLowerX = rightEyeLower0[0][0] 
	const rightEyeLowerY = rightEyeLower0[0][1] 


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








	// Nose
	const {noseTip, noseBottom, noseRightCorner} = annotations
	//const {rightCheek,leftCheek, silhouette} = annotations


	
	// lengths of the triangle
	const lmx = (midwayBetweenEyesX - leftEyeLowerX) * -1
	const rmx = midwayBetweenEyesX - rightEyeLowerX

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
	const rollX = (leftEyeLowerX - rightEyeLowerX)
	const rollY = (leftEyeLowerY - rightEyeLowerY)

	// As this is for 350 range, we double to make it just 180
	const roll = flipHorizontally ?  
		-1 * (atan2(rollX, rollY) + HALF_PI)//Math.atan2(rollY, rollX):
		: atan2(rollX, rollY) - HALF_PI
	

	
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
	// const lipVerticalOpeningX = lipLowerMiddle[0] - lipUpperMiddle[0]
	// const lipVerticalOpeningY = lipLowerMiddle[1] - lipUpperMiddle[1]
	
	// const lipHorizontalOpeningX = lipLowerRight[0] - lipLowerLeft[0]
	// const lipHorizontalOpeningY = lipUpperRight[1] - lipUpperLeft[1]
	
	// const lipVerticalOpening = sqrt( lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY )
	// const lipHorizontalOpening = sqrt( lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY )
	const lipVerticalOpening = distanceBetween2Points( lipLowerMiddle,lipUpperMiddle )
	const lipHorizontalOpening = distanceBetween2Points( lipLowerRight, lipLowerLeft )
	
	// create triangles from the shape of the mouth
	// const upperLipLeft = [ lipUpperLeft, lipUpperMiddle ]
	
	// // this is the top left lip to fultrum (snot run)
	// // const upperLipLeftAngle = 
	
	
	// const upperLipRight = [ lipUpperMiddle, lipUpperRight ]
	
	// cona lowerLip = [ lipLowerLeft, lipLowerMiddle, lipLowerRight ]

	// const upperLip = sqrt( lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY )
	
	
	
	//const lipVerticalOpening = lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY
	prediction.mouthRange = lipVerticalOpening
	prediction.mouthRatio = lipVerticalOpening / headHeight
	prediction.mouthWidth = lipHorizontalOpening

	// TODO: FIXME: mouth shape fixing
	prediction.mouthShape = MOUTH_SHAPE_CLOSED




	// These are the angles caused by smiling
	// We add them together and deduct them from 180 to find
	// the kinked angle of the top lip between left - feltrum - right
	const leftSmirk = abs( determineAngle(lipUpperLeft, lipUpperMiddle) ) / PI
	const rightSmirk = abs( determineAngle(lipUpperMiddle, lipUpperRight) ) / PI

	// 0 -> 1 ()
	// FIXME: the range is pretty much empty between 0->0.9
	prediction.happiness = 10 * (((leftSmirk + rightSmirk) * 0.5)  - 0.9)
	// 0 -> 1
	prediction.leftSmirk = (leftSmirk - 1) * 100000
	prediction.rightSmirk = (rightSmirk - 1) * 100000
	*/

	prediction.isFacingRight = yaw > 0


	// leaning head as if to look at own chest / sky
	prediction.pitch = pitch
	// tilting head towards shoulders
	prediction.roll = roll
	// regular left right neck rotational movement
	prediction.yaw = yaw

	// useful sometimes (different time to audio context?)
	prediction.time = time	

	// store new annotations internally
	prediction.annotations = annotations

	return prediction
}
