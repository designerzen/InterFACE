import {
	DEFAULT_TOM_OPTIONS,
	PRESET_LOW_TOM,
	PRESET_MID_TOM,
	PRESET_HIGH_TOM,
} from '../source/audio/synthesizers/tom-presets.js'
import { createTom } from '../source/audio/synthesizers/tom.js'

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
	const oscillators = []
	return {
		currentTime:1,
		oscillators,
		createOscillator:jest.fn(() => {
			const oscillator = createNode({ frequency:createAudioParam(), start:jest.fn() })
			oscillators.push(oscillator)
			return oscillator
		}),
		createGain:jest.fn(() => createNode({ gain:createAudioParam() })),
	}
}

describe('tom pitch range', () => {
	test('keeps the default tom above kick fundamentals', () => {
		expect(DEFAULT_TOM_OPTIONS.sineEnd).toBeGreaterThan(100)
		expect(DEFAULT_TOM_OPTIONS.triEnd).toBeGreaterThan(100)
	})

	test('provides clearly separated low, mid and high tom registers', () => {
		expect(PRESET_LOW_TOM.sineEnd).toBeLessThan(PRESET_MID_TOM.sineEnd)
		expect(PRESET_MID_TOM.sineEnd).toBeLessThan(PRESET_HIGH_TOM.sineEnd)
		expect(PRESET_HIGH_TOM.sineStart).toBeGreaterThanOrEqual(400)
	})

	test('schedules the selected tom frequencies on the dedicated voice', () => {
		const context = createAudioContext()
		const tom = createTom(context, createNode())

		tom(PRESET_HIGH_TOM)

		expect(context.oscillators[0].frequency.setValueAtTime)
			.toHaveBeenCalledWith(PRESET_HIGH_TOM.triStart, 1.0001)
		expect(context.oscillators[1].frequency.setValueAtTime)
			.toHaveBeenCalledWith(PRESET_HIGH_TOM.sineStart, 1.0001)
	})
})
