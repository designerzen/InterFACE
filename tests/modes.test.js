import {
    createChordsForNoteNumber,
    getChordsForNoteNumberInMode
} from '../source/audio/tuning/chords.js'

import { MAJOR_CHORD_INTERVALS } from '../source/audio/tuning/chords.js'
import { TUNING_MODE_NAMES } from '../source/audio/tuning/scales.js'

describe('Mode-specific chord generation', () => {
    
    test('C Ionian should have major 3rd (E natural)', () => {
        const c_ionian = createChordsForNoteNumber(60, MAJOR_CHORD_INTERVALS, 0) // 0 = ionian
        // C (60), E (64), G (67)
        expect(c_ionian[0].noteNumber).toBe(60) // C
        expect(c_ionian[1].noteNumber).toBe(64) // E (major 3rd = 4 semitones)
        expect(c_ionian[2].noteNumber).toBe(67) // G
    })

    test('C Dorian should have minor 3rd (Eb)', () => {
        const c_dorian = createChordsForNoteNumber(60, MAJOR_CHORD_INTERVALS, 1) // 1 = dorian
        // C (60), Eb (63), G (67)
        expect(c_dorian[0].noteNumber).toBe(60) // C
        expect(c_dorian[1].noteNumber).toBe(63) // Eb (minor 3rd = 3 semitones)
        expect(c_dorian[2].noteNumber).toBe(67) // G
    })

    test('C Phrygian should have minor 3rd (Eb)', () => {
        const c_phrygian = createChordsForNoteNumber(60, MAJOR_CHORD_INTERVALS, 2) // 2 = phrygian
        // C (60), Eb (63), G (67)
        expect(c_phrygian[0].noteNumber).toBe(60) // C
        expect(c_phrygian[1].noteNumber).toBe(63) // Eb (minor 3rd)
        expect(c_phrygian[2].noteNumber).toBe(67) // G
    })

    test('C Lydian should have major 3rd (E natural)', () => {
        const c_lydian = createChordsForNoteNumber(60, MAJOR_CHORD_INTERVALS, 3) // 3 = lydian
        // C (60), E (64), G (67)
        expect(c_lydian[0].noteNumber).toBe(60) // C
        expect(c_lydian[1].noteNumber).toBe(64) // E (major 3rd)
        expect(c_lydian[2].noteNumber).toBe(67) // G
    })

    test('C Mixolydian should have major 3rd (E natural)', () => {
        const c_mixolydian = createChordsForNoteNumber(60, MAJOR_CHORD_INTERVALS, 4) // 4 = mixolydian
        // C (60), E (64), G (67)
        expect(c_mixolydian[0].noteNumber).toBe(60) // C
        expect(c_mixolydian[1].noteNumber).toBe(64) // E (major 3rd)
        expect(c_mixolydian[2].noteNumber).toBe(67) // G
    })

    test('C Aeolian (Natural Minor) should have minor 3rd (Eb)', () => {
        const c_aeolian = createChordsForNoteNumber(60, MAJOR_CHORD_INTERVALS, 5) // 5 = aeolian
        // C (60), Eb (63), G (67)
        expect(c_aeolian[0].noteNumber).toBe(60) // C
        expect(c_aeolian[1].noteNumber).toBe(63) // Eb (minor 3rd)
        expect(c_aeolian[2].noteNumber).toBe(67) // G
    })

    test('C Locrian should have diminished chord (Gb instead of G)', () => {
        const c_locrian = createChordsForNoteNumber(60, MAJOR_CHORD_INTERVALS, 6) // 6 = locrian
        // C (60), Eb (63), Gb (66)
        expect(c_locrian[0].noteNumber).toBe(60) // C
        expect(c_locrian[1].noteNumber).toBe(63) // Eb (minor 3rd)
        expect(c_locrian[2].noteNumber).toBe(66) // Gb (diminished 5th)
    })

    test('mode names work as strings (lowercase)', () => {
        const c_dorian_by_name = createChordsForNoteNumber(60, MAJOR_CHORD_INTERVALS, 'dorian')
        const c_dorian_by_index = createChordsForNoteNumber(60, MAJOR_CHORD_INTERVALS, 1)
        
        expect(c_dorian_by_name[0].noteNumber).toBe(c_dorian_by_index[0].noteNumber)
        expect(c_dorian_by_name[1].noteNumber).toBe(c_dorian_by_index[1].noteNumber)
        expect(c_dorian_by_name[2].noteNumber).toBe(c_dorian_by_index[2].noteNumber)
    })

    test('getChordsForNoteNumberInMode returns correct chords', () => {
        const c_dorian_chords = getChordsForNoteNumberInMode(60, 'major', 'dorian')
        // Should contain chord notes
        expect(c_dorian_chords).toBeDefined()
        expect(Array.isArray(c_dorian_chords)).toBe(true)
        expect(c_dorian_chords.length).toBeGreaterThan(0)
    })
})
