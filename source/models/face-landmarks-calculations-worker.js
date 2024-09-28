
// input prediction
// output prediction & ...object updates

import { enhanceFaceLandmarksModelPrediction } from "./face-landmarks-calculations"

// Pass prediction into the worker
// TODO: pass PREDICTIONS
self.onmessage = async (e, transferables) => {

    const { faceLandmarks, faceBlendshapes, facialTransformationMatrixes, time, flipHorizontally} = e.data
	const prediction = enhanceFaceLandmarksModelPrediction( faceLandmarks, faceBlendshapes, facialTransformationMatrixes, time, flipHorizontally) 
	// console.error("Landmark calc worker", e,  { faceLandmarks, faceBlendshapes, facialTransformationMatrixes, time, flipHorizontally} )
	postMessage( prediction )
}
