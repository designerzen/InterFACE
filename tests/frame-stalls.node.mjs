import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createFrameStallMonitor } from '../source/utils/frame-stall-monitor.js'

const read = name => readFileSync(new URL(`../source/${name}`, import.meta.url), 'utf8')
// Supply graphics/ML dependencies as doubles: these tests need neither a GPU
// nor Parcel asset imports. All methods under test come from the source files.
const withoutImports = source => source.replace(/^import .* from ['"].*['"]\r?$/gm, '')
const AbstractDisplay = new Function(withoutImports(read('display/display-abstract.js'))
	.replace('export default class', 'class').replaceAll('export const ', 'const ') + '\nreturn AbstractDisplay')()
const Display2D = new Function('AbstractDisplay', withoutImports(read('display/display-canvas-2d.js'))
	.replace('export default class', 'class') + '\nreturn Display2D')(AbstractDisplay)

test('captures phase durations and heap changes around a stall', () => {
	let time = 0, heapBytes = 100_000_000
	const warnings = []
	const monitor = createFrameStallMonitor({now:() => time, heap:() => heapBytes, visible:() => true, onStall:s => warnings.push(s)})
	monitor.beginFrame(1)
	monitor.phase('inference', 2300)
	monitor.phase('render', 12)
	time = 2400
	heapBytes = 30_000_000
	monitor.beginFrame(3.4)
	assert.deepEqual(warnings[0], {at:2400, gapMs:2400, inferenceMs:2300, renderMs:12,
		cameraAdvanced:true, heapBeforeBytes:100_000_000, heapAfterBytes:30_000_000})
	monitor.stalls[0].gapMs = 0
	assert.equal(monitor.stalls[0].gapMs, 2400)
})

test('a simulated hour retains no normal frames and samples heap at most once per second', () => {
	let time = 0, heapReads = 0
	const monitor = createFrameStallMonitor({now:() => time, heap:() => { heapReads++; return 100 }, visible:() => true})
	for (; time < 3_600_000; time += 16) monitor.beginFrame(time / 1000)
	assert.deepEqual(monitor.stalls, [])
	assert.ok(heapReads <= 3600)
})

test('history stays bounded and visibility resets exclude background pauses', () => {
	let time = 0
	const monitor = createFrameStallMonitor({now:() => time, heap:() => null, visible:() => true, onStall:() => {}})
	for (let i = 0; i < 100; i++) { monitor.beginFrame(i); time += 1000 }
	assert.equal(monitor.stalls.length, 32)
	monitor.reset()
	time += 60_000
	monitor.beginFrame(100)
	assert.equal(monitor.stalls.at(-1).at, 99_000)
})

const withFrames = async action => {
	const previousRAF = globalThis.requestAnimationFrame, previousCancel = globalThis.cancelAnimationFrame
	const frames = new Map()
	let id = 0
	globalThis.requestAnimationFrame = callback => {frames.set(++id, callback); return id}
	globalThis.cancelAnimationFrame = key => frames.delete(key)
	try { await action(frames) }
	finally { globalThis.requestAnimationFrame = previousRAF; globalThis.cancelAnimationFrame = previousCancel }
}

test('repeated starts keep one loop and destruction cancels it', () => withFrames(async frames => {
	const display = new AbstractDisplay({}, 100, 100)
	let calls = 0
	display.setAnimationLoop(() => calls++, true)
	for (let i = 0; i < 100; i++) display.start()
	assert.equal(calls, 1)
	assert.equal(frames.size, 1)
	await display.destroy()
	assert.equal(frames.size, 0)
}))

test('switching away from 2D releases the loop and resize observer', () => withFrames(async frames => {
	const display = Object.create(Display2D.prototype)
	let disconnected = false
	display.resizeObserver = {disconnect:() => {disconnected = true}}
	display.setAnimationLoop(() => {}, true)
	await display.destroy()
	assert.equal(frames.size, 0)
	assert.equal(disconnected, true)
}))

test('replacing a loop cancels its old callback', () => withFrames(frames => {
	const display = new AbstractDisplay({}, 100, 100)
	let oldCalls = 0, newCalls = 0
	display.setAnimationLoop(() => oldCalls++, true)
	display.setAnimationLoop(() => newCalls++, true)
	assert.equal(frames.size, 1)
	const [id, frame] = frames.entries().next().value
	frames.delete(id)
	frame()
	assert.equal(oldCalls, 1)
	assert.equal(newCalls, 2)
}))

test('detection uses milliseconds after extended playback and increments equal clock readings', async () => {
	const calls = []
	const detector = {detectForVideo:(...args) => {calls.push(args); return {faceLandmarks:[]}}}
	const load = new Function('performance', 'FilesetResolver', 'FaceLandmarker', 'FACE_LANDMARK_TASK',
		withoutImports(read('models/face-landmarks.js')).replaceAll('export const ', 'const ').replaceAll('import.meta.url', JSON.stringify(import.meta.url)) + '\nreturn loadFaceLandmarksModel')(
		{now:() => 1_200_000}, {forVisionTasks:async () => ({})}, {createFromOptions:async () => detector}, 'face.task')
	const video = {currentTime:1200}
	const predict = await load(video, {})
	await predict()
	await predict()
	assert.equal(calls.length, 1)
	assert.equal(calls[0][1], 1_200_000)
	video.currentTime += 0.033
	await predict()
	assert.ok(Math.abs(calls[1][1] - 1_200_000.001) < 0.0001)
})

test('a rejected prediction releases the busy flag and allows the next frame to recover', async () => {
	const source = read('interface.js')
	const block = source.slice(source.indexOf('\t\tif (!isPredictionEngineBusy && shouldLoopBeAllowed())'))
		.split('\n\t\t}else{')[0] + '\n}'
	let calls = 0, errors = 0
	const loop = new Function('fetchPredictionFromEngine', 'console', `
		let isPredictionEngineBusy = false, peoplePredictions;
		const shouldLoopBeAllowed = () => true, clock = {now:0}, frameStallMonitor = {phase() {}};
		return {tick() { ${block} }, get busy() {return isPredictionEngineBusy}, get predictions() {return peoplePredictions}};
	`)(() => ++calls === 1 ? Promise.reject(new Error('transient GPU failure')) : Promise.resolve(['recovered']),
		{error:() => errors++})
	loop.tick()
	assert.equal(loop.busy, true)
	await new Promise(resolve => setImmediate(resolve))
	assert.equal(loop.busy, false)
	loop.tick()
	await new Promise(resolve => setImmediate(resolve))
	assert.deepEqual(loop.predictions, ['recovered'])
	assert.equal(errors, 1)
})
