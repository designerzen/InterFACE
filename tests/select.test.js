import { connectReverbControls, connectSelect, enhanceSelect, populateSelect } from '../source/dom/select.js'
import { optionLabel } from '../source/dom/option-label.js'

describe('optional selects', () => {
	test('are safely ignored when the control is not rendered', () => {
		document.body.innerHTML = ''

		expect(connectSelect('missing-select')).toBeNull()
		expect(populateSelect('missing-select', [])).toBeNull()
		expect(connectReverbControls()).toBeNull()
	})
})

describe('rich options', () => {
	test('group names survive for browsers that ignore legends', () => {
		const select = populateSelect(document.createElement('select'), [{ group:'Slow', items:[{ value:'60', label:'60', detail:'BPM' }] }])
		expect(select.querySelector('optgroup').label).toBe('Slow')
		expect(select.querySelector('legend').textContent).toBe('Slow')
	})

	test('text only browsers can read label and detail as separate words', () => {
		const select = populateSelect(document.createElement('select'), [{ value:'60', label:'60', detail:'BPM' }])
		expect(select.options[0].text).toBe('60 BPM')
	})

	test('labels exclude icons and details, and fall back to plain text', () => {
		const select = populateSelect(document.createElement('select'), [{ value:'a', label:'Front', icon:'📷', detail:'HD' }])
		expect(optionLabel(select.options[0])).toBe('Front')
		expect(optionLabel(new Option(' Plain '))).toBe('Plain')
		expect(optionLabel(undefined)).toBe('')
	})
	test('markup options gain their icons, swatches and details at runtime', () => {
		document.body.innerHTML = `<select>
			<optgroup label="Common" data-icon="<svg></svg>"><option value="a" data-detail="BPM" selected>60</option></optgroup>
			<option value="b" data-swatch="red">Red</option>
			<option value="c">Plain</option>
		</select>`
		const select = enhanceSelect(document.querySelector('select'))
		enhanceSelect(select)
		expect(select.querySelectorAll('legend')).toHaveLength(1)
		expect(select.querySelector('legend svg')).not.toBeNull()
		expect(select.options[0].text).toBe('60 BPM')
		expect(select.value).toBe('a')
		expect(select.options[1].querySelector('.option-swatch').style.getPropertyValue('--swatch')).toBe('red')
		expect(optionLabel(select.options[1])).toBe('Red')
		expect(select.options[2].children).toHaveLength(0)
	})

	test('native selects keep their text options', () => {
		document.body.innerHTML = '<select data-native-select><option data-detail="BPM">60</option></select>'
		expect(enhanceSelect(document.querySelector('select')).options[0].children).toHaveLength(0)
	})
})
