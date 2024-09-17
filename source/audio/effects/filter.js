import {changeParameter} from './effect'

export const createLowPassFilter = async ( 
	audioContext,
	frequency = 200,
	resonance = 1
) => {

	const biquadFilter = audioContext.createBiquadFilter()
	biquadFilter.type = 'lowpass'
	biquadFilter.frequency.value = frequency
	biquadFilter.Q.value = resonance

	return {
		name:"filter",
		node:biquadFilter,
		frequency:value => changeParameter( biquadFilter, "frequency", value), 
		resonance:value => changeParameter( biquadFilter, "Q", value), 
	}
}

export const createHighPassFilter = async ( 
	audioContext,
	frequency = 900,
	resonance=1
) => {

	const biquadFilter = audioContext.createBiquadFilter()
	biquadFilter.type = 'highpass'
	biquadFilter.frequency.value = frequency
	biquadFilter.Q.value = resonance

	return {
		name:"filter",
		node:biquadFilter,
		frequency:value => changeParameter( biquadFilter, "frequency", value), 
		resonance:value => changeParameter( biquadFilter, "Q", value), 
	}
}