const AXES = ['x', 'y', 'scale', 'yaw', 'pitch', 'roll']
const blend = (elapsed, window) => window > 0 ? -Math.expm1(-elapsed / window) : 1

const createAxis = () => ({
	value:0, extension:0, delta:0, velocity:0, speed:0, acceleration:0,
	inertia:0, direction:0, reversed:false, travel:0, peakSpeed:0,
	previousValue:0, previousVelocity:0, previousDirection:0, origin:0
})

/**
 * Live control signals, updated in place with constant memory and no frame history.
 * timeNow is monotonic milliseconds (never prediction.time: some models use video seconds).
 * yaw/pitch/roll retain the model's normalized units, NOT radians or degrees.
 * x/y are face-size units from the calibrated centre; scale is log(size / neutralSize),
 * an apparent approach/retreat estimate, not metric depth. Derivatives use seconds.
 * inertia is a low-pass velocity tail for effects, not physical mass or momentum.
 * Consumers should treat these objects as read-only and check tracked before use.
 */
export default class PersonMotion {
	x = createAxis()
	y = createAxis()
	scale = createAxis()
	yaw = createAxis()
	pitch = createAxis()
	roll = createAxis()
	tracked = false
	sampleCount = 0
	deltaTime = 0
	translationSpeed = 0
	rotationSpeed = 0
	translationExtension = 0
	rotationExtension = 0
	#options
	#lastTime = null
	#lastFrame = null
	#hasVelocity = false
	#neutral = null
	#centerX = 0
	#centerY = 0
	#size = 0
	#flipped

	constructor(options = {}) {
		this.#options = options
	}

	reset() {
		for (const key of AXES) Object.assign(this[key], createAxis())
		this.sampleCount = 0
		this.translationExtension = this.rotationExtension = 0
		this.#neutral = null
		this.#lastFrame = null
		return this.invalidate()
	}

	// Stop immediately on tracking loss; the next frame seeds derivatives afresh.
	invalidate() {
		this.tracked = false
		this.deltaTime = 0
		this.#lastTime = null
		this.#hasVelocity = false
		this.translationSpeed = this.rotationSpeed = 0
		for (const key of AXES) {
			const axis = this[key]
			axis.delta = axis.velocity = axis.speed = axis.acceleration = axis.inertia = 0
			axis.direction = axis.previousDirection = 0
			axis.reversed = false
		}
		return this
	}

	// Call while holding a comfortable neutral pose; no adaptive drift while performing.
	calibrate() {
		if (!this.tracked) return false
		this.#neutral = { x:this.#centerX, y:this.#centerY, size:this.#size }
		for (const key of AXES) {
			const axis = this[key]
			if (key === 'x' || key === 'y' || key === 'scale') axis.value = 0
			axis.origin = axis.value
			axis.extension = 0
		}
		this.translationExtension = this.rotationExtension = 0
		this.invalidate()
		return true
	}

	update(prediction, timeNow) {
		const box = prediction?.box
		if (!Number.isFinite(timeNow) || !box ||
			!Number.isFinite(box.xMin) || !Number.isFinite(box.xMax) ||
			!Number.isFinite(box.yMin) || !Number.isFinite(box.yMax) ||
			!Number.isFinite(prediction.yaw) || !Number.isFinite(prediction.pitch) ||
			!Number.isFinite(prediction.roll)) return this.invalidate()

		const size = (Math.abs(box.xMax - box.xMin) + Math.abs(box.yMax - box.yMin)) * 0.5
		if (size < 0.000001) return this.invalidate()

		const elapsed = this.#lastTime === null ? 0 : timeNow - this.#lastTime
		// prediction.time is used only as a frame identifier, regardless of its units.
		const frame = Number.isFinite(prediction.time) ? prediction.time : null
		if (frame !== null && frame === this.#lastFrame && this.#lastTime === null) return this
		if (this.#lastTime !== null && (elapsed < 1 ||
			(frame !== null && frame === this.#lastFrame))) {
			if (elapsed > (this.#options.motionMaxGapMs ?? 250)) this.invalidate()
			return this
		}

		const flipped = prediction.flipped
		if (this.#neutral && flipped !== this.#flipped) {
			this.#neutral = null
			this.invalidate()
		}
		this.#flipped = flipped
		this.#centerX = (box.xMin + box.xMax) * 0.5
		this.#centerY = (box.yMin + box.yMax) * 0.5
		this.#size = size
		const seed = this.#lastTime === null || elapsed > (this.#options.motionMaxGapMs ?? 250)
		if (seed) this.invalidate()
		const first = !this.#neutral
		if (first) this.#neutral = { x:this.#centerX, y:this.#centerY, size }
		this.x.value = (this.#centerX - this.#neutral.x) / this.#neutral.size
		this.y.value = (this.#centerY - this.#neutral.y) / this.#neutral.size
		this.scale.value = Math.log(size / this.#neutral.size)
		this.yaw.value = prediction.yaw
		this.pitch.value = prediction.pitch
		this.roll.value = prediction.roll

		const seconds = elapsed / 1000
		const smoothing = blend(elapsed, this.#options.motionSmoothingMs ?? 35)
		const accelerationSmoothing = blend(elapsed, this.#options.motionAccelerationSmoothingMs ?? 70)
		const inertiaSmoothing = blend(elapsed, this.#options.motionInertiaMs ?? 220)
		const deadzone = this.#options.motionDirectionThreshold ?? 0.02
		for (const key of AXES) {
			const axis = this[key]
			if (first) axis.origin = axis.value
			axis.extension = axis.value - axis.origin
			if (!seed) {
				axis.delta = axis.value - axis.previousValue
				const rawVelocity = axis.delta / seconds
				axis.velocity += (rawVelocity - axis.velocity) * smoothing
				const acceleration = this.#hasVelocity ? (axis.velocity - axis.previousVelocity) / seconds : 0
				axis.acceleration += (acceleration - axis.acceleration) * accelerationSmoothing
				axis.inertia += (axis.velocity - axis.inertia) * inertiaSmoothing
				axis.speed = Math.abs(axis.velocity)
				axis.direction = axis.speed > deadzone ? Math.sign(axis.velocity) : 0
				axis.reversed = axis.direction !== 0 && axis.previousDirection !== 0 && axis.direction !== axis.previousDirection
				if (axis.direction) axis.previousDirection = axis.direction
				axis.travel += Math.abs(axis.delta)
				axis.peakSpeed = Math.max(axis.peakSpeed, axis.speed)
			}
			axis.previousValue = axis.value
			axis.previousVelocity = axis.velocity
		}
		this.translationSpeed = Math.hypot(this.x.velocity, this.y.velocity)
		this.rotationSpeed = Math.hypot(this.yaw.velocity, this.pitch.velocity, this.roll.velocity)
		this.translationExtension = Math.hypot(this.x.extension, this.y.extension)
		this.rotationExtension = Math.hypot(this.yaw.extension, this.pitch.extension, this.roll.extension)
		this.deltaTime = seed ? 0 : seconds
		this.#hasVelocity = !seed
		this.#lastTime = timeNow
		this.#lastFrame = frame
		this.sampleCount++
		this.tracked = true
		return this
	}
}
