import { setupEnsemblePresetPanel } from '../source/dom/ui.panel-ensemble-presets.js'
import { loadEnsembleInstrumentPresets } from '../source/people/person.ensemble-presets.js'
import { presets } from '../static/assets/ensemble-presets.json'
import instruments from '../source/audio/general-midi-instruments.json'

jest.mock('../source/people/person.ensemble-presets.js',()=>({loadEnsembleInstrumentPresets:jest.fn()}))
const available=instruments.map(instrument=>instrument.name)
const names=new Map(instruments.map(instrument=>[instrument.location.replace(/-mp3$/,''),instrument.name]))
const player=()=>({activeInstrument:{getPresets:jest.fn(async()=>available)},loadPreset:jest.fn(async()=>true)})
beforeEach(()=>{
	document.body.innerHTML='<aside class="ensemble-preset-panel" hidden><button class="ensemble-preset-toggle"></button><fieldset class="ensemble-preset-controls"></fieldset></aside>'
	loadEnsembleInstrumentPresets.mockResolvedValue(presets)
})

test('shows all ensembles with tempo, key, swing and meter alongside the instrument lineup', async()=>{
	await setupEnsemblePresetPanel([player(),player()])
	expect(document.querySelectorAll('.ensemble-preset-input')).toHaveLength(70)
	const jig=document.querySelector('label[for="ensemble-preset-genre-irish-jig-inspired"]')
	expect(jig.textContent).toContain('168 BPM')
	expect(jig.textContent).toContain('D major')
	expect(jig.textContent).toContain('0% swing')
	expect(jig.textContent).toContain('6/8')
	expect(jig.textContent).toContain('fiddle / acoustic bass')
	expect(document.querySelector('label[for="ensemble-preset-genre-jazz"]').textContent).toContain('Triplet swing')
})

test.each([1,2,3,4])('loads the correct voices for every genre with %s players', async count=>{
	const people=Array.from({length:count},player)
	const applyOptions=jest.fn(),onSelected=jest.fn(),onApplied=jest.fn()
	const api=await setupEnsemblePresetPanel(people,{applyOptions,onSelected,onApplied})
	for(const preset of presets.filter(preset=>preset.style)) {
		await expect(api.applyPresetById(preset.id)).resolves.toBe(preset)
		people.forEach((person,index)=>expect(person.loadPreset).toHaveBeenLastCalledWith(names.get(preset.voicings[count][index])))
		expect(applyOptions).toHaveBeenLastCalledWith(preset,{})
		expect(onSelected).toHaveBeenLastCalledWith(preset)
		expect(onApplied).toHaveBeenLastCalledWith(preset)
		expect(document.querySelector('input:checked').id).toBe(`ensemble-preset-${preset.id}`)
	}
})

test('the radio control applies settings as well as instruments', async()=>{
	const person=player(),onApplied=jest.fn(),applyOptions=jest.fn()
	await setupEnsemblePresetPanel([person],{onApplied,applyOptions})
	const preset=presets.find(p=>p.style==='amapiano')
	const input=document.getElementById(`ensemble-preset-${preset.id}`)
	input.checked=true
	input.dispatchEvent(new Event('change',{bubbles:true}))
	// Wait through the async instrument load and completion callback.
	await new Promise(resolve=>setTimeout(resolve,0))
	expect(applyOptions).toHaveBeenCalledWith(preset,{})
	expect(person.loadPreset).toHaveBeenCalledWith('electric piano 1')
	expect(onApplied).toHaveBeenCalledWith(preset)
})

test('serializes slow loads and drops superseded pending choices', async()=>{
	let release,started
	const gate=new Promise(resolve=>{release=resolve}), loading=new Promise(resolve=>{started=resolve})
	const person=player()
	person.loadPreset.mockImplementationOnce(()=>{started();return gate})
	const applyOptions=jest.fn(),onApplied=jest.fn(),onSelected=jest.fn()
	const api=await setupEnsemblePresetPanel([person],{applyOptions,onApplied,onSelected})
	const first=api.applyPresetById('genre-jazz')
	await loading
	const skipped=api.applyPresetById('genre-trap'), last=api.applyPresetById('genre-irish-jig-inspired')
	release()
	await Promise.all([first,last])
	await expect(skipped).resolves.toBeNull()
	expect(person.loadPreset.mock.calls.map(([name])=>name)).toEqual(['electric piano 2','fiddle'])
	expect(applyOptions).toHaveBeenCalledTimes(2)
	expect(onApplied).toHaveBeenCalledTimes(1)
	expect(onSelected).toHaveBeenLastCalledWith(expect.objectContaining({id:'genre-irish-jig-inspired'}))
})

test('does not report success after an instrument fails, and permits a later choice', async()=>{
	const person=player(),onApplied=jest.fn(),onSelected=jest.fn()
	person.loadPreset.mockRejectedValueOnce(Error('Instrument unavailable'))
	const api=await setupEnsemblePresetPanel([person],{onApplied,onSelected})
	await expect(api.applyPresetById('genre-jazz')).rejects.toThrow('Could not load all instruments')
	expect(onApplied).not.toHaveBeenCalled()
	expect(onSelected).not.toHaveBeenCalled()
	expect(document.querySelector('[aria-busy="true"]')).toBeNull()
	await expect(api.applyPresetById('genre-rock')).resolves.toEqual(expect.objectContaining({id:'genre-rock'}))
	expect(onApplied).toHaveBeenCalledTimes(1)
})

test('restoring a saved ensemble tells the options handler so saved settings are kept', async()=>{
	const person=player(),applyOptions=jest.fn()
	const api=await setupEnsemblePresetPanel([person],{applyOptions})
	await api.applyPresetById('genre-jazz',{restore:true})
	expect(applyOptions).toHaveBeenCalledWith(expect.objectContaining({id:'genre-jazz'}),{restore:true})
	expect(person.loadPreset).toHaveBeenCalled()
})
