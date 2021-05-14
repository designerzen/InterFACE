
// import WebMidi, { InputEventNoteon, InputEventNoteoff } from "webmidi"
import {WebMidi} from "webmidi/dist/webmidi.esm"

// https://mpe.js.org/#Installation
// import mpeInstrument from 'mpe'

// we load in the relevant lib...
let mpeEnabled = false

// TODO: Load lib from local

// Define `instrument` as an instance of `mpeInstrument`
// const instrument = mpeInstrument()

// Request MIDI device access from the Web MIDI API
// navigator.requestMIDIAccess().then(access => {
//   // Iterate over the list of inputs returned
//   access.inputs.forEach(midiInput => {
//     // Send 'midimessage' events to the mpe.js `instrument` instance
//     midiInput.addEventListener(
//       'midimessage',
//       (event) => instrument.processMidiMessage(event.data)
//     )
//   })
// })
export const testForMIDI = () => {
	// check for all potential failure casess...
	if (navigator.requestMIDIAccess === undefined)
	{
		return false
	}
	return true
}

export const setupMIDI = (connectedCallback, disconnectedCallback) => new Promise ( (resolve,reject) => {
	
	WebMidi.enable().then( ports => {

		//console.log("WebMidi enabled!", ports, ports.outputs[0] , WebMidi.outputs[0], WebMidi.outputs[0] === ports.outputs[0] )
		// I / O change
		// console.log(WebMidi.inputs)
		// console.log(WebMidi.outputs)
		WebMidi.addListener("connected", function(e) {
			console.log(e);
			connectedCallback && connectedCallback(e)
		})
		  
		  // Reacting when a device becomes unavailable
		WebMidi.addListener("disconnected", function(e) {
			console.log(e);
			disconnectedCallback && disconnectedCallback()
		})
		
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
	}).catch(error=> reject(error))

})