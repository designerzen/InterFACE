let createSampleBankPlayer

beforeAll(async () => {
	;({ createSampleBankPlayer } = await import('../source/audio/sample-bank-player.js'))
})

const createSource = () => ({
	stop: jest.fn(),
})

const createPlayer = (banks, overrides = {}) => {
	const context = {}
	const destination = {}
	const load = jest.fn(async (receivedContext, src) => ({ receivedContext, src }))
	const sources = []
	const play = jest.fn((_receivedContext, _buffer, _offset, _receivedDestination, _options, onComplete) => {
		const source = createSource()
		source.complete = () => onComplete(source)
		sources.push(source)
		return source
	})
	const player = createSampleBankPlayer({
		banks,
		getContext: () => context,
		getDestination: () => destination,
		load,
		play,
		...overrides,
	})
	return { context, destination, load, play, player, sources }
}

describe('sample bank player', () => {
	test('loads each sample once and reuses the decoded buffer', async () => {
		const setup = createPlayer([{
			id: 'one',
			samples: [{ src: '/one.wav' }],
		}])

		await setup.player.trigger(0)
		await setup.player.trigger(0)

		expect(setup.load).toHaveBeenCalledTimes(1)
		expect(setup.play).toHaveBeenCalledTimes(2)
		expect(setup.player.activeCount).toBe(2)
	})

	test('supports self and all-voice interruption', async () => {
		const setup = createPlayer([{
			id: 'interruptions',
			samples: [
				{ src: '/self.wav', interrupt: 'self' },
				{ src: '/all.wav', interrupt: 'all' },
			],
		}])

		await setup.player.trigger(0)
		const first = setup.sources[0]
		await setup.player.trigger(0)
		expect(first.stop).toHaveBeenCalledTimes(1)

		const second = setup.sources[1]
		await setup.player.trigger(1)
		expect(second.stop).toHaveBeenCalledTimes(1)
		expect(setup.player.activeCount).toBe(1)
	})

	test('stops gated samples on release, including release while loading', async () => {
		let resolveBuffer
		const pendingBuffer = new Promise(resolve => {
			resolveBuffer = resolve
		})
		const setup = createPlayer([{
			id: 'gated',
			samples: [{ src: '/gate.wav', stopOnRelease: true }],
		}], {
			load: jest.fn(() => pendingBuffer),
		})

		const triggered = setup.player.trigger(0)
		expect(setup.player.release(0)).toBe(false)
		resolveBuffer({})
		expect(await triggered).toBeNull()
		expect(setup.play).not.toHaveBeenCalled()

		await setup.player.trigger(0)
		expect(setup.player.release(0)).toBe(true)
		expect(setup.sources[0].stop).toHaveBeenCalledTimes(1)
	})

	test('cycles between named presets and stops active voices', async () => {
		const setup = createPlayer([
			{ id: 'first', label: 'First', samples: [{ src: '/first.wav' }] },
			{ id: 'second', label: 'Second', samples: [{ src: '/second.wav' }] },
		])

		await setup.player.trigger(0)
		expect(setup.player.nextBank().id).toBe('second')
		expect(setup.sources[0].stop).toHaveBeenCalledTimes(1)
		expect(setup.player.previousBank().id).toBe('first')
		expect(setup.player.setBank('second').label).toBe('Second')
	})
})
