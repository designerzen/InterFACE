import test from 'node:test'
import assert from 'node:assert/strict'
import { bindPortraitButtons, createSettingControls } from '../src/buttons.js'

test('Portrait media keys dispatch once, isolate other handlers, and clean up', () => {
  const listeners = new Set()
  const target = { addEventListener: (_name, fn) => listeners.add(fn), removeEventListener: (_name, fn) => listeners.delete(fn) }
  const pressed = []
  let enabled = true
  const binding = bindPortraitButtons({ targets: [target, target], enabled: () => enabled, onButton: name => pressed.push(name) })
  const send = (code, rest = {}) => {
    let consumed = false
    const event = { code, preventDefault() { consumed = true }, stopImmediatePropagation() {}, ...rest }
    for (const listener of listeners) listener(event)
    return consumed
  }
  assert.equal(listeners.size, 1)
  send('MediaTrackPrevious'); send('MediaTrackNext'); send('MediaPlayPause')
  send('MediaPlayPause', { repeat: true })
  assert.equal(send('MediaTrackNext', { type: 'keyup' }), true)
  send('MediaTrackNext', { target: { tagName: 'INPUT' } })
  assert.deepEqual(pressed, ['back', 'forward', 'select'])
  enabled = false
  assert.equal(send('MediaTrackNext'), false)
  enabled = true
  binding.dispose(); binding.dispose()
  assert.equal(listeners.size, 0)
  assert.equal(binding.press('forward'), false)
})

test('three-button settings clamp values and cycle without changing values', () => {
  let depth = 1, size = 2
  const controls = createSettingControls({ settings: [
    { name: 'depth', min: 0, max: 1, step: .5, get: () => depth, set: value => { depth = value } },
    { name: 'size', min: 1, max: 4, step: 1, get: () => size, set: value => { size = value } }
  ] })
  controls.press('forward'); assert.equal(depth, 1)
  controls.press('back'); assert.equal(depth, .5)
  controls.press('select'); assert.equal(controls.selected, 'size'); assert.equal(size, 2)
  controls.press('forward'); assert.equal(size, 3)
  controls.press('select'); assert.equal(controls.selected, 'depth')
})
