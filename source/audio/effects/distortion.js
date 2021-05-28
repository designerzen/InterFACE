function makeDistortionCurve(amount) {
	var k = typeof amount === 'number' ? amount : 50,
		n_samples = 44100,
		curve = new Float32Array(n_samples),
		deg = Math.PI / 180,
		i = 0,
		x;
	for ( ; i < n_samples; ++i ) {
		x = i * 2 / n_samples - 1;
		curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
	}
	return curve;
}


export const createDistortion = async ( 
	audioContext,
	curve = 1,
	oversample = '4x'
	
) => {

	const distortionNode = audioContext.createWaveShaper()
	distortionNode.oversample = oversample
	distortionNode.curve = makeDistortionCurve(curve)

	return {
		name:"distortion",
		node:distortionNode,
		curve:value => distortionNode.curve = makeDistortionCurve(value),
		oversample:value => distortionNode.oversample = value
	}
}
