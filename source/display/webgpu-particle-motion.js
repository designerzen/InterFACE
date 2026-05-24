const TAU = Math.PI * 2

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export const DEFAULT_WEBGPU_PARTICLE_MOTION = {
	webgpuParticlePhysics: true,
	webgpuParticleGravity: 4.8,
	webgpuParticleArrivalSpring: 78,
	webgpuParticleArrivalDamping: 15,
	webgpuParticleArrivalKick: 10.5,
	webgpuParticleArrivalSpread: 1.25,
	webgpuParticleSettleDistance: 0.015,
	webgpuParticleSettleVelocity: 0.025,
	webgpuParticleMarchingParticles: true,
	webgpuParticleMarchingParticleCount: 14,
	webgpuParticleMarchingTrailLength: 2,
	webgpuParticleMarchingSpeed: 0.022,
	webgpuParticleMarchingDepth: 0.08,
	webgpuParticleMarchingOrbit: 0.01,
	webgpuParticleMarchingPause: 38
}

export const createWebGPUParticleMotionState = () => ({
	mode: "falling",
	lastTime: 0,
	positions: null,
	velocities: null,
	targetPositions: null,
	targetScales: null,
	randoms: null
})

export const resetWebGPUParticleMotionState = state => {
	state.mode = "falling"
	state.lastTime = performance.now()
	state.positions = null
	state.velocities = null
	state.targetPositions = null
	state.targetScales = null
	state.randoms = null
}

export const ensureWebGPUParticleMotionState = (state, positions, dimensions = 3) => {
	if (!state || !positions)
	{
		return null
	}

	const particleCount = positions.length / dimensions
	if (state.positions?.length === positions.length)
	{
		return state
	}

	state.mode = "falling"
	state.lastTime = performance.now()
	state.positions = new Float32Array(positions.length)
	state.velocities = new Float32Array(positions.length)
	state.targetPositions = new Float32Array(positions.length)
	state.targetScales = new Float32Array(particleCount)
	state.randoms = new Float32Array(particleCount)
	state.positions.set(positions)

	for (let i = 0; i < particleCount; i++)
	{
		state.randoms[i] = Math.random()
		state.velocities[i * dimensions] = (Math.random() - 0.5) * 0.4
		state.velocities[i * dimensions + 1] = -Math.random() * 0.5
		if (dimensions > 2)
		{
			state.velocities[i * dimensions + 2] = (Math.random() - 0.5) * 0.3
		}
		state.targetScales[i] = 1
	}

	return state
}

const getDelta = state => {
	const now = performance.now()
	const delta = state.lastTime ? (now - state.lastTime) / 1000 : 1 / 60
	state.lastTime = now
	return Math.max(1 / 120, Math.min(delta, 1 / 20))
}

const beginArrival = (state, positions, dimensions, options, bounds = {}) => {
	const particleCount = positions.length / dimensions
	const arrivalKick = options.webgpuParticleArrivalKick ?? DEFAULT_WEBGPU_PARTICLE_MOTION.webgpuParticleArrivalKick
	const spread = options.webgpuParticleArrivalSpread ?? DEFAULT_WEBGPU_PARTICLE_MOTION.webgpuParticleArrivalSpread
	const bottomY = bounds.bottomY ?? spread
	const xSpread = bounds.xSpread ?? spread
	const zSpread = bounds.zSpread ?? spread

	for (let i = 0; i < particleCount; i++)
	{
		const index = i * dimensions
		const random = state.randoms[i] ?? Math.random()
		const side = random > 0.5 ? 1 : -1

		state.positions[index] = Number.isFinite(positions[index]) ? positions[index] : state.targetPositions[index]
		state.positions[index + 1] = Math.max(positions[index + 1] || 0, bottomY + random * spread)
		state.velocities[index] = side * (0.4 + random * 1.2) * xSpread
		state.velocities[index + 1] = -arrivalKick * (0.7 + random * 0.6)

		if (dimensions > 2)
		{
			state.positions[index + 2] = (positions[index + 2] || 0) + (random - 0.5) * zSpread
			state.velocities[index + 2] = (random - 0.5) * 1.8
		}
	}

	state.mode = "arriving"
}

export const applyWebGPUParticleArrival = ({
	state,
	positions,
	targetPositions,
	scales = null,
	targetScales = null,
	dimensions = 3,
	frame = 0,
	options = {},
	bounds = {},
	onSettled = null
}) => {
	if (options.webgpuParticlePhysics === false)
	{
		positions.set(targetPositions)
		if (scales && targetScales)
		{
			scales.set(targetScales)
		}
		return "settled"
	}

	ensureWebGPUParticleMotionState(state, positions, dimensions)
	state.targetPositions.set(targetPositions)
	if (targetScales)
	{
		state.targetScales.set(targetScales)
	}

	if (state.mode !== "arriving" && state.mode !== "settled")
	{
		beginArrival(state, positions, dimensions, options, bounds)
	}

	if (state.mode === "settled")
	{
		positions.set(state.targetPositions)
		if (scales)
		{
			scales.set(state.targetScales)
		}
		onSettled?.()
		return state.mode
	}

	const delta = getDelta(state)
	const spring = options.webgpuParticleArrivalSpring ?? DEFAULT_WEBGPU_PARTICLE_MOTION.webgpuParticleArrivalSpring
	const damping = options.webgpuParticleArrivalDamping ?? DEFAULT_WEBGPU_PARTICLE_MOTION.webgpuParticleArrivalDamping
	const settleDistance = options.webgpuParticleSettleDistance ?? DEFAULT_WEBGPU_PARTICLE_MOTION.webgpuParticleSettleDistance
	const settleVelocity = options.webgpuParticleSettleVelocity ?? DEFAULT_WEBGPU_PARTICLE_MOTION.webgpuParticleSettleVelocity
	const particleCount = positions.length / dimensions
	let unsettled = 0

	for (let i = 0; i < particleCount; i++)
	{
		const index = i * dimensions
		const random = state.randoms[i] ?? 0
		let distanceSquared = 0
		let velocitySquared = 0

		for (let axis = 0; axis < dimensions; axis++)
		{
			const positionIndex = index + axis
			const target = state.targetPositions[positionIndex]
			const offset = target - state.positions[positionIndex]
			const axisSpring = spring * (axis === 1 ? 1.12 : 1)
			const overArc = axis === 1 ? Math.sin((frame * 0.12) + random * TAU) * 0.08 * Math.max(0, offset) : 0
			const acceleration = (offset + overArc) * axisSpring - state.velocities[positionIndex] * damping

			state.velocities[positionIndex] += acceleration * delta
			state.positions[positionIndex] += state.velocities[positionIndex] * delta
			positions[positionIndex] = state.positions[positionIndex]

			distanceSquared += offset * offset
			velocitySquared += state.velocities[positionIndex] * state.velocities[positionIndex]
		}

		if (scales)
		{
			const targetScale = targetScales ? targetScales[i] : 1
			scales[i] = targetScale * (1 + Math.min(1.5, Math.sqrt(velocitySquared) * 0.08))
		}

		if (distanceSquared > settleDistance * settleDistance || velocitySquared > settleVelocity * settleVelocity)
		{
			unsettled++
		}
	}

	if (unsettled === 0)
	{
		state.mode = "settled"
		positions.set(state.targetPositions)
		if (scales)
		{
			scales.set(state.targetScales)
		}
		onSettled?.()
	}

	return state.mode
}

export const applyWebGPUParticleGravity = ({
	state,
	positions,
	scales = null,
	dimensions = 3,
	frame = 0,
	options = {}
}) => {
	if (options.webgpuParticlePhysics === false)
	{
		return
	}

	ensureWebGPUParticleMotionState(state, positions, dimensions)
	const delta = getDelta(state)
	const gravity = options.webgpuParticleGravity ?? DEFAULT_WEBGPU_PARTICLE_MOTION.webgpuParticleGravity
	const particleCount = positions.length / dimensions

	if (state.mode === "settled" || state.mode === "arriving")
	{
		state.positions.set(positions)
	}

	state.mode = "falling"

	for (let i = 0; i < particleCount; i++)
	{
		const index = i * dimensions
		const random = state.randoms[i] ?? 0
		state.velocities[index] += Math.sin((frame * 0.03) + random * TAU) * delta * 0.25
		state.velocities[index + 1] += gravity * delta
		state.positions[index] += state.velocities[index] * delta
		state.positions[index + 1] += state.velocities[index + 1] * delta

		positions[index] = state.positions[index]
		positions[index + 1] = state.positions[index + 1]

		if (dimensions > 2)
		{
			state.velocities[index + 2] += Math.cos((frame * 0.025) + random * TAU) * delta * 0.2
			state.positions[index + 2] += state.velocities[index + 2] * delta
			positions[index + 2] = state.positions[index + 2]
		}

		if (scales)
		{
			scales[i] = Math.max(0.25, scales[i] * 0.985)
		}
	}
}

export const applyWebGPUParticleMarch = ({
	positions,
	scales = null,
	colours = null,
	particles = null,
	frame = 0,
	options = {},
	dimensions = 3
}) => {
	const enabled = options.webgpuParticleMarchingParticles ?? options.lookingGlassMarchingParticles ?? true
	if (enabled === false || !positions)
	{
		return
	}

	const total = positions.length / dimensions
	if (total < 2)
	{
		return
	}

	const walkerCount = clamp(
		Math.floor(options.webgpuParticleMarchingParticleCount ?? options.lookingGlassMarchingParticleCount ?? DEFAULT_WEBGPU_PARTICLE_MOTION.webgpuParticleMarchingParticleCount),
		1,
		Math.max(1, Math.floor(total / 3))
	)
	const trailLength = clamp(
		Math.floor(options.webgpuParticleMarchingTrailLength ?? options.lookingGlassMarchingTrailLength ?? DEFAULT_WEBGPU_PARTICLE_MOTION.webgpuParticleMarchingTrailLength),
		1,
		12
	)
	const speed = options.webgpuParticleMarchingSpeed ?? options.lookingGlassMarchingSpeed ?? DEFAULT_WEBGPU_PARTICLE_MOTION.webgpuParticleMarchingSpeed
	const depth = options.webgpuParticleMarchingDepth ?? options.lookingGlassMarchingDepth ?? DEFAULT_WEBGPU_PARTICLE_MOTION.webgpuParticleMarchingDepth
	const orbit = options.webgpuParticleMarchingOrbit ?? options.lookingGlassMarchingOrbit ?? DEFAULT_WEBGPU_PARTICLE_MOTION.webgpuParticleMarchingOrbit
	const pauseFrames = options.webgpuParticleMarchingPause ?? options.lookingGlassMarchingPause ?? DEFAULT_WEBGPU_PARTICLE_MOTION.webgpuParticleMarchingPause
	const stride = total / walkerCount
	const phase = frame * speed
	const step = Math.floor(phase)
	const stepProgress = phase - step
	const moveProgress = clamp(stepProgress * pauseFrames, 0, 1)
	const easedPhase = step + moveProgress * moveProgress * (3 - 2 * moveProgress)

	for (let walker = 0; walker < walkerCount; walker++)
	{
		const laneOffset = walker * stride
		const speedVariance = 0.82 + ((walker * 37) % 19) / 95
		const lanePhase = easedPhase * speedVariance + laneOffset + Math.sin((frame * 0.006 * speedVariance) + walker) * trailLength * 0.25

		for (let trail = 0; trail < trailLength; trail++)
		{
			const intensity = 1 - (trail / trailLength)
			const sourceIndex = Math.floor(laneOffset + trail * 3) % total
			const targetIndex = Math.floor(lanePhase - trail * (1 + speedVariance) + total * 4) % total
			const sourceOffset = sourceIndex * dimensions
			const targetOffset = targetIndex * dimensions
			const shimmer = Math.sin((frame * 0.024 * speedVariance) + walker * 1.7 + trail)
			const curl = (walker / walkerCount) * TAU + frame * 0.008 * speedVariance + trail * 0.55

			if (particles?.[sourceIndex])
			{
				const particle = particles[sourceIndex]
				particle.setIndex(targetIndex)
				particle.update(1 + intensity)
				positions[sourceOffset] = particle.x + Math.cos(curl) * orbit * intensity
				positions[sourceOffset + 1] = particle.y + Math.sin(curl) * orbit * intensity
				if (dimensions > 2)
				{
					positions[sourceOffset + 2] = particle.z + depth * intensity * shimmer
				}
			}
			else
			{
				positions[sourceOffset] = positions[targetOffset] + Math.cos(curl) * orbit * intensity
				positions[sourceOffset + 1] = positions[targetOffset + 1] + Math.sin(curl) * orbit * intensity
				if (dimensions > 2)
				{
					positions[sourceOffset + 2] = positions[targetOffset + 2] + depth * intensity * shimmer
				}
			}

			if (scales)
			{
				scales[sourceIndex] = 1 + intensity * 2.75
			}

			if (colours)
			{
				const colourOffset = sourceIndex * 3
				const huePhase = (walker / walkerCount) * TAU + frame * 0.025
				colours[colourOffset] = 0.55 + 0.45 * Math.sin(huePhase)
				colours[colourOffset + 1] = 0.55 + 0.45 * Math.sin(huePhase + TAU / 3)
				colours[colourOffset + 2] = 0.55 + 0.45 * Math.sin(huePhase + TAU * 2 / 3)
			}
		}
	}
}
