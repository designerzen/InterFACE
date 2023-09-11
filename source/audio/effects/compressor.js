import {changeParameter} from './effect'

export const createCompressor = async ( 
	audioContext,
	// decibel value above which the compression will start taking effect.
	threshold = -100,
	// decibel value representing the range above the threshold where the curve smoothly transitions to the compressed portion.
	knee = 40,
	// amount of change, in dB, needed in the input for a 1 dB change in the output.
	ratio = 22,
	// amount of time, in seconds, required to reduce the gain by 10 dB.
	attack = 0,
	// amount of time, in seconds, required to increase the gain by 10 dB.
	release = 0.25,
	// Is a float representing the amount of gain reduction currently applied by the compressor to the signal.
	reduction = 0
	
) => {

	const compressor = audioContext.createDynamicsCompressor()
	// 	threshold: [-100, 0],
	// 	knee: [0, 40],
	// 	ratio: [1, 20],
	// 	attack: [0, 1],
	// 	release: [0, 1]
//	compressor.reduction.value = reduction
	compressor.threshold.value = threshold
	compressor.knee.value = knee
	compressor.ratio.value = ratio
	compressor.attack.value = attack
	compressor.release.value = release

	return {
		name:"compressor",
		node:compressor,
		knee:value => changeParameter( compressor, "knee", value),
		threshold:value => changeParameter( compressor, "threshold", value),
		ratio:value => changeParameter( compressor, "ratio", value),
		attack:value => changeParameter( compressor, "attack", value),
		release:value => changeParameter( compressor, "release", value)
	}
}

