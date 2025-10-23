
// [General MIDI Level 1.0 Instrument Patch Map](https://www.midi.org/specifications/item/gm-level-1-sound-set)
// [General MIDI Level 2.0 Instrument Patch Map](http://cs.uccs.edu/~cs525/midi/midi.html)

import { FAMILY_BASS, FAMILY_BRASS, FAMILY_CHROMATIC_PERCUSSION, FAMILY_ENSEMBLE, FAMILY_ETHNIC, FAMILY_GUITAR, FAMILY_ORGAN, FAMILY_PERCUSSIVE, FAMILY_PIANO, FAMILY_PIPE, FAMILY_REED, FAMILY_SOUND_FX, FAMILY_STRINGS, FAMILY_SYNTH_EFFECTS, FAMILY_SYNTH_LEAD, FAMILY_SYNTH_PAD, GENERAL_MIDI_INSTRUMENT_NAMES } from "./general-midi-instrument.constants"

/*
General MIDI Level 1 Instrument Families

The General MIDI Level 1 instrument sounds are grouped by families.
In each family are 8 specific instruments.

PC# 	Family Name
1-8 	Piano
9-16 	Chromatic Percussion
17-24 	Organ
25-32 	Guitar
33-40 	Bass
41-48 	Strings
49-56 	Ensemble
57-64 	Brass
65-72 	Reed
73-80 	Pipe
81-88 	Synth Lead
89-96 	Synth Pad
97-104 	Synth Effects
105-112 Ethnic
113-120 Percussive
121-128 Sound Effects

While many current instruments also have additional sounds above or below the range show here,
and may even have additional "kits" with variations of these sounds, only these sounds are supported
by General MIDI Level 1 devices.

*/
export const GENERAL_MIDI_INSTRUMENTS = [
	"acoustic grand piano",
	"bright acoustic piano",
	"electric grand piano",
	"honky-tonk piano",
	"electric piano 1",
	"electric piano 2",
	"harpsichord",
	"clavi",
	"celesta",
	"glockenspiel",
	"music box",
	"vibraphone",
	"marimba",
	"xylophone",
	"tubular bells",
	"dulcimer",
	"drawbar organ",
	"percussive organ",
	"rock organ",
	"church organ",
	"reed organ",
	"accordion",
	"harmonica",
	"tango accordion",
	"acoustic guitar (nylon)",
	"acoustic guitar (steel)",
	"electric guitar (jazz)",
	"electric guitar (clean)",
	"electric guitar (muted)",
	"overdriven guitar",
	"distortion guitar",
	"guitar harmonics",
	"acoustic bass",
	"electric bass (finger)",
	"electric bass (pick)",
	"fretless bass",
	"slap bass 1",
	"slap bass 2",
	"synth bass 1",
	"synth bass 2",
	"violin",
	"viola",
	"cello",
	"contrabass",
	"tremolo strings",
	"pizzicato strings",
	"orchestral harp",
	"timpani",
	"string ensemble 1",
	"string ensemble 2",
	"synthstrings 1",
	"synthstrings 2",
	"choir aahs",
	"voice oohs",
	"synth voice",
	"orchestra hit",
	"trumpet",
	"trombone",
	"tuba",
	"muted trumpet",
	"french horn",
	"brass section",
	"synthbrass 1",
	"synthbrass 2",
	"soprano sax",
	"alto sax",
	"tenor sax",
	"baritone sax",
	"oboe",
	"english horn",
	"bassoon",
	"clarinet",
	"piccolo",
	"flute",
	"recorder",
	"pan flute",
	"blown bottle",
	"shakuhachi",
	"whistle",
	"ocarina",
	"lead 1 (square)",
	"lead 2 (sawtooth)",
	"lead 3 (calliope)",
	"lead 4 (chiff)",
	"lead 5 (charang)",
	"lead 6 (voice)",
	"lead 7 (fifths)",
	"lead 8 (bass + lead)",
	"pad 1 (new age)",
	"pad 2 (warm)",
	"pad 3 (polysynth)",
	"pad 4 (choir)",
	"pad 5 (bowed)",
	"pad 6 (metallic)",
	"pad 7 (halo)",
	"pad 8 (sweep)",
	"fx 1 (rain)",
	"fx 2 (soundtrack)",
	"fx 3 (crystal)",
	"fx 4 (atmosphere)",
	"fx 5 (brightness)",
	"fx 6 (goblins)",
	"fx 7 (echoes)",
	"fx 8 (sci-fi)",
	"sitar",
	"banjo",
	"shamisen",
	"koto",
	"kalimba",
	"bag pipe",
	"fiddle",
	"shanai",
	"tinkle bell",
	"agogo",
	"steel drums",
	"woodblock",
	"taiko drum",
	"melodic tom",
	"synth drum",
	"reverse cymbal",
	"guitar fret noise",
	"breath noise",
	"seashore",
	"bird tweet",
	"telephone ring",
	"helicopter",
	"applause",
	"gunshot"
]

export const GENERAL_MIDI_INSTRUMENTS_FRIENDLY = GENERAL_MIDI_INSTRUMENT_NAMES

// NB. These are actually General MIDI instrument names
// but we can't use them as certain folders are misnamed
export const SOUNDFONT_DEFAULT_INSTRUMENT_FOLDERS = [
	"acoustic_grand_piano",
	"bright_acoustic_piano",
	"electric_grand_piano",
	"honkytonk_piano",
	"electric_piano_1",
	"electric_piano_2",
	"harpsichord",
	"clavinet",
	"celesta",
	"glockenspiel",
	"music_box",
	"vibraphone",
	"marimba",
	"xylophone",
	"tubular_bells",
	"dulcimer",
	"drawbar_organ",
	"percussive_organ",
	"rock_organ",
	"church_organ",
	"reed_organ",
	"accordion",
	"harmonica",
	"tango_accordion",
	"acoustic_guitar_nylon",
	"acoustic_guitar_steel",
	"electric_guitar_jazz",
	"electric_guitar_clean",
	"electric_guitar_muted",
	"overdriven_guitar",
	"distortion_guitar",
	"guitar_harmonics",
	"acoustic_bass",
	"electric_bass_finger",
	"electric_bass_pick",
	"fretless_bass",
	"slap_bass_1",
	"slap_bass_2",
	"synth_bass_1",
	"synth_bass_2",
	"violin",
	"viola",
	"cello",
	"contrabass",
	"tremolo_strings",
	"pizzicato_strings",
	"orchestral_harp",
	"timpani",
	"string_ensemble_1",
	"string_ensemble_2",
	"synth_strings_1",
	"synth_strings_2",
	"choir_aahs",
	"voice_oohs",
	"synth_choir",
	"orchestra_hit",
	"trumpet",
	"trombone",
	"tuba",
	"muted_trumpet",
	"french_horn",
	"brass_section",
	"synth_brass_1",
	"synth_brass_2",
	"soprano_sax",
	"alto_sax",
	"tenor_sax",
	"baritone_sax",
	"oboe",
	"english_horn",
	"bassoon",
	"clarinet",
	"piccolo",
	"flute",
	"recorder",
	"pan_flute",
	"blown_bottle",
	"shakuhachi",
	"whistle",
	"ocarina",
	"lead_1_square",
	"lead_2_sawtooth",
	"lead_3_calliope",
	"lead_4_chiff",
	"lead_5_charang",
	"lead_6_voice",
	"lead_7_fifths",
	"lead_8_bass__lead",
	"pad_1_new_age",
	"pad_2_warm",
	"pad_3_polysynth",
	"pad_4_choir",
	"pad_5_bowed",
	"pad_6_metallic",
	"pad_7_halo",
	"pad_8_sweep",
	"fx_1_rain",
	"fx_2_soundtrack",
	"fx_3_crystal",
	"fx_4_atmosphere",
	"fx_5_brightness",
	"fx_6_goblins",
	"fx_7_echoes",
	"fx_8_scifi",
	"sitar",
	"banjo",
	"shamisen",
	"koto",
	"kalimba",
	"bagpipe",
	"fiddle",
	"shanai",
	"tinkle_bell",
	"agogo",
	"steel_drums",
	"woodblock",
	"taiko_drum",
	"melodic_tom",
	"synth_drum",
	"reverse_cymbal",
	"guitar_fret_noise",
	"breath_noise",
	"seashore",
	"bird_tweet",
	"telephone_ring",
	"helicopter",
	"applause",
	"gunshot"
]

export const GENERAL_MIDI_INSTRUMENT_FAMILY_NAMES_FRIENDLY = [
	FAMILY_PIANO,
	FAMILY_CHROMATIC_PERCUSSION,
	FAMILY_ORGAN,
	FAMILY_GUITAR,
	FAMILY_BASS,
	FAMILY_STRINGS,
	FAMILY_ENSEMBLE,
	FAMILY_BRASS,
	FAMILY_REED,
	FAMILY_PIPE,
	FAMILY_SYNTH_LEAD,
	FAMILY_SYNTH_PAD,
	FAMILY_SYNTH_EFFECTS,
	FAMILY_ETHNIC,
	FAMILY_PERCUSSIVE,
	FAMILY_SOUND_FX
]

export const GENERAL_MIDI_INSTRUMENT_FAMILY_NAMES = GENERAL_MIDI_INSTRUMENT_FAMILY_NAMES_FRIENDLY.map( r => r.toLowerCase() )

export const GENERAL_MIDI_INSTRUMENT_FAMILY_IDS = {
	0: FAMILY_PIANO,
	7: FAMILY_CHROMATIC_PERCUSSION,
	12: FAMILY_ORGAN,
	25: FAMILY_GUITAR,
	33: FAMILY_BASS,
	41: FAMILY_STRINGS,
	49: FAMILY_ENSEMBLE,
	57: FAMILY_BRASS,
	65: FAMILY_REED,
	69: FAMILY_PIPE,
	81: FAMILY_SYNTH_LEAD,
	89: FAMILY_SYNTH_PAD,
	97: FAMILY_SYNTH_EFFECTS,
	105: FAMILY_ETHNIC,
	113: FAMILY_PERCUSSIVE,
	123: FAMILY_SOUND_FX
}

export const GENERAL_MIDI_INSTRUMENT_FAMILY_BY_ID = {
	[FAMILY_PIANO]:0,
	[FAMILY_CHROMATIC_PERCUSSION]:7,
	[FAMILY_ORGAN]:12,
	[FAMILY_GUITAR]:25,
	[FAMILY_BASS]:33,
	[FAMILY_STRINGS]:41,
	[FAMILY_ENSEMBLE]:49,
	[FAMILY_BRASS]:57,
	[FAMILY_REED]:65,
	[FAMILY_PIPE]:69,
	[FAMILY_SYNTH_LEAD]:81,
	[FAMILY_SYNTH_PAD]:89,
	[FAMILY_SYNTH_EFFECTS]:97,
	[FAMILY_ETHNIC]:105,
	[FAMILY_PERCUSSIVE]:113,
	[FAMILY_SOUND_FX]:123
}


// const GENERAL_MIDI_GROUPING = new Map()

// GENERAL_MIDI_INSTRUMENTS.map( (key, index) => {
// 	const existing = GENERAL_MIDI_GROUPING.get(key)
// 	GENERAL_MIDI_GROUPING.set( key, existing ? [...existing, index] : [index] )
// })


export const GENERAL_MIDI_INSTRUMENT_LIST = []

export const GENERAL_MIDI_FAMILIES = new Map()
export const GENERAL_MIDI_LIBRARY = new Map()

// This creates a Map of instument arrays
export const GENERAL_MIDI_INSTRUMENT_FAMILIES = {}
export const GENERAL_MIDI_FAMILY_DICTIONARY = {}

let latch = GENERAL_MIDI_INSTRUMENT_FAMILY_IDS[0]
GENERAL_MIDI_INSTRUMENTS.forEach( (instrument, index) => {
	
	const title = GENERAL_MIDI_INSTRUMENTS_FRIENDLY[index]
	const location = SOUNDFONT_DEFAULT_INSTRUMENT_FOLDERS[index]

	if (GENERAL_MIDI_INSTRUMENT_FAMILY_IDS[index])
	{
		latch = GENERAL_MIDI_INSTRUMENT_FAMILY_IDS[index]
	}

	// GENERAL_MIDI_INSTRUMENT_FAMILY_IDS[index]
	GENERAL_MIDI_LIBRARY.set( index, {
		index,
		instrument,
		title,
		location
	})
	
	GENERAL_MIDI_INSTRUMENT_LIST[index] = {
		family:latch,
		location,
		name:title
	}

	// GENERAL_MIDI_GROUPING.set()
	GENERAL_MIDI_FAMILIES.set( latch, [...(GENERAL_MIDI_FAMILIES.get(latch) || []), instrument] )
	GENERAL_MIDI_FAMILY_DICTIONARY[instrument] = latch
})


export const CONTROL_CHANGE = {
    0: "Bank Select MSB",
    1: "Modulation Wheel or Lever MSB",
    2: "Breath Controller MSB",
    3: "Undefined",
    4: "Foot Controller MSB",
    5: "Portamento Time MSB",
    6: "Data Entry MSB",
    7: "Channel Volume (formerly Main Volume) MSB",
    8: "Balance MSB",
    9: "Undefined",
    10: "Pan MSB",
    11: "Expression Controller MSB",
    12: "Effect Control 1 MSB",
    13: "Effect Control 2 MSB",
    14: "Undefined",
    15: "Undefined",
    16: "General Purpose Controller 1 MSB",
    17: "General Purpose Controller 2 MSB",
    18: "General Purpose Controller 3 MSB",
    19: "General Purpose Controller 4 MSB",
    20: "Undefined",
    21: "Undefined",
    22: "Undefined",
    23: "Undefined",
    24: "Undefined",
    25: "Undefined",
    26: "Undefined",
    27: "Undefined",
    28: "Undefined",
    29: "Undefined",
    30: "Undefined",
    31: "Undefined",
    32: "LSB for Control 0 (Bank Select)",
    33: "LSB for Control 1 (Modulation Wheel or Lever)",
    34: "LSB for Control 2 (Breath Controller)",
    35: "LSB for Control 3 (Undefined)",
    36: "LSB for Control 4 (Foot Controller)",
    37: "LSB for Control 5 (Portamento Time)",
    38: "LSB for Control 6 (Data Entry)",
    39: "LSB for Control 7 (Channel Volume, formerly Main Volume)",
    40: "LSB for Control 8 (Balance)",
    41: "LSB for Control 9 (Undefined)",
    42: "LSB for Control 10 (Pan)",
    43: "LSB for Control 11 (Expression Controller)",
    44: "LSB for Control 12 (Effect Control 1)",
    45: "LSB for Control 13 (Effect Control 2)",
    46: "LSB for Control 14 (Undefined)",
    47: "LSB for Control 15 (Undefined)",
    48: "LSB for Control 16 (General Purpose Controller 1)",
    49: "LSB for Control 17 (General Purpose Controller 2)",
    50: "LSB for Control 18 (General Purpose Controller 3)",
    51: "LSB for Control 19 (General Purpose Controller 4)",
    52: "LSB for Control 20 (Undefined)",
    53: "LSB for Control 21 (Undefined)",
    54: "LSB for Control 22 (Undefined)",
    55: "LSB for Control 23 (Undefined)",
    56: "LSB for Control 24 (Undefined)",
    57: "LSB for Control 25 (Undefined)",
    58: "LSB for Control 26 (Undefined)",
    59: "LSB for Control 27 (Undefined)",
    60: "LSB for Control 28 (Undefined)",
    61: "LSB for Control 29 (Undefined)",
    62: "LSB for Control 30 (Undefined)",
    63: "LSB for Control 31 (Undefined)",
    64: "Damper Pedal on/off (Sustain) ≤63 off, ≥64 on",
    65: "Portamento On/Off ≤63 off, ≥64 on",
    66: "Sostenuto On/Off ≤63 off, ≥64 on",
    67: "Soft Pedal On/Off ≤63 off, ≥64 on",
    68: "Legato Footswitch ≤63 Normal, ≥64 Legato",
    69: "Hold 2 ≤63 off, ≥64 on",
    70: "Sound Controller 1 (default: Sound Variation)",
    71: "Sound Controller 2 (default: Timbre/Harmonic Intens.)",
    72: "Sound Controller 3 (default: Release Time)",
    73: "Sound Controller 4 (default: Attack Time)",
    74: "Sound Controller 5 (default: Brightness)",
    75: "Sound Controller 6 (default: Decay Time)",
    76: "Sound Controller 7 (default: Vibrato Rate)",
    77: "Sound Controller 8 (default: Vibrato Depth)",
    78: "Sound Controller 9 (default: Vibrato Delay)",
    79: "Sound Controller 10 (default undefined)",
    80: "General Purpose Controller 5",
    81: "General Purpose Controller 6",
    82: "General Purpose Controller 7",
    83: "General Purpose Controller 8",
    84: "Portamento Control",
    85: "Undefined",
    86: "Undefined",
    87: "Undefined",
    88: "High Resolution Velocity Prefix",
    89: "Undefined",
    90: "Undefined",
    91: "Effects 1 Depth (default: Reverb Send Level)",
    92: "Effects 2 Depth (formerly Tremolo Depth)",
    93: "Effects 3 Depth (default: Chorus Send Level)",
    94: "Effects 4 Depth (formerly Celeste [Detune] Depth)",
    95: "Effects 5 Depth (formerly Phaser Depth)",
    96: "Data Increment (Data Entry +1)",
    97: "Data Decrement (Data Entry -1)",
    98: "Non-Registered Parameter Number (NRPN) - LSB",
    99: "Non-Registered Parameter Number (NRPN) - MSB",
    100: "Registered Parameter Number (RPN) - LSB",
    101: "Registered Parameter Number (RPN) - MSB",
    102: "Undefined",
    103: "Undefined",
    104: "Undefined",
    105: "Undefined",
    106: "Undefined",
    107: "Undefined",
    108: "Undefined",
    109: "Undefined",
    110: "Undefined",
    111: "Undefined",
    112: "Undefined",
    113: "Undefined",
    114: "Undefined",
    115: "Undefined",
    116: "Undefined",
    117: "Undefined",
    118: "Undefined",
    119: "Undefined",
    120: "[Channel Mode Message] All Sound Off",
    121: "[Channel Mode Message] Reset All Controllers",
    122: "[Channel Mode Message] Local Control On/Off",
    123: "[Channel Mode Message] All Notes Off",
    124: "[Channel Mode Message] Omni Mode Off (+ all notes off)",
    125: "[Channel Mode Message] Omni Mode On (+ all notes off)",
    126: "[Channel Mode Message] Mono Mode On (+ poly off, + all notes off)",
    127: "[Channel Mode Message] Poly Mode On (+ mono off, + all notes off)"
}