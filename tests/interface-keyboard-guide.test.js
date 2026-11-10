import { addKeyboardEvents } from '../source/interface-keyboard.js'
import { OPERATIONAL_SHORTCUTS } from '../source/hardware/keyboard/keyboard-shortcuts.js'

const key = (type, options) => window.dispatchEvent(new KeyboardEvent(type, { bubbles: true, cancelable: true, ...options }))
let listeners
let addListener
beforeEach(() => {
	listeners = []
	addListener = window.addEventListener.bind(window)
	jest.spyOn(window, 'addEventListener').mockImplementation((...args) => {
		listeners.push(args)
		addListener(...args)
	})
})
afterEach(() => {
	for (const [type, listener, options] of listeners) window.removeEventListener(type, listener, options)
	jest.restoreAllMocks()
})
const setup = () => {
	document.body.innerHTML = `
		<label for="select-mtv">MTV<select id="select-mtv"><option>Off</option></select></label>
		<input id="button-disco" type="checkbox" hidden>
		${OPERATIONAL_SHORTCUTS.filter(s => s.controlId !== 'button-disco').map(s => `<label for="${s.controlId}">${s.label}<input id="${s.controlId}" type="checkbox"></label>`).join('')}
		<button id="button-keyboard-guide">Keyboard guide</button>
		<dialog id="keyboard-guide">
			<p class="keyboard-guide-current"></p>
			<p id="keyboard-guide-description"></p>
			<p class="keyboard-guide-feedback"></p>
			${Array.from({ length: 6 }, (_, index) => `<button data-keyboard-mode="${index}"></button>`).join('')}
			<button data-keyboard-shift></button>
			<div id="keyboard-guide-keys"></div>
		</dialog>`
	const instrument = { noteOn: jest.fn(), noteOff: jest.fn() }
	const application = {
		personManager: { getSelectedPerson: () => ({ activeInstrument: instrument }) },
		getAudioContext: () => ({}), getMasterMixdown: () => ({}),
		loadAudioSample: jest.fn(async () => ({})), playAudioSample: jest.fn(() => ({ stop: jest.fn() })),
		setPercussionInput: jest.fn(), releasePercussionInputs: jest.fn(),
		setFeedback: jest.fn(), setInputStatus: jest.fn(),
	}
	const dialog = document.getElementById('keyboard-guide')
	dialog.showModal = () => { dialog.open = true }
	dialog.close = () => { dialog.open = false; dialog.dispatchEvent(new Event('close')) }
	addKeyboardEvents(application)
	return { dialog, application, instrument }
}

test('every registered action exposes its shortcut on the visible control', () => {
	setup()
	for (const shortcut of OPERATIONAL_SHORTCUTS) {
		const control = document.getElementById(shortcut.controlId)
		const label = document.querySelector(`label[for="${shortcut.hintControlId ?? shortcut.controlId}"]`)
		expect(label.querySelector('kbd').textContent).toBe(shortcut.display.replace('Shift ', 'Shift + '))
		expect(control.getAttribute('aria-keyshortcuts')).toBe(shortcut.display.replace(' ', '+'))
		expect(control.title).toContain('App shortcuts mode, F1')
	}
})

test('all chord tiles have readable names and feedback identifies the notes played', () => {
	const { dialog, instrument } = setup()
	key('keydown', { key: 'F4', code: 'F4' })
	const tiles = dialog.querySelectorAll('.keyboard-key')
	expect(tiles).toHaveLength(36)
	for (const tile of tiles) expect(tile.textContent).toMatch(/major|minor/)
	key('keydown', { key: 'e', code: 'KeyE' })
	expect(instrument.noteOn.mock.calls.map(([note]) => note)).toEqual([57, 60, 64])
	expect(dialog.querySelector('.keyboard-guide-feedback').textContent).toContain('Am · A3–C4–E4')
	expect(dialog.querySelector('[data-code="KeyE"]').classList.contains('is-pressed')).toBe(true)
	key('keyup', { key: 'e', code: 'KeyE' })
})

test('number-row note labels match actual pitches, including octave changes', () => {
	const { dialog, instrument } = setup()
	key('keydown', { key: 'F2', code: 'F2' })
	for (const [digit, label, pitch] of [['1', 'C3', 48], ['2', 'D3', 50], ['0', 'E4', 64]]) {
		expect(dialog.querySelector(`[data-code="Digit${digit}"] .keyboard-key-action`).textContent).toBe(label)
		key('keydown', { key: digit, code: `Digit${digit}` })
		expect(instrument.noteOn).toHaveBeenLastCalledWith(pitch, 1)
		key('keyup', { key: digit, code: `Digit${digit}` })
	}
	key('keydown', { key: 'PageUp', code: 'PageUp', shiftKey: true })
	expect(dialog.querySelector('[data-code="Digit2"] .keyboard-key-action').textContent).toBe('D4')
})

test('the Shift layer shows alternate actions and clicks trigger that layer', () => {
	const { dialog } = setup()
	dialog.querySelector('[data-keyboard-shift]').click()
	expect(dialog.querySelector('[data-code="KeyM"] .keyboard-key-action').textContent).toBe('Mute')
	dialog.querySelector('[data-code="KeyM"]').click()
	expect(document.getElementById('button-mute').checked).toBe(true)
	key('keydown', { key: 'F5', code: 'F5' })
	expect(dialog.querySelector('[data-code="KeyQ"] .keyboard-key-action').textContent).toBe('Rimshot')
	key('keyup', { key: 'Shift', code: 'ShiftLeft' })
	expect(dialog.querySelector('[data-code="KeyQ"] .keyboard-key-action').textContent).toBe('Sub Kick')
})

test('pointer presses sustain notes and cancellation releases them', () => {
	const { dialog, instrument } = setup()
	key('keydown', { key: 'F2', code: 'F2' })
	const tile = dialog.querySelector('[data-code="KeyQ"]')
	tile.dispatchEvent(new MouseEvent('pointerdown', { button: 0, bubbles: true, cancelable: true }))
	expect(instrument.noteOn).toHaveBeenCalledWith(48, 1)
	expect(instrument.noteOff).not.toHaveBeenCalled()
	tile.dispatchEvent(new MouseEvent('pointercancel', { bubbles: true }))
	expect(instrument.noteOff).toHaveBeenCalledWith(48, 0)
})

test('pointer down plays a chord immediately and releasing does not retrigger it', () => {
	const { dialog, instrument } = setup()
	const modeButton = dialog.querySelector('[data-keyboard-mode="3"]')
	modeButton.dispatchEvent(new MouseEvent('pointerdown', { button: 0, bubbles: true, cancelable: true }))
	expect(modeButton.getAttribute('aria-pressed')).toBe('true')
	const tile = dialog.querySelector('[data-code="KeyE"]')
	tile.dispatchEvent(new MouseEvent('pointerdown', { button: 0, bubbles: true, cancelable: true }))
	expect(instrument.noteOn.mock.calls.map(([note]) => note)).toEqual([57, 60, 64])
	expect(instrument.noteOff).not.toHaveBeenCalled()
	tile.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
	tile.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
	expect(instrument.noteOn).toHaveBeenCalledTimes(3)
	expect(instrument.noteOff.mock.calls.map(([note]) => note)).toEqual([57, 60, 64])
})

test('the Shift layer activates on pointer down without toggling again on click', () => {
	const { dialog } = setup()
	const shift = dialog.querySelector('[data-keyboard-shift]')
	shift.dispatchEvent(new MouseEvent('pointerdown', { button: 0, bubbles: true, cancelable: true }))
	expect(shift.getAttribute('aria-pressed')).toBe('true')
	shift.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
	shift.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
	expect(shift.getAttribute('aria-pressed')).toBe('true')
})

test('Space toggles a persistent guide, Escape closes it, and Enter swaps instruments', () => {
	const { dialog } = setup()
	key('keydown', { key: ' ', code: 'Space' })
	key('keyup', { key: ' ', code: 'Space' })
	expect(dialog.open).toBe(true)
	key('keydown', { key: ' ', code: 'Space', repeat: true })
	expect(dialog.open).toBe(true)
	key('keydown', { key: 'Escape', code: 'Escape' })
	expect(dialog.open).toBe(false)
	key('keydown', { key: 'Enter', code: 'Enter' })
	expect(document.getElementById('button-video').checked).toBe(true)
})

test('browser modifier shortcuts and native button activation do not run app shortcuts', () => {
	setup()
	key('keydown', { key: 'k', code: 'KeyK', ctrlKey: true })
	expect(document.getElementById('button-toggle-overlay').checked).toBe(false)
	const button = document.getElementById('button-keyboard-guide')
	const event = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true })
	button.dispatchEvent(event)
	expect(event.defaultPrevented).toBe(false)
	expect(document.getElementById('button-video').checked).toBe(false)
})

test('other dialogs retain native Escape dismissal and sliders retain arrow controls', () => {
	setup()
	const help = document.createElement('dialog')
	help.open = true
	help.innerHTML = '<button class="button-close">Close</button>'
	document.body.append(help)
	const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
	help.querySelector('button').dispatchEvent(escape)
	expect(escape.defaultPrevented).toBe(false)
	const slider = document.createElement('input')
	slider.type = 'range'
	document.body.append(slider)
	const arrow = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
	slider.dispatchEvent(arrow)
	expect(arrow.defaultPrevented).toBe(false)
})
