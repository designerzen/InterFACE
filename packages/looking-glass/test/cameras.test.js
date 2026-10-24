import test from 'node:test'
import assert from 'node:assert/strict'
import { PerspectiveCamera, Vector3, WebGPUCoordinateSystem } from 'three/webgpu'
import { createViewCameras } from '../src/cameras.js'
import { normalizeCalibration, normalizeQuilt } from '../src/calibration.js'
import { calibration } from './fixtures.js'

test('all off-axis views agree on the focus plane, including a rotated camera', () => {
  const source = new PerspectiveCamera(30, .75, .1, 100)
  source.position.set(2, 1, 5)
  source.lookAt(0, 0, 0)
  source.updateMatrixWorld()
  for (const coordinateSystem of [source.coordinateSystem, WebGPUCoordinateSystem]) {
    source.coordinateSystem = coordinateSystem
    const rig = createViewCameras(source, normalizeQuilt(), normalizeCalibration(calibration), { focusDistance: 2 })
    const focus = new Vector3(0, 0, -2).applyMatrix4(source.matrixWorld)
    const original = source.matrixWorld.clone()
    for (const camera of rig.update()) {
      const projected = focus.clone().project(camera)
      assert.ok(Math.abs(projected.x) < 1e-10)
      assert.ok(Math.abs(projected.y) < 1e-10)
      assert.ok(projected.z >= -1 && projected.z <= 1)
    }
    assert.deepEqual(source.matrixWorld, original)
    const cameras = rig.cameras.slice()
    rig.update()
    assert.equal(rig.cameras[0], cameras[0])
  }
})

test('zero depthiness gives identical views; invalid focus is rejected', () => {
  const source = new PerspectiveCamera()
  const config = normalizeCalibration(calibration)
  const quilt = normalizeQuilt()
  const rig = createViewCameras(source, quilt, config, { depthiness: 0 })
  const cameras = rig.update()
  assert.deepEqual(cameras[0].projectionMatrix, cameras[47].projectionMatrix)
  assert.throws(() => createViewCameras(source, quilt, config, { focusDistance: 0 }))
})
