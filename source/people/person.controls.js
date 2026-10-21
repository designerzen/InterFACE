import { rangeRounded } from "../maths/maths"
import {
	normaliseHeadPitchForRange,
	normaliseHeadRollForRange,
	resolveHeadNoteRangeDegrees,
	resolveHeadVerticalRangeDegrees
} from "./head-note-range.js"

/**
 * Default head control input mechanism
 * Where looking left and right sets the Scale
 * Where looking up and down sets the octave
 * Rolling the head left sets the pitch
 * @param {Object} prediction 
 * @param {Object} options 
 * @returns 
 */
export const convertHeadOrientationIntoNoteData = (prediction, options) => {

	const getControllerValue = controller => {
		switch(controller)
		{
			case 'roll':
				return normaliseHeadRollForRange(
					prediction,
					resolveHeadNoteRangeDegrees(options.headNoteRangeDegrees, options.headNoteRangeOverride)
				)
			case 'pitch':
				return normaliseHeadPitchForRange(
					prediction,
					resolveHeadVerticalRangeDegrees(options.headVerticalRangeDegrees, options.headVerticalRangeOverride)
				)
			default:
				return prediction[controller]
		}
	}
	const octaveNumber = getControllerValue(options.octaveController)
	const noteNumber = getControllerValue(options.noteController)
	// console.log("octaveNumber",octaveNumber,"noteNumber",noteNumber)
	// pitch goes from -1 -> +1 and we want to map to 1 -> 7
	// straight at screen to positive below and negative above
	const newOctave = rangeRounded( octaveNumber , -1, 1, options.octaveLow ?? 2, options.octaveHigh ?? 6 )
	// const newOctave = rangeRounded( octaveNumber , -1, 1, 1, 7 )

	// simple way of selecting the black notes
	const isSharp = prediction[ options.sharpController ]
	
	// console.info(noteNumber, noteFloat, "-> ? ", octaveNumber, "->", newOctave, {isMinor} )

	const afterTouch = 0

	// 0 -> 2 : 2 is double speed, 1 is regular speed, 0 is slower
	// normalise to 0.5 -> 1.5
	// NB. only pitchbend if eyes are closed
	// const pitchBend = prediction.leftEyeClosed && prediction.rightEyeClosed ? 0.5 + prediction.eyebrowExtents / 2 : 1
	// always pitchbend!
	const pitchBend = 0.5 + prediction.eyebrowExtents / 2

	// console.error(pitchBend, "pitchBend", typeof pitchBend, prediction.eyebrowExtents )
	// console.info("Both:",prediction.eyebrows, "Raised:",prediction.eyebrowsRaisedBy, prediction.eyebrowsInnerRaisedBy, "lowered:",prediction.eyebrowsLoweredBy )
	// console.info("l:",prediction.leftEyebrowRaisedBy, "r:",prediction.rightEyebrowRaisedBy )
	return {
		octaveNumber,
		noteNumber,
		newOctave,
		afterTouch,
		pitchBend,
		isSharp
	}
}

export const PERSON_INPUT_MODE_HEAD_UP_DOWN_OCTAVE = 0
export const PERSON_INPUT_MODE_HEAD_LEFT_RIGHT_OCTAVE = 1

export const PERSON_INPUT_MODE_DATA = Object.freeze([
	Object.freeze({
		name:"UD",
		description:"Head up/down controls octave",
		controlMode:convertHeadOrientationIntoNoteData,
		options:Object.freeze({
			noteController:"roll",
			octaveController:"pitch",
			gateController:"mouth",
			pitchbendController:"leftSmirk",
			aftertouchController:"rightSmirk",
			sharpController:"isFacingRight"
		})
	}),
	Object.freeze({
		name:"LR",
		description:"Head left/right controls octave",
		controlMode:convertHeadOrientationIntoNoteData,
		options:Object.freeze({
			noteController:"pitch",
			octaveController:"roll",
			gateController:"mouth",
			pitchbendController:"leftSmirk",
			aftertouchController:"rightSmirk",
			sharpController:"isFacingRight"
		})
	})
])

export const normalisePersonInputMode = (inputMode=0) => {
	const parsedMode = Number.parseInt(inputMode, 10)
	const safeMode = Number.isFinite(parsedMode) ? parsedMode : 0
	return ((safeMode % PERSON_INPUT_MODE_DATA.length) + PERSON_INPUT_MODE_DATA.length) % PERSON_INPUT_MODE_DATA.length
}

export const getPersonInputModeData = (inputMode=0) =>
	PERSON_INPUT_MODE_DATA[normalisePersonInputMode(inputMode)]

// /**
//  * Default head control input mechanism
//  * Where looking left and right sets the Scale
//  * Where looking up and down sets the octave
//  * Rolling the head left sets the pitch
//  * @param {Object} prediction 
//  * @param {Object} options 
//  * @returns 
//  */
// const convertHeadRollToPitchAndPitchToOctaveAndYawToScale = (prediction, options) => {

// 	const octaveNumber = prediction[options.octaveController] 
// 	const noteNumber = prediction[options.noteController] 
	
// 	// remap -1 -> +1 to 0 -> 1
// 	const noteFloat = (1 + noteNumber) * 0.5 

// 	// pitch goes from -1 -> +1 and we want to map to 1 -> 7
// 	// straight at screen to positive below and negative above
// 	const newOctave = rangeRounded( -octaveNumber , -1, 1, 1, 7 )

// 	// simple way of selecting the black notes
// 	const isMinor = prediction[options.sharpController ]

// 	// eg. A1 Ab1 C3 etc
// 	const noteName = getNoteName(noteFloat, newOctave, isMinor)
// 	// eg. Do Re Mi
// 	const noteSound = getNoteSound(noteFloat, isMinor)	
	
// 	const afterTouch = 0
// 	const pitchBend = 0

// 	return {
// 		octaveNumber, newOctave,
// 		noteNumber,
// 		afterTouch,	pitchBend,
// 		isSharp
// 	}
// }

/**
 * Default head control input mechanism
 * Where looking left and right sets the pitch
 * Where looking up and down sets the octave
 * Rolling the head left sets the scale
 * @param {Object} prediction 
 * @param {Object} options 
 * @returns 
 */
const HEAD_ROLL_TO_SCALE_AND_PITCH_TO_OCTAVE_AND_YAW_TO_PITCH = {
	noteController:'pitch',		// up down
	octaveController:'pitch',	// lean tilt
	gateController:'mouth',
	pitchbendController:'eyebrowsRaisedBy',
	aftertouchController:'rightSmirk',
	sharpController:'isFacingRight'
}

export const convertHeadRollToScaleAndPitchToOctaveAndYawToPitch = (prediction) => {
	return convertHeadOrientationIntoNoteData(prediction, HEAD_ROLL_TO_SCALE_AND_PITCH_TO_OCTAVE_AND_YAW_TO_PITCH) 
}

/**
 * Default head control input mechanism
 * Where looking left and right sets the pitch
 * Where looking up and down sets the scale
 * Rolling the head left sets the octave
 * @param {Object} prediction 
 * @param {Object} options 
 * @returns 
 */
const HEAD_ROLL_TO_OCTAVE_AND_PITCH_TO_SCALE_AND_YAW_TO_PITCH = {
	noteController:'yaw',		// up down
	octaveController:'roll',	// lean tilt
	gateController:'mouth',
	pitchbendController:'eyebrowsRaisedBy',
	aftertouchController:'leftSmirk',
	sharpController:'isFacingRight' // 'eyebrowsRaisedBy',
}
export const convertHeadRollToOctaveAndPitchToScaleAndYawToPitch = (prediction) => {
	return convertHeadOrientationIntoNoteData(prediction, HEAD_ROLL_TO_OCTAVE_AND_PITCH_TO_SCALE_AND_YAW_TO_PITCH) 
}
