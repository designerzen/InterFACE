/**
 * Hi-hat presets
 *
 * Library of open and closed hi-hat presets, ranging from clean drum
 * machine emulations to gritty distorted, glassy, lo-fi and shimmering
 * variants.  The hi-hat synth uses six tuned oscillators routed through a
 * bandpass + highpass pair.
 */

const DEFAULT_RATIOS = [2, 3, 4.16, 5.43, 6.79, 8.21]

export const DEFAULT_OPEN_HIHAT = {
	name:"Default Open Hihat",
	velocity:1,
	length:0.09,
	fundamental:40,
	ratios:DEFAULT_RATIOS,
	attack:0.0001,
	decay:0.05,
	// sustain is a volume not a time
	sustain:0.96,
	release:0.01,
	highpass:7000,
	bandpass:10000,
	type:"triangle",
	// optional absolute audioContext time to schedule the trigger at
	// (0 / falsy = play immediately at audioContext.currentTime + ZERO)
	triggerAt:0
}

export const DEFAULT_CLOSED_HIHAT = {
	name:"Default Closed Hihat",
	velocity:1,
	length:0.05,
	fundamental:40,
	ratios:DEFAULT_RATIOS,
	attack:0.0001,
	decay:0.005,
	sustain:0.7,
	release:0.01,
	highpass:7000,
	bandpass:10000,
	type:"triangle",
	triggerAt:0
}

const open = (overrides) => Object.assign({}, DEFAULT_OPEN_HIHAT, overrides)
const closed = (overrides) => Object.assign({}, DEFAULT_CLOSED_HIHAT, overrides)

// ============================================================
// CLOSED HI-HATS
// ============================================================

export const CLOSED_HIHAT_TINY = closed({
	name:"Tiny Closed Hihat",
	velocity:1,
	length:0.03,
	attack:0.0002,
	decay:0.007,
	sustain:0.7,
	release:0.03,
	highpass:7000,
	bandpass:20000,
	type:"triangle",
})

export const CLOSED_HIHAT_808 = closed({
	name:"808 Closed Hihat",
	velocity:1,
	length:0.045,
	fundamental:42,
	attack:0.0001,
	decay:0.008,
	sustain:0.75,
	release:0.012,
	highpass:8000,
	bandpass:11000,
	type:"square",
})

export const CLOSED_HIHAT_909 = closed({
	name:"909 Closed Hihat",
	velocity:1.05,
	length:0.05,
	fundamental:45,
	attack:0.0001,
	decay:0.006,
	sustain:0.8,
	release:0.01,
	highpass:9000,
	bandpass:13000,
	type:"square",
})

export const CLOSED_HIHAT_TIGHT = closed({
	name:"Tight Closed Hihat",
	velocity:1.0,
	length:0.025,
	attack:0.0001,
	decay:0.004,
	sustain:0.55,
	release:0.005,
	highpass:9000,
	bandpass:15000,
	type:"square",
})

export const CLOSED_HIHAT_METALLIC = closed({
	name:"Metallic Closed Hihat",
	velocity:1.1,
	length:0.06,
	fundamental:55,
	attack:0.0001,
	decay:0.008,
	sustain:0.85,
	release:0.012,
	highpass:6500,
	bandpass:12000,
	ratios:[2, 3.1, 4.5, 5.9, 7.4, 9.0],
	type:"square",
})

export const CLOSED_HIHAT_LOFI = closed({
	name:"Lo-Fi Closed Hihat",
	velocity:0.85,
	length:0.05,
	fundamental:38,
	attack:0.0003,
	decay:0.012,
	sustain:0.5,
	release:0.015,
	highpass:5000,
	bandpass:7500,
	type:"triangle",
})

export const CLOSED_HIHAT_TRAP = closed({
	name:"Trap Closed Hihat",
	velocity:1.1,
	length:0.04,
	attack:0.0001,
	decay:0.005,
	sustain:0.7,
	release:0.008,
	highpass:8500,
	bandpass:12500,
	type:"square",
})

export const CLOSED_HIHAT_HOUSE = closed({
	name:"House Closed Hihat",
	velocity:1.0,
	length:0.06,
	attack:0.0001,
	decay:0.008,
	sustain:0.7,
	release:0.012,
	highpass:7500,
	bandpass:11000,
	type:"triangle",
})

export const CLOSED_HIHAT_TECHNO = closed({
	name:"Techno Closed Hihat",
	velocity:1.05,
	length:0.05,
	fundamental:42,
	attack:0.0001,
	decay:0.006,
	sustain:0.8,
	release:0.01,
	highpass:8500,
	bandpass:14000,
	type:"square",
})

export const CLOSED_HIHAT_GLASS = closed({
	name:"Glass Closed Hihat",
	velocity:0.95,
	length:0.07,
	fundamental:60,
	attack:0.0002,
	decay:0.012,
	sustain:0.65,
	release:0.018,
	highpass:9500,
	bandpass:14500,
	ratios:[2.5, 3.7, 5.1, 6.4, 8.0, 9.6],
	type:"sine",
})

export const CLOSED_HIHAT_DARK = closed({
	name:"Dark Closed Hihat",
	velocity:0.9,
	length:0.07,
	fundamental:32,
	attack:0.0002,
	decay:0.012,
	sustain:0.55,
	release:0.018,
	highpass:4000,
	bandpass:6000,
	type:"triangle",
})

export const CLOSED_HIHAT_CHATTERY = closed({
	name:"Chattery Closed Hihat",
	velocity:1.0,
	length:0.04,
	fundamental:48,
	attack:0.0001,
	decay:0.006,
	sustain:0.7,
	release:0.008,
	highpass:8000,
	bandpass:13000,
	ratios:[2.1, 3.3, 4.7, 6.1, 7.7, 9.5],
	type:"square",
})

// ============================================================
// OPEN HI-HATS
// ============================================================

export const OPEN_HIHAT_TINY = open({
	name:"Tiny Open Hihat",
	velocity:1,
	length:0.06,
	attack:0.0001,
	decay:0.05,
	sustain:0.9,
	release:0.01,
	highpass:7000,
	bandpass:10000,
	type:"triangle",
})

export const OPEN_HIHAT_SHORT = open({
	name:"Short Open Hihat",
	velocity:5,
	length:0.97,
	attack:0.0001,
	decay:0.05,
	sustain:0.7,
	release:0.04,
	highpass:7000,
	bandpass:10000,
	type:"square",
})

export const OPEN_HIHAT_808 = open({
	name:"808 Open Hihat",
	velocity:1.0,
	length:0.55,
	fundamental:42,
	attack:0.0001,
	decay:0.05,
	sustain:0.85,
	release:0.18,
	highpass:7500,
	bandpass:11000,
	type:"square",
})

export const OPEN_HIHAT_909 = open({
	name:"909 Open Hihat",
	velocity:1.05,
	length:0.4,
	fundamental:45,
	attack:0.0001,
	decay:0.04,
	sustain:0.9,
	release:0.15,
	highpass:8500,
	bandpass:13000,
	type:"square",
})

export const OPEN_HIHAT_LONG = open({
	name:"Long Open Hihat",
	velocity:1.1,
	length:0.85,
	fundamental:42,
	attack:0.0002,
	decay:0.06,
	sustain:0.85,
	release:0.3,
	highpass:7500,
	bandpass:11500,
	type:"triangle",
})

export const OPEN_HIHAT_SIZZLE = open({
	name:"Sizzle Open Hihat",
	velocity:1.2,
	length:1.2,
	fundamental:50,
	attack:0.0001,
	decay:0.05,
	sustain:0.92,
	release:0.5,
	highpass:9000,
	bandpass:14000,
	ratios:[2.2, 3.4, 4.8, 6.2, 7.8, 9.4],
	type:"square",
})

export const OPEN_HIHAT_HOUSE = open({
	name:"House Open Hihat",
	velocity:1.05,
	length:0.4,
	attack:0.0001,
	decay:0.04,
	sustain:0.85,
	release:0.12,
	highpass:7500,
	bandpass:11000,
	type:"triangle",
})

export const OPEN_HIHAT_TECHNO = open({
	name:"Techno Open Hihat",
	velocity:1.1,
	length:0.3,
	fundamental:42,
	attack:0.0001,
	decay:0.04,
	sustain:0.88,
	release:0.1,
	highpass:8500,
	bandpass:13000,
	type:"square",
})

export const OPEN_HIHAT_TRAP = open({
	name:"Trap Open Hihat",
	velocity:1.0,
	length:0.7,
	attack:0.0001,
	decay:0.05,
	sustain:0.85,
	release:0.25,
	highpass:8500,
	bandpass:12500,
	type:"square",
})

export const OPEN_HIHAT_DISTORTED = open({
	name:"Distorted Open Hihat",
	velocity:3,
	length:0.5,
	fundamental:48,
	attack:0.0001,
	decay:0.04,
	sustain:0.95,
	release:0.18,
	highpass:6500,
	bandpass:10500,
	type:"square",
})

export const OPEN_HIHAT_SHIMMER = open({
	name:"Shimmer Open Hihat",
	velocity:0.9,
	length:1.5,
	fundamental:65,
	attack:0.0003,
	decay:0.08,
	sustain:0.7,
	release:0.6,
	highpass:10000,
	bandpass:15500,
	ratios:[2.7, 4.1, 5.3, 6.9, 8.5, 10.2],
	type:"sine",
})

export const OPEN_HIHAT_LOFI = open({
	name:"Lo-Fi Open Hihat",
	velocity:0.8,
	length:0.4,
	fundamental:36,
	attack:0.0003,
	decay:0.05,
	sustain:0.6,
	release:0.15,
	highpass:5000,
	bandpass:7500,
	type:"triangle",
})

export const OPEN_HIHAT_DARK = open({
	name:"Dark Open Hihat",
	velocity:0.95,
	length:0.6,
	fundamental:30,
	attack:0.0003,
	decay:0.06,
	sustain:0.7,
	release:0.2,
	highpass:4000,
	bandpass:6000,
	type:"triangle",
})

export const OPEN_HIHAT_CRASH = open({
	name:"Crash-style Open Hihat",
	velocity:1.4,
	length:2.2,
	fundamental:55,
	attack:0.0002,
	decay:0.1,
	sustain:0.85,
	release:1.2,
	highpass:8000,
	bandpass:12500,
	ratios:[2, 3.1, 4.7, 5.9, 7.6, 9.3],
	type:"square",
})

export const OPEN_HIHAT_RIDE = open({
	name:"Ride-style Open Hihat",
	velocity:1.0,
	length:1.0,
	fundamental:48,
	attack:0.0005,
	decay:0.07,
	sustain:0.8,
	release:0.45,
	highpass:6500,
	bandpass:9500,
	ratios:[2.3, 3.5, 4.9, 6.3, 7.9, 9.7],
	type:"triangle",
})

// ============================================================
// COLLECTIONS
// ============================================================

export const PRESET_HIHATS_CLOSED = [
	DEFAULT_CLOSED_HIHAT,
	CLOSED_HIHAT_TINY,
	CLOSED_HIHAT_808,
	CLOSED_HIHAT_909,
	CLOSED_HIHAT_TIGHT,
	CLOSED_HIHAT_METALLIC,
	CLOSED_HIHAT_LOFI,
	CLOSED_HIHAT_TRAP,
	CLOSED_HIHAT_HOUSE,
	CLOSED_HIHAT_TECHNO,
	CLOSED_HIHAT_GLASS,
	CLOSED_HIHAT_DARK,
	CLOSED_HIHAT_CHATTERY,
]

export const PRESET_HIHATS_OPEN = [
	DEFAULT_OPEN_HIHAT,
	OPEN_HIHAT_TINY,
	OPEN_HIHAT_SHORT,
	OPEN_HIHAT_808,
	OPEN_HIHAT_909,
	OPEN_HIHAT_LONG,
	OPEN_HIHAT_SIZZLE,
	OPEN_HIHAT_HOUSE,
	OPEN_HIHAT_TECHNO,
	OPEN_HIHAT_TRAP,
	OPEN_HIHAT_DISTORTED,
	OPEN_HIHAT_SHIMMER,
	OPEN_HIHAT_LOFI,
	OPEN_HIHAT_DARK,
	OPEN_HIHAT_CRASH,
	OPEN_HIHAT_RIDE,
]

export const PRESET_HIHATS = [
	...PRESET_HIHATS_CLOSED,
	...PRESET_HIHATS_OPEN,
]

/**
 * Loop-friendly hi-hats: short, snappy presets safe for live drum loops.
 * Long crash / ride / shimmer / sizzle styles ring out way past the next
 * beat and so are excluded from the random pool.  They remain available
 * via PRESET_HIHATS for manual selection.
 */
export const PRESET_HIHATS_CLOSED_LOOP = [
	DEFAULT_CLOSED_HIHAT,
	CLOSED_HIHAT_TINY,
	CLOSED_HIHAT_808,
	CLOSED_HIHAT_909,
	CLOSED_HIHAT_TIGHT,
	CLOSED_HIHAT_METALLIC,
	CLOSED_HIHAT_LOFI,
	CLOSED_HIHAT_TRAP,
	CLOSED_HIHAT_HOUSE,
	CLOSED_HIHAT_TECHNO,
	CLOSED_HIHAT_GLASS,
	CLOSED_HIHAT_DARK,
	CLOSED_HIHAT_CHATTERY,
]

export const PRESET_HIHATS_OPEN_LOOP = [
	DEFAULT_OPEN_HIHAT,
	OPEN_HIHAT_TINY,
	OPEN_HIHAT_808,
	OPEN_HIHAT_909,
	OPEN_HIHAT_HOUSE,
	OPEN_HIHAT_TECHNO,
	OPEN_HIHAT_DISTORTED,
	OPEN_HIHAT_LOFI,
]

export const PRESET_HIHATS_LOOP = [
	...PRESET_HIHATS_CLOSED_LOOP,
	...PRESET_HIHATS_OPEN_LOOP,
]

export const getRandomHihatPreset = () => {
	const hatIndex = Math.floor(Math.random() * PRESET_HIHATS_LOOP.length)
	return PRESET_HIHATS_LOOP[hatIndex]
}

export const getRandomClosedHihatPreset = () => {
	const i = Math.floor(Math.random() * PRESET_HIHATS_CLOSED_LOOP.length)
	return PRESET_HIHATS_CLOSED_LOOP[i]
}

export const getRandomOpenHihatPreset = () => {
	const i = Math.floor(Math.random() * PRESET_HIHATS_OPEN_LOOP.length)
	return PRESET_HIHATS_OPEN_LOOP[i]
}

export const getHihatPresets = () => PRESET_HIHATS.slice()
