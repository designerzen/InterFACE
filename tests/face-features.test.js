import { drawEyebrows } from '../source/visual/2d.eyebrows.js'
import { drawEyes, getEyeExpression } from '../source/visual/2d.eyes.js'
import { drawFaceFeatures } from '../source/visual/2d.face-features.js'

const createContext = () => ({
	canvas:{ width:640, height:480 },
	beginPath:jest.fn(),
	moveTo:jest.fn(),
	lineTo:jest.fn(),
	stroke:jest.fn(),
	fill:jest.fn(),
	closePath:jest.fn(),
	clip:jest.fn(),
	arc:jest.fn(),
	ellipse:jest.fn(),
	bezierCurveTo:jest.fn(),
	save:jest.fn(),
	restore:jest.fn()
})

describe('facial feature drawing', () => {
	test('drawEyes derives finite sizes from normalized MediaPipe landmarks', () => {
		const context = createContext()
		const eye = [{ x:0.2, y:0.3 }, { x:0.25, y:0.3 }]

		expect(drawEyes(context, {
			leftEye:eye,
			leftPupil:{ x:0.225, y:0.3 },
			rightEye:eye.map(point => ({ ...point, x:point.x + 0.3 })),
			rightPupil:{ x:0.525, y:0.3 }
		}, {
			scaleX:context.canvas.width,
			scaleY:context.canvas.height,
			scleraRadius:1.2,
			irisRadius:1,
			pupilRadius:0.4
		})).toBe(true)

		expect(context.arc).toHaveBeenCalledTimes(6)
		context.arc.mock.calls.forEach(([, , radius]) => expect(Number.isFinite(radius)).toBe(true))
	})

	test('drawEyebrows draws normalized landmark paths on the canvas', () => {
		const context = createContext()

		expect(drawEyebrows(context, [{ x:0.25, y:0.2 }, { x:0.35, y:0.18 }], true)).toBe(true)
		expect(context.moveTo).toHaveBeenCalledWith(160, 96)
		expect(context.lineTo).toHaveBeenCalledWith(224, 86.39999999999999)
		expect(context.stroke).toHaveBeenCalledTimes(1)
	})

	test('draws eyebrows, eyes with pupils, and lips independently', () => {
		const context = createContext()
		const person = {
			hue:90,
			isMouthOpen:false,
			singing:false,
			isLeftEyeOpen:true,
			isRightEyeOpen:true,
			options:{ drawEyebrows:true, drawEyes:true, drawMouth:true },
			data:{
				annotations:{
					leftEyebrow:[{ x:100, y:100 }, { x:120, y:95 }],
					rightEyebrow:[{ x:200, y:95 }, { x:220, y:100 }],
					leftEye:[{ x:100, y:120 }, { x:120, y:120 }],
					rightEye:[{ x:200, y:120 }, { x:220, y:120 }],
					leftPupil:{ x:110, y:120, diameter:20 },
					rightPupil:{ x:210, y:120, diameter:20 },
					outerLip:[{ x:145, y:180 }, { x:165, y:180 }]
				}
			}
		}

		expect(drawFaceFeatures(context, person, { a:1 })).toBe(true)
		expect(context.stroke).toHaveBeenCalled()
		expect(context.arc).toHaveBeenCalled()
	})
})


describe('eye designs and layering', () => {
	const pair = {
		leftEye:[{ x:100, y:100 }, { x:120, y:100 }],
		rightEye:[{ x:120, y:100 }, { x:140, y:100 }],
		leftPupil:{ x:110, y:100, diameter:20 },
		rightPupil:{ x:130, y:100, diameter:20 }
	}

	test('overlapping eyes paint whites, irises, then pupils in separate passes', () => {
		const context = createContext()
		const fills = []
		context.fill.mockImplementation(() => fills.push(context.fillStyle))
		drawEyes(context, pair, { scleraRadius:7, iris:'green', rightIris:'blue', pupil:'black' })
		expect(fills).toEqual(['white', 'white', 'green', 'blue', 'black', 'black'])
		expect(context.save).toHaveBeenCalledTimes(7)
		expect(context.restore).toHaveBeenCalledTimes(7)
	})

	test.each(['star', 'heart', 'diamond', 'cat'])('draws %s pupils with finite geometry', eyeDesign => {
		const context = createContext()
		expect(drawEyes(context, pair, { eyeDesign })).toBe(true)
		expect(context.fill).toHaveBeenCalledTimes(6)
		expect(context.arc).toHaveBeenCalledTimes(4)
		const shape = eyeDesign === 'heart' ? context.bezierCurveTo : eyeDesign === 'cat' ? context.ellipse : context.lineTo
		expect(shape).toHaveBeenCalled()
		for (const method of ['arc', 'moveTo', 'lineTo', 'ellipse', 'bezierCurveTo'])
		{
			for (const args of context[method].mock.calls)
			{
				expect(args.every(Number.isFinite)).toBe(true)
			}
		}
	})

	test('a wink handles sparse normalized landmarks and only draws once', () => {
		const context = createContext()
		drawEyes(context, {
			leftEye:[{ x:0.2, y:0.3 }, { x:0.25, y:0.3 }],
			leftPupil:{ x:0.225, y:0.3 },
			leftOpen:false
		}, { scaleX:640, scaleY:480, scleraRadius:1 })
		expect(context.stroke).toHaveBeenCalledTimes(1)
		expect(context.fill).not.toHaveBeenCalled()
		expect(context.lineTo.mock.calls[0][0]).toBe(144)
	})
})


describe('expressive eyelid masks', () => {
	const pair = {
		leftEye:[{ x:60, y:100 }, { x:100, y:100 }],
		rightEye:[{ x:140, y:100 }, { x:180, y:100 }],
		leftPupil:{ x:80, y:100, diameter:40 },
		rightPupil:{ x:160, y:100, diameter:40 }
	}

	test('continuous blink values take precedence over the binary blink threshold', () => {
		const halfBlink = getEyeExpression({ leftEyeClosedBy:0.65 }, 'left', false)
		expect(halfBlink.closure).toBeGreaterThan(0.6)
		expect(halfBlink.closure).toBeLessThan(1)
		expect(getEyeExpression({ leftEyeClosedBy:0.95 }).closure).toBe(1)
		expect(getEyeExpression({}, 'left', false).closure).toBe(1)
	})

	test('squint clips the white, iris and pupil, independently for each eye', () => {
		const context = createContext()
		drawEyes(context, { ...pair, expression:{ eyeSquintLeft:0.8 } })
		expect(context.clip).toHaveBeenCalledTimes(3)
		expect(context.fill).toHaveBeenCalledTimes(6)
		const topLeft = context.moveTo.mock.calls[0]
		const topRight = context.lineTo.mock.calls[0]
		expect(topLeft[1]).toBe(topRight[1])
		expect(topLeft[1]).toBeGreaterThan(100 - 80)
	})

	test('sadness raises the inner corners of both trapezoid masks', () => {
		const context = createContext()
		const masks = []
		context.clip.mockImplementation(() => masks.push([
			context.moveTo.mock.calls.at(-1),
			context.lineTo.mock.calls.at(-3)
		]))
		drawEyes(context, { ...pair, expression:{ sadness:1 } })
		expect(masks).toHaveLength(6)
		expect(masks[0][0][1]).toBeGreaterThan(masks[0][1][1])
		expect(masks[1][0][1]).toBeLessThan(masks[1][1][1])
		expect(getEyeExpression({ anger:1 }).tilt).toBeLessThan(0)
	})

	test('mirrored pupil positions preserve upward-facing masks and raised inner corners', () => {
		const context = createContext()
		drawEyes(context, {
			...pair,
			leftPupil:pair.rightPupil,
			rightPupil:pair.leftPupil,
			expression:{ sadness:1 }
		})
		const topLeft = context.moveTo.mock.calls[0]
		const topRight = context.lineTo.mock.calls[0]
		expect(topLeft[0]).toBeLessThan(topRight[0])
		expect(topLeft[1]).toBeLessThan(topRight[1])
		expect(topLeft[1]).toBeLessThan(pair.leftPupil.y)
	})

	test('both closed eyes render lid lines with no visible eye fills', () => {
		const context = createContext()
		drawFaceFeatures(context, {
			areEyesClosed:true,
			isLeftEyeOpen:false,
			isRightEyeOpen:false,
			options:{ drawEyes:true },
			data:{ annotations:pair, leftEyeClosedBy:1, rightEyeClosedBy:1 }
		})
		expect(context.stroke).toHaveBeenCalledTimes(2)
		expect(context.fill).not.toHaveBeenCalled()
	})

	test('invalid expression scores fall back to finite eyelid controls', () => {
		const expression = getEyeExpression({ sadness:NaN, eyeSquintLeft:Infinity, leftEyeClosedBy:NaN })
		expect(Object.values(expression).every(Number.isFinite)).toBe(true)
	})
})
