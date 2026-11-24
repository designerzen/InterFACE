/**
 * TODO: Implement a cache of eyes so that we can learn on the go
 * @param {Object} prediction - ML vision-kit model
 * @param {Number} time - time elapsed
 * @param {Boolean} flipHorizontally - are we flipping the data?
 * @returns {Object} enhanced prediction with extra info and data
 */
export declare const enhanceFaceLandmarksModelPrediction: (faceLandmarks: any, faceBlendshapes: any, facialTransformationMatrixes: any, time: number, flipHorizontally?: boolean) => Object;
