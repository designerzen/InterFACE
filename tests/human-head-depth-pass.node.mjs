import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Matrix4, Vector3, Ray, FrontSide, Box3 } from 'three'
import { MeshBVH } from 'three-mesh-bvh'
import { prepareHumanHead } from '../source/models/human-head.js'
import { createHumanHeadDepthPass } from '../source/display/human-head-depth-pass.js'
import { createHeadDeformer } from '../source/display/head-deformation.js'

test('depth pass shares animated head geometry and resolves actual overlapping surfaces', async () => {
  const bytes = fs.readFileSync(new URL('../source/assets/actors/ict-facekit.glb', import.meta.url))
  const { scene } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
  const head = prepareHumanHead(scene), mesh = head.getObjectByName('ICTHead')
  const deform = createHeadDeformer(head)
  const depthPass = createHumanHeadDepthPass(head), pass = mesh.children[0]
  assert.equal(pass.geometry, mesh.geometry)
  assert.equal(pass.morphTargetInfluences, mesh.morphTargetInfluences)
  assert.equal(pass.userData.faceLandmarks, undefined, 'depth geometry must not duplicate fitting correspondences')
  assert.ok(pass.matrix.equals(new Matrix4()))
  head.updateMatrixWorld(true)
  assert.deepEqual(pass.matrixWorld.elements, mesh.matrixWorld.elements)
  mesh.morphTargetInfluences[mesh.morphTargetDictionary.jawOpen] = .7
  deform.update()
  assert.equal(pass.geometry.attributes.position.version, mesh.geometry.attributes.position.version)
  mesh.morphTargetInfluences.fill(0)
  deform.update()

  // This ray crosses two front-facing surfaces in the bundled nose geometry.
  // Without a prepass both blend; with it only the nearest depth can pass.
  const bounds = new Box3().setFromBufferAttribute(mesh.geometry.attributes.position)
  const size = bounds.getSize(new Vector3()), centre = bounds.getCenter(new Vector3())
  const ray = new Ray(new Vector3(centre.x - .08040909090909089 * size.x,
    bounds.min.y + .4694090909090909 * size.y, bounds.max.z + size.y), new Vector3(0, 0, -1))
  const hits = new MeshBVH(mesh.geometry, { indirect: true }).raycast(ray, FrontSide)
  assert.ok(hits.length > 1)
  const nearest = Math.min(...hits.map(hit => hit.distance))
  assert.equal(hits.filter(hit => hit.distance <= nearest).length, 1)
  assert.equal(pass.material.colorWrite, false)
  assert.equal(pass.material.depthWrite, true)
  assert.equal(pass.material.depthTest, true)
  depthPass.update(true)
  assert.equal(pass.visible, true)
  depthPass.update(false)
  assert.equal(pass.visible, false)
  depthPass.dispose()
  assert.equal(pass.parent, null)
  assert.ok(mesh.geometry.attributes.position.count > 0)
})
