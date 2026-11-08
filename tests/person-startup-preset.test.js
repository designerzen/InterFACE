import {readFileSync} from 'fs'

const source=readFileSync('source/interface.js','utf8').replace(/\r\n/g,'\n')
const start=source.indexOf('\t\tconst specifiedPreset =')
const selection=source.slice(start,source.indexOf('\n\t\tconsole.info("Person "+index+',start))
const selectPreset=new Function('queryPersonOptions','personData','savedOptions','midiPerformance','person','getRandomPresetForPerson',`${selection}\nreturn preset`)

test.each([0,40,127])('explicit player preset %i wins over MIDI and random defaults',preset=>{
	const random=jest.fn(()=>33)
	expect(selectPreset({defaultPreset:preset},{defaultPreset:10},{defaultPreset:20},{instruments:[50]},{personIndex:2},random)).toBe(preset)
	expect(random).not.toHaveBeenCalled()
})

test('compact player preset and saved player preset are restored',()=>{
	const random=jest.fn(()=>33)
	expect(selectPreset({},{defaultPreset:0},{defaultPreset:20},null,{},random)).toBe(0)
	expect(selectPreset({},{},{defaultPreset:20},null,{},random)).toBe(20)
	expect(random).not.toHaveBeenCalled()
})

test.each([0,1,2,3])('unspecified player %i selects from its own random pool',personIndex=>{
	const random=jest.fn(index=>[115,48,33,73][index])
	expect(selectPreset({},{},{},null,{personIndex},random)).toBe([115,48,33,73][personIndex])
	expect(random).toHaveBeenCalledWith(personIndex)
})

test('MIDI performance supplies its instrument when no player preset is specified',()=>{
	const random=jest.fn()
	expect(selectPreset({},{},{},{instruments:[0]},{personIndex:1},random)).toBe(0)
	expect(random).not.toHaveBeenCalled()
})
