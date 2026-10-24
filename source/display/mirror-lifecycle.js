// World coordinates: +Y is up. Simulation runs once per display frame, not per quilt view.
export class MirrorLifecycle {
  constructor(count, random = Math.random) {
    this.positions = new Float32Array(count * 3)
    this.targets = new Float32Array(count * 3)
    this.velocities = new Float32Array(count * 3)
    this.scales = new Float32Array(count)
    this.randoms = Float32Array.from({ length: count }, random)
    this.mode = 'empty'
    this.opacity = 0
    this.wasAlive = false
  }

  tick(alive, delta, { spawnY = -2.5, gravity = 7.2, opacity = .38, fadeSeconds = 1.2 } = {}) {
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
    } else if (!alive && this.wasAlive) this.mode = 'falling'
    this.wasAlive = alive
    if (this.mode === 'empty') return
    if (alive && this.mode === 'settled') this.positions.set(this.targets)
    else {
      const steps = Math.max(1, Math.ceil(delta / (1 / 120))), dt = delta / steps
      for (let step = 0; step < steps; step++) for (let k = 0; k < this.positions.length; k++) {
        const acceleration = alive ? (this.targets[k] - this.positions[k]) * 70 - this.velocities[k] * 16 :
          k % 3 === 1 ? -gravity : -this.velocities[k] * .8
        this.velocities[k] += acceleration * dt
        this.positions[k] += this.velocities[k] * dt
      }
      if (alive) {
        let maximumError = 0
        for (let k = 0; k < this.positions.length; k++) maximumError = Math.max(maximumError, Math.abs(this.targets[k] - this.positions[k]))
        if (maximumError < .025) { this.mode = 'settled'; this.positions.set(this.targets); this.velocities.fill(0) }
      } else for (let i = 0; i < this.scales.length; i++) if (this.positions[i * 3 + 1] < -20) this.scales[i] = 0
    }
    const targetOpacity = alive && this.mode === 'settled' ? opacity : 0
    const rate = delta / Math.max(.01, alive ? fadeSeconds : .18)
    this.opacity += Math.sign(targetOpacity - this.opacity) * Math.min(Math.abs(targetOpacity - this.opacity), opacity * rate)
  }
}
