const DEFAULT_OPTIONS = {
	color: 'rgba(0, 0, 0, 0.8)',
	lineWidth: 3
}

/**
 * Draw an eyebrow onto the Canvas
 * @param {*} keypoints 
 * @param {*} isLeft 
 * @param {*} options 
 */
export const drawEyebrows = (canvasContext, keypoints, isLeft=true, options=DEFAULT_OPTIONS) => {
	if (!canvasContext || !Array.isArray(keypoints) || keypoints.length < 2)
	{
		return false
	}

	const settings = { ...DEFAULT_OPTIONS, ...options }
	const normalized = keypoints.every(point =>
		Number.isFinite(point?.x) && Number.isFinite(point?.y) &&
		Math.abs(point.x) <= 1.5 && Math.abs(point.y) <= 1.5
	)
	const scaleX = normalized ? canvasContext.canvas.width : 1
	const scaleY = normalized ? canvasContext.canvas.height : 1
	const colour = isLeft ?
		(settings.leftEyebrow ?? settings.color) :
		(settings.rightEyebrow ?? settings.color)

	canvasContext.save()
	canvasContext.beginPath()
	canvasContext.moveTo(keypoints[0].x * scaleX, keypoints[0].y * scaleY)
	for (let index = 1; index < keypoints.length; index++)
	{
		const point = keypoints[index]
		canvasContext.lineTo(point.x * scaleX, point.y * scaleY)
	}
	canvasContext.strokeStyle = colour
	canvasContext.lineWidth = settings.lineWidth
	canvasContext.lineCap = 'round'
	canvasContext.lineJoin = 'round'
	canvasContext.stroke()
	canvasContext.restore()
	return true
}
