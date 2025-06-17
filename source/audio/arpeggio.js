/**
 * An ARPeggio is a sequence of notes that are usually 
 * played together as a chord but are instead played one
 * after another in quick succession.
 * 
 * By passing in a formula which is an array of intervals
 * and a tonic (a note to use as the basis for the other intervals)
 * you create a chord that cn be played one note after the other
 * 
 */

import { 
	createChord, 
	MINOR_CHORD_INTERVALS, 
	MAJOR_CHORD_INTERVALS, 
} from "./tuning/chords"
import { TUNING_MODE_NAMES } from "./tuning/scales"

export default class Arpeggio {

	// all notes that can be played
	notes = []

	// in order of play
	sequence = []

	// array of intervals
	formula

	// one of the classic tuning modes eg. Aeolian
	mode = 0

	// index of current note playing
	position = 0

	// note number of the first note in the sequence
	rootNote

	/**
	 * The tonic is the root note of the chord
	 */
	set tonic( rootNote ){
		this.position = 0 
		this.rootNote = rootNote
		this.reassignNotes()
	}

	/**
	 * The tonic is the same as the root note of the chord
	 */
	set root( t ){
		this.tonic = t
	}

	/**
	 * Save the formula equation with intervals
	 */
	set scale( formula ){
		this.formula = formula
		this.reassignNotes()
	}

	/**
	 * MIXOLYDIC, DORIAN, MAJOR, MINOR, HARMONIC, MELODIC
	 */
	set mode(value){
		this.mode = isNaN(value) ? TUNING_MODE_NAMES.indexOf(value) : value
		this.reassignNotes()
	}

	/**
	 * 
	 * @param {Array} notes 
	 * @param {Function} formula 
	 * @param {Number} mode 
	 */
	constructor( notes, formula=MAJOR_CHORD_INTERVALS, mode=0 ){
		this.notes = notes
		this.mode = mode
		this.formula = formula
	}

	setAllParameters( tonic, formula=MAJOR_CHORD_INTERVALS, mode=0 ){
		this.position = 0 
		this.rootNote = tonic
		this.mode = mode
		this.formula = formula
		this.reassignNotes()
	}

	/**
	 * Refresh the notes for the chord sequcnce
	 */
	reassignNotes(){
		const chord = createChord( this.notes, this.formula, this.rootNote, this.mode, false, true )
		this.sequence = chord
		console.info("Arpeggio", {this:this , chord}, this.notes, this.formula, this.rootNote, this.mode )
	}

	/**
	 * PUBLIC : fetch the next note in the sequence
	 * and advance the playhead
	 * 
	 * @returns {Number} the next note in the sequence
	 */
	next(){
		this.position = (this.position+1) % this.sequence.length
		return this.sequence[this.position]
	}
}