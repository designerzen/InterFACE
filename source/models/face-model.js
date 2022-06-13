import {
	clamp, 
	distanceBetween2Points,distanceBetween3Points,
	determineAngle, twist, TAU,HALF_PI} from '../maths/maths'

const {PI, abs, sqrt, atan2, tan} = Math

// a mouth covers about 1/3 of the face?
const RATIO_OF_MOUTH_TO_FACE = 0.25
const EYE_CLOSED_AT = 20.2 //.5
const PITCH_SCALE = 8

// What the face is observing in a cone shape...
const fieldOfView = (dfov, w, h) => {
    const hypothenuse = sqrt( w ** 2 + h ** 2 )
    const tanDFOV = tan(dfov / 2)
    return [2 * atan(w * tanDFOV / hypothenuse), 2 * atan(h * tanDFOV / hypothenuse)]
}

const setOrientation = () => {
	

}

// NB. we will use time for smoothing out the eyes
const setEyeData = (annotations, prediction, time, flipHorizontally = true) => {
	
}


// TODO: Implement a cache of eyes so that we can learn on the go
export const enhancePrediction = (prediction, time, flipHorizontally = true) => {

	// more than likely there is a face on the screen :P
	const {boundingBox, mesh, scaledMesh, annotations} = prediction
	//const {bottomRight, topLeft} = boundingBox
	
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
	const headHeight = distanceBetween2Points(bottomOfHead, topOfHead)





	// Eyes ---------------------
	// setEyeData( annotations, prediction, time, flipHorizontally )
	
	// There are three points on the face that we can compare against
	const { leftEyeIris,leftEyeLower0,leftEyeLower1,leftEyeUpper1, 
			rightEyeIris,rightEyeLower0,rightEyeLower1, rightEyeUpper0,rightEyeUpper1,
			midwayBetweenEyes } = annotations

	// eyes pointing in directions?
	const irisLeftX = leftEyeIris[0]
	const irisRightX = rightEyeIris[0]

	const midPointVector = midwayBetweenEyes[0]
	const midwayBetweenEyesX = midPointVector[0] 
	const midwayBetweenEyesY = midPointVector[1] 

	const distanceBetweenEyes =	distanceBetween2Points(irisLeftX, irisRightX)
	
	// Are we looking right or left?
	const lookingRight = irisLeftX[2] < irisRightX[2]

	// -1 -> +1
	const eyeDirection = (2 * ( midPointVector[0] - irisLeftX[0] ) / distanceBetweenEyes) - 1

	// Now eyes open calcs
	const eyeSocketHeight = distanceBetween3Points(leftEyeUpper1[ 3 ],rightEyeUpper1[ 3 ])
	// FIXME: 
	const eyeScale = eyeSocketHeight / 80

	

	// Check for eyes closed
	const leftEyesDist = distanceBetween3Points(leftEyeLower1[ 4 ], leftEyeUpper1[ 4 ])
	const rightEyesDist = distanceBetween3Points(rightEyeLower1[ 4 ], rightEyeUpper1[ 4 ])

	const leftIrisHeight = leftEyeIris[4][1] - leftEyeIris[2][1]
	const rightIrisHeight = rightEyeIris[4][1] - rightEyeIris[2][1]
	
	//console.log("Eyes : ",{leftIrisHeight, leftEyesDist, rightIrisHeight, rightEyesDist, eyeSocketHeight, eyeScale } )

	// add in some extras to make things easier 
	// the midpoint can be used to triangulate the yaw
	const lx = leftEyeLower0[0][0] 
	const rx = rightEyeLower0[0][0] 

	const ly = leftEyeLower0[0][1] 
	const ry = rightEyeLower0[0][1] 

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







	
	// lengths of the triangle
	const lmx = (midwayBetweenEyesX - lx) * -1
	const rmx = midwayBetweenEyesX - rx

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
	
	// const lowerLip = [ lipLowerLeft, lipLowerMiddle, lipLowerRight ]

	// const upperLip = sqrt( lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY )
	
	
	prediction.headHeight = headHeight
	
	//const lipVerticalOpening = lipVerticalOpeningX * lipVerticalOpeningX + lipVerticalOpeningY * lipVerticalOpeningY
	prediction.mouthRange = lipVerticalOpening
	prediction.mouthRatio = lipVerticalOpening / headHeight
	prediction.mouthWidth = lipHorizontalOpening

	// TODO: this is the size of the mouth as a factor of the head size
	prediction.mouthOpen = lipVerticalOpening / (headHeight * RATIO_OF_MOUTH_TO_FACE)




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

	
	// useful sometimes (different time to audio context?)
	prediction.time = time	

	return prediction
}
