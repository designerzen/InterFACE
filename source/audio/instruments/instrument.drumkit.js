/**
 * This is a special type of instrument that combines the face
 * 
 */
import Instrument from './instrument.js'
import {noteNumberToFrequency} from '../tuning/frequencies.js'
import { kitSequence, playNextPart } from '../../timing/patterns.js'
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
	frequency:440
}

export const INSTRUMENT_TYPE_DRUMKIT = "DrumkitInstrument"

export default class DrumkitInstrument extends Instrument{

	static get name(){
		return INSTRUMENT_TYPE_DRUMKIT
	}

	name = INSTRUMENT_TYPE_DRUMKIT

	type = "percussion"
	title = "Percussion Instrument"

	kick 
	snare 
	hatOpen 
	hatClosed 
	cowbell 
	clack 
	clap 

	get volume() {
		return this.gainNode.gain.value
	}

	set volume(value) {
		this.gainNode.gain.value = value
	}
	
	get audioNode(){
		return this.gainNode
	}

	constructor( audioContext, options={} ){

		super(audioContext, { ...OPTIONS_DRUMKIT, ...options })

		this.gainNode = audioContext.createGain()
		this.gainNode.gain.value = 1 // this.currentVolume
		
		this.kick = createKick(audioContext, this.gainNode)
		this.snare = createSnare(audioContext, this.gainNode)
		this.hatOpen = createHihat(audioContext, this.gainNode)
		this.hatClosed = createHihat(audioContext, this.gainNode)
		this.cowbell = createCowbell(audioContext, this.gainNode)
		this.clack = createClack(audioContext, this.gainNode)
		this.clap = createClap(audioContext, this.gainNode)
		
		this.patterns = kitSequence()

		this.available = true
	}

	/**
	 * 
	 * @param {Number} noteNumber - is the key (note) number
	 * @param {Number} velocity 
	 * @returns 
	 */
	async noteOn( noteNumber, velocity=1 ){

		// the type of note ?
		const kick = playNextPart( this.patterns.kick, this.kick )
		const snare = playNextPart( this.patterns.snare, this.snare )
		const hat = playNextPart( this.patterns.hat, this.hatOpen )
		// const hatClosed = playNextPart( this.patterns.hat, this.hatClosed )

		console.error("noteOn",this,  this.options, this.oscillator.frequency.value, {noteNumber, velocity})
		// the 
		return super.noteOn(noteNumber, velocity)
	}
	
	async noteOff(noteNumber, velocity=0){
		return super.noteOff(noteNumber)
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
	getPresets(){
		return OSCILLATOR_TYPES
	}
}
