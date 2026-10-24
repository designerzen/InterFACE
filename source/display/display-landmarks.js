export const getPredictionLandmarks = prediction => {
	if (!prediction)
	{
		return []
	}

	return [prediction.faceLandmarks, prediction.keypoints, prediction.landmarks, prediction.allKeypoints]
		.find(points => Array.isArray(points) && points.length > 0) ?? []
}

export const getDisplayColourAlpha = (colours = {}, options = {}) => {
	const alpha = (typeof options.alpha === 'number' ? options.alpha : undefined) ?? colours.a ?? options.opacity ?? 1
	return Number.isFinite(alpha) ? Math.max(0, Math.min(1, alpha)) : 1
}

export const getHolographicDisplayOpacity = person => {
	const percentageDead = Number.isFinite(person?.percentageDead) ? person.percentageDead : 0
	return Math.max(0, Math.min(1, 1 - percentageDead))
}
