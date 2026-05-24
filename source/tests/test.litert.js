import { unzipSync } from 'fflate'
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision'
import { loadLiteRt, loadAndCompile, Tensor } from '@litertjs/core'

import FACE_LANDMARK_TASK from 'url:../models/tasks/face_landmarker.task'

const TASKS_VISION_WASM = './@mediapipe/tasks-vision/wasm'
const LITERT_WASM = `${window.location.origin}/@litertjs/litert_wasm_compat_internal.js`
const RAW_BLENDSHAPES_MODEL_NAME = 'face_blendshapes.tflite'

const BLENDSHAPE_LANDMARK_INDICES = [
	0, 1, 4, 5, 6, 7, 8, 10, 13, 14, 17, 21, 33, 37, 39,
	40, 46, 52, 53, 54, 55, 58, 61, 63, 65, 66, 67, 70, 78, 80,
	81, 82, 84, 87, 88, 91, 93, 95, 103, 105, 107, 109, 127, 132, 133,
	136, 144, 145, 146, 148, 149, 150, 152, 153, 154, 155, 157, 158, 159, 160,
	161, 162, 163, 168, 172, 173, 176, 178, 181, 185, 191, 195, 197, 234, 246,
	249, 251, 263, 267, 269, 270, 276, 282, 283, 284, 285, 288, 291, 293, 295,
	296, 297, 300, 308, 310, 311, 312, 314, 317, 318, 321, 323, 324, 332, 334,
	336, 338, 356, 361, 362, 365, 373, 374, 375, 377, 378, 379, 380, 381, 382,
	384, 385, 386, 387, 388, 389, 390, 397, 398, 400, 402, 405, 409, 415, 454,
	466, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477
]

const MEDIAPIPE_BLENDSHAPE_NAMES = [
	'_neutral',
	'browDownLeft',
	'browDownRight',
	'browInnerUp',
	'browOuterUpLeft',
	'browOuterUpRight',
	'cheekPuff',
	'cheekSquintLeft',
	'cheekSquintRight',
	'eyeBlinkLeft',
	'eyeBlinkRight',
	'eyeLookDownLeft',
	'eyeLookDownRight',
	'eyeLookInLeft',
	'eyeLookInRight',
	'eyeLookOutLeft',
	'eyeLookOutRight',
	'eyeLookUpLeft',
	'eyeLookUpRight',
	'eyeSquintLeft',
	'eyeSquintRight',
	'eyeWideLeft',
	'eyeWideRight',
	'jawForward',
	'jawLeft',
	'jawOpen',
	'jawRight',
	'mouthClose',
	'mouthDimpleLeft',
	'mouthDimpleRight',
	'mouthFrownLeft',
	'mouthFrownRight',
	'mouthFunnel',
	'mouthLeft',
	'mouthLowerDownLeft',
	'mouthLowerDownRight',
	'mouthPressLeft',
	'mouthPressRight',
	'mouthPucker',
	'mouthRight',
	'mouthRollLower',
	'mouthRollUpper',
	'mouthShrugLower',
	'mouthShrugUpper',
	'mouthSmileLeft',
	'mouthSmileRight',
	'mouthStretchLeft',
	'mouthStretchRight',
	'mouthUpperUpLeft',
	'mouthUpperUpRight',
	'noseSneerLeft',
	'noseSneerRight',
	'tongueOut'
]

const state = {
	faceLandmarker: null,
	rawBlendshapeModel: null,
	video: null,
	canvas: null,
	canvasContext: null,
	sampleCanvas: null,
	lastTongueHeuristic: null,
	drawingUtils: null,
	lastResults: null,
	lastVideoTime: -1,
	isRunning: false
}

const startButton = document.getElementById('button-start')
const probeButton = document.getElementById('button-probe')
const statusOutput = document.getElementById('status')
const summaryOutput = document.getElementById('summary')
const detailsOutput = document.getElementById('details')

const setStatus = message => {
	statusOutput.value = message
}

setStatus('JavaScript module loaded. Press Start camera.')
summaryOutput.value = 'Models are loaded after pressing Start camera.'

const formatNumber = value => Number.isFinite(value) ? value.toFixed(6) : String(value)

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

const pixelPoint = (landmark, width, height) => ({
	x: landmark.x * width,
	y: landmark.y * height
})

const categoryScoreMap = categories => Object.fromEntries(
	categories.map(category => [category.categoryName, category.score])
)

const rgbToHue = (red, green, blue) => {
	const r = red / 255
	const g = green / 255
	const b = blue / 255
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	const delta = max - min

	if (delta === 0) {
		return 0
	}

	if (max === r) {
		return 60 * (((g - b) / delta) % 6)
	}

	if (max === g) {
		return 60 * ((b - r) / delta + 2)
	}

	return 60 * ((r - g) / delta + 4)
}

const analyseTongueHeuristic = (landmarks, categories) => {
	const { video } = state
	const width = video.videoWidth || video.width
	const height = video.videoHeight || video.height
	const mouthLeft = pixelPoint(landmarks[61], width, height)
	const mouthRight = pixelPoint(landmarks[291], width, height)
	const upperInnerLip = pixelPoint(landmarks[13], width, height)
	const lowerInnerLip = pixelPoint(landmarks[14], width, height)
	const lowerOuterLip = pixelPoint(landmarks[17], width, height)
	const mouthWidth = Math.max(1, Math.hypot(mouthRight.x - mouthLeft.x, mouthRight.y - mouthLeft.y))
	const mouthOpenRatio = Math.hypot(lowerInnerLip.x - upperInnerLip.x, lowerInnerLip.y - upperInnerLip.y) / mouthWidth
	const centerX = (mouthLeft.x + mouthRight.x) / 2
	const roiWidth = mouthWidth * 0.72
	const roiTop = Math.max(0, upperInnerLip.y - mouthWidth * 0.08)
	const roiBottom = Math.min(height, Math.max(lowerOuterLip.y + mouthWidth * 0.22, lowerInnerLip.y + mouthWidth * 0.22))
	const roiX = Math.round(clamp(centerX - roiWidth / 2, 0, width - 1))
	const roiY = Math.round(clamp(roiTop, 0, height - 1))
	const roi = {
		x: roiX,
		y: roiY,
		width: Math.round(clamp(roiWidth, 1, width - roiX)),
		height: Math.round(clamp(roiBottom - roiTop, 1, height - roiY))
	}

	if (!state.sampleCanvas) {
		state.sampleCanvas = document.createElement('canvas')
	}

	state.sampleCanvas.width = width
	state.sampleCanvas.height = height
	const sampleContext = state.sampleCanvas.getContext('2d', { willReadFrequently: true })
	sampleContext.drawImage(video, 0, 0, width, height)
	const pixels = sampleContext.getImageData(roi.x, roi.y, roi.width, roi.height).data
	let pinkPixels = 0
	let darkPixels = 0
	let saturatedPixels = 0
	const totalPixels = pixels.length / 4

	for (let index = 0; index < pixels.length; index += 4) {
		const red = pixels[index]
		const green = pixels[index + 1]
		const blue = pixels[index + 2]
		const maxChannel = Math.max(red, green, blue)
		const minChannel = Math.min(red, green, blue)
		const saturation = maxChannel === 0 ? 0 : (maxChannel - minChannel) / maxChannel
		const hue = (rgbToHue(red, green, blue) + 360) % 360
		const redOrMagentaHue = hue <= 25 || hue >= 330 || (hue >= 285 && hue <= 330)
		const pinkish = red > 70 && saturation > 0.18 && red > green * 1.08 && red > blue * 0.82 && redOrMagentaHue

		if (pinkish) {
			pinkPixels += 1
		}

		if (maxChannel < 70) {
			darkPixels += 1
		}

		if (saturation > 0.22) {
			saturatedPixels += 1
		}
	}

	const scores = categoryScoreMap(categories)
	const pinkRatio = pinkPixels / totalPixels
	const darkRatio = darkPixels / totalPixels
	const saturatedRatio = saturatedPixels / totalPixels
	const colourScore = clamp((pinkRatio - 0.08) / 0.28)
	const openScore = clamp((mouthOpenRatio - 0.08) / 0.24)
	const blendshapeOpenScore = clamp((scores.jawOpen ?? 0) * 0.8 + (scores.mouthLowerDownLeft ?? 0) * 0.1 + (scores.mouthLowerDownRight ?? 0) * 0.1)
	const tongueOutScore = clamp(colourScore * 0.58 + openScore * 0.27 + blendshapeOpenScore * 0.15)

	return {
		tongueOutScore,
		isLikelyTongueOut: tongueOutScore >= 0.55 && mouthOpenRatio >= 0.1 && pinkRatio >= 0.16,
		mouthOpenRatio,
		pinkRatio,
		darkRatio,
		saturatedRatio,
		colourScore,
		openScore,
		blendshapeOpenScore,
		roi
	}
}

const extractRawBlendshapeModel = async () => {
	const response = await fetch(FACE_LANDMARK_TASK)
	if (!response.ok) {
		throw new Error(`Unable to fetch ${FACE_LANDMARK_TASK}: ${response.status}`)
	}

	const taskBytes = new Uint8Array(await response.arrayBuffer())
	const files = unzipSync(taskBytes)
	const modelBytes = files[RAW_BLENDSHAPES_MODEL_NAME]

	if (!modelBytes) {
		throw new Error(`${RAW_BLENDSHAPES_MODEL_NAME} was not found inside face_landmarker.task`)
	}

	return modelBytes
}

const createFaceLandmarker = async () => {
	const vision = await FilesetResolver.forVisionTasks(TASKS_VISION_WASM)

	return FaceLandmarker.createFromOptions(vision, {
		baseOptions: {
			modelAssetPath: FACE_LANDMARK_TASK,
			delegate: 'GPU'
		},
		runningMode: 'VIDEO',
		numFaces: 1,
		outputFaceBlendshapes: true,
		outputFacialTransformationMatrixes: true
	})
}

const createRawBlendshapeModel = async () => {
	setStatus(`Loading LiteRT runtime from ${LITERT_WASM}`)
	await loadLiteRt(LITERT_WASM)
	setStatus('Extracting raw blendshape model...')
	const modelBytes = await extractRawBlendshapeModel()
	setStatus('Compiling raw blendshape model...')

	return loadAndCompile(modelBytes, {
		accelerator: 'wasm'
	})
}

const createBlendshapeInput = (landmarks, mode, width, height) => {
	const input = new Float32Array(BLENDSHAPE_LANDMARK_INDICES.length * 2)

	BLENDSHAPE_LANDMARK_INDICES.forEach((landmarkIndex, outputIndex) => {
		const point = landmarks[landmarkIndex]
		const x = mode === 'pixels' ? point.x * width : point.x
		const y = mode === 'pixels' ? point.y * height : point.y

		input[outputIndex * 2] = x
		input[outputIndex * 2 + 1] = y
	})

	return input
}

const runRawBlendshapeModel = async (landmarks, mode) => {
	const inputDetails = state.rawBlendshapeModel.getInputDetails()[0]
	const inputShape = Array.from(inputDetails.shape)
	const inputData = createBlendshapeInput(
		landmarks,
		mode,
		state.video.videoWidth || state.video.width,
		state.video.videoHeight || state.video.height
	)
	const inputTensor = Tensor.fromTypedArray(inputData, inputShape)
	const outputTensors = await state.rawBlendshapeModel.run(inputTensor)
	const [outputTensor] = outputTensors
	const outputData = Array.from(await outputTensor.data())

	inputTensor.delete()
	outputTensors.forEach(tensor => tensor.delete())

	return outputData
}

const meanAbsoluteDifference = (left, right) => {
	const length = Math.min(left.length, right.length)

	if (length === 0) {
		return Number.POSITIVE_INFINITY
	}

	let total = 0
	for (let i = 0; i < length; i++) {
		total += Math.abs(left[i] - right[i])
	}

	return total / length
}

const topDifferences = (rawScores, mediapipeScores) => {
	const length = Math.min(rawScores.length, mediapipeScores.length)
	const differences = []

	for (let i = 0; i < length; i++) {
		differences.push({
			index: i,
			name: MEDIAPIPE_BLENDSHAPE_NAMES[i] ?? `raw_${i}`,
			raw: rawScores[i],
			mediapipe: mediapipeScores[i],
			difference: Math.abs(rawScores[i] - mediapipeScores[i])
		})
	}

	return differences.sort((a, b) => b.difference - a.difference).slice(0, 12)
}

const drawResults = results => {
	const { canvas, canvasContext, drawingUtils, video } = state
	const landmarks = results.faceLandmarks?.[0]

	canvas.width = video.videoWidth || video.width
	canvas.height = video.videoHeight || video.height
	canvasContext.clearRect(0, 0, canvas.width, canvas.height)

	if (!landmarks) {
		return
	}

	drawingUtils.drawConnectors(
		landmarks,
		FaceLandmarker.FACE_LANDMARKS_TESSELATION,
		{ color: '#88ffee55', lineWidth: 1 }
	)
	drawingUtils.drawConnectors(
		landmarks,
		FaceLandmarker.FACE_LANDMARKS_LIPS,
		{ color: '#ff4f81', lineWidth: 2 }
	)

	if (state.lastTongueHeuristic?.roi) {
		const { roi, tongueOutScore, isLikelyTongueOut } = state.lastTongueHeuristic
		canvasContext.strokeStyle = isLikelyTongueOut ? '#48ff91' : '#ffd166'
		canvasContext.lineWidth = 2
		canvasContext.strokeRect(roi.x, roi.y, roi.width, roi.height)
		canvasContext.fillStyle = '#111517cc'
		canvasContext.fillRect(roi.x, Math.max(0, roi.y - 24), 132, 22)
		canvasContext.fillStyle = isLikelyTongueOut ? '#48ff91' : '#ffd166'
		canvasContext.font = '14px system-ui, sans-serif'
		canvasContext.fillText(`tongue ${formatNumber(tongueOutScore)}`, roi.x + 6, Math.max(16, roi.y - 8))
	}
}

const detectFrame = () => {
	if (!state.isRunning) {
		return
	}

	if (state.video.currentTime !== state.lastVideoTime) {
		state.lastVideoTime = state.video.currentTime
		state.lastResults = state.faceLandmarker.detectForVideo(state.video, performance.now())
		const landmarks = state.lastResults?.faceLandmarks?.[0]
		const categories = state.lastResults?.faceBlendshapes?.[0]?.categories
		state.lastTongueHeuristic = landmarks && categories ? analyseTongueHeuristic(landmarks, categories) : null
		drawResults(state.lastResults)
	}

	requestAnimationFrame(detectFrame)
}

const probeCurrentFrame = async () => {
	const landmarks = state.lastResults?.faceLandmarks?.[0]
	const mediapipeCategories = state.lastResults?.faceBlendshapes?.[0]?.categories

	if (!landmarks || !mediapipeCategories) {
		setStatus('No face blendshapes yet. Keep your face in frame and try again.')
		return
	}

	setStatus('Running raw LiteRT blendshape model...')

	const mediapipeScores = mediapipeCategories.map(category => category.score)
	const normalizedScores = await runRawBlendshapeModel(landmarks, 'normalized')
	const pixelScores = await runRawBlendshapeModel(landmarks, 'pixels')
	const normalizedDifference = meanAbsoluteDifference(normalizedScores, mediapipeScores)
	const pixelDifference = meanAbsoluteDifference(pixelScores, mediapipeScores)
	const bestMode = normalizedDifference <= pixelDifference ? 'normalized' : 'pixels'
	const bestScores = bestMode === 'normalized' ? normalizedScores : pixelScores
	const rawExtraScores = bestScores.slice(mediapipeScores.length)
	const tongueHeuristic = analyseTongueHeuristic(landmarks, mediapipeCategories)
	state.lastTongueHeuristic = tongueHeuristic

	const summary = {
		bestMode,
		mediapipeLength: mediapipeScores.length,
		normalizedLength: normalizedScores.length,
		pixelLength: pixelScores.length,
		normalizedMeanAbsDiff: formatNumber(normalizedDifference),
		pixelMeanAbsDiff: formatNumber(pixelDifference),
		rawExtraScores,
		rawLastScore: bestScores.at(-1),
		mediapipeLastLabel: mediapipeCategories.at(-1)?.categoryName,
		candidateTongueOut: bestScores[52],
		tongueHeuristic
	}

	summaryOutput.value = `Best input: ${bestMode}. MediaPipe: ${summary.mediapipeLength} scores. Raw: ${bestScores.length} scores. Candidate tongueOut: ${formatNumber(summary.candidateTongueOut)}. Heuristic: ${formatNumber(tongueHeuristic.tongueOutScore)} (${tongueHeuristic.isLikelyTongueOut ? 'likely' : 'not likely'}).`
	detailsOutput.textContent = JSON.stringify({
		summary,
		inputDetails: state.rawBlendshapeModel.getInputDetails().map(detail => ({
			name: detail.name,
			index: detail.index,
			dtype: detail.dtype,
			shape: Array.from(detail.shape)
		})),
		outputDetails: state.rawBlendshapeModel.getOutputDetails().map(detail => ({
			name: detail.name,
			index: detail.index,
			dtype: detail.dtype,
			shape: Array.from(detail.shape)
		})),
		mediapipeCategories: mediapipeCategories.map(category => ({
			index: category.index,
			categoryName: category.categoryName,
			score: category.score
		})),
		topDifferences: topDifferences(bestScores, mediapipeScores),
		normalizedScores,
		pixelScores
	}, null, 2)

	console.info('[LiteRT blendshape probe]', {
		summary,
		normalizedScores,
		pixelScores,
		mediapipeCategories
	})

	setStatus('Probe complete.')
}

const startCamera = async () => {
	startButton.disabled = true
	setStatus('Loading MediaPipe and LiteRT models...')

	state.video = document.getElementById('webcam')
	state.canvas = document.getElementById('overlay')
	state.canvasContext = state.canvas.getContext('2d')
	state.drawingUtils = new DrawingUtils(state.canvasContext)

	const [faceLandmarker, rawBlendshapeModel] = await Promise.all([
		createFaceLandmarker(),
		createRawBlendshapeModel()
	])

	state.faceLandmarker = faceLandmarker
	state.rawBlendshapeModel = rawBlendshapeModel

	setStatus('Requesting camera...')
	const stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: {
			facingMode: 'user',
			width: { ideal: 640 },
			height: { ideal: 480 }
		}
	})

	state.video.srcObject = stream
	await state.video.play()

	state.isRunning = true
	probeButton.disabled = false
	setStatus('Camera running. Press Probe current frame while neutral, then again with tongue out.')
	requestAnimationFrame(detectFrame)
}

startButton.addEventListener('click', () => {
	startCamera().catch(error => {
		console.error(error)
		setStatus(error.message)
		startButton.disabled = false
	})
})

probeButton.addEventListener('click', () => {
	probeCurrentFrame().catch(error => {
		console.error(error)
		setStatus(error.message)
	})
})
