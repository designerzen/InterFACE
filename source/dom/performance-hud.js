const HUD_WIDTH = 264
const HUD_HEIGHT = 228
const UPDATE_INTERVAL_MS = 250

const PHASE_ROWS = [
	['inference', 'Infer', '#ff6b6b'],
	['faceCalc', 'Calc', '#f59f00'],
	['personUpdate', 'Track', '#ffd43b'],
	['visualiser', 'Viz', '#51cf66'],
	['overlay', 'Overlay', '#339af0'],
	['displayRender', 'Render', '#cc5de8'],
	['other', 'DOM/GPU', '#868e96'],
]

const SEVERITY_COLORS = {
	ok: { bg: 'rgba(81, 207, 102, 0.22)', fg: '#8ce99a' },
	warn: { bg: 'rgba(255, 212, 59, 0.22)', fg: '#ffe066' },
	bad: { bg: 'rgba(255, 107, 107, 0.26)', fg: '#ffa8a8' },
}

const downloadJson = (data, filename) => {
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = filename
	document.body.appendChild(link)
	link.click()
	link.remove()
	setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Floating, zero-DOM-mutation-per-tick performance diagnostics HUD that works
 * across every display renderer (WebGPU, WebGL, Canvas 2D, Babylon, Three,
 * Looking Glass). All live telemetry draws to a single HiDPI canvas so updating
 * at 4 Hz never triggers Blink style recalculation or document MutationObservers.
 */
export const createPerformanceHud = (profiler, { doc = globalThis.document, onClose } = {}) => {
	if (!profiler || !doc?.body) {
		return {
			show: () => {},
			hide: () => {},
			toggle: () => false,
			render: () => {},
			isVisible: () => false,
			destroy: () => {},
		}
	}

	let root = null
	let timer = null
	let visible = false
	let canvas = null
	let ctx = null
	let captureBtn = null
	let copyBtn = null
	let lastSummary = null

	const build = () => {
		if (root) return root
		root = doc.createElement('aside')
		root.id = 'realtime-statistics'
		root.className = 'statistics photosynth-perf-hud'
		root.setAttribute('aria-label', 'Performance diagnostics')
		root.hidden = true

		canvas = doc.createElement('canvas')
		canvas.className = 'perf-hud-canvas'
		const dpr = Math.min(2, globalThis.devicePixelRatio || 1)
		canvas.width = Math.round(HUD_WIDTH * dpr)
		canvas.height = Math.round(HUD_HEIGHT * dpr)
		canvas.style.width = `${HUD_WIDTH}px`
		canvas.style.height = `${HUD_HEIGHT}px`
		try {
			ctx = canvas.getContext('2d')
			ctx?.scale?.(dpr, dpr)
		} catch {
			ctx = null
		}

		const actions = doc.createElement('div')
		actions.className = 'perf-hud-actions'
		actions.innerHTML = `
			<button type="button" data-perf-action="capture">Record 5s</button>
			<button type="button" data-perf-action="copy">Copy JSON</button>
			<button type="button" data-perf-action="reset">Reset</button>
			<button type="button" data-perf-action="close" aria-label="Hide performance HUD">Hide</button>
		`

		captureBtn = actions.querySelector('[data-perf-action="capture"]')
		copyBtn = actions.querySelector('[data-perf-action="copy"]')

		root.append(canvas, actions)

		root.addEventListener('click', async event => {
			const btn = event.target.closest('[data-perf-action]')
			if (!btn) return
			const action = btn.dataset.perfAction
			if (action === 'close') {
				hide()
				onClose?.()
			} else if (action === 'reset') {
				profiler.reset()
				render()
			} else if (action === 'copy') {
				const report = profiler.getReport()
				const text = JSON.stringify(report, null, 2)
				try {
					await navigator.clipboard?.writeText(text)
					if (copyBtn) {
						copyBtn.textContent = 'Copied!'
						setTimeout(() => { if (copyBtn) copyBtn.textContent = 'Copy JSON' }, 1200)
					}
				} catch {
					downloadJson(report, `photosynth-profile-${Date.now()}.json`)
				}
			} else if (action === 'capture') {
				if (captureBtn) {
					captureBtn.textContent = 'Recording…'
					captureBtn.disabled = true
				}
				try {
					const report = await profiler.startCapture(5000)
					downloadJson(report, `photosynth-capture-${Date.now()}.json`)
				} finally {
					if (captureBtn) {
						captureBtn.disabled = false
						captureBtn.textContent = 'Record 5s'
					}
				}
			}
		})

		doc.body.appendChild(root)
		return root
	}

	const drawCanvas = (summary, deltas) => {
		if (!ctx) return
		const w = HUD_WIDTH
		const h = HUD_HEIGHT
		const pad = 8
		const mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

		ctx.clearRect(0, 0, w, h)

		// Header: FPS + Bottleneck badge
		const fpsText = summary.frames ? summary.fps.toFixed(1) : '--'
		ctx.textBaseline = 'top'
		ctx.textAlign = 'left'
		ctx.fillStyle = '#ffffff'
		ctx.font = `700 18px ${mono}`
		ctx.fillText(fpsText, pad, 6)
		const fpsW = ctx.measureText(fpsText).width
		ctx.fillStyle = '#adb5bd'
		ctx.font = `600 10px ${mono}`
		ctx.fillText('FPS', pad + fpsW + 4, 13)

		// Bottleneck pill on right
		const badge = summary.bottleneck
		const colors = SEVERITY_COLORS[badge.severity] || SEVERITY_COLORS.ok
		ctx.font = `700 9.5px ${mono}`
		const labelW = ctx.measureText(badge.label).width
		const pillW = Math.min(132, labelW + 12)
		const pillX = w - pad - pillW
		ctx.fillStyle = colors.bg
		ctx.beginPath()
		ctx.roundRect?.(pillX, 7, pillW, 17, 8)
		if (!ctx.roundRect) ctx.rect(pillX, 7, pillW, 17)
		ctx.fill()
		ctx.fillStyle = colors.fg
		ctx.textAlign = 'center'
		ctx.fillText(badge.label, pillX + pillW / 2, 11, pillW - 6)

		// Frame avg subtitle
		ctx.textAlign = 'left'
		ctx.fillStyle = '#adb5bd'
		ctx.font = `400 10px ${mono}`
		ctx.fillText(`${summary.frameMs.avg.toFixed(1)} ms avg · ${summary.workMs.avg.toFixed(1)} ms JS`, pad, 27)

		// Sparkline box
		const spX = pad
		const spY = 42
		const spW = w - pad * 2
		const spH = 34
		ctx.fillStyle = 'rgba(0, 0, 0, 0.38)'
		ctx.fillRect(spX, spY, spW, spH)

		const maxScale = 66.7
		const y60 = spY + spH - (16.67 / maxScale) * spH
		const y30 = spY + spH - (33.33 / maxScale) * spH
		ctx.fillStyle = 'rgba(81, 207, 102, 0.38)'
		ctx.fillRect(spX, Math.round(y60), spW, 1)
		ctx.fillStyle = 'rgba(255, 212, 59, 0.38)'
		ctx.fillRect(spX, Math.round(y30), spW, 1)

		if (deltas.length) {
			const step = spW / Math.max(1, deltas.length)
			for (let i = 0; i < deltas.length; i++) {
				const ms = deltas[i]
				const barH = Math.min(spH, Math.max(1, (ms / maxScale) * spH))
				ctx.fillStyle = ms <= 20 ? '#51cf66' : ms <= 33.33 ? '#ffd43b' : '#ff6b6b'
				ctx.fillRect(spX + i * step, spY + spH - barH, Math.max(1, step - 0.5), barH)
			}
		}

		// 2x3 compact metrics grid
		const meta = summary.metadata
		const infRes = meta.inferenceWidth && meta.inferenceHeight ? `→${meta.inferenceWidth}×${meta.inferenceHeight}` : ''
		const shortDisplay = String(meta.displayType || '').replace(/^Display/, '').replace(/^DISPLAY_/, '').replace(/_/g, ' ')
		const heapStr = summary.heap ? `${summary.heap.usedMB.toFixed(0)}MB` : 'n/a'
		const domStr = summary.domNodes != null ? ` · ${summary.domNodes} DOM` : ''
		const cells = [
			['VIDEO', `${summary.videoFps.toFixed(0)}fps ${meta.videoWidth}×${meta.videoHeight}${infRes}`],
			['P95 / MAX', `${summary.frameMs.p95.toFixed(1)} / ${summary.frameMs.max.toFixed(0)} ms`],
			['DROPS >20MS', `${(summary.dropped.ratio * 100).toFixed(0)}% (${summary.dropped.over33} >33ms)`],
			['HEAP / DOM', `${heapStr}${domStr}`],
			['DISPLAY', `${shortDisplay} ${meta.canvasWidth}×${meta.canvasHeight}`],
			['AUDIO / LT', `lag ${meta.audioLagMs.toFixed(1)}ms · LT ${summary.longTasks.count}`],
		]

		const colW = (w - pad * 2 - 6) / 2
		for (let i = 0; i < cells.length; i++) {
			const col = i % 2
			const row = Math.floor(i / 2)
			const cx = pad + col * (colW + 6)
			const cy = 81 + row * 21
			ctx.fillStyle = '#868e96'
			ctx.font = `600 8px ${mono}`
			ctx.fillText(cells[i][0], cx, cy)
			ctx.fillStyle = '#e9ecef'
			ctx.font = `600 10px ${mono}`
			ctx.fillText(cells[i][1], cx, cy + 9, colW)
		}

		// Per-phase bars
		const scaleMax = Math.max(16.67, summary.frameMs.avg)
		const barStartX = pad + 48
		const barMaxW = w - pad * 2 - 48 - 42
		for (let i = 0; i < PHASE_ROWS.length; i++) {
			const [key, label, colour] = PHASE_ROWS[i]
			const ms = key === 'other' ? summary.otherMs : (summary.phases[key]?.avg ?? 0)
			const ry = 146 + i * 10
			ctx.textAlign = 'left'
			ctx.fillStyle = '#ced4da'
			ctx.font = `400 9.5px ${mono}`
			ctx.fillText(label, pad, ry)

			ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
			ctx.fillRect(barStartX, ry + 2, barMaxW, 5)
			const fillW = Math.min(barMaxW, Math.max(0, (ms / scaleMax) * barMaxW))
			if (fillW > 0.5) {
				ctx.fillStyle = colour
				ctx.fillRect(barStartX, ry + 2, fillW, 5)
			}

			ctx.textAlign = 'right'
			ctx.fillStyle = '#dee2e6'
			ctx.fillText(`${ms.toFixed(1)}ms`, w - pad, ry)
		}

		// Footer hint
		ctx.textAlign = 'left'
		ctx.fillStyle = '#adb5bd'
		ctx.font = `400 9px ${mono}`
		ctx.fillText(badge.detail || '', pad, 217, w - pad * 2)
	}

	const render = () => {
		if (!visible) return
		const summary = profiler.getSummary(true)
		lastSummary = summary
		drawCanvas(summary, profiler.getRecentFrameDeltas())
	}

	const show = () => {
		build()
		if (visible) return
		visible = true
		profiler.setEnabled(true)
		root.hidden = false
		render()
		timer = setInterval(render, UPDATE_INTERVAL_MS)
	}

	const hide = () => {
		if (!visible) return
		visible = false
		profiler.setEnabled(false)
		if (timer) {
			clearInterval(timer)
			timer = null
		}
		if (root) root.hidden = true
	}

	const toggle = force => {
		const next = typeof force === 'boolean' ? force : !visible
		if (next) show()
		else hide()
		return visible
	}

	const destroy = () => {
		hide()
		root?.remove()
		root = null
		canvas = null
		ctx = null
		captureBtn = null
		copyBtn = null
		lastSummary = null
	}

	return {
		show,
		hide,
		toggle,
		render,
		getLastSummary: () => lastSummary,
		isVisible: () => visible,
		destroy,
	}
}
