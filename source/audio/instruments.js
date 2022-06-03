import { GENERAL_MIDI_INSTRUMENTS  } from "./midi/general-midi"

export const MUSICAL_NOTES = ['♫','𝅗𝅥','𝅘𝅥','𝅘𝅥𝅮','𝅘𝅥𝅯','𝅘𝅥𝅰','𝅘𝅥𝅱','𝅘𝅥𝅲']
// '𝄞',

export const INSTRUMENT_PACK_FM = "FluidR3_GM"
export const INSTRUMENT_PACK_FATBOY = "FatBoy"
export const INSTRUMENT_PACK_MUSYNGKITE = "MusyngKite"
export const INSTRUMENT_PACKS = [INSTRUMENT_PACK_FM, INSTRUMENT_PACK_FATBOY]

// defaults
export let instrumentFolders = [
	"accordion-mp3",
	"acoustic_bass-mp3",
	"acoustic_grand_piano-mp3",
	"acoustic_guitar_nylon-mp3",
	"acoustic_guitar_steel-mp3",
	"agogo-mp3",
	"alto_sax-mp3",
	"applause-mp3",
	"bagpipe-mp3",
	"banjo-mp3",
	"baritone_sax-mp3",
	"bassoon-mp3",
	"bird_tweet-mp3",
	"blown_bottle-mp3",
	"brass_section-mp3",
	"breath_noise-mp3",
	"bright_acoustic_piano-mp3",
	"celesta-mp3",
	"cello-mp3",
	"choir_aahs-mp3",
	"church_organ-mp3",
	"clarinet-mp3",
	"clavinet-mp3",
	"contrabass-mp3",
	"distortion_guitar-mp3",
	"drawbar_organ-mp3",
	"dulcimer-mp3",
	"electric_bass_finger-mp3",
	"electric_bass_pick-mp3",
	"electric_grand_piano-mp3",
	"electric_guitar_clean-mp3",
	"electric_guitar_jazz-mp3",
	"electric_guitar_muted-mp3",
	"electric_piano_1-mp3",
	"electric_piano_2-mp3",
	"english_horn-mp3",
	"fiddle-mp3",
	"flute-mp3",
	"french_horn-mp3",
	"fretless_bass-mp3",
	"fx_1_rain-mp3",
	"fx_2_soundtrack-mp3",
	"fx_3_crystal-mp3",
	"fx_4_atmosphere-mp3",
	"fx_5_brightness-mp3",
	"fx_6_goblins-mp3",
	"fx_7_echoes-mp3",
	"fx_8_scifi-mp3",
	"glockenspiel-mp3",
	"guitar_fret_noise-mp3",
	"guitar_harmonics-mp3",
	"gunshot-mp3",
	"harmonica-mp3",
	"harpsichord-mp3",
	"helicopter-mp3",
	"honkytonk_piano-mp3",
	"kalimba-mp3",
	"koto-mp3",
	"lead_1_square-mp3",
	"lead_2_sawtooth-mp3",
	"lead_3_calliope-mp3",
	"lead_4_chiff-mp3",
	"lead_5_charang-mp3",
	"lead_6_voice-mp3",
	"lead_7_fifths-mp3",
	"lead_8_bass__lead-mp3",
	"marimba-mp3",
	"melodic_tom-mp3",
	"music_box-mp3",
	"muted_trumpet-mp3",
	"oboe-mp3",
	"ocarina-mp3",
	"orchestra_hit-mp3",
	"orchestral_harp-mp3",
	"overdriven_guitar-mp3",
	"pad_1_new_age-mp3",
	"pad_2_warm-mp3",
	"pad_3_polysynth-mp3",
	"pad_4_choir-mp3",
	"pad_5_bowed-mp3",
	"pad_6_metallic-mp3",
	"pad_7_halo-mp3",
	"pad_8_sweep-mp3",
	"pan_flute-mp3",
	"percussive_organ-mp3",
	"piccolo-mp3",
	"pizzicato_strings-mp3",
	"recorder-mp3",
	"reed_organ-mp3",
	"reverse_cymbal-mp3",
	"rock_organ-mp3",
	"seashore-mp3",
	"shakuhachi-mp3",
	"shamisen-mp3",
	"shanai-mp3",
	"sitar-mp3",
	"slap_bass_1-mp3",
	"slap_bass_2-mp3",
	"soprano_sax-mp3",
	"steel_drums-mp3",
	"string_ensemble_1-mp3",
	"string_ensemble_2-mp3",
	"synth_bass_1-mp3",
	"synth_bass_2-mp3",
	"synth_brass_1-mp3",
	"synth_brass_2-mp3",
	"synth_choir-mp3",
	"synth_drum-mp3",
	"synth_strings_1-mp3",
	"synth_strings_2-mp3",
	"taiko_drum-mp3",
	"tango_accordion-mp3",
	"telephone_ring-mp3",
	"tenor_sax-mp3",
	"timpani-mp3",
	"tinkle_bell-mp3",
	"tremolo_strings-mp3",
	"trombone-mp3",
	"trumpet-mp3",
	"tuba-mp3",
	"tubular_bells-mp3",
	"vibraphone-mp3",
	"viola-mp3",
	"violin-mp3",
	"voice_oohs-mp3",
	"whistle-mp3",
	"woodblock-mp3",
	"xylophone-mp3"
]



// TODO: Which of these are loops?
// export const LOOPS = []
// export const SINGLE_SHOTS = []

export const cleanTitle = name => name && name.length > 1 ? name.replaceAll("_", " ").replace("-mp3", "") : ''

export let instrumentNames = instrumentFolders.map( instrument => cleanTitle(instrument) )

export const instrumentCache = {}
export const fetchInstrument = (name) =>{
	
	// FIXME: Create if it doesn't exist?
	return instrumentCache[name]
}

export const storeInstrument = (name,data) => {
	instrumentCache[name] = data
}

// This is a way to load in a collection of files from json
export const loadInstrumentDataPack = async ( packName='musyng.json' ) => {
	const url = `./assets/audio/${packName}`
	const request = await fetch( url )
	const packs = await request.json()
	return packs.map( (instrument, i) => {
		instrumentFolders[i] = `${instrument}-mp3`
		instrumentNames[i] = GENERAL_MIDI_INSTRUMENTS[i]
		return `${instrument}-mp3`
	})
}


export const getFolderNameForInstrument = name => {
	let index = instrumentFolders.indexOf(name)
	if (index === -1){
		index = instrumentNames.indexOf(name)
	}
	return instrumentFolders[index]
}