export const ARPEGGIO_FAST_BPM_THRESHOLD = 90
export const ARPEGGIO_GRID_HALF_NOTE = "half-note"
export const ARPEGGIO_GRID_BAR = "bar"
export const ARPEGGIO_GRID_CLOCK = "clock"
export const DEFAULT_CLOCK_DIVISIONS_PER_BAR = 24

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export const getArpeggioGridForBPM = (bpm, forceBar=false) => {
	const numericBPM = Number(bpm)
	if (forceBar)
	{
		return ARPEGGIO_GRID_BAR
	}
	return Number.isFinite(numericBPM) && numericBPM > ARPEGGIO_FAST_BPM_THRESHOLD ?
		ARPEGGIO_GRID_BAR :
		ARPEGGIO_GRID_HALF_NOTE
}

export const getArpeggioTriggerIntervalMs = (bpm, grid=getArpeggioGridForBPM(bpm)) => {
	const numericBPM = Number(bpm)
	const safeBPM = Number.isFinite(numericBPM) && numericBPM > 0 ? numericBPM : ARPEGGIO_FAST_BPM_THRESHOLD
	const quarterNoteMs = 60000 / safeBPM
	return grid === ARPEGGIO_GRID_BAR ? quarterNoteMs * 4 : quarterNoteMs * 2
}

export const getArpeggioGateMs = (bpm, {
	grid = getArpeggioGridForBPM(bpm),
	gateRatio = 0.65,
	minimumGateMs = 80,
	maximumGateMs = 900,
	minimumRestMs = 80
}={}) => {
	const intervalMs = getArpeggioTriggerIntervalMs(bpm, grid)
	const upperGateMs = Math.max(minimumGateMs, Math.min(maximumGateMs, intervalMs - minimumRestMs))
	return Math.round(clamp(intervalMs * gateRatio, minimumGateMs, upperGateMs))
}

export const getArpeggioTiming = (bpm, options={}) => {
	const clockStep = Number(options.clockStep)
	if (Number.isInteger(clockStep) && clockStep > 0)
	{
		const numericTickDurationMs = Number(options.tickDurationMs)
		const divisionsElapsed = Number(options.divisionsElapsed)
		const totalDivisions = Number.isFinite(Number(options.totalDivisions)) && Number(options.totalDivisions) > 0 ?
			Number(options.totalDivisions) : DEFAULT_CLOCK_DIVISIONS_PER_BAR
		const fallbackBarMs = getArpeggioTriggerIntervalMs(bpm, ARPEGGIO_GRID_HALF_NOTE) * 2
		const tickDurationMs = Number.isFinite(numericTickDurationMs) && numericTickDurationMs > 0 ?
			numericTickDurationMs : fallbackBarMs / totalDivisions
		const intervalMs = tickDurationMs * clockStep
		const minimumRestMs = Math.min(12, intervalMs * 0.18)
		return {
			grid:ARPEGGIO_GRID_CLOCK,
			intervalMs,
			gateMs:Math.max(8, Math.round(intervalMs - minimumRestMs)),
			shouldTrigger:Number.isInteger(divisionsElapsed) && divisionsElapsed % clockStep === 0
		}
	}

	const grid = getArpeggioGridForBPM(bpm, options.forceBar)
	const intervalMs = getArpeggioTriggerIntervalMs(bpm, grid)
	const gateMs = getArpeggioGateMs(bpm, { ...options, grid })
	return {
		grid,
		intervalMs,
		gateMs,
		shouldTrigger: grid === ARPEGGIO_GRID_BAR ? Boolean(options.isBar) : Boolean(options.isHalfNote)
	}
}
