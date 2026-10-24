import * as THREE from 'three'
const { Vector3, Quaternion, Matrix4, Euler } = THREE
import { MirrorLifecycle } from './mirror-lifecycle.js'
import { createWalls, disposeWalls } from './walls.js'

export function disposeMirrorStage(host) {
  host.mirrorLifecycle = null
  host.mirrorMaterials = null
  host.mirrorPerson = null
  host.avatarPrediction = null
  host.mirrorFrameSignature = null
}

export function updateMirrorFrame(host) {
  if (!host.scene || !host.camera || host.options.showWalls === false) return
  const calibration = host.mirrorCalibration
  const frame = calibration ? {
    wallAttachToCamera: false, wallHeight: calibration.targetDiam,
    wallWidth: calibration.targetDiam * calibration.aspect, wallAspectRatio: calibration.aspect,
    wallFrontZ: calibration.targetZ, wallCenterX: calibration.targetX, wallCenterY: calibration.targetY,
    wallCenterZ: undefined, wallDepth: calibration.targetDiam * 5, wallBackScale: 1
  } : { wallAttachToCamera: true, wallBackScale: 1 }
  const signature = JSON.stringify([frame, host.camera.aspect, host.camera.fov, host.camera.zoom])
  if (host.mirrorFrameSignature === signature) return
  disposeWalls(host.walls)
  host.walls = createWalls(THREE, { ...host.options, ...frame }, host.camera)
  if (host.walls) {
    if (frame.wallAttachToCamera) {
      host.camera.add(host.walls)
      if (!host.camera.parent) host.scene.add(host.camera)
    } else host.scene.add(host.walls)
  }
  host.mirrorFrameSignature = signature
}

export function captureMirrorPerson(host, person) {
  if (host.mirrorPerson !== person || host.mirrorBirthTime !== person.createdAt) {
    if (host.mirrorLifecycle) host.mirrorLifecycle.wasAlive = false
    host.mirrorBirthTime = person.createdAt
  }
  host.mirrorPerson = person
  host.avatarPrediction = person.data
  host.mirrorLastSeen = performance.now()
}

export function updateMirrorStage(host, now = performance.now()) {
  updateMirrorFrame(host)
  const geometry = host.particles?.geometry
  if (!geometry?.attributes.position || !host.avatar?.scene?.userData.humanFace) return
  const count = geometry.attributes.position.count
  if (host.mirrorLifecycle?.scales.length !== count) {
    host.mirrorLifecycle = new MirrorLifecycle(count)
    host.mirrorLastTime = now
    host.mirrorMaterials = []
    host.avatar.scene.traverse(mesh => {
      if (!mesh.isMesh) return
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      for (const material of materials) {
        material.transparent = true
        material.opacity = 0
        material.depthWrite = false
        material.depthTest = true
        material.needsUpdate = true
        host.mirrorMaterials.push(material)
      }
      mesh.renderOrder = 10
    })
    host.particles.renderOrder = 20
    host.particles.frustumCulled = false
    host.particles.material.depthWrite = false
    host.particles.material.depthTest = true
  }
  const state = host.mirrorLifecycle, options = host.options
  const delta = Math.max(0, (now - host.mirrorLastTime) / 1000)
  host.mirrorLastTime = now
  const person = host.mirrorPerson
  const prediction = person?.data
  const points = prediction?.keypoints ?? prediction?.faceLandmarks
  const alive = Boolean(points?.length && person.dead !== true && person.alive !== false &&
    (typeof person.alive === 'boolean' || now - host.mirrorLastSeen < (options.mirrorTrackingTimeout ?? 1200)))
  if (alive) {
    const minimum = new Vector3(Infinity, Infinity, Infinity), maximum = new Vector3(-Infinity, -Infinity, -Infinity), point = new Vector3()
    for (const p of points) {
      if (![p.x, p.y, p.z ?? 0].every(Number.isFinite)) continue
      point.set(p.x, p.y, p.z ?? 0)
      minimum.min(point); maximum.max(point)
    }
    if (!Number.isFinite(minimum.x)) return
    const centre = minimum.clone().add(maximum).multiplyScalar(.5)
    const zoom = options.mirrorFaceScale ?? 3.14
    const headHeight = (maximum.y - minimum.y) * zoom
    const anchor = new Vector3(options.mirrorCenterX ?? 0, options.mirrorCenterY ?? 0, options.mirrorCenterZ ?? 0)
    for (let i = 0; i < count; i++) {
      const candidate = points[i % points.length], k = i * 3
      const p = [candidate.x, candidate.y, candidate.z ?? 0].every(Number.isFinite) ? candidate : centre
      state.targets[k] = (p.x - centre.x) * zoom + anchor.x
      state.targets[k + 1] = -(p.y - centre.y) * zoom + anchor.y
      state.targets[k + 2] = -((p.z ?? 0) - centre.z) * zoom + anchor.z
    }
    const avatar = host.avatar.scene
    avatar.position.copy(anchor)
    // The neutral head stays centred; only pose and facial expression follow the user.
    avatar.scale.lerp(new Vector3(headHeight, headHeight, headHeight), 1 - Math.exp(-delta * 10))
    const matrix = prediction.facialTransformationMatrixes?.data
    let orientation
    if (matrix?.length === 16) {
      const pose = new Matrix4().fromArray(matrix)
      const translation = new Vector3(), scale = new Vector3()
      orientation = new Quaternion()
      pose.decompose(translation, orientation, scale)
      // Reflect orientation when tracking landmarks were mirrored after inference.
      if (prediction.flipped) { orientation.y *= -1; orientation.z *= -1 }
    } else orientation = new Quaternion().setFromEuler(new Euler(
      -(prediction.pitch ?? 0) * .5, prediction.yaw ?? 0, (prediction.roll ?? 0) * .5))
    avatar.quaternion.slerp(orientation, 1 - Math.exp(-delta * 14))
    host.avatar.updateFromPrediction(prediction.faceBlendshapes?.categories ?? [])
  }
  const halfHeight = host.mirrorCalibration ? host.mirrorCalibration.targetDiam * .5 : host.camera?.isPerspectiveCamera ?
    Math.tan(host.camera.fov * Math.PI / 360) * Math.abs(host.camera.position.z - (options.mirrorCenterZ ?? 0)) : 1
  state.tick(alive, delta, { spawnY: -Math.max(2, halfHeight + .5), gravity: options.mirrorGravity ?? 7.2,
    opacity: options.avatarOpacity ?? .38, fadeSeconds: options.avatarFadeSeconds ?? 1.2 })
  host.particles.rotation.set(0, 0, 0)
  host.particles.position.set(0, 0, 0)
  geometry.attributes.position.array.set(state.positions)
  geometry.attributes.position.needsUpdate = true
  if (geometry.attributes.scale) { geometry.attributes.scale.array.set(state.scales); geometry.attributes.scale.needsUpdate = true }
  host.particles.visible = state.mode !== 'empty'
  host.particles.material.opacity = 1
  for (const material of host.mirrorMaterials) material.opacity = state.opacity
}
