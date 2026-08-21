jest.mock('../source/settings/options.js', () => ({
	getDomainDefaults: jest.fn(),
	getFactoryDefaults: jest.fn(),
}))

const { setElementCheckState } = require('../source/utils/state.js')

describe('state.js', () => {
	test('sets select values without writing an invalid selectedIndex attribute', () => {
		document.body.innerHTML = `
			<select>
				<option value="piano">Piano</option>
				<option value="organ">Organ</option>
			</select>
		`

		const select = document.querySelector('select')

		expect(() => setElementCheckState(select, 'organ')).not.toThrow()
		expect(select.value).toBe('organ')
		expect(select.selectedIndex).toBe(1)
	})
})
