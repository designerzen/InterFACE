import { clamp } from '../maths/maths.js'

const createPreset = (id, title, positions, performanceAmount=0.25) => Object.freeze({
	id,
	title,
	performanceAmount,
	positions:Object.freeze(positions),
})

export const DEFAULT_PERCUSSION_PANNING_PRESET = 'vintage-jazz'

export const PERCUSSION_PANNING_PRESETS = Object.freeze([
	createPreset('vintage-jazz', 'Old Jazz Record', {
		snare:-0.32,
		tomHigh:-0.52,
		tomMid:0.08,
		tomLow:0.62,
		hat:-0.82,
		crash:0.48,
		ride:0.82,
		splash:-0.46,
		china:0.9,
	}, 0.32),
	createPreset('drummer', "Drummer's Perspective", {
		snare:-0.12,
		tomHigh:-0.58,
		tomMid:0,
		tomLow:0.58,
		hat:-0.72,
		crash:0.46,
		ride:0.68,
		splash:-0.34,
		china:0.82,
	}, 0.28),
	createPreset('audience', "Audience Perspective", {
		snare:0.12,
		tomHigh:0.58,
		tomMid:0,
		tomLow:-0.58,
		hat:0.72,
		crash:-0.46,
		ride:-0.68,
		splash:0.34,
		china:-0.82,
	}, 0.28),
	createPreset('seventies-wide', '70s Hard Pan', {
		snare:-0.48,
		tomHigh:-0.9,
		tomMid:0,
		tomLow:0.9,
		hat:-0.92,
		crash:0.72,
		ride:0.92,
		splash:-0.68,
		china:1,
	}, 0.18),
	createPreset('modern', 'Modern Balanced', {
		snare:0,
		tomHigh:-0.34,
		tomMid:0,
		tomLow:0.34,
		hat:-0.42,
		crash:0.28,
		ride:0.44,
		splash:-0.22,
		china:0.54,
	}, 0.22),
	createPreset('mono', 'Mono / Centre', {
		snare:0,
		tomHigh:0,
		tomMid:0,
		tomLow:0,
		hat:0,
		crash:0,
		ride:0,
		splash:0,
		china:0,
	}, 0),
])

const PANNING_PRESETS_BY_ID = new Map(PERCUSSION_PANNING_PRESETS.map(preset => [preset.id, preset]))

export const getPercussionPanningPreset = id => PANNING_PRESETS_BY_ID.get(id)
	?? PANNING_PRESETS_BY_ID.get(DEFAULT_PERCUSSION_PANNING_PRESET)

export const getPerformanceDrumStereoPan = (control, enabled=true) => {
	const snare = enabled && Number.isFinite(control) ? clamp(control, -1, 1) : 0
	return {
		snare,
		tom:snare === 0 ? 0 : snare * -1,
	}
}

export const getPercussionStereoPositions = (
	presetId=DEFAULT_PERCUSSION_PANNING_PRESET,
	performancePan={ snare:0, tom:0 },
	enabled=true
) => {
	const preset = getPercussionPanningPreset(presetId)
	const positions = {}
	for (const [part, position] of Object.entries(preset.positions))
	{
		if (!enabled)
		{
			positions[part] = 0
			continue
		}
		const movement = part === 'snare'
			? performancePan.snare
			: part.startsWith('tom')
				? performancePan.tom
				: 0
		positions[part] = clamp(position + movement * preset.performanceAmount, -1, 1)
	}
	return positions
}
