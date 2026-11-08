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

	test('wires each secondary button to a unique handler', () => {
		expect(personSource).toContain("this.buttonChangeInstrument.addEventListener( 'pointerdown', this.onInstrumentChangeRequested")
		expect(personSource).toContain("this.buttonChangeInputMode.addEventListener( 'pointerdown', this.onInputModeChangeRequested")
		expect(personSource).toContain("this.buttonToggleChordDisplay.addEventListener( 'pointerdown', this.onInputTypeChangeRequested")
		expect(personSource).toContain("this.buttonChangeOperatingMode.addEventListener( 'pointerdown', this.onOperatingModeChangeRequested")
	})
})
