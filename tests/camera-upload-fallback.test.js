import {
	classifyMediaFile,
	getScaledImageDimensions,
	isSupportedMediaFile,
	loadUploadedMediaSource,
	stopUploadedMediaSource,
} from '../source/hardware/media-source.js'
import { showCameraUploadDialog } from '../source/dom/camera-upload-dialog.js'
import { updateCapabalitiesTable } from '../source/dom/compatability.js'

const renderUploadDialogMarkup = () => {
	document.body.innerHTML = `<dialog id="camera-upload">
		<form method="dialog">
			<h5 id="camera-upload-title">No camera found</h5>
			<p id="camera-upload-description">Upload a video or image.</p>
			<label class="camera-upload-dropzone" for="camera-upload-input">
				<span class="camera-upload-dropzone-title">Drop a video or image here</span>
				<input id="camera-upload-input" class="sr-only" type="file" accept="video/*,image/*">
			</label>
			<p id="camera-upload-status" class="camera-upload-status" role="status" aria-live="polite" hidden></p>
			<menu>
				<li><button id="button-camera-upload-choose" type="button">Choose video or image</button></li>
				<li><button id="button-camera-upload-retry" type="button">Check for camera</button></li>
			</menu>
			<button class="close button-close" type="submit"></button>
		</form>
	</dialog>`
	return document.getElementById('camera-upload')
}

describe('media-source classification and sizing', () => {
	test('classifies video and image files by MIME type and extension fallback', () => {
		expect(classifyMediaFile({ name: 'clip.mp4', type: 'video/mp4' })).toBe('video')
		expect(classifyMediaFile({ name: 'clip.webm', type: '' })).toBe('video')
		expect(classifyMediaFile({ name: 'photo.png', type: 'image/png' })).toBe('image')
		expect(classifyMediaFile({ name: 'photo.webp', type: '' })).toBe('image')
		expect(classifyMediaFile({ name: 'song.mid', type: 'audio/midi' })).toBeNull()
		expect(isSupportedMediaFile({ name: 'face.jpg', type: 'image/jpeg' })).toBe(true)
		expect(isSupportedMediaFile({ name: 'notes.txt', type: 'text/plain' })).toBe(false)
	})

	test('scales oversized images while preserving aspect ratio and keeping small images intact', () => {
		expect(getScaledImageDimensions(640, 480, 1280)).toEqual({ width: 640, height: 480 })
		expect(getScaledImageDimensions(4000, 3000, 1280)).toEqual({ width: 1280, height: 960 })
		expect(getScaledImageDimensions(1500, 3000, 1280)).toEqual({ width: 640, height: 1280 })
	})
})

describe('loadUploadedMediaSource', () => {
	const originalCreateObjectURL = URL.createObjectURL
	const originalRevokeObjectURL = URL.revokeObjectURL
	const originalImage = global.Image

	beforeEach(() => {
		jest.useFakeTimers()
		URL.createObjectURL = jest.fn(() => 'blob:mock-media-url')
		URL.revokeObjectURL = jest.fn()
	})

	afterEach(() => {
		jest.useRealTimers()
		URL.createObjectURL = originalCreateObjectURL
		URL.revokeObjectURL = originalRevokeObjectURL
		global.Image = originalImage
		jest.restoreAllMocks()
	})

	test('loads a video file onto the video element and revokes its object URL on cleanup', async () => {
		const video = document.createElement('video')
		video.play = jest.fn(() => Promise.resolve())
		video.pause = jest.fn()
		Object.defineProperty(video, 'videoWidth', { configurable: true, value: 1280 })
		Object.defineProperty(video, 'videoHeight', { configurable: true, value: 720 })
		Object.defineProperty(video, 'readyState', { configurable: true, value: 0, writable: true })

		const file = new File(['video-bytes'], 'demo.mp4', { type: 'video/mp4' })
		const loading = loadUploadedMediaSource(video, file)
		video.readyState = 2
		video.dispatchEvent(new Event('loadeddata'))

		const result = await loading
		expect(result.kind).toBe('video')
		expect(result.name).toBe('demo.mp4')
		expect(result.width).toBe(1280)
		expect(result.height).toBe(720)
		expect(video.loop).toBe(true)
		expect(video.muted).toBe(true)
		expect(video.src).toBe('blob:mock-media-url')
		expect(video.play).toHaveBeenCalledTimes(1)

		stopUploadedMediaSource(video)
		expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-media-url')
	})

	test('streams an uploaded image via an offscreen canvas MediaStream and stops timer when tracks stop', async () => {
		const drawImage = jest.fn()
		const clearRect = jest.fn()
		const trackStop = jest.fn()
		const fakeTrack = { stop: trackStop, addEventListener: jest.fn() }
		const fakeStream = { getTracks: () => [fakeTrack] }
		const fakeCanvas = {
			width: 0,
			height: 0,
			getContext: jest.fn(() => ({ drawImage, clearRect })),
			captureStream: jest.fn(() => fakeStream),
		}
		const originalCreateElement = document.createElement.bind(document)
		jest.spyOn(document, 'createElement').mockImplementation(tag =>
			tag === 'canvas' ? fakeCanvas : originalCreateElement(tag)
		)

		global.Image = class MockImage {
			constructor() {
				this.naturalWidth = 2560
				this.naturalHeight = 1440
			}
			set src(value) {
				this._src = value
				Promise.resolve().then(() => this.onload?.())
			}
		}

		const video = originalCreateElement('video')
		video.play = jest.fn(() => Promise.resolve())
		Object.defineProperty(video, 'readyState', { configurable: true, value: 2 })

		const file = new File(['image-bytes'], 'portrait.png', { type: 'image/png' })
		const result = await loadUploadedMediaSource(video, file, { frameRate: 15 })

		expect(result.kind).toBe('image')
		expect(result.width).toBe(1280)
		expect(result.height).toBe(720)
		expect(result.stream).toBe(fakeStream)
		expect(video.srcObject).toBe(fakeStream)
		expect(fakeCanvas.captureStream).toHaveBeenCalledWith(15)
		expect(drawImage).toHaveBeenCalledTimes(1)

		jest.advanceTimersByTime(200)
		expect(drawImage.mock.calls.length).toBeGreaterThan(1)

		// Stopping the MediaStream track cleans up the redraw interval and blob URL
		fakeTrack.stop()
		expect(trackStop).toHaveBeenCalledTimes(1)
		expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-media-url')
		expect(jest.getTimerCount()).toBe(0)
	})

	test('rejects unsupported file types cleanly', async () => {
		const video = document.createElement('video')
		const file = new File(['hello'], 'readme.txt', { type: 'text/plain' })
		await expect(loadUploadedMediaSource(video, file)).rejects.toThrow(/video or image/i)
		expect(URL.createObjectURL).not.toHaveBeenCalled()
	})
})

describe('showCameraUploadDialog', () => {
	test('opens non-fatally, accepts uploaded image/video via file input, and closes on success', async () => {
		const dialog = renderUploadDialogMarkup()
		const onFileSelected = jest.fn(() => Promise.resolve())
		const onClose = jest.fn()

		showCameraUploadDialog({ onFileSelected, onClose, dialog })
		expect(dialog.open).toBe(true)
		expect(dialog.classList.contains('fatal')).toBe(false)

		const input = dialog.querySelector('#camera-upload-input')
		const file = new File(['img'], 'face.png', { type: 'image/png' })
		Object.defineProperty(input, 'files', { configurable: true, value: [file] })
		input.dispatchEvent(new Event('change'))

		await Promise.resolve()
		await Promise.resolve()

		expect(onFileSelected).toHaveBeenCalledWith(file)
		expect(dialog.open).toBe(false)
		expect(onClose).toHaveBeenCalledWith('uploaded')
	})

	test('keeps dialog open with inline error for unsupported files or load failures', async () => {
		const dialog = renderUploadDialogMarkup()
		const onFileSelected = jest.fn(() => Promise.reject(new Error('Could not decode video')))

		showCameraUploadDialog({ onFileSelected, dialog })

		const dropzone = dialog.querySelector('.camera-upload-dropzone')
		const badFile = new File(['text'], 'notes.txt', { type: 'text/plain' })
		const badDrop = new Event('drop', { bubbles: true, cancelable: true })
		Object.defineProperty(badDrop, 'dataTransfer', { value: { files: [badFile] } })
		dropzone.dispatchEvent(badDrop)

		const status = dialog.querySelector('#camera-upload-status')
		expect(onFileSelected).not.toHaveBeenCalled()
		expect(dialog.open).toBe(true)
		expect(status.hidden).toBe(false)
		expect(status.dataset.state).toBe('error')

		const videoFile = new File(['vid'], 'broken.mp4', { type: 'video/mp4' })
		const videoDrop = new Event('drop', { bubbles: true, cancelable: true })
		Object.defineProperty(videoDrop, 'dataTransfer', { value: { files: [videoFile] } })
		dropzone.dispatchEvent(videoDrop)

		await Promise.resolve()
		await Promise.resolve()

		expect(onFileSelected).toHaveBeenCalledWith(videoFile)
		expect(dialog.open).toBe(true)
		expect(status.textContent).toBe('Could not decode video')
		expect(status.dataset.state).toBe('error')
	})

	test('reports retry status when Check for camera finds no devices', async () => {
		const dialog = renderUploadDialogMarkup()
		const onRetryCamera = jest.fn(() => Promise.resolve(false))

		showCameraUploadDialog({ onFileSelected: jest.fn(), onRetryCamera, dialog })
		dialog.querySelector('#button-camera-upload-retry').click()

		await Promise.resolve()
		await Promise.resolve()

		expect(onRetryCamera).toHaveBeenCalledTimes(1)
		const status = dialog.querySelector('#camera-upload-status')
		expect(status.hidden).toBe(false)
		expect(status.textContent).toMatch(/no camera detected/i)
	})
})

describe('compatibility table with no camera', () => {
	test('treats zero cameras as non-fatal and informs user about video/image upload', async () => {
		document.body.innerHTML = `<table id="compatibility">
			<tr class="capability-browser"><th><span class="browser-name"></span></th><td class="result checking"></td></tr>
			<tr class="capability-camera"><td class="result checking"></td></tr>
			<tr class="capability-midi"><td class="result checking"></td></tr>
			<tr class="capability-gpu"><td class="result checking"></td></tr>
			<tr class="capability-speakers"><td class="result checking"></td></tr>
			<tr class="capability-view-transitions"><td class="result checking"></td></tr>
		</table><details id="alternate-browsers"></details>`

		Object.defineProperty(navigator, 'mediaDevices', {
			configurable: true,
			value: { enumerateDevices: jest.fn(() => Promise.resolve([])) },
		})
		Object.defineProperty(navigator, 'permissions', {
			configurable: true,
			value: { query: jest.fn(() => Promise.resolve({ state: 'prompt' })) },
		})

		const result = await updateCapabalitiesTable(document.getElementById('compatibility'), {
			cameraAvailable: true,
			webMIDIAvailable: false,
			webGL: true,
			webGPU: false,
			viewTransitions: true,
		})

		expect(result.fatal).toBe(false)
		const cameraCell = document.querySelector('.capability-camera td.result')
		expect(cameraCell.textContent).toMatch(/upload a video or image/i)
		expect(cameraCell.classList.contains('checking')).toBe(false)
	})
})
