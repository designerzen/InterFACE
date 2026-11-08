export const EYEBROW_AUDIO_EFFECTS = [
	['eyebrowPitchBend', 'Pitch bend'],
	['eyebrowReverb', 'Reverb'],
	['eyebrowLowPass', 'Low-pass filter'],
	['eyebrowDelay', 'Delay'],
	['eyebrowCompression', 'Compression']
]

const unit = value => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0
const set = (param, value, time) => param.setTargetAtTime(value, time, 0.025)

// Sample instruments take playback ratios; synth engines take signed bend amounts.
export const bendEyebrowInstrument = (instrument, amount) => {
	if (!instrument) return
	if (instrument.instruments?.length) {
		instrument.instruments.forEach(child => bendEyebrowInstrument(child, amount))
	} else {
		instrument.pitchBend?.(instrument.activeSamples instanceof Map ? 2 ** (amount * 2 / 12) : amount)
	}
}

export default class PersonEyebrowEffects {
	constructor(context) {
		this.context = context
		this.input = context.createGain()
		this.output = context.createGain()
		this.nodes = []
		this.configure({})
	}

	configure(options) {
		const signature = EYEBROW_AUDIO_EFFECTS.slice(1).map(([key]) => Boolean(options[key])).join(',')
		if (signature === this.signature) return
		this.signature = signature
		this.input.disconnect()
		this.nodes.forEach(node => node.disconnect())
		this.nodes = []
		this.filter = this.compressor = this.delay = this.feedback = this.delayWet = this.reverbWet = null
		const context = this.context
		const keep = node => { this.nodes.push(node); return node }
		let tail = this.input
		if (options.eyebrowLowPass) {
			this.filter = keep(context.createBiquadFilter())
			this.filter.type = 'lowpass'
			this.filter.frequency.value = Math.min(20000, context.sampleRate / 2)
			this.filter.Q.value = 0.7
			tail.connect(this.filter)
			tail = this.filter
		}
		if (options.eyebrowCompression) {
			this.compressor = keep(context.createDynamicsCompressor())
			this.compressor.ratio.value = 1
			tail.connect(this.compressor)
			tail = this.compressor
		}
		if (options.eyebrowDelay) {
			this.delay = keep(context.createDelay(1))
			this.feedback = keep(context.createGain())
			this.delayWet = keep(context.createGain())
			this.delay.delayTime.value = 0.25
			this.feedback.gain.value = 0
			this.delayWet.gain.value = 0
			const mix = keep(context.createGain())
			tail.connect(mix)
			tail.connect(this.delay)
			this.delay.connect(this.feedback)
			this.feedback.connect(this.delay)
			this.delay.connect(this.delayWet)
			this.delayWet.connect(mix)
			tail = mix
		}
		if (options.eyebrowReverb) {
			const reverb = keep(context.createConvolver())
			if (!this.impulse) {
				this.impulse = context.createBuffer(2, Math.ceil(context.sampleRate * 1.5), context.sampleRate)
				for (let channel = 0; channel < 2; channel++) {
					const data = this.impulse.getChannelData(channel)
					for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3
				}
			}
			reverb.buffer = this.impulse
			this.reverbWet = keep(context.createGain())
			this.reverbWet.gain.value = 0
			const mix = keep(context.createGain())
			tail.connect(mix)
			tail.connect(reverb)
			reverb.connect(this.reverbWet)
			this.reverbWet.connect(mix)
			tail = mix
		}
		tail.connect(this.output)
	}

	update(prediction = {}, options = {}) {
		this.configure(options)
		const amount = unit(prediction?.eyebrowsRaisedBy)
		const time = this.context.currentTime
		if (this.filter) set(this.filter.frequency, Math.min(20000, this.context.sampleRate / 2) * (300 / Math.min(20000, this.context.sampleRate / 2)) ** amount, time)
		if (this.compressor) {
			set(this.compressor.threshold, -6 - amount * 42, time)
			set(this.compressor.ratio, 1 + amount * 11, time)
		}
		if (this.delay) {
			set(this.delayWet.gain, amount * 0.5, time)
			set(this.feedback.gain, amount * 0.45, time)
		}
		if (this.reverbWet) set(this.reverbWet.gain, amount * 0.6, time)
	}

	destroy() {
		this.input.disconnect()
		this.output.disconnect()
		this.nodes.forEach(node => node.disconnect())
		this.nodes = []
	}
}
