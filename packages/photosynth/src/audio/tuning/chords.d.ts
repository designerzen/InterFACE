/**
 * Most scales, except the blues scale, have seven steps,
 * while pentatonic scales have five steps.
 */
export { AUGMENTED_CHORD_INTERVALS, AUGMENTED_VOICING_INTERVALS, DIMINISHED_CHORD_INTERVALS, DIMINISHED_7_VOICING_INTERVALS, DIMINISHED_VOICING_INTERVALS, DORIAN_CHORD_INTERVALS, DOMINANT_7_VOICING_INTERVALS, DOMINANT_9_VOICING_INTERVALS, FIFTHS_CHORD_INTERVALS, HALF_DIMINISHED_VOICING_INTERVALS, MAJOR_CHORD_INTERVALS, MAJOR_6_VOICING_INTERVALS, MAJOR_7_VOICING_INTERVALS, MAJOR_9_VOICING_INTERVALS, MAJOR_VOICING_INTERVALS, MINOR_6TH_9_VOICING_INTERVALS, MINOR_6_VOICING_INTERVALS, MINOR_7_VOICING_INTERVALS, MINOR_9_VOICING_INTERVALS, MINOR_MAJOR_7_VOICING_INTERVALS, MINOR_CHORD_INTERVALS, MINOR_VOICING_INTERVALS, SIXTH_9_VOICING_INTERVALS, SUSPENDED_2_VOICING_INTERVALS, SUSPENDED_7_VOICING_INTERVALS, SUSPENDED_CHORD_INTERVALS, SUSPENDED_VOICING_INTERVALS } from "./intervals.js";
export declare const CHORD_VOICINGS: Readonly<{
    major: number[];
    minor: number[];
    suspended: number[];
    suspended2: number[];
    diminished: number[];
    augmented: number[];
    major6: number[];
    minor6: number[];
    major7: number[];
    minor7: number[];
    dominant7: number[];
    minorMajor7: number[];
    diminished7: number[];
    halfDiminished: number[];
    suspended7: number[];
    major9: number[];
    minor9: number[];
    dominant9: number[];
    sixth9: number[];
    minor6th9: number[];
    radiantMajor11: number[];
    ecstaticMajor13: number[];
    weepingMinor11: number[];
    desolateMinorMajor13: number[];
}>;
export declare const CHORD_INTERVALS: number[][];
export declare const CHORD_INTERVALS_NAMES: string[];
export declare const rrrola: (n: any) => void;
export declare const CHORDS_LIST: {};
/**
  * Creates an inversion of the chord dictated by the number of steps. One
  * step will only invert the lowest note (first inversion). Two steps will
  * invert the bottom two notes etc. It's also possible to supply a negative
  * number, this will start the inversion from the top (highest) note.
  *
  * @param steps which inversion, 1 = first, 2 = second, etc
  */
export declare const inversion: (steps: any) => void;
/**
 * Export a chord from a root note and a scale
 *
 * @param {Array} notes
 * @param {Array} scaleFormula
 * @param {Number} offset
 * @param {Number} rotation
 * @param {Boolean} cutOff
 * @param {Boolean} accumulate
 * @returns {Array<Number>}
 */
export declare const createChord: (notes: any[], scaleFormula?: any[], offset?: number, rotation?: number, cutOff?: boolean, accumulate?: boolean) => Array<number>;
export declare const createMajorChord: (notes: any, offset?: number, mode?: number) => number[];
export declare const createMinorChord: (notes: any, offset?: number, mode?: number) => number[];
export declare const createJazzChord: (notes: any, offset?: number, mode?: number) => number[];
export declare const getChordVoicingForNoteNumber: (tonic: any, chordType?: string) => any;
/**
 * Memo-ize all chords for a given note
 * Creates mode-specific scales and extracts chord notes from them
 * @param {Number} tonic
 * @param {Number} scale - chord interval formula (e.g., [0,4,3] for major)
 * @param {Number} mode
 */
export declare const createChordsForNoteNumber: (tonic: number, scale: number, mode: number) => any;
/**
 *
 * @param {Number} noteNumber
 * @returns {Map} of scales and modes
 */
export declare const createAllChordsForNoteNumber: (noteNumber?: number) => Map<any, any>;
export declare const getAllChordsForNoteNumber: (noteNumber?: number) => any;
/**
 * So now we can specify a note number, scale and mode
 * to immediately get the precalculated chord for that note
 *
 * @param {Number} noteNumber
 * @param {Number|String} scaleName
 * @returns {Array<Object>}
 */
export declare const getChordsForNoteNumberInScale: (noteNumber?: number, scaleName?: number | string) => Array<Object>;
/**
 * So now we can specify a note number, scale and mode
 * to immediately get the precalculated chord for that note

 * @param {Number} noteNumber
 * @param {String|Number} scaleName
 * @param {String|Number} modeName
 * @returns {Array<Object>}
 */
export declare const getChordsForNoteNumberInMode: (noteNumber?: number, scaleName?: string | number, modeName?: string | number) => Array<Object>;
/**
 *
 * @returns {Array<Number>}
 */
export declare const createAllChordsInModes: () => Array<number>;
export declare const createAllChordsInScalesWithModes: typeof createAllChordsInModes;
