export const getPredictionLandmarks = prediction => {
	if (!prediction)
	{
		return []
	}

	return prediction.keypoints ||
		prediction.faceLandmarks ||
		prediction.landmarks ||
		prediction.allKeypoints ||
		[]
}

export const getDisplayColourAlpha = (colours = {}, options = {}) => {
	const alpha = options.alpha ?? options.opacity ?? colours.a ?? 1
	return Number.isFinite(alpha) ? alpha : 1
}
