// Audio-rate smoothing keeps tracking frames from producing audible pan steps.
const PAN_TIME_CONSTANT = 0.06

export const updateStereoPan = (node, prediction, options) => {
	if (!node) return
	const controller = options.stereoController
	// Closed-eye gaze estimates are unreliable; keep the last valid target.
	if (options.stereoPan && controller === 'eyesHorizontal' &&
		(prediction.leftEyeClosed || prediction.rightEyeClosed)) return

	const value = options.stereoPan ? prediction[controller] : 0
	if (!Number.isFinite(value)) return
	const target = Math.max(-1, Math.min(1, -value))
	// A new target continues from the current audio value, even mid-glide.
	node.pan.setTargetAtTime(target, node.context.currentTime, PAN_TIME_CONSTANT)
}
