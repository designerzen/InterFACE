import { createPerformanceProfiler } from '../source/utils/performance-profiler.js'
import { createPerformanceHud } from '../source/dom/performance-hud.js'
import { hasEnabledFaceFeatures } from '../packages/photosynth/src/visual/2d.face-features.js'

describe('Performance profiler', () => {
	test('tracks rolling FPS, percentiles, video cadence, phases and bottleneck diagnosis', () => {
		let now = 0
		const profiler = createPerformanceProfiler({
			now: () => now,
			heap: () => ({ usedMB: 64.2, totalMB: 96, limitMB: 4096 }),
			observeLongTasks: false,
			windowSize: 32,
		})

		profiler.updateMetadata({
			displayType: 'DISPLAY_WEB_GPU_3D',
			canvasWidth: 800,
			canvasHeight: 450,
			videoWidth: 1920,
			videoHeight: 1080,
			inferenceWidth: 640,
			inferenceHeight: 360,
		})

		// Simulate 20 smooth ~16.6ms frames with 30fps camera updates
		for (let i = 0; i < 20; i++) {
			now += 16.6
			const camTime = Math.floor(i / 2) * 0.033
			profiler.beginFrame(camTime)
			if (i % 2 === 0) {
				profiler.recordPhase('inference', 5.2)
				profiler.recordPhase('faceCalc', 0.4)
			}
			profiler.recordPhase('personUpdate', 0.8)
			profiler.recordPhase('overlay', 1.1)
			profiler.recordPhase('displayRender', 1.5)
			now += 4.5
			profiler.endFrame()
		}

		const summary = profiler.getSummary()
		expect(summary.frames).toBe(19)
		expect(summary.fps).toBeGreaterThan(40)
		expect(summary.videoFps).toBeGreaterThan(15)
		expect(summary.phases.inference.avg).toBeGreaterThan(2)
		expect(summary.phases.displayRender.avg).toBeCloseTo(1.5, 1)
		expect(summary.heap.usedMB).toBeCloseTo(64.2, 1)
		expect(summary.metadata.inferenceWidth).toBe(640)
		expect(summary.metadata.displayType).toBe('DISPLAY_WEB_GPU_3D')
	})

	test('diagnoses DOM/style/GPU main-thread stalls outside JS loop', () => {
		let now = 0
		const profiler = createPerformanceProfiler({
			now: () => now,
			heap: () => null,
			observeLongTasks: false,
		})

		// 80ms frame deltas with only 3ms of JS work => DOM/style/GPU sync bottleneck
		for (let i = 0; i < 12; i++) {
			now += 80
			profiler.beginFrame(i * 0.08)
			profiler.recordPhase('displayRender', 2)
			now += 3
			profiler.endFrame()
		}

		const summary = profiler.getSummary()
		expect(summary.fps).toBeLessThan(15)
		expect(summary.bottleneck.id).toBe('browser-main-thread')
		expect(summary.bottleneck.severity).toBe('bad')
		expect(summary.dropped.over50).toBe(11)
	})

	test('records timed capture samples and produces JSON report', async () => {
		let now = 100
		const profiler = createPerformanceProfiler({
			now: () => now,
			heap: () => null,
			observeLongTasks: false,
		})

		const capturePromise = profiler.startCapture(500)
		for (let i = 0; i < 35; i++) {
			now += 20
			profiler.beginFrame(i * 0.02)
			profiler.recordPhase('inference', 4)
			now += 5
			profiler.endFrame()
		}

		const report = await capturePromise
		expect(report.generatedAt).toBeTruthy()
		expect(report.capture.sampleCount).toBeGreaterThanOrEqual(18)
		expect(report.capture.samples[0]).toEqual(expect.objectContaining({
			dt: expect.any(Number),
			inf: 4,
		}))
	})

	test('HUD mounts outside #control-panel, renders metrics and toggles cleanly', () => {
		document.body.innerHTML = '<menu id="control-panel"></menu>'
		let now = 0
		const profiler = createPerformanceProfiler({ now: () => now, heap: () => null, observeLongTasks: false })
		const onClose = jest.fn()
		const hud = createPerformanceHud(profiler, { doc: document, onClose })

		expect(hud.isVisible()).toBe(false)
		hud.show()
		expect(hud.isVisible()).toBe(true)

		const el = document.getElementById('realtime-statistics')
		expect(el).toBeTruthy()
		expect(el.hidden).toBe(false)
		expect(document.getElementById('control-panel').contains(el)).toBe(false)

		now += 16.6
		profiler.beginFrame(0.01)
		now += 16.6
		profiler.beginFrame(0.02)
		profiler.recordPhase('inference', 6)
		now += 8
		profiler.endFrame()
		hud.render()

		expect(el.querySelector('.perf-hud-canvas')).toBeTruthy()
		expect(hud.getLastSummary().fps).toBeGreaterThan(0)
		el.querySelector('[data-perf-action="close"]').click()
		expect(hud.isVisible()).toBe(false)
		expect(onClose).toHaveBeenCalledTimes(1)
		hud.destroy()
	})
})

describe('Face feature short-circuit', () => {
	test('returns false when eyes, eyebrows and lips are all disabled', () => {
		expect(hasEnabledFaceFeatures({ drawEyes: false, drawEyebrows: false, lipStyle: 'disabled' }, {})).toBe(false)
		expect(hasEnabledFaceFeatures({}, {})).toBe(false)
		expect(hasEnabledFaceFeatures({ drawEyes: true }, {})).toBe(true)
		expect(hasEnabledFaceFeatures({ lipStyle: 'red' }, {})).toBe(true)
		expect(hasEnabledFaceFeatures({}, { drawEyebrows: true })).toBe(true)
	})
})
