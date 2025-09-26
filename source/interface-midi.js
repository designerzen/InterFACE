import { getMusicalDetailsFromEmoji } from "./models/emoji-to-music"

let isMIDIAvailable = false

/**
 *  Add Keyboard listeners and tie in commands
 */
export const addMIDI = async ( application ) => {

	const relayMIDI = application.stateMachine.get("midiRelay")
			
	const sendMIDIEventToAllDevices = (type, noteNumber) => {
		switch(type){
			case "noteon":
				WebMidi.outputs.forEach(output => output.playNote( noteNumber ))
				break
			case "noteoff":
				WebMidi.outputs.forEach(output => output.stopNote( noteNumber ))
				break
			case "clock":
				WebMidi.outputs.forEach(MIDIoutput => MIDIoutput.sendClock() )
				break
		}
	}

	// this has a timeout!
	isMIDIAvailable = await establishMIDI()

	// Inputs

	// Outputs
	// WebMidi.outputs.forEach(output => console.log("MIDI OUTPUT", output.manufacturer, output.name))
	// immediately hook into the clock events...
	const skipMIDI = false
	if (!skipMIDI && stateMachine.get("midiInput"))
	{
		console.error("WebMidi Inputs", WebMidi.inputs)
		WebMidi.inputs.forEach(input =>{
			
			let activePerson
			let activeEmoticon

			console.info("Observing MIDI device", input )
			
			const playingMIDINotes = new Map()
			const aborter = new AbortController()

			let person

			const playMIDINoteOn = ( noteNumber, velocity=1, monitorEmotion=true ) => {

				// TODO: use the midi in and the people to augment
				// the note played with chords that match the facial expression
				// const amountOfInputs = WebMidi.inputs.length         
				person = getActivePerson()


				// augment note into chord us ing event.note.number as the tonic
				const chordDetails = getMusicalDetailsFromEmoji(noteNumber, person.emoticon, false)
				

				
				console.info("playMIDINoteOn", noteNumber, chordDetails, {person} )

				if (monitorEmotion && playingMIDINotes.size === 0)
				{
					/*
					// we need this to also update any playing midi notes
					person.addListener(EVENT_EMOTION_CHANGED, event => {	
						
						const {detail} = event
						const { emoticon } = detail
						// const { emoticon, person } = detail
						console.log("Emotion changed", detail)
						//chordDetails = getMusicalDetailsFromEmoji(noteNumber, emoticon)
						
						// now we need to "change" notes
						
						// playNoteOff()
						// setToast( `${detail.emoticon} Emotion Changed` ) 
						
						playMIDINoteOff( noteNumber)
						playMIDINoteOn( noteNumber, velocity, false )

					}, {signal:aborter.signal})
					*/
				}
					

				// save this chord for note off later
				playingMIDINotes.set( noteNumber, chordDetails )	

				console.log("MIDI noteon", person.emoticon, {chordDetails, playingMIDINotes, person} )

				// play midi notes using our Audio Engine...
				// globalChordPlayer.noteOn( event.note.number, event.value )
				// globalChordPlayer.chordOn( event.note.number, event.value )

				// updateInstrumentWithPerson( samplePlayer, person )
				// also send 
			
				// FIXME: send out original event to other all connected devices
				// if (relayMIDI)
				// {
				// 	sendMIDIEventToAllDevices( "noteon", noteNumber )
				// 	//console.log("relayMIDI noteon", event, event.note.identifier, chordDetails)
				// }

				// send out augmented events?
				if (stateMachine.get("midiSympathiser"))
				{
					for (const chord of chordDetails)
					{
						// sendMIDIEventToAllDevices( "noteon", chord)
						WebMidi.outputs.forEach(output => output.playNote(chord.noteNumber))
						//console.log("MIDISympathiser noteon chordDetails", {chord, input} )
					}
				}

				/// FIXME: 
				// Use onboard sound engine to make the sounds
				if (stateMachine.get("midiOnboard")){
					//console.info("Note on onboard midi", chordDetails, activePerson.noteVelocity)
					//globalChordPlayer.chordOn( chordDetails, activePerson.noteVelocity )
				}
			}

			// stop existing note from playing
			const playMIDINoteOff = (noteNumber, velocity=1) => {

				console.info("playMIDINoteOn", noteNumber, {person} )

				// get the chord details
				const playingChord = playingMIDINotes.get( noteNumber )
				//console.log("MIDI noteoff", event.note.identifier, {event, playingChord} )
				
				if (!playingChord)
				{
					// no note off to action :/
					//console.info("trying to turn the chord off")
				}

				for (const chord of playingChord)
				{
					// sendMIDIEventToAllDevices( "noteon", chord)
					WebMidi.outputs.forEach(output => output.stopNote(chord.noteNumber))
					//console.log("MIDISympathiser noteoff chordDetails", {chord, input} )
				}

				if (relayMIDI)
				{
					// event.type === noteoff
					sendMIDIEventToAllDevices( "noteoff", noteNumber )
					//console.log("relayMIDI noteon", event, event.note.identifier, chordDetails)
				}

				// stop midi notes on our Audio Engine...
				// globalChordPlayer.noteOff( event.note.number, event.value )
				// globalChordPlayer.chordOff( event.note.number, event.value )
				
				// updateInstrumentWithPerson( samplePlayer, person )
				// sendMIDIEventToAllDevices(event.type, event)

				playingMIDINotes.delete( noteNumber )
				
				// stop watching for emoji changes in this person as there
				// are no notes playing anymore to update
				if (playingMIDINotes.size === 0){
					aborter.abort()
					person = null
				}
				
				// FIXME: 
				if (stateMachine.get("midiOnboard")){
					// globalChordPlayer.allNotesOff()
				}
			}

			input.addListener("midimessage", event => {
				// console.info("MIDI Message", event )
				switch(event.message.type){
					case "start": 
						application.startBackgroundPercussion()
						break
					case "stop": 
						application.stopBackgroundPercussion()
						break
					case "continue": 	
						application.toggleBackgroundPercussion()
						break
					case "clock":
						// if we want an exclusive clock
						// NB. this will be sent out to all channels in the loop
						application.clock.bypass(true)
						application.clock.externalTrigger()
						// console.info("clock", clock )
						break       
				}
			})

			// FIXME: This NEEDS to ignore notes played by the person!
			input.addListener("noteon", event => { 
				// TODO: check to see if these notes are triggered
				// by this and ignore any note ons that we sent out!!!
				console.info("External MIDI noteon", event.note.number, {event} ) 
				return

				if (!person){
					person = getActivePerson()
				}
				
				const requestedNote = event.note.number

				// const pChord = person.activeNotes.get( person.noteNumber )
				// const chord = person.activeNotes.get( event.note.number )
				const chords = getActiveMIDINotesForPerson( person.playerNumber )

				const isPlaying = chords.get( requestedNote) ?? false
				
				// for (let c in chord){
				// 	if (c.noteNumber === requestedNote){
				// 		isPlaying = true
				// 		break
				// 	}
				// }
				// for (let c in pChord){
				// 	if (c.noteNumber === requestedNote ){
				// 		isPlaying = true
				// 		break
				// 	}
				// }

				if (!isPlaying)
				{
					playMIDINoteOn(event.note.number)
					//console.info("MIDI noteon FRESH", event.note.number, {event, chords} ) 
				}else{
					//console.info("MIDI noteon ALTER", event.note.number, {event, chords} ) 

				}
			})
			input.addListener("noteoff", event => { 
				//playMIDINoteOff(event.note.number) 
				console.info("External MIDI noteoff", event.note.number, {event} )
			})

			console.log("Available MIDI INPUT Device", input.manufacturer, input.name)
		})
	}

	return isMIDIAvailable
}