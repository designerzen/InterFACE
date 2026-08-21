import { getBeatTriggerTime } from '../source/timing/patterns.js'

describe('getBeatTriggerTime', () => {
	test('keeps scheduled beats continuous when tempo is reduced during playback', () => {
		const audioContext = { currentTime: 2.01 }
		const slowedPeriod = 1000 / 24 / 1000
		const clock = {
			startTime: 1000,
			timePerBar: 500,
			timeBetween: 500 / 24,
		}

		const beforeSlowdown = getBeatTriggerTime(audioContext, clock, 3, 0.1)
		expect(beforeSlowdown).toBeCloseTo(3.1, 6)

		clock.timePerBar = 1000
		clock.timeBetween = 1000 / 24
		audioContext.currentTime = 2.02

		const atSlowdown = getBeatTriggerTime(audioContext, clock, 3, 0.1)
		expect(atSlowdown).toBeCloseTo(beforeSlowdown, 6)

		audioContext.currentTime = 2.06
		const afterSlowdown = getBeatTriggerTime(audioContext, clock, 3 + slowedPeriod, 0.1)

		expect(afterSlowdown - atSlowdown).toBeCloseTo(slowedPeriod, 6)
	})

	test('keeps the default lookahead stable across a live tempo reduction', () => {
		const audioContext = { currentTime: 2.01 }
		const clock = {
			startTime: 1000,
			timePerBar: 500,
			timeBetween: 500 / 24,
		}

		const beforeSlowdown = getBeatTriggerTime(audioContext, clock, 3)

		clock.timePerBar = 1000
		clock.timeBetween = 1000 / 24
		audioContext.currentTime = 2.02

		const atSlowdown = getBeatTriggerTime(audioContext, clock, 3)
		expect(atSlowdown).toBeCloseTo(beforeSlowdown, 6)
	})

	test('falls back to now plus lookahead before a scheduled tick is available', () => {
		const audioContext = { currentTime: 2 }
		const clock = {
			startTime: 0,
			timePerBar: 500,
		}

		expect(getBeatTriggerTime(audioContext, clock, undefined, 0.1)).toBeCloseTo(2.1, 8)
	})
})
