export const DEFAULT_SCRAPE_OPTIONS = Object.freeze({
	name:"Short Guiro", velocity:1, length:0.18, strokes:5, spacing:0.026,
	bandpass:3600, bandpassQ:2.6, highpass:900, bodyFrequency:760,
	bodyLevel:0.12, outputGain:0.34, attack:0.001, triggerAt:0,
})

const preset = (name, options) => Object.freeze({ ...DEFAULT_SCRAPE_OPTIONS, name, ...options })
export const PRESET_SHORT_GUIRO = preset("Short Guiro", { length:0.14, strokes:4, spacing:0.024, bandpass:4100 })
export const PRESET_LONG_GUIRO = preset("Long Guiro", { length:0.38, strokes:11, spacing:0.03, bandpass:3400, outputGain:0.3 })
export const PRESET_727_QUIJADA = preset("727-style Quijada", { length:0.32, strokes:9, spacing:0.027, bandpass:2300, bandpassQ:4.2, bodyFrequency:520, bodyLevel:0.28, outputGain:0.31 })
export const PRESET_DRY_QUIJADA = preset("Dry Jawbone", { length:0.24, strokes:7, spacing:0.025, bandpass:2800, bodyFrequency:610, bodyLevel:0.22 })
export const PRESET_SCRAPES = Object.freeze([PRESET_SHORT_GUIRO, PRESET_LONG_GUIRO, PRESET_727_QUIJADA, PRESET_DRY_QUIJADA])
