import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three/webgpu'
import { createMouthNoteEmitter } from '../source/display/mouth-note-particles.js'

const person = () => {
  const points = Array.from({ length: 478 }, () => ({ x: .5, y: .5, z: 0 }))
  Object.assign(points, { 13: { x: .5, y: .58, z: -.02 }, 14: { x: .5, y: .62, z: -.02 },
    234: { x: .2, y: .5, z: 0 }, 454: { x: .8, y: .5, z: 0 },
    10: { x: .5, y: .1, z: 0 }, 152: { x: .5, y: .9, z: 0 } })
  return { data: { keypoints: points }, alive: true, noteVelocity: 1, hue: 240, saturation: 100, luminosity: 50 }
}

test('scheduled note bursts start at the lips, retain note colour, move outward and expire', () => {
  const host = { scene: new THREE.Scene(), options: {} }, emitter = createMouthNoteEmitter(host, THREE)
  const note = person()
  assert.equal(emitter.emit(note, { at: 1000 }), true)
  emitter.update(900)
  assert.equal(emitter.visual.visible, false)
  emitter.update(1000)
  const geometry = emitter.visual.geometry, positions = geometry.attributes.position, colours = geometry.attributes.color
  assert.equal(geometry.drawRange.count, 16)
  const initialZ = positions.getZ(0), initialY = positions.getY(0)
  assert.ok(Math.abs(initialY - (-.1 * 3.14)) < .02, `mouth Y: ${initialY}`)
  assert.ok(colours.getZ(0) > .99 && colours.getX(0) < .01 && colours.getY(0) < .01)
  assert.ok(colours.getW(0) > .8)
  emitter.update(1050)
  assert.ok(positions.getZ(0) > initialZ)
  assert.ok(colours.getW(0) < .85)
  emitter.update(2300)
  assert.equal(emitter.visual.visible, false)
  assert.equal(geometry.drawRange.count, 0)
  emitter.dispose()
  assert.equal(host.scene.children.length, 0)
  assert.equal(emitter.emit(note), false)
})

test('rapid notes reuse a bounded pool and invalid or dead faces do not emit', () => {
  const host = { scene: new THREE.Scene(), options: {} }, emitter = createMouthNoteEmitter(host, THREE), note = person()
  assert.equal(emitter.emit({ ...note, dead: true }, { at: 0 }), false)
  assert.equal(emitter.emit({ data: {}, noteVelocity: 1 }, { at: 0 }), false)
  assert.equal(emitter.emit(note, { at: 0, velocity: 0 }), false)
  const positions = emitter.visual.geometry.attributes.position.array
  for (let frame = 0; frame < 100; frame++) {
    for (let j = 0; j < 5; j++) emitter.emit(note, { at: frame * 16 })
    emitter.update(frame * 16)
    assert.ok(emitter.visual.geometry.drawRange.count <= 256)
    assert.equal(emitter.visual.geometry.attributes.position.array, positions)
    assert.ok(positions.every(Number.isFinite))
  }
  emitter.dispose()
})
