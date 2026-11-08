import { EYEBROW_AUDIO_EFFECTS } from '../audio/effects/person-eyebrows.js'

export const EYEBROW_STYLES = [
	{ value:'disabled', label:'Disabled' },
	{ value:'classic', label:'Classic' },
	{ value:'bend', label:'Bendy', effect:'eyebrowPitchBend' },
	{ value:'space', label:'Space', effect:'eyebrowReverb' },
	{ value:'filter', label:'Filter', effect:'eyebrowLowPass' },
	{ value:'echo', label:'Echo', effect:'eyebrowDelay' },
	{ value:'squish', label:'Squish', effect:'eyebrowCompression' }
]

export const normaliseEyebrowStyle = value => EYEBROW_STYLES.some(style => style.value === value) ? value : 'disabled'
export const getEyebrowStyle = (options = {}) => options.eyebrowStyle == null
	? EYEBROW_STYLES.find(style => options[style.effect])?.value ?? (options.drawEyebrows ? 'classic' : 'disabled')
	: normaliseEyebrowStyle(options.eyebrowStyle)

export const eyebrowStyleOptions = value => {
	const eyebrowStyle = normaliseEyebrowStyle(value)
	const selected = EYEBROW_STYLES.find(style => style.value === eyebrowStyle)
	return {
		eyebrowStyle, drawEyebrows:eyebrowStyle !== 'disabled',
		...Object.fromEntries(EYEBROW_AUDIO_EFFECTS.map(([key]) => [key, key === selected.effect]))
	}
}

// Share the visual vocabulary between the picker and the face overlay.
export const eyebrowPasses = style => style === 'echo'
	? [{y:8, alpha:0.15}, {y:4, alpha:0.35}, {y:0, alpha:1}]
	: style === 'space'
		? [{y:0, alpha:0.08, width:13}, {y:0, alpha:0.2, width:8}, {y:0, alpha:1, width:3}]
		: [{y:0, alpha:1, width:style === 'squish' ? 7 : style === 'filter' ? 5 : 3}]

export const eyebrowStyleIcon = style => {
	const path = style === 'bend' ? 'M5 14 Q9 4 13 11 T23 10 M33 10 Q38 3 42 11 T51 14'
		: style === 'squish' ? 'M8 10 L20 10 M36 10 L48 10'
			: 'M5 13 Q14 5 23 10 M33 10 Q42 5 51 13'
	const strokes = eyebrowPasses(style).map(pass => `<path d="${path}" transform="translate(0 ${pass.y})" opacity="${pass.alpha}" stroke-width="${pass.width ?? 3}"/>`).join('')
	return `<svg viewBox="0 0 56 28" width="56" height="28" aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round"${style === 'disabled' ? ' opacity="0.35" stroke-dasharray="2 5"' : ''}>${strokes}</svg>`
}
