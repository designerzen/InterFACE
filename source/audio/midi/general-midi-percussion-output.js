import { WebMidi } from "webmidi"
import { sendGuardedMIDIOutput } from "./midi-echo-guard.js"

export const GENERAL_MIDI_PERCUSSION_CHANNEL = 10

export const GENERAL_MIDI_PERCUSSION_NOTES = Object.freeze({
	kick:36,
	clack:37,
	snare:38,
	clap:39,
	hatClosed:42,
	hatOpen:46,
	tomLow:45,
	tomMid:47,
	tomHigh:50,
	cowbell:56,
})

const clampVelocity = value => Math.min(1, Math.max(0, Number(value) || 0))

const resolvePart = (part, options) => part === "hat" ?
	(options.open ? "hatOpen" : "hatClosed") :
	part

const getMIDITime = (audioContext, triggerAt) => {
	const now = Number.isFinite(WebMidi.time) ? WebMidi.time : performance.now()
	const delay = Number.isFinite(triggerAt) && audioContext ?
		Math.max(0, triggerAt - audioContext.currentTime) * 1000 :
		0
	return now + delay
}

/**
 * Send a percussion hit using the General MIDI drum convention: channel 10,
 * with each drum voice assigned to its standard note number.
 */
export const sendGeneralMIDIPercussion = (part, options={}, audioContext) => {
	const resolvedPart = resolvePart(part, options)
	const noteNumber = GENERAL_MIDI_PERCUSSION_NOTES[resolvedPart]
	if (!Number.isInteger(noteNumber))
	{
		return 0
	}

	const time = getMIDITime(audioContext, options.triggerAt)
	const duration = resolvedPart === "hatOpen" ? 220 : 60
	const attack = clampVelocity(options.velocity ?? 1)
	let sent = 0

	for (const output of WebMidi.outputs ?? [])
	{
		const source = `general-midi-percussion-${resolvedPart}`
		const noteOnOptions = {
			channels:GENERAL_MIDI_PERCUSSION_CHANNEL,
			attack,
			time,
		}
		if (sendGuardedMIDIOutput(output, "playNote", noteNumber, noteOnOptions, source))
		{
			sendGuardedMIDIOutput(output, "stopNote", noteNumber, {
				channels:GENERAL_MIDI_PERCUSSION_CHANNEL,
				release:0,
				time:time + duration,
			}, source)
			sent++
		}
	}

	return sent
}
