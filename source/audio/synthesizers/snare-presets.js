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
	noiseLevel:0.52,
	bodyLevel:0.78,
	bodyLength:0.16,
	shellLevel:0.24,
	shellRatio:1.58,
	shellLength:0.095,
	shellType:"sine",
	crackLevel:0.62,
	crackLength:0.018,
	crackFrequency:3200,
	crackEnd:1850,
	crackQ:0.75,

	// type: "square"
	type: "triangle",

	// optional absolute audioContext time to schedule the trigger at
	// (0 / falsy = play immediately at audioContext.currentTime + ZERO)
	triggerAt:0
}

export const getSnareVoiceLevels = options => ({
	noise:options.velocity * options.noiseLevel,
	body:options.velocity * options.bodyLevel,
	shell:options.velocity * options.shellLevel,
	crack:options.velocity * options.crackLevel
})

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

export const PRESET_606_SNARE = preset({
	name:"606 Snare",
	velocity:0.92,
	length:0.2,
	bandpassStart:1850,
	bandpassEnd:4200,
	triStart:215,
	triEnd:154,
	highpassStart:2450,
	highpassEnd:1250,
	attack:0.001,
	decay:0.045,
	noiseLevel:0.64,
	bodyLevel:0.5,
	shellLevel:0.15,
	crackLevel:0.68,
	crackLength:0.012,
	crackFrequency:3600,
	type:"triangle",
})

export const PRESET_505_SNARE = preset({
	name:"505 Snare",
	velocity:0.96,
	length:0.26,
	bandpassStart:1650,
	bandpassEnd:5600,
	triStart:225,
	triEnd:148,
	highpassStart:2250,
	highpassEnd:1050,
	attack:0.0008,
	decay:0.055,
	noiseLevel:0.58,
	bodyLevel:0.66,
	shellLevel:0.2,
	crackLevel:0.76,
	crackLength:0.014,
	crackFrequency:3900,
	type:"square",
})

export const PRESET_CASIO_RZ1_SNARE = preset({
	name:"Casio RZ-1 Snare",
	velocity:1,
	length:0.24,
	bandpassStart:1350,
	bandpassEnd:4300,
	triStart:205,
	triEnd:132,
	highpassStart:1850,
	highpassEnd:900,
	attack:0.0007,
	decay:0.06,
	noiseLevel:0.62,
	bodyLevel:0.78,
	shellLevel:0.28,
	crackLevel:0.86,
	crackLength:0.02,
	crackFrequency:2850,
	crackEnd:1350,
	type:"square",
})

export const PRESET_KORG_DDD1_SNARE = preset({
	name:"Korg DDD-1 Snare",
	velocity:1.04,
	length:0.38,
	bandpassStart:1450,
	bandpassEnd:5200,
	triStart:218,
	triEnd:142,
	highpassStart:2050,
	highpassEnd:850,
	attack:0.001,
	decay:0.12,
	noiseLevel:0.6,
	bodyLevel:0.74,
	shellLevel:0.32,
	crackLevel:0.74,
	crackLength:0.022,
	crackFrequency:3400,
	type:"triangle",
})

export const PRESET_KORG_KR55_SNARE = preset({
	name:"Korg KR-55 Snare",
	velocity:0.84,
	length:0.21,
	bandpassStart:1250,
	bandpassEnd:3300,
	triStart:185,
	triEnd:126,
	highpassStart:1650,
	highpassEnd:780,
	attack:0.002,
	decay:0.07,
	noiseLevel:0.5,
	bodyLevel:0.56,
	shellLevel:0.16,
	crackLevel:0.42,
	crackLength:0.015,
	crackFrequency:2600,
	type:"triangle",
})

export const PRESET_BOSS_DR55_SNARE = preset({
	name:"Boss DR-55 Snare",
	velocity:0.82,
	length:0.19,
	bandpassStart:1750,
	bandpassEnd:3600,
	triStart:202,
	triEnd:138,
	highpassStart:2050,
	highpassEnd:1050,
	attack:0.0015,
	decay:0.045,
	noiseLevel:0.58,
	bodyLevel:0.48,
	shellLevel:0.14,
	crackLevel:0.5,
	crackLength:0.012,
	crackFrequency:3100,
	type:"triangle",
})

export const PRESET_OBERHEIM_DMX_SNARE = preset({
	name:"Oberheim DMX Snare",
	velocity:1.08,
	length:0.36,
	bandpassStart:1380,
	bandpassEnd:4900,
	triStart:226,
	triEnd:146,
	highpassStart:2150,
	highpassEnd:900,
	attack:0.0006,
	decay:0.09,
	noiseLevel:0.62,
	bodyLevel:0.82,
	shellLevel:0.34,
	crackLevel:0.92,
	crackLength:0.019,
	crackFrequency:3450,
	crackEnd:1600,
	type:"square",
})

export const PRESET_DRUMTRAKS_SNARE = preset({
	name:"Sequential DrumTraks Snare",
	velocity:1.02,
	length:0.34,
	bandpassStart:1450,
	bandpassEnd:4700,
	triStart:216,
	triEnd:142,
	highpassStart:2050,
	highpassEnd:920,
	attack:0.0008,
	decay:0.085,
	noiseLevel:0.6,
	bodyLevel:0.76,
	shellLevel:0.3,
	crackLevel:0.82,
	crackLength:0.018,
	crackFrequency:3300,
	type:"triangle",
})

export const PRESET_SP1200_SNARE = preset({
	name:"E-mu SP-1200 Snare",
	velocity:1.04,
	length:0.31,
	bandpassStart:1180,
	bandpassEnd:3900,
	triStart:204,
	triEnd:128,
	highpassStart:1700,
	highpassEnd:760,
	attack:0.0007,
	decay:0.078,
	noiseLevel:0.68,
	bodyLevel:0.8,
	shellLevel:0.31,
	crackLevel:0.9,
	crackLength:0.02,
	crackFrequency:2750,
	crackEnd:1250,
	type:"square",
})

export const PRESET_YAMAHA_RX5_SNARE = preset({
	name:"Yamaha RX5 Snare",
	velocity:1.08,
	length:0.43,
	bandpassStart:1650,
	bandpassEnd:6100,
	triStart:238,
	triEnd:154,
	highpassStart:2700,
	highpassEnd:1150,
	attack:0.0005,
	decay:0.12,
	noiseLevel:0.64,
	bodyLevel:0.78,
	shellLevel:0.38,
	crackLevel:0.88,
	crackLength:0.018,
	crackFrequency:4300,
	type:"triangle",
})

export const PRESET_ALESIS_HR16_SNARE = preset({
	name:"Alesis HR-16 Snare",
	velocity:1.04,
	length:0.4,
	bandpassStart:1550,
	bandpassEnd:5700,
	triStart:224,
	triEnd:146,
	highpassStart:2400,
	highpassEnd:1050,
	attack:0.0007,
	decay:0.105,
	noiseLevel:0.58,
	bodyLevel:0.8,
	shellLevel:0.36,
	crackLevel:0.82,
	crackLength:0.017,
	crackFrequency:3900,
	type:"triangle",
})

export const PRESET_SIMMONS_SDSV_SNARE = preset({
	name:"Simmons SDS-V Snare",
	velocity:1.12,
	length:0.42,
	bandpassStart:1250,
	bandpassEnd:5200,
	triStart:286,
	triEnd:132,
	highpassStart:2250,
	highpassEnd:820,
	attack:0.0005,
	decay:0.115,
	noiseLevel:0.74,
	bodyLevel:0.84,
	bodyLength:0.22,
	shellLevel:0.4,
	shellRatio:1.74,
	crackLevel:0.76,
	crackLength:0.02,
	crackFrequency:3600,
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
	noiseLevel:0.62,
	bodyLevel:0.3,
	shellLevel:0.1,
	crackLevel:0.08,
	crackLength:0.012,
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
	PRESET_606_SNARE,
	PRESET_505_SNARE,
	PRESET_CASIO_RZ1_SNARE,
	PRESET_KORG_DDD1_SNARE,
	PRESET_KORG_KR55_SNARE,
	PRESET_BOSS_DR55_SNARE,
	PRESET_OBERHEIM_DMX_SNARE,
	PRESET_DRUMTRAKS_SNARE,
	PRESET_SP1200_SNARE,
	PRESET_YAMAHA_RX5_SNARE,
	PRESET_ALESIS_HR16_SNARE,
	PRESET_SIMMONS_SDSV_SNARE,

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
	PRESET_606_SNARE,
	PRESET_505_SNARE,
	PRESET_CASIO_RZ1_SNARE,
	PRESET_KORG_DDD1_SNARE,
	PRESET_KORG_KR55_SNARE,
	PRESET_BOSS_DR55_SNARE,
	PRESET_OBERHEIM_DMX_SNARE,
	PRESET_DRUMTRAKS_SNARE,
	PRESET_SP1200_SNARE,
	PRESET_YAMAHA_RX5_SNARE,
	PRESET_ALESIS_HR16_SNARE,
	PRESET_SIMMONS_SDSV_SNARE,
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
