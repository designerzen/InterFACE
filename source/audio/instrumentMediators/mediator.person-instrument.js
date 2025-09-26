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
	STATE_INSTRUMENT_SUSTAIN,
	STATE_INSTRUMENT_RELEASE
} from "../../person.js"

import { INSTRUMENT_TYPE_CHORD } from "../instrument-list.js"
import { getAllChordsForNoteNumber } from "../tuning/chords.js"

/**
 * FIXME: Don't play the audio directly in Person
// but instead extract it and pass it to the audioBus
// update the stave with X amount of notes
// stave.draw(stuff)
// update the stave with X amount of notes

 * @param {Instrument} instrument 
 * @param {Person} person 
 * @param {Boolean} playAudio 
 * @returns [chord]
 */
export const updateInstrumentWithPerson = ( instrument, person, playAudio=true ) => {
	
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
			// stop any that are have already started playing
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
				
				// console.log("Chord sequence", chordSequence, person.noteNumber, person.emoticon)
				
				// stop all notes in the instrument...
				// instrument.allNotesOff()

				// instrument.chordOn( [{noteNumber:person.noteNumber, velocity:person.noteVelocity}]  )
				// person.lastNoteNumber >= 0 && instrument.chordOff( [{noteNumber:person.lastNoteNumber, velocity:1}] )
				

				if (playAudio)
				{
					instrument.allNotesOff()
					instrument.chordOn( chordSequence, person.noteVelocity )		
				}

				chordSequence.forEach( noteNumber => {
					person.activeNotes.set( noteNumber, chordSequence )
				})
				
				return chordSequence

			}else{

				person.lastNoteNumber >= 0 && instrument.noteOff( person.lastNoteNumber, 1 )
				
				if (playAudio)
				{
					instrument.noteOn( person.noteNumber, person.noteVelocity )
				}

				person.activeNotes.set( person.noteNumber, [ person.noteNumber] )
				return [person.noteNumber]
			}
			// person.emoticon
			
		case STATE_INSTRUMENT_SUSTAIN:
		case STATE_INSTRUMENT_PITCH_BEND:
		case STATE_INSTRUMENT_DECAY:
		case STATE_INSTRUMENT_RELEASE:
			// NB. this might be null
			const activity = person.activeNotes.get( person.noteNumber )
			if (!activity)
			{
				// console.error("playing but no notes???", person.activeNotes, person.noteNumber, person.state )
				return []
				
			}else{
				// console.info("Activity", activity)
			}
			return activity

		// case STATE_INSTRUMENT_RELEASE:
		// 	instrument.noteOff( person.noteNumber )
		// 	break

		case STATE_INSTRUMENT_SILENT:
		default:
			const currentlyActiveNotes = person.activeNotes.get( person.noteNumber )
			let activeNotes
			if (currentlyActiveNotes)
			{
				activeNotes = currentlyActiveNotes.slice(0,-1)
				person.activeNotes.delete( person.noteNumber )
			}else{
				return []
			}
		
			// console.log("STOPPING Person.activeNotes", activeNotes )
			if (isChord){

				if (playAudio && activeNotes && activeNotes.length)
				{
					instrument.chordOff( activeNotes, person.noteVelocity )
					return activeNotes
				}
					
				// nothing playing
				if (playAudio)
				{
					instrument.allNotesOff()
				}
				
				return []
				
				// console.log("Attempting to mute",instrument.type, person.state)
			}else{
				if (playAudio)
				{
					instrument.noteOff( person.noteNumber, person.noteVelocity )
				}
				return [person.noteNumber]
			}
	}

	return []
}
