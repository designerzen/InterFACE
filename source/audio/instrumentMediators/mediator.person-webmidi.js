import { WebMidi } from "webmidi"
import { STATE_INSTRUMENT_ATTACK, STATE_INSTRUMENT_DECAY, STATE_INSTRUMENT_PITCH_BEND, STATE_INSTRUMENT_RELEASE, STATE_INSTRUMENT_SILENT, STATE_INSTRUMENT_SUSTAIN } from "../../person.js"

/**
 * 
 * @param {Person} person 
 * @param {[Person]} people 
 */
export const updateWebMIDIWithPerson = ( person, people, audioOutput ) => {

	// If there are MULTIPLE MIDI devices and MULTIPLE PEOPLE
	// we need to send the MIDI to the correct channel
	// NB. We send the MIDI to ALL devices but have 4 different channels
	// that are 1-4
	const multiplePeople = people.length > 1
	const multipleMIDIDevices = WebMidi.outputs.length > 1
	const oneMIDIDevicePerPerson = people.length < WebMidi.outputs.length

	// we have old notes and new notes
	const previous = person.activeNotes.get( person.lastNoteNumber )
	const existing = person.activeNotes.get( person.noteNumber )

	const stopAll = () => {
		//console.info("update web midi with no audio?", audioOutput )
		if (oneMIDIDevicePerPerson)
		{
			const midiOutputDevice = WebMidi.outputs[person.personIndex]
			// console.log("midi note off", noteNumber, {noteVelocity,MIDIoutput})				// MIDIoutput.stopNote( person.lastNoteNumber, {release:noteVelocity} ) 
			// MIDIoutput.stopNote( noteNumber, {release:noteVelocity} ) 
			midiOutputDevice.sendAllNotesOff() 
			
		}else if (multipleMIDIDevices){

			WebMidi.outputs.forEach(MIDIoutput =>{
				const midiOutputDevice = MIDIoutput.channels[person.personIndex]
				midiOutputDevice && midiOutputDevice.sendAllNotesOff()
			})

		}else{
			
			WebMidi.outputs.forEach(MIDIoutput =>{
				MIDIoutput.sendAllNotesOff()
			})
		}
			
	}

	const handleNote = (note, method="playNote")=>{
		if (oneMIDIDevicePerPerson)
		{
			// send out one person's midi events to one specific midi device
			const midiOutputDevice = WebMidi.outputs[person.personIndex]
			// if (midiOutputDevice && person.lastNoteNumber > -1){
			// 	midiOutputDevice.stopNote( person.lastNoteNumber ) 
			// }
			midiOutputDevice && midiOutputDevice[method]( note.noteNumber, {attack:person.noteVelocity} )
			// midiOutputDevice && midiOutputDevice.playNote( person.noteNumber, {attack:person.noteVelocity} )
	
		}else if (multipleMIDIDevices){
			
			// send out one person's midi events to all devices on a specific channel
			WebMidi.outputs.forEach(MIDIoutput =>{
				const midiOutputDevice = MIDIoutput.channels[person.personIndex]
				// if (midiOutputDevice && person.lastNoteNumber > -1){
				// 	midiOutputDevice.stopNote( person.lastNoteNumber ) 
				// }
				midiOutputDevice && midiOutputDevice[method]( note.noteNumber, {attack:person.noteVelocity} )
				// midiOutputDevice && midiOutputDevice.playNote( person.noteNumber, {attack:person.noteVelocity} )
			})

		}else{
			// DEFAULT : send out to all midi devices on all channels
			// if (!multiplePeople)
			// send out to all midi channels or all midi devices
			WebMidi.outputs.forEach(MIDIoutput =>{
				// MONOPHONIC :  in case that the note is already playing
				// if (person.lastNoteNumber > -1){
				// 	MIDIoutput.stopNote( person.lastNoteNumber ) 
				// }
				MIDIoutput[method]( note.noteNumber, {attack:person.noteVelocity} ) 
			})
		}
	}

	// no audio to play... stop all
	if (!audioOutput)
	{
		stopAll()
		return
	}

	// check to see if the notes entered are notes that are already playing...
	// if they are then 
	
	if ( previous && audioOutput[0].noteNumber === previous[0].noteNumber ){
		//console.info(person.state, "SAME updateWebMIDIWithPerson", audioOutput,previous, existing, person.activeNotes, {person, people, multiplePeople, multipleMIDIDevices, oneMIDIDevicePerPerson} )
	}else{
		//console.info(person.state, "DIFF updateWebMIDIWithPerson", audioOutput,previous, existing, person.activeNotes, {person, people, multiplePeople, multipleMIDIDevices, oneMIDIDevicePerPerson} )
		// ensure we turn these notes old notes off!
		stopAll()
	}

	// STARTß
	audioOutput.forEach( note =>{

		// NB. ensure that note off stops all previous notes too
		switch(person.state)
		{
			case STATE_INSTRUMENT_ATTACK:
				handleNote( note )
				break

			case STATE_INSTRUMENT_SUSTAIN:
				// WebMidi.outputs.forEach(MIDIoutput =>MIDIoutput.noteOn( noteNumber, noteVelocity ) )
				break

			case STATE_INSTRUMENT_PITCH_BEND:
				//WebMidi.outputs.forEach(MIDIoutput =>MIDIoutput.sendPitchBend( pitch ))
				break

			case STATE_INSTRUMENT_DECAY:
			case STATE_INSTRUMENT_RELEASE:
				break

			case STATE_INSTRUMENT_SILENT:
				handleNote( note, "stopNote" )
				break
		}		
	})
}