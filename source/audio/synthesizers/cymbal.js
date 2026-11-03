import { ZERO } from '../audio-constants.js'
import { getVelocityTone } from './percussion-envelope.js'

const caches = new WeakMap()
const MAX_BANKS = 12
const MAX_CACHE_SECONDS = 32
const MAX_VOICES = 8
const VARIANTS = 2
const clamp = (value, low, high) => Math.min(high, Math.max(low, value))

// Damped inharmonic modes are calculated once, using a recurrence rather than
// sin/exp per sample. The audio thread only plays a buffer through three filters.
const renderCymbal = (context, options, variant) => {
	const sampleRate = context.sampleRate
	const length = Math.ceil(options.length * sampleRate)
	const buffer = context.createBuffer(1, length, sampleRate)
	const data = buffer.getChannelData(0)
	const ratios = options.ratios
	const modeCount = ratios.length * 4
	const metallicLevel = 1.35 * options.metallicGain / Math.sqrt(modeCount)
	const families = options.type === 'sine' ? [2.3, 5.1, 11.27, 19.43] : [5.1, 11.27, 19.43, 31.87]
	for (let mode=0; mode<modeCount; mode++) {
		const family = Math.floor(mode / ratios.length)
		const frequency = options.fundamental * ratios[mode % ratios.length] * families[family]
			* (1 + (variant ? 1 : -1) * 0.0015 * (mode % 3))
		if (frequency >= sampleRate * 0.45) continue
		const angle = 2 * Math.PI * frequency / sampleRate
		const decay = Math.exp(-(3.5 + family * 2.1) / length)
		const coefficient = 2 * decay * Math.cos(angle)
		const squaredDecay = decay * decay
		const phase = mode * 1.618 + variant * 0.73
		let previous = Math.sin(phase - angle) / decay
		let current = Math.sin(phase)
		const level = metallicLevel * (options.type === 'triangle' ? 1 / (1 + family * 0.35) : 1)
		for (let sample=0; sample<length; sample++) {
			data[sample] += current * level
			const next = coefficient * current - squaredDecay * previous
			previous = current
			current = next
		}
	}
	// A little diffuse excitation fills the spaces between the ringing modes.
	let seed = (0x12345678 + variant * 7919) >>> 0
	const noiseDecay = Math.exp(-5 / length)
	let noiseLevel = Math.max(options.noiseGain, options.metallicGain * 0.025)
	const noiseHighpass = 1 - Math.exp(-2 * Math.PI * clamp(options.noiseHighpass, 20, sampleRate * 0.45) / sampleRate)
	const noiseLowpass = 1 - Math.exp(-2 * Math.PI * clamp(options.noiseLowpass, 20, sampleRate * 0.45) / sampleRate)
	let low = 0, high = 0
	let noiseTail = 1
	const noiseTailDecay = Math.exp(-1 / Math.max(1, options.noiseDecay * sampleRate))
	const noiseAttackSamples = Math.max(1, options.noiseAttack * sampleRate)
	const taper = Math.min(Math.floor(length / 2), Math.ceil(sampleRate * 0.002))
	let peak = 0
	for (let sample=0; sample<length; sample++) {
		seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
		const noise = seed / 2147483648 - 1
		low += noiseHighpass * (noise - low)
		high += noiseLowpass * (noise - low - high)
		const noiseAttack = Math.min(1, sample / noiseAttackSamples)
		data[sample] += high * noiseLevel * noiseAttack * (0.4 + 0.6 * noiseTail)
		noiseTail *= noiseTailDecay
		noiseLevel *= noiseDecay
		data[sample] *= Math.min(1, sample / taper, (length - 1 - sample) / taper)
		peak = Math.max(peak, Math.abs(data[sample]))
	}
	if (peak > 0.9) {
		for (let sample=0; sample<length; sample++) data[sample] *= 0.9 / peak
	}
	return buffer
}

const getBank = (context, options) => {
	let cache = caches.get(context)
	if (!cache) {
		cache = { banks:new Map(), frames:0 }
		caches.set(context, cache)
	}
	const key = [options.length, options.fundamental, options.ratios.join(','), options.type, options.metallicGain,
		options.noiseGain, options.noiseHighpass, options.noiseLowpass, options.noiseAttack, options.noiseDecay].join(':')
	let bank = cache.banks.get(key)
	if (bank) {
		cache.banks.delete(key)
		cache.banks.set(key, bank)
		return bank
	}
	bank = { buffers:Array.from({ length:VARIANTS }, (_, index) => renderCymbal(context, options, index)), index:0 }
	bank.frames = Math.ceil(options.length * context.sampleRate) * VARIANTS
	cache.banks.set(key, bank)
	cache.frames += bank.frames
	while (cache.banks.size > MAX_BANKS || cache.frames > context.sampleRate * MAX_CACHE_SECONDS) {
		const oldest = cache.banks.keys().next().value
		cache.frames -= cache.banks.get(oldest).frames
		cache.banks.delete(oldest)
	}
	return bank
}

const levelAt = (hit, time) => {
	if (time < hit.points[0].time || time >= hit.endAt) return ZERO
	for (let index=1; index<hit.points.length; index++) {
		const from = hit.points[index - 1]
		const to = hit.points[index]
		if (time <= to.time) {
			const phase = (time - from.time) / Math.max(ZERO, to.time - from.time)
			return from.value + (to.value - from.value) * phase
		}
	}
	return ZERO
}

export const createCymbal = (context, output) => {
	const hits = new Set()
	const chokeHit = (hit, time, duration=0.005) => {
		if (hit.endAt <= time) return
		const value = Math.max(ZERO, levelAt(hit, time))
		hit.gain.cancelScheduledValues(time)
		if (time > hit.points[0].time) hit.gain.linearRampToValueAtTime(value, time)
		hit.gain.setValueAtTime(value, time)
		hit.endAt = Math.min(hit.endAt, time + Math.max(0.001, duration))
		hit.gain.linearRampToValueAtTime(ZERO, hit.endAt)
		hit.points = hit.points.filter(point => point.time < time)
		hit.points.push({ time, value }, { time:hit.endAt, value:ZERO })
		hit.source.stop(hit.endAt)
	}
	const cymbal = options => {
		// Very long custom effects can still use the live synthesis path.
		if (!(options.length >= 0.02 && options.length <= 8)) return false
		const bank = getBank(context, options)
		const time = options.triggerAt > 0 ? Math.max(context.currentTime, options.triggerAt) : context.currentTime + ZERO
		// Keep references until audio time actually passes the tail, so an early
		// cancel also stops hits preceding a later, non-overlapping lookahead hit.
		for (const hit of hits) if (hit.endAt <= context.currentTime) hits.delete(hit)
		const active = [...hits].filter(hit => !hit.stolen && hit.endAt > time)
		if (active.length >= MAX_VOICES) {
			const oldest = active.reduce((first, hit) => hit.points[0].time < first.points[0].time ? hit : first)
			chokeHit(oldest, Math.max(context.currentTime, time - 0.005))
			oldest.stolen = true
		}
		const source = context.createBufferSource()
		const bandpass = context.createBiquadFilter()
		const highpass = context.createBiquadFilter()
		const lowpass = context.createBiquadFilter()
		const gain = context.createGain()
		const brightness = getVelocityTone(options)
		const safe = frequency => clamp(frequency * brightness, 20, context.sampleRate * 0.45)
		source.buffer = bank.buffers[bank.index++ % VARIANTS]
		bandpass.type = 'bandpass'
		bandpass.frequency.value = safe(options.bandpass)
		bandpass.Q.value = options.bandpassQ
		highpass.type = 'highpass'
		highpass.frequency.value = safe(options.highpass)
		lowpass.type = 'lowpass'
		lowpass.Q.value = 0.45
		lowpass.frequency.setValueAtTime(safe(options.lowpass), time)
		lowpass.frequency.exponentialRampToValueAtTime(safe(options.lowpass * 0.72), time + options.length)
		const endAt = time + options.length
		const attackEndAt = Math.min(endAt, time + Math.max(ZERO, options.attack))
		const decayEndAt = Math.min(endAt, attackEndAt + Math.max(0, options.decay))
		const releaseAt = Math.max(decayEndAt, endAt - Math.max(0, options.release))
		const peak = Math.max(ZERO, Number(options.velocity) || 0)
		const sustain = Math.max(ZERO, peak * options.sustain)
		const points = [
			{ time, value:ZERO }, { time:attackEndAt, value:peak },
			{ time:decayEndAt, value:sustain }, { time:releaseAt, value:sustain }, { time:endAt, value:ZERO },
		]
		gain.gain.setValueAtTime(ZERO, time)
		for (const point of points.slice(1)) gain.gain.linearRampToValueAtTime(point.value, point.time)
		source.connect(bandpass)
		bandpass.connect(highpass)
		highpass.connect(lowpass)
		lowpass.connect(gain)
		gain.connect(output)
		const nodes = [source, bandpass, highpass, lowpass, gain]
		const hit = { source, gain:gain.gain, endAt, points }
		hits.add(hit)
		source.onended = () => {
			hits.delete(hit)
			nodes.forEach(node => node.disconnect())
		}
		source.start(time)
		source.stop(endAt)
		return options
	}
	cymbal.choke = (duration, chokeAt=context.currentTime) => {
		const time = Math.max(context.currentTime, chokeAt)
		for (const hit of hits) chokeHit(hit, time, duration)
	}
	cymbal.cancel = () => cymbal.choke(0.005)
	cymbal.prepare = options => {
		if (options.length >= 0.02 && options.length <= 8) getBank(context, options)
	}
	return cymbal
}
