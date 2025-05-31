import { WebMidi } from "webmidi"
import { STATE_INSTRUMENT_ATTACK, STATE_INSTRUMENT_DECAY, STATE_INSTRUMENT_PITCH_BEND, STATE_INSTRUMENT_RELEASE, STATE_INSTRUMENT_SILENT, STATE_INSTRUMENT_SUSTAIN } from "../../person.js"

/**
 * 
 * @param {Person} person 
 */
export const updateWebMIDIWithPerson = ( person, overrides={} ) => {
	// Update MIDI outputs
	// NB. ensure that note off stops all previous notes too
	switch(person.state)
	{
		case STATE_INSTRUMENT_ATTACK:
			WebMidi.outputs.forEach(MIDIoutput =>{
				// console.log("midi note on", noteNumber, {noteVelocity, MIDIoutput})

				// MONOPHONIC :  in case that the note is already playing
				if (person.lastNoteNumber > -1){
					MIDIoutput.stopNote( person.lastNoteNumber ) 
				}
				MIDIoutput.playNote( person.noteNumber, {attack:person.noteVelocity} ) 
			})
			break

		case STATE_INSTRUMENT_SUSTAIN:
			// WebMidi.outputs.forEach(MIDIoutput =>MIDIoutput.noteOn( noteNumber, noteVelocity ) )
			break

		case STATE_INSTRUMENT_PITCH_BEND:
			//WebMidi.outputs.forEach(MIDIoutput =>MIDIoutput.sendPitchBend( pitch ))
			break

		case STATE_INSTRUMENT_DECAY:
			break

		case STATE_INSTRUMENT_SILENT:
		case STATE_INSTRUMENT_RELEASE:
		default:
			
			WebMidi.outputs.forEach(MIDIoutput =>{
				// console.log("midi note off", noteNumber, {noteVelocity,MIDIoutput})
		
				// MIDIoutput.stopNote( person.lastNoteNumber, {release:noteVelocity} ) 
				// MIDIoutput.stopNote( noteNumber, {release:noteVelocity} ) 
				MIDIoutput.sendAllNotesOff() 
			})
			break
	}	
}
