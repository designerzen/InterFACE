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

describe('Person trim', () => {
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
