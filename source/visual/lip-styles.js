import { MESH_ANNOTATIONS } from '../models/face-landmark-constants.js'

export const LIP_STYLE_OPTIONS = [
	['disabled', 'Disabled (no lipstick)'],
	['red', 'Classic red'],
	['pink', 'Hot pink'],
	['purple', 'Purple'],
	['coral', 'Coral'],
	['gold', 'Gold'],
	['music', 'Match the notes'],
	['pulse', 'Music pulse'],
	['rainbow', 'Rainbow flow'],
	['beat', 'Beat flash'],
	['beat-rainbow', 'Rainbow beat flash']
]

export const normaliseLipStyle = value => LIP_STYLE_OPTIONS.some(([style]) => style === value) ? value : 'disabled'
export const getLipStyle = options => options.lipStyle == null
	? (options.drawMouth ? 'music' : 'disabled')
	: normaliseLipStyle(options.lipStyle)

const beats = new WeakMap()
const solidHues = { red:350, pink:325, purple:280, coral:15, gold:45 }

export const getLipPaint = (person, options, colours = {}, beatJustPlayed = false, now = performance.now()) => {
	const style = getLipStyle(options)
	if (style === 'disabled') return null
	let beat = beats.get(person) ?? { time:-Infinity, hue:0 }
	if (beatJustPlayed) {
		beat = { time:now, hue:(beat.hue + 55) % 360 }
		beats.set(person, beat)
	}
	const pulse = Math.max(0, 1 - (now - beat.time) / 220)
	const amplitude = person.singing ? Math.max(0, Math.min(1, person.data?.mouthRatio ?? 0)) : 0
	let hue = solidHues[style] ?? colours.h ?? person.hue ?? 0
	let lightness = 50
	let alpha = 0.9
	if (style === 'rainbow') hue = (now / 35) % 360
	if (style === 'pulse') {
		lightness = 35 + amplitude * 25
		alpha = 0.55 + amplitude * 0.4
	}
	if ((style === 'beat' || style === 'beat-rainbow') && !options.photoSensitive) {
		alpha = pulse * 0.95
		lightness = 50 + pulse * 20
		if (style === 'beat-rainbow') hue = beat.hue
	}
	return {
		fill:`hsla(${hue},90%,${lightness}%,${alpha})`,
		stroke:`hsla(${hue},90%,${Math.max(20, lightness - 15)}%,${alpha})`
	}
}

const contour = (landmarks, upper, lower) => [
	...upper.map(index => landmarks[index]),
	...lower.map(index => landmarks[index]).reverse()
]

/** Fill the lip tissue, leaving the inside of the mouth clear. */
export const drawLipOverlay = (context, person, options, colours = {}, beatJustPlayed = false) => {
	const paint = getLipPaint(person, options, colours, beatJustPlayed)
	if (!paint || !context || !person.data) return false
	const prediction = person.data
	const landmarks = prediction.faceLandmarks ?? prediction.keypoints
	const annotations = prediction.annotations ?? {}
	const outer = landmarks?.length >= 468
		? contour(landmarks, MESH_ANNOTATIONS.lipsUpperOuter, MESH_ANNOTATIONS.lipsLowerOuter)
		: annotations.outerLip ?? (annotations.lipsUpperOuter && annotations.lipsLowerOuter
			? [...annotations.lipsUpperOuter, ...annotations.lipsLowerOuter.slice().reverse()] : [])
	const inner = landmarks?.length >= 468
		? contour(landmarks, MESH_ANNOTATIONS.lipsUpperInner, MESH_ANNOTATIONS.lipsLowerInner)
		: annotations.innerLip ?? (annotations.lipsUpperInner && annotations.lipsLowerInner
			? [...annotations.lipsUpperInner, ...annotations.lipsLowerInner.slice().reverse()] : [])
	const valid = points => points.length >= 3 && points.every(point => Number.isFinite(point?.x) && Number.isFinite(point?.y))
	if (!valid(outer)) return false
	const normalized = outer.every(point => Math.abs(point.x) <= 1.5 && Math.abs(point.y) <= 1.5)
	const scaleX = normalized ? context.canvas.width : 1
	const scaleY = normalized ? context.canvas.height : 1
	const trace = points => {
		context.moveTo(points[0].x * scaleX, points[0].y * scaleY)
		points.slice(1).forEach(point => context.lineTo(point.x * scaleX, point.y * scaleY))
		context.closePath()
	}
	context.save()
	context.beginPath()
	trace(outer)
	if (valid(inner)) trace(inner)
	context.fillStyle = paint.fill
	context.strokeStyle = paint.stroke
	context.lineWidth = 1.5
	context.fill('evenodd')
	context.stroke()
	context.restore()
	return true
}
