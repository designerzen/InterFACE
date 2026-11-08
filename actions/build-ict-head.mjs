import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BLENDSHAPE_IDS } from '../source/models/blendshapes.js'

// Model data: Copyright (c) 2020 USC Institute for Creative Technologies, MIT.
// Preserve the complete upstream notice inside the generated GLB's asset extras.
const revision = 'da5f95a607f5e6b37755b38d3385d7f2853732e5'
// ICT topology: keep only the outer face, head and neck. Mouth/throat and
// eye sockets, gums, tongue, teeth, eyeballs and accessories begin at 11248.
const visibleVertexCount = 11248
const upstream = `https://raw.githubusercontent.com/USC-ICT/ICT-FaceKit/${revision}/`
const cache = path.join(os.tmpdir(), 'photosynth-ict-facekit', revision)
const destination = fileURLToPath(new URL('../source/assets/actors/ict-facekit.glb', import.meta.url))
await fs.mkdir(cache, { recursive: true })

async function source(name) {
  const cached = path.join(cache, name.replaceAll('/', '_'))
  try { return await fs.readFile(cached, 'utf8') } catch {}
  const response = await fetch(upstream + name)
  if (!response.ok) throw new Error(`ICT download failed: ${name} (${response.status})`)
  const text = await response.text()
  await fs.writeFile(cached, text)
  return text
}

function parseOBJ(text, topology = false) {
  const positions = [], indices = []
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith('v ')) positions.push(...line.slice(2).trim().split(/\s+/).slice(0, 3).map(Number))
    else if (topology && line.startsWith('f ')) {
      const face = line.slice(2).trim().split(/\s+/).map(vertex => Number(vertex.split('/')[0]) - 1)
      if (face.some(vertex => vertex >= visibleVertexCount)) continue
      for (let i = 1; i < face.length - 1; i++) indices.push(face[0], face[i], face[i + 1])
    }
  }
  return { positions: new Float32Array(positions), indices: new Uint16Array(indices) }
}

function normals(positions, indices) {
  const result = new Float32Array(positions.length)
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i] * 3, b = indices[i + 1] * 3, c = indices[i + 2] * 3
    const ux = positions[b] - positions[a], uy = positions[b + 1] - positions[a + 1], uz = positions[b + 2] - positions[a + 2]
    const vx = positions[c] - positions[a], vy = positions[c + 1] - positions[a + 1], vz = positions[c + 2] - positions[a + 2]
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx
    for (const k of [a, b, c]) { result[k] += nx; result[k + 1] += ny; result[k + 2] += nz }
  }
  for (let k = 0; k < result.length; k += 3) {
    const length = Math.hypot(result[k], result[k + 1], result[k + 2]) || 1
    result[k] /= length; result[k + 1] /= length; result[k + 2] /= length
  }
  return result
}

const config = JSON.parse(await source('FaceXModel/vertex_indices.json'))
const license = await source('LICENSE')
const neutral = parseOBJ(await source('FaceXModel/generic_neutral_mesh.obj'), true)
const sourcePositionCount = neutral.positions.length
if (sourcePositionCount !== 26719 * 3) throw new Error('Unexpected ICT topology')
neutral.positions = neutral.positions.slice(0, visibleVertexCount * 3)
const count = visibleVertexCount
const sources = new Map()
let cursor = 0
await Promise.all(Array.from({ length: 6 }, async () => {
  while (cursor < config.expressions.length) {
    const name = config.expressions[cursor++]
    const shape = parseOBJ(await source(`FaceXModel/${name}.obj`)).positions
    if (shape.length !== sourcePositionCount) throw new Error(`Topology mismatch: ${name}`)
    sources.set(name, shape.slice(0, visibleVertexCount * 3))
    if (sources.size % 8 === 0) console.log(`Downloaded ${sources.size}/${config.expressions.length} expressions`)
  }
}))

const canonical = name => name.replace(/_L$/, 'Left').replace(/_R$/, 'Right')
const expressions = BLENDSHAPE_IDS.filter(name => name !== 'tongueOut')
const buffers = [], bufferViews = [], accessors = []
let byteLength = 0
function bufferView(array) {
  const padding = (4 - byteLength % 4) % 4
  if (padding) { buffers.push(Buffer.alloc(padding)); byteLength += padding }
  const bytes = Buffer.from(array.buffer, array.byteOffset, array.byteLength)
  const index = bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length }) - 1
  buffers.push(bytes); byteLength += bytes.length
  return index
}
function accessor(array, type, componentType, bounds = false) {
  const item = { bufferView: bufferView(array), componentType, type, count: array.length / (type === 'VEC3' ? 3 : 1) }
  if (bounds) {
    item.min = [Infinity, Infinity, Infinity]; item.max = [-Infinity, -Infinity, -Infinity]
    for (let i = 0; i < array.length; i++) { const axis = i % 3; item.min[axis] = Math.min(item.min[axis], array[i]); item.max[axis] = Math.max(item.max[axis], array[i]) }
  }
  return accessors.push(item) - 1
}
function sparseDelta(base, target) {
  const indices = [], values = []
  const min = [0, 0, 0], max = [0, 0, 0]
  for (let i = 0; i < count; i++) {
    const k = i * 3, delta = [target[k] - base[k], target[k + 1] - base[k + 1], target[k + 2] - base[k + 2]]
    for (let axis = 0; axis < 3; axis++) { min[axis] = Math.min(min[axis], delta[axis]); max[axis] = Math.max(max[axis], delta[axis]) }
    if (delta.some(value => Math.abs(value) > 1e-6)) { indices.push(i); values.push(...delta) }
  }
  // Eye gaze targets may be empty once the eyeballs are removed. Keep their
  // names/bindings with a valid zero-filled glTF accessor, without sparse data.
  if (!indices.length) return accessors.push({ componentType: 5126, type: 'VEC3', count, min, max }) - 1
  return accessors.push({ componentType: 5126, type: 'VEC3', count, min, max, sparse: {
    count: indices.length,
    indices: { bufferView: bufferView(new Uint16Array(indices)), componentType: 5123 },
    values: { bufferView: bufferView(new Float32Array(values)) }
  } }) - 1
}

const baseNormals = normals(neutral.positions, neutral.indices)
const attributes = { POSITION: accessor(neutral.positions, 'VEC3', 5126, true), NORMAL: accessor(baseNormals, 'VEC3', 5126) }
const indices = accessor(neutral.indices, 'SCALAR', 5123)
const targets = expressions.map(name => {
  const names = name === 'browInnerUp' || name === 'cheekPuff' ? [`${name}_L`, `${name}_R`] : [...sources.keys()].filter(key => canonical(key) === name)
  if (!names.length) throw new Error(`Missing required expression: ${name}`)
  const positions = neutral.positions.slice()
  for (const sourceName of names) {
    const shape = sources.get(sourceName)
    for (let k = 0; k < positions.length; k++) positions[k] += shape[k] - neutral.positions[k]
  }
  return { POSITION: sparseDelta(neutral.positions, positions), NORMAL: sparseDelta(baseNormals, normals(positions, neutral.indices)) }
})

// Correspondences from ICT's documented Multi-PIE 68 landmarks to MediaPipe.
const correspondences = [[36, 33], [39, 133], [42, 362], [45, 263], [27, 168], [30, 1], [31, 98], [33, 2], [35, 327], [48, 61], [54, 291], [8, 152]]
const extras = {
  faceVertexCount: 9409,
  faceLandmarks: correspondences.map(([ict, mediapipe]) => ({ vertex: config.idx_to_landmark_verts[ict], index: mediapipe }))
}
const gltf = {
  asset: { version: '2.0', generator: 'PhotoSYNTH ICT converter', copyright: 'Copyright (c) 2020 USC Institute for Creative Technologies', extras: { source: 'https://github.com/USC-ICT/ICT-FaceKit', revision, license } },
  scene: 0, scenes: [{ nodes: [0] }], nodes: [{ name: 'ICTHead', mesh: 0, extras }],
  meshes: [{ name: 'ICTHead', weights: expressions.map(() => 0), extras: { targetNames: expressions }, primitives: [{ attributes, indices, material: 0, targets }] }],
  materials: [{ name: 'Neutral clay', pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 1], roughnessFactor: .85, metallicFactor: 0 } }],
  buffers: [{ byteLength }], bufferViews, accessors
}
const json = Buffer.from(JSON.stringify(gltf))
const jsonLength = Math.ceil(json.length / 4) * 4
const bin = Buffer.concat(buffers), binLength = Math.ceil(bin.length / 4) * 4
const output = Buffer.alloc(12 + 8 + jsonLength + 8 + binLength)
output.writeUInt32LE(0x46546c67, 0); output.writeUInt32LE(2, 4); output.writeUInt32LE(output.length, 8)
output.writeUInt32LE(jsonLength, 12); output.writeUInt32LE(0x4e4f534a, 16)
output.fill(0x20, 20, 20 + jsonLength); json.copy(output, 20)
output.writeUInt32LE(binLength, 20 + jsonLength); output.writeUInt32LE(0x004e4942, 24 + jsonLength); bin.copy(output, 28 + jsonLength)
await fs.writeFile(destination, output)
console.log(`Built ICT head: ${expressions.length} expressions, ${extras.faceLandmarks.length} fitting landmarks, ${(output.length / 1048576).toFixed(2)} MiB`)
