/**
 * This is a special type of instrument that combines the face
 * 
 */
import Instrument from './instrument.js'
import {noteNumberToFrequency} from '../tuning/frequencies.js'
import { getKitSequence } from '../../timing/patterns.js'
import { applyDrumSubHitEnvelope, createDrumArranger } from '../../timing/drum-arranger.js'
import { createKick, getRandomKickPreset, PRESETS_KICKS } from '../synthesizers/kick.js'
import { createSnare, getRandomSnarePreset, PRESET_SNARES } from '../synthesizers/snare.js'
import {
	createHihat,
	getRandomHihatPreset,
	PRESET_HIHATS,
	PRESET_HIHATS_CLOSED,
	PRESET_HIHATS_OPEN,
} from '../synthesizers/hihat.js'
import { createCowbell } from '../synthesizers/cowbell.js'
import { createClack } from '../synthesizers/clack.js'
import { createClap } from '../synthesizers/clap.js'
import { createSnareReverb } from '../effects/snare-reverb.js'

export const OPTIONS_DRUMKIT = {
	
	// A detuning value (in cents) which will offset the frequency by the given amount. Its default is 0.
	detune:0,

	// The frequency (in hertz) of the periodic waveform. Its default is 440.
	frequency:440,

	// Optional starting tempo. The arranger will keep estimating live tempo from triggerAt.
	bpm:0,
	snareReverb:0.24
}

export const INSTRUMENT_TYPE_DRUMKIT = "DrumkitInstrument"

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
	arranger
	lastTriggerAt = 0
	kickOptions = PRESETS_KICKS[0]
	snareOptions = PRESET_SNARES[0]
	hatOptions = PRESET_HIHATS[0]
	hatClosedOptions = PRESET_HIHATS_CLOSED[0]
	hatOpenOptions = PRESET_HIHATS_OPEN[0]

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
		
		this.kick = createKick(this.context, this.gainNode)
		this.snareReverb = createSnareReverb(this.context, this.gainNode, this.options.snareReverb)
		this.snare = createSnare(this.context, this.snareReverb.input)
		this.hatOpen = createHihat(this.context, this.gainNode)
		this.hatClosed = createHihat(this.context, this.gainNode)
		this.cowbell = createCowbell(this.context, this.gainNode)
		this.clack = createClack(this.context, this.gainNode)
		this.clap = createClap(this.context, this.gainNode)
		
		this.patterns = getKitSequence()
		this.arranger = createDrumArranger({
			seed: this.id,
			bpm: this.options.bpm ?? 0
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

	getHatPair(hat){
		const isOpen = /open/i.test(hat?.name)
		const source = isOpen ? PRESET_HIHATS_OPEN : PRESET_HIHATS_CLOSED
		const counterpart = isOpen ? PRESET_HIHATS_CLOSED : PRESET_HIHATS_OPEN
		const index = Math.max(0, source.indexOf(hat))
		return {
			closed:isOpen ? counterpart[index % counterpart.length] : hat,
			open:isOpen ? hat : counterpart[index % counterpart.length]
		}
	}

	setHatPair(hat){
		const pair = this.getHatPair(hat)
		this.hatOptions = hat
		this.hatClosedOptions = pair.closed
		this.hatOpenOptions = pair.open
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
		return super.noteOff(noteNumber)
	}

	choke(duration = 0.005, chokeAt = this.context.currentTime){
		this.kick?.choke?.(duration, chokeAt)
		this.snare?.choke?.(duration, chokeAt)
		this.hatOpen?.choke?.(duration, chokeAt)
		this.hatClosed?.choke?.(duration, chokeAt)
		this.cowbell?.choke?.(duration, chokeAt)
		this.clack?.choke?.(duration, chokeAt)
		this.clap?.choke?.(duration, chokeAt)
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
		super.aftertouch( noteNumber, pressure )
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
		super.pitchBend(pitch)
	}
	
	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		
		return super.programChange( programNumber )
	}
	
	/**
	 * TODO: Drum presets! each drum tuning
	 * @returns {Array<String>} of Instrument Names
	 */
	async getPresets(){
		return []
	}

	
	clone(){
		return new DrumkitInstrument(this.audioContext, this.options)
	}
}
