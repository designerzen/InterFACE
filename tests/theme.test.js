import { setupThemeControls } from '../source/theme/theme.js'

describe('setupThemeControls', () => {
	test('does not fail when the optional theme selector is absent', () => {
		expect(() => setupThemeControls(null)).not.toThrow()
		expect(setupThemeControls(null)).toBeNull()
	})

	test('removes previous theme-* class when switching themes', () => {
		document.body.className = 'theme-mit loaded'
		const select = document.createElement('select')
		for (const theme of ['theme-default', 'theme-high-contrast', 'theme-neon']) {
			const option = document.createElement('option')
			option.value = theme
			option.textContent = theme
			select.appendChild(option)
		}
		document.body.appendChild(select)
		setupThemeControls(select)

		select.value = 'theme-high-contrast'
		select.dispatchEvent(new Event('change'))
		expect(document.body.classList.contains('theme-high-contrast')).toBe(true)
		expect(document.body.classList.contains('theme-mit')).toBe(false)
		expect(document.body.classList.contains('loaded')).toBe(true)

		select.value = 'theme-neon'
		select.dispatchEvent(new Event('change'))
		expect(document.body.classList.contains('theme-neon')).toBe(true)
		expect(document.body.classList.contains('theme-high-contrast')).toBe(false)
	})
})
