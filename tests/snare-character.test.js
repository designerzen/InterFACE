import { DEFAULT_SNARE_OPTIONS, PRESET_BRUSH_SNARE, getSnareVoiceLevels } from '../source/audio/synthesizers/snare-presets.js'

describe('snare character layers', () => {
	test('provides body, shell, wire and crack layers proportional to velocity', () => {
		const quiet = getSnareVoiceLevels({ ...DEFAULT_SNARE_OPTIONS, velocity:0.2 })
		const loud = getSnareVoiceLevels({ ...DEFAULT_SNARE_OPTIONS, velocity:0.8 })

		for (const voice of ['noise', 'body', 'shell', 'crack']) {
			expect(quiet[voice]).toBeGreaterThan(0)
			expect(loud[voice] / quiet[voice]).toBeCloseTo(4)
		}
		expect(DEFAULT_SNARE_OPTIONS.crackLength).toBeLessThan(DEFAULT_SNARE_OPTIONS.bodyLength)
		expect(DEFAULT_SNARE_OPTIONS.bodyLength).toBeLessThan(DEFAULT_SNARE_OPTIONS.length)
	})

	test('keeps brushed snares noise-led rather than punchy', () => {
		const levels = getSnareVoiceLevels(PRESET_BRUSH_SNARE)
		expect(levels.crack).toBeLessThan(levels.noise)
		expect(levels.shell).toBeLessThan(levels.body)
	})
})
