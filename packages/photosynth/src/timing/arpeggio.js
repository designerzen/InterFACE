export const ARPEGGIO_FAST_BPM_THRESHOLD = 90
export const ARPEGGIO_GRID_QUARTER_NOTE = "quarter-note"
export const ARPEGGIO_GRID_HALF_NOTE = "half-note"
export const ARPEGGIO_GRID_BAR = "bar"
export const ARPEGGIO_GRID_CLOCK = "clock"
export const DEFAULT_CLOCK_DIVISIONS_PER_BAR = 24
export const ARPEGGIO_VARIATION = "arpeggio"
export const HARP_ARPEGGIO_VARIATION = "harp"
export const ARPEGGIO_RATE_AUTO = "auto"
export const ARPEGGIO_RATE_SLOW = "slow"
export const ARPEGGIO_RATE_MEDIUM = "medium"
export const ARPEGGIO_RATE_FAST = "fast"

const ARPEGGIO_GRIDS = new Set([
	ARPEGGIO_GRID_QUARTER_NOTE,
	ARPEGGIO_GRID_HALF_NOTE,
	ARPEGGIO_GRID_BAR,
	ARPEGGIO_GRID_CLOCK
])

const ARPEGGIO_RATE_LABELS = Object.freeze({
	[ARPEGGIO_RATE_AUTO]:"Auto",
	[ARPEGGIO_RATE_SLOW]:"Slow",
	[ARPEGGIO_RATE_MEDIUM]:"Medium",
	[ARPEGGIO_RATE_FAST]:"Fast"
})

const ARPEGGIO_VARIATIONS = Object.freeze({
	[ARPEGGIO_VARIATION]:Object.freeze({ octaveSpan:1, clockStep:0 }),
	[HARP_ARPEGGIO_VARIATION]:Object.freeze({ octaveSpan:4, clockStep:4 })
})

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const normaliseArpeggioGrid = grid => ARPEGGIO_GRIDS.has(grid) ? grid : null

export const normaliseArpeggioRate = rate => ARPEGGIO_RATE_LABELS[rate] ? rate : ARPEGGIO_RATE_AUTO
export const getArpeggioRateLabel = rate => ARPEGGIO_RATE_LABELS[normaliseArpeggioRate(rate)]
export const isArpeggioPlayMode = playMode => playMode === ARPEGGIO_VARIATION || playMode === HARP_ARPEGGIO_VARIATION
export const hasPresentArpeggioPlayer = (people=[]) => people.some(person => person?.alive && isArpeggioPlayMode(person?.playMode))

export const getArpeggioTimingOptionsForRate = (rate, playMode=ARPEGGIO_VARIATION) => {
	switch (normaliseArpeggioRate(rate))
	{
		case ARPEGGIO_RATE_SLOW:
			return playMode === HARP_ARPEGGIO_VARIATION ? { clockStep:8 } : { grid:ARPEGGIO_GRID_BAR }
		case ARPEGGIO_RATE_MEDIUM:
			return playMode === HARP_ARPEGGIO_VARIATION ? { clockStep:4 } : { grid:ARPEGGIO_GRID_HALF_NOTE }
		case ARPEGGIO_RATE_FAST:
			return playMode === HARP_ARPEGGIO_VARIATION ? { clockStep:2 } : { grid:ARPEGGIO_GRID_QUARTER_NOTE }
		default:
			return {}
	}
}

export const getArpeggioGridForBPM = (bpm, forceBar=false) => {
	const numericBPM = Number(bpm)
	if (forceBar)
	{
		return ARPEGGIO_GRID_BAR
	}
	return Number.isFinite(numericBPM) && numericBPM > ARPEGGIO_FAST_BPM_THRESHOLD ?
		ARPEGGIO_GRID_HALF_NOTE :
		ARPEGGIO_GRID_QUARTER_NOTE
}

export const getArpeggioTriggerIntervalMs = (bpm, grid=getArpeggioGridForBPM(bpm)) => {
	const numericBPM = Number(bpm)
	const safeBPM = Number.isFinite(numericBPM) && numericBPM > 0 ? numericBPM : ARPEGGIO_FAST_BPM_THRESHOLD
	const quarterNoteMs = 60000 / safeBPM
	return grid === ARPEGGIO_GRID_BAR ? quarterNoteMs * 4 :
		grid === ARPEGGIO_GRID_HALF_NOTE ? quarterNoteMs * 2 : quarterNoteMs
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

	const grid = normaliseArpeggioGrid(options.grid) ?? getArpeggioGridForBPM(bpm, options.forceBar)
	const intervalMs = getArpeggioTriggerIntervalMs(bpm, grid)
	const gateMs = getArpeggioGateMs(bpm, { ...options, grid })
	return {
		grid,
		intervalMs,
		gateMs,
		shouldTrigger: grid === ARPEGGIO_GRID_BAR ? Boolean(options.isBar) :
			grid === ARPEGGIO_GRID_HALF_NOTE ? Boolean(options.isHalfNote) : Boolean(options.isQuarterNote)
	}
}

export class Arpeggio {
	enabled = false
	variation = ARPEGGIO_VARIATION
	config = ARPEGGIO_VARIATIONS[ARPEGGIO_VARIATION]

	configure(value=false){
		if (!value || value === "chord")
		{
			this.enabled = false
			return this.config
		}

		const variation = typeof value === "string" ? value : value.variation ?? ARPEGGIO_VARIATION
		this.variation = ARPEGGIO_VARIATIONS[variation] ? variation : ARPEGGIO_VARIATION
		const baseConfig = ARPEGGIO_VARIATIONS[this.variation]
		this.config = typeof value === "object" ? Object.freeze({
			octaveSpan:Number.isInteger(value.octaveSpan) && value.octaveSpan > 0 ? value.octaveSpan : baseConfig.octaveSpan,
			clockStep:Number.isInteger(value.clockStep) && value.clockStep >= 0 ? value.clockStep : baseConfig.clockStep
		}) : baseConfig
		this.enabled = true
		return this.config
	}

	getSequence(chordArray=[]){
		const sequence = []
		for (let octave=0; octave<this.config.octaveSpan; ++octave)
		{
			const octaveOffset = octave * 12
			chordArray.forEach(chord => {
				const noteNumber = chord?.noteNumber + octaveOffset
				if (Number.isFinite(noteNumber) && noteNumber <= 127)
				{
					sequence.push({ ...chord, noteNumber })
				}
			})
		}
		return sequence
	}

	getTiming(bpm, options={}){
		return getArpeggioTiming(bpm, { clockStep:this.config.clockStep, ...options })
	}
}
