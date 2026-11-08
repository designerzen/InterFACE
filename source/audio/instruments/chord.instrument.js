import Instrument from "./instrument.js"
import { MAX_CHORD_VOICE_COUNT } from "../../models/emoji-to-music.js"
import { Arpeggio, ARPEGGIO_VARIATION, HARP_ARPEGGIO_VARIATION } from "../../timing/arpeggio.js"

export const INSTRUMENT_TYPE_CHORD = "ChordInstrument"
export const CHORD_PLAY_MODE = "chord"
export const ARPEGGIO_PLAY_MODE = "arpeggio"
export const HARP_PLAY_MODE = HARP_ARPEGGIO_VARIATION
export const SINGLE_NOTE_PLAY_MODE = "single-note"

export default class ChordInstrument extends Instrument{
	
	#arpeggio = new Arpeggio()
	#singleNote = false
	arpeggioIndex = 0
	arpeggioChordKey = ""
	arpeggioGateMs = 0
	arpeggioGateTimeout = null
	arpeggioGateToken = 0

	type = INSTRUMENT_TYPE_CHORD

	finishedNotes = new Map()

	static get name(){
		return INSTRUMENT_TYPE_CHORD
	}

	get name(){
		return this.instruments.length > 0 ? this.instruments[0].name : INSTRUMENT_TYPE_CHORD
	}

	get title(){
		return this.instruments.length > 0 ? this.instruments[0].title : "Chord Instrument"
	}

	get instrumentName(){
		return this.instruments?.[0]?.instrumentName
	}

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

	get repetitionRate(){
		return this.instruments?.[0]?.repetitionRate ?? super.repetitionRate
	}

	get playbackMode(){
		return this.instruments?.[0]?.playbackMode ?? super.playbackMode
	}

	get reverbSettings(){
		return this.instruments?.[0]?.reverbSettings ?? super.reverbSettings
	}

	get lpfSettings(){
		return this.instruments?.[0]?.lpfSettings ?? super.lpfSettings
	}

	get compressorSettings(){
		return this.instruments?.[0]?.compressorSettings ?? super.compressorSettings
	}

	get arpeggiate( ){
		return this.#arpeggio.enabled
	}
	set arpeggiate( value ){
		this.#singleNote = false
		this.#arpeggio.configure(value ? ARPEGGIO_VARIATION : false)
		this.resetArpeggio()
	}

	get performanceMode(){
		return this.#arpeggio.enabled ? this.#arpeggio.variation : (this.#singleNote ? SINGLE_NOTE_PLAY_MODE : CHORD_PLAY_MODE)
	}
	set performanceMode(value){
		if (value === SINGLE_NOTE_PLAY_MODE)
		{
			this.#singleNote = true
			this.#arpeggio.configure(false)
			this.resetArpeggio()
			return
		}
		this.#singleNote = false
		this.#arpeggio.configure(value)
		this.resetArpeggio()
	}

	configureArpeggio(config){
		const configured = this.#arpeggio.configure(config)
		this.resetArpeggio()
		return configured
	}

	getArpeggioTiming(bpm, options={}){
		return this.#arpeggio.getTiming(bpm, options)
	}

	get useArpeggio(){
		return this.arpeggiate
	}
	set useArpeggio(value){
		this.arpeggiate = value
	}

	get playsChords(){
		return !this.#singleNote
	}

	/**
	 * There might be multiple different presets
	 * loaded so these are actually just sending the first
	 * instruments preset which is a bit of a hack
	 */

	get activePresetIndex(){
		return this.instruments.length > 0 ?  this.instruments[0].activePresetIndex : -1
	}
    async create(){    
		this.instruments = [] 
		this.mixer = this.context.createGain()
		return super.create()
	}

	async destroy(){
		this.clearArpeggioGate()
		await this.destroyInstruments()
		this.mixer.disconnect()			
		return await super.destroy()
    }

	constructor(audioContext, options = {}){
		super(audioContext, options)
		if (options.performanceMode && options.performanceMode !== CHORD_PLAY_MODE)
		{
			this.performanceMode = options.performanceMode
		}
		else if (options.arpeggiate || options.useArpeggio)
		{
			this.arpeggiate = true
		}
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

		// console.log(instrumentIndex, "noteOn", {noteNumber, instrument}, this.activeNotes, this )
		
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
	async noteOff( noteNumber, velocity=0, instrumentIndex ){
		// A note number identifies the release. Chord order can change and the
		// same note may be layered across several voices.
		const instruments = instrumentIndex === undefined ? this.instruments :
			[this.instruments[instrumentIndex % this.instruments.length]]
		if (!instruments.length || instruments.some(instrument => !instrument))
		{
			throw Error("No instruments available to stop")
		}
		await Promise.all(instruments.map(instrument => instrument.noteOff(noteNumber, velocity)))
		if (!this.instruments.some(instrument => instrument.activeNotes?.has(noteNumber))) this.activeNotes.delete(noteNumber)
		this.active = this.activeNotes.size > 0
		// console.log("noteOff", noteNumber, this.activeNotes, this )
		return true
	}

	async retrigger(noteNumber, velocity=1, instrumentIndex=0){
		const instrument = this.instruments[instrumentIndex % this.instruments.length]
		if (!instrument)
		{
			throw Error("No instruments available to retrigger")
		}
		if (instrument.retrigger)
		{
			return instrument.retrigger(noteNumber, velocity)
		}
		await instrument.noteOff(noteNumber, velocity)
		return instrument.noteOn(noteNumber, velocity)
	}

	getArpeggioChordKey(chordArray=[]){
		return chordArray.map(chord => chord?.noteNumber).join(",")
	}

	getArpeggioSequence(chordArray=[]){
		return this.#arpeggio.getSequence(chordArray)
	}

	resetArpeggio(){
		this.arpeggioIndex = 0
		this.arpeggioChordKey = ""
		this.clearArpeggioGate()
	}

	getChordVelocity(chord, velocity){
		return velocity ?? chord?.velocity ?? 1
	}

	setArpeggioGate(gateMs=0){
		this.arpeggioGateMs = Number.isFinite(gateMs) && gateMs > 0 ? gateMs : 0
		return this.arpeggioGateMs
	}

	clearArpeggioGate(){
		if (this.arpeggioGateTimeout)
		{
			clearTimeout(this.arpeggioGateTimeout)
			this.arpeggioGateTimeout = null
		}
		this.arpeggioGateToken++
	}

	scheduleArpeggioGate(noteNumber, velocity){
		this.clearArpeggioGate()
		if (!this.arpeggioGateMs)
		{
			return
		}
		const token = this.arpeggioGateToken
		this.arpeggioGateTimeout = setTimeout(() => {
			if (token !== this.arpeggioGateToken)
			{
				return
			}
			this.noteOff(noteNumber, velocity, 0)
			this.arpeggioGateTimeout = null
		}, this.arpeggioGateMs)
	}

	async chordOnArpeggio(chordArray, velocity){
		if (!chordArray?.length)
		{
			return
		}
		const arpeggioSequence = this.getArpeggioSequence(chordArray)
		if (!arpeggioSequence.length)
		{
			return
		}

		const chordKey = this.getArpeggioChordKey(arpeggioSequence)
		this.arpeggioIndex = chordKey === this.arpeggioChordKey ?
			(this.arpeggioIndex + 1) % arpeggioSequence.length :
			0

		this.arpeggioChordKey = chordKey
		const chord = arpeggioSequence[this.arpeggioIndex]
		if (!chord)
		{
			return
		}

		await this.allNotesOff()
		const chordVelocity = this.getChordVelocity(chord, velocity)
		const started = await this.noteOn( chord.noteNumber, chordVelocity, 0 )
		this.scheduleArpeggioGate(chord.noteNumber, chordVelocity)
		return started
	}

	/**
	 * Chord On 
	 * @param {Array<Chord>} chordArray 
	 */
	async chordOn( chordArray, velocity ){
	
		// console.error("ChordInstrument:chordOn", chordArray, this.arpeggio )
		
		if (!this.#arpeggio.enabled)
		{
			const chordQuantity = chordArray.length
			// console.error( "ChordInstrument:chordOn", chordQuantity, chordArray )
		
			await Promise.all(this.instruments.map( (instrument, index) => {
				const chord = chordArray[index%chordQuantity]
				if (chord)
				{
					return this.noteOn( chord.noteNumber, this.getChordVelocity(chord, velocity), index )
				}
			}))

		}else{
			return this.chordOnArpeggio(chordArray, velocity)
		}
	}

	/**
	 * 
	 * @param {Array<Chord>} chordArray 
	 */
	async chordOff( chordArray, velocity ){
		const notes = new Map((chordArray ?? []).filter(Boolean).map(chord => [chord.noteNumber,chord]))
		return Promise.all([...notes.values()].map(chord => this.noteOff(chord.noteNumber,this.getChordVelocity(chord,velocity))))
	}

	async allNotesOff(){
		this.clearArpeggioGate()
		const notesTurned = []
		const activeNotes = [...this.activeNotes.entries()]
		const noteOffs = []
		activeNotes.forEach( ([noteNumber, velocity]) =>{
			this.instruments.forEach( (instrument, index) => {
				noteOffs.push(this.noteOff( noteNumber, velocity, index ))
			})
			notesTurned.push(noteNumber)
		})
		// noteOff clears each note. Sweeping activeNotes again here would also stop
		// a chord started while these releases were still being awaited.
		await Promise.all(noteOffs)
		// console.error("ChordInstrument:allNotesOff", this.activeNotes )
		return notesTurned
	}

	async aftertouch( noteNumber, pressure ){
		this.instruments.forEach( (instrument) => instrument.aftertouch(noteNumber, pressure) )
		return super.aftertouch( noteNumber, pressure )
	}
	
	async pitchBend(pitch){
		this.instruments.forEach( (instrument) => instrument.pitchBend(pitch))
		return super.pitchBend(pitch)
	}

	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		// console.info("Program change request from chord instrument", this.instruments)
		await Promise.all(this.instruments.map(instrument => instrument.programChange(programNumber)))
		return await super.programChange( programNumber )
	}

	/**
	 * Load the requested preset in every voice. Sample-backed instruments need
	 * loadPreset() itself: programChange() only selects their program index and
	 * does not fetch/decode the SoundFont samples.
	 */
	async loadPreset(presetNameOrIndex, ...args){
		await Promise.all(this.instruments.map(instrument =>
			instrument.loadPreset(presetNameOrIndex, ...args)
		))
		return this
	}

	
	/**
	 * Provide this Person with a random instrument
	 * @param {Function} progressCallback Method to call once the instrument has loadedNAMES
	
	 async loadRandomPreset(progressCallback){
		// grab an instrument randomly from the full collection
		this.instruments.forEach( (instrument) => instrument.programChange(programNumber))
		return await this.loadPreset( this.instrumentFolders[newIndex], this.instrumentPack, progressCallback )
	}
	*/

	/**
	 * Load the previous instrument in the list
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadPreviousPreset(progressCallback){
		const presetPromises = this.instruments.map( (instrument) => instrument.loadPreviousPreset(progressCallback))
		await Promise.all(presetPromises)
		return this
		// return super.loadPreviousPreset(progressCallback)
	}

	/**
	 * Load the subsequent instrument in the list
	 * NB. Does NOT wrap around
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async loadNextPreset(progressCallback){
		const presetPromises = this.instruments.map( (instrument) => instrument.loadNextPreset(progressCallback))
		await Promise.all(presetPromises)
		return this
		// return super.loadNextPreset(progressCallback)
	}

	/**
	 * Reload the current preset in every voice
	 * @param {Function} progressCallback Method to call once the instrument has loaded
	 */
	async reloadPreset(progressCallback){
		await Promise.all(this.instruments.map(instrument => instrument.reloadPreset?.(progressCallback)))
		return this
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

		const instrumentsToDestroy = this.instruments
		this.instruments = []
		this.activeNotes.clear()
		this.active = false
		return this.destroyInstrumentArray(instrumentsToDestroy)
	}

	destroyInstrumentArray(instrumentsToDestroy=[]){
		const destructionPromises = instrumentsToDestroy.map(async instrument => {
			// allNotesOff stops sample sources synchronously before its first await.
			await instrument.allNotesOff?.()
			instrument.output?.disconnect()
			await instrument.destroy?.()
		})
		return Promise.all(destructionPromises)
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
			throw Error("No Output specified for this ChordInstrument")
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
	async setInstruments( instrumentsArray ){
		if (!Array.isArray(instrumentsArray) || instrumentsArray.length === 0)
		{
			throw Error("ChordInstrument requires at least one instrument")
		}

		// Cloned instruments initialise their Web Audio nodes asynchronously.
		// Keep the current voices connected until every replacement is ready.
		await Promise.all(instrumentsArray.map(instrument => instrument?.loaded ?? true))
		instrumentsArray.forEach(instrument => {
			if (!instrument?.output)
			{
				throw Error("No Output specified for this ChordInstrument")
			}
		})

		const quantity = instrumentsArray.length
		const volume = 1 / quantity
		const previousInstruments = this.instruments
		const connectedInstruments = []
		try{
			instrumentsArray.forEach(instrument => {
				this.connectInstrument(instrument)
				connectedInstruments.push(instrument)
				instrument.volume = volume
			})
		}catch(error){
			connectedInstruments.forEach(instrument => instrument.output?.disconnect())
			throw error
		}

		// Swap synchronously only after the complete replacement is connected.
		this.clearArpeggioGate()
		this.instruments = instrumentsArray
		this.activeNotes.clear()
		this.active = false
		
		this.polyphony = quantity
		await this.destroyInstrumentArray(previousInstruments)
		return this.instruments
	}

	/**
	 * If we just want to set all instruments to 
	 * the same type we can either provide a class
	 * or a type here
	 */
	async setInstrument( classOrType, options={}, quantity = MAX_CHORD_VOICE_COUNT ){
		
		let instrumentInstance 
		if (typeof classOrType === "string")
		{
			// use the factory to create!
			instrumentInstance = await createInstrumentFromData( audioContext, {type:classOrType, ...options} )
		}else if (classOrType instanceof Instrument){
			// an instrument class
			// console.info("Instrument Instance found", {classOrType})
			instrumentInstance = classOrType
		}else if ( typeof classOrType === 'function' && Object.toString.call(classOrType).substring(0, 5) === 'class'){
			// console.info("Instrument Instance Class found")
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
		await Promise.all(instrumentsArray.map(instrument => instrument.loaded ?? true))
		await this.setInstruments(instrumentsArray)
		return this
	}

	async chordRetrigger(chordArray, velocity){
		if (!chordArray?.length)
		{
			return []
		}
		const chordQuantity = chordArray.length
		return Promise.all(this.instruments.map((instrument, index) => {
			const chord = chordArray[index % chordQuantity]
			return this.retrigger(chord.noteNumber, this.getChordVelocity(chord, velocity), index)
		}))
	}

	/**
	 * Debug instance and return a string
	 */
	toString(){
		// ${this.instruments[0].toString()
		return this.instruments.length > 1 ?
			`ChordInstrument ${this.instruments[0].toString()} [Polyphony:${this.polyphony}] Instruments:${this.name}} Notes:${this.activeNotes.size}` :
			`ChordInstrument [Polyphony:${this.polyphony}] Instruments:${this.name}} Notes:${this.activeNotes.values()}`
	}
}
