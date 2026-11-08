import { DEFAULT_PERSON_OPTIONS } from '../source/settings/options.people.js'
import { readFileSync } from 'node:fs'
import {
	exportPersonQueryOptions,
	getPersonQueryOptions
} from '../source/people/person.query.js'

describe('person querystring options', () => {
	test('reads explicit per-person query params for every person option keyspace', () => {
		const query = {}
		for (const optionKey of Object.keys(DEFAULT_PERSON_OPTIONS)) {
			query[`p-1-${optionKey}`] = DEFAULT_PERSON_OPTIONS[optionKey]
		}
		query['p-1-inputMode'] = 1
		query['p-1-showChordNames'] = true
		query['p-1-noteController'] = 'pitch'
		query['p-1-defaultPreset'] = 42

		const options = getPersonQueryOptions(query, ['p-1'])

		expect(options.inputMode).toBe(1)
		expect(options.showChordNames).toBe(true)
		expect(options.noteController).toBe('pitch')
		expect(options.defaultPreset).toBe(42)
		expect(Object.keys(options)).toEqual(expect.arrayContaining(Object.keys(DEFAULT_PERSON_OPTIONS)))
	})

	test('accepts both compact and DOM-style person prefixes plus legacy aliases', () => {
		const options = getPersonQueryOptions({
			'person-a-instrument':'sample',
			'person-a-preset':12,
			'person-a-particles':'stars',
			'p-1.autoRepeat':false
		}, ['p-1', 'person-a'])

		expect(options.defaultInstrument).toBe('sample')
		expect(options.defaultPreset).toBe(12)
		expect(options.noteParticleGraphics).toBe('stars')
		expect(options.autoRepeat).toBe(false)
	})

	test('exports all person options as explicit query params for both prefixes', () => {
		const fakePerson = {
			id:'person-a',
			playerNumber:0,
			options:{
				...DEFAULT_PERSON_OPTIONS,
				inputMode:1,
				showChordNames:true,
				headNoteRangeOverride:40,
				headVerticalRangeOverride:60,
				noteController:'pitch'
			},
			activeInstrument:{ type:'sample', activePresetIndex:7 },
			get personIndex(){
				return this.playerNumber
			}
		}

		const params = exportPersonQueryOptions(fakePerson)

		expect(params['p-1-inputMode']).toBe(1)
		expect(params['person-a-showChordNames']).toBe(true)
		expect(params['p-1-headNoteRangeOverride']).toBe(40)
		expect(params['person-a-headVerticalRangeOverride']).toBe(60)
		expect(params['person-a-noteController']).toBe('pitch')
		expect(params['p-1-instrument']).toBe('sample')
		expect(params['person-a-preset']).toBe(7)
	})
})

describe('person querystring integration', () => {
	const interfaceSource = readFileSync('source/interface.js', 'utf8')

	test('imports the Person defaults used while synchronising query state', () => {
		expect(interfaceSource).toContain('DEFAULT_PEOPLE_OPTIONS, DEFAULT_PERSON_OPTIONS')
	})

	test('merges explicit per-person query options during person creation and syncs them back to the URL', () => {
		expect(interfaceSource).toContain('const queryPersonOptions = Person.getQueryOptions(')
		expect(interfaceSource).toContain('queryPersonOptions')
		expect(interfaceSource).toContain('const exportedQueryOptions = person.exportJSONData()')
		expect(interfaceSource).toContain('stateMachine.searchParams.set(person.storageKey, compactData)')
	})
})
