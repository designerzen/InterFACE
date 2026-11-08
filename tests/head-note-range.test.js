import { readFileSync } from 'fs'
import { createNoteCircleData } from '../source/display/note-circle.js'
import {
	DEFAULT_HEAD_NOTE_RANGE_DEGREES,
	DEFAULT_HEAD_VERTICAL_OFFSET_DEGREES,
	DEFAULT_HEAD_VERTICAL_RANGE_DEGREES,
	getHeadNoteIndex,
	HEAD_NOTE_RANGE_INHERIT,
	HEAD_VERTICAL_RANGE_INHERIT,
	normaliseHeadPitchForRange,
	normaliseHeadRollForRange,
	normaliseHeadVerticalOffsetDegrees,
	resolveHeadNoteRangeDegrees,
	resolveHeadVerticalRangeDegrees
} from '../source/people/head-note-range.js'
import {
	convertHeadOrientationIntoNoteData,
	PERSON_INPUT_MODE_DATA,
	getPersonInputModeData,
	normalisePersonInputMode
} from '../source/people/person.controls.js'

describe('head note range', () => {
	test('defaults to a total 90 degree movement and resolves person overrides', () => {
		expect(DEFAULT_HEAD_NOTE_RANGE_DEGREES).toBe(90)
		expect(resolveHeadNoteRangeDegrees(75, HEAD_NOTE_RANGE_INHERIT)).toBe(75)
		expect(resolveHeadNoteRangeDegrees(75, 40)).toBe(40)
	})

	test('normalises raw head roll against half of the configured total range', () => {
		expect(normaliseHeadRollForRange({headRollRadians:Math.PI / 4}, 90)).toBeCloseTo(1)
		expect(normaliseHeadRollForRange({headRollRadians:-Math.PI / 4}, 90)).toBeCloseTo(-1)
		expect(normaliseHeadRollForRange({headRollRadians:Math.PI / 12}, 60)).toBeCloseTo(0.5)
	})

	test('normalises vertical movement against the configured range', () => {
		expect(DEFAULT_HEAD_VERTICAL_RANGE_DEGREES).toBe(90)
		expect(resolveHeadVerticalRangeDegrees(75, HEAD_VERTICAL_RANGE_INHERIT)).toBe(75)
		expect(resolveHeadVerticalRangeDegrees(75, 45)).toBe(45)
		expect(normaliseHeadPitchForRange({pitch:0.5}, 90)).toBeCloseTo(0.5)
		expect(normaliseHeadPitchForRange({pitch:0.5}, 45)).toBeCloseTo(1)
	})

	test('uses the resolved range when roll controls notes', () => {
		const noteData = convertHeadOrientationIntoNoteData({
			headRollRadians:Math.PI / 12,
			roll:0,
			pitch:0,
			isFacingRight:false,
			eyebrowExtents:1
		}, {
			noteController:'roll',
			octaveController:'pitch',
			sharpController:'isFacingRight',
			octaveLow:2,
			octaveHigh:6,
			headNoteRangeDegrees:90,
			headNoteRangeOverride:60
		})

		expect(noteData.noteNumber).toBeCloseTo(0.5)
	})

	test('uses the resolved vertical range wherever pitch is assigned', () => {
		const octaveData = convertHeadOrientationIntoNoteData({
			roll:0,
			pitch:0.5,
			isFacingRight:false,
			eyebrowExtents:1
		}, {
			noteController:'roll',
			octaveController:'pitch',
			sharpController:'isFacingRight',
			octaveLow:2,
			octaveHigh:6,
			headVerticalRangeDegrees:90,
			headVerticalRangeOverride:45
		})
		const noteData = convertHeadOrientationIntoNoteData({
			roll:0,
			pitch:0.5,
			isFacingRight:false,
			eyebrowExtents:1
		}, {
			noteController:'pitch',
			octaveController:'roll',
			sharpController:'isFacingRight',
			octaveLow:2,
			octaveHigh:6,
			headVerticalRangeDegrees:90,
			headVerticalRangeOverride:45
		})

		expect(octaveData.octaveNumber).toBe(1)
		expect(octaveData.newOctave).toBe(6)
		expect(noteData.noteNumber).toBe(1)
	})

	test('shifts the neutral height so level looks play below the middle octave', () => {
		expect(DEFAULT_HEAD_VERTICAL_OFFSET_DEGREES).toBeGreaterThan(0)
		expect(normaliseHeadPitchForRange({pitch:0}, 90, 0)).toBeCloseTo(0)
		expect(normaliseHeadPitchForRange({pitch:0}, 90, 15)).toBeCloseTo(-1 / 3)
		expect(normaliseHeadPitchForRange({pitch:1 / 3}, 90, 15)).toBeCloseTo(0)
		expect(normaliseHeadPitchForRange({pitch:1}, 90, 15)).toBeCloseTo(2 / 3)
		expect(normaliseHeadVerticalOffsetDegrees(99)).toBe(30)
		expect(normaliseHeadVerticalOffsetDegrees('nope')).toBe(DEFAULT_HEAD_VERTICAL_OFFSET_DEGREES)

		const octaves = offset => convertHeadOrientationIntoNoteData({ roll:0, pitch:0, isFacingRight:false, eyebrowExtents:1 }, {
			noteController:'roll', octaveController:'pitch', sharpController:'isFacingRight',
			octaveLow:2, octaveHigh:6, headVerticalRangeDegrees:90, headVerticalOffsetDegrees:offset
		}).newOctave
		expect(octaves(0)).toBe(4)
		expect(octaves(30)).toBeLessThan(4)
	})

	test('maps the note percentage to the same number of dot intervals as the notes', () => {
		expect(getHeadNoteIndex(-1, 7)).toBe(0)
		expect(getHeadNoteIndex(0, 7)).toBe(3)
		expect(getHeadNoteIndex(1, 7)).toBe(6)
	})

	test('defines two input modes that swap octave control between vertical and lateral head movement', () => {
		expect(PERSON_INPUT_MODE_DATA).toHaveLength(2)
		expect(getPersonInputModeData(0).options).toMatchObject({
			noteController:'roll',
			octaveController:'pitch'
		})
		expect(getPersonInputModeData(1).options).toMatchObject({
			noteController:'pitch',
			octaveController:'roll'
		})
		expect(normalisePersonInputMode(2)).toBe(0)
		expect(normalisePersonInputMode(-1)).toBe(1)
	})

	test('creates the requested number of points across the configured arc', () => {
		const points = createNoteCircleData(0, 0, 60, 10, 7)
		expect(points).toHaveLength(7)
		expect(points[0].x).toBeCloseTo(5)
		expect(points[0].y).toBeCloseTo(-Math.sqrt(75))
		expect(points[3].x).toBeCloseTo(0)
		expect(points[3].y).toBeCloseTo(-10)
		expect(points[6].x).toBeCloseTo(-5)
	})
})

describe('head note range controls', () => {
	const globalPanel = readFileSync('source/partials/control-panel.pug', 'utf8')
	const headPanel = readFileSync('source/partials/head-panel.pug', 'utf8')
	const personPanel = readFileSync('source/dom/ui.panel-instruments.js', 'utf8')
	const personSource = readFileSync('source/people/person.js', 'utf8')
	const sharedControlStyles = readFileSync('source/assets/styles/gadgets/button-shared-controls.scss', 'utf8')
	const listStyles = readFileSync('source/assets/styles/sections/controls-list.scss', 'utf8')

	test('groups the global head sliders in one folder and keeps per-person overrides', () => {
		expect(globalPanel).toContain('#control-panel-head.folder-menu')
		expect(globalPanel).toContain('a.folder-link.secondary.type-input.group-tracking(href="#folder-head"')
		expect(globalPanel).toContain('include head-panel.pug')
		expect(globalPanel).not.toContain('.head-note-range-control')
		expect(globalPanel).not.toContain('.head-vertical-range-control')
		expect(headPanel).toContain('input#head-note-range(type="range"')
		expect(headPanel).toContain('output#head-note-range-output')
		expect(headPanel).toContain('input#head-vertical-range(type="range"')
		expect(headPanel).toContain('output#head-vertical-range-output')
		expect(headPanel).toContain('input#head-vertical-offset(type="range"')
		expect(headPanel).toContain('output#head-vertical-offset-output')
		expect(personPanel).toContain('"headNoteRangeOverrideEnabled"')
		expect(personPanel).toContain('"headNoteRangeOverride"')
		expect(personPanel).toContain('"headVerticalRangeOverrideEnabled"')
		expect(personPanel).toContain('"headVerticalRangeOverride"')
		expect(personPanel).toContain('type="range"')
	})

	test('uses a face icon and appears in the controls list input section', () => {
		expect(sharedControlStyles).toContain('--bg:url(/source/assets/icons/face.svg)')
		expect(listStyles).toContain("'#control-panel-head'")
	})

	test('persists the per-person override in the compact person state', () => {
		expect(personSource).toContain('headNoteRangeOverride:parts[6]')
		expect(personSource).toContain('this.options.headNoteRangeOverride')
		expect(personSource).toContain('headVerticalRangeOverride:parts[7]')
		expect(personSource).toContain('this.options.headVerticalRangeOverride')
	})

	test('debounces per-person range updates while keeping their readouts live', () => {
		expect(personPanel).toContain('const onRangeInput = debounce(onInstrumentInput, 150)')
	})
})
