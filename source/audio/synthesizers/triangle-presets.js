export const DEFAULT_TRIANGLE_OPTIONS = Object.freeze({
	name:"Open Triangle",
	frequency:3350,
	partialRatios:[1, 1.31, 1.77, 2.36, 3.05],
	partialLevels:[0.8, 0.52, 0.3, 0.17, 0.09],
	highpass:2600,
	attack:0.0005,
	decay:0.035,
	sustain:0.1,
	length:0.32,
	outputGain:0.04,
	pitchVariation:45,
	modeVariation:18,
	levelVariation:0.12,
	lengthVariation:0.12,
	reverb:0.18,
	velocity:1,
})

const preset = (name, options) => Object.freeze({ ...DEFAULT_TRIANGLE_OPTIONS, name, ...options })

export const PRESET_MUTED_TRIANGLE = preset("Muted Triangle", {
	frequency:3850, highpass:3200, decay:0.009, sustain:0.018, length:0.05, outputGain:0.038, reverb:0.07,
})
export const PRESET_OPEN_TRIANGLE = DEFAULT_TRIANGLE_OPTIONS
export const PRESET_727_MUTED_TRIANGLE = preset("727-style Muted Triangle", {
	frequency:3600, partialRatios:[1,1.34,1.82,2.41,3.12], partialLevels:[0.78,0.5,0.29,0.16,0.08],
	highpass:2950, decay:0.009, sustain:0.016, length:0.048, outputGain:0.037, reverb:0.065,
})
export const PRESET_727_OPEN_TRIANGLE = preset("727-style Open Triangle", {
	frequency:3150, partialRatios:[1,1.34,1.82,2.41,3.12], partialLevels:[0.78,0.5,0.29,0.16,0.08],
	highpass:2450, decay:0.032, sustain:0.085, length:0.28, outputGain:0.038, reverb:0.16,
})
export const PRESET_DARK_TRIANGLE = preset("Dark Large Triangle", {
	frequency:2800, highpass:2150, decay:0.045, sustain:0.12, length:0.4, outputGain:0.043, reverb:0.2,
})
export const PRESET_BRIGHT_TRIANGLE = preset("Bright Small Triangle", {
	frequency:4300, highpass:3500, decay:0.026, sustain:0.07, length:0.22, outputGain:0.035, reverb:0.13,
})

export const PRESET_TRIANGLES = Object.freeze([
	PRESET_MUTED_TRIANGLE, PRESET_727_MUTED_TRIANGLE, PRESET_DARK_TRIANGLE,
	PRESET_OPEN_TRIANGLE, PRESET_727_OPEN_TRIANGLE, PRESET_BRIGHT_TRIANGLE,
])
export const PRESET_MUTED_TRIANGLES = Object.freeze([PRESET_MUTED_TRIANGLE, PRESET_727_MUTED_TRIANGLE])
export const PRESET_OPEN_TRIANGLES = Object.freeze([
	PRESET_DARK_TRIANGLE, PRESET_OPEN_TRIANGLE, PRESET_727_OPEN_TRIANGLE, PRESET_BRIGHT_TRIANGLE,
])
