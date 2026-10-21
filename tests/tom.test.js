import {
	DEFAULT_TOM_OPTIONS,
	PRESET_LOW_TOM,
	PRESET_MID_TOM,
	PRESET_HIGH_TOM,
	PRESET_PITCH_DROP_TOM,
	PRESET_LASER_DROP_TOM,
	PRESETS_TOMS,
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

		const [triangleStart, triangleStartAt] = context.oscillators[0].frequency.setValueAtTime.mock.calls[0]
		const [sineStart, sineStartAt] = context.oscillators[1].frequency.setValueAtTime.mock.calls[0]
		expect(triangleStart).toBe(PRESET_HIGH_TOM.triStart)
		expect(triangleStartAt).toBeCloseTo(1.0001)
		expect(sineStart).toBe(PRESET_HIGH_TOM.sineStart)
		expect(sineStartAt).toBeCloseTo(1.0001)
	})

	test('drops a high tom pitch rapidly using ratios and pitchDecay', () => {
		const context = createAudioContext()
		const tom = createTom(context, createNode())

		tom({
			triggerAt:1.1,
			length:0.5,
			pitchStartRatio:3,
			pitchEndRatio:0.5,
			pitchDecay:0.06,
			triStart:240,
			triEnd:120,
			sineStart:300,
			sineApex:360,
			sineSustain:180,
			sineEnd:100,
		})

		expect(context.oscillators[0].frequency.setValueAtTime).toHaveBeenCalledWith(720, 1.1)
		const [triangleEnd, triangleEndAt] = context.oscillators[0].frequency.exponentialRampToValueAtTime.mock.calls.at(-1)
		expect(triangleEnd).toBe(60)
		expect(triangleEndAt).toBeCloseTo(1.16)
		expect(context.oscillators[1].frequency.setValueAtTime).toHaveBeenCalledWith(900, 1.1)
		const [sineEnd, sineEndAt] = context.oscillators[1].frequency.exponentialRampToValueAtTime.mock.calls.at(-1)
		expect(sineEnd).toBe(50)
		expect(sineEndAt).toBeCloseTo(1.16)
	})

	test('provides moderate and extreme downward-bending tom presets', () => {
		expect(PRESETS_TOMS).toEqual(expect.arrayContaining([PRESET_PITCH_DROP_TOM, PRESET_LASER_DROP_TOM]))
		expect(PRESET_PITCH_DROP_TOM.pitchStartRatio).toBeGreaterThan(3)
		expect(PRESET_LASER_DROP_TOM.pitchStartRatio).toBeGreaterThan(PRESET_PITCH_DROP_TOM.pitchStartRatio)
		expect(PRESET_LASER_DROP_TOM.pitchDecay).toBeLessThan(PRESET_PITCH_DROP_TOM.pitchDecay)
	})
})
