/**
 * Each mediator controls an instrument
 * through being passed as object
 */
import { 
	STATE_INSTRUMENT_ATTACK, 
	STATE_INSTRUMENT_DECAY, 
	STATE_INSTRUMENT_PITCH_BEND, 
	STATE_INSTRUMENT_SILENT, 
	STATE_INSTRUMENT_SUSTAIN 
} from "../../person.js"

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

	switch(person.state)
	{
		case STATE_INSTRUMENT_ATTACK:
		case STATE_INSTRUMENT_SUSTAIN:
		case STATE_INSTRUMENT_PITCH_BEND:
			// note off if set...
			if ( person.lastNoteNumber >= 0 )
			{
				const previously = instrument.noteOff( person.lastNoteNumber )
			}
			const latest = instrument.noteOn( person.noteNumber, person.noteVelocity )
			
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
			instrument.noteOff( person.noteNumber )
			// console.log("Attempting to mute",instrument.type, person.state)
	
	}
}
