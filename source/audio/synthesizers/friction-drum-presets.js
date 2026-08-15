export const DEFAULT_FRICTION_DRUM_OPTIONS = Object.freeze({
	name:"Open Cuica", velocity:1, length:0.34, attack:0.004, decay:0.08,
	startFrequency:260, endFrequency:520, overtoneRatio:1.92, overtoneLevel:0.2,
	noiseFrequency:1900, noiseLevel:0.08, outputGain:0.35, triggerAt:0,
})
const preset = (name, options) => Object.freeze({ ...DEFAULT_FRICTION_DRUM_OPTIONS, name, ...options })
export const PRESET_OPEN_CUICA = preset("Open Cuica", {})
export const PRESET_MUTED_CUICA = preset("Muted Cuica", { length:0.13, startFrequency:310, endFrequency:440, overtoneLevel:0.13, noiseLevel:0.12, outputGain:0.3 })
export const PRESET_LOW_CUICA = preset("Low Cuica", { startFrequency:170, endFrequency:350, length:0.42, outputGain:0.38 })
export const PRESET_FRICTION_DRUMS = Object.freeze([PRESET_MUTED_CUICA, PRESET_OPEN_CUICA, PRESET_LOW_CUICA])
