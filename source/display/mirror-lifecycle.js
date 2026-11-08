import { stepParticleIdleMotion } from './particle-idle-motion.js'
// World coordinates: +Y is up. Simulation runs once per display frame, not per quilt view.
export class MirrorLifecycle {
  constructor(count, random = Math.random) {
    this.positions = new Float32Array(count * 3)
    this.targets = new Float32Array(count * 3)
    this.velocities = new Float32Array(count * 3)
    this.scales = new Float32Array(count)
    this.releaseDelays = new Float32Array(count)
    this.randoms = Float32Array.from({ length: count }, random)
    this.mode = 'empty'
    this.opacity = 0
    this.wasAlive = false
    this.transitionTime = 0
  }

  beginHeightSequence(duration) {
    let minimum = Infinity, maximum = -Infinity
    for (let i = 1; i < this.targets.length; i += 3) {
      minimum = Math.min(minimum, this.targets[i]); maximum = Math.max(maximum, this.targets[i])
    }
    const height = Math.max(1e-6, maximum - minimum)
    this.lastReleaseDelay = 0
    for (let i = 0; i < this.releaseDelays.length; i++) {
      this.releaseDelays[i] = (this.targets[i * 3 + 1] - minimum) / height * Math.max(0, duration)
      this.lastReleaseDelay = Math.max(this.lastReleaseDelay, this.releaseDelays[i])
    }
    this.transitionTime = 0
  }

  tick(alive, delta, options = {}) {
    const { spawnY = -2.5, gravity = 7.2, opacity = .38, fadeSeconds = 1.2 } = options
    delta = Math.max(0, Math.min(delta, .1))
    if (alive && !this.wasAlive) {
      for (let i = 0; i < this.scales.length; i++) {
        const k = i * 3, random = this.randoms[i]
        this.positions[k] = this.targets[k] + (random - .5) * .8
        this.positions[k + 1] = spawnY - random * 1.5
        this.positions[k + 2] = this.targets[k + 2] + (random - .5) * .4
        this.velocities[k] = 0
        this.velocities[k + 1] = 2 + random * 2
        this.velocities[k + 2] = 0
        this.scales[i] = 1
      }
      this.opacity = 0
      this.mode = 'arriving'
      this.beginHeightSequence(options.particleArrivalStagger ?? .65)
    } else if (!alive && this.wasAlive) {
      this.mode = 'falling'
      this.beginHeightSequence(options.particleFallStagger ?? 1)
    }
    this.wasAlive = alive
    if (this.mode === 'empty') return
    if (alive && this.mode === 'settled') stepParticleIdleMotion(this, delta, options)
    else {
      this.transitionTime += delta
      const steps = Math.max(1, Math.ceil(delta / (1 / 120))), dt = delta / steps
      for (let step = 0; step < steps; step++) for (let k = 0; k < this.positions.length; k++) {
        const activeDelta = Math.min(dt, Math.max(0, this.transitionTime - delta + (step + 1) * dt - this.releaseDelays[Math.floor(k / 3)]))
        const acceleration = alive ? (this.targets[k] - this.positions[k]) * 70 - this.velocities[k] * 16 :
          k % 3 === 1 ? -gravity : -this.velocities[k] * .8
        this.velocities[k] += acceleration * activeDelta
        this.positions[k] += this.velocities[k] * activeDelta
      }
      if (alive) {
        let maximumError = 0
        for (let k = 0; k < this.positions.length; k++) maximumError = Math.max(maximumError, Math.abs(this.targets[k] - this.positions[k]))
        if (maximumError < .025 && this.transitionTime >= this.lastReleaseDelay) this.mode = 'settled'
      } else for (let i = 0; i < this.scales.length; i++) if (this.positions[i * 3 + 1] < -20) this.scales[i] = 0
    }
    const targetOpacity = alive && this.mode === 'settled' ? opacity : 0
    const rate = delta / Math.max(.01, alive ? fadeSeconds : .18)
    this.opacity += Math.sign(targetOpacity - this.opacity) * Math.min(Math.abs(targetOpacity - this.opacity), opacity * rate)
  }
}
