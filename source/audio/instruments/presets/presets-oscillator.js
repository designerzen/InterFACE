export const OSCILLATOR_TYPES = ["sine","square","triangle","sawtooth","custom"]

export const OSCILLATOR_PRESET_PAD = {
	name:"pad",
	// ampEnv: { attack: 1.2, decay: 1.5, sustain: 0.8, release: 3.0 },
	shape:OSCILLATOR_TYPES[1],
	slideDuration:0.1,
	fadeDuration:10,
	filterGain :0.7,
	filterCutOff:1000,
	filterOverdrive:2.5,
	filterResonance:1.2,
	filterAttack:0.7, 
	filterRelease:2,
	filterSustain:0.6,
	filterDecay:0.8,
	detune: 8
}

export const OSCILLATOR_PRESET_LEAD = {
	name:"lead",
	//   ampEnv: { attack: 0.05, decay: 0.2, sustain: 0.9, release: 0.3 },
	shape:OSCILLATOR_TYPES[0],
	slideDuration:0.1,
	fadeDuration:2,
	filterGain :0.7,
	filterCutOff:2500,
	filterOverdrive:2.5,
	filterResonance:0.9,
	filterAttack:0.1, 
	filterRelease:0.4,
	filterSustain:0.7,
	filterDecay:0.15,
	detune: 12
}

export const OSCILLATOR_PRESET_BASS = {
	name:"bass",
	//   ampEnv: { attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.2 },
	shape:OSCILLATOR_TYPES[0],
	slideDuration:0.1,
	fadeDuration:2,
	filterGain :0.7,
	filterCutOff:600,
	filterOverdrive:2.5,
	filterResonance: 1.5, 
	filterAttack:0.02, 
	filterRelease:0.2, 
	filterSustain:0.5,
	filterDecay:0.1,
	detune: 3
}


export const OSCILLATOR_PRESET_BRASS = {
	name:"brass",	
//   ampEnv: { attack: 0.1, decay: 0.25, sustain: 0.85, release: 0.5 },
	shape:OSCILLATOR_TYPES[2],	
	slideDuration:0.1,
	fadeDuration:18,
	filterGain :0.7,
	filterCutOff:1800,
	filterOverdrive:2.5,
	filterResonance: 1.0, 
	filterAttack:0.007, 
	filterRelease:0.6,
	filterSustain:0.75,
	filterDecay:0.2,
	detune: 6
}

export const OSCILLATOR_PRESET_PLUCK = {
	name:"pluck",
	//   ampEnv: { attack: 0.005, decay: 0.12, release: 0.15 },
	shape:OSCILLATOR_TYPES[1],
	slideDuration:0.1,
	fadeDuration:2,
	filterGain :0.7,  
	filterCutOff:2200, 
	filterOverdrive:2.5,
	filterResonance:1.8 , 
	filterAttack:0.002, 
	filterRelease:0.1, 
	filterSustain:0,
	filterDecay:0.08,
	detune: 0
}

export const PRESETS = [
	OSCILLATOR_PRESET_PAD,
	OSCILLATOR_PRESET_LEAD,
	OSCILLATOR_PRESET_BASS,
	OSCILLATOR_PRESET_BRASS,
	OSCILLATOR_PRESET_PLUCK
]

export const PRESETS_NAMES = Object.keys(PRESETS)
