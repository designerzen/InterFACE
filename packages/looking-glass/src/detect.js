import { readInfoResponse } from './info-response.js'

// HoloPlay/Bridge compatibility info request: { cmd: { info: {} }, bin: null }.
// A separate package subpath keeps Three, TSL, the renderer and both SDKs unloaded.
const infoRequest = new Uint8Array([162, 99, 99, 109, 100, 161, 100, 105, 110, 102, 111, 160, 99, 98, 105, 110, 246])

export function isPortraitDevice(device) {
  const serial = device?.calibration?.serial ?? device?.serial ?? ''
  return /^LKG-P/i.test(serial) || /portrait/i.test(device?.hardwareVersion ?? '')
}

// status distinguishes an unavailable service from a successful query returning zero.
export function probeLookingGlassPortraits({ timeoutMs = 1500, signal, includeDevices = false, WebSocket: Socket = globalThis.WebSocket } = {}) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new RangeError('timeoutMs must be positive')
  return new Promise(resolve => {
    let socket, timer, finished = false
    const finish = (status, count = 0, devices = []) => {
      if (finished) return
      finished = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      if (socket) {
        socket.onopen = socket.onmessage = socket.onclose = null
        // Closing a connecting browser socket may emit a later error event.
        socket.onerror = () => {}
        try { socket.close() } catch {}
      }
      resolve(Object.freeze(includeDevices ? { count, status, devices } : { count, status }))
    }
    const abort = () => finish('aborted')
    if (signal?.aborted) return finish('aborted')
    if (!Socket) return finish('unavailable')
    signal?.addEventListener('abort', abort, { once: true })
    timer = setTimeout(() => finish('unavailable'), timeoutMs)
    try {
      socket = new Socket('ws://localhost:11222/driver', ['rep.sp.nanomsg.org'])
      socket.binaryType = 'arraybuffer'
      socket.onopen = () => {
        try {
          const request = new Uint8Array(4 + infoRequest.length)
          new DataView(request.buffer).setUint32(0, 0x80000001)
          request.set(infoRequest, 4)
          socket.send(request)
        } catch { finish('unavailable') }
      }
      socket.onmessage = event => {
        try {
          if (!(event.data instanceof ArrayBuffer) || event.data.byteLength < 4 ||
              new DataView(event.data).getUint32(0) !== 0x80000001) throw new Error('Invalid reply ID')
          const devices = readInfoResponse(event.data).filter(isPortraitDevice)
          finish('connected', devices.length, devices)
        } catch { finish('unavailable') }
      }
      socket.onerror = socket.onclose = () => finish('unavailable')
    } catch { finish('unavailable') }
  })
}

export async function getConnectedPortraitCount(options) {
  return (await probeLookingGlassPortraits(options)).count
}

export async function getConnectedPortraits(options = {}) {
  const result = await probeLookingGlassPortraits({ ...options, includeDevices: true })
  if (result.status !== 'connected') throw new Error(`Looking Glass device query ${result.status}`)
  return result.devices
}
