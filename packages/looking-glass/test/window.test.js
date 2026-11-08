import test from 'node:test'
import assert from 'node:assert/strict'
import { openLookingGlassWindow } from '../src/window.js'

const fixture = (t, getScreenDetails) => {
  const original = globalThis.window, calls = [], targets = []
  const target = () => {
    const listeners = new Map()
    targets.push(listeners)
    return {
      addEventListener(type, handler) { listeners.set(type, handler) },
      removeEventListener(type) { listeners.delete(type) },
      dispatch(type) { return listeners.get(type)?.() }
    }
  }
  const element = () => ({
    ...target(), style: {}, children: [], attributes: new Map(),
    append(node) { node.remove(); this.children.push(node); node.parentNode = this; node.ownerDocument = popup.document },
    insertBefore(node, next) { node.remove(); const index = this.children.indexOf(next); this.children.splice(index < 0 ? this.children.length : index, 0, node); node.parentNode = this },
    remove() { if (this.parentNode) { const i = this.parentNode.children.indexOf(this); if (i >= 0) this.parentNode.children.splice(i, 1); this.parentNode = null } },
    getAttribute(name) { return this.attributes.get(name) ?? null },
    setAttribute(name, value) { this.attributes.set(name, value) },
    removeAttribute(name) { this.attributes.delete(name) },
    click() { if (!this.disabled) return this.dispatch('click') }
  })
  const mainDocument = { adoptNode(node) { node.ownerDocument = this } }
  const parent = element(), canvas = element(), next = element()
  canvas.parentNode = parent; canvas.nextSibling = next; canvas.ownerDocument = mainDocument
  canvas.setAttribute('style', 'opacity:0.8')
  next.parentNode = parent; parent.children.push(canvas, next)
  const popup = {
    ...target(), closed: false,
    document: { ...target(), fullscreenElement: null, body: element(), documentElement: element(), createElement: tag => tag === 'canvas' ? canvas : element() },
    close() { this.closed = true; this.dispatch('pagehide') },
    moveTo(...args) { calls.push(['move', ...args]) },
    resizeTo(...args) { calls.push(['resize', ...args]) }
  }
  popup.document.documentElement.requestFullscreen = async options => {
    calls.push(['fullscreen', options]); popup.document.fullscreenElement = popup.document.documentElement
    popup.document.dispatch('fullscreenchange')
  }
  globalThis.window = { ...target(), open() { calls.push(['open']); return popup }, getScreenDetails }
  t.after(() => { if (original === undefined) delete globalThis.window; else globalThis.window = original })
  return { popup, canvas, calls, parent, next, mainDocument, listenerCount: () => targets.reduce((sum, listeners) => sum + listeners.size, 0) }
}

test('closing either window releases listeners and notifies once', t => {
  const f = fixture(t)
  let count = 0
  const output = openLookingGlassWindow({ onClose: () => count++ })
  globalThis.window.dispatch('pagehide'); output.close()
  assert.equal(count, 1); assert.equal(f.popup.closed, true); assert.equal(f.listenerCount(), 0)
})

test('popup blocking is reported immediately', t => {
  fixture(t); globalThis.window.open = () => null
  assert.throws(() => openLookingGlassWindow(), /blocked/)
})

test('moves one supplied canvas and restores its document, position and style', t => {
  const f = fixture(t), output = openLookingGlassWindow({ canvas: f.canvas })
  assert.equal(output.canvas, f.canvas)
  assert.equal(f.canvas.ownerDocument, f.popup.document)
  assert.equal(f.canvas.parentNode, f.popup.document.body)
  f.popup.dispatch('pagehide')
  assert.equal(f.canvas.ownerDocument, f.mainDocument)
  assert.equal(f.canvas.parentNode, f.parent)
  assert.equal(f.parent.children[0], f.canvas)
  assert.equal(f.parent.children[1], f.next)
  assert.equal(f.canvas.getAttribute('style'), 'opacity:0.8')
  assert.equal(f.listenerCount(), 0)
})

test('opens immediately and places the matching serial without attempting fullscreen', async t => {
  let resolve
  const f = fixture(t, () => new Promise(done => { resolve = done }))
  const output = openLookingGlassWindow({ serial: 'LKG-P-second' })
  assert.deepEqual(f.calls, [['open']])
  resolve({ screens: [
    { label: 'LKG-P-first', left: 0, top: 0, width: 768, height: 1024 },
    { label: 'Looking Glass LKG-P-second', left: -768, top: 80, width: 768, height: 1024 }
  ] })
  assert.deepEqual(await output.placement, { placed: true, fullscreen: false })
  assert.deepEqual(f.calls, [['open'], ['move', -768, 80], ['resize', 768, 1024]])
  output.close()
})

test('fullscreen uses a fresh button click and disables until fullscreen exits', async t => {
  const f = fixture(t), output = openLookingGlassWindow(), button = output.fullscreenButton
  assert.equal(button.disabled, false)
  assert.equal(button.textContent, 'ENTER FULLSCREEN')
  assert.deepEqual(f.calls, [['open']])
  await button.click()
  assert.deepEqual(f.calls.at(-1), ['fullscreen', { navigationUI: 'hide' }])
  assert.equal(f.popup.document.fullscreenElement, f.popup.document.documentElement)
  assert.equal(button.disabled, true)
  assert.equal(button.textContent, 'FULLSCREEN')
  await button.click()
  assert.equal(f.calls.filter(call => call[0] === 'fullscreen').length, 1)
  f.popup.document.fullscreenElement = null; f.popup.document.dispatch('fullscreenchange')
  assert.equal(button.disabled, false)
  assert.equal(button.textContent, 'ENTER FULLSCREEN')
  await button.click()
  assert.equal(button.disabled, true)
  output.close(); assert.equal(f.listenerCount(), 0)
})

test('failed fullscreen requests can be retried without closing the output', async t => {
  const f = fixture(t)
  let attempts = 0
  f.popup.document.documentElement.requestFullscreen = async () => { if (++attempts === 1) throw new Error('Denied') }
  const output = openLookingGlassWindow()
  await output.fullscreenButton.click()
  assert.equal(output.fullscreenButton.disabled, false)
  assert.equal(f.popup.closed, false)
  await output.fullscreenButton.click()
  assert.equal(attempts, 2)
  output.close()
})

test('unsupported fullscreen disables its button but preserves the output window', t => {
  const f = fixture(t); delete f.popup.document.documentElement.requestFullscreen
  const output = openLookingGlassWindow()
  assert.equal(output.fullscreenButton.disabled, true)
  assert.equal(f.popup.closed, false)
  output.close()
})

test('unsupported placement and denied permission preserve manual placement', async t => {
  const f = fixture(t)
  const unsupported = openLookingGlassWindow()
  assert.deepEqual(await unsupported.placement, { placed: false, reason: 'unsupported' })
  globalThis.window.getScreenDetails = async () => { throw new Error('Denied') }
  const denied = openLookingGlassWindow()
  assert.deepEqual(await denied.placement, { placed: false, reason: 'unavailable' })
  assert.deepEqual(f.calls, [['open'], ['open']])
  unsupported.close(); denied.close()
})

test('does not guess between panels or move a window closed during screen discovery', async t => {
  const f = fixture(t, async () => ({ screens: [{ label: 'LKG Portrait 1' }, { label: 'LKG Portrait 2' }] }))
  const ambiguous = openLookingGlassWindow()
  assert.equal((await ambiguous.placement).placed, false)
  ambiguous.close()
  let resolve
  globalThis.window.getScreenDetails = () => new Promise(done => { resolve = done })
  const closed = openLookingGlassWindow(); closed.close()
  resolve({ screens: [{ label: 'LKG Portrait', left: 0, top: 0, width: 1536, height: 2048 }] })
  assert.deepEqual(await closed.placement, { placed: false, reason: 'closed' })
  assert.deepEqual(f.calls, [['open'], ['open']])
})
