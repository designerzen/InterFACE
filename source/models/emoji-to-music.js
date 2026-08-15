import { getAllChordsForNoteNumber } from '../audio/tuning/chords.js'
import {
	CHROMATIC_ALARM_INTERVALS,
	CHROMATIC_ALIEN_INTERVALS,
	CHROMATIC_BLUES_INTERVALS,
	CHROMATIC_CLUSTER_INTERVALS,
	CHROMATIC_COMIC_INTERVALS,
	CHROMATIC_COOL_HEART_INTERVALS,
	CHROMATIC_DARK_HEART_INTERVALS,
	CHROMATIC_DREAM_INTERVALS,
	CHROMATIC_HOLLOW_INTERVALS,
	CHROMATIC_LYDIAN_GLOW_INTERVALS,
	CHROMATIC_LOW_HOLLOW_INTERVALS,
	CHROMATIC_MAJOR_TRIAD_INTERVALS,
	CHROMATIC_PHRYGIAN_INTERVALS,
	CHROMATIC_QUESTION_INTERVALS,
	CHROMATIC_REST_INTERVALS,
	CHROMATIC_SLEEP_INTERVALS,
	CHROMATIC_TRITONE_TENSION_INTERVALS,
	CHROMATIC_UNISON_FIFTH_INTERVALS,
	CHROMATIC_WHOLE_TONE_COLOUR_INTERVALS,
	CHROMATIC_WIDE_CLUSTER_INTERVALS,
	AUGMENTED_VOICING_INTERVALS,
	CHORD_VOICING_INTERVAL_LIBRARY,
	DIMINISHED_7_VOICING_INTERVALS,
	DIMINISHED_VOICING_INTERVALS,
	DIATONIC_TRIAD_INTERVALS,
	DESOLATE_MINOR_MAJOR_13_VOICING_INTERVALS,
	DOMINANT_7_VOICING_INTERVALS,
	DOMINANT_9_VOICING_INTERVALS,
	HALF_DIMINISHED_VOICING_INTERVALS,
	MAJOR_6_VOICING_INTERVALS,
	MAJOR_7_VOICING_INTERVALS,
	MAJOR_9_VOICING_INTERVALS,
	MAJOR_VOICING_INTERVALS,
	MINOR_7_VOICING_INTERVALS,
	MINOR_6_VOICING_INTERVALS,
	MINOR_9_VOICING_INTERVALS,
	MINOR_MAJOR_7_VOICING_INTERVALS,
	MINOR_VOICING_INTERVALS,
	RADIANT_MAJOR_11_VOICING_INTERVALS,
	ECSTATIC_MAJOR_13_VOICING_INTERVALS,
	SIXTH_9_VOICING_INTERVALS,
	SUSPENDED_2_VOICING_INTERVALS,
	SUSPENDED_7_VOICING_INTERVALS,
	SUSPENDED_VOICING_INTERVALS,
	WEEPING_MINOR_11_VOICING_INTERVALS
} from '../audio/tuning/intervals.js'
import { getPitchClassForKey, getScaleFormula } from '../audio/tuning/keys.js'
import { MIDI_NOTE_NUMBER_MAP } from '../audio/tuning/notes.js'
import { SCALE_MAJOR, TUNING_MODE_AEOLIAN, TUNING_MODE_DORIAN, TUNING_MODE_IONIAN, TUNING_MODE_LOCRIAN, TUNING_MODE_LYDIAN, TUNING_MODE_MIXOLYDIAN, TUNING_MODE_PHRYGIAN } from '../audio/tuning/scales.js'
import { HARMONY_MODE_GLOBAL_KEY } from '../people/person.presets.js'
import * as EMOTICONS from './emoji.js'

const DEFAULT_CHORD_VOICE_COUNT = 3
const MAX_CHORD_VOICE_COUNT = 5
const normaliseVoiceCount = voiceCount => Math.min(
	Math.max(Math.round(Number(voiceCount)) || DEFAULT_CHORD_VOICE_COUNT, 1),
	MAX_CHORD_VOICE_COUNT
)

const emotionalProfile = (title, intervals) => Object.freeze({
	title,
	intervals,
	candidateIntervals:intervals
})

export const CHORD_EMOTIONAL_PROFILES = Object.freeze({
	rest:emotionalProfile("still / neutral", CHROMATIC_REST_INTERVALS),
	openFifth:emotionalProfile("open / grounded", CHROMATIC_UNISON_FIFTH_INTERVALS),
	brightResolved:emotionalProfile("bright / resolved", MAJOR_VOICING_INTERVALS),
	warmNostalgic:emotionalProfile("warm / nostalgic", MAJOR_6_VOICING_INTERVALS),
	refinedMysterious:emotionalProfile("refined / slightly mysterious", MAJOR_7_VOICING_INTERVALS),
	openOptimistic:emotionalProfile("open / optimistic", SIXTH_9_VOICING_INTERVALS),
	joyfulExpansive:emotionalProfile("joyful / expansive", MAJOR_9_VOICING_INTERVALS),
	radiantExuberant:emotionalProfile("radiant / exuberant", RADIANT_MAJOR_11_VOICING_INTERVALS),
	ecstaticOpen:emotionalProfile("ecstatic / maximally open", ECSTATIC_MAJOR_13_VOICING_INTERVALS),
	darkIntrospective:emotionalProfile("dark / introspective", MINOR_VOICING_INTERVALS),
	tenderBittersweet:emotionalProfile("tender / bittersweet", MINOR_6_VOICING_INTERVALS),
	soulfulDeep:emotionalProfile("soulful / emotionally deep", MINOR_7_VOICING_INTERVALS),
	lushIntrospective:emotionalProfile("lush / introspective", MINOR_9_VOICING_INTERVALS),
	hauntingIntense:emotionalProfile("haunting / intense", MINOR_MAJOR_7_VOICING_INTERVALS),
	weepingVulnerable:emotionalProfile("weeping / vulnerable", WEEPING_MINOR_11_VOICING_INTERVALS),
	desolateAnguished:emotionalProfile("desolate / anguished", DESOLATE_MINOR_MAJOR_13_VOICING_INTERVALS),
	openUnresolved:emotionalProfile("open / unresolved", SUSPENDED_VOICING_INTERVALS),
	airyUncertain:emotionalProfile("airy / uncertain", SUSPENDED_2_VOICING_INTERVALS),
	dissonantDemanding:emotionalProfile("dissonant / demanding resolution", SUSPENDED_7_VOICING_INTERVALS),
	dramaticUnsettling:emotionalProfile("dramatic / unsettling", DIMINISHED_VOICING_INTERVALS),
	anxiousUnresolved:emotionalProfile("anxious / unresolved", DIMINISHED_7_VOICING_INTERVALS),
	shadowyUnstable:emotionalProfile("shadowy / unstable", HALF_DIMINISHED_VOICING_INTERVALS),
	strongPull:emotionalProfile("strong pull / resolution-seeking", DOMINANT_7_VOICING_INTERVALS),
	colourfulUrgent:emotionalProfile("colourful / urgent", DOMINANT_9_VOICING_INTERVALS),
	brightUnsettled:emotionalProfile("bright / unsettled", AUGMENTED_VOICING_INTERVALS),
	lydianGlow:emotionalProfile("luminous / expectant", CHROMATIC_LYDIAN_GLOW_INTERVALS),
	phrygian:emotionalProfile("dark / confrontational", CHROMATIC_PHRYGIAN_INTERVALS),
	question:emotionalProfile("uncertain / questioning", CHROMATIC_QUESTION_INTERVALS),
	cluster:emotionalProfile("compressed / nervous", CHROMATIC_CLUSTER_INTERVALS),
	wideCluster:emotionalProfile("anxious / spacious", CHROMATIC_WIDE_CLUSTER_INTERVALS),
	tritone:emotionalProfile("suspicious / unstable", CHROMATIC_TRITONE_TENSION_INTERVALS),
	alarm:emotionalProfile("urgent / highly dissonant", CHROMATIC_ALARM_INTERVALS),
	wholeTone:emotionalProfile("floating / surreal", CHROMATIC_WHOLE_TONE_COLOUR_INTERVALS),
	dream:emotionalProfile("soft / ambiguous", CHROMATIC_DREAM_INTERVALS),
	sleep:emotionalProfile("calm / hollow", CHROMATIC_SLEEP_INTERVALS),
	hollow:emotionalProfile("empty / neutral", CHROMATIC_HOLLOW_INTERVALS),
	lowHollow:emotionalProfile("subdued / unresolved", CHROMATIC_LOW_HOLLOW_INTERVALS),
	blues:emotionalProfile("gritty / expressive", CHROMATIC_BLUES_INTERVALS),
	comic:emotionalProfile("buoyant / awkward", CHROMATIC_COMIC_INTERVALS),
	alien:emotionalProfile("strange / unsettled", CHROMATIC_ALIEN_INTERVALS),
	coolHeart:emotionalProfile("tender / distant", CHROMATIC_COOL_HEART_INTERVALS),
	darkHeart:emotionalProfile("sombre / unresolved", CHROMATIC_DARK_HEART_INTERVALS)
})

const EMOTION_INTERVAL_PROFILES = Object.freeze({
	rest:[CHORD_EMOTIONAL_PROFILES.rest], unison:[CHORD_EMOTIONAL_PROFILES.openFifth],
	neutral:[CHORD_EMOTIONAL_PROFILES.brightResolved, CHORD_EMOTIONAL_PROFILES.refinedMysterious],
	softMajor:[CHORD_EMOTIONAL_PROFILES.brightResolved, CHORD_EMOTIONAL_PROFILES.warmNostalgic, CHORD_EMOTIONAL_PROFILES.refinedMysterious, CHORD_EMOTIONAL_PROFILES.openOptimistic],
	openMajor:[CHORD_EMOTIONAL_PROFILES.refinedMysterious, CHORD_EMOTIONAL_PROFILES.brightResolved],
	brightSixth:[CHORD_EMOTIONAL_PROFILES.warmNostalgic, CHORD_EMOTIONAL_PROFILES.openOptimistic],
	joy:[CHORD_EMOTIONAL_PROFILES.brightResolved, CHORD_EMOTIONAL_PROFILES.openOptimistic],
	celebration:[CHORD_EMOTIONAL_PROFILES.openOptimistic, CHORD_EMOTIONAL_PROFILES.brightResolved],
	lydianGlow:[CHORD_EMOTIONAL_PROFILES.lydianGlow, CHORD_EMOTIONAL_PROFILES.refinedMysterious],
	mixolydian:[CHORD_EMOTIONAL_PROFILES.strongPull, CHORD_EMOTIONAL_PROFILES.brightResolved],
	dorian:[CHORD_EMOTIONAL_PROFILES.warmNostalgic, CHORD_EMOTIONAL_PROFILES.soulfulDeep],
	minor:[CHORD_EMOTIONAL_PROFILES.darkIntrospective, CHORD_EMOTIONAL_PROFILES.soulfulDeep],
	sadSixth:[CHORD_EMOTIONAL_PROFILES.soulfulDeep, CHORD_EMOTIONAL_PROFILES.tenderBittersweet],
	heavyMinor:[CHORD_EMOTIONAL_PROFILES.hauntingIntense, CHORD_EMOTIONAL_PROFILES.soulfulDeep, CHORD_EMOTIONAL_PROFILES.lushIntrospective],
	phrygian:[CHORD_EMOTIONAL_PROFILES.phrygian, CHORD_EMOTIONAL_PROFILES.darkIntrospective],
	question:[CHORD_EMOTIONAL_PROFILES.question, CHORD_EMOTIONAL_PROFILES.airyUncertain],
	suspension:[CHORD_EMOTIONAL_PROFILES.dissonantDemanding, CHORD_EMOTIONAL_PROFILES.openUnresolved, CHORD_EMOTIONAL_PROFILES.airyUncertain],
	sus2:[CHORD_EMOTIONAL_PROFILES.airyUncertain, CHORD_EMOTIONAL_PROFILES.openUnresolved],
	sus4:[CHORD_EMOTIONAL_PROFILES.openUnresolved, CHORD_EMOTIONAL_PROFILES.dissonantDemanding],
	cluster:[CHORD_EMOTIONAL_PROFILES.cluster, CHORD_EMOTIONAL_PROFILES.shadowyUnstable],
	wideCluster:[CHORD_EMOTIONAL_PROFILES.wideCluster, CHORD_EMOTIONAL_PROFILES.shadowyUnstable],
	diminished:[CHORD_EMOTIONAL_PROFILES.dramaticUnsettling, CHORD_EMOTIONAL_PROFILES.anxiousUnresolved],
	tritone:[CHORD_EMOTIONAL_PROFILES.tritone, CHORD_EMOTIONAL_PROFILES.strongPull],
	alarm:[CHORD_EMOTIONAL_PROFILES.alarm, CHORD_EMOTIONAL_PROFILES.anxiousUnresolved],
	wholeTone:[CHORD_EMOTIONAL_PROFILES.wholeTone, CHORD_EMOTIONAL_PROFILES.brightUnsettled],
	augmented:[CHORD_EMOTIONAL_PROFILES.brightUnsettled, CHORD_EMOTIONAL_PROFILES.refinedMysterious],
	dream:[CHORD_EMOTIONAL_PROFILES.dream, CHORD_EMOTIONAL_PROFILES.refinedMysterious],
	sleep:[CHORD_EMOTIONAL_PROFILES.sleep, CHORD_EMOTIONAL_PROFILES.openFifth],
	hollow:[CHORD_EMOTIONAL_PROFILES.hollow, CHORD_EMOTIONAL_PROFILES.openFifth],
	lowHollow:[CHORD_EMOTIONAL_PROFILES.lowHollow, CHORD_EMOTIONAL_PROFILES.hollow],
	blues:[CHORD_EMOTIONAL_PROFILES.blues, CHORD_EMOTIONAL_PROFILES.strongPull],
	sly:[CHORD_EMOTIONAL_PROFILES.strongPull, CHORD_EMOTIONAL_PROFILES.colourfulUrgent],
	comic:[CHORD_EMOTIONAL_PROFILES.comic, CHORD_EMOTIONAL_PROFILES.brightResolved],
	mechanical:[CHORD_EMOTIONAL_PROFILES.refinedMysterious], alien:[CHORD_EMOTIONAL_PROFILES.alien],
	heart:[CHORD_EMOTIONAL_PROFILES.openOptimistic, CHORD_EMOTIONAL_PROFILES.warmNostalgic],
	warmHeart:[CHORD_EMOTIONAL_PROFILES.warmNostalgic], coolHeart:[CHORD_EMOTIONAL_PROFILES.coolHeart],
	darkHeart:[CHORD_EMOTIONAL_PROFILES.darkHeart], catHappy:[CHORD_EMOTIONAL_PROFILES.brightResolved],
	catSad:[CHORD_EMOTIONAL_PROFILES.soulfulDeep], catAngry:[CHORD_EMOTIONAL_PROFILES.anxiousUnresolved]
})

export const EMOJI_INTERVAL_CHOICES = new Map([
	[EMOTICONS.EMOJI_NEUTRAL, EMOTION_INTERVAL_PROFILES.neutral],
	[EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED, EMOTION_INTERVAL_PROFILES.rest],
	[EMOTICONS.EMOJI_LEFT_WINK, EMOTION_INTERVAL_PROFILES.dorian],
	[EMOTICONS.EMOJI_RIGHT_WINK, EMOTION_INTERVAL_PROFILES.dorian],
	[EMOTICONS.EMOJI_DIAGONAL_MOUTH, EMOTION_INTERVAL_PROFILES.question],
	[EMOTICONS.EMOJI_EYES_ROLLING_UP, EMOTION_INTERVAL_PROFILES.suspension],
	[EMOTICONS.EMOJI_SMILING_SLIGHTLY, [CHORD_EMOTIONAL_PROFILES.brightResolved, CHORD_EMOTIONAL_PROFILES.warmNostalgic, CHORD_EMOTIONAL_PROFILES.refinedMysterious]],
	[EMOTICONS.EMOJI_SMILING_EYES_CLOSED, [CHORD_EMOTIONAL_PROFILES.warmNostalgic, CHORD_EMOTIONAL_PROFILES.brightResolved, CHORD_EMOTIONAL_PROFILES.refinedMysterious]],
	[EMOTICONS.EMOJI_SMILING_GRIN, [CHORD_EMOTIONAL_PROFILES.refinedMysterious, CHORD_EMOTIONAL_PROFILES.warmNostalgic, CHORD_EMOTIONAL_PROFILES.brightResolved]],
	[EMOTICONS.EMOJI_SMILING_BIG_GRIN, [CHORD_EMOTIONAL_PROFILES.joyfulExpansive, CHORD_EMOTIONAL_PROFILES.openOptimistic, CHORD_EMOTIONAL_PROFILES.refinedMysterious]],
	[EMOTICONS.EMOJI_SMILING_GRIN_SQUINT, [CHORD_EMOTIONAL_PROFILES.radiantExuberant, CHORD_EMOTIONAL_PROFILES.joyfulExpansive, CHORD_EMOTIONAL_PROFILES.openOptimistic]],
	[EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED, [CHORD_EMOTIONAL_PROFILES.ecstaticOpen, CHORD_EMOTIONAL_PROFILES.radiantExuberant, CHORD_EMOTIONAL_PROFILES.joyfulExpansive]],
	[EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED, [CHORD_EMOTIONAL_PROFILES.openOptimistic, CHORD_EMOTIONAL_PROFILES.joyfulExpansive, CHORD_EMOTIONAL_PROFILES.warmNostalgic]],
	[EMOTICONS.EMOJI_OPEN_MOUTH, EMOTION_INTERVAL_PROFILES.minor],
	[EMOTICONS.EMOJI_OPEN_MOUTH_BIG, EMOTION_INTERVAL_PROFILES.heavyMinor],
	[EMOTICONS.EMOJI_WAIL, [CHORD_EMOTIONAL_PROFILES.desolateAnguished, CHORD_EMOTIONAL_PROFILES.weepingVulnerable, CHORD_EMOTIONAL_PROFILES.hauntingIntense]],
	[EMOTICONS.EMOJI_ASTONISHED, EMOTION_INTERVAL_PROFILES.lydianGlow],
	[EMOTICONS.EMOJI_GRIMACING, EMOTION_INTERVAL_PROFILES.phrygian],
	[EMOTICONS.EMOJI_ZANY, EMOTION_INTERVAL_PROFILES.comic],
	[EMOTICONS.EMOJI_KISS, EMOTION_INTERVAL_PROFILES.lydianGlow],
	[EMOTICONS.EMOJI_KISS_EYES_CLOSED, EMOTION_INTERVAL_PROFILES.dream],
	[EMOTICONS.EMOJI_KISS_EYES_CLOSED_EYEBROWS_RAISED, EMOTION_INTERVAL_PROFILES.lydianGlow],
	[EMOTICONS.EMOJI_SMIRK, EMOTION_INTERVAL_PROFILES.tritone],
	[EMOTICONS.EMOJI_UNAMUSED, EMOTION_INTERVAL_PROFILES.sly],
	[EMOTICONS.EMOJI_RAISED_EYEBROW, EMOTION_INTERVAL_PROFILES.question],
	[EMOTICONS.EMOJI_CONFUSED, EMOTION_INTERVAL_PROFILES.phrygian],
	[EMOTICONS.EMOJI_WORRIED, [CHORD_EMOTIONAL_PROFILES.darkIntrospective, CHORD_EMOTIONAL_PROFILES.tenderBittersweet, CHORD_EMOTIONAL_PROFILES.soulfulDeep]],
	[EMOTICONS.EMOJI_FROWNING, [CHORD_EMOTIONAL_PROFILES.tenderBittersweet, CHORD_EMOTIONAL_PROFILES.darkIntrospective, CHORD_EMOTIONAL_PROFILES.soulfulDeep]],
	[EMOTICONS.EMOJI_FROWN_EYES_CLOSED, [CHORD_EMOTIONAL_PROFILES.soulfulDeep, CHORD_EMOTIONAL_PROFILES.tenderBittersweet, CHORD_EMOTIONAL_PROFILES.darkIntrospective]],
	[EMOTICONS.EMOJI_ANGRY, EMOTION_INTERVAL_PROFILES.diminished],
	[EMOTICONS.EMOJI_TRIPPY, EMOTION_INTERVAL_PROFILES.wholeTone],
	[EMOTICONS.EMOJI_SHAKING, EMOTION_INTERVAL_PROFILES.alarm],
	[EMOTICONS.EMOJI_SHAKING_HORIZONTALLY, EMOTION_INTERVAL_PROFILES.alarm],
	[EMOTICONS.EMOJI_SHAKING_VERTICALLY, EMOTION_INTERVAL_PROFILES.cluster],
	[EMOTICONS.EMOJI_CRYING, [CHORD_EMOTIONAL_PROFILES.weepingVulnerable, CHORD_EMOTIONAL_PROFILES.lushIntrospective, CHORD_EMOTIONAL_PROFILES.soulfulDeep]],
	[EMOTICONS.EMOJI_KISSING_WINK, EMOTION_INTERVAL_PROFILES.lydianGlow],
	[EMOTICONS.EMOJI_HEARTS, EMOTION_INTERVAL_PROFILES.heart],
	[EMOTICONS.EMOJI_HEART_EYES, EMOTION_INTERVAL_PROFILES.heart],
	[EMOTICONS.EMOJI_STAR_STRUCK, EMOTION_INTERVAL_PROFILES.celebration],
	[EMOTICONS.EMOJI_PARTY, EMOTION_INTERVAL_PROFILES.celebration],
	[EMOTICONS.EMOJI_UPSIDE_DOWN, EMOTION_INTERVAL_PROFILES.mixolydian],
	[EMOTICONS.EMOJI_HAPPY_TEARS, EMOTION_INTERVAL_PROFILES.dorian],
	[EMOTICONS.EMOJI_HOLDING_TEARS, [CHORD_EMOTIONAL_PROFILES.lushIntrospective, CHORD_EMOTIONAL_PROFILES.soulfulDeep, CHORD_EMOTIONAL_PROFILES.tenderBittersweet]],
	[EMOTICONS.EMOJI_SAVORING, EMOTION_INTERVAL_PROFILES.brightSixth],
	[EMOTICONS.EMOJI_TONGUE, EMOTION_INTERVAL_PROFILES.comic],
	[EMOTICONS.EMOJI_TONGUE_WINK, EMOTION_INTERVAL_PROFILES.sly],
	[EMOTICONS.EMOJI_TONGUE_SQUINT, EMOTION_INTERVAL_PROFILES.blues],
	[EMOTICONS.EMOJI_HALO, EMOTION_INTERVAL_PROFILES.lydianGlow],
	[EMOTICONS.EMOJI_SALUTE, EMOTION_INTERVAL_PROFILES.openMajor],
	[EMOTICONS.EMOJI_THINKING, EMOTION_INTERVAL_PROFILES.question],
	[EMOTICONS.EMOJI_SHUSHING, EMOTION_INTERVAL_PROFILES.hollow],
	[EMOTICONS.EMOJI_HAND_OVER_MOUTH, EMOTION_INTERVAL_PROFILES.sus2],
	[EMOTICONS.EMOJI_GIGGLING, EMOTION_INTERVAL_PROFILES.dorian],
	[EMOTICONS.EMOJI_YAWNING, EMOTION_INTERVAL_PROFILES.sleep],
	[EMOTICONS.EMOJI_HUGGING, EMOTION_INTERVAL_PROFILES.warmHeart],
	[EMOTICONS.EMOJI_PEEKING, EMOTION_INTERVAL_PROFILES.sus2],
	[EMOTICONS.EMOJI_SCREAMING, EMOTION_INTERVAL_PROFILES.alarm],
	[EMOTICONS.EMOJI_MONOCLE, EMOTION_INTERVAL_PROFILES.question],
	[EMOTICONS.EMOJI_EXHALING, EMOTION_INTERVAL_PROFILES.suspension],
	[EMOTICONS.EMOJI_STEAM, EMOTION_INTERVAL_PROFILES.phrygian],
	[EMOTICONS.EMOJI_RAGE, [CHORD_EMOTIONAL_PROFILES.anxiousUnresolved, CHORD_EMOTIONAL_PROFILES.dramaticUnsettling, CHORD_EMOTIONAL_PROFILES.shadowyUnstable]],
	[EMOTICONS.EMOJI_PLEADING, EMOTION_INTERVAL_PROFILES.sadSixth],
	[EMOTICONS.EMOJI_ANXIOUS, [CHORD_EMOTIONAL_PROFILES.anxiousUnresolved, CHORD_EMOTIONAL_PROFILES.shadowyUnstable, CHORD_EMOTIONAL_PROFILES.dramaticUnsettling]],
	[EMOTICONS.EMOJI_FEARFUL, EMOTION_INTERVAL_PROFILES.phrygian],
	[EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED, EMOTION_INTERVAL_PROFILES.alarm],
	[EMOTICONS.EMOJI_ANGUISHED, EMOTION_INTERVAL_PROFILES.heavyMinor],
	[EMOTICONS.EMOJI_SHOCKED, EMOTION_INTERVAL_PROFILES.alarm],
	[EMOTICONS.EMOJI_FLUSHED, EMOTION_INTERVAL_PROFILES.suspension],
	[EMOTICONS.EMOJI_MIND_BLOWN, EMOTION_INTERVAL_PROFILES.wholeTone],
	[EMOTICONS.EMOJI_DOWNCAST_SWEAT, EMOTION_INTERVAL_PROFILES.lowHollow],
	[EMOTICONS.EMOJI_PERSEVERING, EMOTION_INTERVAL_PROFILES.phrygian],
	[EMOTICONS.EMOJI_TIRED, EMOTION_INTERVAL_PROFILES.sleep],
	[EMOTICONS.EMOJI_DIZZY, EMOTION_INTERVAL_PROFILES.wholeTone],
	[EMOTICONS.EMOJI_DOTTED_LINE, EMOTION_INTERVAL_PROFILES.hollow],
	[EMOTICONS.EMOJI_SLEEPING, EMOTION_INTERVAL_PROFILES.sleep],
	[EMOTICONS.EMOJI_SLEEPY, EMOTION_INTERVAL_PROFILES.sleep],
	[EMOTICONS.EMOJI_DROOLING, EMOTION_INTERVAL_PROFILES.dream],
	[EMOTICONS.EMOJI_MOON_FACE, EMOTION_INTERVAL_PROFILES.dream],
	[EMOTICONS.EMOJI_MOON_FACE_LEFT, EMOTION_INTERVAL_PROFILES.dream],
	[EMOTICONS.EMOJI_NEW_MOON_FACE, EMOTION_INTERVAL_PROFILES.hollow],
	[EMOTICONS.EMOJI_FULL_MOON_FACE, EMOTION_INTERVAL_PROFILES.lydianGlow],
	[EMOTICONS.EMOJI_SUN_FACE, EMOTION_INTERVAL_PROFILES.celebration],
	[EMOTICONS.EMOJI_MELTING, EMOTION_INTERVAL_PROFILES.augmented],
	[EMOTICONS.EMOJI_FOG, EMOTION_INTERVAL_PROFILES.dream],
	[EMOTICONS.EMOJI_WOOZY, EMOTION_INTERVAL_PROFILES.wholeTone],
	[EMOTICONS.EMOJI_HOT, EMOTION_INTERVAL_PROFILES.alarm],
	[EMOTICONS.EMOJI_COLD, EMOTION_INTERVAL_PROFILES.hollow],
	[EMOTICONS.EMOJI_NAUSEATED, EMOTION_INTERVAL_PROFILES.phrygian],
	[EMOTICONS.EMOJI_VOMITING, EMOTION_INTERVAL_PROFILES.cluster],
	[EMOTICONS.EMOJI_SNEEZING, EMOTION_INTERVAL_PROFILES.sus2],
	[EMOTICONS.EMOJI_SICK, EMOTION_INTERVAL_PROFILES.phrygian],
	[EMOTICONS.EMOJI_INJURED, EMOTION_INTERVAL_PROFILES.lowHollow],
	[EMOTICONS.EMOJI_MASK, EMOTION_INTERVAL_PROFILES.hollow],
	[EMOTICONS.EMOJI_COWBOY, EMOTION_INTERVAL_PROFILES.mixolydian],
	[EMOTICONS.EMOJI_MONEY, EMOTION_INTERVAL_PROFILES.brightSixth],
	[EMOTICONS.EMOJI_SUNGLASSES, EMOTION_INTERVAL_PROFILES.blues],
	[EMOTICONS.EMOJI_NERD, EMOTION_INTERVAL_PROFILES.question],
	[EMOTICONS.EMOJI_DISGUISED, EMOTION_INTERVAL_PROFILES.sly],
	[EMOTICONS.EMOJI_LYING, EMOTION_INTERVAL_PROFILES.tritone],
	[EMOTICONS.EMOJI_CLOWN, EMOTION_INTERVAL_PROFILES.comic],
	[EMOTICONS.EMOJI_GHOST, EMOTION_INTERVAL_PROFILES.hollow],
	[EMOTICONS.EMOJI_POOP, EMOTION_INTERVAL_PROFILES.lowHollow],
	[EMOTICONS.EMOJI_ALIEN, EMOTION_INTERVAL_PROFILES.alien],
	[EMOTICONS.EMOJI_ROBOT, EMOTION_INTERVAL_PROFILES.mechanical],
	[EMOTICONS.EMOJI_SLEEPING_SYMBOL, EMOTION_INTERVAL_PROFILES.sleep],
	[EMOTICONS.EMOJI_HOLE, EMOTION_INTERVAL_PROFILES.lowHollow],
	[EMOTICONS.EMOJI_PARTY_POPPER, EMOTION_INTERVAL_PROFILES.celebration],
	[EMOTICONS.EMOJI_CONFETTI, EMOTION_INTERVAL_PROFILES.celebration],
	[EMOTICONS.EMOJI_SEE_NO_EVIL, EMOTION_INTERVAL_PROFILES.sus2],
	[EMOTICONS.EMOJI_HEAR_NO_EVIL, EMOTION_INTERVAL_PROFILES.hollow],
	[EMOTICONS.EMOJI_SPEAK_NO_EVIL, EMOTION_INTERVAL_PROFILES.suspension],
	[EMOTICONS.EMOJI_CAT_GRINNING, EMOTION_INTERVAL_PROFILES.catHappy],
	[EMOTICONS.EMOJI_CAT_HAPPY, EMOTION_INTERVAL_PROFILES.catHappy],
	[EMOTICONS.EMOJI_CAT_TEARS_JOY, EMOTION_INTERVAL_PROFILES.dorian],
	[EMOTICONS.EMOJI_CAT_HEART_EYES, EMOTION_INTERVAL_PROFILES.heart],
	[EMOTICONS.EMOJI_CAT_SMIRK, EMOTION_INTERVAL_PROFILES.sly],
	[EMOTICONS.EMOJI_CAT_KISSING, EMOTION_INTERVAL_PROFILES.lydianGlow],
	[EMOTICONS.EMOJI_CAT_SCREAMING, EMOTION_INTERVAL_PROFILES.alarm],
	[EMOTICONS.EMOJI_CAT_CRYING, EMOTION_INTERVAL_PROFILES.catSad],
	[EMOTICONS.EMOJI_CAT_POUTING, EMOTION_INTERVAL_PROFILES.catAngry],
	[EMOTICONS.EMOJI_HEART_RED, EMOTION_INTERVAL_PROFILES.heart],
	[EMOTICONS.EMOJI_HEART_ORANGE, EMOTION_INTERVAL_PROFILES.warmHeart],
	[EMOTICONS.EMOJI_HEART_YELLOW, EMOTION_INTERVAL_PROFILES.brightSixth],
	[EMOTICONS.EMOJI_HEART_GREEN, EMOTION_INTERVAL_PROFILES.dorian],
	[EMOTICONS.EMOJI_HEART_BLUE, EMOTION_INTERVAL_PROFILES.coolHeart],
	[EMOTICONS.EMOJI_HEART_PURPLE, EMOTION_INTERVAL_PROFILES.lydianGlow],
	[EMOTICONS.EMOJI_HEART_BROWN, EMOTION_INTERVAL_PROFILES.lowHollow],
	[EMOTICONS.EMOJI_HEART_BLACK, EMOTION_INTERVAL_PROFILES.darkHeart],
	[EMOTICONS.EMOJI_HEART_WHITE, EMOTION_INTERVAL_PROFILES.lydianGlow],
	[EMOTICONS.EMOJI_HEART_CLASSIC, EMOTION_INTERVAL_PROFILES.heart]
])

// Density describes the expression, not the chord formula. Any emoji omitted
// here sounds as a triad, even when its ordered candidate pool contains richer
// sixths, sevenths or extensions for key-aware substitution.
export const EMOJI_CHORD_VOICE_COUNTS = new Map([
	[EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED, 1],
	[EMOTICONS.EMOJI_EYES_ROLLING_UP, 4],
	[EMOTICONS.EMOJI_SMILING_BIG_GRIN, 4],
	[EMOTICONS.EMOJI_SMILING_GRIN_SQUINT, 4],
	[EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED, 4],
	[EMOTICONS.EMOJI_HOLDING_TEARS, 4],
	[EMOTICONS.EMOJI_CRYING, 4],
	[EMOTICONS.EMOJI_OPEN_MOUTH_BIG, 4],
	[EMOTICONS.EMOJI_FLUSHED, 4],
	[EMOTICONS.EMOJI_ANXIOUS, 4],
	[EMOTICONS.EMOJI_ANGUISHED, 4],
	[EMOTICONS.EMOJI_PLEADING, 4],
	[EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED, 5],
	[EMOTICONS.EMOJI_WAIL, 5],
	[EMOTICONS.EMOJI_RAGE, 5],
	[EMOTICONS.EMOJI_SCREAMING, 5],
	[EMOTICONS.EMOJI_MIND_BLOWN, 5]
])

export const getVoiceCountForEmoji = emoji => normaliseVoiceCount(
	EMOJI_CHORD_VOICE_COUNTS.get(emoji) ?? DEFAULT_CHORD_VOICE_COUNT
)

const scaleContextCache = new Map()
const globalChordCache = new Map()
const MAX_GLOBAL_CHORD_CACHE_SIZE = 2048

const getScaleCacheKey = (key=0, scale="MAJOR_SCALE") => {
	const scaleKey = Array.isArray(scale) ? scale.join(",") : scale
	return `${key}|${scaleKey}`
}

const getMidiNoteAtOrAbove = (noteNumber, pitchClass) => {
	const currentPitchClass = noteNumber % 12
	const distance = (pitchClass - currentPitchClass + 12) % 12
	return noteNumber + distance
}

const getNearestPitchClass = (pitchClass, allowedPitchClasses) => {
	return allowedPitchClasses.reduce((nearest, allowedPitchClass) => {
		const upwardDistance = (allowedPitchClass - pitchClass + 12) % 12
		const downwardDistance = (pitchClass - allowedPitchClass + 12) % 12
		const distance = Math.min(upwardDistance, downwardDistance)
		return distance < nearest.distance ? { pitchClass:allowedPitchClass, distance } : nearest
	}, { pitchClass:allowedPitchClasses[0], distance:Number.MAX_VALUE }).pitchClass
}

const getNearestMidiNote = (noteNumber, pitchClass) => {
	const currentPitchClass = noteNumber % 12
	const upwardDistance = (pitchClass - currentPitchClass + 12) % 12
	const downwardDistance = (currentPitchClass - pitchClass + 12) % 12
	return upwardDistance < downwardDistance ? noteNumber + upwardDistance : noteNumber - downwardDistance
}

export const getTuningModeForEmoji = (emoji) => {
	// happy / sad
	let mode = TUNING_MODE_IONIAN
	
	// determine MODE only
	// NB. The scale we now know as major was originally called
	// the Ionian mode and its relative minor was known as Aeolian.
	switch(emoji) {

		// MAJOR - Happy Sounds
		case EMOTICONS.EMOJI_NEUTRAL_EYES_CLOSED:
		case EMOTICONS.EMOJI_NEUTRAL:
		case EMOTICONS.EMOJI_SMILING_GRIN:
		case EMOTICONS.EMOJI_SMILING_EYES_CLOSED:
		case EMOTICONS.EMOJI_SMILING_GRIN_EYES_CLOSED:
		case EMOTICONS.EMOJI_SMILING_GRIN_SQUINT:
		case EMOTICONS.EMOJI_SMILING_SLIGHTLY:
		default:
			mode = TUNING_MODE_IONIAN
			break
		
		case EMOTICONS.EMOJI_LEFT_WINK:
		case EMOTICONS.EMOJI_RIGHT_WINK:
		case EMOTICONS.EMOJI_EYES_ROLLING_UP:
		case EMOTICONS.EMOJI_FROWN_EYES_CLOSED:
		case EMOTICONS.EMOJI_TRIPPY:
		case EMOTICONS.EMOJI_GIGGLING:
		case EMOTICONS.EMOJI_HAPPY_TEARS:
		case EMOTICONS.EMOJI_HOLDING_TEARS:
		case EMOTICONS.EMOJI_THINKING:
		case EMOTICONS.EMOJI_ZANY:
			mode = TUNING_MODE_DORIAN
			break

		// Kissing / arousol
		case EMOTICONS.EMOJI_KISS_EYES_CLOSED_EYEBROWS_RAISED:
		case EMOTICONS.EMOJI_KISS_EYES_CLOSED:
		case EMOTICONS.EMOJI_KISS:
		case EMOTICONS.EMOJI_KISSING_WINK:
		case EMOTICONS.EMOJI_CAT_KISSING:
		case EMOTICONS.EMOJI_ASTONISHED:
			mode = TUNING_MODE_LYDIAN
			break

		// SUPER Happy! Like SNES games!
		case EMOTICONS.EMOJI_SMILING_BIG_GRIN:
		case EMOTICONS.EMOJI_SMILING_BIG_TEETH_GRIN_EYES_CLOSED:
		case EMOTICONS.EMOJI_HEARTS:
		case EMOTICONS.EMOJI_HEART_EYES:
		case EMOTICONS.EMOJI_STAR_STRUCK:
		case EMOTICONS.EMOJI_PARTY:
			mode = TUNING_MODE_MIXOLYDIAN
			break

		// SAD Sound, minor chords
		case EMOTICONS.EMOJI_OPEN_MOUTH:
		case EMOTICONS.EMOJI_OPEN_MOUTH_BIG:
		case EMOTICONS.EMOJI_WAIL:
		case EMOTICONS.EMOJI_FLUSHED: 
		case EMOTICONS.EMOJI_FEARFUL: 
		case EMOTICONS.EMOJI_ANGUISHED:
		case EMOTICONS.EMOJI_ANGUISHED_EYEBROWS_RAISED:
			mode = TUNING_MODE_AEOLIAN
			break
	
		// 
		case EMOTICONS.EMOJI_FROWNING:
		case EMOTICONS.EMOJI_WORRIED:
			mode = TUNING_MODE_LYDIAN
			break

		// 
		case EMOTICONS.EMOJI_CONFUSED:
		case EMOTICONS.EMOJI_SHOCKED:
		case EMOTICONS.EMOJI_GRIMACING:
		case EMOTICONS.EMOJI_PERSEVERING:
		case EMOTICONS.EMOJI_RAISED_EYEBROW:
			mode = TUNING_MODE_PHRYGIAN
			break

		// most disjointed
		case EMOTICONS.EMOJI_SHAKING:
		case EMOTICONS.EMOJI_ANGRY:
		case EMOTICONS.EMOJI_SMIRK:
		case EMOTICONS.EMOJI_RAGE:
			mode = TUNING_MODE_LOCRIAN
			break
	}

	return mode
}

export const getPrimaryIntervalsForEmoji = (emoji) => {
	return getIntervalChoicesForEmoji(emoji)[0] ?? CHROMATIC_MAJOR_TRIAD_INTERVALS
}

const getChordQualityForIntervals = intervals => {
	const quality = Object.entries(CHORD_VOICING_INTERVAL_LIBRARY)
		.find(([, voicingIntervals]) => voicingIntervals === intervals)
	return quality?.[0] ?? null
}

const getNoteNumbers = chord => (chord ?? [])
	.map(note => typeof note === "number" ? note : note?.noteNumber)
	.filter(Number.isFinite)

const getResolvedNotesForProfile = (tonic, profile, voiceCount=DEFAULT_CHORD_VOICE_COUNT, harmonyOptions={}) => {
	const targetVoiceCount = normaliseVoiceCount(voiceCount)
	if (harmonyOptions.harmonyMode === HARMONY_MODE_GLOBAL_KEY)
	{
		return getChordFromIntervalsInKey(
			tonic,
			harmonyOptions.tonic,
			harmonyOptions.keyScale,
			profile.candidateIntervals,
			targetVoiceCount
		)
	}

	const completionIntervals = [
		...profile.candidateIntervals,
		...CHROMATIC_MAJOR_TRIAD_INTERVALS,
		12, 16, 19, 24
	]
	const selectedIntervals = [...new Set(completionIntervals)]
		.slice(0, targetVoiceCount)
		.sort((a, b) => a - b)

	return selectedIntervals
		.map(interval => MIDI_NOTE_NUMBER_MAP[tonic + interval])
		.filter(Boolean)
}

const getVoiceLeadingCost = (nextChord, previousChord) => {
	const previousNotes = getNoteNumbers(previousChord)
	if (!previousNotes.length)
	{
		return 0
	}
	const nextNotes = getNoteNumbers(nextChord)
	const movement = nextNotes.reduce((cost, note) => {
		return cost + Math.min(...previousNotes.map(previousNote => Math.abs(note - previousNote)))
	}, 0)
	return movement + Math.abs(nextNotes.length - previousNotes.length) * 2
}

export const getIntervalChoicesForEmoji = emoji => {
	return getEmotionalProfileChoicesForEmoji(emoji).map(profile => profile.candidateIntervals)
}

export const getEmotionalProfileChoicesForEmoji = emoji => EMOJI_INTERVAL_CHOICES.get(emoji) ?? []

export const selectEmotionalProfileForEmoji = (tonic, emoji, previousChord=[], harmonyOptions={}) => {
	const choices = getEmotionalProfileChoicesForEmoji(emoji)
	const voiceCount = getVoiceCountForEmoji(emoji)
	return choices.reduce((best, profile) => {
		if (!best)
		{
			return profile
		}
		const profileChord = getResolvedNotesForProfile(tonic, profile, voiceCount, harmonyOptions)
		const bestChord = getResolvedNotesForProfile(tonic, best, voiceCount, harmonyOptions)
		return getVoiceLeadingCost(profileChord, previousChord) < getVoiceLeadingCost(bestChord, previousChord) ? profile : best
	}, null)
}

export const selectIntervalsForEmoji = (tonic, emoji, previousChord=[], harmonyOptions={}) => {
	return selectEmotionalProfileForEmoji(tonic, emoji, previousChord, harmonyOptions)?.candidateIntervals ?? null
}

export const getChordQualityForEmoji = (emoji, tonic=60, previousChord=[], harmonyOptions={}) => {
	const selectedProfile = selectEmotionalProfileForEmoji(tonic, emoji, previousChord, harmonyOptions)
	if (selectedProfile)
	{
		return getChordQualityForIntervals(selectedProfile.candidateIntervals)
	}

	return null
}

const getScaleContext = (key=0, scale="MAJOR_SCALE") => {
	const cacheKey = getScaleCacheKey(key, scale)
	const cached = scaleContextCache.get(cacheKey)
	if (cached)
	{
		return cached
	}

	const keyRoot = getPitchClassForKey(key)
	const scaleFormula = getScaleFormula(scale)
	const pitchClasses = scaleFormula.map(interval => (keyRoot + interval) % 12)
	const isChromatic = scaleFormula.length === 12 && scaleFormula.every((interval, index) => interval === index)
	const context = { keyRoot, scaleFormula, pitchClasses, isChromatic }
	scaleContextCache.set(cacheKey, context)
	return context
}

export const getChromaticIntervalsForEmoji = (emoji) => {
	return getPrimaryIntervalsForEmoji(emoji)
}

export function getChordFromIntervalsInKey(tonic, key=0, scale="MAJOR_SCALE", intervals=CHROMATIC_MAJOR_TRIAD_INTERVALS, voiceCount=DEFAULT_CHORD_VOICE_COUNT) {
	const { pitchClasses } = getScaleContext(key, scale)
	const rootPitchClass = getNearestPitchClass(tonic % 12, pitchClasses)
	const rootNote = getNearestMidiNote(tonic, rootPitchClass)
	const allowedPitchClasses = new Set(pitchClasses)
	const targetVoiceCount = normaliseVoiceCount(voiceCount)
	const selectedNotes = []
	const selectedNoteNumbers = new Set()

	for (const interval of intervals)
	{
		const desiredNote = rootNote + interval
		const desiredPitchClass = ((desiredNote % 12) + 12) % 12
		const note = MIDI_NOTE_NUMBER_MAP[desiredNote]
		if (!allowedPitchClasses.has(desiredPitchClass) || !note || selectedNoteNumbers.has(desiredNote))
		{
			continue
		}

		selectedNotes.push(note)
		selectedNoteNumbers.add(desiredNote)
		if (selectedNotes.length === targetVoiceCount)
		{
			return selectedNotes
		}
	}

	const degreeOffsets = Array.from({ length:targetVoiceCount }, (_, index) => index * 2)
	const diatonicFallback = getDiatonicChordInKey(tonic, key, scale, degreeOffsets)
	for (const note of diatonicFallback)
	{
		if (!selectedNoteNumbers.has(note.noteNumber))
		{
			selectedNotes.push(note)
			selectedNoteNumbers.add(note.noteNumber)
		}
		if (selectedNotes.length === targetVoiceCount)
		{
			break
		}
	}

	return selectedNotes
		.sort((a, b) => a.noteNumber - b.noteNumber)
		.slice(0, targetVoiceCount)
}

export const getDiatonicChordInKey = (tonic, key=0, scale="MAJOR_SCALE", degreeOffsets=DIATONIC_TRIAD_INTERVALS) => {
	const { pitchClasses } = getScaleContext(key, scale)
	const tonicPitchClass = tonic % 12
	const rootPitchClass = getNearestPitchClass(tonicPitchClass, pitchClasses)
	const rootNote = getNearestMidiNote(tonic, rootPitchClass)
	const rootDegree = pitchClasses.indexOf(rootPitchClass)

	return degreeOffsets.map(degreeOffset => {
		const targetDegree = rootDegree + degreeOffset
		const pitchClass = pitchClasses[targetDegree % pitchClasses.length]
		const octaveOffset = Math.floor(degreeOffset / pitchClasses.length) * 12
		const noteNumber = getMidiNoteAtOrAbove(rootNote, pitchClass) + octaveOffset
		return MIDI_NOTE_NUMBER_MAP[noteNumber]
	}).filter(Boolean)
}

/**
 * Pass in an emoji and a tonic get out the chord in the
 * scale that best matches the emotion behind the emoji
 * 
 * @param {Number} tonic 
 * @param {String} emoji 
 */
export const getMusicalDetailsFromEmoji = (tonic, emoji, includeTonic=true, harmonyOptions={}) => {
	const selectedProfile = selectEmotionalProfileForEmoji(tonic, emoji, harmonyOptions.previousChord, harmonyOptions)
	const voiceCount = getVoiceCountForEmoji(emoji)
	if (harmonyOptions.harmonyMode === HARMONY_MODE_GLOBAL_KEY)
	{
		const intervals = selectedProfile?.candidateIntervals ?? CHROMATIC_MAJOR_TRIAD_INTERVALS
		const cacheKey = `${tonic}|${emoji}|${harmonyOptions.tonic}|${harmonyOptions.keyScale}|${voiceCount}|${intervals.join(",")}`
		const cached = globalChordCache.get(cacheKey)
		if (cached)
		{
			return cached
		}
		const chord = getChordFromIntervalsInKey(tonic, harmonyOptions.tonic, harmonyOptions.keyScale, intervals, voiceCount)
		if (globalChordCache.size > MAX_GLOBAL_CHORD_CACHE_SIZE)
		{
			globalChordCache.clear()
		}
		globalChordCache.set(cacheKey, chord)
		return chord
	}
	
	if (selectedProfile)
	{
		return getResolvedNotesForProfile(tonic, selectedProfile, voiceCount)
	}

	// Create all relevant scales
	const notes = getAllChordsForNoteNumber(tonic)
	const mode = getTuningModeForEmoji(emoji)

	// Get major chord scale and select the mode from it
	const majorChords = notes.get(SCALE_MAJOR)
	const chords = majorChords ? majorChords.get(mode) : null

	// console.log("getMusicalDetailsFromEmoji", {tonic, emoji, mode, chords})
	
	if (includeTonic)
	{

	}

	if (!chords){
		console.error("Sing: No chords found for", {tonic, emoji, mode})
		return null
	}
	
	return chords
}
