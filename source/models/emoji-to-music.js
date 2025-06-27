import { getAllChordsForNoteNumber } from '../audio/tuning/chords.js'
import { PHRYGIAN_SCALE, SCALE_MAJOR, SCALE_MINOR, TUNING_MODE_AEOLIAN, TUNING_MODE_DORIAN, TUNING_MODE_IONIAN, TUNING_MODE_LOCRIAN, TUNING_MODE_LYDIAN, TUNING_MODE_MIXOLYDIAN, TUNING_MODE_PHRYGIAN } from '../audio/tuning/scales.js'
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
		case EMOTICONS.EMOJI_EXHALING:
		case EMOTICONS.EMOJI_SHOCKED:
		case EMOTICONS.EMOJI_ASTONISHED:
		case EMOTICONS.EMOJI_ANGUISHED:
		case EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED:
		case EMOTICONS.EMOJI_FROWN_EYES_CLOSED:
		case EMOTICONS.EMOJI_EYES_ROLLING_UP:
		case EMOTICONS.EMOJI_OPEN_MOUTH:
		case EMOTICONS.EMOJI_OPEN_MOUTH_BIG:
		case EMOTICONS.EMOJI_WAIL:
		case EMOTICONS.EMOJI_ANGRY:
		case EMOTICONS.EMOJI_GRIMACING:
		case EMOTICONS.EMOJI_TRIPPY:
		case EMOTICONS.EMOJI_SHAKING:
		case EMOTICONS.EMOJI_SHAKING_HORIZONTALLY:
		case EMOTICONS.EMOJI_SHAKING_VERTICALLY:
		case EMOTICONS.EMOJI_DIAGONAL_MOUTH:
			scale = SCALE_MINOR
	}

	// determine MODE only
	switch(emoji) {
		case EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED:
		case EMOTICONS.EMOJI_NEUTRAL:
		default:
			mode = TUNING_MODE_IONIAN
			break
		
		case EMOTICONS.EMOJI_LEFT_WINK:
		case EMOTICONS.EMOJI_RIGHT_WINK:
					
		case EMOTICONS.EMOJI_EYES_ROLLING_UP:
		case EMOTICONS.EMOJI_FROWN_EYES_CLOSED:
		case EMOTICONS.EMOJI_TRIPPY:
			mode = TUNING_MODE_DORIAN
			break
		
		case EMOTICONS.EMOJI_SHAKING:
		case EMOTICONS.EMOJI_ANGRY:
		case EMOTICONS.EMOJI_SMIRK:
			mode = TUNING_MODE_PHRYGIAN
			break
	
		case EMOTICONS.EMOJI_KISS_EYES_CLOSED_EYEBROWS_RAISED:
		case EMOTICONS.EMOJI_KISS_EYES_CLOSED:
		case EMOTICONS.EMOJI_KISS:
		case EMOTICONS.EMOJI_KISSING_WINK:
		case EMOTICONS.EMOJI_CAT_KISSING:
		case EMOTICONS.EMOJI_ASTONISHED:
			mode = TUNING_MODE_LYDIAN
			break

		case EMOTICONS.EMOJI_SMILING_GRIN:
		case EMOTICONS.EMOJI_SMILING_EYES_CLOSED:
		case EMOTICONS.EMOJI_SMILING_GRIN_SQUINT:
		case EMOTICONS.EMOJI_SMILING_SLIGHTLY:
			mode = TUNING_MODE_MIXOLYDIAN
			break

		case EMOTICONS.EMOJI_OPEN_MOUTH:
		case EMOTICONS.EMOJI_OPEN_MOUTH_BIG:
		case EMOTICONS.EMOJI_WAIL:
		case EMOTICONS.EMOJI_FLUSHED: 
		case EMOTICONS.EMOJI_SHOCKED:
		case EMOTICONS.EMOJI_ANGUISHED:
		case EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED:
			mode = TUNING_MODE_AEOLIAN
			break
	
		case EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED:
			mode = TUNING_MODE_DORIAN
			break

		case EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED:
			mode = TUNING_MODE_LYDIAN
			break

		case EMOTICONS.EMOJI_SMILING_BIG_GRIN:
			mode = TUNING_MODE_MIXOLYDIAN
			break

		case EMOTICONS.EMOJI_GRIMACING:
		case EMOTICONS.EMOJI_PERSEVERING:
		case EMOTICONS.EMOJI_RAISED_EYEBROW:
			mode = TUNING_MODE_LOCRIAN
			break
	
	

		// case EMOTICONS.EMOJI_GHOST:
		// case EMOTICONS.EMOJI_SHAKING_HORIZONTALLY:
		// case EMOTICONS.EMOJI_SHAKING_VERTICALLY:
		// 	break
	}

	const scales = notes.get(scale) 
	const chords = scales.get(mode)

	if (!chords){
		console.error("Sing: No chords found for", {tonic, emoji, scales, mode})
		return null
	}
	// console.log("getMusicalDetailsFromEmoji", {tonic, emoji, scale, mode, notes, scales, chords})
	return chords
}