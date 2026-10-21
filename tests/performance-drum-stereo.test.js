import { readFileSync } from 'node:fs'
import {
	DEFAULT_PERCUSSION_PANNING_PRESET,
	PERCUSSION_PANNING_PRESETS,
	getPercussionPanningPreset,
	getPercussionStereoPositions,
	getPerformanceDrumStereoPan,
	createPercussionPanBus,
} from '../source/audio/performance-drum-stereo.js'

const createAudioParam = () => ({
	value:0,
	setValueAtTime:jest.fn(),
})

const createNode = properties => ({ connect:jest.fn(), ...properties })

const createAudioContext = () => {
	const panner = createNode({ pan:createAudioParam() })
	const oscillator = createNode({ frequency:createAudioParam(), start:jest.fn() })
	const modulationGain = createNode({ gain:createAudioParam() })
	return {
		currentTime:1,
		panner,
		oscillator,
		modulationGain,
		createStereoPanner:jest.fn(() => panner),
		createOscillator:jest.fn(() => oscillator),
		createGain:jest.fn(() => modulationGain),
	}
}

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
		expect(panel).toMatch(/label\(data-advanced-mode-only for="select-percussion-panning"\)/)
		for (const preset of PERCUSSION_PANNING_PRESETS)
		{
			expect(panel).toContain(`option(value="${preset.id}") ${preset.title}`)
		}
		expect(states).toMatch(/#percussion-settings \[data-advanced-mode-only\]/)
	})

	test('can apply the initial preset before the outer AudioContext is available', () => {
		const interfaceSource = readFileSync('source/interface.js', 'utf8')
		expect(interfaceSource).not.toContain('triggerAt=audioContext.currentTime')
		expect(interfaceSource).toContain('kit?.setPartPan?.(panPart, pan, triggerAt)')
	})

	test('uses a lazy sine LFO to shimmer crash audio across stereo channels', () => {
		const context = createAudioContext()
		const output = createNode()
		const bus = createPercussionPanBus(context, output, {
			modulate:true,
			stereoEnabled:true,
			rate:2.2,
			depth:0.62,
		})

		expect(context.createOscillator).not.toHaveBeenCalled()
		expect(bus.setPan(0.48, 1.25)).toBe(0.48)
		expect(context.oscillator.type).toBe('sine')
		expect(context.oscillator.frequency.setValueAtTime).toHaveBeenCalledWith(2.2, 1)
		expect(context.oscillator.connect).toHaveBeenCalledWith(context.modulationGain)
		expect(context.modulationGain.connect).toHaveBeenCalledWith(context.panner.pan)
		expect(context.oscillator.start).toHaveBeenCalledWith(1)
		expect(context.modulationGain.gain.setValueAtTime).toHaveBeenLastCalledWith(0.62, 1.25)
		const [staticPan, triggerAt] = context.panner.pan.setValueAtTime.mock.calls.at(-1)
		expect(staticPan).toBeCloseTo(0.48 * 0.38)
		expect(triggerAt).toBe(1.25)
		bus.setPan(0.48, 1.5)
		expect(context.panner.pan.setValueAtTime).toHaveBeenCalledTimes(1)
	})

	test('centres and stops the shimmer for stereo-off and the mono preset', () => {
		const context = createAudioContext()
		const bus = createPercussionPanBus(context, createNode(), { modulate:true })

		bus.setPan(0.48, 1.1)
		expect(bus.setStereoEnabled(false, 1.2)).toBe(false)
		expect(context.panner.pan.setValueAtTime).toHaveBeenLastCalledWith(0, 1.2)
		expect(context.modulationGain.gain.setValueAtTime).toHaveBeenLastCalledWith(0, 1.2)

		bus.setStereoEnabled(true, 1.3)
		bus.setPan(0, 1.4)
		expect(context.panner.pan.setValueAtTime).toHaveBeenLastCalledWith(0, 1.4)
		expect(context.modulationGain.gain.setValueAtTime).toHaveBeenLastCalledWith(0, 1.4)
	})

	test('falls back to the destination when StereoPanner is unavailable', () => {
		const destination = createNode()
		const bus = createPercussionPanBus({ currentTime:1 }, destination, { modulate:true })

		expect(bus.input).toBe(destination)
		expect(bus.setPan(0.8)).toBe(0)
		expect(bus.setStereoEnabled(true)).toBe(false)
	})
})
