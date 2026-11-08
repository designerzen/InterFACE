import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { TextureLoader, Texture, Box3, Vector3, Group } from 'three'
import { prepareHumanHead, bindMorphTargets, applyMorphScore } from '../source/models/human-head.js'
import { attachAvatarToParticles, alignAvatarToParticles } from '../source/display/avatar-particle-alignment.js'
import { swapEyeSide } from '../source/models/blendshapes.js'
import Avatar from '../source/models/avatar.js'
import { createLoaderForModel } from '../source/models/avatars.js'

test('local human rig retains 52 usable targets, white materials, and centred neutral geometry', () => {
  const original = TextureLoader.prototype.load
  const previousWindow = globalThis.window
  TextureLoader.prototype.load = () => new Texture()
  globalThis.window = { URL: globalThis.URL }
  let root
  try {
    const bytes = fs.readFileSync(new URL('../source/assets/actors/FaceCapHeadGeneric/Fbx/FaceCapHeadGeneric.fbx', import.meta.url))
    root = new FBXLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
  } finally {
    TextureLoader.prototype.load = original
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
  }
  const head = prepareHumanHead(root)
  const meshes = []
  head.traverse(mesh => { if (mesh.isMesh) {
    assert.equal(mesh.material.color.getHex(), 0xffffff)
    assert.equal(mesh.material.transparent, false)
    assert.equal(mesh.material.depthTest, true)
    if (mesh.morphTargetInfluences?.length) meshes.push(mesh)
  } })
  const bindings = bindMorphTargets(meshes)
  assert.equal(bindings.size, 52)
  for (const name of ['jawOpen', 'mouthSmileLeft', 'browInnerUp', 'eyeBlinkLeft']) {
    applyMorphScore(bindings, name, .8, 1)
    const { mesh, index } = bindings.get(name)[0]
    assert.equal(mesh.morphTargetInfluences[index], .8)
    assert.ok(mesh.geometry.morphAttributes.position[index].array.some(value => Math.abs(value) > 0.001))
  }
  head.updateMatrixWorld(true)
  const bounds = new Box3(), point = new Vector3()
  for (const mesh of meshes) for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
    bounds.expandByPoint(point.fromBufferAttribute(mesh.geometry.attributes.position, i).applyMatrix4(mesh.matrixWorld))
  }
  assert.ok(bounds.getCenter(new Vector3()).length() < 1e-6)
  assert.ok(Math.abs(bounds.getSize(new Vector3()).y - 1) < 1e-6)
})

test('morph indices belong to each mesh and mouth features survive side mapping', () => {
  const a = { morphTargetDictionary: { 'shapes.jawOpen': 0 }, morphTargetInfluences: [0, 0] }
  const b = { morphTargetDictionary: { jawOpen: 1 }, morphTargetInfluences: [0, 0] }
  applyMorphScore(bindMorphTargets([a, b]), 'jawOpen', 1, 1)
  assert.deepEqual(a.morphTargetInfluences, [1, 0])
  assert.deepEqual(b.morphTargetInfluences, [0, 1])
  assert.equal(swapEyeSide('jawOpen'), 'jawOpen')
})

test('Avatar applies real expression predictions through the per-mesh bindings', () => {
  const mesh = { morphTargetDictionary: { 'shapes.jawOpen': 0, 'shapes.eyeBlink_L': 1 }, morphTargetInfluences: [0, 0] }
  const avatar = new Avatar('test', {})
  const originalInfo = console.info, originalError = console.error
  console.info = console.error = () => {}
  try { avatar.setupMorphTargets([mesh]) }
  finally { console.info = originalInfo; console.error = originalError }
  avatar.updateFromPrediction([{ categoryName: 'jawOpen', score: 1 }, { categoryName: 'eyeBlinkLeft', score: .8 }])
  assert.deepEqual(mesh.morphTargetInfluences, [.5, .4])
})

test('FBX and GLB loader factories construct usable Three loaders', async () => {
  assert.equal(typeof (await createLoaderForModel('head.fbx')).loadAsync, 'function')
  assert.equal(typeof (await createLoaderForModel('head.glb')).loadAsync, 'function')
})

test('Avatar loads the complete human hierarchy without texture requests and rejects failed loads', async () => {
  const bytes = fs.readFileSync(new URL('../source/assets/actors/FaceCapHeadGeneric/Fbx/FaceCapHeadGeneric.fbx', import.meta.url))
  const saved = { fetch: globalThis.fetch, window: globalThis.window, ProgressEvent: globalThis.ProgressEvent,
    info: console.info, error: console.error }
  let requests = 0
  globalThis.fetch = async () => { requests++; return new Response(bytes) }
  globalThis.window = { URL: globalThis.URL }
  globalThis.ProgressEvent = class { constructor(type, detail) { Object.assign(this, { type }, detail) } }
  console.info = console.error = () => {}
  try {
    const avatar = new Avatar('human', {})
    const { parent } = await avatar.loadModel({ model: 'http://localhost/human.fbx', humanFace: true, opacity: 1 })
    assert.equal(requests, 1)
    assert.equal(avatar.isMorphable, true)
    assert.equal(avatar.morphBindings.size, 52)
    assert.equal(parent.userData.humanFace, true)
    assert.ok(parent.getObjectByName('eyeLeft'))
    assert.ok(parent.getObjectByName('eyeRight'))
    assert.ok(parent.getObjectByName('teeth'))
    globalThis.fetch = async () => new Response('', { status: 404 })
    await assert.rejects(new Avatar('missing', {}).loadModel({ model: 'http://localhost/missing.fbx', humanFace: true }))
  } finally {
    globalThis.fetch = saved.fetch
    if (saved.window === undefined) delete globalThis.window
    else globalThis.window = saved.window
    if (saved.ProgressEvent === undefined) delete globalThis.ProgressEvent
    else globalThis.ProgressEvent = saved.ProgressEvent
    console.info = saved.info
    console.error = saved.error
  }
})

test('human alignment ignores particle rotation and animated particle geometry', () => {
  const scene = new Group(), particles = new Group(), head = new Group()
  scene.add(particles)
  particles.rotation.x = Math.PI
  head.userData.humanFace = true
  const display = { scene, particles, avatar: { scene: head }, lastFaceZoom: 3,
    avatarPrediction: { keypoints: [{ y: .2 }, { y: .6 }] } }
  attachAvatarToParticles(display, head)
  alignAvatarToParticles(display, { avatarAlignmentSmoothing: 1 })
  assert.equal(head.parent, scene)
  assert.ok(Math.abs(head.scale.y - 1.2) < 1e-10)
  assert.equal(head.rotation.x, 0)
  const before = head.scale.clone()
  particles.geometry = { attributes: { position: { array: new Float32Array([-100, -100, -100, 100, 100, 100]) } } }
  alignAvatarToParticles(display, { avatarAlignmentSmoothing: 1 })
  assert.deepEqual(head.scale, before)
})
