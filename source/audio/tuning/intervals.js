/** Chromatic scale, 1–♭2–2–♭3–3–4–♭5–5–♭6–6–♭7–7: neutral, exhaustive and tonally unrestricted. Universal. Contains every pitch class in the octave. */
export const CHROMATIC_SCALE = [0,1,2,3,4,5,6,7,8,9,10,11]
/** Major scale, 1–2–3–4–5–6–7: bright, happy and resolved. Extremely common. Foundation of major-key harmony. */
export const MAJOR_SCALE = [0,2,4,5,7,9,11]
/** Natural minor scale, 1–2–♭3–4–5–♭6–♭7: dark, melancholic and introspective. Extremely common. Foundation of minor-key harmony. */
export const NATURAL_MINOR_SCALE = [0,2,3,5,7,8,10]
/** Harmonic minor scale, 1–2–♭3–4–5–♭6–7: dramatic, exotic and strongly resolving. Common. Raises the seventh to create dominant tension in minor keys. */
export const HARMONIC_MINOR_SCALE = [0,2,3,5,7,8,11]
/** Melodic minor scale, 1–2–♭3–4–5–6–7: sophisticated, wistful and fluid. Common in jazz and classical music. Brightens minor harmony with raised sixth and seventh degrees. */
export const MELODIC_MINOR_SCALE = [0,2,3,5,7,9,11]
/** Dorian scale, 1–2–♭3–4–5–6–♭7: soulful, hopeful and gently melancholic. Very common in jazz, funk and folk. A minor mode brightened by its natural sixth. */
export const DORIAN_SCALE = [0,2,3,5,7,9,10]
/** Phrygian scale, 1–♭2–♭3–4–5–♭6–♭7: dark, tense and confrontational. Common in flamenco and metal. Its flattened second creates immediate friction. */
export const PHRYGIAN_SCALE = [0,1,3,5,7,8,10]
/** Lydian scale, 1–2–3–♯4–5–6–7: bright, weightless and dreamlike. Common in film music and jazz. Its raised fourth makes major harmony feel expansive. */
export const LYDIAN_SCALE = [0,2,4,6,7,9,11]
/** Mixolydian scale, 1–2–3–4–5–6–♭7: open, confident and slightly unresolved. Very common in rock, blues and folk. Its minor seventh supplies dominant colour without losing major warmth. */
export const MIXOLYDIAN_SCALE = [0,2,4,5,7,9,10]
/** Locrian scale, 1–♭2–♭3–4–♭5–♭6–♭7: unstable, anxious and ominous. Rare. Its diminished fifth prevents a settled tonic. */
export const LOCRIAN_SCALE = [0,1,3,5,6,8,10]
/** Major pentatonic scale, 1–2–3–5–6: bright, open and approachable. Extremely common worldwide. Removes the semitone tensions of the full major scale. */
export const PENTATONIC_MAJOR_SCALE = [0,2,4,7,9]
/** Minor pentatonic scale, 1–♭3–4–5–♭7: earthy, soulful and resilient. Extremely common worldwide. Distils minor character into five flexible tones. */
export const PENTATONIC_MINOR_SCALE = [0,3,5,7,10]
/** Blues scale, 1–♭3–4–♭5–5–♭7: gritty, expressive and bittersweet. Extremely common in blues-derived music. Adds the blue-note tritone to minor pentatonic. */
export const BLUES_SCALE = [0,3,5,6,7,10]
/** Whole-tone scale, 1–2–3–♯4–♯5–♭7: floating, ambiguous and surreal. Uncommon but recognisable. Equal whole steps remove tonal gravity. */
export const WHOLE_TONE_SCALE = [0,2,4,6,8,10]
/** Diminished scale, 1–2–♭3–4–♭5–♭6–6–7: tense, dramatic and restless. Common in jazz and suspense scoring. Alternating whole and half steps create symmetrical instability. */
export const DIMINISHED_SCALE = [0,2,3,5,6,8,9,11]
/** Augmented scale, 1–♭3–3–5–♯5–7: uncanny, bright and unresolved. Uncommon. Alternating minor thirds and semitones outline two augmented triads. */
export const AUGMENTED_SCALE = [0,3,4,7,8,11]
/** Circle-of-fifths sequence, 6–3–7–♯4–♭2–♭6–♭3–♭7–4–1–5–2: expansive, roaming and harmonically directional. Fundamental as an ordering rather than a playable scale. Traverses all pitch classes by perfect fifths. */
export const FIFTHS_SCALE = [9,4,11,6,1,8,3,10,5,0,7,2]

/** Major chord steps, root +4 +3: bright, happy and resolved. The most common triad. Cumulative steps construct a major third followed by a minor third. */
export const MAJOR_CHORD_INTERVALS = [0,4,3]
/** Minor chord steps, root +3 +4: dark, melancholic and introspective. One of the most common triads. Cumulative steps construct a minor third followed by a major third. */
export const MINOR_CHORD_INTERVALS = [0,3,4]
/** Suspended-fourth chord steps, root +5 +2: unstable, open-ended and resolution-seeking. Very common. Replaces the defining third with a perfect fourth. */
export const SUSPENDED_CHORD_INTERVALS = [0,5,2]
/** Diminished chord steps, root +3 +3: tense, dramatic and unsettling. Common as a transitional chord. Stacks two minor thirds symmetrically. */
export const DIMINISHED_CHORD_INTERVALS = [0,3,3]
/** Augmented chord steps, root +4 +4: uncanny, bright and unresolved. Less common but widely recognised. Stacks two major thirds symmetrically. */
export const AUGMENTED_CHORD_INTERVALS = [0,4,4]
/** Dorian colour chord steps, root +2 +3 +5: soulful, spacious and hopeful. Uncommon as a fixed chord formula. Selects characteristic Dorian degrees through cumulative movement. */
export const DORIAN_CHORD_INTERVALS = [0,2,3,5]
/** Stacked-fifths chord steps, root +5 +5 +5 +5 +5: open, powerful and harmonically ambiguous. Common in quartal and cinematic voicing. Builds a wide structure through repeated perfect fourth/fifth motion. */
export const FIFTHS_CHORD_INTERVALS = [0,5,5,5,5,5]

/** Major triad, 1–3–5: bright, happy and resolved. The most common triad. Absolute offsets preserve its exact chromatic quality. */
export const MAJOR_VOICING_INTERVALS = [0,4,7]
/** Minor triad, 1–♭3–5: dark, melancholic and introspective. One of the most common triads. Absolute offsets preserve its exact chromatic quality. */
export const MINOR_VOICING_INTERVALS = [0,3,7]
/** Suspended-fourth triad, 1–4–5: unstable, open-ended and resolution-seeking. Very common. Omits the third so major or minor is deliberately unresolved. */
export const SUSPENDED_VOICING_INTERVALS = [0,5,7]
/** Suspended-second triad, 1–2–5: airy, open and unresolved. Very common. Replaces the third with a major second. */
export const SUSPENDED_2_VOICING_INTERVALS = [0,2,7]
/** Diminished triad, 1–♭3–♭5: tense, dramatic and unsettling. Common as a passing or leading chord. The flattened fifth destabilises the root. */
export const DIMINISHED_VOICING_INTERVALS = [0,3,6]
/** Augmented triad, 1–3–♯5: bright, uncanny and unresolved. Less common but widely recognised. The raised fifth makes the chord symmetrical and directionally ambiguous. */
export const AUGMENTED_VOICING_INTERVALS = [0,4,8]
/** Major sixth, 1–3–5–6: warm, bright and nostalgic. Common in pop, jazz and soul. Adds a gentle sixth without dominant tension. */
export const MAJOR_6_VOICING_INTERVALS = [0,4,7,9]
/** Minor sixth, 1–♭3–5–6: tender, bittersweet and mysterious. Moderately common. Balances minor darkness with a warm major sixth. */
export const MINOR_6_VOICING_INTERVALS = [0,3,7,9]
/** Major seventh, 1–3–5–7: jazzy, refined and slightly mysterious. Extremely common in jazz and soul. Adds sophistication without minor darkness. */
export const MAJOR_7_VOICING_INTERVALS = [0,4,7,11]
/** Minor seventh, 1–♭3–5–♭7: soulful, soft and emotionally deep. Extremely common. Softens the melancholic nature of the minor triad. */
export const MINOR_7_VOICING_INTERVALS = [0,3,7,10]
/** Dominant seventh, 1–3–5–♭7: tense, confident and strongly resolution-seeking. Fundamental in tonal music. Pulls powerfully toward the tonic chord. */
export const DOMINANT_7_VOICING_INTERVALS = [0,4,7,10]
/** Minor-major seventh, 1–♭3–5–7: haunting, intense and sharply contrasting. Uncommon but distinctive. Combines minor darkness with major-seventh brightness. */
export const MINOR_MAJOR_7_VOICING_INTERVALS = [0,3,7,11]
/** Diminished seventh, 1–♭3–♭5–𝄫7: anxious, compressed and unresolved. Common in jazz and dramatic scoring. Symmetrical minor thirds make it highly mobile. */
export const DIMINISHED_7_VOICING_INTERVALS = [0,3,6,9]
/** Half-diminished seventh, 1–♭3–♭5–♭7: shadowy, unstable and searching. Common in jazz and minor-key harmony. A minor seventh softens the fully diminished chord. */
export const HALF_DIMINISHED_VOICING_INTERVALS = [0,3,6,10]
/** Dominant seventh suspended fourth, 1–4–5–♭7: highly dissonant, unresolved and demanding. Common in funk, jazz and pop. Suspension and dominant tension combine before release. */
export const SUSPENDED_7_VOICING_INTERVALS = [0,5,7,10]
/** Major ninth, 1–3–5–7–9: spacious, polished and luminous. Common in jazz and neo-soul. Extends major-seventh mystery into a wider register. */
export const MAJOR_9_VOICING_INTERVALS = [0,4,7,11,14]
/** Minor ninth, 1–♭3–5–♭7–9: lush, soulful and introspective. Common in jazz and neo-soul. Adds an airy ninth to minor-seventh depth. */
export const MINOR_9_VOICING_INTERVALS = [0,3,7,10,14]
/** Dominant ninth, 1–3–5–♭7–9: colourful, urgent and resolution-seeking. Common in funk, blues and jazz. Widens dominant tension with a consonant ninth. */
export const DOMINANT_9_VOICING_INTERVALS = [0,4,7,10,14]
/** Major six-nine, 1–3–5–6–9: open, warm and optimistic. Common in jazz and sophisticated pop. Combines sixth-chord ease with ninth-chord sparkle. */
export const SIXTH_9_VOICING_INTERVALS = [0,4,7,9,14]
/** Minor six-nine, 1–♭3–5–6–9: tender, bittersweet and airy. Uncommon but expressive. Joins minor warmth with an open ninth. */
export const MINOR_6TH_9_VOICING_INTERVALS = [0,3,7,9,14]
/** Radiant major eleventh, 1–3–5–7–9–♯11: expansive, sparkling and intensely joyful. Uncommon but recognisable in jazz and cinematic harmony. Opens a major-ninth sonority through the Lydian upper extension. */
export const RADIANT_MAJOR_11_VOICING_INTERVALS = [0,4,7,11,14,18]
/** Ecstatic major thirteenth, 1–3–5–7–9–♯11–13: exuberant, brilliant and maximally open. Uncommon outside jazz and lush arrangement. Spans the widest smiling expression with every bright upper extension. */
export const ECSTATIC_MAJOR_13_VOICING_INTERVALS = [0,4,7,11,14,18,21]
/** Weeping minor eleventh, 1–♭3–5–♭7–9–11: deeply sad, spacious and vulnerable. Common in modern jazz and neo-soul. Extends minor-ninth grief into a broad upper register. */
export const WEEPING_MINOR_11_VOICING_INTERVALS = [0,3,7,10,14,17]
/** Desolate minor-major thirteenth, 1–♭3–5–7–9–11–13: anguished, haunting and emotionally extreme. Rare but dramatically distinctive. Combines minor darkness, major-seventh friction and the widest mournful extensions. */
export const DESOLATE_MINOR_MAJOR_13_VOICING_INTERVALS = [0,3,7,11,14,17,21]

/** Named semitone shifts, −8ve–♭2–2–♭3–3–4–♭5–5–♭6–6–♭7–7–8ve: neutral building blocks whose feeling depends on context. Universal. Provides canonical distances for transposition and interval arithmetic. */
export const INTERVAL_SHIFTS = Object.freeze({ downOctave:-12, minorSecond:1, majorSecond:2, minorThird:3, majorThird:4, perfectFourth:5, diminishedFifth:6, perfectFifth:7, minorSixth:8, majorSixth:9, minorSeventh:10, majorSeventh:11, perfectOctave:12, upOctave:12 })

export const SCALE_INTERVAL_LIBRARY = Object.freeze({ CHROMATIC_SCALE, MAJOR_SCALE, NATURAL_MINOR_SCALE, HARMONIC_MINOR_SCALE, MELODIC_MINOR_SCALE, DORIAN_SCALE, PHRYGIAN_SCALE, LYDIAN_SCALE, MIXOLYDIAN_SCALE, LOCRIAN_SCALE, PENTATONIC_MAJOR_SCALE, PENTATONIC_MINOR_SCALE, BLUES_SCALE, WHOLE_TONE_SCALE, DIMINISHED_SCALE, AUGMENTED_SCALE, FIFTHS_SCALE, FIFTHS:FIFTHS_SCALE })

export const CHORD_VOICING_INTERVAL_LIBRARY = Object.freeze({ major:MAJOR_VOICING_INTERVALS, minor:MINOR_VOICING_INTERVALS, suspended:SUSPENDED_VOICING_INTERVALS, suspended2:SUSPENDED_2_VOICING_INTERVALS, diminished:DIMINISHED_VOICING_INTERVALS, augmented:AUGMENTED_VOICING_INTERVALS, major6:MAJOR_6_VOICING_INTERVALS, minor6:MINOR_6_VOICING_INTERVALS, major7:MAJOR_7_VOICING_INTERVALS, minor7:MINOR_7_VOICING_INTERVALS, dominant7:DOMINANT_7_VOICING_INTERVALS, minorMajor7:MINOR_MAJOR_7_VOICING_INTERVALS, diminished7:DIMINISHED_7_VOICING_INTERVALS, halfDiminished:HALF_DIMINISHED_VOICING_INTERVALS, suspended7:SUSPENDED_7_VOICING_INTERVALS, major9:MAJOR_9_VOICING_INTERVALS, minor9:MINOR_9_VOICING_INTERVALS, dominant9:DOMINANT_9_VOICING_INTERVALS, sixth9:SIXTH_9_VOICING_INTERVALS, minor6th9:MINOR_6TH_9_VOICING_INTERVALS, radiantMajor11:RADIANT_MAJOR_11_VOICING_INTERVALS, ecstaticMajor13:ECSTATIC_MAJOR_13_VOICING_INTERVALS, weepingMinor11:WEEPING_MINOR_11_VOICING_INTERVALS, desolateMinorMajor13:DESOLATE_MINOR_MAJOR_13_VOICING_INTERVALS })

/** Diatonic triad degrees, 1–3–5: neutral until interpreted by a scale. Universal. Used only by the generic scale-degree chord helper, not by emotional profiles. */
export const DIATONIC_TRIAD_INTERVALS = [0,2,4]

/** Chromatic rest, 1: still and neutral. Universal. Holds only the root pitch. */
export const CHROMATIC_REST_INTERVALS = [0]
/** Chromatic open fifth, 1–5: hollow and grounded. Universal. Removes major-minor identity. */
export const CHROMATIC_UNISON_FIFTH_INTERVALS = [0,7]
/** Chromatic major triad, 1–3–5: bright, happy and resolved. The most common triad. Reuses the canonical major voicing. */
export const CHROMATIC_MAJOR_TRIAD_INTERVALS = MAJOR_VOICING_INTERVALS
/** Chromatic minor triad, 1–♭3–5: dark, melancholic and introspective. One of the most common triads. Reuses the canonical minor voicing. */
export const CHROMATIC_MINOR_TRIAD_INTERVALS = MINOR_VOICING_INTERVALS
/** Chromatic diminished triad, 1–♭3–♭5: tense, dramatic and unsettling. Common as a passing chord. Reuses the canonical diminished voicing. */
export const CHROMATIC_DIMINISHED_TRIAD_INTERVALS = DIMINISHED_VOICING_INTERVALS
/** Chromatic suspended second, 1–2–5: airy and unresolved. Very common. Reuses the canonical suspended-second voicing. */
export const CHROMATIC_SUS2_INTERVALS = SUSPENDED_2_VOICING_INTERVALS
/** Chromatic suspended fourth, 1–4–5: open and resolution-seeking. Very common. Reuses the canonical suspended-fourth voicing. */
export const CHROMATIC_SUS4_INTERVALS = SUSPENDED_VOICING_INTERVALS
/** Chromatic major sixth, 1–3–5–6: warm and nostalgic. Common. Reuses the canonical major-sixth voicing. */
export const CHROMATIC_MAJOR_SIXTH_INTERVALS = MAJOR_6_VOICING_INTERVALS
/** Chromatic major seventh, 1–3–5–7: refined and slightly mysterious. Extremely common. Reuses the canonical major-seventh voicing. */
export const CHROMATIC_MAJOR_SEVENTH_INTERVALS = MAJOR_7_VOICING_INTERVALS
/** Chromatic minor seventh, 1–♭3–5–♭7: soulful and emotionally deep. Extremely common. Reuses the canonical minor-seventh voicing. */
export const CHROMATIC_MINOR_SEVENTH_INTERVALS = MINOR_7_VOICING_INTERVALS
/** Chromatic ninth, 1–3–5–♭7–9: colourful and resolution-seeking. Common in funk and jazz. Reuses the canonical dominant-ninth voicing. */
export const CHROMATIC_NINTH_INTERVALS = DOMINANT_9_VOICING_INTERVALS
/** Chromatic Lydian glow, 1–3–♯4–5: luminous and expectant. Uncommon. Places the tritone inside a stable major frame. */
export const CHROMATIC_LYDIAN_GLOW_INTERVALS = [0,4,6,7]
/** Chromatic Phrygian colour, 1–♭2–♭3–5: dark and confrontational. Moderately common. Combines the characteristic minor second with a minor triad. */
export const CHROMATIC_PHRYGIAN_INTERVALS = [0,1,3,7]
/** Chromatic question, 1–♭2–4: uncertain and tense. Uncommon. Avoids triadic stability while preserving an open fourth. */
export const CHROMATIC_QUESTION_INTERVALS = [0,1,5]
/** Chromatic cluster, 1–♭2–2: compressed and nervous. Common in contemporary scoring. Places adjacent semitones around the root. */
export const CHROMATIC_CLUSTER_INTERVALS = [0,1,2]
/** Chromatic wide cluster, 1–♭2–5–♭7: anxious and spacious. Uncommon. Spreads semitone friction across stable upper tones. */
export const CHROMATIC_WIDE_CLUSTER_INTERVALS = [0,1,7,10]
/** Chromatic tritone tension, 1–♭5–5: suspicious and unstable. Common in dramatic harmony. Places the tritone directly beside the perfect fifth. */
export const CHROMATIC_TRITONE_TENSION_INTERVALS = [0,6,7]
/** Chromatic alarm, 1–♭2–♭5–♭9: urgent and highly dissonant. Uncommon. Repeats minor-second tension across an octave. */
export const CHROMATIC_ALARM_INTERVALS = [0,1,6,13]
/** Chromatic whole-tone colour, 1–2–3–♯4: floating and surreal. Uncommon. Uses consecutive whole-tone degrees. */
export const CHROMATIC_WHOLE_TONE_COLOUR_INTERVALS = [0,2,4,6]
/** Chromatic augmented colour, 1–3–♯5: bright and unsettled. Less common but distinctive. Reuses the canonical augmented voicing. */
export const CHROMATIC_AUGMENTED_INTERVALS = AUGMENTED_VOICING_INTERVALS
/** Chromatic dream chord, 1–3–♭7: soft and ambiguous. Uncommon. Omits the fifth to create spacious major-minor contrast. */
export const CHROMATIC_DREAM_INTERVALS = [0,4,10]
/** Chromatic sleep chord, 1–5–8: calm and hollow. Common as an open voicing. Frames the root with a fifth and octave. */
export const CHROMATIC_SLEEP_INTERVALS = [0,7,12]
/** Chromatic hollow chord, 1–5: empty and neutral. Universal. Reuses the open-fifth interval. */
export const CHROMATIC_HOLLOW_INTERVALS = CHROMATIC_UNISON_FIFTH_INTERVALS
/** Chromatic low hollow chord, 1–4: subdued and unresolved. Common. Uses an open perfect fourth. */
export const CHROMATIC_LOW_HOLLOW_INTERVALS = [0,5]
/** Chromatic blues colour, 1–♭3–♭5–5: gritty and expressive. Very common in blues-derived music. Adds the blue-note tritone to a minor frame. */
export const CHROMATIC_BLUES_INTERVALS = [0,3,6,7]
/** Chromatic comic chord, 1–2–5–6: buoyant and awkward. Uncommon. Mixes open fifth stability with bright neighbouring tones. */
export const CHROMATIC_COMIC_INTERVALS = [0,2,7,9]
/** Chromatic alien chord, 1–♭2–4–♭7: strange and unsettled. Uncommon. Avoids conventional triadic spacing. */
export const CHROMATIC_ALIEN_INTERVALS = [0,1,5,10]
/** Chromatic cool-heart chord, 1–4–5–♭7: tender and distant. Uncommon. Combines suspended openness with a minor seventh. */
export const CHROMATIC_COOL_HEART_INTERVALS = [0,5,7,10]
/** Chromatic dark-heart chord, 1–♭2–4–5: sombre and unresolved. Uncommon. Surrounds an open fifth with minor-second tension. */
export const CHROMATIC_DARK_HEART_INTERVALS = [0,1,5,7]
