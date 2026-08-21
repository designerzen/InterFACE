import { WebMidi } from "webmidi"
import { sendGuardedMIDIOutput } from "./midi-echo-guard.js"

export const GENERAL_MIDI_PERCUSSION_CHANNEL = 10

export const GENERAL_MIDI_PERCUSSION_NOTES = Object.freeze({
	kickAcoustic:35,
	kick:36,
	clack:37,
	snare:38,
	clap:39,
	snareElectric:40,
	tomFloorLow:41,
	hatClosed:42,
	tomFloorHigh:43,
	hatPedal:44,
	hatOpen:46,
	tomLow:45,
	tomMid:47,
	tomMidHigh:48,
	tomHigh:50,
	cowbell:56,
	bongoHigh:60,
	bongoLow:61,
	congaMute:62,
	congaHigh:63,
	congaLow:64,
	cabasa:69,
	maracas:70,
	triangleMute:80,
	triangleOpen:81,
	rimshot:37,
	crossStick:37,
	claves:75,
	woodblockHigh:76,
	woodblockLow:77,
	castanets:85,
	crash:49,
	ride:51,
	rideBell:53,
	splash:55,
	china:52,
	crash2:57,
	vibraslap:58,
	ride2:59,
	tambourine:54,
	chekere:82,
	jingleBell:83,
	agogoHigh:67,
	agogoLow:68,
	timbaleHigh:65,
	timbaleLow:66,
	guiroShort:73,
	guiroLong:74,
	cuicaMute:78,
	cuicaOpen:79,
	whistleShort:71,
	whistleLong:72,
	surdoMute:86,
	surdoOpen:87,
	quijada:74,
	starChime:84,
	windChime:84,
	fingerSnap:39,
	syndrum:47,
	laserTom:48,
	metalHit:53,
})

const clampVelocity = value => Math.min(1, Math.max(0, Number(value) || 0))

const resolvePart = (part, options) => part === "hat" ?
	(options.open ? "hatOpen" : "hatClosed") :
	part

const LONG_PERCUSSION_VOICES = new Set(["triangleOpen", "crash", "crash2", "ride", "ride2", "rideBell", "splash", "china", "jingleBell", "starChime", "windChime", "whistleLong", "surdoOpen"])

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
	const duration = LONG_PERCUSSION_VOICES.has(resolvedPart) ? 650 : resolvedPart === "hatOpen" ? 220 : 60
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
