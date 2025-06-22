import { WebMidi } from "webmidi"
import { STATE_INSTRUMENT_ATTACK, STATE_INSTRUMENT_DECAY, STATE_INSTRUMENT_PITCH_BEND, STATE_INSTRUMENT_RELEASE, STATE_INSTRUMENT_SILENT, STATE_INSTRUMENT_SUSTAIN } from "../../person.js"

/**
 * 
 * @param {Person} person 
 */
export const updateWebMIDIWithPerson = ( person, people, overrides={} ) => {
	// If there are MULTIPLE MIDI devices and MULTIPLE PEOPLE
	// we need to send the MIDI to the correct channel
	// NB. We send the MIDI to ALL devices but have 4 different channels
	// that are 1-4
	const multiplePeople = people.length > 1
	const multiplMIDIDevices = WebMidi.outputs.length > 1
	const oneMIDIDevicePerPerson = multiplMIDIDevices && multiplePeople

	// NB. ensure that note off stops all previous notes too
	switch(person.state)
	{
		case STATE_INSTRUMENT_ATTACK:
		
			if (oneMIDIDevicePerPerson)
			{
				WebMidi.outputs.forEach(MIDIoutput =>{
					const midiOutputDevice = MIDIoutput.channels[person.personIndex]
					if (midiOutputDevice && person.lastNoteNumber > -1){
						midiOutputDevice.stopNote( person.lastNoteNumber ) 
					}
					midiOutputDevice && midiOutputDevice.playNote( person.noteNumber, {attack:person.noteVelocity} )
				})

			}else{
				
				WebMidi.outputs.forEach(MIDIoutput =>{
					// console.log("midi note on", noteNumber, {noteVelocity, MIDIoutput})

					// MONOPHONIC :  in case that the note is already playing
					if (person.lastNoteNumber > -1){
						MIDIoutput.stopNote( person.lastNoteNumber ) 
					}
					MIDIoutput.playNote( person.noteNumber, {attack:person.noteVelocity} ) 
				})	
			}

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
			if (oneMIDIDevicePerPerson)
			{
				WebMidi.outputs.forEach(MIDIoutput =>{
					const midiOutputDevice = MIDIoutput.channels[person.personIndex]
					midiOutputDevice && midiOutputDevice.sendAllNotesOff()
				})

			}else{
				
				WebMidi.outputs.forEach(MIDIoutput =>{
					// console.log("midi note off", noteNumber, {noteVelocity,MIDIoutput})
			
					// MIDIoutput.stopNote( person.lastNoteNumber, {release:noteVelocity} ) 
					// MIDIoutput.stopNote( noteNumber, {release:noteVelocity} ) 
					MIDIoutput.sendAllNotesOff() 
				})
			}
			break
	}	
}
