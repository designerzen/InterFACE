import { setupCommandPalette } from '../source/dom/command-palette.js'

const setupDOM = () => {
	document.body.innerHTML = `
		<button id="button-command-palette">Commands</button>
		<dialog id="command-palette">
			<form method="dialog">
				<input id="command-palette-search">
				<div id="command-palette-results"></div>
				<p class="command-palette-empty" hidden></p>
			</form>
		</dialog>
		<dialog id="help"></dialog>
		<input id="button-settings" type="checkbox">
		<select id="select-camera"><option>Camera</option></select>
		<select id="select-percussion-preset"><option>Random</option></select>
		<input id="volume-input-range" type="range">
		<input id="tempo-input-text" type="number">
		<input id="button-record-audio" type="checkbox">
		<input id="toggle-midi" type="checkbox">
		<fieldset id="face-buttons"></fieldset>
		<input id="button-percussion" type="checkbox">
		<input id="button-quantise" type="checkbox">
		<input id="button-metronome" type="checkbox">
		<input id="button-disco" type="checkbox">
		<input id="button-spectrogram" type="checkbox">
		<input id="button-mute" type="checkbox">
		<input id="button-fullscreen" type="checkbox">
	`
	const dialog = document.getElementById('command-palette')
	dialog.showModal = jest.fn(() => { dialog.open = true })
	dialog.close = jest.fn(() => {
		dialog.open = false
		dialog.dispatchEvent(new Event('close'))
	})
	document.getElementById('help').showModal = jest.fn()
	return dialog
}

describe('command palette', () => {
	test('opens from Ctrl+K and lists navigation and toggle actions', () => {
		const dialog = setupDOM()
		setupCommandPalette(document)

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))

		expect(dialog.showModal).toHaveBeenCalledTimes(1)
		expect(document.getElementById('command-palette-results').textContent).toContain('Open Settings')
		expect(document.getElementById('command-palette-results').textContent).toContain('Turn on Beats')
		expect(document.getElementById('command-palette-results').textContent).toContain('Turn off Beats')
	})

	test('filters commands and runs the selected control through its native click', () => {
		setupDOM()
		setupCommandPalette(document)
		document.getElementById('button-command-palette').click()
		const input = document.getElementById('command-palette-search')
		const percussion = document.getElementById('button-percussion')
		const clickListener = jest.fn()
		percussion.addEventListener('click', clickListener)

		input.value = 'turn on percussion'
		input.dispatchEvent(new Event('input', { bubbles: true }))
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

		expect(percussion.checked).toBe(true)
		expect(clickListener).toHaveBeenCalledTimes(1)
	})

	test('uses arrow keys to select another matching command', () => {
		setupDOM()
		setupCommandPalette(document)
		document.getElementById('button-command-palette').click()
		const input = document.getElementById('command-palette-search')

		input.value = 'beats'
		input.dispatchEvent(new Event('input', { bubbles: true }))
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

		const selected = document.querySelector('[role="option"][aria-selected="true"]')
		expect(selected.textContent).toContain('Turn on Beats')
	})

	test('opens the percussion panel before focusing its preset selector', () => {
		setupDOM()
		const { commands } = setupCommandPalette(document)
		const settings = document.getElementById('button-settings')
		const percussion = document.getElementById('button-percussion')
		settings.checked = true

		commands.find(command => command.label === 'Open Beats and Drumkit').run()

		expect(settings.checked).toBe(false)
		expect(percussion.checked).toBe(true)
		expect(window.location.hash).toBe('#percussion-settings')
	})
})
