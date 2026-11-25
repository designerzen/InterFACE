import { readFileSync } from 'node:fs'

const controlPanel = readFileSync('source/partials/control-panel.pug', 'utf8')
const personSource = readFileSync('source/people/person.js', 'utf8')

describe('Person overlay buttons', () => {
	test.each(['a', 'b', 'c', 'd'])('provides face plus four independently named controls for person %s', personID => {
		expect(controlPanel).toContain(`.face-button.person-${personID}-face`)
		expect(controlPanel).toContain(`.emoji-button.person-${personID}-emoji`)
		expect(controlPanel).toContain(`.note-button.person-${personID}-note`)
		expect(controlPanel).toContain(`.instrument-button.person-${personID}-instrument`)
		expect(controlPanel).toContain(`.mode-button.person-${personID}-mode`)
	})

	test('activates each control once by pointer or keyboard and removes listeners on disposal', () => {
		const controls = [
			['button', 'onFaceTouchStart'],
			['buttonChangeInstrument', 'onInstrumentChangeRequested'],
			['buttonChangeInputMode', 'onInputModeChangeRequested'],
			['buttonToggleChordDisplay', 'onInputTypeChangeRequested'],
			['buttonChangeOperatingMode', 'onOperatingModeChangeRequested'],
		]
		const person = { abortController: new AbortController() }
		for (const [button, handler] of controls) {
			person[button] = document.createElement('button')
			person[handler] = jest.fn()
		}
		const start = personSource.indexOf('const bindPointerAndKeyboard =')
		const end = personSource.indexOf('\n\t\t\tfor (const [selector, direction]', start)
		expect(start).toBeGreaterThan(-1)
		expect(end).toBeGreaterThan(start)
		new Function(personSource.slice(start, end)).call(person)
		for (const [button, handler] of controls) {
			person[button].dispatchEvent(new Event('pointerdown'))
			person[button].dispatchEvent(new MouseEvent('click', { detail: 1 }))
			expect(person[handler]).toHaveBeenCalledTimes(1)
			person[button].dispatchEvent(new MouseEvent('click', { detail: 0 }))
			expect(person[handler]).toHaveBeenCalledTimes(2)
		}
		person.abortController.abort()
		for (const [button, handler] of controls) {
			person[button].dispatchEvent(new Event('pointerdown'))
			person[button].dispatchEvent(new MouseEvent('click', { detail: 0 }))
			expect(person[handler]).toHaveBeenCalledTimes(2)
		}
	})
})
