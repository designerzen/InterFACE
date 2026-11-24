export declare const MAX_CHORD_VOICE_COUNT = 5;
export declare const CHORD_EMOTIONAL_PROFILES: Readonly<{
    rest: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    openFifth: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    brightResolved: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    warmNostalgic: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    refinedMysterious: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    openOptimistic: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    joyfulExpansive: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    radiantExuberant: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    ecstaticOpen: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    darkIntrospective: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    tenderBittersweet: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    soulfulDeep: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    lushIntrospective: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    hauntingIntense: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    weepingVulnerable: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    desolateAnguished: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    openUnresolved: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    airyUncertain: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    dissonantDemanding: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    dramaticUnsettling: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    anxiousUnresolved: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    shadowyUnstable: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    strongPull: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    colourfulUrgent: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    brightUnsettled: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    lydianGlow: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    phrygian: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    question: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    cluster: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    wideCluster: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    tritone: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    alarm: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    wholeTone: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    dream: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    sleep: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    hollow: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    lowHollow: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    blues: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    comic: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    alien: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    coolHeart: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
    darkHeart: Readonly<{
        title: any;
        intervals: any;
        candidateIntervals: any;
    }>;
}>;
export declare const EMOJI_INTERVAL_CHOICES: Map<string, Readonly<{
    title: any;
    intervals: any;
    candidateIntervals: any;
}>[]>;
export declare const EMOJI_CHORD_VOICE_COUNTS: Map<string, number>;
export declare const getVoiceCountForEmoji: (emoji: any) => number;
export declare const getTuningModeForEmoji: (emoji: any) => string;
export declare const getPrimaryIntervalsForEmoji: (emoji: any) => any;
export declare const getIntervalChoicesForEmoji: (emoji: any) => any[];
export declare const getEmotionalProfileChoicesForEmoji: (emoji: any) => Readonly<{
    title: any;
    intervals: any;
    candidateIntervals: any;
}>[];
export declare const selectEmotionalProfileForEmoji: (tonic: any, emoji: any, previousChord?: any[], harmonyOptions?: {}) => Readonly<{
    title: any;
    intervals: any;
    candidateIntervals: any;
}>;
export declare const selectIntervalsForEmoji: (tonic: any, emoji: any, previousChord?: any[], harmonyOptions?: {}) => any;
export declare const getChordQualityForEmoji: (emoji: any, tonic?: number, previousChord?: any[], harmonyOptions?: {}) => string | null;
export declare const getChromaticIntervalsForEmoji: (emoji: any) => any;
export declare function getChordFromIntervalsInKey(tonic: any, key?: number, scale?: string, intervals?: number[], voiceCount?: number): any[];
export declare const getDiatonicChordInKey: (tonic: any, key?: number, scale?: string, degreeOffsets?: number[]) => any[];
/**
 * Pass in an emoji and a tonic get out the chord in the
 * scale that best matches the emotion behind the emoji
 *
 * @param {Number} tonic
 * @param {String} emoji
 */
export declare const getMusicalDetailsFromEmoji: (tonic: number, emoji: string, includeTonic?: boolean, harmonyOptions?: {}) => any;
