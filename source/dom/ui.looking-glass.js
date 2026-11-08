import { LOOKING_GLASS_SETTINGS } from '../display/looking-glass-settings.js'

const ids = { headParticleMode: 'select-looking-glass-particles', headParticleGridSpacing: 'select-looking-glass-grid-spacing', lookingGlassEmoticonStyle: 'select-looking-glass-emoticons' }
const format = (key, value) => key === 'fovy' ? `${Math.round(value * 180 / Math.PI)}°`
  : ['headOpacityOverride', 'lookingGlassEmoticonScreenYOffset'].includes(key) ? `${Number((value * 100).toFixed(1))}%`
  : key === 'geometrySubdivisions' ? `${2 ** value}×` : String(Number(Number(value).toFixed(3)))

export function setupLookingGlassPanel({ document = globalThis.document, getDisplay }) {
  const panel = document.getElementById('control-panel-looking-glass')
  const content = document.getElementById('looking-glass-settings')
  if (!panel || !content) return null
  const fields = new Map(), groups = new Map()
  const abort = new (document.defaultView?.AbortController ?? AbortController)()
  const { signal } = abort
  for (const spec of LOOKING_GLASS_SETTINGS) {
    if (!groups.has(spec.group)) {
      const group = document.createElement('fieldset'), legend = document.createElement('legend')
      legend.textContent = spec.group
      group.append(legend); content.append(group); groups.set(spec.group, group)
    }
    // Controls sit beside their label, as in Tempo: controls nested in a
    // #control-panel label become invisible full-tile layers
    const row = document.createElement('div'), label = document.createElement('label')
    const input = document.createElement(spec.type === 'select' ? 'select' : 'input')
    input.id = ids[spec.key] ?? `looking-glass-${spec.key}`
    label.htmlFor = input.id; label.textContent = spec.label
    row.className = spec.type === 'checkbox' ? 'control-settings-toggle' : 'control-settings-field'
    let output
    if (spec.type === 'select') {
      for (const [value, text] of spec.choices) {
        const option = document.createElement('option')
        option.value = String(value); option.textContent = text; input.append(option)
      }
    } else {
      input.type = spec.type
      if (spec.type === 'checkbox') input.className = 'toggle'
      if (spec.type === 'range') {
        input.min = spec.min; input.max = spec.max; input.step = spec.step
        output = document.createElement('output'); output.htmlFor = input.id
      }
    }
    if (spec.type === 'checkbox') row.append(input, label)
    else row.append(label, input, ...(output ? [output] : []))
    groups.get(spec.group).append(row)
    fields.set(spec.key, { input, row, output, spec })
    // Sliders preview while dragging and save on release, like the Mouth panel
    const apply = persist => {
      const display = getDisplay()
      if (!display?.nativeMirrorDisplay || display.stopped) return
      let value = spec.type === 'checkbox' ? input.checked : input.value
      if (spec.type === 'range' || typeof spec.value === 'number') value = Number(value)
      display.setLookingGlassSettings({ [spec.key]: value }, { persist })
      sync(display)
    }
    if (spec.type === 'range') input.addEventListener('input', () => apply(false), { signal })
    input.addEventListener('change', () => apply(true), { signal })
  }

  // Keep the drawer open while dragging sliders; :focus-within alone
  // closes it when the pointer leaves a focused control.
  const isListOpen = () => document.getElementById('control-panel')?.classList.contains('controls-list-open')
  const open = () => { panel.classList.remove('looking-glass-dismissed'); panel.classList.add('open') }
  const close = () => {
    panel.classList.remove('open')
    panel.classList.add('looking-glass-dismissed')
    if (document.defaultView.location.hash === '#folder-looking-glass') document.defaultView.history.replaceState(null, '', document.defaultView.location.pathname + document.defaultView.location.search)
    if (!isListOpen()) (document.getElementById('button-settings') ?? document.getElementById('button-controls-list'))?.focus({ preventScroll: true })
  }
  panel.querySelector('.folder-link')?.addEventListener('click', open, { signal })
  content.addEventListener('pointerdown', open, { capture: true, signal })
  content.addEventListener('change', open, { capture: true, signal })
  panel.querySelector('.folder-content > a[href="#control-panel"]')?.addEventListener('click', close, { signal })
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !isListOpen()) { event.preventDefault(); event.stopPropagation(); close(); return }
    // Arrow keys adjust the focused control rather than the global shortcuts
    if (event.target.matches('input,select') && !['Tab', 'Escape'].includes(event.key)) event.stopPropagation()
  }, { signal })
  panel.addEventListener('keyup', event => {
    if (event.target.matches('input,select') && !['Tab', 'Escape'].includes(event.key)) event.stopPropagation()
  }, { signal })

  function sync(display = getDisplay()) {
    const active = Boolean(display?.nativeMirrorDisplay && !display.stopped)
    if (!active && panel.matches('.open, .controls-list-folder-open')) panel.querySelector('.folder-return')?.click()
    panel.hidden = !active
    const settings = active ? display.getLookingGlassSettings() : {}
    const mode = settings.headParticleMode ?? 'surface'
    for (const [key, { input, row, output, spec }] of fields) {
      const value = settings[key] ?? spec.value
      input.disabled = !active
      if (spec.type === 'checkbox') input.checked = value
      else input.value = String(value)
      if (output) output.textContent = format(key, value)
      row.hidden = key === 'headParticleGridSpacing' ? mode === 'surface'
        : key === 'geometrySubdivisions' || key === 'particleIdleMotion' || key === 'particleWander' ? !['surface', 'volume'].includes(mode) : false
    }
  }
  sync()
  return { sync, destroy() { abort.abort() } }
}
