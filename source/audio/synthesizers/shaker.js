import { ZERO } from '../audio-constants.js'
import { chokeGains } from '../synthesizers'
import { DEFAULT_SHAKER_OPTIONS } from './shaker-presets.js'

export * from './shaker-presets.js'

const noiseBufferPairs = new WeakMap()

const getNoiseBuffers = audioContext => {
	let buffers = noiseBufferPairs.get(audioContext)
	if (buffers) return buffers
	const makeNoise = hold => {
		const buffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate)
		const data = buffer.getChannelData(0)
		let value = 0
		for (let index=0; index<data.length; index++) {
			if (index % hold === 0) value = Math.random() * 2 - 1
			data[index] = value
		}
		return buffer
	}
	buffers = { fine:makeNoise(1), coarse:makeNoise(7) }
	noiseBufferPairs.set(audioContext, buffers)
	return buffers
}

/** Noise-particle voice. Fine and sample-held noise can be blended from silky seeds to gritty vintage PCM. */
export const createShaker = (audioContext, output) => {
	const fine = audioContext.createBufferSource()
	const coarse = audioContext.createBufferSource()
	const fineGain = audioContext.createGain()
	const coarseGain = audioContext.createGain()
	const bandpass = audioContext.createBiquadFilter()
	const highpass = audioContext.createBiquadFilter()
	const envelope = audioContext.createGain()
	let isRunning = false

	const buffers = getNoiseBuffers(audioContext)
	fine.buffer = buffers.fine
	coarse.buffer = buffers.coarse
	fine.loop = true
	coarse.loop = true
	bandpass.type = "bandpass"
	highpass.type = "highpass"
	fine.connect(fineGain)
	coarse.connect(coarseGain)
	fineGain.connect(bandpass)
	coarseGain.connect(bandpass)
	bandpass.connect(highpass)
	highpass.connect(envelope)
	envelope.connect(output)

	const shaker = (hitOptions=DEFAULT_SHAKER_OPTIONS) => {
		const options = { ...DEFAULT_SHAKER_OPTIONS, ...hitOptions }
		const requestedTime = options.triggerAt > 0 ? options.triggerAt : audioContext.currentTime + ZERO
		const time = Math.max(audioContext.currentTime, requestedTime)
		const endAt = time + Math.max(0.02, options.length)
		const attackAt = Math.min(endAt, time + Math.max(0.0002, options.attack))
		const decayAt = Math.min(endAt, attackAt + Math.max(0.003, options.decay))
		const peak = Math.max(ZERO, options.velocity * options.outputGain)

		if (!isRunning) {
			fine.start(time)
			coarse.start(time)
			isRunning = true
		}
		fineGain.gain.setValueAtTime(Math.max(0, options.fineLevel), time)
		coarseGain.gain.setValueAtTime(Math.max(0, options.coarseLevel), time)
		bandpass.frequency.setValueAtTime(Math.max(100, options.bandpass), time)
		bandpass.Q.setValueAtTime(Math.max(0.0001, options.bandpassQ), time)
		highpass.frequency.setValueAtTime(Math.max(20, options.highpass), time)
		envelope.gain.cancelScheduledValues(time)
		envelope.gain.setValueAtTime(ZERO, time)
		envelope.gain.exponentialRampToValueAtTime(peak, attackAt)
		envelope.gain.exponentialRampToValueAtTime(Math.max(ZERO, peak * 0.34), decayAt)
		envelope.gain.exponentialRampToValueAtTime(ZERO, endAt)
		return options
	}

	shaker.cancel = () => {
		const now = audioContext.currentTime
		envelope.gain.cancelScheduledValues(now)
		envelope.gain.setValueAtTime(ZERO, now)
	}
	shaker.choke = (duration, chokeAt) => chokeGains(audioContext, [envelope.gain], duration, chokeAt)
	return shaker
}
