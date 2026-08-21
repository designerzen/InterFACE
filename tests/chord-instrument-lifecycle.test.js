let ChordInstrument

beforeAll(async () => {
	;({ default: ChordInstrument } = await import('../source/audio/instruments/chord.instrument.js'))
})

const createAudioContext = () => ({
	createGain: jest.fn(() => ({
		connect: jest.fn(),
		disconnect: jest.fn(),
		gain: { value: 1 },
	})),
})

const createChildInstrument = () => ({
	allNotesOff: jest.fn(async () => true),
	destroy: jest.fn(async () => true),
	loadPreviousPreset: jest.fn(async () => true),
	loadNextPreset: jest.fn(async () => true),
	output: {
		connect: jest.fn(),
		disconnect: jest.fn(),
	},
	set volume(value) {
		this.currentVolume = value
	},
})

describe('chord instrument lifecycle', () => {
	test('releases and destroys old child instruments when replacing them', async () => {
		const chordInstrument = new ChordInstrument(createAudioContext())
		await Promise.resolve()
		const oldChild = createChildInstrument()
		const newChild = createChildInstrument()
		await chordInstrument.setInstruments([oldChild])

		await chordInstrument.setInstruments([newChild])

		expect(oldChild.allNotesOff).toHaveBeenCalledTimes(1)
		expect(oldChild.output.disconnect).toHaveBeenCalledTimes(1)
		expect(oldChild.destroy).toHaveBeenCalledTimes(1)
		expect(chordInstrument.instruments).toEqual([newChild])
	})

	test.each(['loadPreviousPreset', 'loadNextPreset'])('waits for every child during %s', async methodName => {
		const chordInstrument = new ChordInstrument(createAudioContext())
		await Promise.resolve()
		let finishLoading
		const child = createChildInstrument()
		child[methodName] = jest.fn(() => new Promise(resolve => {
			finishLoading = resolve
		}))
		await chordInstrument.setInstruments([child])

		let completed = false
		const loading = chordInstrument[methodName]().then(() => {
			completed = true
		})
		await Promise.resolve()
		expect(completed).toBe(false)

		finishLoading(true)
		await loading
		expect(completed).toBe(true)
	})
})
