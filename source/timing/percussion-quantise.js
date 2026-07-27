export const PERCUSSION_QUANTISE_TICKS = 3
export const PERCUSSION_SCHEDULE_AHEAD_SECONDS = 0.005
export const PERCUSSION_IMMEDIATE_DELAY_SECONDS = 0.01

const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor

export const getIdealTickAudioTime = (audioTime, timePassed, expected) => {
	if (
		Number.isFinite(audioTime)
		&& Number.isFinite(timePassed)
		&& Number.isFinite(expected)
	) {
		return audioTime - (timePassed - expected)
	}
	return audioTime
}

export const getNextPercussionGridTime = ({
	now,
	tickAudioTime,
	divisionsElapsed,
	tickDuration,
	ticksPerGrid = PERCUSSION_QUANTISE_TICKS,
	scheduleAhead = PERCUSSION_SCHEDULE_AHEAD_SECONDS,
}) => {
	if (
		!Number.isFinite(now)
		|| !Number.isFinite(tickAudioTime)
		|| !Number.isFinite(divisionsElapsed)
		|| !Number.isFinite(tickDuration)
		|| tickDuration <= 0
		|| !Number.isInteger(ticksPerGrid)
		|| ticksPerGrid < 1
	) {
		return null
	}

	const gridDuration = tickDuration * ticksPerGrid
	const divisionInGrid = modulo(divisionsElapsed, ticksPerGrid)
	const ticksUntilGrid = modulo(ticksPerGrid - divisionInGrid, ticksPerGrid)
	let triggerAt = tickAudioTime + ticksUntilGrid * tickDuration
	const earliestTriggerAt = now + Math.max(0, scheduleAhead)

	if (triggerAt < earliestTriggerAt) {
		const gridsUntilFuture = Math.ceil((earliestTriggerAt - triggerAt) / gridDuration)
		triggerAt += Math.max(1, gridsUntilFuture) * gridDuration
	}

	return triggerAt
}

export const createPercussionQuantiser = (options={}) => {
	let timing = null

	return {
		update(nextTiming) {
			timing = nextTiming
		},
		getTriggerAt(now) {
			if (!timing) return null
			return getNextPercussionGridTime({ ...options, ...timing, now })
		},
	}
}

export const getPercussionTriggerTime = ({
	now,
	triggerAt,
	quantise,
	quantiser,
	immediateDelay = PERCUSSION_IMMEDIATE_DELAY_SECONDS,
}) => {
	if (Number.isFinite(triggerAt)) return triggerAt
	if (quantise) {
		const quantisedTriggerAt = quantiser?.getTriggerAt(now)
		if (Number.isFinite(quantisedTriggerAt)) return quantisedTriggerAt
	}
	return now + immediateDelay
}
