export const NOTE_HISTORY_CAPACITY = 1024
export const NOTE_HISTORY_WINDOW = 8000

// Preallocated slots bound memory and drawing cost, even during dense MIDI bursts.
export const createVisualiserNotes = (capacity = NOTE_HISTORY_CAPACITY) => {
	const history = Array.from({ length:capacity }, () => ({ key:null, note:0, velocity:0, start:0, end:0 }))
	const active = new Map()
	const strengths = new Float32Array(128)
	const frame = { history, strengths, count:0, cursor:0, now:0, energy:0, pitch:60 }
	return {
		record(event) {
			if (!Number.isInteger(event.note) || event.note < 0 || event.note > 127) return
			if (event.type !== 'noteOn' && event.type !== 'noteOff') return
			const time = Number.isFinite(event.performanceTime) ? event.performanceTime : performance.now()
			const key = `${event.source}:${event.channel ?? 0}:${event.note}`
			const previous = active.get(key)
			const velocity = Number.isFinite(event.velocity) ? Math.max(0, Math.min(1, event.velocity / (event.velocityUnit === 'midi' ? 127 : 1))) : 0
			if (event.type === 'noteOff' || velocity === 0) {
				if (previous && time >= previous.start) {
					previous.end = time
					active.delete(key)
				}
				return
			}
			if (previous) previous.end = Math.max(previous.start, time)
			const slot = history[frame.cursor]
			if (active.get(slot.key) === slot) active.delete(slot.key)
			slot.key = key
			slot.note = event.note
			slot.velocity = velocity
			slot.start = time
			slot.end = Infinity
			active.set(key, slot)
			frame.cursor = (frame.cursor + 1) % capacity
			frame.count = Math.min(capacity, frame.count + 1)
		},
		update(now = performance.now()) {
			frame.now = now
			strengths.fill(0)
			let weight = 0, pitch = 0
			for (let i = 0; i < frame.count; i++) {
				const note = history[i]
				if (note.start > now || note.end < now - 500) continue
				const strength = note.velocity * (note.end >= now ? 1 : Math.max(0, 1 - (now - note.end) / 500))
				strengths[note.note] = Math.max(strengths[note.note], strength)
				weight += strength
				pitch += note.note * strength
			}
			frame.energy = Math.min(1, weight / 4)
			if (weight > 0) frame.pitch = pitch / weight
			return frame
		},
		clear() {
			active.clear()
			frame.count = frame.cursor = frame.energy = 0
			strengths.fill(0)
		},
	}
}
