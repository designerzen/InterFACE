import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import { setupControlsList } from '../source/dom/controls-list.js'
import { hasViewTransitionCapability } from '../source/capabilities.js'

const fixture = () => {
 const dom = new JSDOM('<html class="loaded"><body><menu id="control-panel"><header class="controls-list-header" hidden><h1 id="controls-list-title">All controls</h1></header><div id="shared-controls" class="controls"><button id="button-controls-list" aria-expanded="false"><span class="controls-view-caption">View: List</span></button><label>Key<select id="select-key"><option>C</option></select></label></div></menu></body></html>', { pretendToBeVisual: true })
 const { window } = dom, { document } = window
 window.scrollTo = () => {}
 window.CSS = { supports: () => true }
 const api = setupControlsList(document)
 return { dom, window, document, api }
}
const flush = () => new Promise(resolve => setTimeout(resolve, 0))

test('requires the native API and both CSS features, independently of motion preference', () => {
 const { dom, window, document } = fixture()
 assert.equal(hasViewTransitionCapability(document), false)
 document.startViewTransition = () => {}
 assert.equal(hasViewTransitionCapability(document), true)
 for (const missing of ['view-transition-name', 'selector(::view-transition-group(control-view))']) {
  window.CSS.supports = feature => feature !== missing
  assert.equal(hasViewTransitionCapability(document), false)
 }
 dom.window.close()
})

for (const mode of ['no-api', 'no-css', 'app-reduced', 'system-reduced']) {
 test(`${mode} switches layouts without starting animation`, () => {
  const { dom, window, document, api } = fixture()
  if (mode !== 'no-api') document.startViewTransition = () => { throw Error('Should not start') }
  if (mode === 'no-css') window.CSS.supports = () => false
  if (mode === 'app-reduced') document.documentElement.classList.add('a11y-reduce-motion')
  window.matchMedia = () => ({ matches: mode === 'system-reduced' })
  api.open()
  assert.equal(document.getElementById('button-controls-list').getAttribute('aria-expanded'), 'true')
  api.close()
  assert.equal(document.getElementById('button-controls-list').getAttribute('aria-expanded'), 'false')
  assert.equal(document.documentElement.classList.contains('controls-list-transition'), false)
  dom.window.close()
 })
}

test('reports skipped capture while completing the state change and cleaning up', async () => {
 const { dom, window, document, api } = fixture()
 const warnings = []
 window.console.warn = (...args) => warnings.push(args)
 document.startViewTransition = update => {
  update()
  return { ready: Promise.reject(new window.DOMException('Capture failed', 'InvalidStateError')), finished: Promise.resolve(), skipTransition() {} }
 }
 api.open()
 await flush()
 assert.equal(warnings.length, 1)
 assert.equal(document.documentElement.classList.contains('controls-list-open'), true)
 assert.equal(document.documentElement.classList.contains('controls-list-transition'), false)
 assert.equal(document.getElementById('select-key').parentElement.style.viewTransitionName, '')
 dom.window.close()
})

test('a native startup failure still opens the requested layout', () => {
 const { dom, window, document, api } = fixture()
 window.console.warn = () => {}
 document.startViewTransition = () => { throw Error('Unavailable context') }
 api.open()
 assert.equal(document.documentElement.classList.contains('controls-list-open'), true)
 assert.equal(document.documentElement.classList.contains('controls-list-transition'), false)
 dom.window.close()
})

test('a toggle during capture completes at the most recently requested layout', async () => {
 const { dom, document, api } = fixture()
 let finish
 let calls = 0
 document.startViewTransition = update => {
  update()
  const first = calls++ === 0
  return { ready: Promise.resolve(), finished: first ? new Promise(resolve => { finish = resolve }) : Promise.resolve(), skipTransition() { finish() } }
 }
 api.open()
 api.close()
 await flush()
 assert.equal(calls, 2)
 assert.equal(document.documentElement.classList.contains('controls-list-open'), false)
 assert.equal(document.documentElement.classList.contains('controls-list-transition'), false)
 dom.window.close()
})
