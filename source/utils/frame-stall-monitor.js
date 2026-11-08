// Keep numbers only: retaining predictions or DOM nodes here would distort a
// long-session memory investigation. Heap readings are Chromium-only and are
// evidence of a change, not proof that garbage collection caused a stall.
export const createFrameStallMonitor = ({
	now = () => performance.now(),
	heap = () => performance.memory?.usedJSHeapSize ?? null,
	visible = () => document.visibilityState !== 'hidden',
	onStall = sample => console.warn('PhotoSYNTH frame stall', sample),
	thresholdMs = 500,
	capacity = 32,
} = {}) => {
	const stalls = []
	let lastFrameAt = null, lastCameraTime = null, lastHeapAt = -Infinity
	let heapBytes = null, inferenceMs = 0, renderMs = 0
	return {
		get stalls() { return stalls.map(sample => ({ ...sample })) },
		reset() { lastFrameAt = lastCameraTime = null },
		phase(name, duration) {
			if (name === 'inference') inferenceMs = duration
			if (name === 'render') renderMs = duration
		},
		beginFrame(cameraTime) {
			const at = now()
			if (!visible()) {
				lastFrameAt = null
				lastCameraTime = null
				return
			}
			const gapMs = lastFrameAt === null ? 0 : at - lastFrameAt
			if (gapMs >= thresholdMs) {
				const currentHeap = heap()
				const sample = {
					at, gapMs, inferenceMs, renderMs,
					cameraAdvanced:cameraTime !== lastCameraTime,
					heapBeforeBytes:heapBytes, heapAfterBytes:currentHeap,
				}
				if (stalls.length >= capacity) stalls.shift()
				stalls.push(sample)
				onStall({ ...sample })
			}
			if (at - lastHeapAt >= 1000) {
				heapBytes = heap()
				lastHeapAt = at
			}
			lastFrameAt = at
			lastCameraTime = cameraTime
			inferenceMs = renderMs = 0
		},
	}
}
