// import { EMOJI_ANGRY, EMOJI_DIAGONAL_MOUTH, EMOJI_EYES_ROLLING_UP, EMOJI_FROWN_EYES_CLOSED, EMOJI_KISS, EMOJI_KISS_EYES_CLOSED, EMOJI_LEFT_WINK, EMOJI_NEUTRAL, EMOJI_NEUTRAL_EYES_CLOSED, EMOJI_OPEN_MOUTH, EMOJI_OPEN_MOUTH_BIG, EMOJI_RAISED_EYEBROW, EMOJI_SHAKING, EMOJI_SHAKING_HORIZONTALLY, EMOJI_SHAKING_VERTICALLY, EMOJI_SMILING_BIG_GRIN, EMOJI_SMILING_BIG_TEETH_GRIN, EMOJI_SMILING_EYES_CLOSED, EMOJI_SMILING_GRIN, EMOJI_SMILING_GRIN_SQUINT, EMOJI_SMILING_SLIGHTLY, EMOJI_SMIRK, EMOJI_TRIPPY, EMOJI_WAIL } from "./emoji"
import * as EMOTICONS from './emoji.js'

const AMOUNT_BEFORE_SHAKE_X = 0.4
const AMOUNT_BEFORE_SHAKE_Y = 0.4 
const AMOUNT_BEFORE_GRIMMACE = 0.6
const AMOUNT_BEFORE_ANGRY = 0.4
const AMOUNT_BEFORE_FEARFUL = 0.4

/**
 * Convert a face model into an emoji
 * @param {Object} prediction - the ML prediction from mediaPipe 
 * @param {Object} options -  
 */
// export const recogniseEmoji = (person) => {
export const recogniseEmojiFromFaceModel = (prediction, options) => {

	// const prediction = person.data
	// Recognise EMOJI in order of most common ones

	// options.mouthSilence && amp < options.mouthCutOff
	
	// Both eyes are closed -----------------------------------------------
	if (prediction.leftEyeClosed && prediction.rightEyeClosed)
	{
		if (prediction.mouthPucker > 0.91)
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
		if (prediction.happiness <=0.65){
			return EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED
		}
		if (prediction.happiness <=0.8){
			return EMOTICONS.EMOJI_SMILING_GRIN_SQUINT
		}
		if (prediction.happiness <= 1){
			return EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED
		}
		return EMOJI_NEUTRAL_EYES_CLOSED
	}

	// Both eyes are open emojis
	if (!prediction.leftEyeClosed && !prediction.rightEyeClosed)
	{
		if (prediction.mouthPucker > 0.91)
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
					}else if (prediction.mouthRatio < 0.7){
						return EMOTICONS.EMOJI_ASTONISHED
					}else if (prediction.mouthRatio < 0.85){
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
					}else if (prediction.mouthRatio < 0.7){
						return EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED
					}else if (prediction.mouthRatio < 0.7){
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
