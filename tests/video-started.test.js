import { observeVideoStarted } from '../source/hardware/video-started.js'
import { EVENT_VIDEO_STARTED } from '../source/interface-event.js'

test('emits a bubbling event only after the first frame, once per source', () => {
	const video = document.createElement('video')
	document.body.append(video)
	const callbacks = []
	video.requestVideoFrameCallback = jest.fn(callback => callbacks.push(callback))
	video.cancelVideoFrameCallback = jest.fn()
	const listener = jest.fn()
	document.body.addEventListener(EVENT_VIDEO_STARTED, listener)
	const dispose = observeVideoStarted(video)
	video.dispatchEvent(new Event('playing'))
	expect(listener).not.toHaveBeenCalled()
	const metadata = { presentedFrames: 1 }
	callbacks[0](100, metadata)
	callbacks[0](110, metadata)
	expect(listener).toHaveBeenCalledTimes(1)
	expect(listener.mock.calls[0][0].details).toEqual({ video, now: 100, metadata })
	video.dispatchEvent(new Event('loadstart'))
	callbacks[0](120, metadata)
	expect(listener).toHaveBeenCalledTimes(1)
	callbacks[1](130, metadata)
	expect(listener).toHaveBeenCalledTimes(2)
	video.dispatchEvent(new Event('emptied'))
	dispose()
	callbacks[2](140, metadata)
	expect(listener).toHaveBeenCalledTimes(2)
	expect(video.cancelVideoFrameCallback).toHaveBeenCalled()
	document.body.removeEventListener(EVENT_VIDEO_STARTED, listener)
	video.remove()
})

test('falls back to playing with decoded video dimensions', () => {
	const video = document.createElement('video')
	Object.defineProperties(video, { readyState: { value: 2 }, videoWidth: { value: 640 } })
	const listener = jest.fn()
	video.addEventListener(EVENT_VIDEO_STARTED, listener)
	const dispose = observeVideoStarted(video)
	video.dispatchEvent(new Event('playing'))
	video.dispatchEvent(new Event('playing'))
	expect(listener).toHaveBeenCalledTimes(1)
	dispose()
})
