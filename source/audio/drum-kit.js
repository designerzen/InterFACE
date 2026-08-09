import { createKick, createKicks, DEFAULT_KICK_OPTIONS } from './synthesizers/kick' 
import { createClack, createClacks } from './synthesizers/clack' 
import { createHihat, createHihats } from './synthesizers/hihat' 
import { createCowbell, createCowbells, DEFAULT_COWBELL_OPTIONS } from './synthesizers/cowbell' 
import { createSnare, createSnares, DEFAULT_SNARE_OPTIONS } from './synthesizers/snare' 
import { createClap, createClaps } from './synthesizers/clap' 
import { createTom, PRESET_LOW_TOM, PRESET_MID_TOM, PRESET_HIGH_TOM } from './synthesizers/tom'
import { createSnareReverb } from './effects/snare-reverb.js'
import { tuneCowbellOptions, tuneKickOptions, tuneSnareOptions } from './synthesizers/percussion-tuning.js'
import { sendGeneralMIDIPercussion } from './midi/general-midi-percussion-output.js'

/**
 * Just a drum kit you can play that has one of each of the
 * drum sounds set up in cascades. simply createDrumkit().kick() etc
 * @returns {Object<Function>} all individual instruments
 */
export const createDrumkit = ( audioContext, output, options={} ) => {
	let tonic
	const wrapMIDIVoice = (part, voice) => {
		const midiVoice = (voiceOptions={}) => {
			if (options.midiPercussion)
			{
				sendGeneralMIDIPercussion(part, voiceOptions, audioContext)
			}
			return voice(voiceOptions)
		}
		midiVoice.cancel = voice.cancel
		midiVoice.choke = voice.choke
		return midiVoice
	}
	const snareReverb = createSnareReverb(audioContext, output)
	const rawKick = createKick(audioContext, output)
	const rawSnare = createSnare(audioContext, snareReverb.input)
	const rawCowbell = createCowbell(audioContext, output)
	const wrapTunedVoice = (part, voice, tune, defaults) => {
		const midiVoice = wrapMIDIVoice(part, voice)
		const tunedVoice = (options={}) => midiVoice(tune({ ...defaults, ...options }, tonic))
		tunedVoice.cancel = voice.cancel
		tunedVoice.choke = voice.choke
		return tunedVoice
	}
	const wrapPresetVoice = (part, voice, preset) => {
		const midiVoice = wrapMIDIVoice(part, voice)
		const presetVoice = (voiceOptions={}) => midiVoice({ ...preset, ...voiceOptions })
		presetVoice.cancel = voice.cancel
		presetVoice.choke = voice.choke
		return presetVoice
	}
	const openHat = wrapMIDIVoice("hatOpen", createHihat(audioContext, output))
	const closedHat = wrapMIDIVoice("hatClosed", createHihat(audioContext, output))
	const hat = (options={}) => {
		const triggerAt = options.triggerAt ?? audioContext.currentTime
		const isOpen = options.open ?? /\b(open|ride|crash)\b/i.test(options.name ?? "")
		if (isOpen)
		{
			return openHat(options)
		}

		// Traditional electronic drum-machine choke group: a closed hat cuts
		// the ringing open cymbal with a very short, click-free release.
		openHat.choke(0.006, triggerAt)
		return closedHat(options)
	}
	hat.cancel = () => {
		openHat.cancel()
		closedHat.cancel()
	}
	hat.choke = (duration, chokeAt) => {
		openHat.choke(duration, chokeAt)
		closedHat.choke(duration, chokeAt)
	}
	hat.open = openHat
	hat.closed = closedHat

	const drumkit = {
		kick : wrapTunedVoice("kick", rawKick, tuneKickOptions, DEFAULT_KICK_OPTIONS),
		snare : wrapTunedVoice("snare", rawSnare, tuneSnareOptions, DEFAULT_SNARE_OPTIONS),
		hat,
		cowbell : wrapTunedVoice("cowbell", rawCowbell, tuneCowbellOptions, DEFAULT_COWBELL_OPTIONS),
		clack : wrapMIDIVoice("clack", createClack(audioContext, output)),
		clap : wrapMIDIVoice("clap", createClap(audioContext, output)),
		tomLow : wrapPresetVoice("tomLow", createTom(audioContext, output), PRESET_LOW_TOM),
		tomMid : wrapPresetVoice("tomMid", createTom(audioContext, output), PRESET_MID_TOM),
		tomHigh : wrapPresetVoice("tomHigh", createTom(audioContext, output), PRESET_HIGH_TOM),
	}

	// you can set the options on the individual instruments

	// drumkit.setOptions = (options) => {
	// 	for (let key in options)
	// 	{
	// 		drumkit.kick[key] = options[key]
	// 		drumkit.snare[key] = options[key]
	// 		drumkit.hat[key] = options[key]
	// 		drumkit.cowbell[key] = options[key]
	// 		drumkit.clack[key] = options[key]
	// 		drumkit.clap[key] = options[key]
	// 	}
	// }

	drumkit.cancel = () => {
		drumkit.kick.cancel?.()
		drumkit.snare.cancel?.()
		drumkit.hat.cancel?.()
		drumkit.cowbell.cancel?.()
		drumkit.clack.cancel?.()
		drumkit.clap.cancel?.()
		drumkit.tomLow.cancel?.()
		drumkit.tomMid.cancel?.()
		drumkit.tomHigh.cancel?.()
	}

	drumkit.choke = (duration, chokeAt) => {
		drumkit.kick.choke?.(duration, chokeAt)
		drumkit.snare.choke?.(duration, chokeAt)
		drumkit.hat.choke?.(duration, chokeAt)
		drumkit.cowbell.choke?.(duration, chokeAt)
		drumkit.clack.choke?.(duration, chokeAt)
		drumkit.clap.choke?.(duration, chokeAt)
		drumkit.tomLow.choke?.(duration, chokeAt)
		drumkit.tomMid.choke?.(duration, chokeAt)
		drumkit.tomHigh.choke?.(duration, chokeAt)
	}
	drumkit.setSnareReverb = snareReverb.setAmount
	drumkit.getSnareReverb = snareReverb.getAmount
	drumkit.setTonic = pitchClass => tonic = Number.isFinite(pitchClass) ? pitchClass : undefined
	drumkit.getTonic = () => tonic
	drumkit.setMIDIPercussion = enabled => options.midiPercussion = Boolean(enabled)
	drumkit.getMIDIPercussion = () => Boolean(options.midiPercussion)

	return drumkit
}
