import MIDICommand from "./midi-command"
import * as MIDICommands from "./midi-commands"

/**
 * This returns a handy method that creates audioCommands
 * for the specified midi events. By providing the audioContext
 * we can determine at what times these commands occurred
 * 
 * NB. This is the opposite of doCommand
 * 
 */
export const createMIDICommandFactory = (audioContext, startTime=-0 ) => {
	
	// Midi types

	// MIDICommands.TYPE_CHANNEL
	// MIDICommands.TYPE_META
	// MIDICommands.TYPE_SYSTEM_EXCLUSIVE
	// MIDICommands.TYPE_DIVIDED_SYSTEM_EXCLUSIVE

	// case MIDICommands.COMMAND_CONTROLLER:
	// case MIDICommands.COMMAND_PITCH_BEND:
	// case MIDICommands.COMMAND_PROGRAM_CHANGE:
	// case MIDICommands.COMMAND_CHANNEL_AFTER_TOUCH:

	const createTimedCommand = (type, subtype) => {
		const elapsed = audioContext.currentTime - startTime
		const command = new MIDICommand()
		command.deltaTime = elapsed
		command.type = type
		command.subtype = subtype
		return command
	}

	const noteOn = async ( note, velocity=1 ) => {
		const command = createTimedCommand( MIDICommands.TYPE_CHANNEL, MIDICommands.COMMAND_NOTE_ON )
		command.noteNumber = note
		command.velocity = velocity
		return command
	}

	const noteOff = async (  note, velocity=0 ) => {
		const command = createTimedCommand( MIDICommands.TYPE_CHANNEL, MIDICommands.COMMAND_NOTE_OFF )
		command.noteNumber = note
		command.velocity = velocity
		return command
	}

	const aftertouch = async ( noteNumber, pressure ) => {
		// const command = createTimedCommand( MIDICommands.TYPE_CHANNEL, MIDICommands.COMMAND_CHANNEL_AFTER_TOUCH )
		const command = createTimedCommand( MIDICommands.TYPE_CHANNEL, MIDICommands.COMMAND_NOTE_AFTER_TOUCH )
		command.noteNumber = noteNumber
		command.amount = pressure
		return command
	}

	const pitchBend = (pitch) => {
		const command = createTimedCommand( MIDICommands.TYPE_CHANNEL, MIDICommands.COMMAND_PITCH_BEND )
		command.amount = pitch
		return command
	}
	
	const programChange = async (programNumber) => {
		const command = createTimedCommand( MIDICommands.TYPE_CHANNEL, MIDICommands.COMMAND_PROGRAM_CHANGE )
		command.programNumber = programNumber
		return command
	}
	
	const allSoundOff = () => {
		const command = createTimedCommand( MIDICommands.TYPE_CHANNEL, MIDICommands.COMMAND_NOTE_ON )
		return command
	}
	const allNotesOff = () => {
		const command = createTimedCommand( MIDICommands.TYPE_CHANNEL, MIDICommands.COMMAND_NOTE_OFF )
		return command
	}
	
	return {
		noteOn, noteOff,
		aftertouch, pitchBend,
		programChange,
		allSoundOff,
		allNotesOff
	}
}