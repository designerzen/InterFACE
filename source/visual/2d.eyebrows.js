import { eyebrowPasses } from './eyebrow-styles.js'

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
	const style = settings.eyebrowStyle ?? 'classic'
	if (style === 'disabled') return false
	const normalized = keypoints.every(point =>
		Number.isFinite(point?.x) && Number.isFinite(point?.y) &&
		Math.abs(point.x) <= 1.5 && Math.abs(point.y) <= 1.5
	)
	const scaleX = normalized ? canvasContext.canvas.width : 1
	const scaleY = normalized ? canvasContext.canvas.height : 1
	const colour = isLeft ?
		(settings.leftEyebrow ?? settings.color) :
		(settings.rightEyebrow ?? settings.color)

	const points = keypoints.map(point => ({x:point.x * scaleX, y:point.y * scaleY}))
	const centreX = points.reduce((sum, point) => sum + point.x, 0) / points.length
	const centreY = points.reduce((sum, point) => sum + point.y, 0) / points.length
	const span = Math.max(8, Math.hypot(points.at(-1).x - points[0].x, points.at(-1).y - points[0].y))
	const strength = Math.max(0, Math.min(1, Number(settings.eyebrowAmount) || 0))
	canvasContext.save()
	canvasContext.strokeStyle = colour
	canvasContext.lineCap = 'round'
	canvasContext.lineJoin = 'round'
	const alpha = canvasContext.globalAlpha ?? 1
	for (const pass of eyebrowPasses(style)) {
		canvasContext.beginPath()
		canvasContext.globalAlpha = alpha * pass.alpha
		canvasContext.lineWidth = (pass.width ?? settings.lineWidth) * (style === 'squish' ? 1 + strength * 0.4 : 1)
		const trace = (point, progress, first) => {
			const x = style === 'squish' ? centreX + (point.x - centreX) * (0.75 - strength * 0.2) : point.x
			const y = (style === 'squish' ? centreY + (point.y - centreY) * 0.3 : style === 'filter' ? centreY + (point.y - centreY) * 0.6 : point.y)
				+ pass.y * span / 50 + (style === 'bend' ? Math.sin(progress * Math.PI * 3) * span * (0.06 + strength * 0.06) : 0)
			if (first) canvasContext.moveTo(x, y)
			else canvasContext.lineTo(x, y)
		}
		trace(points[0], 0, true)
		for (let index = 1; index < points.length; index++) {
			const steps = style === 'bend' ? 8 : 1
			for (let step = 1; step <= steps; step++) {
				const fraction = step / steps
				trace({x:points[index - 1].x + (points[index].x - points[index - 1].x) * fraction,
					y:points[index - 1].y + (points[index].y - points[index - 1].y) * fraction}, (index - 1 + fraction) / (points.length - 1), false)
			}
		}
		canvasContext.stroke()
	}
	canvasContext.restore()
	return true
}
