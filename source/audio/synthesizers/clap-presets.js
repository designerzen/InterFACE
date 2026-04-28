/**
 * Clap presets
 *
 * Variety of clap flavours: classic 808/909, finger snap, big stadium clap,
 * tight short clap, wide reverberant clap, lo-fi, distorted, hand-claps,
 * etc.  The clap synth uses a triangle oscillator + filtered noise.
 */

export const DEFAULT_CLAP_OPTIONS = {
	name:"Default Clap",
	velocity:1,
	length:0.7,
	highpass:6,
	frequencyStart:50,
	frequencyEnd:3000,

	attack:0.05,
	decay:0.2,
	sustain:0.9,

	// optional absolute audioContext time to schedule the trigger at
	// (0 / falsy = play immediately at audioContext.currentTime + ZERO)
	triggerAt:0
}

const preset = (overrides) => Object.assign({}, DEFAULT_CLAP_OPTIONS, overrides)

// ============================================================
// CLASSIC DRUM MACHINES
// ============================================================

export const PRESET_808_CLAP = preset({
	name:"808 Clap",
	velocity:1.0,
	length:0.6,
	highpass:6,
	frequencyStart:80,
	frequencyEnd:2800,
	attack:0.04,
	decay:0.18,
	sustain:0.85,
})

export const PRESET_909_CLAP = preset({
	name:"909 Clap",
	velocity:1.1,
	length:0.55,
	highpass:6,
	frequencyStart:120,
	frequencyEnd:3500,
	attack:0.03,
	decay:0.15,
	sustain:0.9,
})

export const PRESET_LINN_CLAP = preset({
	name:"LinnDrum Clap",
	velocity:1.0,
	length:0.5,
	highpass:6,
	frequencyStart:90,
	frequencyEnd:3000,
	attack:0.04,
	decay:0.16,
	sustain:0.85,
})

export const PRESET_CR78_CLAP = preset({
	name:"CR-78 Clap",
	velocity:0.9,
	length:0.4,
	highpass:6,
	frequencyStart:100,
	frequencyEnd:2600,
	attack:0.05,
	decay:0.14,
	sustain:0.75,
})

// ============================================================
// CHARACTERS / GENRES
// ============================================================

export const PRESET_TIGHT_CLAP = preset({
	name:"Tight Clap",
	velocity:1.0,
	length:0.18,
	highpass:6,
	frequencyStart:150,
	frequencyEnd:4000,
	attack:0.005,
	decay:0.06,
	sustain:0.85,
})

export const PRESET_FAT_CLAP = preset({
	name:"Fat Clap",
	velocity:1.3,
	length:0.9,
	highpass:6,
	frequencyStart:50,
	frequencyEnd:2500,
	attack:0.06,
	decay:0.3,
	sustain:0.95,
})

export const PRESET_STADIUM_CLAP = preset({
	name:"Stadium Clap",
	velocity:1.4,
	length:1.6,
	highpass:6,
	frequencyStart:60,
	frequencyEnd:2200,
	attack:0.08,
	decay:0.5,
	sustain:0.9,
})

export const PRESET_FINGER_SNAP = preset({
	name:"Finger Snap",
	velocity:1.0,
	length:0.12,
	highpass:6,
	frequencyStart:1500,
	frequencyEnd:6000,
	attack:0.001,
	decay:0.04,
	sustain:0.6,
})

export const PRESET_HAND_CLAP = preset({
	name:"Hand Clap",
	velocity:1.0,
	length:0.45,
	highpass:6,
	frequencyStart:80,
	frequencyEnd:3200,
	attack:0.03,
	decay:0.15,
	sustain:0.82,
})

export const PRESET_HOUSE_CLAP = preset({
	name:"House Clap",
	velocity:1.05,
	length:0.5,
	highpass:6,
	frequencyStart:100,
	frequencyEnd:3200,
	attack:0.025,
	decay:0.18,
	sustain:0.88,
})

export const PRESET_TECHNO_CLAP = preset({
	name:"Techno Clap",
	velocity:1.1,
	length:0.35,
	highpass:6,
	frequencyStart:150,
	frequencyEnd:3800,
	attack:0.015,
	decay:0.12,
	sustain:0.9,
})

export const PRESET_TRAP_CLAP = preset({
	name:"Trap Clap",
	velocity:1.1,
	length:0.4,
	highpass:6,
	frequencyStart:140,
	frequencyEnd:3500,
	attack:0.012,
	decay:0.12,
	sustain:0.88,
})

export const PRESET_HIPHOP_CLAP = preset({
	name:"Hip-Hop Clap",
	velocity:1.05,
	length:0.55,
	highpass:6,
	frequencyStart:90,
	frequencyEnd:2800,
	attack:0.035,
	decay:0.2,
	sustain:0.8,
})

export const PRESET_LOFI_CLAP = preset({
	name:"Lo-Fi Clap",
	velocity:0.8,
	length:0.5,
	highpass:6,
	frequencyStart:70,
	frequencyEnd:2200,
	attack:0.06,
	decay:0.22,
	sustain:0.7,
})

export const PRESET_DISTORTED_CLAP = preset({
	name:"Distorted Clap",
	velocity:2.5,
	length:0.6,
	highpass:6,
	frequencyStart:200,
	frequencyEnd:4500,
	attack:0.01,
	decay:0.2,
	sustain:0.95,
})

export const PRESET_GATED_CLAP = preset({
	name:"Gated Clap",
	velocity:1.2,
	length:0.3,
	highpass:6,
	frequencyStart:130,
	frequencyEnd:3500,
	attack:0.005,
	decay:0.1,
	sustain:0.92,
})

export const PRESET_WIDE_CLAP = preset({
	name:"Wide Clap",
	velocity:1.15,
	length:1.1,
	highpass:6,
	frequencyStart:80,
	frequencyEnd:2800,
	attack:0.05,
	decay:0.4,
	sustain:0.88,
})

export const PRESET_HUMAN_CLAP = preset({
	name:"Human Clap",
	velocity:0.95,
	length:0.42,
	highpass:6,
	frequencyStart:75,
	frequencyEnd:3000,
	attack:0.04,
	decay:0.17,
	sustain:0.78,
})

export const PRESET_AGGRESSIVE_CLAP = preset({
	name:"Aggressive Clap",
	velocity:1.6,
	length:0.45,
	highpass:6,
	frequencyStart:180,
	frequencyEnd:4500,
	attack:0.008,
	decay:0.13,
	sustain:0.95,
})

export const PRESET_AMBIENT_CLAP = preset({
	name:"Ambient Clap",
	velocity:0.7,
	length:1.8,
	highpass:6,
	frequencyStart:60,
	frequencyEnd:2400,
	attack:0.12,
	decay:0.7,
	sustain:0.6,
})

export const PRESET_DRY_CLAP = preset({
	name:"Dry Clap",
	velocity:1.0,
	length:0.22,
	highpass:6,
	frequencyStart:140,
	frequencyEnd:3500,
	attack:0.01,
	decay:0.08,
	sustain:0.78,
})

// ============================================================
// COLLECTIONS
// ============================================================

export const PRESET_CLAPS = [
	DEFAULT_CLAP_OPTIONS,

	// Classic machines
	PRESET_808_CLAP,
	PRESET_909_CLAP,
	PRESET_LINN_CLAP,
	PRESET_CR78_CLAP,

	// Characters
	PRESET_TIGHT_CLAP,
	PRESET_FAT_CLAP,
	PRESET_STADIUM_CLAP,
	PRESET_FINGER_SNAP,
	PRESET_HAND_CLAP,

	// Genres
	PRESET_HOUSE_CLAP,
	PRESET_TECHNO_CLAP,
	PRESET_TRAP_CLAP,
	PRESET_HIPHOP_CLAP,
	PRESET_LOFI_CLAP,

	// Effects / character
	PRESET_DISTORTED_CLAP,
	PRESET_GATED_CLAP,
	PRESET_WIDE_CLAP,
	PRESET_HUMAN_CLAP,
	PRESET_AGGRESSIVE_CLAP,
	PRESET_AMBIENT_CLAP,
	PRESET_DRY_CLAP,
]

export const getRandomClapPreset = () => {
	const i = Math.floor(Math.random() * PRESET_CLAPS.length)
	return PRESET_CLAPS[i]
}

export const getClapPresets = () => PRESET_CLAPS.slice()
