import { ZERO } from '../audio-constants.js'

export const getVelocityEnvelopeLevels = (options, gain=1) => ({
	peak:options.velocity * gain,
	sustain:options.velocity * options.sustain * gain
})

// Full-strength hits retain the preset's tone. Softer hits excite fewer highs.
export const getVelocityTone = (options, amount=0.4) => {
	const velocity = Math.min(1, Math.max(0, Number(options.velocity) || 0))
	const response = Number(options.velocityToneAmount ?? amount)
	return 1 - (1 - velocity) * Math.min(1, Math.max(0, Number.isFinite(response) ? response : amount))
}

// Track the actual scheduled level, including lookahead hits. AudioParam.value
// describes "now", so it cannot supply a safe start level for a future retrigger.
export const createRetriggerableDecay = parameter => {
	parameter.value = ZERO
	let segments = []
	const levelAt = time => {
		const segment = segments.find(item => time >= item.startAt && time < item.endAt)
		if (!segment) return ZERO
		const phase = (time - segment.startAt) / (segment.endAt - segment.startAt)
		return segment.linear
			? segment.from + (segment.to - segment.from) * phase
			: segment.from * (segment.to / segment.from) ** phase
	}
	const holdAt = time => {
		const level = Math.max(ZERO, levelAt(time))
		const crossing = segments.find(item => time > item.startAt && time < item.endAt)
		if (typeof parameter.cancelAndHoldAtTime === 'function') parameter.cancelAndHoldAtTime(time)
		else {
			parameter.cancelScheduledValues(time)
			if (crossing) {
				const ramp = crossing.linear ? 'linearRampToValueAtTime' : 'exponentialRampToValueAtTime'
				parameter[ramp](level, time)
			}
		}
		parameter.setValueAtTime(level, time)
		// Keep past segments only when they can still be queried by lookahead choke.
		segments = segments.filter(item => item.startAt < time)
		if (crossing) Object.assign(crossing, { endAt:time, to:level })
		return level
	}
	return {
		trigger(time, peak, endAt, attack=0.0007, now=time) {
			const from = holdAt(time)
			segments = segments.filter(item => item.endAt > now)
			const attackEndAt = Math.min(endAt, time + Math.max(ZERO, attack))
			peak = Math.max(ZERO, peak)
			parameter.linearRampToValueAtTime(peak, attackEndAt)
			parameter.exponentialRampToValueAtTime(ZERO, endAt)
			segments.push({ startAt:time, endAt:attackEndAt, from, to:peak, linear:true })
			segments.push({ startAt:attackEndAt, endAt, from:peak, to:ZERO })
		},
		choke(time, duration=0.005) {
			const from = holdAt(time)
			const endAt = time + Math.max(0.001, duration)
			parameter.exponentialRampToValueAtTime(ZERO, endAt)
			segments.push({ startAt:time, endAt, from, to:ZERO })
		},
		levelAt,
	}
}
