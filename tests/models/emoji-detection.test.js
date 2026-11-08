import {
	recogniseEmojiFromFaceModel,
	recogniseEmojiFromFaceModelAccurate,
	recogniseEmojiFromFaceModelLogical,
	EmojiDetector,
} from '../../source/models/emoji-detection.js'
import * as EMOJIS from '../../source/models/emoji.js'
import { EXPRESSION_ACHIEVEMENTS } from '../../source/people/person-achievement-definitions.js'

const options = {
	mouthCutOff: 0.2,
	mouthSilence: 0.1,
}

const basePrediction = {
	tongueOut: -1,
	leftEyeClosed: false,
	rightEyeClosed: false,
	mouthPucker: 0,
	eyebrowsRaisedBy: 0,
	mouthRatio: 0,
	happiness: 0,
	eyeVertical: 0,
	leftEyebrowRaisedBy: 0,
	rightEyebrowRaisedBy: 0,
	leftSmirk: 0,
	rightSmirk: 0,
	mouthStretchLeft: 0,
	mouthStretchRight: 0,
	rightEyeDirection: 0,
	leftEyeDirection: 0,
	lookingRight: false,
}

const prediction = overrides => ({
	...basePrediction,
	...overrides,
})

const detectAt = (detector, facePrediction, timeMs, detectionOptions = options) => detector.detect(
	{ ...facePrediction, time:timeMs / 1000 },
	detectionOptions,
	timeMs,
)

const holdPrediction = (detector, facePrediction, fromMs, toMs, detectionOptions = options, stepMs = 40) => {
	let emoji
	for (let timeMs = fromMs; timeMs <= toMs; timeMs += stepMs) {
		emoji = detectAt(detector, facePrediction, timeMs, detectionOptions)
	}
	return emoji
}

const createEmotionState = () => ({
	previousEmoji: EMOJIS.EMOJI_NEUTRAL,
	previousScores: {},
	frameCount: 0,
	lastSwitchFrame: -999,
})

describe('emoji detection methods', () => {
	test.each([
		['tongue beats closed eyes', prediction({ tongueOut: 0.8, leftEyeClosed: true, rightEyeClosed: true })],
		['closed-eye kiss checks eyebrows', prediction({ leftEyeClosed: true, rightEyeClosed: true, mouthPucker: 1, eyebrowsRaisedBy: 0.4 })],
		['raised eyebrow surprise buckets by mouth size', prediction({ mouthRatio: 0.45, happiness: 0.1, eyebrowsRaisedBy: 0.4 })],
		['open-mouth surprise keeps fine mouth-size buckets', prediction({ mouthRatio: 0.35, happiness: 0.1 })],
		['open-mouth happiness stays expressive', prediction({ mouthRatio: 0.4, happiness: 0.7 })],
		['quiet smile wins before smirk checks', prediction({ mouthRatio: 0.05, happiness: 0.1, leftSmirk: 0.8, rightSmirk: 0 })],
		['wink kiss beats plain wink', prediction({ leftEyeClosed: true, mouthPucker: 0.95 })],
		['eye-direction trippy beats shaking by priority', prediction({ rightEyeDirection: 0.8, leftEyeDirection: 0.1 })],
	])('logical method matches original priority: %s', (name, facePrediction) => {
		expect(recogniseEmojiFromFaceModelLogical(facePrediction, options)).toBe(recogniseEmojiFromFaceModel(facePrediction, options))
	})

	test('all three emoji recognisers are directly testable', () => {
		const facePrediction = prediction({
			mouthRatio: 0.4,
			happiness: 0.7,
		})

		expect(recogniseEmojiFromFaceModel(facePrediction, options)).toBe(EMOJIS.EMOJI_SMILING_BIG_GRIN)
		expect(recogniseEmojiFromFaceModelLogical(facePrediction, options)).toBe(EMOJIS.EMOJI_SMILING_BIG_GRIN)
		expect(recogniseEmojiFromFaceModelAccurate(facePrediction, options, createEmotionState())).toBe(EMOJIS.EMOJI_SMILING_BIG_GRIN)
	})

	test('logical method has a neutral no-prediction fallback', () => {
		expect(recogniseEmojiFromFaceModelLogical(undefined, options)).toBe(EMOJIS.EMOJI_NEUTRAL)
	})

	test('logical method treats a featureless straight face as neutral by default', () => {
		expect(recogniseEmojiFromFaceModelLogical(prediction({}), options)).toBe(EMOJIS.EMOJI_NEUTRAL)
	})

	test('legacy geometry fallback remains available without making the stable detector invent a smile', () => {
		const keypoints = []
		keypoints[13] = { x:0.5, y:0.45 }
		keypoints[14] = { x:0.5, y:0.65 }
		keypoints[61] = { x:0.2, y:0.5 }
		keypoints[291] = { x:0.8, y:0.5 }
		const facePrediction = prediction({
			leftEyeClosed:true,
			rightEyeClosed:true,
			keypoints,
		})

		expect(recogniseEmojiFromFaceModel(facePrediction, options)).toBe(EMOJIS.EMOJI_SMILING_GRIN_EYES_CLOSED)
		expect(recogniseEmojiFromFaceModelLogical(facePrediction, options)).toBe(EMOJIS.EMOJI_SMILING_GRIN_EYES_CLOSED)
		const detector = new EmojiDetector()
		expect(holdPrediction(detector, facePrediction, 0, 160)).toBe(EMOJIS.EMOJI_NEUTRAL_EYES_CLOSED)
	})

	test('emoji mood option can limit logical detection to happy faces', () => {
		const facePrediction = prediction({
			leftEyeClosed: true,
			rightEyeClosed: true,
			happiness: 0,
		})

		expect(recogniseEmojiFromFaceModelLogical(facePrediction, options)).toBe(EMOJIS.EMOJI_FROWN_EYES_CLOSED)
		expect(recogniseEmojiFromFaceModelLogical(facePrediction, { ...options, emojiMood:EMOJIS.EMOJI_MOOD_HAPPY })).toBe(EMOJIS.EMOJI_SMILING_SLIGHTLY)
	})

	test('emoji mood option can limit smoothed Person detection to sad faces', () => {
		const detector = new EmojiDetector()
		const facePrediction = prediction({
			mouthRatio: 0.4,
			happiness: 0.7,
		})

		expect(holdPrediction(detector, facePrediction, 0, 240, { ...options, emojiMood:EMOJIS.EMOJI_MOOD_SAD })).toBe(EMOJIS.EMOJI_FROWNING)
	})

	test('detector marks right-side winks for mirrored rendering', () => {
		const detector = new EmojiDetector()
		const facePrediction = prediction({ rightEyeClosed:true })
		detectAt(detector, prediction({}), 0)
		expect(holdPrediction(detector, facePrediction, 40, 200)).toBe(EMOJIS.EMOJI_RIGHT_WINK)
		expect(detector.isMirrored).toBe(true)
	})

	test.each([
		['plain wink', {}, EMOJIS.EMOJI_LEFT_WINK],
		['kissing wink', { mouthPucker:1 }, EMOJIS.EMOJI_KISSING_WINK],
		['tongue wink', { tongueOut:1 }, EMOJIS.EMOJI_TONGUE_WINK],
	])('a smiling face can wink with either eye: %s', (name, expression, expectedEmoji) => {
		const detector = new EmojiDetector()
		const smile = prediction({ happiness:0.8, smileEvidence:0.8, mouthSmile:0.8 })
		holdPrediction(detector, smile, 0, 200)
		expect(holdPrediction(detector, { ...smile, ...expression, leftEyeClosed:true }, 240, 440)).toBe(expectedEmoji)
		expect(detector.isMirrored).toBe(false)
		expect(holdPrediction(detector, { ...smile, ...expression, rightEyeClosed:true }, 480, 680)).toBe(expectedEmoji)
		expect(detector.isMirrored).toBe(true)
		expect(holdPrediction(detector, { ...smile, ...expression, leftEyeClosed:true }, 720, 920)).toBe(expectedEmoji)
		expect(detector.isMirrored).toBe(false)
		expect(holdPrediction(detector, smile, 960, 1160)).toBe(EMOJIS.EMOJI_SMILING_GRIN)
		expect(detector.isMirrored).toBe(false)
	})

	test('mouth opening without smile evidence is not classified as a smile', () => {
		const emoji = recogniseEmojiFromFaceModelLogical(prediction({
			mouthRatio:0.65,
			isMouthOpen:true,
			happiness:0,
			smileEvidence:0,
		}), options)

		expect([
			EMOJIS.EMOJI_SMILING_SLIGHTLY,
			EMOJIS.EMOJI_SMILING_GRIN,
			EMOJIS.EMOJI_SMILING_BIG_GRIN,
			EMOJIS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED,
		]).not.toContain(emoji)
	})

	test('a held strong smile does not phase to neutral on isolated weak frames', () => {
		const detector = new EmojiDetector()
		const smile = prediction({ happiness:0.82, smileEvidence:0.82, mouthSmile:0.82, mouthRatio:0.35, isMouthOpen:true })
		const weakFrame = prediction({ happiness:0, smileEvidence:0, mouthSmile:0, mouthRatio:0.35, isMouthOpen:true })
		let emoji = holdPrediction(detector, smile, 0, 200)
		expect(emoji).not.toBe(EMOJIS.EMOJI_NEUTRAL)

		for (let timeMs = 240, frame = 0; timeMs <= 3240; timeMs += 40, frame++) {
			emoji = detectAt(detector, frame % 8 === 0 ? weakFrame : smile, timeMs)
			expect(emoji).not.toBe(EMOJIS.EMOJI_NEUTRAL)
		}
	})

	test('neutral replaces a released smile within a few fresh inference samples', () => {
		const detector = new EmojiDetector()
		const smile = prediction({ happiness:0.75, smileEvidence:0.75, mouthSmile:0.75, mouthRatio:0.25, isMouthOpen:true })
		const neutral = prediction({ happiness:0, smileEvidence:0, mouthSmile:0, mouthRatio:0 })
		holdPrediction(detector, smile, 0, 200)

		expect(holdPrediction(detector, neutral, 240, 400)).toBe(EMOJIS.EMOJI_NEUTRAL)
	})

	test('an isolated weak smile does not switch the face', () => {
		const detector = new EmojiDetector()
		const neutral = prediction({})
		const weakSmile = prediction({ happiness:0.18, smileEvidence:0.18, mouthSmile:0.18 })
		detectAt(detector, neutral, 0)
		expect(detectAt(detector, weakSmile, 40)).toBe(EMOJIS.EMOJI_NEUTRAL)
		expect(detectAt(detector, neutral, 80)).toBe(EMOJIS.EMOJI_NEUTRAL)
	})

	test('repeated cached predictions do not vote as new inference frames', () => {
		const detector = new EmojiDetector()
		const smile = prediction({ happiness:0.18, smileEvidence:0.18, mouthSmile:0.18, time:1 })
		expect(detector.detect(smile, options, 0)).toBe(EMOJIS.EMOJI_NEUTRAL)
		expect(detector.detect(smile, options, 400)).toBe(EMOJIS.EMOJI_NEUTRAL)
	})

	test('strong blendshape expressions react immediately and opposite expressions replace them quickly', () => {
		const detector = new EmojiDetector()
		const smile = prediction({ happiness:0.8, smileEvidence:0.8, mouthSmile:0.8 })
		const sad = prediction({ happiness:0, smileEvidence:0, mouthSmile:0, sadness:0.8, mouthFrownLeft:0.8, mouthFrownRight:0.8 })

		expect(detectAt(detector, smile, 0)).toBe(EMOJIS.EMOJI_SMILING_GRIN)
		expect(holdPrediction(detector, sad, 40, 160)).toBe(EMOJIS.EMOJI_FROWNING)
	})

	test('brief prediction loss holds the expression and prolonged loss reports unknown', () => {
		const detector = new EmojiDetector()
		const smile = prediction({ happiness:0.8, smileEvidence:0.8, mouthSmile:0.8 })
		const smilingEmoji = holdPrediction(detector, smile, 0, 160)

		expect(detector.detect(undefined, options, 600)).toBe(smilingEmoji)
		expect(detector.detect(undefined, options, 1200)).toBe(EMOJIS.EMOJI_DOTTED_LINE)
	})

	test.each([
		['frowning', prediction({ mouthFrownLeft:0.4, mouthFrownRight:0.4 }), EMOJIS.EMOJI_FROWNING],
		['worried', prediction({ mouthFrownLeft:0.4, mouthFrownRight:0.4, eyebrowsInnerRaisedBy:0.4 }), EMOJIS.EMOJI_WORRIED],
		['fearful', prediction({ leftEyebrowRaisedBy:0.5, rightEyebrowRaisedBy:0.5 }), EMOJIS.EMOJI_FEARFUL],
	])('original detector recognises a sad expression: %s', (name, facePrediction, expectedEmoji) => {
		expect(recogniseEmojiFromFaceModel(facePrediction, options)).toBe(expectedEmoji)
	})

	test('every defined emoji has an expression achievement', () => {
		const expectedEmojis = new Set(Object.entries(EMOJIS)
			.filter(([name, emoji]) => name.startsWith('EMOJI_') && !name.startsWith('EMOJI_MOOD_') && typeof emoji === 'string')
			.map(([, emoji]) => emoji))
		expect(new Set(EXPRESSION_ACHIEVEMENTS.map(achievement => achievement.emoticon))).toEqual(expectedEmojis)
	})
})
