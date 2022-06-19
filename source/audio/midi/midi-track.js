import { GENERAL_MIDI_INSTRUMENTS } from './general-midi'
import * as MIDICommands from './midi-commands'

export default class MidiTrack
{
	// :MidiHeader
	header

	// :Array<MIDICommands>
	tracks = []
	commands = []
	instruments = []
	noteOnCommands = []

	trackName = ""
	meta = ""
	copyrightNotice = "Copyright held by respective owners"
	lyrics = ""

	trackPosition = 0
	commandPosition = 0
	duration = 0

	mimeType = "audio/mid"

	getMatchingCommands( types=[MIDICommands.COMMAND_NOTE_ON], type="channel" )
	{
		// check if array or string and if string make array
		if (typeof types === String)
		{
			types = [types]
		}
		return this.commands.filter( value => {
			//console.log("getMatchingCommands",value.type === type,value)
			
			if (value.type === type)
			{
				const typePosition = types.indexOf(value.subtype)
				//console.log("typePosition > -1", typePosition > -1, types, value.subType)
				return typePosition > -1
			}else{
				//console.log("getMatchingCommands",value.type,value)
			}
			
			return false
		})
	}

	getNextNoteCommand(){

		const commands = []
		let track = this.tracks[++this.trackPosition]
		while ( track && track.subtype !== MIDICommands.COMMAND_NOTE_ON || track.subtype !== MIDICommands.COMMAND_NOTE_OFF  )
		{
			track = this.tracks[++this.trackPosition]
		}

		while ( track && ( track.subtype === MIDICommands.COMMAND_NOTE_ON || track.subtype === MIDICommands.COMMAND_NOTE_OFF )  )
		{
			commands.push(track)
			track = this.tracks[++this.trackPosition]
		}
		
		return commands
	}

	getNextNoteOnCommand(){

		const commands = []
		let track = this.tracks[++this.trackPosition]
		
		while ( track && track.subtype !== MIDICommands.COMMAND_NOTE_ON )
		{
			track = this.tracks[ ++this.trackPosition ]
		}

		while ( track && track.subtype === MIDICommands.COMMAND_NOTE_ON )
		{
			commands.push(track)
			track = this.tracks[ ++this.trackPosition ]
		}
		
		return commands
	}

	getNextCommands(){
		return this.tracks[ ++this.trackPosition ]
	}

	getNextNoteOnCommand(){
		return this.noteOnCommands[ ++this.commandPosition ]
	}

	getDurationUntilNextCommand(){
		const r = this.tracks[ this.trackPosition + 1 ]
		return r ? r.deltaTime : -1
	}

	/**
	 * If you want all of the events to also be stretchable
	 * we can condense an entire track into 1 second and
	 * move all of the events proportionally so that the 
	 * timings align with whatever you would like to fit it too
	 * @param {MIDICommand} command 
	 */
	convertTimeToFraction( command ){
		return command.time / this.duration
	}

	constructor( header=null, defaultOptions={} )
	{
		if (header) {
			this.header = header
		}
		
		for (let i in defaultOptions){
			this[i] = defaultOptions[i]
		}
	}

	// A way of adding an event and multiple events to track
	addEvent( index, midiCommand )
	{
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
					this.instruments.push( instrumentName )
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
		return `MIDI:Track::${this.tracks.map( track => track.toString() )}`
	}
}