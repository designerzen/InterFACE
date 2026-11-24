export const LIP_SENSITIVITY_INHERIT = 'inherit'
export const DEFAULT_LIP_RANGE = 100
// Percent of the sine-shaped amplitude domain needed before a note starts.
export const DEFAULT_MOUTH_GATE = 6
export const MAX_MOUTH_GATE = 40
export const MOUTH_CURVE_CUSTOM = 'custom'
export const MAX_MOUTH_CURVE_POINTS = 8
// Handles may not overlap horizontally, so the curve stays a function.
export const MOUTH_CURVE_MIN_GAP = 2

// Each curve maps opening above the gate (x) to loudness (y), both 0–100.
// The ends are fixed: the gate is silent and full travel reaches full volume.
export const MOUTH_DYNAMICS_PRESETS = [
	{ id:'whisper', label:'Whisper', description:'Long quiet zone, loud only when wide open', points:[[0, 0], [30, 3], [60, 14], [85, 48], [100, 100]] },
	{ id:'gentle', label:'Gentle', description:'Quiet notes first, then a steady rise', points:[[0, 0], [25, 5], [50, 20], [75, 52], [100, 100]] },
	{ id:'natural', label:'Natural', description:'Even rise with a soft start', points:[[0, 0], [33, 14], [66, 48], [100, 100]] },
	{ id:'linear', label:'Linear', description:'Volume follows the opening directly', points:[[0, 0], [100, 100]] },
	{ id:'swell', label:'Swell', description:'Quiet and loud plateaus with a fast middle', points:[[0, 0], [35, 10], [50, 50], [65, 90], [100, 100]] },
	{ id:'punchy', label:'Punchy', description:'Loud almost as soon as the mouth opens', points:[[0, 0], [15, 45], [40, 80], [100, 100]] }
]
export const DEFAULT_MOUTH_DYNAMICS = 'gentle'

const clampPercent = value => Math.min(100, Math.max(0, value))
const round = value => Math.round(value * 10) / 10

const normaliseRange = (value, fallback, labels) => {
	if (Object.hasOwn(labels, value)) return labels[value]
	if (value === null || value === undefined || value === '' || typeof value === 'boolean') return fallback
	const numeric = Number(value)
	return Number.isFinite(numeric) ? Math.round(clampPercent(numeric)) : fallback
}
export const normaliseLipRange = value => normaliseRange(value, DEFAULT_LIP_RANGE, { short:0, long:100 })
export const normaliseLipRangeOverride = value => normaliseRange(value, LIP_SENSITIVITY_INHERIT, { short:0, long:100 })
export const normaliseMouthGate = value => {
	const numeric = value === null || value === '' || typeof value === 'boolean' ? NaN : Number(value)
	return Number.isFinite(numeric) ? Math.round(Math.min(MAX_MOUTH_GATE, Math.max(0, numeric))) : DEFAULT_MOUTH_GATE
}

const getPreset = id => MOUTH_DYNAMICS_PRESETS.find(preset => preset.id === id)

// Curves are stored as "c0x0_25x5_100x100" because state values containing
// commas are read back as arrays, and leading digits are read as numbers.
const readPoints = value => {
	if (typeof value === 'string') {
		const preset = getPreset(value)
		if (preset) return preset.points
		if (!value.startsWith('c')) return null
		return value.slice(1).split('_').map(pair => pair.split('x').map(Number))
	}
	if (Array.isArray(value)) return value.map(point => Array.isArray(point) ? point : [point?.x, point?.y])
	return null
}

/**
 * Sorts, clamps and spaces handles, pinning the ends to silence and full volume
 * @returns {Array<Array<Number>>|null} null when the value is not a curve
 */
export const parseMouthCurve = value => {
	const raw = readPoints(value)?.map(([x, y]) => [Number(x), Number(y)]).filter(point => point.every(Number.isFinite))
	if (!raw?.length) return null
	const inner = raw.map(([x, y]) => [round(clampPercent(x)), round(clampPercent(y))])
		.filter(([x]) => x > 0 && x < 100)
		.sort((a, b) => a[0] - b[0])
	const points = [[0, 0]]
	for (const point of inner) {
		if (points.length >= MAX_MOUTH_CURVE_POINTS - 1) break
		if (point[0] - points.at(-1)[0] >= MOUTH_CURVE_MIN_GAP && 100 - point[0] >= MOUTH_CURVE_MIN_GAP) points.push(point)
	}
	points.push([100, 100])
	return points
}

export const serialiseMouthCurve = points => `c${(parseMouthCurve(points) ?? getPreset(DEFAULT_MOUTH_DYNAMICS).points).map(([x, y]) => `${x}x${y}`).join('_')}`

export const normaliseMouthDynamics = value => serialiseMouthCurve(parseMouthCurve(value) ?? DEFAULT_MOUTH_DYNAMICS)
export const normaliseMouthDynamicsOverride = value => parseMouthCurve(value) ? serialiseMouthCurve(parseMouthCurve(value)) : LIP_SENSITIVITY_INHERIT

export const getMouthDynamicsPresetId = value => {
	const curve = normaliseMouthDynamics(value)
	return MOUTH_DYNAMICS_PRESETS.find(preset => serialiseMouthCurve(preset.points) === curve)?.id ?? MOUTH_CURVE_CUSTOM
}

export const formatMouthDynamics = value => {
	const id = getMouthDynamicsPresetId(value)
	return id === MOUTH_CURVE_CUSTOM ? 'Custom curve' : getPreset(id).label
}

/**
 * Monotone cubic (Fritsch–Carlson) interpolation: smooth between handles
 * without overshooting them, so a flat quiet section stays flat.
 * @param {Array<Array<Number>>} points handles in 0–100
 * @param {Number} t opening in 0–1
 * @returns {Number} loudness in 0–1
 */
let cachedCurveKey, cachedCurve
export const evaluateMouthCurve = (points, t) => {
	if (typeof points !== 'string' || points !== cachedCurveKey) {
		cachedCurve = parseMouthCurve(points) ?? getPreset(DEFAULT_MOUTH_DYNAMICS).points
		cachedCurveKey = typeof points === 'string' ? points : undefined
	}
	const curve = cachedCurve
	const x = clampPercent((Number(t) || 0) * 100)
	const n = curve.length
	const slopes = []
	for (let i = 0; i < n - 1; i++) slopes.push((curve[i + 1][1] - curve[i][1]) / (curve[i + 1][0] - curve[i][0]))
	const tangents = curve.map((_, i) => i === 0 ? slopes[0] : i === n - 1 ? slopes[n - 2] : slopes[i - 1] * slopes[i] <= 0 ? 0 : (slopes[i - 1] + slopes[i]) / 2)
	for (let i = 0; i < n - 1; i++) {
		if (slopes[i] === 0) { tangents[i] = tangents[i + 1] = 0; continue }
		const a = tangents[i] / slopes[i], b = tangents[i + 1] / slopes[i]
		const length = Math.hypot(a, b)
		if (length > 3) {
			tangents[i] = 3 * a / length * slopes[i]
			tangents[i + 1] = 3 * b / length * slopes[i]
		}
	}
	let i = 0
	while (i < n - 2 && x > curve[i + 1][0]) i++
	const [x0, y0] = curve[i], [x1, y1] = curve[i + 1]
	const h = x1 - x0
	const s = (x - x0) / h
	const s2 = s * s, s3 = s2 * s
	const y = (2 * s3 - 3 * s2 + 1) * y0 + (s3 - 2 * s2 + s) * h * tangents[i] + (-2 * s3 + 3 * s2) * y1 + (s3 - s2) * h * tangents[i + 1]
	return Math.min(1, Math.max(0, y / 100))
}

export const resolveLipSetting = (options, key) => {
	if (key === 'mouthDynamics') {
		const override = normaliseMouthDynamicsOverride(options.mouthDynamicsOverride)
		return override === LIP_SENSITIVITY_INHERIT ? normaliseMouthDynamics(options.mouthDynamics) : override
	}
	const override = normaliseLipRangeOverride(options.lipRangeOverride)
	return override === LIP_SENSITIVITY_INHERIT ? normaliseLipRange(options.lipRange) : override
}

export const formatLipSetting = (key, value) => {
	if (key === 'mouthGate') return `${normaliseMouthGate(value)}%`
	if (key === 'mouthDynamics') return formatMouthDynamics(value)
	const amount = normaliseLipRange(value)
	return amount === 0 ? 'Short' : amount === 100 ? 'Long' : `${amount}% long`
}

export const normaliseLipOptions = options => {
	const result = { ...options }
	for (const [key, normalise] of Object.entries({
		lipRange:normaliseLipRange,
		lipRangeOverride:normaliseLipRangeOverride,
		mouthDynamics:normaliseMouthDynamics,
		mouthDynamicsOverride:normaliseMouthDynamicsOverride
	})) {
		if (Object.hasOwn(result, key)) result[key] = normalise(result[key])
	}
	return result
}

// Gate thresholds stay in the existing sine-shaped amplitude domain. Shape
// loudness separately so a quieter curve does not require opening further
// just to start a note. Every curve starts at silence at the gate boundary.
/**
 * Where an opening sits along the curve's x axis, 0 at the gate and 1 at full range
 */
export const getLipCurvePosition = (opening, options={}, rawOpening) => {
	const range = resolveLipSetting(options, 'lipRange') / 100
	const cutoff = Math.min(1, Math.max(0, Number(options.mouthCutOff) || 0))
	let start = Math.acos(1 - cutoff) * 2 / Math.PI
	// Tracking exaggerates small openings for expression recognition. Use the
	// original opening for audio, with the same gate boundary in that domain.
	if (Number.isFinite(rawOpening)) {
		start = Math.asin(Math.min(1, -Math.log2(1 - start) / 10)) * 2 / Math.PI
		opening = rawOpening
	}
	const end = start + (1 - start) * (0.5 + range * 0.5)
	return Number.isFinite(opening) ? Math.min(1, Math.max(0, (opening - start) / (end - start || 1))) : 0
}

export const getLipVolume = (opening, options={}, rawOpening) => {
	const value = getLipCurvePosition(opening, options, rawOpening)
	return value <= 0 ? 0 : evaluateMouthCurve(resolveLipSetting(options, 'mouthDynamics'), value)
}
