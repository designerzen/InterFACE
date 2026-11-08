import { ZERO } from '../source/audio/audio-constants.js'
import { createCowbell } from '../source/audio/synthesizers/cowbell.js'
import { DEFAULT_COWBELL_OPTIONS } from '../source/audio/synthesizers/cowbell-presets.js'
import { createHihat } from '../source/audio/synthesizers/hihat.js'
import { DEFAULT_CLOSED_HIHAT } from '../source/audio/synthesizers/hihat-presets.js'
import { createSnare } from '../source/audio/synthesizers/snare.js'
import { DEFAULT_SNARE_OPTIONS } from '../source/audio/synthesizers/snare-presets.js'

const createAudioParam = () => ({
	value:0,
	cancelScheduledValues:jest.fn(),
	setValueAtTime:jest.fn(),
	linearRampToValueAtTime:jest.fn(),
	exponentialRampToValueAtTime:jest.fn(),
})

const createNode = (properties={}) => ({ connect:jest.fn(), ...properties })

const createAudioContext = () => {
	const sources = []
	const createSource = properties => {
		const source = createNode({
			frequency:createAudioParam(),
			start:jest.fn(),
			...properties,
		})
		sources.push(source)
		return source
	}
	return {
		currentTime:4,
		sampleRate:48000,
		sources,
		createOscillator:jest.fn(() => createSource()),
		createBufferSource:jest.fn(() => createSource()),
		createWaveShaper:jest.fn(() => createNode()),
		createGain:jest.fn(() => createNode({ gain:createAudioParam() })),
		createBiquadFilter:jest.fn(() => createNode({
			frequency:createAudioParam(),
			Q:createAudioParam(),
		})),
		createBuffer:jest.fn(() => ({ getChannelData:() => new Float32Array(4096) })),
	}
}

describe.each([
	['snare', createSnare, DEFAULT_SNARE_OPTIONS],
	['hi-hat', createHihat, DEFAULT_CLOSED_HIHAT],
	['cowbell', createCowbell, DEFAULT_COWBELL_OPTIONS],
])('%s trigger scheduling', (name, createVoice, preset) => {
	test('treats triggerAt zero as an immediate hit', () => {
		const context = createAudioContext()
		const voice = createVoice(context, createNode())

		voice({ ...preset, triggerAt:0 })

		expect(context.sources[0].start.mock.calls[0][0]).toBe(context.currentTime + ZERO)
	})

	test('preserves a future lookahead timestamp', () => {
		const context = createAudioContext()
		const voice = createVoice(context, createNode())

		voice({ ...preset, triggerAt:4.25 })

		expect(context.sources[0].start.mock.calls[0][0]).toBe(4.25)
	})
})
