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
	const alpha = options.alpha ?? colours.a ?? options.opacity ?? 1
	return Number.isFinite(alpha) ? alpha : 1
}

export const getHolographicDisplayOpacity = person => {
	const percentageDead = Number.isFinite(person?.percentageDead) ? person.percentageDead : 0
	return Math.max(0, Math.min(1, 1 - percentageDead))
}
