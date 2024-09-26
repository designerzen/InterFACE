import { EMOJI_ANGRY, EMOJI_DIAGONAL_MOUTH, EMOJI_EYES_ROLLING_UP, EMOJI_FROWN_EYES_CLOSED, EMOJI_KISS, EMOJI_KISS_EYES_CLOSED, EMOJI_LEFT_WINK, EMOJI_NEUTRAL, EMOJI_NEUTRAL_EYES_CLOSED, EMOJI_OPEN_MOUTH, EMOJI_OPEN_MOUTH_BIG, EMOJI_RAISED_EYEBROW, EMOJI_SHAKING, EMOJI_SHAKING_HORIZONTALLY, EMOJI_SHAKING_VERTICALLY, EMOJI_SMILING_BIG_GRIN, EMOJI_SMILING_BIG_TEETH_GRIN, EMOJI_SMILING_EYES_CLOSED, EMOJI_SMILING_GRIN, EMOJI_SMILING_GRIN_SQUINT, EMOJI_SMILING_SLIGHTLY, EMOJI_SMIRK, EMOJI_TRIPPY, EMOJI_WAIL } from "./emoji"

const AMOUNT_BEFORE_SHAKE_X= 0.2 
const AMOUNT_BEFORE_SHAKE_Y = 0.2 
const AMOUNT_BEFORE_GRIMMACE = 0.6
const AMOUNT_BEFORE_ANGRY = 0.4

/**
 * 
 * @param {Object} prediction 
 */
// export const recogniseEmoji = (person) => {
export const recogniseEmoji = (prediction, options) => {

	// const prediction = person.data
	// Recognise EMOJI in order of most common ones


	// options.mouthSilence && amp < options.mouthCutOff
	
	// Both eyes are closed
	if (prediction.leftEyeClosed && prediction.rightEyeClosed)
	{
		if (prediction.mouthPucker > 0.93)
		{
			return EMOJI_KISS_EYES_CLOSED
		}
		
		if (prediction.happiness < 0.01){
			return EMOJI_FROWN_EYES_CLOSED
		}else if (prediction.happiness < 0.3){
			return EMOJI_NEUTRAL_EYES_CLOSED
		}else if (prediction.happiness < 0.5){
			return EMOJI_SMILING_EYES_CLOSED
		}else if (prediction.happiness <=0.65){
			return EMOJI_SMILING_GRIN_SQUINT
		}else if (prediction.happiness <=0.8){
			return EMOJI_SMILING_BIG_TEETH_GRIN
		}
	}

	// Both eyes are open emoji
	if (!prediction.leftEyeClosed && !prediction.rightEyeClosed)
	{
		if (prediction.mouthPucker > 0.9)
		{
			return EMOJI_KISS
		}

		if (prediction.eyeVertical < -0.1)
		{
			return EMOJI_EYES_ROLLING_UP
		}


		// MOUTH OPEN
		// Wide eyed and mouth crooked and closed
		// EMOJI_CONFUSED
		if ( prediction.mouthRatio > options.mouthCutOff  )
		{
			// mouth open but no grin
			if (prediction.happiness < 0.26)
			{
				// mouth open but no grin
				if (prediction.mouthRatio > options.mouthCutOff){
					return EMOJI_OPEN_MOUTH
				}else if (prediction.mouthRatio > 0.4){
					return EMOJI_OPEN_MOUTH_BIG
				}else if (prediction.mouthRatio > 0.6){
					return EMOJI_WAIL
				}	

			// mouth open and smiles
			}else if (prediction.happiness < 0.5){
				return EMOJI_SMILING_SLIGHTLY
			}else if (prediction.happiness <=0.65){
				return EMOJI_SMILING_GRIN
			}else if (prediction.happiness <=8){
				return EMOJI_SMILING_BIG_GRIN
			}

		}else if (prediction.mouthRatio <= options.mouthSilence && prediction.happiness > 0.1 ){
			return EMOJI_SMILING_SLIGHTLY
		}else if (prediction.leftSmirk > prediction.rightSmirk){
			return EMOJI_DIAGONAL_MOUTH
		}
	
		
		if (prediction.eyebrowsRaisedBy > 0.3)
		{
			// check eye brows!
			return EMOJI_RAISED_EYEBROW
		}
	
		// SADNESS
		if (
			prediction.leftEyebrowRaisedBy < -AMOUNT_BEFORE_ANGRY &&
			prediction.rightEyebrowRaisedBy < -AMOUNT_BEFORE_ANGRY
		){
			return EMOJI_ANGRY
		}
		
		if (
			prediction.leftSmirk > AMOUNT_BEFORE_GRIMMACE &&
			prediction.mouthStretchLeft > AMOUNT_BEFORE_GRIMMACE &&
			prediction.rightSmirk > AMOUNT_BEFORE_GRIMMACE &&
			prediction.mouthStretchRight > AMOUNT_BEFORE_GRIMMACE
		){
			return EMOJI_GRIMACE
		}
		
		if (
			prediction.rightEyeDirection > 0.5 && prediction.leftEyeDirection < 0.5 ||
			prediction.rightEyeDirection < 0.5 && prediction.leftEyeDirection > 0.5
		){
			return EMOJI_TRIPPY
		}

		if (
			prediction.rightEyeDirection > 0.2 && prediction.leftEyeDirection < 0.2 ||
			prediction.rightEyeDirection < 0.2 && prediction.leftEyeDirection > 0.2
		){
			return EMOJI_SHAKING
		}

		return EMOJI_NEUTRAL
	}


	// left wink 😉
	if (!prediction.leftEyeClosed && prediction.rightEyeClosed)
	{
		// if (prediction.happiness < 0.3)
		// {
		// 	return ";-|"
		// }else if (prediction.happiness < 0.5){
		// 	return ";-)"
		// }else if (prediction.happiness <=1){
		// 	return ";-D"
		// }
		return EMOJI_LEFT_WINK
	}

	// kiss EMOJI_KISS
	// EMOJI_KISS_EYES_CLOSED
	
	// right wink 😉
	if (prediction.leftEyeClosed && !prediction.rightEyeClosed)
	{
		return EMOJI_LEFT_WINK

		if (prediction.happiness < 0.3)
		{
			return ":-|"
		}else if (prediction.happiness < 0.5){
			return ":-)"
		}else if (prediction.happiness <=1){
			return ":-D"
		}
	}	

	if (prediction.lookingRight && prediction.rightSmirk > prediction.leftSmirk)
	{
		return EMOJI_SMIRK
	}

	// raise eyebrow 🤨
	// EMOJI_RAISED_EYEBROW

	if (prediction.yaw > AMOUNT_BEFORE_SHAKE_X || prediction.yaw < -AMOUNT_BEFORE_SHAKE_X)
	{
		return EMOJI_SHAKING_HORIZONTALLY
	}

	if (prediction.pitch > AMOUNT_BEFORE_SHAKE_Y || prediction.pitch < -AMOUNT_BEFORE_SHAKE_Y)
	{
		return EMOJI_SHAKING_VERTICALLY
	}

	return EMOJI_NEUTRAL
	

	prediction.leftEyeClosed
	prediction.rightEyeClosed
	prediction.mouthRatio

	prediction.happiness
	// 
	prediction.leftSmirk
	prediction.rightSmirk

	
}
