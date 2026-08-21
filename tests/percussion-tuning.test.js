import { frequencyToNoteNumber } from '../source/audio/tuning/frequencies.js'
import { getNearestPitchClassRatio, tuneCowbellOptions, tuneKickOptions, tuneSnareOptions } from '../source/audio/synthesizers/percussion-tuning.js'

const pitchClass = frequency => ((frequencyToNoteNumber(frequency) % 12) + 12) % 12

describe('percussion tuning', () => {
	test('moves by the nearest interval to a pitch class', () => {
		const ratio = getNearestPitchClassRatio(50, 0)
		expect(pitchClass(50 * ratio)).toBe(0)
		expect(Math.abs(12 * Math.log2(ratio))).toBeLessThanOrEqual(6)
	})

	test('tunes the kick fundamental to the tonic while preserving its contour', () => {
		const kick = tuneKickOptions({ triStart:120, triEnd:50, sineStart:140, sineApex:80, sineSustain:55, sineEnd:30 }, 9)
		expect(pitchClass(kick.sineEnd)).toBe(9)
		expect(kick.sineStart / kick.sineEnd).toBeCloseTo(140 / 30)
	})

	test('tunes the snare shell to the fifth', () => {
		const snare = tuneSnareOptions({ triStart:200, triEnd:140 }, 0)
		expect(pitchClass(snare.triEnd)).toBe(7)
	})

	test('tunes cowbells to their configured degree of the global key', () => {
		const tonic = tuneCowbellOptions({ fundamental:1, ratios:[520,795], tuningSemitones:0 }, 2)
		const fifth = tuneCowbellOptions({ fundamental:1, ratios:[520,795], tuningSemitones:7 }, 2)
		expect(pitchClass(tonic.fundamental * tonic.ratios[0])).toBe(2)
		expect(pitchClass(fifth.fundamental * fifth.ratios[0])).toBe(9)
	})
})
