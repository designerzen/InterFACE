let createCosmosKeyboardHandler

beforeAll(async () => {
	;({ createCosmosKeyboardHandler } = await import('../source/interface-cosmos.js'))
})

const createPlayer = () => ({
	bank: { id: 'magic', label: 'Magic' },
	getSample: jest.fn(index => ({ label: `Sound ${index}` })),
	trigger: jest.fn(async () => null),
	release: jest.fn(),
	previousBank: jest.fn(function() {
		this.bank = { id: 'coins', label: 'Coins' }
		return this.bank
	}),
	nextBank: jest.fn(function() {
		this.bank = { id: 'gated', label: 'Gated' }
		return this.bank
	}),
})

const createApplication = () => ({
	setFeedback: jest.fn(),
	setInputStatus: jest.fn(),
})

describe('Cosmo keyboard interface', () => {
	test('maps number keys 1–9 to the default popular sound bank', async () => {
		const source = { stop: jest.fn() }
		const sampleOutput = {}
		const application = {
			...createApplication(),
			getAudioContext: jest.fn(() => ({})),
			getMasterMixdown: jest.fn(() => ({})),
			getSampleOutput: jest.fn(() => sampleOutput),
			resumeAudio: jest.fn(),
			loadAudioSample: jest.fn(async (_context, src) => src),
			playAudioSample: jest.fn(() => source),
		}
		const handle = createCosmosKeyboardHandler(application)
		const filenames = [
			'anime-wow-sound-effect.mp3',
			'applause-4.mp3',
			'ba-dum-tss_87uziQL.mp3',
			'dragon-studio-air-horn-sound-effect-372453.mp3',
			'dragon-studio-thud-sound-effect-405470.mp3',
			'freesound_community-good-6081.mp3',
			'freesound_community-wah-wah-sad-trombone-6347.mp3',
			'pop_7e9Is8L.mp3',
			'roblox-death-sound_1.mp3',
		]

		filenames.forEach((_filename, offset) => {
			const key = String(offset + 1)
			handle({ type: 'keydown', key, code: `Digit${key}`, repeat: false })
			handle({ type: 'keyup', key, code: `Digit${key}` })
		})
		await new Promise(resolve => setTimeout(resolve, 0))

		expect(application.loadAudioSample).toHaveBeenCalledTimes(filenames.length)
		expect(application.playAudioSample).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			0,
			sampleOutput,
			expect.anything(),
			expect.any(Function),
		)
		filenames.forEach((filename, index) => {
			expect(application.loadAudioSample).toHaveBeenNthCalledWith(
				index + 1,
				expect.anything(),
				`./assets/audio/fx/meme/${filename}`,
				{},
			)
		})
	})

	test('normalises shifted number-row and numpad events', () => {
		const player = createPlayer()
		const application = createApplication()
		const handle = createCosmosKeyboardHandler(application, { player })

		expect(handle({
			type: 'keydown',
			key: '!',
			code: 'Digit1',
			shiftKey: true,
			repeat: false,
		})).toBe(true)
		expect(handle({
			type: 'keyup',
			key: '1',
			code: 'Digit1',
		})).toBe(true)
		expect(handle({
			type: 'keydown',
			key: '8',
			code: 'Numpad8',
			repeat: false,
		})).toBe(true)
		expect(handle({
			type: 'keydown',
			key: '£',
			code: 'Unidentified',
			shiftKey: true,
			repeat: false,
		})).toBe(true)

		expect(player.trigger).toHaveBeenNthCalledWith(1, 1)
		expect(player.release).toHaveBeenNthCalledWith(1, 1)
		expect(player.trigger).toHaveBeenNthCalledWith(2, 8)
		expect(player.trigger).toHaveBeenNthCalledWith(3, 3)
	})

	test('ignores repeats and does not claim unmatched releases', () => {
		const player = createPlayer()
		const handle = createCosmosKeyboardHandler(createApplication(), { player })

		expect(handle({
			type: 'keydown',
			key: '3',
			code: 'Digit3',
			repeat: false,
		})).toBe(true)
		expect(handle({
			type: 'keydown',
			key: '#',
			code: 'Digit3',
			repeat: true,
		})).toBe(true)
		expect(handle({
			type: 'keyup',
			key: '4',
			code: 'Digit4',
		})).toBe(false)

		expect(player.trigger).toHaveBeenCalledTimes(1)
		expect(player.release).not.toHaveBeenCalled()
	})

	test('calls switch hooks once for each physical press and release', () => {
		const player = createPlayer()
		const onSwitchDown = jest.fn()
		const onSwitchUp = jest.fn()
		const handle = createCosmosKeyboardHandler(createApplication(), {
			player,
			onSwitchDown,
			onSwitchUp,
		})
		const down = {
			type: 'keydown',
			key: '2',
			code: 'Digit2',
			repeat: false,
		}

		handle(down)
		handle({ ...down, repeat: true })
		handle({ ...down })
		handle({ type: 'keyup', key: '2', code: 'Digit2' })
		handle({ type: 'keyup', key: '2', code: 'Digit2' })

		expect(onSwitchDown).toHaveBeenCalledTimes(1)
		expect(onSwitchDown).toHaveBeenCalledWith(2, down)
		expect(onSwitchUp).toHaveBeenCalledTimes(1)
		expect(onSwitchUp).toHaveBeenCalledWith(2, expect.objectContaining({ type: 'keyup' }))
	})

	test('leaves numerical entry controls to the browser', () => {
		const player = createPlayer()
		const input = { matches: jest.fn(() => true) }
		const handle = createCosmosKeyboardHandler(createApplication(), { player })

		expect(handle({
			type: 'keydown',
			key: '6',
			code: 'Digit6',
			repeat: false,
			composedPath: () => [input],
		})).toBe(false)
		expect(player.trigger).not.toHaveBeenCalled()
	})

	test('cycles banks with Ctrl+PageUp/PageDown', () => {
		const player = createPlayer()
		const application = createApplication()
		const handle = createCosmosKeyboardHandler(application, { player })

		expect(handle({
			type: 'keydown',
			key: 'PageDown',
			ctrlKey: true,
			repeat: false,
		})).toBe(true)
		expect(handle({
			type: 'keydown',
			key: 'PageUp',
			ctrlKey: true,
			repeat: false,
		})).toBe(true)

		expect(player.nextBank).toHaveBeenCalledTimes(1)
		expect(player.previousBank).toHaveBeenCalledTimes(1)
		expect(application.setFeedback).toHaveBeenLastCalledWith('Cosmo bank: Coins', 0, 'cosmos')
	})

	test('releases held gated switches on window blur', () => {
		const player = createPlayer()
		const onSwitchUp = jest.fn()
		const handle = createCosmosKeyboardHandler(createApplication(), { player, onSwitchUp })

		handle({ type: 'keydown', key: '5', code: 'Digit5', repeat: false })
		const blur = { type: 'blur' }
		expect(handle(blur)).toBe(false)

		expect(player.release).toHaveBeenCalledWith(5)
		expect(onSwitchUp).toHaveBeenCalledWith(5, blur)
	})
})
