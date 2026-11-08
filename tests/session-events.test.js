import { clearSessionEventRecorder, recordSessionEvent, setSessionEventRecorder } from '../source/storage/session-events.js'

test('routes musical events to the active session recorder', () => {
	const recorder = { record: jest.fn(()=>true) }
	setSessionEventRecorder(recorder)
	expect(recordSessionEvent({ type: 'noteOn', note: 60 })).toBe(true)
	expect(recorder.record).toHaveBeenCalledWith({ type: 'noteOn', note: 60 })
	clearSessionEventRecorder(recorder)
	expect(recordSessionEvent({ type: 'noteOff', note: 60 })).toBe(false)
})
