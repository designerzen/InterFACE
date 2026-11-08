export const DEFAULT_PARTICLE_IDLE_MOTION = {
  particleIdleMotion: true,
  particleWander: 0.018,
  particleWanderSpeed: 0.8,
  particleSpring: 90
}

// Exact damped-spring integration: stable across frame rates without substeps.
// Seeded masses and slow continuous offsets supply weight and organic movement.
export function stepParticleIdleMotion(state, delta, options = {}) {
  state.idleTime = (state.idleTime ?? 0) + delta
  const enabled = options.particleIdleMotion !== false
  const amplitude = options.particleWander ?? DEFAULT_PARTICLE_IDLE_MOTION.particleWander
  const time = state.idleTime * (options.particleWanderSpeed ?? DEFAULT_PARTICLE_IDLE_MOTION.particleWanderSpeed)
  const spring = Math.max(1, options.particleSpring ?? DEFAULT_PARTICLE_IDLE_MOTION.particleSpring)
  for (let i = 0; i < state.scales.length; i++) {
    const k = i * 3, weight = state.motionWeights?.[i] ?? 1
    if (!enabled || weight === 0) {
      for (let axis = 0; axis < 3; axis++) { state.positions[k + axis] = state.targets[k + axis]; state.velocities[k + axis] = 0 }
      continue
    }
    const random = state.randoms[i], mass = .7 + random * .8
    const omegaSquared = (spring + (1 - weight) * 210) / mass
    const damping = .9 * Math.sqrt(omegaSquared), frequency = Math.sqrt(omegaSquared - damping * damping)
    const decay = Math.exp(-damping * delta), cos = Math.cos(frequency * delta), sin = Math.sin(frequency * delta) / frequency
    const phase = random * Math.PI * 2, size = amplitude * weight
    for (let axis = 0; axis < 3; axis++) {
      const drift = axis === 0 ? Math.sin(time * (.7 + random * .3) + phase) * size * .8
        : axis === 1 ? Math.sin(time * .83 + phase * 1.7) * size * .6
          : Math.cos(time * .61 + phase * 2.3) * size
      const target = state.targets[k + axis] + drift
      const offset = state.positions[k + axis] - target, velocity = state.velocities[k + axis]
      state.positions[k + axis] = target + decay * (offset * (cos + damping * sin) + velocity * sin)
      state.velocities[k + axis] = decay * (velocity * (cos - damping * sin) - offset * omegaSquared * sin)
    }
  }
}
