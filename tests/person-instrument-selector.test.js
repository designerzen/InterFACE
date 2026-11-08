import {
	INSTRUMENT_TYPE_COMPOSITE,
	INSTRUMENT_TYPE_OSCILLATOR,
	INSTRUMENT_TYPE_SOUNDFONT,
	INSTRUMENT_TYPE_SYTHESIZER,
	INSTRUMENT_TYPE_FM,
	PERSON_INSTRUMENT_OPTIONS,
	normalisePersonInstrumentType
} from '../source/audio/instrument-list.js'
import { GENERAL_MIDI_INSTRUMENTS } from '../source/audio/midi/general-midi.constants.js'
import { SYNTHESIZER_PRESETS } from '../source/audio/instruments/instrument.synthesizer.js'
import OscillatorInstrument from '../source/audio/instruments/instrument.oscillator.js'
import { DEFAULT_PERSON_OPTIONS } from '../source/settings/options.people.js'
import { exportPersonQueryOptions } from '../source/people/person.query.js'
import { readFileSync } from 'fs'

describe('Person instrument selector', () => {
	test('offers Composite and the individual engines with Composite as the fallback', () => {
		expect(PERSON_INSTRUMENT_OPTIONS).toEqual([
			[INSTRUMENT_TYPE_COMPOSITE, 'Composite'],
			[INSTRUMENT_TYPE_SOUNDFONT, 'SoundFont'],
			[INSTRUMENT_TYPE_OSCILLATOR, 'Oscillator'],
			[INSTRUMENT_TYPE_SYTHESIZER, 'Synthesizer'],
			[INSTRUMENT_TYPE_FM, 'FM Synth (DX7)']
		])
		expect(normalisePersonInstrumentType(undefined)).toBe(INSTRUMENT_TYPE_COMPOSITE)
		expect(normalisePersonInstrumentType('UnknownInstrument')).toBe(INSTRUMENT_TYPE_COMPOSITE)
		expect(DEFAULT_PERSON_OPTIONS.defaultInstrument).toBe(INSTRUMENT_TYPE_COMPOSITE)
	})

	test('shows the instrument selector as a Person action', () => {
		const panelSource = readFileSync('source/dom/ui.panel-instruments.js', 'utf8')
		expect(panelSource).toContain('createSelectControl("Instrument", "instrumentType"')
		expect(panelSource).toContain('PERSON_INSTRUMENT_OPTIONS, "data-person-action"')
	})

	test('only advertises Synthesizer presets that it implements', () => {
		expect(SYNTHESIZER_PRESETS).toEqual([
			GENERAL_MIDI_INSTRUMENTS[0],
			...GENERAL_MIDI_INSTRUMENTS.slice(80, 89)
		])
	})

	test('exports the selected built-in oscillator preset index', () => {
		const oscillator = Object.create(OscillatorInstrument.prototype)
		oscillator.options = { shape:'square' }
		expect(oscillator.activePreset).toBe('square')
		expect(oscillator.activePresetIndex).toBe(1)
	})

	test('initialises the oscillator envelope with a valid AudioParam time', async () => {
		const setValueAtTime = jest.fn()
		const createGain = () => ({
			gain:{ value:1, setValueAtTime, cancelScheduledValues:jest.fn() },
			connect(destination){ return destination },
			disconnect:jest.fn()
		})
		const OriginalOscillatorNode = global.OscillatorNode
		global.OscillatorNode = class {
			frequency = { value:440, cancelScheduledValues:jest.fn() }
			detune = { value:0 }
			connect(destination){ return destination }
			start(){}
		}
		const oscillator = Object.create(OscillatorInstrument.prototype)
		oscillator.context = { currentTime:2.5, createGain }
		oscillator.options = { shape:'sine' }
		oscillator.currentVolume = 0.5

		try{
			await oscillator.create()
			expect(setValueAtTime).toHaveBeenCalledWith(0, 2.5)
			expect(oscillator.output).toBe(oscillator.gainNode)
		}finally{
			global.OscillatorNode = OriginalOscillatorNode
		}
	})

	test('exports the selected child engine instead of the Chord wrapper', () => {
		const exported = exportPersonQueryOptions({
			playerNumber:0,
			instrumentType:INSTRUMENT_TYPE_OSCILLATOR,
			options:{ defaultInstrument:INSTRUMENT_TYPE_SOUNDFONT },
			activeInstrument:{ type:'ChordInstrument', activePresetIndex:2 }
		}, 'p-1')

		expect(exported['p-1-instrument']).toBe(INSTRUMENT_TYPE_OSCILLATOR)
		expect(exported['p-1-preset']).toBe(2)
	})
})
