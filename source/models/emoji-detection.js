export const EMOJI_NEUTRAL = "😐"
export const EMOJI_NEUTRAL_EYES_CLOSED = "😑"
export const EMOJI_LEFT_WINK = "😉"
export const EMOJI_DIAGONAL_MOUTH = "🫤"
export const EMOJI_EYES_ROLLING_UP = "🙄"
export const EMOJI_SMILING_SLIGHTLY = "🙂"
export const EMOJI_SMILING_EYES_CLOSED = "😊"
export const EMOJI_SMILING_GRIN = "😀"
export const EMOJI_SMILING_BIG_GRIN = "😃"
export const EMOJI_SMILING_GRIN_SQUINT = "😆"
export const EMOJI_SMILING_BIG_TEETH_GRIN = "😁"
export const EMOJI_OPEN_MOUTH = "😯"
export const EMOJI_OPEN_MOUTH_BIG = "😮"
export const EMOJI_ASTONISHED = "😲"
export const EMOJI_FROWNING = "☹️"
export const EMOJI_FROWN_EYES_CLOSED = "😞"
export const EMOJI_ANGRY = "😠"
export const EMOJI_GRIMACING = "😬"
export const EMOJI_ZANY = "🤪"
export const EMOJI_KISS = "😗"
export const EMOJI_KISS_EYES_CLOSED = "😙"
export const EMOJI_SMIRK = "😏"
export const EMOJI_UNAMUSED = "😒"
export const EMOJI_RAISED_EYEBROW = "🤨"
export const EMOJI_CONFUSED = "😕"
export const EMOJI_WORRIED = "😟"
/**
 * 
 * @param {Object} prediction 
 */
// export const recogniseEmoji = (person) => {
export const recogniseEmoji = (prediction) => {

	// const prediction = person.data
	// Recognise EMOJI in order of most common ones

	
	// Both eyes are closed
	if (prediction.leftEyeClosed && prediction.rightEyeClosed)
	{
		if (prediction.happiness < 0.3)
		{
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
		if (prediction.mouthRatio > 0.2){
			return EMOJI_OPEN_MOUTH
		}else if (prediction.mouthRatio > 0.4){
			return EMOJI_OPEN_MOUTH_BIG
		}
	
		if (prediction.happiness < 0.3)
		{
			return EMOJI_NEUTRAL
		}else if (prediction.happiness < 0.5){
			return EMOJI_SMILING_SLIGHTLY
		}else if (prediction.happiness <=0.65){
			return EMOJI_SMILING_GRIN
		}else if (prediction.happiness <=8){
			return EMOJI_SMILING_BIG_GRIN
		}
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
	if (prediction.leftSmirk > prediction.rightSmirk)
	{
		return EMOJI_DIAGONAL_MOUTH
	}

	// right wink 😉
	if (prediction.leftEyeClosed && !prediction.rightEyeClosed)
	{
		if (prediction.happiness < 0.3)
		{
			return ":-|"
		}else if (prediction.happiness < 0.5){
			return ":-)"
		}else if (prediction.happiness <=1){
			return ":-D"
		}
	}	

	if (prediction.lookingRight)
	{
		return EMOJI_SMIRK
	}

	// raise eyebrow 🤨
	// EMOJI_RAISED_EYEBROW

	return EMOJI_NEUTRAL

	prediction.leftEyeClosed
	prediction.rightEyeClosed
	prediction.mouthRatio

	prediction.happiness
	// 
	prediction.leftSmirk
	prediction.rightSmirk

	
}
