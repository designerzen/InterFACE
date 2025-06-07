import * as EMOTICONS from './emoji.js'

/**
 * Pass in an emoji and a tonic get out the chord in the
 * scale that best matches the emotion behind the emoji
 * 
 * @param {Number} tonic 
 * @param {String} emoji 
 */
export const getMusicalDetailsFromEomoji = (tonic, emoji) => {
	// Create all relevant scales
	const notes = getAllChordsForNoteNumber(tonic)
	let scale = 0
	let mode = 0

	switch(emoji) {
		case EMOTICONS.EMOJI_KISS_EYES_CLOSED:
			break
		case EMOTICONS.EMOJI_FROWN_EYES_CLOSED:
			break
		case EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED:
			break
		case EMOTICONS.EMOJI_SMILING_EYES_CLOSED:
			break
		case EMOTICONS.EMOJI_SMILING_GRIN_SQUINT:
			break
		case EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN:
			break
		case EMOTICONS.EMOJI_KISS:
			break
		case EMOTICONS.EMOJI_EYES_ROLLING_UP:
			break
		case EMOTICONS.EMOJI_OPEN_MOUTH:
			break
		case EMOTICONS.EMOJI_OPEN_MOUTH_BIG:
			break
		case EMOTICONS.EMOJI_WAIL:

			break
		case EMOTICONS.EMOJI_SMILING_SLIGHTLY:
			break
		case EMOTICONS.EMOJI_SMILING_GRIN:
			break
		case EMOTICONS.EMOJI_SMILING_BIG_GRIN:
			break
		case EMOTICONS.EMOJI_DIAGONAL_MOUTH:
			break
			
		case EMOTICONS.EMOJI_RAISED_EYEBROW:
			break
		case EMOTICONS.EMOJI_ANGRY:
			break
		case EMOTICONS.EMOJI_GRIMACE:
			break

		case EMOTICONS.EMOJI_TRIPPY:
			break
		case EMOTICONS.EMOJI_SHAKING:
			break
		case EMOTICONS.EMOJI_LEFT_WINK:
			break
		case EMOTICONS.EMOJI_RIGHT_WINK:
			break
		case EMOTICONS.EMOJI_SMIRK:
			break
		case EMOTICONS.EMOJI_SHAKING_HORIZONTALLY:
			break
		case EMOTICONS.EMOJI_SHAKING_VERTICALLY:
			break

		case EMOTICONS.EMOJI_NEUTRAL:
		default:

	}
	return notes.get(scale).get(mode)
}