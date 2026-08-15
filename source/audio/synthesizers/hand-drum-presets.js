export const DEFAULT_HAND_DRUM_OPTIONS = Object.freeze({
	name:"Open Conga",
	frequency:210,
	pitchBend:1.28,
	pitchBendTime:0.022,
	overtoneRatio:1.47,
	overtoneLevel:0.22,
	noiseLevel:0.16,
	noiseFrequency:2300,
	noiseQ:0.8,
	attack:0.001,
	decay:0.055,
	sustain:0.42,
	length:0.32,
	outputGain:0.7,
	velocity:1,
})

const preset = (name, options) => Object.freeze({ ...DEFAULT_HAND_DRUM_OPTIONS, name, ...options })

export const PRESET_808_LOW_CONGA = preset("808 Low Conga", {
	frequency:165, pitchBend:1.36, overtoneRatio:1.42, overtoneLevel:0.12,
	noiseLevel:0.08, noiseFrequency:1650, decay:0.07, sustain:0.5, length:0.38,
})
export const PRESET_808_HIGH_CONGA = preset("808 High Conga", {
	frequency:238, pitchBend:1.3, overtoneRatio:1.45, overtoneLevel:0.16,
	noiseLevel:0.1, noiseFrequency:2400, decay:0.05, sustain:0.38, length:0.25,
})
export const PRESET_808_MUTE_CONGA = preset("808 Mute Conga", {
	frequency:255, pitchBend:1.22, overtoneRatio:1.52, overtoneLevel:0.24,
	noiseLevel:0.22, noiseFrequency:3150, decay:0.025, sustain:0.12, length:0.105,
})
export const PRESET_727_LOW_CONGA = preset("727-style Low Conga", {
	frequency:176, pitchBend:1.18, overtoneRatio:1.58, overtoneLevel:0.28,
	noiseLevel:0.2, noiseFrequency:1900, noiseQ:1.5, decay:0.045, sustain:0.44, length:0.31,
})
export const PRESET_727_HIGH_CONGA = preset("727-style Open High Conga", {
	frequency:252, pitchBend:1.16, overtoneRatio:1.61, overtoneLevel:0.3,
	noiseLevel:0.23, noiseFrequency:2600, noiseQ:1.7, decay:0.04, sustain:0.35, length:0.24,
})
export const PRESET_727_MUTE_CONGA = preset("727-style Mute High Conga", {
	frequency:275, pitchBend:1.12, overtoneRatio:1.67, overtoneLevel:0.34,
	noiseLevel:0.34, noiseFrequency:3450, noiseQ:1.9, decay:0.018, sustain:0.08, length:0.08,
})
export const PRESET_727_LOW_BONGO = preset("727-style Low Bongo", {
	frequency:330, pitchBend:1.22, overtoneRatio:1.72, overtoneLevel:0.32,
	noiseLevel:0.25, noiseFrequency:3200, noiseQ:1.5, decay:0.03, sustain:0.3, length:0.18,
})
export const PRESET_727_HIGH_BONGO = preset("727-style High Bongo", {
	frequency:455, pitchBend:1.2, overtoneRatio:1.78, overtoneLevel:0.36,
	noiseLevel:0.3, noiseFrequency:4200, noiseQ:1.8, decay:0.025, sustain:0.24, length:0.135,
})
export const PRESET_WARM_LOW_BONGO = preset("Warm Low Bongo", {
	frequency:305, pitchBend:1.32, overtoneRatio:1.64, overtoneLevel:0.22,
	noiseLevel:0.13, noiseFrequency:2700, decay:0.04, sustain:0.34, length:0.21,
})
export const PRESET_BRIGHT_HIGH_BONGO = preset("Bright High Bongo", {
	frequency:485, pitchBend:1.28, overtoneRatio:1.76, overtoneLevel:0.3,
	noiseLevel:0.27, noiseFrequency:4700, decay:0.022, sustain:0.22, length:0.125,
})

export const PRESET_CONGAS = Object.freeze([
	PRESET_808_LOW_CONGA, PRESET_808_HIGH_CONGA, PRESET_808_MUTE_CONGA,
	PRESET_727_LOW_CONGA, PRESET_727_HIGH_CONGA, PRESET_727_MUTE_CONGA,
])

export const PRESET_BONGOS = Object.freeze([
	PRESET_WARM_LOW_BONGO, PRESET_727_LOW_BONGO,
	PRESET_BRIGHT_HIGH_BONGO, PRESET_727_HIGH_BONGO,
])
export const PRESET_LOW_CONGAS = Object.freeze([PRESET_808_LOW_CONGA, PRESET_727_LOW_CONGA])
export const PRESET_HIGH_CONGAS = Object.freeze([PRESET_808_HIGH_CONGA, PRESET_727_HIGH_CONGA])
export const PRESET_MUTE_CONGAS = Object.freeze([PRESET_808_MUTE_CONGA, PRESET_727_MUTE_CONGA])
export const PRESET_LOW_BONGOS = Object.freeze([PRESET_WARM_LOW_BONGO, PRESET_727_LOW_BONGO])
export const PRESET_HIGH_BONGOS = Object.freeze([PRESET_BRIGHT_HIGH_BONGO, PRESET_727_HIGH_BONGO])
