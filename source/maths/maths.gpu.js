// This uses the fantastic GPU lib to speed up 
// the performance of some of the more conplicated
// maths methods used in the app...

// import { GPU } from 'gpu.js'
// const gpu = new GPU()


// Feed it a right angle triangle and get the angle between the edges
export const determineAngle = ( pointA, pointB ) => {

	// determine missing point?
	// const hypoteneuseX = pointO[0]
	// const hypoteneuseY = pointA[1]

	// work out the lengths of the known edges
	const oppositeLength = pointA[1] - pointB[1] 
	const adjacentLength = pointB[0] - pointA[0]

	const angleInRadians = atan2(oppositeLength, adjacentLength)
	// process?
	return angleInRadians
}
// distance between a & b via right angled triangle
export const distanceBetween2Points = (pointA, pointB) => sqrt(
    ( pointA[ 0 ] - pointB[ 0 ] ) ** 2 + 
    ( pointA[ 1 ] - pointB[ 1 ] ) ** 2
)
export const distanceBetween3Points = (pointA, pointB) => sqrt(
    ( pointA[ 0 ] - pointB[ 0 ] ) ** 2 + 
    ( pointA[ 1 ] - pointB[ 1 ] ) ** 2 +
    ( pointA[ 2 ] - pointB[ 2 ] ) ** 2
)

export const distance3D = (aX,bX,  aY,bY, aZ,bZ ) => sqrt(
    (aX - bX) ** 2 + 
    (aY - bY) ** 2 + 
    (aZ - bZ) ** 2
)

// distance between a & b via right angled triangle
export const distance2D = (aX,bX,aY,bY) => sqrt(
    (aX - bX) ** 2 + 
    (aY - bY) ** 2
)


// TODO Ease equations...