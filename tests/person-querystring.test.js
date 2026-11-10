import { DEFAULT_PEOPLE_OPTIONS, DEFAULT_PERSON_OPTIONS } from '../source/settings/options.people.js'
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

	test('exports only changed options under one prefix', () => {
		const fakePerson = {
			id:'person-a',
			playerNumber:0,
			options:{
				...DEFAULT_PEOPLE_OPTIONS[0],
				inputMode:1,
				showChordNames:true,
				headNoteRangeOverride:40,
				noteController:'pitch',
				// copied from the global settings
				tonic:5,
				drawMask:false
			},
			activeInstrument:{ type:'sample', activePresetIndex:7 },
			get personIndex(){
				return this.playerNumber
			}
		}

		const params = exportPersonQueryOptions(fakePerson)

		expect(params).toEqual({
			'p-1-inputMode':1,
			'p-1-showChordNames':true,
			'p-1-noteController':'pitch'
		})
	})

	test('exports nothing for an unchanged person', () => {
		const fakePerson = {
			playerNumber:1,
			options:{ ...DEFAULT_PEOPLE_OPTIONS[1] },
			get personIndex(){
				return this.playerNumber
			}
		}
		expect(exportPersonQueryOptions(fakePerson)).toEqual({})
	})
})

describe('person querystring integration', () => {
	const interfaceSource = readFileSync('source/interface.js', 'utf8')

	test('imports the Person defaults used while creating people', () => {
		expect(interfaceSource).toContain('DEFAULT_PEOPLE_OPTIONS')
	})

	test('merges explicit per-person query options during person creation and syncs them back to the URL', () => {
		expect(interfaceSource).toContain('const queryPersonOptions = Person.getQueryOptions(')
		expect(interfaceSource).toContain('queryPersonOptions')
		expect(interfaceSource).toContain('const exportedQueryOptions = person.exportJSONData()')
		expect(interfaceSource).toContain('stateMachine.replaceGroup(')
	})
})
