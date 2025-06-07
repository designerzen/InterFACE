/**
 * Unit tests for the chords.js file
 */

import {
    MAJOR_CHORD_INTERVALS,
    MINOR_CHORD_INTERVALS,
    DORIAN_CHORD_INTERVALS,
    FIFTHS_CHORD_INTERVALS,
    CHORD_INTERVALS,
    CHORD_INTERVALS_NAMES,
    createChord,
    createMajorChord,
    createMinorChord,
    createJazzChord,
    inversion,
    createChordsForNoteNumber,
    createAllChordsForNoteNumber,
    getChordsForNoteNumberInScale,
    getChordsForNoteNumberInMode,
    createAllChordsInScalesWithModes
} from '../source/audio/tuning/chords.js';

import { MAJOR_SCALE, MELODIC_MINOR_SCALE, NATURAL_MINOR_SCALE } from '../source/audio/tuning/scales.js';
import { MIDI_NOTE_NUMBER_MAP } from '../source/audio/tuning/notes.js';

describe('Chord Intervals', () => {
    test('MAJOR_CHORD_INTERVALS should be defined correctly', () => {
        expect(MAJOR_CHORD_INTERVALS).toEqual([0, 4, 3]);
    });

    test('MINOR_CHORD_INTERVALS should be defined correctly', () => {
        expect(MINOR_CHORD_INTERVALS).toEqual([0, 3, 4]);
    });

    test('DORIAN_CHORD_INTERVALS should be defined correctly', () => {
        expect(DORIAN_CHORD_INTERVALS).toEqual([0, 2, 3, 5]);
    });

    test('FIFTHS_CHORD_INTERVALS should be defined correctly', () => {
        expect(FIFTHS_CHORD_INTERVALS).toEqual([0, 5, 5, 5, 5, 5]);
    });

    test('CHORD_INTERVALS should contain all chord interval types', () => {
        expect(CHORD_INTERVALS).toEqual([
            MAJOR_CHORD_INTERVALS,
            MINOR_CHORD_INTERVALS,
            DORIAN_CHORD_INTERVALS,
            FIFTHS_CHORD_INTERVALS
        ]);
    });

    test('CHORD_INTERVALS_NAMES should match CHORD_INTERVALS length', () => {
        expect(CHORD_INTERVALS_NAMES.length).toBe(CHORD_INTERVALS.length);
    });

    test('CHORD_INTERVALS_NAMES should contain expected names', () => {
        expect(CHORD_INTERVALS_NAMES).toEqual([
            "major",
            "minor",
            "dorian",
            "fifths"
        ]);
    });
});

describe('createChord function', () => {
    const mockNotes = [
        { noteNumber: 60, name: 'C4' },
        { noteNumber: 62, name: 'D4' },
        { noteNumber: 64, name: 'E4' },
        { noteNumber: 65, name: 'F4' },
        { noteNumber: 67, name: 'G4' },
        { noteNumber: 69, name: 'A4' },
        { noteNumber: 71, name: 'B4' }
    ];

    test('should create a chord with default parameters', () => {
        const chord = createChord(mockNotes);
        expect(chord).toHaveLength(MAJOR_SCALE.length);
        expect(chord[0]).toEqual(mockNotes[0]);
        expect(chord[1]).toEqual(mockNotes[2]);
        expect(chord[2]).toEqual(mockNotes[4]);
    });

    test('should create a chord with custom scale formula', () => {
        const chord = createChord(mockNotes, MINOR_CHORD_INTERVALS);
        expect(chord).toHaveLength(MINOR_CHORD_INTERVALS.length);
        expect(chord[0]).toEqual(mockNotes[0]);
        expect(chord[1]).toEqual(mockNotes[3]);
        expect(chord[2]).toEqual(mockNotes[3 + 4]);
    });

    test('should create a chord with offset', () => {
        const chord = createChord(mockNotes, MAJOR_SCALE, 1);
        expect(chord[0]).toEqual(mockNotes[1]);
    });

    test('should create a chord with mode', () => {
        const chord = createChord(mockNotes, MAJOR_SCALE, 0, 1);
        // Mode 1 shifts the scale formula by 1
        expect(chord[0]).toEqual(mockNotes[0]);
        expect(chord[1]).toEqual(mockNotes[2]);
    });

    test('should handle cutOff parameter', () => {
        const chord = createChord(mockNotes, MAJOR_SCALE, 0, 0, false);
        expect(chord).toHaveLength(MAJOR_SCALE.length);
    });

    test('should handle accumulate parameter', () => {
        const chord = createChord(mockNotes, MAJOR_CHORD_INTERVALS, 0, 0, true, true);
        expect(chord).toHaveLength(MAJOR_CHORD_INTERVALS.length);
        expect(chord[0]).toEqual(mockNotes[0]);
        expect(chord[1]).toEqual(mockNotes[4]); // 0 + 4 = 4
        expect(chord[2]).toEqual(mockNotes[7 % mockNotes.length]); // (4 + 3) % 7 = 7 % 7 = 0
    });
});

describe('Chord creation helper functions', () => {
    const mockNotes = [
        { noteNumber: 60, name: 'C4' },
        { noteNumber: 62, name: 'D4' },
        { noteNumber: 64, name: 'E4' },
        { noteNumber: 65, name: 'F4' },
        { noteNumber: 67, name: 'G4' },
        { noteNumber: 69, name: 'A4' },
        { noteNumber: 71, name: 'B4' }
    ];

    test('createMajorChord should create a major chord', () => {
        const chord = createMajorChord(mockNotes);
        expect(chord).toHaveLength(MAJOR_CHORD_INTERVALS.length);
        // Major chord is root, major third, perfect fifth
        expect(chord[0]).toEqual(mockNotes[0]);
        expect(chord[1]).toEqual(mockNotes[4 % mockNotes.length]);
        expect(chord[2]).toEqual(mockNotes[7 % mockNotes.length]);
    });

    test('createMinorChord should create a minor chord', () => {
        const chord = createMinorChord(mockNotes);
        expect(chord).toHaveLength(MINOR_CHORD_INTERVALS.length);
        // Minor chord is root, minor third, perfect fifth
        expect(chord[0]).toEqual(mockNotes[0]);
        expect(chord[1]).toEqual(mockNotes[3 % mockNotes.length]);
        expect(chord[2]).toEqual(mockNotes[7 % mockNotes.length]);
    });

    test('createJazzChord should create a jazz chord', () => {
        const chord = createJazzChord(mockNotes);
        expect(chord).toHaveLength(MELODIC_MINOR_SCALE.length);
        // Jazz chord uses the melodic minor scale
        expect(chord[0]).toEqual(mockNotes[0]);
    });
});

describe('createChordsForNoteNumber function', () => {
    test('should create chords for a given note number', () => {
        const tonic = 60; // C4
        const scale = MAJOR_CHORD_INTERVALS;
        const mode = 0; // Major mode
        
        const chords = createChordsForNoteNumber(tonic, scale, mode);
        expect(chords).toBeDefined();
        expect(Array.isArray(chords)).toBe(true);
    });

    test('should accept mode as string', () => {
        const tonic = 60; // C4
        const scale = MAJOR_CHORD_INTERVALS;
        const mode = 'Major';
        
        const chords = createChordsForNoteNumber(tonic, scale, mode);
        expect(chords).toBeDefined();
        expect(Array.isArray(chords)).toBe(true);
    });

    test('should throw error for invalid mode', () => {
        const tonic = 60; // C4
        const scale = MAJOR_CHORD_INTERVALS;
        const mode = 'InvalidMode';
        
        expect(() => {
            createChordsForNoteNumber(tonic, scale, mode);
        }).toThrow();
    });
});

describe('createAllChordsForNoteNumber function', () => {
    test('should create a map of all chords for a note number', () => {
        const noteNumber = 60; // C4
        const allChords = createAllChordsForNoteNumber(noteNumber);
        
        expect(allChords).toBeInstanceOf(Map);
        expect(allChords.size).toBe(CHORD_INTERVALS.length * 2); // Each scale has both name and index entries
        
        // Check that it contains entries for each scale type
        CHORD_INTERVALS_NAMES.forEach(scaleName => {
            expect(allChords.has(scaleName)).toBe(true);
            const modeMap = allChords.get(scaleName);
            expect(modeMap).toBeInstanceOf(Map);
        });
    });
});

describe('Chord retrieval functions', () => {
    // These tests depend on the global allChords variable being initialized
    // which happens in the actual module but might not be available in tests
    
    test('getChordsForNoteNumberInScale should retrieve chords for a note in a scale', () => {
        // This is more of an integration test and might need mocking
        const noteNumber = 60; // C4
        const scaleName = 'major';
        
        // Mock the global allChords if needed
        global.allChords = global.allChords || [];
        global.allChords[noteNumber] = createAllChordsForNoteNumber(noteNumber);
        
        const chordsInScale = getChordsForNoteNumberInScale(noteNumber, scaleName);
        expect(chordsInScale).toBeInstanceOf(Map);
    });

    test('getChordsForNoteNumberInMode should retrieve chords for a note in a specific mode', () => {
        // This is more of an integration test and might need mocking
        const noteNumber = 60; // C4
        const scaleName = 'major';
        const modeName = 'Major';
        
        // Mock the global allChords if needed
        global.allChords = global.allChords || [];
        global.allChords[noteNumber] = createAllChordsForNoteNumber(noteNumber);
        
        const chordsInMode = getChordsForNoteNumberInMode(noteNumber, scaleName, modeName);
        expect(Array.isArray(chordsInMode)).toBe(true);
    });
});

describe('createAllChordsInScalesWithModes function', () => {
    test('should create all chords for all notes', () => {
        // This function initializes the global allChords array
        // It's a heavy operation so we might want to mock parts of it
        
        // Mock MIDI_NOTE_NUMBER_MAP to a smaller subset for testing
        const originalMap = MIDI_NOTE_NUMBER_MAP;
        global.MIDI_NOTE_NUMBER_MAP = originalMap.slice(60, 65); // Just a few notes
        
        const result = createAllChordsInScalesWithModes();
        expect(Array.isArray(result)).toBe(true);
        
        // Restore the original
        global.MIDI_NOTE_NUMBER_MAP = originalMap;
    });
});
