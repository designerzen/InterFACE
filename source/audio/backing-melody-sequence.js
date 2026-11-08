import { getPitchClassForKey, getScaleFormula, normaliseKeyName } from './tuning/keys.js'

export const BACKING_SOURCE = 'ai-backing-melody'
export const BAR_STEPS = 16

export const backingHarmony = ({ key=0, keyScale='MAJOR_SCALE' }={}) => {
	const root = getPitchClassForKey(key)
	const intervals = getScaleFormula(keyScale)
	const pitches = intervals.map(interval => (root + interval) % 12)
	const quality = intervals.includes(3) ? (intervals.includes(6) ? 'dim' : 'm') : intervals.includes(4) ? (intervals.includes(8) ? 'aug' : '') : '5'
	return { chord:normaliseKeyName(root) + quality, pitches }
}

// Use one voice even when the performance instrument plays chords. Fold notes
// into the checkpoint's supported register without changing their pitch class.
export const createBackingSeed = (notes, end, bpm) => {
	const stepMs = 60000 / bpm / 4, start = end - BAR_STEPS * stepMs
	const byStep = new Map()
	for (const note of notes) {
		if (note.start >= end || (note.end ?? end) <= start) continue
		const first = Math.max(0, Math.min(15, Math.round((note.start-start)/stepMs)))
		const last = Math.max(first+1, Math.min(16, Math.round(((note.end ?? end)-start)/stepMs)))
		let pitch = note.pitch
		while (pitch < 48) pitch += 12
		while (pitch > 83) pitch -= 12
		const previous = byStep.get(first)
		if (!previous || pitch > previous.pitch) byStep.set(first, { pitch, quantizedStartStep:first, quantizedEndStep:last })
	}
	const melody = [...byStep.values()].sort((a,b) => a.quantizedStartStep-b.quantizedStartStep)
	for (let i=0; i<melody.length-1; i++) melody[i].quantizedEndStep = Math.min(melody[i].quantizedEndStep, melody[i+1].quantizedStartStep)
	return { notes:melody, quantizationInfo:{ stepsPerQuarter:4 }, totalQuantizedSteps:BAR_STEPS, tempos:[{time:0,qpm:bpm}] }
}

export const constrainBacking = (sequence, pitches) => {
	const notes = []
	let end = 0
	for (const note of [...(sequence?.notes ?? [])].sort((a,b) => a.quantizedStartStep-b.quantizedStartStep)) {
		const start = Math.max(end, Math.round(note.quantizedStartStep))
		const stop = Math.min(BAR_STEPS, Math.round(note.quantizedEndStep))
		if (!Number.isFinite(start) || !Number.isFinite(stop) || stop <= start || !Number.isInteger(note.pitch)) continue
		let pitch = Math.max(48, Math.min(76, note.pitch))
		const candidates = Array.from({length:29}, (_,i) => i+48).filter(value => pitches.includes(value%12))
		if (!candidates.length) continue
		pitch = candidates.reduce((best,value) => Math.abs(value-pitch)<Math.abs(best-pitch) ? value : best)
		notes.push({ pitch, start, end:stop })
		end = stop
	}
	return notes
}
