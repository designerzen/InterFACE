const { TextDecoder, TextEncoder } = require('util')

global.TextDecoder ??= TextDecoder
global.TextEncoder ??= TextEncoder
global.structuredClone ??= value => JSON.parse(JSON.stringify(value))

jest.mock('../source/audio/audio.js', () => ({ ZERO:0.0001 }))

let DRUM_LAB_INSTRUMENTS
let collectPresetExports
let createPresetCode
let getNumericRange
let getPitchedPresetOptions

beforeAll(async () => {
	;({ DRUM_LAB_INSTRUMENTS, collectPresetExports, createPresetCode, getNumericRange, getPitchedPresetOptions } = await import('../source/tests/drum-preset-lab.js'))
})

describe('drum preset lab catalogue', () => {
	test('exposes every synthesised percussion family and its presets', () => {
		expect(DRUM_LAB_INSTRUMENTS).toHaveLength(16)
		expect(DRUM_LAB_INSTRUMENTS.every(item => item.presets.length > 0)).toBe(true)
		expect(DRUM_LAB_INSTRUMENTS.map(item => item.id)).toEqual(expect.arrayContaining([
			'kick', 'snare', 'hihat', 'handDrum', 'triangle', 'electronicPercussion',
		]))
		expect(DRUM_LAB_INSTRUMENTS.every(item => typeof item.load === 'function')).toBe(true)
		expect(DRUM_LAB_INSTRUMENTS.every(item => /^create[A-Z]/.test(item.factory))).toBe(true)
		expect(DRUM_LAB_INSTRUMENTS.every(item => {
			const names = item.presets.map(preset => preset.value.name)
			return new Set(names).size === names.length
		})).toBe(true)
		const cymbals = DRUM_LAB_INSTRUMENTS.find(item => item.id === 'hihat').presets
		expect(cymbals.map(preset => preset.value.name)).toEqual(expect.arrayContaining([
			'Crash-style Open Hihat', 'Ride-style Open Hihat', 'Splash Cymbal', 'China Cymbal',
		]))
		expect(DRUM_LAB_INSTRUMENTS.find(item => item.id === 'clack').presets
			.map(preset => preset.value.name)).toContain('Metronome Clack')
	})

	test('collects explicit preset collections without relying on export-name prefixes', () => {
		const shared = { name:'Shared', velocity:1 }
		const crash = { name:'Crash', velocity:1 }
		expect(collectPresetExports({
			DEFAULT_TEST:shared,
			PRESET_ALIAS:shared,
			PRESET_LIST:[shared],
			OPEN_HIHAT_CRASH:crash,
			helper:() => null,
		}, [crash, crash])).toEqual([{ exportName:'OPEN_HIHAT_CRASH', value:crash }])
	})

	test('creates useful numeric bounds from the selected instrument presets', () => {
		expect(getNumericRange('frequency', [{ frequency:100 }, { frequency:800 }], 400)).toMatchObject({
			min:0,
			max:1200,
			step:1,
		})
	})

	test('creates copyable factory and preset code', () => {
		const instrument = DRUM_LAB_INSTRUMENTS.find(item => item.id === 'kick')
		const code = createPresetCode(instrument, { name:'My Kick', velocity:0.8 })
		expect(code).toContain("import { createKick } from './audio/synthesizers/kick.js'")
		expect(code).toContain('export const CUSTOM_MY_KICK')
		expect(code).toContain('voice(CUSTOM_MY_KICK)')
	})

	test('uses the instrument factory instead of deriving one from its id', () => {
		const code = createPresetCode({
			id:'custom-id',
			factory:'createKick',
			importPath:'./audio/synthesizers/kick.js',
		}, { name:'Custom', velocity:1 })
		expect(code).toContain('const voice = createKick(audioContext, output)')
	})

	test('pitches only the explicit frequency fields for a synth family', () => {
		const preset = { name:'Test', frequency:200, length:0.5, partialRatios:[1, 2] }
		expect(getPitchedPresetOptions('triangle', preset, 72)).toEqual({
			name:'Test',
			frequency:400,
			length:0.5,
			partialRatios:[1, 2],
		})
		expect(preset.frequency).toBe(200)
	})
})
