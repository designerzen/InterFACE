/**
 * This is a special type of instrument that combines the face
 * 
 */
import Instrument from './instrument.js'
import {noteNumberToFrequency} from '../tuning/frequencies.js'
import { getKitSequence } from '../../timing/patterns.js'
import { createDrumArranger } from '../../timing/drum-arranger.js'
import { createKick } from '../synthesizers/kick.js'
import { createSnare } from '../synthesizers/snare.js'
import { createHihat } from '../synthesizers/hihat.js'
import { createCowbell } from '../synthesizers/cowbell.js'
import { createClack } from '../synthesizers/clack.js'
import { createClap } from '../synthesizers/clap.js'

export const OPTIONS_DRUMKIT = {
	
	// A detuning value (in cents) which will offset the frequency by the given amount. Its default is 0.
	detune:0,

	// The frequency (in hertz) of the periodic waveform. Its default is 440.
	frequency:440,

	// Optional starting tempo. The arranger will keep estimating live tempo from triggerAt.
	bpm:0
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
		this.snare = createSnare(this.context, this.gainNode)
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

	triggerPart(part, instrument, triggerAt){
		if (part > 0)
		{
			instrument( { velocity: part / 255, triggerAt } )
			return true
		}
		return false
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
		this.triggerPart(parts.kick, this.kick, triggerAt)
		this.triggerPart(parts.snare, this.snare, triggerAt)
		this.triggerPart(parts.hat, this.hatOpen, triggerAt)
		this.triggerPart(parts.clap, this.clap, triggerAt)

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
