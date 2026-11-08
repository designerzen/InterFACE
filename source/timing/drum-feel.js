const gcd = (a, b) => b ? gcd(b, a % b) : a
export const lcm = (a, b) => a / gcd(a, b) * b

export const DRUM_FEELS = Object.freeze({
	straight:{ variation:0.025, colours:['clap'], ghost:false },
	breaks:{ variation:0.06, colours:['rimshot', 'snareElectric'], ghost:true, delays:{snare:0.004, clap:0.004} },
	garage:{ variation:0.045, colours:['clap'], ghost:true, swing:0.18, delays:{snare:0.003} },
	jazz:{ variation:0.055, colours:['crossStick'], ghost:true, delays:{snare:0.006}, openHats:false },
	reggae:{ variation:0.035, colours:[], ghost:false, delays:{snare:0.008}, openHats:false },
	brazilian:{ variation:0.04, colours:[], ghost:false, delays:{cabasa:0.002, tambourine:0.002}, openHats:false },
	colombian:{ variation:0.035, colours:[], ghost:false, openHats:false },
	cuban:{ variation:0.035, colours:[], ghost:false, openHats:false },
	westAfrican:{ variation:0.04, colours:[], ghost:false, openHats:false },
	asymmetric:{ variation:0.025, colours:[], ghost:false, openHats:false },
	tala:{ variation:0.035, colours:[], ghost:false, openHats:false },
	flamenco:{ variation:0.04, colours:[], ghost:false, openHats:false },
})

export const getDrumGrid = (groove, options={}) => {
	const stepsPerBar = Math.max(1, Math.floor(groove?.stepsPerBar ?? options.stepsPerBar ?? 16))
	const meter = groove?.meter ?? [4, 4]
	const quarterBeats = meter[0] * 4 / meter[1]
	return { stepsPerBar, quarterBeats, stepsPerBeat:stepsPerBar / quarterBeats }
}

// Compile additive group boundaries and lane timing only when a preset changes.
export const compileDrumFeel = (groove, grid) => {
	const profile = { ...DRUM_FEELS[groove?.feel ?? 'straight'], ...groove?.feelOptions }
	const groups = groove?.groups ?? Array(Math.max(1, Math.round(grid.quarterBeats))).fill(1)
	const total = groups.reduce((sum, value) => sum + value, 0)
	const strong = new Uint8Array(grid.stepsPerBar)
	let cursor = 0
	for (const group of groups) {
		strong[Math.round(cursor / total * grid.stepsPerBar) % grid.stepsPerBar] = 1
		cursor += group
	}
	const swingable = grid.stepsPerBeat % 4 === 0
	const pulses = profile.pulseOffsets
	const offsets = Array.from({length:grid.stepsPerBar}, (_, step) => {
		const sixteenth = step / grid.stepsPerBeat * 4
		const offbeat = swingable && Math.abs(sixteenth - Math.round(sixteenth)) < 1e-6 && Math.round(sixteenth) % 2 === 1
		const phase = pulses?.length ? step * pulses.length / grid.stepsPerBar : 0
		const index = Math.floor(phase)
		const pulse = pulses?.length ? pulses[index] + (pulses[(index + 1) % pulses.length] - pulses[index]) * (phase - index) : 0
		return { pulse, hat:offbeat ? (profile.swing ?? 0) / 4 : 0 }
	})
	return { ...profile, strong, offsets, swingable, delays:profile.delays ?? {} }
}

export const getDrumPartTime = (parts, lane, triggerAt) => triggerAt
	+ ((parts.offsets?.[lane] ?? 0) + (parts.offsets?.pulse ?? 0)) * (parts.quarterDuration ?? 0)
	+ (parts.laneDelays?.[lane] ?? 0)
	+ (parts.swingOffset ?? 0)

// Reuse existing clock callbacks. Missed steps advance phase without replaying
// stale audio. The same small output array is reused even on empty clock ticks.
export const createDrumStepScheduler = () => {
	let source, nextAt, previousDuration
	const times = []
	return {
		reset() { source = undefined; nextAt = undefined },
		advance({arranger, tickAt, bpm, now, lookahead=0}) {
			times.length = 0
			if (!arranger || !Number.isFinite(tickAt) || !(bpm > 0)) return times
			const duration = arranger.getStepDuration(bpm)
			const horizon = tickAt + lookahead
			if (source !== arranger) {
				source = arranger
				nextAt = horizon
				previousDuration = duration
			} else if (duration !== previousDuration) {
				nextAt = horizon + Math.max(0, nextAt - horizon) / previousDuration * duration
				previousDuration = duration
			}
			if (nextAt < now + 0.003) {
				const missed = Math.ceil((now + 0.003 - nextAt) / duration)
				arranger.skipSteps(missed)
				nextAt += missed * duration
			}
			while (nextAt <= horizon + 1e-6 && times.length < 4) {
				times.push(nextAt)
				nextAt += duration
			}
			return times
		},
	}
}
