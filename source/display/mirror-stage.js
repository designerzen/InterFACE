import * as THREE from 'three'
const { Vector3, Quaternion, Matrix4, Euler } = THREE
import { MirrorLifecycle } from './mirror-lifecycle.js'
import { createWalls, disposeWalls, animateWallStripe } from './walls.js'
import { fitHumanHeadToLandmarks } from './fit-human-head.js'
import { subdivideKeypoints } from '../models/keypoint-subdivision.js'
import { createHumanHeadDepthPass } from './human-head-depth-pass.js'

export function disposeMirrorStage(host) {
  host.mirrorDepthPass?.dispose()
  host.mirrorDepthPass = null
  host.mirrorLifecycle?.dispose?.()
  host.mirrorLifecycle = null
  host.mirrorMaterials = null
  host.mirrorPerson = null
  host.avatarPrediction = null
  host.mirrorFrameSignature = null
  host.mirrorTargetState = null
  host.mirrorMath = null
}

export function updateMirrorFrame(host) {
  if (!host.scene || !host.camera) return
  if (host.options.showWalls === false) {
    if (host.walls) { disposeWalls(host.walls); host.walls = null; host.mirrorFrameSignature = null }
    return
  }
  const calibration = host.mirrorCalibration
  const frame = calibration
    ? {
        wallAttachToCamera: false,
        wallHeight: calibration.targetDiam,
        wallWidth: calibration.targetDiam * calibration.aspect,
        wallAspectRatio: calibration.aspect,
        wallFrontZ: calibration.targetZ,
        wallCenterX: calibration.targetX,
        wallCenterY: calibration.targetY,
        wallCenterZ: undefined,
        wallDepth: calibration.targetDiam * (host.options.wallDepthScale ?? 1.25),
        wallBackScale: 1
      }
    : { wallAttachToCamera: true, wallBackScale: 1 }
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
  host.mirrorPredictionVersion = (host.mirrorPredictionVersion ?? 0) + 1
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
  if (host.options.wallStripeAnimation !== false) animateWallStripe(host.walls, host.mirrorBeatTiming, now)
  const geometry = host.particles?.geometry
  if (!geometry?.attributes.position) return
  if (!host.avatar && !host.nativeMirrorDisplay) return
  if (host.avatar && !host.avatar.scene?.userData.humanFace) return
  const count = geometry.attributes.position.count
  if (host.mirrorLifecycle?.scales.length !== count) {
    host.mirrorLifecycle?.dispose?.()
    host.mirrorLifecycle = host.createMirrorLifecycle?.(count) ?? new MirrorLifecycle(count)
    host.mirrorLastTime = now
    host.mirrorMaterials = []
    host.avatar?.scene.traverse((mesh) => {
      if (!mesh.isMesh || mesh.userData.humanHeadDepthPass) return
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
    if (host.avatar && !host.mirrorDepthPass) host.mirrorDepthPass = createHumanHeadDepthPass(host.avatar.scene)
    host.particles.renderOrder = 20
    host.particles.frustumCulled = false
    host.particles.material.depthWrite = false
    host.particles.material.depthTest = true
  }
  const state = host.mirrorLifecycle,
    options = host.options
  const delta = Math.max(0, (now - host.mirrorLastTime) / 1000)
  host.mirrorLastTime = now
  const person = host.mirrorPerson
  const prediction = person?.data
  const points = prediction?.keypoints ?? prediction?.faceLandmarks
  const alive = Boolean(
    points?.length &&
      person.dead !== true &&
      person.alive !== false &&
      (typeof person.alive === 'boolean' || now - host.mirrorLastSeen < (options.mirrorTrackingTimeout ?? 1200))
  )
  if (alive) {
    const math = (host.mirrorMath ??= {
      minimum: new Vector3(),
      maximum: new Vector3(),
      point: new Vector3(),
      centre: new Vector3(),
      anchor: new Vector3(),
      size: new Vector3(),
      orientation: new Quaternion(),
      pose: new Matrix4(),
      translation: new Vector3(),
      scale: new Vector3(),
      euler: new Euler()
    })
    const { minimum, maximum, point, centre, anchor } = math
    if (math.version !== host.mirrorPredictionVersion || math.points !== points) {
      minimum.set(Infinity, Infinity, Infinity)
      maximum.set(-Infinity, -Infinity, -Infinity)
      for (const p of points) {
        if (![p.x, p.y, p.z ?? 0].every(Number.isFinite)) continue
        point.set(p.x, p.y, p.z ?? 0)
        minimum.min(point)
        maximum.max(point)
      }
      if (!Number.isFinite(minimum.x)) return
      centre.copy(minimum).add(maximum).multiplyScalar(0.5)
      math.version = host.mirrorPredictionVersion
      math.points = points
    }
    const zoom = options.mirrorFaceScale ?? 3.14
    const headHeight = (maximum.y - minimum.y) * zoom
    anchor.set(options.mirrorCenterX ?? 0, options.mirrorCenterY ?? 0, options.mirrorCenterZ ?? 0)
    const subdivisions = options.geometrySubdivisions ?? 0
    if (!host.headParticleCloud && (host.mirrorTargetVersion !== host.mirrorPredictionVersion || host.mirrorTargetState !== state || host.mirrorTargetSubdivisions !== subdivisions)) {
      const particlePoints = subdivideKeypoints(points, subdivisions)
      if (state.setTrackingPoints) state.setTrackingPoints(particlePoints, centre, zoom, anchor)
      else {
        for (let i = 0; i < count; i++) {
          const candidate = particlePoints[i % particlePoints.length],
            k = i * 3
          const p = [candidate.x, candidate.y, candidate.z ?? 0].every(Number.isFinite) ? candidate : centre
          state.targets[k] = (p.x - centre.x) * zoom + anchor.x
          state.targets[k + 1] = -(p.y - centre.y) * zoom + anchor.y
          state.targets[k + 2] = -((p.z ?? 0) - centre.z) * zoom + anchor.z
        }
        state.targetsChanged?.()
      }
      host.mirrorTargetVersion = host.mirrorPredictionVersion
      host.mirrorTargetState = state
      host.mirrorTargetSubdivisions = subdivisions
    }
    const avatar = host.avatar?.scene
    if (avatar) {
      if (host.mirrorMorphVersion !== host.mirrorPredictionVersion) {
        const elapsed = Math.max(1 / 60, (now - (host.mirrorMorphTime ?? now)) / 1000)
        host.avatar.updateFromPrediction(prediction.faceBlendshapes?.categories ?? [], 1 - Math.exp(-elapsed * 24))
        host.updateAvatarGeometry?.()
        host.mirrorMorphVersion = host.mirrorPredictionVersion
        host.mirrorMorphTime = now
      }
      if (!fitHumanHeadToLandmarks(avatar, points, centre, zoom, anchor, 1 - Math.exp(-delta * 14))) {
        avatar.position.copy(anchor)
        // Legacy heads without fitting correspondences follow the tracked height and pose.
        avatar.scale.lerp(math.size.setScalar(headHeight), 1 - Math.exp(-delta * 10))
        const matrix = prediction.facialTransformationMatrixes?.data
        const orientation = math.orientation
        if (matrix?.length === 16) {
          math.pose.fromArray(matrix).decompose(math.translation, orientation, math.scale)
          // Reflect orientation when tracking landmarks were mirrored after inference.
          if (prediction.flipped) {
            orientation.y *= -1
            orientation.z *= -1
          }
        } else
          orientation.setFromEuler(
            math.euler.set(-(prediction.pitch ?? 0) * 0.5, prediction.yaw ?? 0, (prediction.roll ?? 0) * 0.5)
          )
        avatar.quaternion.slerp(orientation, 1 - Math.exp(-delta * 14))
      }
    }
    if (host.headParticleCloud) {
      const targets = host.headParticleCloud.update(points, centre, zoom, anchor, 1 - Math.exp(-delta * 28))
      if (state.setWorldTargets) state.setWorldTargets(targets, host.headParticleCloud.motionWeights)
      else {
        state.targets.set(targets)
        state.motionWeights = host.headParticleCloud.motionWeights
        state.targetsChanged?.()
      }
    }
  }
  const halfHeight = host.mirrorCalibration
    ? host.mirrorCalibration.targetDiam * 0.5
    : host.camera?.isPerspectiveCamera
      ? Math.tan((host.camera.fov * Math.PI) / 360) * Math.abs(host.camera.position.z - (options.mirrorCenterZ ?? 0))
      : 1
  state.tick(alive, delta, {
    spawnY: -Math.max(2, halfHeight + 0.5),
    gravity: options.mirrorGravity ?? 7.2,
    particleIdleMotion: options.particleIdleMotion,
    particleWander: options.particleWander,
    particleWanderSpeed: options.particleWanderSpeed,
    particleSpring: options.particleSpring,
    particleArrivalStagger: options.particleArrivalStagger,
    particleFallStagger: options.particleFallStagger,
    opacity: options.headOpacityOverride ?? (options.headParticleMode === 'hybrid' ? .12
      : options.headParticleMode === 'contours' ? 0 : options.headOpacity ?? options.avatarOpacity ?? 0.38),
    fadeSeconds: options.avatarFadeSeconds ?? 1.2
  })
  host.particles.rotation.set(0, 0, 0)
  host.particles.position.set(0, 0, 0)
  if (!state.gpu) {
    geometry.attributes.position.array.set(state.positions)
    geometry.attributes.position.needsUpdate = true
    if (geometry.attributes.scale) {
      geometry.attributes.scale.array.set(state.scales)
      geometry.attributes.scale.needsUpdate = true
    }
  }
  host.particles.visible = !state.gpu && state.mode !== 'empty'
  host.particles.material.opacity = 1
  const maskParticles = options.headParticleMode === 'opaque-shell' && state.mode === 'settled' && state.opacity > 0
  host.mirrorDepthPass?.update(state.opacity > 0)
  // The depth prepass hides overlapping head surfaces. Only opaque-shell mode
  // should also hide particles behind that surface, on either particle backend.
  host.particles.material.depthTest = maskParticles
  if (state.sprite) state.sprite.material.depthTest = maskParticles
  for (const material of host.mirrorMaterials) {
    material.opacity = state.opacity
    // Depth comes from the prepass; colour must never change the resolved mask.
    material.depthWrite = false
    material.polygonOffset = false
    material.polygonOffsetFactor = 0
    material.polygonOffsetUnits = 0
  }
}
