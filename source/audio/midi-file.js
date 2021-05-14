// http://grimmdude.com/MidiWriterJS/
import MidiWriter from 'midi-writer-js'

export const createMIDIFile = (nestup) => {

	// Start with a new track
	const track = new MidiWriter.Track()
	track.addCopyright("interface.place")
	track.addTrackName("interFACE")

	// Define an instrument (optional):
	track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}))

	// Add some notes:
	const note = new MidiWriter.NoteEvent({pitch: ['C4', 'D4', 'E4'], duration: '4'})
	track.addEvent(note)

	// add our nestup ryhtmn....
	const midiLikeEvents = nestup.onOffEvents(ticks);
	let lastEvent = null;

	let tickCounter = 0;
	let noteStartTick = 0;
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
	});

	// Generate a data URI
	const write = new MidiWriter.Writer(track)
	console.log(write.dataUri())
	write.saveMIDI(outfile);//#endregion	
}
