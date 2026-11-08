import { clamp } from '../../maths/maths.js'
import { generateRoomImpulse } from './reverb-spaces.js'

// A tight, slightly bright room; the pre-delay node below spaces it from the hit
const impulses = new WeakMap()
const createImpulse = audioContext => {
	let impulse = impulses.get(audioContext)
	if (!impulse) {
		impulse = generateRoomImpulse(audioContext, { length:1.2, tone:0.2, preDelay:0 })
		impulses.set(audioContext, impulse)
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
