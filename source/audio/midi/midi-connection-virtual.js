
/**
 * Requires access to node (may have to expose through Electron)
 */
import MIDIConnection from './midi-connection'
import midi from 'midi'

const MIDI_CLOCK_PER_QUARTER_NOTE = 24 	// From MIDI specification:
const MASTER_TEMPO = 40 				// BPM = number of quarter notes per minute
let totalClockPerMinute = MIDI_CLOCK_PER_QUARTER_NOTE * MASTER_TEMPO
let clockCounting = 1

export default class VirtualMIDIConnection extends MIDIConnection{

	output 
	input

	get inputs(){
		return [this.input]
	}
	get outputs(){
		return [this.output]
	}

	constructor(){
		super()
	}

	async connect( port=0, onUpdate=null ){

		const input = new midi.Input()
		const output = new midi.Output()

		// Count the available output ports.
		output.getPortCount()

		// Get the name of a specified output port.
		output.getPortName(0)

		// Open the first available output port.
		output.openPort( port )

		// watch for events and proxy
		this.output = output
		this.input = input

		input.on("clock", e => {
			
		})

		return { status:"Virtual Ports created", inputs:this.inputs, outputs:this.outputs} 
	}
	
	async disconnect(){
		// Close the port when done.
		this.output.closePort()
		this.output = null
	}
}