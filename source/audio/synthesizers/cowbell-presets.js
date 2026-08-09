import { getVelocityEnvelopeLevels } from './percussion-envelope.js'

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
	velocity:0.7,
	length:0.34,
	bandpass:2350,
	fundamental:1,
	ratios:[520, 795],
	q:2.8,
	waveforms:["triangle", "sine"],
	partialLevels:[0.78, 0.32],
	outputGain:0.46,
	pitchSweep:12,
	pitchSweepTime:0.035,
	pitchVariation:6,
	lengthVariation:0.045,
	velocityVariation:0.06,
	qVariation:0.12,
	filterSweep:0.64,
	filterSweepTime:0.2,
	tuningSemitones:0,

	attack:0.02,
	decay:0.02,
	sustain:0.9,

	// optional absolute audioContext time to schedule the trigger at
	// (0 / falsy = play immediately at audioContext.currentTime + ZERO)
	triggerAt:0
}

const centsRatio = cents => 2 ** (cents / 1200)

export const resolveCowbellHitOptions = (options, random=Math.random) => {
	const merged = Object.assign({}, DEFAULT_COWBELL_OPTIONS, options)
	const bipolar = () => random() * 2 - 1
	return {
		...merged,
		fundamental:merged.fundamental * centsRatio(bipolar() * merged.pitchVariation),
		length:Math.max(merged.attack + merged.decay + 0.01, merged.length + bipolar() * merged.lengthVariation),
		velocity:Math.max(0.001, merged.velocity * (1 + bipolar() * merged.velocityVariation)),
		q:Math.max(0.1, merged.q * (1 + bipolar() * merged.qVariation))
	}
}

export const getCowbellEnvelopeLevels = options => getVelocityEnvelopeLevels(options, options.outputGain)

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
	waveforms:["square", "square"],
	partialLevels:[1, 0.72],
	outputGain:0.52,
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

export const PRESET_505_COWBELL = preset({
	name:"505 Cowbell",
	velocity:0.88,
	length:0.24,
	bandpass:2550,
	ratios:[560, 820],
	q:3.4,
	waveforms:["triangle", "square"],
	partialLevels:[0.84, 0.42],
	outputGain:0.42,
	pitchSweep:3,
	pitchVariation:1.5,
	lengthVariation:0.012,
	attack:0.003,
	decay:0.025,
	sustain:0.74,
})

export const PRESET_CASIO_RZ1_COWBELL = preset({
	name:"Casio RZ-1 Cowbell",
	velocity:0.92,
	length:0.22,
	bandpass:2250,
	ratios:[505, 755],
	q:3.1,
	waveforms:["square", "square"],
	partialLevels:[0.78, 0.48],
	outputGain:0.4,
	pitchSweep:2,
	pitchVariation:1,
	lengthVariation:0.008,
	filterSweep:0.82,
	attack:0.002,
	decay:0.02,
	sustain:0.7,
})

export const PRESET_KORG_DDD1_COWBELL = preset({
	name:"Korg DDD-1 Cowbell",
	velocity:0.9,
	length:0.28,
	bandpass:2850,
	ratios:[610, 900],
	q:3.8,
	waveforms:["triangle", "sine"],
	partialLevels:[0.86, 0.38],
	outputGain:0.43,
	pitchSweep:2,
	pitchVariation:1.25,
	lengthVariation:0.01,
	filterSweep:0.88,
	attack:0.003,
	decay:0.028,
	sustain:0.76,
})

export const PRESET_707_COWBELL = preset({
	name:"707 Cowbell",
	velocity:0.9,
	length:0.25,
	bandpass:2500,
	ratios:[550, 805],
	q:3.5,
	waveforms:["triangle", "square"],
	partialLevels:[0.82, 0.44],
	outputGain:0.42,
	pitchSweep:2,
	pitchVariation:1,
	lengthVariation:0.008,
	filterSweep:0.86,
	attack:0.002,
	decay:0.024,
	sustain:0.72,
})

export const PRESET_KORG_KR55_COWBELL = preset({
	name:"Korg KR-55 Cowbell",
	velocity:0.82,
	length:0.27,
	bandpass:2300,
	ratios:[525, 775],
	q:3.1,
	waveforms:["square", "triangle"],
	partialLevels:[0.78, 0.38],
	outputGain:0.39,
	pitchSweep:6,
	pitchVariation:2,
	lengthVariation:0.015,
	filterSweep:0.72,
	attack:0.004,
	decay:0.03,
	sustain:0.72,
})

export const PRESET_LINNDRUM_COWBELL = preset({
	name:"LinnDrum Cowbell",
	velocity:0.92,
	length:0.3,
	bandpass:2670,
	ratios:[585, 880],
	q:3.7,
	waveforms:["triangle", "sine"],
	partialLevels:[0.86, 0.4],
	outputGain:0.43,
	pitchSweep:2,
	pitchVariation:1,
	lengthVariation:0.008,
	filterSweep:0.9,
	attack:0.002,
	decay:0.026,
	sustain:0.76,
})

export const PRESET_OBERHEIM_DMX_COWBELL = preset({
	name:"Oberheim DMX Cowbell", velocity:0.98, length:0.28, bandpass:2720,
	ratios:[590, 870], q:3.8, waveforms:["square", "triangle"], partialLevels:[0.88, 0.48],
	outputGain:0.45, pitchSweep:2, pitchVariation:1, lengthVariation:0.008,
	filterSweep:0.86, attack:0.002, decay:0.026, sustain:0.76,
})

export const PRESET_DRUMTRAKS_COWBELL = preset({
	name:"Sequential DrumTraks Cowbell", velocity:0.94, length:0.3, bandpass:2620,
	ratios:[575, 850], q:3.6, waveforms:["triangle", "sine"], partialLevels:[0.84, 0.4],
	outputGain:0.43, pitchSweep:2, pitchVariation:1.2, lengthVariation:0.01,
	filterSweep:0.88, attack:0.003, decay:0.028, sustain:0.75,
})

export const PRESET_SP1200_COWBELL = preset({
	name:"E-mu SP-1200 Cowbell", velocity:0.96, length:0.27, bandpass:2320,
	ratios:[525, 790], q:3.2, waveforms:["square", "square"], partialLevels:[0.82, 0.5],
	outputGain:0.42, pitchSweep:1, pitchVariation:0.8, lengthVariation:0.006,
	filterSweep:0.78, attack:0.002, decay:0.024, sustain:0.72,
})

export const PRESET_YAMAHA_RX5_COWBELL = preset({
	name:"Yamaha RX5 Cowbell", velocity:1, length:0.32, bandpass:3060,
	ratios:[640, 940], q:4, waveforms:["triangle", "sine"], partialLevels:[0.9, 0.4],
	outputGain:0.45, pitchSweep:1.5, pitchVariation:0.8, lengthVariation:0.007,
	filterSweep:0.92, attack:0.002, decay:0.028, sustain:0.79,
})

export const PRESET_ALESIS_HR16_COWBELL = preset({
	name:"Alesis HR-16 Cowbell", velocity:0.98, length:0.34, bandpass:2920,
	ratios:[615, 910], q:3.9, waveforms:["triangle", "sine"], partialLevels:[0.88, 0.38],
	outputGain:0.44, pitchSweep:1.5, pitchVariation:0.8, lengthVariation:0.008,
	filterSweep:0.94, attack:0.002, decay:0.03, sustain:0.78,
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

export const PRESET_WOODBLOCK_COWBELL = preset({
	name:"Woodblock Cowbell", length:0.14, bandpass:1900, ratios:[420, 690], q:2.2,
	waveforms:["triangle", "square"], partialLevels:[1, 0.35], pitchSweep:75,
	pitchVariation:14, lengthVariation:0.025, filterSweep:0.5, attack:0.001, decay:0.018, sustain:0.5
})

export const PRESET_SALSA_LOW_COWBELL = preset({
	name:"Salsa Low Cowbell", length:0.42, bandpass:2050, ratios:[470, 715], q:4.2,
	waveforms:["square", "triangle"], partialLevels:[1, 0.62], pitchSweep:28,
	pitchVariation:11, lengthVariation:0.07, filterSweep:0.68, attack:0.002, decay:0.035, sustain:0.78
})

export const PRESET_SALSA_HIGH_COWBELL = preset({
	name:"Salsa High Cowbell", length:0.26, bandpass:3900, ratios:[810, 1260], q:5.5,
	waveforms:["square", "square"], partialLevels:[0.82, 1], pitchSweep:22,
	pitchVariation:13, lengthVariation:0.045, filterSweep:0.8, attack:0.001, decay:0.022, sustain:0.72
})

export const PRESET_DEEP_RING_COWBELL = preset({
	name:"Deep Ring Cowbell", length:2.2, bandpass:1350, ratios:[315, 505], q:7.5,
	waveforms:["triangle", "square"], partialLevels:[1, 0.48], pitchSweep:12,
	pitchVariation:6, lengthVariation:0.3, filterSweep:0.82, attack:0.004, decay:0.08, sustain:0.9
})

export const PRESET_MUTED_HAND_COWBELL = preset({
	name:"Muted Hand Cowbell", length:0.09, bandpass:2450, ratios:[560, 875], q:2.8,
	waveforms:["square", "triangle"], partialLevels:[1, 0.28], pitchSweep:48,
	pitchVariation:18, lengthVariation:0.015, filterSweep:0.42, attack:0.001, decay:0.012, sustain:0.38
})

export const PRESET_BENT_COWBELL = preset({
	name:"Bent Cowbell", length:0.75, bandpass:2850, ratios:[530, 910], q:4.8,
	waveforms:["sawtooth", "square"], partialLevels:[0.7, 1], pitchSweep:140,
	pitchVariation:22, lengthVariation:0.16, filterSweep:0.58, attack:0.002, decay:0.055, sustain:0.82
})

export const PRESET_SOFT_STUDIO_COWBELL = preset({
	name:"Soft Studio Cowbell", length:0.3, bandpass:2100, ratios:[500, 770], q:2.2,
	waveforms:["triangle", "sine"], partialLevels:[0.7,0.22], outputGain:0.34,
	pitchSweep:8, pitchVariation:4, lengthVariation:0.035, filterSweep:0.72, sustain:0.55
})
export const PRESET_BRUSHED_COWBELL = preset({
	name:"Brushed Cowbell", length:0.22, bandpass:1750, ratios:[455,690], q:1.5,
	waveforms:["sine","triangle"], partialLevels:[0.62,0.18], outputGain:0.3,
	pitchSweep:5, pitchVariation:5, filterSweep:0.55, sustain:0.42
})
export const PRESET_WARM_ANALOG_COWBELL = preset({
	name:"Warm Analog Cowbell", length:0.48, bandpass:2250, ratios:[510,805], q:3,
	waveforms:["triangle","square"], partialLevels:[0.8,0.3], outputGain:0.4,
	pitchSweep:18, pitchVariation:7, filterSweep:0.68, sustain:0.66
})
export const PRESET_GLASS_COWBELL = preset({
	name:"Glass Cowbell", length:0.85, bandpass:4200, ratios:[820,1285], q:6,
	waveforms:["sine","triangle"], partialLevels:[0.5,0.7], outputGain:0.3,
	pitchSweep:4, pitchVariation:3, filterSweep:0.88, sustain:0.7, tuningSemitones:7
})
export const PRESET_TAPE_COWBELL = preset({
	name:"Tape Cowbell", length:0.38, bandpass:1650, ratios:[445,720], q:1.8,
	waveforms:["triangle","triangle"], partialLevels:[0.72,0.28], outputGain:0.36,
	pitchSweep:35, pitchVariation:16, filterSweep:0.52, sustain:0.54
})
export const PRESET_FUNK_COWBELL = preset({
	name:"Funk Cowbell", length:0.24, bandpass:2750, ratios:[610,930], q:3.8,
	waveforms:["square","triangle"], partialLevels:[0.72,0.38], outputGain:0.4,
	pitchSweep:24, pitchVariation:9, filterSweep:0.58, sustain:0.55, tuningSemitones:7
})
export const PRESET_DUB_COWBELL = preset({
	name:"Dub Cowbell", length:0.72, bandpass:1450, ratios:[350,560], q:4.5,
	waveforms:["sine","triangle"], partialLevels:[0.82,0.24], outputGain:0.34,
	pitchSweep:10, pitchVariation:5, filterSweep:0.74, sustain:0.72
})
export const PRESET_MINIMAL_CLICK_COWBELL = preset({
	name:"Minimal Click Cowbell", length:0.065, bandpass:3100, ratios:[690,1040], q:2,
	waveforms:["triangle","sine"], partialLevels:[0.58,0.14], outputGain:0.3,
	pitchSweep:55, pitchVariation:10, lengthVariation:0.008, filterSweep:0.4, sustain:0.25
})
export const PRESET_AFRO_COWBELL = preset({
	name:"Afro Cowbell", length:0.32, bandpass:2500, ratios:[565,860], q:3.2,
	waveforms:["triangle","square"], partialLevels:[0.78,0.34], outputGain:0.38,
	pitchSweep:20, pitchVariation:8, filterSweep:0.62, sustain:0.58, tuningSemitones:7
})
export const PRESET_ORBITAL_BELL = preset({
	name:"Orbital Bell", length:1.25, bandpass:3300, ratios:[660,1090], q:7,
	waveforms:["sine","sine"], partialLevels:[0.45,0.62], outputGain:0.25,
	pitchSweep:3, pitchVariation:2, filterSweep:0.92, sustain:0.8, tuningSemitones:7
})
export const PRESET_INDUSTRIAL_PLATE = preset({
	name:"Industrial Plate", length:0.58, bandpass:1900, ratios:[410,735], q:3.6,
	waveforms:["sawtooth","triangle"], partialLevels:[0.42,0.5], outputGain:0.32,
	pitchSweep:95, pitchVariation:14, filterSweep:0.46, sustain:0.64
})
export const PRESET_ACOUSTIC_SMALL_COWBELL = preset({
	name:"Small Acoustic Cowbell", length:0.18, bandpass:2950, ratios:[650,990], q:4,
	waveforms:["triangle","sine"], partialLevels:[0.68,0.25], outputGain:0.35,
	pitchSweep:30, pitchVariation:8, filterSweep:0.6, sustain:0.48
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
	PRESET_505_COWBELL,
	PRESET_CASIO_RZ1_COWBELL,
	PRESET_KORG_DDD1_COWBELL,
	PRESET_707_COWBELL,
	PRESET_KORG_KR55_COWBELL,
	PRESET_LINNDRUM_COWBELL,
	PRESET_OBERHEIM_DMX_COWBELL,
	PRESET_DRUMTRAKS_COWBELL,
	PRESET_SP1200_COWBELL,
	PRESET_YAMAHA_RX5_COWBELL,
	PRESET_ALESIS_HR16_COWBELL,

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
	PRESET_WOODBLOCK_COWBELL,
	PRESET_SALSA_LOW_COWBELL,
	PRESET_SALSA_HIGH_COWBELL,
	PRESET_DEEP_RING_COWBELL,
	PRESET_MUTED_HAND_COWBELL,
	PRESET_BENT_COWBELL,
	PRESET_SOFT_STUDIO_COWBELL,
	PRESET_BRUSHED_COWBELL,
	PRESET_WARM_ANALOG_COWBELL,
	PRESET_GLASS_COWBELL,
	PRESET_TAPE_COWBELL,
	PRESET_FUNK_COWBELL,
	PRESET_DUB_COWBELL,
	PRESET_MINIMAL_CLICK_COWBELL,
	PRESET_AFRO_COWBELL,
	PRESET_ORBITAL_BELL,
	PRESET_INDUSTRIAL_PLATE,
	PRESET_ACOUSTIC_SMALL_COWBELL,
]

export const getRandomCowbellPreset = () => {
	const i = Math.floor(Math.random() * PRESET_COWBELLS.length)
	return PRESET_COWBELLS[i]
}

export const getCowbellPresets = () => PRESET_COWBELLS.slice()

const STYLE_COWBELLS = {
	Space:[PRESET_ORBITAL_BELL, PRESET_GLASS_COWBELL, PRESET_DEEP_RING_COWBELL],
	Electronic:[PRESET_MINIMAL_CLICK_COWBELL, PRESET_WARM_ANALOG_COWBELL, PRESET_909_COWBELL],
	Breaks:[PRESET_TAPE_COWBELL, PRESET_DRY_COWBELL, PRESET_FUNK_COWBELL],
	"Classic Breaks":[PRESET_FUNK_COWBELL, PRESET_DRY_COWBELL, PRESET_CR78_COWBELL],
	"Classic Styles":[PRESET_SOFT_STUDIO_COWBELL, PRESET_FUNK_COWBELL, PRESET_WARM_ANALOG_COWBELL],
	Brazilian:[PRESET_SALSA_LOW_COWBELL, PRESET_SALSA_HIGH_COWBELL, PRESET_AFRO_COWBELL],
	Jamaican:[PRESET_DUB_COWBELL, PRESET_DARK_COWBELL, PRESET_WOODBLOCK_COWBELL],
	"West African":[PRESET_AFRO_COWBELL, PRESET_AGOGO_COWBELL, PRESET_HIGH_COWBELL],
	Jazz:[PRESET_BRUSHED_COWBELL, PRESET_SOFT_STUDIO_COWBELL, PRESET_WOODBLOCK_COWBELL],
	Rock:[PRESET_ACOUSTIC_SMALL_COWBELL, PRESET_DAMPENED_COWBELL, PRESET_DRY_COWBELL],
	Organic:[PRESET_WOODBLOCK_COWBELL, PRESET_BRUSHED_COWBELL, PRESET_SOFT_STUDIO_COWBELL],
	Heavy:[PRESET_INDUSTRIAL_PLATE, PRESET_BENT_COWBELL, PRESET_MUTED_HAND_COWBELL]
}

export const getCowbellPresetForStyle = (style, seed="") => {
	const choices = STYLE_COWBELLS[style] ?? STYLE_COWBELLS.Organic
	const hash = Array.from(String(seed)).reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 0)
	return choices[hash % choices.length]
}
