/**
 * This is a special type of instrument that combines the face
 * 
 */
import Instrument from './instrument.js'
import { getKitSequence } from '../../timing/patterns.js'
import { applyDrumSubHitEnvelope, createDrumArranger } from '../../timing/drum-arranger.js'
import { AUXILIARY_DRUM_LANES } from '../../timing/drum-patterns.js'
import { createKick, getRandomKickPreset, PRESETS_KICKS } from '../synthesizers/kick.js'
import { createSnare, getRandomSnarePreset, PRESET_SNARES } from '../synthesizers/snare.js'
import {
	createHihat,
	getHihatPair,
	getRandomHihatPreset,
	PRESET_HIHATS,
	PRESET_HIHATS_CLOSED,
	PRESET_HIHATS_OPEN,
} from '../synthesizers/hihat.js'
import { createCowbell, PRESET_COWBELLS, PRESET_727_HIGH_AGOGO, PRESET_727_LOW_AGOGO } from '../synthesizers/cowbell.js'
import { createClack, PRESET_CLACKS, PRESET_RIM_CLACK, PRESET_CROSS_STICK, PRESET_CLAVE_CLACK, PRESET_WOODBLOCK_CLACK, PRESET_CASTANET_CLACK } from '../synthesizers/clack.js'
import { createClap, PRESET_CLAPS, PRESET_FINGER_SNAP } from '../synthesizers/clap.js'
import { createTom, PRESETS_TOMS, PRESET_727_HIGH_TIMBALE, PRESET_727_LOW_TIMBALE, PRESET_OPEN_SURDO, PRESET_MUTED_SURDO } from '../synthesizers/tom.js'
import {
	createHandDrum,
	PRESET_727_HIGH_BONGO,
	PRESET_727_LOW_BONGO,
	PRESET_808_MUTE_CONGA,
	PRESET_808_HIGH_CONGA,
	PRESET_808_LOW_CONGA,
	PRESET_BONGOS,
	PRESET_CONGAS,
} from '../synthesizers/hand-drum.js'
import { createShaker, PRESET_SHAKERS, PRESET_727_CABASA, PRESET_808_MARACAS } from '../synthesizers/shaker.js'
import { createTriangle, PRESET_TRIANGLES, PRESET_MUTED_TRIANGLE, PRESET_OPEN_TRIANGLE } from '../synthesizers/triangle.js'
import { OPEN_HIHAT_CRASH, OPEN_HIHAT_RIDE, OPEN_HIHAT_SPLASH, OPEN_HIHAT_CHINA } from '../synthesizers/hihat-presets.js'
import { createJingle, PRESET_JINGLES, PRESET_707_TAMBOURINE, PRESET_CHEKERE } from '../synthesizers/jingle.js'
import { createScrape, PRESET_SCRAPES, PRESET_SHORT_GUIRO, PRESET_LONG_GUIRO, PRESET_727_QUIJADA } from '../synthesizers/scrape.js'
import { createFrictionDrum, PRESET_FRICTION_DRUMS, PRESET_MUTED_CUICA, PRESET_OPEN_CUICA } from '../synthesizers/friction-drum.js'
import { createWhistle, PRESET_WHISTLES, PRESET_727_SHORT_WHISTLE, PRESET_727_LONG_WHISTLE } from '../synthesizers/whistle.js'
import { createChime, PRESET_CHIMES, PRESET_727_STAR_CHIME, PRESET_WIND_CHIME } from '../synthesizers/chime.js'
import { createElectronicPercussion, PRESET_ELECTRONIC_PERCUSSION, PRESET_SYNDRUM, PRESET_LASER_TOM, PRESET_METALLIC_HIT } from '../synthesizers/electronic-percussion.js'
import { PERCUSSION_SOUND_PRESETS, getPercussionPreset } from '../synthesizers/percussion-presets.js'
import { createSnareReverb } from '../effects/snare-reverb.js'
import { sendGeneralMIDIPercussion } from '../midi/general-midi-percussion-output.js'

export const OPTIONS_DRUMKIT = {
	
	// A detuning value (in cents) which will offset the frequency by the given amount. Its default is 0.
	detune:0,

	// The frequency (in hertz) of the periodic waveform. Its default is 440.
	frequency:440,

	// Optional starting tempo. The arranger will keep estimating live tempo from triggerAt.
	bpm:0,
	performanceDrums:true,
	snareReverb:0.24
}

export const INSTRUMENT_TYPE_DRUMKIT = "DrumkitInstrument"

const clamp = (value, minimum=0, maximum=1) => Math.min(maximum, Math.max(minimum, value))
const normalizePressure = pressure => clamp(Number(pressure) > 1 ? Number(pressure) / 127 : Number(pressure) || 0)

// Accept Web MIDI's -1..1 range and raw MIDI's 0..16383 range.
export const drumPitchBendToRatio = pitch => {
	const value = Number(pitch)
	if (!Number.isFinite(value)) return 1
	const normalized = Math.abs(value) > 2 ? clamp((value - 8192) / 8192, -1, 1) :
		clamp(value, -1, 1)
	return 2 ** ((normalized * 2) / 12)
}

const PRESETS_BY_PART = Object.freeze({
	kick:PRESETS_KICKS,
	snare:PRESET_SNARES,
	hat:PRESET_HIHATS,
	cowbell:PRESET_COWBELLS,
	bongoLow:PRESET_BONGOS,
	bongoHigh:PRESET_BONGOS,
	congaMute:PRESET_CONGAS,
	congaHigh:PRESET_CONGAS,
	congaLow:PRESET_CONGAS,
	cabasa:PRESET_SHAKERS,
	maracas:PRESET_SHAKERS,
	triangleMute:PRESET_TRIANGLES,
	triangleOpen:PRESET_TRIANGLES,
	rimshot:PRESET_CLACKS,
	crossStick:PRESET_CLACKS,
	claves:PRESET_CLACKS,
	woodblockHigh:PRESET_CLACKS,
	woodblockLow:PRESET_CLACKS,
	castanets:PRESET_CLACKS,
	crash:PRESET_HIHATS,
	ride:PRESET_HIHATS,
	splash:PRESET_HIHATS,
	china:PRESET_HIHATS,
	tambourine:PRESET_JINGLES,
	chekere:PRESET_JINGLES,
	agogoHigh:PRESET_COWBELLS,
	agogoLow:PRESET_COWBELLS,
	timbaleHigh:PRESETS_TOMS,
	timbaleLow:PRESETS_TOMS,
	guiroShort:PRESET_SCRAPES,
	guiroLong:PRESET_SCRAPES,
	cuicaMute:PRESET_FRICTION_DRUMS,
	cuicaOpen:PRESET_FRICTION_DRUMS,
	whistleShort:PRESET_WHISTLES,
	whistleLong:PRESET_WHISTLES,
	surdoMute:PRESETS_TOMS,
	surdoOpen:PRESETS_TOMS,
	quijada:PRESET_SCRAPES,
	starChime:PRESET_CHIMES,
	windChime:PRESET_CHIMES,
	fingerSnap:PRESET_CLAPS,
	syndrum:PRESET_ELECTRONIC_PERCUSSION,
	laserTom:PRESET_ELECTRONIC_PERCUSSION,
	metalHit:PRESET_ELECTRONIC_PERCUSSION,
})

const findNamedPreset = (part, name) => PRESETS_BY_PART[part]?.find(preset => preset.name === name)

export default class DrumkitInstrument extends Instrument{

	static get name(){
		return INSTRUMENT_TYPE_DRUMKIT
	}

	name = INSTRUMENT_TYPE_DRUMKIT

	type = "percussion"
	#title = "Percussion Instrument"

	kick 
	snare 
	hatOpen 
	hatClosed 
	cowbell 
	clack 
	clap 
	bongoHigh
	bongoLow
	congaMute
	congaHigh
	congaLow
	cabasa
	maracas
	triangleMute
	triangleOpen
	arranger
	lastTriggerAt = 0
	kickOptions = PRESETS_KICKS[0]
	snareOptions = PRESET_SNARES[0]
	hatOptions = PRESET_HIHATS[0]
	hatClosedOptions = PRESET_HIHATS_CLOSED[0]
	hatOpenOptions = PRESET_HIHATS_OPEN[0]
	voiceOptions = {}
	aftertouchPressure = 0
	aftertouchByNote = new Map()
	pitchBendValue = 0
	pitchBendRatio = 1
	programNumber = 0
	programPreset = PERCUSSION_SOUND_PRESETS[0]

	get activePreset() {
		return this.programPreset?.title ?? null
	}

	get activePresetIndex() {
		return this.programNumber
	}

	get volume() {
		return this.gainNode.gain.value
	}

	set volume(value) {
		this.gainNode.gain.value = value
	}
	
	get audioNode(){
		return this.gainNode
	}

	async create(){
		this.gainNode = this.context.createGain()
		this.gainNode.gain.value = 1 // this.currentVolume
		
		const wrapMIDIVoice = (part, voice) => {
			const midiVoice = (options={}) => {
				const performedOptions = this.applyPerformanceControls({ ...this.voiceOptions[part], ...options })
				if (this.options.midiPercussion)
				{
					sendGeneralMIDIPercussion(part, performedOptions, this.context)
				}
				return voice(performedOptions)
			}
			midiVoice.cancel = voice.cancel
			midiVoice.choke = voice.choke
			return midiVoice
		}
		this.kick = wrapMIDIVoice("kick", createKick(this.context, this.gainNode))
		this.snareReverb = createSnareReverb(this.context, this.gainNode, this.options.snareReverb)
		this.snare = wrapMIDIVoice("snare", createSnare(this.context, this.snareReverb.input))
		this.hatOpen = wrapMIDIVoice("hatOpen", createHihat(this.context, this.gainNode))
		this.hatClosed = wrapMIDIVoice("hatClosed", createHihat(this.context, this.gainNode))
		this.cowbell = wrapMIDIVoice("cowbell", createCowbell(this.context, this.gainNode))
		this.clack = wrapMIDIVoice("clack", createClack(this.context, this.gainNode))
		this.clap = wrapMIDIVoice("clap", createClap(this.context, this.gainNode))
		this.voiceOptions.cowbell = PRESET_COWBELLS[0]
		const createPresetVoice = (part, createVoice, preset) => {
			this.voiceOptions[part] = preset
			const voice = wrapMIDIVoice(part, createVoice(this.context, this.gainNode))
			const presetVoice = (options={}) => voice({ ...this.voiceOptions[part], ...options })
			presetVoice.cancel = voice.cancel
			presetVoice.choke = voice.choke
			return presetVoice
		}
		this.bongoHigh = createPresetVoice("bongoHigh", createHandDrum, PRESET_727_HIGH_BONGO)
		this.bongoLow = createPresetVoice("bongoLow", createHandDrum, PRESET_727_LOW_BONGO)
		this.congaMute = createPresetVoice("congaMute", createHandDrum, PRESET_808_MUTE_CONGA)
		this.congaHigh = createPresetVoice("congaHigh", createHandDrum, PRESET_808_HIGH_CONGA)
		this.congaLow = createPresetVoice("congaLow", createHandDrum, PRESET_808_LOW_CONGA)
		this.cabasa = createPresetVoice("cabasa", createShaker, PRESET_727_CABASA)
		this.maracas = createPresetVoice("maracas", createShaker, PRESET_808_MARACAS)
		this.triangleMute = createPresetVoice("triangleMute", createTriangle, PRESET_MUTED_TRIANGLE)
		this.triangleOpen = createPresetVoice("triangleOpen", createTriangle, PRESET_OPEN_TRIANGLE)
		this.rimshot = createPresetVoice("rimshot", createClack, PRESET_RIM_CLACK)
		this.crossStick = createPresetVoice("crossStick", createClack, PRESET_CROSS_STICK)
		this.claves = createPresetVoice("claves", createClack, PRESET_CLAVE_CLACK)
		this.woodblockHigh = createPresetVoice("woodblockHigh", createClack, PRESET_WOODBLOCK_CLACK)
		this.woodblockLow = createPresetVoice("woodblockLow", createClack, { ...PRESET_WOODBLOCK_CLACK, name:"Low Woodblock", octave:0.76 })
		this.castanets = createPresetVoice("castanets", createClack, PRESET_CASTANET_CLACK)
		this.crash = createPresetVoice("crash", createHihat, OPEN_HIHAT_CRASH)
		this.ride = createPresetVoice("ride", createHihat, OPEN_HIHAT_RIDE)
		this.splash = createPresetVoice("splash", createHihat, OPEN_HIHAT_SPLASH)
		this.china = createPresetVoice("china", createHihat, OPEN_HIHAT_CHINA)
		this.tambourine = createPresetVoice("tambourine", createJingle, PRESET_707_TAMBOURINE)
		this.chekere = createPresetVoice("chekere", createJingle, PRESET_CHEKERE)
		this.agogoHigh = createPresetVoice("agogoHigh", createCowbell, PRESET_727_HIGH_AGOGO)
		this.agogoLow = createPresetVoice("agogoLow", createCowbell, PRESET_727_LOW_AGOGO)
		this.timbaleHigh = createPresetVoice("timbaleHigh", createTom, PRESET_727_HIGH_TIMBALE)
		this.timbaleLow = createPresetVoice("timbaleLow", createTom, PRESET_727_LOW_TIMBALE)
		this.guiroShort = createPresetVoice("guiroShort", createScrape, PRESET_SHORT_GUIRO)
		this.guiroLong = createPresetVoice("guiroLong", createScrape, PRESET_LONG_GUIRO)
		this.cuicaMute = createPresetVoice("cuicaMute", createFrictionDrum, PRESET_MUTED_CUICA)
		this.cuicaOpen = createPresetVoice("cuicaOpen", createFrictionDrum, PRESET_OPEN_CUICA)
		this.whistleShort = createPresetVoice("whistleShort", createWhistle, PRESET_727_SHORT_WHISTLE)
		this.whistleLong = createPresetVoice("whistleLong", createWhistle, PRESET_727_LONG_WHISTLE)
		this.surdoMute = createPresetVoice("surdoMute", createTom, PRESET_MUTED_SURDO)
		this.surdoOpen = createPresetVoice("surdoOpen", createTom, PRESET_OPEN_SURDO)
		this.quijada = createPresetVoice("quijada", createScrape, PRESET_727_QUIJADA)
		this.starChime = createPresetVoice("starChime", createChime, PRESET_727_STAR_CHIME)
		this.windChime = createPresetVoice("windChime", createChime, PRESET_WIND_CHIME)
		this.fingerSnap = createPresetVoice("fingerSnap", createClap, PRESET_FINGER_SNAP)
		this.syndrum = createPresetVoice("syndrum", createElectronicPercussion, PRESET_SYNDRUM)
		this.laserTom = createPresetVoice("laserTom", createElectronicPercussion, PRESET_LASER_TOM)
		this.metalHit = createPresetVoice("metalHit", createElectronicPercussion, PRESET_METALLIC_HIT)
		this.percussionVoices = [this.kick,this.snare,this.hatOpen,this.hatClosed,this.cowbell,this.clack,this.clap,
			...AUXILIARY_DRUM_LANES.map(part => this[part])]
		
		this.patterns = getKitSequence()
		this.arranger = createDrumArranger({
			seed: this.id,
			bpm: this.options.bpm ?? 0,
			performanceControl: this.options.performanceDrums !== false
		})
		this.setHatPair(this.hatOptions)

		console.info("Drumkit.create() called", this )

		await super.create()
		return true
	}

	async destroy(){
		return await super.destroy()
	}

	constructor( audioContext, options={} ){
		super(audioContext, { ...OPTIONS_DRUMKIT, ...options })
	}

	setHatPair(hat){
		const pair = getHihatPair(hat)
		this.hatOptions = hat
		this.hatClosedOptions = pair.closed
		this.hatOpenOptions = pair.open
	}

	applyPerformanceControls(options={}) {
		const tuned = { ...options }
		const pitchRatio = this.pitchBendRatio
		for (const property of ['frequency', 'startFrequency', 'endFrequency']) {
			if (Number.isFinite(tuned[property])) tuned[property] *= pitchRatio
		}
		if (Number.isFinite(tuned.velocity)) {
			tuned.velocity = clamp(tuned.velocity * (1 + this.aftertouchPressure * 0.5))
		}
		return tuned
	}

	applyKitPreset(kit={}) {
		for (const [part, presetName] of Object.entries(kit)) {
			if (presetName === false) {
				this.voiceOptions[part] = null
				continue
			}
			const preset = findNamedPreset(part, presetName)
			if (!preset) continue
			if (part === 'kick') this.kickOptions = preset
			else if (part === 'snare') this.snareOptions = preset
			else if (part === 'hat') this.setHatPair(preset)
			else this.voiceOptions[part] = preset
		}
		return kit
	}

	randomizeDrumkitPreset(){
		this.kickOptions = getRandomKickPreset()
		this.snareOptions = getRandomSnarePreset()
		this.setHatPair(getRandomHihatPreset())
		return {
			kick:this.kickOptions,
			snare:this.snareOptions,
			hat:this.hatOptions,
		}
	}

	triggerPart(part, instrument, triggerAt, options={}){
		if (part > 0)
		{
			instrument( { ...options, velocity: part / 255, triggerAt } )
			return true
		}
		return false
	}

	triggerHat(part, isOpen, triggerAt){
		if (part <= 0)
		{
			return false
		}
		if (isOpen)
		{
			this.hatOpen({ ...this.hatOpenOptions, velocity:part / 255, triggerAt })
		}else{
			this.hatOpen.choke(0.006, triggerAt)
			this.hatClosed({ ...this.hatClosedOptions, velocity:part / 255, triggerAt })
		}
		return true
	}

	playPart(part, options={}){
		const triggerAt = options.triggerAt ?? this.context.currentTime + 0.005
		const velocity = options.velocity ?? 1
		if (AUXILIARY_DRUM_LANES.includes(part))
		{
			if (part === 'triangleMute') this.triangleOpen.choke(0.006, triggerAt)
			if (part === 'cuicaMute') this.cuicaOpen.choke(0.006, triggerAt)
			if (part === 'surdoMute') this.surdoOpen.choke(0.006, triggerAt)
			this[part]({ ...options, velocity, triggerAt })
			return true
		}
		switch(part)
		{
			case 'kick':
				this.kick({ ...this.kickOptions, ...options, velocity, triggerAt })
				return true

			case 'snare':
				this.snare({ ...this.snareOptions, ...options, velocity, triggerAt })
				return true

			case 'hat':
				if (options.open)
				{
					this.hatOpen({ ...this.hatOpenOptions, ...options, velocity, triggerAt })
				}else{
					this.hatOpen.choke(0.006, triggerAt)
					this.hatClosed({ ...this.hatClosedOptions, ...options, velocity, triggerAt })
				}
				return true

			case 'clap':
				this.clap({ ...options, velocity, triggerAt })
				return true

			case 'cowbell':
				if (!this.voiceOptions.cowbell) return false
				this.cowbell({ ...options, velocity, triggerAt })
				return true

			case 'clack':
				this.clack({ ...options, velocity, triggerAt })
				return true

			default:
				return false
		}
	}

	updatePerson(person){
		this.arranger?.updatePerson(person)
	}

	setPerformanceControl(enabled){
		this.options.performanceDrums = enabled !== false
		this.arranger?.setPerformanceControl(this.options.performanceDrums)
	}

	setMutedParts(mutes){
		this.arranger?.setMutedParts(mutes)
	}

	requestFill(amount=1){
		this.arranger?.requestFill(amount)
	}

	setTempo(bpm){
		this.arranger?.setTempo(bpm)
	}

	/**
	 * 
	 * @param {Number} noteNumber - is the key (note) number
	 * @param {Number} velocity 
	 * @returns 
	 */
	async noteOn( noteNumber, velocity=1, triggerAt ){

		this.updatePerson({ noteNumber, noteVelocity: velocity })
		const parts = this.arranger.next({ triggerAt })
		this.triggerPart(parts.kick, this.kick, triggerAt, this.kickOptions)
		this.triggerPart(parts.snare, this.snare, triggerAt, this.snareOptions)
		this.triggerHat(parts.hat, parts.hatOpen, triggerAt)
		this.triggerPart(parts.clap, this.clap, triggerAt)
		if (this.voiceOptions.cowbell) this.triggerPart(parts.cowbell, this.cowbell, triggerAt)
		if (parts.triangleMute > 0) this.triangleOpen.choke(0.006, triggerAt)
		if (parts.cuicaMute > 0) this.cuicaOpen.choke(0.006, triggerAt)
		if (parts.surdoMute > 0) this.surdoOpen.choke(0.006, triggerAt)
		for (const part of AUXILIARY_DRUM_LANES) this.triggerPart(parts[part], this[part], triggerAt)
		for (const event of parts.events ?? [])
		{
			const eventAt = triggerAt + event.offset
			if (event.lane === 'snare') this.triggerPart(event.velocity, this.snare, eventAt, applyDrumSubHitEnvelope(this.snareOptions, event))
			if (event.lane === 'hat') {
				const timbre = applyDrumSubHitEnvelope(this.hatClosedOptions, event)
				this.hatOpen.choke(0.006, eventAt)
				this.hatClosed({ ...timbre, velocity:event.velocity / 255, triggerAt:eventAt })
			}
		}

		return super.noteOn(noteNumber, velocity)
	}
	
	/**
	 * 
	 * @param {Number} noteNumber 
	 * @param {Number} velocity 
	 * @returns 
	 */
	async noteOff(noteNumber, velocity=0){
		this.aftertouchByNote.delete(noteNumber)
		this.aftertouchPressure = Math.max(0, ...this.aftertouchByNote.values())
		return super.noteOff(noteNumber)
	}

	choke(duration = 0.005, chokeAt = this.context.currentTime){
		for (const voice of this.percussionVoices ?? []) voice?.choke?.(duration, chokeAt)
	}

	/**
	 * Polyphonic Key Pressure
	 * This message is most often sent by pressing down on the key 
	 * after it "bottoms out". noteNumber is the key (note) number. 
	 * pressure is the pressure value.
	 * @param {Number} noteNumber - is the key (note) number
	 * @param {Number} pressure 
	 */
	aftertouch( noteNumber, pressure ){
		const normalizedPressure = normalizePressure(pressure)
		this.aftertouchByNote.set(noteNumber, normalizedPressure)
		this.aftertouchPressure = Math.max(0, ...this.aftertouchByNote.values())
		this.updatePerson({
			noteNumber,
			noteVelocity:this.aftertouchPressure,
			pressure:this.aftertouchPressure,
			pitchBend:this.pitchBendValue,
		})
		if (normalizedPressure > 0.82) this.requestFill(normalizedPressure)
		return super.aftertouch(noteNumber, pressure)
	}
	
	/**
	 * Pitch Bend Change. 
	 * This message is sent to indicate a change
	 * in the pitch bender (wheel or lever, typically). 
	 * The pitch bender is measured by a fourteen bit value. 
	 * Center (no pitch change) is 2000H. 
	 * Sensitivity is a function of the receiver, 
	 * but may be set using RPN 0. 
	 * (lllllll) are the least significant 7 bits. 
	 * (mmmmmmm) are the most significant 7 bits.
	 * @param {number} pitch 
	 */
	pitchBend(pitch){
		this.pitchBendValue = Number.isFinite(Number(pitch)) ? Number(pitch) : 0
		this.pitchBendRatio = drumPitchBendToRatio(this.pitchBendValue)
		this.updatePerson({ pitchBend:this.pitchBendValue })
		return super.pitchBend(pitch)
	}
	
	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		let preset = typeof programNumber === 'string' ? getPercussionPreset(programNumber) : null
		let index = Number(programNumber)
		if (!preset && Number.isFinite(index)) {
			index = ((Math.trunc(index) % PERCUSSION_SOUND_PRESETS.length) + PERCUSSION_SOUND_PRESETS.length) % PERCUSSION_SOUND_PRESETS.length
			preset = PERCUSSION_SOUND_PRESETS[index]
		} else if (preset) {
			index = PERCUSSION_SOUND_PRESETS.indexOf(preset)
		}
		if (!preset) return false

		this.programNumber = index
		this.programPreset = preset
		this.applyKitPreset(preset.kit)
		this.arranger?.setIntent(preset.intent ?? {})
		await super.programChange(programNumber)
		return preset
	}
	
	/**
	 * TODO: Drum presets! each drum tuning
	 * @returns {Array<String>} of Instrument Names
	 */
	async getPresets(){
		return PERCUSSION_SOUND_PRESETS.map(preset => preset.title)
	}

	
	clone(){
		return new DrumkitInstrument(this.audioContext, this.options)
	}
}
