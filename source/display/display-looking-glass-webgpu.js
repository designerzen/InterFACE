import {
  AmbientLight,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  PerspectiveCamera,
  Scene,
  DirectionalLight,
  Color,
  SRGBColorSpace
} from 'three/webgpu'
import * as THREE from 'three/webgpu'
import AbstractDisplay from './display-abstract.js'
import Avatar from '../models/avatar.js'
import { AVATAR_DATA } from '../models/avatar-data.js'
import { unloadModel } from '../models/avatars.js'
import { DEFAULT_OPTIONS_DISPLAY_COMPOSITE, KEYPOINT_QUANTITY } from '../settings/options.displays.js'
import { DISPLAY_LOOKING_GLASS_WEBGPU } from './display-types.js'
import { captureMirrorPerson, updateMirrorStage, disposeMirrorStage } from './mirror-stage.js'
import { disposeWalls, DEFAULT_WALL_OPTIONS } from './walls.js'
import { LookingGlassRenderer } from '../../packages/looking-glass/src/renderer.js'
import { getConnectedPortraits } from '../../packages/looking-glass/src/detect.js'
import { normalizeCalibration } from '../../packages/looking-glass/src/calibration.js'
import { openLookingGlassWindow } from '../../packages/looking-glass/src/window.js'
import { bindPortraitButtons, createSettingControls } from '../../packages/looking-glass/src/buttons.js'
import { easeInSine } from '../maths/easing.js'
import { createHeadDeformer } from './head-deformation.js'
import { createMouthNoteEmitter } from './mouth-note-particles.js'
import { createHeadParticleCloud, createLandmarkDrivenHeadCloud, createFacialContourCloud, HEAD_PARTICLE_MODES } from './head-particle-cloud.js'
import { CAMERA_SETTING_KEYS, normalizeLookingGlassSettings } from './looking-glass-settings.js'
import {
  DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES,
  updateLookingGlassEmoticonParticles,
  disposeLookingGlassEmoticonParticles
} from './looking-glass-emoticon-particles.js'

// Compatibility export for saved display IDs; this renderer does not install a WebXR polyfill.
export const requiredXRSetupForLookingGlass = () => undefined

const defaults = {
  ...DEFAULT_OPTIONS_DISPLAY_COMPOSITE,
  ...DEFAULT_WALL_OPTIONS,
  ...DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES,
  wallBatchPlanes: true,
  particleSize: 0.006,
  geometrySubdivisions: 3,
  headParticleMode: 'surface',
  headParticleGridSpacing: 0.04,
  headOpacity: 0.025,
  cameraDistanceScale: 0.8,
  backend: 'auto',
  controls: '#shared-controls',
  fx: false,
  resize: false,
  inlineFaceFeatures: false,
  targetX: 0,
  targetY: 0,
  targetZ: 1.5,
  targetDiam: 2,
  depthiness: 0.7,
  fovy: (16 * Math.PI) / 180
}

export default class DisplayLookingGlassWebGPU extends AbstractDisplay {
  nativeMirrorDisplay = true
  // The scene draws its own 3D emoticon, so the 2D overlay must not add another
  drawsSceneEmoticon = true
  name = DISPLAY_LOOKING_GLASS_WEBGPU
  get type() {
    return DISPLAY_LOOKING_GLASS_WEBGPU
  }
  get depth() {
    return 100
  }
  get suppressMainOverlay() {
    return Boolean(this.displayWindow)
  }
  count = 0
  lastFaceZoom = 3.14
  stopped = false

  constructor(canvas, width = 480, height = 640, options = {}) {
    options = { ...defaults, ...options, ...normalizeLookingGlassSettings(options.lookingGlassSettings) }
    super(canvas, width, height, options)
    this.inlineSize = { width, height }
    this.abortController = new AbortController()
    this.create(options)
      .then(() => this.loadComplete('ready'))
      .catch((error) => this.loadFailed(error))
  }

  async create(options) {
    const device = options.calibration
      ? { calibration: options.calibration }
      : (await getConnectedPortraits({ signal: this.abortController.signal })).find(
          (device) => !options.portraitSerial || device.calibration?.serial === options.portraitSerial
        )
    if (!device?.calibration) throw new Error('No matching Looking Glass Portrait is connected')
    if (this.stopped) throw new Error('Display was closed during setup')
    const calibration = normalizeCalibration(device.calibration)
    this.output = await LookingGlassRenderer.create({
      canvas: this.canvas,
      calibration: device.calibration,
      backend: options.backend,
      quilt: options.quilt,
      depthiness: options.depthiness
    })
    if (this.stopped) {
      this.output.dispose()
      throw new Error('Display was closed during setup')
    }
    this.renderer = this.output.renderer
    this.renderer.setClearColor(new Color(0), 0)
    this.renderer.setSize(this.inlineSize.width, this.inlineSize.height, false)
    this.scene = new Scene()
    this.scene.add(new AmbientLight(0xffffff, 0.7))
    const light = new DirectionalLight(0xffffff, 1.5)
    light.position.set(-1, 2, 3)
    this.scene.add(light)
    this.camera = new PerspectiveCamera()
    this.mirrorCalibration = {
      aspect: calibration.aspect,
      targetX: options.targetX,
      targetY: options.targetY,
      targetZ: options.targetZ,
      targetDiam: options.targetDiam,
      fovy: options.fovy,
      depthiness: options.depthiness,
      cameraDistanceScale: options.cameraDistanceScale,
      focusOffset: options.focusOffset ?? 0
    }
    this.particles = new Points(
      new BufferGeometry(),
      new PointsMaterial({
        color: options.colour,
        size: options.particleSize,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: true,
        toneMapped: false
      })
    )
    this.particles.visible = false
    this.scene.add(this.particles)
    this.syncParticleGeometry()
    if (options.showAvatar !== false) {
      this.avatar = new Avatar('Neutral human head')
      const { parent, faceMesh } = await this.avatar.loadModel(AVATAR_DATA.human)
      this.faceMesh = faceMesh
      this.headParticleMesh = parent.getObjectByName('ICTHead')
      const deformer = createHeadDeformer(parent)
      this.updateAvatarGeometry = () => {
        const start = performance.now()
        const changed = deformer.update()
        this.headBlendStats = { changed, cpuMs: performance.now() - start }
        return changed
      }
      this.updateAvatarGeometry()
      this.scene.add(parent)
      this.syncParticleGeometry()
    }
    if (this.stopped) throw new Error('Display was closed during setup')
    if (this.renderer.backend.isWebGPUBackend && options.gpuParticles !== false) {
      const { createGPUMirrorLifecycle } = await import('./mirror-gpu.js')
      this.createMirrorLifecycle = (count) => createGPUMirrorLifecycle(this, count)
    }
    this.syncCamera()
    // Keep 2D feedback in the main document when the 3D canvas moves to the panel.
    this.getEffectsContext()
    this.createDisplayButton()
    this.available = true
    return true
  }

  syncCamera() {
    const config = this.mirrorCalibration
    const signature = [
      config.targetX,
      config.targetY,
      config.targetZ,
      config.targetDiam,
      config.fovy,
      config.aspect,
      config.depthiness,
      config.cameraDistanceScale,
      config.focusOffset
    ].join(',')
    if (signature === this.cameraSignature) return
    const distance = ((0.5 * config.targetDiam) / Math.tan(config.fovy * 0.5)) * (config.cameraDistanceScale ?? 0.8)
    const focusDistance = Math.max(.05, distance + (config.focusOffset ?? 0))
    this.camera.fov = (config.fovy * 180) / Math.PI
    this.camera.aspect = config.aspect
    this.camera.near = 0.01
    this.camera.far = 1000
    this.camera.position.set(config.targetX, config.targetY, config.targetZ + distance)
    this.camera.lookAt(config.targetX, config.targetY, config.targetZ)
    this.camera.updateProjectionMatrix()
    if (
      this.output.viewOptions.focusDistance !== focusDistance ||
      this.output.viewOptions.depthiness !== config.depthiness
    ) {
      this.output.viewOptions.focusDistance = focusDistance
      this.output.viewOptions.depthiness = config.depthiness
      this.output.sourceCamera = null
    }
    this.cameraSignature = signature
  }

  createDisplayButton() {
    const destination = document.querySelector(this.options.controls) ?? document.body
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'looking-glass-output-button'
    button.textContent = 'OPEN LOOKING GLASS'
    const manualPlacement = 'Move the output window to your Portrait, then press ENTER FULLSCREEN in that window.'
    button.title = manualPlacement
    this.toggleDisplay = () => {
      if (this.displayWindow) {
        this.displayWindow.close()
        return
      }
      try {
        const calibration = this.output.calibration
        this.displayWindow = openLookingGlassWindow({
          canvas: this.canvas,
          width: calibration.screenWidth,
          height: calibration.screenHeight,
          serial: calibration.serial,
          onClose: () => {
            this.portraitButtons?.dispose()
            this.displayWindow = null
            this.renderer.setSize(this.inlineSize.width, this.inlineSize.height, false)
            if (this.faceFeatureOverlay) this.faceFeatureOverlay.hidden = false
            button.textContent = 'OPEN LOOKING GLASS'
            button.title = manualPlacement
          }
        })
        this.renderer.setSize(calibration.screenWidth, calibration.screenHeight, false)
        if (this.faceFeatureOverlay) this.faceFeatureOverlay.hidden = true
        button.textContent = 'CLOSE LOOKING GLASS'
        const outputWindow = this.displayWindow
        outputWindow.placement.then(({ placed }) => {
          if (this.displayWindow === outputWindow) button.title = placed
            ? 'Output moved to the Portrait. Press ENTER FULLSCREEN in the output window.' : manualPlacement
        })
        const config = this.mirrorCalibration
        const controls = createSettingControls({
          settings: [
            {
              name: 'Depth',
              min: 0,
              max: 1.5,
              step: 0.05,
              get: () => config.depthiness,
              set: (value) => {
                this.setLookingGlassSettings({ depthiness: value })
              }
            },
            {
              name: 'Scene size',
              min: 0.5,
              max: 5,
              step: 0.1,
              get: () => config.targetDiam,
              set: (value) => {
                this.setLookingGlassSettings({ targetDiam: value })
              }
            },
            {
              name: 'Field of view',
              min: 0.0873,
              max: 1.0472,
              step: Math.PI / 180,
              get: () => config.fovy,
              set: (value) => {
                this.setLookingGlassSettings({ fovy: value })
              }
            }
          ],
          onChange: this.options.portraitButtons?.onChange
        })
        this.portraitButtons = bindPortraitButtons({
          targets: [window, this.displayWindow.window],
          onButton: (button, event) => {
            if (button === 'select' && !outputWindow.window.document.fullscreenElement) {
              // Call directly during the hardware key event to retain user activation.
              outputWindow.requestFullscreen()
              return
            }
            if (this.options.portraitButtons?.onButton) this.options.portraitButtons.onButton(button, event)
            else controls.press(button)
          }
        })
      } catch (error) {
        console.error('Could not open Looking Glass output', error)
      }
    }
    button.addEventListener('click', this.toggleDisplay)
    destination.append(button)
    this.outputButton = button
  }

  drawPerson(person, _beat, colours) {
    if (!this.available || !person?.data) return
    captureMirrorPerson(this, person)
    this.particlePalette = {
      hue: ((person.hue ?? colours?.h ?? 0) % 360 + 360) % 360 / 360,
      saturation: (person.saturation ?? colours?.s ?? 75) / 100,
      lightness: (person.luminosity ?? colours?.l ?? 60) / 100
    }
    this.updateParticleColour()
  }

  updateParticleColour() {
    if (!this.particles || !this.particlePalette) return
    const { hue, saturation, lightness } = this.particlePalette
    this.particles.material.color.setHSL(hue, saturation, lightness, SRGBColorSpace)
  }

  setBeatTiming(timing) {
    this.mirrorBeatTiming = timing
  }

  emitNoteParticles(person, options) {
    if (!this.available || this.stopped || this.options.mouthNoteParticles === false) return
    this.mouthNoteEmitter ??= createMouthNoteEmitter(this, THREE)
    this.mouthNoteEmitter.emit(person, options)
  }

  syncParticleGeometry() {
    if (!this.particles) return
    const points = this.mirrorPerson?.data?.keypoints ?? this.mirrorPerson?.data?.faceLandmarks
    const divisions = this.options.geometrySubdivisions ?? 3
    if (this.headParticleMesh) {
      const mode = this.options.headParticleMode ?? 'surface'
      const gridSpacing = this.options.headParticleGridSpacing ?? .04
      const signature = [mode, divisions, gridSpacing].join(',')
      if (signature !== this.headParticleSignature) {
        const modelCloud = createHeadParticleCloud(this.headParticleMesh, {
          mode: ['contours', 'hybrid'].includes(mode) ? 'even-surface' : mode,
          gridSpacing, count: Math.min(65536, 1024 * 2 ** divisions)
        })
        this.headParticleCloud = ['contours', 'hybrid'].includes(mode)
          ? createFacialContourCloud(modelCloud, { mode, gridSpacing })
          : ['surface', 'volume'].includes(mode) ? createLandmarkDrivenHeadCloud(modelCloud, this.headParticleMesh, {
          faceParticleCount: Math.min(8192, Math.max(1024, 512 * 2 ** divisions))
        }) : modelCloud
        this.headParticleSignature = signature
        this.mirrorLifecycle?.dispose?.()
        this.mirrorLifecycle = null
      }
    }
    const quantity = this.headParticleCloud?.count ?? (divisions > 0
      ? ((points?.length ?? KEYPOINT_QUANTITY) - 1) * 2 ** divisions + 1
      : Math.max(1, Math.floor(this.options.quantity ?? KEYPOINT_QUANTITY)))
    if (this.particles.geometry.attributes.position?.count === quantity) return
    this.mirrorLifecycle?.dispose?.()
    this.mirrorLifecycle = null
    const previous = this.particles.geometry
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(new Float32Array(quantity * 3), 3))
    geometry.setAttribute('scale', new Float32BufferAttribute(new Float32Array(quantity), 1))
    this.particles.geometry = geometry
    previous.dispose()
  }

  onGeometrySubdivisionsChanged() {
    this.syncParticleGeometry()
  }

  setHeadParticleOptions({ mode, gridSpacing } = {}) {
    if (mode !== undefined) this.options.headParticleMode = HEAD_PARTICLE_MODES.includes(mode) ? mode : 'surface'
    if (gridSpacing !== undefined) this.options.headParticleGridSpacing = gridSpacing
    this.syncParticleGeometry()
    this.options.onHeadParticleModeChange?.(this.options.headParticleMode ?? 'surface')
  }

  getLookingGlassSettings() {
    const values = normalizeLookingGlassSettings({ ...this.options, ...this.mirrorCalibration })
    values.headOpacityOverride ??= this.options.headParticleMode === 'hybrid' ? .12
      : this.options.headParticleMode === 'contours' ? 0 : this.options.headOpacity ?? .025
    return values
  }

  setLookingGlassSettings(values, { persist = true } = {}) {
    const settings = normalizeLookingGlassSettings(values)
    Object.assign(this.options, settings)
    for (const key of CAMERA_SETTING_KEYS) if (key in settings) this.mirrorCalibration[key] = settings[key]
    if ('headParticleMode' in settings || 'headParticleGridSpacing' in settings || 'geometrySubdivisions' in settings) this.syncParticleGeometry()
    if ('particleSize' in settings) {
      this.particles.material.size = settings.particleSize
      if (this.mirrorLifecycle?.sprite) this.mirrorLifecycle.sprite.material.scaleNode.value = settings.particleSize
    }
    this.options.onLookingGlassSettingsChange?.(settings, { persist })
  }

  render() {
    if (!this.available || this.stopped) return
    const start = performance.now()
    this.syncCamera()
    this.syncParticleGeometry()
    this.updateParticleColour()
    updateMirrorStage(this)
    for (const material of this.mirrorMaterials ?? []) {
      if (this.options.headColourMode === 'note' && this.particlePalette) {
        const { hue, saturation, lightness } = this.particlePalette
        material.color.setHSL(hue, saturation, lightness, SRGBColorSpace)
      } else material.color.set(0xffffff)
    }
    this.drawPersonEmoticonParticles(this.mirrorPerson)
    this.mouthNoteEmitter?.update(start)
    const sceneUpdated = performance.now()
    if (this.displayWindow) this.output.render(this.scene, this.camera)
    else this.renderer.render(this.scene, this.camera)
    // CPU submission timings, not GPU execution times; available for profiling.
    this.renderStats = {
      mode: this.displayWindow ? 'portrait' : 'inline',
      views: this.displayWindow ? this.output.quilt.views : 1,
      cpuMs: performance.now() - start,
      sceneUpdateCpuMs: sceneUpdated - start,
      headBlendCpuMs: this.headBlendStats?.cpuMs ?? 0,
      backend: this.output.stats.backend,
      ...(this.displayWindow ? { quiltSubmitMs: this.output.stats.quiltSubmitMs, outputSubmitMs: this.output.stats.outputSubmitMs } : {})
    }
    this.count++
    super.render()
  }

  setAnimationLoop(callback, autoStart = false) {
    this.cancelAnimationLoop()
    this.start = () => {
      if (!this.renderer || this.animationLoopRunning) return
      this.animationLoopRunning = true
      this.renderer.setAnimationLoop(callback)
    }
    if (autoStart) this.start()
  }
  cancelAnimationLoop() {
    this.animationLoopRunning = false
    this.renderer?.setAnimationLoop(null)
  }

  drawFaceFeatures(...args) {
    if (!this.options.inlineFaceFeatures || this.displayWindow) return false
    return super.drawFaceFeatures(...args)
  }

  setSize(width, height) {
    if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) return false
    this.inlineSize = { width, height }
    this.canvasWidth = width
    this.canvasHeight = height
    // Camera/media resizes must not overwrite the panel's calibrated output size.
    if (!this.displayWindow) this.renderer?.setSize(width, height, false)
    for (const overlay of [this.effectsCanvas, this.faceFeatureOverlay]) {
      if (overlay) { overlay.width = width; overlay.height = height }
    }
    return true
  }
  clear() {}
  drawText() {}
  drawParagraph() {}
  drawPersonEmoticonParticles(person) {
    if (!person?.emoticon || !person.data || person.dead === true || person.alive === false ||
        (this.mirrorLifecycle && !this.mirrorLifecycle.wasAlive)) {
      if (this.lookingGlassEmoticonState) this.lookingGlassEmoticonState.group.visible = false
      return
    }
    const prediction = person.data
    // Match Person.drawEmojiText's 2D pose, including its yaw easing and mirroring.
    this.drawEmoticon(
      0, 0, person.emoticon,
      (prediction.roll ?? 0) * Math.PI * 0.28 - Math.PI / 2,
      0.8 + (1 - Math.abs(prediction.pitch ?? 0)) * 0.2,
      0.75 + easeInSine(1 - Math.abs(prediction.yaw ?? 0)) * 0.25,
      person.noteIndex, person.quantityOfPlayableNotes,
      person.emojiDetector?.isMirrored ?? false,
      person.headNoteRangeDegrees, person.hsl
    )
  }

  drawEmoticon(_x, _y, emoji, rotationZ = 0, rotationY = 0, rotationX = 0, activeCircleIndex = -1, numberOfNotesInKey = 12, flipX = false, noteRangeDegrees = 90, activeNoteColour = '#fff') {
    updateLookingGlassEmoticonParticles(this, THREE, {
      emoji, rotationZ, rotationY, rotationX, activeCircleIndex,
      numberOfNotesInKey, flipX, noteRangeDegrees, activeNoteColour
    })
  }
  async addFX() {}

  async destroy() {
    this.stopped = true
    this.available = false
    this.abortController.abort()
    this.cancelAnimationLoop()
    this.displayWindow?.close()
    this.portraitButtons?.dispose()
    this.outputButton?.removeEventListener('click', this.toggleDisplay)
    this.outputButton?.remove()
    disposeLookingGlassEmoticonParticles(this)
    this.mouthNoteEmitter?.dispose()
    disposeMirrorStage(this)
    this.headParticleCloud = null
    this.headParticleMesh = null
    if (this.faceMesh) unloadModel(this.faceMesh)
    this.particles?.geometry.dispose()
    this.particles?.material.dispose()
    disposeWalls(this.walls)
    this.output?.dispose()
    await super.destroy()
  }
}
