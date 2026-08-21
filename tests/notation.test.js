import {
	NOTATION,
	STAFF_LINE_COUNT,
	STAFF_NOTE_SLOTS,
	STAVE,
	getNotationForNoteNumber,
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
})
