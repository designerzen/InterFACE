import { readFileSync } from 'fs'
import { parseDX7Presets, FM_FACTORY_PRESETS } from '../source/audio/instruments/presets/dx7.js'
import { INSTRUMENT_TYPE_FM } from '../source/audio/instrument-list.js'

const source = readFileSync('source/people/person.js', 'utf8').replace(/\r\n/g, '\n')
const method = source.slice(source.indexOf('\tasync loadDX7File(file){'), source.indexOf('\n\tsetPanelAction(action, value){'))
	.replaceAll("await import('../audio/instruments/presets/dx7.js')", 'presetModule')
const methods = new Function('presetModule', `return ({${method.replace(/\n\t}\n/g, '\n\t},\n')}})` )({parseDX7Presets, FM_FACTORY_PRESETS})
const {loadDX7File} = methods

const makePerson = () => {
	const instruments = Array.from({length:3}, () => ({setDX7Presets:jest.fn(),allSoundOff:jest.fn(async () => {})}))
	return {
		...methods,
		instrumentChangePromise:Promise.resolve(),
		activeInstrument:{instruments,allNotesOff:jest.fn(async () => {})},
		setOptions:jest.fn(),loadPreset:jest.fn(async () => {}),refreshInstrumentPanelIfDirty:jest.fn(async () => {})
	}
}

test('Person imports a bank into every chord voice and refreshes the preset menu', async () => {
	const person = makePerson()
	const file = {arrayBuffer:async () => new Uint8Array(4096).buffer}
	expect(await loadDX7File.call(person,file)).toBe(32)
	for (const voice of person.activeInstrument.instruments) {
		expect(voice.allSoundOff).toHaveBeenCalledTimes(1)
		expect(voice.setDX7Presets).toHaveBeenCalledWith(person.fmPresets)
	}
	expect(person.loadPreset).toHaveBeenCalledWith(0)
	expect(person.isInstrumentPanelDirty).toBe(true)
	expect(person.refreshInstrumentPanelIfDirty).toHaveBeenCalledTimes(1)
})

test('invalid import leaves the current voices and preset list intact', async () => {
	const person = makePerson()
	await expect(loadDX7File.call(person,{arrayBuffer:async () => new Uint8Array(10).buffer})).rejects.toThrow()
	expect(person.activeInstrument.allNotesOff).not.toHaveBeenCalled()
	expect(person.fmPresets).toBeUndefined()
})

test('General MIDI and the imported bank can be restored without losing either', async () => {
	const person = makePerson()
	await person.loadDX7File({arrayBuffer:async () => new Uint8Array(4096).buffer})
	const imported = person.fmImportedPresets
	await person.setFMPresetBank('gm')
	expect(person.fmPresets).toBe(FM_FACTORY_PRESETS)
	expect(person.fmPresets).toHaveLength(128)
	await person.setFMPresetBank('dx7')
	expect(person.fmPresets).toBe(imported)
})

test('a concurrent engine change prevents importing into a different engine', async () => {
	const person = makePerson()
	person.instrumentChangePromise = Promise.resolve().then(() => {person.activeInstrument.instruments = [{}]})
	await expect(loadDX7File.call(person,{arrayBuffer:async () => new Uint8Array(4096).buffer})).rejects.toThrow(/Select FM/)
	expect(person.loadPreset).not.toHaveBeenCalled()
})

const navigationStart = source.indexOf('\tasync loadPresetByMethod(')
const navigation = source.slice(navigationStart, source.indexOf('\n\t/**', navigationStart))
const navigate = new Function('INSTRUMENT_TYPE_FM', `return ({${navigation}}).loadPresetByMethod`)(INSTRUMENT_TYPE_FM)

test.each([['loadNextPreset', 1], ['loadPreviousPreset', 2], ['reloadPreset', 0]])('FM Person %s selects from the loaded bank', async (method, index) => {
	const person = {instrumentType:INSTRUMENT_TYPE_FM, activeInstrument:{activePresetIndex:0,getPresets:async () => ['A','B','C']},loadPreset:jest.fn(),now:1}
	await navigate.call(person,method)
	expect(person.loadPreset).toHaveBeenCalledWith(index, ['A','B','C'][index], null)
})

test('FM Person random selection uses the loaded bank', async () => {
	const person = {instrumentType:INSTRUMENT_TYPE_FM,activeInstrument:{activePresetIndex:0,getPresets:async () => ['DX7 Only']},loadPreset:jest.fn()}
	await navigate.call(person,'loadRandomPreset')
	expect(person.loadPreset).toHaveBeenCalledWith(0, 'DX7 Only', null)
})
