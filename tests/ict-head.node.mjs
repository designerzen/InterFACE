import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Group, Matrix4, Quaternion, Euler, Vector3 } from 'three'
import Avatar from '../source/models/avatar.js'
import { BLENDSHAPE_IDS } from '../source/models/blendshapes.js'
import { prepareHumanHead, bindMorphTargets } from '../source/models/human-head.js'
import { fitHumanHeadToLandmarks } from '../source/display/fit-human-head.js'
import { createHeadDeformer } from '../source/display/head-deformation.js'

const bytes = fs.readFileSync(new URL('../source/assets/actors/ict-facekit.glb', import.meta.url))
const buffer = () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)

test('quilt head deformation matches Three morphs once and does no work for unchanged expressions', async () => {
  const gltf = await new GLTFLoader().parseAsync(buffer(), '')
  const head = prepareHumanHead(gltf.scene)
  const mesh = head.getObjectByName('ICTHead')
  mesh.morphTargetInfluences.forEach((_, i) => { mesh.morphTargetInfluences[i] = (i % 7) / 20 })
  const count = mesh.geometry.attributes.position.count
  const expected = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) mesh.getVertexPosition(i, new Vector3()).toArray(expected, i * 3)
  const normal = mesh.geometry.attributes.normal.array.slice()
  mesh.geometry.morphAttributes.normal.forEach((target, i) => {
    for (let k = 0; k < normal.length; k++) normal[k] += target.array[k] * mesh.morphTargetInfluences[i]
  })
  const deform = createHeadDeformer(head)
  assert.equal(mesh.geometry.morphAttributes.position, undefined, 'quilt shaders must not repeat blendshape evaluation')
  assert.equal(deform.update(), true)
  for (let i = 0; i < expected.length; i++) {
    assert.ok(Math.abs(mesh.geometry.attributes.position.array[i] - expected[i]) < 1e-5)
    assert.ok(Math.abs(mesh.geometry.attributes.normal.array[i] - normal[i]) < 1e-5)
  }
  const version = mesh.geometry.attributes.position.version
  assert.equal(deform.update(), false)
  assert.equal(mesh.geometry.attributes.position.version, version)
  mesh.morphTargetInfluences.fill(0)
  assert.equal(deform.update(), true)
  assert.equal(deform.update(), false)
  assert.equal(mesh.getVertexPosition(0, new Vector3()).x, mesh.geometry.attributes.position.getX(0))
})

test('bundled hairless ICT model has every tracked expression, valid normals and fitting correspondences', async () => {
  const gltf = await new GLTFLoader().parseAsync(buffer(), '')
  assert.match(gltf.asset.extras.license, /MIT License/)
  assert.match(gltf.asset.extras.license, /USC Institute for Creative Technologies/)
  const head = prepareHumanHead(gltf.scene)
  const meshes = []
  head.traverse(mesh => { if (mesh.isMesh) meshes.push(mesh) })
  assert.equal(meshes.length, 1)
  const mesh = meshes[0]
  assert.equal(mesh.name, 'ICTHead')
  assert.equal(mesh.userData.faceVertexCount, 9409)
  assert.equal(mesh.userData.faceLandmarks.length, 12)
  assert.equal(mesh.geometry.attributes.position.count, 11248)
  assert.ok(mesh.geometry.index.array.every(index => index < 11248), 'all internal mouth/throat and eye geometry must be absent')
  const bindings = bindMorphTargets(meshes)
  assert.equal(bindings.size, 51)
  for (const name of BLENDSHAPE_IDS.filter(name => name !== 'tongueOut')) {
    const binding = bindings.get(name)?.[0]
    assert.ok(binding, `Missing ${name}`)
    if (!name.startsWith('eyeLook')) assert.ok(mesh.geometry.morphAttributes.position[binding.index].array.some(value => Math.abs(value) > 1e-5), `${name} does not deform`)
    assert.ok(mesh.geometry.morphAttributes.normal[binding.index].array.every(Number.isFinite))
  }
})

test('real GLB loads through Avatar without extra texture downloads and fits expressions, pose and mirroring', async t => {
  const saved = { fetch: globalThis.fetch, ProgressEvent: globalThis.ProgressEvent, info: console.info, error: console.error }
  let requests = 0
  globalThis.fetch = async () => { requests++; return new Response(bytes) }
  globalThis.ProgressEvent = class { constructor(type, detail) { Object.assign(this, { type }, detail) } }
  console.info = console.error = () => {}
  t.after(() => {
    globalThis.fetch = saved.fetch
    if (saved.ProgressEvent === undefined) delete globalThis.ProgressEvent
    else globalThis.ProgressEvent = saved.ProgressEvent
    console.info = saved.info; console.error = saved.error
  })
  const avatar = new Avatar('ICT', {})
  await avatar.loadModel({ model: 'http://localhost/ict-facekit.glb', humanFace: true, opacity: 1 })
  assert.equal(requests, 1)
  assert.equal(avatar.morphBindings.size, 51)
  const mesh = avatar.scene.getObjectByName('ICTHead')
  const deform = createHeadDeformer(avatar.scene)
  const centre = new Vector3(.5, .5, 0), anchor = new Vector3(.1, -.1, .2), zoom = 3.14
  for (const mirrored of [false, true]) {
    avatar.updateFromPrediction([{ categoryName: 'jawOpen', score: .7 }, { categoryName: 'browInnerUp', score: .3 }], 1)
    deform.update()
    avatar.scene.updateWorldMatrix(true, true)
    const local = new Matrix4().copy(avatar.scene.matrixWorld).invert().multiply(mesh.matrixWorld)
    const target = new Matrix4().compose(new Vector3(.15, -.2, .1), new Quaternion().setFromEuler(new Euler(.1, -.2, .15)), new Vector3(mirrored ? -.8 : .8, .95, .7))
    const points = new Array(478)
    const desired = new Map()
    for (const { vertex, index } of mesh.userData.faceLandmarks) {
      const p = mesh.getVertexPosition(vertex, new Vector3()).applyMatrix4(local).applyMatrix4(target)
      desired.set(index, p)
      points[index] = { x: (p.x - anchor.x) / zoom + centre.x, y: centre.y - (p.y - anchor.y) / zoom, z: centre.z - (p.z - anchor.z) / zoom }
    }
    assert.equal(fitHumanHeadToLandmarks(avatar.scene, points, centre, zoom, anchor, 1), true)
    assert.equal(avatar.scene.matrixAutoUpdate, false)
    assert.equal(avatar.scene.userData.landmarkFit.count, 12)
    assert.ok(avatar.scene.userData.landmarkFit.rmsError < 1e-5)
    avatar.scene.updateWorldMatrix(true, true)
    for (const { vertex, index } of mesh.userData.faceLandmarks) {
      const actual = mesh.getVertexPosition(vertex, new Vector3()).applyMatrix4(mesh.matrixWorld)
      assert.ok(actual.distanceTo(desired.get(index)) < 1e-5, `Landmark ${index} is misaligned`)
    }
    const previous = avatar.scene.matrix.clone()
    assert.equal(fitHumanHeadToLandmarks(avatar.scene, [], centre, zoom, anchor), true)
    assert.deepEqual(avatar.scene.matrix.elements, previous.elements)
  }
  assert.equal(fitHumanHeadToLandmarks(new Group(), [], centre, zoom, anchor), false)
})
