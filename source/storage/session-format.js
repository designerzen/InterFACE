// Versioned, fixed-width event records used by the session recorder.
// The format deliberately contains only numeric fields so batches can be
// transferred to the OPFS worker without JSON allocation.

export const SESSION_EVENT_MAGIC = [0x50, 0x53, 0x59, 0x4e] // PSYN
export const SESSION_EVENT_VERSION = 1
export const SESSION_EVENT_HEADER_SIZE = 16
export const SESSION_EVENT_RECORD_SIZE = 32

export const SESSION_EVENT_TYPES = Object.freeze({
	noteOff: 0,
	noteOn: 1,
	control: 2,
	programChange: 3,
	pitchBend: 4,
	marker: 5
})

const typeNames = Object.fromEntries(Object.entries(SESSION_EVENT_TYPES).map(([name, value]) => [value, name]))

export const normaliseVelocity = (velocity, unit = 'normalized') => {
	const value = Number(velocity ?? 0)
	if (!Number.isFinite(value)) throw new TypeError('Invalid velocity')
	return Math.max(0, Math.min(127, Math.round(unit === 'midi' ? value : value * 127)))
}

export const normaliseEvent = (event, sequence = 0) => ({
	sequence: event.sequence ?? sequence,
	time: Number(event.time ?? event.timestampMs ?? 0),
	type: typeof event.type === 'number' ? event.type : (SESSION_EVENT_TYPES[event.type] ?? SESSION_EVENT_TYPES.marker),
	note: Math.max(0, Math.min(127, Math.round(event.controller ?? event.note ?? event.noteNumber ?? 0))),
	velocity: normaliseVelocity(event.velocity, event.velocityUnit),
	channel: Math.max(0, Math.min(15, Math.round(event.channel ?? 0))),
	track: Math.max(0, Math.min(65535, Math.round(event.track ?? event.trackId ?? 0))),
	value1: Number(event.value1 ?? event.program ?? event.value ?? 0),
	value2: Number(event.value2 ?? 0)
})

export const createSessionEventHeader = () => {
	const buffer = new ArrayBuffer(SESSION_EVENT_HEADER_SIZE)
	const view = new DataView(buffer)
	SESSION_EVENT_MAGIC.forEach((value, index) => view.setUint8(index, value))
	view.setUint16(4, SESSION_EVENT_VERSION, true)
	view.setUint16(6, SESSION_EVENT_RECORD_SIZE, true)
	return buffer
}

export const encodeSessionEvents = (events, sequenceStart = 0) => {
	const buffer = new ArrayBuffer(events.length * SESSION_EVENT_RECORD_SIZE)
	const view = new DataView(buffer)
	events.forEach((rawEvent, index) => {
		const event = normaliseEvent(rawEvent, sequenceStart + index)
		const offset = index * SESSION_EVENT_RECORD_SIZE
		view.setFloat64(offset, event.time, true)
		view.setUint32(offset + 8, event.sequence, true)
		view.setUint8(offset + 12, event.type)
		view.setUint8(offset + 13, event.note)
		view.setUint8(offset + 14, event.velocity)
		view.setUint8(offset + 15, event.channel)
		view.setUint16(offset + 16, event.track, true)
		view.setFloat32(offset + 20, event.value1, true)
		view.setFloat32(offset + 24, event.value2, true)
	})
	return buffer
}

export const decodeSessionEvents = buffer => {
	const view = new DataView(buffer)
	const count = Math.floor(buffer.byteLength / SESSION_EVENT_RECORD_SIZE)
	return Array.from({ length: count }, (_, index) => {
		const offset = index * SESSION_EVENT_RECORD_SIZE
		return {
			time: view.getFloat64(offset, true),
			sequence: view.getUint32(offset + 8, true),
			type: typeNames[view.getUint8(offset + 12)] ?? 'marker',
			note: view.getUint8(offset + 13),
			velocity: view.getUint8(offset + 14),
			velocityUnit: 'midi',
			channel: view.getUint8(offset + 15),
			track: view.getUint16(offset + 16, true),
			value1: view.getFloat32(offset + 20, true),
			value2: view.getFloat32(offset + 24, true)
		}
	})
}
