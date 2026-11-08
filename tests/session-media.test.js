import { createSessionMediaCapture } from '../source/audio/record/session-media.js'

test('creates independent audio and video recorders when both streams are selected', () => {
	const recorders = []
	global.MediaRecorder = class {
		static isTypeSupported = () => true
		state = 'inactive'
		listeners = new Map()
		constructor(stream) { this.stream = stream; recorders.push(this) }
		addEventListener(type, callback) { this.listeners.set(type, callback) }
		start() { this.state = 'recording' }
		stop() { this.state = 'inactive'; this.listeners.get('stop')?.() }
	}
	const canvas = { captureStream: () => ({ kind: 'video', getTracks:()=>[] }) }
	const capture = createSessionMediaCapture({ audioStream: { kind: 'audio' }, canvas })
	expect(capture.available).toBe(true)
	expect(recorders).toHaveLength(2)
	capture.start()
	expect(recorders.every(recorder => recorder.state === 'recording')).toBe(true)
})
