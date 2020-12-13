
import WebMidi, { InputEventNoteon, InputEventNoteoff } from "webmidi"

export const setupMIDI = () => new Promise ( (resolve,reject) => {
	
	WebMidi.enable( (err) => {

		if (err) 
		{
			console.log("WebMidi could not be enabled.", err);
			reject("no MIDI")
			return
		}

		console.log("WebMidi enabled!")
		// I / O change
		console.log(WebMidi.inputs)
		console.log(WebMidi.outputs)


		resolve(WebMidi)
		
		// Display the current time
		//   console.log(WebMidi.time)
		
		// Retrieving an output port/device using its id, name or index
		// midiChannel = WebMidi.getOutputById("123456789")
		// midiChannel = WebMidi.getOutputByName("Axiom Pro 25 Ext Out")
		// midiChannel = WebMidi.outputs[0]

		// if (midiChannel)
		// {
		// 	// Play a note on all channels of the selected output
		// 	midiChannel.playNote("C3");

		// 	// Play a note on channel 3
		// 	midiChannel.playNote("Gb4", 3);

		// 	// Play a chord on all available channels
		// 	midiChannel.playNote(["C3", "D#3", "G3"]);

		// 	// Play a chord on channel 7
		// 	midiChannel.playNote(["C3", "D#3", "G3"], 7);

		// 	// Play a note at full velocity on all channels)
		// 	midiChannel.playNote("F#-1", "all", {velocity: 1});

		// 	// Play a note on channel 16 in 2 seconds (relative time)
		// 	midiChannel.playNote("F5", 16, {time: "+2000"});

		// 	// Play a note on channel 1 at an absolute time in the future
		// 	midiChannel.playNote("F5", 16, {time: WebMidi.time + 3000});

		// 	// Play a note for a duration of 2 seconds (will send a note off message in 2 seconds). Also use
		// 	// a low attack velocity
		// 	midiChannel.playNote("Gb2", 10, {duration: 2000, velocity: 0.25});

		// 	// Stop a playing note on all channels
		// 	midiChannel.stopNote("C-1");

		// 	// Stopping a playing note on channel 11
		// 	midiChannel.stopNote("F3", 11);

		// 	// Stop a playing note on channel 11 and use a high release velocity
		// 	midiChannel.stopNote("G8", 11, {velocity: 0.9});

		// 	// Stopping a playing note in 2.5 seconds
		// 	midiChannel.stopNote("Bb2", 11, {time: "+2500"});

		// 	// Send polyphonic aftertouch message to channel 8
		// 	midiChannel.sendKeyAftertouch("C#3", 8, 0.25);

		// 	// Send pitch bend (between -1 and 1) to channel 12
		// 	midiChannel.sendPitchBend(-1, 12);

		// 	// You can chain most method calls
		// 	midiChannel.playNote("G5", 12)
		// 		.sendPitchBend(-0.5, 12, {time: 400}) // After 400 ms.
		// 		.sendPitchBend(0.5, 12, {time: 800})  // After 800 ms.
		// 		.stopNote("G5", 12, {time: 1200});    // After 1.2 s.

		// }
	})


})