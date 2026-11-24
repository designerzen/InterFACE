import { DEFAULT_EYE_INSTRUMENT_GESTURE_OPTIONS } from '../settings/options.gestures.js'

const positive = (value, fallback) => Number.isFinite(value) && value > 0 ? value : fallback
const resolveOptions = options => {
	const defaults = DEFAULT_EYE_INSTRUMENT_GESTURE_OPTIONS
	const resolved = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, positive(options?.[key], value)]))
	resolved.maxHoldMs = Math.max(resolved.minHoldMs, resolved.maxHoldMs)
	return resolved
}

// Freeze the clamped duration at gesture start so changing tempo cannot trigger early.
export const eyeInstrumentHoldMs = (barMs, options) => {
	const { holdBars, minHoldMs, maxHoldMs, fallbackBarMs } = resolveOptions(options)
	return Math.max(minHoldMs, Math.min(maxHoldMs, positive(barMs, fallbackBarMs) * holdBars))
}

export default class EyeInstrumentGesture {
	reset() {
		this.pose = null
		this.startedAt = null
		this.fired = false
		this.frameTime = null
		this.lastSeenAt = null
	}

	constructor(options = {}) {
		this.options = resolveOptions(options)
		this.reset()
	}

	update(prediction, now, barMs, blocked = false) {
		if (!prediction || !Number.isFinite(now) || blocked ||
			(typeof prediction.leftEyeClosed !== 'boolean') || (typeof prediction.rightEyeClosed !== 'boolean') ||
			(Number.isFinite(prediction.time) && prediction.time === this.frameTime)) {
			this.pose = null
			this.startedAt = null
			return null
		}
		if (this.lastSeenAt != null && (now - this.lastSeenAt > this.options.maxTrackingGapMs || now < this.lastSeenAt)) {
			this.pose = null
			this.startedAt = null
		}
		this.lastSeenAt = now
		this.frameTime = prediction.time
		const left = prediction.leftEyeClosed
		const right = prediction.rightEyeClosed
		if (!left && !right) {
			this.pose = null
			this.startedAt = null
			this.fired = false
			return null
		}
		if (this.fired) return null
		const pose = left && right ? 'random' : left ? 'previous' : 'next'
		if (pose !== this.pose) {
			this.pose = pose
			this.startedAt = now
			this.duration = eyeInstrumentHoldMs(barMs, this.options)
			return null
		}
		if (now - this.startedAt < this.duration) return null
		this.fired = true
		return pose
	}
}
