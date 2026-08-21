import { getVelocityEnvelopeLevels } from '../source/audio/synthesizers/percussion-envelope.js'

describe('percussion velocity envelopes', () => {
	test.each([
		['kick', 0.9, 1],
		['tom', 0.7, 1],
		['hat', 0.65, 1.35],
		['clap', 0.8, 1],
		['cowbell', 0.55, 0.4]
	])('%s sustain remains proportional to hit velocity', (_instrument, sustain, gain) => {
		const quiet = getVelocityEnvelopeLevels({ velocity:0.2, sustain }, gain)
		const loud = getVelocityEnvelopeLevels({ velocity:0.8, sustain }, gain)

		expect(quiet.sustain).toBeCloseTo(quiet.peak * sustain)
		expect(loud.sustain).toBeCloseTo(loud.peak * sustain)
		expect(loud.sustain / quiet.sustain).toBeCloseTo(4)
	})
})
