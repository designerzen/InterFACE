import { WebGPURenderer, RenderTarget, UnsignedByteType, Vector4 } from 'three/webgpu'
import { normalizeCalibration, normalizeQuilt, getTileViewport } from './calibration.js'
import { createViewCameras } from './cameras.js'
import { createInterlacer } from './interlace.js'

export class LookingGlassRenderer {
  static async create({ canvas, calibration, quilt, backend = 'auto', ...options }) {
    if (!['auto', 'webgpu', 'webgl2'].includes(backend)) throw new RangeError('Invalid backend')
    const normalized = normalizeCalibration(calibration)
    const layout = normalizeQuilt(quilt)
    const renderer = new WebGPURenderer({ canvas, forceWebGL: backend === 'webgl2', antialias: false })
    try {
      await renderer.init()
      if (backend === 'webgpu' && !renderer.backend.isWebGPUBackend) throw new Error('Native WebGPU is unavailable')
      return new LookingGlassRenderer(renderer, normalized, layout, options)
    } catch (error) {
      renderer.dispose()
      throw error
    }
  }

  constructor(renderer, calibration, quilt, { focusDistance = 2, depthiness = 1 } = {}) {
    this.renderer = renderer
    this.calibration = calibration
    this.quilt = quilt
    this.viewOptions = { focusDistance, depthiness }
    this.disposed = false
    this.rendering = false
    this.cameraRig = null
    this.sourceCamera = null
    this.tiles = Array.from({ length: quilt.views }, (_, index) => getTileViewport(index, quilt))
    this.frame = 0
    this.stats = Object.freeze({ backend: renderer.backend.isWebGPUBackend ? 'webgpu' : 'webgl2', views: quilt.views, frame: 0 })
    const limit = renderer.backend.isWebGPUBackend
      ? renderer.backend.device.limits.maxTextureDimension2D
      : renderer.backend.gl.getParameter(renderer.backend.gl.MAX_TEXTURE_SIZE)
    if (Math.max(quilt.width, quilt.height, calibration.screenWidth, calibration.screenHeight) > limit) {
      throw new RangeError(`Requested output exceeds GPU texture limit ${limit}`)
    }
    renderer.setPixelRatio(1)
    renderer.setSize(calibration.screenWidth, calibration.screenHeight, false)
    // Keep the quilt linear. Three converts the final interlaced output once.
    this.target = new RenderTarget(quilt.width, quilt.height, { type: UnsignedByteType, depthBuffer: true, generateMipmaps: false })
    try {
      this.interlacer = createInterlacer(this.target.texture, quilt, calibration)
    } catch (error) {
      this.target.dispose()
      throw error
    }
    this.savedViewport = new Vector4()
    this.savedScissor = new Vector4()
  }

  get canvas() { return this.renderer.domElement }
  get texture() { return this.target.texture }

  render(scene, camera, { update, time = performance.now() } = {}) {
    if (this.disposed) throw new Error('LookingGlassRenderer has been disposed')
    if (this.rendering) throw new Error('Rendering cannot be re-entered')
    const renderer = this.renderer
    const target = renderer.getRenderTarget()
    const autoClear = renderer.autoClear
    const scissorTest = renderer.getScissorTest()
    renderer.getViewport(this.savedViewport)
    renderer.getScissor(this.savedScissor)
    this.rendering = true
    const start = performance.now()
    const matrixAutoUpdate = scene.matrixWorldAutoUpdate
    try {
      // Simulation and world transforms run once, outside the per-view render loop.
      update?.({ time, renderer, frame: this.frame })
      if (this.sourceCamera !== camera) {
        this.cameraRig = createViewCameras(camera, this.quilt, this.calibration, this.viewOptions)
        this.sourceCamera = camera
      }
      // Three normally selects the coordinate system inside render(), too late for custom frusta.
      const cameras = this.cameraRig.update(renderer.coordinateSystem)
      if (matrixAutoUpdate) scene.updateMatrixWorld()
      scene.matrixWorldAutoUpdate = false
      renderer.autoClear = false
      renderer.setRenderTarget(this.target)
      this.target.viewport.set(0, 0, this.quilt.width, this.quilt.height)
      renderer.setScissorTest(false)
      renderer.clear()
      const quiltStart = performance.now()
      for (let i = 0; i < cameras.length; i++) {
        const tile = this.tiles[i]
        this.target.viewport.set(tile.x, tile.y, tile.width, tile.height)
        this.target.scissor.copy(this.target.viewport)
        renderer.setScissorTest(true)
        renderer.render(scene, cameras[i])
      }
      const outputStart = performance.now()
      renderer.setRenderTarget(null)
      renderer.setViewport(0, 0, this.calibration.screenWidth, this.calibration.screenHeight)
      renderer.setScissorTest(false)
      this.interlacer.render(renderer)
      const end = performance.now()
      this.stats = Object.freeze({
        backend: this.stats.backend, views: this.quilt.views, frame: ++this.frame,
        cpuMs: end - start, quiltSubmitMs: outputStart - quiltStart, outputSubmitMs: end - outputStart
      })
      return this.stats
    } finally {
      scene.matrixWorldAutoUpdate = matrixAutoUpdate
      renderer.autoClear = autoClear
      renderer.setRenderTarget(target)
      renderer.setViewport(this.savedViewport)
      renderer.setScissor(this.savedScissor)
      renderer.setScissorTest(scissorTest)
      this.rendering = false
    }
  }

  start(scene, camera, { update, onError } = {}) {
    if (this.disposed) throw new Error('LookingGlassRenderer has been disposed')
    this.renderer.setAnimationLoop(time => {
      try { this.render(scene, camera, { update, time }) }
      catch (error) {
        this.stop()
        if (onError) onError(error)
        else throw error
      }
    })
  }

  stop() { this.renderer.setAnimationLoop(null) }

  dispose() {
    if (this.disposed) return
    if (this.rendering) throw new Error('Cannot dispose during a render callback')
    this.stop()
    this.interlacer.dispose()
    this.target.dispose()
    this.renderer.dispose()
    this.disposed = true
  }
}
