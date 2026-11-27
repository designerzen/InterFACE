const DEFAULT_WINDOW_SIZE = 120
const DEFAULT_CAPTURE_MS = 5000
const PHASES = ['inference', 'faceCalc', 'personUpdate', 'visualiser', 'overlay', 'displayRender']

const percentile = (sorted, p) => {
	if (!sorted.length) return 0
	const index = Math.min(sorted.length - 1, Math.max(0, Math.floor(sorted.length * p)))
	return sorted[index]
}

const round = (value, digits = 2) => {
	if (!Number.isFinite(value)) return 0
	const factor = 10 ** digits
	return Math.round(value * factor) / factor
}

/**
 * Lightweight, low-allocation real-time performance profiler for PhotoSYNTH.
 * Collects frame timings, video cadence, per-phase breakdowns, dropped frames,
 * long tasks, stalls, audio clock lag, memory usage, and bottleneck hints.
 */
export const createPerformanceProfiler = ({
	now = () => performance.now(),
	heap = () => performance.memory ? {
		usedMB: performance.memory.usedJSHeapSize / 1048576,
		totalMB: performance.memory.totalJSHeapSize / 1048576,
		limitMB: performance.memory.jsHeapSizeLimit / 1048576,
	} : null,
	windowSize = DEFAULT_WINDOW_SIZE,
	targetFps = 60,
	frameStallMonitor = null,
	observeLongTasks = typeof PerformanceObserver === 'function',
} = {}) => {
	const size = Math.max(16, Math.floor(windowSize))
	const frameDeltas = new Float64Array(size)
	const workTotals = new Float64Array(size)
	const videoAdvanced = new Uint8Array(size)
	const phaseBuffers = Object.fromEntries(PHASES.map(phase => [phase, new Float64Array(size)]))
	const currentPhases = Object.fromEntries(PHASES.map(phase => [phase, 0]))

	let cursor = 0
	let count = 0
	let totalFrames = 0
	let totalDropped20 = 0
	let totalDropped33 = 0
	let totalDropped50 = 0
	let lastFrameAt = null
	let lastCameraTime = null
	let activeFrameStart = null
	let activeFrameCameraAdvanced = false
	let enabled = false

	let longTaskCount = 0
	let longTaskMaxMs = 0
	let longTaskTotalMs = 0
	let longTaskObserver = null

	const metadata = {
		displayType: 'unknown',
		canvasWidth: 0,
		canvasHeight: 0,
		overlayWidth: 0,
		overlayHeight: 0,
		videoWidth: 0,
		videoHeight: 0,
		inferenceWidth: 0,
		inferenceHeight: 0,
		activePlayers: 0,
		audioLagMs: 0,
		audioDriftMs: 0,
		audioState: 'unknown',
		audioSampleRate: 0,
		audioBaseLatencyMs: 0,
		dpr: typeof globalThis.devicePixelRatio === 'number' ? globalThis.devicePixelRatio : 1,
		isElectron: Boolean(globalThis.electron),
		platform: globalThis.electron?.runtime?.platform || globalThis.navigator?.platform || 'unknown',
	}

	let capture = null
	let lastDomSampleAt = -Infinity
	let cachedDomNodes = null

	const ensureLongTaskObserver = () => {
		if (!observeLongTasks || longTaskObserver) return
		try {
			const supported = PerformanceObserver.supportedEntryTypes
			if (Array.isArray(supported) && !supported.includes('longtask')) return
			longTaskObserver = new PerformanceObserver(list => {
				for (const entry of list.getEntries()) {
					longTaskCount++
					longTaskTotalMs += entry.duration
					if (entry.duration > longTaskMaxMs) longTaskMaxMs = entry.duration
				}
			})
			longTaskObserver.observe({ entryTypes: ['longtask'] })
		} catch {
			longTaskObserver = null
		}
	}

	const disconnectLongTaskObserver = () => {
		if (!longTaskObserver) return
		try { longTaskObserver.disconnect() } catch {}
		longTaskObserver = null
	}

	const reset = () => {
		cursor = 0
		count = 0
		totalFrames = 0
		totalDropped20 = 0
		totalDropped33 = 0
		totalDropped50 = 0
		lastFrameAt = null
		lastCameraTime = null
		activeFrameStart = null
		activeFrameCameraAdvanced = false
		longTaskCount = 0
		longTaskMaxMs = 0
		longTaskTotalMs = 0
		for (const phase of PHASES) currentPhases[phase] = 0
	}

	const setEnabled = next => {
		enabled = Boolean(next)
		if (enabled) ensureLongTaskObserver()
		else if (!capture) disconnectLongTaskObserver()
		return enabled
	}

	const updateMetadata = patch => {
		if (!patch) return
		for (const key of Object.keys(patch)) {
			if (patch[key] !== undefined && Object.hasOwn(metadata, key)) {
				metadata[key] = patch[key]
			}
		}
	}

	const recordAudioTiming = ({ lag = 0, drift = 0 } = {}) => {
		if (Number.isFinite(lag)) metadata.audioLagMs = lag
		if (Number.isFinite(drift)) metadata.audioDriftMs = drift
	}

	const beginFrame = (cameraTime = null) => {
		const at = now()
		activeFrameStart = at
		for (const phase of PHASES) currentPhases[phase] = 0

		const cameraChanged = cameraTime !== null && cameraTime !== undefined && cameraTime !== lastCameraTime
		activeFrameCameraAdvanced = cameraChanged
		if (cameraTime !== null && cameraTime !== undefined) lastCameraTime = cameraTime

		if (lastFrameAt === null) {
			lastFrameAt = at
			return 0
		}

		const delta = at - lastFrameAt
		lastFrameAt = at

		// Ignore tab-switch pauses (> 2s) from rolling frame stats.
		if (delta <= 0 || delta > 2000) {
			return delta
		}

		frameDeltas[cursor] = delta
		videoAdvanced[cursor] = cameraChanged ? 1 : 0
		return delta
	}

	const recordPhase = (name, durationMs) => {
		if (!Number.isFinite(durationMs) || durationMs < 0) return
		if (Object.hasOwn(currentPhases, name)) {
			currentPhases[name] += durationMs
		}
	}

	const endFrame = () => {
		if (activeFrameStart === null) return
		const at = now()
		const totalWork = Math.max(0, at - activeFrameStart)
		activeFrameStart = null

		const delta = frameDeltas[cursor]
		if (delta > 0 && delta <= 2000) {
			workTotals[cursor] = totalWork
			for (const phase of PHASES) {
				phaseBuffers[phase][cursor] = currentPhases[phase]
			}

			totalFrames++
			if (delta > 20) totalDropped20++
			if (delta > 33.33) totalDropped33++
			if (delta > 50) totalDropped50++

			if (capture) {
				capture.samples.push({
					t: round(at - capture.startedAt, 2),
					dt: round(delta, 2),
					work: round(totalWork, 2),
					cam: activeFrameCameraAdvanced ? 1 : 0,
					inf: round(currentPhases.inference, 2),
					calc: round(currentPhases.faceCalc, 2),
					per: round(currentPhases.personUpdate, 2),
					viz: round(currentPhases.visualiser, 2),
					ovl: round(currentPhases.overlay, 2),
					ren: round(currentPhases.displayRender, 2),
				})
				if (at >= capture.endsAt) {
					const finished = finishCapture()
					capture = null
					finished.resolve(finished.report)
				}
			}

			cursor = (cursor + 1) % size
			if (count < size) count++
		}
	}

	const computeSummary = (includeDomCount = false) => {
		const n = count
		if (n === 0) {
			return {
				frames: 0,
				totalFrames,
				fps: 0,
				videoFps: 0,
				targetFps,
				frameMs: { avg: 0, p50: 0, p95: 0, max: 0 },
				workMs: { avg: 0, p95: 0, max: 0 },
				otherMs: 0,
				dropped: { over20: 0, over33: 0, over50: 0, ratio: 0 },
				phases: Object.fromEntries(PHASES.map(phase => [phase, { avg: 0, max: 0, pct: 0 }])),
				longTasks: { count: longTaskCount, maxMs: round(longTaskMaxMs, 1), totalMs: round(longTaskTotalMs, 1) },
				stalls: frameStallMonitor ? frameStallMonitor.stalls.length : 0,
				heap: heap(),
				domNodes: cachedDomNodes,
				metadata: { ...metadata },
				bottleneck: { id: 'warming-up', label: 'Warming up…', severity: 'ok', detail: '' },
				capturing: Boolean(capture),
			}
		}

		const sortedDeltas = new Array(n)
		const sortedWork = new Array(n)
		let sumDelta = 0
		let sumWork = 0
		let videoFrames = 0
		let dropped20 = 0
		let dropped33 = 0
		let dropped50 = 0

		for (let i = 0; i < n; i++) {
			const d = frameDeltas[i]
			const w = workTotals[i]
			sortedDeltas[i] = d
			sortedWork[i] = w
			sumDelta += d
			sumWork += w
			videoFrames += videoAdvanced[i]
			if (d > 20) dropped20++
			if (d > 33.33) dropped33++
			if (d > 50) dropped50++
		}

		sortedDeltas.sort((a, b) => a - b)
		sortedWork.sort((a, b) => a - b)

		const avgDelta = sumDelta / n
		const avgWork = sumWork / n
		const fps = avgDelta > 0 ? 1000 / avgDelta : 0
		const videoFps = sumDelta > 0 ? (videoFrames * 1000) / sumDelta : 0

		const phases = {}
		let attributedWork = 0
		for (const phase of PHASES) {
			const buf = phaseBuffers[phase]
			let sum = 0
			let max = 0
			for (let i = 0; i < n; i++) {
				const v = buf[i]
				sum += v
				if (v > max) max = v
			}
			const avg = sum / n
			attributedWork += avg
			phases[phase] = {
				avg: round(avg, 2),
				max: round(max, 2),
				pct: avgDelta > 0 ? round((avg / avgDelta) * 100, 1) : 0,
			}
		}

		const otherMs = Math.max(0, avgDelta - attributedWork)
		const stallsList = frameStallMonitor ? frameStallMonitor.stalls : []
		const heapStats = heap()

		if (includeDomCount && typeof globalThis.document?.getElementsByTagName === 'function') {
			const t = now()
			if (t - lastDomSampleAt >= 2000) {
				lastDomSampleAt = t
				cachedDomNodes = globalThis.document.getElementsByTagName('*').length
			}
		}

		const p95Delta = percentile(sortedDeltas, 0.95)
		const bottleneck = diagnoseBottleneck({
			fps,
			targetFps,
			avgDelta,
			p95Delta,
			avgWork,
			otherMs,
			phases,
			audioLagMs: metadata.audioLagMs,
			longTaskMaxMs,
		})

		return {
			frames: n,
			totalFrames,
			fps: round(fps, 1),
			videoFps: round(videoFps, 1),
			targetFps,
			frameMs: {
				avg: round(avgDelta, 2),
				p50: round(percentile(sortedDeltas, 0.5), 2),
				p95: round(p95Delta, 2),
				max: round(sortedDeltas[n - 1], 2),
			},
			workMs: {
				avg: round(avgWork, 2),
				p95: round(percentile(sortedWork, 0.95), 2),
				max: round(sortedWork[n - 1], 2),
			},
			otherMs: round(otherMs, 2),
			dropped: {
				over20: dropped20,
				over33: dropped33,
				over50: dropped50,
				ratio: round(dropped20 / n, 3),
				totalOver20: totalDropped20,
				totalOver33: totalDropped33,
				totalOver50: totalDropped50,
			},
			phases,
			longTasks: {
				count: longTaskCount,
				maxMs: round(longTaskMaxMs, 1),
				totalMs: round(longTaskTotalMs, 1),
			},
			stalls: stallsList.length,
			heap: heapStats ? {
				usedMB: round(heapStats.usedMB, 1),
				totalMB: round(heapStats.totalMB, 1),
				limitMB: round(heapStats.limitMB, 1),
			} : null,
			domNodes: cachedDomNodes,
			metadata: { ...metadata },
			bottleneck,
			capturing: Boolean(capture),
		}
	}

	const getRecentFrameDeltas = () => {
		const out = new Array(count)
		const start = count < size ? 0 : cursor
		for (let i = 0; i < count; i++) {
			out[i] = frameDeltas[(start + i) % size]
		}
		return out
	}

	const getReport = () => ({
		generatedAt: new Date().toISOString(),
		summary: computeSummary(true),
		stalls: frameStallMonitor ? frameStallMonitor.stalls : [],
		recentFrameMs: getRecentFrameDeltas().map(v => round(v, 2)),
	})

	const finishCapture = () => {
		const active = capture
		const report = {
			...getReport(),
			capture: {
				durationMs: round(now() - active.startedAt, 1),
				sampleCount: active.samples.length,
				samples: active.samples,
			},
		}
		if (!enabled) disconnectLongTaskObserver()
		return { report, resolve: active.resolve }
	}

	const startCapture = (durationMs = DEFAULT_CAPTURE_MS) => {
		if (capture) return capture.promise
		ensureLongTaskObserver()
		const duration = Math.max(500, Math.min(60000, Number(durationMs) || DEFAULT_CAPTURE_MS))
		const startedAt = now()
		let resolvePromise
		const promise = new Promise(resolve => { resolvePromise = resolve })
		capture = {
			startedAt,
			endsAt: startedAt + duration,
			samples: [],
			resolve: resolvePromise,
			promise,
		}
		return promise
	}

	const stopCapture = () => {
		if (!capture) return null
		const finished = finishCapture()
		capture = null
		finished.resolve(finished.report)
		return finished.report
	}

	return {
		get enabled() { return enabled },
		setEnabled,
		reset,
		updateMetadata,
		recordAudioTiming,
		beginFrame,
		recordPhase,
		endFrame,
		getSummary: (includeDom = false) => computeSummary(includeDom),
		getRecentFrameDeltas,
		getReport,
		startCapture,
		stopCapture,
		destroy: () => {
			stopCapture()
			disconnectLongTaskObserver()
		},
	}
}

const diagnoseBottleneck = ({ fps, targetFps, avgDelta, p95Delta, avgWork, otherMs, phases, audioLagMs }) => {
	const budgetMs = 1000 / Math.max(1, targetFps)
	if (fps >= targetFps * 0.9 && p95Delta <= budgetMs * 1.45) {
		return {
			id: 'smooth',
			label: 'Smooth',
			severity: 'ok',
			detail: `${round(fps, 0)} fps · ${round(avgWork, 1)} ms JS/frame`,
		}
	}

	const candidates = [
		{ id: 'inference', label: 'ML Inference', ms: phases.inference.avg, detail: 'FaceLandmarker / GPU readback' },
		{ id: 'displayRender', label: 'Display Render', ms: phases.displayRender.avg, detail: 'WebGPU / WebGL / 2D draw' },
		{ id: 'overlay', label: '2D Overlay', ms: phases.overlay.avg, detail: 'Text, emoji & beat HUD' },
		{ id: 'visualiser', label: 'Audio Visualiser', ms: phases.visualiser.avg, detail: 'FFT / MTV / Butterchurn' },
		{ id: 'faceCalc', label: 'Face Math', ms: phases.faceCalc.avg, detail: 'Blendshapes & expression math' },
		{ id: 'personUpdate', label: 'Player / Audio', ms: phases.personUpdate.avg, detail: 'Person update & note triggers' },
	].sort((a, b) => b.ms - a.ms)

	const top = candidates[0]
	const severity = fps < 25 || p95Delta > 50 ? 'bad' : 'warn'

	// If unattributed main-thread / compositor / style-recalc time exceeds every JS phase
	if (otherMs > Math.max(12, top.ms * 1.25) && avgDelta > budgetMs * 1.35) {
		return {
			id: 'browser-main-thread',
			label: 'DOM / Style / GPU Sync',
			severity,
			detail: `${round(otherMs, 1)} ms outside JS loop (style recalc, layout or GPU sync)`,
		}
	}

	if (top && top.ms >= 4) {
		return {
			id: top.id,
			label: top.label,
			severity,
			detail: `${round(top.ms, 1)} ms/frame avg (${top.detail})`,
		}
	}

	if (audioLagMs > 25) {
		return {
			id: 'audio-lag',
			label: 'Audio Clock Lag',
			severity,
			detail: `${round(audioLagMs, 1)} ms timer lag`,
		}
	}

	return {
		id: 'vsync-limited',
		label: 'Frame Pacing',
		severity: 'warn',
		detail: `p95 ${round(p95Delta, 1)} ms`,
	}
}
