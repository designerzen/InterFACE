import { BufferGeometry, Float32BufferAttribute, Matrix4, Vector3, Triangle } from 'three'
import { MeshBVH } from 'three-mesh-bvh'
import { TRIANGULATION } from '../models/face-mesh-constants.js'
import {
  LIPS_CONNECTIONS, LEFT_EYE_CONNECTIONS, RIGHT_EYE_CONNECTIONS,
  LEFT_EYEBROW_CONNECTIONS, RIGHT_EYEBROW_CONNECTIONS, FACE_OVAL_CONNECTIONS
} from '../models/face-landmark-constants.js'

const contours = [...LIPS_CONNECTIONS, ...LEFT_EYE_CONNECTIONS, ...RIGHT_EYE_CONNECTIONS, ...LEFT_EYEBROW_CONNECTIONS, ...RIGHT_EYEBROW_CONNECTIONS]
const presentationContours = [...contours, ...FACE_OVAL_CONNECTIONS,
  ...[[168, 6], [6, 197], [197, 195], [195, 5], [5, 4], [4, 1], [98, 97], [97, 2], [2, 326], [326, 327]]]

export function createFacialContourCloud(modelCloud, { mode = 'contours', gridSpacing = .04 } = {}) {
  const steps = Math.max(2, Math.min(12, Math.ceil(.16 / gridSpacing)))
  const count = presentationContours.length * steps
  const targets = new Float32Array(count * 3), initialized = new Uint8Array(count)
  return {
    mode, count, targets, motionWeights: new Float32Array(count),
    update(points, centre, zoom, anchor, smoothing = 1) {
      const fallback = modelCloud.update()
      const alpha = Math.max(0, Math.min(1, smoothing))
      for (let i = 0; i < count; i++) {
        const [a, b] = presentationContours[Math.floor(i / steps)], u = (i % steps) / steps
        const p = points?.[a], q = points?.[b], k = i * 3
        if (!centre || !anchor || !p || !q || ![p.x, p.y, p.z ?? 0, q.x, q.y, q.z ?? 0].every(Number.isFinite)) {
          if (!initialized[i]) for (let axis = 0; axis < 3; axis++) targets[k + axis] = fallback[(k + axis) % fallback.length]
          continue
        }
        const x = ((p.x * (1 - u) + q.x * u) - centre.x) * zoom + anchor.x
        const y = -((p.y * (1 - u) + q.y * u) - centre.y) * zoom + anchor.y
        const z = -(((p.z ?? 0) * (1 - u) + (q.z ?? 0) * u) - centre.z) * zoom + anchor.z
        const blend = initialized[i] ? alpha : 1
        targets[k] += (x - targets[k]) * blend
        targets[k + 1] += (y - targets[k + 1]) * blend
        targets[k + 2] += (z - targets[k + 2]) * blend
        initialized[i] = 1
      }
      return targets
    }
  }
}
const neighbours = Array.from({ length: 468 }, () => new Set())
for (let k = 0; k < TRIANGULATION.length; k += 3) for (let e = 0; e < 3; e++) {
  const a = TRIANGULATION[k + e], b = TRIANGULATION[k + (e + 1) % 3]
  neighbours[a].add(b); neighbours[b].add(a)
}
const edgeDistance = new Float32Array(468).fill(Infinity), queue = []
for (const edge of FACE_OVAL_CONNECTIONS) for (const index of edge) if (edgeDistance[index] !== 0) { edgeDistance[index] = 0; queue.push(index) }
for (let i = 0; i < queue.length; i++) for (const next of neighbours[queue[i]]) if (edgeDistance[next] === Infinity) {
  edgeDistance[next] = edgeDistance[queue[i]] + 1; queue.push(next)
}
const edgeWeight = Array.from(edgeDistance, distance => {
  const t = Math.min(1, distance / 3)
  return t * t * (3 - 2 * t)
})

export function createLandmarkDrivenHeadCloud(modelCloud, mesh, { faceParticleCount = 4096 } = {}) {
  const slots = []
  const faceVertexCount = mesh.userData.faceVertexCount
  if (!faceVertexCount) return modelCloud
  if (modelCloud.mode === 'volume') {
    // Preserve every volume-grid cell and add the live facial shell separately.
    for (let i = 0; i < faceParticleCount; i++) slots.push(modelCloud.count + i)
  } else for (let i = 0; i < modelCloud.count; i++) {
    if ([0, 1, 2].every(axis => modelCloud.vertexIds[i * 3 + axis] < faceVertexCount)) slots.push(i)
  }
  const count = modelCloud.mode === 'volume' ? modelCloud.count + slots.length : modelCloud.count
  const motionWeights = new Float32Array(count).fill(1)
  for (const slot of slots) motionWeights[slot] = .25
  for (let i = 0; i < Math.min(468, slots.length); i++) motionWeights[slots[i]] = 0
  const targets = new Float32Array(count * 3), tracked = new Float32Array(468 * 3), valid = new Uint8Array(468)
  const smoothed = new Float32Array(slots.length * 3)
  const bindings = [], seamBindings = []
  const point = new Vector3(), a = new Vector3(), b = new Vector3(), c = new Vector3(), bary = new Vector3(), inverse = new Matrix4()
  let initialized = false, havePrevious = false, seed = 12579
  const random = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296 }
  const world = (index, out) => out.fromArray(tracked, index * 3)
  const initialize = () => {
    const anchors = Math.min(468, slots.length)
    for (let i = 0; i < anchors; i++) bindings.push({ a: i, b: i, c: i, u: 1, v: 0, blend: 1 })
    const detail = Math.min(contours.length * 4, Math.floor((slots.length - anchors) * .35))
    for (let i = 0; i < detail; i++) {
      const [a, b] = contours[i % contours.length]
      const u = (Math.floor(i / contours.length) + 1) / (Math.ceil(detail / contours.length) + 1)
      bindings.push({ a, b, c: b, u, v: 1 - u, blend: 1 })
      motionWeights[slots[bindings.length - 1]] = .08
    }
    const areas = new Float64Array(TRIANGULATION.length / 3), triangle = new Triangle(a, b, c)
    let total = 0
    for (let face = 0; face < areas.length; face++) {
      world(TRIANGULATION[face * 3], a); world(TRIANGULATION[face * 3 + 1], b); world(TRIANGULATION[face * 3 + 2], c)
      total += triangle.getArea(); areas[face] = total
    }
    if (!(total > 1e-12)) { bindings.length = 0; return false }
    const remaining = slots.length - bindings.length
    let face = 0
    for (let i = 0; i < remaining; i++) {
      const area = (i + random()) / remaining * total
      while (areas[face] < area) face++
      let u = random(), v = random()
      if (u + v > 1) { u = 1 - u; v = 1 - v }
      const a = TRIANGULATION[face * 3], b = TRIANGULATION[face * 3 + 1], c = TRIANGULATION[face * 3 + 2]
      bindings.push({ a, b, c, u, v, blend: edgeWeight[a] * u + edgeWeight[b] * v + edgeWeight[c] * (1 - u - v) })
    }
    // Bind only the transition band to the matching model surface once. This
    // avoids blending unrelated random samples at the face/scalp boundary.
    mesh.updateWorldMatrix(true, false)
    inverse.copy(mesh.matrixWorld).invert()
    const geometry = new BufferGeometry().setAttribute('position', new Float32BufferAttribute(mesh.geometry.attributes.position.array.slice(), 3))
    geometry.setIndex(Array.from(mesh.geometry.index.array))
    const bvh = new MeshBVH(geometry, { indirect: true }), nearest = {}
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i]
      if (binding.blend >= .999) continue
      point.set(0, 0, 0).addScaledVector(world(binding.a, a), binding.u).addScaledVector(world(binding.b, b), binding.v).addScaledVector(world(binding.c, c), 1 - binding.u - binding.v).applyMatrix4(inverse)
      bvh.closestPointToPoint(point, nearest)
      const ids = [0, 1, 2].map(axis => geometry.index.getX(nearest.faceIndex * 3 + axis))
      a.fromBufferAttribute(geometry.attributes.position, ids[0]); b.fromBufferAttribute(geometry.attributes.position, ids[1]); c.fromBufferAttribute(geometry.attributes.position, ids[2])
      Triangle.getBarycoord(nearest.point, a, b, c, bary)
      seamBindings[i] = { ids, u: bary.x, v: bary.y }
    }
    geometry.dispose()
    return true
  }
  return {
    mode: modelCloud.mode, count, spacing: modelCloud.spacing, targets, modelCloud, motionWeights,
    facialSlots: Uint32Array.from(slots),
    update(points, centre, zoom, anchor, smoothing = 1) {
      const model = modelCloud.update()
      targets.set(model)
      for (let k = model.length; k < targets.length; k++) targets[k] = model[k % model.length]
      if (!points || !centre || !anchor) return targets
      let validCount = 0
      for (let i = 0; i < 468; i++) {
        const p = points[i]
        valid[i] = p && [p.x, p.y, p.z ?? 0].every(Number.isFinite) ? 1 : 0
        if (!valid[i]) continue
        tracked[i * 3] = (p.x - centre.x) * zoom + anchor.x
        tracked[i * 3 + 1] = -(p.y - centre.y) * zoom + anchor.y
        tracked[i * 3 + 2] = -((p.z ?? 0) - centre.z) * zoom + anchor.z
        validCount++
      }
      if (!initialized) {
        if (validCount !== 468 || !slots.length) return targets
        initialized = initialize()
        if (!initialized) return targets
      }
      const alpha = havePrevious ? Math.max(0, Math.min(1, smoothing)) : 1
      for (let i = 0; i < bindings.length; i++) {
        const binding = bindings[i], k = i * 3, target = slots[i] * 3
        if (!valid[binding.a] || !valid[binding.b] || !valid[binding.c]) {
          if (havePrevious) for (let axis = 0; axis < 3; axis++) targets[target + axis] = smoothed[k + axis]
          continue
        }
        point.set(0, 0, 0).addScaledVector(world(binding.a, a), binding.u).addScaledVector(world(binding.b, b), binding.v).addScaledVector(world(binding.c, c), 1 - binding.u - binding.v)
        const seam = seamBindings[i]
        if (seam) {
          const positions = mesh.geometry.attributes.position
          a.fromBufferAttribute(positions, seam.ids[0]).multiplyScalar(seam.u)
          a.addScaledVector(b.fromBufferAttribute(positions, seam.ids[1]), seam.v)
          a.addScaledVector(c.fromBufferAttribute(positions, seam.ids[2]), 1 - seam.u - seam.v).applyMatrix4(mesh.matrixWorld)
          point.lerp(a, 1 - binding.blend)
        }
        smoothed[k] += (point.x - smoothed[k]) * alpha
        smoothed[k + 1] += (point.y - smoothed[k + 1]) * alpha
        smoothed[k + 2] += (point.z - smoothed[k + 2]) * alpha
        targets[target] = smoothed[k]
        targets[target + 1] = smoothed[k + 1]
        targets[target + 2] = smoothed[k + 2]
      }
      havePrevious = true
      return targets
    }
  }
}
