import { LEFT_EYE_PATH, LEFT_IRIS_PATH, MEDIAPIPE_FACE_MESH_KEYPOINTS_BY_CONTOUR, MESH_ANNOTATIONS, RIGHT_EYE_PATH, RIGHT_IRIS_PATH } from '../models/face-landmark-constants.js'
import { drawEyebrows } from './2d.eyebrows.js'
import { drawEye } from './2d.eyes.js'
import { drawLip } from './2d.mouth.js'

const toCanvasPoints = (points, canvas) => {
	if (!Array.isArray(points) || points.length === 0)
	{
		return []
	}
	const normalized = points.every(point => Math.abs(point?.x) <= 1.5 && Math.abs(point?.y) <= 1.5)
	return points.map(point => ({
		...point,
		x: point.x * (normalized ? canvas.width : 1),
		y: point.y * (normalized ? canvas.height : 1)
	}))
}

const pointsFromLandmarks = (landmarks, indices) =>
	Array.isArray(landmarks) ? indices.map(index => landmarks[index]).filter(Boolean) : []

const getFeaturePoints = (prediction, person, canvas) => {
	const annotations = prediction.annotations ?? {}
	const landmarks = prediction.faceLandmarks ?? prediction.keypoints ?? []
	const lips = person.isMouthOpen && person.singing ?
		(annotations.innerLip ?? annotations.lips) :
		(annotations.outerLip ?? annotations.lips)
	return {
		leftEyebrow: toCanvasPoints(annotations.leftEyebrow ?? annotations.leftEyebrowLower ?? pointsFromLandmarks(landmarks, MEDIAPIPE_FACE_MESH_KEYPOINTS_BY_CONTOUR.leftEyebrow), canvas),
		rightEyebrow: toCanvasPoints(annotations.rightEyebrow ?? annotations.rightEyebrowLower ?? pointsFromLandmarks(landmarks, MEDIAPIPE_FACE_MESH_KEYPOINTS_BY_CONTOUR.rightEyebrow), canvas),
		leftEye: toCanvasPoints(annotations.leftEye ?? annotations.leftEyeSocket ?? pointsFromLandmarks(landmarks, LEFT_EYE_PATH), canvas),
		rightEye: toCanvasPoints(annotations.rightEye ?? annotations.rightEyeSocket ?? pointsFromLandmarks(landmarks, RIGHT_EYE_PATH), canvas),
		leftPupil: toCanvasPoints([annotations.leftPupil ?? annotations.leftIris?.[0] ?? landmarks[LEFT_IRIS_PATH[0]]].filter(Boolean), canvas)[0],
		rightPupil: toCanvasPoints([annotations.rightPupil ?? annotations.rightIris?.[0] ?? landmarks[RIGHT_IRIS_PATH[0]]].filter(Boolean), canvas)[0],
		lips: toCanvasPoints(lips ?? [
			...pointsFromLandmarks(landmarks, MESH_ANNOTATIONS.lipsUpperOuter),
			...pointsFromLandmarks(landmarks, MESH_ANNOTATIONS.lipsLowerOuter).reverse()
		], canvas)
	}
}

const getPupil = (pupil, eye) => {
	if (!pupil)
	{
		return null
	}
	const width = eye.length > 1 ? Math.hypot(eye[0].x - eye[eye.length - 1].x, eye[0].y - eye[eye.length - 1].y) : 12
	return { ...pupil, diameter:pupil.diameter ?? Math.max(8, width * 0.65) }
}

/** Draw the optional facial features for predictions from either face model. */
export const drawFaceFeatures = (canvasContext, person, colours = {}, displayOptions = {}) => {
	const prediction = person?.data
	if (!canvasContext || !prediction)
	{
		return false
	}
	const options = { ...displayOptions, ...person.options }
	const features = getFeaturePoints(prediction, person, canvasContext.canvas)
	const alpha = colours.a ?? 1

	if (options.drawMouth && features.lips.length > 1)
	{
		drawLip(canvasContext, features.lips,
			{ h:90, s:50, l:50, a:alpha * 0.5 },
			{ h:person.hue ?? 0, s:options.saturation ?? 80, l:person.isMouthOpen ? options.luminosity ?? 50 : 20, a:alpha * (person.isMouthOpen ? 0.3 : 0.6) })
	}

	if (options.drawEyes && !person.areEyesClosed)
	{
		const eyeOptions = {
			iris:options.leftEyeIris ?? 'rgba(100,255,100,0.8)',
			irisRadius:options.irisRadius ?? 0.8,
			pupil:options.pupil ?? 'rgba(0,0,0,0.8)',
			pupilRadius:options.pupilRadius ?? 0.3,
			sclera:'white',
			scleraRadius:options.scleraRadius ?? 1,
			ratio:options.eyeRatio ?? 0.8,
			scaleX:1,
			scaleY:1
		}
		const leftPupil = getPupil(features.leftPupil, features.leftEye)
		const rightPupil = getPupil(features.rightPupil, features.rightEye)
		if (features.leftEye.length > 0 && leftPupil)
		{
			drawEye(canvasContext, features.leftEye, leftPupil, person.isLeftEyeOpen, prediction.eyeDirection ?? 0, eyeOptions)
		}
		if (features.rightEye.length > 0 && rightPupil)
		{
			drawEye(canvasContext, features.rightEye, rightPupil, person.isRightEyeOpen, prediction.eyeDirection ?? 0, { ...eyeOptions, iris:options.rightEyeIris ?? eyeOptions.iris })
		}
	}

	if (options.drawEyebrows)
	{
		drawEyebrows(canvasContext, features.leftEyebrow, true, { ...options, color:person.hsl ?? 'rgba(0,0,0,0.8)' })
		drawEyebrows(canvasContext, features.rightEyebrow, false, { ...options, color:person.hsl ?? 'rgba(0,0,0,0.8)' })
	}
	return true
}
