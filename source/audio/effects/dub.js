import {changeParameter} from './effect'


export const createDub = async ( 
	audioContext,
	delayTime = 0.5,
	feedback = 0.4,
	filter = 1000,
	maxDelayTime = 2.5
	
) => {
	
	const dubDelay = audioContext.createDelay(maxDelayTime)
	dubDelay.delayTime.value = delayTime
	
	const feedbackNode = audioContext.createGain()
	feedbackNode.gain.value = feedback

	// low pass it for that authentic dubby feeling
	const filterNode = audioContext.createBiquadFilter()
	filterNode.frequency.value = filter

	dubDelay.connect(feedbackNode)
	feedbackNode.connect(filterNode)
	filterNode.connect(dubDelay)
	// dubDelay.connect(context.destination)

	return {
		name:"dub",
		node:dubDelay,
		delayTime:value => changeParameter( dubDelay, "delayTime", value),
		feedback:value => changeParameter( feedbackNode, "gain", value),
		filter:value => changeParameter( filterNode, "frequency", value) 
	}
}