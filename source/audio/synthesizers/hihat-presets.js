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
	lowpass:11500,
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
	lowpass:10500,
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

export const CLOSED_HIHAT_606 = closed({
	name:"606 Closed Hihat",
	velocity:0.92,
	length:0.038,
	fundamental:48,
	ratios:[2, 3.17, 4.22, 5.5, 6.93, 8.35],
	decay:0.006,
	sustain:0.66,
	release:0.008,
	highpass:7800,
	bandpass:10500,
	lowpass:12800,
	type:"square",
})

export const CLOSED_HIHAT_505 = closed({
	name:"505 Closed Hihat",
	velocity:0.86,
	length:0.052,
	fundamental:37,
	ratios:[2, 3.05, 4.11, 5.38, 6.72, 8.08],
	decay:0.009,
	sustain:0.58,
	release:0.012,
	highpass:5200,
	bandpass:7600,
	lowpass:9800,
	type:"triangle",
})

export const CLOSED_HIHAT_CASIO_RZ1 = closed({
	name:"Casio RZ-1 Closed Hihat",
	velocity:0.9,
	length:0.05,
	fundamental:35,
	ratios:[2, 2.91, 4.27, 5.12, 6.58, 7.81],
	decay:0.011,
	sustain:0.62,
	release:0.012,
	highpass:4200,
	bandpass:6900,
	lowpass:8500,
	type:"square",
})

export const CLOSED_HIHAT_KORG_DDD1 = closed({
	name:"Korg DDD-1 Closed Hihat",
	velocity:0.92,
	length:0.058,
	fundamental:41,
	ratios:[2, 3.08, 4.18, 5.44, 6.82, 8.16],
	decay:0.01,
	sustain:0.64,
	release:0.014,
	highpass:6000,
	bandpass:9300,
	lowpass:11800,
	type:"triangle",
})

export const CLOSED_HIHAT_KORG_KR55 = closed({
	name:"Korg KR-55 Closed Hihat",
	velocity:0.82,
	length:0.045,
	fundamental:39,
	ratios:[2, 3.2, 4.15, 5.62, 6.74, 8.3],
	decay:0.008,
	sustain:0.54,
	release:0.01,
	highpass:4700,
	bandpass:7400,
	lowpass:9200,
	type:"triangle",
})

export const CLOSED_HIHAT_CR78 = closed({
	name:"CR-78 Closed Hihat",
	velocity:0.78,
	length:0.042,
	fundamental:38,
	ratios:[2, 3.22, 4.1, 5.58, 6.7, 8.26],
	decay:0.008,
	sustain:0.52,
	release:0.01,
	highpass:4500,
	bandpass:7000,
	lowpass:9000,
	type:"triangle",
})

export const CLOSED_HIHAT_707 = closed({
	name:"707 Closed Hihat",
	velocity:0.9,
	length:0.048,
	fundamental:40,
	ratios:[2, 3.04, 4.2, 5.36, 6.76, 8.12],
	decay:0.008,
	sustain:0.62,
	release:0.011,
	highpass:6000,
	bandpass:8700,
	lowpass:10800,
	type:"triangle",
})

export const CLOSED_HIHAT_LINNDRUM = closed({
	name:"LinnDrum Closed Hihat",
	velocity:0.9,
	length:0.054,
	fundamental:39,
	ratios:[2, 2.98, 4.23, 5.31, 6.69, 8.04],
	decay:0.01,
	sustain:0.6,
	release:0.013,
	highpass:5200,
	bandpass:8200,
	lowpass:9800,
	type:"triangle",
})

export const CLOSED_HIHAT_BOSS_DR55 = closed({
	name:"Boss DR-55 Closed Hihat", velocity:0.76, length:0.04, fundamental:37,
	ratios:[2, 3.2, 4.12, 5.56, 6.72, 8.24], decay:0.007, sustain:0.5, release:0.009,
	highpass:4400, bandpass:6900, lowpass:8900, type:"triangle",
})

export const CLOSED_HIHAT_OBERHEIM_DMX = closed({
	name:"Oberheim DMX Closed Hihat", velocity:0.98, length:0.055, fundamental:40,
	ratios:[2, 3.03, 4.24, 5.34, 6.68, 8.02], decay:0.009, sustain:0.66, release:0.012,
	highpass:5600, bandpass:8500, lowpass:10200, type:"square",
})

export const CLOSED_HIHAT_DRUMTRAKS = closed({
	name:"Sequential DrumTraks Closed Hihat", velocity:0.94, length:0.058, fundamental:41,
	ratios:[2, 3.07, 4.19, 5.42, 6.8, 8.14], decay:0.01, sustain:0.64, release:0.013,
	highpass:5900, bandpass:9000, lowpass:11200, type:"triangle",
})

export const CLOSED_HIHAT_SP1200 = closed({
	name:"E-mu SP-1200 Closed Hihat", velocity:0.92, length:0.052, fundamental:36,
	ratios:[2, 2.94, 4.28, 5.16, 6.55, 7.86], decay:0.011, sustain:0.6, release:0.012,
	highpass:4200, bandpass:7000, lowpass:8300, type:"square",
})

export const CLOSED_HIHAT_YAMAHA_RX5 = closed({
	name:"Yamaha RX5 Closed Hihat", velocity:1, length:0.06, fundamental:43,
	ratios:[2, 3.09, 4.21, 5.47, 6.86, 8.18], decay:0.008, sustain:0.7, release:0.013,
	highpass:6800, bandpass:10400, lowpass:13200, type:"triangle",
})

export const CLOSED_HIHAT_ALESIS_HR16 = closed({
	name:"Alesis HR-16 Closed Hihat", velocity:0.98, length:0.062, fundamental:42,
	ratios:[2, 3.06, 4.17, 5.39, 6.77, 8.1], decay:0.01, sustain:0.68, release:0.014,
	highpass:6400, bandpass:9800, lowpass:12600, type:"triangle",
})

export const CLOSED_HIHAT_SIMMONS_SDSV = closed({
	name:"Simmons SDS-V Closed Hihat", velocity:1.02, length:0.05, fundamental:46,
	ratios:[2, 3.15, 4.36, 5.52, 6.96, 8.4], decay:0.007, sustain:0.72, release:0.011,
	highpass:7200, bandpass:11200, lowpass:13600, type:"square",
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

export const OPEN_HIHAT_606 = open({
	name:"606 Open Hihat",
	velocity:0.94,
	length:0.32,
	fundamental:48,
	ratios:[2, 3.17, 4.22, 5.5, 6.93, 8.35],
	decay:0.035,
	sustain:0.78,
	release:0.12,
	highpass:7600,
	bandpass:10500,
	lowpass:12800,
	type:"square",
})

export const OPEN_HIHAT_505 = open({
	name:"505 Open Hihat",
	velocity:0.88,
	length:0.34,
	fundamental:37,
	ratios:[2, 3.05, 4.11, 5.38, 6.72, 8.08],
	decay:0.045,
	sustain:0.7,
	release:0.14,
	highpass:5000,
	bandpass:7600,
	lowpass:9800,
	type:"triangle",
})

export const OPEN_HIHAT_CASIO_RZ1 = open({
	name:"Casio RZ-1 Open Hihat",
	velocity:0.9,
	length:0.3,
	fundamental:35,
	ratios:[2, 2.91, 4.27, 5.12, 6.58, 7.81],
	decay:0.04,
	sustain:0.72,
	release:0.12,
	highpass:4100,
	bandpass:6900,
	lowpass:8500,
	type:"square",
})

export const OPEN_HIHAT_KORG_DDD1 = open({
	name:"Korg DDD-1 Open Hihat",
	velocity:0.94,
	length:0.4,
	fundamental:41,
	ratios:[2, 3.08, 4.18, 5.44, 6.82, 8.16],
	decay:0.05,
	sustain:0.76,
	release:0.17,
	highpass:5800,
	bandpass:9300,
	lowpass:11800,
	type:"triangle",
})

export const OPEN_HIHAT_KORG_KR55 = open({
	name:"Korg KR-55 Open Hihat",
	velocity:0.84,
	length:0.28,
	fundamental:39,
	ratios:[2, 3.2, 4.15, 5.62, 6.74, 8.3],
	decay:0.035,
	sustain:0.68,
	release:0.1,
	highpass:4500,
	bandpass:7400,
	lowpass:9200,
	type:"triangle",
})

export const OPEN_HIHAT_CR78 = open({
	name:"CR-78 Open Hihat",
	velocity:0.8,
	length:0.24,
	fundamental:38,
	ratios:[2, 3.22, 4.1, 5.58, 6.7, 8.26],
	decay:0.035,
	sustain:0.64,
	release:0.09,
	highpass:4300,
	bandpass:7000,
	lowpass:9000,
	type:"triangle",
})

export const OPEN_HIHAT_707 = open({
	name:"707 Open Hihat",
	velocity:0.92,
	length:0.36,
	fundamental:40,
	ratios:[2, 3.04, 4.2, 5.36, 6.76, 8.12],
	decay:0.045,
	sustain:0.74,
	release:0.15,
	highpass:5800,
	bandpass:8700,
	lowpass:10800,
	type:"triangle",
})

export const OPEN_HIHAT_LINNDRUM = open({
	name:"LinnDrum Open Hihat",
	velocity:0.92,
	length:0.42,
	fundamental:39,
	ratios:[2, 2.98, 4.23, 5.31, 6.69, 8.04],
	decay:0.05,
	sustain:0.72,
	release:0.18,
	highpass:5000,
	bandpass:8200,
	lowpass:9800,
	type:"triangle",
})

export const OPEN_HIHAT_BOSS_DR55 = open({
	name:"Boss DR-55 Open Hihat", velocity:0.78, length:0.22, fundamental:37,
	ratios:[2, 3.2, 4.12, 5.56, 6.72, 8.24], decay:0.032, sustain:0.62, release:0.08,
	highpass:4200, bandpass:6900, lowpass:8900, type:"triangle",
})

export const OPEN_HIHAT_OBERHEIM_DMX = open({
	name:"Oberheim DMX Open Hihat", velocity:1, length:0.38, fundamental:40,
	ratios:[2, 3.03, 4.24, 5.34, 6.68, 8.02], decay:0.045, sustain:0.76, release:0.16,
	highpass:5400, bandpass:8500, lowpass:10200, type:"square",
})

export const OPEN_HIHAT_DRUMTRAKS = open({
	name:"Sequential DrumTraks Open Hihat", velocity:0.96, length:0.4, fundamental:41,
	ratios:[2, 3.07, 4.19, 5.42, 6.8, 8.14], decay:0.05, sustain:0.75, release:0.17,
	highpass:5700, bandpass:9000, lowpass:11200, type:"triangle",
})

export const OPEN_HIHAT_SP1200 = open({
	name:"E-mu SP-1200 Open Hihat", velocity:0.94, length:0.34, fundamental:36,
	ratios:[2, 2.94, 4.28, 5.16, 6.55, 7.86], decay:0.045, sustain:0.7, release:0.14,
	highpass:4000, bandpass:7000, lowpass:8300, type:"square",
})

export const OPEN_HIHAT_YAMAHA_RX5 = open({
	name:"Yamaha RX5 Open Hihat", velocity:1.02, length:0.46, fundamental:43,
	ratios:[2, 3.09, 4.21, 5.47, 6.86, 8.18], decay:0.05, sustain:0.8, release:0.2,
	highpass:6600, bandpass:10400, lowpass:13200, type:"triangle",
})

export const OPEN_HIHAT_ALESIS_HR16 = open({
	name:"Alesis HR-16 Open Hihat", velocity:1, length:0.44, fundamental:42,
	ratios:[2, 3.06, 4.17, 5.39, 6.77, 8.1], decay:0.052, sustain:0.78, release:0.19,
	highpass:6200, bandpass:9800, lowpass:12600, type:"triangle",
})

export const OPEN_HIHAT_SIMMONS_SDSV = open({
	name:"Simmons SDS-V Open Hihat", velocity:1.04, length:0.4, fundamental:46,
	ratios:[2, 3.15, 4.36, 5.52, 6.96, 8.4], decay:0.04, sustain:0.82, release:0.17,
	highpass:7000, bandpass:11200, lowpass:13600, type:"square",
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

export const OPEN_HIHAT_SPLASH = open({
	name:"Splash Cymbal", velocity:1.05, length:0.72, fundamental:64,
	attack:0.0002, decay:0.08, sustain:0.78, release:0.38,
	highpass:7200, bandpass:11200, ratios:[2.1,3.3,4.8,6.2,8.1,10.4], type:"square",
})

export const OPEN_HIHAT_CHINA = open({
	name:"China Cymbal", velocity:1.18, length:1.35, fundamental:43,
	attack:0.0002, decay:0.13, sustain:0.82, release:0.7,
	highpass:4300, bandpass:7600, ratios:[1.7,2.65,4.2,5.45,7.2,9.8], type:"square",
})

// ============================================================
// COLLECTIONS
// ============================================================

export const PRESET_HIHATS_CLOSED = [
	DEFAULT_CLOSED_HIHAT,
	CLOSED_HIHAT_TINY,
	CLOSED_HIHAT_808,
	CLOSED_HIHAT_909,
	CLOSED_HIHAT_606,
	CLOSED_HIHAT_505,
	CLOSED_HIHAT_CASIO_RZ1,
	CLOSED_HIHAT_KORG_DDD1,
	CLOSED_HIHAT_KORG_KR55,
	CLOSED_HIHAT_CR78,
	CLOSED_HIHAT_707,
	CLOSED_HIHAT_LINNDRUM,
	CLOSED_HIHAT_BOSS_DR55,
	CLOSED_HIHAT_OBERHEIM_DMX,
	CLOSED_HIHAT_DRUMTRAKS,
	CLOSED_HIHAT_SP1200,
	CLOSED_HIHAT_YAMAHA_RX5,
	CLOSED_HIHAT_ALESIS_HR16,
	CLOSED_HIHAT_SIMMONS_SDSV,
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
	OPEN_HIHAT_606,
	OPEN_HIHAT_505,
	OPEN_HIHAT_CASIO_RZ1,
	OPEN_HIHAT_KORG_DDD1,
	OPEN_HIHAT_KORG_KR55,
	OPEN_HIHAT_CR78,
	OPEN_HIHAT_707,
	OPEN_HIHAT_LINNDRUM,
	OPEN_HIHAT_BOSS_DR55,
	OPEN_HIHAT_OBERHEIM_DMX,
	OPEN_HIHAT_DRUMTRAKS,
	OPEN_HIHAT_SP1200,
	OPEN_HIHAT_YAMAHA_RX5,
	OPEN_HIHAT_ALESIS_HR16,
	OPEN_HIHAT_SIMMONS_SDSV,
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
	OPEN_HIHAT_SPLASH,
	OPEN_HIHAT_CHINA,
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
	CLOSED_HIHAT_606,
	CLOSED_HIHAT_505,
	CLOSED_HIHAT_CASIO_RZ1,
	CLOSED_HIHAT_KORG_DDD1,
	CLOSED_HIHAT_KORG_KR55,
	CLOSED_HIHAT_CR78,
	CLOSED_HIHAT_707,
	CLOSED_HIHAT_LINNDRUM,
	CLOSED_HIHAT_BOSS_DR55,
	CLOSED_HIHAT_OBERHEIM_DMX,
	CLOSED_HIHAT_DRUMTRAKS,
	CLOSED_HIHAT_SP1200,
	CLOSED_HIHAT_YAMAHA_RX5,
	CLOSED_HIHAT_ALESIS_HR16,
	CLOSED_HIHAT_SIMMONS_SDSV,
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
	OPEN_HIHAT_606,
	OPEN_HIHAT_505,
	OPEN_HIHAT_CASIO_RZ1,
	OPEN_HIHAT_KORG_DDD1,
	OPEN_HIHAT_KORG_KR55,
	OPEN_HIHAT_CR78,
	OPEN_HIHAT_707,
	OPEN_HIHAT_LINNDRUM,
	OPEN_HIHAT_BOSS_DR55,
	OPEN_HIHAT_OBERHEIM_DMX,
	OPEN_HIHAT_DRUMTRAKS,
	OPEN_HIHAT_SP1200,
	OPEN_HIHAT_YAMAHA_RX5,
	OPEN_HIHAT_ALESIS_HR16,
	OPEN_HIHAT_SIMMONS_SDSV,
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

export const getHihatPair = hat => {
	const isOpen = /\bopen\b/i.test(hat?.name ?? "")
	const source = isOpen ? PRESET_HIHATS_OPEN : PRESET_HIHATS_CLOSED
	const counterpart = isOpen ? PRESET_HIHATS_CLOSED : PRESET_HIHATS_OPEN
	const counterpartName = hat?.name?.replace(isOpen ? /\bOpen\b/i : /\bClosed\b/i, isOpen ? "Closed" : "Open")
	const pairedHat = counterpart.find(preset => preset.name === counterpartName)
	const sourceIndex = source.indexOf(hat)
	const fallback = counterpart[Math.max(0, sourceIndex) % counterpart.length]

	return {
		closed:isOpen ? (pairedHat ?? fallback) : hat,
		open:isOpen ? hat : (pairedHat ?? fallback)
	}
}

export const getHihatPresets = () => PRESET_HIHATS.slice()
