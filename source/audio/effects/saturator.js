import {changeParameter} from './effect'

// https://codepen.io/cuttybang/pen/QNmJKd
const createFilterCurve = ( quantity = 8192) => { 
	const table = new Float32Array(quantity)
	let	i, x

    for (i = 0; i < quantity; i++) 
		{
          x = i * 2 / quantity - 1
          if (x < -0.08905) {
              table[i] = (-3 / 4) * (1 - (Math.pow((1 - (Math.abs(x) - 0.032857)), 12)) + (1 / 3) * (Math.abs(x) - 0.032847)) + 0.01
          } else if (x >= -0.08905 && x < 0.320018) {
              table[i] = (-6.153 * (x * x)) + 3.9375 * x
          } else {
              table[i] = 0.630035
          }
      }
      return table
}

export const createSaturationFilter = async ( 
	audioContext,
	oversample = 'none'
) => {
	
	const saturate = audioContext.createWaveShaper()
	saturate.curve = createFilterCurve()
	saturate.oversample = oversample

	return {
		name:"saturater",
		node:saturate,
		//  filter.frequency.value
		frequency:value => changeParameter( filter, "frequency", value), 
		// filter.Q.value = res
		resonance:value => changeParameter( filter, "Q", value), 
	}
}