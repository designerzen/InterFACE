import { AUXILIARY_DRUM_LANES, DRUM_GROOVES, createCompositeDrumGroove } from '../source/timing/drum-patterns.js'

describe('named drum grooves', () => {
	test('provides complete, aligned lanes with valid velocities', () => {
		for (const lanes of Object.values(DRUM_GROOVES)) {
			expect(lanes.kick.length).toBe(lanes.snare.length)
			expect(lanes.kick.length).toBe(lanes.hat.length)
			expect(lanes.kick.length).toBe(lanes.clap.length)
			expect(lanes.kick.length).toBeGreaterThanOrEqual(16)
			for (const velocity of [lanes.kick, lanes.snare, lanes.hat, lanes.clap].flat()) {
				expect(velocity).toBeGreaterThanOrEqual(0)
				expect(velocity).toBeLessThanOrEqual(255)
			}
			for (const lane of AUXILIARY_DRUM_LANES) {
				if (!lanes[lane]) continue
				expect(lanes[lane]).toHaveLength(lanes.kick.length)
				for (const velocity of lanes[lane]) {
					expect(velocity).toBeGreaterThanOrEqual(0)
					expect(velocity).toBeLessThanOrEqual(255)
				}
			}
			if (lanes.timing) {
				expect(['triplet', 'sextuplet', 'rapid']).toContain(lanes.timing.style)
				expect(lanes.timing.every).toBeGreaterThan(0)
			}
		}
	})

	test('includes dedicated auxiliary-percussion grooves and enriches suitable existing ones', () => {
		expect(Object.keys(DRUM_GROOVES)).toEqual(expect.arrayContaining([
			'salsa-mambo', 'son-montuno', 'cha-cha', 'rumba-guaguanco',
			'cumbia', 'latin-electro', '727-latin-box',
		]))
		expect(DRUM_GROOVES.samba.congaLow.some(Boolean)).toBe(true)
		expect(DRUM_GROOVES['bossa-nova'].cabasa.some(Boolean)).toBe(true)
		expect(DRUM_GROOVES.afrobeat.bongoHigh.some(Boolean)).toBe(true)
		expect(DRUM_GROOVES.electro.maracas.some(Boolean)).toBe(true)
	})

	test('overlays patterns at a shared cycle without adding their velocities', () => {
		const composite = createCompositeDrumGroove([
			{ kick:[200, 0, 0, 0], snare:[0, 0, 0, 0], hat:[80, 0, 0, 0], clap:[0, 0, 0, 0] },
			{ kick:[150, 0, 90], snare:[0, 220, 0], hat:[120, 0, 0], clap:[0, 0, 0] },
		])

		expect(composite.kick).toHaveLength(12)
		expect(composite.kick.slice(0, 4)).toEqual([200, 0, 90, 150])
		expect(composite.snare.slice(0, 4)).toEqual([0, 220, 0, 0])
		expect(composite.hat[0]).toBe(120)
		expect(composite.triangleOpen).toEqual(Array(12).fill(0))
	})
})
