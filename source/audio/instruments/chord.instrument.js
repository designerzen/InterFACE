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

	get audioNode(){
		return this.mixer
	}

    async create(){    
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

		console.log(instrumentIndex, "noteOn", {noteNumber, instrument}, this.activeNotes, this )
		
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
		console.log("noteOff", noteNumber, this.activeNotes, this )
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
				this.noteOn( chord.noteNumber, chord.velocity, index )
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
	connectInstrument(instrument){
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

		const quantity = instrumentsArray.length
		const volume = 1 / quantity

		// disconnect existing!
		this.destroyInstruments()

		// set new instruments to cache
		this.instruments = instrumentsArray.map( instrument => {
			this.connectInstrument(instrument) 
			instrument.volume = volume
			return instrument
		})
		
		this.polyphony = quantity
		this.name = this.instruments[0].name
   		this.title = this.instruments[0].title

		console.warn(this.polyphony, "ChordInstrument:setInstruments", this, {instruments: instrumentsArray} )
	}

	/**
	 * If we just want to set all instruments to 
	 * the same type we can either provide a class
	 * or a type here
	 */
	async setInstrument( classOrType, options={}, quantity = 3 ){
		
		let instrumentInstance 
		if (typeof classOrType === "string")
		{
			// use the factory to create!
			instrumentInstance = await createInstrumentFromData( audioContext, {type:classOrType, ...options} )
		}else if (classOrType instanceof Instrument){
			// an instrument class
			console.info("Instrument Instance found", {classOrType})
			instrumentInstance = classOrType
		}else if ( typeof classOrType === 'function' && Object.toString.call(classOrType).substring(0, 5) === 'class'){
			console.info("Instrument Instance Class found")
			instrumentInstance = new classOrType( this.audioContext, options )
		}else{
			throw Error("Could not determine instrument type, neither string, Instrument nor Class")
		}

		if (!instrumentInstance)
		{
			throw Error("Could not create instrument instance")
		}

		const instrumentsArray = [ instrumentInstance ]		
		for (let i=1; i<quantity; ++i)
		{
			instrumentsArray.push( instrumentInstance.clone() )
		}
		console.info("Instrument Instances created", {instrumentsArray})
		this.setInstruments(instrumentsArray)
	}

	/**
	 * Debug instance and return a string
	 */
	toString(){
		// ${this.instruments[0].toString()
		return `ChordInstrument [Polyphony:${this.polyphony}] Instruments:${this.instruments.length}}`
	}
}