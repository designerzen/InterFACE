import { enhanceFaceLandmarksModelPrediction } from './models/face-landmarks-calculations.js'

export const DEFAULT_WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm'
export const DEFAULT_FACE_MODEL = new URL('../assets/face_landmarker.task', import.meta.url).href
export const DEFAULT_HAND_MODEL = new URL('../assets/gesture_recognizer.task', import.meta.url).href

/** Each tracker owns its detector, timestamp and WASM lifecycle. */
export class MediaPipeTracker {
	constructor(options = {}) {
		this.options = { mode: 'face', maxPerformers: 4, mirrored: true, ...options }
		this.timestamp = -Infinity
		this.generation = 0
	}
	async load() {
		if (this.detector) return
		if (this.pending) return this.pending
		const generation = this.generation
		this.pending = this.create().then(detector => {
			if (generation !== this.generation) {
				detector.close()
				throw new DOMException('Tracking cancelled', 'AbortError')
			}
			this.detector = detector
		}).finally(() => {
			if (generation === this.generation) this.pending = undefined
		})
		return this.pending
	}
	async create() {
		if (this.options.createDetector) return this.options.createDetector(this.options)
		const { FaceLandmarker, GestureRecognizer, FilesetResolver } = await import('@mediapipe/tasks-vision')
		const files = await FilesetResolver.forVisionTasks(this.options.wasmPath ?? DEFAULT_WASM_PATH)
		const hands = this.options.mode === 'hands'
		const create = delegate => (hands ? GestureRecognizer : FaceLandmarker).createFromOptions(files, {
			baseOptions: { modelAssetPath: this.options.modelAssetPath ?? (hands ? DEFAULT_HAND_MODEL : DEFAULT_FACE_MODEL), delegate },
			runningMode: 'VIDEO',
			...(hands ? { numHands: this.options.maxPerformers } : {
				numFaces: this.options.maxPerformers, outputFaceBlendshapes: true, outputFacialTransformationMatrixes: true
			})
		})
		try { return await create(this.options.delegate ?? 'GPU') }
		catch (error) {
			if (this.options.delegate === 'CPU') throw error
			return create('CPU')
		}
	}
	async detect(video, time) {
		if (!this.detector) throw new Error('Tracker is not loaded')
		if (!Number.isFinite(time)) throw new RangeError('Tracking time must be finite milliseconds')
		this.timestamp = Math.max(time, this.timestamp + 0.001)
		if (this.options.mode === 'hands') {
			const result = await this.detector.recognizeForVideo(video, this.timestamp)
			return (result.landmarks ?? []).map((landmarks, index) => {
				const points = landmarks.map(point => ({ ...point, x: this.options.mirrored ? 1 - point.x : point.x }))
				return {
					time, landmarks: points, keypoints: points,
					gestures: result.gestures?.[index] ?? [], handedness: result.handedness?.[index] ?? [],
					box: { xMin: Math.min(...points.map(p => p.x)), xMax: Math.max(...points.map(p => p.x)), yMin: Math.min(...points.map(p => p.y)), yMax: Math.max(...points.map(p => p.y)) }
				}
			})
		}
		const result = await this.detector.detectForVideo(video, this.timestamp)
		return (result.faceLandmarks ?? []).map((points, index) => enhanceFaceLandmarksModelPrediction(
			points.map(point => ({ ...point })), result.faceBlendshapes?.[index] ?? { categories: [] }, result.facialTransformationMatrixes?.[index], time, this.options.mirrored
		))
	}
	close() {
		++this.generation
		this.detector?.close()
		this.detector = undefined
		this.pending = undefined
		this.timestamp = -Infinity
	}
}
