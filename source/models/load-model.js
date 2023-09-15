export const loadMLModel = async (type) => {
	
	switch (type)
	{
		// Uses TensorFlow @media pipe but not @media-pipe/vision
		case "old":
			// const {loadFaceModel} = await import('./face')
			// return loadFaceModel
			
		// TODO: Models changing all the time I can't keep up!
		case "body":
			// const {loadBodyModel} = await import('./body')
			// return loadBodyModel
		
		// Face
		default:
			const {loadFaceLandmarksModel} = await import('./face-landmarks')
			return loadFaceLandmarksModel
	}
}
