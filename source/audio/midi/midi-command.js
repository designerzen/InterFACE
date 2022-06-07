const convertFloatToHex = float => float.toString(16)

import {convertMIDINoteNumberToName} from '../notes'

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
	velocity

	// pitch value from MIDI is 0 -> 16383
	value

	controllerType
	programNumber
	sequenceNumber

	get noteName(){
		return this.noteNumber ?
			convertMIDINoteNumberToName( this.noteNumber ) :
			"Not a note"
	}

	constructor()
	{

	}

	toString()
	{
		let output = `${this.time}. MIDI:Input::${this.subtype} Type:${this.type}`
		if (this.channel){ output += ` [Channel ${this.channel}] ` }
		if (this.noteNumber){ output += ` Note:${this.noteNumber} -> ${this.noteName}` }
		if (this.velocity){ output += ` Velocity:${this.velocity}` }
		// if (this.noteNumber){ output += ` NoteHEX:${convertFloatToHex(noteNumber)}` }
		// if (this.velocity){ output += ` VelocityHEX:${convertFloatToHex(velocity)}` }
		return output + '\n'
	}
}
