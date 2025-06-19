/**
 * Each mediator controls an instrument
 * through being passed as object
 */
import { getMusicalDetailsFromEmoji } from "../../models/emoji-to-music.js"
import { 
	STATE_INSTRUMENT_ATTACK, 
	STATE_INSTRUMENT_DECAY, 
	STATE_INSTRUMENT_PITCH_BEND, 
	STATE_INSTRUMENT_SILENT, 
	STATE_INSTRUMENT_SUSTAIN 
} from "../../person.js"

import { INSTRUMENT_TYPE_CHORD } from "../instrument-list.js"
import { getAllChordsForNoteNumber } from "../tuning/chords.js"

/**
 * MONODPHONIC
 * FIXME: Don't play the audio directly in Person
			// but instead extract it and pass it to the audioBus
			// update the stave with X amount of notes
			// stave.draw(stuff)
			// update the stave with X amount of notes
			
 * @param {Person} person 
 */
export const updateInstrumentWithPerson = ( instrument, person ) => {
	
	// if (instrument.type !== "oscillator"){
	// if (instrument.type !== "waveguide"){
	// only check for one at a time
	// if (instrument.type !== "oscillator" || instrument.type !== "yoshimi"){
	// if ( instrument.type !== "yoshimi"){
	// 	return
	// }
	// if ( instrument.type !== "sample"){
	// 	return
	// }

	const isChord = instrument.type === INSTRUMENT_TYPE_CHORD

	switch(person.state)
	{
		case STATE_INSTRUMENT_ATTACK:
		case STATE_INSTRUMENT_SUSTAIN:
		case STATE_INSTRUMENT_PITCH_BEND:

			if (isChord)
			{
				// create the chord object from the emoji...
				// const notes = getAllChordsForNoteNumber( person.noteNumber )
				// const chordSequence = notes.get("major").get("dorian")
				const chordSequence = getMusicalDetailsFromEmoji(person.noteNumber, person.playingEmoticon)
				// ccidental : false
				// alt : ""
				// frequency : 174.61411571650194
				// key : "F"
				// name : "F3"
				// notation : "F"
				// noteIndex : 5
				// noteName : "F3"
				// noteNumber : 53
				// octave : 3
				// sound : "Fa"
				// title : "F3"
				
				//console.log("Chord sequence", chordSequence, person.noteNumber, person.emoticon)
				
				// stop all notes in the instrument...
				// instrument.allNotesOff()

				// instrument.chordOn( [{noteNumber:person.noteNumber, velocity:person.noteVelocity}]  )
				// person.lastNoteNumber >= 0 && instrument.chordOff( [{noteNumber:person.lastNoteNumber, velocity:1}] )
				
				instrument.allNotesOff()
				instrument.chordOn( chordSequence, person.noteVelocity )

			}else{

				instrument.noteOn( person.noteNumber, person.noteVelocity )
				person.lastNoteNumber >= 0 && instrument.noteOff( person.lastNoteNumber, 1 )
			}
		
			// stop any that are have already started playing
		
			// person.emoticon
			
			//console.log("Attempting to sing", instrument.name, person.state, {instrument,latest, person})
			// console.log("Person", person, person.state, {stuff, noteNumber, noteVelocity} )
			break

		case STATE_INSTRUMENT_DECAY:
			break

		// case STATE_INSTRUMENT_RELEASE:
		// 	instrument.noteOff( person.noteNumber )
		// 	break

		case STATE_INSTRUMENT_SILENT:
		default:
			if (isChord){
				// const chordSequence = getMusicalDetailsFromEmoji(person.lastNoteNumber, person.lastEmoticon)
				// const chordSequence = getMusicalDetailsFromEmoji(person.noteNumber, person.playingEmoticon)
				// instrument.chordOff(  )
				instrument.allNotesOff()
				// console.log("Attempting to mute",instrument.type, person.state)
			}else{
				instrument.noteOff( person.noteNumber, person.noteVelocity )
			}
	}
}
