import { CHORD_EMOTIONAL_PROFILES, EMOJI_INTERVAL_CHOICES, getChordFromIntervalsInKey, getChordQualityForEmoji, getEmotionalProfileChoicesForEmoji, getMusicalDetailsFromEmoji, getVoiceCountForEmoji } from '../../source/models/emoji-to-music.js';
import * as EMOJIS from '../../source/models/emoji.js';

describe('getMusicalDetailsFromEmoji', () => {
    const tonic = 60; // A fixed tonic for testing

    it('should return slightly different musical details for each emoji', () => {
        const results = new Set();

        Object.values(EMOJIS).forEach(emoji => {
            const details = getMusicalDetailsFromEmoji(tonic, emoji)
			const noteNumbers = details.map(note => note.noteNumber)
            // console.log(`Emoji: ${emoji}, Chords: ${JSON.stringify(details)}`);
            console.log(`Emoji: ${emoji}, Chords: ${JSON.stringify(noteNumbers)}`)
            // console.log(`Emoji: ${emoji}, Chords: ${JSON.stringify(details)}`);
            // console.log(`Emoji: ${emoji}, Chords: ${JSON.stringify(details.chords)}`);
            // console.log(`Emoji: ${emoji}, Octave: ${details.octave}`);
            // console.log(`Emoji: ${emoji}, Velocity: ${details.velocity}`);
            results.add(JSON.stringify(details))
        })

        // Expect that there is more than one unique result
        expect(results.size).toBeGreaterThan(1)
    })

    it('requests diminished chords for tense and angry emotional states', () => {
        expect(getChordQualityForEmoji(EMOJIS.EMOJI_ANGRY)).toBe('diminished')
        expect(getChordQualityForEmoji(EMOJIS.EMOJI_RAGE)).toBe('diminished7')
        expect(getChordQualityForEmoji(EMOJIS.EMOJI_CAT_POUTING)).toBe('diminished7')
        expect(getMusicalDetailsFromEmoji(tonic, EMOJIS.EMOJI_ANGRY).map(note => note.noteNumber))
            .toEqual([60, 63, 66])
    })

    it('requests suspended chord qualities for open and unresolved states', () => {
        expect(getChordQualityForEmoji(EMOJIS.EMOJI_EYES_ROLLING_UP)).toBe('suspended7')
        expect(getChordQualityForEmoji(EMOJIS.EMOJI_HAND_OVER_MOUTH)).toBe('suspended2')
        expect(getMusicalDetailsFromEmoji(tonic, EMOJIS.EMOJI_EYES_ROLLING_UP).map(note => note.noteNumber))
            .toEqual([60, 65, 67, 70])
        expect(getMusicalDetailsFromEmoji(tonic, EMOJIS.EMOJI_HAND_OVER_MOUTH).map(note => note.noteNumber))
            .toEqual([60, 62, 67])
    })

    it('uses extended chord colours for nuanced emotional states', () => {
        expect(getChordQualityForEmoji(EMOJIS.EMOJI_SMILING_SLIGHTLY)).toBe('major')
        expect(getChordQualityForEmoji(EMOJIS.EMOJI_WORRIED)).toBe('minor')
        expect(getChordQualityForEmoji(EMOJIS.EMOJI_WAIL)).toBe('desolateMinorMajor13')
        expect(getChordQualityForEmoji(EMOJIS.EMOJI_ANXIOUS)).toBe('diminished7')
        expect(getMusicalDetailsFromEmoji(tonic, EMOJIS.EMOJI_WAIL).map(note => note.noteNumber))
            .toEqual([60, 63, 67, 71, 74])
    })

    it('keeps maintainable emotional alternatives without making a common smile denser', () => {
        const smilingProfiles = EMOJI_INTERVAL_CHOICES.get(EMOJIS.EMOJI_SMILING_SLIGHTLY)
        expect(smilingProfiles).toBe(getEmotionalProfileChoicesForEmoji(EMOJIS.EMOJI_SMILING_SLIGHTLY))
        expect(smilingProfiles).toEqual([
            CHORD_EMOTIONAL_PROFILES.brightResolved,
            CHORD_EMOTIONAL_PROFILES.warmNostalgic,
            CHORD_EMOTIONAL_PROFILES.refinedMysterious
        ])

        const previousMajor7 = [60, 64, 67, 71]
        expect(getChordQualityForEmoji(EMOJIS.EMOJI_SMILING_SLIGHTLY, tonic, previousMajor7)).toBe('major')
        expect(getMusicalDetailsFromEmoji(tonic, EMOJIS.EMOJI_SMILING_SLIGHTLY, true, { previousChord:previousMajor7 }).map(note => note.noteNumber))
            .toEqual([60, 64, 67])
    })

    it('gives each core smile and sad face a unique primary expression with ordered fallbacks', () => {
        const smiles = [
            EMOJIS.EMOJI_SMILING_SLIGHTLY,
            EMOJIS.EMOJI_SMILING_EYES_CLOSED,
            EMOJIS.EMOJI_SMILING_GRIN,
            EMOJIS.EMOJI_SMILING_GRIN_EYES_CLOSED,
            EMOJIS.EMOJI_SMILING_BIG_GRIN,
            EMOJIS.EMOJI_SMILING_GRIN_SQUINT,
            EMOJIS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED
        ]
        const sadness = [
            EMOJIS.EMOJI_WORRIED,
            EMOJIS.EMOJI_FROWNING,
            EMOJIS.EMOJI_FROWN_EYES_CLOSED,
            EMOJIS.EMOJI_HOLDING_TEARS,
            EMOJIS.EMOJI_CRYING,
            EMOJIS.EMOJI_WAIL
        ]
        const primaryFormula = emoji => getEmotionalProfileChoicesForEmoji(emoji)[0].intervals.join(',')
        const width = emoji => getEmotionalProfileChoicesForEmoji(emoji)[0].intervals.at(-1)

        expect(new Set(smiles.map(primaryFormula)).size).toBe(smiles.length)
        expect(new Set(sadness.map(primaryFormula)).size).toBe(sadness.length)
        expect(smiles.every(emoji => getEmotionalProfileChoicesForEmoji(emoji).length > 1)).toBe(true)
        expect(sadness.every(emoji => getEmotionalProfileChoicesForEmoji(emoji).length > 1)).toBe(true)
        expect(width(EMOJIS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED)).toBeGreaterThan(Math.max(...smiles.slice(0, -1).map(width)))
        expect(width(EMOJIS.EMOJI_WAIL)).toBeGreaterThan(Math.max(...sadness.slice(0, -1).map(width)))
    })

    it('separates expression-level voice counts from ordered interval candidate pools', () => {
        expect(getVoiceCountForEmoji(EMOJIS.EMOJI_SMILING_SLIGHTLY)).toBe(3)
        expect(getVoiceCountForEmoji(EMOJIS.EMOJI_FROWNING)).toBe(3)
        expect(getVoiceCountForEmoji(EMOJIS.EMOJI_CRYING)).toBe(4)
        expect(getVoiceCountForEmoji(EMOJIS.EMOJI_WAIL)).toBe(5)
        expect(CHORD_EMOTIONAL_PROFILES.ecstaticOpen.intervals).toHaveLength(7)
        expect(CHORD_EMOTIONAL_PROFILES.ecstaticOpen.candidateIntervals)
            .toBe(CHORD_EMOTIONAL_PROFILES.ecstaticOpen.intervals)

        Object.values(CHORD_EMOTIONAL_PROFILES).forEach(profile => {
            expect(profile.voiceCount).toBeUndefined()
            expect(profile.candidateIntervals.length).toBeGreaterThan(0)
        })
    })

    it('plays each emotion at its expression-level voice count instead of the candidate-pool length', () => {
        EMOJI_INTERVAL_CHOICES.forEach((_, emoji) => {
            const chord = getMusicalDetailsFromEmoji(tonic, emoji)
            expect(chord).toHaveLength(getVoiceCountForEmoji(emoji))
        })
    })

    it('keeps common smiles and frowns as simple triads', () => {
        const commonExpressions = [
            EMOJIS.EMOJI_SMILING_SLIGHTLY,
            EMOJIS.EMOJI_SMILING_EYES_CLOSED,
            EMOJIS.EMOJI_SMILING_GRIN,
            EMOJIS.EMOJI_WORRIED,
            EMOJIS.EMOJI_FROWNING,
            EMOJIS.EMOJI_FROWN_EYES_CLOSED
        ]

        commonExpressions.forEach(emoji => {
            expect(getMusicalDetailsFromEmoji(tonic, emoji)).toHaveLength(3)
        })
    })

    it('uses later candidates to build an in-key chord and stops at the requested voice count', () => {
        const candidateIntervals = CHORD_EMOTIONAL_PROFILES.ecstaticOpen.intervals
        const triad = getChordFromIntervalsInKey(60, 'F', 'MAJOR_SCALE', candidateIntervals)
        const fiveVoiceChord = getChordFromIntervalsInKey(60, 'F', 'MAJOR_SCALE', candidateIntervals, 5)

        expect(triad.map(note => note.noteNumber)).toEqual([60, 64, 67])
        expect(fiveVoiceChord.map(note => note.noteNumber)).toEqual([60, 64, 67, 74, 81])
    })

    it('completes a triad diatonically when its candidate pool is exhausted', () => {
        const chord = getChordFromIntervalsInKey(62, 'C', 'MAJOR_SCALE', [0, 4, 7])
        expect(chord.map(note => note.noteNumber)).toEqual([62, 65, 69])
    })

    it('caps the photographed ecstatic C-major chord at five sounding voices', () => {
        const chord = getMusicalDetailsFromEmoji(84, EMOJIS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED, true, {
            harmonyMode:'global-key',
            tonic:'C',
            keyScale:'MAJOR_SCALE'
        })

        expect(chord.map(note => note.noteNumber)).toEqual([84, 88, 91, 95, 98])
    })
})
