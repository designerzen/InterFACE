import { ZERO } from '../audio-constants.js'
import { chokeGains } from '../synthesizers'
import { getVelocityEnvelopeLevels } from './percussion-envelope.js'
import { DEFAULT_HAND_DRUM_OPTIONS } from './hand-drum-presets.js'

export * from './hand-drum-presets.js'

const noiseBuffers = new WeakMap()

const getNoiseBuffer = audioContext => {
	let buffer = noiseBuffers.get(audioContext)
	if (buffer) return buffer
	buffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate)
	const data = buffer.getChannelData(0)
	for (let index=0; index<data.length; index++) data[index] = Math.random() * 2 - 1
	noiseBuffers.set(audioContext, buffer)
	return buffer
}

/** Tuned membrane voice for congas and bongos, with independently shaped body and hand transient. */
export const createHandDrum = (audioContext, output) => {
	const body = audioContext.createOscillator()
	const overtone = audioContext.createOscillator()
	const bodyGain = audioContext.createGain()
	const overtoneGain = audioContext.createGain()
	const transientGain = audioContext.createGain()
	const transient = audioContext.createBufferSource()
	const transientFilter = audioContext.createBiquadFilter()
	let isRunning = false

	body.type = "sine"
	overtone.type = "triangle"
	transient.buffer = getNoiseBuffer(audioContext)
	transient.loop = true
	transientFilter.type = "bandpass"

	body.connect(bodyGain)
	overtone.connect(overtoneGain)
	transient.connect(transientFilter)
	transientFilter.connect(transientGain)
	bodyGain.connect(output)
	overtoneGain.connect(output)
	transientGain.connect(output)

	const handDrum = (hitOptions=DEFAULT_HAND_DRUM_OPTIONS) => {
		const options = { ...DEFAULT_HAND_DRUM_OPTIONS, ...hitOptions }
		const requestedTime = options.triggerAt > 0 ? options.triggerAt : audioContext.currentTime + ZERO
		const time = Math.max(audioContext.currentTime, requestedTime)
		const endAt = time + Math.max(0.025, options.length)
		const attackAt = Math.min(endAt, time + Math.max(0.0002, options.attack))
		const decayAt = Math.min(endAt, attackAt + Math.max(0.002, options.decay))
		const bendAt = Math.min(endAt, time + Math.max(0.003, options.pitchBendTime))
		const frequency = Math.max(35, options.frequency)
		const levels = getVelocityEnvelopeLevels(options, options.outputGain)

		if (!isRunning) {
			body.start(time)
			overtone.start(time)
			transient.start(time)
			isRunning = true
		}

		body.frequency.cancelScheduledValues(time)
		body.frequency.setValueAtTime(frequency * Math.max(1, options.pitchBend), time)
		body.frequency.exponentialRampToValueAtTime(frequency, bendAt)
		overtone.frequency.cancelScheduledValues(time)
		overtone.frequency.setValueAtTime(frequency * options.overtoneRatio * Math.max(1, options.pitchBend * 0.92), time)
		overtone.frequency.exponentialRampToValueAtTime(frequency * options.overtoneRatio, bendAt)

		transientFilter.frequency.cancelScheduledValues(time)
		transientFilter.frequency.setValueAtTime(Math.max(80, options.noiseFrequency), time)
		transientFilter.Q.setValueAtTime(Math.max(0.0001, options.noiseQ), time)

		for (const [parameter, peak] of [
			[bodyGain.gain, levels.peak],
			[overtoneGain.gain, levels.peak * options.overtoneLevel],
		]) {
			parameter.cancelScheduledValues(time)
			parameter.setValueAtTime(ZERO, time)
			parameter.exponentialRampToValueAtTime(Math.max(ZERO, peak), attackAt)
			parameter.exponentialRampToValueAtTime(Math.max(ZERO, levels.sustain * (peak / levels.peak || 0)), decayAt)
			parameter.exponentialRampToValueAtTime(ZERO, endAt)
		}

		const transientEnd = Math.min(endAt, time + 0.035)
		transientGain.gain.cancelScheduledValues(time)
		transientGain.gain.setValueAtTime(Math.max(ZERO, levels.peak * options.noiseLevel), time)
		transientGain.gain.exponentialRampToValueAtTime(ZERO, transientEnd)
		return options
	}

	handDrum.cancel = () => {
		const now = audioContext.currentTime
		for (const gain of [bodyGain.gain, overtoneGain.gain, transientGain.gain]) {
			gain.cancelScheduledValues(now)
			gain.setValueAtTime(ZERO, now)
		}
	}
	handDrum.choke = (duration, chokeAt) => chokeGains(
		audioContext, [bodyGain.gain, overtoneGain.gain, transientGain.gain], duration, chokeAt
	)
	return handDrum
}
