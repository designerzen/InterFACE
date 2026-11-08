import { GENERAL_MIDI_INSTRUMENT_DATA } from '../audio/general-midi-instruments.data.js'
import {
	FAMILY_BASS, FAMILY_ORGAN, FAMILY_SYNTH_LEAD, FAMILY_SYNTH_PAD,
	FAMILY_CHROMATIC_PERCUSSION, FAMILY_ETHNIC, FAMILY_PERCUSSIVE,
	FAMILY_PIANO, FAMILY_GUITAR, FAMILY_STRINGS, FAMILY_BRASS,
	FAMILY_REED, FAMILY_PIPE, FAMILY_SOUND_FX, FAMILY_ENSEMBLE, FAMILY_SYNTH_EFFECTS
} from '../audio/midi/general-midi-instrument.constants.js'

// Match the role families used by the existing per-person random presets.
const lead = [FAMILY_PIANO, FAMILY_ORGAN, FAMILY_GUITAR, FAMILY_STRINGS, FAMILY_BRASS,
	FAMILY_REED, FAMILY_PIPE, FAMILY_SYNTH_LEAD, FAMILY_SYNTH_PAD, FAMILY_SOUND_FX]
const families = [
	[FAMILY_CHROMATIC_PERCUSSION, FAMILY_ETHNIC, FAMILY_PERCUSSIVE],
	[...lead, FAMILY_ENSEMBLE, FAMILY_SYNTH_EFFECTS],
	[FAMILY_BASS, FAMILY_ORGAN, FAMILY_SYNTH_LEAD, FAMILY_SYNTH_PAD],
	lead
]

export const getPersonInstrumentChoices = personIndex => GENERAL_MIDI_INSTRUMENT_DATA
	.filter(instrument => (families[personIndex] ?? families[0]).includes(instrument.family))
	.map(instrument => instrument.program)

export const choosePersonInstrument = (choices, current, action, random = Math.random) => {
	if (!choices.length) return null
	if (action === 'random') {
		const alternatives = choices.filter(program => program !== current)
		const pool = alternatives.length ? alternatives : choices
		return pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))]
	}
	const index = choices.indexOf(current)
	if (index < 0) {
		return action === 'previous' ? [...choices].reverse().find(program => program < current) ?? choices.at(-1)
			: choices.find(program => program > current) ?? choices[0]
	}
	return choices[(index + (action === 'previous' ? choices.length - 1 : 1)) % choices.length]
}
