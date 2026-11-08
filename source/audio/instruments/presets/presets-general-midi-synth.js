import {
	INSTRUMENT_TYPE_DUAL_OSCILLATOR,
	INSTRUMENT_TYPE_OSCILLATOR,
	INSTRUMENT_TYPE_SYTHESIZER,
	INSTRUMENT_TYPE_TRIPLE_OSCILLATOR
} from '../../instrument-list.js'
import { GENERAL_MIDI_INSTRUMENTS } from '../../midi/general-midi.constants.js'

export const GENERAL_MIDI_HUMAN_VOICE_PROGRAMS = [52, 53, 54, 85, 91]

const HUMAN_VOICE_PROGRAMS = new Set(GENERAL_MIDI_HUMAN_VOICE_PROGRAMS)

export const GENERAL_MIDI_SYNTH_PROGRAMS = [
	38, 39,
	50, 51,
	62, 63,
	...Array.from({length:24}, (_, index) => 80 + index),
	118
].filter(program => !HUMAN_VOICE_PROGRAMS.has(program))

const SHAPES = ['sine', 'square', 'triangle', 'sawtooth']

const createPreset = program => {
	const variation = program % 8
	const isBass = program === 38 || program === 39
	const isStrings = program === 50 || program === 51
	const isVoice = program === 54
	const isBrass = program === 62 || program === 63
	const isLead = program >= 80 && program <= 87
	const isPad = program >= 88 && program <= 95
	const isEffect = program >= 96 && program <= 103
	const isDrum = program === 118
	const type = isLead && variation === 0 ? INSTRUMENT_TYPE_OSCILLATOR :
		(isLead && (variation === 2 || variation === 5) ? INSTRUMENT_TYPE_SYTHESIZER :
		(isPad || isEffect || isStrings ? INSTRUMENT_TYPE_TRIPLE_OSCILLATOR : INSTRUMENT_TYPE_DUAL_OSCILLATOR))
	const shape = isBass ? 'sawtooth' :
		(isStrings || isPad ? 'triangle' :
		(isBrass || isLead ? SHAPES[(variation + 1) % SHAPES.length] : SHAPES[variation % SHAPES.length]))
	const filterCutOff = isBass ? 520 + variation * 90 :
		(isPad ? 900 + variation * 180 :
		(isEffect ? 700 + variation * 330 :
		(isBrass ? 1600 + variation * 250 : 1300 + variation * 260)))

	return {
		program,
		name:GENERAL_MIDI_INSTRUMENTS[program],
		type,
		options:{
			shape,
			detune:isPad || isStrings ? 5 + variation * 2 : (isEffect ? 3 + variation * 4 : variation),
			amplitude:isBass ? 0.42 : (isPad ? 0.22 : 0.3),
			slideDuration:isLead ? 0.025 + variation * 0.012 : (isPad ? 0.16 + variation * 0.035 : 0.05),
			fadeDuration:isPad || isStrings ? 8 + variation : (isEffect ? 4 + variation : 1.5),
			filterCutOff,
			filterOverdrive:isBass || isBrass ? 2.2 : 1.35 + variation * 0.12,
			filterResonance:isEffect ? 1.1 + variation * 0.18 : 0.45 + variation * 0.09,
			filterAttack:isPad ? 0.25 + variation * 0.08 : (isEffect ? 0.04 + variation * 0.05 : 0.01),
			filterDecay:isPad ? 0.7 + variation * 0.12 : 0.16 + variation * 0.04,
			filterSustain:isPad || isStrings || isVoice ? 0.72 : (isDrum ? 0.05 : 0.48),
			filterRelease:isPad || isStrings ? 1.4 + variation * 0.25 : (isEffect ? 0.8 + variation * 0.2 : 0.22)
		}
	}
}

export const GENERAL_MIDI_SYNTH_PRESETS = new Map(
	GENERAL_MIDI_SYNTH_PROGRAMS.map(program => [program, createPreset(program)])
)

export const getGeneralMIDISynthPreset = program => GENERAL_MIDI_SYNTH_PRESETS.get(program) ?? null
