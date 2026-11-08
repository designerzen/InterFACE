export const BLENDSHAPE_IDS = [
	"browDownLeft",
	"browDownRight",
	"browInnerUp",
	"browOuterUpLeft",
	"browOuterUpRight",
	"cheekPuff",
	"cheekSquintLeft",
	"cheekSquintRight",
	"eyeBlinkLeft",
	"eyeBlinkRight",
	"eyeLookDownLeft",
	"eyeLookDownRight",
	"eyeLookInLeft",
	"eyeLookInRight",
	"eyeLookOutLeft",
	"eyeLookOutRight",
	"eyeLookUpLeft",
	"eyeLookUpRight",
	"eyeSquintLeft",
	"eyeSquintRight",
	"eyeWideLeft",
	"eyeWideRight",
	"jawForward",
	"jawLeft",
	"jawOpen",
	"jawRight",
	"mouthClose",
	"mouthDimpleLeft",
	"mouthDimpleRight",
	"mouthFrownLeft",
	"mouthFrownRight",
	"mouthFunnel",
	"mouthLeft",
	"mouthLowerDownLeft",
	"mouthLowerDownRight",
	"mouthPressLeft",
	"mouthPressRight",
	"mouthPucker",
	"mouthRight",
	"mouthRollLower",
	"mouthRollUpper",
	"mouthShrugLower",
	"mouthShrugUpper",
	"mouthSmileLeft",
	"mouthSmileRight",
	"mouthStretchLeft",
	"mouthStretchRight",
	"mouthUpperUpLeft",
	"mouthUpperUpRight",
	"noseSneerLeft",
	"noseSneerRight",
	"tongueOut"
]

/**
 * Create a stable score reader for MediaPipe blendshape categories. Category
 * names are authoritative; the optional index only supports older fixtures and
 * compatible model output that omits names.
 */
export const createBlendshapeScoreReader = (categories = []) => {
	const scoresByName = new Map(categories.map(category => [category.categoryName, category.score]))
	return (categoryName, legacyIndex) => {
		const namedScore = scoresByName.get(categoryName)
		if (Number.isFinite(namedScore)) return namedScore
		const indexedScore = categories[legacyIndex]?.score
		return Number.isFinite(indexedScore) ? indexedScore : 0
	}
}

const clamp01 = value => Math.min(Math.max(value, 0), 1)
const average = (left, right) => (left + right) * 0.5

/**
 * Infer continuous visible-expression parameters from MediaPipe's facial
 * action blendshapes. These are expression strengths, not claims about a
 * person's internal emotional state.
 */
export const inferExpressionParameters = categories => {
	const score = createBlendshapeScoreReader(categories)
	const browDown = average(score('browDownLeft', 1), score('browDownRight', 2))
	const browInnerUp = score('browInnerUp', 3)
	const browOuterUp = average(score('browOuterUpLeft', 4), score('browOuterUpRight', 5))
	const cheekSquint = average(score('cheekSquintLeft', 7), score('cheekSquintRight', 8))
	const eyeSquint = average(score('eyeSquintLeft', 19), score('eyeSquintRight', 20))
	const eyeWide = average(score('eyeWideLeft', 21), score('eyeWideRight', 22))
	const jawOpen = score('jawOpen', 25)
	const mouthFrown = average(score('mouthFrownLeft', 30), score('mouthFrownRight', 31))
	const mouthPress = average(score('mouthPressLeft', 36), score('mouthPressRight', 37))
	const mouthSmileLeft = score('mouthSmileLeft', 44)
	const mouthSmileRight = score('mouthSmileRight', 45)
	const mouthSmile = average(mouthSmileLeft, mouthSmileRight)
	const bilateralSmile = Math.min(mouthSmileLeft, mouthSmileRight)
	const mouthStretch = average(score('mouthStretchLeft', 46), score('mouthStretchRight', 47))
	const mouthUpperUp = average(score('mouthUpperUpLeft', 48), score('mouthUpperUpRight', 49))
	const noseSneer = average(score('noseSneerLeft', 50), score('noseSneerRight', 51))

	const happiness = clamp01(
		(0.65 * mouthSmile) + (0.2 * bilateralSmile) + (0.15 * cheekSquint) - (0.45 * mouthFrown)
	)
	const sadness = clamp01(
		(0.68 * mouthFrown) + (0.24 * browInnerUp) + (0.08 * mouthPress) - (0.5 * mouthSmile)
	)
	const anger = clamp01(
		(0.52 * browDown) + (0.2 * eyeSquint) + (0.16 * mouthPress) + (0.12 * noseSneer) - (0.35 * browInnerUp)
	)
	const fear = clamp01(
		(0.24 * browInnerUp) + (0.18 * browOuterUp) + (0.2 * eyeWide) + (0.24 * mouthStretch) + (0.14 * jawOpen)
	)
	const surprise = clamp01(
		((0.22 * browInnerUp) + (0.2 * browOuterUp) + (0.28 * eyeWide) + (0.3 * jawOpen)) * (1 - 0.45 * mouthStretch)
	)
	const disgust = clamp01(
		(0.5 * noseSneer) + (0.3 * mouthUpperUp) + (0.2 * mouthPress) - (0.3 * mouthSmile)
	)
	const expressionStrength = Math.max(happiness, sadness, anger, fear, surprise, disgust)

	return {
		happiness,
		sadness,
		anger,
		fear,
		surprise,
		disgust,
		neutral:1 - expressionStrength,
		mouthSmile,
		mouthSmileLeft,
		mouthSmileRight,
		cheekSquint,
		mouthFrown,
		browDown,
		browInnerUp,
		browOuterUp,
		eyeSquint,
		eyeWide,
		jawOpen,
		mouthPress,
		mouthStretch,
		noseSneer,
	}
}

/**
 * Take in a BlendShape ID and get it's mirror
 * tihs is useful when trying to "mirror" the user
 */
export const swapEyeSide = (feature) =>{

	switch(feature)
	{
		case "eyeBlinkLeft": return "eyeBlinkRight"
		case "eyeLookDownLeft": return "eyeLookDownRight"
		case "eyeLookInLeft": return "eyeLookInRight"
		case "eyeLookOutLeft": return "eyeLookOutRight"
		case "eyeLookUpLeft": return "eyeLookUpRight"
		case "eyeSquintLeft": return "eyeSquintRight"
		case "eyeWideLeft": return "eyeWideRight"
		
		case "eyeLookInRight": return "eyeLookInLeft"
		case "eyeLookDownRight": return "eyeLookDownLeft"
		case "eyeBlinkRight": return "eyeBlinkLeft"
		case "eyeLookOutRight": return "eyeLookOutLeft"
		case "eyeLookUpRight": return "eyeLookUpLeft"
		case "eyeSquintRight": return "eyeSquintLeft"
		case "eyeWideRight": return "eyeWideLeft"
	}
	return feature
}
