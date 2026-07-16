import { frequencyToNoteNumber, transposeNote } from '../tuning/frequencies.js'

const wrapPitchClass = value => ((Math.round(value) % 12) + 12) % 12

export const getNearestPitchClassRatio = (frequency, pitchClass) => {
	if (!Number.isFinite(frequency) || frequency <= 0 || !Number.isFinite(pitchClass)) return 1
	const current = wrapPitchClass(frequencyToNoteNumber(frequency))
	let semitones = wrapPitchClass(pitchClass) - current
	if (semitones > 6) semitones -= 12
	if (semitones < -6) semitones += 12
	return transposeNote(1, semitones)
}

export const tuneKickOptions = (options, tonic) => {
	if (!Number.isFinite(tonic)) return options
	const ratio = getNearestPitchClassRatio(options.sineEnd, tonic)
	return {
		...options,
		triStart:options.triStart * ratio,
		triEnd:options.triEnd * ratio,
		sineStart:options.sineStart * ratio,
		sineApex:options.sineApex * ratio,
		sineSustain:options.sineSustain * ratio,
		sineEnd:options.sineEnd * ratio
	}
}

export const tuneSnareOptions = (options, tonic) => {
	if (!Number.isFinite(tonic)) return options
	const fifth = wrapPitchClass(tonic + 7)
	const ratio = getNearestPitchClassRatio(options.triEnd, fifth)
	return { ...options, triStart:options.triStart * ratio, triEnd:options.triEnd * ratio }
}

export const tuneCowbellOptions = (options, tonic) => {
	if (!Number.isFinite(tonic)) return options
	const target = wrapPitchClass(tonic + (options.tuningSemitones ?? 0))
	const firstPartial = options.fundamental * options.ratios[0]
	const ratio = getNearestPitchClassRatio(firstPartial, target)
	return { ...options, ratios:options.ratios.map(partial => partial * ratio) }
}
