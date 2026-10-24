import { PerspectiveCamera } from 'three/webgpu'

// Parallel cameras with off-axis frusta keep the focus plane stationary; no toe-in.
export function createViewCameras(source, { views }, calibration, { focusDistance = 2, depthiness = 1 } = {}) {
  if (!source?.isPerspectiveCamera) throw new TypeError('A PerspectiveCamera is required')
  if (!Number.isFinite(focusDistance) || focusDistance <= 0 || !Number.isFinite(depthiness) || depthiness < 0) {
    throw new RangeError('Invalid focusDistance or depthiness')
  }
  const cameras = Array.from({ length: views }, () => new PerspectiveCamera())
  return {
    cameras,
    update(coordinateSystem = source.coordinateSystem) {
      source.updateWorldMatrix(true, false)
      if (![source.near, source.far, source.zoom, source.fov].every(Number.isFinite) ||
          source.near <= 0 || source.far <= source.near || source.zoom <= 0 || source.fov <= 0 || source.fov >= 180) {
        throw new RangeError('Camera requires valid clipping planes, field of view and zoom')
      }
      if (source.view?.enabled || source.filmOffset) {
        throw new RangeError('Camera view offsets are not supported; use the quilt focus controls')
      }
      const halfHeight = source.near * Math.tan(source.fov * Math.PI / 360) / source.zoom
      const halfWidth = halfHeight * calibration.aspect
      const cone = calibration.viewCone * depthiness
      if (cone >= Math.PI) throw new RangeError('Effective view cone must be less than 180 degrees')
      for (let i = 0; i < views; i++) {
        const camera = cameras[i]
        camera.copy(source, false)
        camera.coordinateSystem = coordinateSystem
        camera.matrixAutoUpdate = false
        camera.matrixWorldAutoUpdate = false
        camera.matrixWorld.copy(source.matrixWorld)
        const offset = focusDistance * Math.tan(((i + 0.5) / views - 0.5) * cone)
        camera.matrixWorld.elements[12] += source.matrixWorld.elements[0] * offset
        camera.matrixWorld.elements[13] += source.matrixWorld.elements[1] * offset
        camera.matrixWorld.elements[14] += source.matrixWorld.elements[2] * offset
        camera.matrixWorldInverse.copy(camera.matrixWorld).invert()
        const shift = -offset * source.near / focusDistance
        camera.projectionMatrix.makePerspective(
          -halfWidth + shift, halfWidth + shift, halfHeight, -halfHeight,
          source.near, source.far, camera.coordinateSystem
        )
        camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert()
      }
      return cameras
    }
  }
}
