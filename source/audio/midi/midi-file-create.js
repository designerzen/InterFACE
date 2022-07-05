// This converts a MIDI Track -> MIDI File

/**
 * How long the note should sound.
 * 1 : whole
 * 2 : half
 * d2 : dotted half
 * dd2 : double dotted half
 * 4 : quarter
 * 4t : quarter triplet
 * d4 : dotted quarter
 * dd4 : double dotted quarter
 * 8 : eighth
 * 8t : eighth triplet
 * d8 : dotted eighth
 * dd8 : double dotted eighth
 * 16 : sixteenth
 * 16t : sixteenth triplet
 * 32 : thirty-second
 * 64 : sixty-fourth
 * Tn : where n is an explicit number of ticks (T128 = 1 beat)
 * If an array of durations is passed then the sum of 
 * the durations will be used.
 */

// Thanks to 
// http://grimmdude.com/MidiWriterJS/
import MidiWriter from 'midi-writer-js'
import MIDITrack from './midi-track'
import { 
	COMMAND_NOTE_ON, COMMAND_NOTE_OFF, COMMAND_PROGRAM_CHANGE,
	COMMAND_CHANNEL_AFTER_TOUCH, COMMAND_CHANNEL_PRESSURE,	
	COMMAND_PITCH_BEND,	COMMAND_SYSTEM_MESSAGE
} from './midi-commands'

/**
 * Create a MIDI File!
 * @param {MIDITrack} midiTrack 
 */
export const createMIDIFileFromTrack = (midiTrack, bpm=120 ) => {

	// const convertFloatToHex = float => float.toString(16)
	// ` NoteHEX:${convertFloatToHex(noteNumber)}` 
	// ` VelocityHEX:${convertFloatToHex(velocity)}` 
		
	const track = new MidiWriter.Track()
	track
		.addCopyright("interface.place")
		.addTrackName("interFACE")
		.setTempo(bpm)
		
	console.log("[MIDIFile] Creating MIDI File", {midiTrack, track} )

	midiTrack.commands.forEach( (command,index)=> {
		//	console.log("[MIDIFile] Adding MIDI Command", {command, index} )
		if (command.type === "channel")
		{
			switch(command.type)
			{
				case COMMAND_NOTE_ON:
					track.addEvent(
						new MidiWriter.NoteOnEvent({
							pitch: [command.noteNumber], 
							duration: '1',
							velocity:command.velocity
						})
					)
					break

				case COMMAND_NOTE_OFF:
					track.addEvent(
						new MidiWriter.NoteOffEvent({
							pitch: [command.noteNumber], 
							duration: '4',
							velocity:command.velocity
						})
					)
					break

				case COMMAND_PROGRAM_CHANGE:
					// Define an instrument
					track.addEvent(
						new MidiWriter.ProgramChangeEvent({
							instrument: command.programNumber 
						})
					)
					break

				case COMMAND_CHANNEL_AFTER_TOUCH: 
				case COMMAND_CHANNEL_PRESSURE:
				case COMMAND_PITCH_BEND:
				case COMMAND_SYSTEM_MESSAGE:
					// TODO:
					break
			}
		}
	})


	/*
	// add our nestup ryhtmn....
	const midiLikeEvents = nestup.onOffEvents(ticks);
	let lastEvent = null;

	let tickCounter = 0
	let noteStartTick = 0

	midiLikeEvents.forEach((event) => {

		if (event.on) {
			noteStartTick = event.time;
		}

		else {
			const duration = event.time - noteStartTick;
			const wait = noteStartTick - tickCounter;

			track.addEvent(new midiWriter.NoteEvent({
				pitch: pitch,
				duration: "T" + duration,
				wait: "T" + wait
			}));

			tickCounter += (wait + duration);
		}
	})
	*/
	return track
}

// Generate a data URI & save as blob
export const saveMIDIFile = (track, output) => {
	const writer = new MidiWriter.Writer(track)
	console.log(writer.dataUri())
	//writer.saveMIDI(output)
}