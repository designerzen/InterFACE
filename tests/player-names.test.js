jest.mock('../source/audio/instrument-factory.js', () => ({ createInstrumentFromData:jest.fn() }))
jest.mock('../source/audio/sound-font-instruments.js', () => ({}))
jest.mock('../source/dom/person-report-dialog.js', () => ({ openPersonReportDialog:jest.fn() }))

import Person from '../source/people/person.js'
import { createStore } from '../source/utils/store.js'
import { exportPersonQueryOptions, getPersonQueryOptions } from '../source/people/person.query.js'
import { populateInstrumentPanel, addInteractivityToInstrumentPanel } from '../source/dom/ui.panel-instruments.js'
import { openPersonReportDialog } from '../source/dom/person-report-dialog.js'

test('renames from the sidebar, restores from the storage adapter, and keeps queries anonymous', async () => {
	jest.useFakeTimers()
	localStorage.clear()
	document.body.innerHTML = '<form class="person-a-controls"></form>'
	const person = Object.create(Person.prototype)
	person.id = 'person-a'
	person.name = '⯀'
	person.playerNumber = 0
	person.options = { defaultInstrument:'oscillator' }
	Object.defineProperty(person, 'noteSequence', { value:'major' })
	person.dispatchPersonEvent = jest.fn()
	const store = createStore('player-name-test')
	person.dispatchPersonEvent.mockImplementation((type, detail) => {
		if ('displayName' in detail) store.setItem('playerNames', { [person.storageKey]:detail.displayName })
	})
	const controls = person.controls
	await populateInstrumentPanel(controls, { name:'Oscillator', getPresets:async () => [] }, person)
	const cleanup = addInteractivityToInstrumentPanel(controls, person.onInstrumentInput.bind(person))
	const input = controls.querySelector('[data-person-action="displayName"]')
	expect(input.closest('h4.instrument-families')).not.toBeNull()
	expect(input.value).toBe('Player 1')
	expect(controls.querySelectorAll('[data-person-action="displayName"]')).toHaveLength(1)
	const reportButton = controls.querySelector('[data-person-report]')
	expect(input.nextElementSibling).toBe(reportButton)
	expect(reportButton.closest('details')).toBeNull()
	expect(reportButton.getAttribute('aria-label')).toBe('Progress & data')
	expect(reportButton.querySelector('svg').getAttribute('aria-hidden')).toBe('true')
	reportButton.click()
	expect(openPersonReportDialog).toHaveBeenCalledWith(person, reportButton)
	input.focus()
	input.value = '  Alex <&>  '
	input.dispatchEvent(new Event('input', { bubbles:true }))
	expect(person.displayName).toBe('Alex <&>')
	expect(input.value).toBe('  Alex <&>  ')
	expect(person.name).toBe('⯀')
	expect(person.options).not.toHaveProperty('displayName')
	jest.runOnlyPendingTimers()
	expect(createStore('player-name-test').getItem('playerNames')[person.storageKey]).toBe('Alex <&>')
	expect(JSON.stringify(exportPersonQueryOptions(person))).not.toContain('Alex')
	expect(getPersonQueryOptions({ 'p-1-displayName':'Shared name' }, ['p-1'])).toEqual({})
	await populateInstrumentPanel(controls, { name:'Oscillator', getPresets:async () => [] }, person)
	expect(controls.querySelector('[data-person-action="displayName"]').value).toBe('Alex <&>')
	person.setDisplayName('   ')
	expect(person.displayName).toBe('')
	expect(controls.querySelector('[data-person-action="displayName"]').value).toBe('Player 1')
	cleanup()
	jest.useRealTimers()
})
