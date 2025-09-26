/**
* A single musical command.
* This can be used to send a command to any part
* of the audio application in order to trigger something
* or change parameters
*/
export default class AudioCommand {

	static counter = 1

	id 

	// for linked lists
	previous
	next

	// UNOFFICAl: Uint8Array
	raw

	time = 0
	timeCode = 0

	// Handy places to store information about this command
	type
	subtype
	text
	data

	// MIDI GM Note number for setting pitch
	noteNumber

	// velocity / amplitude value
	velocity

	// pitch value from MIDI is 0 -> 16383
	value

	constructor() {
		this.id = AudioCommand.counter++
	}

	toString() {
		let output = `#${this.id} = ${this.time}. MIDI:Input::${this.subtype} Type:${this.type}`
		if (this.noteNumber) { output += ` Note:${this.noteNumber}` }
		if (this.velocity) { output += ` Velocity:${this.velocity}` }
		return output + '\n'
	}

	remove(){
		this.previous.next = this.next
		this.next.previous = this.previous
	}

	
	/**
	 * 
	 * @returns copy of this
	 */
	clone(){
		return this.copyAllParametersToCommand( new AudioCommand() )
	}

	copyAllParametersToCommand(command){
		for (let i in this)
		{
			command[i] = this[i]
		}
		return command
	}
}
