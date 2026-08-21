import { DEFAULT_COWBELL_OPTIONS, PRESET_COWBELLS, getCowbellEnvelopeLevels, getCowbellPresetForStyle, resolveCowbellHitOptions } from '../source/audio/synthesizers/cowbell-presets.js'

describe('cowbell variation', () => {
	test('varies pitch and length within preset bounds', () => {
		const low = resolveCowbellHitOptions(DEFAULT_COWBELL_OPTIONS, () => 0)
		const high = resolveCowbellHitOptions(DEFAULT_COWBELL_OPTIONS, () => 1)

		expect(low.fundamental).toBeLessThan(DEFAULT_COWBELL_OPTIONS.fundamental)
		expect(high.fundamental).toBeGreaterThan(DEFAULT_COWBELL_OPTIONS.fundamental)
		expect(low.length).toBeCloseTo(DEFAULT_COWBELL_OPTIONS.length - DEFAULT_COWBELL_OPTIONS.lengthVariation)
		expect(high.length).toBeCloseTo(DEFAULT_COWBELL_OPTIONS.length + DEFAULT_COWBELL_OPTIONS.lengthVariation)
	})

	test('includes short, long, low, high and contrasting partial presets', () => {
		expect(PRESET_COWBELLS.length).toBeGreaterThanOrEqual(39)
		expect(Math.min(...PRESET_COWBELLS.map(preset => preset.length))).toBeLessThanOrEqual(0.09)
		expect(Math.max(...PRESET_COWBELLS.map(preset => preset.length))).toBeGreaterThanOrEqual(2.2)
		expect(PRESET_COWBELLS.some(preset => preset.partialLevels[0] !== preset.partialLevels[1])).toBe(true)
	})

	test('keeps quiet hits quiet through the sustain stage', () => {
		const levels = getCowbellEnvelopeLevels({ velocity:0.2, sustain:0.8, outputGain:0.4 })
		expect(levels.peak).toBeCloseTo(0.08)
		expect(levels.sustain).toBeCloseTo(0.064)
		expect(levels.sustain).toBeLessThan(levels.peak)
	})

	test('selects deterministic contrasting voices for musical styles', () => {
		expect(getCowbellPresetForStyle('Jazz', 'same')).toBe(getCowbellPresetForStyle('Jazz', 'same'))
		expect(getCowbellPresetForStyle('Jazz', 'same').name).not.toBe(getCowbellPresetForStyle('Heavy', 'same').name)
	})
})
