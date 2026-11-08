import { createProceduralWallpaper, readCssPalette } from '../display/procedural-wallpaper.js'
import { EVENT_VIDEO_STARTED } from '../interface-event.js'
import { createBackgroundMotion } from '../display/background-motion.js'
import { getVisitCount } from './session-summary.js'

export const createProceduralBackground = ({ root = document.documentElement, app = document.getElementById('app'), visitCount = getVisitCount() } = {}) => {
	const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
	const scroll = createBackgroundMotion()
	const onPointer = event => {
		if (event.pointerType === 'touch') return
		scroll.point(event.clientX, event.clientY, window.innerWidth, window.innerHeight)
	}
	const resetPointer = () => scroll.reset()
	const cssPalette = () => readCssPalette?.(root) ?? {}
	let wallpaperState = { selection: false, size: 400, beginner: true, automated: false, visitCount, colors: cssPalette() }
	let renderer, canvas, frame = null, stopped = false, disposed = false, last = -Infinity
	let videoStarted = false
	let elapsed = 0, previous = null
	const release = () => {
		if (frame !== null) cancelAnimationFrame(frame)
		frame = null
		renderer?.dispose()
		renderer = null
		canvas?.remove()
		canvas = null
		previous = null
		last = -Infinity
	}
	const stop = () => {
		stopped = true
		root.classList.add('wallpaper-motion-stopped')
		release()
		window.removeEventListener('pointermove', onPointer)
		document.removeEventListener('pointerleave', resetPointer)
		window.removeEventListener('blur', resetPointer)
	}
	const draw = now => {
		frame = null
		if (stopped || disposed) return
		const delta = previous === null ? 0 : Math.min(100, now - previous)
		elapsed += delta
		const offset = scroll.step(delta)
		previous = now
		if (now - last >= 1000 / 30) {
			try { renderer.draw(elapsed, offset, wallpaperState) } catch (error) {
				console.error('Procedural wallpaper frame failed', error)
				stop()
				return
			}
			last = now
		}
		frame = requestAnimationFrame(draw)
	}
	const sensitive = () => app?.classList.contains('flag-photoSensitive') || new URLSearchParams(location.search).get('photoSensitive') === 'true'
	const update = () => {
		if (disposed) return
		if (root.classList.contains('a11y-reduce-motion')) { release(); return }
		if (document.hidden) { release(); return }
		// WebGL owns both wallpaper states; CSS remains responsible for UI contrast layers.
		const selection = root.classList.contains('player-selection')
		const loading = root.classList.contains('loading') && !selection
		const active = loading || selection
		if (root.classList.contains('procedural-background') !== active) root.classList.toggle('procedural-background', active)
		wallpaperState = {
			selection,
			size: root.classList.contains('quartet') ? 100 : root.classList.contains('trio') ? 200 : root.classList.contains('duet') ? 300 : 400,
			beginner: root.classList.contains('beginner'),
			automated: root.classList.contains('automated'),
			visitCount,
			colors: cssPalette()
		}
		if (sensitive() || motion.matches) stop()
		if (videoStarted && !selection) { release(); return }
		if (stopped) return
		if (!active) { release(); return }
		if (!renderer) {
			try {
				canvas = document.createElement('canvas')
				canvas.id = 'procedural-background'
				canvas.setAttribute('aria-hidden', 'true')
				document.body.append(canvas)
				renderer = createProceduralWallpaper(canvas, stop)
				canvas.addEventListener('click', () => renderer?.nextEffect?.())
			} catch (error) { console.error('Unable to start procedural wallpaper', error); stop(); return }
		}
		if (frame === null) frame = requestAnimationFrame(draw)
	}
	const observer = new MutationObserver(update)
	const dispose = () => {
		if (disposed) return
		disposed = true
		stop()
		observer.disconnect()
		motion.removeEventListener('change', update)
		document.removeEventListener('visibilitychange', update)
		app?.removeEventListener(EVENT_VIDEO_STARTED, onVideoStarted)
		window.removeEventListener('pagehide', dispose)
		root.classList.remove('procedural-background')
		root.classList.remove('wallpaper-motion-stopped')
	}
	observer.observe(root, { attributes: true, attributeFilter: ['class'] })
	if (app) observer.observe(app, { attributes: true, attributeFilter: ['class'] })
	motion.addEventListener('change', update)
	document.addEventListener('visibilitychange', update)
	const onVideoStarted = () => {
		videoStarted = true
		if (!root.classList.contains('player-selection')) release()
	}
	app?.addEventListener(EVENT_VIDEO_STARTED, onVideoStarted)
	window.addEventListener('pagehide', dispose)
	window.addEventListener('pointermove', onPointer, { passive: true })
	document.addEventListener('pointerleave', resetPointer)
	window.addEventListener('blur', resetPointer)
	update()
	return { dispose, stop }
}
