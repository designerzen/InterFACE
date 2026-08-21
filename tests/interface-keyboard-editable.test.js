let addKeyboardEvents

beforeAll(async () => {
	;({ addKeyboardEvents } = await import('../source/interface-keyboard.js'))
})

describe('keyboard editing safeguards', () => {
	test('does not cancel or intercept numbers typed into the BPM input', () => {
		document.body.innerHTML = '<input id="tempo-input-text" type="number">'
		const application = {
			clock: { BPM: 120 },
			setBPM: jest.fn(),
			setInputStatus: jest.fn(),
			getAudioContext: jest.fn(() => ({})),
			getMasterMixdown: jest.fn(() => ({})),
			loadAudioSample: jest.fn(),
			playAudioSample: jest.fn(),
		}
		addKeyboardEvents(application)

		const input = document.getElementById('tempo-input-text')
		const event = new KeyboardEvent('keydown', {
			key: '1',
			code: 'Digit1',
			bubbles: true,
			cancelable: true,
		})
		input.dispatchEvent(event)

		expect(event.defaultPrevented).toBe(false)
		expect(application.setBPM).not.toHaveBeenCalled()
	})
})
