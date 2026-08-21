import { drawEyebrows } from '../source/visual/2d.eyebrows.js'
import { drawFaceFeatures } from '../source/visual/2d.face-features.js'

const createContext = () => ({
	canvas:{ width:640, height:480 },
	beginPath:jest.fn(),
	moveTo:jest.fn(),
	lineTo:jest.fn(),
	stroke:jest.fn(),
	fill:jest.fn(),
	closePath:jest.fn(),
	arc:jest.fn(),
	save:jest.fn(),
	restore:jest.fn()
})

describe('facial feature drawing', () => {
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
