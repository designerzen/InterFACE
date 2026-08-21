import { setToggle } from '../source/dom/toggle.js'

describe('setToggle', () => {
	test('does not fail when an optional control is absent', () => {
		document.body.innerHTML = ''

		expect(() => setToggle('missing-toggle', () => {}, false)).not.toThrow()
		expect(setToggle('missing-toggle', () => {}, false)).toBeNull()
	})
})
