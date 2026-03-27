import { getAllChordsForNoteNumber } from '../audio/tuning/chords.js'
import { SCALE_MAJOR, SCALE_MINOR, TUNING_MODE_AEOLIAN, TUNING_MODE_DORIAN, TUNING_MODE_IONIAN, TUNING_MODE_LOCRIAN, TUNING_MODE_LYDIAN, TUNING_MODE_MIXOLYDIAN, TUNING_MODE_PHRYGIAN } from '../audio/tuning/scales.js'
import * as EMOTICONS from './emoji.js'

/**
 * Pass in an emoji and a tonic get out the chord in the
 * scale that best matches the emotion behind the emoji
 * 
 * @param {Number} tonic 
 * @param {String} emoji 
 */
export const getMusicalDetailsFromEmoji = (tonic, emoji, includeTonic=true) => {
	
	// Create all relevant scales
	const notes = getAllChordsForNoteNumber(tonic)
	
	// happy / sad
	let mode = TUNING_MODE_IONIAN
	
	// determine MODE only
	// NB. The scale we now know as major was originally called
	// the Ionian mode and its relative minor was known as Aeolian.
	switch(emoji) {

		// MAJOR - Happy Sounds
		case EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED:
		case EMOTICONS.EMOJI_NEUTRAL:
		case EMOTICONS.EMOJI_SMILING_GRIN:
		case EMOTICONS.EMOJI_SMILING_EYES_CLOSED:
		case EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED:
		case EMOTICONS.EMOJI_SMILING_GRIN_SQUINT:
		case EMOTICONS.EMOJI_SMILING_SLIGHTLY:
		default:
			mode = TUNING_MODE_IONIAN
			break
		
		case EMOTICONS.EMOJI_LEFT_WINK:
		case EMOTICONS.EMOJI_RIGHT_WINK:
		case EMOTICONS.EMOJI_EYES_ROLLING_UP:
		case EMOTICONS.EMOJI_FROWN_EYES_CLOSED:
		case EMOTICONS.EMOJI_TRIPPY:
		case EMOTICONS.EMOJI_GIGGLING:
		case EMOTICONS.EMOJI_HAPPY_TEARS:
		case EMOTICONS.EMOJI_HOLDING_TEARS:
		case EMOTICONS.EMOJI_THINKING:
		case EMOTICONS.EMOJI_ZANY:
			mode = TUNING_MODE_DORIAN
			break

		// Kissing / arousol
		case EMOTICONS.EMOJI_KISS_EYES_CLOSED_EYEBROWS_RAISED:
		case EMOTICONS.EMOJI_KISS_EYES_CLOSED:
		case EMOTICONS.EMOJI_KISS:
		case EMOTICONS.EMOJI_KISSING_WINK:
		case EMOTICONS.EMOJI_CAT_KISSING:
		case EMOTICONS.EMOJI_ASTONISHED:
			mode = TUNING_MODE_LYDIAN
			break

		// SUPER Happy! Like SNES games!
		case EMOTICONS.EMOJI_SMILING_BIG_GRIN:
		case EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED:
		case EMOTICONS.EMOJI_KISSING_WINK:
		case EMOTICONS.EMOJI_HEARTS:
		case EMOTICONS.EMOJI_HEART_EYES:
		case EMOTICONS.EMOJI_STAR_STRUCK:
		case EMOTICONS.EMOJI_PARTY:
			mode = TUNING_MODE_MIXOLYDIAN
			break

		// SAD Sound, minor chords
		case EMOTICONS.EMOJI_OPEN_MOUTH:
		case EMOTICONS.EMOJI_OPEN_MOUTH_BIG:
		case EMOTICONS.EMOJI_WAIL:
		case EMOTICONS.EMOJI_FLUSHED: 
		case EMOTICONS.EMOJI_FEARFUL: 
		case EMOTICONS.EMOJI_ANGUISHED:
		case EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED:
			mode = TUNING_MODE_AEOLIAN
			break
	
		// 
		case EMOTICONS.EMOJI_FROWNING:
		case EMOTICONS.EMOJI_FROWN_EYES_CLOSED:
		case EMOTICONS.EMOJI_WORRIED:
		case EMOTICONS.EMOJI_OPEN_MOUTH_BIG:
			mode = TUNING_MODE_LYDIAN
			break

		// 
		case EMOTICONS.EMOJI_CONFUSED:
		case EMOTICONS.EMOJI_SHOCKED:
		case EMOTICONS.EMOJI_GRIMACING:
		case EMOTICONS.EMOJI_PERSEVERING:
		case EMOTICONS.EMOJI_RAISED_EYEBROW:
			mode = TUNING_MODE_PHRYGIAN
			break

		// most disjointed
		case EMOTICONS.EMOJI_SHAKING:
		case EMOTICONS.EMOJI_ANGRY:
		case EMOTICONS.EMOJI_SMIRK:
		case EMOTICONS.EMOJI_RAGE:
			mode = TUNING_MODE_LOCRIAN
			break
	
		// case EMOTICONS.EMOJI_GHOST:
		// case EMOTICONS.EMOJI_SHAKING_HORIZONTALLY:
		// case EMOTICONS.EMOJI_SHAKING_VERTICALLY:
		// 	break
	}

	// Get major chord scale and select the mode from it
	const majorChords = notes.get(SCALE_MAJOR)
	const chords = majorChords ? majorChords.get(mode) : null

	// console.log("getMusicalDetailsFromEmoji", {tonic, emoji, mode, chords})
	
	if (includeTonic)
	{

	}

	if (!chords){
		console.error("Sing: No chords found for", {tonic, emoji, mode})
		return null
	}
	
	return chords
}