import { bindPortraitButtons, createSettingControls } from '../../packages/looking-glass/src/buttons.js'

export function attachLookingGlassButtons(renderer, config, options = {}) {
  let binding
  const settings = options.settings ?? [
    { name: 'depthiness', min: 0, max: 1.5, step: .05 },
    { name: 'targetDiam', min: .2, max: 10, step: .1 },
    { name: 'fovy', min: 5 * Math.PI / 180, max: 60 * Math.PI / 180, step: Math.PI / 180 }
  ].map(setting => ({ ...setting, get: () => config[setting.name], set: value => { config[setting.name] = value } }))
  const controls = createSettingControls({ settings, onChange: options.onChange })
  const end = () => { binding?.dispose(); binding = null }
  const start = () => {
    end()
    binding = bindPortraitButtons({
      targets: [renderer.domElement.ownerDocument.defaultView, config.popup],
      enabled: () => renderer.xr.isPresenting,
      onButton: button => controls.press(button)
    })
  }
  renderer.xr.addEventListener('sessionstart', start)
  renderer.xr.addEventListener('sessionend', end)
  if (renderer.xr.isPresenting) start()
  return { dispose() {
    end()
    renderer.xr.removeEventListener('sessionstart', start)
    renderer.xr.removeEventListener('sessionend', end)
  } }
}
