import {
	CHORD_VOICING_INTERVAL_LIBRARY,
	DIATONIC_TRIAD_INTERVALS,
	INTERVAL_SHIFTS,
	MAJOR_7_VOICING_INTERVALS,
	SCALE_INTERVAL_LIBRARY
} from '../source/audio/tuning/intervals.js'

describe('central interval definitions', () => {
	test('keeps scale intervals inside one octave and rooted at zero', () => {
		Object.entries(SCALE_INTERVAL_LIBRARY).forEach(([name, intervals]) => {
			expect(Array.isArray(intervals)).toBe(true)
			intervals.forEach(interval => {
				expect(Number.isInteger(interval)).toBe(true)
				expect(interval).toBeGreaterThanOrEqual(0)
				expect(interval).toBeLessThan(12)
			})
			if (name !== 'FIFTHS' && name !== 'FIFTHS_SCALE') expect(intervals[0]).toBe(0)
		})
	})

	test('keeps chord voicings ordered, rooted and within a thirteenth', () => {
		Object.values(CHORD_VOICING_INTERVAL_LIBRARY).forEach(intervals => {
			expect(intervals[0]).toBe(0)
			expect(intervals.every(Number.isInteger)).toBe(true)
			expect(intervals.every((interval, index) => index === 0 || interval > intervals[index - 1])).toBe(true)
			expect(intervals.at(-1)).toBeLessThanOrEqual(21)
		})
	})

	test('reuses named constants and exposes valid named semitone shifts', () => {
		expect(CHORD_VOICING_INTERVAL_LIBRARY.major7).toBe(MAJOR_7_VOICING_INTERVALS)
		expect(INTERVAL_SHIFTS.downOctave).toBe(-12)
		expect(INTERVAL_SHIFTS.perfectFifth).toBe(7)
		expect(INTERVAL_SHIFTS.upOctave).toBe(12)
		expect(Object.values(INTERVAL_SHIFTS).every(Number.isInteger)).toBe(true)
	})

	test('keeps generic scale-degree intervals separate from emotional voicings', () => {
		expect(DIATONIC_TRIAD_INTERVALS).toEqual([0, 2, 4])
		expect(Object.values(CHORD_VOICING_INTERVAL_LIBRARY)).not.toContain(DIATONIC_TRIAD_INTERVALS)
	})
})
