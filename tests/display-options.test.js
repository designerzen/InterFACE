import { createDisplayOptions } from '../source/dom/ui.display.js'

describe('display options', () => {
	test('are safely ignored when the display selector is not rendered', () => {
		document.body.innerHTML = ''

		expect(createDisplayOptions(['DisplayMediaVision2D'], 'DisplayMediaVision2D')).toBeNull()
	})

	test('populate the display selector when it is rendered', () => {
		document.body.innerHTML = `
			<label for="select-display" hidden>Display</label>
			<select id="select-display"></select>
		`

		const select = createDisplayOptions(['DisplayMediaVision2D'], 'DisplayMediaVision2D')

		expect(select).toBe(document.getElementById('select-display'))
		expect(select.value).toBe('DisplayMediaVision2D')
		expect(document.querySelector('label[for="select-display"]').hidden).toBe(false)
	})
})
