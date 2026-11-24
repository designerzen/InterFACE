import test from 'node:test'
import assert from 'node:assert/strict'
import { CameraSession } from '../src/camera.js'
import { MediaPipeTracker } from '../src/tracking.js'

const stream = () => {
	const track = new EventTarget()
	let stops = 0
	track.stop = () => { stops++ }
	return { getTracks: () => [track], getVideoTracks: () => [track], get stops() { return stops } }
}
const video = () => ({ srcObject: null, play: async () => {}, pause() {} })

test('owned camera tracks stop, borrowed camera tracks survive disposal', async () => {
	const owned = stream(), borrowed = stream()
	const camera = new CameraSession({ mediaDevices: { getUserMedia: async () => owned }, createVideo: video })
	await camera.open()
	camera.close()
	assert.equal(owned.stops, 1)
	await camera.open({ stream: borrowed })
	camera.close()
	assert.equal(borrowed.stops, 0)
})

test('a late permission result is stopped after cancellation', async () => {
	let grant
	const owned = stream()
	const camera = new CameraSession({ mediaDevices: { getUserMedia: () => new Promise(resolve => { grant = resolve }) }, createVideo: video })
	const pending = camera.open()
	camera.close()
	grant(owned)
	await assert.rejects(pending, { name: 'AbortError' })
	assert.equal(owned.stops, 1)
})

test('camera denial is not retried and playback errors close the stream', async () => {
	let calls = 0
	const camera = new CameraSession({ mediaDevices: { getUserMedia: async () => { calls++; throw new DOMException('Denied', 'NotAllowedError') } }, createVideo: video })
	await assert.rejects(camera.open(), /Denied/)
	assert.equal(calls, 1)
	const owned = stream()
	camera.mediaDevices = { getUserMedia: async () => owned }
	await assert.rejects(camera.open({ video: { ...video(), play: async () => { throw new Error('Playback failed') } } }), /Playback/)
	assert.equal(owned.stops, 1)
})

test('closing a borrowed video restores its previous source and properties', async () => {
	const previous = stream(), current = stream()
	const element = { ...video(), srcObject: previous, muted: false, playsInline: false }
	const camera = new CameraSession()
	await camera.open({ stream: current, video: element })
	camera.close()
	assert.equal(element.srcObject, previous)
	assert.equal(element.muted, false)
	assert.equal(current.stops, 0)
})

test('cancelled detector initialization closes its late detector', async () => {
	let ready, closes = 0
	const tracker = new MediaPipeTracker({ createDetector: () => new Promise(resolve => { ready = resolve }) })
	const pending = tracker.load()
	tracker.close()
	ready({ close: () => { closes++ } })
	await assert.rejects(pending, { name: 'AbortError' })
	assert.equal(closes, 1)
})

test('detector timestamps remain strictly increasing and in milliseconds', async () => {
	const timestamps = []
	const tracker = new MediaPipeTracker({ mode: 'hands', createDetector: async () => ({
		recognizeForVideo: (_, time) => { timestamps.push(time); return { landmarks: [] } }, close() {}
	}) })
	await tracker.load()
	await tracker.detect({}, 1000)
	await tracker.detect({}, 1000)
	await tracker.detect({}, 999)
	assert.equal(timestamps[0], 1000)
	assert(timestamps[1] > timestamps[0] && timestamps[2] > timestamps[1])
	tracker.close()
})
