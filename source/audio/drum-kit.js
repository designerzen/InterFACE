import { createKick, createKicks, DEFAULT_KICK_OPTIONS } from './synthesizers/kick' 
import { createClack, createClacks } from './synthesizers/clack' 
import { createHihat, createHihats } from './synthesizers/hihat' 
import { createCowbell, createCowbells, DEFAULT_COWBELL_OPTIONS } from './synthesizers/cowbell' 
import { createSnare, createSnares, DEFAULT_SNARE_OPTIONS } from './synthesizers/snare' 
import { createClap, createClaps } from './synthesizers/clap' 
import { createSnareReverb } from './effects/snare-reverb.js'
import { tuneCowbellOptions, tuneKickOptions, tuneSnareOptions } from './synthesizers/percussion-tuning.js'

/**
 * Just a drum kit you can play that has one of each of the
 * drum sounds set up in cascades. simply createDrumkit().kick() etc
 * @returns {Object<Function>} all individual instruments
 */
export const createDrumkit = ( audioContext, output ) => {
	let tonic
	const snareReverb = createSnareReverb(audioContext, output)
	const rawKick = createKick(audioContext, output)
	const rawSnare = createSnare(audioContext, snareReverb.input)
	const rawCowbell = createCowbell(audioContext, output)
	const wrapTunedVoice = (voice, tune, defaults) => {
		const tunedVoice = (options={}) => voice(tune({ ...defaults, ...options }, tonic))
		tunedVoice.cancel = voice.cancel
		tunedVoice.choke = voice.choke
		return tunedVoice
	}
	const openHat = createHihat(audioContext, output)
	const closedHat = createHihat(audioContext, output)
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
		kick : wrapTunedVoice(rawKick, tuneKickOptions, DEFAULT_KICK_OPTIONS),
		snare : wrapTunedVoice(rawSnare, tuneSnareOptions, DEFAULT_SNARE_OPTIONS),
		hat,
		cowbell : wrapTunedVoice(rawCowbell, tuneCowbellOptions, DEFAULT_COWBELL_OPTIONS),
		clack : createClack(audioContext, output),
		clap : createClap(audioContext, output),
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
	}

	drumkit.choke = (duration, chokeAt) => {
		drumkit.kick.choke?.(duration, chokeAt)
		drumkit.snare.choke?.(duration, chokeAt)
		drumkit.hat.choke?.(duration, chokeAt)
		drumkit.cowbell.choke?.(duration, chokeAt)
		drumkit.clack.choke?.(duration, chokeAt)
		drumkit.clap.choke?.(duration, chokeAt)
	}
	drumkit.setSnareReverb = snareReverb.setAmount
	drumkit.getSnareReverb = snareReverb.getAmount
	drumkit.setTonic = pitchClass => tonic = Number.isFinite(pitchClass) ? pitchClass : undefined
	drumkit.getTonic = () => tonic

	return drumkit
}
