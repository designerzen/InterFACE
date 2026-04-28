/**
 * Snare drum presets
 *
 * Wide-ranging snare library covering classic drum machines, acoustic
 * styles, modern electronic genres and experimental textures.  Each preset
 * configures an oscillator (the body) plus bandpass + highpass filtered
 * noise (the rattle).
 */

export const DEFAULT_SNARE_OPTIONS = {
	name:"Default Snare",
	velocity:1,
	length : 0.4,
	// default bandpass filter Q
	bandpassStart:90,
	bandpassEnd:1000,
	// frequency sweep
	triStart:90,
	triEnd:50,
	// filter sweep
	highpassStart:2000,
	highpassEnd:600,

	attack:0.05,
	decay:0.2,

	// type: "square"
	type: "triangle",

	// optional absolute audioContext time to schedule the trigger at
	// (0 / falsy = play immediately at audioContext.currentTime + ZERO)
	triggerAt:0
}

const preset = (overrides) => Object.assign({}, DEFAULT_SNARE_OPTIONS, overrides)

// ============================================================
// CLASSIC DRUM MACHINES
// ============================================================

export const PRESET_808_SNARE = preset({
	name:"808 Snare",
	velocity:1.0,
	length:0.35,
	bandpassStart:1500,
	bandpassEnd:3500,
	triStart:200,
	triEnd:140,
	highpassStart:1200,
	highpassEnd:800,
	attack:0.002,
	decay:0.08,
	type:"triangle",
})

export const PRESET_909_SNARE = preset({
	name:"909 Snare",
	velocity:1.1,
	length:0.32,
	bandpassStart:2000,
	bandpassEnd:5000,
	triStart:240,
	triEnd:170,
	highpassStart:2500,
	highpassEnd:1200,
	attack:0.001,
	decay:0.06,
	type:"triangle",
})

export const PRESET_707_SNARE = preset({
	name:"707 Snare",
	velocity:1.0,
	length:0.28,
	bandpassStart:1800,
	bandpassEnd:4000,
	triStart:220,
	triEnd:150,
	highpassStart:2000,
	highpassEnd:1000,
	attack:0.001,
	decay:0.05,
	type:"square",
})

export const PRESET_LINN_SNARE = preset({
	name:"LinnDrum Snare",
	velocity:1.0,
	length:0.4,
	bandpassStart:1500,
	bandpassEnd:3500,
	triStart:200,
	triEnd:140,
	highpassStart:1800,
	highpassEnd:900,
	attack:0.003,
	decay:0.08,
	type:"triangle",
})

export const PRESET_CR78_SNARE = preset({
	name:"CR-78 Snare",
	velocity:0.9,
	length:0.18,
	bandpassStart:2200,
	bandpassEnd:4500,
	triStart:240,
	triEnd:160,
	highpassStart:2500,
	highpassEnd:1500,
	attack:0.002,
	decay:0.04,
	type:"triangle",
})

// ============================================================
// ACOUSTIC / NATURAL
// ============================================================

export const PRESET_ACOUSTIC_SNARE = preset({
	name:"Acoustic Snare",
	velocity:1.0,
	length:0.3,
	bandpassStart:1200,
	bandpassEnd:3200,
	triStart:180,
	triEnd:120,
	highpassStart:1500,
	highpassEnd:700,
	attack:0.005,
	decay:0.1,
	type:"triangle",
})

export const PRESET_PICCOLO_SNARE = preset({
	name:"Piccolo Snare",
	velocity:1.0,
	length:0.18,
	bandpassStart:2500,
	bandpassEnd:6000,
	triStart:280,
	triEnd:200,
	highpassStart:3000,
	highpassEnd:1500,
	attack:0.001,
	decay:0.04,
	type:"triangle",
})

export const PRESET_BRUSH_SNARE = preset({
	name:"Brushed Snare",
	velocity:0.65,
	length:0.55,
	bandpassStart:3000,
	bandpassEnd:6000,
	triStart:160,
	triEnd:100,
	highpassStart:4000,
	highpassEnd:2000,
	attack:0.04,
	decay:0.25,
	type:"triangle",
})

export const PRESET_BIG_ROOM_SNARE = preset({
	name:"Big Room Snare",
	velocity:1.2,
	length:0.85,
	bandpassStart:1500,
	bandpassEnd:3500,
	triStart:200,
	triEnd:130,
	highpassStart:1500,
	highpassEnd:600,
	attack:0.008,
	decay:0.18,
	type:"triangle",
})

export const PRESET_GATED_SNARE = preset({
	name:"Gated Reverb Snare",
	velocity:1.3,
	length:0.5,
	bandpassStart:1800,
	bandpassEnd:4500,
	triStart:220,
	triEnd:150,
	highpassStart:2000,
	highpassEnd:1000,
	attack:0.002,
	decay:0.04,
	type:"triangle",
})

export const PRESET_RIM_SHOT_SNARE = preset({
	name:"Rim Shot Snare",
	velocity:1.1,
	length:0.12,
	bandpassStart:3000,
	bandpassEnd:5500,
	triStart:320,
	triEnd:240,
	highpassStart:3500,
	highpassEnd:2000,
	attack:0.0005,
	decay:0.025,
	type:"square",
})

// ============================================================
// HEAVY / ELECTRONIC
// ============================================================

export const PRESET_HEAVY_SNARE = preset({
	name:"Heavy Snare",
	velocity:1,
	length:0.9,
	bandpassStart:30,
	bandpassEnd:1400,
	triStart:90,
	triEnd:50,
	highpassStart:2000,
	highpassEnd:600,
	attack:0.07,
	decay:0.05,
	type:"triangle",
})

export const PRESET_LONG_SNARE = preset({
	name:"Long Snare",
	velocity:1,
	length:1.2,
	bandpassStart:90,
	bandpassEnd:1000,
	triStart:90,
	triEnd:50,
	highpassStart:2000,
	highpassEnd:600,
	attack:0.07,
	decay:0.02,
	type:"triangle",
})

export const PRESET_SQUARE_SNARE = preset({
	name:"Square Snare",
	velocity:1,
	length:0.3,
	bandpassStart:90,
	bandpassEnd:1000,
	triStart:90,
	triEnd:50,
	highpassStart:2000,
	highpassEnd:600,
	attack:0.07,
	decay:0.05,
	type:"square",
})

export const PRESET_STRONG_SNARE = preset({
	name:"Strong Snare",
	velocity:1,
	length:1.1,
	bandpassStart:90,
	bandpassEnd:1000,
	triStart:90,
	triEnd:50,
	highpassStart:2000,
	highpassEnd:600,
	attack:0.009,
	decay:0.05,
	type:"square",
})

export const PRESET_SATURATED_SNARE = preset({
	name:"Saturated Snare",
	velocity:3,
	length:1.75,
	bandpassStart:3000,
	bandpassEnd:1000,
	triStart:87,
	triEnd:30,
	highpassStart:7000,
	highpassEnd:600,
	attack:0.03,
	decay:0.5,
	type:"square",
})

export const PRESET_DISTORTED_SNARE = preset({
	name:"Distorted Snare",
	velocity:2.4,
	length:0.4,
	bandpassStart:2500,
	bandpassEnd:5000,
	triStart:240,
	triEnd:160,
	highpassStart:3000,
	highpassEnd:1500,
	attack:0.001,
	decay:0.08,
	type:"square",
})

// ============================================================
// HIP-HOP / TRAP / DRILL
// ============================================================

export const PRESET_TRAP_SNARE = preset({
	name:"Trap Snare",
	velocity:1.15,
	length:0.22,
	bandpassStart:2200,
	bandpassEnd:4800,
	triStart:240,
	triEnd:160,
	highpassStart:2500,
	highpassEnd:1300,
	attack:0.0008,
	decay:0.05,
	type:"triangle",
})

export const PRESET_DRILL_SNARE = preset({
	name:"Drill Snare",
	velocity:1.1,
	length:0.16,
	bandpassStart:2800,
	bandpassEnd:5500,
	triStart:280,
	triEnd:200,
	highpassStart:3000,
	highpassEnd:1500,
	attack:0.0005,
	decay:0.035,
	type:"square",
})

export const PRESET_HIPHOP_SNARE = preset({
	name:"Hip-Hop Snare",
	velocity:1.05,
	length:0.45,
	bandpassStart:1800,
	bandpassEnd:4000,
	triStart:200,
	triEnd:140,
	highpassStart:2000,
	highpassEnd:1000,
	attack:0.005,
	decay:0.12,
	type:"triangle",
})

export const PRESET_BOOM_BAP_SNARE = preset({
	name:"Boom Bap Snare",
	velocity:1.0,
	length:0.55,
	bandpassStart:1600,
	bandpassEnd:3800,
	triStart:190,
	triEnd:130,
	highpassStart:1800,
	highpassEnd:850,
	attack:0.01,
	decay:0.18,
	type:"triangle",
})

export const PRESET_LOFI_SNARE = preset({
	name:"Lo-Fi Snare",
	velocity:0.8,
	length:0.4,
	bandpassStart:1200,
	bandpassEnd:2800,
	triStart:170,
	triEnd:110,
	highpassStart:1400,
	highpassEnd:600,
	attack:0.012,
	decay:0.16,
	type:"triangle",
})

// ============================================================
// HOUSE / TECHNO
// ============================================================

export const PRESET_HOUSE_SNARE = preset({
	name:"House Snare",
	velocity:1.0,
	length:0.32,
	bandpassStart:1800,
	bandpassEnd:4200,
	triStart:210,
	triEnd:150,
	highpassStart:2200,
	highpassEnd:1100,
	attack:0.003,
	decay:0.09,
	type:"triangle",
})

export const PRESET_TECH_SNARE = preset({
	name:"Tech Snare",
	velocity:1.05,
	length:0.18,
	bandpassStart:2400,
	bandpassEnd:5000,
	triStart:250,
	triEnd:180,
	highpassStart:2800,
	highpassEnd:1400,
	attack:0.001,
	decay:0.04,
	type:"square",
})

export const PRESET_CLAP_SNARE = preset({
	name:"Clap Snare Hybrid",
	velocity:1.1,
	length:0.5,
	bandpassStart:1600,
	bandpassEnd:4500,
	triStart:200,
	triEnd:130,
	highpassStart:1800,
	highpassEnd:900,
	attack:0.015,
	decay:0.15,
	type:"triangle",
})

// ============================================================
// JUNGLE / DNB / BREAKBEAT
// ============================================================

export const PRESET_JUNGLE_SNARE = preset({
	name:"Jungle Snare",
	velocity:1.2,
	length:0.28,
	bandpassStart:2200,
	bandpassEnd:4800,
	triStart:240,
	triEnd:170,
	highpassStart:2400,
	highpassEnd:1200,
	attack:0.001,
	decay:0.06,
	type:"triangle",
})

export const PRESET_DNB_SNARE = preset({
	name:"Drum & Bass Snare",
	velocity:1.25,
	length:0.22,
	bandpassStart:2600,
	bandpassEnd:5500,
	triStart:280,
	triEnd:190,
	highpassStart:2800,
	highpassEnd:1400,
	attack:0.0008,
	decay:0.05,
	type:"square",
})

export const PRESET_BREAKBEAT_SNARE = preset({
	name:"Breakbeat Snare",
	velocity:1.1,
	length:0.3,
	bandpassStart:1900,
	bandpassEnd:4200,
	triStart:220,
	triEnd:160,
	highpassStart:2200,
	highpassEnd:1100,
	attack:0.002,
	decay:0.08,
	type:"triangle",
})

// ============================================================
// EXPERIMENTAL / CHARACTER
// ============================================================

export const PRESET_TIGHT_SNARE = preset({
	name:"Tight Snare",
	velocity:1.0,
	length:0.1,
	bandpassStart:2400,
	bandpassEnd:5000,
	triStart:260,
	triEnd:180,
	highpassStart:2800,
	highpassEnd:1500,
	attack:0.0005,
	decay:0.02,
	type:"square",
})

export const PRESET_FAT_SNARE = preset({
	name:"Fat Snare",
	velocity:1.3,
	length:0.7,
	bandpassStart:1200,
	bandpassEnd:3000,
	triStart:170,
	triEnd:110,
	highpassStart:1400,
	highpassEnd:600,
	attack:0.008,
	decay:0.22,
	type:"triangle",
})

export const PRESET_GHOST_SNARE = preset({
	name:"Ghost Snare",
	velocity:0.35,
	length:0.18,
	bandpassStart:2000,
	bandpassEnd:4000,
	triStart:190,
	triEnd:130,
	highpassStart:2200,
	highpassEnd:1100,
	attack:0.003,
	decay:0.06,
	type:"triangle",
})

export const PRESET_NOISY_SNARE = preset({
	name:"Noisy Snare",
	velocity:1.4,
	length:0.6,
	bandpassStart:3000,
	bandpassEnd:8000,
	triStart:300,
	triEnd:200,
	highpassStart:3500,
	highpassEnd:1800,
	attack:0.005,
	decay:0.18,
	type:"square",
})

export const PRESET_CINEMATIC_SNARE = preset({
	name:"Cinematic Snare",
	velocity:1.5,
	length:1.4,
	bandpassStart:1500,
	bandpassEnd:3500,
	triStart:200,
	triEnd:130,
	highpassStart:1800,
	highpassEnd:700,
	attack:0.01,
	decay:0.4,
	type:"triangle",
})

export const PRESET_ELECTRO_SNARE = preset({
	name:"Electro Snare",
	velocity:1.1,
	length:0.25,
	bandpassStart:2200,
	bandpassEnd:5000,
	triStart:260,
	triEnd:180,
	highpassStart:2800,
	highpassEnd:1400,
	attack:0.0008,
	decay:0.06,
	type:"square",
})

export const PRESET_INDUSTRIAL_SNARE = preset({
	name:"Industrial Snare",
	velocity:1.6,
	length:0.4,
	bandpassStart:1800,
	bandpassEnd:5500,
	triStart:240,
	triEnd:160,
	highpassStart:2400,
	highpassEnd:1200,
	attack:0.001,
	decay:0.1,
	type:"square",
})

export const PRESET_AMBIENT_SNARE = preset({
	name:"Ambient Snare",
	velocity:0.6,
	length:1.5,
	bandpassStart:2500,
	bandpassEnd:5000,
	triStart:180,
	triEnd:110,
	highpassStart:3000,
	highpassEnd:1200,
	attack:0.05,
	decay:0.5,
	type:"triangle",
})

// ============================================================
// COLLECTIONS
// ============================================================

export const PRESET_SNARES = [
	DEFAULT_SNARE_OPTIONS,

	// Classic machines
	PRESET_808_SNARE,
	PRESET_909_SNARE,
	PRESET_707_SNARE,
	PRESET_LINN_SNARE,
	PRESET_CR78_SNARE,

	// Acoustic / natural
	PRESET_ACOUSTIC_SNARE,
	PRESET_PICCOLO_SNARE,
	PRESET_BRUSH_SNARE,
	PRESET_BIG_ROOM_SNARE,
	PRESET_GATED_SNARE,
	PRESET_RIM_SHOT_SNARE,

	// Heavy / electronic
	PRESET_HEAVY_SNARE,
	PRESET_LONG_SNARE,
	PRESET_SQUARE_SNARE,
	PRESET_STRONG_SNARE,
	PRESET_SATURATED_SNARE,
	PRESET_DISTORTED_SNARE,

	// Hip-hop / trap / drill
	PRESET_TRAP_SNARE,
	PRESET_DRILL_SNARE,
	PRESET_HIPHOP_SNARE,
	PRESET_BOOM_BAP_SNARE,
	PRESET_LOFI_SNARE,

	// House / techno
	PRESET_HOUSE_SNARE,
	PRESET_TECH_SNARE,
	PRESET_CLAP_SNARE,

	// Jungle / DnB / breakbeat
	PRESET_JUNGLE_SNARE,
	PRESET_DNB_SNARE,
	PRESET_BREAKBEAT_SNARE,

	// Experimental / character
	PRESET_TIGHT_SNARE,
	PRESET_FAT_SNARE,
	PRESET_GHOST_SNARE,
	PRESET_NOISY_SNARE,
	PRESET_CINEMATIC_SNARE,
	PRESET_ELECTRO_SNARE,
	PRESET_INDUSTRIAL_SNARE,
	PRESET_AMBIENT_SNARE,
]

// retain legacy alias names so external imports keep working
export const PRESET_LONG_SNARE_OPTIONS = PRESET_LONG_SNARE
export const PRESET_HEAVY_SNARE_OPTIONS = PRESET_HEAVY_SNARE
export const PRESET_SQUARE_SNARE_OPTIONS = PRESET_SQUARE_SNARE
export const PRESET_STRONG_SNARE_OPTIONS = PRESET_STRONG_SNARE
export const PRESET_SATURATED_SNARE_OPTIONS = PRESET_SATURATED_SNARE

/**
 * Loop-friendly snares: short tails (≤ ~0.6s) and snappy attacks. Long
 * cinematic/ambient/big-room/saturated/heavy/long snares are excluded
 * from the random pool because they ring on past the next beat or have
 * slow attacks that disappear in a fast loop.  All presets remain
 * accessible via PRESET_SNARES for manual selection.
 */
export const PRESET_SNARES_LOOP = [
	DEFAULT_SNARE_OPTIONS,
	PRESET_808_SNARE,
	PRESET_909_SNARE,
	PRESET_707_SNARE,
	PRESET_LINN_SNARE,
	PRESET_CR78_SNARE,
	PRESET_ACOUSTIC_SNARE,
	PRESET_PICCOLO_SNARE,
	PRESET_GATED_SNARE,
	PRESET_RIM_SHOT_SNARE,
	PRESET_SQUARE_SNARE,
	PRESET_DISTORTED_SNARE,
	PRESET_TRAP_SNARE,
	PRESET_DRILL_SNARE,
	PRESET_HIPHOP_SNARE,
	PRESET_BOOM_BAP_SNARE,
	PRESET_LOFI_SNARE,
	PRESET_HOUSE_SNARE,
	PRESET_TECH_SNARE,
	PRESET_CLAP_SNARE,
	PRESET_JUNGLE_SNARE,
	PRESET_DNB_SNARE,
	PRESET_BREAKBEAT_SNARE,
	PRESET_TIGHT_SNARE,
	PRESET_GHOST_SNARE,
	PRESET_ELECTRO_SNARE,
	PRESET_INDUSTRIAL_SNARE,
]

export const getRandomSnarePreset = () => {
	const snareIndex = Math.floor(Math.random() * PRESET_SNARES_LOOP.length)
	return PRESET_SNARES_LOOP[snareIndex]
}

export const getSnarePresets = () => PRESET_SNARES.slice()
