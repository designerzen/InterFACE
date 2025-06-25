import { WebMidi } from "webmidi"
import { STATE_INSTRUMENT_ATTACK, STATE_INSTRUMENT_DECAY, STATE_INSTRUMENT_PITCH_BEND, STATE_INSTRUMENT_RELEASE, STATE_INSTRUMENT_SILENT, STATE_INSTRUMENT_SUSTAIN } from "../../person.js"

// This is a dirty hack to fix ROLI piano keyboards
const peopleNotes = new Map()
peopleNotes.set( 0, new Map() )
peopleNotes.set( 1, new Map() )
peopleNotes.set( 2, new Map() )
peopleNotes.set( 3, new Map() )

/**
 * 
 * @param {Person} person 
 * @param {[Person]} people 
 */
export const updateWebMIDIWithPerson = ( person, people, activeAudioOutput, previouslyActiveAudioOutput ) => {

	if (!activeAudioOutput)
	{
		// note requested but 
		return
		//throw Error("Cannot send to MIDI empty activeAudioOutput")
	}

	// If there are MULTIPLE MIDI devices and MULTIPLE PEOPLE
	// we need to send the MIDI to the correct channel
	// NB. We send the MIDI to ALL devices but have 4 different channels
	// that are 1-4
	const multiplePeople = people.length > 1
	const multipleMIDIDevices = WebMidi.outputs.length > 1
	const oneMIDIDevicePerPerson = people.length < WebMidi.outputs.length

	// we have old notes and new notes
	// const previous = person.activeNotes.get( person.lastNoteNumber )
	// const existing = person.activeNotes.get( person.noteNumber )
	// const hasJustFinished = !existing && activeAudioOutput.length > 0
	
	// console.info("midi mediator", { hasJustFinished, activeAudioOutput, existing, previouslyActiveAudioOutput } , person.activeNotes ) 
	
	// Send a single note off
	// const stop = (noteNumber) => {
	// 	console.info("MIDI:STOP",noteNumber)
	// 	if (oneMIDIDevicePerPerson)
	// 	{
	// 		const midiOutputDevice = WebMidi.outputs[person.playerNumber]
	// 		// console.log("midi note off", noteNumber, {noteVelocity,MIDIoutput})				// MIDIoutput.stopNote( person.lastNoteNumber, {release:noteVelocity} ) 
	// 		// MIDIoutput.stopNote( noteNumber, {release:noteVelocity} ) 
	// 		midiOutputDevice.stopNote( noteNumber ) 

	// 	}else if (multipleMIDIDevices){

	// 		WebMidi.outputs.forEach(MIDIoutput =>{
	// 			const midiOutputDevice = MIDIoutput.channels[person.playerNumber+1]
	// 			midiOutputDevice && midiOutputDevice.stopNote( noteNumber ) 
	// 		})

	// 	}else{
			
	// 		WebMidi.outputs.forEach(MIDIoutput =>{
	// 			MIDIoutput.stopNote( noteNumber )
	// 			// console.info("MIDI updated stopNote",  MIDIoutput, activeAudioOutput )
	// 		})
	// 	}	
	// }

	/**
	 * Note ON / Note OFF
	 * @param {*} note 
	 * @param {String} method (playNote / stopNote)
	 */
	const handleNote = (note, method="playNote")=>{		
		
		if (oneMIDIDevicePerPerson)
		{
			// send out one person's midi events to one specific midi device
			const midiOutputDevice = WebMidi.outputs[person.playerNumber]
			// if (midiOutputDevice && person.lastNoteNumber > -1){
			// 	midiOutputDevice.stopNote( person.lastNoteNumber ) 
			// }
			midiOutputDevice && midiOutputDevice[method]( note.noteNumber, {attack:person.noteVelocity} )
			// midiOutputDevice && midiOutputDevice.playNote( person.noteNumber, {attack:person.noteVelocity} )
	
			const personNotes = peopleNotes.get( person.playerNumber )
			switch(method)
			{
				case "playNote":
					personNotes.set( note.noteNumber, note )
					console.log("playNote oneMIDIDevicePerPerson", note, midiOutputDevice, personNotes )
					break
				case "stopNote":
					personNotes.delete( note.noteNumber )
					console.log("stopNote oneMIDIDevicePerPerson", note, midiOutputDevice, personNotes )
					break
			}

		}else if (multipleMIDIDevices){
			
			// send out one person's midi events to all devices on a specific channel
			WebMidi.outputs.forEach(MIDIoutput =>{
				// ensure it is playerNumber + 1 as MIDI channels start at 1
				const midiOutputDevice = MIDIoutput.channels[person.playerNumber + 1]
				// if (midiOutputDevice && person.lastNoteNumber > -1){
				// 	midiOutputDevice.stopNote( person.lastNoteNumber ) 
				// }
				midiOutputDevice && midiOutputDevice[method]( note.noteNumber, {attack:person.noteVelocity} )
				
				const personNotes = peopleNotes.get( person.playerNumber )
				switch(method)
				{
					case "playNote":
						personNotes.set( note.noteNumber, note )
						console.log("playNote multipleMIDIDevices", note, WebMidi.outputs, midiOutputDevice, personNotes )
						break
					case "stopNote":
						personNotes.delete( note.noteNumber )
						console.log("stopNote multipleMIDIDevices", note, WebMidi.outputs, midiOutputDevice, personNotes )
						break
				}
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

				const personNotes = peopleNotes.get( person.playerNumber )
				switch(method)
				{
					case "playNote":
						personNotes.set( note.noteNumber, note )
						console.log("playNote all", note, MIDIoutput, personNotes )
						break
					case "stopNote":
						personNotes.delete( note.noteNumber )
						console.log("stopNote all", note, MIDIoutput, personNotes )
						break
				}
				
				// console.info("MIDI updated handleNote", MIDIoutput, activeAudioOutput )
				// MIDIoutput.playNote( person.noteNumber, {attack:person.noteVelocity} ) 
			})
		}
	}

	// GAH: ROLI Piano does *not* have working allNotesOff so we have to do it ourselves
	// by caching all notes requested and then turning them off sequentially
	const stopAll = ( useSendAllNotesOff=false ) => {
		//console.info("update web midi with no audio?", audioOutput )
		if (useSendAllNotesOff)
		{
			if (oneMIDIDevicePerPerson)
			{
				const midiOutputDevice = WebMidi.outputs[person.playerNumber]
				// console.log("midi note off", noteNumber, {noteVelocity,MIDIoutput})				// MIDIoutput.stopNote( person.lastNoteNumber, {release:noteVelocity} ) 
				// MIDIoutput.stopNote( noteNumber, {release:noteVelocity} ) 
				midiOutputDevice.sendAllNotesOff() 

			}else if (multipleMIDIDevices){

				WebMidi.outputs.forEach(MIDIoutput =>{
					const midiOutputDevice = MIDIoutput.channels[person.playerNumber+1]
					midiOutputDevice && midiOutputDevice.sendAllNotesOff()
				})

			}else{
				
				WebMidi.outputs.forEach(MIDIoutput =>{
					MIDIoutput.sendAllNotesOff()
					// console.info("MIDI updated stopNote",  MIDIoutput, activeAudioOutput )
				})
			}	

		}else{

			const personNotes = peopleNotes.get( person.playerNumber )
			personNotes.forEach((note, noteNumber)=>{
				// stop( noteNumber )
				handleNote( note, "stopNote" )
				personNotes.delete( noteNumber )
			})
		}
	}


	// no audio to play... stop all
	if (!activeAudioOutput)
	{
		stopAll()
		return
	}

	// check to see if the notes entered are notes that are already playing...
	// if they are then stop thm
	

	// START
	
	// console.log("Person", person.state, {activeAudioOutput} ) 
	activeAudioOutput.forEach( note =>{
			
		// NB. ensure that note off stops all previous notes too
		switch(person.state)
		{
			case STATE_INSTRUMENT_ATTACK:
				stopAll()
				handleNote( note )
				break

			case STATE_INSTRUMENT_SUSTAIN:
				// WebMidi.outputs.forEach(MIDIoutput =>MIDIoutput.noteOn( noteNumber, noteVelocity ) )
				break

			case STATE_INSTRUMENT_PITCH_BEND:
				//WebMidi.outputs.forEach(MIDIoutput =>MIDIoutput.sendPitchBend( pitch ))
				break

			case STATE_INSTRUMENT_DECAY:
				break

			case STATE_INSTRUMENT_RELEASE:
			case STATE_INSTRUMENT_SILENT:
				handleNote( note, "stopNote" )
				break
		}		
	})
}