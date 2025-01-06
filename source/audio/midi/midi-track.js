/**
 * This is a MIDI Sequence containing all MIDI Commands
 * and a series of super helpful methhods
 */

import AudioTrack from '../audio-track'
import { GENERAL_MIDI_INSTRUMENTS } from './general-midi.constants'
import MIDICommand from './midi-command'
import * as MIDICommands from './midi-commands'

export default class MidiTrack extends AudioTrack
{
	// :MidiHeader
	header
	mimeType = "audio/mid"

	addInstrument(instrumentName){
		// check to see if the instrument has already been added
		if (this.instruments.indexOf(instrumentName) === -1)
		{
			this.instruments.push( instrumentName )	
			return true
		}
		return false
	}

	constructor( header=null, defaultOptions={} )
	{
		super(defaultOptions)
		
		if (header) 
		{
			this.header = header
		}
		
		for (let i in defaultOptions)
		{
			// check to see if they are one of our subclasses...
			switch (i)
			{
				// case "header": 
				// 	this.header = defaultOptions[i]
				// 	break

				case "commands":
				case "noteOnCommands":
					this[i] = defaultOptions[i].map( command => this.copyCommand(command) )
					break

				default:
					// check if is command
					this[i] = defaultOptions[i]
					console.log(i, this[i] )
			}
			
		}
	}


	/**
	 * This will loop through all events and add a new section
	 * that is a factor of total duration
	 */
	addTimePositionPercentage(){

	}

	// A way of adding an event and multiple events to track
	addEvent( index, midiCommand )
	{
		// there are no commands! so add the first and save a pointer to it
		if (!this.firstCommand)
		{
			this.firstCommand = midiCommand
		}

		if (this.finalCommand)
		{
			this.finalCommand.next = midiCommand
			midiCommand.previous = this.finalCommand
		}
		this.finalCommand = midiCommand

		// current previous event
		const currentFinalCommand = this.commands[this.commands.length - 1]
		
		// check to see if there is an pocket already open
		// open a new pocket
		if (midiCommand.type === MIDICommands.TYPE_META)
		{
			switch( midiCommand.subtype )
			{
				case "trackName":
					if (midiCommand.text && midiCommand.text !== "Untitled" )
					{
						this[midiCommand.subtype] = midiCommand.text	
					}
					break
				
				case "text":
				case "copyrightNotice":
				case "lyrics":
					if (midiCommand.text)
					{
						this[midiCommand.subtype] += midiCommand.text	
					}
					break;

				default:
					if (midiCommand.text)
					{
						this.meta += midiCommand.text	
					}
					
			}
		}else{

			// Deal with instrument changes
			switch( midiCommand.subtype )
			{
				case MIDICommands.COMMAND_PROGRAM_CHANGE:
					const instrumentName = GENERAL_MIDI_INSTRUMENTS[midiCommand.programNumber]
					this.addInstrument(instrumentName)
					break
			}

		
			switch( midiCommand.subtype )
			{
				case MIDICommands.COMMAND_NOTE_ON:
				case MIDICommands.COMMAND_NOTE_OFF:
				case MIDICommands.COMMAND_CONTROLLER:
				case MIDICommands.COMMAND_PITCH_BEND:
				case MIDICommands.COMMAND_PROGRAM_CHANGE:
				case MIDICommands.COMMAND_CHANNEL_AFTER_TOUCH:
				default:

					// add multidimnsionally?
					if (!currentFinalCommand)
					{
						// first command!
						//console.log( "Adding command", {currentFinalCommand, midiCommand} )
						this.tracks.push([midiCommand])

					}else{

						if (midiCommand.deltaTime === 0)
						{
							const previousDeltaTime = currentFinalCommand.timeCode
							midiCommand.timeCode = previousDeltaTime
							midiCommand.time = this.duration

							// modify command to contain correct timecode
							const commandsAtLocation = this.tracks[ this.tracks.length - 1 ]
							commandsAtLocation.push(midiCommand)
							
							//console.log( "Appending deltaTime 0", {commandsAtLocation, currentFinalCommand, midiCommand} )
							
						}else{

							// add to duration
							this.duration += midiCommand.deltaTime || 0 

							midiCommand.timeCode = midiCommand.deltaTime
							midiCommand.time = this.duration
							
							//console.log( "Adding", {currentFinalCommand, midiCommand} )
							this.tracks.push([midiCommand])
						}
					}

					this.commands.push(midiCommand)
			}

			switch( midiCommand.subtype )
			{
				case MIDICommands.COMMAND_NOTE_ON:
					this.noteOnCommands.push(midiCommand)
			}

		}
	}
	
	toString()
	{
		return `MIDI:Track::${this.commands.map( track => track.toString() ).join(", ")}`
	}


	commandToJSON( command )
	{
		let output = command
	}

	// To load save midi tracks in a web friendlier way, we can serialise it to JSON
	toJSON()
	{
		const o = this.commands.map( command => command.toJSON() )
		return o // `[${this.tracks.map( track => track.toString() ).join(",")}]`
	}

	/**
	 * Clone the track
	 */
	clone()
	{
		// 
		const track = new MidiTrack( this.header )
		this.commands.forEach( (command, index) => track.addEvent( index, command.clone() ) )
	}

	/**
	 * Reverse a copy of this track
	 */
	reverse()
	{

	}
}