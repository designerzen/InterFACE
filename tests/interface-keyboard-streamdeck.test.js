let addKeyboardEvents

beforeAll(async () => {
	;({ addKeyboardEvents } = await import('../source/interface-keyboard.js'))
})

const dispatchStreamDeckKey = async ({ code, key, shiftKey = true }) => {
	const event = new KeyboardEvent('keydown', {
		bubbles: true,
		cancelable: true,
		code,
		key,
		ctrlKey: true,
		altKey: true,
		shiftKey,
	})
	window.dispatchEvent(event)
	await Promise.resolve()
	return event
}

const dispatchDirectStreamDeckKey = async (code, type = 'keydown') => {
	const event = new KeyboardEvent(type, {
		bubbles: true,
		cancelable: true,
		code,
		key: code,
	})
	window.dispatchEvent(event)
	await Promise.resolve()
	return event
}

describe('Stream Deck shortcuts', () => {
	test('use deterministic modes, activate visible controls, and report HUD state', async () => {
		document.body.innerHTML = `
			<label><input id="button-quantise" type="checkbox">Quantise</label>
			<label><input id="button-record-audio" type="checkbox">Record</label>
		`
		const quantise = document.getElementById('button-quantise')
		const instrument = { noteOn: jest.fn(), noteOff: jest.fn() }
		const application = {
			clock: { BPM: 120 },
			personManager: {
				getSelectedPerson: () => ({ activeInstrument: instrument }),
			},
			setFeedback: jest.fn(),
			setInputStatus: jest.fn(),
			setBPM: jest.fn(),
			getAudioContext: jest.fn(() => ({})),
			getMasterMixdown: jest.fn(() => ({})),
			loadAudioSample: jest.fn(async () => ({})),
			playAudioSample: jest.fn(() => ({ stop: jest.fn() })),
		}
		addKeyboardEvents(application)

		const notesModeEvent = await dispatchDirectStreamDeckKey('F14')
		expect(notesModeEvent.defaultPrevented).toBe(true)
		expect(application.setFeedback).toHaveBeenCalledWith(
			'Keyboard mode: Notes',
			0,
			'keyboard',
		)
		expect(application.setInputStatus).toHaveBeenCalledWith(
			'streamdeck',
			expect.objectContaining({ detail: 'Notes', active: true }),
		)

		const notesModeRelease = await dispatchDirectStreamDeckKey('F14', 'keyup')
		expect(notesModeRelease.defaultPrevented).toBe(true)
		expect(application.setInputStatus).toHaveBeenCalledWith(
			'streamdeck',
			expect.objectContaining({ detail: 'Notes', active: false }),
		)

		await dispatchDirectStreamDeckKey('F18')
		expect(application.setFeedback).toHaveBeenCalledWith(
			'Keyboard mode: Samples',
			0,
			'keyboard',
		)

		const quantiseEvent = await dispatchStreamDeckKey({ code: 'KeyG', key: 'G' })
		expect(quantiseEvent.defaultPrevented).toBe(true)
		expect(quantise.checked).toBe(true)
		expect(application.setInputStatus).toHaveBeenCalledWith(
			'streamdeck',
			expect.objectContaining({
				label: 'Stream Deck',
				detail: 'Quantise',
				active: true,
			}),
		)

		await dispatchStreamDeckKey({ code: 'Digit4', key: '4' })
		window.dispatchEvent(new KeyboardEvent('keydown', {
			bubbles: true,
			code: 'Digit1',
			key: '1',
		}))
		await Promise.resolve()
		await Promise.resolve()
		expect(instrument.noteOn).toHaveBeenCalled()
		expect(application.setFeedback).toHaveBeenCalledWith(
			'Keyboard mode: Chords',
			0,
			'keyboard',
		)

		await dispatchStreamDeckKey({ code: 'KeyC', key: 'c', shiftKey: false })
		expect(document.getElementById('button-record-audio').checked).toBe(true)
	})

	test('player commands use their separate reserved chord', async () => {
		document.body.innerHTML = ''
		const application = {
			clock: { BPM: 120 },
			selectPerson: jest.fn(),
			setInputStatus: jest.fn(),
			getAudioContext: jest.fn(() => ({})),
			getMasterMixdown: jest.fn(() => ({})),
			loadAudioSample: jest.fn(async () => ({})),
			playAudioSample: jest.fn(() => ({ stop: jest.fn() })),
		}
		addKeyboardEvents(application)

		await dispatchStreamDeckKey({ code: 'Digit3', key: '3', shiftKey: false })
		expect(application.selectPerson).toHaveBeenCalledWith(2)
		expect(application.setInputStatus).toHaveBeenCalledWith(
			'streamdeck',
			expect.objectContaining({ detail: 'Select Player 3' }),
		)
	})
})
