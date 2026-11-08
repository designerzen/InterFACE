import { createHihat } from '../source/audio/synthesizers/hihat.js'
import {
	OPEN_HIHAT_CRASH,
	OPEN_HIHAT_CRASH_WARM,
	OPEN_HIHAT_CRASH_THIN,
	OPEN_HIHAT_CRASH_DARK,
	OPEN_HIHAT_CRASH_SUSPENDED,
	PRESET_HIHATS_OPEN,
} from '../source/audio/synthesizers/hihat-presets.js'

const createAudioParam = () => ({
	value:0,
	cancelScheduledValues:jest.fn(),
	setValueAtTime:jest.fn(),
	linearRampToValueAtTime:jest.fn(),
	exponentialRampToValueAtTime:jest.fn(),
})

const createNode = properties => ({ connect:jest.fn(), disconnect:jest.fn(), ...properties })

const createAudioContext = () => {
	const gains = []
	const filters = []
	const sources = []
	return {
		currentTime:1,
		sampleRate:48000,
		gains,
		filters,
		sources,
		createBuffer:jest.fn((channels, length) => {
			const data = new Float32Array(length)
			return { length, getChannelData:() => data }
		}),
		createBufferSource:jest.fn(() => {
			const source = createNode({ start:jest.fn(), stop:jest.fn() })
			sources.push(source)
			return source
		}),
		createOscillator:jest.fn(() => createNode({
			frequency:createAudioParam(),
			start:jest.fn(),
		})),
		createGain:jest.fn(() => {
			const node = createNode({ gain:createAudioParam() })
			gains.push(node)
			return node
		}),
		createBiquadFilter:jest.fn(() => {
			const node = createNode({ frequency:createAudioParam(), Q:createAudioParam() })
			filters.push(node)
			return node
		}),
	}
}

describe('crash cymbal character', () => {
	const crashPresets = [
		OPEN_HIHAT_CRASH,
		OPEN_HIHAT_CRASH_WARM,
		OPEN_HIHAT_CRASH_THIN,
		OPEN_HIHAT_CRASH_DARK,
		OPEN_HIHAT_CRASH_SUSPENDED,
	]

	test('offers distinct crash presets led by bright metallic harmonics', () => {
		expect(PRESET_HIHATS_OPEN).toEqual(expect.arrayContaining(crashPresets))
		expect(new Set(crashPresets.map(preset => preset.name)).size).toBe(crashPresets.length)
		for (const preset of crashPresets) {
			expect(preset.attack).toBeGreaterThanOrEqual(0.003)
			expect(preset.metallicGain).toBeGreaterThan(preset.noiseGain * 3)
			expect(preset.noiseGain).toBeGreaterThan(0)
			expect(preset.noiseGain).toBeLessThanOrEqual(0.08)
			expect(preset.lowpass).toBeGreaterThanOrEqual(11000)
			expect(preset.type).toBe('square')
		}
	})

	test('renders finite metallic and diffuse excitation without live oscillators', () => {
		const context = createAudioContext()
		const voice = createHihat(context, createNode())

		voice(OPEN_HIHAT_CRASH)

		expect(context.createBufferSource).toHaveBeenCalledTimes(1)
		expect(context.createOscillator).not.toHaveBeenCalled()
		expect(context.gains).toHaveLength(1)
		expect(context.filters).toHaveLength(3)
		const data = context.sources[0].buffer.getChannelData(0)
		expect(data.every(Number.isFinite)).toBe(true)
		expect(data.some(sample => Math.abs(sample) > 0.01)).toBe(true)
		expect(Math.abs(data[0])).toBe(0)
		expect(Math.abs(data.at(-1))).toBe(0)
		expect(context.gains[0].gain.linearRampToValueAtTime.mock.calls[0][1])
			.toBeCloseTo(1 + OPEN_HIHAT_CRASH.attack, 5)
	})

	test('shares two alternating cached variants between voices', () => {
		const context = createAudioContext()
		const output = createNode()
		const first = createHihat(context, output)
		const second = createHihat(context, output)

		first({ ...OPEN_HIHAT_CRASH, triggerAt:1 })
		first({ ...OPEN_HIHAT_CRASH, triggerAt:1 + OPEN_HIHAT_CRASH.length })
		second({ ...OPEN_HIHAT_CRASH, triggerAt:1 })

		expect(context.createBuffer).toHaveBeenCalledTimes(2)
		expect(context.createBufferSource).toHaveBeenCalledTimes(3)
		expect(context.sources[0].buffer).toBe(context.sources[2].buffer)
		expect(context.sources[0].buffer).not.toBe(context.sources[1].buffer)
		expect(context.createOscillator).not.toHaveBeenCalled()
	})

	test('changes brightness with velocity without rebuilding the cached sound', () => {
		const context = createAudioContext()
		const voice = createHihat(context, createNode())
		voice({ ...OPEN_HIHAT_CRASH, velocity:0.2, triggerAt:1.25 })
		voice({ ...OPEN_HIHAT_CRASH, velocity:1, triggerAt:1.5 })
		expect(context.createBuffer).toHaveBeenCalledTimes(2)
		expect(context.filters[0].frequency.value).toBeLessThan(context.filters[3].frequency.value)
		expect(context.sources[0].start).toHaveBeenCalledWith(1.25)
		expect(context.sources[1].start).toHaveBeenCalledWith(1.5)
	})

	test('allows overlapping tails, fades a lookahead choke, and disconnects ended hits', () => {
		const context = createAudioContext()
		const voice = createHihat(context, createNode())
		voice({ ...OPEN_HIHAT_CRASH, triggerAt:1.25 })
		voice({ ...OPEN_HIHAT_CRASH, triggerAt:1.5 })
		voice.choke(0.006, 1.75)
		for (const source of context.sources) {
			expect(source.stop).toHaveBeenLastCalledWith(1.756)
			source.onended()
			expect(source.disconnect).toHaveBeenCalledTimes(1)
		}
		for (const gain of context.gains) {
			expect(gain.gain.setValueAtTime.mock.calls.at(-1)[0]).toBeGreaterThan(0)
			expect(gain.disconnect).toHaveBeenCalledTimes(1)
		}
	})

	test('invalidates a timbre edit but retains the cache for filter and envelope controls', () => {
		const context = createAudioContext()
		const voice = createHihat(context, createNode())
		voice.prepare(OPEN_HIHAT_CRASH)
		voice({ ...OPEN_HIHAT_CRASH, lowpass:10000, attack:0.02, release:0.8 })
		expect(context.createBuffer).toHaveBeenCalledTimes(2)
		voice({ ...OPEN_HIHAT_CRASH, fundamental:70 })
		expect(context.createBuffer).toHaveBeenCalledTimes(4)
	})

	test('evicts old banks to bound sample memory', () => {
		const context = createAudioContext()
		context.sampleRate = 8000
		const voice = createHihat(context, createNode())
		const options = { ...OPEN_HIHAT_CRASH, length:8 }
		voice.prepare(options)
		voice.prepare({ ...options, fundamental:60 })
		voice.prepare({ ...options, fundamental:80 })
		voice.prepare(options)
		expect(context.createBuffer).toHaveBeenCalledTimes(8)
	})

	test('cancels all queued hits even when a later hit does not overlap an earlier one', () => {
		const context = createAudioContext()
		const voice = createHihat(context, createNode())
		voice({ ...OPEN_HIHAT_CRASH, triggerAt:1.25 })
		voice({ ...OPEN_HIHAT_CRASH, triggerAt:5 })
		voice.cancel()
		for (const source of context.sources) expect(source.stop).toHaveBeenLastCalledWith(1.005)
	})

	test('fades the oldest tail when the overlap limit is reached', () => {
		const context = createAudioContext()
		const voice = createHihat(context, createNode())
		for (let index=0; index<9; index++) voice({ ...OPEN_HIHAT_CRASH, triggerAt:1.25 + index * 0.02 })
		expect(context.sources[0].stop.mock.calls.at(-1)[0]).toBeCloseTo(1.41)
		expect(context.createBuffer).toHaveBeenCalledTimes(2)
	})
})
