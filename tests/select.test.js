import { connectReverbControls, connectSelect, populateSelect } from '../source/dom/select.js'

describe('optional selects', () => {
	test('are safely ignored when the control is not rendered', () => {
		document.body.innerHTML = ''

		expect(connectSelect('missing-select')).toBeNull()
		expect(populateSelect('missing-select', [])).toBeNull()
		expect(connectReverbControls()).toBeNull()
	})
})
