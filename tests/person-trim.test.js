jest.mock('../source/people/person.js', () => ({
	__esModule:true,
	default:class Person {
		constructor(index, options){
			this.playerNumber = index
			this.trim = options.trim
		}
	},
	EVENT_PERSON_BORN:'person-born',
	EVENT_PERSON_DEAD:'person-dead'
}))
jest.mock('../source/people/person.presets.js', () => ({
	configurePersonByIndex:jest.fn(),
	configurePersonByOperatingMode:jest.fn()
}))

import { MAX_PERSON_TRIM, PersonManager } from '../source/people/person-manager.js'
import {readFileSync} from 'fs'

describe('Person trim', () => {
	test('startup applies mixer trim over stale per-player saved options before audio setup', () => {
		const source = readFileSync('source/interface.js','utf8')
		const applyOptions = source.match(/person\.setOptions\([^\n]+\)/)[0]
		const manager = new PersonManager()
		const person = {setOptions:jest.fn()}
		const apply = new Function('person','personOptions','personManager',applyOptions)
		apply(person,{trim:1,defaultPreset:42},manager)
		expect(person.setOptions).toHaveBeenLastCalledWith({trim:4 * 2 / 3,defaultPreset:42})
		manager.setTrim(3.5)
		apply(person,{trim:1,defaultPreset:42},manager)
		expect(person.setOptions).toHaveBeenLastCalledWith({trim:3.5,defaultPreset:42})
	})
	test('trim updates the audio node and options exported for the next load', () => {
		const source = readFileSync('source/people/person.js','utf8')
		const setter = source.slice(source.indexOf('\tset trim(value){')+'\tset trim(value){'.length,source.indexOf('\n\t}',source.indexOf('\tset trim(value){')))
		const apply = new Function('value','clamp',setter)
		const person = {options:{trim:1},trimNode:{gain:{setValueAtTime:jest.fn()}},audioContext:{currentTime:2}}
		apply.call(person,4,(value,min,max) => Math.min(max,Math.max(min,value)))
		expect(person.trimLevel).toBe(4)
		expect(person.options.trim).toBe(4)
		expect(person.trimNode.gain.setValueAtTime).toHaveBeenCalledWith(4,2)
	})
	test('defaults every new voice to two thirds of 400 percent and supports 500 percent', () => {
		const manager = new PersonManager()
		expect(manager.createPerson().trim).toBeCloseTo(4 * 2 / 3)
		expect(manager.createPerson().trim).toBeCloseTo(4 * 2 / 3)
		expect(manager.setTrim(5)).toBe(5)
		expect(manager.people.map(person => person.trim)).toEqual([5,5])
	})
	test('updates every existing Person and retains the level for future people', () => {
		const manager = new PersonManager()
		const people = [{ trim:1 }, { trim:1 }]
		manager.people = people

		expect(manager.setTrim(1.5)).toBe(1.5)
		expect(people.map(person => person.trim)).toEqual([1.5, 1.5])
		expect(manager.trimLevel).toBe(1.5)
		expect(manager.createPerson().trim).toBe(1.5)
	})

	test('clamps trim to the supported amplification range', () => {
		const manager = new PersonManager()
		manager.people = [{ trim:1 }]

		expect(manager.setTrim(20)).toBe(MAX_PERSON_TRIM)
		expect(manager.people[0].trim).toBe(MAX_PERSON_TRIM)
		expect(manager.setTrim(-1)).toBe(0)
	})
})
