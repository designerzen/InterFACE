export default class MIDICommand
{
	// Uint8Array
	raw

	time = 0
	timeCode = 0

	deltaTime
	frameRate
	channel

	type
	subtype
	text
	data

	hour
	min
	sec
	frame
	subframe
	microsecondsPerBeat

	key
	scale
	numerator
	denominator
	metronome
	thirtyseconds

	amount
	noteNumber
	// not an official MIDI spec but we use it in our app
	noteName
	velocity

	// pitch value from MIDI is 0 -> 16383
	value

	controllerType
	programNumber
	sequenceNumber

	constructor(){
	}

	toString()
	{
		let output = `${this.time}. MIDI:Input::${this.subtype} Type:${this.type}`
		if (this.channel){ output += ` [Channel ${this.channel}] ` }
		if (this.noteNumber){ output += ` Note:${this.noteNumber} -> ${this.noteName}` }
		if (this.velocity){ output += ` Velocity:${this.velocity}` }
		return output + '\n'
	}
}
