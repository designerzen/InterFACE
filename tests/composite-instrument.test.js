import CompositeInstrument, { resolveGeneralMIDIPreset } from '../source/audio/instruments/instrument.composite.js'
import { readFileSync } from 'fs'
import {
	INSTRUMENT_TYPE_OSCILLATOR,
	INSTRUMENT_TYPE_SOUNDFONT
} from '../source/audio/instrument-list.js'
import {
	GENERAL_MIDI_INSTRUMENTS,
	SOUNDFONT_DEFAULT_INSTRUMENT_FOLDERS
} from '../source/audio/midi/general-midi.constants.js'
import {
	GENERAL_MIDI_HUMAN_VOICE_PROGRAMS,
	GENERAL_MIDI_SYNTH_PRESETS,
	GENERAL_MIDI_SYNTH_PROGRAMS
} from '../source/audio/instruments/presets/presets-general-midi-synth.js'

const createGain = () => ({
	connect:jest.fn(),
	disconnect:jest.fn(),
	gain:{ value:1 }
})

const createBackend = type => ({
	constructor:{ name:type },
	output:createGain(),
	loadPreset:jest.fn(async () => true),
	getPresets:jest.fn(async () => []),
	allNotesOff:jest.fn(async () => true),
	destroy:jest.fn(async () => true),
	noteOn:jest.fn(async () => true),
	noteOff:jest.fn(async () => true)
})

describe('CompositeInstrument General MIDI routing', () => {
	test('receives backend instances and does not contain the instrument factory', () => {
		const compositeSource = readFileSync('source/audio/instruments/instrument.composite.js', 'utf8')
		const factorySource = readFileSync('source/audio/instrument-factory.js', 'utf8')
		expect(compositeSource).not.toContain('instrument-factory')
		expect(compositeSource).not.toContain('new InstrumentClass')
		expect(factorySource).toContain('createCompositeInstrument(options={})')
	})

	test('exposes all 128 General MIDI programs and resolves names and folders', async () => {
		const composite = new CompositeInstrument({ createGain })
		await Promise.resolve()
		expect(await composite.getPresets()).toEqual(GENERAL_MIDI_INSTRUMENTS)
		expect(resolveGeneralMIDIPreset('lead_1_square').program).toBe(80)
		expect(resolveGeneralMIDIPreset('80').program).toBe(80)
		expect(resolveGeneralMIDIPreset(GENERAL_MIDI_INSTRUMENTS[95]).program).toBe(95)
	})

	test('registers every synth-sounding GM program with an oscillator synth preset', () => {
		expect(GENERAL_MIDI_SYNTH_PRESETS.size).toBe(GENERAL_MIDI_SYNTH_PROGRAMS.length)
		expect([...GENERAL_MIDI_SYNTH_PRESETS.keys()]).toEqual(GENERAL_MIDI_SYNTH_PROGRAMS)
		GENERAL_MIDI_SYNTH_PRESETS.forEach((preset, program) => {
			expect(preset.program).toBe(program)
			expect(preset.name).toBe(GENERAL_MIDI_INSTRUMENTS[program])
			expect(preset.options.shape).toBeTruthy()
		})
	})

	test('reserves every human voice program for SoundFont playback', () => {
		expect(GENERAL_MIDI_HUMAN_VOICE_PROGRAMS).toEqual([52, 53, 54, 85, 91])
		GENERAL_MIDI_HUMAN_VOICE_PROGRAMS.forEach(program => {
			expect(GENERAL_MIDI_SYNTH_PRESETS.has(program)).toBe(false)
		})
	})

	test('uses an oscillator for registered synth programs and SoundFont otherwise', async () => {
		const composite = new CompositeInstrument({ createGain }, { instrumentPack:'OpenGM24' })
		await Promise.resolve()
		const oscillator = createBackend(INSTRUMENT_TYPE_OSCILLATOR)
		const soundFont = createBackend(INSTRUMENT_TYPE_SOUNDFONT)
		composite.addInstrument(INSTRUMENT_TYPE_OSCILLATOR, oscillator)
		composite.addInstrument(INSTRUMENT_TYPE_SOUNDFONT, soundFont)

		await composite.loadPreset(80)
		expect(composite.backendType).toBe(INSTRUMENT_TYPE_OSCILLATOR)
		expect(composite.activePresetIndex).toBe(80)

		await composite.loadPreset(54)
		expect(composite.backendType).toBe(INSTRUMENT_TYPE_SOUNDFONT)
		expect(soundFont.loadPreset).toHaveBeenCalledWith(
			SOUNDFONT_DEFAULT_INSTRUMENT_FOLDERS[54],
			'OpenGM24',
			{},
			undefined
		)
		expect(oscillator.allNotesOff).toHaveBeenCalledTimes(1)
		expect(oscillator.output.disconnect).toHaveBeenCalledTimes(1)
		expect(oscillator.destroy).not.toHaveBeenCalled()
	})
})
