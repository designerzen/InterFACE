/**
 * Tom drum presets
 *
 * Range of toms from low/floor to high/rack, plus electronic toms (808/909),
 * timbale-style, jungle/DnB toms, hand-drum / tribal flavours and tuned
 * melodic toms.
 */

export const DEFAULT_TOM_OPTIONS = {
	name:"Default Tom",
	velocity:1,
	length:0.15,
	attack:0.0001,
	decay:0.01,
	sustain:0.9,
	release:0.001,

	triStart:110,
	triEnd:50,

	sineStart:120,
	sineApex:150,
	sineSustain:100,
	sineEnd:50,

	triggerAt:0,
}

const preset = (overrides) => Object.assign({}, DEFAULT_TOM_OPTIONS, overrides)

// ============================================================
// ACOUSTIC TOMS - LOW / MID / HIGH / FLOOR / RACK
// ============================================================

export const PRESET_FLOOR_TOM = preset({
	name:"Floor Tom",
	velocity:1.1,
	length:0.85,
	attack:0.001,
	decay:0.06,
	sustain:0.7,
	release:0.5,
	triStart:80,
	triEnd:42,
	sineStart:90,
	sineApex:75,
	sineSustain:55,
	sineEnd:38,
})

export const PRESET_LOW_TOM = preset({
	name:"Low Tom",
	velocity:1.0,
	length:0.65,
	attack:0.001,
	decay:0.04,
	sustain:0.7,
	release:0.4,
	triStart:110,
	triEnd:55,
	sineStart:130,
	sineApex:100,
	sineSustain:75,
	sineEnd:50,
})

export const PRESET_MID_TOM = preset({
	name:"Mid Tom",
	velocity:1.0,
	length:0.45,
	attack:0.0008,
	decay:0.03,
	sustain:0.72,
	release:0.28,
	triStart:160,
	triEnd:80,
	sineStart:185,
	sineApex:140,
	sineSustain:100,
	sineEnd:70,
})

export const PRESET_HIGH_TOM = preset({
	name:"High Tom",
	velocity:1.0,
	length:0.35,
	attack:0.0005,
	decay:0.025,
	sustain:0.75,
	release:0.22,
	triStart:220,
	triEnd:115,
	sineStart:260,
	sineApex:200,
	sineSustain:140,
	sineEnd:100,
})

export const PRESET_RACK_TOM = preset({
	name:"Rack Tom",
	velocity:1.05,
	length:0.4,
	attack:0.0008,
	decay:0.028,
	sustain:0.74,
	release:0.26,
	triStart:200,
	triEnd:100,
	sineStart:230,
	sineApex:170,
	sineSustain:120,
	sineEnd:88,
})

export const PRESET_DEEP_LOW_TOM = preset({
	name:"Deep Low Tom",
	velocity:1.0,
	length:1.08,
	attack:0.01,
	decay:0.03,
	sustain:0.61,
	release:0.832,
	triStart:53,
	triEnd:37,
	sineStart:63,
	sineApex:18,
	sineSustain:60,
	sineEnd:200,
})

// ============================================================
// ELECTRONIC / DRUM MACHINE TOMS
// ============================================================

export const PRESET_808_LOW_TOM = preset({
	name:"808 Low Tom",
	velocity:1.0,
	length:0.7,
	attack:0.001,
	decay:0.04,
	sustain:0.78,
	release:0.5,
	triStart:90,
	triEnd:38,
	sineStart:105,
	sineApex:75,
	sineSustain:55,
	sineEnd:32,
})

export const PRESET_808_MID_TOM = preset({
	name:"808 Mid Tom",
	velocity:1.0,
	length:0.55,
	attack:0.0008,
	decay:0.035,
	sustain:0.78,
	release:0.4,
	triStart:140,
	triEnd:60,
	sineStart:160,
	sineApex:115,
	sineSustain:80,
	sineEnd:50,
})

export const PRESET_808_HIGH_TOM = preset({
	name:"808 High Tom",
	velocity:1.0,
	length:0.4,
	attack:0.0005,
	decay:0.03,
	sustain:0.78,
	release:0.28,
	triStart:200,
	triEnd:90,
	sineStart:230,
	sineApex:165,
	sineSustain:120,
	sineEnd:80,
})

export const PRESET_909_LOW_TOM = preset({
	name:"909 Low Tom",
	velocity:1.05,
	length:0.45,
	attack:0.0005,
	decay:0.025,
	sustain:0.82,
	release:0.3,
	triStart:120,
	triEnd:55,
	sineStart:140,
	sineApex:100,
	sineSustain:70,
	sineEnd:45,
})

export const PRESET_909_HIGH_TOM = preset({
	name:"909 High Tom",
	velocity:1.05,
	length:0.3,
	attack:0.0004,
	decay:0.02,
	sustain:0.85,
	release:0.18,
	triStart:230,
	triEnd:100,
	sineStart:270,
	sineApex:200,
	sineSustain:140,
	sineEnd:90,
})

export const PRESET_LINN_TOM = preset({
	name:"LinnDrum Tom",
	velocity:1.0,
	length:0.35,
	attack:0.001,
	decay:0.03,
	sustain:0.7,
	release:0.22,
	triStart:160,
	triEnd:80,
	sineStart:185,
	sineApex:135,
	sineSustain:95,
	sineEnd:65,
})

// ============================================================
// GENRE-SPECIFIC
// ============================================================

export const PRESET_TECH_HOUSE_TOM = preset({
	name:"Tech House Tom",
	velocity:1,
	length:0.07,
	attack:0.0001,
	decay:0.005,
	sustain:0.8,
	release:0.01,
	triStart:90,
	triEnd:50,
	sineStart:80,
	sineApex:130,
	sineSustain:90,
	sineEnd:20,
})

export const PRESET_BEEFY_TOM = preset({
	name:"Beefy Tom",
	velocity:1.2,
	length:0.05,
	attack:0.001,
	decay:0.005,
	sustain:0.94,
	release:0.01,
	triStart:90,
	triEnd:50,
	sineStart:80,
	sineApex:100,
	sineSustain:90,
	sineEnd:20,
})

export const PRESET_TRIBAL_TOM = preset({
	name:"Tribal Tom",
	velocity:1.1,
	length:0.7,
	attack:0.002,
	decay:0.05,
	sustain:0.65,
	release:0.45,
	triStart:130,
	triEnd:60,
	sineStart:150,
	sineApex:105,
	sineSustain:75,
	sineEnd:48,
})

export const PRESET_TIMBALE_TOM = preset({
	name:"Timbale Tom",
	velocity:1.15,
	length:0.18,
	attack:0.0003,
	decay:0.012,
	sustain:0.85,
	release:0.1,
	triStart:340,
	triEnd:170,
	sineStart:380,
	sineApex:280,
	sineSustain:200,
	sineEnd:140,
})

export const PRESET_CONGA_TOM = preset({
	name:"Conga-style Tom",
	velocity:1.0,
	length:0.32,
	attack:0.0008,
	decay:0.022,
	sustain:0.72,
	release:0.2,
	triStart:230,
	triEnd:130,
	sineStart:265,
	sineApex:200,
	sineSustain:150,
	sineEnd:115,
})

export const PRESET_BONGO_TOM = preset({
	name:"Bongo-style Tom",
	velocity:1.0,
	length:0.18,
	attack:0.0004,
	decay:0.014,
	sustain:0.7,
	release:0.1,
	triStart:340,
	triEnd:200,
	sineStart:390,
	sineApex:300,
	sineSustain:220,
	sineEnd:170,
})

export const PRESET_JUNGLE_TOM = preset({
	name:"Jungle Tom",
	velocity:1.2,
	length:0.22,
	attack:0.0003,
	decay:0.014,
	sustain:0.85,
	release:0.13,
	triStart:170,
	triEnd:78,
	sineStart:200,
	sineApex:155,
	sineSustain:108,
	sineEnd:65,
})

export const PRESET_DNB_TOM = preset({
	name:"Drum & Bass Tom",
	velocity:1.2,
	length:0.18,
	attack:0.0002,
	decay:0.012,
	sustain:0.88,
	release:0.1,
	triStart:190,
	triEnd:90,
	sineStart:225,
	sineApex:180,
	sineSustain:120,
	sineEnd:75,
})

export const PRESET_TRAP_TOM = preset({
	name:"Trap Tom",
	velocity:1.05,
	length:0.95,
	attack:0.001,
	decay:0.045,
	sustain:0.78,
	release:0.7,
	triStart:130,
	triEnd:35,
	sineStart:150,
	sineApex:90,
	sineSustain:55,
	sineEnd:30,
})

// ============================================================
// CHARACTER / EXPERIMENTAL
// ============================================================

export const PRESET_LOFI_TOM = preset({
	name:"Lo-Fi Tom",
	velocity:0.85,
	length:0.5,
	attack:0.004,
	decay:0.05,
	sustain:0.6,
	release:0.32,
	triStart:130,
	triEnd:55,
	sineStart:150,
	sineApex:100,
	sineSustain:70,
	sineEnd:45,
})

export const PRESET_AMBIENT_TOM = preset({
	name:"Ambient Tom",
	velocity:0.75,
	length:1.6,
	attack:0.02,
	decay:0.12,
	sustain:0.5,
	release:1.2,
	triStart:100,
	triEnd:42,
	sineStart:115,
	sineApex:75,
	sineSustain:55,
	sineEnd:32,
})

export const PRESET_CINEMATIC_TOM = preset({
	name:"Cinematic Tom",
	velocity:1.5,
	length:1.8,
	attack:0.005,
	decay:0.1,
	sustain:0.85,
	release:1.4,
	triStart:90,
	triEnd:38,
	sineStart:105,
	sineApex:170,
	sineSustain:65,
	sineEnd:30,
})

export const PRESET_DISTORTED_TOM = preset({
	name:"Distorted Tom",
	velocity:2.4,
	length:0.4,
	attack:0.0002,
	decay:0.012,
	sustain:0.95,
	release:0.25,
	triStart:160,
	triEnd:60,
	sineStart:200,
	sineApex:280,
	sineSustain:110,
	sineEnd:48,
})

export const PRESET_TIGHT_TOM = preset({
	name:"Tight Tom",
	velocity:1.05,
	length:0.18,
	attack:0.0004,
	decay:0.012,
	sustain:0.82,
	release:0.1,
	triStart:200,
	triEnd:100,
	sineStart:230,
	sineApex:170,
	sineSustain:120,
	sineEnd:85,
})

export const PRESET_THUD_TOM = preset({
	name:"Thud Tom",
	velocity:2.3,
	length:2.1,
	attack:0.01,
	decay:0.25,
	sustain:0.77,
	release:0.789,
	triStart:63,
	triEnd:37,
	sineStart:209,
	sineApex:317,
	sineSustain:14,
	sineEnd:76,
})

export const PRESET_RAVE_TOM = preset({
	name:"Rave Tom",
	velocity:1.3,
	length:0.3,
	attack:0.0001,
	decay:0.012,
	sustain:0.93,
	release:0.18,
	triStart:170,
	triEnd:75,
	sineStart:210,
	sineApex:280,
	sineSustain:120,
	sineEnd:55,
})

// ============================================================
// COLLECTIONS
// ============================================================

export const PRESETS_TOMS = [
	DEFAULT_TOM_OPTIONS,

	// Acoustic
	PRESET_FLOOR_TOM,
	PRESET_LOW_TOM,
	PRESET_MID_TOM,
	PRESET_HIGH_TOM,
	PRESET_RACK_TOM,
	PRESET_DEEP_LOW_TOM,

	// Drum machine
	PRESET_808_LOW_TOM,
	PRESET_808_MID_TOM,
	PRESET_808_HIGH_TOM,
	PRESET_909_LOW_TOM,
	PRESET_909_HIGH_TOM,
	PRESET_LINN_TOM,

	// Genre-specific
	PRESET_TECH_HOUSE_TOM,
	PRESET_BEEFY_TOM,
	PRESET_TRIBAL_TOM,
	PRESET_TIMBALE_TOM,
	PRESET_CONGA_TOM,
	PRESET_BONGO_TOM,
	PRESET_JUNGLE_TOM,
	PRESET_DNB_TOM,
	PRESET_TRAP_TOM,

	// Character
	PRESET_LOFI_TOM,
	PRESET_AMBIENT_TOM,
	PRESET_CINEMATIC_TOM,
	PRESET_DISTORTED_TOM,
	PRESET_TIGHT_TOM,
	PRESET_THUD_TOM,
	PRESET_RAVE_TOM,
]

export const getRandomKTomPreset = () => {
	const tomIndex = Math.floor(Math.random() * PRESETS_TOMS.length)
	return PRESETS_TOMS[tomIndex]
}

// preferred name (typo-free) - keep both available
export const getRandomTomPreset = getRandomKTomPreset

export const getTomPresets = () => PRESETS_TOMS.slice()
