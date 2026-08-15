export const DEFAULT_SHAKER_OPTIONS = Object.freeze({
	name:"Studio Shaker",
	length:0.13,
	attack:0.001,
	decay:0.05,
	fineLevel:0.75,
	coarseLevel:0.25,
	bandpass:5200,
	bandpassQ:0.75,
	highpass:1800,
	outputGain:0.42,
	velocity:1,
})

const preset = (name, options) => Object.freeze({ ...DEFAULT_SHAKER_OPTIONS, name, ...options })

export const PRESET_808_MARACAS = preset("808 Maracas", {
	length:0.07, decay:0.022, fineLevel:0.82, coarseLevel:0.18,
	bandpass:6200, bandpassQ:0.62, highpass:2400, outputGain:0.38,
})
export const PRESET_727_MARACAS = preset("727-style Maracas", {
	length:0.09, decay:0.03, fineLevel:0.48, coarseLevel:0.52,
	bandpass:5400, bandpassQ:1.05, highpass:2050, outputGain:0.42,
})
export const PRESET_727_CABASA = preset("727-style Cabasa", {
	length:0.16, decay:0.07, fineLevel:0.36, coarseLevel:0.64,
	bandpass:6800, bandpassQ:0.9, highpass:2700, outputGain:0.43,
})
export const PRESET_SOFT_SHAKER = preset("Soft Seed Shaker", {
	length:0.22, attack:0.004, decay:0.1, fineLevel:0.9, coarseLevel:0.1,
	bandpass:3900, bandpassQ:0.55, highpass:1050, outputGain:0.32,
})
export const PRESET_BRIGHT_SHAKER = preset("Bright Metal Shaker", {
	length:0.18, decay:0.065, fineLevel:0.7, coarseLevel:0.3,
	bandpass:7900, bandpassQ:1.15, highpass:3500, outputGain:0.38,
})

export const PRESET_SHAKERS = Object.freeze([
	PRESET_SOFT_SHAKER, DEFAULT_SHAKER_OPTIONS, PRESET_808_MARACAS,
	PRESET_727_MARACAS, PRESET_727_CABASA, PRESET_BRIGHT_SHAKER,
])
export const PRESET_MARACAS = Object.freeze([PRESET_808_MARACAS, PRESET_727_MARACAS])
export const PRESET_CABASAS = Object.freeze([PRESET_727_CABASA, PRESET_SOFT_SHAKER, PRESET_BRIGHT_SHAKER])
