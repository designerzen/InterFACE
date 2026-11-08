import {
	decodeSessionEvents,
	encodeSessionEvents,
	normaliseVelocity,
	SESSION_EVENT_RECORD_SIZE
} from '../source/storage/session-format.js'

test('normalises application velocities and preserves event timing', () => {
	expect(normaliseVelocity(0.8)).toBe(102)
	const buffer = encodeSessionEvents([{ time: 12.5, type: 'noteOn', note: 60, velocity: 0.8, channel: 2 }])
	expect(buffer.byteLength).toBe(SESSION_EVENT_RECORD_SIZE)
	expect(decodeSessionEvents(buffer)[0]).toEqual(expect.objectContaining({
		time: 12.5,
		type: 'noteOn',
		note: 60,
		velocity: 102,
		channel: 2
	}))
})
