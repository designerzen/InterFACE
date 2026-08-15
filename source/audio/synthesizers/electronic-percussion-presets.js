export const DEFAULT_ELECTRONIC_PERCUSSION_OPTIONS = Object.freeze({
	name:'Syndrum',
	velocity:1,
	length:0.38,
	attack:0.001,
	startFrequency:520,
	endFrequency:105,
	waveform:'sine',
	overtoneRatio:1.97,
	overtoneLevel:0.18,
	noiseLevel:0.08,
	noiseFrequency:2400,
	outputGain:0.36,
	triggerAt:0,
})

const preset = (name, options) => Object.freeze({ ...DEFAULT_ELECTRONIC_PERCUSSION_OPTIONS, name, ...options })

export const PRESET_SYNDRUM = preset('Syndrum', {
	startFrequency:620, endFrequency:115, length:0.44, outputGain:0.38,
})
export const PRESET_LASER_TOM = preset('Laser Tom', {
	startFrequency:1450, endFrequency:95, length:0.3, waveform:'sawtooth', overtoneLevel:0.08,
	noiseLevel:0.03, outputGain:0.26,
})
export const PRESET_METALLIC_HIT = preset('Metallic Hit', {
	startFrequency:820, endFrequency:610, length:0.5, waveform:'square', overtoneRatio:1.414,
	overtoneLevel:0.52, noiseLevel:0.18, noiseFrequency:4700, outputGain:0.22,
})
export const PRESET_SIMMONS_TOM = preset('Simmons-style Tom', {
	startFrequency:410, endFrequency:82, length:0.52, noiseLevel:0.16, outputGain:0.4,
})

// Fast pitch dives and climbs for arcade, electro and sci-fi fills.
export const PRESET_SHORT_ZAP = preset('Short Zap', {
	startFrequency:2600, endFrequency:180, length:0.12, waveform:'sawtooth', overtoneLevel:0.05,
	noiseLevel:0.025, noiseFrequency:6200, outputGain:0.24,
})
export const PRESET_LONG_LASER_ZAP = preset('Long Laser Zap', {
	startFrequency:4200, endFrequency:72, length:0.58, waveform:'sawtooth', overtoneRatio:2.01,
	overtoneLevel:0.1, noiseLevel:0.04, noiseFrequency:7600, outputGain:0.2,
})
export const PRESET_ALIEN_ZAP = preset('Alien Zap', {
	startFrequency:1850, endFrequency:260, length:0.34, waveform:'square', overtoneRatio:1.53,
	overtoneLevel:0.23, noiseLevel:0.07, noiseFrequency:5400, outputGain:0.2,
})
export const PRESET_ION_BLASTER = preset('Ion Blaster', {
	startFrequency:3600, endFrequency:125, length:0.22, waveform:'triangle', overtoneRatio:2.7,
	overtoneLevel:0.18, noiseLevel:0.14, noiseFrequency:8300, outputGain:0.25,
})
export const PRESET_PLASMA_DROP = preset('Plasma Drop', {
	startFrequency:980, endFrequency:42, length:0.72, waveform:'sawtooth', overtoneRatio:1.5,
	overtoneLevel:0.12, noiseLevel:0.1, noiseFrequency:1900, outputGain:0.3,
})

// A long attack turns the normal decay envelope into a backwards-style swell.
export const PRESET_REVERSE_TOM = preset('Reverse Tom', {
	attack:0.31, startFrequency:78, endFrequency:460, length:0.38, waveform:'sine',
	overtoneLevel:0.16, noiseLevel:0.02, outputGain:0.36,
})
export const PRESET_REVERSE_TOM_LOW = preset('Reverse Tom Low', {
	attack:0.48, startFrequency:45, endFrequency:230, length:0.58, waveform:'triangle',
	overtoneRatio:1.51, overtoneLevel:0.12, noiseLevel:0.035, noiseFrequency:1200, outputGain:0.38,
})
export const PRESET_REVERSE_TOM_HIGH = preset('Reverse Tom High', {
	attack:0.21, startFrequency:190, endFrequency:980, length:0.27, waveform:'sine',
	overtoneRatio:2.03, overtoneLevel:0.2, noiseLevel:0.025, outputGain:0.29,
})
export const PRESET_REVERSE_METAL_TOM = preset('Reverse Metal Tom', {
	attack:0.4, startFrequency:105, endFrequency:720, length:0.49, waveform:'square',
	overtoneRatio:1.414, overtoneLevel:0.35, noiseLevel:0.08, noiseFrequency:5100, outputGain:0.2,
})

// Spacey one-shots ranging from clean radar pings to noisy impacts.
export const PRESET_RADAR_PING = preset('Radar Ping', {
	startFrequency:1320, endFrequency:1170, length:0.64, waveform:'sine', overtoneRatio:2.4,
	overtoneLevel:0.14, noiseLevel:0, outputGain:0.2,
})
export const PRESET_SATELLITE_BLEEP = preset('Satellite Bleep', {
	startFrequency:760, endFrequency:1140, length:0.18, waveform:'square', overtoneRatio:2,
	overtoneLevel:0.09, noiseLevel:0.015, noiseFrequency:6800, outputGain:0.2,
})
export const PRESET_UFO_TAKEOFF = preset('UFO Takeoff', {
	attack:0.08, startFrequency:85, endFrequency:2100, length:0.78, waveform:'sawtooth',
	overtoneRatio:1.49, overtoneLevel:0.18, noiseLevel:0.07, noiseFrequency:3200, outputGain:0.21,
})
export const PRESET_COMET_WHOOSH = preset('Comet Whoosh', {
	attack:0.12, startFrequency:2400, endFrequency:95, length:0.9, waveform:'triangle',
	overtoneRatio:2.8, overtoneLevel:0.06, noiseLevel:0.38, noiseFrequency:5800, outputGain:0.2,
})
export const PRESET_ASTEROID_IMPACT = preset('Asteroid Impact', {
	startFrequency:290, endFrequency:35, length:0.82, waveform:'square', overtoneRatio:1.37,
	overtoneLevel:0.22, noiseLevel:0.48, noiseFrequency:980, outputGain:0.32,
})
export const PRESET_ROBOT_BONK = preset('Robot Bonk', {
	startFrequency:680, endFrequency:410, length:0.24, waveform:'square', overtoneRatio:1.414,
	overtoneLevel:0.44, noiseLevel:0.12, noiseFrequency:3900, outputGain:0.24,
})
export const PRESET_TELEPORT = preset('Teleport', {
	attack:0.16, startFrequency:130, endFrequency:3300, length:0.46, waveform:'triangle',
	overtoneRatio:2.01, overtoneLevel:0.15, noiseLevel:0.16, noiseFrequency:7200, outputGain:0.22,
})

export const PRESET_ELECTRONIC_PERCUSSION = Object.freeze([
	PRESET_SYNDRUM,
	PRESET_SIMMONS_TOM,
	PRESET_LASER_TOM,
	PRESET_SHORT_ZAP,
	PRESET_LONG_LASER_ZAP,
	PRESET_ALIEN_ZAP,
	PRESET_ION_BLASTER,
	PRESET_PLASMA_DROP,
	PRESET_REVERSE_TOM,
	PRESET_REVERSE_TOM_LOW,
	PRESET_REVERSE_TOM_HIGH,
	PRESET_REVERSE_METAL_TOM,
	PRESET_METALLIC_HIT,
	PRESET_RADAR_PING,
	PRESET_SATELLITE_BLEEP,
	PRESET_UFO_TAKEOFF,
	PRESET_COMET_WHOOSH,
	PRESET_ASTEROID_IMPACT,
	PRESET_ROBOT_BONK,
	PRESET_TELEPORT,
])
