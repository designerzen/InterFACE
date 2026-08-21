import DrumkitInstrument, { drumPitchBendToRatio } from '../source/audio/instruments/instrument.drumkit.js'
import Instrument from '../source/audio/instruments/instrument.js'
import { PERCUSSION_SOUND_PRESETS } from '../source/audio/synthesizers/percussion-presets.js'
import * as MIDICommands from '../source/audio/midi/midi-commands.js'

const createDrumkitState = () => {
	const drumkit = Object.create(DrumkitInstrument.prototype)
	drumkit.voiceOptions = {}
	drumkit.aftertouchByNote = new Map()
	drumkit.aftertouchPressure = 0
	drumkit.pitchBendValue = 0
	drumkit.pitchBendRatio = 1
	drumkit.arranger = { updatePerson:jest.fn(), setIntent:jest.fn(), requestFill:jest.fn() }
	drumkit.programNumber = 0
	drumkit.programPreset = PERCUSSION_SOUND_PRESETS[0]
	drumkit.setHatPair = jest.fn(hat => drumkit.hatOptions = hat)
	return drumkit
}

describe('drumkit MIDI performance controls', () => {
	test('normalizes Web MIDI and raw 14-bit pitch bend to a two-semitone range', () => {
		expect(drumPitchBendToRatio(0)).toBe(1)
		expect(drumPitchBendToRatio(8192)).toBe(1)
		expect(drumPitchBendToRatio(1)).toBeCloseTo(2 ** (2 / 12))
		expect(drumPitchBendToRatio(-1)).toBeCloseTo(2 ** (-2 / 12))
	})

	test('applies pitch bend and aftertouch to subsequent drum hits', () => {
		const drumkit = createDrumkitState()
		drumkit.pitchBend(1)
		drumkit.aftertouch(60, 127)

		const options = drumkit.applyPerformanceControls({ frequency:200, startFrequency:800, endFrequency:100, velocity:0.5 })
		expect(options.frequency).toBeCloseTo(200 * drumkit.pitchBendRatio)
		expect(options.startFrequency).toBeCloseTo(800 * drumkit.pitchBendRatio)
		expect(options.endFrequency).toBeCloseTo(100 * drumkit.pitchBendRatio)
		expect(options.velocity).toBe(0.75)
		expect(drumkit.arranger.requestFill).toHaveBeenCalledWith(1)
	})

	test('program change accepts MIDI indexes and preset names', async () => {
		const drumkit = createDrumkitState()
		const indexed = await drumkit.programChange(5)
		expect(indexed).toBe(PERCUSSION_SOUND_PRESETS[5])
		expect(drumkit.activePresetIndex).toBe(5)
		expect(drumkit.kickOptions.name).toBe(indexed.kit.kick)
		expect(drumkit.snareOptions.name).toBe(indexed.kit.snare)

		const named = await drumkit.programChange('Roland TR-808')
		expect(named.id).toBe('roland-tr-808')
		expect(drumkit.activePreset).toBe('Roland TR-808')
		expect(await drumkit.getPresets()).toHaveLength(PERCUSSION_SOUND_PRESETS.length)
	})

	test('wraps out-of-range MIDI program numbers across the preset bank', async () => {
		const drumkit = createDrumkitState()
		const preset = await drumkit.programChange(127)
		expect(preset).toBe(PERCUSSION_SOUND_PRESETS[127 % PERCUSSION_SOUND_PRESETS.length])
	})

	test('base MIDI dispatch wires channel pressure and decoded pitch-bend values', async () => {
		const instrument = {
			aftertouch:jest.fn(),
			pitchBend:jest.fn(),
		}
		await Instrument.prototype.doChannelCommand.call(instrument, {
			subtype:MIDICommands.COMMAND_CHANNEL_AFTER_TOUCH,
			amount:96,
		})
		await Instrument.prototype.doChannelCommand.call(instrument, {
			subtype:MIDICommands.COMMAND_PITCH_BEND,
			value:12288,
		})

		expect(instrument.aftertouch).toHaveBeenCalledWith(undefined, 96)
		expect(instrument.pitchBend).toHaveBeenCalledWith(12288)
	})
})
