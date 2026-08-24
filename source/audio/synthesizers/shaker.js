import { ZERO } from '../audio-constants.js'
import { chokeGains } from '../synthesizers'
import { DEFAULT_SHAKER_OPTIONS } from './shaker-presets.js'

export * from './shaker-presets.js'

const particleBanks = new WeakMap()
const MAX_BANKS_PER_CONTEXT = 24
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value))

const getDensity = velocity => velocity < 0.34 ? 0.28 : velocity < 0.68 ? 0.62 : 1

const getStrokeLevel = (phase, attackRatio, releaseRatio) => {
	if (phase <= attackRatio) return (phase / attackRatio) ** 1.5
	if (phase >= releaseRatio) return ((1 - phase) / (1 - releaseRatio)) ** 1.7
	const travel = (phase - attackRatio) / Math.max(0.001, releaseRatio - attackRatio)
	return 1 - travel * 0.22
}

const normalizeBuffer = data => {
	let peak = 0
	for (const sample of data) peak = Math.max(peak, Math.abs(sample))
	if (peak <= 0) return
	const scale = 0.72 / peak
	for (let index=0; index<data.length; index++) data[index] *= scale
}

const createParticleBufferPair = (audioContext, options, density, random) => {
	const sampleRate = audioContext.sampleRate
	const duration = Math.max(0.02, Number(options.length) || DEFAULT_SHAKER_OPTIONS.length)
	const sampleCount = Math.max(2, Math.ceil(duration * sampleRate))
	const fineBuffer = audioContext.createBuffer(1, sampleCount, sampleRate)
	const coarseBuffer = audioContext.createBuffer(1, sampleCount, sampleRate)
	const fineData = fineBuffer.getChannelData(0)
	const coarseData = coarseBuffer.getChannelData(0)
	const attackRatio = clamp((Number(options.attack) || 0.012) / duration, 0.025, 0.35)
	const releaseRatio = clamp(1 - (Number(options.release) || 0.045) / duration, attackRatio + 0.08, 0.94)
	const collisionCount = Math.max(5, Math.round((8 + duration * 70) * (0.45 + density * 0.75)))
	const fineDecay = clamp((Number(options.decay) || 0.05) * 0.05, 0.0018, 0.006)
	const coarseDecay = clamp((Number(options.decay) || 0.05) * 0.12, 0.004, 0.012)

	for (let collision=0; collision<collisionCount; collision++) {
		let phase = 0.5
		let strokeLevel = 1
		for (let attempt=0; attempt<16; attempt++) {
			phase = 0.015 + random() * 0.97
			strokeLevel = getStrokeLevel(phase, attackRatio, releaseRatio)
			if (random() <= strokeLevel) break
		}

		const start = Math.floor(phase * (sampleCount - 1))
		const strength = (0.32 + random() * 0.68) * strokeLevel
		const fineAttack = Math.max(1, Math.round(sampleRate * (0.0002 + random() * 0.00055)))
		const coarseAttack = Math.max(1, Math.round(sampleRate * (0.0004 + random() * 0.0007)))
		const fineLength = Math.max(fineAttack + 1, Math.round(sampleRate * fineDecay * (0.75 + random() * 0.5)))
		const coarseLength = Math.max(coarseAttack + 1, Math.round(sampleRate * coarseDecay * (0.75 + random() * 0.5)))
		const coarseHold = 3 + Math.floor(random() * 6)
		let coarseNoise = random() * 2 - 1

		for (let offset=0; offset<Math.max(fineLength, coarseLength) && start+offset<sampleCount; offset++) {
			if (offset < fineLength) {
				const envelope = offset < fineAttack
					? offset / fineAttack
					: Math.exp(-5 * (offset - fineAttack) / Math.max(1, fineLength - fineAttack))
				fineData[start+offset] += (random() * 2 - 1) * strength * envelope
			}
			if (offset < coarseLength) {
				if (offset % coarseHold === 0) coarseNoise = random() * 2 - 1
				const envelope = offset < coarseAttack
					? offset / coarseAttack
					: Math.exp(-4.2 * (offset - coarseAttack) / Math.max(1, coarseLength - coarseAttack))
				coarseData[start+offset] += coarseNoise * strength * envelope
			}
		}
	}

	const taperSamples = Math.min(Math.floor(sampleCount / 4), Math.max(2, Math.round(sampleRate * 0.006)))
	for (let offset=0; offset<taperSamples; offset++) {
		const level = offset / taperSamples
		fineData[offset] *= level
		coarseData[offset] *= level
		const endIndex = sampleCount - 1 - offset
		fineData[endIndex] *= level
		coarseData[endIndex] *= level
	}
	normalizeBuffer(fineData)
	normalizeBuffer(coarseData)
	return { fineBuffer, coarseBuffer }
}

const getParticleBank = (audioContext, options, density, random) => {
	let contextBanks = particleBanks.get(audioContext)
	if (!contextBanks) {
		contextBanks = new Map()
		particleBanks.set(audioContext, contextBanks)
	}
	const variants = clamp(Math.round(Number(options.bufferVariants) || 10), 4, 16)
	const key = [
		Math.round(Math.max(0.02, options.length) * 1000),
		Math.round(Math.max(0.001, options.attack) * 1000),
		Math.round(Math.max(0.003, options.decay) * 1000),
		Math.round(Math.max(0.003, options.release) * 1000),
		density,
		variants,
	].join(':')
	let bank = contextBanks.get(key)
	if (!bank) {
		bank = Array.from({ length:variants }, () => createParticleBufferPair(audioContext, options, density, random))
		contextBanks.set(key, bank)
		if (contextBanks.size > MAX_BANKS_PER_CONTEXT) contextBanks.delete(contextBanks.keys().next().value)
	}
	return bank
}

const setParam = (parameter, value, time) => {
	parameter.value = value
	parameter.setValueAtTime(value, time)
}

/** Cached particle-collision buffers played through per-hit native Web Audio graphs. */
export const createShaker = (audioContext, output, random=Math.random) => {
	const activeHits = new Set()
	let panDirection = -1

	const shaker = (hitOptions=DEFAULT_SHAKER_OPTIONS) => {
		const options = { ...DEFAULT_SHAKER_OPTIONS, ...hitOptions }
		const requestedTime = Number(options.triggerAt)
		const time = Number.isFinite(requestedTime) && requestedTime > 0
			? Math.max(audioContext.currentTime, requestedTime)
			: audioContext.currentTime + ZERO
		const velocity = clamp(Number(options.velocity) || 0, 0, 1)
		const density = getDensity(velocity)
		const bank = getParticleBank(audioContext, options, density, random)
		const variant = bank[Math.min(bank.length - 1, Math.floor(random() * bank.length))]
		const durationVariation = clamp(Number(options.durationVariation) || 0, 0, 0.2)
		const durationScale = 1 + (random() * 2 - 1) * durationVariation
		const playbackRate = 1 / durationScale
		const duration = variant.fineBuffer.duration * durationScale
		const endAt = time + duration
		const frequencyVariation = 1 + (random() * 2 - 1) * clamp(Number(options.filterVariation) || 0, 0, 0.2)
		const brightness = 0.76 + velocity * 0.24
		const nyquistLimit = audioContext.sampleRate * 0.45
		const safeFrequency = value => clamp(value, 20, nyquistLimit)

		const fine = audioContext.createBufferSource()
		const coarse = audioContext.createBufferSource()
		const fineHighpass = audioContext.createBiquadFilter()
		const fineBandpass = audioContext.createBiquadFilter()
		const fineLowpass = audioContext.createBiquadFilter()
		const seedBandpass = audioContext.createBiquadFilter()
		const bodyBandpass = audioContext.createBiquadFilter()
		const fineGain = audioContext.createGain()
		const coarseGain = audioContext.createGain()
		const bodyGain = audioContext.createGain()
		const hitGain = audioContext.createGain()
		const panner = typeof audioContext.createStereoPanner === 'function'
			? audioContext.createStereoPanner()
			: null

		fine.buffer = variant.fineBuffer
		coarse.buffer = variant.coarseBuffer
		setParam(fine.playbackRate, playbackRate, time)
		setParam(coarse.playbackRate, playbackRate, time)
		fineHighpass.type = 'highpass'
		fineBandpass.type = 'bandpass'
		fineLowpass.type = 'lowpass'
		seedBandpass.type = 'bandpass'
		bodyBandpass.type = 'bandpass'
		setParam(fineHighpass.frequency, safeFrequency(options.highpass * brightness * frequencyVariation), time)
		setParam(fineBandpass.frequency, safeFrequency(options.bandpass * brightness * frequencyVariation), time)
		setParam(fineBandpass.Q, Math.max(0.0001, options.bandpassQ), time)
		setParam(fineLowpass.frequency, safeFrequency(options.lowpass * frequencyVariation), time)
		setParam(fineLowpass.Q, 0.45, time)
		setParam(seedBandpass.frequency, safeFrequency(options.seedFrequency * brightness * frequencyVariation), time)
		setParam(seedBandpass.Q, Math.max(0.0001, options.seedQ), time)
		setParam(bodyBandpass.frequency, safeFrequency(options.bodyFrequency * frequencyVariation), time)
		setParam(bodyBandpass.Q, Math.max(0.0001, options.bodyQ), time)
		setParam(fineGain.gain, Math.max(0, options.fineLevel), time)
		setParam(coarseGain.gain, Math.max(0, options.coarseLevel), time)
		setParam(bodyGain.gain, Math.max(0, options.bodyLevel), time)

		const peak = Math.max(ZERO, options.outputGain * velocity ** Math.max(1, options.velocityCurve))
		setParam(hitGain.gain, peak, time)
		hitGain.gain.setValueAtTime(peak, Math.max(time, endAt - 0.006))
		hitGain.gain.exponentialRampToValueAtTime(ZERO, endAt)

		fine.connect(fineHighpass)
		fineHighpass.connect(fineBandpass)
		fineBandpass.connect(fineLowpass)
		fineLowpass.connect(fineGain)
		fineGain.connect(hitGain)
		coarse.connect(seedBandpass)
		seedBandpass.connect(coarseGain)
		coarseGain.connect(hitGain)
		coarse.connect(bodyBandpass)
		bodyBandpass.connect(bodyGain)
		bodyGain.connect(hitGain)
		if (panner) {
			panDirection *= -1
			const pan = panDirection * clamp(options.panWidth, 0, 0.15) * (0.6 + random() * 0.4)
			setParam(panner.pan, pan, time)
			hitGain.connect(panner)
			panner.connect(output)
		} else {
			hitGain.connect(output)
		}

		const nodes = [fine, coarse, fineHighpass, fineBandpass, fineLowpass, seedBandpass, bodyBandpass,
			fineGain, coarseGain, bodyGain, hitGain, panner].filter(Boolean)
		const hit = { gain:hitGain.gain, nodes }
		activeHits.add(hit)
		fine.onended = () => {
			activeHits.delete(hit)
			for (const node of nodes) node.disconnect?.()
		}
		fine.start(time)
		coarse.start(time)
		return options
	}

	shaker.cancel = () => {
		const now = audioContext.currentTime
		for (const hit of activeHits) {
			hit.gain.cancelScheduledValues(now)
			hit.gain.setValueAtTime(ZERO, now)
		}
	}
	shaker.choke = (duration, chokeAt) => chokeGains(
		audioContext,
		[...activeHits].map(hit => hit.gain),
		duration,
		chokeAt
	)
	return shaker
}
