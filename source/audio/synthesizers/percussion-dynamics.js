const clamp = (value, low=0, high=1) => Math.min(high, Math.max(low, value))
const number = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback
const blend = (value, amount) => 1 + (value - 1) * amount

// One small state per instrument, evaluated only at a strike. Reuse the result
// object; there is no audio-rate work, extra voice, buffer or timer.
export const createPercussionDynamics = () => {
	let lastAt = -Infinity
	let energy = 0
	let seed = 0x13579bdf
	const result = {}
	const reset = () => {
		lastAt = -Infinity
		energy = 0
		seed = 0x13579bdf
	}
	const strike = (options, time) => {
		const velocity = clamp(number(options.velocity, 1))
		const amount = clamp(number(options.dynamicsAmount, 1))
		const elapsed = time - lastAt
		// Out-of-order lookahead events cannot describe the vibration at an
		// earlier point. Leave the history intact and use an isolated response.
		const residual = elapsed >= 0 ? energy * clamp(1 - elapsed / 0.18) : 0
		if (velocity > 0 && elapsed >= 0) seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
		const variation = Number.isFinite(lastAt)
			? (seed / 2147483648 - 1) * clamp(number(options.strikeVariation, 0.12), 0, 0.3)
			: 0
		const position = clamp(number(options.strikePosition, 0.35) + variation)
		const offset = position - 0.35
		const rebound = residual * (1 - velocity * 0.7)
		const damping = clamp(number(options.damping, 0))
		result.bodyGain = blend(1 - offset * 0.18 - rebound * 0.06, amount)
		result.ringGain = blend(1 + offset * 0.7 + residual * 0.035, amount)
		result.attackGain = blend(1 + offset * 0.15 - rebound * 0.1, amount)
		result.wireGain = blend(1 + offset * 0.12 + residual * 0.06, amount)
		result.brightness = blend(1 + offset * 0.14, amount)
		result.pitchAttack = blend(1 + residual * 0.006 + variation * 0.003, amount)
		result.bodyDecay = blend((0.82 + velocity * 0.18) * (1 - damping * 0.8) * (1 - rebound * 0.06), amount)
		result.ringDecay = blend(Math.min(1, (0.72 + velocity * 0.28) * (1 - damping * 0.9) * (1 + offset * 0.18)), amount)
		result.wireDecay = blend((0.64 + velocity * 0.36) * (1 - damping * 0.72) * (1 - rebound * 0.12), amount)
		result.attackDecay = blend((0.85 + velocity * 0.15) * (1 - damping * 0.3), amount)
		if (velocity > 0 && elapsed >= 0) {
			energy = Math.min(1, residual + velocity * 0.65)
			lastAt = time
		}
		return result
	}
	strike.reset = reset
	return strike
}
