/**
 * Replaces the camera with a looping video file so that the full application
 * can be exercised on machines without camera access.
 *
 * navigator.mediaDevices is patched rather than the app itself, so every camera
 * code path (enumeration, presets, saved cameras, the camera selector, device
 * changes, track stopping) runs exactly as it does with real hardware.
 *
 * The video is drawn onto a canvas and the canvas is captured, which keeps the
 * fake camera track alive when the source video is swapped for another file.
 *
 * Query string options (read once, before the app can rewrite the URL) :
 *   testVideo=url        video to use instead of the bundled clip
 *   testCameras=n        number of fake cameras to list (default 1)
 *   testControls=false   hide the floating source picker
 */
const DEFAULT_VIDEO = './video/photosynth.mp4'
const DEVICE_PREFIX = 'test-video-feed-'
const FRAME_RATE = 30

const params = new URLSearchParams(window.location.search)
const videoURL = params.get('testVideo') ?? DEFAULT_VIDEO
const cameraQuantity = Math.max(1, parseInt(params.get('testCameras') ?? '1', 10) || 1)
const showControls = params.get('testControls') !== 'false'

const video = document.createElement('video')
video.muted = true
video.loop = true
video.playsInline = true
video.crossOrigin = 'anonymous'

const canvas = document.createElement('canvas')
canvas.width = 640
canvas.height = 480
const context = canvas.getContext('2d')

let objectURL = null

// resolves once the first frame of the current source has been decoded
let ready
const setSource = source => {
	ready = new Promise((resolve, reject) => {
		video.addEventListener('loadeddata', resolve, { once: true })
		video.addEventListener('error', () => reject(new DOMException(`Test video could not be loaded : ${source}`, 'NotReadableError')), { once: true })
	})
	ready.catch(error => console.error('TestVideoFeed:', error))
	video.src = source
	video.play().catch(error => console.warn('TestVideoFeed: Autoplay prevented', error))
	return ready
}

const draw = () => {
	if (video.videoWidth > 0 && (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight)) {
		canvas.width = video.videoWidth
		canvas.height = video.videoHeight
	}
	if (video.readyState >= 2) {
		context.drawImage(video, 0, 0, canvas.width, canvas.height)
	}
}

// requestVideoFrameCallback keeps drawing in step with the video where available
if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
	const onFrame = () => {
		draw()
		video.requestVideoFrameCallback(onFrame)
	}
	video.requestVideoFrameCallback(onFrame)
} else {
	const onFrame = () => {
		draw()
		requestAnimationFrame(onFrame)
	}
	requestAnimationFrame(onFrame)
}

setSource(videoURL)

const fakeDevices = Array.from({ length: cameraQuantity }, (_, index) => ({
	deviceId: DEVICE_PREFIX + index,
	groupId: 'test-video-feed',
	kind: 'videoinput',
	label: cameraQuantity > 1 ? `Test Video Feed ${index + 1}` : 'Test Video Feed',
	toJSON() { return { deviceId: this.deviceId, groupId: this.groupId, kind: this.kind, label: this.label } }
}))

// insecure contexts have no mediaDevices at all, so build a stand-in
const mediaDevices = navigator.mediaDevices ?? Object.assign(new EventTarget(), { ondevicechange: null })
if (!navigator.mediaDevices) {
	Object.defineProperty(navigator, 'mediaDevices', { value: mediaDevices, configurable: true })
	mediaDevices.addEventListener('devicechange', event => mediaDevices.ondevicechange?.(event))
}

const originalGetUserMedia = mediaDevices.getUserMedia?.bind(mediaDevices)
const originalEnumerateDevices = mediaDevices.enumerateDevices?.bind(mediaDevices)

const getRequestedDeviceId = videoConstraints => {
	const deviceId = videoConstraints?.deviceId
	if (!deviceId) return undefined
	if (typeof deviceId === 'string') return deviceId
	return deviceId.exact ?? deviceId.ideal
}

mediaDevices.enumerateDevices = async () => {
	let devices = []
	try {
		devices = originalEnumerateDevices ? await originalEnumerateDevices() : []
	} catch (error) {
		console.warn('TestVideoFeed: Real devices could not be listed', error)
	}
	return [...devices.filter(device => device.kind !== 'videoinput'), ...fakeDevices]
}

mediaDevices.getUserMedia = async (constraints = {}) => {
	if (!constraints.video) {
		if (!originalGetUserMedia) throw new DOMException('getUserMedia is not available', 'NotSupportedError')
		return originalGetUserMedia(constraints)
	}

	const deviceId = getRequestedDeviceId(constraints.video)
	if (deviceId && !fakeDevices.some(device => device.deviceId === deviceId)) {
		throw new DOMException('Requested device not found', 'NotFoundError')
	}

	await ready
	draw()

	const stream = canvas.captureStream(FRAME_RATE)
	const [track] = stream.getVideoTracks()
	const device = fakeDevices.find(device => device.deviceId === deviceId) ?? fakeDevices[0]
	// captured tracks report the canvas, so make them look like the selected camera
	Object.defineProperty(track, 'label', { value: device.label })
	const getSettings = track.getSettings.bind(track)
	track.getSettings = () => ({ ...getSettings(), deviceId: device.deviceId, groupId: device.groupId, facingMode: 'user' })

	if (constraints.audio && originalGetUserMedia) {
		try {
			const audio = await originalGetUserMedia({ audio: constraints.audio })
			audio.getAudioTracks().forEach(audioTrack => stream.addTrack(audioTrack))
		} catch (error) {
			console.warn('TestVideoFeed: Microphone unavailable, continuing with video only', error)
		}
	}

	console.info('TestVideoFeed: Serving fake camera', { constraints, device, source: video.currentSrc })
	return stream
}

// capabilities.js checks for the legacy API to decide if a camera exists
if (!navigator.getUserMedia) {
	navigator.getUserMedia = (constraints, onSuccess, onError) => {
		mediaDevices.getUserMedia(constraints).then(onSuccess, onError)
	}
}

const swapSource = source => {
	if (objectURL) URL.revokeObjectURL(objectURL)
	objectURL = source instanceof File ? URL.createObjectURL(source) : null
	setSource(objectURL ?? source)
}

const addControls = () => {
	const panel = document.createElement('div')
	panel.id = 'test-video-feed'
	// inline so that no app stylesheet is touched
	panel.style.cssText = 'position:fixed;left:4px;bottom:4px;z-index:2147483647;display:flex;gap:4px;align-items:center;padding:4px;font:12px sans-serif;color:#fff;background:rgba(0,0,0,.6);border-radius:4px;'
	panel.innerHTML = `
		<label>Test feed <input type="file" accept="video/*"></label>
		<button type="button" data-action="pause">Pause</button>
		<button type="button" data-action="devicechange" title="Fire a devicechange event as if a camera was plugged in">Device change</button>
	`
	panel.querySelector('input').addEventListener('change', event => {
		const file = event.target.files?.[0]
		if (file) swapSource(file)
	})
	panel.querySelector('[data-action="pause"]').addEventListener('click', event => {
		if (video.paused) {
			video.play()
			event.target.textContent = 'Pause'
		} else {
			video.pause()
			event.target.textContent = 'Play'
		}
	})
	panel.querySelector('[data-action="devicechange"]').addEventListener('click', () => {
		mediaDevices.dispatchEvent(new Event('devicechange'))
	})
	document.body.appendChild(panel)
}

if (showControls) {
	if (document.body) addControls()
	else document.addEventListener('DOMContentLoaded', addControls, { once: true })
}

globalThis.testVideoFeed = { video, canvas, swapSource, devices: fakeDevices }
