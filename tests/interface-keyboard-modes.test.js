let addKeyboardEvents

beforeAll(async () => {
	;({ addKeyboardEvents } = await import('../source/interface-keyboard.js'))
})

const dispatchKey = (type, options) => {
	const event = new KeyboardEvent(type, { bubbles: true, cancelable: true, ...options })
	window.dispatchEvent(event)
	return event
}

const createApplication = () => {
	const instrument = { noteOn: jest.fn(), noteOff: jest.fn() }
	const source = { stop: jest.fn() }
	return {
		instrument,
		clock: { BPM: 120 },
		personManager: { getSelectedPerson: () => ({ activeInstrument: instrument }) },
		setFeedback: jest.fn(),
		setInputStatus: jest.fn(),
		setPercussionInput: jest.fn(),
		releasePercussionInputs: jest.fn(),
		getAudioContext: jest.fn(() => ({})),
		getMasterMixdown: jest.fn(() => ({})),
		loadAudioSample: jest.fn(async () => ({})),
		playAudioSample: jest.fn(() => source),
		kit: { cowbell: jest.fn() },
	}
}

describe('keyboard performance modes', () => {
	test('keeps note and chord voices held until their physical key is released', () => {
		document.body.innerHTML = `
			<select id="select-keyboard-mode">
				<option value="operational">Operational</option>
				<option value="notes">Notes</option>
				<option value="notes-high">Notes +1 Octave</option>
				<option value="chords">Chords</option>
				<option value="percussion">Percussion</option>
				<option value="samples">Samples</option>
			</select>
		`
		const application = createApplication()
		addKeyboardEvents(application)

		const modeSelect = document.getElementById('select-keyboard-mode')
		modeSelect.value = 'notes'
		modeSelect.dispatchEvent(new Event('input', { bubbles: true }))
		dispatchKey('keydown', { key: 'q', code: 'KeyQ' })

		expect(application.instrument.noteOn).toHaveBeenCalledWith(48, 1)
		expect(application.instrument.noteOff).not.toHaveBeenCalled()

		dispatchKey('keyup', { key: 'q', code: 'KeyQ' })
		expect(application.instrument.noteOff).toHaveBeenCalledWith(48, 0)

		modeSelect.value = 'chords'
		modeSelect.dispatchEvent(new Event('input', { bubbles: true }))
		application.instrument.noteOn.mockClear()
		application.instrument.noteOff.mockClear()
		dispatchKey('keydown', { key: 'q', code: 'KeyQ' })

		expect(application.instrument.noteOn.mock.calls.map(([note]) => note)).toEqual([48, 52, 55])
		expect(application.instrument.noteOff).not.toHaveBeenCalled()

		dispatchKey('keyup', { key: 'q', code: 'KeyQ' })
		expect(application.instrument.noteOff.mock.calls.map(([note]) => note)).toEqual([48, 52, 55])
	})

	test('plays samples on number keys in operational mode and uses notes for number keys in notes mode', async () => {
		document.body.innerHTML = `
			<label for="button-quantise">Quantise
				<input id="button-quantise" type="checkbox">
			</label>
			<label for="select-keyboard-mode">Keyboard Mode</label>
			<select id="select-keyboard-mode">
				<option value="operational">Operational</option>
				<option value="notes">Notes</option>
				<option value="notes-high">Notes +1 Octave</option>
				<option value="chords">Chords</option>
				<option value="percussion">Percussion</option>
				<option value="samples">Samples</option>
			</select>
		`
		const application = createApplication()
		addKeyboardEvents(application)
		const quantise = document.getElementById('button-quantise')
		expect(quantise.dataset.keyboardShortcut).toBe('Q')
		expect(quantise.parentElement.querySelector('kbd.keyboard-shortcut').textContent).toBe('Q')

		dispatchKey('keydown', { key: '2', code: 'Digit2' })
		dispatchKey('keyup', { key: '2', code: 'Digit2' })
		await Promise.resolve()
		await Promise.resolve()
		expect(application.loadAudioSample).toHaveBeenCalledTimes(1)
		expect(application.instrument.noteOn).not.toHaveBeenCalled()

		dispatchKey('keydown', { key: 'PageDown', code: 'PageDown' })
		dispatchKey('keyup', { key: 'PageDown', code: 'PageDown' })
		expect(application.setFeedback).toHaveBeenCalledWith('Keyboard mode: Notes', 0, 'keyboard')
		expect(document.getElementById('select-keyboard-mode').value).toBe('notes')

		dispatchKey('keydown', { key: '2', code: 'Digit2' })
		dispatchKey('keyup', { key: '2', code: 'Digit2' })
		dispatchKey('keydown', { key: 'q', code: 'KeyQ' })
		dispatchKey('keyup', { key: 'q', code: 'KeyQ' })
		await Promise.resolve()
		await Promise.resolve()
		expect(application.loadAudioSample).toHaveBeenCalledTimes(1)
		expect(application.instrument.noteOn).toHaveBeenLastCalledWith(48, 1)
		expect(application.instrument.noteOff).toHaveBeenLastCalledWith(48, 0)

		const modeSelect = document.getElementById('select-keyboard-mode')
		modeSelect.value = 'chords'
		modeSelect.dispatchEvent(new Event('input', { bubbles: true }))
		expect(application.setFeedback).toHaveBeenCalledWith('Keyboard mode: Chords', 0, 'keyboard')

		application.instrument.noteOn.mockClear()
		dispatchKey('keydown', { key: 'q', code: 'KeyQ' })
		expect(application.instrument.noteOn.mock.calls.map(([note]) => note)).toEqual([48, 52, 55])
		dispatchKey('keyup', { key: 'q', code: 'KeyQ' })

		for (let index = 0; index < 3; index++) {
			dispatchKey('keydown', { key: 'PageDown', code: 'PageDown' })
			dispatchKey('keyup', { key: 'PageDown', code: 'PageDown' })
		}
		dispatchKey('keydown', { key: 'q', code: 'KeyQ' })
		expect(document.documentElement.classList.contains('keyboard-input-active')).toBe(true)
		expect(quantise.checked).toBe(true)
		dispatchKey('keyup', { key: 'q', code: 'KeyQ' })
		expect(document.documentElement.classList.contains('keyboard-input-active')).toBe(false)
	})

	test('default mode only selects modes and has no legacy cowbell shortcut', () => {
		const application = createApplication()
		addKeyboardEvents(application)
		dispatchKey('keydown', { key: 'w', code: 'KeyW' })
		dispatchKey('keyup', { key: 'w', code: 'KeyW' })
		expect(application.kit.cowbell).not.toHaveBeenCalled()
		expect(application.setInputStatus).toHaveBeenCalledWith(
			'keyboard',
			expect.objectContaining({ detail: expect.stringContaining('Operational') }),
		)
	})

	test('opens and illuminates the on-screen keyboard when a mapped control is unavailable', () => {
		document.body.innerHTML = `
			<dialog id="keyboard-guide">
				<p class="keyboard-guide-current"></p>
				<button data-keyboard-mode="0"></button>
				<button data-keyboard-mode="1"></button>
				<div id="keyboard-guide-keys"></div>
			</dialog>
		`
		const application = createApplication()
		addKeyboardEvents(application)
		dispatchKey('keydown', { key: 'w', code: 'KeyW' })
		const dialog = document.getElementById('keyboard-guide')
		const key = dialog.querySelector('[data-code="KeyW"]')
		expect(dialog.open).toBe(true)
		expect(dialog.querySelectorAll('.keyboard-row')).toHaveLength(7)
		expect(dialog.querySelector('[data-code="Digit1"] .keyboard-key-action').textContent).toBe('Applause')
		expect(key.querySelector('.keyboard-key-action').textContent).toBe('Brows')
		expect(key.classList.contains('is-pressed')).toBe(true)
		dispatchKey('keyup', { key: 'w', code: 'KeyW' })
		expect(key.classList.contains('is-pressed')).toBe(false)
	})

	test('does not open the keyboard guide for modifier-only keys', () => {
		document.body.innerHTML = `
			<dialog id="keyboard-guide">
				<p class="keyboard-guide-current"></p>
				<div id="keyboard-guide-keys"></div>
			</dialog>
		`
		addKeyboardEvents(createApplication())

		for (const [key, code] of [
			['Shift', 'ShiftLeft'],
			['Control', 'ControlLeft'],
			['Alt', 'AltLeft'],
			['Meta', 'MetaLeft'],
		]) {
			dispatchKey('keydown', { key, code })
			expect(document.getElementById('keyboard-guide').open).toBe(false)
			dispatchKey('keyup', { key, code })
		}
	})
})
