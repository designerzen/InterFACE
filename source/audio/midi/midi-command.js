import AudioCommand from "../audio-command"

/**
 * A single musical command.
 * This can be used to send data to any part of the 
 * musical app as it extends the AudioCommand
 */

export default class MIDICommand extends AudioCommand
{
	deltaTime
	frameRate
	channel

	// type
	// subtype
	// text
	// data

	// timing
	hour
	min
	sec
	frame
	subframe
	microsecondsPerBeat

	// UNOFFICAl: added by our midi decoder
	// this is a ratio of this position / track-duration
	// useful for time-stretching the MIDI track to our own 
	// rate 
	percent

	key
	scale
	numerator
	denominator
	metronome
	thirtyseconds

	amount

	// UNOFFICAl: not an official MIDI spec but we use it in our app
	noteName

	controllerType
	programNumber
	sequenceNumber

	constructor(){
		super()
	}

	toString()
	{
		let output = `${this.time}. MIDI:Input::${this.subtype} Type:${this.type}`
		if (this.channel){ output += ` [Channel ${this.channel}] ` }
		if (this.noteNumber){ output += ` Note:${this.noteNumber} -> ${this.noteName}` }
		if (this.velocity){ output += ` Velocity:${this.velocity}` }
		return output + '\n'
	}

	toJSON()
	{
		const output = {}
		for (const a in this)
		{
			// console.log(a, this)
			// || this.hasOw 
			if( !this[a] ) 
			{
				continue
			}

			switch (a)
			{
				case "next":
				case "previous":
					break

				default:
					output[a] = this[a]
			}
			
		}
		return output
	}
	
	clone(){
		const copy = new MIDICommand()
		for (const i in this)
		{
			copy[i] = this[i]
		}
		return copy
	}
}
