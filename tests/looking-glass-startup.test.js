jest.mock('../packages/looking-glass/src/detect.js', () => ({ probeLookingGlassPortraits: jest.fn() }))

import { renderFile } from 'pug'
import { createLookingGlassStartup, prepareLookingGlassIntegration } from '../source/dom/looking-glass-integration.js'
import { probeLookingGlassPortraits } from '../packages/looking-glass/src/detect.js'

beforeEach(() => {
  document.body.innerHTML = `<details id="integration-hardware">${renderFile('source/partials/looking-glass-integration.pug')}</details>`
})

test.each([1, 2])('reveals %i Portraits before onboarding and loads support after discovery', async count => {
  let resolveProbe, resolveRenderer
  const probe = jest.fn(() => new Promise(resolve => { resolveProbe = resolve }))
  const loadRenderer = jest.fn(() => new Promise(resolve => { resolveRenderer = resolve }))
  const startup = createLookingGlassStartup({ probe, loadRenderer })
  await Promise.resolve()
  expect(probe).toHaveBeenCalledWith({ includeDevices: true })
  expect(loadRenderer).not.toHaveBeenCalled()
  expect(document.getElementById('looking-glass-portrait').hidden).toBe(true)
  resolveProbe({ status: 'connected', count, devices: [] })
  await startup.discovery
  expect(document.getElementById('integration-hardware').open).toBe(true)
  expect(document.getElementById('looking-glass-portrait').open).toBe(true)
  expect(document.getElementById('looking-glass-portrait').hidden).toBe(false)
  expect(document.getElementById('looking-glass-connection').textContent).toContain('connected')
  expect(document.getElementById('looking-glass-preparation').textContent).toContain('Getting your Portrait ready')
  expect(loadRenderer).toHaveBeenCalledTimes(1)
  let ready = false
  void startup.ready.then(() => { ready = true })
  await Promise.resolve()
  expect(ready).toBe(false)
  resolveRenderer()
  expect(await startup.ready).toMatchObject({ count, rendererReady: true })
  expect(document.getElementById('looking-glass-preparation').textContent).toContain('is ready')
})

test.each(['connected', 'unavailable'])('does not preload or show the integration with no devices (%s)', async status => {
  const loadRenderer = jest.fn()
  const startup = createLookingGlassStartup({ probe: async () => ({ status, count: 0, devices: [] }), loadRenderer })
  expect(await startup.ready).toMatchObject({ count: 0, rendererReady: false })
  expect(loadRenderer).not.toHaveBeenCalled()
  expect(document.getElementById('looking-glass-portrait').hidden).toBe(true)
  expect(document.getElementById('integration-hardware').open).toBe(false)
})

test('discovery errors leave optional support unloaded', async () => {
  const loadRenderer = jest.fn()
  const startup = createLookingGlassStartup({ probe: async () => { throw new Error('Service unavailable') }, loadRenderer })
  expect(await startup.ready).toMatchObject({ status: 'unavailable', count: 0, rendererReady: false })
  expect(loadRenderer).not.toHaveBeenCalled()
})

test('renderer import failure preserves setup instructions and allows normal startup', async () => {
  const warning = jest.spyOn(console, 'warn').mockImplementation(() => {})
  try {
    const startup = createLookingGlassStartup({
      probe: async () => ({ status: 'connected', count: 1, devices: [] }),
      loadRenderer: async () => { throw new Error('Download failed') }
    })
    expect(await startup.ready).toMatchObject({ count: 1, rendererReady: false })
    expect(document.getElementById('looking-glass-portrait').open).toBe(true)
    expect(document.getElementById('looking-glass-preparation').textContent).toContain('continue with the standard display')
  } finally { warning.mockRestore() }
})

test('initial loading and interface setup share the same discovery and preload promises', async () => {
  probeLookingGlassPortraits.mockResolvedValue({ status: 'connected', count: 0, devices: [] })
  const first = prepareLookingGlassIntegration()
  const second = prepareLookingGlassIntegration()
  expect(first).toBe(second)
  await second.ready
  expect(probeLookingGlassPortraits).toHaveBeenCalledTimes(1)
})
