import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import pug from 'pug'
import { setupControlsList } from '../source/dom/controls-list.js'

test('one toolbar View button switches list/grid and restores its caption and focus', () => {
 const dom = new JSDOM(`<html class="loaded"><body>${pug.renderFile('source/partials/control-panel.pug')}</body></html>`, { pretendToBeVisual: true })
 const { window } = dom, { document } = window
 window.scrollTo = () => {}
 window.HTMLElement.prototype.getClientRects = () => [{ width: 100, height: 44 }]
 setupControlsList(document)
 const toggle = document.getElementById('button-controls-list')
 const caption = toggle.querySelector('.controls-view-caption')
 assert.equal(toggle.parentElement.id, 'shared-controls')
 assert.equal(toggle.nextElementSibling.htmlFor, 'button-settings')
 assert.equal(document.getElementById('button-controls-list-close'), null)
 toggle.focus()
 for (let i = 0; i < 2; i++) {
  toggle.click()
  assert.equal(toggle.getAttribute('aria-expanded'), 'true')
  assert.equal(toggle.getAttribute('aria-label'), 'View controls as a grid')
  assert.equal(caption.textContent, 'View: Grid')
  assert.equal(document.activeElement, toggle)
  toggle.click()
  assert.equal(toggle.getAttribute('aria-expanded'), 'false')
  assert.equal(toggle.getAttribute('aria-label'), 'View controls as a list')
  assert.equal(caption.textContent, 'View: List')
  assert.equal(document.getElementById('control-panel').classList.contains('controls-list-open'), false)
  assert.equal(toggle.parentElement.id, 'shared-controls')
  assert.equal(document.activeElement, toggle)
 }
 dom.window.close()
})

for (const name of ['tempo', 'volume', 'midi', 'engine']) {
 test(`${name} takes keyboard focus until closed and restores the list`, () => {
  const dom = new JSDOM(`<html class="loaded"><body>${pug.renderFile('source/partials/control-panel.pug')}</body></html>`, { pretendToBeVisual: true })
  const { window } = dom, { document } = window
  window.scrollTo = () => {}
  window.HTMLElement.prototype.getClientRects = () => [{ width: 100, height: 44 }]
  const api = setupControlsList(document)
  const panel = document.getElementById('control-panel')
  const link = document.querySelector(`.folder-link[href="#folder-${name}"]`)
  const folder = link.closest('.folder-menu')
  const headerClose = document.getElementById('button-controls-list')
  const close = folder.querySelector('.folder-return') || headerClose
  // MIDI's existing compact handler consumes Escape at the panel itself.
  if (name === 'midi') document.getElementById('folder-midi').addEventListener('keydown', event => {
   if (event.key === 'Escape') event.stopPropagation()
  })
  api.open()
  panel.scrollTop = 240
  link.click()
  assert.equal(panel.classList.contains('controls-list-panel-open'), true)
  assert.equal(folder.classList.contains('controls-list-folder-open'), true)
  assert.equal(link.getAttribute('aria-expanded'), 'true')
  assert.equal(document.activeElement, close)
  assert.equal(headerClose.hidden, close !== headerClose)
  assert.ok(document.getElementById('button-share').closest('[inert]'))
  assert.equal(window.location.hash, '')
  close.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
  assert.ok(document.activeElement.closest(`#folder-${name}`))
  document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
  assert.equal(panel.classList.contains('controls-list-open'), true)
  assert.equal(panel.classList.contains('controls-list-panel-open'), false)
  assert.equal(headerClose.hidden, false)
  assert.equal(document.activeElement, link)
  assert.equal(panel.scrollTop, 240)
  assert.equal(document.getElementById('button-share').closest('[inert]'), null)
  link.click()
  close.click()
  assert.equal(panel.classList.contains('controls-list-open'), true)
  link.click()
  api.close()
  assert.equal(folder.classList.contains('controls-list-folder-open'), false)
  assert.equal(folder.classList.contains('midi-open'), false)
  assert.equal(panel.classList.contains('controls-list-panel-open'), false)
  assert.equal(document.getElementById('button-share').closest('[inert]'), null)
  assert.equal(document.getElementById('controls-list-title').textContent, 'All controls')
  dom.window.close()
 })
}
