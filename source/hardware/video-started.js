import InterfaceEvent, { EVENT_VIDEO_STARTED } from '../interface-event.js'

// One event per media load, after a frame reaches the compositor.
export const observeVideoStarted = video => {
	let frame = null
	let started = false
	let disposed = false
	let generation = 0
	const cancel = () => {
		if (frame !== null) video.cancelVideoFrameCallback?.(frame)
		frame = null
	}
	const notify = (now, metadata) => {
		if (disposed || started) return
		started = true
		frame = null
		video.dispatchEvent(new InterfaceEvent(EVENT_VIDEO_STARTED, { video, now, metadata }, false, true))
	}
	const arm = () => {
		cancel()
		started = false
		const current = ++generation
		if (video.requestVideoFrameCallback) {
			frame = video.requestVideoFrameCallback((now, metadata) => {
				if (current === generation) notify(now, metadata)
			})
		}
	}
	const onPlaying = () => {
		if (!video.requestVideoFrameCallback && video.readyState >= 2 && video.videoWidth > 0) {
			notify(performance.now(), null)
		}
	}
	video.addEventListener('loadstart', arm)
	video.addEventListener('emptied', arm)
	video.addEventListener('playing', onPlaying)
	arm()
	if (!video.paused) onPlaying()
	return () => {
		disposed = true
		cancel()
		video.removeEventListener('loadstart', arm)
		video.removeEventListener('emptied', arm)
		video.removeEventListener('playing', onPlaying)
	}
}
