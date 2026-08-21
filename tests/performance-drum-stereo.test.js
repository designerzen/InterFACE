import { readFileSync } from 'node:fs'
import {
	DEFAULT_PERCUSSION_PANNING_PRESET,
	PERCUSSION_PANNING_PRESETS,
	getPercussionPanningPreset,
	getPercussionStereoPositions,
	getPerformanceDrumStereoPan,
} from '../source/audio/performance-drum-stereo.js'

describe('performative drum stereo separation', () => {
	test('mirrors toms across the stereo field from snares', () => {
		expect(getPerformanceDrumStereoPan(0.65)).toEqual({ snare:0.65, tom:-0.65 })
		expect(getPerformanceDrumStereoPan(-0.4)).toEqual({ snare:-0.4, tom:0.4 })
	})

	test('clamps the pan control to the StereoPanner range', () => {
		expect(getPerformanceDrumStereoPan(3)).toEqual({ snare:1, tom:-1 })
		expect(getPerformanceDrumStereoPan(-3)).toEqual({ snare:-1, tom:1 })
	})

	test('centres both voices when performative stereo control is disabled or invalid', () => {
		expect(getPerformanceDrumStereoPan(0.8, false)).toEqual({ snare:0, tom:0 })
		expect(getPerformanceDrumStereoPan(undefined)).toEqual({ snare:0, tom:0 })
	})

	test('offers the common panning styles in a stable menu order', () => {
		expect(DEFAULT_PERCUSSION_PANNING_PRESET).toBe('vintage-jazz')
		expect(PERCUSSION_PANNING_PRESETS.map(preset => preset.id)).toEqual([
			'vintage-jazz', 'drummer', 'audience', 'seventies-wide', 'modern', 'mono'
		])
	})

	test('spreads an old jazz kit across hats, cymbals, and descending toms', () => {
		const positions = getPercussionStereoPositions('vintage-jazz')
		expect(positions.hat).toBeLessThan(-0.7)
		expect(positions.ride).toBeGreaterThan(0.7)
		expect(positions.tomHigh).toBeLessThan(positions.tomMid)
		expect(positions.tomMid).toBeLessThan(positions.tomLow)
	})

	test('adds mirrored performance movement without losing the preset layout', () => {
		const neutral = getPercussionStereoPositions('modern')
		const moving = getPercussionStereoPositions('modern', getPerformanceDrumStereoPan(0.75))
		expect(moving.snare).toBeGreaterThan(neutral.snare)
		expect(moving.tomHigh).toBeLessThan(neutral.tomHigh)
		expect(moving.tomMid).toBeLessThan(neutral.tomMid)
		expect(moving.tomLow).toBeLessThan(neutral.tomLow)
	})

	test('centres every voice for mono, disabled stereo, and unknown presets fall back safely', () => {
		expect(Object.values(getPercussionStereoPositions('mono', getPerformanceDrumStereoPan(1))).every(value => value === 0)).toBe(true)
		expect(Object.values(getPercussionStereoPositions('vintage-jazz', getPerformanceDrumStereoPan(1), false)).every(value => value === 0)).toBe(true)
		expect(getPercussionPanningPreset('unknown').id).toBe(DEFAULT_PERCUSSION_PANNING_PRESET)
	})

	test('exposes every preset from an advanced-only native select', () => {
		const panel = readFileSync('source/partials/control-panel.pug', 'utf8')
		const states = readFileSync('source/assets/styles/states.scss', 'utf8')
		expect(panel).toMatch(/label\.advanced-only\(for="select-percussion-panning"\)/)
		for (const preset of PERCUSSION_PANNING_PRESETS)
		{
			expect(panel).toContain(`option(value="${preset.id}") ${preset.title}`)
		}
		expect(states).toMatch(/#percussion-settings \.advanced-only/)
	})

	test('can apply the initial preset before the outer AudioContext is available', () => {
		const interfaceSource = readFileSync('source/interface.js', 'utf8')
		expect(interfaceSource).not.toContain('triggerAt=audioContext.currentTime')
		expect(interfaceSource).toContain('kit?.setPartPan?.(panPart, pan, triggerAt)')
	})
})
