/**
 * Clack presets
 *
 * Click / clack / rim / stick / clave style ultra-short percussion using a
 * pair of tuned oscillators driven through a bandpass + highpass filter.
 *
 * The original clack synth only honoured `velocity`, `length` and
 * `octave` from its options - presets are mostly variations on those, with
 * the addition of an optional `ratios`/`bandpass`/`highpass` config that
 * future-friendly synth implementations can pick up.
 */

export const DEFAULT_CLACK_OPTIONS = {
	name:"Default Clack",
	velocity:1,
	length:0.05,
	octave:1,
	// hint values - currently informational, may be honoured by future synth
	ratios:[587, 845],
	bandpass:2640,
	bandpassQ:3.5,
	highpass:7000,
	// optional absolute audioContext time to schedule the trigger at
	// (0 / falsy = play immediately at audioContext.currentTime + ZERO)
	triggerAt:0
}

const preset = (overrides) => Object.assign({}, DEFAULT_CLACK_OPTIONS, overrides)

// ============================================================
// CLICKS / TICKS
// ============================================================

export const PRESET_TICK_CLACK = preset({
	name:"Tick Clack",
	velocity:0.85,
	length:0.018,
	octave:1.2,
})

export const PRESET_HARD_CLACK = preset({
	name:"Hard Clack",
	velocity:1.4,
	length:0.04,
	octave:1.0,
})

export const PRESET_SOFT_CLACK = preset({
	name:"Soft Clack",
	velocity:0.55,
	length:0.06,
	octave:0.8,
})

export const PRESET_TIGHT_CLACK = preset({
	name:"Tight Clack",
	velocity:1.0,
	length:0.025,
	octave:1.1,
})

export const PRESET_WIDE_CLACK = preset({
	name:"Wide Clack",
	velocity:1.0,
	length:0.12,
	octave:0.9,
})

// ============================================================
// PERCUSSION VARIANTS
// ============================================================

export const PRESET_RIM_CLACK = preset({
	name:"Rim Shot",
	velocity:1.1,
	length:0.05,
	octave:1.3,
	ratios:[750, 1080],
	bandpass:3200,
	bandpassQ:4.5,
	highpass:8000,
})

export const PRESET_STICK_CLACK = preset({
	name:"Drumstick",
	velocity:1.0,
	length:0.04,
	octave:1.5,
	ratios:[880, 1320],
	bandpass:4500,
	bandpassQ:5.0,
	highpass:9000,
})

export const PRESET_CROSS_STICK = preset({
	name:"Cross Stick",
	velocity:1.0,
	length:0.07,
	octave:1.1,
	ratios:[640, 920],
	bandpass:2800,
	bandpassQ:4.0,
	highpass:7500,
})

export const PRESET_CLAVE_CLACK = preset({
	name:"Clave",
	velocity:1.0,
	length:0.08,
	octave:1.4,
	ratios:[1200, 1800],
	bandpass:5000,
	bandpassQ:6.5,
	highpass:9500,
})

export const PRESET_WOODBLOCK_CLACK = preset({
	name:"Woodblock",
	velocity:1.0,
	length:0.06,
	octave:1.6,
	ratios:[940, 1410],
	bandpass:4200,
	bandpassQ:6.0,
	highpass:8000,
})

export const PRESET_CASTANET_CLACK = preset({
	name:"Castanet",
	velocity:1.0,
	length:0.045,
	octave:1.8,
	ratios:[1100, 1650],
	bandpass:5500,
	bandpassQ:5.5,
	highpass:9500,
})

export const PRESET_SIDE_STICK = preset({
	name:"Side Stick",
	velocity:0.95,
	length:0.05,
	octave:1.2,
	ratios:[700, 1010],
	bandpass:3000,
	bandpassQ:4.5,
	highpass:7500,
})

// ============================================================
// CHARACTER VARIANTS
// ============================================================

export const PRESET_LOFI_CLACK = preset({
	name:"Lo-Fi Clack",
	velocity:0.75,
	length:0.07,
	octave:0.85,
	bandpass:2000,
	bandpassQ:2.5,
	highpass:5000,
})

export const PRESET_DISTORTED_CLACK = preset({
	name:"Distorted Clack",
	velocity:2.5,
	length:0.06,
	octave:1.0,
	bandpass:3000,
	bandpassQ:3.0,
	highpass:6500,
})

export const PRESET_LOW_CLACK = preset({
	name:"Low Clack",
	velocity:1.05,
	length:0.06,
	octave:0.6,
	ratios:[400, 580],
	bandpass:1800,
	bandpassQ:3.0,
	highpass:5500,
})

export const PRESET_HIGH_CLACK = preset({
	name:"High Clack",
	velocity:1.0,
	length:0.04,
	octave:1.7,
	ratios:[900, 1320],
	bandpass:4500,
	bandpassQ:5.0,
	highpass:9000,
})

export const PRESET_PERC_CLACK = preset({
	name:"Perc Clack",
	velocity:1.0,
	length:0.035,
	octave:1.0,
	bandpass:3500,
	bandpassQ:4.0,
	highpass:7500,
})

export const PRESET_GLITCH_CLACK = preset({
	name:"Glitch Clack",
	velocity:1.2,
	length:0.012,
	octave:2.0,
	bandpass:6000,
	bandpassQ:7.0,
	highpass:10000,
})

// ============================================================
// COLLECTIONS
// ============================================================

export const PRESET_CLACKS = [
	DEFAULT_CLACK_OPTIONS,

	// Clicks
	PRESET_TICK_CLACK,
	PRESET_HARD_CLACK,
	PRESET_SOFT_CLACK,
	PRESET_TIGHT_CLACK,
	PRESET_WIDE_CLACK,

	// Percussion variants
	PRESET_RIM_CLACK,
	PRESET_STICK_CLACK,
	PRESET_CROSS_STICK,
	PRESET_CLAVE_CLACK,
	PRESET_WOODBLOCK_CLACK,
	PRESET_CASTANET_CLACK,
	PRESET_SIDE_STICK,

	// Character
	PRESET_LOFI_CLACK,
	PRESET_DISTORTED_CLACK,
	PRESET_LOW_CLACK,
	PRESET_HIGH_CLACK,
	PRESET_PERC_CLACK,
	PRESET_GLITCH_CLACK,
]

export const getRandomClackPreset = () => {
	const i = Math.floor(Math.random() * PRESET_CLACKS.length)
	return PRESET_CLACKS[i]
}

export const getClackPresets = () => PRESET_CLACKS.slice()
