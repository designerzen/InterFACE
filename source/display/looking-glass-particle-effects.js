const TAU = Math.PI * 2

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export const DEFAULT_LOOKING_GLASS_PARTICLE_EFFECTS = {
	lookingGlassMarchingParticles: true,
	lookingGlassMarchingParticleCount: 22,
	lookingGlassMarchingTrailLength: 4,
	lookingGlassMarchingSpeed: 0.018,
	lookingGlassMarchingDepth: 0.18,
	lookingGlassMarchingOrbit: 0.025,
	lookingGlassMarchingPause: 42,
	lookingGlassMarchingColourShift: true
}

export const applyLookingGlassParticleMarch = (geometry, frame = 0, options = {}) => {
	if (options.lookingGlassMarchingParticles === false || !geometry)
	{
		return
	}

	const positions = geometry.attributes.position?.array
	const scales = geometry.attributes.scale?.array
	const colours = geometry.attributes.color?.array
	const particles = geometry.userData?.particles

	if (!positions || !particles?.length)
	{
		return
	}

	const total = Math.min(particles.length, positions.length / 3)
	if (total < 2)
	{
		return
	}

	if (colours)
	{
		for (let i = 0; i < colours.length; i += 3)
		{
			colours[i] = 1
			colours[i + 1] = 1
			colours[i + 2] = 1
		}
	}

	const walkerCount = clamp(
		Math.floor(options.lookingGlassMarchingParticleCount ?? DEFAULT_LOOKING_GLASS_PARTICLE_EFFECTS.lookingGlassMarchingParticleCount),
		1,
		Math.max(1, Math.floor(total / 3))
	)
	const trailLength = clamp(
		Math.floor(options.lookingGlassMarchingTrailLength ?? DEFAULT_LOOKING_GLASS_PARTICLE_EFFECTS.lookingGlassMarchingTrailLength),
		1,
		12
	)
	const speed = options.lookingGlassMarchingSpeed ?? DEFAULT_LOOKING_GLASS_PARTICLE_EFFECTS.lookingGlassMarchingSpeed
	const depth = options.lookingGlassMarchingDepth ?? DEFAULT_LOOKING_GLASS_PARTICLE_EFFECTS.lookingGlassMarchingDepth
	const orbit = options.lookingGlassMarchingOrbit ?? DEFAULT_LOOKING_GLASS_PARTICLE_EFFECTS.lookingGlassMarchingOrbit
	const pauseFrames = options.lookingGlassMarchingPause ?? DEFAULT_LOOKING_GLASS_PARTICLE_EFFECTS.lookingGlassMarchingPause
	const stride = total / walkerCount
	const phase = frame * speed
	const step = Math.floor(phase)
	const easedPhase = step + (phase - step > 1 / Math.max(1, pauseFrames) ? 1 : clamp((phase - step) * pauseFrames, 0, 1) ** 2 * (3 - 2 * clamp((phase - step) * pauseFrames, 0, 1)))

	for (let walker = 0; walker < walkerCount; walker++)
	{
		const laneOffset = walker * stride
		const lanePhase = easedPhase + laneOffset + Math.sin((frame * 0.004) + walker) * trailLength * 0.25

		for (let trail = 0; trail < trailLength; trail++)
		{
			const intensity = 1 - (trail / trailLength)
			const sourceIndex = Math.floor(laneOffset + trail * 3) % total
			const targetIndex = Math.floor(lanePhase - trail * 2 + total * 4) % total
			const particle = particles[sourceIndex]

			if (!particle)
			{
				continue
			}

			particle.setIndex(targetIndex)
			particle.update(1 + intensity)

			const positionIndex = sourceIndex * 3
			const shimmer = Math.sin((frame * 0.018) + walker * 1.7 + trail)
			const curl = (walker / walkerCount) * TAU + frame * 0.006 + trail * 0.55

			positions[positionIndex] = particle.x + Math.cos(curl) * orbit * intensity
			positions[positionIndex + 1] = particle.y + Math.sin(curl) * orbit * intensity
			positions[positionIndex + 2] = particle.z + depth * intensity * shimmer

			if (scales)
			{
				scales[sourceIndex] = 1 + intensity * 2.75
			}

			if (colours && options.lookingGlassMarchingColourShift !== false)
			{
				const colourIndex = sourceIndex * 3
				const huePhase = (walker / walkerCount) * TAU + frame * 0.025
				colours[colourIndex] = 0.55 + 0.45 * Math.sin(huePhase)
				colours[colourIndex + 1] = 0.55 + 0.45 * Math.sin(huePhase + TAU / 3)
				colours[colourIndex + 2] = 0.55 + 0.45 * Math.sin(huePhase + TAU * 2 / 3)
			}
		}
	}

	if (colours)
	{
		geometry.attributes.color.needsUpdate = true
	}
}
