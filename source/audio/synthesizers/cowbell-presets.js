/**
 * Cowbell presets
 *
 * Two-oscillator metallic cowbell variants ranging from the classic 808
 * cowbell to dampened, distorted, ringing, low/high pitched and exotic
 * tuned variants.  Uses two oscillators tuned by `ratios` driven through a
 * bandpass filter with adjustable Q.
 */

export const DEFAULT_COWBELL_OPTIONS = {
	name:"Default Cowbell",
	velocity:1,
	length:0.5,
	bandpass:2640,
	fundamental:1,
	ratios:[587, 845],
	q:3.5,

	attack:0.02,
	decay:0.02,
	sustain:0.9,

	// optional absolute audioContext time to schedule the trigger at
	// (0 / falsy = play immediately at audioContext.currentTime + ZERO)
	triggerAt:0
}

const preset = (overrides) => Object.assign({}, DEFAULT_COWBELL_OPTIONS, overrides)

// ============================================================
// CLASSIC DRUM MACHINES
// ============================================================

export const PRESET_808_COWBELL = preset({
	name:"808 Cowbell",
	velocity:1.0,
	length:0.45,
	bandpass:2700,
	ratios:[587, 845],
	q:3.5,
	attack:0.005,
	decay:0.04,
	sustain:0.85,
})

export const PRESET_909_COWBELL = preset({
	name:"909 Cowbell",
	velocity:1.05,
	length:0.35,
	bandpass:3000,
	ratios:[640, 920],
	q:4.0,
	attack:0.003,
	decay:0.03,
	sustain:0.88,
})

export const PRESET_CR78_COWBELL = preset({
	name:"CR-78 Cowbell",
	velocity:0.95,
	length:0.3,
	bandpass:2400,
	ratios:[540, 780],
	q:3.2,
	attack:0.005,
	decay:0.035,
	sustain:0.8,
})

// ============================================================
// PITCH VARIANTS
// ============================================================

export const PRESET_LOW_COWBELL = preset({
	name:"Low Cowbell",
	velocity:1.05,
	length:0.6,
	bandpass:1800,
	ratios:[400, 580],
	q:3.5,
	attack:0.01,
	decay:0.04,
	sustain:0.85,
})

export const PRESET_HIGH_COWBELL = preset({
	name:"High Cowbell",
	velocity:1.0,
	length:0.3,
	bandpass:3500,
	ratios:[780, 1120],
	q:4.0,
	attack:0.003,
	decay:0.025,
	sustain:0.88,
})

export const PRESET_TUNED_LOW_COWBELL = preset({
	name:"Tuned Low Cowbell",
	velocity:1.0,
	length:0.7,
	bandpass:1500,
	ratios:[330, 495],
	q:4.5,
	attack:0.012,
	decay:0.05,
	sustain:0.8,
})

export const PRESET_TUNED_HIGH_COWBELL = preset({
	name:"Tuned High Cowbell",
	velocity:1.0,
	length:0.28,
	bandpass:4200,
	ratios:[940, 1410],
	q:4.8,
	attack:0.002,
	decay:0.022,
	sustain:0.9,
})

// ============================================================
// CHARACTER VARIANTS
// ============================================================

export const PRESET_DRY_COWBELL = preset({
	name:"Dry Cowbell",
	velocity:0.9,
	length:0.18,
	bandpass:2640,
	ratios:[587, 845],
	q:5.0,
	attack:0.002,
	decay:0.018,
	sustain:0.7,
})

export const PRESET_RINGING_COWBELL = preset({
	name:"Ringing Cowbell",
	velocity:1.0,
	length:1.4,
	bandpass:2640,
	ratios:[587, 845],
	q:8.0,
	attack:0.002,
	decay:0.05,
	sustain:0.95,
})

export const PRESET_DAMPENED_COWBELL = preset({
	name:"Dampened Cowbell",
	velocity:0.85,
	length:0.16,
	bandpass:2200,
	ratios:[520, 760],
	q:2.5,
	attack:0.005,
	decay:0.025,
	sustain:0.6,
})

export const PRESET_DISTORTED_COWBELL = preset({
	name:"Distorted Cowbell",
	velocity:2.5,
	length:0.5,
	bandpass:2640,
	ratios:[587, 845],
	q:3.5,
	attack:0.002,
	decay:0.025,
	sustain:0.95,
})

export const PRESET_LOFI_COWBELL = preset({
	name:"Lo-Fi Cowbell",
	velocity:0.75,
	length:0.4,
	bandpass:1800,
	ratios:[480, 700],
	q:2.0,
	attack:0.008,
	decay:0.045,
	sustain:0.6,
})

export const PRESET_BRIGHT_COWBELL = preset({
	name:"Bright Cowbell",
	velocity:1.1,
	length:0.55,
	bandpass:3800,
	ratios:[700, 1010],
	q:5.5,
	attack:0.003,
	decay:0.03,
	sustain:0.92,
})

export const PRESET_DARK_COWBELL = preset({
	name:"Dark Cowbell",
	velocity:0.95,
	length:0.5,
	bandpass:1500,
	ratios:[420, 605],
	q:3.0,
	attack:0.008,
	decay:0.04,
	sustain:0.75,
})

export const PRESET_TIGHT_COWBELL = preset({
	name:"Tight Cowbell",
	velocity:1.0,
	length:0.12,
	bandpass:2640,
	ratios:[587, 845],
	q:4.5,
	attack:0.001,
	decay:0.012,
	sustain:0.78,
})

export const PRESET_LONG_COWBELL = preset({
	name:"Long Cowbell",
	velocity:1.0,
	length:1.8,
	bandpass:2640,
	ratios:[587, 845],
	q:6.0,
	attack:0.005,
	decay:0.05,
	sustain:0.92,
})

export const PRESET_CASCABEL_COWBELL = preset({
	name:"Cascabel Cowbell",
	velocity:0.95,
	length:0.4,
	bandpass:3200,
	ratios:[680, 980],
	q:6.5,
	attack:0.003,
	decay:0.025,
	sustain:0.9,
})

export const PRESET_AGOGO_COWBELL = preset({
	name:"Agogo Bell",
	velocity:1.0,
	length:0.35,
	bandpass:3600,
	ratios:[760, 1140],
	q:7.0,
	attack:0.002,
	decay:0.025,
	sustain:0.88,
})

export const PRESET_TRIANGLE_BELL = preset({
	name:"Triangle Bell",
	velocity:0.9,
	length:1.6,
	bandpass:5500,
	ratios:[1320, 1980],
	q:9.0,
	attack:0.003,
	decay:0.05,
	sustain:0.95,
})

export const PRESET_TUBULAR_BELL = preset({
	name:"Tubular Bell",
	velocity:1.0,
	length:2.5,
	bandpass:1700,
	ratios:[440, 650],
	q:8.5,
	attack:0.005,
	decay:0.06,
	sustain:0.95,
})

// ============================================================
// COLLECTIONS
// ============================================================

export const PRESET_COWBELLS = [
	DEFAULT_COWBELL_OPTIONS,

	// Classic machines
	PRESET_808_COWBELL,
	PRESET_909_COWBELL,
	PRESET_CR78_COWBELL,

	// Pitch variants
	PRESET_LOW_COWBELL,
	PRESET_HIGH_COWBELL,
	PRESET_TUNED_LOW_COWBELL,
	PRESET_TUNED_HIGH_COWBELL,

	// Character variants
	PRESET_DRY_COWBELL,
	PRESET_RINGING_COWBELL,
	PRESET_DAMPENED_COWBELL,
	PRESET_DISTORTED_COWBELL,
	PRESET_LOFI_COWBELL,
	PRESET_BRIGHT_COWBELL,
	PRESET_DARK_COWBELL,
	PRESET_TIGHT_COWBELL,
	PRESET_LONG_COWBELL,

	// Exotic / tuned bell-style
	PRESET_CASCABEL_COWBELL,
	PRESET_AGOGO_COWBELL,
	PRESET_TRIANGLE_BELL,
	PRESET_TUBULAR_BELL,
]

export const getRandomCowbellPreset = () => {
	const i = Math.floor(Math.random() * PRESET_COWBELLS.length)
	return PRESET_COWBELLS[i]
}

export const getCowbellPresets = () => PRESET_COWBELLS.slice()
