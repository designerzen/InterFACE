export const TAU = 2 * Math.PI
export const HALF_PI = Math.PI * 0.5

const {PI, sqrt, atan2, tan} = Math

// provide the value and a smallest and largest original then new sizes
// Functional Program
export const rescale = ( smallest, largest=1) => {
    // find the scale and create a method that allows 
    // you to simply rescale at will
    const range = 1 / ( largest - smallest )

    // return a method that you can pass a value to
    return value => range * ( value - smallest )
}

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

export const lerp = (start, end, amt) => (1-amt) * start + amt * end

// Restrict between
export const clamp = (val, min, max) => val > max ? max : val < min ? min : val

// cheaper than TAN
export const twist = (value, amount=0) => {

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