import { ZERO } from '../audio-constants.js'
import { chokeGains } from '../synthesizers'
import { getVelocityEnvelopeLevels } from './percussion-envelope.js'
import { DEFAULT_TRIANGLE_OPTIONS } from './triangle-presets.js'

export * from './triangle-presets.js'

const reverbImpulses = new WeakMap()

const getTriangleReverbImpulse = audioContext => {
	let impulse = reverbImpulses.get(audioContext)
	if (impulse) return impulse
	const duration = 0.24
	const length = Math.ceil(audioContext.sampleRate * duration)
	impulse = audioContext.createBuffer(2, length, audioContext.sampleRate)
	for (let channel=0; channel<2; channel++) {
		const data = impulse.getChannelData(channel)
		for (let sample=0; sample<length; sample++) {
			const decay = (1 - sample / length) ** 6.5
			data[sample] = (Math.random() * 2 - 1) * decay
		}
	}
	reverbImpulses.set(audioContext, impulse)
	return impulse
}

const centsRatio = cents => 2 ** (cents / 1200)

/** Inharmonic modal bank for struck-metal triangle sounds, including open and hand-muted decays. */
export const createTriangle = (audioContext, output, random=Math.random) => {
	const highpass = audioContext.createBiquadFilter()
	const envelope = audioContext.createGain()
	const reverbSend = audioContext.createGain()
	const preDelay = audioContext.createDelay(0.03)
	const convolver = audioContext.createConvolver()
	const reverbHighpass = audioContext.createBiquadFilter()
	const reverbWet = audioContext.createGain()
	const oscillators = DEFAULT_TRIANGLE_OPTIONS.partialRatios.map(() => audioContext.createOscillator())
	const partialGains = oscillators.map(() => audioContext.createGain())
	let isRunning = false
	highpass.type = "highpass"
	preDelay.delayTime.value = 0.006
	convolver.buffer = getTriangleReverbImpulse(audioContext)
	convolver.normalize = true
	reverbHighpass.type = "highpass"
	reverbHighpass.frequency.value = 2800
	reverbHighpass.Q.value = 0.45
	reverbWet.gain.value = 0.3

	oscillators.forEach((oscillator, index) => {
		oscillator.type = "sine"
		oscillator.connect(partialGains[index])
		partialGains[index].connect(highpass)
	})
	highpass.connect(envelope)
	envelope.connect(output)
	envelope.connect(reverbSend)
	reverbSend.connect(preDelay)
	preDelay.connect(convolver)
	convolver.connect(reverbHighpass)
	reverbHighpass.connect(reverbWet)
	reverbWet.connect(output)

	const triangle = (hitOptions=DEFAULT_TRIANGLE_OPTIONS) => {
		const options = { ...DEFAULT_TRIANGLE_OPTIONS, ...hitOptions }
		const requestedTime = options.triggerAt > 0 ? options.triggerAt : audioContext.currentTime + ZERO
		const time = Math.max(audioContext.currentTime, requestedTime)
		const vary = amount => (random() * 2 - 1) * amount
		const frequency = options.frequency * centsRatio(vary(options.pitchVariation))
		const length = Math.max(0.025, options.length * (1 + vary(options.lengthVariation)))
		const endAt = time + length
		const attackAt = Math.min(endAt, time + Math.max(0.0002, options.attack))
		const decayAt = Math.min(endAt, attackAt + Math.max(0.002, options.decay))
		const levels = getVelocityEnvelopeLevels(options, options.outputGain)

		if (!isRunning) {
			oscillators.forEach(oscillator => oscillator.start(time))
			isRunning = true
		}
		oscillators.forEach((oscillator, index) => {
			const ratio = options.partialRatios[index] ?? DEFAULT_TRIANGLE_OPTIONS.partialRatios[index]
			const variedRatio = ratio * centsRatio(vary(options.modeVariation))
			const level = (options.partialLevels[index] ?? 0) * (1 + vary(options.levelVariation))
			oscillator.frequency.setValueAtTime(Math.max(40, frequency * variedRatio), time)
			const partialGain = partialGains[index].gain
			const partialEndAt = time + length * Math.max(0.35, 0.72 - index * 0.08)
			partialGain.cancelScheduledValues(time)
			partialGain.setValueAtTime(Math.max(ZERO, level), time)
			partialGain.exponentialRampToValueAtTime(ZERO, partialEndAt)
		})
		highpass.frequency.setValueAtTime(Math.max(20, options.highpass), time)
		reverbSend.gain.setValueAtTime(Math.max(0, Math.min(0.5, options.reverb)), time)
		envelope.gain.cancelScheduledValues(time)
		envelope.gain.setValueAtTime(ZERO, time)
		envelope.gain.exponentialRampToValueAtTime(Math.max(ZERO, levels.peak), attackAt)
		envelope.gain.exponentialRampToValueAtTime(Math.max(ZERO, levels.sustain), decayAt)
		envelope.gain.exponentialRampToValueAtTime(ZERO, endAt)
		return { ...options, frequency, length }
	}

	triangle.cancel = () => {
		const now = audioContext.currentTime
		envelope.gain.cancelScheduledValues(now)
		envelope.gain.setValueAtTime(ZERO, now)
	}
	triangle.choke = (duration, chokeAt) => chokeGains(audioContext, [envelope.gain], duration, chokeAt)
	return triangle
}
