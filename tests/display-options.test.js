import { createDisplayOptions, getDisplayFallbackMessage } from '../source/dom/ui.display.js'
import { DISPLAY_IDS, DISPLAY_LABELS } from '../source/display/display-types.js'
import { DISPLAY_ICONS } from '../source/dom/display-icons.js'

describe('display options', () => {
	test('fallback notices name the requested display and its replacement using friendly titles', () => {
		expect(getDisplayFallbackMessage('DisplayWebGPU3D', 'DisplayMediaVision2D')).toBe(
			'Face particles (WebGPU, experimental) is not available. Switching to Face tracking.'
		)
		expect(getDisplayFallbackMessage('DISPLAY_WEB_GL_3D', 'DisplayCanvas2D')).toBe(
			'3D face mesh is not available. Switching to Visualisers and overlays.'
		)
		expect(getDisplayFallbackMessage('<img src=x onerror=alert(1)>', 'DisplayCanvas2D')).toBe(
			'The requested display is not available. Switching to Visualisers and overlays.'
		)
	})
	test('every display has a distinct scalable icon', () => {
		expect(Object.keys(DISPLAY_ICONS).sort()).toEqual([...DISPLAY_IDS].sort())
		expect(new Set(Object.values(DISPLAY_ICONS)).size).toBe(DISPLAY_IDS.length)
		for (const markup of Object.values(DISPLAY_ICONS)) {
			const template = document.createElement('template')
			template.innerHTML = markup
			expect(template.content.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 24 24')
		}
	})

	test('rich display options include decorative icons and preserve selection when refreshed', () => {
		document.body.innerHTML = '<label for="select-display"><select id="select-display"></select></label>'
		const selected = 'DisplayBabylon3D'
		const select = createDisplayOptions(DISPLAY_IDS, selected)
		expect(select.querySelector('button > selectedcontent')).not.toBeNull()
		for (const option of select.options) {
			expect(option.querySelector('.option-icon[aria-hidden="true"] svg')).not.toBeNull()
			expect(option.textContent).toBe(DISPLAY_LABELS[option.value])
		}
		createDisplayOptions(DISPLAY_IDS, selected)
		expect(select.value).toBe(selected)
		expect(select.querySelectorAll('button')).toHaveLength(1)
		expect(select.options).toHaveLength(DISPLAY_IDS.length)
	})

	test('control panel tiles get no selected content trigger', () => {
		document.body.innerHTML = '<menu class="controls"><label for="select-display"><select id="select-display"></select></label></menu>'
		const select = createDisplayOptions(DISPLAY_IDS, DISPLAY_IDS[0])
		expect(select.querySelector('button')).toBeNull()
		expect(select.querySelector('option svg')).not.toBeNull()
	})

	test('native selects keep all mode captions readable without SVG markup', () => {
		document.body.innerHTML = '<select id="select-display" data-native-select></select>'
		const select = createDisplayOptions(DISPLAY_IDS, DISPLAY_IDS[0])
		expect(select.querySelector('svg, button')).toBeNull()
		expect(Array.from(select.options, option => option.textContent)).toEqual(DISPLAY_IDS.map(id => DISPLAY_LABELS[id]))
	})
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

	test('populate advanced Composite layers with saved selections and accurate captions', () => {
		document.body.innerHTML = `
			<label for="select-display"><select id="select-display"></select></label>
			<label for="select-composite-displays" data-advanced-mode-only hidden>
				<select id="select-composite-displays" multiple data-native-select></select>
			</label>
			<label for="select-composite-layout" hidden><select id="select-composite-layout"><option value="layers">Layered</option><option value="grid">Grid</option></select></label>
		`
		jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
		createDisplayOptions(['DisplayComposite', 'DisplayMediaVision2D'], 'DisplayComposite', ['DisplayCanvas2D', 'DisplayMediaVision2D'], 'grid')
		const layers = document.getElementById('select-composite-displays')
		expect(layers.parentElement.hidden).toBe(false)
		expect(document.getElementById('select-composite-layout').value).toBe('grid')
		expect(document.getElementById('select-composite-layout').parentElement.hidden).toBe(false)
		expect(Array.from(layers.selectedOptions, option => option.value)).toEqual(['DisplayCanvas2D', 'DisplayMediaVision2D'])
		expect(document.querySelector('#select-display option').textContent).toBe('Multiple views')
		createDisplayOptions(['DisplayMediaVision2D'], 'DisplayMediaVision2D', [])
		expect(layers.parentElement.hidden).toBe(true)
		expect(document.getElementById('select-composite-layout').parentElement.hidden).toBe(true)
		jest.restoreAllMocks()
	})
})
