/**
 * connection = new WebMIDIConnection()
 * midi = await connection.connect()
 */
import MIDIConnection from './midi-connection'
// import WebMidi, { InputEventNoteon, InputEventNoteoff } from "webmidi"
import {WebMidi} from "webmidi"

// https://mpe.js.org/#Installation
// import mpeInstrument from 'mpe'
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

// TODO: Load lib from local

/**
 * Check to see if MIDI is available on this platform
 * @returns {Boolean} true if MIDI is available
 */
export const testForWebMIDI = () => navigator.requestMIDIAccess === undefined ? false : true

/**
 * This is an interface way to connect to MIDI devices and to swap
 * out the selected midi device and channels etc
 */
export default class WebMIDIConnection extends MIDIConnection{

	midi 
	midiChannel = "all"
	useMPE = false
	useSysex = false

	get inputs(){
		return WebMidi.inputs
	}
	get outputs(){
		return WebMidi.outputs
	}

	/**
	 * Initialise and connect to MIDI Hardware
	 * @param {Function} connectedCallback - method to call when connected
	 * @param {Function} disconnectedCallback - method to call when disconnected
	 * @returns 
	 */
	constructor( sysex=true, mpe=false )
	{
		super()
		this.useMPE = mpe
		this.useSysex = sysex
	}
	
	/**
	 * TODO: Implement timeout
	 * @param {Number} options 
	 * @param {Function} onDeviceListUpdated 
	 * @returns 
	 */
	async connect( options, onDeviceListUpdated=null ){
		return new Promise(async (resolve,reject)=>{
			try{
				const port = options.port ?? 0
				// midi device connected! huzzah!
				WebMidi.addListener("connected", e => this.onConnected(e, onDeviceListUpdated) )
				
				// Reacting when a device becomes unavailable
				WebMidi.addListener("disconnected", e => this.onDisconnected(e, onDeviceListUpdated)  )
	
				// MIDI access granted andavailable
				WebMidi.addListener("enabled", event => {
					WebMidi.inputs.forEach(input => console.log(input.manufacturer, input.name, input))
					WebMidi.outputs.forEach(output => console.log(output.manufacturer, output.name, output))
					resolve( { status:"MIDI:Connection WebMIDI enabled", event, inputs:WebMidi.inputs, outputs:WebMidi.outputs} )
				} )	

				this.midi = await WebMidi.enable({sysex: this.useSysex })
				
				// Retrieving an output port/device using its id, name or index
				// midiChannel = WebMidi.getOutputById("123456789")
				// midiChannel = WebMidi.getOutputByName("Axiom Pro 25 Ext Out")
				// midiChannel = WebMidi.outputs[0]
				if (isNaN(port))
				{
					this.midiChannel = WebMidi.getOutputById(port)
					// midiChannel = WebMidi.getOutputByName(port)
				}else{
					this.midiChannel = WebMidi.outputs[port]
				}
	
				// Display the current time
				//   console.log(WebMidi.time)
				
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
			}catch(error){
				reject(error)
			}
		})
	}

	async disconnect(){
	
		// midi device connected! huzzah!
		WebMidi.removeListener("connected", this.onConnected )
		
		// Reacting when a device becomes unavailable
		WebMidi.removeListener("disconnected", this.onDisconnected )

		await WebMidi.disable()

		this.midi = null
	}

	
	/**
	 * These are entry points to handle MIDI commands
	 */
	async noteOn( note, velocity ){
		midiChannel.playNote( note, this.midiChannel, {velocity})
	}
	async noteOff( note, velocity ){
		midiChannel.stopNote( note, this.midiChannel, {velocity})
	}

	async allNotesOff(){

	}


	onConnected(event, onDeviceListUpdated=null){
		onDeviceListUpdated && onDeviceListUpdated( event, this.inputs, this.outputs )
	}

	onDisconnected(event, onDeviceListUpdated=null){
		onDeviceListUpdated && onDeviceListUpdated( event, this.inputs, this.outputs )
	}
}