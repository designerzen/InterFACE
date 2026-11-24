/**
 *
C Ionian (major) — CDEFGABC
(intervals: Whole - Whole - Half - Whole - Whole - Whole - Half)

D Dorian — DEFGABCD
(intervals: Whole - Half - Whole - Whole - Whole - Half - Whole)

E Phrygian — EFGABCDE
(intervals: Half - Whole - Whole - Whole - Half - Whole - Whole)

F Lydian — FGABCDEF
(intervals: Whole - Whole - Whole - Half - Whole - Whole - Half)

G Mixolydian — GABCDEFG
(intervals: Whole - Whole - Half - Whole - Whole - Half - Whole)

A Aeolian (minor) — ABCDEFGA
(intervals: Whole - Half - Whole - Whole - Half - Whole - Whole)

B Locrian — BCDEFGAB
(intervals: Half - Whole - Whole - Half - Whole - Whole - Whole)

Dorian sounds brighter than Aeolian, but Phrygian and especially Locrian have a much darker sound
*/
export * from "./intervals.js";
export declare const SCALE_NAMES: {
    english: string[];
    french: string[];
    german: string[];
    spanish: string[];
    kanji: string[];
    northIndian: string[];
    southIndian: string[];
    dutch: string[];
    japanese: string[];
    javanese: string[];
    byzantine: string[];
    solfege: string[];
};
export declare const SOLFEGE_SCALE: string[];
export declare const SCALE_MAJOR = "major";
export declare const SCALE_MINOR = "minor";
export declare const TUNING_MODE_IONIAN = "ionian";
export declare const TUNING_MODE_DORIAN = "dorian";
export declare const TUNING_MODE_PHRYGIAN = "phrygian";
export declare const TUNING_MODE_LYDIAN = "lydian";
export declare const TUNING_MODE_MIXOLYDIAN = "mixolydian";
export declare const TUNING_MODE_AEOLIAN = "aeolian";
export declare const TUNING_MODE_LOCRIAN = "locrian";
export declare const TUNING_MODE_NAMES: string[];
export declare const TUNING_MAJOR_NOMENCLATURE: string[];
export declare const TUNING_MINOR_NOMENCLATURE: string[];
export declare const getModeAsIntegerOffset: (mode: any) => any;
export declare const C_SCALE: string[];
export declare const SCALES: number[][];
export declare const SCALES_NAMES: string[];
export declare const INTERVAL_LIBRARY: Readonly<{
    CHROMATIC_SCALE: number[];
    MAJOR_SCALE: number[];
    NATURAL_MINOR_SCALE: number[];
    HARMONIC_MINOR_SCALE: number[];
    MELODIC_MINOR_SCALE: number[];
    DORIAN_SCALE: number[];
    PHRYGIAN_SCALE: number[];
    LYDIAN_SCALE: number[];
    MIXOLYDIAN_SCALE: number[];
    LOCRIAN_SCALE: number[];
    PENTATONIC_MAJOR_SCALE: number[];
    PENTATONIC_MINOR_SCALE: number[];
    BLUES_SCALE: number[];
    WHOLE_TONE_SCALE: number[];
    DIMINISHED_SCALE: number[];
    AUGMENTED_SCALE: number[];
    FIFTHS_SCALE: number[];
    FIFTHS: number[];
}>;
export declare const makeScaleMode: (notesInScale: any, tuningModeIndex: any) => any[];
/**
 *
 * @param {Array<Number>} parentScaleFormula
 * @param {Number|String} mode
 * @returns {Array} of intervals
 */
export declare const createScaleModeIntervalsFormula: (parentScaleFormula: Array<number>, mode: number | string) => any[];
/**
 * We want to preload all scales into memory
 */
