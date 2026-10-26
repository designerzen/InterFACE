import assert from 'node:assert/strict'
import { createServer } from '../tools/serve.mjs'

// PLAYWRIGHT_MODULE may point to an existing Playwright installation.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const server = createServer()
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
let browser
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    args: ['--enable-unsafe-webgpu', ...(process.env.PLAYWRIGHT_SOFTWARE_GPU ? ['--use-angle=swiftshader', '--use-webgpu-adapter=swiftshader'] : []),
      ...JSON.parse(process.env.PLAYWRIGHT_GPU_ARGS ?? '[]')] })
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto(`http://127.0.0.1:${server.address().port}/`)
  const results = await page.evaluate(async () => {
    const { LookingGlassRenderer, getViewIndex } = await import('/src/index.js')
    const { calibration } = await import('/test/fixtures.js')
    const { createParticleMaterial } = await import('/src/particles.js')
    const { Scene, PerspectiveCamera, Mesh, PlaneGeometry, RenderTarget, UnsignedByteType, Vector4, MeshBasicNodeMaterial } = await import('three/webgpu')
    const { uniform, vec4 } = await import('three/tsl')
    const results = []
    for (const backend of ['webgl2', 'webgpu']) {
      if (backend === 'webgpu' && !await navigator.gpu?.requestAdapter()) {
        results.push({ backend, skipped: 'No WebGPU adapter' })
        continue
      }
      const canvas = document.createElement('canvas')
      document.body.append(canvas)
      const display = await LookingGlassRenderer.create({
        canvas, calibration, backend,
        quilt: { width: 96, height: 128, columns: 2, rows: 2, views: 4 }
      })
      const renderer = display.renderer
      // WebGPU texture readbacks retain 256-byte row alignment in this Three release.
      const stride = backend === 'webgpu' ? 128 : 96
      const scene = new Scene()
      const camera = new PerspectiveCamera(30, .75, .1, 20)
      camera.position.z = 2
      const { material } = createParticleMaterial({ color: 0xff4000, amplitude: 0 })
      const geometry = new PlaneGeometry(8, 8)
      scene.add(new Mesh(geometry, material))
      renderer.setViewport(3, 4, 20, 30)
      renderer.setScissor(1, 2, 10, 12)
      renderer.setScissorTest(true)
      let updates = 0
      const stats = display.render(scene, camera, { update: () => updates++ })
      const viewport = renderer.getViewport(new Vector4()).toArray()
      const scissor = renderer.getScissor(new Vector4()).toArray()
      const quiltPixels = await renderer.readRenderTargetPixelsAsync(display.target, 0, 0, 96, 128)
      const tileColours = [[24, 32], [72, 32], [24, 96], [72, 96]].map(([x, y]) =>
        Array.from(quiltPixels.slice((y * stride + x) * 4, (y * stride + x) * 4 + 4)))
      // Compile and execute the same output shader into a readable GPU target.
      const output = new RenderTarget(96, 128, { type: UnsignedByteType })
      renderer.setRenderTarget(output)
      renderer.setScissorTest(false)
      display.interlacer.render(renderer)
      const outputPixels = await renderer.readRenderTargetPixelsAsync(output, 0, 0, 96, 128)
      const outputColour = Array.from(outputPixels.slice((64 * stride + 48) * 4, (64 * stride + 48) * 4 + 4))
      renderer.setRenderTarget(null)
      // Distinct view colours detect reversed rows and incorrect subpixel view selection.
      const shades = [32, 80, 128, 224]
      const shade = uniform(0)
      const indexedMaterial = new MeshBasicNodeMaterial({ depthTest: false, toneMapped: false })
      indexedMaterial.fragmentNode = vec4(shade, shade, shade, 1)
      const indexedScene = new Scene()
      const indexedMesh = new Mesh(geometry, indexedMaterial)
      indexedMesh.onBeforeRender = (_renderer, _scene, viewCamera) => {
        shade.value = shades[display.cameraRig.cameras.indexOf(viewCamera)] / 255
      }
      indexedScene.add(indexedMesh)
      display.render(indexedScene, camera)
      renderer.setRenderTarget(output)
      renderer.setScissorTest(false)
      display.interlacer.render(renderer)
      const indexedPixels = await renderer.readRenderTargetPixelsAsync(output, 0, 0, 96, 128)
      const row = backend === 'webgl2' ? 64 : 63
      const actualViews = Array.from(indexedPixels.slice((row * stride + 48) * 4, (row * stride + 48) * 4 + 3))
      const expectedViews = [0, 1, 2].map(channel => shades[getViewIndex(48.5 / 96, 64.5 / 128, channel, display.calibration, 4)])
      renderer.setRenderTarget(null)
      indexedMaterial.dispose()
      output.dispose()
      if (backend === 'webgpu') {
        const { createGPUMirrorLifecycle } = await import('/photosynth/display/mirror-gpu.js')
        renderer.backend.device.pushErrorScope('validation')
        const gpuScene = new Scene()
        const gpu = createGPUMirrorLifecycle({ renderer, scene: gpuScene, options: { particeSize: .08 },
          particles: { material: { color: material.color } } }, 128)
        gpu.targetsChanged()
        gpu.tick(true, 0)
        for (let frame = 0; frame < 240; frame++) {
          gpu.tick(true, 1 / 60)
          if (frame % 10 === 0) await new Promise(resolve => setTimeout(resolve, 10))
        }
        await renderer.backend.device.queue.onSubmittedWorkDone()
        await new Promise(resolve => setTimeout(resolve, 120))
        gpu.tick(true, 1 / 60)
        await renderer.backend.device.queue.onSubmittedWorkDone()
        await new Promise(resolve => setTimeout(resolve, 30))
        if (gpu.mode !== 'settled') throw new Error(`GPU particles failed to settle: ${gpu.mode}`)
        if ('positions' in gpu || 'velocities' in gpu) throw new Error('Particle state leaked CPU position/velocity arrays')
        renderer.render(gpuScene, camera)
        gpu.tick(false, 1 / 60)
        if (gpu.mode !== 'falling') throw new Error('GPU death transition failed')
        const error = await renderer.backend.device.popErrorScope()
        if (error) throw new Error(error.message)
        gpu.dispose()
      }
      let failureRestored = false
      try { display.render(scene, camera, { update() { throw new Error('test update failure') } }) }
      catch { failureRestored = !display.rendering && scene.matrixWorldAutoUpdate }
      results.push({ backend, actual: stats.backend, updates, viewport, scissor, tileColours, outputColour, actualViews, expectedViews, failureRestored })
      display.dispose()
      display.dispose()
      geometry.dispose()
      material.dispose()
      canvas.remove()
    }
    return results
  })
  for (const result of results) {
    if (result.skipped) { console.log(`${result.backend}: SKIP (${result.skipped})`); continue }
    assert.equal(result.actual, result.backend)
    assert.equal(result.updates, 1)
    assert.deepEqual(result.viewport, [3, 4, 20, 30])
    assert.deepEqual(result.scissor, [1, 2, 10, 12])
    assert.ok(result.failureRestored)
    result.actualViews.forEach((value, i) => assert.ok(Math.abs(value - result.expectedViews[i]) <= 1,
      `${result.backend}: calibrated RGB views ${result.actualViews}, expected ${result.expectedViews}`))
    for (const pixel of [...result.tileColours, result.outputColour]) {
      assert.ok(pixel[0] > 150 && pixel[1] > 0 && pixel[2] < 5, `${result.backend}: unexpected pixel ${pixel}`)
    }
    console.log(`${result.backend}: quilt, TSL output, state restoration and disposal passed`)
  }
  assert.deepEqual(errors, [])
} finally {
  await browser?.close()
  await new Promise(resolve => server.close(resolve))
}
