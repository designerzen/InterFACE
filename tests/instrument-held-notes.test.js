let SampleInstrument

const mockPlayTrack = jest.fn((context, audioBuffer, _offset, destination, options, onComplete) => {
	const source = context.createBufferSource()
	source.buffer = audioBuffer
	source.loop = options.loop
	source.playbackRate.value = options.playbackRate
	source.connect(destination)
	source.onended = () => onComplete(source)
	source.start()
	return source
})

jest.mock('../source/audio/audio.js', () => ({
	playTrack: (...args) => mockPlayTrack(...args),
	loadInstrumentFromSoundFont: jest.fn(),
}))

beforeAll(async () => {
	;({ default: SampleInstrument } = await import('../source/audio/instruments/instrument.sample.js'))
})

const createAudioContext = () => {
	const sources = []
	const context = {
		currentTime: 0,
		state: 'running',
		createGain: jest.fn(() => ({
			gain: { value: 1 },
			disconnect: jest.fn(),
		})),
		createBufferSource: jest.fn(() => {
			const source = {
				connect: jest.fn(),
				disconnect: jest.fn(),
				start: jest.fn(),
				stop: jest.fn(() => source.onended?.()),
				playbackRate: { value: 1 },
			}
			sources.push(source)
			return source
		}),
	}
	return { context, sources }
}

describe('held sample instrument notes', () => {
	test('loops a sample until its matching note release', async () => {
		const { context, sources } = createAudioContext()
		const instrument = new SampleInstrument(context, { polyphony: 0 })
		await Promise.resolve()
		instrument.audioBuffers.C4 = {}

		await instrument.noteOn(60, 0.8)
		expect(sources).toHaveLength(1)
		expect(sources[0].loop).toBe(true)
		expect(sources[0].start).toHaveBeenCalledTimes(1)
		expect(sources[0].stop).not.toHaveBeenCalled()

		await instrument.noteOn(60, 0.8)
		expect(sources).toHaveLength(1)

		await instrument.noteOff(60, 0)
		expect(sources[0].stop).toHaveBeenCalledTimes(1)
		expect(instrument.activeNotes.has(60)).toBe(false)
	})

	test('stops every held source when the instrument is destroyed', async () => {
		const { context, sources } = createAudioContext()
		const instrument = new SampleInstrument(context, { polyphony: 0 })
		await Promise.resolve()
		instrument.audioBuffers.C4 = {}
		instrument.audioBuffers.E4 = {}

		await instrument.noteOn(60, 1)
		await instrument.noteOn(64, 1)
		await instrument.destroy()

		expect(sources).toHaveLength(2)
		expect(sources[0].stop).toHaveBeenCalledTimes(1)
		expect(sources[1].stop).toHaveBeenCalledTimes(1)
		expect(instrument.activeNoteSamples.size).toBe(0)
		expect(instrument.activeNotes.size).toBe(0)
	})

	test('does not start a source if noteOff wins an asynchronous noteOn race', async () => {
		const { context, sources } = createAudioContext()
		const instrument = new SampleInstrument(context, { polyphony: 0 })
		await Promise.resolve()
		instrument.audioBuffers.C4 = {}

		const noteOnPromise = instrument.noteOn(60, 1)
		await instrument.noteOff(60, 0)
		await noteOnPromise

		expect(sources).toHaveLength(0)
		expect(instrument.activeNotes.size).toBe(0)
	})
})
