import { ZERO } from '../audio-constants.js'

// Presets live in their own file so they can be tweaked / extended
// without touching the synth engine.  Re-export everything for
// backwards compatibility with existing imports.
export {
	DEFAULT_KICK_OPTIONS,
	PRESET_808_KICK,
	PRESET_808_SUB_KICK,
	PRESET_909_KICK,
	PRESET_909_PUNCHY_KICK,
	PRESET_707_KICK,
	PRESET_LINN_KICK,
	PRESET_CR78_KICK,
	PRESET_606_KICK,
	PRESET_505_KICK,
	PRESET_CASIO_RZ1_KICK,
	PRESET_KORG_DDD1_KICK,
	PRESET_KORG_KR55_KICK,
	PRESET_BOSS_DR55_KICK,
	PRESET_OBERHEIM_DMX_KICK,
	PRESET_DRUMTRAKS_KICK,
	PRESET_SP1200_KICK,
	PRESET_YAMAHA_RX5_KICK,
	PRESET_ALESIS_HR16_KICK,
	PRESET_SIMMONS_SDSV_KICK,
	PRESET_TECH_HOUSE_KICK,
	PRESET_DEEP_HOUSE_KICK,
	PRESET_MINIMAL_TECHNO_KICK,
	PRESET_DETROIT_KICK,
	PRESET_BERLIN_KICK,
	PRESET_ACID_KICK,
	PRESET_HARDSTYLE_KICK,
	PRESET_GABBER_KICK,
	PRESET_INDUSTRIAL_KICK,
	PRESET_HARDCORE_KICK,
	PRESET_TRAP_KICK,
	PRESET_DUBSTEP_KICK,
	PRESET_HIPHOP_KICK,
	PRESET_BOOM_BAP_KICK,
	PRESET_DRILL_KICK,
	PRESET_JUNGLE_KICK,
	PRESET_DNB_KICK,
	PRESET_BREAKBEAT_KICK,
	PRESET_ELECTRO_KICK,
	PRESET_SYNTHWAVE_KICK,
	PRESET_VINTAGE_KICK,
	PRESET_BEEFY_KICK,
	PRESET_LOW_KICK,
	PRESET_THUD_KICK,
	PRESET_CLICK_KICK,
	PRESET_LOFI_KICK,
	PRESET_AMBIENT_KICK,
	PRESET_CINEMATIC_KICK,
	PRESET_DUSTY_KICK,
	PRESET_PUNCH_KICK,
	PRESET_PILLOW_KICK,
	PRESET_DISTORTED_KICK,
	PRESET_RAVE_KICK,
	PRESET_SUB_BOOMER_KICK,
	PRESET_TICK_KICK,
	PRESET_PITCH_DIVE_KICK,
	PRESET_ELASTIC_KICK,
	PRESETS_KICKS,
	getKickPresets,
	getRandomKickPreset,
} from './kick-presets.js'

import { DEFAULT_KICK_OPTIONS } from './kick-presets.js'
import { getVelocityEnvelopeLevels } from './percussion-envelope.js'
import { resolvePercussionPitchEnvelope, schedulePercussionPitchEnvelope } from './percussion-pitch-envelope.js'

export const DEFAULT_KICK_VOICES = 8
const VOICE_STEAL_RELEASE = 0.005

const clampPositive = (value, fallback=ZERO) => Math.max(Number(value) || fallback, fallback)
const interpolateExponential = (from, to, progress) =>
	from * ((to / from) ** Math.min(1, Math.max(0, progress)))

const getEnvelopeValueAtTime = (voice, time) => {
	const { startAt, attackEndAt, decayEndAt, releaseStartAt, endAt, levels } = voice
	if (time <= startAt || time >= endAt) return ZERO
	if (time < attackEndAt) {
		return interpolateExponential(ZERO, levels.peak, (time - startAt) / (attackEndAt - startAt))
	}
	if (time < decayEndAt) {
		return interpolateExponential(levels.peak, levels.sustain, (time - attackEndAt) / (decayEndAt - attackEndAt))
	}
	if (time < releaseStartAt) return levels.sustain
	return interpolateExponential(levels.sustain, ZERO, (time - releaseStartAt) / (endAt - releaseStartAt))
}

/**
 * Kick me!
 * @returns {Function} trigger start method
 */
export const createKick = (audioContext, output, poolOptions={}) => {
	const requestedVoices = Number(poolOptions.maxVoices ?? DEFAULT_KICK_VOICES)
	const maxVoices = Number.isFinite(requestedVoices)
		? Math.max(1, Math.floor(requestedVoices))
		: DEFAULT_KICK_VOICES
	const activeVoices = []

	const removeVoice = voice => {
		const index = activeVoices.indexOf(voice)
		if (index >= 0) activeVoices.splice(index, 1)
	}

	const stopVoice = (voice, fadeStartAt, fadeDuration=VOICE_STEAL_RELEASE) => {
		if (voice.stopped) return
		const startAt = Math.max(audioContext.currentTime, fadeStartAt)
		if (voice.endAt <= startAt) {
			removeVoice(voice)
			return
		}
		const stopAt = Math.min(voice.endAt, startAt + Math.max(fadeDuration, ZERO))
		const level = getEnvelopeValueAtTime(voice, startAt)

		voice.gains.forEach(gain => {
			gain.cancelScheduledValues(startAt)
			gain.setValueAtTime(Math.max(level, ZERO), startAt)
			gain.exponentialRampToValueAtTime(ZERO, stopAt)
		})
		voice.oscillators.forEach(oscillator => oscillator.stop(stopAt))
		voice.endAt = stopAt
		voice.stopped = true
		removeVoice(voice)
	}

	const reserveVoice = requestedTime => {
		for (const voice of [...activeVoices]) {
			if (voice.endAt <= requestedTime) removeVoice(voice)
		}
		if (activeVoices.length < maxVoices) return requestedTime

		const oldest = activeVoices.reduce((first, voice) =>
			voice.startAt < first.startAt ? voice : first
		)
		const scheduledFadeAt = requestedTime - VOICE_STEAL_RELEASE
		if (scheduledFadeAt >= audioContext.currentTime) {
			stopVoice(oldest, scheduledFadeAt, VOICE_STEAL_RELEASE)
			return requestedTime
		}

		const replacementTime = audioContext.currentTime + VOICE_STEAL_RELEASE
		stopVoice(oldest, audioContext.currentTime, VOICE_STEAL_RELEASE)
		return Math.max(requestedTime, replacementTime)
	}

	// sustain measured in volume rather than time
	const kick = ( options=DEFAULT_KICK_OPTIONS ) => {

		options = Object.assign({}, DEFAULT_KICK_OPTIONS, options )
		const requestedTime = Number.isFinite(options.triggerAt) && options.triggerAt > 0
			? Math.max(audioContext.currentTime, options.triggerAt)
			: audioContext.currentTime + ZERO
		const time = reserveVoice(requestedTime)
		const length = clampPositive(options.length)
		const endAt = time + length
		const attackEndAt = time + Math.min(length, clampPositive(options.attack))
		const decayEndAt = attackEndAt + Math.min(endAt - attackEndAt, clampPositive(options.decay))
		const releaseStartAt = Math.max(decayEndAt, endAt - Math.max(Number(options.release) || 0, ZERO))

		const mainOscillator = audioContext.createOscillator()
		const subOscillator = audioContext.createOscillator()
		const gainTriangle = audioContext.createGain()
		const gainSine = audioContext.createGain()
		mainOscillator.type = "triangle"
		subOscillator.type = "sine"
		mainOscillator.connect(gainTriangle)
		gainTriangle.connect(output)
		subOscillator.connect(gainSine)
		gainSine.connect(output)

		// set new envelopes
		const levels = getVelocityEnvelopeLevels(options)
		const voice = {
			startAt:time,
			attackEndAt,
			decayEndAt,
			releaseStartAt,
			endAt,
			levels,
			gains:[gainTriangle.gain, gainSine.gain],
			oscillators:[mainOscillator, subOscillator],
			stopped:false,
		}
		activeVoices.push(voice)

		// TRIANGLE
		gainTriangle.gain.setValueAtTime(ZERO, time)
		gainTriangle.gain.exponentialRampToValueAtTime(levels.peak, attackEndAt)
		gainTriangle.gain.exponentialRampToValueAtTime(levels.sustain, decayEndAt)
		gainTriangle.gain.setValueAtTime(levels.sustain, releaseStartAt)
		gainTriangle.gain.exponentialRampToValueAtTime(ZERO, endAt)

		const pitch = resolvePercussionPitchEnvelope(options, time, endAt)
		schedulePercussionPitchEnvelope(mainOscillator.frequency, {
			start:options.triStart,
			end:options.triEnd,
		}, { ...pitch, startAt:time, attack:options.attack, decay:options.decay })
	
		// SINE
		gainSine.gain.setValueAtTime(ZERO, time)
		gainSine.gain.exponentialRampToValueAtTime(levels.peak, attackEndAt)
		gainSine.gain.exponentialRampToValueAtTime(levels.sustain, decayEndAt)
		gainSine.gain.setValueAtTime(levels.sustain, releaseStartAt)
		gainSine.gain.exponentialRampToValueAtTime(ZERO, endAt)

		schedulePercussionPitchEnvelope(subOscillator.frequency, {
			start:options.sineStart,
			apex:options.sineApex,
			sustain:options.sineSustain,
			end:options.sineEnd,
		}, { ...pitch, startAt:time, attack:options.attack, decay:options.decay })

		mainOscillator.start(time)
		subOscillator.start(time)
		mainOscillator.stop(endAt)
		subOscillator.stop(endAt)
		mainOscillator.onended = () => {
			removeVoice(voice)
			mainOscillator.disconnect()
			subOscillator.disconnect()
			gainTriangle.disconnect()
			gainSine.disconnect()
		}

		return { ...options, triggerAt:time }
	}

	kick.cancel = () => {
		for (const voice of [...activeVoices]) stopVoice(voice, audioContext.currentTime)
	}
	kick.choke = (duration=VOICE_STEAL_RELEASE, chokeAt=audioContext.currentTime) => {
		for (const voice of [...activeVoices]) stopVoice(voice, chokeAt, duration)
	}
	Object.defineProperty(kick, 'activeVoiceCount', { get:() => activeVoices.length })
	Object.defineProperty(kick, 'maxVoices', { value:maxVoices })

	return kick
}

export const createKicks = (audioContext, output, quantity=DEFAULT_KICK_VOICES) =>
	createKick(audioContext, output, { maxVoices:quantity })
