import { GENERAL_MIDI_INSTRUMENT_DATA, getGeneralMIDIInstrumentData } from './general-midi-instruments.data.js'

export const resolveVoiceProgram = value => {
	const program = getGeneralMIDIInstrumentData(value)?.program
	if (program === undefined) throw new RangeError(`Unknown instrument: ${value}`)
	return program
}

// These banks stay close to GM families. Number prefixes in XIZ filenames are
// bank-local slot numbers, never General MIDI programs.
const yoshimiBanks = ['SynthPiano', 'Will_Godfrey_Collection', 'Organ', 'Plucked', 'Bass', 'Strings', 'Strings', 'Brass', 'Reed_and_Wind', 'Reed_and_Wind', 'Synth', 'Pads', 'Fantasy', 'Plucked', 'Misc', 'Noises']
const specificBanks = program => program >= 4 && program <= 5 ? 'Rhodes' : program >= 29 && program <= 31 ? 'Guitar' : program >= 52 && program <= 54 ? 'Choir_and_Voice' : yoshimiBanks[Math.floor(program / 8)]
const words = name => name.toLowerCase().replace(/\b(acoustic|electric|synth|synthesizer|ensemble|section|lead|pad|fx)\b/g, '').match(/[a-z]+/g) ?? []

export const getYoshimiPatches = (banks, program) => {
	const instrument = GENERAL_MIDI_INSTRUMENT_DATA[program]
	const bank = banks.find(bank => bank.name === specificBanks(program))
	const terms = words(instrument.name)
	return (bank?.instruments ?? []).map(filename => {
		const title = filename.replace(/^\d+-/, '').replace(/\.xiz$/i, '').replace(/_/g, ' ')
		return { id:`${bank.name}/${filename}`, title, bank:bank.name, filename, approximate:true,
			score:terms.reduce((score, term) => score + (title.toLowerCase().includes(term) ? 1 : 0), 0) }
	}).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
}

export const getDefaultVoicePatch = program => ({id:'gm', title:`${GENERAL_MIDI_INSTRUMENT_DATA[program].title} — GM default`})

// All variants retain the underlying GM family; no unrelated random patches.
export const getSynthVariants = program => [getDefaultVoicePatch(program), {id:'soft',title:'Soft'}, {id:'bright',title:'Bright'}]

