import { cosine, ONE_DEGREE_IN_RADIANS, sine } from "../maths/maths.js"
import { normaliseHeadNoteRangeDegrees } from "../people/head-note-range.js"

export const createNoteCircleData = (
	cx,
	cy,
	rangeDegrees = 90,
	radius = 70,
	numberOfPoints = 12
) => {
	const safeRange = normaliseHeadNoteRangeDegrees(rangeDegrees)
	const safeNumberOfPoints = Math.max(0, Math.floor(Number(numberOfPoints) || 0))
	const halfRange = safeRange * 0.5
	const startAngleRadians = (90 - halfRange) * ONE_DEGREE_IN_RADIANS
	const endAngleRadians = (90 + halfRange) * ONE_DEGREE_IN_RADIANS
	const angleIncrement = safeNumberOfPoints > 1 ?
		(endAngleRadians - startAngleRadians) / (safeNumberOfPoints - 1) :
		0

	return Array.from({length:safeNumberOfPoints}, (_, index) => {
		const currentAngle = startAngleRadians + index * angleIncrement
		return {
			x:cx + radius * cosine(currentAngle),
			y:cy - radius * sine(currentAngle)
		}
	})
}
