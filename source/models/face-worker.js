

import { enhanceFaceModelPrediction} from './face-model-calculations'

// input prediction
// output prediction & ...object updates

// Pass prediction into the worker
// TODO: pass PREDICTIONS
self.onmessage = prediction => {

	// Clone the object??? or too much performance hit for immutibility?
	const output = enhanceFaceModelPrediction(prediction.data)

	// magic tricks...
	postMessage( output )
}
