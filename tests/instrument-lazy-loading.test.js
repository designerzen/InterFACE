import { readFileSync } from 'fs'
import * as instrumentTypes from '../source/audio/instrument-list.js'

// Execute the factory's real loader with controllable split-bundle imports.
// A dependent bundle throws if evaluated before the oscillator is registered.
const createLoader = () => {
	const source = readFileSync('source/audio/instrument-factory.js', 'utf8')
		.split('export default class InstrumentFactory')[0]
		.replace(/^import .*$/gm, '')
		.replace(/export const /g, 'const ')
		.replace(/\bimport\(/g, 'importBundle(')
	let releaseOscillator
	let oscillatorRegistered = false
	const oscillatorReady = new Promise(resolve => { releaseOscillator = resolve })
	const classes = new Map()
	const importBundle = jest.fn(async path => {
		if (path.endsWith('/instrument.oscillator.js'))
		{
			await oscillatorReady
			oscillatorRegistered = true
		}
		if (/instrument\.(dual|triple)-oscillator\.js$/.test(path) && !oscillatorRegistered)
		{
			throw Error("Cannot find module 'SLj1M'")
		}
		if (!classes.has(path)) classes.set(path, { setPresets:jest.fn() })
		return { default:classes.get(path) }
	})
	const dependencies = {
		...instrumentTypes,
		importBundle,
		WAVE_ARCHIVE_GENERAL_MIDI:'waves.zip',
		loadWaveTableFromArchive:jest.fn(async () => []),
		loadWaveTableFromManifest:jest.fn(async () => [])
	}
	const load = new Function(...Object.keys(dependencies), `${source}; return lazilyLoadInstrument`)(...Object.values(dependencies))
	return { load, importBundle, releaseOscillator }
}

test('keeps instruments unloaded until requested, including MIDI', async () => {
	const { load, importBundle } = createLoader()
	expect(importBundle).not.toHaveBeenCalled()
	await load(instrumentTypes.INSTRUMENT_TYPE_MIDI)
	expect(importBundle.mock.calls).toEqual([['./instruments/instrument.midi.js']])
})

test('concurrent oscillator voices and aliases wait for their lazy base bundle', async () => {
	const { load, importBundle, releaseOscillator } = createLoader()
	const pending = [
		load('osc2'),
		load('osc3'),
		load('osc'),
		load(instrumentTypes.INSTRUMENT_TYPE_DUAL_OSCILLATOR),
		load(instrumentTypes.INSTRUMENT_TYPE_OSCILLATOR)
	]
	expect(importBundle.mock.calls).toEqual([['./instruments/instrument.oscillator.js']])
	releaseOscillator()
	const voices = await Promise.all(pending)
	expect(voices[0]).toBe(voices[3])
	expect(voices[2]).toBe(voices[4])
	expect(importBundle).toHaveBeenCalledTimes(3)
	await load('osc2')
	expect(importBundle).toHaveBeenCalledTimes(3)
})

test('a failed import can be retried', async () => {
	const { load, importBundle } = createLoader()
	importBundle.mockRejectedValueOnce(Error('Network failure'))
	await expect(load('sf')).rejects.toThrow('Network failure')
	await expect(load('sf')).resolves.toBeDefined()
	expect(importBundle).toHaveBeenCalledTimes(2)
})

test('FM and DX7 aliases share one lazy instrument class', async () => {
	const { load, importBundle } = createLoader()
	const classes = await Promise.all([load('fm'), load('dx7'), load(instrumentTypes.INSTRUMENT_TYPE_FM)])
	expect(classes[0]).toBe(classes[1])
	expect(classes[1]).toBe(classes[2])
	expect(importBundle.mock.calls).toEqual([['./instruments/instrument.js'], ['./midi/general-midi.constants.js'], ['./instruments/instrument.fm.js']])
})
