import { clamp } from '../../maths/maths.js'

const createImpulse = (audioContext, duration=1.35, decay=3.2) => {
	const length = Math.ceil(audioContext.sampleRate * duration)
	const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate)
	for (let channel=0; channel<2; channel++)
	{
		const data = impulse.getChannelData(channel)
		for (let sample=0; sample<length; sample++)
		{
			const envelope = Math.pow(1 - sample / length, decay)
			data[sample] = (Math.random() * 2 - 1) * envelope
		}
	}
	return impulse
}

export const createSnareReverb = (audioContext, output, initialAmount=0.24) => {
	const input = audioContext.createGain()
	const send = audioContext.createGain()
	const preDelay = audioContext.createDelay(0.1)
	const convolver = audioContext.createConvolver()
	const highpass = audioContext.createBiquadFilter()
	const wet = audioContext.createGain()

	preDelay.delayTime.value = 0.014
	convolver.buffer = createImpulse(audioContext)
	highpass.type = 'highpass'
	highpass.frequency.value = 480
	highpass.Q.value = 0.5
	wet.gain.value = 0.68

	input.connect(output)
	input.connect(send)
	send.connect(preDelay)
	preDelay.connect(convolver)
	convolver.connect(highpass)
	highpass.connect(wet)
	wet.connect(output)

	const setAmount = amount => {
		const value = clamp(Number(amount) || 0, 0, 1)
		send.gain.setTargetAtTime(value, audioContext.currentTime, 0.015)
		return value
	}

	setAmount(initialAmount)
	return { input, setAmount, getAmount:() => send.gain.value }
}
