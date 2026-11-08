import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { MirrorLifecycle } from '../source/display/mirror-lifecycle.js'
import { captureMirrorPerson, updateMirrorStage, updateMirrorFrame } from '../source/display/mirror-stage.js'
import { createWalls, disposeWalls } from '../source/display/walls.js'

test('a stripe travels along the walls with tempo while wall brightness stays steady', () => {
  const host = { scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera(), options: {},
    mirrorBeatTiming: { at: 1000, bpm: 120 } }
  updateMirrorStage(host, 1000)
  const walls = host.walls, material = walls.userData.wallStripe.plane
  const texture = walls.userData.wallStripe.texture
  const intensity = material.emissiveIntensity, opacity = material.opacity
  assert.equal(texture.offset.y, .5)
  const positions = walls.children.find(child => child.isMesh).geometry.attributes.position.array.slice()
  updateMirrorStage(host, 1250)
  assert.equal(texture.offset.y, 0)
  assert.equal(material.emissiveIntensity, intensity)
  assert.equal(material.opacity, opacity)
  updateMirrorStage(host, 1500)
  assert.equal(texture.offset.y, .5)
  host.mirrorBeatTiming = { at: 1500, bpm: 60 }
  updateMirrorStage(host, 2000)
  assert.equal(texture.offset.y, 0)
  updateMirrorStage(host, 2500)
  assert.equal(texture.offset.y, .5)
  assert.equal(host.walls, walls)
  assert.deepEqual(walls.children.find(child => child.isMesh).geometry.attributes.position.array, positions)
  disposeWalls(walls)
})

test('CPU and GPU tracking targets use interpolated landmarks and refresh on subdivision changes', () => {
  for (const gpu of [false, true]) {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(15), 3))
    const host = { scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera(), nativeMirrorDisplay: true,
      particles: new THREE.Points(geometry, new THREE.PointsMaterial()),
      options: { showWalls: false, geometrySubdivisions: 2, mirrorFaceScale: 1 } }
    let uploaded
    if (gpu) host.createMirrorLifecycle = count => ({ gpu: true, scales: { length: count },
      setTrackingPoints(points) { uploaded = points }, tick() {} })
    captureMirrorPerson(host, { alive: true, data: { keypoints: [{ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }] } })
    updateMirrorStage(host, 1000)
    if (gpu) assert.deepEqual(uploaded.map(p => p.x), [0, .25, .5, .75, 1])
    else assert.deepEqual(Array.from(host.mirrorLifecycle.targets), [-.5, .5, .5, -.25, .25, .25, 0, 0, 0, .25, -.25, -.25, .5, -.5, -.5])
    host.options.geometrySubdivisions = 1
    updateMirrorStage(host, 1016)
    if (gpu) assert.deepEqual(uploaded.map(p => p.x), [0, .5, 1])
    else assert.equal(host.mirrorLifecycle.targets[3], 0)
    geometry.dispose(); host.particles.material.dispose()
  }
})

test('head cloud targets reach CPU and GPU lifecycles in world space without landmark reflection', () => {
  for (const gpu of [false, true]) {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(6), 3))
    const expected = new Float32Array([2, 3, 4, -2, -3, -4])
    let uploaded
    const host = { scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera(), nativeMirrorDisplay: true,
      options: { showWalls: false }, particles: new THREE.Points(geometry, new THREE.PointsMaterial()),
      headParticleCloud: { update: () => expected } }
    if (gpu) host.createMirrorLifecycle = count => ({ gpu: true, scales: { length: count },
      setWorldTargets(targets) { uploaded = targets }, tick() {} })
    captureMirrorPerson(host, { alive: true, data: { keypoints: [{ x: .2, y: .2, z: 0 }, { x: .8, y: .8, z: 0 }] } })
    updateMirrorStage(host, 1000)
    assert.deepEqual(gpu ? uploaded : host.mirrorLifecycle.targets, expected)
    geometry.dispose(); host.particles.material.dispose()
  }
})

test('birth rises from below, settles, then fades in; death falls and rebirth resets', () => {
  const state = new MirrorLifecycle(4, () => .5)
  state.tick(true, 0)
  assert.equal(state.mode, 'arriving')
  assert.equal(state.opacity, 0)
  assert.ok(state.positions[1] < -2)
  const initial = state.positions[1]
  state.tick(true, 1 / 60)
  assert.ok(state.positions[1] > initial)
  for (let frame = 0; frame < 600 && state.mode !== 'settled'; frame++) {
    state.tick(true, 1 / 60)
    if (state.mode !== 'settled') assert.equal(state.opacity, 0)
  }
  assert.equal(state.mode, 'settled')
  for (let i = 0; i < 120; i++) state.tick(true, 1 / 60)
  assert.ok(Math.abs(state.opacity - .38) < .00001)
  state.tick(false, 1 / 60)
  assert.equal(state.mode, 'falling')
  assert.ok(state.velocities[1] < 0)
  for (let i = 0; i < 30; i++) state.tick(false, 1 / 60)
  assert.equal(state.opacity, 0)
  assert.ok(state.positions[1] < -.5)
  state.tick(true, 0)
  assert.equal(state.mode, 'arriving')
  assert.equal(state.opacity, 0)
  assert.ok(state.positions[1] < -2)
})

test('gravity is stable across 30Hz and 120Hz displays', () => {
  const simulate = fps => {
    const state = new MirrorLifecycle(1, () => .5)
    state.tick(true, 0)
    for (let i = 0; i < fps * 3; i++) state.tick(true, 1 / fps)
    for (let i = 0; i < fps; i++) state.tick(false, 1 / fps)
    return state.positions[1]
  }
  assert.ok(Math.abs(simulate(30) - simulate(120)) < .01)
})

test('frame is four open planes matching the viewport and extends backwards', () => {
  const camera = new THREE.PerspectiveCamera(50, .75, .1, 100)
  const walls = createWalls(THREE, { wallBackScale: 1 }, camera)
  const planes = walls.children.filter(child => child.isMesh)
  assert.equal(planes.length, 4)
  const extent = new THREE.Box3().setFromObject(walls)
  const openingHeight = 2 * Math.tan(25 * Math.PI / 180) * 1.2
  assert.ok(Math.abs(extent.max.x - openingHeight * .75 / 2) < 1e-6)
  assert.ok(extent.min.z < -5)
  disposeWalls(walls)
})

test('stage keeps avatar centred, particles visible through it and honours explicit death with cached data', () => {
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(50, .75, .1, 100)
  camera.position.z = 3.5
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(6), 3))
  geometry.setAttribute('scale', new THREE.Float32BufferAttribute(new Float32Array(2), 1))
  const particles = new THREE.Points(geometry, new THREE.PointsMaterial())
  const head = new THREE.Group()
  head.userData.humanFace = true
  const face = new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshStandardMaterial())
  head.add(face); scene.add(head, particles)
  const host = { scene, camera, particles, options: { showWalls: false, avatarOpacity: .38 },
    avatar: { scene: head, updateFromPrediction() {} }, lastFaceZoom: 3 }
  const person = { alive: true, dead: false, data: { keypoints: [{ x: .2, y: .2, z: 0 }, { x: .8, y: .8, z: 0 }] } }
  captureMirrorPerson(host, person)
  updateMirrorStage(host, 1000)
  for (let i = 1; i < 300; i++) updateMirrorStage(host, 1000 + i * 1000 / 60)
  assert.equal(host.mirrorLifecycle.mode, 'settled')
  assert.ok(face.material.opacity > .3)
  assert.equal(face.material.transparent, true)
  assert.equal(face.material.depthWrite, false)
  assert.ok(particles.renderOrder > face.renderOrder)
  assert.equal(particles.frustumCulled, false)
  assert.deepEqual(head.position.toArray(), [0, 0, 0])
  host.options.headParticleMode = 'opaque-shell'
  updateMirrorStage(host, 5980)
  assert.equal(face.material.depthWrite, true)
  assert.equal(face.material.polygonOffset, true)
  person.alive = false; person.dead = true
  updateMirrorStage(host, 6000)
  assert.equal(host.mirrorLifecycle.mode, 'falling')
  assert.equal(face.material.depthWrite, false, 'falling particles must not be masked')
  assert.ok(host.mirrorLifecycle.velocities[4] < 0, 'the lower landmark falls first')
})

test('contour and hybrid variants select their own head transparency and restore normal opacity', () => {
  const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(3), 3))
  const material = new THREE.MeshBasicMaterial()
  let requestedOpacity
  const host = { nativeMirrorDisplay: true, scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera(),
    particles: new THREE.Points(geometry, new THREE.PointsMaterial()),
    options: { showWalls: false, headOpacity: .025 }, mirrorMaterials: [material],
    mirrorLifecycle: { gpu: true, scales: { length: 1 }, mode: 'settled', opacity: 0,
      tick(_alive, _delta, options) { requestedOpacity = options.opacity; this.opacity = options.opacity } } }
  for (const [mode, opacity] of [['hybrid', .12], ['contours', 0], ['even-surface', .025]]) {
    host.options.headParticleMode = mode
    updateMirrorStage(host, 1000)
    assert.equal(requestedOpacity, opacity)
    assert.equal(material.opacity, opacity)
    assert.equal(material.depthWrite, false)
  }
  geometry.dispose(); material.dispose(); host.particles.material.dispose()
})

test('calibrated aperture follows Looking Glass controls and refreshes after a resize', () => {
  const host = { scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera(50, .75), options: {},
    mirrorCalibration: { targetDiam: 2, aspect: .75, targetZ: 1.5, targetX: 0, targetY: 0 } }
  updateMirrorFrame(host)
  const first = host.walls
  assert.equal(first.parent, host.scene)
  const bounds = new THREE.Box3().setFromObject(first)
  assert.ok(Math.abs(bounds.max.z - 1.5) < 1e-6)
  assert.ok(Math.abs(bounds.max.x - .75) < 1e-6)
  assert.ok(Math.abs(bounds.max.z - bounds.min.z - 2.5) < 1e-6)
  host.mirrorCalibration.targetDiam = 3
  updateMirrorFrame(host)
  assert.notEqual(first, host.walls)
  assert.equal(first.parent, null)
  const resized = new THREE.Box3().setFromObject(host.walls)
  assert.ok(Math.abs(resized.max.z - resized.min.z - 3.75) < 1e-6)
  host.options.wallDepthScale = .5
  updateMirrorFrame(host)
  const shorter = new THREE.Box3().setFromObject(host.walls)
  assert.ok(Math.abs(shorter.max.z - shorter.min.z - 1.5) < 1e-6)
  const previous = host.walls
  host.options.showWalls = false
  updateMirrorFrame(host)
  assert.equal(host.walls, null)
  assert.equal(previous.parent, null)
  host.options.showWalls = true
  updateMirrorFrame(host)
  assert.ok(host.walls?.parent)
  disposeWalls(host.walls)
})

test('batched frame retains four planes in a single wall draw', () => {
  const camera = new THREE.PerspectiveCamera(50, .75, .1, 100)
  const walls = createWalls(THREE, { wallBatchPlanes: true, wallOpeningGlowOpacity: 0 }, camera)
  const planes = walls.children.filter(child => child.isMesh)
  assert.equal(planes.length, 1)
  assert.equal(planes[0].geometry.index.count, 4 * 6)
  assert.equal(planes[0].geometry.attributes.position.count, 4 * 4)
  disposeWalls(walls)
})
