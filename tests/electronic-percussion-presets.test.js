import {
	DEFAULT_ELECTRONIC_PERCUSSION_OPTIONS,
	PRESET_ELECTRONIC_PERCUSSION,
	PRESET_REVERSE_TOM,
	PRESET_REVERSE_TOM_LOW,
	PRESET_REVERSE_TOM_HIGH,
} from '../source/audio/synthesizers/electronic-percussion-presets.js'

describe('electronic percussion presets', () => {
	test('offers a broad selection of zaps, reverse toms and space effects', () => {
		const names = PRESET_ELECTRONIC_PERCUSSION.map(preset => preset.name)

		expect(PRESET_ELECTRONIC_PERCUSSION).toHaveLength(20)
		expect(names).toEqual(expect.arrayContaining([
			'Short Zap', 'Long Laser Zap', 'Alien Zap', 'Ion Blaster',
			'Reverse Tom', 'Reverse Tom Low', 'Reverse Tom High', 'Reverse Metal Tom',
			'Radar Ping', 'Satellite Bleep', 'UFO Takeoff', 'Comet Whoosh',
			'Asteroid Impact', 'Robot Bonk', 'Teleport',
		]))
		expect(new Set(names).size).toBe(names.length)
	})

	test('reverse toms rise in pitch and peak late in their envelope', () => {
		for (const preset of [PRESET_REVERSE_TOM, PRESET_REVERSE_TOM_LOW, PRESET_REVERSE_TOM_HIGH]) {
			expect(preset.endFrequency).toBeGreaterThan(preset.startFrequency)
			expect(preset.attack).toBeGreaterThan(preset.length * 0.7)
			expect(preset.attack).toBeLessThan(preset.length)
		}
	})

	test('every preset is complete, immutable and safe for exponential automation', () => {
		const requiredKeys = Object.keys(DEFAULT_ELECTRONIC_PERCUSSION_OPTIONS)
		for (const preset of PRESET_ELECTRONIC_PERCUSSION) {
			expect(Object.isFrozen(preset)).toBe(true)
			expect(Object.keys(preset)).toEqual(expect.arrayContaining(requiredKeys))
			expect(preset.startFrequency).toBeGreaterThan(0)
			expect(preset.endFrequency).toBeGreaterThan(0)
			expect(preset.length).toBeGreaterThan(preset.attack)
			expect(preset.outputGain).toBeGreaterThan(0)
		}
	})
})
