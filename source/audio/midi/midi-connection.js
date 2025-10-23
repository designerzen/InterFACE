
/**
 * This is an interface way to connect to MIDI devices and to swap
 * out the selected midi device and channels etc
 * 
 * IMPLEMENTS INSTRUMENT CONTROLS
 * 
 */
export default class MIDIConnection{

	connected = false

	get inputs(){
		throw new Error("MIDIConnection.inputs not implemented")
	}

	get outputs(){
		throw new Error("MIDIConnection.outputs not implemented")
	}

	constructor(){}

	/**
	 * Connect and disconnect a MIDI port - 
	 * this usually requires a user interaction
	 * to allow the security model for the interaction
	 */
	async connect( port=0 ){}
	async disconnect(){}

	/**
	 * These are entry points to handle MIDI commands
	 */
	async noteOn( note, velocity ){
		throw new Error("MIDIConnection.noteOn not implemented")
	}
	async noteOff( note, velocity ){
		throw new Error("MIDIConnection.noteOff not implemented")
	}
	async allNotesOff(){}
}