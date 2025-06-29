/**
 * This is a silent instrument that simple logs all notes
 * and actions and saves them in AudioCommands for both future
 * playback 
 */

import { createMIDICommandFactory } from '../midi/midi-command-factory'
import MidiTrack from '../midi/midi-track'
import Instrument from './instrument'

export default class RecordInstrument extends Instrument{

	name = "RecordInstrument"
	#title = "Record Instrument"
	type = "recorder"

	factory
	commands

	get tracks(){
		return this.commands
	}

	get recording(){
		return this.commands
	}

	constructor(audioContext, options={}){
		super(audioContext, options)
		this.reset()
		this.factory = createMIDICommandFactory( audioContext, audioContext.currentTime )
		//this.parameterRecorder = new ParamaterRecorder( audioContext )
	}

	async noteOn( note, velocity=1 ){
		const command = this.factory.noteOn( note, velocity )	
		this.commands.push( command )
		return command
	}
	
	async noteOff( note, velocity=1 ){
		const command = this.factory.noteOff( note, velocity )	
		this.commands.push( command )
		return command
	}
	
	async aftertouch( noteNumber, pressure ){
		const command = this.factory.aftertouch.apply( null, arguments )	
		this.commands.push( command )
		return command
	}
	
	pitchBend( pitch ){
		const command = this.factory.pitchbend( pitch )	
		this.commands.push( command )
		return command
	}
	
	// to load a new sample we can also use the midi methods...
	async programChange( programNumber ){
		const command = this.factory.programChange( programNumber )	
		this.commands.push( command )
		return command
	}

	allSoundOff(){
		const command = this.factory.allSoundOff.apply( null, arguments )	
		this.commands.push( command )
		return command
	}

	allNotesOff(){
		const command = this.factory.allNotesOff.apply( null, arguments )	
		this.commands.push( command )
		return command
	}

	getCommandsAsList(){
		return this.commands.map( command => {
			return command.toJSON()
		})
	}

	// Specific to this instrument
	pause(){
		// pause recording...
		this.active = false
	}

	resume(){
		this.active = true
	}

	clear(){
		this.reset()
	}

	reset(){
		this.commands = []
	}
	
	// TODO: Export as MIDI / OD / XM etc
	toMIDITrack(){
		const midiTrack = new MidiTrack()
		this.commands.map( (command, index) => {
			return addEvent( index, command )
		})
		return midiTrack
	}

	
	clone(){
		return new RecordInstrument(this.audioContext, this.options)
	}
}
