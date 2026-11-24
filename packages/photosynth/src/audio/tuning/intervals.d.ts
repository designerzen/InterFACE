/** Chromatic scale, 1–♭2–2–♭3–3–4–♭5–5–♭6–6–♭7–7: neutral, exhaustive and tonally unrestricted. Universal. Contains every pitch class in the octave. */
export declare const CHROMATIC_SCALE: number[];
/** Major scale, 1–2–3–4–5–6–7: bright, happy and resolved. Extremely common. Foundation of major-key harmony. */
export declare const MAJOR_SCALE: number[];
/** Natural minor scale, 1–2–♭3–4–5–♭6–♭7: dark, melancholic and introspective. Extremely common. Foundation of minor-key harmony. */
export declare const NATURAL_MINOR_SCALE: number[];
/** Harmonic minor scale, 1–2–♭3–4–5–♭6–7: dramatic, exotic and strongly resolving. Common. Raises the seventh to create dominant tension in minor keys. */
export declare const HARMONIC_MINOR_SCALE: number[];
/** Melodic minor scale, 1–2–♭3–4–5–6–7: sophisticated, wistful and fluid. Common in jazz and classical music. Brightens minor harmony with raised sixth and seventh degrees. */
export declare const MELODIC_MINOR_SCALE: number[];
/** Dorian scale, 1–2–♭3–4–5–6–♭7: soulful, hopeful and gently melancholic. Very common in jazz, funk and folk. A minor mode brightened by its natural sixth. */
export declare const DORIAN_SCALE: number[];
/** Phrygian scale, 1–♭2–♭3–4–5–♭6–♭7: dark, tense and confrontational. Common in flamenco and metal. Its flattened second creates immediate friction. */
export declare const PHRYGIAN_SCALE: number[];
/** Lydian scale, 1–2–3–♯4–5–6–7: bright, weightless and dreamlike. Common in film music and jazz. Its raised fourth makes major harmony feel expansive. */
export declare const LYDIAN_SCALE: number[];
/** Mixolydian scale, 1–2–3–4–5–6–♭7: open, confident and slightly unresolved. Very common in rock, blues and folk. Its minor seventh supplies dominant colour without losing major warmth. */
export declare const MIXOLYDIAN_SCALE: number[];
/** Locrian scale, 1–♭2–♭3–4–♭5–♭6–♭7: unstable, anxious and ominous. Rare. Its diminished fifth prevents a settled tonic. */
export declare const LOCRIAN_SCALE: number[];
/** Major pentatonic scale, 1–2–3–5–6: bright, open and approachable. Extremely common worldwide. Removes the semitone tensions of the full major scale. */
export declare const PENTATONIC_MAJOR_SCALE: number[];
/** Minor pentatonic scale, 1–♭3–4–5–♭7: earthy, soulful and resilient. Extremely common worldwide. Distils minor character into five flexible tones. */
export declare const PENTATONIC_MINOR_SCALE: number[];
/** Blues scale, 1–♭3–4–♭5–5–♭7: gritty, expressive and bittersweet. Extremely common in blues-derived music. Adds the blue-note tritone to minor pentatonic. */
export declare const BLUES_SCALE: number[];
/** Whole-tone scale, 1–2–3–♯4–♯5–♭7: floating, ambiguous and surreal. Uncommon but recognisable. Equal whole steps remove tonal gravity. */
export declare const WHOLE_TONE_SCALE: number[];
/** Diminished scale, 1–2–♭3–4–♭5–♭6–6–7: tense, dramatic and restless. Common in jazz and suspense scoring. Alternating whole and half steps create symmetrical instability. */
export declare const DIMINISHED_SCALE: number[];
/** Augmented scale, 1–♭3–3–5–♯5–7: uncanny, bright and unresolved. Uncommon. Alternating minor thirds and semitones outline two augmented triads. */
export declare const AUGMENTED_SCALE: number[];
/** Circle-of-fifths sequence, 6–3–7–♯4–♭2–♭6–♭3–♭7–4–1–5–2: expansive, roaming and harmonically directional. Fundamental as an ordering rather than a playable scale. Traverses all pitch classes by perfect fifths. */
export declare const FIFTHS_SCALE: number[];
/** Major chord steps, root +4 +3: bright, happy and resolved. The most common triad. Cumulative steps construct a major third followed by a minor third. */
export declare const MAJOR_CHORD_INTERVALS: number[];
/** Minor chord steps, root +3 +4: dark, melancholic and introspective. One of the most common triads. Cumulative steps construct a minor third followed by a major third. */
export declare const MINOR_CHORD_INTERVALS: number[];
/** Suspended-fourth chord steps, root +5 +2: unstable, open-ended and resolution-seeking. Very common. Replaces the defining third with a perfect fourth. */
export declare const SUSPENDED_CHORD_INTERVALS: number[];
/** Diminished chord steps, root +3 +3: tense, dramatic and unsettling. Common as a transitional chord. Stacks two minor thirds symmetrically. */
export declare const DIMINISHED_CHORD_INTERVALS: number[];
/** Augmented chord steps, root +4 +4: uncanny, bright and unresolved. Less common but widely recognised. Stacks two major thirds symmetrically. */
export declare const AUGMENTED_CHORD_INTERVALS: number[];
/** Dorian colour chord steps, root +2 +3 +5: soulful, spacious and hopeful. Uncommon as a fixed chord formula. Selects characteristic Dorian degrees through cumulative movement. */
export declare const DORIAN_CHORD_INTERVALS: number[];
/** Stacked-fifths chord steps, root +5 +5 +5 +5 +5: open, powerful and harmonically ambiguous. Common in quartal and cinematic voicing. Builds a wide structure through repeated perfect fourth/fifth motion. */
export declare const FIFTHS_CHORD_INTERVALS: number[];
/** Major triad, 1–3–5: bright, happy and resolved. The most common triad. Absolute offsets preserve its exact chromatic quality. */
export declare const MAJOR_VOICING_INTERVALS: number[];
/** Minor triad, 1–♭3–5: dark, melancholic and introspective. One of the most common triads. Absolute offsets preserve its exact chromatic quality. */
export declare const MINOR_VOICING_INTERVALS: number[];
/** Suspended-fourth triad, 1–4–5: unstable, open-ended and resolution-seeking. Very common. Omits the third so major or minor is deliberately unresolved. */
export declare const SUSPENDED_VOICING_INTERVALS: number[];
/** Suspended-second triad, 1–2–5: airy, open and unresolved. Very common. Replaces the third with a major second. */
export declare const SUSPENDED_2_VOICING_INTERVALS: number[];
/** Diminished triad, 1–♭3–♭5: tense, dramatic and unsettling. Common as a passing or leading chord. The flattened fifth destabilises the root. */
export declare const DIMINISHED_VOICING_INTERVALS: number[];
/** Augmented triad, 1–3–♯5: bright, uncanny and unresolved. Less common but widely recognised. The raised fifth makes the chord symmetrical and directionally ambiguous. */
export declare const AUGMENTED_VOICING_INTERVALS: number[];
/** Major sixth, 1–3–5–6: warm, bright and nostalgic. Common in pop, jazz and soul. Adds a gentle sixth without dominant tension. */
export declare const MAJOR_6_VOICING_INTERVALS: number[];
/** Minor sixth, 1–♭3–5–6: tender, bittersweet and mysterious. Moderately common. Balances minor darkness with a warm major sixth. */
export declare const MINOR_6_VOICING_INTERVALS: number[];
/** Major seventh, 1–3–5–7: jazzy, refined and slightly mysterious. Extremely common in jazz and soul. Adds sophistication without minor darkness. */
export declare const MAJOR_7_VOICING_INTERVALS: number[];
/** Minor seventh, 1–♭3–5–♭7: soulful, soft and emotionally deep. Extremely common. Softens the melancholic nature of the minor triad. */
export declare const MINOR_7_VOICING_INTERVALS: number[];
/** Dominant seventh, 1–3–5–♭7: tense, confident and strongly resolution-seeking. Fundamental in tonal music. Pulls powerfully toward the tonic chord. */
export declare const DOMINANT_7_VOICING_INTERVALS: number[];
/** Minor-major seventh, 1–♭3–5–7: haunting, intense and sharply contrasting. Uncommon but distinctive. Combines minor darkness with major-seventh brightness. */
export declare const MINOR_MAJOR_7_VOICING_INTERVALS: number[];
/** Diminished seventh, 1–♭3–♭5–𝄫7: anxious, compressed and unresolved. Common in jazz and dramatic scoring. Symmetrical minor thirds make it highly mobile. */
export declare const DIMINISHED_7_VOICING_INTERVALS: number[];
/** Half-diminished seventh, 1–♭3–♭5–♭7: shadowy, unstable and searching. Common in jazz and minor-key harmony. A minor seventh softens the fully diminished chord. */
export declare const HALF_DIMINISHED_VOICING_INTERVALS: number[];
/** Dominant seventh suspended fourth, 1–4–5–♭7: highly dissonant, unresolved and demanding. Common in funk, jazz and pop. Suspension and dominant tension combine before release. */
export declare const SUSPENDED_7_VOICING_INTERVALS: number[];
/** Major ninth, 1–3–5–7–9: spacious, polished and luminous. Common in jazz and neo-soul. Extends major-seventh mystery into a wider register. */
export declare const MAJOR_9_VOICING_INTERVALS: number[];
/** Minor ninth, 1–♭3–5–♭7–9: lush, soulful and introspective. Common in jazz and neo-soul. Adds an airy ninth to minor-seventh depth. */
export declare const MINOR_9_VOICING_INTERVALS: number[];
/** Dominant ninth, 1–3–5–♭7–9: colourful, urgent and resolution-seeking. Common in funk, blues and jazz. Widens dominant tension with a consonant ninth. */
export declare const DOMINANT_9_VOICING_INTERVALS: number[];
/** Major six-nine, 1–3–5–6–9: open, warm and optimistic. Common in jazz and sophisticated pop. Combines sixth-chord ease with ninth-chord sparkle. */
export declare const SIXTH_9_VOICING_INTERVALS: number[];
/** Minor six-nine, 1–♭3–5–6–9: tender, bittersweet and airy. Uncommon but expressive. Joins minor warmth with an open ninth. */
export declare const MINOR_6TH_9_VOICING_INTERVALS: number[];
/** Radiant major eleventh, 1–3–5–7–9–♯11: expansive, sparkling and intensely joyful. Uncommon but recognisable in jazz and cinematic harmony. Opens a major-ninth sonority through the Lydian upper extension. */
export declare const RADIANT_MAJOR_11_VOICING_INTERVALS: number[];
/** Ecstatic major thirteenth, 1–3–5–7–9–♯11–13: exuberant, brilliant and maximally open. Uncommon outside jazz and lush arrangement. Spans the widest smiling expression with every bright upper extension. */
export declare const ECSTATIC_MAJOR_13_VOICING_INTERVALS: number[];
/** Weeping minor eleventh, 1–♭3–5–♭7–9–11: deeply sad, spacious and vulnerable. Common in modern jazz and neo-soul. Extends minor-ninth grief into a broad upper register. */
export declare const WEEPING_MINOR_11_VOICING_INTERVALS: number[];
/** Desolate minor-major thirteenth, 1–♭3–5–7–9–11–13: anguished, haunting and emotionally extreme. Rare but dramatically distinctive. Combines minor darkness, major-seventh friction and the widest mournful extensions. */
export declare const DESOLATE_MINOR_MAJOR_13_VOICING_INTERVALS: number[];
/** Named semitone shifts, −8ve–♭2–2–♭3–3–4–♭5–5–♭6–6–♭7–7–8ve: neutral building blocks whose feeling depends on context. Universal. Provides canonical distances for transposition and interval arithmetic. */
export declare const INTERVAL_SHIFTS: Readonly<{
    downOctave: -12;
    minorSecond: 1;
    majorSecond: 2;
    minorThird: 3;
    majorThird: 4;
    perfectFourth: 5;
    diminishedFifth: 6;
    perfectFifth: 7;
    minorSixth: 8;
    majorSixth: 9;
    minorSeventh: 10;
    majorSeventh: 11;
    perfectOctave: 12;
    upOctave: 12;
}>;
export declare const SCALE_INTERVAL_LIBRARY: Readonly<{
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
export declare const CHORD_VOICING_INTERVAL_LIBRARY: Readonly<{
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
/** Diatonic triad degrees, 1–3–5: neutral until interpreted by a scale. Universal. Used only by the generic scale-degree chord helper, not by emotional profiles. */
export declare const DIATONIC_TRIAD_INTERVALS: number[];
/** Chromatic rest, 1: still and neutral. Universal. Holds only the root pitch. */
export declare const CHROMATIC_REST_INTERVALS: number[];
/** Chromatic open fifth, 1–5: hollow and grounded. Universal. Removes major-minor identity. */
export declare const CHROMATIC_UNISON_FIFTH_INTERVALS: number[];
/** Chromatic major triad, 1–3–5: bright, happy and resolved. The most common triad. Reuses the canonical major voicing. */
export declare const CHROMATIC_MAJOR_TRIAD_INTERVALS: number[];
/** Chromatic minor triad, 1–♭3–5: dark, melancholic and introspective. One of the most common triads. Reuses the canonical minor voicing. */
export declare const CHROMATIC_MINOR_TRIAD_INTERVALS: number[];
/** Chromatic diminished triad, 1–♭3–♭5: tense, dramatic and unsettling. Common as a passing chord. Reuses the canonical diminished voicing. */
export declare const CHROMATIC_DIMINISHED_TRIAD_INTERVALS: number[];
/** Chromatic suspended second, 1–2–5: airy and unresolved. Very common. Reuses the canonical suspended-second voicing. */
export declare const CHROMATIC_SUS2_INTERVALS: number[];
/** Chromatic suspended fourth, 1–4–5: open and resolution-seeking. Very common. Reuses the canonical suspended-fourth voicing. */
export declare const CHROMATIC_SUS4_INTERVALS: number[];
/** Chromatic major sixth, 1–3–5–6: warm and nostalgic. Common. Reuses the canonical major-sixth voicing. */
export declare const CHROMATIC_MAJOR_SIXTH_INTERVALS: number[];
/** Chromatic major seventh, 1–3–5–7: refined and slightly mysterious. Extremely common. Reuses the canonical major-seventh voicing. */
export declare const CHROMATIC_MAJOR_SEVENTH_INTERVALS: number[];
/** Chromatic minor seventh, 1–♭3–5–♭7: soulful and emotionally deep. Extremely common. Reuses the canonical minor-seventh voicing. */
export declare const CHROMATIC_MINOR_SEVENTH_INTERVALS: number[];
/** Chromatic ninth, 1–3–5–♭7–9: colourful and resolution-seeking. Common in funk and jazz. Reuses the canonical dominant-ninth voicing. */
export declare const CHROMATIC_NINTH_INTERVALS: number[];
/** Chromatic Lydian glow, 1–3–♯4–5: luminous and expectant. Uncommon. Places the tritone inside a stable major frame. */
export declare const CHROMATIC_LYDIAN_GLOW_INTERVALS: number[];
/** Chromatic Phrygian colour, 1–♭2–♭3–5: dark and confrontational. Moderately common. Combines the characteristic minor second with a minor triad. */
export declare const CHROMATIC_PHRYGIAN_INTERVALS: number[];
/** Chromatic question, 1–♭2–4: uncertain and tense. Uncommon. Avoids triadic stability while preserving an open fourth. */
export declare const CHROMATIC_QUESTION_INTERVALS: number[];
/** Chromatic cluster, 1–♭2–2: compressed and nervous. Common in contemporary scoring. Places adjacent semitones around the root. */
export declare const CHROMATIC_CLUSTER_INTERVALS: number[];
/** Chromatic wide cluster, 1–♭2–5–♭7: anxious and spacious. Uncommon. Spreads semitone friction across stable upper tones. */
export declare const CHROMATIC_WIDE_CLUSTER_INTERVALS: number[];
/** Chromatic tritone tension, 1–♭5–5: suspicious and unstable. Common in dramatic harmony. Places the tritone directly beside the perfect fifth. */
export declare const CHROMATIC_TRITONE_TENSION_INTERVALS: number[];
/** Chromatic alarm, 1–♭2–♭5–♭9: urgent and highly dissonant. Uncommon. Repeats minor-second tension across an octave. */
export declare const CHROMATIC_ALARM_INTERVALS: number[];
/** Chromatic whole-tone colour, 1–2–3–♯4: floating and surreal. Uncommon. Uses consecutive whole-tone degrees. */
export declare const CHROMATIC_WHOLE_TONE_COLOUR_INTERVALS: number[];
/** Chromatic augmented colour, 1–3–♯5: bright and unsettled. Less common but distinctive. Reuses the canonical augmented voicing. */
export declare const CHROMATIC_AUGMENTED_INTERVALS: number[];
/** Chromatic dream chord, 1–3–♭7: soft and ambiguous. Uncommon. Omits the fifth to create spacious major-minor contrast. */
export declare const CHROMATIC_DREAM_INTERVALS: number[];
/** Chromatic sleep chord, 1–5–8: calm and hollow. Common as an open voicing. Frames the root with a fifth and octave. */
export declare const CHROMATIC_SLEEP_INTERVALS: number[];
/** Chromatic hollow chord, 1–5: empty and neutral. Universal. Reuses the open-fifth interval. */
export declare const CHROMATIC_HOLLOW_INTERVALS: number[];
/** Chromatic low hollow chord, 1–4: subdued and unresolved. Common. Uses an open perfect fourth. */
export declare const CHROMATIC_LOW_HOLLOW_INTERVALS: number[];
/** Chromatic blues colour, 1–♭3–♭5–5: gritty and expressive. Very common in blues-derived music. Adds the blue-note tritone to a minor frame. */
export declare const CHROMATIC_BLUES_INTERVALS: number[];
/** Chromatic comic chord, 1–2–5–6: buoyant and awkward. Uncommon. Mixes open fifth stability with bright neighbouring tones. */
export declare const CHROMATIC_COMIC_INTERVALS: number[];
/** Chromatic alien chord, 1–♭2–4–♭7: strange and unsettled. Uncommon. Avoids conventional triadic spacing. */
export declare const CHROMATIC_ALIEN_INTERVALS: number[];
/** Chromatic cool-heart chord, 1–4–5–♭7: tender and distant. Uncommon. Combines suspended openness with a minor seventh. */
export declare const CHROMATIC_COOL_HEART_INTERVALS: number[];
/** Chromatic dark-heart chord, 1–♭2–4–5: sombre and unresolved. Uncommon. Surrounds an open fifth with minor-second tension. */
export declare const CHROMATIC_DARK_HEART_INTERVALS: number[];
