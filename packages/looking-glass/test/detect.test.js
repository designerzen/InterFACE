import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { probeLookingGlassPortraits, getConnectedPortraitCount, getConnectedPortraits } from '../src/detect.js'

// Fixture encoder covers the response types used by HoloPlay info, including calibration floats.
function encode(value) {
  if (typeof value === 'number') {
    if (Number.isInteger(value) && value >= 0 && value < 24) return [value]
    const bytes = new Uint8Array(9)
    bytes[0] = 251
    new DataView(bytes.buffer).setFloat64(1, value)
    return [...bytes]
  }
  if (value === null) return [246]
  if (typeof value === 'boolean') return [value ? 245 : 244]
  if (typeof value === 'string') {
    const bytes = new TextEncoder().encode(value)
    return [...(bytes.length < 24 ? [96 + bytes.length] : [120, bytes.length]), ...bytes]
  }
  if (Array.isArray(value)) return [128 + value.length, ...value.flatMap(encode)]
  const entries = Object.entries(value)
  return [160 + entries.length, ...entries.flatMap(([key, entry]) => [...encode(key), ...encode(entry)])]
}

function transport(info, { malformed = false, silent = false } = {}) {
  let instance
  class Socket {
    constructor() { instance = this; queueMicrotask(() => this.onopen?.()) }
    send(bytes) {
      this.request = bytes
      if (silent) return
      const response = new Uint8Array(4 + (malformed ? 1 : encode(info).length))
      new DataView(response.buffer).setUint32(0, 0x80000001)
      response.set(malformed ? [255] : encode(info), 4)
      queueMicrotask(() => this.onmessage?.({ data: response.buffer }))
    }
    close() { this.closed = true }
  }
  return { Socket, get instance() { return instance } }
}

test('counts Portraits only and closes the lightweight info connection', async () => {
  const connection = transport({ error: 0, devices: [
    { calibration: { serial: 'LKG-P123', pitch: { value: 49.52 } } },
    { hardwareVersion: 'portrait', serial: 'other' },
    { calibration: { serial: 'LKG-8K123' } }
  ] })
  assert.deepEqual(await probeLookingGlassPortraits({ WebSocket: connection.Socket }), { count: 2, status: 'connected' })
  assert.ok(connection.instance.closed)
  assert.equal(new DataView(connection.instance.request.buffer).getUint32(0), 0x80000001)
  assert.deepEqual([...connection.instance.request.slice(4)], encode({ cmd: { info: {} }, bin: null }))
})

test('zero devices, malformed replies, missing service and cancellation are bounded', async () => {
  const empty = transport({ error: 0, devices: [] })
  assert.deepEqual(await probeLookingGlassPortraits({ WebSocket: empty.Socket }), { count: 0, status: 'connected' })
  const broken = transport({}, { malformed: true })
  assert.equal(await getConnectedPortraitCount({ WebSocket: broken.Socket }), 0)
  assert.ok(broken.instance.closed)
  const silent = transport({}, { silent: true })
  assert.deepEqual(await probeLookingGlassPortraits({ WebSocket: silent.Socket, timeoutMs: 10 }), { count: 0, status: 'unavailable' })
  assert.ok(silent.instance.closed)
  const controller = new AbortController()
  const pending = probeLookingGlassPortraits({ WebSocket: silent.Socket, signal: controller.signal })
  controller.abort()
  assert.equal((await pending).status, 'aborted')
  assert.ok(silent.instance.closed)
  assert.equal(await getConnectedPortraitCount({ WebSocket: null }), 0)
})

test('renderer setup can request Portrait calibration without loading a vendor SDK', async () => {
  const connection = transport({ error: 0, devices: [{ calibration: { serial: 'LKG-P123', pitch: 45 } }] })
  const devices = await getConnectedPortraits({ WebSocket: connection.Socket })
  assert.equal(devices.length, 1)
  assert.equal(devices[0].calibration.serial, 'LKG-P123')
  assert.equal(devices[0].calibration.pitch, 45)
  assert.ok(connection.instance.closed)
  await assert.rejects(getConnectedPortraits({ WebSocket: null }), /unavailable/)
})

test('detection import graph contains no renderer, SDK or Three dependency', async () => {
  const entry = await readFile(new URL('../src/detect.js', import.meta.url), 'utf8')
  const decoder = await readFile(new URL('../src/info-response.js', import.meta.url), 'utf8')
  assert.deepEqual([...entry.matchAll(/^import .* from ['"]([^'"]+)['"]/gm)].map(match => match[1]), ['./info-response.js'])
  assert.doesNotMatch(decoder, /^import\s/m)
  const app = await readFile(new URL('../../../source/hardware/looking-glass-portrait.js', import.meta.url), 'utf8')
  assert.doesNotMatch(app, /holoplay-core|three|webxr/)
})
