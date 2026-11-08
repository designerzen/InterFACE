import { FMVoice } from '../fm-engine.js'

class FMProcessor extends AudioWorkletProcessor {
	constructor(){
		super()
		this.parts = new Map()
		this.events = []
		this.running = true
		this.port.onmessage = ({data}) => {
			if (data.type === 'destroy') { this.running = false; this.parts.clear(); this.events.length = 0; return }
			if (data.type === 'panic' || data.type === 'releasePart') {
				this.parts.delete(data.part)
				this.events = this.events.filter(event => event.part !== data.part)
				return
			}
			this.events.push(data)
			this.events.sort((a,b) => a.time-b.time)
		}
	}
	apply(event){
		let part = this.parts.get(event.part)
		if (!part) { part = {voices:new Map(), bend:0}; this.parts.set(event.part, part) }
		switch(event.type) {
			case 'on':
				if (part.voices.size >= 16) part.voices.delete(part.voices.keys().next().value)
				part.voices.set(event.note, new FMVoice(event.patch, event.note, event.velocity, sampleRate, event.time))
				break
			case 'off': part.voices.get(event.note)?.release(); break
			case 'bend': part.bend = event.value; break
		}
	}
	process(inputs, outputs){
		const frames = outputs[0]?.[0]?.length ?? 128
		for (const channels of outputs) for (const channel of channels) channel.fill(0)
		for (let i=0; i<frames; i++) {
			const time = currentTime+i/sampleRate
			while (this.events.length && this.events[0].time <= time) this.apply(this.events.shift())
			for (const [id, part] of this.parts) {
				let sample = 0
				for (const [note, voice] of part.voices) {
					sample += voice.next(part.bend)
					if (voice.finished) part.voices.delete(note)
				}
				for (const channel of outputs[id] ?? []) channel[i] = Math.tanh(sample)
			}
		}
		return this.running
	}
}

registerProcessor('photosynth-fm', FMProcessor)
