import { getAllChordsForNoteNumber } from '../audio/tuning/chords.js'
import { SCALE_MAJOR, SCALE_MINOR, TUNING_MODE_DORIAN, TUNING_MODE_IONIAN, TUNING_MODE_LOCRIAN, TUNING_MODE_LYDIAN } from '../audio/tuning/scales.js'
import * as EMOTICONS from './emoji.js'

/**
 * Pass in an emoji and a tonic get out the chord in the
 * scale that best matches the emotion behind the emoji
 * 
 * @param {Number} tonic 
 * @param {String} emoji 
 */
export const getMusicalDetailsFromEmoji = (tonic, emoji) => {
	
	// Create all relevant scales
	const notes = getAllChordsForNoteNumber(tonic)
	
	// happy / sad
	let scale = SCALE_MAJOR
	let mode = TUNING_MODE_IONIAN

	// first determine if sad (minor)
	switch(emoji) {
		case EMOTICONS.EMOJI_FROWN_EYES_CLOSED:
		case EMOTICONS.EMOJI_EYES_ROLLING_UP:
		case EMOTICONS.EMOJI_OPEN_MOUTH:
		case EMOTICONS.EMOJI_OPEN_MOUTH_BIG:
		case EMOTICONS.EMOJI_WAIL:
		case EMOTICONS.EMOJI_ANGRY:
		case EMOTICONS.EMOJI_GRIMACE:
		case EMOTICONS.EMOJI_TRIPPY:
		case EMOTICONS.EMOJI_SHAKING:
		case EMOTICONS.EMOJI_SHAKING_HORIZONTALLY:
		case EMOTICONS.EMOJI_SHAKING_VERTICALLY:
			scale = SCALE_MINOR
	}

	// now determine the mode
	switch(emoji) {
		case EMOTICONS.EMOJI_KISS_EYES_CLOSED:
		case EMOTICONS.EMOJI_KISS:
			mode = TUNING_MODE_LYDIAN
			break

		case EMOTICONS.EMOJI_SMILING_EYES_CLOSED:
			break
		case EMOTICONS.EMOJI_SMILING_GRIN_SQUINT:
			break
		case EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED:
			break
		case EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED:
			break
		case EMOTICONS.EMOJI_SMILING_SLIGHTLY:
			break
		case EMOTICONS.EMOJI_SMILING_GRIN:
			break
		case EMOTICONS.EMOJI_SMILING_BIG_GRIN:
			break

		case EMOTICONS.EMOJI_SMIRK:
			break
	
		case EMOTICONS.EMOJI_OPEN_MOUTH:
			break
		case EMOTICONS.EMOJI_OPEN_MOUTH_BIG:
			break
	
		case EMOTICONS.EMOJI_LEFT_WINK:
		case EMOTICONS.EMOJI_RIGHT_WINK:
			break

		case EMOTICONS.EMOJI_RAISED_EYEBROW:
			mode = TUNING_MODE_LOCRIAN
			break
			
		case EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED:
		case EMOTICONS.EMOJI_NEUTRAL:
		default:
			break


		case EMOTICONS.EMOJI_TRIPPY:
			mode = TUNING_MODE_DORIAN
			break
		
		case EMOTICONS.EMOJI_SHAKING:
			break

		case EMOTICONS.EMOJI_EYES_ROLLING_UP:
			break
		
		case EMOTICONS.EMOJI_DIAGONAL_MOUTH:
			break

		case EMOTICONS.EMOJI_GRIMACING:
			break

		case EMOTICONS.EMOJI_FROWN_EYES_CLOSED:
			break
		
		case EMOTICONS.EMOJI_WAIL:
			mode = TUNING_MODE_LOCRIAN
			break
	
		case EMOTICONS.EMOJI_ANGRY:
			break
		
		case EMOTICONS.EMOJI_SHAKING_HORIZONTALLY:
		case EMOTICONS.EMOJI_SHAKING_VERTICALLY:
			break
	}

	console.log("getMusicalDetailsFromEmoji", {tonic, emoji, scale, mode, notes})
	// return notes.get(scale).get(mode)
}