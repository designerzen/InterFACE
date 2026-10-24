import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeCalibration, normalizeQuilt, getTileViewport, getViewIndex } from '../src/calibration.js'
import { calibration } from './fixtures.js'

test('Portrait has 48 effective views and an exact tile grid', () => {
  const quilt = normalizeQuilt()
  assert.equal(quilt.views, 48)
  assert.deepEqual(getTileViewport(0, quilt), { x: 0, y: 2800, width: 420, height: 560 })
  assert.deepEqual(getTileViewport(47, quilt), { x: 2940, y: 0, width: 420, height: 560 })
  assert.equal(normalizeQuilt({ columns: 4, rows: 3 }).views, 12)
})

test('invalid quality settings fail before allocating textures', () => {
  for (const options of [{ views: 49 }, { width: 3361 }, { columns: 0 }, { rows: NaN }, { views: 1.5 }]) {
    assert.throws(() => normalizeQuilt(options), RangeError)
  }
  assert.throws(() => getTileViewport(48, normalizeQuilt()), RangeError)
})

test('raw calibration is immutable and validates unsupported panels', () => {
  const snapshot = structuredClone(calibration)
  const result = normalizeCalibration(calibration)
  assert.equal(result.aspect, 0.75)
  assert.equal(result.tilt, 128 / (96 * -5))
  assert.deepEqual(calibration, snapshot)
  assert.ok(Object.isFrozen(result))
  for (const patch of [{ slope: 0 }, { DPI: -1 }, { pitch: NaN }, { center: undefined }, { flipSubp: 3 }, { subpixelCells: [{}] }]) {
    assert.throws(() => normalizeCalibration({ ...calibration, ...patch }))
  }
})

test('subpixel phase agrees with scalar reference and never selects outside quilt', () => {
  const config = normalizeCalibration(calibration)
  for (let y = 0; y <= 1; y += .1) for (let x = 0; x <= 1; x += .03) for (let channel = 0; channel < 3; channel++) {
    const phase = (x + channel * config.subpixel + y * config.tilt) * config.pitch - config.center
    const expected = Math.min(47, Math.floor((1 - (phase - Math.floor(phase))) * 48))
    assert.equal(getViewIndex(x, y, channel, config, 48), expected)
    const inverted = getViewIndex(x, y, channel, { ...config, invertViews: true }, 48)
    assert.ok(inverted >= 0 && inverted < 48)
  }
})
