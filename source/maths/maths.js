export const TAU = 2 * Math.PI
export const HALF_PI = Math.PI * 0.5
export const TWO_PI = Math.PI * 2

const {PI, sqrt, atan2, tan} = Math

export const range = (input, inputMin, inputMax, outputMin, outputMax) => {
	const value = (input - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin
	if (value < outputMin) {return outputMin}
	else if (value > outputMax) {return outputMax}
	return value
}

export const rangeRounded = (input, inputMin, inputMax, outputMin, outputMax ) => {
	const value = Math.round( (input - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin )
	if (value < outputMin) {return outputMin}
	else if (value > outputMax) {return outputMax}
	return value
}

// provide the value and a smallest and largest original then new sizes
// Functional Program
export const rescale = ( smallest=0, largest=1 ) => {
    // find the scale and create a method that allows 
    // you to simply rescale at will
    const fullRange = 1 / ( largest - smallest )

    // return a method that you can pass a value to
    return value => fullRange * ( value - smallest )
}

// Feed it a right angle triangle and get the angle between the edges
export const determineAngle = ( pointA, pointB ) => {

	// work out the lengths of the known edges
	const oppositeLength = pointA.y - pointB.y
	const adjacentLength = pointB.x - pointA.x
	const angleInRadians = atan2(oppositeLength, adjacentLength)
	// process?
	return angleInRadians
}
// ** === ^
/*
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
*/
export const distance3D = (aX,bX,  aY,bY, aZ,bZ ) => sqrt(
    (aX - bX) ** 2 + 
    (aY - bY) ** 2 + 
    (aZ - bZ) ** 2
)

// distance between a & b via right angled triangle
export const distance2D = (aX,aY,bX,bY) => sqrt(
    (aX - bX) ** 2 + 
    (aY - bY) ** 2
)

// distance between a & b via right angled triangle
export const hypoteneuse2D = ( pointA,pointB) => sqrt(
    (pointA.x - pointB.x) ** 2 + 
    (pointA.y - pointB.y) ** 2
)
export const hypoteneuse3D = (pointA, pointB) => sqrt(
    (pointA.x - pointB.x) ** 2 + 
    (pointA.y - pointB.y) ** 2 +
    (pointA.z - pointB.z) ** 2
)


export const add3D = (a, b, output={} ) => {
	output.x = a.x + b.x
	output.y = a.y + b.y
	output.z = a.z + b.z
	return output
}

export const subtract3D = (a, b, output={} ) => {
	output.x = a.x - b.x
	output.y = a.y - b.y
	output.z = a.z - b.z
	return output
}

// multiply points
export const  multiply3D = (a, b, output={} ) => {
	output.x = a.x * b.x
	output.y = a.y * b.y
	output.z = a.z * b.z	
	return output
}

export const cross3D = (a, b, output={} ) => {
	output.x = a.y * b.z - a.z * b.y
	output.y = a.z * b.x - a.x * b.z
	output.z = a.x * b.y - a.y * b.x
	return output
}

export const divide3D = (a, b, output={} ) => {
	output.x = a.x / b.x
	output.y = a.y / b.y
	output.z = a.z / b.z
	return output
}


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



// export const lerp = (a, b, t) => (b-a)*t+a
// export const unlerp = (a, b, t) => (t-a)/(b-a)
// export const remap = (a1, b1, a2, b2, t) => lerp(a2, b2, unlerp(a1, b1, t))


export const round = (somenum) => {
	// With a bitwise or.
	return (0.5 + somenum) | 0
	// A double bitwise not.
	return ~~ (0.5 + somenum)
	// Finally, a left bitwise shift.
	return (0.5 + somenum) << 0
}
