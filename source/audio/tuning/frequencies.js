import { memoize } from "../../utils/utils" 	

/**
 * Convert a MIDI Note Number into a frequency in hertz
 * @param {Number} note 
 * @returns {Number}
 */
const CLASSICAL_ROOT_FREQUENCY = 426.6666666 // according to Eric Dollard
const ROOT_FREQUENCY = 440 // 440 //frequency of A (coomon value is 440Hz)
const ROOT_F_BY_32 = ROOT_FREQUENCY / 32
export const noteNumberToFrequency = memoize((note) => {
	return ROOT_F_BY_32 * (2 ** ((note - 9) / 12))
})

/**
 * Shift a note to a different frequency by X semitones (steps)
 * @param {Number} freq 
 * @param {Number} steps 
 * @returns 
 */
export const transposeNote = (freq, steps) => freq * 2 ** (steps / 12)

/**
 * Convert a frequency in hertz into a noteNumber
 * @param {Number} frequency 
 * @returns {Number} NoteNumber
 */
const L = Math.log(2)
export const frequencyToNoteNumber = memoize((frequency) => {
	const log = Math.log(frequency / 440) / L
	return Math.round(12 * log + 69)
})