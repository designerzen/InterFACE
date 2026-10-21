import {
	NOTATION,
	STAFF_LINE_COUNT,
	STAFF_NOTE_SLOTS,
	STAVE,
	getNotationForNoteNumber,
	getClefNameForNotes,
	getNotationLayout,
	getStaffSlotForNoteNumber,
	getStave
} from '../source/audio/notation.js'

describe('notation helpers', () => {
	test('creates a visible stave for at least the standard line count', () => {
		expect(getStave(1)).toBe(STAVE.repeat(STAFF_LINE_COUNT))
		expect(getStave(8)).toBe(STAVE.repeat(9))
	})

	test('wraps any MIDI note number to an available notation glyph', () => {
		expect(getNotationForNoteNumber(60)).toBe(NOTATION[0])
		expect(getNotationForNoteNumber(63)).toBe(NOTATION[3])
		expect(getNotationForNoteNumber(64)).toBe(NOTATION[0])
		expect(getNotationForNoteNumber(undefined)).toBe(NOTATION[0])
	})

	test('keeps note positions inside the stave slots', () => {
		for (let noteNumber = 0; noteNumber < 128; noteNumber++)
		{
			const slot = getStaffSlotForNoteNumber(noteNumber)
			expect(slot).toBeGreaterThanOrEqual(0)
			expect(slot).toBeLessThan(STAFF_NOTE_SLOTS)
		}
	})

	test('selects a suitable clef from octave and chord register', () => {
		expect(getClefNameForNotes([36, 40, 43], 4)).toBe('bass')
		expect(getClefNameForNotes([60, 64, 67], 2)).toBe('treble')
		expect(getClefNameForNotes([], 2)).toBe('bass')
	})

	test('lays chord notes vertically and preserves octave distance', () => {
		const chord = getNotationLayout([60, 64, 67])
		expect(chord.notes).toHaveLength(3)
		expect(chord.notes.map(note => note.staffStep)).toEqual([-2, 0, 2])
		expect(getStaffSlotForNoteNumber(72, 'treble') - getStaffSlotForNoteNumber(60, 'treble')).toBe(7)
	})

	test('keeps simultaneous octave notes seven diatonic steps apart', () => {
		const octaves = getNotationLayout([48, 60])
		expect(octaves.notes[1].staffStep - octaves.notes[0].staffStep).toBe(7)
	})
})
