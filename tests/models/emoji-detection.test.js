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

	test('an open mouth in the face mesh cannot resolve to a closed-mouth neutral emoji', () => {
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
		expect(new EmojiDetector().detect(facePrediction, options)).toBe(EMOJIS.EMOJI_SMILING_GRIN_EYES_CLOSED)
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

		expect(detector.detect(facePrediction, { ...options, emojiMood:EMOJIS.EMOJI_MOOD_SAD })).toBe(EMOJIS.EMOJI_FROWNING)
	})

	test('detector marks right-side winks for mirrored rendering', () => {
		const detector = new EmojiDetector()
		const facePrediction = prediction({ rightEyeClosed:true })
		detector.detect(prediction({}), options)
		expect(detector.detect(facePrediction, options)).toBe(EMOJIS.EMOJI_RIGHT_WINK)
		expect(detector.isMirrored).toBe(true)
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
