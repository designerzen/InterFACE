export const CLEFF_TREBLE = "𝄞"
export const CLEFF_MAIN = "𝄡"
export const CLEFF_BASS = "𝄢"
export const STAVE = "𝄚"
export const NOTATION = ["𝅗", "𝅘𝅥", "𝅘𝅥𝅯", "𝅘𝅥𝅱"]
export const STAFF_LINE_COUNT = 5
export const STAFF_NOTE_SLOTS = 9

const PITCH_CLASS_TO_LETTER = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6]
const ACCIDENTALS = [false, true, false, true, false, false, true, false, true, false, true, false]
const CLEF_BOTTOM_LINE = Object.freeze({ bass: 43, alto: 53, treble: 64 })
const CLEF_GLYPH = Object.freeze({ bass: CLEFF_BASS, alto: CLEFF_MAIN, treble: CLEFF_TREBLE })
const layoutCache = new Map()
const MAX_LAYOUT_CACHE_SIZE = 256
const positiveModulo = (value, modulo) => ((value % modulo) + modulo) % modulo
const finiteOrZero = value => Number.isFinite(value) ? value : 0
const clampMidi = value => Math.max(0, Math.min(127, Math.round(finiteOrZero(value))))
const diatonicIndex = midi => {
	const note = clampMidi(midi)
	return (Math.floor(note / 12) - 1) * 7 + PITCH_CLASS_TO_LETTER[note % 12]
}

export const getStave = (noteCount=1) => STAVE.repeat(Math.max(STAFF_LINE_COUNT, Math.ceil(finiteOrZero(noteCount)) + 1))
export const getNotationForNoteNumber = (noteNumber=0) => NOTATION[positiveModulo(finiteOrZero(noteNumber), NOTATION.length)]
export const getStaffSlotForNoteNumber = (noteNumber=0, clef) => clef ?
	diatonicIndex(noteNumber) - diatonicIndex(CLEF_BOTTOM_LINE[clef] ?? CLEF_BOTTOM_LINE.treble) :
	Math.round((positiveModulo(finiteOrZero(noteNumber), 12) / 11) * (STAFF_NOTE_SLOTS - 1))

export const getClefNameForNotes = (noteNumbers=[], octave) => {
	if (noteNumbers.length)
	{
		const sorted = noteNumbers.map(clampMidi).sort((a, b) => a - b)
		const median = sorted[Math.floor(sorted.length / 2)]
		if (median < 55) return "bass"
		if (median < 62 && sorted[sorted.length - 1] - sorted[0] < 19) return "alto"
		return "treble"
	}
	const safeOctave = finiteOrZero(octave)
	return safeOctave <= 3 ? "bass" : safeOctave === 4 ? "alto" : "treble"
}

export const getCleff = octave => CLEF_GLYPH[getClefNameForNotes([], octave)]

export const getNotationLayout = (noteNumbers=[], octave) => {
	const notes = Array.from(new Set(noteNumbers.map(clampMidi))).sort((a, b) => a - b)
	const clef = getClefNameForNotes(notes, octave)
	const key = `${clef}:${notes.join(",")}`
	const cached = layoutCache.get(key)
	if (cached) return cached
	const laidOutNotes = notes.map(midi => Object.freeze({ midi, staffStep: getStaffSlotForNoteNumber(midi, clef), sharp: ACCIDENTALS[midi % 12] }))
	const layout = Object.freeze({ clef, glyph: CLEF_GLYPH[clef], notes: Object.freeze(laidOutNotes) })
	if (layoutCache.size >= MAX_LAYOUT_CACHE_SIZE) layoutCache.delete(layoutCache.keys().next().value)
	layoutCache.set(key, layout)
	return layout
}

const drawFallback = (display, x, y, layout, size) => {
	display.drawText(x - size * 1.7, y, `${layout.glyph}${getStave(layout.notes.length)}`, size, "left", "noto-music")
	for (const note of layout.notes)
		display.drawText(x + size * 0.35, y - note.staffStep * size * 0.125, note.sharp ? "♯●" : "●", size * 0.55, "center", "noto-music")
}

export const drawNotation = (display, x, y, noteNumbers=[], octave, size=32) => {
	const layout = getNotationLayout(noteNumbers, octave)
	const context = display?.canvasContext
	if (!context?.beginPath)
	{
		drawFallback(display, x, y, layout, size)
		return layout
	}
	const gap = size * 0.18
	const halfWidth = size * 1.45
	context.save()
	context.strokeStyle = context.fillStyle = "#fff"
	context.lineWidth = Math.max(1, size * 0.045)
	context.beginPath()
	for (let line = 0; line < STAFF_LINE_COUNT; line++)
	{
		const lineY = y + gap * (2 - line)
		context.moveTo(x - halfWidth, lineY)
		context.lineTo(x + halfWidth, lineY)
	}
	context.stroke()
	context.font = `${size * 1.08}px noto-music`
	context.textAlign = "center"
	context.textBaseline = "middle"
	context.fillText(layout.glyph, x - halfWidth + size * 0.34, y)
	const noteX = x + size * 0.4
	for (const note of layout.notes)
	{
		const noteY = y - note.staffStep * gap * 0.5
		context.beginPath()
		for (let step = note.staffStep < 0 ? -2 : 10; note.staffStep < 0 ? step >= note.staffStep : step <= note.staffStep; step += note.staffStep < 0 ? -2 : 2)
		{
			const ledgerY = y - step * gap * 0.5
			context.moveTo(noteX - size * 0.28, ledgerY)
			context.lineTo(noteX + size * 0.28, ledgerY)
		}
		context.stroke()
		context.beginPath()
		context.ellipse(noteX, noteY, size * 0.18, size * 0.13, -0.25, 0, Math.PI * 2)
		context.fill()
		context.beginPath()
		context.moveTo(noteX + size * 0.16, noteY)
		context.lineTo(noteX + size * 0.16, noteY - size * 0.52)
		context.stroke()
		if (note.sharp)
		{
			context.font = `${size * 0.38}px serif`
			context.fillText("♯", noteX - size * 0.34, noteY)
		}
	}
	context.restore()
	return layout
}

export const getNotationBounds = (x, y, noteNumbers=[], octave, size=32) => {
	const layout = getNotationLayout(noteNumbers, octave)
	const gap = size * 0.18
	const halfWidth = size * 1.45
	const noteX = x + size * 0.4
	const noteLeft = noteX - size * 0.58
	const noteRight = noteX + size * 0.42
	const noteSteps = layout.notes.map(note => note.staffStep)
	const minStep = noteSteps.length ? Math.min(...noteSteps, -2) : -2
	const maxStep = noteSteps.length ? Math.max(...noteSteps, 10) : 10
	const top = y - maxStep * gap * 0.5 - size * 0.58
	const bottom = y - minStep * gap * 0.5 + size * 0.26
	return {
		x:Math.min(x - halfWidth, noteLeft),
		y:top,
		width:Math.max(x + halfWidth, noteRight) - Math.min(x - halfWidth, noteLeft),
		height:bottom - top
	}
}

export const midiToNotation = (noteNumbers=[], octave) => getNotationLayout(noteNumbers, octave)
export const STAVE_SIZES = Array.from({ length: STAFF_LINE_COUNT }, (_, index) => STAVE.repeat(index + 1))
export const createNotation = (cleff=CLEFF_TREBLE) => `${cleff}`
