import {
	DEFAULT_CLACK_OPTIONS,
	PRESET_METRONOME_CLACK,
} from '../source/audio/synthesizers/clack-presets.js'
import { createClack } from '../source/audio/synthesizers/clack.js'

jest.mock('../source/audio/audio.js', () => ({ ZERO:0.0001 }))
jest.mock('../source/audio/synthesizers.js', () => ({
	createQueue:jest.fn(),
	chokeGains:jest.fn(),
}))

const createAudioParam = () => ({
	value:0,
	cancelScheduledValues:jest.fn(),
	setValueAtTime:jest.fn(),
	exponentialRampToValueAtTime:jest.fn(),
})

const createNode = (properties={}) => ({
	connect:jest.fn(),
	...properties,
})

describe('clack output level', () => {
	test('preserves velocity dynamics while applying the boost', () => {
		const gain = createAudioParam()
		const audioContext = {
			currentTime:1,
			createGain:jest.fn(() => createNode({ gain })),
			createBiquadFilter:jest.fn(() => createNode({
				frequency:createAudioParam(),
				Q:createAudioParam(),
			})),
			createOscillator:jest.fn(() => createNode({
				frequency:createAudioParam(),
				start:jest.fn(),
			})),
		}
		const clack = createClack(audioContext, createNode())

		clack({ ...DEFAULT_CLACK_OPTIONS, velocity:0.5 })

		expect(DEFAULT_CLACK_OPTIONS.outputGain).toBe(1.8)
		expect(gain.setValueAtTime).toHaveBeenCalledWith(0.9, expect.any(Number))
	})

	test('uses an audible metronome filter range and honours its envelope', () => {
		const gain = createAudioParam()
		const filters = []
		const audioContext = {
			currentTime:1,
			createGain:jest.fn(() => createNode({ gain })),
			createBiquadFilter:jest.fn(() => {
				const filter = createNode({
					frequency:createAudioParam(),
					Q:createAudioParam(),
				})
				filters.push(filter)
				return filter
			}),
			createOscillator:jest.fn(() => createNode({
				frequency:createAudioParam(),
				start:jest.fn(),
			})),
		}
		const clack = createClack(audioContext, createNode())

		clack(PRESET_METRONOME_CLACK)

		expect(PRESET_METRONOME_CLACK.highpass).toBeLessThan(PRESET_METRONOME_CLACK.ratios[0])
		expect(filters[0].frequency.value).toBe(PRESET_METRONOME_CLACK.bandpass)
		expect(filters[1].frequency.value).toBe(PRESET_METRONOME_CLACK.highpass)
		const [level, triggerAt] = gain.setValueAtTime.mock.calls[0]
		const [, releaseAt] = gain.exponentialRampToValueAtTime.mock.calls[0]
		expect(level).toBeCloseTo(1.76)
		expect(triggerAt).toBeGreaterThanOrEqual(audioContext.currentTime)
		expect(releaseAt).toBeCloseTo(triggerAt + PRESET_METRONOME_CLACK.length)
	})
})
