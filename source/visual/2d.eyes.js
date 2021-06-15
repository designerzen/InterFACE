import {canvasContext} from './canvas'
import { clamp, TAU } from "../maths/maths"
import PALETTE, { DEFAULT_COLOURS } from "../palette"

const DEFAULT_OPTIONS = {
	iris:"rgba(100,255,100,0.8)", 
	irisRadius : 1,
	pupil:"rgba(0,0,0,0.8)",
	pupilRadius:0.3
}

//////////////////////////////////////////////////////////////////////
// Draw an Eye from the EYE Model object
//////////////////////////////////////////////////////////////////////
export const drawEye = ( eyeData, isLeft=true, open=true, options=DEFAULT_OPTIONS ) => {
	
	const pupil = eyeData[0]
	const inner = eyeData[1]
	const up = eyeData[2]
	const outer = eyeData[3]
	const down = eyeData[4]
	const irisWidth = Math.abs(outer[0] - inner[0] )
	const irisHeight = down[1] - up[1]
	
	// const irisHeight = Math.abs( up[1] - down[1])
	const diameter = Math.max(irisWidth , irisHeight)
	const radius = diameter * 0.5
	
options = { ...DEFAULT_OPTIONS, options }

	// console.log( {eyeData, irisWidth,irisHeight, diameter, options })

	canvasContext.strokeWidth = 0
	
	// draw iris path


	// arc(x, y, radius, startAngle, endAngle, counterClockwise) 
	// straight lines
	// canvasContext.moveTo(up[0], up[1])
	// canvasContext.lineTo(inner[0], inner[1])
	// canvasContext.lineTo(down[0], down[1])
	// canvasContext.lineTo(outer[0], outer[1])
	// canvasContext.moveTo(up[0], up[1])
	// canvasContext.arcTo(inner[0], inner[1])
	// canvasContext.arcTo(down[0], down[1])
	// canvasContext.arcTo(outer[0], outer[1])
	// canvasContext.arcTo(up[0], up[1])

	if (open)
	{
		// round no perspective...
		canvasContext.beginPath()
		canvasContext.fillStyle  = 'white'
		canvasContext.arc(pupil[0], pupil[1], 4 * radius, 0, TAU)
		canvasContext.fill()
		canvasContext.closePath()

		canvasContext.beginPath()
		canvasContext.fillStyle  = options.iris
		canvasContext.arc(pupil[0], pupil[1], radius, 0, TAU)

		// canvasContext.arcTo(up[0], up[1], inner[0], inner[1], options.irisRadius)
		// canvasContext.arcTo(inner[0], inner[1], down[0], down[1], options.irisRadius)
		// canvasContext.arcTo(down[0], down[1], outer[0], outer[1], options.irisRadius)
		// canvasContext.arcTo(outer[0], outer[1], up[0], up[1], options.irisRadius)
		// canvasContext.fill()
		//canvasContext.arc(pupil[0], pupil[1], radius * options.irisRadius, 0, TAU)
		// canvasContext.ellipse(pupil[0], pupil[1], irisWidth, irisHeight, 0, 0, TAU)
		// canvasContext.ellipse(pupil[0], pupil[1], irisHeight, irisWidth, 0, 0, TAU)
		canvasContext.fill()
		canvasContext.closePath()

		// 1 + clamp( (10+iris[2]) * 0.8, 5, 10 )
		canvasContext.beginPath()
		canvasContext.fillStyle  = options.pupil
		canvasContext.arc(pupil[0], pupil[1], radius * options.pupilRadius, 0, TAU)
		canvasContext.fill()
	}else{
		// draw cute triangle?
		// FIXME: make sure they are left and right!
		canvasContext.beginPath()
		canvasContext.fillStyle = options.iris
		canvasContext.fillRect( 
			(!isLeft ? inner[0] : outer[0]), 
			(!isLeft ? inner[1] : outer[1]), 
			irisWidth * 4, 
			irisHeight 
		)

		// canvasContext.rect(pupil[0], pupil[1], diameter, diameter * 0.2 )
		canvasContext.fill()
	}
	

	/*
	radius = 4
	canvasContext.beginPath()
	canvasContext.fillStyle  = 'blue'
	canvasContext.arc(up[0], up[1], radius, 0, TAU)
	canvasContext.fill()
	canvasContext.closePath()

	canvasContext.beginPath()
	canvasContext.fillStyle  = 'purple'
	canvasContext.arc(outer[0], outer[1], radius, 0, TAU)
	canvasContext.fill()
		
	canvasContext.beginPath()
	canvasContext.fillStyle  = 'green'
	canvasContext.arc(down[0], down[1], radius, 0, TAU)
	canvasContext.fill()

	canvasContext.beginPath()
	canvasContext.fillStyle  = 'yellow'
	canvasContext.arc(inner[0], inner[1], radius, 0, TAU)
	canvasContext.fill()
	*/

	/*
	// there are four outer balls
	for (let i = 0  ; i < eye.length -1; i++ ) 
	{
		const x = eye[i][0]
		const y = eye[i][1]
		const z = eye[i][2]

		// const radius = 1 + clamp( (10+z) * 0.8, 5, 10 )
		// canvasContext.arc(x, y, radius, 0, TAU)
		// canvasContext.fill()

		if (i > 0)
		{
			const arcLength = 7 ;//Math.abs( i%2 ? iris - x : iris - y )
			const previous = eye[i-1]
			canvasContext.arcTo(previous[0],previous[1], x,y,arcLength)
		}
	}*/
	// canvasContext.stroke()
}
