import { probeLookingGlassPortraits } from '../../packages/looking-glass/src/detect.js'

const loadPortraitRenderer = async () => {
  const { loadDisplayClass } = await import('../display/display-manager.js')
  await loadDisplayClass('DisplayLookingGlassWebGPU')
}

export function createLookingGlassStartup({
  doc = globalThis.document,
  probe = probeLookingGlassPortraits,
  loadRenderer = loadPortraitRenderer
} = {}) {
  const status = doc?.getElementById('looking-glass-connection')
  const preparation = doc?.getElementById('looking-glass-preparation')
  const discovery = Promise.resolve()
    .then(() => probe({ includeDevices: true }))
    .catch(() => ({ status: 'unavailable', count: 0, devices: [] }))
    .then(result => {
      // The guide always stays listed and closed; detection only updates its status text.
      if (result.count > 0) {
        if (status) status.textContent = result.count === 1 ? 'Portrait connected' : `${result.count} Portrait displays connected`
        if (preparation) preparation.textContent = 'Getting your Portrait ready…'
      }
      return result
    })
  // Handle import failures here so a missing optional integration cannot block music.
  const ready = discovery.then(async result => {
    if (!result.count) return { ...result, rendererReady: false }
    try {
      await loadRenderer()
      if (preparation) preparation.textContent = 'Your Portrait is ready.'
      return { ...result, rendererReady: true }
    } catch (error) {
      if (preparation) preparation.textContent = 'Your Portrait is connected, but its display support could not load. You can continue with the standard display and reload PhotoSYNTH to try again.'
      console.warn('Could not prepare Looking Glass support', error)
      return { ...result, rendererReady: false }
    }
  })
  return { discovery, ready }
}

let startup
export const prepareLookingGlassIntegration = () => startup ??= createLookingGlassStartup()
