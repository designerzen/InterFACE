import { readFileSync } from 'fs'

const source = readFileSync('source/interface.js', 'utf8').replace(/\r\n/g, '\n')
const controls = source.slice(source.indexOf("\t\tselects.voiceEngine = connectSelect"), source.indexOf('\n\t\t// set the master sound font'))

const setup = (instrumentFactory) => {
	document.body.innerHTML = '<select id="select-voice-engine"><option value="native">Native</option><option value="fm">FM</option></select><p id="voice-engine-status"></p>'
	const selects = {}
	let change
	const stateMachine = {get:jest.fn(() => 'fm'), set:jest.fn()}
	const people = [{ready:Promise.resolve(), setupInstrumnentForm:jest.fn(), presetName:'piano'}, {ready:Promise.resolve(), setupInstrumnentForm:jest.fn(), presetName:'strings'}]
	new Function('selects', 'connectSelect', 'stateMachine', 'instrumentFactory', 'personManager', 'setFeedback', 'enginePanel', 'setupEngineInterface', 'optionLabel', controls)(
		selects, (id, callback) => { change = callback; return document.getElementById(id) },
		stateMachine, instrumentFactory, {people}, jest.fn(), null, () => null
	)
	return {select:selects.voiceEngine, change, stateMachine, people}
}

test('controls can initialize before audio exists, retaining the saved setting until startup', () => {
	const {select} = setup(undefined)
	expect(select.value).toBe('fm')
	expect(select.disabled).toBe(true)
})

test('a global change refreshes both Persons and saves the successful engine', async () => {
	const host = {engine:'native', select:jest.fn(async engine => { host.engine = engine })}
	const {select, change, stateMachine, people} = setup({voiceEngineHost:host})
	select.value = 'fm'
	await change(select.selectedOptions[0])
	expect(host.select).toHaveBeenCalledWith('fm')
	expect(stateMachine.set).toHaveBeenCalledWith('voiceEngine', 'fm', select)
	for (const person of people) expect(person.setupInstrumnentForm).toHaveBeenCalled()
	expect(select.disabled).toBe(false)
})

test('a failed global change restores the active selection without saving a broken setting', async () => {
	const host = {engine:'native', select:jest.fn(async () => {throw Error('unavailable')})}
	const {select, change, stateMachine} = setup({voiceEngineHost:host})
	select.value = 'fm'
	await change(select.selectedOptions[0])
	expect(select.value).toBe('native')
	expect(select.disabled).toBe(false)
	expect(stateMachine.set).not.toHaveBeenCalled()
	expect(document.getElementById('voice-engine-status').textContent).toContain('unavailable')
})

test('ignores repeated engine changes until the active switch finishes',async()=>{
	let finish
	const host={engine:'native',select:jest.fn(engine=>new Promise(resolve=>{finish=()=>{host.engine=engine;resolve()}}))}
	const {select,change}=setup({voiceEngineHost:host})
	select.value='fm'
	const switching=change(select.selectedOptions[0])
	await Promise.resolve()
	expect(select.disabled).toBe(true)
	await change(select.selectedOptions[0])
	expect(host.select).toHaveBeenCalledTimes(1)
	finish();await switching
	expect(select.disabled).toBe(false)
})
