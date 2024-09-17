
// [General MIDI Level 1.0 Instrument Patch Map](https://www.midi.org/specifications/item/gm-level-1-sound-set)
// [General MIDI Level 2.0 Instrument Patch Map](http://cs.uccs.edu/~cs525/midi/midi.html)

import { GENERAL_MIDI_INSTRUMENT_NAMES } from "./general-midi-instrument.constants"

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


export const GENERAL_MIDI_INSTRUMENT_FAMILY_NAMES = [
	"piano",
	"chromatic percussion",
	"organ",
	"guitar",
	"bass",
	"strings",
	"ensemble",
	"brass",
	"reed",
	"pipe",
	"synth lead",
	"synth pad",
	"synth effects",
	"ethnic",
	"percussive",
	"sound effects",
]

export const GENERAL_MIDI_INSTRUMENT_FAMILY_NAMES_FRIENDLY = [
	"Piano",
	"Chromatic Percussion",
	"Organ",
	"Guitar",
	"Bass",
	"Strings",
	"Ensemble",
	"Brass",
	"Reed",
	"Pipe",
	"Synth Lead",
	"Synth Pad",
	"Synth Effects",
	"Ethnic",
	"Percussive",
	"Sound Effects",
]

export const GENERAL_MIDI_INSTRUMENT_FAMILY_IDS = {
	0: "Piano",
	7: "Chromatic percussion",
	12: "Organ",
	25: "Guitar",
	33: "Bass",
	41: "Strings",
	49: "Ensemble",
	57: "Brass",
	65: "Reed",
	69: "Pipe",
	81: "Synth lead",
	89: "Synth pad",
	97: "Synth effects",
	// some rasict shit right here akin to "world" music
	105: "Ethnic",
	113: "Percussive",
	123: "Sound effects"
}

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

	GENERAL_MIDI_FAMILIES.set( latch, [...(GENERAL_MIDI_FAMILIES.get(latch) || []), instrument] )
	GENERAL_MIDI_FAMILY_DICTIONARY[instrument] = latch
})
