import { createInputStatusOverlay } from '../source/dom/ui.input-status.js'

describe('input status HUD', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<aside id="input-status-overlay" hidden>
				<ul id="input-status-list"></ul>
			</aside>
		`
	})

	test('provides readable status details on a focusable HUD row', () => {
		const overlay = createInputStatusOverlay(document.getElementById('input-status-list'))

		overlay.setDeviceStatus('controller', {
			type: 'gamepad',
			label: 'Adaptive Controller',
			detail: 'Connected on input 2',
		})

		const row = document.querySelector('.input-status-row')
		const tooltipLabel = document.getElementById(row.getAttribute('aria-labelledby'))
		const tooltipBody = document.getElementById(row.getAttribute('aria-describedby'))
		const tooltipDetail = tooltipBody.querySelector('.input-status-tooltip-detail')
		const tooltip = tooltipLabel.closest('[role="tooltip"]')

		expect(row.tabIndex).toBe(0)
		expect(row.title).toBe('')
		expect(tooltip.getAttribute('role')).toBe('tooltip')
		expect(tooltipLabel.textContent).toBe('Adaptive Controller')
		expect(tooltipDetail.textContent).toBe('Connected on input 2')
	})

	test('renders structured connection details in a definition list', () => {
		const overlay = createInputStatusOverlay(document.getElementById('input-status-list'))
		overlay.setDeviceStatus('midi-output', {
			type: 'midi',
			label: 'Synth Port',
			detail: 'Output · All channels · 2 people',
			tooltipDetails: [
				{ label: 'Channels', value: 'All channels (1–16)' },
				{ label: 'Person 1', value: 'Person 1 → Synth Port' },
			],
		})

		const details = document.querySelector('.input-status-tooltip-details')
		expect(details.hidden).toBe(false)
		expect(Array.from(details.querySelectorAll('dt'), element => element.textContent)).toEqual(['Channels', 'Person 1'])
		expect(Array.from(details.querySelectorAll('dd'), element => element.textContent)).toEqual([
			'All channels (1–16)',
			'Person 1 → Synth Port',
		])
	})

	test('allows the tooltip to be dismissed with Escape until focus or hover leaves', () => {
		const overlay = createInputStatusOverlay(document.getElementById('input-status-list'))
		overlay.setDeviceStatus('keyboard', { label: 'Keyboard', detail: 'Ready' })
		const row = document.querySelector('.input-status-row')

		row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
		expect(row.classList.contains('is-tooltip-dismissed')).toBe(true)

		row.dispatchEvent(new Event('blur'))
		expect(row.classList.contains('is-tooltip-dismissed')).toBe(false)
	})
})
