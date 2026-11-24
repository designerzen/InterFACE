const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/**
 * MIDI 2.0 spec (M2-104-UM Appendix D.3) bit-repeat upscaling.
 * Maps 0 -> 0, exact midpoint -> midpoint, and max -> all 1s.
 */
export const scaleUp = (value, srcBits, dstBits) => {
	const maxSrc = (1 << srcBits) - 1
	const clamped = clamp(Math.round(Number(value) || 0), 0, maxSrc)
	const shift = dstBits - srcBits
	let scaled = (clamped * (2 ** shift)) >>> 0
	const center = 1 << (srcBits - 1)
	if (clamped <= center) return scaled
	const repeatBits = srcBits - 1
	let mask = (clamped & ((1 << repeatBits) - 1))
	let remaining = shift
	while (remaining > 0) {
		if (remaining >= repeatBits) {
			remaining -= repeatBits
			scaled = (scaled | (mask << remaining)) >>> 0
		} else {
			scaled = (scaled | (mask >>> (repeatBits - remaining))) >>> 0
			remaining = 0
		}
	}
	return scaled >>> 0
}

export const floatTo16Bit = value => {
	const v = clamp(Number(value) || 0, 0, 1)
	if (v <= 0) return 0
	return Math.max(1, Math.round(v * 0xffff))
}

export const floatTo32Bit = value => {
	const v = clamp(Number(value) || 0, 0, 1)
	return Math.round(v * 0xffffffff) >>> 0
}

export const pitchBendTo32Bit = value => {
	const v = clamp(Number(value) || 0, -1, 1)
	if (v === 0) return 0x80000000
	if (v >= 1) return 0xffffffff
	if (v <= -1) return 0x00000000
	return Math.round((v + 1) * 0.5 * 0xffffffff) >>> 0
}

const normaliseChannel = channel => clamp((Number(channel) || 1) - 1, 0, 15)
const normaliseGroup = group => clamp(Number(group) || 0, 0, 15)
const normaliseNote = note => {
	const number = typeof note === 'object' && note !== null
		? (note.number ?? note.noteNumber)
		: note
	if (typeof number === 'number' && Number.isFinite(number)) {
		return clamp(Math.round(number), 0, 127)
	}
	if (typeof number === 'string') {
		const match = /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(number.trim())
		if (match) {
			const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[match[1].toUpperCase()]
			const accidental = match[2] === '#' ? 1 : match[2] === 'b' ? -1 : 0
			const octave = Number(match[3])
			return clamp((octave + 1) * 12 + base + accidental, 0, 127)
		}
	}
	return 60
}

const makeMidi2Header = (statusNibble, group, channel, index, attributeType = 0) => (
	((0x4 << 28) |
	((normaliseGroup(group) & 0xf) << 24) |
	((statusNibble & 0xf) << 20) |
	((normaliseChannel(channel) & 0xf) << 16) |
	((index & 0x7f) << 8) |
	(attributeType & 0xff)) >>> 0
)

export const encodeUMPNoteOn = (note, { channel = 1, group = 0, velocity = 1, rawVelocity = null } = {}) => {
	const vel16 = rawVelocity !== null && rawVelocity !== undefined
		? scaleUp(rawVelocity, 7, 16)
		: floatTo16Bit(velocity)
	return [
		makeMidi2Header(0x9, group, channel, normaliseNote(note), 0),
		((vel16 & 0xffff) << 16) >>> 0,
	]
}

export const encodeUMPNoteOff = (note, { channel = 1, group = 0, velocity = 0, rawVelocity = null } = {}) => {
	const vel16 = rawVelocity !== null && rawVelocity !== undefined
		? scaleUp(rawVelocity, 7, 16)
		: floatTo16Bit(velocity)
	return [
		makeMidi2Header(0x8, group, channel, normaliseNote(note), 0),
		((vel16 & 0xffff) << 16) >>> 0,
	]
}

export const encodeUMPControlChange = (controller, value, { channel = 1, group = 0, rawValue = true } = {}) => {
	const cc = clamp(Math.round(Number(controller) || 0), 0, 127)
	const data = rawValue ? scaleUp(value, 7, 32) : floatTo32Bit(value)
	return [
		makeMidi2Header(0xb, group, channel, cc, 0),
		data >>> 0,
	]
}

export const encodeUMPPitchBend = (value, { channel = 1, group = 0 } = {}) => [
	makeMidi2Header(0xe, group, channel, 0, 0),
	pitchBendTo32Bit(value),
]

export const encodeUMPKeyAftertouch = (note, pressure, { channel = 1, group = 0 } = {}) => [
	makeMidi2Header(0xa, group, channel, normaliseNote(note), 0),
	floatTo32Bit(pressure),
]

export const encodeUMPChannelAftertouch = (pressure, { channel = 1, group = 0 } = {}) => [
	makeMidi2Header(0xd, group, channel, 0, 0),
	floatTo32Bit(pressure),
]

export const encodeUMPProgramChange = (program, { channel = 1, group = 0 } = {}) => [
	makeMidi2Header(0xc, group, channel, 0, 0),
	((clamp(Math.round(Number(program) || 0), 0, 127) & 0x7f) << 24) >>> 0,
]

export const encodeUMPSystemRealtime = (statusByte, { group = 0 } = {}) => [
	(((0x1 << 28) | ((normaliseGroup(group) & 0xf) << 24) | ((statusByte & 0xff) << 16)) >>> 0),
]

export const encodeUMPClock = (options = {}) => encodeUMPSystemRealtime(0xf8, options)

const createNoteInfo = (noteNumber, velocity, rawVelocity, isNoteOn) => {
	const name = NOTE_NAMES[noteNumber % 12]
	const octave = Math.floor(noteNumber / 12) - 1
	return {
		number: noteNumber,
		noteNumber,
		name,
		octave,
		identifier: `${name}${octave}`,
		attack: isNoteOn ? velocity : 0,
		release: isNoteOn ? 0 : velocity,
		rawAttack: isNoteOn ? rawVelocity : 0,
		rawRelease: isNoteOn ? 0 : rawVelocity,
	}
}

/**
 * Decode a native UMP message ({ endpointId, timestamp, words }) into a
 * WebMidi.js-compatible event object. Supports:
 *   - MT 0x1: System Common / System Real-Time (clock, start, continue, stop)
 *   - MT 0x2: MIDI 1.0 Channel Voice (32-bit)
 *   - MT 0x4: MIDI 2.0 Channel Voice (64-bit)
 */
export const decodeUMPMessage = ({ endpointId, timestamp = 0, words = [] } = {}) => {
	if (!Array.isArray(words) || !words.length) return null
	const w0 = words[0] >>> 0
	const messageType = (w0 >>> 28) & 0xf

	if (messageType === 0x1) {
		const status = (w0 >>> 16) & 0xff
		const typeMap = {
			0xf8: 'clock',
			0xfa: 'start',
			0xfb: 'continue',
			0xfc: 'stop',
		}
		const type = typeMap[status]
		if (!type) return null
		const data = new Uint8Array([status])
		return {
			type,
			timestamp,
			endpointId,
			rawWords: words,
			data,
			message: {
				type,
				statusByte: status,
				data,
				dataBytes: [],
			},
		}
	}

	if (messageType === 0x2 || messageType === 0x4) {
		const isMidi2 = messageType === 0x4
		if (isMidi2 && words.length < 2) return null
		const w1 = isMidi2 ? (words[1] >>> 0) : 0
		const statusNibble = (w0 >>> 20) & 0xf
		const channel0 = (w0 >>> 16) & 0xf
		const channel = channel0 + 1
		const statusByte = (statusNibble << 4) | channel0
		const byte1 = (w0 >>> 8) & 0x7f
		const byte2Midi1 = w0 & 0x7f

		switch (statusNibble) {
			case 0x9:
			case 0x8: {
				const rawVel16 = isMidi2 ? ((w1 >>> 16) & 0xffff) : null
				const rawVelocity = isMidi2 ? (rawVel16 >>> 9) : byte2Midi1
				const velocity = isMidi2 ? (rawVel16 / 0xffff) : (byte2Midi1 / 127)
				const isNoteOn = statusNibble === 0x9 && (isMidi2 ? rawVel16 > 0 : byte2Midi1 > 0)
				const type = isNoteOn ? 'noteon' : 'noteoff'
				const data = new Uint8Array([isNoteOn ? (0x90 | channel0) : (0x80 | channel0), byte1, rawVelocity])
				return {
					type,
					timestamp,
					endpointId,
					rawWords: words,
					data,
					velocity,
					rawVelocity,
					note: createNoteInfo(byte1, velocity, rawVelocity, isNoteOn),
					message: {
						type,
						channel,
						statusByte: data[0],
						data,
						dataBytes: [byte1, rawVelocity],
					},
				}
			}

			case 0xb: {
				const rawValue = isMidi2 ? (w1 >>> 25) : byte2Midi1
				const value = isMidi2 ? (w1 / 0xffffffff) : (byte2Midi1 / 127)
				const data = new Uint8Array([statusByte, byte1, rawValue])
				return {
					type: 'controlchange',
					timestamp,
					endpointId,
					rawWords: words,
					data,
					controller: { number: byte1 },
					value,
					rawValue,
					message: {
						type: 'controlchange',
						channel,
						statusByte,
						data,
						dataBytes: [byte1, rawValue],
					},
				}
			}

			case 0xe: {
				let value
				let data1
				let data2
				if (isMidi2) {
					value = (w1 - 0x80000000) / 0x80000000
					const bend14 = w1 >>> 18
					data1 = bend14 & 0x7f
					data2 = (bend14 >>> 7) & 0x7f
				} else {
					const bend14 = (byte2Midi1 << 7) | byte1
					value = (bend14 - 8192) / 8192
					data1 = byte1
					data2 = byte2Midi1
				}
				const data = new Uint8Array([statusByte, data1, data2])
				return {
					type: 'pitchbend',
					timestamp,
					endpointId,
					rawWords: words,
					data,
					value: clamp(value, -1, 1),
					message: {
						type: 'pitchbend',
						channel,
						statusByte,
						data,
						dataBytes: [data1, data2],
					},
				}
			}

			case 0xa: {
				const rawValue = isMidi2 ? (w1 >>> 25) : byte2Midi1
				const value = isMidi2 ? (w1 / 0xffffffff) : (byte2Midi1 / 127)
				const data = new Uint8Array([statusByte, byte1, rawValue])
				return {
					type: 'keyaftertouch',
					timestamp,
					endpointId,
					rawWords: words,
					data,
					note: createNoteInfo(byte1, value, rawValue, true),
					value,
					rawValue,
					message: {
						type: 'keyaftertouch',
						channel,
						statusByte,
						data,
						dataBytes: [byte1, rawValue],
					},
				}
			}

			case 0xd: {
				const rawValue = isMidi2 ? (w1 >>> 25) : byte1
				const value = isMidi2 ? (w1 / 0xffffffff) : (byte1 / 127)
				const data = new Uint8Array([statusByte, rawValue])
				return {
					type: 'channelaftertouch',
					timestamp,
					endpointId,
					rawWords: words,
					data,
					value,
					rawValue,
					message: {
						type: 'channelaftertouch',
						channel,
						statusByte,
						data,
						dataBytes: [rawValue],
					},
				}
			}

			case 0xc: {
				const program = isMidi2 ? ((w1 >>> 24) & 0x7f) : byte1
				const data = new Uint8Array([statusByte, program])
				return {
					type: 'programchange',
					timestamp,
					endpointId,
					rawWords: words,
					data,
					value: program,
					message: {
						type: 'programchange',
						channel,
						statusByte,
						data,
						dataBytes: [program],
					},
				}
			}
		}
	}

	return null
}
