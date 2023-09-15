import {changeParameter} from './effect'

export const createDelay = async ( 
	audioContext,
	delayTime = 0.05,
	feedback = 0.4
) => {

	const delayNode = audioContext.createDelay(delayTime)
	delayNode.delayTime.value = delayTime
	
	const feedbackNode = audioContext.createGain(feedback)
	feedbackNode.gain.value = feedback

	// connect the delay node to the feedback node
	// which then feeds back in to delay node
	feedbackNode.connect(delayNode)
	delayNode.connect(audioContext.destination)

	return {
		name:"delay",
		node:feedbackNode,
		feedback:value => changeParameter( feedbackNode, "gain", value), 
		delayTime:value => changeParameter( delayNode, "delayTime", value), 
	}
}