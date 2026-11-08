import { createPercussionDynamics } from '../source/audio/synthesizers/percussion-dynamics.js'

describe('lightweight percussion dynamics', () => {
	test('preserves an isolated full-strength hit and reuses the response object', () => {
		const strike = createPercussionDynamics()
		const first = strike({ velocity:1 }, 1)
		expect(Object.values(first).every(value => value === 1)).toBe(true)
		expect(strike({ velocity:0.3 }, 1.1)).toBe(first)
	})

	test('gives edge strikes more ring and centre strikes more body', () => {
		const options = { velocity:1, strikeVariation:0 }
		const centre = createPercussionDynamics()({ ...options, strikePosition:0 }, 1)
		const edge = createPercussionDynamics()({ ...options, strikePosition:1 }, 1)
		expect(centre.bodyGain).toBeGreaterThan(edge.bodyGain)
		expect(edge.ringGain).toBeGreaterThan(centre.ringGain)
		expect(edge.brightness).toBeGreaterThan(centre.brightness)
	})

	test('responds to previous energy and fully recovers after a pause', () => {
		const strike = createPercussionDynamics()
		const options = { velocity:0.3, strikeVariation:0 }
		const isolated = { ...strike(options, 1) }
		strike({ ...options, velocity:1 }, 2)
		const rebound = { ...strike(options, 2.03) }
		expect(rebound.attackGain).toBeLessThan(isolated.attackGain)
		expect(rebound.ringGain).toBeGreaterThan(isolated.ringGain)
		expect(rebound.wireDecay).toBeLessThan(isolated.wireDecay)
		expect(strike(options, 3)).toEqual(isolated)
	})

	test('shortens body, ringing and wire tails independently for ghost notes and damping', () => {
		const loud = createPercussionDynamics()({ velocity:1 }, 1)
		const soft = createPercussionDynamics()({ velocity:0.1 }, 1)
		const muted = createPercussionDynamics()({ velocity:1, damping:1 }, 1)
		expect(soft.bodyDecay).toBeLessThan(loud.bodyDecay)
		expect(soft.wireDecay).toBeLessThan(soft.bodyDecay)
		expect(muted.ringDecay).toBeLessThan(muted.bodyDecay)
		expect(muted.bodyDecay).toBeLessThan(soft.bodyDecay)
	})

	test('varies strokes subtly and repeatably, and resets with the instrument', () => {
		const strike = createPercussionDynamics()
		const options = { velocity:1 }
		const first = { ...strike(options, 1) }
		const second = { ...strike(options, 2) }
		expect(second.bodyGain).not.toBe(first.bodyGain)
		expect(Math.abs(second.bodyGain - first.bodyGain)).toBeLessThan(0.03)
		expect(Math.abs(second.pitchAttack - 1)).toBeLessThan(0.001)
		strike.reset()
		expect(strike(options, 1)).toEqual(first)
		expect(strike(options, 2)).toEqual(second)
	})

	test('can disable the additions and bounds extreme control inputs', () => {
		const strike = createPercussionDynamics()
		strike({ velocity:1 }, 1)
		const disabled = strike({ velocity:0.1, dynamicsAmount:0, strikePosition:1, damping:1 }, 1.02)
		expect(Object.values(disabled).every(value => value === 1)).toBe(true)
		const extreme = strike({ velocity:100, damping:100, strikePosition:-100, strikeVariation:100 }, 1.04)
		expect(Object.values(extreme).every(value => Number.isFinite(value) && value > 0 && value < 2)).toBe(true)
	})

	test('muted and out-of-order events do not contaminate subsequent hit history', () => {
		const first = createPercussionDynamics()
		const second = createPercussionDynamics()
		const options = { velocity:0.8 }
		first(options, 2)
		second(options, 2)
		first({ velocity:0 }, 2.01)
		first(options, 1.9)
		expect(first(options, 2.05)).toEqual(second(options, 2.05))
	})
})
