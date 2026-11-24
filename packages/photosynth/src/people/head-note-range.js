import { clamp, ONE_DEGREE_IN_RADIANS } from "../maths/maths.js"

export const DEFAULT_HEAD_NOTE_RANGE_DEGREES = 90
export const MIN_HEAD_NOTE_RANGE_DEGREES = 20
export const MAX_HEAD_NOTE_RANGE_DEGREES = 120
export const HEAD_NOTE_RANGE_INHERIT = "inherit"
export const DEFAULT_HEAD_VERTICAL_RANGE_DEGREES = 90
export const MIN_HEAD_VERTICAL_RANGE_DEGREES = 20
export const MAX_HEAD_VERTICAL_RANGE_DEGREES = 120
export const HEAD_VERTICAL_RANGE_INHERIT = "inherit"
// Head angle (up is positive) that sits in the middle of the octaves.
// Above zero, looking straight ahead plays below the middle octave.
export const DEFAULT_HEAD_VERTICAL_OFFSET_DEGREES = 10
export const MIN_HEAD_VERTICAL_OFFSET_DEGREES = -30
export const MAX_HEAD_VERTICAL_OFFSET_DEGREES = 30

const LEGACY_HEAD_ROLL_RANGE_DEGREES = (2 / 1.3) / ONE_DEGREE_IN_RADIANS

export const normaliseHeadNoteRangeDegrees = (
	value,
	fallback = DEFAULT_HEAD_NOTE_RANGE_DEGREES
) => {
	const parsedValue = Number(value)
	const parsedFallback = Number(fallback)
	const safeFallback = Number.isFinite(parsedFallback) ?
		parsedFallback :
		DEFAULT_HEAD_NOTE_RANGE_DEGREES
	return Math.round(clamp(
		Number.isFinite(parsedValue) ? parsedValue : safeFallback,
		MIN_HEAD_NOTE_RANGE_DEGREES,
		MAX_HEAD_NOTE_RANGE_DEGREES
	))
}

export const normaliseHeadNoteRangeOverride = value => {
	if (value === undefined || value === null || value === "" || value === HEAD_NOTE_RANGE_INHERIT)
	{
		return HEAD_NOTE_RANGE_INHERIT
	}
	return normaliseHeadNoteRangeDegrees(value)
}

export const resolveHeadNoteRangeDegrees = (globalValue, override) => {
	const normalisedOverride = normaliseHeadNoteRangeOverride(override)
	return normalisedOverride === HEAD_NOTE_RANGE_INHERIT ?
		normaliseHeadNoteRangeDegrees(globalValue) :
		normalisedOverride
}

export const normaliseHeadVerticalRangeDegrees = (
	value,
	fallback = DEFAULT_HEAD_VERTICAL_RANGE_DEGREES
) => {
	const parsedValue = Number(value)
	const parsedFallback = Number(fallback)
	const safeFallback = Number.isFinite(parsedFallback) ?
		parsedFallback :
		DEFAULT_HEAD_VERTICAL_RANGE_DEGREES
	return Math.round(clamp(
		Number.isFinite(parsedValue) ? parsedValue : safeFallback,
		MIN_HEAD_VERTICAL_RANGE_DEGREES,
		MAX_HEAD_VERTICAL_RANGE_DEGREES
	))
}

export const normaliseHeadVerticalRangeOverride = value => {
	if (value === undefined || value === null || value === "" || value === HEAD_VERTICAL_RANGE_INHERIT)
	{
		return HEAD_VERTICAL_RANGE_INHERIT
	}
	return normaliseHeadVerticalRangeDegrees(value)
}

export const resolveHeadVerticalRangeDegrees = (globalValue, override) => {
	const normalisedOverride = normaliseHeadVerticalRangeOverride(override)
	return normalisedOverride === HEAD_VERTICAL_RANGE_INHERIT ?
		normaliseHeadVerticalRangeDegrees(globalValue) :
		normalisedOverride
}

export const normaliseHeadVerticalOffsetDegrees = value => {
	const parsedValue = Number(value)
	return Math.round(clamp(
		Number.isFinite(parsedValue) ? parsedValue : DEFAULT_HEAD_VERTICAL_OFFSET_DEGREES,
		MIN_HEAD_VERTICAL_OFFSET_DEGREES,
		MAX_HEAD_VERTICAL_OFFSET_DEGREES
	))
}

export const normaliseHeadRollForRange = (prediction, rangeDegrees) => {
	const safeRange = normaliseHeadNoteRangeDegrees(rangeDegrees)
	const halfRangeRadians = safeRange * 0.5 * ONE_DEGREE_IN_RADIANS
	const headRollRadians = Number(prediction?.headRollRadians)
	if (Number.isFinite(headRollRadians))
	{
		return clamp(headRollRadians / halfRangeRadians, -1, 1)
	}

	const legacyRoll = Number(prediction?.roll)
	return Number.isFinite(legacyRoll) ?
		clamp(legacyRoll * LEGACY_HEAD_ROLL_RANGE_DEGREES / safeRange, -1, 1) :
		0
}

// A pitch of ±1 spans half of the default range either side of level.
export const normaliseHeadPitchForRange = (prediction, rangeDegrees, offsetDegrees = 0) => {
	const safeRange = normaliseHeadVerticalRangeDegrees(rangeDegrees)
	const offset = clamp(Number(offsetDegrees) || 0, MIN_HEAD_VERTICAL_OFFSET_DEGREES, MAX_HEAD_VERTICAL_OFFSET_DEGREES)
	const pitch = Number(prediction?.pitch)
	return Number.isFinite(pitch) ?
		clamp((pitch * DEFAULT_HEAD_VERTICAL_RANGE_DEGREES * 0.5 - offset) * 2 / safeRange, -1, 1) :
		0
}

export const getHeadNoteIndex = (notePosition, numberOfNotes) => {
	const safeNumberOfNotes = Math.max(0, Math.floor(Number(numberOfNotes) || 0))
	if (safeNumberOfNotes === 0)
	{
		return -1
	}
	const percentage = clamp((Number(notePosition) + 1) * 0.5, 0, 1)
	return Math.round(percentage * (safeNumberOfNotes - 1))
}
