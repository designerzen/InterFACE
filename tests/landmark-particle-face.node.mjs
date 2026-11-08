import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { prepareHumanHead } from '../source/models/human-head.js'
import { createHeadParticleCloud, createLandmarkDrivenHeadCloud, createFacialContourCloud } from '../source/display/head-particle-cloud.js'
import { LIPS_CONNECTIONS } from '../source/models/face-landmark-constants.js'

const load = async () => {
  const bytes = fs.readFileSync(new URL('../source/assets/actors/ict-facekit.glb', import.meta.url))
  const { scene } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
  const head = prepareHumanHead(scene)
  head.position.set(.1, -.1, .2)
  return head.getObjectByName('ICTHead')
}
const landmarks = () => Array.from({ length: 478 }, (_, i) => ({
  x: .5 + Math.cos(i * 2.39996) * (.1 + (i % 11) * .01),
  y: .5 + Math.sin(i * 2.39996) * (.15 + (i % 7) * .01),
  z: Math.cos(i * .37) * .03
}))
const centre = new Vector3(.5, .5, 0), anchor = new Vector3(.1, -.1, .2), zoom = 3.14
const world = p => [(p.x - centre.x) * zoom + anchor.x, -(p.y - centre.y) * zoom + anchor.y, -p.z * zoom + anchor.z]

test('contours track live feature edges, retain missing data and respond to spacing', async () => {
  const mesh = await load(), model = createHeadParticleCloud(mesh, { mode: 'even-surface', gridSpacing: .06 })
  const cloud = createFacialContourCloud(model), points = landmarks()
  assert.ok(cloud.update().every(Number.isFinite))
  const targets = cloud.update(points, centre, zoom, anchor)
  const [a, b] = LIPS_CONNECTIONS[0]
  for (let axis = 0; axis < 3; axis++) assert.ok(Math.abs(targets[axis] - world(points[a])[axis]) < 1e-6)
  for (let axis = 0; axis < 3; axis++) assert.ok(Math.abs(targets[3 + axis] - (world(points[a])[axis] * .75 + world(points[b])[axis] * .25)) < 1e-6)
  const previous = targets.slice()
  points[a] = undefined
  cloud.update(points, centre, zoom, anchor)
  assert.deepEqual(targets.subarray(0, 3), previous.subarray(0, 3))
  assert.ok(cloud.motionWeights.every(value => value === 0))
  assert.ok(createFacialContourCloud(model, { gridSpacing: .025 }).count > cloud.count)
})

test('surface facial anchors follow all 468 landmarks exactly while the rest of the head remains model-driven', async () => {
  const mesh = await load(), model = createHeadParticleCloud(mesh, { count: 8192 })
  const cloud = createLandmarkDrivenHeadCloud(model, mesh), points = landmarks()
  assert.equal(cloud.count, model.count)
  const targets = cloud.update(points, centre, zoom, anchor)
  for (let i = 0; i < 468; i++) assert.equal(cloud.motionWeights[cloud.facialSlots[i]], 0)
  assert.ok(cloud.motionWeights.some(value => value === 1))
  assert.ok(cloud.motionWeights[cloud.facialSlots[468]] < .1)
  for (let i = 0; i < 468; i++) {
    const offset = cloud.facialSlots[i] * 3
    for (let axis = 0; axis < 3; axis++) assert.ok(Math.abs(targets[offset + axis] - world(points[i])[axis]) < 1e-6)
  }
  const slots = new Set(cloud.facialSlots)
  for (let i = 0; i < model.count; i++) if (!slots.has(i)) {
    assert.deepEqual(targets.subarray(i * 3, i * 3 + 3), model.targets.subarray(i * 3, i * 3 + 3))
  }
  const [a, b] = LIPS_CONNECTIONS[0], firstContour = cloud.facialSlots[468] * 3
  for (let axis = 0; axis < 3; axis++) {
    const va = world(points[a])[axis], vb = world(points[b])[axis]
    assert.ok(targets[firstContour + axis] >= Math.min(va, vb) - 1e-6 && targets[firstContour + axis] <= Math.max(va, vb) + 1e-6)
  }
  points[13].y += .02
  cloud.update(points, centre, zoom, anchor)
  assert.ok(Math.abs(targets[cloud.facialSlots[13] * 3 + 1] - world(points[13])[1]) < 1e-6)
  const last = targets.slice()
  points[13] = { x: NaN, y: 0, z: 0 }
  cloud.update(points, centre, zoom, anchor)
  assert.deepEqual(targets.subarray(cloud.facialSlots[13] * 3, cloud.facialSlots[13] * 3 + 3), last.subarray(cloud.facialSlots[13] * 3, cloud.facialSlots[13] * 3 + 3))
  assert.ok(targets.every(Number.isFinite))
})

test('volume mode retains every grid cell and adds a landmark-driven facial shell with smoothing', async () => {
  const mesh = await load(), model = createHeadParticleCloud(mesh, { mode: 'volume', gridSpacing: .06 })
  const cloud = createLandmarkDrivenHeadCloud(model, mesh, { faceParticleCount: 1024 }), points = landmarks()
  assert.equal(cloud.count, model.count + 1024)
  const output = cloud.update(points, centre, zoom, anchor)
  assert.deepEqual(output.subarray(0, model.targets.length), model.targets)
  const slot = cloud.facialSlots[0] * 3, previous = output[slot]
  points[0].x += .1
  cloud.update(points, centre, zoom, anchor, .5)
  assert.ok(Math.abs(output[slot] - (previous + .1 * zoom * .5)) < 1e-6)
  assert.ok(output.every(Number.isFinite))
})
