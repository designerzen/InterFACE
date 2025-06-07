import Instrument from "./instrument.js"

export const INSTRUMENT_TYPE_CHORD = "ChordInstrument"

export default class ChordInstrument extends Instrument{
	
	static get name(){
		return INSTRUMENT_TYPE_CHORD
	}

	name = INSTRUMENT_TYPE_CHORD
	title = "Chord Instrument"
	type = "chord"

	// DO NOT SPECIFY ANYTHING HERE IT BREAKS STUFF :(
	// mixer
	// instruments = []
	// chordArray = []

	// As we don't have an envelope as the
	// individual instruments
	get output(){
		return this.mixer
	}

    async create(){    
		console.error("YO NEW ONE!?")
		this.instruments = [] 
		this.mixer = this.context.createGain()
		return super.create()
	}

	async destroy(){
		this.destroyInstruments()
		this.mixer.disconnect()			
        super.destroy()
    }

	constructor(audioContext, options = {}){
		super(audioContext, options)
	}

	generateUniqueName(){
		return this.type.toUpperCase()+"-"+String(++Instrument.uniqueCounter).padStart(9, '0')
	}

	/**
	 * This message is sent when a note is depressed (start).
	 * @param {Number} noteNumber 
	 * @param {Number} velocity 
	 * @returns {Boolean} has the sample started or is it already playing?
	 */
	async noteOn( noteNumber, velocity=1, instrumentIndex=0 ){
			
		const activeNote = this.activeNotes.get(noteNumber)
		const instrument = this.instruments[instrumentIndex % this.instruments.length]
		
		if (!instrument)
		{
			throw Error("No instruments available to play")
		}

		instrument.noteOn( noteNumber, velocity )
		this.active = true

		console.log("noteOn", {noteNumber, instrument}, this.activeNotes )
		
		if (activeNote)
		{
			// already playing
			//console.log(activeNote, "retrigger noteOn", noteNumber, this.activeNotes )
			return false
		}else{

			// set it not to true but to the velocity?
			this.activeNotes.set( noteNumber, velocity )
			//console.log("noteOn", noteNumber, this.activeNotes )
			return true
		}
	}

	/**
	 * This message is sent when a note is released (ended). 
	 * @param {Number} noteNumber 
	 * @param {Number} veolcity 
	 */
	async noteOff( noteNumber, velocity=0, instrumentIndex=0 ){
		//const activeNote = this.activeNotes.get(noteNumber)
		const instrument = this.instruments[instrumentIndex % this.instruments.length]
		
		if (!instrument)
		{
			throw Error("No instruments available to stop")
		}
		instrument.noteOff( noteNumber, velocity )
		
		this.active = false
		this.activeNotes.delete( noteNumber )
		console.log("noteOff", noteNumber, this.activeNotes )
		return true
	}


	/**
	 * 
	 * @param {Array<Chord>} chordArray 
	 */
	async chordOn( chordArray ){
		const chordQuantity = chordArray.length
		console.info(chordQuantity, "ChordInstrument:chordOn", chordArray )
		this.instruments.forEach( (instrument, index) => {
			const chord = chordArray[index%chordQuantity]
			if (chord)
			{
				this.noteOn( chord.noteNumber, chord.velocity, index )
			}else{
				this.noteOff( chord.noteNumber, chord.velocity, index )
			}
		})
	}

	
	/**
	 * 
	 * @param {Array<Chord>} chordArray 
	 */
	async chordOff( chordArray){
		const chordQuantity = chordArray.length
		console.info(chordQuantity, "ChordInstrument:chordOff", chordArray )
		this.instruments.forEach( (instrument, index) => {
			const chord = chordArray[index%chordQuantity]
			if (chord)
			{
				this.noteOff( chord.noteNumber, chord.velocity, index )
			}else{
				this.noteOff( chord.noteNumber, chord.velocity, index )
			}
		})
	}

	
	async aftertouch( noteNumber, pressure ){
		this.instruments.forEach( (instrument, index) => {
			const chord = chordArray[index%chordArray.length]
			if (chord)
			{
				this.aftertouch( chord.noteNumber, chord.velocity, index )
			}else{
				this.noteOff( chord.noteNumber, chord.velocity, index )
			}
		})
		return super.aftertouch( noteNumber, pressure )
	}
	
	async pitchBend(pitch){
		this.instruments.forEach( (instrument, index) => {
			instrument.pitchBend(pitch)
		})
		return super.pitchBend(pitch)
	}

	// WHAT SHOULD THIS DO?
	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		console.info("Program change request from chord instrument", this.instruments)
			
		this.instruments.forEach( (instrument, index) => {
			instrument.programChange(programNumber)
		})
		return super.programChange( programNumber )
	}

	
	/**
	 * 
	 * @returns {Array<String>} of Instrument Names
	 */
	async getPresets(){

		const presets = new Set()
		const promises = this.instruments.map( async (instrument, index) => {
			const presetForInstrument = await instrument.getPresets()
			presetForInstrument.forEach( preset => presets.add(preset) )
			return presetForInstrument
		})

		await Promise.allSettled(promises)

		// console.info("getPresets", {presets} )

		// remove duplicates
		return [...presets]
	}


	/**
	 * Clean up all the instruments & render useless
	 */
	destroyInstruments(){
		if (!this.instruments)
		{
			throw Error("No instruments to destroy")
		}

		this.instruments.forEach( instrument => {
			instrument.output?.disconnect()
			instrument.destroy()
		})

		this.instruments = []
		this.available = false
		console.error("ChordInstrument:destroyInstruments", this )
	}

	/**
	 * 
	 * @param {Instrument} instrument 
	 * @returns 
	 */
	addInstrument(instrument){
		if (instrument.output)
		{
			instrument.output.connect( this.mixer )
		}else{
			// no AUDIO output to connect to (could be MIDI output for example)
		}
		return instrument
	}

	/**
	 * A way to set the instruments that the chord plays
	 * NB. Requires *at least* as many instruments as there
	 * are 
	 * 
	 * @param {Array<Instrument>} instrumentsArray 
	 */
	setInstruments( instrumentsArray ){

		// disconnect existing!
		this.destroyInstruments()

		// set new instruments to cache
		this.instruments = instrumentsArray.map( instrument => this.addInstrument(instrument) )
		
		this.polyphony = instrumentsArray.length
	
		console.warn(this.polyphony, "ChordInstrument:setInstruments", this, {instruments: instrumentsArray} )
	}

	/**
	 * Debug instance and return a string
	 */
	toString(){
		return `ChordInstrument [Polyphony:${this.polyphony}]`
	}
}