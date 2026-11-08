import { FMVoice } from '../fm-engine.js'

class FMProcessor extends AudioWorkletProcessor {
	constructor(){
		super()
		this.parts = new Map()
		this.activeParts = new Set()
		this.events = []
		this.eventIndex = 0
		this.running = true
		this.port.onmessage = ({data}) => {
			if (data.type === 'destroy') { this.running = false; this.parts.clear(); this.activeParts.clear(); this.events.length = 0; this.eventIndex = 0; return }
			if (data.type === 'panic' || data.type === 'releasePart') {
				const part = this.parts.get(data.part)
				if (part) {
					part.voices.clear()
					part.bend = 0
					this.activeParts.delete(part)
				}
				if (data.type === 'releasePart') this.parts.delete(data.part)
				this.events = this.events.slice(this.eventIndex).filter(event => event.part !== data.part)
				this.eventIndex = 0
				return
			}
			let part = this.parts.get(data.part)
			if (!part) { part = {id:data.part, voices:new Map(), bend:0, patch:null}; this.parts.set(data.part, part) }
			// Snapshot the selected patch on receipt, before scheduling. A later
			// program change must not alter held or future scheduled notes.
			if (data.type === 'patch') { part.patch = data.patch; return }
			if (data.type === 'on' && !data.patch) data.patch = part.patch
			if (this.eventIndex) { this.events = this.events.slice(this.eventIndex); this.eventIndex = 0 }
			// Most events arrive in order. Insert only when a look-ahead note or
			// another instrument makes the incoming timestamp out of order.
			let index = this.events.length
			while (index > 0 && this.events[index-1].time > data.time) index--
			if (index === this.events.length) this.events.push(data)
			else this.events.splice(index, 0, data)
		}
	}
	apply(event){
		const part = this.parts.get(event.part)
		if (!part) return
		switch(event.type) {
			case 'on':
				if (!event.patch) break
				if (part.voices.size >= 16) part.voices.delete(part.voices.keys().next().value)
				part.voices.set(event.note, new FMVoice(event.patch, event.note, event.velocity, sampleRate, event.time))
				this.activeParts.add(part)
				break
			case 'off': part.voices.get(event.note)?.release(); break
			case 'bend': part.bend = event.value; break
		}
	}
	process(inputs, outputs){
		const frames = outputs[0]?.[0]?.length ?? 128
		for (const channels of outputs) for (const channel of channels) channel.fill(0)
		if (!this.activeParts.size && this.eventIndex === this.events.length) return this.running
		if (!this.activeParts.size && this.events[this.eventIndex].time > currentTime+(frames-1)/sampleRate) return this.running
		for (let i=0; i<frames; i++) {
			const time = currentTime+i/sampleRate
			while (this.eventIndex < this.events.length && this.events[this.eventIndex].time <= time) this.apply(this.events[this.eventIndex++])
			for (const part of this.activeParts) {
				let sample = 0
				for (const [note, voice] of part.voices) {
					sample += voice.next(part.bend)
					if (voice.finished) part.voices.delete(note)
				}
				const channels = outputs[part.id]
				if (channels) for (const channel of channels) channel[i] = Math.tanh(sample)
				if (!part.voices.size) this.activeParts.delete(part)
			}
		}
		if (this.eventIndex === this.events.length) { this.events.length = 0; this.eventIndex = 0 }
		return this.running
	}
}

registerProcessor('photosynth-fm', FMProcessor)
