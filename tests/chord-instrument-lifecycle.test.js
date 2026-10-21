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
	loadPreset: jest.fn(async () => true),
	programChange: jest.fn(async () => true),
	output: {
		connect: jest.fn(),
		disconnect: jest.fn(),
	},
	set volume(value) {
		this.currentVolume = value
	},
})

describe('chord instrument lifecycle', () => {
	test('stops reporting loading once its audio node is available', async () => {
		const chordInstrument = new ChordInstrument(createAudioContext())
		expect(chordInstrument.isLoading).toBe(true)

		await chordInstrument.loaded

		expect(chordInstrument.available).toBe(true)
		expect(chordInstrument.isLoading).toBe(false)
	})

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

	test('keeps the working instruments when a replacement has no audio output', async () => {
		const chordInstrument = new ChordInstrument(createAudioContext())
		await Promise.resolve()
		const oldChild = createChildInstrument()
		await chordInstrument.setInstruments([oldChild])

		await expect(chordInstrument.setInstruments([{
			loaded:Promise.resolve()
		}])).rejects.toThrow('No Output specified for this ChordInstrument')

		expect(chordInstrument.instruments).toEqual([oldChild])
		expect(oldChild.destroy).not.toHaveBeenCalled()
	})

	test('waits for replacement audio nodes before disconnecting the current voices', async () => {
		const chordInstrument = new ChordInstrument(createAudioContext())
		await Promise.resolve()
		const oldChild = createChildInstrument()
		await chordInstrument.setInstruments([oldChild])
		let finishLoading
		const newChild = createChildInstrument()
		newChild.output = null
		newChild.loaded = new Promise(resolve => {
			finishLoading = () => {
				newChild.output = { connect:jest.fn(), disconnect:jest.fn() }
				resolve()
			}
		})

		const replacement = chordInstrument.setInstruments([newChild])
		await Promise.resolve()
		expect(chordInstrument.instruments).toEqual([oldChild])
		expect(oldChild.destroy).not.toHaveBeenCalled()

		finishLoading()
		await replacement
		expect(chordInstrument.instruments).toEqual([newChild])
		expect(oldChild.destroy).toHaveBeenCalledTimes(1)
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

	test('waits for every child when loading a preset', async () => {
		const chordInstrument = new ChordInstrument(createAudioContext())
		await Promise.resolve()
		let finishLoading
		const child = createChildInstrument()
		child.loadPreset = jest.fn(() => new Promise(resolve => {
			finishLoading = resolve
		}))
		await chordInstrument.setInstruments([child])

		let completed = false
		const loading = chordInstrument.loadPreset('sine').then(() => {
			completed = true
		})
		await Promise.resolve()
		expect(completed).toBe(false)

		finishLoading(true)
		await loading
		expect(completed).toBe(true)
		expect(child.loadPreset).toHaveBeenCalledWith('sine')
		expect(child.programChange).not.toHaveBeenCalled()
	})

	test('forwards SoundFont loading arguments to every chord voice', async () => {
		const chordInstrument = new ChordInstrument(createAudioContext())
		await Promise.resolve()
		const children = [createChildInstrument(), createChildInstrument()]
		await chordInstrument.setInstruments(children)
		const progress = jest.fn()

		const result = await chordInstrument.loadPreset('violin', 'soundfont-pack', progress)

		expect(result).toBe(chordInstrument)
		children.forEach(child => {
			expect(child.loadPreset).toHaveBeenCalledWith('violin', 'soundfont-pack', progress)
		})
	})
})
