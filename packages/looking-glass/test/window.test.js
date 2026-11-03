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

test('moves the supplied canvas without cloning it and restores its document, position and style', () => {
  const listeners = new Map()
  const target = name => ({
    addEventListener(event, handler) { listeners.set(`${name}:${event}`, handler) },
    removeEventListener(event) { listeners.delete(`${name}:${event}`) }
  })
  const document = { adoptNode(node) { node.ownerDocument = this } }
  let restoredStyle
  const next = {}
  const parent = { insertBefore(node, sibling) {
    assert.equal(node, canvas)
    assert.equal(sibling, next)
    node.parentNode = this
  } }
  next.parentNode = parent
  const canvas = {
    ...target('canvas'), parentNode: parent, nextSibling: next, ownerDocument: document,
    style: {}, getAttribute: () => 'opacity:0.8',
    setAttribute(name, value) { assert.equal(name, 'style'); restoredStyle = value }
  }
  const popup = {
    ...target('popup'), closed: false,
    document: { body: { style: {}, append(node) {
      assert.equal(node, canvas)
      node.parentNode = this
      node.ownerDocument = popup.document
    } } },
    close() { this.closed = true; listeners.get('popup:pagehide')?.() }
  }
  const original = globalThis.window
  globalThis.window = { ...target('parent'), open: () => popup }
  try {
    let count = 0
    const output = openLookingGlassWindow({ canvas, onClose: () => count++ })
    assert.equal(output.canvas, canvas)
    assert.equal(canvas.ownerDocument, popup.document)
    assert.equal(canvas.parentNode, popup.document.body)
    listeners.get('popup:pagehide')()
    output.close()
    assert.equal(canvas.ownerDocument, document)
    assert.equal(canvas.parentNode, parent)
    assert.equal(restoredStyle, 'opacity:0.8')
    assert.equal(count, 1)
    assert.equal(listeners.size, 0)
  } finally {
    if (original === undefined) delete globalThis.window
    else globalThis.window = original
  }
})

const placementFixture = (t, getScreenDetails) => {
  const original = globalThis.window
  const calls = []
  const canvas = { style: {}, addEventListener() {}, removeEventListener() {} }
  const popup = {
    closed: false, document: { body: { style: {}, append() {} }, createElement: () => canvas },
    addEventListener() {}, removeEventListener() {}, close() { this.closed = true },
    moveTo: (...args) => calls.push(['move', ...args]),
    resizeTo: (...args) => calls.push(['resize', ...args])
  }
  globalThis.window = {
    open() { calls.push(['open']); return popup },
    getScreenDetails, addEventListener() {}, removeEventListener() {}
  }
  t.after(() => {
    if (original === undefined) delete globalThis.window
    else globalThis.window = original
  })
  return { popup, calls }
}

test('opens immediately, then places the output on the matching serial among multiple panels', async t => {
  let resolve
  const { calls } = placementFixture(t, () => new Promise(done => { resolve = done }))
  const output = openLookingGlassWindow({ serial: 'LKG-P-second' })
  assert.deepEqual(calls, [['open']])
  resolve({ screens: [
    { label: 'LKG-P-first', left: 0, top: 0, width: 768, height: 1024 },
    { label: 'Looking Glass LKG-P-second', left: -768, top: 80, width: 768, height: 1024 }
  ] })
  assert.deepEqual(await output.placement, { placed: true })
  assert.deepEqual(calls, [['open'], ['move', -768, 80], ['resize', 768, 1024]])
  output.close()
})

test('a single labeled Portrait can be placed without a serial in the monitor label', async t => {
  const { calls } = placementFixture(t, async () => ({ screens: [
    { label: 'Main monitor', left: 0, top: 0, width: 1920, height: 1080 },
    { label: 'LKG Portrait', left: 1920, top: 0, width: 1536, height: 2048 }
  ] }))
  const output = openLookingGlassWindow({ serial: 'LKG-P-test' })
  assert.equal((await output.placement).placed, true)
  assert.deepEqual(calls[1], ['move', 1920, 0])
  output.close()
})

test('unsupported placement and denied permissions leave a usable manually placed popup', async t => {
  const { popup, calls } = placementFixture(t, undefined)
  const unsupported = openLookingGlassWindow()
  assert.deepEqual(await unsupported.placement, { placed: false, reason: 'unsupported' })
  globalThis.window.getScreenDetails = async () => { throw new Error('Permission denied') }
  const denied = openLookingGlassWindow()
  assert.deepEqual(await denied.placement, { placed: false, reason: 'unavailable' })
  assert.equal(popup.closed, false)
  assert.deepEqual(calls, [['open'], ['open']])
  unsupported.close()
  denied.close()
})

test('does not guess between panels or place a popup closed while permission is pending', async t => {
  const { calls } = placementFixture(t, async () => ({ screens: [
    { label: 'LKG Portrait 1' }, { label: 'LKG Portrait 2' }
  ] }))
  const ambiguous = openLookingGlassWindow()
  assert.equal((await ambiguous.placement).placed, false)
  ambiguous.close()
  let resolve
  globalThis.window.getScreenDetails = () => new Promise(done => { resolve = done })
  const closed = openLookingGlassWindow()
  closed.close()
  resolve({ screens: [{ label: 'LKG Portrait', left: 0, top: 0, width: 1536, height: 2048 }] })
  assert.deepEqual(await closed.placement, { placed: false, reason: 'closed' })
  assert.deepEqual(calls, [['open'], ['open']])
})
