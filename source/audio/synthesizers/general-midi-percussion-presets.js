import { DEFAULT_KICK_OPTIONS } from './kick-presets.js'
import { PRESET_909_SNARE } from './snare-presets.js'
import { DEFAULT_CLOSED_HIHAT, OPEN_HIHAT_CRASH, OPEN_HIHAT_RIDE } from './hihat-presets.js'
import { PRESET_FLOOR_TOM, PRESET_MID_TOM, PRESET_HIGH_TOM } from './tom-presets.js'
import { DEFAULT_COWBELL_OPTIONS } from './cowbell-presets.js'
import { DEFAULT_SCRAPE_OPTIONS } from './scrape-presets.js'
import { DEFAULT_JINGLE_OPTIONS } from './jingle-presets.js'

// Distinct synthesis colours for the remaining useful General MIDI drum keys.
// These stay built from the existing lightweight voices, so adding the full
// drum vocabulary does not add samples or another audio dependency.
export const PRESET_ACOUSTIC_BASS_DRUM = Object.freeze({
	...DEFAULT_KICK_OPTIONS,
	name:'Acoustic Bass Drum',
	length:0.46,
	sineStart:118,
	sineEnd:42,
	triStart:92,
	triEnd:36,
})

export const PRESET_ELECTRIC_SNARE = Object.freeze({
	...PRESET_909_SNARE,
	name:'Electric Snare',
	length:0.24,
	bandpassStart:2450,
	bandpassEnd:6200,
	crackLevel:0.9,
})

const tuneTom = (preset, semitones, overrides={}) => {
	const ratio = 2 ** (semitones / 12)
	const tuned = { ...preset, ...overrides }
	for (const key of ['triStart', 'triEnd', 'sineStart', 'sineApex', 'sineSustain', 'sineEnd'])
	{
		if (Number.isFinite(tuned[key])) tuned[key] *= ratio
	}
	return Object.freeze(tuned)
}

export const PRESET_LOW_FLOOR_TOM = tuneTom(PRESET_FLOOR_TOM, -3, { name:'Low Floor Tom' })
export const PRESET_HIGH_FLOOR_TOM = tuneTom(PRESET_FLOOR_TOM, 2, { name:'High Floor Tom', length:0.68 })
export const PRESET_HIGH_MID_TOM = tuneTom(PRESET_MID_TOM, 4, { name:'High-Mid Tom', length:0.38 })
export const PRESET_HIGH_TOM_GM = Object.freeze({ ...PRESET_HIGH_TOM, name:'GM High Tom' })

export const PRESET_PEDAL_HIHAT = Object.freeze({
	...DEFAULT_CLOSED_HIHAT,
	name:'Pedal Hi-hat',
	length:0.085,
	decay:0.018,
	sustain:0.62,
	release:0.025,
	highpass:6100,
	bandpass:9200,
})

export const PRESET_RIDE_BELL = Object.freeze({
	...DEFAULT_COWBELL_OPTIONS,
	name:'Ride Bell',
	length:0.78,
	bandpass:3900,
	ratios:[860, 1295],
	q:5.4,
	partialLevels:[0.88, 0.42],
	outputGain:0.34,
	attack:0.001,
	decay:0.035,
	sustain:0.76,
})

export const PRESET_CRASH_CYMBAL_2 = Object.freeze({
	...OPEN_HIHAT_CRASH,
	name:'Crash Cymbal 2',
	fundamental:47,
	length:1.75,
	bandpass:9800,
	highpass:6100,
	release:0.9,
})

export const PRESET_RIDE_CYMBAL_2 = Object.freeze({
	...OPEN_HIHAT_RIDE,
	name:'Ride Cymbal 2',
	fundamental:42,
	length:1.3,
	bandpass:8200,
	highpass:5200,
	release:0.62,
})

export const PRESET_VIBRASLAP = Object.freeze({
	...DEFAULT_SCRAPE_OPTIONS,
	name:'Vibraslap',
	length:0.46,
	strokes:12,
	spacing:0.032,
	bandpass:2650,
	bandpassQ:5.2,
	bodyFrequency:690,
	bodyLevel:0.34,
	outputGain:0.3,
})

export const PRESET_JINGLE_BELL = Object.freeze({
	...DEFAULT_JINGLE_OPTIONS,
	name:'Jingle Bell',
	length:0.48,
	frequencies:[2480, 3310, 4210, 5630, 7140],
	levels:[1, 0.76, 0.56, 0.36, 0.2],
	noiseLevel:0.08,
	bandpass:4900,
	outputGain:0.22,
})
