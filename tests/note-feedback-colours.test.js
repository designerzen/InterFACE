import {
	NOTE_FEEDBACK_COLOURS,
	NOTE_FEEDBACK_MAX_OPACITY,
	getNoteFeedbackColour
} from '../source/settings/palette.js'
import {
	getDisplayColourAlpha,
	getHolographicDisplayOpacity
} from '../source/display/display-landmarks.js'

describe('note feedback colours', () => {
	test.each([
		['C4', { h:353, s:78, l:54 }],
		['D4', { h:20, s:81, l:62 }],
		['E4', { h:54, s:83, l:68 }],
		['F4', { h:69, s:54, l:65 }],
		['G4', { h:177, s:67, l:41 }],
		['A4', { h:256, s:39, l:46 }],
		['B4', { h:325, s:90, l:65 }]
	])('%s uses the photographed sticker shade', (noteName, expected) => {
		expect(getNoteFeedbackColour(noteName)).toEqual(expected)
	})

	test.each([
		['C#5', 'C'],
		['Db3', 'D'],
		['e♭4', 'E'],
		[' F♯6 ', 'F'],
		['gb2', 'G'],
		['A♭1', 'A'],
		['b#7', 'B']
	])('%s follows its written note letter', (noteName, noteLetter) => {
		expect(getNoteFeedbackColour(noteName)).toBe(NOTE_FEEDBACK_COLOURS[noteLetter])
	})

	test.each([undefined, null, 60, '', 'H4'])('returns no colour for %p', noteName => {
		expect(getNoteFeedbackColour(noteName)).toBeNull()
	})

	test('exposes an immutable palette', () => {
		expect(Object.isFrozen(NOTE_FEEDBACK_COLOURS)).toBe(true)
		Object.values(NOTE_FEEDBACK_COLOURS).forEach(colour => {
			expect(Object.isFrozen(colour)).toBe(true)
		})
	})

	test('keeps note feedback very translucent', () => {
		expect(NOTE_FEEDBACK_MAX_OPACITY).toBe(0.5)
	})

	test('prefers note feedback alpha over a renderer opacity default', () => {
		expect(getDisplayColourAlpha({ a:NOTE_FEEDBACK_MAX_OPACITY }, { opacity:1 }))
			.toBe(NOTE_FEEDBACK_MAX_OPACITY)
	})

	test.each([
		[0, 1],
		[0.25, 0.75],
		[1, 0],
		[2, 0]
	])('holographic opacity only follows death progress %p', (percentageDead, opacity) => {
		expect(getHolographicDisplayOpacity({ percentageDead })).toBe(opacity)
	})
})
