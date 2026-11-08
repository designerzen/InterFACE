import { createBlendshapeScoreReader, inferExpressionParameters } from '../../source/models/blendshapes.js'

describe('blendshape score reader', () => {
	test('uses category names even when the model output order changes', () => {
		const readScore = createBlendshapeScoreReader([
			{ categoryName:'mouthSmileRight', score:0.82 },
			{ categoryName:'jawOpen', score:0.15 },
			{ categoryName:'mouthSmileLeft', score:0.76 },
		])

		expect(readScore('mouthSmileLeft', 0)).toBe(0.76)
		expect(readScore('mouthSmileRight', 2)).toBe(0.82)
	})

	test('retains index fallback for unnamed legacy output and defaults safely', () => {
		const readScore = createBlendshapeScoreReader([{ score:0.4 }])

		expect(readScore('jawOpen', 0)).toBe(0.4)
		expect(readScore('mouthPucker', 12)).toBe(0)
	})

	test('infers happiness from smiling actions rather than jaw opening', () => {
		const smiling = inferExpressionParameters([
			{ categoryName:'mouthSmileLeft', score:0.9 },
			{ categoryName:'mouthSmileRight', score:0.85 },
			{ categoryName:'cheekSquintLeft', score:0.7 },
			{ categoryName:'cheekSquintRight', score:0.7 },
		])
		const openMouth = inferExpressionParameters([{ categoryName:'jawOpen', score:0.95 }])

		expect(smiling.happiness).toBeGreaterThan(0.75)
		expect(openMouth.happiness).toBe(0)
		expect(openMouth.surprise).toBeGreaterThan(0)
	})

	test('infers sadness from bilateral frown and inner-brow actions', () => {
		const expression = inferExpressionParameters([
			{ categoryName:'mouthFrownLeft', score:0.8 },
			{ categoryName:'mouthFrownRight', score:0.75 },
			{ categoryName:'browInnerUp', score:0.7 },
		])

		expect(expression.sadness).toBeGreaterThan(0.65)
		expect(expression.happiness).toBe(0)
	})
})
