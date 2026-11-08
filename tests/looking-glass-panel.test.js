import { setupLookingGlassPanel } from '../source/dom/ui.looking-glass.js'
import { normalizeLookingGlassSettings } from '../source/display/looking-glass-settings.js'

test('display settings validate values and ignore unrelated application settings', () => {
  expect(normalizeLookingGlassSettings({ particleSize: 100, targetDiam: -1, headColourMode: 'note',
    showWalls: false, headParticleMode: 'slices', geometrySubdivisions: 4,
    targetX: NaN, headOpacityOverride: 'wrong', muted: true, backend: 'wrong' })).toEqual({
    particleSize: .02, targetDiam: .5, headColourMode: 'note', showWalls: false,
    headParticleMode: 'slices', geometrySubdivisions: 4
  })
})

test('Looking Glass panel is gated by the active display, restores values and updates only that display', () => {
  document.body.innerHTML = '<div id="control-panel-looking-glass" hidden><div id="looking-glass-settings"></div></div>'
  let active = null
  const panel = setupLookingGlassPanel({ getDisplay: () => active })
  const root = document.getElementById('control-panel-looking-glass')
  const size = document.getElementById('looking-glass-particleSize')
  expect(root.hidden).toBe(true)
  expect(size.disabled).toBe(true)
  const values = { particleSize: .004, headColourMode: 'note', headParticleMode: 'even-surface', headParticleGridSpacing: .025 }
  active = { nativeMirrorDisplay: true, getLookingGlassSettings: () => values,
    setLookingGlassSettings: jest.fn(update => Object.assign(values, update)) }
  panel.sync()
  expect(root.hidden).toBe(false)
  expect(size.value).toBe('0.004')
  expect(document.getElementById('looking-glass-headColourMode').value).toBe('note')
  expect(document.getElementById('looking-glass-geometrySubdivisions').closest('.control-settings-field').hidden).toBe(true)
  size.value = '.003'; size.dispatchEvent(new Event('input', { bubbles: true }))
  expect(active.setLookingGlassSettings).toHaveBeenLastCalledWith({ particleSize: .003 }, { persist: false })
  size.dispatchEvent(new Event('change', { bubbles: true }))
  expect(active.setLookingGlassSettings).toHaveBeenLastCalledWith({ particleSize: .003 }, { persist: true })
  const mode = document.getElementById('select-looking-glass-particles')
  mode.value = 'surface'; mode.dispatchEvent(new Event('change', { bubbles: true }))
  expect(document.getElementById('looking-glass-geometrySubdivisions').closest('.control-settings-field').hidden).toBe(false)
  expect(document.getElementById('select-looking-glass-grid-spacing').closest('.control-settings-field').hidden).toBe(true)
  const display = active
  active = { nativeMirrorDisplay: false }
  panel.sync()
  expect(root.hidden).toBe(true)
  expect(size.disabled).toBe(true)
  display.setLookingGlassSettings.mockClear()
  size.dispatchEvent(new Event('input', { bubbles: true }))
  expect(display.setLookingGlassSettings).not.toHaveBeenCalled()
  active = display; panel.sync()
  expect(size.value).toBe('0.003')
  panel.destroy()
  size.dispatchEvent(new Event('input', { bubbles: true }))
  expect(display.setLookingGlassSettings).not.toHaveBeenCalled()
})

test('Looking Glass panel stays open while adjusting controls and keeps their keys local', () => {
  document.body.innerHTML = `<div id="control-panel"><div id="control-panel-looking-glass" class="folder-menu" hidden>
    <a class="folder-link" href="#folder-looking-glass">Looking Glass Settings</a>
    <menu class="folder-content" id="folder-looking-glass"><fieldset id="looking-glass-settings"></fieldset>
    <a class="folder-return" href="#control-panel">Return</a></menu></div></div>`
  const values = {}
  const display = { nativeMirrorDisplay: true, getLookingGlassSettings: () => values, setLookingGlassSettings: jest.fn(update => Object.assign(values, update)) }
  const panel = setupLookingGlassPanel({ getDisplay: () => display })
  const root = document.getElementById('control-panel-looking-glass')
  const size = document.getElementById('looking-glass-particleSize')
  expect(size.closest('label')).toBeNull()
  expect(document.querySelector('label[for="looking-glass-particleSize"]').textContent).toBe('Particle size')
  expect(document.getElementById('looking-glass-showWalls').classList.contains('toggle')).toBe(true)
  expect(document.getElementById('select-looking-glass-particles').hasAttribute('data-native-select')).toBe(false)

  root.querySelector('.folder-link').click()
  expect(root.classList.contains('open')).toBe(true)
  size.dispatchEvent(new Event('pointerdown', { bubbles: true }))
  size.value = '.01'; size.dispatchEvent(new Event('input', { bubbles: true }))
  expect(root.classList.contains('open')).toBe(true)

  const shortcut = jest.fn()
  document.addEventListener('keydown', shortcut)
  size.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  expect(shortcut).not.toHaveBeenCalled()
  size.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  expect(root.classList.contains('open')).toBe(false)
  expect(root.classList.contains('looking-glass-dismissed')).toBe(true)
  document.removeEventListener('keydown', shortcut)
  panel.destroy()
})
