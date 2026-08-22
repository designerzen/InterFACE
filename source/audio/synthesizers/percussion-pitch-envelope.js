const positive = (value, fallback) => Number.isFinite(Number(value)) && Number(value) > 0
	? Number(value)
	: fallback

export const resolvePercussionPitchEnvelope = (options, startAt, voiceEndAt) => {
	const available = Math.max(0, voiceEndAt - startAt)
	const requestedDecay = positive(options.pitchDecay, available)
	return {
		startRatio:positive(options.pitchStartRatio, 1),
		endRatio:positive(options.pitchEndRatio, 1),
		endAt:startAt + Math.min(available, requestedDecay),
	}
}

export const schedulePercussionPitchEnvelope = (parameter, frequencies, timing) => {
	const { startRatio, endRatio, startAt, endAt } = timing
	const start = positive(frequencies.start, 1) * startRatio
	const end = positive(frequencies.end, 1) * endRatio
	parameter.setValueAtTime(start, startAt)

	const duration = Math.max(0, endAt - startAt)
	if (duration === 0)
	{
		parameter.setValueAtTime(end, startAt)
		return
	}

	const hasApex = Number.isFinite(frequencies.apex) && frequencies.apex > 0
	const hasSustain = Number.isFinite(frequencies.sustain) && frequencies.sustain > 0
	if (!hasApex && !hasSustain)
	{
		parameter.exponentialRampToValueAtTime(end, endAt)
		return
	}

	// Keep intermediate stages within the first 65% of a short bend so the
	// oscillator always has time to reach its final pitch at pitchDecay.
	const attack = Math.max(0, Number(timing.attack) || 0)
	const decay = Math.max(0, Number(timing.decay) || 0)
	const naturalStages = attack + decay
	const stageScale = naturalStages > 0 ? Math.min(1, duration * 0.65 / naturalStages) : 0
	let cursor = startAt
	if (hasApex && attack > 0)
	{
		cursor += attack * stageScale
		parameter.exponentialRampToValueAtTime(positive(frequencies.apex, start) * startRatio, cursor)
	}
	if (hasSustain && decay > 0)
	{
		cursor += decay * stageScale
		parameter.exponentialRampToValueAtTime(positive(frequencies.sustain, end) * endRatio, cursor)
	}
	parameter.exponentialRampToValueAtTime(end, endAt)
}
