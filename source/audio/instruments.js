import { GENERAL_MIDI_INSTRUMENTS, FAMILY_DICTIONARY } from "./midi/general-midi"
// '𝄞',
export const MUSICAL_NOTES = ['♫','𝅗𝅥','𝅘𝅥','𝅘𝅥𝅮','𝅘𝅥𝅯','𝅘𝅥𝅰','𝅘𝅥𝅱','𝅘𝅥𝅲']

export const INSTRUMENT_PACK_FM = "FluidR3_GM"
export const INSTRUMENT_PACK_FATBOY = "FatBoy"
export const INSTRUMENT_PACK_MUSYNGKITE = "MusyngKite"
export const INSTRUMENT_PACKS = [INSTRUMENT_PACK_FM, INSTRUMENT_PACK_FATBOY]

// NB. These are actually General MIDI instrument names
// but we can't use them as certain folders are misnamed
export const DEFAULT_FOLDERS = [
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

// actual instrument folder names
export let instrumentFolders = DEFAULT_FOLDERS.map( instrumentFolder => instrumentFolder+`-mp3`)
// nice names for the above
export let instrumentNames = instrumentFolders.map( (instrument, index) => GENERAL_MIDI_INSTRUMENTS[index] )

// combine those 2 together
const TITLE_DICTIONARY = {}
instrumentFolders.forEach( (name,index) => TITLE_DICTIONARY[name] = instrumentNames[index] )




/**
 * Fetch a random instrument name
 * @returns {String} Instrument Name
 */
 export const getRandomInstrument = () => instrumentFolders[ Math.floor( Math.random() * instrumentFolders.length ) ]


/**
 * Find the family for this instrument
 * @param {String} instrumentName - name of the instrument
 * @returns 
 */
export const getInstrumentFamily = instrumentName => FAMILY_DICTIONARY[instrumentName]

/**
 * 
 * @param {*} instrumentName 
 * @returns 
 */
export const getInstrumentTitle = instrumentName => TITLE_DICTIONARY[instrumentName]


/**
 * Create an Object of all instruments and folders -
 * useful for debugging and understanding connections
 * but also used in the side bar for each user
 * @returns 
 */
export const createInstruments = () => DEFAULT_FOLDERS.map( (folder, index) => {
		const name = GENERAL_MIDI_INSTRUMENTS[index]
		const family = FAMILY_DICTIONARY[name]
		const location = instrumentFolders[index]
		return {
			folder,
			name,
			family,
			location
		}
	}
)

// TODO: Which of these are loops?
// export const LOOPS = []
// export const SINGLE_SHOTS = []

export const instrumentCache = {}
export const fetchInstrument = (name) =>{
	
	// FIXME: Create if it doesn't exist?
	return instrumentCache[name]
}

export const storeInstrument = (name,data) => {
	instrumentCache[name] = data
}

const createPack = (packs, format="mp3") => {
	return packs.map( (instrument, i) => {
		const formatted = `${instrument}-${format}`
		instrumentFolders[i] =formatted
		// FIXME: May not always align...
		instrumentNames[i] = GENERAL_MIDI_INSTRUMENTS[i]
		return formatted
	})
}

/**
 * Load an Data pack from specified JSON file
 * @param {String} packName 
 * @returns 
 */
// This is a way to load in a collection of files from json
export const loadInstrumentDataPack = async ( packName='musyng.json', format="mp3" ) => {
	const url = `./assets/audio/${packName}`
	try{
		const request = await fetch( url )
		const packs = await request.json()
		return createPack( packs, format )
	}catch(error){
		return []
	}	
}

// FIXME: Remove this!
export const getFolderNameForInstrument = name => {
	let index = instrumentFolders.indexOf(name)
	if (index === -1){
		index = instrumentNames.indexOf(name)
	}
	return instrumentFolders[index]
}