import { getEyebrowStyle } from './eyebrow-styles.js'
import { LEFT_EYE_PATH, LEFT_IRIS_PATH, MEDIAPIPE_FACE_MESH_KEYPOINTS_BY_CONTOUR, RIGHT_EYE_PATH, RIGHT_IRIS_PATH } from '../models/face-landmark-constants.js'
import { drawEyebrows } from './2d.eyebrows.js'
import { drawEyes } from './2d.eyes.js'
import { drawLipOverlay } from './lip-styles.js'

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
	return {
		leftEyebrow: toCanvasPoints(annotations.leftEyebrow ?? annotations.leftEyebrowLower ?? pointsFromLandmarks(landmarks, MEDIAPIPE_FACE_MESH_KEYPOINTS_BY_CONTOUR.leftEyebrow), canvas),
		rightEyebrow: toCanvasPoints(annotations.rightEyebrow ?? annotations.rightEyebrowLower ?? pointsFromLandmarks(landmarks, MEDIAPIPE_FACE_MESH_KEYPOINTS_BY_CONTOUR.rightEyebrow), canvas),
		leftEye: toCanvasPoints(annotations.leftEye ?? annotations.leftEyeSocket ?? pointsFromLandmarks(landmarks, LEFT_EYE_PATH), canvas),
		rightEye: toCanvasPoints(annotations.rightEye ?? annotations.rightEyeSocket ?? pointsFromLandmarks(landmarks, RIGHT_EYE_PATH), canvas),
		leftPupil: toCanvasPoints([annotations.leftPupil ?? annotations.leftIris?.[0] ?? landmarks[LEFT_IRIS_PATH[0]]].filter(Boolean), canvas)[0],
		rightPupil: toCanvasPoints([annotations.rightPupil ?? annotations.rightIris?.[0] ?? landmarks[RIGHT_IRIS_PATH[0]]].filter(Boolean), canvas)[0],
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
export const drawFaceFeatures = (canvasContext, person, colours = {}, displayOptions = {}, beatJustPlayed = false) => {
	const prediction = person?.data
	if (!canvasContext || !prediction)
	{
		return false
	}
	const options = { ...displayOptions, ...person.options }
	const features = getFeaturePoints(prediction, person, canvasContext.canvas)
	drawLipOverlay(canvasContext, person, options, colours, beatJustPlayed)

	if (options.drawEyes)
	{
		const eyeOptions = {
			eyeDesign:options.eyeDesign,
			iris:person.hsl ?? options.leftEyeIris ?? 'rgba(100,255,100,0.8)',
			irisRadius:options.irisRadius ?? 0.8,
			pupil:options.pupil ?? 'rgba(0,0,0,0.8)',
			pupilRadius:options.pupilRadius ?? 0.3,
			sclera:'white',
			scleraRadius:options.scleraRadius ?? 1,
			ratio:options.eyeRatio ?? 0.8,
			scaleX:1,
			scaleY:1
		}
		drawEyes(canvasContext, {
			leftEye:features.leftEye,
			leftPupil:getPupil(features.leftPupil, features.leftEye),
			rightEye:features.rightEye,
			rightPupil:getPupil(features.rightPupil, features.rightEye),
			expression:prediction,
			leftOpen:person.isLeftEyeOpen,
			rightOpen:person.isRightEyeOpen,
			eyeDirection:prediction.eyeDirection ?? 0
		}, { ...eyeOptions, rightIris:person.hsl ?? options.rightEyeIris ?? eyeOptions.iris })
	}

	if (getEyebrowStyle(options) !== 'disabled')
	{
		drawEyebrows(canvasContext, features.leftEyebrow, true, { ...options, eyebrowStyle:getEyebrowStyle(options), eyebrowAmount:prediction.eyebrowsRaisedBy, color:person.hsl ?? 'rgba(0,0,0,0.8)' })
		drawEyebrows(canvasContext, features.rightEyebrow, false, { ...options, eyebrowStyle:getEyebrowStyle(options), eyebrowAmount:prediction.eyebrowsRaisedBy, color:person.hsl ?? 'rgba(0,0,0,0.8)' })
	}
	return true
}
