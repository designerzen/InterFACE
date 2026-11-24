import { TAU } from "../maths/maths.js"

const DEFAULT_OPTIONS = Object.freeze({
	// colourful part of the eye
	iris:"rgba(100,255,100,0.8)", 
	irisRadius : 1,
	// holes in the eyes
	pupil:"rgba(0,0,0,0.8)",
	pupilRadius:0.3,
	// big white bit of the eye
	sclera:'white',
	scleraRadius:4,
	outline:false,
	ratio:1,
	// sometimes x,y,z are returned as widths already
	scaleX:1,
	scaleY:1,
})

const drawPupilPath = (context, x, y, radius, design) => {
	if (design === 'heart')
	{
		context.moveTo(x, y + radius)
		context.bezierCurveTo(x - radius * 2, y - radius * 0.2, x - radius, y - radius * 1.6, x, y - radius * 0.5)
		context.bezierCurveTo(x + radius, y - radius * 1.6, x + radius * 2, y - radius * 0.2, x, y + radius)
	}else if (design === 'cat'){
		context.ellipse(x, y, radius * 0.25, radius, 0, 0, TAU)
	}else if (design === 'star' || design === 'diamond'){
		const count = design === 'star' ? 10 : 4
		for (let index = 0; index < count; index++)
		{
			const angle = index * TAU / count - Math.PI / 2
			const size = radius * (design === 'star' && index % 2 ? 0.45 : 1)
			const px = x + Math.cos(angle) * size
			const py = y + Math.sin(angle) * size
			if (index === 0) context.moveTo(px, py)
			else context.lineTo(px, py)
		}
		context.closePath()
	}else{
		context.arc(x, y, radius, 0, TAU)
	}
}

const getEyeDiameter = (eyeData, options) => {
	const points = Array.isArray(eyeData)
		? eyeData.filter(point => Number.isFinite(point?.x) && Number.isFinite(point?.y))
		: []
	if (points.length < 2)
	{
		return 8
	}
	const xs = points.map(point => point.x * options.scaleX)
	const ys = points.map(point => point.y * options.scaleY)
	const width = Math.max(...xs) - Math.min(...xs)
	const height = Math.max(...ys) - Math.min(...ys)
	return Math.max(8, Math.max(width, height) * 0.65)
}

const unit = value => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0

/** Continuous eyelid controls; binary closure is only a fallback for older models. */
export const getEyeExpression = (prediction = {}, side = 'left', open = true) => {
	const suffix = side === 'left' ? 'Left' : 'Right'
	const blink = prediction[`${side}EyeClosedBy`]
	const squint = unit(prediction[`eyeSquint${suffix}`])
	const sadness = Math.max(unit(prediction.sadness), unit(prediction.eyebrowsInnerRaisedBy) * 0.7)
	const anger = Math.max(unit(prediction.anger), unit(prediction.eyebrowsLoweredBy) * 0.8)
	const happy = unit(prediction.happiness) * unit(prediction[`cheekSquint${suffix}`])
	return {
		closure:Number.isFinite(blink) ? unit(blink / 0.95) : open ? 0 : 1,
		squint:Math.max(squint, happy * 0.65),
		// Raised inner corners give a sad slope; lowered inner corners a frown.
		tilt:sadness * 0.65 - anger * 0.65,
		droop:Math.max(sadness * 0.45, anger * 0.4),
		lift:happy * 0.4
	}
}

/** Draw one eye, clipping every colour layer through the same eyelid opening. */
export const drawEye = ( canvasContext, eyeData, pupilData, open=true, eyeDirection=0, options=DEFAULT_OPTIONS ) => {
	if (!canvasContext || !pupilData)
	{
		return false
	}
	options = { ...DEFAULT_OPTIONS, ...options }
	options.iris ??= DEFAULT_OPTIONS.iris
	options.pupil ??= DEFAULT_OPTIONS.pupil
	options.sclera ??= DEFAULT_OPTIONS.sclera

	const showRatio = options.ratio || 0.8 
	const diameter = Number.isFinite(pupilData.diameter) && pupilData.diameter > 0
		? pupilData.diameter
		: getEyeDiameter(eyeData, options)
	const radius = diameter * 0.5
	
	const expression = options.expression ?? getEyeExpression({}, 'left', open)
	const size = radius * options.scleraRadius
	const x = pupilData.x * options.scaleX
	const y = pupilData.y * options.scaleY
	const closure = expression.closure
	const aperture = (1 - closure) * (1 - expression.squint * 0.78)
	const top = -size * aperture * (1 - expression.droop)
	const bottom = size * aperture * (1 - expression.lift)
	const tilt = size * expression.tilt * aperture * (options.inward ?? 1)
	const axis = options.eyeAxis ?? { x:1, y:0 }
	const point = (horizontal, vertical) => [
		x + horizontal * axis.x - vertical * axis.y,
		y + horizontal * axis.y + vertical * axis.x
	]
	const expressive = closure > 0 || expression.squint > 0 || expression.droop > 0 || expression.lift > 0
	canvasContext.save()
	try
	{
		if (aperture > 0.015)
		{
			// round no perspective...
			const scleraRadius = radius * options.scleraRadius
			const irisRadius = radius * options.irisRadius
			const pupilRadius = radius * options.pupilRadius
			const socketRadius = scleraRadius - irisRadius
			const eyeOffset =  socketRadius * -eyeDirection
		
			const pupilX = pupilData.x * options.scaleX
			const pupilY = pupilData.y * options.scaleY
			
			if (expressive)
			{
				// A rectangular opening becomes a trapezoid as the brow tilts.
				// Clipping leaves the camera and other eyes intact behind the lids.
				const extent = Math.max(scleraRadius + Math.abs(eyeOffset), irisRadius, pupilRadius)
				canvasContext.beginPath()
				canvasContext.moveTo(...point(-extent, top + tilt))
				canvasContext.lineTo(...point(extent, top - tilt))
				canvasContext.lineTo(...point(extent, bottom))
				canvasContext.lineTo(...point(-extent, bottom))
				canvasContext.closePath()
				canvasContext.clip()
			}

			if (!options.layer || options.layer === 'sclera')
			{
				canvasContext.beginPath()
				if (options.outline)
				{
					eyeData.forEach(data => {
						canvasContext.lineTo(data.x * options.scaleX, data.y * options.scaleY)
					})
				}else{
					canvasContext.arc(pupilX + eyeOffset, pupilY, scleraRadius, 0, TAU)
				}
				canvasContext.fillStyle = options.sclera
				canvasContext.fill()
				canvasContext.closePath()
			}

			if (!options.layer || options.layer === 'iris')
			{
				// A partial circle preserves the Sidebottom and Googly presets.
				canvasContext.beginPath()
				canvasContext.fillStyle = options.iris
				canvasContext.arc(pupilX, pupilY, irisRadius, 0, TAU * showRatio)
				canvasContext.lineTo(pupilX, pupilY)
				canvasContext.fill()
				canvasContext.closePath()
			}

			if (!options.layer || options.layer === 'pupil')
			{
				// PUPILS
				canvasContext.beginPath()
				canvasContext.fillStyle = options.pupil
				drawPupilPath(canvasContext, pupilX, pupilY, pupilRadius, options.eyeDesign)
				canvasContext.fill()
			}

		}else if (!options.layer || options.layer === 'pupil'){
			// At full closure the opening disappears into a narrow eyelid line.
			canvasContext.beginPath()
			canvasContext.strokeStyle = options.pupil
			canvasContext.lineWidth = Math.max(1, radius * 0.15)
			canvasContext.lineCap = 'round'
			canvasContext.moveTo(...point(-size * 0.85, 0))
			canvasContext.lineTo(...point(0, size * 0.08))
			canvasContext.lineTo(...point(size * 0.85, 0))
			canvasContext.stroke()
		}
	}finally{
		canvasContext.restore()
	}
	return true
}

/** Draw a rigid pair of shades that stays visible while blinking. */
const drawSunglasses = (context, eyeData, options) => {
	const { leftPupil, rightPupil } = eyeData
	if (![leftPupil, rightPupil].every(point => Number.isFinite(point?.x) && Number.isFinite(point?.y))) return false
	const scaleX = options.scaleX ?? 1
	const scaleY = options.scaleY ?? 1
	const dx = (rightPupil.x - leftPupil.x) * scaleX
	const dy = (rightPupil.y - leftPupil.y) * scaleY
	const distance = Math.hypot(dx, dy)
	if (!Number.isFinite(distance) || distance <= 0) return false
	const direction = dx < 0 ? -1 : 1
	const axisX = dx * direction / distance
	const axisY = dy * direction / distance
	const x = (leftPupil.x + rightPupil.x) * scaleX / 2
	const y = (leftPupil.y + rightPupil.y) * scaleY / 2
	const point = (horizontal, vertical) => [
		x + distance * (horizontal * axisX - vertical * axisY),
		y + distance * (horizontal * axisY + vertical * axisX)
	]
	context.save()
	try
	{
		context.globalCompositeOperation = 'source-over'
		context.strokeStyle = '#111111'
		context.fillStyle = '#171c26'
		context.lineWidth = distance * 0.065
		context.lineCap = 'round'
		context.lineJoin = 'round'
		// Bridge and short arms at the temples.
		context.beginPath()
		context.moveTo(...point(-0.98, -0.14))
		context.lineTo(...point(-0.85, -0.1))
		context.moveTo(...point(-0.17, -0.08))
		context.bezierCurveTo(...point(-0.08, -0.16), ...point(0.08, -0.16), ...point(0.17, -0.08))
		context.moveTo(...point(0.85, -0.1))
		context.lineTo(...point(0.98, -0.14))
		context.stroke()
		for (const centre of [-0.5, 0.5])
		{
			context.beginPath()
			context.moveTo(...point(centre - 0.35, -0.23))
			context.lineTo(...point(centre + 0.35, -0.23))
			context.bezierCurveTo(...point(centre + 0.34, 0.22), ...point(centre + 0.24, 0.29), ...point(centre, 0.29))
			context.bezierCurveTo(...point(centre - 0.24, 0.29), ...point(centre - 0.34, 0.22), ...point(centre - 0.35, -0.23))
			context.closePath()
			context.fill()
			context.stroke()
		}
		context.strokeStyle = '#697586'
		context.lineWidth = distance * 0.025
		context.beginPath()
		for (const centre of [-0.5, 0.5])
		{
			context.moveTo(...point(centre - 0.22, -0.1))
			context.lineTo(...point(centre - 0.08, 0.08))
		}
		context.stroke()
	}finally{
		context.restore()
	}
	return true
}

/** Draw a tracked pair of eyes onto a 2D canvas. */
export const drawEyes = (canvasContext, eyeData, options=DEFAULT_OPTIONS) => {
	if (!canvasContext || !eyeData)
	{
		return false
	}
	if (options.eyeDesign === 'sunglasses')
	{
		return drawSunglasses(canvasContext, eyeData, options)
	}
	const {
		leftEye,
		leftPupil,
		rightEye,
		rightPupil,
		leftOpen=true,
		rightOpen=true,
		eyeDirection=0
	} = eyeData
	const prediction = eyeData.expression ?? {}
	const dx = (rightPupil?.x ?? 1) - (leftPupil?.x ?? 0)
	const dy = (rightPupil?.y ?? 0) - (leftPupil?.y ?? 0)
	const scaleX = options.scaleX ?? 1
	const scaleY = options.scaleY ?? 1
	const distance = Math.hypot(dx * scaleX, dy * scaleY) || 1
	const leftInward = dx < 0 ? -1 : 1
	const eyeAxis = { x:dx * scaleX * leftInward / distance, y:dy * scaleY * leftInward / distance }
	if (!leftPupil || !rightPupil || (dx === 0 && dy === 0)) { eyeAxis.x = 1; eyeAxis.y = 0 }
	const leftExpression = getEyeExpression(prediction, 'left', leftOpen)
	const rightExpression = getEyeExpression(prediction, 'right', rightOpen)
	let drawn = false
	canvasContext.save()
	try
	{
		canvasContext.globalCompositeOperation = 'source-over'
		// Paint both whites before either iris or pupil, so overlapping eyes
		// cannot hide the other eye's details beneath a white circle.
		for (const layer of ['sclera', 'iris', 'pupil'])
		{
			if (Array.isArray(leftEye) && leftEye.length > 0 && leftPupil)
			{
				drawn = drawEye(canvasContext, leftEye, leftPupil, leftOpen, eyeDirection, { ...options, layer, eyeAxis, inward:leftInward, expression:leftExpression }) || drawn
			}
			if (Array.isArray(rightEye) && rightEye.length > 0 && rightPupil)
			{
				drawn = drawEye(canvasContext, rightEye, rightPupil, rightOpen, eyeDirection, {
					...options,
					layer,
					eyeAxis,
					inward:-leftInward,
					expression:rightExpression,
					iris:options.rightIris ?? options.iris
				}) || drawn
			}
		}
	}finally{
		canvasContext.restore()
	}
	return drawn
}
