/**
 * Kick drum presets
 *
 * A wide-ranging library of kick presets covering classic drum machines
 * (808, 909, Linn), modern genre staples (techno, house, trap, dubstep,
 * hardstyle, gabber, drum-n-bass), and experimental/cinematic flavours.
 *
 * Each preset is a plain object describing two oscillators (a triangle
 * "body" and a sine "thump"/sub) plus an ADSR envelope.  All presets are
 * derived from DEFAULT_KICK_OPTIONS so any new fields added there will
 * propagate automatically.
 */

export const DEFAULT_KICK_OPTIONS = {
	name:"Default Kick",
	velocity:1,
	length:0.15,
	attack:0.0001,
	decay:0.01,
	// sustain is a volume not a time
	sustain:0.9,
	release:0.001,

	// frequencies
	triStart:110,
	triEnd:50,

	sineStart:120,
	sineApex:150,
	sineSustain:100,
	sineEnd:50,

	// optional absolute audioContext time to schedule the trigger at
	// (0 / falsy = play immediately at audioContext.currentTime + ZERO)
	triggerAt:0,
}

// quick helper to keep things terse
const preset = (overrides) => Object.assign({}, DEFAULT_KICK_OPTIONS, overrides)

// ============================================================
// CLASSIC DRUM MACHINE KICKS
// ============================================================

export const PRESET_808_KICK = preset({
	name:"808 Kick",
	velocity:1.0,
	length:0.85,
	attack:0.001,
	decay:0.04,
	sustain:0.7,
	release:0.6,
	triStart:120,
	triEnd:35,
	sineStart:140,
	sineApex:80,
	sineSustain:55,
	sineEnd:30,
})

export const PRESET_808_SUB_KICK = preset({
	name:"808 Sub Kick",
	velocity:1.1,
	length:1.6,
	attack:0.002,
	decay:0.06,
	sustain:0.85,
	release:1.2,
	triStart:90,
	triEnd:28,
	sineStart:110,
	sineApex:65,
	sineSustain:45,
	sineEnd:25,
})

export const PRESET_909_KICK = preset({
	name:"909 Kick",
	velocity:1.05,
	length:0.32,
	attack:0.0005,
	decay:0.02,
	sustain:0.85,
	release:0.18,
	triStart:160,
	triEnd:55,
	sineStart:200,
	sineApex:120,
	sineSustain:75,
	sineEnd:45,
})

export const PRESET_909_PUNCHY_KICK = preset({
	name:"909 Punchy Kick",
	velocity:1.15,
	length:0.28,
	attack:0.0003,
	decay:0.012,
	sustain:0.92,
	release:0.15,
	triStart:180,
	triEnd:60,
	sineStart:230,
	sineApex:140,
	sineSustain:80,
	sineEnd:50,
})

export const PRESET_707_KICK = preset({
	name:"707 Kick",
	velocity:0.95,
	length:0.22,
	attack:0.0008,
	decay:0.018,
	sustain:0.78,
	release:0.12,
	triStart:130,
	triEnd:65,
	sineStart:150,
	sineApex:100,
	sineSustain:70,
	sineEnd:55,
})

export const PRESET_LINN_KICK = preset({
	name:"LinnDrum Kick",
	velocity:0.9,
	length:0.25,
	attack:0.001,
	decay:0.03,
	sustain:0.7,
	release:0.15,
	triStart:140,
	triEnd:70,
	sineStart:170,
	sineApex:110,
	sineSustain:80,
	sineEnd:60,
})

export const PRESET_CR78_KICK = preset({
	name:"CR-78 Kick",
	velocity:0.85,
	length:0.18,
	attack:0.0008,
	decay:0.02,
	sustain:0.65,
	release:0.1,
	triStart:120,
	triEnd:60,
	sineStart:140,
	sineApex:95,
	sineSustain:70,
	sineEnd:50,
})

// ============================================================
// HOUSE / TECHNO
// ============================================================

export const PRESET_TECH_HOUSE_KICK = preset({
	name:"Tech House Kick",
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

export const PRESET_DEEP_HOUSE_KICK = preset({
	name:"Deep House Kick",
	velocity:1.0,
	length:0.45,
	attack:0.002,
	decay:0.05,
	sustain:0.75,
	release:0.3,
	triStart:90,
	triEnd:40,
	sineStart:100,
	sineApex:75,
	sineSustain:55,
	sineEnd:30,
})

export const PRESET_MINIMAL_TECHNO_KICK = preset({
	name:"Minimal Techno Kick",
	velocity:1.0,
	length:0.18,
	attack:0.0001,
	decay:0.008,
	sustain:0.88,
	release:0.08,
	triStart:75,
	triEnd:45,
	sineStart:85,
	sineApex:120,
	sineSustain:70,
	sineEnd:35,
})

export const PRESET_DETROIT_KICK = preset({
	name:"Detroit Kick",
	velocity:1.1,
	length:0.32,
	attack:0.0005,
	decay:0.022,
	sustain:0.82,
	release:0.18,
	triStart:110,
	triEnd:48,
	sineStart:130,
	sineApex:160,
	sineSustain:85,
	sineEnd:42,
})

export const PRESET_BERLIN_KICK = preset({
	name:"Berlin Warehouse Kick",
	velocity:1.25,
	length:0.5,
	attack:0.0003,
	decay:0.025,
	sustain:0.9,
	release:0.32,
	triStart:95,
	triEnd:42,
	sineStart:115,
	sineApex:155,
	sineSustain:78,
	sineEnd:36,
})

export const PRESET_ACID_KICK = preset({
	name:"Acid Kick",
	velocity:1.15,
	length:0.22,
	attack:0.0004,
	decay:0.015,
	sustain:0.88,
	release:0.12,
	triStart:130,
	triEnd:55,
	sineStart:160,
	sineApex:200,
	sineSustain:90,
	sineEnd:48,
})

// ============================================================
// HARD GENRES
// ============================================================

export const PRESET_HARDSTYLE_KICK = preset({
	name:"Hardstyle Kick",
	velocity:1.5,
	length:0.6,
	attack:0.0002,
	decay:0.012,
	sustain:0.95,
	release:0.4,
	triStart:220,
	triEnd:60,
	sineStart:280,
	sineApex:340,
	sineSustain:120,
	sineEnd:55,
})

export const PRESET_GABBER_KICK = preset({
	name:"Gabber Kick",
	velocity:1.8,
	length:0.35,
	attack:0.0001,
	decay:0.008,
	sustain:0.98,
	release:0.22,
	triStart:200,
	triEnd:80,
	sineStart:260,
	sineApex:380,
	sineSustain:140,
	sineEnd:70,
})

export const PRESET_INDUSTRIAL_KICK = preset({
	name:"Industrial Kick",
	velocity:1.6,
	length:0.4,
	attack:0.0008,
	decay:0.018,
	sustain:0.9,
	release:0.25,
	triStart:170,
	triEnd:65,
	sineStart:220,
	sineApex:300,
	sineSustain:110,
	sineEnd:50,
})

export const PRESET_HARDCORE_KICK = preset({
	name:"Hardcore Kick",
	velocity:1.7,
	length:0.28,
	attack:0.0001,
	decay:0.006,
	sustain:0.97,
	release:0.18,
	triStart:190,
	triEnd:70,
	sineStart:240,
	sineApex:330,
	sineSustain:130,
	sineEnd:60,
})

// ============================================================
// HIP-HOP / TRAP / DUBSTEP
// ============================================================

export const PRESET_TRAP_KICK = preset({
	name:"Trap Kick",
	velocity:1.05,
	length:0.95,
	attack:0.001,
	decay:0.04,
	sustain:0.78,
	release:0.7,
	triStart:130,
	triEnd:32,
	sineStart:150,
	sineApex:85,
	sineSustain:50,
	sineEnd:28,
})

export const PRESET_DUBSTEP_KICK = preset({
	name:"Dubstep Kick",
	velocity:1.2,
	length:0.5,
	attack:0.0005,
	decay:0.02,
	sustain:0.88,
	release:0.32,
	triStart:150,
	triEnd:42,
	sineStart:180,
	sineApex:230,
	sineSustain:90,
	sineEnd:36,
})

export const PRESET_HIPHOP_KICK = preset({
	name:"Hip-Hop Kick",
	velocity:1.1,
	length:0.4,
	attack:0.001,
	decay:0.025,
	sustain:0.8,
	release:0.28,
	triStart:120,
	triEnd:48,
	sineStart:140,
	sineApex:170,
	sineSustain:75,
	sineEnd:40,
})

export const PRESET_BOOM_BAP_KICK = preset({
	name:"Boom Bap Kick",
	velocity:1.05,
	length:0.55,
	attack:0.002,
	decay:0.05,
	sustain:0.7,
	release:0.4,
	triStart:100,
	triEnd:38,
	sineStart:115,
	sineApex:90,
	sineSustain:60,
	sineEnd:32,
})

export const PRESET_DRILL_KICK = preset({
	name:"Drill Kick",
	velocity:1.1,
	length:1.1,
	attack:0.0005,
	decay:0.05,
	sustain:0.82,
	release:0.85,
	triStart:140,
	triEnd:30,
	sineStart:160,
	sineApex:90,
	sineSustain:48,
	sineEnd:24,
})

// ============================================================
// JUNGLE / DRUM-N-BASS / BREAKBEAT
// ============================================================

export const PRESET_JUNGLE_KICK = preset({
	name:"Jungle Kick",
	velocity:1.2,
	length:0.18,
	attack:0.0002,
	decay:0.012,
	sustain:0.9,
	release:0.1,
	triStart:160,
	triEnd:55,
	sineStart:190,
	sineApex:240,
	sineSustain:95,
	sineEnd:48,
})

export const PRESET_DNB_KICK = preset({
	name:"Drum & Bass Kick",
	velocity:1.15,
	length:0.16,
	attack:0.0001,
	decay:0.008,
	sustain:0.95,
	release:0.09,
	triStart:170,
	triEnd:60,
	sineStart:210,
	sineApex:265,
	sineSustain:105,
	sineEnd:50,
})

export const PRESET_BREAKBEAT_KICK = preset({
	name:"Breakbeat Kick",
	velocity:1.0,
	length:0.2,
	attack:0.0008,
	decay:0.015,
	sustain:0.78,
	release:0.12,
	triStart:135,
	triEnd:58,
	sineStart:160,
	sineApex:120,
	sineSustain:80,
	sineEnd:45,
})

// ============================================================
// ELECTRO / SYNTHWAVE / RETRO
// ============================================================

export const PRESET_ELECTRO_KICK = preset({
	name:"Electro Kick",
	velocity:1.1,
	length:0.2,
	attack:0.0002,
	decay:0.01,
	sustain:0.9,
	release:0.12,
	triStart:140,
	triEnd:55,
	sineStart:170,
	sineApex:220,
	sineSustain:85,
	sineEnd:42,
})

export const PRESET_SYNTHWAVE_KICK = preset({
	name:"Synthwave Kick",
	velocity:1.0,
	length:0.45,
	attack:0.001,
	decay:0.04,
	sustain:0.72,
	release:0.32,
	triStart:120,
	triEnd:45,
	sineStart:140,
	sineApex:175,
	sineSustain:75,
	sineEnd:40,
})

export const PRESET_VINTAGE_KICK = preset({
	name:"Vintage Acoustic Kick",
	velocity:0.9,
	length:0.35,
	attack:0.003,
	decay:0.06,
	sustain:0.65,
	release:0.22,
	triStart:95,
	triEnd:52,
	sineStart:110,
	sineApex:75,
	sineSustain:60,
	sineEnd:45,
})

// ============================================================
// CHARACTER / EXPERIMENTAL
// ============================================================

export const PRESET_BEEFY_KICK = preset({
	name:"Beefy Kick",
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

export const PRESET_LOW_KICK = preset({
	name:"Low Kick",
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

export const PRESET_THUD_KICK = preset({
	name:"Thud Kick",
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

export const PRESET_CLICK_KICK = preset({
	name:"Click Kick",
	velocity:1.0,
	length:0.04,
	attack:0.0001,
	decay:0.003,
	sustain:0.5,
	release:0.005,
	triStart:600,
	triEnd:80,
	sineStart:800,
	sineApex:1200,
	sineSustain:200,
	sineEnd:50,
})

export const PRESET_LOFI_KICK = preset({
	name:"Lo-Fi Kick",
	velocity:0.85,
	length:0.3,
	attack:0.004,
	decay:0.05,
	sustain:0.6,
	release:0.18,
	triStart:85,
	triEnd:40,
	sineStart:100,
	sineApex:70,
	sineSustain:55,
	sineEnd:32,
})

export const PRESET_AMBIENT_KICK = preset({
	name:"Ambient Kick",
	velocity:0.8,
	length:1.4,
	attack:0.02,
	decay:0.15,
	sustain:0.55,
	release:1.0,
	triStart:70,
	triEnd:38,
	sineStart:80,
	sineApex:55,
	sineSustain:48,
	sineEnd:28,
})

export const PRESET_CINEMATIC_KICK = preset({
	name:"Cinematic Boom",
	velocity:1.4,
	length:1.8,
	attack:0.005,
	decay:0.1,
	sustain:0.85,
	release:1.4,
	triStart:80,
	triEnd:32,
	sineStart:95,
	sineApex:180,
	sineSustain:60,
	sineEnd:24,
})

export const PRESET_DUSTY_KICK = preset({
	name:"Dusty Kick",
	velocity:0.78,
	length:0.5,
	attack:0.005,
	decay:0.07,
	sustain:0.55,
	release:0.34,
	triStart:90,
	triEnd:36,
	sineStart:105,
	sineApex:78,
	sineSustain:50,
	sineEnd:28,
})

export const PRESET_PUNCH_KICK = preset({
	name:"Punch Kick",
	velocity:1.3,
	length:0.12,
	attack:0.0001,
	decay:0.006,
	sustain:0.95,
	release:0.05,
	triStart:160,
	triEnd:55,
	sineStart:200,
	sineApex:260,
	sineSustain:90,
	sineEnd:42,
})

export const PRESET_PILLOW_KICK = preset({
	name:"Pillow Kick",
	velocity:0.7,
	length:0.6,
	attack:0.015,
	decay:0.08,
	sustain:0.5,
	release:0.4,
	triStart:75,
	triEnd:40,
	sineStart:85,
	sineApex:60,
	sineSustain:50,
	sineEnd:30,
})

export const PRESET_DISTORTED_KICK = preset({
	name:"Distorted Kick",
	velocity:2.5,
	length:0.3,
	attack:0.0001,
	decay:0.01,
	sustain:0.99,
	release:0.18,
	triStart:140,
	triEnd:55,
	sineStart:190,
	sineApex:280,
	sineSustain:110,
	sineEnd:48,
})

export const PRESET_RAVE_KICK = preset({
	name:"Rave Kick",
	velocity:1.35,
	length:0.25,
	attack:0.0001,
	decay:0.01,
	sustain:0.93,
	release:0.15,
	triStart:155,
	triEnd:60,
	sineStart:200,
	sineApex:280,
	sineSustain:100,
	sineEnd:50,
})

export const PRESET_SUB_BOOMER_KICK = preset({
	name:"Sub Boomer",
	velocity:1.0,
	length:2.2,
	attack:0.008,
	decay:0.12,
	sustain:0.78,
	release:1.7,
	triStart:60,
	triEnd:24,
	sineStart:75,
	sineApex:48,
	sineSustain:38,
	sineEnd:20,
})

export const PRESET_TICK_KICK = preset({
	name:"Tick Kick",
	velocity:0.85,
	length:0.025,
	attack:0.0001,
	decay:0.002,
	sustain:0.4,
	release:0.003,
	triStart:900,
	triEnd:120,
	sineStart:1100,
	sineApex:1500,
	sineSustain:300,
	sineEnd:80,
})

// ============================================================
// COLLECTIONS
// ============================================================

export const PRESETS_KICKS = [
	DEFAULT_KICK_OPTIONS,

	// Classic machines
	PRESET_808_KICK,
	PRESET_808_SUB_KICK,
	PRESET_909_KICK,
	PRESET_909_PUNCHY_KICK,
	PRESET_707_KICK,
	PRESET_LINN_KICK,
	PRESET_CR78_KICK,

	// House / techno
	PRESET_TECH_HOUSE_KICK,
	PRESET_DEEP_HOUSE_KICK,
	PRESET_MINIMAL_TECHNO_KICK,
	PRESET_DETROIT_KICK,
	PRESET_BERLIN_KICK,
	PRESET_ACID_KICK,

	// Hard genres
	PRESET_HARDSTYLE_KICK,
	PRESET_GABBER_KICK,
	PRESET_INDUSTRIAL_KICK,
	PRESET_HARDCORE_KICK,

	// Hip-hop / trap / dubstep
	PRESET_TRAP_KICK,
	PRESET_DUBSTEP_KICK,
	PRESET_HIPHOP_KICK,
	PRESET_BOOM_BAP_KICK,
	PRESET_DRILL_KICK,

	// Jungle / DnB / breakbeat
	PRESET_JUNGLE_KICK,
	PRESET_DNB_KICK,
	PRESET_BREAKBEAT_KICK,

	// Electro / retro
	PRESET_ELECTRO_KICK,
	PRESET_SYNTHWAVE_KICK,
	PRESET_VINTAGE_KICK,

	// Character / experimental
	PRESET_BEEFY_KICK,
	PRESET_LOW_KICK,
	PRESET_THUD_KICK,
	PRESET_CLICK_KICK,
	PRESET_LOFI_KICK,
	PRESET_AMBIENT_KICK,
	PRESET_CINEMATIC_KICK,
	PRESET_DUSTY_KICK,
	PRESET_PUNCH_KICK,
	PRESET_PILLOW_KICK,
	PRESET_DISTORTED_KICK,
	PRESET_RAVE_KICK,
	PRESET_SUB_BOOMER_KICK,
	PRESET_TICK_KICK,
]

export function getKickPresets() {
	return PRESETS_KICKS.slice()
}

/**
 * Loop-friendly kicks: short tails (≤ ~0.6s) and snappy attacks so they
 * don't ring out past the next beat at typical BPMs (90-200).  Long /
 * cinematic / sub-boomer style kicks are intentionally excluded - they
 * are still available via PRESETS_KICKS for manual selection but aren't
 * picked at random for live percussion patterns.
 */
export const PRESETS_KICKS_LOOP = [
	DEFAULT_KICK_OPTIONS,
	PRESET_808_KICK,
	PRESET_909_KICK,
	PRESET_909_PUNCHY_KICK,
	PRESET_707_KICK,
	PRESET_LINN_KICK,
	PRESET_CR78_KICK,
	PRESET_TECH_HOUSE_KICK,
	PRESET_DEEP_HOUSE_KICK,
	PRESET_MINIMAL_TECHNO_KICK,
	PRESET_DETROIT_KICK,
	PRESET_BERLIN_KICK,
	PRESET_ACID_KICK,
	PRESET_HARDSTYLE_KICK,
	PRESET_GABBER_KICK,
	PRESET_INDUSTRIAL_KICK,
	PRESET_HARDCORE_KICK,
	PRESET_DUBSTEP_KICK,
	PRESET_HIPHOP_KICK,
	PRESET_BOOM_BAP_KICK,
	PRESET_JUNGLE_KICK,
	PRESET_DNB_KICK,
	PRESET_BREAKBEAT_KICK,
	PRESET_ELECTRO_KICK,
	PRESET_SYNTHWAVE_KICK,
	PRESET_VINTAGE_KICK,
	PRESET_BEEFY_KICK,
	PRESET_CLICK_KICK,
	PRESET_LOFI_KICK,
	PRESET_PUNCH_KICK,
	PRESET_DISTORTED_KICK,
	PRESET_RAVE_KICK,
	PRESET_TICK_KICK,
]

export function getRandomKickPreset() {
	const kickIndex = Math.floor(Math.random() * PRESETS_KICKS_LOOP.length)
	return PRESETS_KICKS_LOOP[kickIndex]
}
