import { DEFAULT_CLOCK_DIVISIONS_PER_BAR } from './arpeggio.js'

export const NOTE_REPEAT_PPQ = 24
export const DEFAULT_NOTE_REPEAT_TICKS = NOTE_REPEAT_PPQ / 2
export const STRING_NOTE_REPEAT_TICKS = NOTE_REPEAT_PPQ / 4
export const SPEECH_NOTE_REPEAT_TICKS = NOTE_REPEAT_PPQ * 2

const LEGACY_FAST_REPEAT_FAMILIES = new Set(["Strings", "Ensemble"])
const LEGACY_CONTINUOUS_TYPES = new Set([
	"oscillator",
	"synthesizer",
	"worklet",
	"yoshimi",
	"web audio module 1",
	"web audio module 2"
])

const getPlayableInstrument = instrument => {
	let playable = instrument
	const visited = new Set()
	while (playable?.instruments?.length && playable.type !== "composite" && !visited.has(playable))
	{
		visited.add(playable)
		playable = playable.instruments[0]
	}
	return playable ?? instrument
}

const getConfiguredNoteRepeatTicks = (person, ticksPerBar) => {
	const rateOverride = person?.options?.repetitionRate
	if (rateOverride !== undefined && rateOverride !== null && rateOverride !== "")
	{
		const rate = Number(rateOverride)
		if (Number.isFinite(rate) && rate >= 0) return rate > 0 ? Math.max(1, ticksPerBar / rate) : 0
	}

	const override = Number(person?.options?.noteRepeatTicks)
	if (Number.isInteger(override) && override >= 0 && person?.options?.noteRepeatTicks != null)
	{
		return override
	}

	const instrument = getPlayableInstrument(person?.activeInstrument)
	if (instrument && "repetitionRate" in instrument)
	{
		const repetitionRate = Number(instrument.repetitionRate)
		return Number.isFinite(repetitionRate) && repetitionRate > 0 ? Math.max(1, ticksPerBar / repetitionRate) : 0
	}

	// Compatibility for external/plain-object instruments which have not yet
	// adopted the shared Instrument interface.
	const instrumentType = instrument?.type ?? instrument?.name ?? ""
	const instrumentFamily = instrument?.instrumentFamily ?? instrument?.family ?? ""
	if (LEGACY_CONTINUOUS_TYPES.has(instrumentType)) return 0
	if (instrumentType === "speech") return SPEECH_NOTE_REPEAT_TICKS
	if (LEGACY_FAST_REPEAT_FAMILIES.has(instrumentFamily)) return STRING_NOTE_REPEAT_TICKS
	return DEFAULT_NOTE_REPEAT_TICKS
}

export const getPersonNoteRepeatTicks = (person, ticksPerBar = DEFAULT_CLOCK_DIVISIONS_PER_BAR, tickDurationMs) => {
	const ticks = getConfiguredNoteRepeatTicks(person, ticksPerBar)
	if (ticks <= 0 || !(tickDurationMs > 0)) return ticks
	const instrument = getPlayableInstrument(person?.activeInstrument)
	// The shortest chord sample must still be sounding when the next attack starts.
	const notes = person?.activeNotes?.get(person.noteNumber) ?? [person?.noteNumber]
	let safeTicks = ticks
	for (const note of notes)
	{
		const duration = instrument?.getNoteRepeatDuration?.(note?.noteNumber ?? note)
		if (Number.isFinite(duration) && duration >= 0)
		{
			safeTicks = Math.min(safeTicks, Math.max(1, Math.floor(duration * 1000 / tickDurationMs)))
		}
	}
	return safeTicks
}

export const isPersonNoteRepeatDue = (person, pulse, ticksPerBar = DEFAULT_CLOCK_DIVISIONS_PER_BAR, tickDurationMs) => {
	if (
		person?.options?.autoRepeat !== true ||
		!person.singing ||
		!(person.noteVelocity > 0) ||
		!Number.isInteger(pulse) || pulse < 0
	)
	{
		return false
	}

	const repeatTicks = getPersonNoteRepeatTicks(person, ticksPerBar, tickDurationMs)
	return repeatTicks > 0 &&
		Math.floor(pulse / repeatTicks) > Math.floor((pulse - 1) / repeatTicks) &&
		person.lastNoteRepeatedTick !== pulse
}

