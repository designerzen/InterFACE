import { Matrix4, Vector3 } from 'three'

const caches = new WeakMap()

// Solve the small normal equations with pivoting. Return null for a degenerate fit.
const solve = (normal, rhs) => {
  const rows = Array.from({ length: 4 }, (_, i) => [...normal.slice(i * 4, i * 4 + 4), rhs[i]])
  for (let column = 0; column < 4; column++) {
    let pivot = column
    for (let row = column + 1; row < 4; row++) if (Math.abs(rows[row][column]) > Math.abs(rows[pivot][column])) pivot = row
    if (Math.abs(rows[pivot][column]) < 1e-12) return null
    const previous = rows[column]
    rows[column] = rows[pivot]
    rows[pivot] = previous
    const divisor = rows[column][column]
    for (let k = column; k < 5; k++) rows[column][k] /= divisor
    for (let row = 0; row < 4; row++) if (row !== column) {
      const factor = rows[row][column]
      for (let k = column; k < 5; k++) rows[row][k] -= factor * rows[column][k]
    }
  }
  return rows.map(row => row[4])
}

export function fitHumanHeadToLandmarks(avatar, points, centre, zoom, anchor, smoothing = 1) {
  let cache = caches.get(avatar)
  if (!cache) {
    const bindings = []
    avatar.traverse(mesh => {
      for (const landmark of mesh.userData?.faceLandmarks ?? []) {
        if (mesh.isMesh) bindings.push({ mesh, ...landmark })
      }
    })
    cache = { bindings, inverse: new Matrix4(), local: new Matrix4(), target: new Matrix4(), point: new Vector3(), fitted: false }
    caches.set(avatar, cache)
  }
  if (cache.bindings.length < 6) return false
  avatar.updateWorldMatrix(true, true)
  cache.inverse.copy(avatar.matrixWorld).invert()
  const normal = new Float64Array(16), rhs = [new Float64Array(4), new Float64Array(4), new Float64Array(4)]
  const pairs = []
  for (const { mesh, vertex, index } of cache.bindings) {
    const tracked = points[index]
    if (!tracked || ![tracked.x, tracked.y, tracked.z].every(Number.isFinite)) continue
    // Evaluate current blendshapes before fitting, rather than fitting a neutral face
    // to an expressive one. Cancel the previous fit to recover model-local positions.
    cache.local.multiplyMatrices(cache.inverse, mesh.matrixWorld)
    mesh.getVertexPosition(vertex, cache.point).applyMatrix4(cache.local)
    const p = [cache.point.x, cache.point.y, cache.point.z, 1]
    const q = [(tracked.x - centre.x) * zoom + anchor.x, -(tracked.y - centre.y) * zoom + anchor.y, -((tracked.z ?? 0) - centre.z) * zoom + anchor.z]
    pairs.push({ p, q })
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) normal[i * 4 + j] += p[i] * p[j]
      for (let axis = 0; axis < 3; axis++) rhs[axis][i] += p[i] * q[axis]
    }
  }
  if (pairs.length < 6) return cache.fitted
  // Weak regularisation limits numerical amplification when a face is near planar.
  const ridge = (normal[0] + normal[5] + normal[10]) * 1e-8
  for (const diagonal of [0, 5, 10]) normal[diagonal] += ridge
  const coefficients = rhs.map(values => solve(normal, values))
  if (coefficients.some(values => !values?.every(Number.isFinite))) return cache.fitted
  const [x, y, z] = coefficients
  cache.target.set(...x, ...y, ...z, 0, 0, 0, 1)
  if (Math.abs(cache.target.determinant()) < 1e-9) return cache.fitted
  const alpha = cache.fitted ? Math.min(1, Math.max(0, smoothing)) : 1
  if (avatar.matrixAutoUpdate) avatar.updateMatrix()
  avatar.matrixAutoUpdate = false
  for (let i = 0; i < 16; i++) avatar.matrix.elements[i] += (cache.target.elements[i] - avatar.matrix.elements[i]) * alpha
  avatar.matrixWorldNeedsUpdate = true
  cache.fitted = true
  const squaredError = pairs.reduce((sum, { p, q }) => sum + coefficients.reduce((error, values, axis) => {
    const residual = values.reduce((value, coefficient, i) => value + coefficient * p[i], 0) - q[axis]
    return error + residual * residual
  }, 0), 0)
  avatar.userData.landmarkFit = { count: pairs.length, rmsError: Math.sqrt(squaredError / pairs.length) }
  return true
}
