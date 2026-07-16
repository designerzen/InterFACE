export const ARPEGGIO_FAST_BPM_THRESHOLD = 90
export const ARPEGGIO_GRID_HALF_NOTE = "half-note"
export const ARPEGGIO_GRID_BAR = "bar"

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
