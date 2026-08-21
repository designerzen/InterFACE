import {
	ARPEGGIO_GRID_BAR,
	ARPEGGIO_GRID_CLOCK,
	ARPEGGIO_GRID_HALF_NOTE,
	getArpeggioGateMs,
	getArpeggioTiming
} from '../source/timing/arpeggio.js'

describe('arpeggio timing', () => {
	test('keeps arpeggios on the half-note grid up to 90 BPM', () => {
		const timing = getArpeggioTiming(90, {
			isBar:false,
			isHalfNote:true
		})

		expect(timing.grid).toBe(ARPEGGIO_GRID_HALF_NOTE)
		expect(timing.shouldTrigger).toBe(true)
	})

	test('moves arpeggios to bar starts above 90 BPM', () => {
		const halfNoteTiming = getArpeggioTiming(120, {
			isBar:false,
			isHalfNote:true
		})
		const barTiming = getArpeggioTiming(120, {
			isBar:true,
			isHalfNote:false
		})

		expect(halfNoteTiming.grid).toBe(ARPEGGIO_GRID_BAR)
		expect(halfNoteTiming.shouldTrigger).toBe(false)
		expect(barTiming.shouldTrigger).toBe(true)
	})

	test('keeps a rest between arpeggio triggers', () => {
		const timing = getArpeggioTiming(150, {
			isBar:true,
			isHalfNote:false
		})

		expect(timing.gateMs).toBeLessThan(timing.intervalMs)
		expect(timing.intervalMs - timing.gateMs).toBeGreaterThanOrEqual(80)
	})

	test('forces special arpeggio voices to bar starts regardless of BPM', () => {
		const timing = getArpeggioTiming(70, {
			forceBar:true,
			isBar:true,
			isHalfNote:false
		})

		expect(timing.grid).toBe(ARPEGGIO_GRID_BAR)
		expect(timing.shouldTrigger).toBe(true)
	})

	test('caps long gates so arpeggios have audible shape at slower tempos', () => {
		expect(getArpeggioGateMs(60)).toBeLessThanOrEqual(900)
	})

	test('runs harp on every third clock division with a short articulated gate', () => {
		const timing = getArpeggioTiming(120, {
			divisionsElapsed:6,
			totalDivisions:24,
			tickDurationMs:40,
			clockStep:3
		})

		expect(timing.grid).toBe(ARPEGGIO_GRID_CLOCK)
		expect(timing.shouldTrigger).toBe(true)
		expect(timing.intervalMs).toBe(120)
		expect(timing.gateMs).toBeLessThan(timing.intervalMs)
		expect(getArpeggioTiming(120, { divisionsElapsed:7, totalDivisions:24, tickDurationMs:40, clockStep:3 }).shouldTrigger).toBe(false)
	})
})
