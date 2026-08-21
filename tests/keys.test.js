import {
    createKey,
    createKeyFromNote,
    CHROMATIC_SCALE_KEYS,
    MAJOR_SCALE_KEYS,
    MINOR_SCALE_KEYS,
    HARM_MINOR_SCALE_KEYS,
    JAZZ_MINOR_SCALE_KEYS,
    DORIAN_SCALE_KEYS,
    PHRYGIAN_SCALE_KEYS,
    LYDIAN_SCALE_KEYS,
    MIXOLYDIAN_SCALE_KEYS,
    LOCRIAN_SCALE_KEYS,
    PENTATONIC_MAJOR_SCALE_KEYS,
    PENTATONIC_MINOR_SCALE_KEYS,
    BLUES_SCALE_KEYS,
    WHOLE_TONE_SCALE_KEYS,
    DIMINISHED_SCALE_KEYS,
    AUGMENTED_SCALE_KEYS,
    FIFTHS_SCALE_KEYS
} from '../source/audio/tuning/keys.js';

import { NOTES_ALPHABETICAL } from '../source/audio/tuning/notes.js';
import {
    CHROMATIC_SCALE,
    MAJOR_SCALE,
    NATURAL_MINOR_SCALE,
    HARMONIC_MINOR_SCALE,
    MELODIC_MINOR_SCALE,
    DORIAN_SCALE,
    PHRYGIAN_SCALE,
    LYDIAN_SCALE,
    MIXOLYDIAN_SCALE,
    LOCRIAN_SCALE,
    PENTATONIC_MAJOR_SCALE,
    PENTATONIC_MINOR_SCALE,
    BLUES_SCALE,
    WHOLE_TONE_SCALE,
    DIMINISHED_SCALE,
    AUGMENTED_SCALE,
    FIFTHS_SCALE,
    INTERVAL_LIBRARY
} from '../source/audio/tuning/scales.js';

describe('keys.js', () => {
    describe('createKey', () => {
        test('should create a key array from notes and scale', () => {
            const result = createKey(NOTES_ALPHABETICAL, MAJOR_SCALE);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(12);
            expect(result[0]).toBe('Ab'); // scale[0] = 0 -> notes[0]
            expect(result[1]).toBe('Bb'); // scale[1] = 2 -> notes[2]
        });

        test('should handle offset', () => {
            const result = createKey(NOTES_ALPHABETICAL, MAJOR_SCALE, 3, 0, false, true);
            expect(result[0]).toBe(NOTES_ALPHABETICAL[3]); // offset 3 with accumulate
        });

        test('should handle mode', () => {
            const result = createKey(NOTES_ALPHABETICAL, MAJOR_SCALE, 0, 1);
            expect(result[0]).toBe(NOTES_ALPHABETICAL[MAJOR_SCALE[1]]);
        });

        test('should handle accumulate', () => {
            const result = createKey(NOTES_ALPHABETICAL, FIFTHS_SCALE, 0, 0, false, true);
            expect(result[0]).toBe('F'); // 0 + 9 = 9 -> notes[9]
            expect(result[1]).toBe('A'); // 9 + 4 = 13 -> notes[1]
        });
    });

    describe('createKeyFromNote', () => {
        test('should create key from note index', () => {
            const result = createKeyFromNote(0, MAJOR_SCALE);
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(12);
        });
    });

    describe('MAJOR_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(MAJOR_SCALE_KEYS).toBeInstanceOf(Array);
            expect(MAJOR_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            MAJOR_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[MAJOR_SCALE_KEYS[i]];
                const next = noteToIndex[MAJOR_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('MINOR_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(MINOR_SCALE_KEYS).toBeInstanceOf(Array);
            expect(MINOR_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            MINOR_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[MINOR_SCALE_KEYS[i]];
                const next = noteToIndex[MINOR_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('HARM_MINOR_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(HARM_MINOR_SCALE_KEYS).toBeInstanceOf(Array);
            expect(HARM_MINOR_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            HARM_MINOR_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[HARM_MINOR_SCALE_KEYS[i]];
                const next = noteToIndex[HARM_MINOR_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('JAZZ_MINOR_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(JAZZ_MINOR_SCALE_KEYS).toBeInstanceOf(Array);
            expect(JAZZ_MINOR_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            JAZZ_MINOR_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [2, 1, 2, 2, 2, 2, 1, 2, 1, 2, 2];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[JAZZ_MINOR_SCALE_KEYS[i]];
                const next = noteToIndex[JAZZ_MINOR_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('FIFTHS_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(FIFTHS_SCALE_KEYS).toBeInstanceOf(Array);
            expect(FIFTHS_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain the correct circle of fifths sequence', () => {
            const expected = ["F", "C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb"];
            expect(FIFTHS_SCALE_KEYS).toEqual(expected);
        });

        test('should have each consecutive pair separated by 7 semitones', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            for (let i = 0; i < FIFTHS_SCALE_KEYS.length - 1; i++) {
                const current = noteToIndex[FIFTHS_SCALE_KEYS[i]];
                const next = noteToIndex[FIFTHS_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(7); // perfect fifth
            }
        });
    });

    describe('DORIAN_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(DORIAN_SCALE_KEYS).toBeInstanceOf(Array);
            expect(DORIAN_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            DORIAN_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[DORIAN_SCALE_KEYS[i]];
                const next = noteToIndex[DORIAN_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('PHRYGIAN_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(PHRYGIAN_SCALE_KEYS).toBeInstanceOf(Array);
            expect(PHRYGIAN_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            PHRYGIAN_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[PHRYGIAN_SCALE_KEYS[i]];
                const next = noteToIndex[PHRYGIAN_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('LYDIAN_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(LYDIAN_SCALE_KEYS).toBeInstanceOf(Array);
            expect(LYDIAN_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            LYDIAN_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[LYDIAN_SCALE_KEYS[i]];
                const next = noteToIndex[LYDIAN_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('MIXOLYDIAN_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(MIXOLYDIAN_SCALE_KEYS).toBeInstanceOf(Array);
            expect(MIXOLYDIAN_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            MIXOLYDIAN_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[MIXOLYDIAN_SCALE_KEYS[i]];
                const next = noteToIndex[MIXOLYDIAN_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('LOCRIAN_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(LOCRIAN_SCALE_KEYS).toBeInstanceOf(Array);
            expect(LOCRIAN_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            LOCRIAN_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[LOCRIAN_SCALE_KEYS[i]];
                const next = noteToIndex[LOCRIAN_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('PENTATONIC_MAJOR_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(PENTATONIC_MAJOR_SCALE_KEYS).toBeInstanceOf(Array);
            expect(PENTATONIC_MAJOR_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            PENTATONIC_MAJOR_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 2];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[PENTATONIC_MAJOR_SCALE_KEYS[i]];
                const next = noteToIndex[PENTATONIC_MAJOR_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('PENTATONIC_MINOR_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(PENTATONIC_MINOR_SCALE_KEYS).toBeInstanceOf(Array);
            expect(PENTATONIC_MINOR_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            PENTATONIC_MINOR_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [2, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[PENTATONIC_MINOR_SCALE_KEYS[i]];
                const next = noteToIndex[PENTATONIC_MINOR_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('BLUES_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(BLUES_SCALE_KEYS).toBeInstanceOf(Array);
            expect(BLUES_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            BLUES_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [2, 1, 1, 3, 2, 3, 2, 1, 1, 3, 2];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[BLUES_SCALE_KEYS[i]];
                const next = noteToIndex[BLUES_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('WHOLE_TONE_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(WHOLE_TONE_SCALE_KEYS).toBeInstanceOf(Array);
            expect(WHOLE_TONE_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            WHOLE_TONE_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[WHOLE_TONE_SCALE_KEYS[i]];
                const next = noteToIndex[WHOLE_TONE_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('DIMINISHED_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(DIMINISHED_SCALE_KEYS).toBeInstanceOf(Array);
            expect(DIMINISHED_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            DIMINISHED_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[DIMINISHED_SCALE_KEYS[i]];
                const next = noteToIndex[DIMINISHED_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });

    describe('AUGMENTED_SCALE_KEYS', () => {
        test('should be an array of length 12', () => {
            expect(AUGMENTED_SCALE_KEYS).toBeInstanceOf(Array);
            expect(AUGMENTED_SCALE_KEYS).toHaveLength(12);
        });

        test('should contain valid notes', () => {
            AUGMENTED_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });

        test('should have correct musical intervals', () => {
            const noteToIndex = {
                'Ab': 0, 'A': 1, 'Bb': 2, 'B': 3, 'C': 4, 'Db': 5, 'D': 6,
                'Eb': 7, 'E': 8, 'F': 9, 'Gb': 10, 'G': 11
            };
            const expectedIntervals = [1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1];
            for (let i = 0; i < expectedIntervals.length; i++) {
                const current = noteToIndex[AUGMENTED_SCALE_KEYS[i]];
                const next = noteToIndex[AUGMENTED_SCALE_KEYS[i + 1]];
                const diff = (next - current + 12) % 12;
                expect(diff).toBe(expectedIntervals[i]);
            }
        });
    });
});

describe('INTERVAL_LIBRARY', () => {
    test('should be an object', () => {
        expect(INTERVAL_LIBRARY).toBeInstanceOf(Object);
    });

    test('should contain all expected scale keys', () => {
        const expectedKeys = [
            'CHROMATIC_SCALE',
            'MAJOR_SCALE',
            'NATURAL_MINOR_SCALE',
            'HARMONIC_MINOR_SCALE',
            'MELODIC_MINOR_SCALE',
            'DORIAN_SCALE',
            'PHRYGIAN_SCALE',
            'LYDIAN_SCALE',
            'MIXOLYDIAN_SCALE',
            'LOCRIAN_SCALE',
            'PENTATONIC_MAJOR_SCALE',
            'PENTATONIC_MINOR_SCALE',
            'BLUES_SCALE',
            'WHOLE_TONE_SCALE',
            'DIMINISHED_SCALE',
            'AUGMENTED_SCALE',
            'FIFTHS_SCALE',
            'FIFTHS'
        ];
        expectedKeys.forEach(key => {
            expect(INTERVAL_LIBRARY).toHaveProperty(key);
        });
    });

    test('each scale should be an array of numbers', () => {
        Object.values(INTERVAL_LIBRARY).forEach(scale => {
            expect(Array.isArray(scale)).toBe(true);
            scale.forEach(interval => {
                expect(typeof interval).toBe('number');
                expect(interval).toBeGreaterThanOrEqual(0);
                expect(interval).toBeLessThanOrEqual(12);
            });
        });
    });

    test('heptatonic scales should have 7 intervals', () => {
        const heptatonicScales = [
            'MAJOR_SCALE',
            'NATURAL_MINOR_SCALE',
            'HARMONIC_MINOR_SCALE',
            'MELODIC_MINOR_SCALE',
            'DORIAN_SCALE',
            'PHRYGIAN_SCALE',
            'LYDIAN_SCALE',
            'MIXOLYDIAN_SCALE',
            'LOCRIAN_SCALE'
        ];
        heptatonicScales.forEach(key => {
            expect(INTERVAL_LIBRARY[key]).toHaveLength(7);
        });
    });

    test('chromatic scale should have 12 intervals', () => {
        expect(INTERVAL_LIBRARY['CHROMATIC_SCALE']).toBe(CHROMATIC_SCALE);
        expect(INTERVAL_LIBRARY['CHROMATIC_SCALE']).toHaveLength(12);
    });

    test('pentatonic scales should have 5 intervals', () => {
        const pentatonicScales = [
            'PENTATONIC_MAJOR_SCALE',
            'PENTATONIC_MINOR_SCALE'
        ];
        pentatonicScales.forEach(key => {
            expect(INTERVAL_LIBRARY[key]).toHaveLength(5);
        });
    });

    test('blues scale should have 6 intervals', () => {
        expect(INTERVAL_LIBRARY['BLUES_SCALE']).toHaveLength(6);
    });

    test('whole tone scale should have 6 intervals', () => {
        expect(INTERVAL_LIBRARY['WHOLE_TONE_SCALE']).toHaveLength(6);
    });

    test('diminished scale should have 8 intervals', () => {
        expect(INTERVAL_LIBRARY['DIMINISHED_SCALE']).toHaveLength(8);
    });

    test('augmented scale should have 6 intervals', () => {
        expect(INTERVAL_LIBRARY['AUGMENTED_SCALE']).toHaveLength(6);
    });

    test('fifths should have 12 intervals', () => {
        expect(INTERVAL_LIBRARY['FIFTHS']).toHaveLength(12);
        expect(INTERVAL_LIBRARY['FIFTHS']).toBe(INTERVAL_LIBRARY['FIFTHS_SCALE']);
    });

    describe('CHROMATIC_SCALE_KEYS', () => {
        test('should contain all twelve notes', () => {
            expect(CHROMATIC_SCALE_KEYS).toBeInstanceOf(Array);
            expect(CHROMATIC_SCALE_KEYS).toHaveLength(12);
            expect(new Set(CHROMATIC_SCALE_KEYS).size).toBe(12);
            CHROMATIC_SCALE_KEYS.forEach(note => {
                expect(NOTES_ALPHABETICAL).toContain(note);
            });
        });
    });

    test('heptatonic scales should span exactly one octave', () => {
        const heptatonicScales = [
            'MAJOR_SCALE',
            'NATURAL_MINOR_SCALE',
            'HARMONIC_MINOR_SCALE',
            'MELODIC_MINOR_SCALE',
            'DORIAN_SCALE',
            'PHRYGIAN_SCALE',
            'LYDIAN_SCALE',
            'MIXOLYDIAN_SCALE',
            'LOCRIAN_SCALE'
        ];
        heptatonicScales.forEach(key => {
            const scale = INTERVAL_LIBRARY[key];
            let sum = 0;
            for (let i = 1; i < scale.length; i++) {
                sum += scale[i] - scale[i - 1];
            }
            sum += 12 - scale[scale.length - 1]; // octave return
            expect(sum).toBe(12);
        });
    });

    test('pentatonic scales should span exactly one octave', () => {
        const pentatonicScales = [
            'PENTATONIC_MAJOR_SCALE',
            'PENTATONIC_MINOR_SCALE'
        ];
        pentatonicScales.forEach(key => {
            const scale = INTERVAL_LIBRARY[key];
            let sum = 0;
            for (let i = 1; i < scale.length; i++) {
                sum += scale[i] - scale[i - 1];
            }
            sum += 12 - scale[scale.length - 1]; // octave return
            expect(sum).toBe(12);
        });
    });

    test('blues scale should span exactly one octave', () => {
        const scale = INTERVAL_LIBRARY['BLUES_SCALE'];
        let sum = 0;
        for (let i = 1; i < scale.length; i++) {
            sum += scale[i] - scale[i - 1];
        }
        sum += 12 - scale[scale.length - 1]; // octave return
        expect(sum).toBe(12);
    });

    test('whole tone scale should span exactly one octave', () => {
        const scale = INTERVAL_LIBRARY['WHOLE_TONE_SCALE'];
        let sum = 0;
        for (let i = 1; i < scale.length; i++) {
            sum += scale[i] - scale[i - 1];
        }
        sum += 12 - scale[scale.length - 1]; // octave return
        expect(sum).toBe(12);
    });

    test('diminished scale should span exactly one octave', () => {
        const scale = INTERVAL_LIBRARY['DIMINISHED_SCALE'];
        let sum = 0;
        for (let i = 1; i < scale.length; i++) {
            sum += scale[i] - scale[i - 1];
        }
        sum += 12 - scale[scale.length - 1]; // octave return
        expect(sum).toBe(12);
    });

    test('augmented scale should span exactly one octave', () => {
        const scale = INTERVAL_LIBRARY['AUGMENTED_SCALE'];
        let sum = 0;
        for (let i = 1; i < scale.length; i++) {
            sum += scale[i] - scale[i - 1];
        }
        sum += 12 - scale[scale.length - 1]; // octave return
        expect(sum).toBe(12);
    });
});
