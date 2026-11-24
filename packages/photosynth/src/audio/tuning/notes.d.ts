/**
 * Having written this numerous times here are some
 * notes for next time around.
 *
 * There are MORE MIDI notes than SAMPLES
 * so we have to restrict the octaves from 1-9 to 1-7
 *
 */
import { NOTES_ALPHABETICAL, NOTES_ALPHABETICAL_FRIENDLY } from "./note-constants.js";
export { NOTES_ALPHABETICAL, NOTES_ALPHABETICAL_FRIENDLY };
export declare const NOTES_BLACK: string[];
export declare const NOTES_WHITE: string[];
export declare const NOTES_CIRCLE_OF_FIFTHS_SHARPS: string[];
export declare const NOTES_CIRCLE_OF_FIFTHS_NO_SHARPS: string[];
export declare const MUSICAL_NOTES: string[];
export declare const MIDI_NOTE_NUMBER_MAP: any[];
export declare const MIDI_NOTE_NUMBERS: any[];
export declare const MIDI_NOTE_NAMES: any[];
export declare const MIDI_NOTE_FRIENDLY_NAMES: any[];
export declare const MIDI_NOTE_LETTERS: any[];
export declare const MIDI_NOTE_FREQUENCIES: any[];
export declare const GENERAL_MIDI_INSTRUMENTS: any[];
export declare const GENERAL_MIDI_BY_NAME: Map<any, any>;
export declare const GENERAL_MIDI_NUMBERS_BY_NAME: Map<any, any>;
export declare const FREQUENCY_BY_NAME: Map<any, any>;
export declare const FREQUENCY_LIST: Map<any, any>;
/**
 * The instruments are all named the same way and this method
 * creates the data model
 *
 * @param {String} fileType - audio file type (wav, ogg or mp3)
 * @param {String} dot - delimiter before file type
 * @returns {String} Array containing the following strings...
 * A0-7 / Ab1-7 / B0-7 / Bb1-Bb7 / C1-C8 / D1-7 / Db1-7 / E1-7 / Eb1-7 / F1-7 / G1-7 / Gb1-7
 */
export declare const createInstrumentBanks: (fileType?: string, dot?: string) => string;
export declare const NOTE_NAMES: string;
export declare const NOTE_NAMES_POPULAR_FIRST: string[];
/**
 * what percentage of an octave results in
 * which musical notes
 * @param {Number} percent
 * @param {Number} octave - octaves 1-7
 * @param {Boolean} facingLeft
 * @returns A1 Ab1 etc
 */
export declare const chooseNoteNameUsingPercentage: (percent: number, octave?: number, facingLeft?: boolean, notesLeft?: string[], notesRight?: string[]) => string;
/**
 * return the relevent do re me fah so lat ti
 * @param {Number} percent
 * @param {Boolean} isMinor
 * @returns
 */
export declare const getNoteSound: (percent: number, isMinor?: boolean) => string;
export declare const getNoteSoundFromNumber: (noteNumber: any, offset?: number) => string;
export declare const getFriendlyNoteName: (noteName: any) => any;
/**
 * Get the note name (in scientific notation) of the given midi number
 *
 * It uses MIDI's [Tuning Standard](https://en.wiki[]pedia.org/wiki/MIDI_Tuning_Standard)
 * where A4 is 69
 *
 * This method doesn't take into account diatonic spelling. Always the same
 * pitch class is given for the same midi number.

 * @param {Integer} midi - the midi number
 * @return {String} the pitch
 */
export declare const convertNoteNameToMIDINoteNumber: (name: any) => string;
/**
 *
 * @param {Number} noteNumber
 * @returns
 */
export declare const convertMIDINoteNumberToName: (noteNumber: number) => any;
export declare const convertMIDINoteNumberToFrequency: (midiNoteNumber: any) => any;
