// import { EMOJI_ANGRY, EMOJI_DIAGONAL_MOUTH, EMOJI_EYES_ROLLING_UP, EMOJI_FROWN_EYES_CLOSED, EMOJI_KISS, EMOJI_KISS_EYES_CLOSED, EMOJI_LEFT_WINK, EMOJI_NEUTRAL, EMOJI_NEUTRAL_EYES_CLOSED, EMOJI_OPEN_MOUTH, EMOJI_OPEN_MOUTH_BIG, EMOJI_RAISED_EYEBROW, EMOJI_SHAKING, EMOJI_SHAKING_HORIZONTALLY, EMOJI_SHAKING_VERTICALLY, EMOJI_SMILING_BIG_GRIN, EMOJI_SMILING_BIG_TEETH_GRIN, EMOJI_SMILING_EYES_CLOSED, EMOJI_SMILING_GRIN, EMOJI_SMILING_GRIN_SQUINT, EMOJI_SMILING_SLIGHTLY, EMOJI_SMIRK, EMOJI_TRIPPY, EMOJI_WAIL } from "./emoji"
import * as EMOTICONS from './emoji.js'

// ===== CONFIGURATION =====
// Set to true to use the accurate emoji detection method, false for original
// Can also use 'smooth' for the new smoothed version
const USE_ACCURATE_DETECTION = true

// ===== TEMPORAL SMOOTHING & STABILITY =====
// Hysteresis: stick with current emoji unless new emotion scores this much higher
// Reduced to 0.05 to allow smile detection to override neutral
const SWITCH_HYSTERESIS = 0.05

// Smile detection boost: if any smile is detected, boost its score
const SMILE_BOOST_MULTIPLIER = 2.0 
const AMOUNT_BEFORE_GRIMMACE = 0.6
const AMOUNT_BEFORE_ANGRY = 0.55
const AMOUNT_BEFORE_FEARFUL = 0.4
const AMOUNT_BEFORE_FROWN = 0.15

// Thresholds for accurate emoji detection
const MOUTH_PUCKER_KISS_THRESHOLD = 0.98
const TONGUE_OUT_THRESHOLD = 0.55
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
// Values below this are treated as ambiguous model noise. The lower exit
// threshold provides hysteresis so a held smile does not phase out.
const HAPPINESS_SMILE_THRESHOLD = 0.12
const HAPPINESS_SMILE_EXIT_THRESHOLD = 0.07
const SMILE_EMOJIS = new Set([
	EMOTICONS.EMOJI_SMILING_SLIGHTLY,
	EMOTICONS.EMOJI_SMILING_GRIN,
	EMOTICONS.EMOJI_SMILING_BIG_GRIN,
	EMOTICONS.EMOJI_SMILING_EYES_CLOSED,
	EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED,
	EMOTICONS.EMOJI_SMILING_GRIN_SQUINT,
	EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED,
])
const EYEBROW_RAISED_THRESHOLD = 0.45
const EYE_DIRECTION_TRIPPY = 0.66
const EYE_DIRECTION_SHAKING = 0.2
const SMIRK_ASYMMETRY_THRESHOLD = 0.1
const getFilteredEmoji = (emoji, options = {}) => EMOTICONS.filterEmojiForMood(emoji, options.emojiMood)
const finiteSignal = value => Number.isFinite(value) ? value : 0
const getSmileSignal = prediction => Math.max(
	finiteSignal(prediction?.smileEvidence),
	finiteSignal(prediction?.mouthSmile),
	finiteSignal(prediction?.smile),
	finiteSignal(prediction?.happiness)
)

// Blendshapes can briefly fall back to zero while the mesh still clearly shows
// separated lips. Keep this tiny geometry check here as the classifier's final
// safety net rather than letting a transient model score select a closed mouth.
const MOUTH_OPEN_GEOMETRY_RATIO = 0.055
const getMouthGeometryRatio = prediction => {
	const points = prediction?.keypoints
	const upperLip = points?.[13]
	const lowerLip = points?.[14]
	const leftCorner = points?.[61]
	const rightCorner = points?.[291]
	const values = [upperLip?.x, upperLip?.y, lowerLip?.x, lowerLip?.y, leftCorner?.x, leftCorner?.y, rightCorner?.x, rightCorner?.y]

	if (!values.every(Number.isFinite)) return 0

	const mouthWidth = Math.hypot(rightCorner.x - leftCorner.x, rightCorner.y - leftCorner.y)
	if (mouthWidth === 0) return 0

	return Math.hypot(lowerLip.x - upperLip.x, lowerLip.y - upperLip.y) / mouthWidth
}
const hasOpenFaceMouth = prediction =>
	prediction?.isMouthOpen === true ||
	finiteSignal(prediction?.mouthRatio) >= MOUTH_OPEN_SMALL ||
	getMouthGeometryRatio(prediction) >= MOUTH_OPEN_GEOMETRY_RATIO

const getOpenMouthSmileEmoji = prediction => {
	if (prediction.leftEyeClosed && prediction.rightEyeClosed) {
		return EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED
	}

	return getSmileSignal(prediction) >= HAPPINESS_MEDIUM
		? EMOTICONS.EMOJI_SMILING_GRIN
		: EMOTICONS.EMOJI_SMILING_SLIGHTLY
}

// Preserve the hand-tuned thresholds, while making the otherwise unreachable
// low-happiness expressions explicit and cheap to evaluate.
const getSadEmoji = (prediction, options) => {
	const isFrowning =
		prediction.mouthFrownLeft >= AMOUNT_BEFORE_FROWN &&
		prediction.mouthFrownRight >= AMOUNT_BEFORE_FROWN
	const isWorried = prediction.eyebrowsInnerRaisedBy > 0.3

	if (prediction.leftEyebrowRaisedBy > AMOUNT_BEFORE_FEARFUL && prediction.rightEyebrowRaisedBy > AMOUNT_BEFORE_FEARFUL) {
		return EMOTICONS.EMOJI_FEARFUL
	}

	if (prediction.happiness < HAPPINESS_VERY_LOW && prediction.mouthRatio <= options.mouthSilence) {
		if (isFrowning && isWorried) return EMOTICONS.EMOJI_WORRIED
		if (isFrowning) return EMOTICONS.EMOJI_FROWNING
	}

	return null
}

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
		return getFilteredEmoji(recogniseEmojiFromFaceModelAccurate(prediction, options, emotionState), options)
	} else {
		return recogniseEmojiFromFaceModel(prediction, options)
	}
}

/**
 * Convert a face model into an emoji (ORIGINAL IMPLEMENTATION)
 * @param {Object} prediction - the ML prediction from mediaPipe 
 * @param {Object} options -  
 */
const recogniseEmojiFromFaceModelRaw = (prediction, options) => {
	const happiness = getSmileSignal(prediction)
	const mouthIsVisiblyOpen = hasOpenFaceMouth(prediction)

	// const prediction = person.data
	// Recognise EMOJI in order of most common ones

	// options.mouthSilence && amp < options.mouthCutOff

	// Tongue out!
	if (prediction.tongueOut > TONGUE_OUT_THRESHOLD)
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
		if (mouthIsVisiblyOpen) return getOpenMouthSmileEmoji(prediction)

		if (happiness < HAPPINESS_VERY_LOW){
			return EMOTICONS.EMOJI_FROWN_EYES_CLOSED
		}
		if (happiness < HAPPINESS_SMILE_THRESHOLD){
			return EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED
		}
		if (happiness < HAPPINESS_MEDIUM){
			return EMOTICONS.EMOJI_SMILING_EYES_CLOSED
		}
		if (happiness <=0.6){
			return EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED
		}
		if (happiness <=0.7){
			return EMOTICONS.EMOJI_SMILING_GRIN_SQUINT
		}
		if (happiness <= 1){
			return EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED
		}
		return mouthIsVisiblyOpen ? getOpenMouthSmileEmoji(prediction) : EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED
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
			if (happiness < HAPPINESS_SMILE_THRESHOLD)
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
			}else if (happiness < 0.5){
				return EMOTICONS.EMOJI_SMILING_SLIGHTLY
			}else if (happiness <=0.65){
				return EMOTICONS.EMOJI_SMILING_GRIN
			}else if (happiness <= 0.8){
				return EMOTICONS.EMOJI_SMILING_BIG_GRIN
			}else if (prediction.happiness <= 1){
				return EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED
			}

		}else if (prediction.mouthRatio <= options.mouthSilence && happiness >= HAPPINESS_SMILE_THRESHOLD ){
		
			return EMOTICONS.EMOJI_SMILING_SLIGHTLY
		}else if (prediction.leftSmirk > 0.1 + prediction.rightSmirk){
			return EMOTICONS.EMOJI_DIAGONAL_MOUTH
		}else if ( 0.1 +prediction.leftSmirk < prediction.rightSmirk){
			return EMOTICONS.EMOJI_DIAGONAL_MOUTH
		}
	
		
		const sadEmoji = getSadEmoji(prediction, options)
		if (sadEmoji)
		{
			return sadEmoji
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

export const recogniseEmojiFromFaceModel = (prediction, options = {}) =>
	getFilteredEmoji(recogniseEmojiFromFaceModelRaw(prediction, options), options)

const createEmojiRule = (name, matches, emoji) => ({ name, matches, emoji })

const getEmojiRuleResult = (rule, prediction, options) => 
	typeof rule.emoji === 'function' ? rule.emoji(prediction, options) : rule.emoji

const bothEyesClosed = prediction => prediction.leftEyeClosed && prediction.rightEyeClosed
const bothEyesOpen = prediction => !prediction.leftEyeClosed && !prediction.rightEyeClosed
const leftEyeClosedOnly = prediction => prediction.leftEyeClosed && !prediction.rightEyeClosed
const rightEyeClosedOnly = prediction => !prediction.leftEyeClosed && prediction.rightEyeClosed
const mouthIsOpen = (prediction, options) => prediction.mouthRatio > options.mouthCutOff
const isRightWinkExpression = (prediction, emoji) =>
	rightEyeClosedOnly(prediction) && [
		EMOTICONS.EMOJI_RIGHT_WINK,
		EMOTICONS.EMOJI_KISSING_WINK,
		EMOTICONS.EMOJI_TONGUE_WINK
	].includes(emoji)
const isMirroredAsymmetricExpression = (prediction, emoji) => {
	switch(emoji) {
		case EMOTICONS.EMOJI_DIAGONAL_MOUTH:
		case EMOTICONS.EMOJI_SMIRK:
			return (prediction.rightSmirk ?? 0) > (prediction.leftSmirk ?? 0)
		case EMOTICONS.EMOJI_RAISED_EYEBROW:
			return (prediction.rightEyebrowRaisedBy ?? 0) > (prediction.leftEyebrowRaisedBy ?? 0)
		default:
			return false
	}
}

const emojiLogicRules = [

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
	createEmojiRule('closed-eye-open-mouth-grin', prediction => bothEyesClosed(prediction) && hasOpenFaceMouth(prediction), getOpenMouthSmileEmoji),
	createEmojiRule('closed-eye-frown', prediction => bothEyesClosed(prediction) && getSmileSignal(prediction) < HAPPINESS_VERY_LOW, EMOTICONS.EMOJI_FROWN_EYES_CLOSED),
	createEmojiRule('closed-eye-neutral', prediction => bothEyesClosed(prediction) && !hasOpenFaceMouth(prediction) && getSmileSignal(prediction) < HAPPINESS_SMILE_THRESHOLD, EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED),
	createEmojiRule('closed-eye-smile', prediction => bothEyesClosed(prediction) && getSmileSignal(prediction) < HAPPINESS_MEDIUM, EMOTICONS.EMOJI_SMILING_EYES_CLOSED),
	createEmojiRule('closed-eye-grin', prediction => bothEyesClosed(prediction) && getSmileSignal(prediction) <= 0.6, EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED),
	createEmojiRule('closed-eye-squint-grin', prediction => bothEyesClosed(prediction) && getSmileSignal(prediction) <= 0.7, EMOTICONS.EMOJI_SMILING_GRIN_SQUINT),
	createEmojiRule('closed-eye-big-teeth-grin', prediction => bothEyesClosed(prediction) && getSmileSignal(prediction) <= 1, EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED),
	createEmojiRule('closed-eye-fallback', bothEyesClosed, EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED),

	createEmojiRule('open-eye-kiss', prediction => bothEyesOpen(prediction) && prediction.mouthPucker > MOUTH_PUCKER_KISS_THRESHOLD, EMOTICONS.EMOJI_KISS),
	createEmojiRule('open-eye-rolling-up', prediction => bothEyesOpen(prediction) && prediction.eyeVertical < EYE_VERTICAL_ROLLING_THRESHOLD, EMOTICONS.EMOJI_EYES_ROLLING_UP),
	createEmojiRule('raised-eyebrows-small-open-mouth', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_SMILE_THRESHOLD && prediction.eyebrowsRaisedBy > 0.3 && prediction.mouthRatio < 0.3, EMOTICONS.EMOJI_OPEN_MOUTH),
	createEmojiRule('raised-eyebrows-shocked', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_SMILE_THRESHOLD && prediction.eyebrowsRaisedBy > 0.3 && prediction.mouthRatio < 0.4, EMOTICONS.EMOJI_SHOCKED),
	createEmojiRule('raised-eyebrows-anguished', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_SMILE_THRESHOLD && prediction.eyebrowsRaisedBy > 0.3 && prediction.mouthRatio < 0.5, EMOTICONS.EMOJI_ANGUISHED),
	createEmojiRule('raised-eyebrows-astonished', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_SMILE_THRESHOLD && prediction.eyebrowsRaisedBy > 0.3 && prediction.mouthRatio < 0.65, EMOTICONS.EMOJI_ASTONISHED),
	createEmojiRule('raised-eyebrows-anguished-raised', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_SMILE_THRESHOLD && prediction.eyebrowsRaisedBy > 0.3 && prediction.mouthRatio < 0.8, EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED),

	createEmojiRule('open-mouth-small', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_SMILE_THRESHOLD && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < MOUTH_OPEN_SMALL, EMOTICONS.EMOJI_OPEN_MOUTH),
	createEmojiRule('open-mouth-big', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_SMILE_THRESHOLD && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < MOUTH_OPEN_MEDIUM, EMOTICONS.EMOJI_OPEN_MOUTH_BIG),
	createEmojiRule('open-mouth-exhaling', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_SMILE_THRESHOLD && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < MOUTH_OPEN_LARGE, EMOTICONS.EMOJI_EXHALING),
	createEmojiRule('open-mouth-shocked', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_SMILE_THRESHOLD && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < MOUTH_OPEN_XLARGE, EMOTICONS.EMOJI_SHOCKED),
	createEmojiRule('open-mouth-anguished', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_SMILE_THRESHOLD && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < 0.6, EMOTICONS.EMOJI_ANGUISHED),
	createEmojiRule('open-mouth-anguished-raised', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_SMILE_THRESHOLD && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < 0.75, EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED),
	createEmojiRule('open-mouth-astonished', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_SMILE_THRESHOLD && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio < MOUTH_OPEN_MAX, EMOTICONS.EMOJI_ASTONISHED),
	createEmojiRule('open-mouth-wail', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_SMILE_THRESHOLD && prediction.eyebrowsRaisedBy <= 0.3 && prediction.mouthRatio <= 1, EMOTICONS.EMOJI_WAIL),

	createEmojiRule('open-mouth-slight-smile', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness < HAPPINESS_MEDIUM, EMOTICONS.EMOJI_SMILING_SLIGHTLY),
	createEmojiRule('open-mouth-grin', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness <= HAPPINESS_HIGH, EMOTICONS.EMOJI_SMILING_GRIN),
	createEmojiRule('open-mouth-big-grin', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness <= HAPPINESS_VERY_HIGH, EMOTICONS.EMOJI_SMILING_BIG_GRIN),
	createEmojiRule('open-mouth-big-teeth-grin', (prediction, options) => bothEyesOpen(prediction) && mouthIsOpen(prediction, options) && prediction.happiness <= 1, EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED),

	createEmojiRule('quiet-smile', (prediction, options) => bothEyesOpen(prediction) && prediction.mouthRatio <= options.mouthSilence && prediction.happiness >= HAPPINESS_SMILE_THRESHOLD, EMOTICONS.EMOJI_SMILING_SLIGHTLY),
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
		return getFilteredEmoji(EMOTICONS.EMOJI_NEUTRAL, options)
	}

	const detectionOptions = {
		mouthCutOff: options.mouthCutOff ?? MOUTH_OPEN_SMALL,
		mouthSilence: options.mouthSilence ?? MOUTH_CLOSED_THRESHOLD,
		emojiMood: options.emojiMood
	}
	const detectionPrediction = {
		...prediction,
		happiness:getSmileSignal(prediction)
	}

	const matchedRule = emojiLogicRules.find(rule => rule.matches(detectionPrediction, detectionOptions))
	const emoji = matchedRule ? getEmojiRuleResult(matchedRule, detectionPrediction, detectionOptions) : EMOTICONS.EMOJI_NEUTRAL
	return getFilteredEmoji(emoji, options)
}

const EXPRESSION_FILTER_FIELDS = [
	'happiness', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutralExpression',
	'smile', 'smileEvidence', 'mouthSmile', 'mouthSmileLeft', 'mouthSmileRight',
	'cheekSquintLeft', 'cheekSquintRight', 'mouthRatio', 'mouthGeometryScore', 'mouthPucker',
	'mouthFrownLeft', 'mouthFrownRight', 'mouthStretchLeft', 'mouthStretchRight',
	'leftSmirk', 'rightSmirk', 'leftEyeClosedBy', 'rightEyeClosedBy',
	'leftEyebrowRaisedBy', 'rightEyebrowRaisedBy', 'eyebrowsInnerRaisedBy', 'eyebrowsRaisedBy',
	'rightEyeDirection', 'leftEyeDirection', 'eyeVertical', 'tongueOut',
]

const SMILE_FAMILY = 'smile'
const NEUTRAL_FAMILY = 'neutral'
const WINK_FAMILY = 'wink'
const KISS_FAMILY = 'kiss'
const OPEN_MOUTH_FAMILY = 'open-mouth'
const NEGATIVE_FAMILY = 'negative'
const ASYMMETRIC_FAMILY = 'asymmetric'
const OTHER_FAMILY = 'other'

const NEUTRAL_EMOJIS = new Set([EMOTICONS.EMOJI_NEUTRAL, EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED])
const WINK_EMOJIS = new Set([EMOTICONS.EMOJI_LEFT_WINK, EMOTICONS.EMOJI_RIGHT_WINK])
const KISS_EMOJIS = new Set([
	EMOTICONS.EMOJI_KISS,
	EMOTICONS.EMOJI_KISS_EYES_CLOSED,
	EMOTICONS.EMOJI_KISS_EYES_CLOSED_EYEBROWS_RAISED,
	EMOTICONS.EMOJI_KISSING_WINK,
])
const OPEN_MOUTH_EMOJIS = new Set([
	EMOTICONS.EMOJI_OPEN_MOUTH,
	EMOTICONS.EMOJI_OPEN_MOUTH_BIG,
	EMOTICONS.EMOJI_EXHALING,
	EMOTICONS.EMOJI_SHOCKED,
	EMOTICONS.EMOJI_ANGUISHED,
	EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED,
	EMOTICONS.EMOJI_ASTONISHED,
	EMOTICONS.EMOJI_WAIL,
])
const NEGATIVE_EMOJIS = new Set([
	EMOTICONS.EMOJI_FROWNING,
	EMOTICONS.EMOJI_FROWN_EYES_CLOSED,
	EMOTICONS.EMOJI_WORRIED,
	EMOTICONS.EMOJI_FEARFUL,
	EMOTICONS.EMOJI_ANGRY,
	EMOTICONS.EMOJI_GRIMACING,
	EMOTICONS.EMOJI_PERSEVERING,
])
const ASYMMETRIC_EMOJIS = new Set([
	EMOTICONS.EMOJI_DIAGONAL_MOUTH,
	EMOTICONS.EMOJI_SMIRK,
	EMOTICONS.EMOJI_RAISED_EYEBROW,
])

const getExpressionFamily = emoji => {
	if (SMILE_EMOJIS.has(emoji)) return SMILE_FAMILY
	if (NEUTRAL_EMOJIS.has(emoji)) return NEUTRAL_FAMILY
	if (WINK_EMOJIS.has(emoji)) return WINK_FAMILY
	if (KISS_EMOJIS.has(emoji)) return KISS_FAMILY
	if (OPEN_MOUTH_EMOJIS.has(emoji)) return OPEN_MOUTH_FAMILY
	if (NEGATIVE_EMOJIS.has(emoji)) return NEGATIVE_FAMILY
	if (ASYMMETRIC_EMOJIS.has(emoji)) return ASYMMETRIC_FAMILY
	return OTHER_FAMILY
}

const getInferredParameter = (prediction, parameter, fallback) => Number.isFinite(prediction?.[parameter])
	? prediction[parameter]
	: fallback

const recogniseEmojiFromBlendshapeParameters = (prediction, options = {}) => {
	if (!prediction) return EMOTICONS.EMOJI_NEUTRAL

	const happiness = getSmileSignal(prediction)
	const sadness = getInferredParameter(
		prediction,
		'sadness',
		0.72 * ((finiteSignal(prediction.mouthFrownLeft) + finiteSignal(prediction.mouthFrownRight)) * 0.5) +
		0.28 * finiteSignal(prediction.eyebrowsInnerRaisedBy)
	)
	const anger = getInferredParameter(
		prediction,
		'anger',
		Math.max(0, -0.5 * (finiteSignal(prediction.leftEyebrowRaisedBy) + finiteSignal(prediction.rightEyebrowRaisedBy)))
	)
	const fear = getInferredParameter(prediction, 'fear', 0)
	const surprise = getInferredParameter(
		prediction,
		'surprise',
		0.45 * finiteSignal(prediction.eyebrowsRaisedBy) + 0.55 * finiteSignal(prediction.mouthRatio)
	)
	const disgust = getInferredParameter(
		prediction,
		'disgust',
		0.5 * (finiteSignal(prediction.noseSneerLeft) + finiteSignal(prediction.noseSneerRight))
	)
	const mouthOpen = hasOpenFaceMouth(prediction)
	const eyesClosed = bothEyesClosed(prediction)

	if (finiteSignal(prediction.tongueOut) > TONGUE_OUT_THRESHOLD) {
		return getFilteredEmoji(
			eyesClosed ? EMOTICONS.EMOJI_TONGUE_SQUINT : (prediction.leftEyeClosed || prediction.rightEyeClosed) ? EMOTICONS.EMOJI_TONGUE_WINK : EMOTICONS.EMOJI_TONGUE,
			options
		)
	}

	if (finiteSignal(prediction.mouthPucker) > 0.72) {
		const kiss = eyesClosed
			? EMOTICONS.EMOJI_KISS_EYES_CLOSED
			: (prediction.leftEyeClosed || prediction.rightEyeClosed)
				? EMOTICONS.EMOJI_KISSING_WINK
				: EMOTICONS.EMOJI_KISS
		return getFilteredEmoji(kiss, options)
	}

	if (leftEyeClosedOnly(prediction)) return getFilteredEmoji(EMOTICONS.EMOJI_LEFT_WINK, options)
	if (rightEyeClosedOnly(prediction)) return getFilteredEmoji(EMOTICONS.EMOJI_RIGHT_WINK, options)

	if (eyesClosed) {
		if (happiness >= HAPPINESS_SMILE_THRESHOLD) {
			return getFilteredEmoji(
				happiness >= 0.55 ? EMOTICONS.EMOJI_SMILING_GRIN_SQUINT : EMOTICONS.EMOJI_SMILING_EYES_CLOSED,
				options
			)
		}
		if (sadness >= 0.28) return getFilteredEmoji(EMOTICONS.EMOJI_FROWN_EYES_CLOSED, options)
		return getFilteredEmoji(EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED, options)
	}

	if (happiness >= HAPPINESS_SMILE_THRESHOLD) {
		let emoji = EMOTICONS.EMOJI_SMILING_SLIGHTLY
		if (mouthOpen && happiness >= 0.7) emoji = EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED
		else if (mouthOpen && happiness >= 0.48) emoji = EMOTICONS.EMOJI_SMILING_BIG_GRIN
		else if (mouthOpen || happiness >= 0.3) emoji = EMOTICONS.EMOJI_SMILING_GRIN
		return getFilteredEmoji(emoji, options)
	}

	if (anger >= 0.38) return getFilteredEmoji(EMOTICONS.EMOJI_ANGRY, options)
	if (fear >= 0.42 && fear > surprise + 0.04) return getFilteredEmoji(EMOTICONS.EMOJI_FEARFUL, options)
	if (sadness >= 0.28) {
		return getFilteredEmoji(
			finiteSignal(prediction.eyebrowsInnerRaisedBy) >= 0.25 ? EMOTICONS.EMOJI_WORRIED : EMOTICONS.EMOJI_FROWNING,
			options
		)
	}
	if (disgust >= 0.42) return getFilteredEmoji(EMOTICONS.EMOJI_GRIMACING, options)
	if (surprise >= 0.34 && mouthOpen) {
		return getFilteredEmoji(
			finiteSignal(prediction.mouthRatio) >= 0.55 ? EMOTICONS.EMOJI_ASTONISHED : EMOTICONS.EMOJI_OPEN_MOUTH,
			options
		)
	}

	if (finiteSignal(prediction.leftSmirk) > SMIRK_ASYMMETRY_THRESHOLD + finiteSignal(prediction.rightSmirk) ||
		finiteSignal(prediction.rightSmirk) > SMIRK_ASYMMETRY_THRESHOLD + finiteSignal(prediction.leftSmirk)) {
		return getFilteredEmoji(EMOTICONS.EMOJI_DIAGONAL_MOUTH, options)
	}
	if (mouthOpen) return getFilteredEmoji(EMOTICONS.EMOJI_OPEN_MOUTH, options)
	return getFilteredEmoji(EMOTICONS.EMOJI_NEUTRAL, options)
}

// A high-alpha asymmetric filter removes isolated blendshape spikes while
// following intentional facial motion within one or two inference samples.
class ResponsiveSignalFilter {
	constructor(riseAlpha = 0.85, fallAlpha = 0.75) {
		this.riseAlpha = riseAlpha
		this.fallAlpha = fallAlpha
		this.value = undefined
	}

	filter(value) {
		if (!Number.isFinite(value)) return value
		if (!Number.isFinite(this.value)) {
			this.value = value
			return value
		}
		const alpha = value >= this.value ? this.riseAlpha : this.fallAlpha
		this.value += alpha * (value - this.value)
		return this.value
	}
}

const getObservationTime = suppliedTime => Number.isFinite(suppliedTime)
	? suppliedTime
	: (globalThis.performance?.now?.() ?? Date.now())

const getSourceTimestamp = (prediction, observationTime) => Number.isFinite(prediction?.time)
	? prediction.time * 1000
	: Number.isFinite(prediction?.timestamp)
		? prediction.timestamp
		: observationTime

const hasExplicitSourceTimestamp = prediction => Number.isFinite(prediction?.time) || Number.isFinite(prediction?.timestamp)

const getStableEyeClosed = (wasClosed, amount, fallback) => {
	if (!Number.isFinite(amount)) return Boolean(fallback)
	return wasClosed ? amount >= 0.45 : amount >= 0.65
}

/**
 * EmojiDetector class manages emoji detection state per person
 * Each person instance gets their own detector with independent state
 */
export class EmojiDetector {
	constructor() {
		this.previousEmoji = EMOTICONS.EMOJI_NEUTRAL
		this.frameCount = 0
		this.candidateEmoji = null
		this.candidateSamples = 0
		this.lastSwitchAt = 0
		this.lastSourceTimestamp = undefined
		this.lastFreshObservationAt = undefined
		this.signalFilters = new Map()
		this.filteredPrediction = undefined
		this.leftEyeClosed = false
		this.rightEyeClosed = false
		this.isMirrored = false
	}

	filterPrediction(prediction) {
		const filtered = { ...prediction }
		for (const field of EXPRESSION_FILTER_FIELDS) {
			if (!Number.isFinite(prediction[field])) continue
			let signalFilter = this.signalFilters.get(field)
			if (!signalFilter) {
				signalFilter = new ResponsiveSignalFilter()
				this.signalFilters.set(field, signalFilter)
			}
			filtered[field] = signalFilter.filter(prediction[field])
		}

		this.leftEyeClosed = getStableEyeClosed(this.leftEyeClosed, filtered.leftEyeClosedBy, prediction.leftEyeClosed)
		this.rightEyeClosed = getStableEyeClosed(this.rightEyeClosed, filtered.rightEyeClosedBy, prediction.rightEyeClosed)
		filtered.leftEyeClosed = this.leftEyeClosed
		filtered.rightEyeClosed = this.rightEyeClosed
		filtered.eyesClosed = this.leftEyeClosed && this.rightEyeClosed
		return filtered
	}

	getRequiredSamples(currentEmoji, smileEvidence) {
		const currentFamily = getExpressionFamily(currentEmoji)
		const previousFamily = getExpressionFamily(this.previousEmoji)
		if (currentFamily === NEUTRAL_FAMILY) return 2
		if (currentFamily === previousFamily) return 2
		if (currentFamily === SMILE_FAMILY && smileEvidence < 0.24) return 2
		return 1
	}

	handleStalePrediction(observationTime) {
		if (!Number.isFinite(this.lastFreshObservationAt)) return this.previousEmoji
		if (observationTime - this.lastFreshObservationAt < 900) return this.previousEmoji
		this.previousEmoji = EMOTICONS.EMOJI_DOTTED_LINE
		this.candidateEmoji = null
		this.isMirrored = false
		return this.previousEmoji
	}

	/**
	 * Detect an emoji from a new model sample. Strong expressions react on the
	 * first sample; ambiguous changes use one extra fresh inference sample.
	 * Repeated cached render frames do not vote.
	 */
	detect(prediction, options = {}, suppliedObservationTime) {
		const observationTime = getObservationTime(suppliedObservationTime)
		if (!prediction) return this.handleStalePrediction(observationTime)

		const sourceTimestamp = getSourceTimestamp(prediction, observationTime)
		if (hasExplicitSourceTimestamp(prediction) && sourceTimestamp === this.lastSourceTimestamp) {
			return this.handleStalePrediction(observationTime)
		}

		this.lastSourceTimestamp = sourceTimestamp
		this.lastFreshObservationAt = observationTime
		this.frameCount++
		const filteredPrediction = this.filterPrediction(prediction)
		this.filteredPrediction = filteredPrediction

		let currentEmoji = recogniseEmojiFromBlendshapeParameters(filteredPrediction, options)
		if (!currentEmoji || typeof currentEmoji !== 'string') currentEmoji = EMOTICONS.EMOJI_NEUTRAL

		const previousFamily = getExpressionFamily(this.previousEmoji)
		let currentFamily = getExpressionFamily(currentEmoji)
		const smileEvidence = getSmileSignal(filteredPrediction)

		// Expression-family hysteresis: a momentary dip may alter smile intensity,
		// but cannot demote a held smile to neutral while smile evidence remains.
		if (previousFamily === SMILE_FAMILY && currentFamily === NEUTRAL_FAMILY && smileEvidence >= HAPPINESS_SMILE_EXIT_THRESHOLD) {
			currentEmoji = this.previousEmoji
			currentFamily = SMILE_FAMILY
		} else if (previousFamily !== SMILE_FAMILY && currentFamily === SMILE_FAMILY && smileEvidence < HAPPINESS_SMILE_THRESHOLD) {
			currentEmoji = this.previousEmoji
			currentFamily = previousFamily
		}

		const shouldMirror = isRightWinkExpression(filteredPrediction, currentEmoji) || isMirroredAsymmetricExpression(filteredPrediction, currentEmoji)
		if (currentEmoji === this.previousEmoji) {
			this.candidateEmoji = null
			this.candidateSamples = 0
			this.isMirrored = shouldMirror
			return this.previousEmoji
		}

		if (currentEmoji !== this.candidateEmoji) {
			this.candidateEmoji = currentEmoji
			this.candidateSamples = 1
		} else {
			this.candidateSamples++
		}

		if (this.candidateSamples < this.getRequiredSamples(currentEmoji, smileEvidence)) return this.previousEmoji

		this.previousEmoji = currentEmoji
		this.candidateEmoji = null
		this.candidateSamples = 0
		this.lastSwitchAt = observationTime
		this.isMirrored = shouldMirror
		return this.previousEmoji
	}

	/**
	 * Reset state (when switching people or restarting)
	 */
	reset() {
		this.previousEmoji = EMOTICONS.EMOJI_NEUTRAL
		this.frameCount = 0
		this.candidateEmoji = null
		this.candidateSamples = 0
		this.lastSwitchAt = 0
		this.lastSourceTimestamp = undefined
		this.lastFreshObservationAt = undefined
		this.signalFilters.clear()
		this.filteredPrediction = undefined
		this.leftEyeClosed = false
		this.rightEyeClosed = false
		this.isMirrored = false
	}

	/**
	 * Get current state for debugging
	 */
	getState() {
		return {
			previousEmoji: this.previousEmoji,
			frameCount: this.frameCount,
			candidateEmoji: this.candidateEmoji,
			candidateSamples: this.candidateSamples,
			lastSwitchAt: this.lastSwitchAt,
			smileEvidence: getSmileSignal(this.filteredPrediction),
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
		return getFilteredEmoji(emotionState.previousEmoji, options)
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
		return getFilteredEmoji(bestCandidate.emoji, options)
	}
	
	// If different emoji, only switch if score is significantly higher
	if (bestCandidate.score > previousScore + SWITCH_HYSTERESIS) {
		emotionState.previousEmoji = bestCandidate.emoji
		emotionState.previousScores[bestCandidate.emoji] = bestCandidate.score
		return getFilteredEmoji(bestCandidate.emoji, options)
	}
	
	// Otherwise stick with previous emoji
	return getFilteredEmoji(emotionState.previousEmoji, options)
}
