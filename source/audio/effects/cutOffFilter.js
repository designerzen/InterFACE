import {changeParameter} from './effect'

export const createCutOffFilter = async ( 
	audioContext,
	frequency = 100
) => {

	const filter = audioContext.createBiquadFilter()
	filter.frequency.value = frequency
	filter.connect(dynamics)
	
	return {
		name:"filter",
		node:filter,
		//  filter.frequency.value
		frequency:value => changeParameter( filter, "frequency", value), 
		// filter.Q.value = res
		resonance:value => changeParameter( filter, "Q", value), 
	}
}