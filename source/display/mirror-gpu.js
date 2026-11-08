import { Sprite, SpriteNodeMaterial, NormalBlending, Vector3 } from 'three/webgpu'
import {
  Fn,
  If,
  Loop,
  uniform,
  instancedArray,
  attributeArray,
  instanceIndex,
  vec3,
  uint,
  hash,
  shapeCircle,
  atomicStore,
  atomicAdd,
  sqrt, exp, sin, cos
} from 'three/tsl'
import { DEFAULT_PARTICLE_IDLE_MOTION } from './particle-idle-motion.js'

// Positions/velocities never leave GPU memory. Only a four-byte settling counter is read asynchronously.
export function createGPUMirrorLifecycle(host, count) {
  const renderer = host.renderer
  if (!renderer.backend.isWebGPUBackend) throw new Error('GPU particle compute requires native WebGPU')
  const tracking = instancedArray(Math.max(478, count), 'vec4')
  const trackingCount = uniform(count, 'uint')
  const trackingScale = uniform(new Vector3(1, -1, -1))
  const centre = uniform(new Vector3()),
    anchor = uniform(new Vector3()),
    zoom = uniform(1)
  const positions = instancedArray(count, 'vec3')
  const velocities = instancedArray(count, 'vec3')
  const releaseDelays = instancedArray(count, 'float')
  const pending = attributeArray(1, 'uint').toAtomic()
  const dt = uniform(0),
    gravity = uniform(7.2),
    spawnY = uniform(-2.5)
  const birth = uniform(false),
    mode = uniform(0, 'uint')
  const resetRelease = uniform(false), releaseTime = uniform(0), releaseDuration = uniform(0)
  const minimumHeight = uniform(0), heightRange = uniform(1)
  const idleEnabled = uniform(true), idleTime = uniform(0)
  const wander = uniform(DEFAULT_PARTICLE_IDLE_MOTION.particleWander)
  const spring = uniform(DEFAULT_PARTICLE_IDLE_MOTION.particleSpring)
  const reset = Fn(() => {
    atomicStore(pending.element(0), uint(0))
  })().compute(1)
  const simulate = Fn(() => {
    const p = positions.element(instanceIndex),
      v = velocities.element(instanceIndex)
    const tracked = tracking.element(instanceIndex.mod(trackingCount))
    const target = tracked.xyz.sub(centre)
      .mul(trackingScale.mul(zoom))
      .add(anchor)
      .toVar()
    const random = hash(instanceIndex)
    const delay = releaseDelays.element(instanceIndex)
    If(resetRelease, () => {
      delay.assign(target.y.sub(minimumHeight).div(heightRange).clamp(0, 1).mul(releaseDuration))
    })
    const activeDelta = releaseTime.sub(delay).max(0).min(dt).toVar()
    If(birth, () => {
      p.assign(
        vec3(
          target.x.add(random.sub(0.5).mul(0.8)),
          spawnY.sub(random.mul(1.5)),
          target.z.add(random.sub(0.5).mul(0.4))
        )
      )
      v.assign(vec3(0, random.mul(2).add(2), 0))
    })
    If(mode.equal(2), () => {
        If(idleEnabled.and(tracked.w.greaterThan(0)), () => {
          const weight = tracked.w, mass = random.mul(.8).add(.7)
          const omegaSquared = spring.add(weight.oneMinus().mul(210)).div(mass)
          const damping = sqrt(omegaSquared).mul(.9)
          const frequency = sqrt(omegaSquared.sub(damping.mul(damping)))
          const decay = exp(damping.mul(dt).negate())
          const cosine = cos(frequency.mul(dt)), sine = sin(frequency.mul(dt)).div(frequency)
          const phase = random.mul(Math.PI * 2), size = wander.mul(weight)
          const drift = vec3(
            sin(idleTime.mul(random.mul(.3).add(.7)).add(phase)).mul(size).mul(.8),
            sin(idleTime.mul(.83).add(phase.mul(1.7))).mul(size).mul(.6),
            cos(idleTime.mul(.61).add(phase.mul(2.3))).mul(size)
          )
          const aim = target.add(drift).toVar(), offset = p.sub(aim).toVar(), velocity = v.toVar()
          p.assign(aim.add(offset.mul(cosine.add(damping.mul(sine))).add(velocity.mul(sine)).mul(decay)))
          v.assign(velocity.mul(cosine.sub(damping.mul(sine))).sub(offset.mul(omegaSquared).mul(sine)).mul(decay))
        }).Else(() => {
          p.assign(target)
          v.assign(vec3(0))
        })
      })
      .ElseIf(mode.equal(1), () => {
        Loop(12, () => {
          const step = activeDelta.div(12)
          v.addAssign(target.sub(p).mul(70).sub(v.mul(16)).mul(step))
          p.addAssign(v.mul(step))
        })
      })
      .ElseIf(mode.equal(3), () => {
        Loop(12, () => {
          const step = activeDelta.div(12)
          v.addAssign(vec3(v.x.mul(-0.8), gravity.negate(), v.z.mul(-0.8)).mul(step))
          p.addAssign(v.mul(step))
        })
        p.y.assign(p.y.max(-50))
      })
    If(mode.equal(1).and(p.distance(target).greaterThan(0.025).or(releaseTime.lessThan(delay))), () => {
      atomicAdd(pending.element(0), uint(1))
    })
  })().compute(count)

  const material = new SpriteNodeMaterial({
    color: 0xffffff,
    transparent: true,
    depthWrite: false,
    blending: NormalBlending,
    toneMapped: false
  })
  const particleColour = uniform(host.particles.material.color.clone())
  material.colorNode = particleColour
  material.positionNode = positions.toAttribute()
  material.scaleNode = uniform(host.options.particleSize ?? host.options.particeSize ?? 0.025)
  material.opacityNode = shapeCircle().mul(positions.element(instanceIndex).y.greaterThan(-20).select(1, 0))
  const sprite = new Sprite(material)
  sprite.count = count
  sprite.frustumCulled = false
  sprite.renderOrder = 20
  host.scene.add(sprite)
  host.particles.removeFromParent?.()
  let wasAlive = false,
    generation = 0,
    polling = false,
    lastPoll = -Infinity,
    disposed = false,
    elapsedIdle = 0,
    elapsedRelease = 0,
    targetMinimumY = 0,
    targetMaximumY = 0
  const state = {
    gpu: true,
    scales: { length: count },
    sprite,
    mode: 'empty',
    opacity: 0,
    wasAlive: false,
    targetsChanged() {
      tracking.value.needsUpdate = true
    },
    setTrackingPoints(points, center, factor, offset) {
      const length = Math.min(points.length, tracking.value.count)
      trackingCount.value = length
      const array = tracking.value.array
      targetMinimumY = Infinity; targetMaximumY = -Infinity
      for (let i = 0; i < length; i++) {
        const p = points[i],
          k = i * 4
        array[k] = Number.isFinite(p.x) ? p.x : center.x
        array[k + 1] = Number.isFinite(p.y) ? p.y : center.y
        array[k + 2] = Number.isFinite(p.z) ? p.z : 0
        array[k + 3] = 1
        const y = -(array[k + 1] - center.y) * factor + offset.y
        targetMinimumY = Math.min(targetMinimumY, y); targetMaximumY = Math.max(targetMaximumY, y)
      }
      centre.value.copy(center)
      trackingScale.value.set(1, -1, -1)
      anchor.value.copy(offset)
      zoom.value = factor
      tracking.value.needsUpdate = true
    },
    setWorldTargets(targets, motionWeights) {
      const length = targets.length / 3, array = tracking.value.array
      trackingCount.value = length
      targetMinimumY = Infinity; targetMaximumY = -Infinity
      for (let i = 0; i < length; i++) {
        array[i * 4] = targets[i * 3]
        array[i * 4 + 1] = targets[i * 3 + 1]
        array[i * 4 + 2] = targets[i * 3 + 2]
        array[i * 4 + 3] = motionWeights?.[i] ?? 1
        targetMinimumY = Math.min(targetMinimumY, targets[i * 3 + 1]); targetMaximumY = Math.max(targetMaximumY, targets[i * 3 + 1])
      }
      centre.value.set(0, 0, 0); anchor.value.set(0, 0, 0)
      trackingScale.value.set(1, 1, 1); zoom.value = 1
      tracking.value.needsUpdate = true
    },
    tick(alive, delta, options = {}) {
      if (disposed) return
      if (state.error) throw state.error
      delta = Math.max(0, Math.min(delta, 0.1))
      const born = alive && (!wasAlive || !state.wasAlive)
      const died = !alive && wasAlive
      resetRelease.value = born || died
      if (born || died) {
        elapsedRelease = 0
        minimumHeight.value = targetMinimumY
        heightRange.value = Math.max(1e-6, targetMaximumY - targetMinimumY)
        releaseDuration.value = Math.max(0, born ? (options.particleArrivalStagger ?? .65) : (options.particleFallStagger ?? 1))
      }
      if (born) {
        generation++
        state.mode = 'arriving'
        state.opacity = 0
      } else if (!alive && wasAlive) {
        generation++
        state.mode = 'falling'
      }
      wasAlive = state.wasAlive = alive
      if (state.mode === 'empty') {
        sprite.visible = false
        return
      }
      dt.value = delta
      if (state.mode === 'arriving' || state.mode === 'falling') elapsedRelease += delta
      releaseTime.value = elapsedRelease
      if (state.mode === 'settled') elapsedIdle += delta
      idleTime.value = elapsedIdle * (options.particleWanderSpeed ?? DEFAULT_PARTICLE_IDLE_MOTION.particleWanderSpeed)
      idleEnabled.value = options.particleIdleMotion !== false
      wander.value = options.particleWander ?? DEFAULT_PARTICLE_IDLE_MOTION.particleWander
      spring.value = Math.max(1, options.particleSpring ?? DEFAULT_PARTICLE_IDLE_MOTION.particleSpring)
      gravity.value = options.gravity ?? 7.2
      spawnY.value = options.spawnY ?? -2.5
      birth.value = born
      mode.value = state.mode === 'arriving' ? 1 : state.mode === 'settled' ? 2 : 3
      renderer.compute(state.mode === 'arriving' ? [reset, simulate] : simulate)
      sprite.visible = true
      particleColour.value.copy(host.particles.material.color)
      const now = performance.now()
      if (state.mode === 'arriving' && !polling && now - lastPoll >= 100) {
        const requestedGeneration = generation
        polling = true
        lastPoll = now
        renderer
          .getArrayBufferAsync(pending.value, null, 0, 4)
          .then((buffer) => {
            if (
              !disposed &&
              requestedGeneration === generation &&
              state.mode === 'arriving' &&
              new Uint32Array(buffer)[0] === 0
            )
              state.mode = 'settled'
          })
          .catch((error) => {
            if (!disposed) state.error = error
          })
          .finally(() => {
            polling = false
          })
      }
      const opacity = options.opacity ?? 0.38
      const target = alive && state.mode === 'settled' ? opacity : 0
      state.opacity +=
        Math.sign(target - state.opacity) *
        Math.min(
          Math.abs(target - state.opacity),
          (Math.max(opacity, state.opacity) * delta) / Math.max(0.01, alive ? (options.fadeSeconds ?? 1.2) : 0.18)
        )
    },
    dispose() {
      disposed = true
      sprite.removeFromParent()
      material.dispose()
      reset.dispose()
      simulate.dispose()
      for (const node of [positions, velocities, tracking, releaseDelays, pending]) node.value.dispose()
    }
  }
  return state
}
