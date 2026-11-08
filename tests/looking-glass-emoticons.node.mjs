import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three/webgpu'
import { updateLookingGlassEmoticonParticles, disposeLookingGlassEmoticonParticles, clampEmoticonToCameraTop } from '../source/display/looking-glass-emoticon-particles.js'

test('3D emoji and head-angle bounds stick inside the camera top with rotated parents and zoom', () => {
  for (const perspective of [true, false]) for (const particles of [true, false]) {
    const camera = perspective
      ? new THREE.PerspectiveCamera(45, .75, .1, 100)
      : new THREE.OrthographicCamera(-2, 2, 2, -2, .1, 100)
    camera.position.set(0, 0, 5)
    camera.rotation.z = .15
    camera.zoom = 1.3
    camera.updateProjectionMatrix()
    const parent = new THREE.Group()
    parent.rotation.z = .3
    parent.scale.setScalar(1.2)
    const group = new THREE.Group()
    parent.add(group)
    const geometry = new THREE.PlaneGeometry(.8, .8)
    const visual = particles
      ? new THREE.Points(geometry, new THREE.PointsMaterial({size:.02}))
      : new THREE.Mesh(geometry, new THREE.MeshBasicMaterial())
    group.add(visual)
    group.rotation.set(.2, .1, -.4)
    group.position.y = 4
    clampEmoticonToCameraTop(group, camera, THREE)
    const bounds = new THREE.Box3().setFromObject(group)
    if (particles) bounds.expandByScalar(.01)
    let top = -Infinity
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
      top = Math.max(top, new THREE.Vector3(x, y, z).project(camera).y)
    }
    assert.ok(top <= .980001, `projected top ${top}`)
    assert.ok(top > .97)
    const clamped = group.position.clone()
    clampEmoticonToCameraTop(group, camera, THREE)
    assert.ok(group.position.distanceTo(clamped) < 1e-6)
    group.position.set(0, 0, 0)
    clampEmoticonToCameraTop(group, camera, THREE)
    assert.equal(group.position.y, 0)
    geometry.dispose()
    visual.material.dispose()
  }
})

test('world-space emoticon particles survive the GPU face replacement, match 2D transforms, cache and dispose', t => {
  const original = globalThis.document
  const pixels = new Uint8ClampedArray(192 * 192 * 4)
  pixels.set([255, 255, 255, 255], (96 * 192 + 96) * 4)
  globalThis.document = { createElement: () => ({ getContext: () => ({
    clearRect() {}, scale() {}, save() {}, restore() {}, strokeText() {}, fillText() {},
    beginPath() {}, arc() {}, fill() {}, getImageData: () => ({ data: pixels })
  }) }) }
  t.after(() => {
    if (original === undefined) delete globalThis.document
    else globalThis.document = original
  })
  const host = {
    nativeMirrorDisplay: true, options: { lookingGlassEmoticonStyle: 'particles' }, scene: new THREE.Scene(),
    particles: new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3)), new THREE.PointsMaterial()),
    mirrorMath: { minimum: { y: .4 }, maximum: { y: .6 } }
  }
  host.particles.visible = false
  const pose = { emoji: '😀', rotationZ: -.9, rotationX: .83, rotationY: .92, flipX: true, activeCircleIndex: 2, activeNoteColour: '#ffaa00' }
  updateLookingGlassEmoticonParticles(host, THREE, pose)
  const state = host.lookingGlassEmoticonState
  assert.equal(state.group.parent, host.scene)
  assert.equal(state.group.visible, true)
  assert.ok(state.points.isPoints)
  assert.ok(state.points.geometry.attributes.position.count > 0)
  assert.ok(Math.abs(state.group.position.y - (.2 * 3.14 / 2 + .26 - .025 * 2)) < 1e-8)

  // Compare sampled geometry with Canvas transform(), rotate() and mirroring,
  // independently of Three's Matrix4 implementation.
  for (const flipX of [false, true]) for (const rotationZ of [-Math.PI / 2, -.9, -2.1]) {
    updateLookingGlassEmoticonParticles(host, THREE, { ...pose, flipX, rotationZ })
    const sample = new THREE.Vector3(.2, -.13, 0)
    const canvasX = sample.x * (flipX ? -1 : 1), canvasY = -sample.y
    const rotatedX = canvasX * Math.cos(rotationZ) - canvasY * Math.sin(rotationZ)
    const rotatedY = canvasX * Math.sin(rotationZ) + canvasY * Math.cos(rotationZ)
    sample.applyMatrix4(state.points.matrix)
    assert.ok(Math.abs(sample.x - pose.rotationX * rotatedY) < 1e-8)
    assert.ok(Math.abs(sample.y + pose.rotationY * rotatedX) < 1e-8)
  }
  const geometry = state.points.geometry
  updateLookingGlassEmoticonParticles(host, THREE, { ...pose, rotationZ: -.5 })
  assert.equal(state.points.geometry, geometry)
  let geometryDisposed = 0, materialDisposed = 0
  geometry.addEventListener('dispose', () => geometryDisposed++)
  state.points.material.addEventListener('dispose', () => materialDisposed++)
  updateLookingGlassEmoticonParticles(host, THREE, { ...pose, emoji: '😎' })
  assert.equal(geometryDisposed, 1)
  assert.equal(materialDisposed, 1)
  assert.notEqual(state.points.geometry, geometry)
  host.options.lookingGlassEmoticons = false
  updateLookingGlassEmoticonParticles(host, THREE, pose)
  assert.equal(state.group.visible, false)
  disposeLookingGlassEmoticonParticles(host)
  assert.equal(state.group.parent, null)
  assert.equal(host.lookingGlassEmoticonState, null)
  host.particles.geometry.dispose()
  host.particles.material.dispose()
})

test('crisp is the default: solid double-sided texture, cached pose, font refresh, style switching and cleanup', t => {
  const original = globalThis.document
  let fontReady = false, readbacks = 0
  const pixels = new Uint8ClampedArray(192 * 192 * 4)
  pixels.set([255, 255, 255, 255], (96 * 192 + 96) * 4)
  globalThis.document = {
    fonts: { check: () => fontReady, load: async () => [] },
    createElement: () => ({ getContext: () => ({
      clearRect() {}, scale() {}, save() {}, restore() {}, strokeText() {}, fillText() {},
      beginPath() {}, arc() {}, fill() {}, getImageData() { readbacks++; return { data: pixels } }
    }) })
  }
  t.after(() => {
    if (original === undefined) delete globalThis.document
    else globalThis.document = original
  })
  const host = {
    nativeMirrorDisplay: true, options: {}, scene: new THREE.Scene(),
    particles: new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3)), new THREE.PointsMaterial())
  }
  const pose = { emoji: '😀', rotationZ: -Math.PI / 2, rotationX: .85, rotationY: .95, activeCircleIndex: 3, activeNoteColour: '#ffaa00' }
  updateLookingGlassEmoticonParticles(host, THREE, pose)
  const state = host.lookingGlassEmoticonState
  assert.equal(state.group.parent, host.scene)
  assert.ok(state.points.isMesh)
  assert.equal(state.points.geometry.type, 'PlaneGeometry')
  assert.equal(state.points.material.opacity, 1)
  assert.equal(state.points.material.side, THREE.DoubleSide)
  assert.equal(state.points.material.toneMapped, false)
  const texture = state.points.material.map
  assert.equal(texture.image.width, 768)
  assert.equal(texture.image.height, 768)
  assert.equal(texture.colorSpace, THREE.SRGBColorSpace)
  assert.equal(readbacks, 0)
  const initialGeometry = state.points.geometry
  updateLookingGlassEmoticonParticles(host, THREE, { ...pose, rotationZ: -.3, flipX: true })
  assert.equal(state.points.geometry, initialGeometry)
  assert.equal(state.points.material.map, texture)

  let oldTextureDisposals = 0
  texture.addEventListener('dispose', () => oldTextureDisposals++)
  fontReady = true
  updateLookingGlassEmoticonParticles(host, THREE, pose)
  assert.equal(oldTextureDisposals, 1)
  assert.notEqual(state.points.material.map, texture)
  const sharpTexture = state.points.material.map
  let sharpTextureDisposals = 0
  sharpTexture.addEventListener('dispose', () => sharpTextureDisposals++)
  host.options.lookingGlassEmoticonStyle = 'particles'
  updateLookingGlassEmoticonParticles(host, THREE, pose)
  assert.ok(state.points.isPoints)
  assert.equal(sharpTextureDisposals, 1)
  assert.equal(readbacks, 1)
  host.options.lookingGlassEmoticonStyle = 'crisp'
  updateLookingGlassEmoticonParticles(host, THREE, pose)
  assert.ok(state.points.isMesh)
  const finalTexture = state.points.material.map
  let finalTextureDisposals = 0
  finalTexture.addEventListener('dispose', () => finalTextureDisposals++)
  disposeLookingGlassEmoticonParticles(host)
  assert.equal(finalTextureDisposals, 1)
  assert.equal(state.group.parent, null)
  host.particles.geometry.dispose()
  host.particles.material.dispose()
})
