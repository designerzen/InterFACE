export const PERCUSSION_QUANTISE_TICKS = 3
export const PERCUSSION_SCHEDULE_AHEAD_SECONDS = 0.005
export const PERCUSSION_IMMEDIATE_DELAY_SECONDS = 0.01
export const PERCUSSION_HOLD_THRESHOLD_TICKS = 24

export const PERCUSSION_REPEAT_TICKS = Object.freeze({
	kick: 24,
	'sub-kick': 12,
	snare: 12,
	clap: 12,
	cowbell: 6,
	clack: 6,
	rim: 6,
	'low-tom': 12,
	'mid-tom': 6,
	'high-tom': 3,
	hat: 3,
	shaker: 3,
	ride: 6,
	crash: 24,
})

const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor

export const getNextPercussionGridTime = ({
	now,
	inputAudioTime = now,
	tickAudioTime,
	divisionsElapsed,
	tickDuration,
	ticksPerGrid = PERCUSSION_QUANTISE_TICKS,
	scheduleAhead = PERCUSSION_SCHEDULE_AHEAD_SECONDS,
}) => {
	if (
		!Number.isFinite(now)
		|| !Number.isFinite(inputAudioTime)
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
	const gridOrigin = tickAudioTime - divisionInGrid * tickDuration
	const gridsAfterOrigin = Math.max(
		0,
		Math.ceil((inputAudioTime - gridOrigin) / gridDuration)
	)
	let triggerAt = gridOrigin + gridsAfterOrigin * gridDuration
	const earliestTriggerAt = now + Math.max(0, scheduleAhead)

	if (triggerAt < earliestTriggerAt) {
		const gridsUntilFuture = Math.ceil((earliestTriggerAt - triggerAt) / gridDuration)
		triggerAt += gridsUntilFuture * gridDuration
	}

	return triggerAt
}

export const createPercussionQuantiser = (options={}) => {
	let timing = null

	return {
		update(nextTiming) {
			timing = nextTiming
		},
		getTriggerAt({ inputAudioTime, now }) {
			if (!timing) return null
			return getNextPercussionGridTime({
				...options,
				...timing,
				inputAudioTime,
				now,
			})
		},
	}
}

export const getPercussionTriggerTime = ({
	now,
	inputAudioTime = now,
	triggerAt,
	quantise,
	quantiser,
	immediateDelay = PERCUSSION_IMMEDIATE_DELAY_SECONDS,
}) => {
	if (Number.isFinite(triggerAt)) return triggerAt
	if (quantise) {
		const quantisedTriggerAt = quantiser?.getTriggerAt({ inputAudioTime, now })
		if (Number.isFinite(quantisedTriggerAt)) return quantisedTriggerAt
	}
	return now + immediateDelay
}

export const scheduleAtAudioTime = ({
	now,
	triggerAt,
	callback,
	setTimer = globalThis.setTimeout,
	clearTimer = globalThis.clearTimeout,
}) => {
	if (typeof callback !== 'function') return () => false

	const delay = (triggerAt - now) * 1000
	if (!Number.isFinite(delay) || delay <= 0) {
		callback()
		return () => false
	}

	let pending = true
	const timer = setTimer(() => {
		if (!pending) return
		pending = false
		callback()
	}, delay)

	return () => {
		if (!pending) return false
		pending = false
		clearTimer(timer)
		return true
	}
}

export const getPercussionRepeatTicks = part =>
	PERCUSSION_REPEAT_TICKS[part] ?? 6

export const createPercussionHoldRepeater = ({
	onRepeat,
	holdThresholdTicks = PERCUSSION_HOLD_THRESHOLD_TICKS,
}={}) => {
	const heldInputs = new Map()
	let tick = 0

	const release = inputId => heldInputs.delete(inputId)
	const releasePrefix = prefix => {
		let released = 0
		for (const inputId of heldInputs.keys()) {
			if (String(inputId).startsWith(prefix)) {
				heldInputs.delete(inputId)
				released++
			}
		}
		return released
	}

	return {
		press(inputId, part, options={}) {
			if (!inputId || !part || heldInputs.has(inputId)) return false
			heldInputs.set(inputId, {
				inputId,
				part,
				options,
				pressedAtTick: tick,
			})
			return true
		},
		release,
		releasePrefix,
		clear() {
			heldInputs.clear()
		},
		advance() {
			tick++
			const repeatedParts = new Set()
			for (const held of heldInputs.values()) {
				const heldTicks = tick - held.pressedAtTick
				const repeatTicks = getPercussionRepeatTicks(held.part)
				if (
					heldTicks >= holdThresholdTicks
					&& (heldTicks - holdThresholdTicks) % repeatTicks === 0
					&& !repeatedParts.has(held.part)
				) {
					repeatedParts.add(held.part)
					onRepeat?.(held.part, {
						...held.options,
						heldTicks,
						inputId: held.inputId,
					})
				}
			}
			return repeatedParts
		},
		get size() {
			return heldInputs.size
		},
	}
}
