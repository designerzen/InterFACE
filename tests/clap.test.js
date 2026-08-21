import {
	DEFAULT_CLAP_OPTIONS,
	PRESET_808_CLAP,
	PRESET_909_CLAP,
} from '../source/audio/synthesizers/clap-presets.js'
import { createClap } from '../source/audio/synthesizers/clap.js'

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

const createNode = properties => ({ connect:jest.fn(), ...properties })

const createAudioContext = () => {
	const gain = createAudioParam()
	const filters = []
	const bufferData = new Float32Array(48000)
	return {
		gain,
		filters,
		bufferData,
		context:{
			currentTime:1,
			sampleRate:48000,
			createGain:jest.fn(() => createNode({ gain })),
			createBufferSource:jest.fn(() => createNode({ start:jest.fn() })),
			createBuffer:jest.fn(() => ({ getChannelData:() => bufferData })),
			createBiquadFilter:jest.fn(() => {
				const filter = createNode({ frequency:createAudioParam(), Q:createAudioParam() })
				filters.push(filter)
				return filter
			}),
		},
	}
}

describe('classic clap synthesis', () => {
	test('uses centred noise and a band-pass/high-pass signal chain', () => {
		const { context, filters, bufferData } = createAudioContext()
		createClap(context, createNode())

		expect(Math.min(...bufferData)).toBeLessThan(0)
		expect(Math.max(...bufferData)).toBeGreaterThan(0)
		expect(filters[0].type).toBe('bandpass')
		expect(filters[1].type).toBe('highpass')
		expect(filters[1].frequency.value).toBe(DEFAULT_CLAP_OPTIONS.highpass)
	})

	test.each([PRESET_808_CLAP, PRESET_909_CLAP])('schedules four bursts and a short tail for $name', preset => {
		const { context, gain, filters } = createAudioContext()
		const clap = createClap(context, createNode())

		clap(preset)

		expect(preset.burstOffsets).toHaveLength(4)
		expect(preset.length).toBeLessThanOrEqual(0.3)
		expect(filters[1].frequency.setValueAtTime).toHaveBeenCalledWith(preset.highpass, context.currentTime + 0.0001)
		expect(gain.setValueAtTime).toHaveBeenCalledTimes(6)
		expect(gain.exponentialRampToValueAtTime).toHaveBeenCalledTimes(5)
		expect(gain.exponentialRampToValueAtTime).toHaveBeenLastCalledWith(0.0001, context.currentTime + 0.0001 + preset.length)
	})
})
