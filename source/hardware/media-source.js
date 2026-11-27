const VIDEO_EXTENSIONS = new Set(['mp4', 'm4v', 'webm', 'ogv', 'ogg', 'mov', 'avi', 'mkv'])
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'bmp', 'svg'])

export const MAX_IMAGE_DIMENSION = 1280
export const IMAGE_STREAM_FRAME_RATE = 15

const activeCleanups = new WeakMap()

const getFileExtension = name => {
	if (typeof name !== 'string') return ''
	const match = /\.([^.]+)$/.exec(name.trim().toLowerCase())
	return match ? match[1] : ''
}

/**
 * Determine whether a File is a supported video or image replacement for a camera.
 * @param {File|null|undefined} file
 * @returns {'video'|'image'|null}
 */
export const classifyMediaFile = file => {
	if (!file) return null
	const mime = typeof file.type === 'string' ? file.type.trim().toLowerCase() : ''
	if (mime.startsWith('video/')) return 'video'
	if (mime.startsWith('image/')) return 'image'

	const ext = getFileExtension(file.name)
	if (VIDEO_EXTENSIONS.has(ext)) return 'video'
	if (IMAGE_EXTENSIONS.has(ext)) return 'image'
	return null
}

export const isSupportedMediaFile = file => classifyMediaFile(file) !== null

export const getScaledImageDimensions = (naturalWidth, naturalHeight, maxDimension = MAX_IMAGE_DIMENSION) => {
	const sourceWidth = Number.isFinite(naturalWidth) && naturalWidth > 0 ? naturalWidth : 640
	const sourceHeight = Number.isFinite(naturalHeight) && naturalHeight > 0 ? naturalHeight : 480
	const longest = Math.max(sourceWidth, sourceHeight)
	if (longest <= maxDimension) {
		return {
			width: Math.max(2, Math.round(sourceWidth)),
			height: Math.max(2, Math.round(sourceHeight))
		}
	}
	const scale = maxDimension / longest
	const toEven = value => Math.max(2, Math.round(value / 2) * 2)
	return {
		width: toEven(sourceWidth * scale),
		height: toEven(sourceHeight * scale)
	}
}

/**
 * Stop and dispose any uploaded video or image source previously attached to videoElement.
 * @param {HTMLVideoElement|null|undefined} videoElement
 */
export const stopUploadedMediaSource = videoElement => {
	if (!videoElement) return
	const cleanup = activeCleanups.get(videoElement)
	if (cleanup) {
		activeCleanups.delete(videoElement)
		cleanup()
	}
}

const waitForVideoReady = (videoElement, label) => new Promise((resolve, reject) => {
	if (videoElement.readyState >= 2) {
		resolve()
		return
	}
	const cleanup = () => {
		videoElement.removeEventListener('loadeddata', onReady)
		videoElement.removeEventListener('loadedmetadata', onMetadata)
		videoElement.removeEventListener('canplay', onReady)
		videoElement.removeEventListener('error', onError)
	}
	const onReady = () => {
		cleanup()
		resolve()
	}
	const onMetadata = () => {
		if (videoElement.readyState >= 2 || videoElement.videoWidth > 0) {
			onReady()
		}
	}
	const onError = () => {
		cleanup()
		reject(new Error(`Could not play ${label || 'the selected media file'}. Please try another video or image.`))
	}
	videoElement.addEventListener('loadeddata', onReady)
	videoElement.addEventListener('loadedmetadata', onMetadata)
	videoElement.addEventListener('canplay', onReady)
	videoElement.addEventListener('error', onError)
})

const safePlay = async videoElement => {
	if (typeof videoElement.play !== 'function') return
	try {
		await videoElement.play()
	} catch (error) {
		// Autoplay rejection is non-fatal when muted or under synthetic environments
		console.warn('Uploaded media autoplay warning', error)
	}
}

const loadImageElement = (url, label) => new Promise((resolve, reject) => {
	const image = new Image()
	image.decoding = 'async'
	image.onload = () => resolve(image)
	image.onerror = () => reject(new Error(`Could not load image ${label || ''}. Please try another file.`.trim()))
	image.src = url
})

const clearExistingVideoSource = videoElement => {
	stopUploadedMediaSource(videoElement)

	if (videoElement.srcObject) {
		videoElement.srcObject.getTracks?.().forEach(track => track.stop())
		videoElement.srcObject = null
	}

	const existingSrc = videoElement.getAttribute?.('src') || videoElement.src || ''
	if (existingSrc.startsWith('blob:')) {
		URL.revokeObjectURL(existingSrc)
	}
	if (videoElement.src) {
		videoElement.removeAttribute?.('src')
		videoElement.src = ''
	}
}

/**
 * Load an uploaded video or image File onto the stage video element so it acts
 * as a drop-in replacement for a live camera stream.
 *
 * Videos play looped directly on the video element; images are drawn onto an
 * offscreen canvas captured as a MediaStream so videoWidth/videoHeight,
 * currentTime, FaceLandmarker detectForVideo, and display layers work identically.
 *
 * @param {HTMLVideoElement} videoElement
 * @param {File} file
 * @param {{ frameRate?: number, maxImageDimension?: number }} [options]
 * @returns {Promise<{ kind: 'video'|'image', file: File, name: string, width: number, height: number, stream: MediaStream|null, cleanup: () => void }>}
 */
export const loadUploadedMediaSource = async (videoElement, file, options = {}) => {
	if (!videoElement) {
		throw new Error('No video element available for uploaded media.')
	}

	const kind = classifyMediaFile(file)
	if (!kind) {
		throw new Error('Please choose a video or image file.')
	}

	const frameRate = options.frameRate ?? IMAGE_STREAM_FRAME_RATE
	const maxImageDimension = options.maxImageDimension ?? MAX_IMAGE_DIMENSION
	const label = file.name || (kind === 'image' ? 'image' : 'video')

	clearExistingVideoSource(videoElement)

	videoElement.muted = true
	videoElement.loop = true
	videoElement.playsInline = true
	videoElement.controls = false
	videoElement.removeAttribute?.('controls')
	videoElement.classList?.toggle('reverse', false)

	const objectURL = URL.createObjectURL(file)

	if (kind === 'video') {
		let disposed = false
		const cleanup = () => {
			if (disposed) return
			disposed = true
			URL.revokeObjectURL(objectURL)
			if (videoElement.src === objectURL) {
				videoElement.pause?.()
				videoElement.removeAttribute?.('src')
				videoElement.src = ''
			}
		}

		try {
			const readyPromise = waitForVideoReady(videoElement, label)
			videoElement.src = objectURL
			await readyPromise
			await safePlay(videoElement)
		} catch (error) {
			cleanup()
			throw error
		}

		const width = videoElement.videoWidth || videoElement.width || 640
		const height = videoElement.videoHeight || videoElement.height || 480
		videoElement.width = width
		videoElement.height = height
		activeCleanups.set(videoElement, cleanup)

		return { kind, file, name: label, width, height, stream: null, cleanup }
	}

	// kind === 'image'
	let image
	try {
		image = await loadImageElement(objectURL, label)
	} catch (error) {
		URL.revokeObjectURL(objectURL)
		throw error
	}

	const { width, height } = getScaledImageDimensions(
		image.naturalWidth || image.width,
		image.naturalHeight || image.height,
		maxImageDimension
	)

	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height

	if (typeof canvas.captureStream !== 'function') {
		URL.revokeObjectURL(objectURL)
		throw new Error('Your browser cannot stream uploaded images. Please upload a video file instead.')
	}

	const context = canvas.getContext('2d')
	const drawFrame = () => {
		if (!context) return
		context.clearRect(0, 0, width, height)
		context.drawImage(image, 0, 0, width, height)
	}

	drawFrame()

	const stream = canvas.captureStream(frameRate)
	let intervalId = setInterval(drawFrame, Math.max(16, Math.round(1000 / frameRate)))
	let disposed = false

	const stopLoopAndRevoke = () => {
		if (disposed) return
		disposed = true
		if (intervalId !== null) {
			clearInterval(intervalId)
			intervalId = null
		}
		URL.revokeObjectURL(objectURL)
	}

	const cleanup = () => {
		stopLoopAndRevoke()
		stream.getTracks?.().forEach(track => track.stop())
		if (videoElement.srcObject === stream) {
			videoElement.srcObject = null
		}
	}

	// Ensure stopping the stream tracks from any caller (e.g. destroyVideoStream)
	// also clears the redraw timer and releases the blob URL.
	stream.getTracks?.().forEach(track => {
		const originalStop = track.stop?.bind(track)
		if (originalStop) {
			track.stop = () => {
				stopLoopAndRevoke()
				return originalStop()
			}
		}
		track.addEventListener?.('ended', stopLoopAndRevoke, { once: true })
	})

	try {
		const readyPromise = waitForVideoReady(videoElement, label)
		videoElement.srcObject = stream
		await readyPromise
		await safePlay(videoElement)
	} catch (error) {
		cleanup()
		throw error
	}

	const resolvedWidth = videoElement.videoWidth || width
	const resolvedHeight = videoElement.videoHeight || height
	videoElement.width = resolvedWidth
	videoElement.height = resolvedHeight
	activeCleanups.set(videoElement, cleanup)

	return { kind, file, name: label, width: resolvedWidth, height: resolvedHeight, stream, cleanup }
}
