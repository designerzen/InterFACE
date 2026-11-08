import { BufferGeometry, Float32BufferAttribute, Vector3, Ray, DoubleSide, Triangle } from 'three'
import { MeshBVH } from 'three-mesh-bvh'
export { createLandmarkDrivenHeadCloud, createFacialContourCloud } from './landmark-particle-face.js'

export { HEAD_PARTICLE_MODES } from './head-particle-modes.js'

const neutralMeshes = new WeakMap()

// Samples stay attached to triangles. The head is already blended once upstream;
// particle updates only interpolate its final vertices, outside the quilt loop.
export function createHeadParticleCloud(mesh, { count = 8192, mode = 'surface', gridSpacing = 0.04, seed = 12345 } = {}) {
  const geometry = mesh.geometry, position = geometry.attributes.position
  if (!neutralMeshes.has(mesh)) neutralMeshes.set(mesh, position.array.slice())
  const neutral = neutralMeshes.get(mesh)
  const triangles = geometry.index?.array ?? Uint32Array.from({ length: position.count }, (_, i) => i)
  const faceCount = mesh.userData.faceVertexCount ?? position.count
  let minY = Infinity, maxY = -Infinity
  for (let i = 0; i < faceCount; i++) { minY = Math.min(minY, neutral[i * 3 + 1]); maxY = Math.max(maxY, neutral[i * 3 + 1]) }
  const faceHeight = maxY - minY
  if (!(faceHeight > 0)) throw new Error('Head particle geometry requires a nonzero face height')
  const ids = [], weights = [], offsets = []
  const a = new Vector3(), b = new Vector3(), c = new Vector3(), point = new Vector3(), bary = new Vector3()
  const random = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296 }
  const vertices = face => {
    a.fromArray(neutral, triangles[face * 3] * 3)
    b.fromArray(neutral, triangles[face * 3 + 1] * 3)
    c.fromArray(neutral, triangles[face * 3 + 2] * 3)
  }
  const attach = (face, u, v, offset = null) => {
    ids.push(triangles[face * 3], triangles[face * 3 + 1], triangles[face * 3 + 2])
    weights.push(u, v)
    offsets.push(offset?.x ?? 0, offset?.y ?? 0, offset?.z ?? 0)
  }
  let spacing = 0
  const regularGrid = ['grid', 'grid-shell', 'grid-deform'].includes(mode)
  const structuredSurface = ['even-surface', 'slices', 'opaque-shell'].includes(mode)
  if (structuredSurface) {
    if (!Number.isFinite(gridSpacing) || gridSpacing < .015 || gridSpacing > .2) throw new RangeError('Head grid spacing must be between 0.015 and 0.2 of face height')
    spacing = gridSpacing * faceHeight
    const cells = new Map(), separation = spacing * .7
    const accept = (face, u, v) => {
      point.copy(a).multiplyScalar(u).addScaledVector(b, v).addScaledVector(c, 1 - u - v)
      const x = Math.floor(point.x / separation), y = Math.floor(point.y / separation), z = Math.floor(point.z / separation)
      for (let dz = -1; dz <= 1; dz++) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        for (const other of cells.get(`${x + dx},${y + dy},${z + dz}`) ?? []) if (point.distanceToSquared(other) < separation ** 2) return
      }
      const key = `${x},${y},${z}`
      if (!cells.has(key)) cells.set(key, [])
      cells.get(key).push(point.clone())
      attach(face, u, v)
    }
    if (mode === 'slices') {
      // Intersect each triangle with horizontal planes; samples remain attached
      // to its vertices as expressions change. No per-frame slicing or BVH work.
      const edgePoints = [new Vector3(), new Vector3(), new Vector3()], from = new Vector3(), to = new Vector3()
      for (let face = 0; face < triangles.length / 3; face++) {
        vertices(face)
        const low = Math.min(a.y, b.y, c.y), high = Math.max(a.y, b.y, c.y)
        const first = Math.ceil((low - minY) / spacing - .5)
        for (let row = first; minY + (row + .5) * spacing < high; row++) {
          const y = minY + (row + .5) * spacing
          let hits = 0
          for (const [p, q] of [[a, b], [b, c], [c, a]]) if ((p.y <= y && q.y > y) || (q.y <= y && p.y > y)) {
            edgePoints[hits++].copy(p).lerp(q, (y - p.y) / (q.y - p.y))
          }
          if (hits !== 2) continue
          from.copy(edgePoints[0]); to.copy(edgePoints[1])
          const steps = Math.max(1, Math.ceil(from.distanceTo(to) / separation))
          for (let i = 0; i <= steps; i++) {
            point.copy(from).lerp(to, i / steps)
            Triangle.getBarycoord(point, a, b, c, bary)
            accept(face, bary.x, bary.y)
          }
        }
      }
    } else {
      const areas = new Float64Array(triangles.length / 3), triangle = new Triangle(a, b, c)
      let total = 0
      for (let face = 0; face < areas.length; face++) { vertices(face); total += triangle.getArea(); areas[face] = total }
      const candidates = Math.min(250000, Math.ceil(total / (separation ** 2) * 16))
      let face = 0
      for (let i = 0; i < candidates; i++) {
        while (areas[face] < (i + .5) / candidates * total) face++
        vertices(face)
        // Deterministic low-discrepancy candidates with a minimum-distance filter.
        let u = (i * .7548776662466927 + .5) % 1, v = (i * .5698402909980532 + .5) % 1
        if (u + v > 1) { u = 1 - u; v = 1 - v }
        accept(face, u, v)
      }
    }
    if (!ids.length) throw new Error('Head surface contains no samples at this spacing')
  } else if (mode === 'volume' || regularGrid) {
    if (!Number.isFinite(gridSpacing) || gridSpacing < 0.015 || gridSpacing > 0.2) throw new RangeError('Head grid spacing must be between 0.015 and 0.2 of face height')
    spacing = gridSpacing * faceHeight
    // Close the model's eye, mouth and neck openings on a temporary containment
    // proxy only. These caps are never rendered or sampled as anatomical parts.
    const proxyPositions = [], proxyIndices = [], edges = new Map(), welded = new Map(), remap = new Uint32Array(position.count)
    const tolerance = faceHeight * 1e-6
    for (let i = 0; i < position.count; i++) {
      const key = [0, 1, 2].map(axis => Math.round(neutral[i * 3 + axis] / tolerance)).join(',')
      if (!welded.has(key)) { welded.set(key, proxyPositions.length / 3); proxyPositions.push(...neutral.subarray(i * 3, i * 3 + 3)) }
      remap[i] = welded.get(key)
    }
    for (const index of triangles) proxyIndices.push(remap[index])
    const proxyVertexCount = proxyPositions.length / 3
    for (let i = 0; i < triangles.length; i += 3) for (let e = 0; e < 3; e++) {
      const from = proxyIndices[i + e], to = proxyIndices[i + (e + 1) % 3]
      const key = Math.min(from, to) * proxyVertexCount + Math.max(from, to)
      const edge = edges.get(key)
      if (edge) edge.count++
      else edges.set(key, { from, to, count: 1 })
    }
    const adjacency = new Map()
    for (const edge of edges.values()) if (edge.count === 1) for (const [from, to] of [[edge.from, edge.to], [edge.to, edge.from]]) {
      if (!adjacency.has(from)) adjacency.set(from, [])
      adjacency.get(from).push(to)
    }
    if ([...adjacency.values()].some(neighbours => neighbours.length !== 2)) throw new Error('Head volume requires closed boundary loops')
    const visited = new Set()
    for (const first of adjacency.keys()) {
      if (visited.has(first)) continue
      const loop = []
      let current = first, previous = -1
      do {
        visited.add(current); loop.push(current)
        const next = adjacency.get(current).find(vertex => vertex !== previous)
        previous = current; current = next
      } while (current !== first && !visited.has(current))
      point.set(0, 0, 0)
      for (const vertex of loop) point.add(a.fromArray(proxyPositions, vertex * 3))
      point.divideScalar(loop.length)
      const centre = proxyPositions.length / 3
      proxyPositions.push(point.x, point.y, point.z)
      for (let i = 0; i < loop.length; i++) proxyIndices.push(loop[i], loop[(i + 1) % loop.length], centre)
    }
    const proxy = new BufferGeometry().setAttribute('position', new Float32BufferAttribute(proxyPositions, 3))
    proxy.setIndex(proxyIndices); proxy.computeBoundingBox()
    const surface = new BufferGeometry().setAttribute('position', new Float32BufferAttribute(neutral, 3))
    surface.setIndex(Array.from(triangles))
    const solidBVH = new MeshBVH(proxy, { indirect: true }), surfaceBVH = new MeshBVH(surface, { indirect: true })
    const ray = new Ray(new Vector3(), new Vector3(1, 0, 0)), nearest = {}, offset = new Vector3()
    const { min, max } = proxy.boundingBox
    const candidates = Math.ceil((max.x - min.x) / spacing) * Math.ceil((max.y - min.y) / spacing) * Math.ceil((max.z - min.z) / spacing)
    if (candidates > 250000) throw new RangeError('Head volume grid is too dense')
    for (let z = min.z + spacing * .5; z < max.z; z += spacing) for (let y = min.y + spacing * .5; y < max.y; y += spacing) for (let x = min.x + spacing * .5; x < max.x; x += spacing) {
      point.set(x, y, z); ray.origin.copy(point)
      const hits = solidBVH.raycast(ray, DoubleSide).sort((a, b) => a.distance - b.distance)
      let crossings = 0, last = -Infinity
      for (const hit of hits) if (hit.distance - last > spacing * 1e-6) { crossings++; last = hit.distance }
      if (crossings % 2 !== 1) continue
      surfaceBVH.closestPointToPoint(point, nearest)
      if (mode === 'grid-shell' && nearest.distance > spacing * .8) continue
      vertices(nearest.faceIndex)
      Triangle.getBarycoord(nearest.point, a, b, c, bary)
      offset.copy(point).sub(nearest.point)
      attach(nearest.faceIndex, bary.x, bary.y, offset)
    }
    proxy.dispose(); surface.dispose()
    if (!ids.length) throw new Error('Head volume contains no points at this grid spacing')
  } else {
    const areas = new Float64Array(triangles.length / 3)
    const triangle = new Triangle(a, b, c), centre = new Vector3(), landmark = new Vector3()
    let total = 0
    for (let face = 0; face < areas.length; face++) {
      vertices(face)
      let weight = triangles[face * 3] < faceCount && triangles[face * 3 + 1] < faceCount && triangles[face * 3 + 2] < faceCount ? 2 : 1
      centre.copy(a).add(b).add(c).divideScalar(3)
      for (const { vertex } of mesh.userData.faceLandmarks ?? []) if (centre.distanceToSquared(landmark.fromArray(neutral, vertex * 3)) < (faceHeight * .09) ** 2) { weight *= 2; break }
      total += triangle.getArea() * weight; areas[face] = total
    }
    if (!(total > 0)) throw new Error('Head particle surface has no area')
    let face = 0
    for (let i = 0; i < count; i++) {
      const area = (i + random()) / count * total
      while (areas[face] < area) face++
      let u = random(), v = random()
      if (u + v > 1) { u = 1 - u; v = 1 - v }
      attach(face, u, v)
    }
  }
  const vertexIds = Uint32Array.from(ids), barycentrics = Float32Array.from(weights), localOffsets = Float32Array.from(offsets)
  const local = new Float32Array(ids.length), targets = new Float32Array(ids.length)
  let version = -1
  return {
    mode, count: ids.length / 3, spacing, vertexIds, barycentrics, local, targets,
    ...(regularGrid || structuredSurface ? { motionWeights: new Float32Array(ids.length / 3) } : {}),
    update() {
      if (version !== position.version) {
        const vertices = mode === 'grid' || mode === 'grid-shell' ? neutral : position.array
        for (let i = 0; i < this.count; i++) {
          const k = i * 3, a = vertexIds[k] * 3, b = vertexIds[k + 1] * 3, c = vertexIds[k + 2] * 3
          const u = barycentrics[i * 2], v = barycentrics[i * 2 + 1], w = 1 - u - v
          for (let axis = 0; axis < 3; axis++) local[k + axis] = vertices[a + axis] * u + vertices[b + axis] * v + vertices[c + axis] * w + localOffsets[k + axis]
        }
        version = position.version
      }
      mesh.updateWorldMatrix(true, false)
      const e = mesh.matrixWorld.elements
      for (let k = 0; k < local.length; k += 3) {
        const x = local[k], y = local[k + 1], z = local[k + 2]
        targets[k] = e[0] * x + e[4] * y + e[8] * z + e[12]
        targets[k + 1] = e[1] * x + e[5] * y + e[9] * z + e[13]
        targets[k + 2] = e[2] * x + e[6] * y + e[10] * z + e[14]
      }
      return targets
    }
  }
}
