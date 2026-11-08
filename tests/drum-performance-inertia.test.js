import { createDrumArranger } from '../source/timing/drum-arranger.js'

const play = (arranger, velocity, from, until, interval=0.1) => {
	for (let time = from; time < until - interval / 2; time += interval)
	{
		arranger.updatePerson({ noteVelocity:velocity }, time)
	}
}

describe('performance drum inertia', () => {
	test('sustained energetic playing fades gradually before returning to breakdown', () => {
		const arranger = createDrumArranger()
		play(arranger, 1, 0, 6)
		arranger.updatePerson({ noteVelocity:0 }, 6)
		expect(arranger.getIntent().energy).toBeGreaterThan(0.9)
		expect(arranger.getPerformanceTechnique()).not.toBe('breakdown')
		let previous = arranger.getIntent().energy
		for (let time = 6.1; time <= 16; time += 0.1)
		{
			arranger.updatePerson({ noteVelocity:0 }, time)
			expect(arranger.getIntent().energy).toBeLessThanOrEqual(previous)
			previous = arranger.getIntent().energy
		}
		expect(previous).toBeLessThan(0.01)
		expect(arranger.getPerformanceTechnique()).toBe('breakdown')
	})

	test('light activity still drops back immediately', () => {
		const arranger = createDrumArranger()
		play(arranger, 0.4, 0, 6)
		arranger.updatePerson({ noteVelocity:0 }, 6)
		expect(arranger.getIntent().energy).toBe(0)
		expect(arranger.getPerformanceTechnique()).toBe('breakdown')
	})

	test('longer activity earns a longer tail than a brief burst', () => {
		const brief = createDrumArranger()
		const sustained = createDrumArranger()
		play(brief, 1, 5.7, 6)
		play(sustained, 1, 0, 6)
		play(brief, 0, 6, 7)
		play(sustained, 0, 6, 7)
		expect(sustained.getIntent().energy).toBeGreaterThan(brief.getIntent().energy + 0.4)
		brief.updatePerson({ noteVelocity:1 }, 7)
		expect(brief.getIntent().energy).toBe(1)
	})

	test('uses elapsed time across different update rates', () => {
		const energies = [0.05, 0.25].map(interval => {
			const arranger = createDrumArranger()
			play(arranger, 1, 0, 6, interval)
			play(arranger, 0, 6, 7, interval)
			arranger.updatePerson({ noteVelocity:0 }, 7)
			return arranger.getIntent().energy
		})
		expect(Math.abs(energies[0] - energies[1])).toBeLessThan(0.08)
	})

	test('toggling performance clears stored energy', () => {
		const arranger = createDrumArranger()
		play(arranger, 1, 0, 6)
		arranger.setPerformanceControl(false)
		arranger.updatePerson({ noteVelocity:0 }, 6)
		expect(arranger.getIntent().energy).toBe(1)
		arranger.setPerformanceControl(true)
		arranger.updatePerson({ noteVelocity:0 }, 7)
		expect(arranger.getIntent().energy).toBe(0)
	})
})
