jest.mock('three/webgpu', () => ({
  SRGBColorSpace: 'srgb',
  BufferGeometry: class {
    attributes = {}
    setAttribute(name, attribute) { this.attributes[name] = attribute }
    dispose() {}
  },
  Float32BufferAttribute: class {
    constructor(array, size) { this.array = array; this.count = array.length / size }
  }
}))
jest.mock('../source/display/looking-glass-emoticon-particles.js', () => ({
  DEFAULT_LOOKING_GLASS_EMOTICON_PARTICLES: {},
  updateLookingGlassEmoticonParticles: jest.fn(), disposeLookingGlassEmoticonParticles: jest.fn()
}))
jest.mock('../source/models/avatar.js', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('../source/display/head-particle-cloud.js', () => ({
  createHeadParticleCloud: jest.fn(), createLandmarkDrivenHeadCloud: jest.fn(), createFacialContourCloud: jest.fn(),
  HEAD_PARTICLE_MODES: ['surface', 'volume', 'grid', 'grid-shell', 'grid-deform', 'even-surface', 'slices', 'contours', 'hybrid', 'opaque-shell']
}))
jest.mock('../source/models/avatar-data.js', () => ({ AVATAR_DATA: {} }))
jest.mock('../source/models/avatars.js', () => ({ unloadModel: jest.fn() }))
jest.mock('../source/display/mirror-stage.js', () => ({
  captureMirrorPerson: jest.fn(), updateMirrorStage: jest.fn(), disposeMirrorStage: jest.fn()
}))
jest.mock('../packages/looking-glass/src/renderer.js', () => ({ LookingGlassRenderer: { create: jest.fn() } }))
jest.mock('../packages/looking-glass/src/detect.js', () => ({ getConnectedPortraits: jest.fn() }))
jest.mock('../packages/looking-glass/src/calibration.js', () => ({ normalizeCalibration: jest.fn() }))
jest.mock('../packages/looking-glass/src/window.js', () => ({ openLookingGlassWindow: jest.fn() }))
jest.mock('../packages/looking-glass/src/buttons.js', () => ({
  bindPortraitButtons: jest.fn(() => ({ dispose: jest.fn() })),
  createSettingControls: jest.fn(() => ({ press: jest.fn() }))
}))
jest.mock('../source/visual/2d.face-features.js', () => ({ drawFaceFeatures: jest.fn(() => true) }))

import DisplayLookingGlass from '../source/display/display-looking-glass-webgpu.js'
import { drawFaceFeatures } from '../source/visual/2d.face-features.js'
import { openLookingGlassWindow } from '../packages/looking-glass/src/window.js'
import { bindPortraitButtons, createSettingControls } from '../packages/looking-glass/src/buttons.js'
import { updateLookingGlassEmoticonParticles } from '../source/display/looking-glass-emoticon-particles.js'
import { easeInSine } from '../source/maths/easing.js'
import { BufferGeometry } from 'three/webgpu'
import { createHeadParticleCloud, createLandmarkDrivenHeadCloud, createFacialContourCloud, HEAD_PARTICLE_MODES } from '../source/display/head-particle-cloud.js'

test('all particle variants can be selected and rebuild their simulation without stacking facial layers', () => {
  const display = Object.create(DisplayLookingGlass.prototype)
  const model = { count: 8 }
  createHeadParticleCloud.mockReturnValue(model)
  createLandmarkDrivenHeadCloud.mockReturnValue({ count: 10 })
  createFacialContourCloud.mockReturnValue({ count: 12 })
  Object.assign(display, { options: {}, headParticleMesh: {}, particles: { geometry: new BufferGeometry() } })
  for (const mode of HEAD_PARTICLE_MODES) {
    const dispose = jest.fn()
    display.mirrorLifecycle = { dispose }
    display.setHeadParticleOptions({ mode, gridSpacing: .025 })
    expect(display.options.headParticleMode).toBe(mode)
    expect(dispose).toHaveBeenCalledTimes(1)
    expect(display.mirrorLifecycle).toBeNull()
    const expected = ['surface', 'volume'].includes(mode) ? 10 : ['contours', 'hybrid'].includes(mode) ? 12 : 8
    expect(display.particles.geometry.attributes.position.count).toBe(expected)
    if (expected === 8) expect(display.headParticleCloud).toBe(model)
  }
})

test('particles keep the note palette instead of cycling or using the white beat highlight', () => {
  const display = Object.create(DisplayLookingGlass.prototype)
  const setHSL = jest.fn()
  Object.assign(display, { available: true, particles: { material: { color: { setHSL } } } })
  display.drawPerson({ data: {}, hue: 240, saturation: 80, luminosity: 50 }, false, { h: 240, s: 80, l: 100 })
  expect(setHSL).toHaveBeenLastCalledWith(240 / 360, .8, .5, 'srgb')
  display.updateParticleColour()
  expect(setHSL).toHaveBeenLastCalledWith(240 / 360, .8, .5, 'srgb')
  display.drawPerson({ data: {}, hue: 60, saturation: 90, luminosity: 45 }, false, {})
  expect(setHSL).toHaveBeenLastCalledWith(60 / 360, .9, .45, 'srgb')
})

test('display-specific optics and particle settings update live without changing unrelated options', () => {
  const display = Object.create(DisplayLookingGlass.prototype)
  const onLookingGlassSettingsChange = jest.fn()
  const scaleNode = { value: .006 }
  Object.assign(display, { options: { onLookingGlassSettingsChange, muted: false },
    mirrorCalibration: { targetX: 0, targetY: 0, targetZ: 1.5, targetDiam: 2, fovy: 16 * Math.PI / 180, aspect: .75, depthiness: .7, cameraDistanceScale: .8 },
    particles: { material: { size: .006 } }, mirrorLifecycle: { sprite: { material: { scaleNode } } },
    camera: { position: { set: jest.fn() }, lookAt: jest.fn(), updateProjectionMatrix: jest.fn() },
    output: { viewOptions: {} }
  })
  display.syncCamera()
  const focus = display.output.viewOptions.focusDistance
  display.setLookingGlassSettings({ focusOffset: .5, depthiness: .4, particleSize: .003, muted: true })
  display.syncCamera()
  expect(display.output.viewOptions.focusDistance).toBeCloseTo(focus + .5)
  expect(display.output.viewOptions.depthiness).toBe(.4)
  expect(display.particles.material.size).toBe(.003)
  expect(scaleNode.value).toBe(.003)
  expect(display.options.muted).toBe(false)
  expect(onLookingGlassSettingsChange).toHaveBeenCalledWith({ focusOffset: .5, depthiness: .4, particleSize: .003 }, { persist: true })
  expect(display.getLookingGlassSettings().focusOffset).toBe(.5)
})

test('interpolation changes allocate real particle density and release the previous simulation', () => {
  const display = Object.create(DisplayLookingGlass.prototype)
  const dispose = jest.fn()
  Object.assign(display, { options: { geometrySubdivisions: 2 }, particles: { geometry: new BufferGeometry() },
    mirrorLifecycle: { dispose }, mirrorPerson: { data: { keypoints: new Array(478) } } })
  display.syncParticleGeometry()
  expect(display.particles.geometry.attributes.position.count).toBe(1909)
  expect(dispose).toHaveBeenCalledTimes(1)
  const previous = display.particles.geometry
  display.syncParticleGeometry()
  expect(display.particles.geometry).toBe(previous)
  display.setGeometrySubdivisions(3)
  expect(display.particles.geometry.attributes.position.count).toBe(3817)
  display.setGeometrySubdivisions(0)
  expect(display.particles.geometry.attributes.position.count).toBe(478)
  display.particles.geometry.dispose()
})

let popup
const createDisplay = () => {
  const canvas = document.createElement('canvas')
  document.querySelector('main').append(canvas)
  const display = Object.create(DisplayLookingGlass.prototype)
  Object.assign(display, {
    canvas, canvasWidth: 640, canvasHeight: 480, inlineSize: { width: 640, height: 480 },
    options: { controls: '#shared-controls' }, available: true, stopped: false, count: 0,
    renderer: { render: jest.fn(), setSize: jest.fn(), setAnimationLoop: jest.fn() },
    output: {
      calibration: { screenWidth: 1536, screenHeight: 2048, serial: 'LKG-P-test' },
      render: jest.fn(), dispose: jest.fn(), quilt: { views: 48 },
      stats: { quiltSubmitMs: 2, outputSubmitMs: 1 }
    },
    scene: {}, camera: {}, mirrorCalibration: {}, syncCamera: jest.fn(),
    updateFrameRateMonitor: jest.fn(), abortController: new AbortController()
  })
  display.getEffectsContext()
  display.createDisplayButton()
  return display
}

beforeEach(() => {
  document.body.innerHTML = '<main></main><div id="shared-controls"></div>'
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function() {
    return { canvas: this, clearRect: jest.fn() }
  })
  popup = Object.assign(new EventTarget(), {
    document: document.implementation.createHTMLDocument('Portrait'), closed: false,
    close: jest.fn(function() { this.closed = true; this.dispatchEvent(new Event('pagehide')) })
  })
  jest.spyOn(window, 'open').mockReturnValue(popup)
  openLookingGlassWindow.mockImplementation(({ canvas, onClose }) => {
    const window = globalThis.window.open()
    if (!window) throw new Error('Popup blocked')
    window.addEventListener('pagehide', onClose, { once: true })
    return { canvas, window, requestFullscreen: jest.fn(), close: () => window.close(), placement: Promise.resolve({ placed: false }) }
  })
})
afterEach(() => jest.restoreAllMocks())

test('Portrait select requests fullscreen while windowed and resumes settings when fullscreen', async () => {
  const display = createDisplay()
  display.outputButton.click()
  const { onButton } = bindPortraitButtons.mock.calls.at(-1)[0]
  const controls = createSettingControls.mock.results.at(-1).value
  const event = { code: 'MediaPlayPause' }
  onButton('select', event)
  expect(display.displayWindow.requestFullscreen).toHaveBeenCalledTimes(1)
  expect(controls.press).not.toHaveBeenCalled()
  onButton('forward', event)
  expect(controls.press).toHaveBeenLastCalledWith('forward')
  Object.defineProperty(popup.document, 'fullscreenElement', { configurable: true, value: popup.document.documentElement })
  onButton('select', event)
  expect(controls.press).toHaveBeenLastCalledWith('select')
  expect(display.displayWindow.requestFullscreen).toHaveBeenCalledTimes(1)
  const custom = jest.fn()
  display.options.portraitButtons = { onButton: custom }
  onButton('select', event)
  expect(custom).toHaveBeenCalledWith('select', event)
  Object.defineProperty(popup.document, 'fullscreenElement', { configurable: true, value: null })
  onButton('select', event)
  expect(display.displayWindow.requestFullscreen).toHaveBeenCalledTimes(2)
  expect(custom).toHaveBeenCalledTimes(1)
  await display.destroy()
})

test('hands off the existing canvas, renders only the active output, and restores the latest inline size', async () => {
  const display = createDisplay()
  const main = document.querySelector('main')
  display.render()
  expect(display.renderer.render).toHaveBeenCalledTimes(1)
  expect(display.output.render).not.toHaveBeenCalled()
  expect(display.renderStats.mode).toBe('inline')

  display.outputButton.click()
  expect(display.suppressMainOverlay).toBe(true)
  expect(openLookingGlassWindow).toHaveBeenCalledWith(expect.objectContaining({
    canvas: display.canvas, width: 1536, height: 2048, serial: 'LKG-P-test'
  }))
  expect(display.effectsCanvas.parentNode).toBe(main)
  expect(display.outputButton.parentNode.id).toBe('shared-controls')
  expect(display.renderer.setSize).toHaveBeenLastCalledWith(1536, 2048, false)
  display.render()
  expect(display.renderer.render).toHaveBeenCalledTimes(1)
  expect(display.output.render).toHaveBeenCalledTimes(1)
  expect(display.renderStats).toMatchObject({ mode: 'portrait', views: 48, quiltSubmitMs: 2 })

  display.setSize(800, 600)
  expect(display.renderer.setSize).toHaveBeenLastCalledWith(1536, 2048, false)
  display.outputButton.click()
  expect(display.suppressMainOverlay).toBe(false)
  expect(display.canvas.ownerDocument).toBe(document)
  expect(display.canvas.parentNode).toBe(main)
  expect(display.renderer.setSize).toHaveBeenLastCalledWith(800, 600, false)
  display.render()
  expect(display.renderer.render).toHaveBeenCalledTimes(2)
  expect(display.output.render).toHaveBeenCalledTimes(1)
  await display.destroy()
})

test('face colour follows the note only when enabled and restores uniform white', async () => {
  const display = createDisplay()
  const color = { setHSL: jest.fn(), set: jest.fn() }
  display.mirrorMaterials = [{ color }]
  display.particlePalette = { hue: .25, saturation: .8, lightness: .5 }
  display.options.headColourMode = 'note'
  display.render()
  expect(color.setHSL).toHaveBeenCalledWith(.25, .8, .5, 'srgb')
  display.options.headColourMode = 'white'
  display.render()
  expect(color.set).toHaveBeenCalledWith(0xffffff)
  await display.destroy()
})

test('facial overlay is opt-in inline and never drawn on the Portrait', async () => {
  const display = createDisplay()
  expect(display.drawFaceFeatures({ data: {} })).toBe(false)
  expect(display.faceFeatureOverlay).toBeUndefined()
  display.options.inlineFaceFeatures = true
  expect(display.drawFaceFeatures({ data: {} })).toBe(true)
  expect(drawFaceFeatures).toHaveBeenCalledTimes(1)
  display.outputButton.click()
  expect(display.faceFeatureOverlay.hidden).toBe(true)
  expect(display.drawFaceFeatures({ data: {} })).toBe(false)
  expect(drawFaceFeatures).toHaveBeenCalledTimes(1)
  popup.close()
  expect(display.faceFeatureOverlay.hidden).toBe(false)
  await display.destroy()
})

test('blocked popup retains inline rendering; destruction closes output and restores canvas', async () => {
  const display = createDisplay()
  window.open.mockReturnValueOnce(null)
  const error = jest.spyOn(console, 'error').mockImplementation(() => {})
  display.outputButton.click()
  expect(error).toHaveBeenCalled()
  expect(display.canvas.ownerDocument).toBe(document)
  display.render()
  expect(display.renderer.render).toHaveBeenCalledTimes(1)
  display.outputButton.click()
  await display.destroy()
  expect(popup.closed).toBe(true)
  expect(display.canvas.ownerDocument).toBe(document)
  expect(display.output.dispose).toHaveBeenCalledTimes(1)
  expect(document.querySelector('#shared-controls button')).toBeNull()
})

test('the quilt render updates particle emoticons using the same pose and mirroring as 2D', async () => {
  const display = createDisplay()
  Object.assign(display, {
    nativeMirrorDisplay: true,
    mirrorLifecycle: { gpu: true, wasAlive: true },
    mirrorPerson: {
      emoticon: '😀', alive: true, data: { roll: .3, pitch: -.25, yaw: .4 },
      noteIndex: 2, quantityOfPlayableNotes: 7, headNoteRangeDegrees: 90,
      hsl: '#ffaa00', emojiDetector: { isMirrored: true }
    }
  })
  display.outputButton.click()
  display.render()
  expect(updateLookingGlassEmoticonParticles).toHaveBeenCalledWith(display, expect.anything(), {
    emoji: '😀', rotationZ: .3 * Math.PI * .28 - Math.PI / 2,
    rotationX: .75 + easeInSine(1 - .4) * .25, rotationY: .8 + (1 - .25) * .2,
    activeCircleIndex: 2, numberOfNotesInKey: 7, noteRangeDegrees: 90,
    flipX: true, activeNoteColour: '#ffaa00'
  })
  expect(display.output.render).toHaveBeenCalledWith(display.scene, display.camera)
  display.lookingGlassEmoticonState = { group: { visible: true } }
  display.mirrorLifecycle.wasAlive = false
  display.render()
  expect(display.lookingGlassEmoticonState.group.visible).toBe(false)
  expect(updateLookingGlassEmoticonParticles).toHaveBeenCalledTimes(1)
  await display.destroy()
})
