import { createKick, createKicks, DEFAULT_KICK_OPTIONS } from './synthesizers/kick' 
import { createClack, createClacks, PRESET_RIM_CLACK, PRESET_CROSS_STICK, PRESET_CLAVE_CLACK, PRESET_WOODBLOCK_CLACK, PRESET_CASTANET_CLACK } from './synthesizers/clack'
import { createHihat, createHihats, OPEN_HIHAT_CRASH, OPEN_HIHAT_RIDE, OPEN_HIHAT_SPLASH, OPEN_HIHAT_CHINA } from './synthesizers/hihat'
import { createCowbell, createCowbells, DEFAULT_COWBELL_OPTIONS, PRESET_727_HIGH_AGOGO, PRESET_727_LOW_AGOGO } from './synthesizers/cowbell'
import { createSnare, createSnares, DEFAULT_SNARE_OPTIONS } from './synthesizers/snare' 
import { createClap, createClaps, PRESET_FINGER_SNAP } from './synthesizers/clap'
import { createTom, PRESET_LOW_TOM, PRESET_MID_TOM, PRESET_HIGH_TOM, PRESET_727_HIGH_TIMBALE, PRESET_727_LOW_TIMBALE, PRESET_OPEN_SURDO, PRESET_MUTED_SURDO } from './synthesizers/tom'
import {
	createHandDrum,
	PRESET_727_HIGH_BONGO,
	PRESET_727_LOW_BONGO,
	PRESET_808_MUTE_CONGA,
	PRESET_808_HIGH_CONGA,
	PRESET_808_LOW_CONGA,
} from './synthesizers/hand-drum.js'
import { createShaker, PRESET_727_CABASA, PRESET_808_MARACAS } from './synthesizers/shaker.js'
import { createTriangle, PRESET_MUTED_TRIANGLE, PRESET_OPEN_TRIANGLE } from './synthesizers/triangle.js'
import { createJingle, PRESET_707_TAMBOURINE, PRESET_CHEKERE } from './synthesizers/jingle.js'
import { createScrape, PRESET_SHORT_GUIRO, PRESET_LONG_GUIRO, PRESET_727_QUIJADA } from './synthesizers/scrape.js'
import { createFrictionDrum, PRESET_MUTED_CUICA, PRESET_OPEN_CUICA } from './synthesizers/friction-drum.js'
import { createWhistle, PRESET_727_SHORT_WHISTLE, PRESET_727_LONG_WHISTLE } from './synthesizers/whistle.js'
import { createChime, PRESET_727_STAR_CHIME, PRESET_WIND_CHIME } from './synthesizers/chime.js'
import { createElectronicPercussion, PRESET_SYNDRUM, PRESET_LASER_TOM, PRESET_METALLIC_HIT } from './synthesizers/electronic-percussion.js'
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
	const createPanBus = destination => {
		if (typeof audioContext.createStereoPanner !== 'function')
		{
			return { input:destination, setPan:() => 0 }
		}
		const panner = audioContext.createStereoPanner()
		panner.connect(destination)
		return {
			input:panner,
			setPan:(value=0, triggerAt=audioContext.currentTime) => {
				const pan = Math.max(-1, Math.min(1, Number(value) || 0))
				panner.pan.setValueAtTime(pan, triggerAt)
				return pan
			}
		}
	}
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
	const snarePanBus = createPanBus(snareReverb.input)
	const tomPanBus = createPanBus(output)
	const rawKick = createKick(audioContext, output)
	const rawSnare = createSnare(audioContext, snarePanBus.input)
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
		tomLow : wrapPresetVoice("tomLow", createTom(audioContext, tomPanBus.input), PRESET_LOW_TOM),
		tomMid : wrapPresetVoice("tomMid", createTom(audioContext, tomPanBus.input), PRESET_MID_TOM),
		tomHigh : wrapPresetVoice("tomHigh", createTom(audioContext, tomPanBus.input), PRESET_HIGH_TOM),
		bongoHigh : wrapPresetVoice("bongoHigh", createHandDrum(audioContext, output), PRESET_727_HIGH_BONGO),
		bongoLow : wrapPresetVoice("bongoLow", createHandDrum(audioContext, output), PRESET_727_LOW_BONGO),
		congaMute : wrapPresetVoice("congaMute", createHandDrum(audioContext, output), PRESET_808_MUTE_CONGA),
		congaHigh : wrapPresetVoice("congaHigh", createHandDrum(audioContext, output), PRESET_808_HIGH_CONGA),
		congaLow : wrapPresetVoice("congaLow", createHandDrum(audioContext, output), PRESET_808_LOW_CONGA),
		cabasa : wrapPresetVoice("cabasa", createShaker(audioContext, output), PRESET_727_CABASA),
		maracas : wrapPresetVoice("maracas", createShaker(audioContext, output), PRESET_808_MARACAS),
		triangleMute : wrapPresetVoice("triangleMute", createTriangle(audioContext, output), PRESET_MUTED_TRIANGLE),
		triangleOpen : wrapPresetVoice("triangleOpen", createTriangle(audioContext, output), PRESET_OPEN_TRIANGLE),
		rimshot : wrapPresetVoice("rimshot", createClack(audioContext, output), PRESET_RIM_CLACK),
		crossStick : wrapPresetVoice("crossStick", createClack(audioContext, output), PRESET_CROSS_STICK),
		claves : wrapPresetVoice("claves", createClack(audioContext, output), PRESET_CLAVE_CLACK),
		woodblockHigh : wrapPresetVoice("woodblockHigh", createClack(audioContext, output), PRESET_WOODBLOCK_CLACK),
		woodblockLow : wrapPresetVoice("woodblockLow", createClack(audioContext, output), { ...PRESET_WOODBLOCK_CLACK, name:"Low Woodblock", octave:0.76 }),
		castanets : wrapPresetVoice("castanets", createClack(audioContext, output), PRESET_CASTANET_CLACK),
		crash : wrapPresetVoice("crash", createHihat(audioContext, output), OPEN_HIHAT_CRASH),
		ride : wrapPresetVoice("ride", createHihat(audioContext, output), OPEN_HIHAT_RIDE),
		splash : wrapPresetVoice("splash", createHihat(audioContext, output), OPEN_HIHAT_SPLASH),
		china : wrapPresetVoice("china", createHihat(audioContext, output), OPEN_HIHAT_CHINA),
		tambourine : wrapPresetVoice("tambourine", createJingle(audioContext, output), PRESET_707_TAMBOURINE),
		chekere : wrapPresetVoice("chekere", createJingle(audioContext, output), PRESET_CHEKERE),
		agogoHigh : wrapPresetVoice("agogoHigh", createCowbell(audioContext, output), PRESET_727_HIGH_AGOGO),
		agogoLow : wrapPresetVoice("agogoLow", createCowbell(audioContext, output), PRESET_727_LOW_AGOGO),
		timbaleHigh : wrapPresetVoice("timbaleHigh", createTom(audioContext, output), PRESET_727_HIGH_TIMBALE),
		timbaleLow : wrapPresetVoice("timbaleLow", createTom(audioContext, output), PRESET_727_LOW_TIMBALE),
		guiroShort : wrapPresetVoice("guiroShort", createScrape(audioContext, output), PRESET_SHORT_GUIRO),
		guiroLong : wrapPresetVoice("guiroLong", createScrape(audioContext, output), PRESET_LONG_GUIRO),
		cuicaMute : wrapPresetVoice("cuicaMute", createFrictionDrum(audioContext, output), PRESET_MUTED_CUICA),
		cuicaOpen : wrapPresetVoice("cuicaOpen", createFrictionDrum(audioContext, output), PRESET_OPEN_CUICA),
		whistleShort : wrapPresetVoice("whistleShort", createWhistle(audioContext, output), PRESET_727_SHORT_WHISTLE),
		whistleLong : wrapPresetVoice("whistleLong", createWhistle(audioContext, output), PRESET_727_LONG_WHISTLE),
		surdoMute : wrapPresetVoice("surdoMute", createTom(audioContext, output), PRESET_MUTED_SURDO),
		surdoOpen : wrapPresetVoice("surdoOpen", createTom(audioContext, output), PRESET_OPEN_SURDO),
		quijada : wrapPresetVoice("quijada", createScrape(audioContext, output), PRESET_727_QUIJADA),
		starChime : wrapPresetVoice("starChime", createChime(audioContext, output), PRESET_727_STAR_CHIME),
		windChime : wrapPresetVoice("windChime", createChime(audioContext, output), PRESET_WIND_CHIME),
		fingerSnap : wrapPresetVoice("fingerSnap", createClap(audioContext, output), PRESET_FINGER_SNAP),
		syndrum : wrapPresetVoice("syndrum", createElectronicPercussion(audioContext, output), PRESET_SYNDRUM),
		laserTom : wrapPresetVoice("laserTom", createElectronicPercussion(audioContext, output), PRESET_LASER_TOM),
		metalHit : wrapPresetVoice("metalHit", createElectronicPercussion(audioContext, output), PRESET_METALLIC_HIT),
	}
	const drumVoices = Object.values(drumkit)

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
		for (const voice of drumVoices) voice.cancel?.()
	}

	drumkit.choke = (duration, chokeAt) => {
		for (const voice of drumVoices) voice.choke?.(duration, chokeAt)
	}
	drumkit.setSnareReverb = snareReverb.setAmount
	drumkit.getSnareReverb = snareReverb.getAmount
	drumkit.setSnarePan = snarePanBus.setPan
	drumkit.setTomPan = tomPanBus.setPan
	drumkit.setTonic = pitchClass => tonic = Number.isFinite(pitchClass) ? pitchClass : undefined
	drumkit.getTonic = () => tonic
	drumkit.setMIDIPercussion = enabled => options.midiPercussion = Boolean(enabled)
	drumkit.getMIDIPercussion = () => Boolean(options.midiPercussion)

	return drumkit
}
