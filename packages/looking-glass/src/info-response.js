// Bounded decoder for the CBOR info response. No rendering or SDK dependencies.
export function readInfoResponse(buffer) {
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 5 || buffer.byteLength > 1048576) throw new Error('Invalid info response')
  const data = new DataView(buffer)
  let offset = 4
  const take = size => {
    if (offset + size > data.byteLength) throw new Error('Truncated info response')
    const start = offset
    offset += size
    return start
  }
  const read = (depth = 0) => {
    if (depth > 32) throw new Error('Info response nesting limit exceeded')
    const head = data.getUint8(take(1)), major = head >> 5, extra = head & 31
    if (major === 7) {
      if (extra === 20) return false
      if (extra === 21) return true
      if (extra === 22 || extra === 23) return null
      if (extra === 25) {
        const half = data.getUint16(take(2)), exponent = (half >> 10) & 31, fraction = half & 1023
        return (half & 32768 ? -1 : 1) * (exponent === 31 ? fraction ? NaN : Infinity :
          exponent === 0 ? fraction * 2 ** -24 : (1 + fraction / 1024) * 2 ** (exponent - 15))
      }
      if (extra === 26) return data.getFloat32(take(4))
      if (extra === 27) return data.getFloat64(take(8))
      throw new Error('Unsupported info response value')
    }
    let length = extra
    if (extra === 24) length = data.getUint8(take(1))
    else if (extra === 25) length = data.getUint16(take(2))
    else if (extra === 26) length = data.getUint32(take(4))
    else if (extra === 27) length = Number(data.getBigUint64(take(8)))
    else if (extra > 27) throw new Error('Indefinite CBOR is not supported')
    if (!Number.isSafeInteger(length)) throw new Error('Invalid CBOR length')
    if (major === 0) return length
    if (major === 1) return -1 - length
    if (major === 2 || major === 3) {
      const bytes = new Uint8Array(buffer, take(length), length)
      return major === 3 ? new TextDecoder().decode(bytes) : bytes
    }
    if (major === 6) return read(depth + 1)
    if (length > 65536) throw new Error('Info collection limit exceeded')
    if (major === 4) return Array.from({ length }, () => read(depth + 1))
    if (major === 5) {
      const result = Object.create(null)
      for (let i = 0; i < length; i++) {
        const key = read(depth + 1)
        if (typeof key !== 'string') throw new Error('Invalid info map key')
        result[key] = read(depth + 1)
      }
      return result
    }
    throw new Error('Invalid info response type')
  }
  const info = read()
  if (offset !== buffer.byteLength || info?.error !== 0 || !Array.isArray(info.devices)) throw new Error('Invalid device info')
  return info.devices
}
