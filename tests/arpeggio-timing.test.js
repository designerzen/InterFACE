import {
	ARPEGGIO_RATE_AUTO,
	ARPEGGIO_RATE_FAST,
	ARPEGGIO_RATE_MEDIUM,
	ARPEGGIO_RATE_SLOW,
	ARPEGGIO_GRID_BAR,
	ARPEGGIO_GRID_CLOCK,
	ARPEGGIO_GRID_HALF_NOTE,
	ARPEGGIO_GRID_QUARTER_NOTE,
	getArpeggioGateMs,
	getArpeggioRateLabel,
	getArpeggioTiming,
	getArpeggioTimingOptionsForRate,
	hasPresentArpeggioPlayer,
	normaliseArpeggioRate
} from '../source/timing/arpeggio.js'

describe('arpeggio timing', () => {
	test('runs arpeggios on the quarter-note grid up to 90 BPM', () => {
		const timing = getArpeggioTiming(90, {
			isBar:false,
			isHalfNote:false,
			isQuarterNote:true
		})

		expect(timing.grid).toBe(ARPEGGIO_GRID_QUARTER_NOTE)
		expect(timing.shouldTrigger).toBe(true)
	})

	test('moves arpeggios to half notes above 90 BPM', () => {
		const quarterNoteTiming = getArpeggioTiming(120, {
			isBar:false,
			isHalfNote:false,
			isQuarterNote:true
		})
		const halfNoteTiming = getArpeggioTiming(120, {
			isBar:false,
			isHalfNote:true,
			isQuarterNote:false
		})

		expect(quarterNoteTiming.grid).toBe(ARPEGGIO_GRID_HALF_NOTE)
		expect(quarterNoteTiming.shouldTrigger).toBe(false)
		expect(halfNoteTiming.shouldTrigger).toBe(true)
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

	test('allows explicit global arpeggio rate overrides to replace BPM-derived timing', () => {
		const slowTiming = getArpeggioTiming(120, {
			grid:ARPEGGIO_GRID_BAR,
			isBar:true,
			isHalfNote:false,
			isQuarterNote:true
		})
		const mediumTiming = getArpeggioTiming(120, {
			grid:ARPEGGIO_GRID_HALF_NOTE,
			isBar:false,
			isHalfNote:true,
			isQuarterNote:true
		})
		const fastTiming = getArpeggioTiming(120, {
			grid:ARPEGGIO_GRID_QUARTER_NOTE,
			isBar:false,
			isHalfNote:false,
			isQuarterNote:true
		})

		expect(slowTiming.grid).toBe(ARPEGGIO_GRID_BAR)
		expect(slowTiming.shouldTrigger).toBe(true)
		expect(mediumTiming.grid).toBe(ARPEGGIO_GRID_HALF_NOTE)
		expect(mediumTiming.shouldTrigger).toBe(true)
		expect(fastTiming.grid).toBe(ARPEGGIO_GRID_QUARTER_NOTE)
		expect(fastTiming.shouldTrigger).toBe(true)
	})

	test('caps long gates so arpeggios have audible shape at slower tempos', () => {
		expect(getArpeggioGateMs(60)).toBeLessThanOrEqual(900)
	})

	test('runs harp on every fourth clock division with a short articulated gate', () => {
		const timing = getArpeggioTiming(120, {
			divisionsElapsed:8,
			totalDivisions:24,
			tickDurationMs:40,
			clockStep:4
		})

		expect(timing.grid).toBe(ARPEGGIO_GRID_CLOCK)
		expect(timing.shouldTrigger).toBe(true)
		expect(timing.intervalMs).toBe(160)
		expect(timing.gateMs).toBeLessThan(timing.intervalMs)
		expect(getArpeggioTiming(120, { divisionsElapsed:9, totalDivisions:24, tickDurationMs:40, clockStep:4 }).shouldTrigger).toBe(false)
	})

	test('maps global arp rate presets to expected timing overrides', () => {
		expect(normaliseArpeggioRate()).toBe(ARPEGGIO_RATE_AUTO)
		expect(normaliseArpeggioRate('nope')).toBe(ARPEGGIO_RATE_AUTO)
		expect(getArpeggioRateLabel(ARPEGGIO_RATE_FAST)).toBe('Fast')
		expect(getArpeggioTimingOptionsForRate(ARPEGGIO_RATE_SLOW, 'arpeggio')).toEqual({ grid:ARPEGGIO_GRID_BAR })
		expect(getArpeggioTimingOptionsForRate(ARPEGGIO_RATE_MEDIUM, 'arpeggio')).toEqual({ grid:ARPEGGIO_GRID_HALF_NOTE })
		expect(getArpeggioTimingOptionsForRate(ARPEGGIO_RATE_FAST, 'arpeggio')).toEqual({ grid:ARPEGGIO_GRID_QUARTER_NOTE })
		expect(getArpeggioTimingOptionsForRate(ARPEGGIO_RATE_SLOW, 'harp')).toEqual({ clockStep:8 })
		expect(getArpeggioTimingOptionsForRate(ARPEGGIO_RATE_MEDIUM, 'harp')).toEqual({ clockStep:4 })
		expect(getArpeggioTimingOptionsForRate(ARPEGGIO_RATE_FAST, 'harp')).toEqual({ clockStep:2 })
	})

	test('detects when a present person can hear arp changes', () => {
		expect(hasPresentArpeggioPlayer([
			{ alive:false, playMode:'arpeggio' },
			{ alive:true, playMode:'chord' }
		])).toBe(false)
		expect(hasPresentArpeggioPlayer([
			{ alive:true, playMode:'harp' }
		])).toBe(true)
	})
})
