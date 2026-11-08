import { createRetriggerableDecay, getVelocityEnvelopeLevels, getVelocityTone } from '../source/audio/synthesizers/percussion-envelope.js'
import { ZERO } from '../source/audio/audio-constants.js'

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

describe('percussion tone and retrigger continuity', () => {
	test('retains full-hit tone, darkens soft hits and supports disabling the response', () => {
		expect(getVelocityTone({ velocity:1 })).toBe(1)
		expect(getVelocityTone({ velocity:3 })).toBe(1)
		expect(getVelocityTone({ velocity:0.2 })).toBeLessThan(getVelocityTone({ velocity:0.8 }))
		expect(getVelocityTone({ velocity:0.2, velocityToneAmount:0 })).toBe(1)
	})

	test.each([true, false])('holds a future retrigger at the scheduled level (native hold: %s)', nativeHold => {
		const parameter = {
			value:1,
			setValueAtTime:jest.fn(), cancelScheduledValues:jest.fn(),
			linearRampToValueAtTime:jest.fn(), exponentialRampToValueAtTime:jest.fn(),
			...(nativeHold ? { cancelAndHoldAtTime:jest.fn() } : {}),
		}
		const envelope = createRetriggerableDecay(parameter)
		envelope.trigger(1, 0.8, 1.4, 0.001, 0.9)
		const previousLevel = envelope.levelAt(1.02)
		envelope.trigger(1.02, 0.4, 1.42, 0.001, 0.9)
		expect(parameter.setValueAtTime).toHaveBeenLastCalledWith(previousLevel, 1.02)
		expect(previousLevel).toBeGreaterThan(0)
		expect(envelope.levelAt(1.0205)).toBeCloseTo((previousLevel + 0.4) / 2)
		expect(envelope.levelAt(1.42)).toBe(ZERO)
		const chokeLevel = envelope.levelAt(1.03)
		envelope.choke(1.03, 0.006)
		expect(parameter.setValueAtTime).toHaveBeenLastCalledWith(chokeLevel, 1.03)
		expect(envelope.levelAt(1.036)).toBe(ZERO)
	})
})
