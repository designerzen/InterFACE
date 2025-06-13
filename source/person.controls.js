import { rangeRounded } from "./maths/maths"

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

	const octaveNumber = prediction[options.octaveController] 
	const noteNumber = prediction[options.noteController] 

	// pitch goes from -1 -> +1 and we want to map to 1 -> 7
	// straight at screen to positive below and negative above
	const newOctave = rangeRounded( octaveNumber , -1, 1, 1, 7 )

	// simple way of selecting the black notes
	const isMinor = prediction[ options.minorController ]
	
	// console.info(noteNumber, noteFloat, "-> ? ", octaveNumber, "->", newOctave, {isMinor} )

	const afterTouch = 0

	// 0 -> 2 : 2 is double speed, 1 is regular speed, 0 is slower
	// normalise to 0.5 -> 1.5
	// NB. only pitchbend if eyes are closed
	// const pitchBend = prediction.leftEyeClosed && prediction.rightEyeClosed ? 0.5 + prediction.eyebrowExtents / 2 : 1
	// always pitchbend!
	const pitchBend = 0.5 + prediction.eyebrowExtents / 2

	console.error(pitchBend, "pitchBend", prediction.eyebrowExtents )
	// console.info("Both:",prediction.eyebrows, "Raised:",prediction.eyebrowsRaisedBy, prediction.eyebrowsInnerRaisedBy, "lowered:",prediction.eyebrowsLoweredBy )
	// console.info("l:",prediction.leftEyebrowRaisedBy, "r:",prediction.rightEyebrowRaisedBy )
	return {
		octaveNumber,
		noteNumber,
		newOctave,
		afterTouch,
		pitchBend,
		isMinor
	}
}

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
// 	const isMinor = prediction[options.minorController ]

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
// 		isMinor
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
	minorController:'isFacingRight'
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
	minorController:'isFacingRight' // 'eyebrowsRaisedBy',
}
export const convertHeadRollToOctaveAndPitchToScaleAndYawToPitch = (prediction) => {
	return convertHeadOrientationIntoNoteData = (prediction, HEAD_ROLL_TO_OCTAVE_AND_PITCH_TO_SCALE_AND_YAW_TO_PITCH) 
}