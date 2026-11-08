import { NOTE_HISTORY_WINDOW } from './visualiser-notes.js'

const TAU = Math.PI * 2
const POINTS = 256
const sine = new Float32Array(POINTS + 1)
const cosine = new Float32Array(POINTS + 1)
for (let i = 0; i <= POINTS; i++) {
	sine[i] = Math.sin(i / POINTS * TAU)
	cosine[i] = Math.cos(i / POINTS * TAU)
}
const noteColours = Array.from({ length:12 }, (_, pitch) => `hsl(${pitch * 30},85%,65%)`)

// Reconstruct a fixed eight-second window from timestamps. No pixel copies,
// scroll buffers, timers, or dependence on monitor refresh rate.
export const drawNoteHistory = (context, notes, vertical) => {
	if (!notes) return
	const { width, height } = context.canvas
	const lane = (vertical ? width : height) / 128
	const travel = vertical ? height : width
	const speed = travel / NOTE_HISTORY_WINDOW
	context.fillStyle = 'rgba(180,200,220,0.12)'
	for (let pitch = 0; pitch < 128; pitch += 12) {
		if (vertical) context.fillRect(pitch * lane, 0, 1, height)
		else context.fillRect(0, pitch * lane, width, 1)
	}
	for (let i = 0; i < notes.count; i++) {
		const note = notes.history[i]
		if (note.start > notes.now || note.end < notes.now - NOTE_HISTORY_WINDOW) continue
		const newest = Math.max(0, (notes.now - note.end) * speed)
		const oldest = Math.min(travel, (notes.now - note.start) * speed)
		const depth = Math.min(travel - newest, Math.max(2, oldest - newest))
		if (depth <= 0) continue
		context.fillStyle = noteColours[note.note % 12]
		context.globalAlpha = 0.35 + note.velocity * 0.6
		if (vertical) context.fillRect(note.note * lane, height - newest - depth, Math.max(1, lane - 0.5), depth)
		else context.fillRect(newest, note.note * lane, depth, Math.max(1, lane - 0.5))
	}
}

export const drawExtraVisualiser = (context, type, geometry, time, notes, now) => {
	const { width, height, count, levels, colours } = geometry
	const energy = notes?.energy ?? 0
	const pitch = Math.round(notes?.pitch ?? 60)
	const shortSide = Math.min(width, height)
	if (type === 'envelope') {
		if (!time?.length) return true
		// Min/max pooling retains short transients that simple subsampling loses.
		const columns = Math.min(256, Math.max(1, Math.floor(width / 3)), time.length)
		context.strokeStyle = noteColours[pitch % 12]
		context.lineWidth = Math.max(1, width / columns * 0.65)
		context.beginPath()
		for (let i = 0; i < columns; i++) {
			let min = 255, max = 0
			const end = Math.floor((i + 1) * time.length / columns)
			for (let j = Math.floor(i * time.length / columns); j < end; j++) {
				min = Math.min(min, time[j])
				max = Math.max(max, time[j])
			}
			const x = (i + 0.5) / columns * width
			context.moveTo(x, height * (0.5 - (max - 128) / 128 * 0.4))
			context.lineTo(x, height * (0.5 - (min - 128) / 128 * 0.4) + 0.5)
		}
		context.stroke()
		return true
	}
	if (type === 'wave-ring' || type === 'phase' || type === 'orbit') {
		if (!time || time.length < 2) return true
		context.strokeStyle = noteColours[pitch % 12]
		context.lineWidth = 2
		context.beginPath()
		// A delay portrait of the mono waveform; not a stereo correlation meter.
		const delay = Math.max(1, Math.floor(time.length / 16))
		const available = type === 'phase' ? time.length - delay : time.length
		const radius = shortSide * (0.23 + energy * 0.04)
		for (let i = 0; i <= POINTS; i++) {
			const index = Math.min(available - 1, Math.floor(i / POINTS * (available - 1)))
			const sample = (time[index] - 128) / 128
			let x, y
			if (type === 'phase') {
				x = width / 2 + sample * shortSide * 0.42
				y = height / 2 - (time[index + delay] - 128) / 128 * shortSide * 0.42
			} else {
				const band = Math.min(count - 1, Math.floor(i / POINTS * count))
				const distance = radius + sample * shortSide * 0.12 + (type === 'orbit' ? levels[band] * shortSide * 0.08 : 0)
				x = width / 2 + cosine[i] * distance
				y = height / 2 + sine[i] * distance
			}
			if (i === 0) context.moveTo(x, y)
			else context.lineTo(x, y)
		}
		context.stroke()
		if (type === 'orbit') {
			// Twelve pitch-class satellites: played notes control their size.
			const angle = now * 0.00015
			const sin = Math.sin(angle), cos = Math.cos(angle)
			for (let i = 0; i < 12; i++) {
				let strength = 0
				for (let note = i; note < 128; note += 12) strength = Math.max(strength, notes?.strengths[note] ?? 0)
				const point = Math.floor(i / 12 * POINTS)
				const distance = shortSide * 0.38
				const size = 2 + strength * shortSide * 0.018
				context.fillStyle = noteColours[i]
				context.fillRect(width / 2 + (cosine[point] * cos - sine[point] * sin) * distance - size / 2,
					height / 2 + (sine[point] * cos + cosine[point] * sin) * distance - size / 2, size, size)
			}
		}
		return true
	}
	if (type === 'curve') {
		context.strokeStyle = 'rgba(100,240,255,0.9)'
		context.lineWidth = 2
		context.fillStyle = 'rgba(90,180,255,0.15)'
		context.beginPath()
		context.moveTo(0, height)
		for (let i = 0; i < count; i++) context.lineTo(i / Math.max(1, count - 1) * width, height * (0.95 - levels[i] * 0.65))
		context.lineTo(width, height)
		context.fill()
		context.stroke()
		return true
	}
	if (type === 'peaks') {
		const elapsed = geometry.lastPeakTime == null ? 0 : Math.max(0, now - geometry.lastPeakTime)
		geometry.lastPeakTime = now
		const step = width / count
		for (let i = 0; i < count; i++) {
			if (levels[i] >= geometry.peaks[i]) {
				geometry.peaks[i] = levels[i]
				geometry.peakUntil[i] = now + 450
			} else if (now > geometry.peakUntil[i]) {
				const decayTime = Math.min(elapsed, now - geometry.peakUntil[i])
				geometry.peaks[i] = Math.max(levels[i], geometry.peaks[i] - decayTime * 0.00035)
			}
			context.fillStyle = colours[i]
			context.fillRect(i * step, height * (1 - levels[i] * 0.6), Math.max(1, step - 2), levels[i] * height * 0.6)
			context.fillStyle = '#d9fff4'
			context.fillRect(i * step, height * (1 - geometry.peaks[i] * 0.6) - 2, Math.max(1, step - 2), 2)
		}
		return true
	}
	if (type === 'lattice') {
		const columns = 8, rows = Math.ceil(count / columns)
		const cell = Math.min(width / columns, height / rows) * 0.9
		for (let i = 0; i < count; i++) {
			const size = cell * (0.08 + levels[i] * 0.8 + energy * 0.1)
			context.fillStyle = noteColours[(i + pitch) % 12]
			context.globalAlpha = 0.2 + levels[i] * 0.65
			context.fillRect((i % columns + 0.5) * width / columns - size / 2,
				(Math.floor(i / columns) + 0.5) * height / rows - size / 2, size, size)
		}
		return true
	}
	return false
}
