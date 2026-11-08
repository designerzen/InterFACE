import test from 'node:test'
import assert from 'node:assert/strict'
import { MirrorLifecycle } from '../source/display/mirror-lifecycle.js'
import { stepParticleIdleMotion } from '../source/display/particle-idle-motion.js'
import { Scene, Points, BufferGeometry, PointsMaterial, WGSLNodeBuilder } from 'three/webgpu'
import { context } from 'three/tsl'
import { createGPUMirrorLifecycle } from '../source/display/mirror-gpu.js'

const state = (count = 1, random = .35) => {
  const result = new MirrorLifecycle(count, () => random)
  result.scales.fill(1)
  return result
}

test('idle particles retain inertia and heavier particles accelerate more slowly', () => {
  const light = state(1, 0), heavy = state(1, 1)
  for (const particles of [light, heavy]) {
    particles.targets[0] = 1
    stepParticleIdleMotion(particles, 1 / 60, { particleWander: 0 })
    assert.ok(particles.positions[0] > 0 && particles.positions[0] < 1)
    assert.ok(particles.velocities[0] > 0)
    const previous = particles.positions[0]
    particles.targets[0] = 0
    stepParticleIdleMotion(particles, 1 / 60, { particleWander: 0 })
    assert.ok(particles.positions[0] > previous, 'momentum continues after the target reverses')
  }
  assert.ok(heavy.positions[0] < light.positions[0])
})

test('wandering remains bounded, protects facial anchors and stays active after settling', () => {
  const particles = state(4)
  particles.mode = 'settled'; particles.wasAlive = true
  particles.motionWeights = new Float32Array([0, .08, .25, 1])
  let maxBody = 0, maxContour = 0
  for (let frame = 0; frame < 1200; frame++) {
    particles.tick(true, 1 / 60)
    assert.deepEqual(Array.from(particles.positions.subarray(0, 3)), [0, 0, 0])
    maxContour = Math.max(maxContour, Math.hypot(...particles.positions.subarray(3, 6)))
    maxBody = Math.max(maxBody, Math.hypot(...particles.positions.subarray(9, 12)))
    assert.ok(particles.positions.every(Number.isFinite))
    assert.equal(particles.mode, 'settled')
  }
  assert.ok(maxBody > .01 && maxBody < .04)
  assert.ok(maxContour < maxBody * .15)
  assert.ok(particles.velocities.some(value => Math.abs(value) > .001))
})

test('idle motion is consistent across frame rates and can be disabled', () => {
  const simulate = fps => {
    const particles = state()
    for (let i = 0; i < fps * 8; i++) stepParticleIdleMotion(particles, 1 / fps)
    return particles
  }
  const slow = simulate(30), fast = simulate(120)
  for (let axis = 0; axis < 3; axis++) assert.ok(Math.abs(slow.positions[axis] - fast.positions[axis]) < .001)
  fast.targets.set([1, 2, 3])
  stepParticleIdleMotion(fast, 1 / 60, { particleIdleMotion: false })
  assert.deepEqual(Array.from(fast.positions), [1, 2, 3])
  assert.deepEqual(Array.from(fast.velocities), [0, 0, 0])
})

test('falling releases by height from bottom up and reappearance rebuilds from the neck upward', () => {
  const particles = state(3, .5)
  // Deliberately unsorted so the sequence must use height rather than index.
  particles.targets.set([0, 1, 0, 0, -1, 0, 0, 0, 0])
  particles.positions.set(particles.targets)
  particles.mode = 'settled'; particles.wasAlive = true
  particles.tick(false, .1)
  assert.deepEqual(Array.from(particles.releaseDelays), [1, 0, .5])
  assert.equal(particles.positions[1], 1)
  assert.equal(particles.positions[7], 0)
  assert.ok(particles.positions[4] < -1)
  for (let i = 0; i < 5; i++) particles.tick(false, .1)
  assert.equal(particles.positions[1], 1)
  assert.ok(particles.positions[7] < 0)
  for (let i = 0; i < 5; i++) particles.tick(false, .1)
  assert.ok(particles.positions[1] < 1)

  particles.tick(true, 0)
  assert.equal(particles.mode, 'arriving')
  const start = particles.positions.slice()
  particles.tick(true, .1)
  assert.equal(particles.positions[1], start[1])
  assert.equal(particles.positions[7], start[7])
  assert.ok(particles.positions[4] > start[4])
  for (let i = 0; i < 3; i++) particles.tick(true, .1)
  assert.equal(particles.positions[1], start[1])
  assert.ok(particles.positions[7] > start[7])
  for (let i = 0; i < 3; i++) particles.tick(true, .1)
  assert.ok(particles.positions[1] > start[1])
  for (let i = 0; i < 180; i++) particles.tick(true, 1 / 60)
  assert.equal(particles.mode, 'settled')
})

test('the GPU simulation generates a shader with continuous spring and wander motion', () => {
  let compute
  const renderer = {
    debug: { diagnostics: false }, contextNode: context(), backend: { isWebGPUBackend: true },
    hasFeature: () => false,
    compute(nodes) { compute = Array.isArray(nodes) ? nodes.at(-1) : nodes },
    getArrayBufferAsync: async () => new Uint32Array([0]).buffer
  }
  const host = { renderer, scene: new Scene(), options: {}, particles: new Points(new BufferGeometry(), new PointsMaterial()) }
  const lifecycle = createGPUMirrorLifecycle(host, 4)
  try {
    lifecycle.setWorldTargets(new Float32Array(12), new Float32Array([0, .08, .25, 1]))
    lifecycle.tick(true, 1 / 60)
    const builder = new WGSLNodeBuilder(null, renderer)
    builder.compute = compute
    builder.build()
    for (const operation of ['sin(', 'cos(', 'exp(']) assert.ok(builder.computeShader.includes(operation))
    assert.equal(lifecycle.sprite.count, 4)
  } finally {
    lifecycle.dispose(); host.particles.geometry.dispose(); host.particles.material.dispose()
  }
})
