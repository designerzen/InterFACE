import {
	DEFAULT_SNARE_OPTIONS,
	PRESET_ACOUSTIC_SNARE,
	PRESET_BRUSH_SNARE,
	PRESET_DISTORTED_SNARE,
	PRESET_SNARES,
	PRESET_SATURATED_SNARE,
	getSnareVoiceLevels,
} from '../source/audio/synthesizers/snare-presets.js'
import { createSnare, createSnareSaturationCurve } from '../source/audio/synthesizers/snare.js'
import { createHihat } from '../source/audio/synthesizers/hihat.js'

const createAudioParam = () => ({
	value:0,
	cancelScheduledValues:jest.fn(),
	setValueAtTime:jest.fn(),
	linearRampToValueAtTime:jest.fn(),
	exponentialRampToValueAtTime:jest.fn(),
})

const createNode = (properties={}) => ({ connect:jest.fn(), ...properties })

const createAudioContext = () => {
	const gains = []
	const filters = []
	const shapers = []
	return {
		currentTime:2,
		sampleRate:48000,
		gains,
		filters,
		shapers,
		createOscillator:jest.fn(() => createNode({ frequency:createAudioParam(), start:jest.fn() })),
		createBufferSource:jest.fn(() => createNode({ start:jest.fn() })),
		createBuffer:jest.fn((channels, length) => {
			const data = new Float32Array(length)
			return { getChannelData:() => data }
		}),
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
		createWaveShaper:jest.fn(() => {
			const node = createNode()
			shapers.push(node)
			return node
		}),
	}
}

describe('snare character layers', () => {
	test('keeps body and wires proportional while soft hits excite less crack', () => {
		const quiet = getSnareVoiceLevels({ ...DEFAULT_SNARE_OPTIONS, velocity:0.2 })
		const loud = getSnareVoiceLevels({ ...DEFAULT_SNARE_OPTIONS, velocity:0.8 })

		for (const voice of ['noise', 'body', 'shell']) {
			expect(quiet[voice]).toBeGreaterThan(0)
			expect(loud[voice] / quiet[voice]).toBeCloseTo(4)
		}
		expect(quiet.crack / quiet.body).toBeLessThan(loud.crack / loud.body)
		expect(DEFAULT_SNARE_OPTIONS.crackLength).toBeLessThan(DEFAULT_SNARE_OPTIONS.bodyLength)
		expect(DEFAULT_SNARE_OPTIONS.bodyLength).toBeLessThan(DEFAULT_SNARE_OPTIONS.length)
	})

	test('keeps brushed snares noise-led rather than punchy', () => {
		const levels = getSnareVoiceLevels(PRESET_BRUSH_SNARE)
		expect(levels.crack).toBeLessThan(levels.noise)
		expect(levels.shell).toBeLessThan(levels.body)
	})

	test('keeps the default body audible and overlaps the noise filters at impact', () => {
		expect(DEFAULT_SNARE_OPTIONS.triStart).toBeGreaterThanOrEqual(180)
		expect(DEFAULT_SNARE_OPTIONS.triEnd).toBeGreaterThanOrEqual(100)
		expect(DEFAULT_SNARE_OPTIONS.bandpassStart).toBeGreaterThan(DEFAULT_SNARE_OPTIONS.highpassStart)
		expect(DEFAULT_SNARE_OPTIONS.attack).toBeLessThanOrEqual(0.003)
	})

	test('uses real drive settings for character presets while keeping natural snares mostly dry', () => {
		expect(PRESET_DISTORTED_SNARE.drive).toBeGreaterThan(PRESET_SATURATED_SNARE.drive)
		expect(PRESET_DISTORTED_SNARE.crunchMix).toBeGreaterThan(0.6)
		expect(PRESET_SATURATED_SNARE.crunchMix).toBeGreaterThan(0.5)
		expect(PRESET_ACOUSTIC_SNARE.crunchMix).toBeLessThan(0.1)
		expect(PRESET_BRUSH_SNARE.crunchMix).toBe(0)
	})

	test('gives every classic drum-machine preset its own punch and crunch profile', () => {
		const classicPresets = PRESET_SNARES.slice(1, PRESET_SNARES.indexOf(PRESET_ACOUSTIC_SNARE))
		expect(classicPresets).toHaveLength(17)
		expect(classicPresets.every(item => item.drive >= 2.2)).toBe(true)
		expect(classicPresets.every(item => item.crunchMix >= 0.2)).toBe(true)
		expect(classicPresets.every(item => item.bodyLevel * item.velocity >= 0.53)).toBe(true)
		expect(classicPresets.every(item => item.crackLevel * item.velocity >= 0.52)).toBe(true)
		expect(new Set(classicPresets.map(item => item.crunchTone)).size).toBeGreaterThan(10)
		expect(Math.max(...classicPresets.map(item => item.drive))).toBeGreaterThanOrEqual(4.5)
	})

	test('creates a bounded nonlinear soft-clipping curve', () => {
		const curve = createSnareSaturationCurve()
		expect(curve).toHaveLength(4096)
		expect(curve[0]).toBeCloseTo(-1)
		expect(curve.at(-1)).toBeCloseTo(1)
		expect(curve[Math.floor(curve.length * 0.75)]).toBeGreaterThan(0.5)
	})

	test('builds and controls a parallel oversampled saturation path', () => {
		const context = createAudioContext()
		const snare = createSnare(context, createNode())

		snare(PRESET_DISTORTED_SNARE)

		expect(context.shapers).toHaveLength(1)
		expect(context.shapers[0].oversample).toBe('2x')
		expect(context.shapers[0].curve).toBeInstanceOf(Float32Array)
		// Gain order after the four voice envelopes: bus, dry, drive, wet, output.
		expect(context.gains[5].gain.setValueAtTime).toHaveBeenCalledWith(1 - PRESET_DISTORTED_SNARE.crunchMix, expect.any(Number))
		expect(context.gains[6].gain.setValueAtTime).toHaveBeenCalledWith(PRESET_DISTORTED_SNARE.drive, expect.any(Number))
		expect(context.gains[7].gain.setValueAtTime).toHaveBeenCalledWith(PRESET_DISTORTED_SNARE.crunchMix, expect.any(Number))
		expect(context.gains[8].gain.setValueAtTime).toHaveBeenCalledWith(PRESET_DISTORTED_SNARE.outputGain, expect.any(Number))
		expect(context.filters[0].frequency.setValueAtTime).toHaveBeenCalledWith(PRESET_DISTORTED_SNARE.crunchTone, expect.any(Number))
	})

	test('shares a four-second noise source across snares and live hats', () => {
		const context = createAudioContext()
		createSnare(context, createNode())
		createSnare(context, createNode())
		const hat = createHihat(context, createNode())
		hat({ noiseGain:0.1, triggerAt:2.1 })
		expect(context.createBuffer).toHaveBeenCalledTimes(1)
		expect(context.createBuffer).toHaveBeenCalledWith(1, 48000 * 4, 48000)
	})

	test('uses short attacks and holds the existing gain during a scheduled roll', () => {
		const context = createAudioContext()
		const snare = createSnare(context, createNode())
		snare({ velocity:1, triggerAt:2.1 })
		snare({ velocity:0.4, triggerAt:2.12 })
		const body = context.gains[0].gain
		expect(body.setValueAtTime.mock.calls.at(-1)[0]).toBeGreaterThan(0)
		expect(body.setValueAtTime.mock.calls.at(-1)[1]).toBe(2.12)
		expect(body.linearRampToValueAtTime.mock.calls.at(-1)[1]).toBeCloseTo(2.1207)
		snare.choke(0.006, 2.13)
		expect(body.exponentialRampToValueAtTime.mock.calls.at(-1)[1]).toBeCloseTo(2.136)
	})

	test('applies strike dynamics and damping without allocating additional audio nodes or buffers', () => {
		const context = createAudioContext()
		const snare = createSnare(context, createNode())
		for (let index=0; index<32; index++) {
			snare({ velocity:0.2 + index / 40, strikePosition:index % 2, damping:0.3, triggerAt:2.1 + index * 0.03 })
		}
		expect(context.createOscillator).toHaveBeenCalledTimes(2)
		expect(context.createBufferSource).toHaveBeenCalledTimes(1)
		expect(context.createBuffer).toHaveBeenCalledTimes(1)
		expect(context.gains).toHaveLength(9)
		expect(context.filters).toHaveLength(4)
		expect(context.shapers).toHaveLength(1)
	})
})
