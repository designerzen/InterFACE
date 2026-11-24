import test from 'node:test'
import assert from 'node:assert/strict'
import { Photosynth, Performer, PHOTOSYNTH_STATE, PHOTOSYNTH_ERROR } from '../src/index.js'

const prediction = (x = 0.1, values = {}) => ({
	box: { xMin: x, xMax: x + 0.2, yMin: 0.1, yMax: 0.4 },
	roll: 0, pitch: 0, yaw: 0, mouthRatio: 0.8, happiness: 0.7,
	eyebrowExtents: 1, eyesHorizontal: 0, ...values
})

test('headless musical input needs neither document nor AudioContext', () => {
	assert.equal(typeof document, 'undefined')
	assert.equal(typeof AudioContext, 'undefined')
	const sdk = new Photosynth({ maxPerformers: 1 })
	const received = []
	const unsubscribe = sdk.onMusic(event => received.push(event))
	const events = sdk.process([prediction()], 1000)
	assert(events.some(event => event.type === 'chordOn' && event.notes.length > 1))
	assert.deepEqual(received, events)
	assert(events.every(event => event.time === 1000 && event.channel === 1 && event.source === 'person-0'))
	assert.doesNotThrow(() => JSON.stringify(events))
	unsubscribe()
	sdk.process([], 1100)
	assert.equal(received.length, events.length)
	sdk.dispose()
})

test('multiple performers keep their identity when detector order changes', () => {
	const sdk = new Photosynth({ maxPerformers: 2 })
	sdk.process([prediction(0.1), prediction(0.7)], 1000)
	sdk.process([prediction(0.71, { roll: 0.5 }), prediction(0.11, { roll: -0.5 })], 1100)
	assert.equal(sdk.performers[0].data.roll, -0.5)
	assert.equal(sdk.performers[1].data.roll, 0.5)
	const events = sdk.process([prediction(0.12)], 1200)
	assert(events.some(event => event.type === 'noteOff' && event.performer === 1 && event.channel === 2))
	assert(!events.some(event => event.type === 'noteOff' && event.performer === 0))
	sdk.dispose()
})

test('closed mouths retain tracking and calibration while releasing sound', () => {
	const sdk = new Photosynth({ maxPerformers: 1 })
	sdk.process([prediction()], 1000)
	const events = sdk.process([prediction(0.1, { mouthRatio: 0, happiness: 0 })], 1100)
	assert(events.some(event => event.type === 'noteOff'))
	assert(sdk.performers[0].data)
	assert.equal(sdk.performers[0].motion.tracked, true)
	assert.equal(sdk.calibrate(), true)
	sdk.dispose()
})

test('configuration validates atomically and releases on the old channel', () => {
	const sdk = new Photosynth({ maxPerformers: 1 })
	sdk.process([prediction()], 1000)
	const before = sdk.exportConfiguration()
	assert.throws(() => sdk.configure(0, { channel: 0 }), /Channel/)
	assert.deepEqual(sdk.exportConfiguration(), before)
	assert(sdk.performers[0].activeNotes.size)
	const events = []
	sdk.onMusic(event => events.push(event))
	sdk.configure(0, { channel: 9 })
	assert(events.filter(event => event.type === 'noteOff').every(event => event.channel === 1))
	assert.equal(sdk.performers[0].options.channel, 9)
	sdk.restoreConfiguration(before)
	assert.deepEqual(sdk.exportConfiguration(), before)
	sdk.dispose()
})

test('muting, tracking loss and disposal release held notes once', () => {
	const sdk = new Photosynth({ maxPerformers: 1, performer: { chord: false } })
	const events = []
	sdk.onMusic(event => events.push(event))
	sdk.process([prediction()], 1000)
	sdk.configure(0, { muted: true })
	assert.equal(events.filter(event => event.type === 'noteOff').length, 1)
	sdk.process([prediction()], 1100)
	assert.equal(events.filter(event => event.type === 'noteOn').length, 1)
	sdk.dispose()
	sdk.dispose()
	assert.equal(events.filter(event => event.type === 'noteOff').length, 1)
	assert.throws(() => sdk.process([], 1200), /disposed/)
})

const deferred = () => {
	let resolve, reject
	const promise = new Promise((yes, no) => { resolve = yes; reject = no })
	return { promise, resolve, reject }
}
const flush = () => new Promise(resolve => setImmediate(resolve))
const harness = (overrides = {}) => {
	let time = 1000, next
	const video = { readyState: 2, currentTime: 1 }
	let closes = 0
	const camera = { open: async () => video, close: () => { closes++ } }
	const tracker = { load: async () => {}, detect: async () => [prediction()], close() {} }
	const sdk = new Photosynth({ maxPerformers: 1, camera, createTracker: () => tracker,
		now: () => time, requestFrame: callback => { next = callback; return 1 }, cancelFrame: () => { next = undefined }, ...overrides })
	return { sdk, video, tracker, camera, get closes() { return closes }, step: async elapsed => {
		time += elapsed; const callback = next; next = undefined; callback?.(); await flush()
	} }
}

test('stop cancels startup and ignores a late detector load', async () => {
	const load = deferred()
	const h = harness({ createTracker: () => ({ load: () => load.promise, close() {} }) })
	const states = []
	h.sdk.addEventListener(PHOTOSYNTH_STATE, event => states.push(event.detail))
	const first = h.sdk.start()
	assert.equal(h.sdk.start(), first)
	await flush()
	h.sdk.stop()
	load.resolve()
	await first
	assert.equal(h.sdk.state, 'idle')
	assert(!states.includes('running'))
	h.sdk.dispose()
})

test('inference is bounded and stale asynchronous results cannot resurrect notes', async () => {
	const detect = deferred()
	let calls = 0
	const h = harness({ createTracker: () => ({ load: async () => {}, detect: () => { calls++; return detect.promise }, close() {} }) })
	const events = []
	h.sdk.onMusic(event => events.push(event))
	await h.sdk.start()
	await h.step(50)
	h.video.currentTime++
	await h.step(50)
	assert.equal(calls, 1)
	h.sdk.stop()
	detect.resolve([prediction()])
	await flush()
	assert.equal(events.length, 0)
	assert.equal(h.sdk.state, 'idle')
	h.sdk.dispose()
})

test('stalled video releases notes and tracker failures close resources', async () => {
	const h = harness()
	const events = []
	const errors = []
	h.sdk.onMusic(event => events.push(event))
	h.sdk.addEventListener(PHOTOSYNTH_ERROR, event => errors.push(event.detail))
	await h.sdk.start()
	await h.step(50)
	assert(events.some(event => event.type === 'chordOn'))
	await h.step(500)
	assert(events.some(event => event.type === 'noteOff'))
	h.tracker.detect = async () => { throw new Error('Detector failed') }
	h.video.currentTime++
	await h.step(50)
	assert.equal(h.sdk.state, 'error')
	assert.equal(errors[0].message, 'Detector failed')
	assert(h.closes > 0)
	h.sdk.dispose()
})

test('hand tracking emits pinch notes with hysteresis and releases when opened', () => {
	const performer = new Performer(0, { mode: 'hands' })
	const points = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }))
	points[0] = { x: 0.5, y: 0.8 }; points[9] = { x: 0.5, y: 0.3 }
	points[4] = { x: 0.51, y: 0.5 }
	const on = performer.update({ landmarks: points }, 1000)
	assert(on.some(event => event.type === 'noteOn'))
	points[4] = { x: 0.9, y: 0.5 }
	assert(performer.update({ landmarks: points }, 1100).some(event => event.type === 'noteOff'))
})

test('hiding the document releases notes immediately and pauses inference', async () => {
	const document = new EventTarget()
	document.hidden = false
	const h = harness({ visibilityDocument: document })
	const events = []
	h.sdk.onMusic(event => events.push(event))
	await h.sdk.start()
	await h.step(50)
	assert(events.some(event => event.type === 'chordOn'))
	document.hidden = true
	document.dispatchEvent(new Event('visibilitychange'))
	assert(events.some(event => event.type === 'noteOff'))
	const count = events.filter(event => event.type === 'chordOn').length
	h.video.currentTime++
	await h.step(50)
	assert.equal(events.filter(event => event.type === 'chordOn').length, count)
	h.sdk.dispose()
})

test('wink gestures request host instrument changes even while the mouth is closed', () => {
	const sdk = new Photosynth({ maxPerformers: 1, performer: { maxHoldMs: 500, minHoldMs: 500 } })
	const events = []
	sdk.onMusic(event => events.push(event))
	for (const time of [1000, 1200, 1400, 1600]) {
		sdk.process([prediction(0.1, { mouthRatio: 0, happiness: 0, time, leftEyeClosed: true, rightEyeClosed: false })], time)
	}
	assert(events.some(event => event.type === 'instrumentRequest' && event.action === 'previous'))
	assert(!events.some(event => event.type === 'noteOn' || event.type === 'chordOn'))
	sdk.dispose()
})

test('eyebrow sound styles emit parameter intent and reset it on tracking loss', () => {
	const performer = new Performer(0, { eyebrowStyle: 'echo' })
	const events = performer.update(prediction(0.1, { eyebrowsRaisedBy: 0.7 }), 1000)
	assert(events.some(event => event.type === 'parameterChange' && event.parameter === 'delay' && event.value === 0.7))
	assert(performer.reset(1100).some(event => event.type === 'parameterChange' && event.parameter === 'delay' && event.value === 0))
})

test('stereo intent matches the original direction and holds through closed eyes', () => {
	const performer = new Performer(0)
	const first = performer.update(prediction(0.1, { eyesHorizontal: 0.5 }), 1000)
	assert(first.some(event => event.type === 'controlChange' && event.controller === 10 && event.value === 0.25))
	const closed = performer.update(prediction(0.1, { eyesHorizontal: -0.5, leftEyeClosed: true }), 1100)
	assert(!closed.some(event => event.type === 'controlChange' && event.controller === 10))
	assert(performer.reset(1200).some(event => event.type === 'controlChange' && event.controller === 10 && event.value === 0.5))
})
