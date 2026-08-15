import { ZERO } from '../audio-constants.js'
import { chokeGains } from '../synthesizers'
import { DEFAULT_SCRAPE_OPTIONS } from './scrape-presets.js'

export * from './scrape-presets.js'

const noiseBuffers = new WeakMap()
const getNoiseBuffer = context => {
	let buffer = noiseBuffers.get(context)
	if (buffer) return buffer
	buffer = context.createBuffer(1, context.sampleRate, context.sampleRate)
	const data = buffer.getChannelData(0)
	let value = 0
	for (let index=0; index<data.length; index++) {
		if (index % 5 === 0) value = Math.random() * 2 - 1
		data[index] = value
	}
	noiseBuffers.set(context, buffer)
	return buffer
}

/** Repeated filtered-noise ridges with a quiet resonant body for guiros and jawbones. */
export const createScrape = (context, output) => {
	const noise = context.createBufferSource()
	const bandpass = context.createBiquadFilter()
	const highpass = context.createBiquadFilter()
	const scrapeGain = context.createGain()
	const body = context.createOscillator()
	const bodyGain = context.createGain()
	let running = false
	noise.buffer = getNoiseBuffer(context)
	noise.loop = true
	bandpass.type = 'bandpass'
	highpass.type = 'highpass'
	body.type = 'triangle'
	noise.connect(bandpass)
	bandpass.connect(highpass)
	highpass.connect(scrapeGain)
	body.connect(bodyGain)
	scrapeGain.connect(output)
	bodyGain.connect(output)

	const scrape = (hitOptions=DEFAULT_SCRAPE_OPTIONS) => {
		const options = { ...DEFAULT_SCRAPE_OPTIONS, ...hitOptions }
		const time = Math.max(context.currentTime, options.triggerAt > 0 ? options.triggerAt : context.currentTime + ZERO)
		const endAt = time + Math.max(0.04, options.length)
		const peak = Math.max(ZERO, options.velocity * options.outputGain)
		if (!running) { noise.start(time); body.start(time); running = true }
		bandpass.frequency.setValueAtTime(Math.max(100, options.bandpass), time)
		bandpass.Q.setValueAtTime(Math.max(0.1, options.bandpassQ), time)
		highpass.frequency.setValueAtTime(Math.max(20, options.highpass), time)
		body.frequency.setValueAtTime(Math.max(40, options.bodyFrequency), time)
		scrapeGain.gain.cancelScheduledValues(time)
		scrapeGain.gain.setValueAtTime(ZERO, time)
		const strokes = Math.max(1, Math.round(options.strokes))
		for (let index=0; index<strokes; index++) {
			const strokeAt = Math.min(endAt - 0.004, time + index * options.spacing)
			scrapeGain.gain.setValueAtTime(peak * (1 - index / (strokes * 1.45)), strokeAt)
			scrapeGain.gain.exponentialRampToValueAtTime(ZERO, Math.min(endAt, strokeAt + 0.012))
		}
		bodyGain.gain.cancelScheduledValues(time)
		bodyGain.gain.setValueAtTime(peak * options.bodyLevel, time)
		bodyGain.gain.exponentialRampToValueAtTime(ZERO, endAt)
		return options
	}
	scrape.cancel = () => { const now=context.currentTime; scrapeGain.gain.cancelScheduledValues(now); scrapeGain.gain.setValueAtTime(ZERO, now); bodyGain.gain.cancelScheduledValues(now); bodyGain.gain.setValueAtTime(ZERO, now) }
	scrape.choke = (duration, at) => chokeGains(context, [scrapeGain.gain, bodyGain.gain], duration, at)
	return scrape
}
