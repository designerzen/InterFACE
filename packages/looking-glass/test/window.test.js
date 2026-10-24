import test from 'node:test'
import assert from 'node:assert/strict'
import { openLookingGlassWindow } from '../src/window.js'

test('closing either window releases listeners and notifies once', () => {
  const listeners = new Map()
  const target = name => ({
    addEventListener(event, handler) { listeners.set(`${name}:${event}`, handler) },
    removeEventListener(event) { listeners.delete(`${name}:${event}`) }
  })
  const canvas = { ...target('canvas'), style: {} }
  const popup = {
    ...target('popup'), closed: false,
    document: { body: { style: {}, append() {} }, createElement: () => canvas },
    close() { this.closed = true; listeners.get('popup:pagehide')?.() }
  }
  const original = globalThis.window
  globalThis.window = { ...target('parent'), open: () => popup }
  try {
    let count = 0
    const output = openLookingGlassWindow({ onClose: () => count++ })
    assert.equal(output.canvas, canvas)
    listeners.get('parent:pagehide')()
    output.close()
    assert.equal(count, 1)
    assert.equal(popup.closed, true)
    assert.equal(listeners.size, 0)
  } finally {
    if (original === undefined) delete globalThis.window
    else globalThis.window = original
  }
})

test('popup blocking is reported immediately', () => {
  const original = globalThis.window
  globalThis.window = { open: () => null }
  try { assert.throws(() => openLookingGlassWindow(), /blocked/) }
  finally {
    if (original === undefined) delete globalThis.window
    else globalThis.window = original
  }
})
