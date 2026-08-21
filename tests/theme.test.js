import { setupThemeControls } from '../source/theme/theme.js'

describe('setupThemeControls', () => {
	test('does not fail when the optional theme selector is absent', () => {
		expect(() => setupThemeControls(null)).not.toThrow()
		expect(setupThemeControls(null)).toBeNull()
	})
})
