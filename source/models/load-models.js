export const loadMLModels = async (types=[], loadProgress=()=>{} ) => {
	
	const dictionary = {}
	const models = types.map( async (type, i) => {
		loadProgress(i / types.length, type)
		switch (type)
		{		
			// TODO:
			// case "body":
				// const {loadBodyModel} = await import('./body-tracking.js')
				// return loadBodyModel
			
			// Hands only
			case "hands":
				const {loadHandTrackingModel} = await import('./hand-tracking.js')
				dictionary[type] = loadHandTrackingModel
				return loadHandTrackingModel

			// Face Landmarks
			case "face-gpu":
				const faceLandmarkerGPU = await import('./face-landmarks-gpu.js')
				dictionary[type] = faceLandmarkerGPU.loadFaceLandmarksModel
				return faceLandmarkerGPU.loadFaceLandmarksModel

			// Face Landmarks
			default:
				const faceLandmarker = await import('./face-landmarks.js')
				dictionary[type] = faceLandmarker.loadFaceLandmarksModel
				return faceLandmarker.loadFaceLandmarksModel
		}
	})

	await Promise.all( models )
	// return loaded model loaders
	return dictionary
}
