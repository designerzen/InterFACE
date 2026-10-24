const keys = Object.freeze({ MediaTrackPrevious: 'back', MediaTrackNext: 'forward', MediaPlayPause: 'select' })

// Portrait exposes consumer media keys, unlike the classic four-button gamepad.
// Keyboard delivery depends on OS/browser focus. Native hosts can call press() directly.
export function bindPortraitButtons({ targets = [globalThis.window], onButton, enabled = () => true } = {}) {
  if (typeof onButton !== 'function') throw new TypeError('onButton is required')
  const windows = [...new Set(targets.filter(Boolean))]
  let disposed = false
  const press = (button, event) => {
    if (disposed || !enabled() || !['back', 'forward', 'select'].includes(button)) return false
    onButton(button, event)
    return true
  }
  const listener = event => {
    const button = keys[event.code] ?? keys[event.key]
    if (!button || !enabled() || disposed) return
    const tag = event.target?.tagName
    if (event.target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return
    event.preventDefault()
    event.stopImmediatePropagation()
    if (event.type !== 'keyup' && !event.repeat) press(button, event)
  }
  windows.forEach(target => target.addEventListener('keydown', listener, true))
  windows.forEach(target => target.addEventListener('keyup', listener, true))
  return {
    press,
    dispose() {
      if (disposed) return
      disposed = true
      windows.forEach(target => target.removeEventListener('keydown', listener, true))
      windows.forEach(target => target.removeEventListener('keyup', listener, true))
    }
  }
}

export function createSettingControls({ settings, onChange = () => {} }) {
  if (!settings?.length || settings.some(setting =>
    typeof setting.get !== 'function' || typeof setting.set !== 'function' ||
    !Number.isFinite(setting.step) || setting.step <= 0 ||
    !Number.isFinite(setting.min) || !Number.isFinite(setting.max) || setting.min > setting.max)) {
    throw new TypeError('Settings require get/set, a positive step, and finite min/max')
  }
  let index = 0
  return {
    get selected() { return settings[index].name },
    press(button) {
      if (button === 'select') index = (index + 1) % settings.length
      else if (button === 'back' || button === 'forward') {
        const setting = settings[index]
        const current = setting.get()
        if (!Number.isFinite(current)) throw new TypeError('Setting value must be finite')
        setting.set(Math.min(setting.max, Math.max(setting.min,
          current + (button === 'forward' ? setting.step : -setting.step))))
      } else return
      onChange({ name: settings[index].name, value: settings[index].get(), selected: button === 'select' })
    }
  }
}
