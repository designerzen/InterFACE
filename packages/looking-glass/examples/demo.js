import { Scene, PerspectiveCamera, Mesh, TorusKnotGeometry } from 'three/webgpu'
import { LookingGlassRenderer, normalizeCalibration, openLookingGlassWindow, bindPortraitButtons, createSettingControls } from '../src/index.js'
import { createParticleMaterial } from '../src/particles.js'

const status = document.querySelector('#status')
const open = document.querySelector('#open')
const stop = document.querySelector('#stop')
const scene = new Scene()
const camera = new PerspectiveCamera(30, .75, .1, 100)
camera.position.z = 2
const { material } = createParticleMaterial({ color: 0x986aff, wireframe: true })
const mesh = new Mesh(new TorusKnotGeometry(.18, .05, 96, 12), material)
scene.add(mesh)
let raw, output, display
let buttons
let generation = 0
const close = () => {
  generation++
  buttons?.dispose()
  buttons = null
  display?.dispose()
  display = null
  output?.close()
  output = null
  open.disabled = !raw
  stop.disabled = true
}
document.querySelector('#calibration').onchange = async event => {
  try {
    const candidate = JSON.parse(await event.target.files[0].text())
    normalizeCalibration(candidate.calibration ?? candidate)
    raw = candidate.calibration ?? candidate
    open.disabled = false
    status.textContent = 'Calibration loaded.'
  } catch (error) { status.textContent = error.message }
}
open.onclick = async () => {
  close()
  const request = generation
  open.disabled = true
  try {
    const normalized = normalizeCalibration(raw)
    output = openLookingGlassWindow({ width: normalized.screenWidth, height: normalized.screenHeight, onClose: close })
    const current = output
    const created = await LookingGlassRenderer.create({ canvas: output.canvas, calibration: raw, backend: document.querySelector('#backend').value })
    if (request !== generation || current.window.closed) { created.dispose(); return }
    display = created
    const controls = createSettingControls({
      settings: [
        { name: 'Depth', min: 0, max: 1.5, step: .05, get: () => display.viewOptions.depthiness,
          set: value => { display.viewOptions.depthiness = value; display.sourceCamera = null } },
        { name: 'Focus distance', min: .5, max: 5, step: .1, get: () => display.viewOptions.focusDistance,
          set: value => { display.viewOptions.focusDistance = value; display.sourceCamera = null } },
        { name: 'Field of view', min: 5, max: 60, step: 1, get: () => camera.fov, set: value => { camera.fov = value } }
      ],
      onChange: ({ name, value }) => { status.textContent = `${name}: ${value.toFixed(2)}` }
    })
    buttons = bindPortraitButtons({ targets: [window, output.window], onButton: button => controls.press(button) })
    display.start(scene, camera, {
      update: ({ time, frame }) => {
        mesh.rotation.y = time * .00025
        if (frame % 30 === 0) status.textContent = JSON.stringify(display.stats, null, 2)
      },
      onError: error => { status.textContent = error.message; close() }
    })
    stop.disabled = false
  } catch (error) {
    if (request === generation) { status.textContent = error.message; close() }
  }
}
stop.onclick = close
window.addEventListener('pagehide', () => { close(); mesh.geometry.dispose(); material.dispose() })
