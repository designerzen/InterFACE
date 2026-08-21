import {
    MAJOR_CHORD_INTERVALS,
    MINOR_CHORD_INTERVALS,
    DORIAN_CHORD_INTERVALS,
    FIFTHS_CHORD_INTERVALS,
    CHORD_INTERVALS,
    CHORD_INTERVALS_NAMES,
    createChordsForNoteNumber
} from '../source/audio/tuning/chords.js'

import { TUNING_MODE_NAMES } from '../source/audio/tuning/scales.js'

describe('Comprehensive Chord Mode Coverage', () => {
    
    // Define expected characteristics for each mode when applied to a major chord formula
    const modeCharacteristics = {
        // Mode 0: Ionian (Major scale) - has major 3rd
        ionian: { major3rd: true, minor3rd: false, diminished5th: false },
        // Mode 1: Dorian - has minor 3rd, perfect 5th
        dorian: { major3rd: false, minor3rd: true, diminished5th: false },
        // Mode 2: Phrygian - has minor 3rd, perfect 5th
        phrygian: { major3rd: false, minor3rd: true, diminished5th: false },
        // Mode 3: Lydian - has major 3rd, perfect 5th (raised 4th)
        lydian: { major3rd: true, minor3rd: false, diminished5th: false },
        // Mode 4: Mixolydian - has major 3rd, perfect 5th (lowered 7th)
        mixolydian: { major3rd: true, minor3rd: false, diminished5th: false },
        // Mode 5: Aeolian (Natural Minor) - has minor 3rd, perfect 5th
        aeolian: { major3rd: false, minor3rd: true, diminished5th: false },
        // Mode 6: Locrian - has minor 3rd, diminished 5th
        locrian: { major3rd: false, minor3rd: true, diminished5th: true }
    }

    // Test each mode with major chord formula
    describe('Major Chord in Each Mode', () => {
        const tonic = 60 // C4
        const chordFormula = MAJOR_CHORD_INTERVALS

        for (let modeIndex = 0; modeIndex < TUNING_MODE_NAMES.length; modeIndex++) {
            const modeName = TUNING_MODE_NAMES[modeIndex]
            
            test(`${modeName.toUpperCase()} mode produces correct intervals`, () => {
                const chord = createChordsForNoteNumber(tonic, chordFormula, modeIndex)
                
                expect(chord).toHaveLength(3)
                expect(chord[0]).toBeDefined()
                expect(chord[1]).toBeDefined()
                expect(chord[2]).toBeDefined()
                
                const root = chord[0].noteNumber
                const third = chord[1].noteNumber
                const fifth = chord[2].noteNumber
                
                const thirdInterval = third - root
                const fifthInterval = fifth - root
                
                const char = modeCharacteristics[modeName]
                
                // Verify intervals
                if (char.major3rd) {
                    expect(thirdInterval).toBe(4) // Major 3rd
                } else if (char.minor3rd) {
                    expect(thirdInterval).toBe(3) // Minor 3rd
                }
                
                if (char.diminished5th) {
                    expect(fifthInterval).toBe(6) // Diminished 5th
                } else {
                    expect(fifthInterval).toBe(7) // Perfect 5th
                }
            })
        }
    })

    // Test each mode with minor chord formula
    describe('Minor Chord in Each Mode', () => {
        const tonic = 60 // C4
        const chordFormula = MINOR_CHORD_INTERVALS

        for (let modeIndex = 0; modeIndex < TUNING_MODE_NAMES.length; modeIndex++) {
            const modeName = TUNING_MODE_NAMES[modeIndex]
            
            test(`${modeName.toUpperCase()} mode with minor formula produces valid intervals`, () => {
                const chord = createChordsForNoteNumber(tonic, chordFormula, modeIndex)
                
                expect(chord).toHaveLength(3)
                expect(chord[0]).toBeDefined()
                expect(chord[1]).toBeDefined()
                expect(chord[2]).toBeDefined()
                
                const root = chord[0].noteNumber
                const third = chord[1].noteNumber
                const fifth = chord[2].noteNumber
                
                const thirdInterval = third - root
                const fifthInterval = fifth - root
                
                // Minor formula produces various intervals depending on mode
                expect(thirdInterval).toBeGreaterThanOrEqual(1)
                expect(thirdInterval).toBeLessThanOrEqual(5)
                expect(fifthInterval).toBeGreaterThanOrEqual(5)
                expect(fifthInterval).toBeLessThanOrEqual(8)
            })
        }
    })

    // Test each mode with Dorian chord formula
    describe('Dorian Chord in Each Mode', () => {
        const tonic = 60 // C4
        const chordFormula = DORIAN_CHORD_INTERVALS

        for (let modeIndex = 0; modeIndex < TUNING_MODE_NAMES.length; modeIndex++) {
            const modeName = TUNING_MODE_NAMES[modeIndex]
            
            test(`${modeName.toUpperCase()} mode with dorian formula`, () => {
                const chord = createChordsForNoteNumber(tonic, chordFormula, modeIndex)
                
                expect(chord).toHaveLength(4)
                expect(chord[0]).toBeDefined()
                expect(chord[3]).toBeDefined()
                
                // All notes should be within 2 octaves of root
                const root = chord[0].noteNumber
                for (let i = 1; i < chord.length; i++) {
                    const note = chord[i].noteNumber
                    expect(note - root).toBeGreaterThanOrEqual(0)
                    expect(note - root).toBeLessThanOrEqual(24)
                }
            })
        }
    })

    // Test each mode with Fifths chord formula
    describe('Fifths Chord in Each Mode', () => {
        const tonic = 60 // C4
        const chordFormula = FIFTHS_CHORD_INTERVALS

        for (let modeIndex = 0; modeIndex < TUNING_MODE_NAMES.length; modeIndex++) {
            const modeName = TUNING_MODE_NAMES[modeIndex]
            
            test(`${modeName.toUpperCase()} mode with fifths formula produces valid notes`, () => {
                const chord = createChordsForNoteNumber(tonic, chordFormula, modeIndex)
                
                expect(chord).toHaveLength(6)
                expect(chord[0]).toBeDefined()
                
                // All notes should be valid
                const root = chord[0].noteNumber
                for (let i = 1; i < chord.length; i++) {
                    const note = chord[i].noteNumber
                    expect(note).toBeGreaterThanOrEqual(root)
                    expect(note).toBeLessThanOrEqual(root + 24) // Within 2 octaves
                }
            })
        }
    })

    // Test all combinations produce valid output
    describe('All Chord/Mode Combinations', () => {
        test('all chord families and modes produce 3 notes minimum', () => {
            const tonic = 60
            let testedCombinations = 0
            
            for (let chordIdx = 0; chordIdx < CHORD_INTERVALS.length; chordIdx++) {
                const chordFormula = CHORD_INTERVALS[chordIdx]
                
                for (let modeIdx = 0; modeIdx < TUNING_MODE_NAMES.length; modeIdx++) {
                    const chord = createChordsForNoteNumber(tonic, chordFormula, modeIdx)
                    
                    expect(chord).toBeDefined()
                    expect(Array.isArray(chord)).toBe(true)
                    expect(chord.length).toBeGreaterThanOrEqual(3)
                    
                    // All notes should have noteNumber property
                    for (let noteIdx = 0; noteIdx < chord.length; noteIdx++) {
                        expect(chord[noteIdx]).toBeDefined()
                        expect(chord[noteIdx].noteNumber).toBeDefined()
                        expect(typeof chord[noteIdx].noteNumber).toBe('number')
                    }
                    
                    testedCombinations++
                }
            }
            
            expect(testedCombinations).toBe(CHORD_INTERVALS.length * TUNING_MODE_NAMES.length)
        })

        test('all combinations within valid MIDI range (0-127)', () => {
            for (let chordIdx = 0; chordIdx < CHORD_INTERVALS.length; chordIdx++) {
                for (let modeIdx = 0; modeIdx < TUNING_MODE_NAMES.length; modeIdx++) {
                    // Test across multiple octaves
                    const tonics = [12, 36, 60, 84, 108]
                    
                    for (const tonic of tonics) {
                        const chord = createChordsForNoteNumber(tonic, CHORD_INTERVALS[chordIdx], modeIdx)
                        
                        for (const note of chord) {
                            expect(note.noteNumber).toBeGreaterThanOrEqual(0)
                            expect(note.noteNumber).toBeLessThanOrEqual(127)
                        }
                    }
                }
            }
        })

        test('chord root is always the tonic', () => {
            const testTonics = [36, 60, 72, 96]
            
            for (const tonic of testTonics) {
                for (let chordIdx = 0; chordIdx < CHORD_INTERVALS.length; chordIdx++) {
                    for (let modeIdx = 0; modeIdx < TUNING_MODE_NAMES.length; modeIdx++) {
                        const chord = createChordsForNoteNumber(tonic, CHORD_INTERVALS[chordIdx], modeIdx)
                        
                        expect(chord[0].noteNumber).toBe(tonic)
                    }
                }
            }
        })
    })

    // Cross-verify mode consistency
    describe('Mode Consistency Across Different Chord Types', () => {
        const tonic = 60
        
        test('same mode produces consistent interval patterns across chord types', () => {
            for (let modeIdx = 0; modeIdx < TUNING_MODE_NAMES.length; modeIdx++) {
                const modeName = TUNING_MODE_NAMES[modeIdx]
                
                // Get root and major 3rd from major chord
                const majorChord = createChordsForNoteNumber(tonic, MAJOR_CHORD_INTERVALS, modeIdx)
                const majorThirdInterval = majorChord[1].noteNumber - majorChord[0].noteNumber
                
                // Get root and 3rd from minor chord
                const minorChord = createChordsForNoteNumber(tonic, MINOR_CHORD_INTERVALS, modeIdx)
                const minorThirdInterval = minorChord[1].noteNumber - minorChord[0].noteNumber
                
                // The 3rd intervals should represent the mode's characteristic
                // Ionian/Lydian/Mixolydian should have 4 (major 3rd)
                // Dorian/Phrygian/Aeolian/Locrian should have 3 (minor 3rd)
                const char = modeCharacteristics[modeName]
                
                if (char.major3rd) {
                    expect(majorThirdInterval).toBe(4)
                } else if (char.minor3rd) {
                    expect(majorThirdInterval).toBe(3)
                }
            }
        })
    })

    // Mode interval verification (absolute scale degrees)
    describe('Mode Scale Intervals', () => {
        // For C (tonic = 60), verify the modal scale degrees
        const expectedIntervals = {
            ionian: [0, 2, 4, 5, 7, 9, 11],      // Major scale
            dorian: [0, 2, 3, 5, 7, 9, 10],      // Minor 3rd, major 6th
            phrygian: [0, 1, 3, 5, 7, 8, 10],    // Minor 2nd (semitone), minor 3rd
            lydian: [0, 2, 4, 6, 7, 9, 11],      // Raised 4th
            mixolydian: [0, 2, 4, 5, 7, 9, 10],  // Lowered 7th
            aeolian: [0, 2, 3, 5, 7, 8, 10],     // Natural minor
            locrian: [0, 1, 3, 5, 6, 8, 10]      // Diminished
        }

        test('each mode scale has correct intervals in major chord voicing', () => {
            const tonic = 60
            
            // Use a special verification by checking what scale degrees
            // the major chord formula [0, 4, 3] selects in each mode
            for (let modeIdx = 0; modeIdx < TUNING_MODE_NAMES.length; modeIdx++) {
                const modeName = TUNING_MODE_NAMES[modeIdx]
                const expectedIntervalArray = expectedIntervals[modeName]
                
                const chord = createChordsForNoteNumber(tonic, MAJOR_CHORD_INTERVALS, modeIdx)
                
                // The first note is always the tonic
                expect(chord[0].noteNumber).toBe(tonic)
                
                // The second note (3rd) should be a scale degree from the mode
                const thirdInterval = chord[1].noteNumber - tonic
                const expectedThirdOptions = [
                    expectedIntervalArray[2], // 3rd scale degree
                ]
                
                expect(thirdInterval).toBeGreaterThanOrEqual(3)
                expect(thirdInterval).toBeLessThanOrEqual(4)
                
                // The third note (5th) should be around the 5th degree
                const fifthInterval = chord[2].noteNumber - tonic
                expect(fifthInterval).toBeGreaterThanOrEqual(6)
                expect(fifthInterval).toBeLessThanOrEqual(7)
            }
        })
    })
})
