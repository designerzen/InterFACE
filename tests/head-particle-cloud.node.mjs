import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { createHeadParticleCloud } from '../source/display/head-particle-cloud.js'
import { createHeadDeformer } from '../source/display/head-deformation.js'
import { prepareHumanHead } from '../source/models/human-head.js'

test('surface samples cover actual triangles, stay stable and follow deformation and pose', () => {
  const mesh = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial())
  const cloud = createHeadParticleCloud(mesh, { count: 8192 })
  const same = createHeadParticleCloud(mesh, { count: 8192 })
  cloud.update(); same.update()
  assert.deepEqual(cloud.local, same.local)
  for (let i = 0; i < cloud.count; i++) {
    const p = Array.from(cloud.local.subarray(i * 3, i * 3 + 3))
    assert.ok(p.some(v => Math.abs(Math.abs(v) - 1) < 1e-6))
    assert.ok(p.every(v => Math.abs(v) <= 1.000001))
  }
  const original = cloud.local.slice()
  const positions = mesh.geometry.attributes.position
  for (let i = 0; i < positions.count; i++) positions.setZ(i, positions.getZ(i) + .5)
  positions.needsUpdate = true
  mesh.position.set(2, 3, 4)
  const targets = cloud.update()
  for (let i = 0; i < cloud.count; i++) {
    assert.ok(Math.abs(targets[i * 3] - original[i * 3] - 2) < 1e-6)
    assert.ok(Math.abs(targets[i * 3 + 2] - original[i * 3 + 2] - 4.5) < 1e-6)
  }
  assert.equal(cloud.update(), targets)
  mesh.geometry.dispose(); mesh.material.dispose()
})

test('volume grid has exact neutral spacing, stays inside and handles open surfaces using invisible caps', () => {
  const geometry = new BoxGeometry(2, 2, 2)
  // Remove one face to exercise the temporary containment cap.
  geometry.setIndex(Array.from(geometry.index.array).slice(6))
  const mesh = new Mesh(geometry, new MeshBasicMaterial())
  const originalIndices = geometry.index.array.slice()
  const cloud = createHeadParticleCloud(mesh, { mode: 'volume', gridSpacing: .1 })
  assert.equal(cloud.count, 1000)
  assert.equal(cloud.spacing, .2)
  cloud.update()
  for (const value of cloud.local) {
    assert.ok(value > -1 && value < 1)
    assert.ok(Math.abs((value + .9) / .2 - Math.round((value + .9) / .2)) < 1e-5)
  }
  assert.deepEqual(geometry.index.array, originalIndices, 'containment caps must never enter the rendered mesh')
  const fine = createHeadParticleCloud(mesh, { mode: 'volume', gridSpacing: .05 })
  assert.equal(fine.count, 8000)
  assert.throws(() => createHeadParticleCloud(mesh, { mode: 'volume', gridSpacing: 0 }), RangeError)
  geometry.dispose(); mesh.material.dispose()
})

test('regular grids preserve lattice spacing, omit wander, and offer shell and expressive variants', () => {
  const mesh = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial())
  const solid = createHeadParticleCloud(mesh, { mode: 'grid', gridSpacing: .1 })
  const shell = createHeadParticleCloud(mesh, { mode: 'grid-shell', gridSpacing: .1 })
  const expressive = createHeadParticleCloud(mesh, { mode: 'grid-deform', gridSpacing: .1 })
  assert.equal(solid.count, 1000)
  assert.equal(shell.count, 1000 - 512)
  for (const cloud of [solid, shell, expressive]) {
    cloud.update()
    assert.ok(cloud.motionWeights.every(value => value === 0))
    for (const value of cloud.local) assert.ok(Math.abs((value + .9) / .2 - Math.round((value + .9) / .2)) < 1e-5)
  }
  const before = solid.local.slice(), shellBefore = shell.local.slice(), expressiveBefore = expressive.local.slice()
  const positions = mesh.geometry.attributes.position
  for (let i = 0; i < positions.count; i++) positions.setZ(i, positions.getZ(i) + .5)
  positions.needsUpdate = true
  mesh.position.x = 2
  solid.update(); shell.update(); expressive.update()
  assert.deepEqual(solid.local, before)
  assert.deepEqual(shell.local, shellBefore)
  for (let i = 0; i < expressive.count; i++) assert.ok(Math.abs(expressive.local[i * 3 + 2] - expressiveBefore[i * 3 + 2] - .5) < 1e-6)
  assert.ok(Math.abs(solid.targets[0] - before[0] - 2) < 1e-6)
  mesh.geometry.dispose(); mesh.material.dispose()
})

test('structured surface dots stay separated and slices lie on horizontal planes', () => {
  const mesh = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial())
  for (const mode of ['even-surface', 'opaque-shell', 'slices']) {
    const cloud = createHeadParticleCloud(mesh, { mode, gridSpacing: .1 })
    cloud.update()
    assert.ok(cloud.count > 100)
    assert.ok(cloud.motionWeights.every(value => value === 0))
    for (let i = 0; i < cloud.count; i++) {
      const p = cloud.local.subarray(i * 3, i * 3 + 3)
      assert.ok(Array.from(p).some(value => Math.abs(Math.abs(value) - 1) < 1e-5))
      if (mode === 'slices') assert.ok(Math.abs((p[1] + .9) / .2 - Math.round((p[1] + .9) / .2)) < 1e-5)
      for (let j = 0; j < i; j++) {
        let distance = 0
        for (let axis = 0; axis < 3; axis++) distance += (p[axis] - cloud.local[j * 3 + axis]) ** 2
        assert.ok(distance >= (.2 * .7) ** 2 - 1e-6)
      }
    }
    const before = cloud.local.slice()
    const positions = mesh.geometry.attributes.position
    for (let i = 0; i < positions.count; i++) positions.setZ(i, positions.getZ(i) + .1)
    positions.needsUpdate = true
    cloud.update()
    assert.ok(cloud.local.some((value, i) => Math.abs(value - before[i]) > .05))
    for (let i = 0; i < positions.count; i++) positions.setZ(i, positions.getZ(i) - .1)
    positions.needsUpdate = true
  }
  mesh.geometry.dispose(); mesh.material.dispose()
})

test('real fitted head supports both surface and volume clouds with expression animation', async () => {
  const bytes = fs.readFileSync(new URL('../source/assets/actors/ict-facekit.glb', import.meta.url))
  const { scene } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
  const head = prepareHumanHead(scene), mesh = head.getObjectByName('ICTHead')
  const surface = createHeadParticleCloud(mesh, { count: 8192 })
  const volume = createHeadParticleCloud(mesh, { mode: 'volume', gridSpacing: .04 })
  assert.ok(volume.count > 1000 && volume.count < 50000)
  for (const cloud of [surface, volume]) assert.ok(cloud.update().every(Number.isFinite))
  const before = surface.targets.slice(), volumeBefore = volume.targets.slice()
  const deform = createHeadDeformer(head)
  mesh.morphTargetInfluences[mesh.morphTargetDictionary.jawOpen] = .8
  deform.update()
  assert.ok(surface.update().some((value, i) => Math.abs(value - before[i]) > 1e-4))
  assert.ok(volume.update().some((value, i) => Math.abs(value - volumeBefore[i]) > 1e-4))
  assert.ok(volume.targets.every(Number.isFinite))
  assert.ok(surface.vertexIds.every(index => index < 11248))
  for (const mode of ['grid', 'grid-shell', 'grid-deform', 'even-surface', 'opaque-shell', 'slices']) {
    const cloud = createHeadParticleCloud(mesh, { mode, gridSpacing: .04 })
    assert.ok(cloud.count > 100 && cloud.count < 50000)
    assert.ok(cloud.update().every(Number.isFinite))
  }
})
