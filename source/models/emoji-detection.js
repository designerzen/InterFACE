// import { EMOJI_ANGRY, EMOJI_DIAGONAL_MOUTH, EMOJI_EYES_ROLLING_UP, EMOJI_FROWN_EYES_CLOSED, EMOJI_KISS, EMOJI_KISS_EYES_CLOSED, EMOJI_LEFT_WINK, EMOJI_NEUTRAL, EMOJI_NEUTRAL_EYES_CLOSED, EMOJI_OPEN_MOUTH, EMOJI_OPEN_MOUTH_BIG, EMOJI_RAISED_EYEBROW, EMOJI_SHAKING, EMOJI_SHAKING_HORIZONTALLY, EMOJI_SHAKING_VERTICALLY, EMOJI_SMILING_BIG_GRIN, EMOJI_SMILING_BIG_TEETH_GRIN, EMOJI_SMILING_EYES_CLOSED, EMOJI_SMILING_GRIN, EMOJI_SMILING_GRIN_SQUINT, EMOJI_SMILING_SLIGHTLY, EMOJI_SMIRK, EMOJI_TRIPPY, EMOJI_WAIL } from "./emoji"
import * as EMOTICONS from './emoji.js'

// ===== CONFIGURATION =====
// Set to true to use the accurate emoji detection method, false for original
// Can also use 'smooth' for the new smoothed version
const USE_ACCURATE_DETECTION = true

// ===== TEMPORAL SMOOTHING & STABILITY =====
// Number of consecutive frames before switching to a new emotion (prevents jitter)
// Higher = more stable but less responsive. 2-4 is recommended.
const STABILITY_FRAMES = 4

// Hysteresis: stick with current emoji unless new emotion scores this much higher
// Reduced to 0.05 to allow smile detection to override neutral
const SWITCH_HYSTERESIS = 0.05

// Emoji "persistence": how long to hold an emoji before allowing rapid switches
// Useful for brief expressions that shouldn't flicker
const EMOJI_HOLD_FRAMES = 5

// Smile detection boost: if any smile is detected, boost its score
const SMILE_BOOST_MULTIPLIER = 2.0 
const AMOUNT_BEFORE_GRIMMACE = 0.6
const AMOUNT_BEFORE_ANGRY = 0.55
const AMOUNT_BEFORE_FEARFUL = 0.4

// Winks need higher stability to avoid false positives from noisy eye tracking
const WINK_STABILITY_FRAMES = 6

// Raised eyebrow is very noisy, needs maximum stability
const RAISED_EYEBROW_STABILITY_FRAMES = 8

// Other eyebrow expressions need higher stability to avoid false positives
const EYEBROW_STABILITY_FRAMES = 6

// Thresholds for accurate emoji detection
const MOUTH_PUCKER_KISS_THRESHOLD = 0.98
const TONGUE_OUT_THRESHOLD = -0.1
const EYE_VERTICAL_ROLLING_THRESHOLD = -0.1
const MOUTH_CLOSED_THRESHOLD = 0.1
const MOUTH_OPEN_SMALL = 0.2
const MOUTH_OPEN_MEDIUM = 0.3
const MOUTH_OPEN_LARGE = 0.4
const MOUTH_OPEN_XLARGE = 0.5
const MOUTH_OPEN_HUGE = 0.7
const MOUTH_OPEN_EXTREME = 0.85
const MOUTH_OPEN_MAX = 0.9
const HAPPINESS_VERY_LOW = 0.01
const HAPPINESS_LOW = 0.3
const HAPPINESS_MEDIUM = 0.5
const HAPPINESS_HIGH = 0.65
const HAPPINESS_VERY_HIGH = 0.8
const HAPPINESS_SMILE_THRESHOLD = 0.01
const EYEBROW_RAISED_THRESHOLD = 0.45
const EYE_DIRECTION_TRIPPY = 0.66
const EYE_DIRECTION_SHAKING = 0.2
const SMIRK_ASYMMETRY_THRESHOLD = 0.1

/**
 * Main entry point for emoji recognition
 * Routes to accurate or original implementation based on USE_ACCURATE_DETECTION flag
 * @param {Object} prediction - the ML prediction from mediaPipe 
 * @param {Object} options - configuration options
 * @returns {string} emoji string
 */
export const recogniseEmoji = (prediction, options, emotionState) => {
	// Route to the appropriate implementation
	if (USE_ACCURATE_DETECTION === true) {
		return recogniseEmojiFromFaceModelAccurate(prediction, options, emotionState)
	} else {
		return recogniseEmojiFromFaceModel(prediction, options)
	}
}

/**
 * Convert a face model into an emoji (ORIGINAL IMPLEMENTATION)
 * @param {Object} prediction - the ML prediction from mediaPipe 
 * @param {Object} options -  
 */
export const recogniseEmojiFromFaceModel = (prediction, options) => {

	// const prediction = person.data
	// Recognise EMOJI in order of most common ones

	// options.mouthSilence && amp < options.mouthCutOff

	// Tongue out!
	if (prediction.tongueOut > -0.1)
	{
		return prediction.leftEyeClosed && prediction.rightEyeClosed ? EMOTICONS.EMOJI_TONGUE_SQUINT : prediction.leftEyeClosed ? EMOTICONS.EMOJI_TONGUE_WINK : EMOTICONS.EMOJI_TONGUE
	}
	
	// Both eyes are closed -----------------------------------------------
	if (prediction.leftEyeClosed && prediction.rightEyeClosed)
	{
		if (prediction.mouthPucker > 0.98)
		{
			// check eyebrows....
			return (prediction.eyebrowsRaisedBy < 0.3) ? 
				EMOTICONS.EMOJI_KISS_EYES_CLOSED : 
				EMOTICONS.EMOJI_KISS_EYES_CLOSED_EYEBROWS_RAISED
		}
		 if (prediction.mouthRatio > 0.1){
			return EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED
		 }

		if (prediction.happiness < 0.01){
			return EMOTICONS.EMOJI_FROWN_EYES_CLOSED
		}
		if (prediction.happiness < 0.3){
			return EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED
		}
		if (prediction.happiness < 0.5){
			return EMOTICONS.EMOJI_SMILING_EYES_CLOSED
		}
		if (prediction.happiness <=0.6){
			return EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED
		}
		if (prediction.happiness <=0.7){
			return EMOTICONS.EMOJI_SMILING_GRIN_SQUINT
		}
		if (prediction.happiness <= 1){
			return EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED
		}
		return EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED
	}

	// Both eyes are open emojis
	if (!prediction.leftEyeClosed && !prediction.rightEyeClosed)
	{
		if (prediction.mouthPucker > 0.98)
		{
			return EMOTICONS.EMOJI_KISS
		}

		if (prediction.eyeVertical < -0.1)
		{
			return EMOTICONS.EMOJI_EYES_ROLLING_UP
		}


		// MOUTH OPEN
		// Wide eyed and mouth crooked and closed
		// EMOJI_CONFUSED
		if ( prediction.mouthRatio > options.mouthCutOff  )
		{
			// mouth open but no grin
			if (prediction.happiness < 0.4)
			{
				if (prediction.eyebrowsRaisedBy > 0.3)
				{
					 if (prediction.mouthRatio < 0.3){
						return EMOTICONS.EMOJI_OPEN_MOUTH
					// }else if (prediction.mouthRatio < 0.4){
					// 	return EMOTICONS.EMOJI_EXHALING
					}else if (prediction.mouthRatio < 0.4){
						return EMOTICONS.EMOJI_SHOCKED
					}else if (prediction.mouthRatio < 0.5){
						return EMOTICONS.EMOJI_ANGUISHED
					}else if (prediction.mouthRatio < 0.65){
						return EMOTICONS.EMOJI_ASTONISHED
					}else if (prediction.mouthRatio < 0.8){
						return EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED
					}
				}else{
					// mouth open but no grin
					if (prediction.mouthRatio < 0.2 ){
						return EMOTICONS.EMOJI_OPEN_MOUTH
					}else if (prediction.mouthRatio < 0.3){
						return EMOTICONS.EMOJI_OPEN_MOUTH_BIG
					}else if (prediction.mouthRatio < 0.4){
						return EMOTICONS.EMOJI_EXHALING
					}else if (prediction.mouthRatio < 0.5){
						return EMOTICONS.EMOJI_SHOCKED
					}else if (prediction.mouthRatio < 0.6){
						return EMOTICONS.EMOJI_ANGUISHED
					}else if (prediction.mouthRatio < 0.75){
						return EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED
					}else if (prediction.mouthRatio < 0.9){
						return EMOTICONS.EMOJI_ASTONISHED
					}else if (prediction.mouthRatio <= 1){
						return EMOTICONS.EMOJI_WAIL
					}	
				}
			

			// mouth open and smiles
			}else if (prediction.happiness < 0.5){
				return EMOTICONS.EMOJI_SMILING_SLIGHTLY
			}else if (prediction.happiness <=0.65){
				return EMOTICONS.EMOJI_SMILING_GRIN
			}else if (prediction.happiness <= 0.8){
				return EMOTICONS.EMOJI_SMILING_BIG_GRIN
			}else if (prediction.happiness <= 1){
				return EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED
			}

		}else if (prediction.mouthRatio <= options.mouthSilence && prediction.happiness > 0.03 ){
		
			return EMOTICONS.EMOJI_SMILING_SLIGHTLY
		}else if (prediction.leftSmirk > 0.1 + prediction.rightSmirk){
			return EMOTICONS.EMOJI_DIAGONAL_MOUTH
		}else if ( 0.1 +prediction.leftSmirk < prediction.rightSmirk){
			return EMOTICONS.EMOJI_DIAGONAL_MOUTH
		}
	
		
		if (prediction.eyebrowsRaisedBy > 0.3)
		{
			// check eye brows!
			return EMOTICONS.EMOJI_RAISED_EYEBROW
		}
	
		// SADNESS
		if (
			prediction.leftEyebrowRaisedBy < -AMOUNT_BEFORE_ANGRY &&
			prediction.rightEyebrowRaisedBy < -AMOUNT_BEFORE_ANGRY
		){
			return EMOTICONS.EMOJI_ANGRY
		}
		
		if (
			prediction.leftEyebrowRaisedBy > AMOUNT_BEFORE_FEARFUL &&
			prediction.rightEyebrowRaisedBy > AMOUNT_BEFORE_FEARFUL
		){
			return EMOTICONS.EMOJI_FEARFUL
		}
		
		if (
			prediction.leftSmirk > AMOUNT_BEFORE_GRIMMACE &&
			prediction.mouthStretchLeft > AMOUNT_BEFORE_GRIMMACE &&
			prediction.rightSmirk > AMOUNT_BEFORE_GRIMMACE &&
			prediction.mouthStretchRight > AMOUNT_BEFORE_GRIMMACE
		){
			return EMOTICONS.EMOJI_GRIMACING
		}
		
		if (
			prediction.rightEyeDirection > 0.66 && prediction.leftEyeDirection < 0.66 ||
			prediction.rightEyeDirection < 0.66 && prediction.leftEyeDirection > 0.66
		){
			return EMOTICONS.EMOJI_TRIPPY
		}

		if (
			prediction.rightEyeDirection > 0.2 && prediction.leftEyeDirection < 0.2 ||
			prediction.rightEyeDirection < 0.2 && prediction.leftEyeDirection > 0.2
		){
			return EMOTICONS.EMOJI_SHAKING
		}

		// return EMOTICONS.EMOJI_NEUTRAL
	}


	// left wink 😉
	if (prediction.leftEyeClosed && !prediction.rightEyeClosed)
	{
		// wink and kiss
		if (prediction.mouthPucker > 0.91)
		{
			return EMOTICONS.EMOJI_KISSING_WINK
		}
		// if (prediction.happiness < 0.3)
		// {
		// 	return ";-|"
		// }else if (prediction.happiness < 0.5){
		// 	return ";-)"
		// }else if (prediction.happiness <=1){
		// 	return ";-D"
		// }
		return EMOTICONS.EMOJI_LEFT_WINK
	}

	// kiss EMOJI_KISS
	// EMOJI_KISS_EYES_CLOSED
	
	// right wink 😉
	if (!prediction.leftEyeClosed && prediction.rightEyeClosed)
	{
		if (prediction.mouthPucker > 0.91)
		{
			return EMOTICONS.EMOJI_KISSING_WINK
		}

		return EMOTICONS.EMOJI_RIGHT_WINK
	}	

	if (prediction.lookingRight && prediction.rightSmirk > prediction.leftSmirk)
	{
		return EMOTICONS.EMOJI_SMIRK
	}

	// raise eyebrow 🤨
	// EMOJI_RAISED_EYEBROW

	// if (prediction.yaw > AMOUNT_BEFORE_SHAKE_X || prediction.yaw < -AMOUNT_BEFORE_SHAKE_X)
	// {
	// 	return EMOTICONS.EMOJI_SHAKING_HORIZONTALLY
	// }

	// if (prediction.pitch > AMOUNT_BEFORE_SHAKE_Y || prediction.pitch < -AMOUNT_BEFORE_SHAKE_Y)
	// {
	// 	return EMOTICONS.EMOJI_SHAKING_VERTICALLY
	// }

	// prediction.leftEyeClosed
	// prediction.rightEyeClosed
	// prediction.mouthRatio

	// prediction.happiness
	// // 
	// prediction.leftSmirk
	// prediction.rightSmirk	

	if (prediction.leftEyebrowRaisedBy > 0.1 && prediction.rightEyebrowRaisedBy > 0.1 )
	{
		return EMOTICONS.EMOJI_FLUSHED
	}


	if (prediction)
	{
		return EMOTICONS.EMOJI_PERSEVERING
	}
			

	// No EMOJI detected
	return EMOTICONS.EMOJI_NEUTRAL
}

const createEmojiRule = (name, matches, emoji) => ({ name, matches, emoji })

const getEmojiRuleResult = (rule, prediction, options) => 
	typeof rule.emoji === 'function' ? rule.emoji(prediction, options) : rule.emoji

const bothEyesClosed = prediction => prediction.leftEyeClosed && prediction.rightEyeClosed
const bothEyesOpen = prediction => !prediction.leftEyeClosed && !prediction.rightEyeClosed
const leftEyeClosedOnly = prediction => prediction.leftEyeClosed && !prediction.rightEyeClosed
const rightEyeClosedOnly = prediction => !prediction.leftEyeClosed && prediction.rightEyeClosed
const mouthIsOpen = (prediction, options) => prediction.mouthRatio > options.mouthCutOff

const emojiLogicRules = [

	// FIXME: tongue is not recognised as a blendshape the docs are wrong
	createEmojiRule(
		'tongue',
		prediction => prediction.tongueOut > TONGUE_OUT_THRESHOLD,
		prediction => bothEyesClosed(prediction) ? EMOTICONS.EMOJI_TONGUE_SQUINT : prediction.leftEyeClosed ? EMOTICONS.EMOJI_TONGUE_WINK : EMOTICONS.EMOJI_TONGUE
	),
	createEmojiRule(
		'closed-eye-kiss',
		prediction => bothEyesClosed(prediction) && prediction.mouthPucker > MOUTH_PUCKER_KISS_THRESHOLD,
		prediction => prediction.eyebrowsRaisedBy < 0.3 ? EMOTICONS.EMOJI_KISS_EYES_CLOSED : EMOTICONS.EMOJI_KISS_EYES_CLOSED_EYEBROWS_RAISED
	),
	createEmojiRule('closed-eye-open-mouth-grin', prediction => bothEyesClosed(prediction) && prediction.mouthRatio > MOUTH_CLOSED_THRESHOLD, EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED),
	createEmojiRule('closed-eye-frown', prediction => bothEyesClosed(prediction) && prediction.happiness < HAPPINESS_VERY_LOW, EMOTICONS.EMOJI_FROWN_EYES_CLOSED),
	createEmojiRule('closed-eye-neutral', prediction => bothEyesClosed(prediction) && prediction.happiness < HAPPINESS_LOW, EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED),
	createEmojiRule('closed-eye-smile', prediction => bothEyesClosed(prediction) && prediction.happiness < HAPPINESS_MEDIUM, EMOTICONS.EMOJI_SMILING_EYES_CLOSED),
	createEmojiRule('closed-eye-grin', prediction => bothEyesClosed(prediction) && prediction.happiness <= 0.6, EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED),
	createEmojiRule('closed-eye-squint-grin', prediction => bothEyesClosed(prediction) && prediction.happiness <= 0.7, EMOTICONS.EMOJI_SMILING_GRIN_SQUINT),
	createEmojiRule('closed-eye-big-teeth-grin', prediction => bothEyesClosed(prediction) && prediction.happiness <= 1, EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED),
	createEmojiRule('closed-eye-fallback', bothEyesClosed, EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED),

	createEmojiRule('open-eye-kiss', prediction => bothEyesOpen(prediction) && prediction.mouthPucker > MOUTH_PUCKER_KISS_THRESHOLD, EMOTICONS.EMOJI_KISS),
	createEmojiRule('open-eye-rolling-up', prediction => bothEyesOpen(prediction) && prediction.eyeVertical < EYE_VERTICAL_ROLLING_THRESHOLD, EMOTICONS.EMOJI_EYES_ROLLING_UP),

	createEmojiRule('raised-eyebrows-small-open-mouth', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < 0.4 && prediction.eyebrowsRaisedBy > 0.3 && prediction.mouthRatio < 0.3, EMOTICONS.EMOJI_OPEN_MOUTH),
	createEmojiRule('raised-eyebrows-shocked', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < 0.4 && prediction.eyebrowsRaisedBy > 0.3 && prediction.mouthRatio < 0.4, EMOTICONS.EMOJI_SHOCKED),
	createEmojiRule('raised-eyebrows-anguished', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < 0.4 && prediction.eyebrowsRaisedBy > 0.3 && prediction.mouthRatio < 0.5, EMOTICONS.EMOJI_ANGUISHED),
	createEmojiRule('raised-eyebrows-astonished', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < 0.4 && prediction.eyebrowsRaisedBy > 0.3 && prediction.mouthRatio < 0.65, EMOTICONS.EMOJI_ASTONISHED),
	createEmojiRule('raised-eyebrows-anguished-raised', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < 0.4 && prediction.eyebrowsRaisedBy > 0.3 && prediction.mouthRatio < 0.8, EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED),

	createEmojiRule('open-mouth-small', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < 0.4 && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < MOUTH_OPEN_SMALL, EMOTICONS.EMOJI_OPEN_MOUTH),
	createEmojiRule('open-mouth-big', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < 0.4 && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < MOUTH_OPEN_MEDIUM, EMOTICONS.EMOJI_OPEN_MOUTH_BIG),
	createEmojiRule('open-mouth-exhaling', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < 0.4 && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < MOUTH_OPEN_LARGE, EMOTICONS.EMOJI_EXHALING),
	createEmojiRule('open-mouth-shocked', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < 0.4 && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < MOUTH_OPEN_XLARGE, EMOTICONS.EMOJI_SHOCKED),
	createEmojiRule('open-mouth-anguished', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < 0.4 && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < 0.6, EMOTICONS.EMOJI_ANGUISHED),
	createEmojiRule('open-mouth-anguished-raised', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < 0.4 && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < 0.75, EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED),
	createEmojiRule('open-mouth-astonished', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < 0.4 && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < MOUTH_OPEN_MAX, EMOTICONS.EMOJI_ASTONISHED),
	createEmojiRule('open-mouth-wail', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < 0.4 && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio <= 1, EMOTICONS.EMOJI_WAIL),

	createEmojiRule('open-mouth-slight-smile', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_MEDIUM, EMOTICONS.EMOJI_SMILING_SLIGHTLY),
	createEmojiRule('open-mouth-grin', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness <= HAPPINESS_HIGH, EMOTICONS.EMOJI_SMILING_GRIN),
	createEmojiRule('open-mouth-big-grin', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness <= HAPPINESS_VERY_HIGH, EMOTICONS.EMOJI_SMILING_BIG_GRIN),
	createEmojiRule('open-mouth-big-teeth-grin', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness <= 1, EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED),

	createEmojiRule('quiet-smile', (prediction, options) => bothEyesOpen(prediction) && prediction.mouthRatio <= options.mouthSilence && prediction.happiness > 0.03, EMOTICONS.EMOJI_SMILING_SLIGHTLY),
	createEmojiRule('left-diagonal-mouth', prediction => bothEyesOpen(prediction) && prediction.leftSmirk > SMIRK_ASYMMETRY_THRESHOLD + prediction.rightSmirk, EMOTICONS.EMOJI_DIAGONAL_MOUTH),
	createEmojiRule('right-diagonal-mouth', prediction => bothEyesOpen(prediction) && SMIRK_ASYMMETRY_THRESHOLD + prediction.leftSmirk < prediction.rightSmirk, EMOTICONS.EMOJI_DIAGONAL_MOUTH),
	createEmojiRule('raised-eyebrow', prediction => bothEyesOpen(prediction) && prediction.eyebrowsRaisedBy > 0.3, EMOTICONS.EMOJI_RAISED_EYEBROW),
	createEmojiRule('angry', prediction => bothEyesOpen(prediction) && prediction.leftEyebrowRaisedBy < -AMOUNT_BEFORE_ANGRY && prediction.rightEyebrowRaisedBy < -AMOUNT_BEFORE_ANGRY, EMOTICONS.EMOJI_ANGRY),
	createEmojiRule('fearful', prediction => bothEyesOpen(prediction) && prediction.leftEyebrowRaisedBy > AMOUNT_BEFORE_FEARFUL && prediction.rightEyebrowRaisedBy > AMOUNT_BEFORE_FEARFUL, EMOTICONS.EMOJI_FEARFUL),
	createEmojiRule('grimacing', prediction => bothEyesOpen(prediction) && prediction.leftSmirk > AMOUNT_BEFORE_GRIMMACE && prediction.mouthStretchLeft > AMOUNT_BEFORE_GRIMMACE && prediction.rightSmirk > AMOUNT_BEFORE_GRIMMACE && prediction.mouthStretchRight > AMOUNT_BEFORE_GRIMMACE, EMOTICONS.EMOJI_GRIMACING),
	createEmojiRule('trippy', prediction => bothEyesOpen(prediction) && (prediction.rightEyeDirection > EYE_DIRECTION_TRIPPY && prediction.leftEyeDirection < EYE_DIRECTION_TRIPPY || prediction.rightEyeDirection < EYE_DIRECTION_TRIPPY && prediction.leftEyeDirection > EYE_DIRECTION_TRIPPY), EMOTICONS.EMOJI_TRIPPY),
	createEmojiRule('shaking', prediction => bothEyesOpen(prediction) && (prediction.rightEyeDirection > EYE_DIRECTION_SHAKING && prediction.leftEyeDirection < EYE_DIRECTION_SHAKING || prediction.rightEyeDirection < EYE_DIRECTION_SHAKING && prediction.leftEyeDirection > EYE_DIRECTION_SHAKING), EMOTICONS.EMOJI_SHAKING),

	createEmojiRule('left-wink-kiss', prediction => leftEyeClosedOnly(prediction) && prediction.mouthPucker > 0.91, EMOTICONS.EMOJI_KISSING_WINK),
	createEmojiRule('left-wink', leftEyeClosedOnly, EMOTICONS.EMOJI_LEFT_WINK),
	createEmojiRule('right-wink-kiss', prediction => rightEyeClosedOnly(prediction) && prediction.mouthPucker > 0.91, EMOTICONS.EMOJI_KISSING_WINK),
	createEmojiRule('right-wink', rightEyeClosedOnly, EMOTICONS.EMOJI_RIGHT_WINK),
	createEmojiRule('smirk', prediction => prediction.lookingRight && prediction.rightSmirk > prediction.leftSmirk, EMOTICONS.EMOJI_SMIRK),
	createEmojiRule('flushed', prediction => prediction.leftEyebrowRaisedBy > 0.1 && prediction.rightEyebrowRaisedBy > 0.1, EMOTICONS.EMOJI_FLUSHED),
	createEmojiRule('straight-face-default', prediction => prediction, EMOTICONS.EMOJI_NEUTRAL),
]

/**
 * Convert a face model into an emoji using ordered logic rules.
 * This mirrors the original priority tree while making each decision testable.
 * @param {Object} prediction - the ML prediction from mediaPipe 
 * @param {Object} options - configuration options
 */
export const recogniseEmojiFromFaceModelLogical = (prediction, options = {}) => {
	if (!prediction) {
		return EMOTICONS.EMOJI_NEUTRAL
	}

	const detectionOptions = {
		mouthCutOff: options.mouthCutOff ?? MOUTH_OPEN_SMALL,
		mouthSilence: options.mouthSilence ?? MOUTH_CLOSED_THRESHOLD
	}

	const matchedRule = emojiLogicRules.find(rule => rule.matches(prediction, detectionOptions))
	return matchedRule ? getEmojiRuleResult(matchedRule, prediction, detectionOptions) : EMOTICONS.EMOJI_NEUTRAL
}

/**
 * EmojiDetector class manages emoji detection state per person
 * Each person instance gets their own detector with independent state
 */
export class EmojiDetector {
	constructor() {
		this.previousEmoji = EMOTICONS.EMOJI_NEUTRAL
		this.previousScores = {}
		this.frameCount = 0
		this.stabilityCounter = 0
		this.emojiHoldCounter = 0
		this.lastSwitchFrame = -999
		this.eyeDirectionCounter = 0
	}

	/**
	 * Detect emoji using the selected method with smoothing
	 */
	detect(prediction, options) {
		this.frameCount++

		// Swap these lines to test each detector approach.
		// let currentEmoji = recogniseEmojiFromFaceModel(prediction, options)
		let currentEmoji = recogniseEmojiFromFaceModelLogical(prediction, options)
		// const currentEmoji = recogniseEmojiFromFaceModelAccurate(prediction, options, this)

		// Fallback to neutral if detection fails
		if (!currentEmoji || typeof currentEmoji !== 'string') {
			currentEmoji = EMOTICONS.EMOJI_NEUTRAL
		}

		// First frame - initialize
		if (this.previousEmoji === EMOTICONS.EMOJI_NEUTRAL && this.frameCount === 1) {
			this.previousEmoji = currentEmoji
			this.previousScores[currentEmoji] = 1.0
			return currentEmoji
		}

		// If same emoji as previous, keep it and increase stability
		if (currentEmoji === this.previousEmoji) {
			this.stabilityCounter = 0  // Reset counter when emoji is confirmed stable
			return currentEmoji
		}

		// Different emoji - check if we should switch based on stability
		this.stabilityCounter++

		// Different expressions require different stability thresholds to avoid false positives
		const isWink = currentEmoji === EMOTICONS.EMOJI_LEFT_WINK || currentEmoji === EMOTICONS.EMOJI_RIGHT_WINK
		const isRaisedEyebrow = currentEmoji === EMOTICONS.EMOJI_RAISED_EYEBROW
		const isEyebrowExpression = currentEmoji === EMOTICONS.EMOJI_ANGRY || currentEmoji === EMOTICONS.EMOJI_FEARFUL
		
		let requiredFrames = STABILITY_FRAMES
		if (isRaisedEyebrow) {
			requiredFrames = RAISED_EYEBROW_STABILITY_FRAMES
		} else if (isWink) {
			requiredFrames = WINK_STABILITY_FRAMES
		} else if (isEyebrowExpression) {
			requiredFrames = EYEBROW_STABILITY_FRAMES
		}

		// Require some stability before switching
		if (this.stabilityCounter >= requiredFrames) {
			this.previousEmoji = currentEmoji
			this.previousScores[currentEmoji] = 1.0
			this.stabilityCounter = 0
			this.lastSwitchFrame = this.frameCount
			return currentEmoji
		}

		// Not stable yet, stick with previous
		return this.previousEmoji
	}

	/**
	 * Reset state (when switching people or restarting)
	 */
	reset() {
		this.previousEmoji = EMOTICONS.EMOJI_NEUTRAL
		this.previousScores = {}
		this.frameCount = 0
		this.stabilityCounter = 0
		this.emojiHoldCounter = 0
		this.lastSwitchFrame = -999
		this.eyeDirectionCounter = 0
	}

	/**
	 * Get current state for debugging
	 */
	getState() {
		return {
			previousEmoji: this.previousEmoji,
			frameCount: this.frameCount,
			stabilityCounter: this.stabilityCounter
		}
	}
}

/**
 * Convert a face model into an emoji with improved accuracy
 * Uses composite emotion scoring, temporal smoothing, and stability checks
 * @param {Object} prediction - the ML prediction from mediaPipe 
 * @param {Object} options - configuration options
 * @param {Object} emotionState - state object tracking emotion changes
 * @param {Object} debugMode - set to true to log prediction values
 */
export const recogniseEmojiFromFaceModelAccurate = (prediction, options, emotionState, debugMode = false) => {
	
	emotionState.frameCount++
	
	// Ensure options has defaults
	const mouthCutOff = options?.mouthCutOff ?? 0.2
	
	// Validate prediction exists
	if (!prediction) {
		return emotionState.previousEmoji
	}
	
	// Debug logging for troubleshooting
	if (debugMode && emotionState.frameCount % 10 === 0) {
		console.log(`[Emoji Detection] Frame ${emotionState.frameCount}:`, {
			happiness: prediction.happiness?.toFixed(3),
			mouthRatio: prediction.mouthRatio?.toFixed(3),
			mouthPucker: prediction.mouthPucker?.toFixed(3),
			tongueOut: prediction.tongueOut?.toFixed(3),
			leftEyeClosed: prediction.leftEyeClosed,
			rightEyeClosed: prediction.rightEyeClosed,
			eyeVertical: prediction.eyeVertical?.toFixed(3),
			eyebrowsRaised: [prediction.leftEyebrowRaisedBy?.toFixed(3), prediction.rightEyebrowRaisedBy?.toFixed(3)],
			currentEmoji: emotionState.previousEmoji
		})
	}
	
	// Initialize emotion scores object - will store emoji and its confidence
	const emotionCandidates = [
		{ emoji: EMOTICONS.EMOJI_NEUTRAL, score: 0.1 } // baseline neutral
	]
	// ===== HIGHEST PRIORITY: Tongue Out =====
	if (prediction.tongueOut > TONGUE_OUT_THRESHOLD) {
		const tongueConfidence = Math.min(1, prediction.tongueOut + 0.5)
		
		// Determine which tongue emoji based on eyes
		let selectedEmoji = EMOTICONS.EMOJI_TONGUE
		if (prediction.leftEyeClosed && prediction.rightEyeClosed) {
			selectedEmoji = EMOTICONS.EMOJI_TONGUE_SQUINT
		} else if (prediction.leftEyeClosed || prediction.rightEyeClosed) {
			selectedEmoji = EMOTICONS.EMOJI_TONGUE_WINK
		}
		
		emotionCandidates.push({ emoji: selectedEmoji, score: tongueConfidence })
	}
	
	// ===== EYES STATE ANALYSIS =====
	const bothEyesClosed = prediction.leftEyeClosed && prediction.rightEyeClosed
	const bothEyesOpen = !prediction.leftEyeClosed && !prediction.rightEyeClosed
	const leftEyeClosed = prediction.leftEyeClosed && !prediction.rightEyeClosed
	const rightEyeClosed = !prediction.leftEyeClosed && prediction.rightEyeClosed
	const eyesClosed = bothEyesClosed
	
	// ===== MOUTH ANALYSIS =====
	const mouthOpen = prediction.mouthRatio > mouthCutOff
	const mouthPuckered = prediction.mouthPucker !== undefined && prediction.mouthPucker > MOUTH_PUCKER_KISS_THRESHOLD
	
	// ===== HAPPINESS ANALYSIS =====
	const isSad = prediction.happiness <= HAPPINESS_VERY_LOW
	
	// ===== EYEBROW ANALYSIS =====
	const eyebrowsRaisedLeft = prediction.leftEyebrowRaisedBy > EYEBROW_RAISED_THRESHOLD
	const eyebrowsRaisedRight = prediction.rightEyebrowRaisedBy > EYEBROW_RAISED_THRESHOLD
	const eyebrowsRaisedBoth = eyebrowsRaisedLeft && eyebrowsRaisedRight
	const eyebrowsAngryLeft = prediction.leftEyebrowRaisedBy < -AMOUNT_BEFORE_ANGRY
	const eyebrowsAngryRight = prediction.rightEyebrowRaisedBy < -AMOUNT_BEFORE_ANGRY
	const eyebrowsAngryBoth = eyebrowsAngryLeft && eyebrowsAngryRight
	const eyebrowsFearfulLeft = prediction.leftEyebrowRaisedBy > AMOUNT_BEFORE_FEARFUL
	const eyebrowsFearfulRight = prediction.rightEyebrowRaisedBy > AMOUNT_BEFORE_FEARFUL
	const eyebrowsFearfulBoth = eyebrowsFearfulLeft && eyebrowsFearfulRight
	
	// ===== EYE DIRECTION ANALYSIS =====
	const eyesLookingDifferently = (prediction.rightEyeDirection > EYE_DIRECTION_TRIPPY && prediction.leftEyeDirection < EYE_DIRECTION_TRIPPY) ||
	                                (prediction.rightEyeDirection < EYE_DIRECTION_TRIPPY && prediction.leftEyeDirection > EYE_DIRECTION_TRIPPY)
	const eyesAreShaking = (prediction.rightEyeDirection > EYE_DIRECTION_SHAKING && prediction.leftEyeDirection < EYE_DIRECTION_SHAKING) ||
	                        (prediction.rightEyeDirection < EYE_DIRECTION_SHAKING && prediction.leftEyeDirection > EYE_DIRECTION_SHAKING)
	const eyesRollingUp = prediction.eyeVertical < EYE_VERTICAL_ROLLING_THRESHOLD
	
	// ===== MOUTH SMIRK ANALYSIS =====
	const leftSmirkDominant = prediction.leftSmirk > SMIRK_ASYMMETRY_THRESHOLD + prediction.rightSmirk
	const rightSmirkDominant = prediction.rightSmirk > SMIRK_ASYMMETRY_THRESHOLD + prediction.leftSmirk
	const bothSmirking = prediction.leftSmirk > AMOUNT_BEFORE_GRIMMACE && prediction.rightSmirk > AMOUNT_BEFORE_GRIMMACE
	const mouthStretched = prediction.mouthStretchLeft > AMOUNT_BEFORE_GRIMMACE && prediction.mouthStretchRight > AMOUNT_BEFORE_GRIMMACE
	
	// ===== SPECIFIC EMOTION SCORING =====
	
	// Kiss detection (high priority when mouth puckered)
	if (mouthPuckered) {
		let kissEmoji = EMOTICONS.EMOJI_KISS
		let kissScore = 0.5  // Lower score to allow other emotions to compete
		
		if (eyesClosed) {
			kissEmoji = eyebrowsRaisedBoth ? EMOTICONS.EMOJI_KISS_EYES_CLOSED_EYEBROWS_RAISED : EMOTICONS.EMOJI_KISS_EYES_CLOSED
			kissScore = 0.45
		} else if (leftEyeClosed || rightEyeClosed) {
			kissEmoji = EMOTICONS.EMOJI_KISSING_WINK
			kissScore = 0.4
		}
		
		emotionCandidates.push({ emoji: kissEmoji, score: kissScore })
	}
	
	// ===== BOTH EYES CLOSED DETECTION =====
	if (eyesClosed) {
		const closedEyeHappiness = Math.max(0, prediction.happiness)
		
		// Mouth slightly open when eyes closed = smiling
		if (prediction.mouthRatio > MOUTH_CLOSED_THRESHOLD) {
			emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED, score: 0.8 })
		}
		
		// Score happiness when eyes closed
		if (isSad) {
			emotionCandidates.push({ emoji: EMOTICONS.EMOJI_FROWN_EYES_CLOSED, score: Math.abs(prediction.happiness) })
		} else if (prediction.happiness < HAPPINESS_LOW) {
			emotionCandidates.push({ emoji: EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED, score: 0.5 })
		} else if (prediction.happiness < HAPPINESS_MEDIUM) {
			emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SMILING_EYES_CLOSED, score: closedEyeHappiness })
		} else if (prediction.happiness <= HAPPINESS_HIGH) {
			emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED, score: closedEyeHappiness })
		} else if (prediction.happiness <= HAPPINESS_VERY_HIGH) {
			emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SMILING_GRIN_SQUINT, score: closedEyeHappiness })
		} else {
			emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED, score: closedEyeHappiness })
		}
	}
	
	// ===== SINGLE EYE CLOSED (WINK) - Only add if stable =====
	if (leftEyeClosed && !eyesClosed) {
		emotionCandidates.push({ emoji: EMOTICONS.EMOJI_LEFT_WINK, score: 0.6 })
	}
	
	if (rightEyeClosed && !eyesClosed) {
		emotionCandidates.push({ emoji: EMOTICONS.EMOJI_RIGHT_WINK, score: 0.6 })
	}
	
	// ===== BOTH EYES OPEN DETECTION =====
	if (bothEyesOpen) {
		
		// ===== PRIORITY 1: SMILE/HAPPINESS (HIGHEST PRIORITY) =====
		// Strong smile should override almost everything
		if (prediction.happiness > HAPPINESS_SMILE_THRESHOLD) {
			let happinessScore = Math.min(1, prediction.happiness * SMILE_BOOST_MULTIPLIER * 1.5)  // Boost further
			
			// Boost smile score to ensure it dominates over noisy eye detection
			// happinessScore = Math.min(1, happinessScore * SMILE_BOOST_MULTIPLIER)
			
			if (mouthOpen) {
				if (prediction.happiness < HAPPINESS_MEDIUM) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SMILING_SLIGHTLY, score: happinessScore * 0.85 })
				} else if (prediction.happiness <= HAPPINESS_HIGH) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SMILING_GRIN, score: happinessScore * 0.92 })
				} else if (prediction.happiness <= HAPPINESS_VERY_HIGH) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SMILING_BIG_GRIN, score: happinessScore * 0.98 })
				} else {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED, score: happinessScore })
				}
			} else {
				// Mouth closed but happy = subtle smile
				emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SMILING_SLIGHTLY, score: happinessScore * 0.75 })
			}
		}
		
		// ===== PRIORITY 2: KISS (mouth puckered) =====
		// Kiss is high priority as it's specific and intentional
		if (mouthPuckered) {
			emotionCandidates.push({ emoji: EMOTICONS.EMOJI_KISS, score: 0.5 })
		}
		
		// ===== PRIORITY 3: NEGATIVE EMOTIONS =====
		if (eyebrowsAngryBoth) {
			emotionCandidates.push({ emoji: EMOTICONS.EMOJI_ANGRY, score: 0.9 })
		}
		
		if (eyebrowsFearfulBoth) {
			emotionCandidates.push({ emoji: EMOTICONS.EMOJI_FEARFUL, score: 0.9 })
		}
		
		if (bothSmirking && mouthStretched) {
			emotionCandidates.push({ emoji: EMOTICONS.EMOJI_GRIMACING, score: 0.85 })
		}
		
		// ===== PRIORITY 4: SURPRISE/SHOCK (open mouth, no smile) =====
		if (mouthOpen && prediction.happiness <= HAPPINESS_SMILE_THRESHOLD) {
			const surpriseScore = Math.min(1, prediction.mouthRatio)
			
			if (eyebrowsRaisedBoth) {
				if (prediction.mouthRatio < MOUTH_OPEN_MEDIUM) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_OPEN_MOUTH, score: surpriseScore * 0.7 })
				} else if (prediction.mouthRatio < MOUTH_OPEN_LARGE) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SHOCKED, score: surpriseScore * 0.8 })
				} else if (prediction.mouthRatio < MOUTH_OPEN_XLARGE) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_ANGUISHED, score: surpriseScore * 0.8 })
				} else if (prediction.mouthRatio < MOUTH_OPEN_HUGE) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_ASTONISHED, score: surpriseScore * 0.85 })
				} else {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED, score: surpriseScore * 0.85 })
				}
			} else {
				// No raised eyebrows, just open mouth
				if (prediction.mouthRatio < MOUTH_OPEN_SMALL) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_OPEN_MOUTH, score: surpriseScore * 0.6 })
				} else if (prediction.mouthRatio < MOUTH_OPEN_MEDIUM) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_OPEN_MOUTH_BIG, score: surpriseScore * 0.7 })
				} else if (prediction.mouthRatio < MOUTH_OPEN_LARGE) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_EXHALING, score: surpriseScore * 0.75 })
				} else if (prediction.mouthRatio < MOUTH_OPEN_XLARGE) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SHOCKED, score: surpriseScore * 0.8 })
				} else if (prediction.mouthRatio < MOUTH_OPEN_HUGE) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_ANGUISHED, score: surpriseScore * 0.8 })
				} else if (prediction.mouthRatio < MOUTH_OPEN_EXTREME) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED, score: surpriseScore * 0.85 })
				} else if (prediction.mouthRatio < MOUTH_OPEN_MAX) {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_ASTONISHED, score: surpriseScore * 0.85 })
				} else {
					emotionCandidates.push({ emoji: EMOTICONS.EMOJI_WAIL, score: surpriseScore * 0.9 })
				}
			}
		}
		
		// ===== PRIORITY 5: EYEBROW EXPRESSIONS =====
		if (eyebrowsRaisedBoth) {
			emotionCandidates.push({ emoji: EMOTICONS.EMOJI_FLUSHED, score: 0.7 })
		}
		
		if ((eyebrowsRaisedLeft || eyebrowsRaisedRight) && !eyebrowsRaisedBoth) {
			emotionCandidates.push({ emoji: EMOTICONS.EMOJI_RAISED_EYEBROW, score: 0.6 })
		}
		
		// ===== PRIORITY 6: ASYMMETRIC MOUTH (smirk/diagonal) =====
		if (leftSmirkDominant || rightSmirkDominant) {
			if (rightSmirkDominant && prediction.lookingRight) {
				emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SMIRK, score: 0.7 })
			} else {
				emotionCandidates.push({ emoji: EMOTICONS.EMOJI_DIAGONAL_MOUTH, score: 0.65 })
			}
		}
		
		// ===== PRIORITY 7: EYE DIRECTION (LOWEST priority - highly unreliable) =====
		// Eye direction is extremely noisy from MediaPipe, only use with extreme caution
		// Only enable if we're already stuck on this emoji OR user intentionally held expression
		const currentlyTrippy = emotionState.previousEmoji === EMOTICONS.EMOJI_TRIPPY
		const currentlyShaking = emotionState.previousEmoji === EMOTICONS.EMOJI_SHAKING
		const framesInCurrentEmotion = emotionState.frameCount - emotionState.lastSwitchFrame
		
		// Only consider eye direction if no smile AND no other strong emotion detected
		const hasStrongEmotion = emotionCandidates.some(c => c.score > 0.6)
		
		if (!hasStrongEmotion && prediction.happiness <= HAPPINESS_SMILE_THRESHOLD) {
			if (eyesRollingUp) {
				emotionCandidates.push({ emoji: EMOTICONS.EMOJI_EYES_ROLLING_UP, score: 0.2 })
			}
			
			// Trippy/Shaking: only if already showing OR very stable in that state
			if (eyesLookingDifferently && currentlyTrippy && framesInCurrentEmotion > 30) {
				emotionCandidates.push({ emoji: EMOTICONS.EMOJI_TRIPPY, score: 0.4 })
			}
			
			if (eyesAreShaking && currentlyShaking && framesInCurrentEmotion > 30) {
				emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SHAKING, score: 0.4 })
			}
		}
	}
	
	// ===== FALLBACK: Basic smile if mouth open without other expression =====
	// This catches simple open-mouth expressions
	if (mouthOpen && emotionCandidates.length === 1) {
		emotionCandidates.push({ emoji: EMOTICONS.EMOJI_SMILING_SLIGHTLY, score: 0.5 })
	}
	
	// ===== SCORE SELECTION =====
	// Find the highest scoring emotion
	let bestCandidate = emotionCandidates[0]
	for (const candidate of emotionCandidates) {
		if (candidate.score > bestCandidate.score) {
			bestCandidate = candidate
		}
	}
	
	// Simple hysteresis: only switch if score is significantly better
	const previousScore = emotionState.previousScores[emotionState.previousEmoji] ?? 0
	const sameEmoji = bestCandidate.emoji === emotionState.previousEmoji
	
	// If same emoji, always use it
	if (sameEmoji) {
		emotionState.previousScores[bestCandidate.emoji] = bestCandidate.score
		return bestCandidate.emoji
	}
	
	// If different emoji, only switch if score is significantly higher
	if (bestCandidate.score > previousScore + SWITCH_HYSTERESIS) {
		emotionState.previousEmoji = bestCandidate.emoji
		emotionState.previousScores[bestCandidate.emoji] = bestCandidate.score
		return bestCandidate.emoji
	}
	
	// Otherwise stick with previous emoji
	return emotionState.previousEmoji
}
